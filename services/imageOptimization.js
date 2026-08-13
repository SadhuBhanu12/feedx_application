import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';

export function validateImage(uri) {
  if (!uri) return false;
  const ext = uri.split('.').pop().toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  if (!validExtensions.includes(ext)) {
    throw new Error(`Invalid file type. Only ${validExtensions.join(', ')} are allowed.`);
  }
  return true;
}

export async function compressImage(uri) {
  try {
    
    // Cloudinary target settings
    let compression = 0.8;
    let width = 1080; // Max width for Cloudinary

    let result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width } }],
      { compress: compression, format: ImageManipulator.SaveFormat.JPEG }
    );

    let resultInfo = await FileSystem.getInfoAsync(result.uri);

    // Iteratively compress if still over 1MB
    while (resultInfo.size > 1024 * 1024 && compression > 0.3) {
      compression -= 0.2;
      width = Math.floor(width * 0.8);
      
      result = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width } }],
        { compress: compression, format: ImageManipulator.SaveFormat.JPEG }
      );
      resultInfo = await FileSystem.getInfoAsync(result.uri);
    }

    return result.uri;
  } catch (error) {
    console.error('Image compression failed:', error);
    return uri; 
  }
}
