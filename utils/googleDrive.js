/**
 * Google Drive & Community Media Processing Utility for FEEDX
 */

import {
  extractDriveFileId as resolverExtractDriveFileId,
  extractYouTubeId as resolverExtractYouTubeId,
  extractVimeoId as resolverExtractVimeoId,
  isVideoFormat as resolverIsVideoFormat,
  resolveCommunityMedia as resolverResolveCommunityMedia,
  resolveSingleMediaUrl as resolverResolveSingleMediaUrl,
} from './mediaResolver';

export const extractDriveFileId = resolverExtractDriveFileId;
export const extractYouTubeId = resolverExtractYouTubeId;
export const extractVimeoId = resolverExtractVimeoId;
export const isVideoFormat = resolverIsVideoFormat;
export const resolveCommunityMedia = resolverResolveCommunityMedia;
export const resolveSingleMediaUrl = resolverResolveSingleMediaUrl;

const SUPABASE_STORAGE_URL = 'https://ktontqbfcinzqvalxyqd.supabase.co/storage/v1/object/public';

/**
 * Resolves any image or media URL (Supabase, CDN, or Google Drive) into a direct display URL.
 */
export function resolveMediaUrl(url, defaultBucket = 'community-images1') {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();

  // If already a full HTTP(S) URL
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    const fileId = extractDriveFileId(cleanUrl);
    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}=w600`;
    }
    return cleanUrl;
  }

  // If it's a relative Supabase storage path with recognized bucket
  if (
    cleanUrl.startsWith('community-images1/') ||
    cleanUrl.startsWith('community-images/') ||
    cleanUrl.startsWith('uploads/') ||
    cleanUrl.startsWith('avatars/') ||
    cleanUrl.startsWith('banners/') ||
    cleanUrl.startsWith('resources/') ||
    cleanUrl.startsWith('support-attachments/')
  ) {
    return `${SUPABASE_STORAGE_URL}/${cleanUrl}`;
  }

  if (cleanUrl.length > 3) {
    return `${SUPABASE_STORAGE_URL}/${defaultBucket}/${cleanUrl}`;
  }

  return cleanUrl;
}

/**
 * Converts a Google Drive share URL into a direct display image URL.
 */
export function convertDriveUrlToImageUrl(driveUrl) {
  if (!driveUrl || typeof driveUrl !== 'string') return '';
  return resolveMediaUrl(driveUrl);
}

/**
 * Converts a Google Drive share URL into a direct downloadable byte-stream URL for video players.
 */
export function convertDriveUrlToStreamUrl(driveUrl) {
  if (!driveUrl || typeof driveUrl !== 'string') return '';
  const fileId = extractDriveFileId(driveUrl);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
  }
  return driveUrl;
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
      `https://lh3.googleusercontent.com/d/${fileId}=w800`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
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

export function getDriveDirectDownloadUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();
  const fileId = extractDriveFileId(cleanUrl);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=s2000`;
  }
  return cleanUrl;
}
