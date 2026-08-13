import { supabase } from '@/lib/supabase';
import { BaseRepository } from './BaseRepository';
import { AppError } from '@/utils/errors';
import { uploadToCloudinary } from '@/services/cloudinaryService';
import { compressImage, validateImage } from '@/services/imageOptimization';

export interface CreatePostPayload {
  title?: string | null;
  caption: string;
  image_uri?: string | null;
  created_by: string;
  status?: string;
  visibility?: string;
}

export class CommunityRepository extends BaseRepository {
  /**
   * Safely delete a file from Cloudinary/Supabase.
   * This is a fire-and-forget cleanup method.
   */
  public static async rollbackImageUpload(fileUrl: string) {
    if (!fileUrl) return;
    try {
      // Cloudinary images have their own rollback endpoint or use Supabase edge function
      // For now, we call the existing delete edge function/logic
      await supabase.functions.invoke('delete-community-image', {
        body: { file_url: fileUrl },
      });
      console.log(`[Rollback] Orphaned image ${fileUrl} cleaned up successfully.`);
    } catch (e) {
      console.warn(`[Rollback] Failed to cleanup orphaned image ${fileUrl}:`, e);
    }
  }

  /**
   * Extremely strict, atomic post creation pipeline.
   * Supports cancellation via AbortSignal.
   */
  public static async createPostAtomic(
    payload: CreatePostPayload,
    signal?: AbortSignal,
    onProgress?: (progress: number) => void
  ) {
    let uploadedUrl: string | null = null;

    try {
      // 1. Validation Phase
      if (!payload.caption?.trim() && !payload.image_uri) {
        throw new AppError('Caption or image is required.', 'VALIDATION_ERROR', 400);
      }

      if (signal?.aborted) throw new AppError('Upload cancelled by user.', 'CANCELLED', 499);

      // 2. Image Pipeline Phase
      if (payload.image_uri) {
        // Strict Validation
        validateImage(payload.image_uri);
        if (onProgress) onProgress(10);
        
        if (signal?.aborted) throw new AppError('Upload cancelled by user.', 'CANCELLED', 499);

        // Compression
        const compressedUri = await this.withTimeout(async () => compressImage(payload.image_uri!), 10000);
        if (onProgress) onProgress(20);

        if (signal?.aborted) throw new AppError('Upload cancelled by user.', 'CANCELLED', 499);

        // Cloudinary Upload (passing AbortSignal)
        uploadedUrl = await uploadToCloudinary(compressedUri, payload.created_by, (prog: number) => {
           if (onProgress) onProgress(20 + (prog * 0.7)); // Scale 0-100 to 20-90
        }, signal);

        if (!uploadedUrl) {
          throw new AppError('Image upload succeeded but returned an empty URL.', 'STORAGE_ERROR', 500);
        }
      }

      if (signal?.aborted) throw new AppError('Upload cancelled by user.', 'CANCELLED', 499);
      if (onProgress) onProgress(90);

      // 3. Database Insertion Phase
      const dbPayload = {
        title: payload.title?.trim() || null,
        caption: payload.caption.trim(),
        image_url: uploadedUrl,
        created_by: payload.created_by,
        status: payload.status || 'active',
        visibility: payload.visibility || 'public'
      };

      const result = await this.execute(async (signal) => {
        return supabase.from('community_posts').insert(dbPayload).select('id').abortSignal(signal as any).single();
      }, 'Insert Community Post', { retries: 0 }); // Retries on inserts are dangerous (duplicate posts)

      if (onProgress) onProgress(100);
      return result;

    } catch (err: any) {
      // 4. Rollback Phase
      if (uploadedUrl && err.code !== 'CANCELLED') {
        // If DB failed, we MUST clean up the uploaded image to prevent orphan files
        await this.rollbackImageUpload(uploadedUrl);
      }
      throw err; // Bubble up strict error
    }
  }
}
