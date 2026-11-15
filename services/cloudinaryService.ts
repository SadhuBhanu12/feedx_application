import { uploadImageToSupabaseStorage } from './uploadService';

/**
 * Legacy Cloudinary wrapper redirected to Supabase Storage.
 * Completely eliminates Cloudinary dependency across the entire app.
 */
export async function uploadToCloudinary(
  fileUri: string,
  userId: string = 'guest',
  onProgress?: (progress: number) => void,
  signal?: any
): Promise<string> {
  if (signal?.aborted) {
    const err = new Error('Upload cancelled by user.');
    (err as any).code = 'CANCELLED';
    throw err;
  }

  return await uploadImageToSupabaseStorage(fileUri, userId, 'uploads', onProgress);
}
