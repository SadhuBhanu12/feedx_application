// @ts-nocheck
import * as FileSystem from 'expo-file-system';

// NOTE: These should be provided in your .env
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';

export async function uploadToCloudinary(fileUri, userId, onProgress, signal) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist for upload.');
    }

    if (signal?.aborted) {
      const err = new Error('Upload cancelled by user.');
      err.code = 'CANCELLED';
      throw err;
    }

    if (onProgress) onProgress(10); // Start

    const ext = fileUri.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${userId}_${timestamp}_${randomStr}.${ext}`;

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      name: fileName,
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    if (onProgress) onProgress(30);

    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempts < maxAttempts) {
      try {
        if (signal?.aborted) {
          const err = new Error('Upload cancelled by user.');
          err.code = 'CANCELLED';
          throw err;
        }
        
        attempts++;
        if (onProgress) onProgress(30 + (attempts * 20)); // Up to 90%

        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
        
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
          signal: signal
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Cloudinary Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        if (onProgress) onProgress(100);
        
        // Return secure URL and attach dynamic optimization params immediately
        // Cloudinary format: https://res.cloudinary.com/<cloud>/image/upload/<transformations>/<version>/<public_id>
        // Data returns secure_url: https://res.cloudinary.com/.../image/upload/v1234567/sample.jpg
        const rawUrl = data.secure_url;
        
        // Append q_auto,f_auto for automatic optimization and format delivery
        const parts = rawUrl.split('/upload/');
        if (parts.length === 2) {
            return `${parts[0]}/upload/q_auto,f_auto/${parts[1]}`;
        }

        return rawUrl;
      } catch (err) {
        lastError = err;
        // If it was cancelled manually, bubble it up without retrying
        if (err.name === 'AbortError' || err.code === 'CANCELLED') {
          const cancelErr = new Error('Upload cancelled by user.');
          cancelErr.code = 'CANCELLED';
          throw cancelErr;
        }

        console.warn(`[Cloudinary Upload] Attempt ${attempts} failed:`, err.message);
        if (attempts >= maxAttempts) break;
        // Exponential backoff
        await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempts)));
      }
    }

    throw lastError || new Error('Upload failed after retries.');
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
}
