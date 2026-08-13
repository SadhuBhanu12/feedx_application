/**
 * Google Drive Image Processing & Validation Utility for FEEDX
 */

/**
 * Extracts Google Drive File ID from various shareable URL formats.
 */
export function extractDriveFileId(url) {
  if (!url || typeof url !== 'string') return null;
  let cleanUrl = url.trim();

  try {
    cleanUrl = decodeURIComponent(cleanUrl);
  } catch (e) {}

  // Pattern 0: Direct raw file ID (20+ chars alphanumeric with _ or -)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  // Pattern 1: /d/FILE_ID or /file/d/FILE_ID or /file/u/0/d/FILE_ID
  const dPattern = /\/d\/([a-zA-Z0-9_-]{15,})/;
  const matchD = cleanUrl.match(dPattern);
  if (matchD && matchD[1] && matchD[1] !== 'file') return matchD[1];

  // Pattern 2: id=FILE_ID or &id=FILE_ID
  const idPattern = /[?&]id=([a-zA-Z0-9_-]{15,})/;
  const matchId = cleanUrl.match(idPattern);
  if (matchId && matchId[1]) return matchId[1];

  // Pattern 3: googleusercontent.com/d/FILE_ID or /u/0/d/FILE_ID
  const lh3Pattern = /googleusercontent\.com(?:\/u\/\d+)?\/d\/([a-zA-Z0-9_-]{15,})/;
  const matchLh3 = cleanUrl.match(lh3Pattern);
  if (matchLh3 && matchLh3[1]) return matchLh3[1];

  // Pattern 4: Fallback 25-45 char ID inside Google URLs
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('googleusercontent.com')) {
    const generalMatch = cleanUrl.match(/([a-zA-Z0-9_-]{25,45})/);
    if (generalMatch && generalMatch[1]) {
      return generalMatch[1];
    }
  }

  return null;
}

/**
 * Converts a Google Drive share URL into a direct display image URL.
 */
export function convertDriveUrlToImageUrl(driveUrl) {
  if (!driveUrl || typeof driveUrl !== 'string') return '';
  const cleanUrl = driveUrl.trim();
  const fileId = extractDriveFileId(cleanUrl);
  if (fileId) {
    // Ultra-fast Google Global Edge CDN (serves WebP images in under 50ms!)
    return `https://lh3.googleusercontent.com/d/${fileId}=s1000`;
  }
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  return '';
}

/**
 * Returns alternative fallback Google Drive image URLs
 */
export function getDriveImageFallbackUrls(driveUrl) {
  if (!driveUrl || typeof driveUrl !== 'string') return [];
  const cleanUrl = driveUrl.trim();
  const fileId = extractDriveFileId(cleanUrl);
  if (fileId) {
    return [
      `https://lh3.googleusercontent.com/d/${fileId}=s1000`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://lh3.googleusercontent.com/d/${fileId}`,
      `https://drive.google.com/uc?id=${fileId}`,
    ];
  }
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return [cleanUrl];
  }
  return [];
}

/**
 * Validates whether a given URL is a valid Google Drive image link.
 */
export function isValidDriveUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;

  const fileId = extractDriveFileId(trimmed);
  if (fileId) return true;

  const isGeneralImage = /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(trimmed);
  return isGeneralImage;
}

/**
 * Converts a Google Drive share URL into a direct PDF preview link using Google Docs Viewer
 */
export function convertDriveUrlToPdfViewerUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();
  const fileId = extractDriveFileId(cleanUrl);

  if (fileId) {
    // Directly embedded preview URL - bypasses account selector and renders instantly in webview/browser
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  if (cleanUrl.includes('/view')) {
    return cleanUrl.replace('/view', '/preview');
  }

  return cleanUrl;
}

export function sanitizeUrl(url) {
  if (!url) return '';
  const cleanUrl = url.trim();
  const fileId = extractDriveFileId(cleanUrl);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  if (cleanUrl.includes('/view')) {
    return cleanUrl.replace('/view', '/preview');
  }
  return cleanUrl;
}
