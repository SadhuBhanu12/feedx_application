import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { Platform } from 'react-native';

/**
 * Pure Supabase Storage Image Uploader.
 * Uploads images directly to Supabase Storage buckets without any Cloudinary dependencies.
 */
export async function uploadImageToSupabaseStorage(
  fileUri: string,
  userId: string = 'guest',
  folder: string = 'uploads',
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!fileUri) return '';

  // If already a remote URL (http/https), return as is
  if (fileUri.startsWith('http://') || fileUri.startsWith('https://')) {
    return fileUri;
  }

  try {
    if (onProgress) onProgress(15);

    const ext = (fileUri.split('.').pop() || 'jpg').split('?')[0].toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${userId}_${timestamp}_${randomStr}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    let base64Data = '';
    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const reader = new FileReader();
      base64Data = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1] || '');
        };
        reader.readAsDataURL(blob);
      });
    } else {
      try {
        base64Data = await FileSystem.readAsStringAsync(fileUri, {
          encoding: 'base64' as any,
        });
      } catch (fsErr) {
        console.warn('[UploadService] FileSystem read error, falling back to fetch blob:', fsErr);
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const reader = new FileReader();
        base64Data = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const res = reader.result as string;
            resolve(res.split(',')[1] || '');
          };
          reader.readAsDataURL(blob);
        });
      }
    }

    if (!base64Data) {
      throw new Error('Failed to read image content from device storage.');
    }

    if (onProgress) onProgress(40);
    const arrayBuffer = decode(base64Data);

    const candidateBuckets = Array.from(new Set([
      folder.includes('community') ? 'community-images1' : 'uploads',
      'support-attachments',
      'uploads',
      'community-images1',
      'profile-photos',
      'public'
    ]));

    for (const bucket of candidateBuckets) {
      try {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, arrayBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!error) {
          if (onProgress) onProgress(100);
          const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
          if (data?.publicUrl) {
            return data.publicUrl;
          }
        }
      } catch (bucketErr) {
        // Try next candidate bucket
      }
    }

    // Safe inline fallback if no remote storage buckets are provisioned
    if (onProgress) onProgress(100);
    return `data:${mimeType};base64,${base64Data}`;
  } catch (error: any) {
    console.warn('[UploadToSupabase] Non-fatal image upload notice:', error.message || error);
    return '';
  }
}
