/**
 * FEEDX Community Unified Media Resolver
 * End-to-end media type detection, Google Drive streaming resolver,
 * and Instagram-style media asset pipeline.
 */

export interface ResolvedCommunityMedia {
  type: 'image' | 'video' | 'poll' | 'text' | 'none';
  displayUrl: string;
  streamUrl: string;
  thumbnailUrl: string;
  fallbackUrls: string[];
  webPreviewUrl: string;
  fileId: string | null;
  mimeType: string;
  playable: boolean;
  isDrive: boolean;
  isYouTube: boolean;
  isVimeo: boolean;
  mediaUrls: string[];
  rawUrl: string;
}

const SUPABASE_STORAGE_URL = 'https://ktontqbfcinzqvalxyqd.supabase.co/storage/v1/object/public';

/**
 * Extracts Google Drive File ID from any shareable URL format.
 */
export function extractDriveFileId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  let cleanUrl = url.trim();

  try {
    cleanUrl = decodeURIComponent(cleanUrl);
  } catch (_) {}

  // Direct raw file ID (25-45 alphanumeric chars with _ or -)
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  // /file/d/FILE_ID or /d/FILE_ID or /file/u/0/d/FILE_ID
  const dPattern = /\/(?:file\/)?(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]{15,})/;
  const matchD = cleanUrl.match(dPattern);
  if (matchD && matchD[1] && matchD[1] !== 'file') return matchD[1];

  // id=FILE_ID or ?id=FILE_ID or &id=FILE_ID
  const idPattern = /[?&]id=([a-zA-Z0-9_-]{15,})/;
  const matchId = cleanUrl.match(idPattern);
  if (matchId && matchId[1]) return matchId[1];

  // googleusercontent.com/d/FILE_ID or /u/0/d/FILE_ID
  const lh3Pattern = /googleusercontent\.com(?:\/u\/\d+)?\/d\/([a-zA-Z0-9_-]{15,})/;
  const matchLh3 = cleanUrl.match(lh3Pattern);
  if (matchLh3 && matchLh3[1]) return matchLh3[1];

  // Fallback pattern inside Google URLs
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('googleusercontent.com')) {
    const generalMatch = cleanUrl.match(/([a-zA-Z0-9_-]{25,45})/);
    if (generalMatch && generalMatch[1]) {
      return generalMatch[1];
    }
  }

  return null;
}

/**
 * Extracts YouTube Video ID from any standard or short URL.
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Extracts Vimeo Video ID from any standard URL.
 */
export function extractVimeoId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:vimeo\.com\/(?:video\/)?)(\d+)/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Detects if a given candidate URL or metadata represents a video.
 */
export function isVideoFormat(url?: string | null, mimeType?: string | null): boolean {
  if (mimeType && typeof mimeType === 'string') {
    if (mimeType.toLowerCase().startsWith('video/')) return true;
    if (mimeType.toLowerCase().startsWith('image/')) return false;
  }

  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase().trim();

  // Video extensions
  if (
    lower.endsWith('.mp4') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.m4v') ||
    lower.endsWith('.mkv') ||
    lower.endsWith('.avi') ||
    lower.endsWith('.3gp') ||
    lower.includes('.mp4?') ||
    lower.includes('.mov?') ||
    lower.includes('.webm?')
  ) {
    return true;
  }

  // Video hosting platforms
  if (
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('vimeo.com') ||
    lower.includes('dailymotion.com')
  ) {
    return true;
  }

  return false;
}

/**
 * Universal Community Media Resolver
 * Accepts either a post object, a single media URL string, or a media attachment object.
 */
export function resolveCommunityMedia(input: any): ResolvedCommunityMedia {
  if (!input) {
    return {
      type: 'none',
      displayUrl: '',
      streamUrl: '',
      thumbnailUrl: '',
      fallbackUrls: [],
      webPreviewUrl: '',
      fileId: null,
      mimeType: '',
      playable: false,
      isDrive: false,
      isYouTube: false,
      isVimeo: false,
      mediaUrls: [],
      rawUrl: '',
    };
  }

  // Handle simple string input
  if (typeof input === 'string') {
    return resolveSingleMediaUrl(input);
  }

  // Check if it's a poll post
  if (input.post_type === 'poll' || input.type === 'poll' || input.poll) {
    return {
      type: 'poll',
      displayUrl: '',
      streamUrl: '',
      thumbnailUrl: '',
      fallbackUrls: [],
      webPreviewUrl: '',
      fileId: null,
      mimeType: '',
      playable: false,
      isDrive: false,
      isYouTube: false,
      isVimeo: false,
      mediaUrls: [],
      rawUrl: '',
    };
  }

  // Gather candidate URLs in priority order with strict deduplication
  const postType = (input.post_type || input.type || '').toLowerCase();
  const explicitVideoUrl = input.video_url || null;
  const driveUrl = input.drive_url || null;
  const imageUrl = input.image_url || input.media_url || null;
  const mimeType = input.media_mime_type || input.mime_type || null;

  const isVideoByMime = Boolean(mimeType && typeof mimeType === 'string' && mimeType.toLowerCase().startsWith('video/'));
  const isImageByMime = Boolean(mimeType && typeof mimeType === 'string' && mimeType.toLowerCase().startsWith('image/'));

  // Video post detection:
  // ONLY classify as video when:
  // 1. post_type is explicitly 'video'
  // 2. An explicit video_url is provided
  // 3. Mime-type explicitly starts with 'video/'
  // 4. Any media candidate URL has an explicit video format (e.g. .mp4, youtube, vimeo)
  const isExplicitVideo =
    postType === 'video' ||
    Boolean(explicitVideoUrl) ||
    isVideoByMime ||
    (!isImageByMime && postType !== 'image' && (
      isVideoFormat(driveUrl, mimeType) ||
      isVideoFormat(imageUrl, mimeType) ||
      (Array.isArray(input.media_urls) && input.media_urls.some((u: string) => isVideoFormat(u, mimeType))) ||
      (Array.isArray(input.images) && input.images.some((u: string) => isVideoFormat(u, mimeType))) ||
      (Array.isArray(input.attachments) && input.attachments.some((u: string) => isVideoFormat(u, mimeType)))
    ));

  // If this is a video post, the video source MUST be the videoUrl or driveUrl or imageUrl
  if (isExplicitVideo) {
    const videoSourceUrl =
      explicitVideoUrl ||
      (isVideoFormat(driveUrl, mimeType) ? driveUrl : null) ||
      (isVideoFormat(imageUrl, mimeType) ? imageUrl : null) ||
      (Array.isArray(input.media_urls) && input.media_urls.find((u: string) => isVideoFormat(u, mimeType))) ||
      (postType === 'video' ? (driveUrl || imageUrl) : null) ||
      '';
    if (videoSourceUrl) {
      const videoResult = resolveSingleMediaUrl(videoSourceUrl, 'video', mimeType);
      const thumbnail = imageUrl && !isVideoFormat(imageUrl, mimeType) ? imageUrl : videoResult.thumbnailUrl;
      return {
        ...videoResult,
        type: 'video',
        thumbnailUrl: thumbnail,
        playable: true,
        mediaUrls: [thumbnail || videoResult.displayUrl || videoSourceUrl],
      };
    }
  }

  // Prioritize explicit multi-image arrays; if not present, use the single image/drive URL
  const arraySources: string[] = (
    Array.isArray(input.media_urls) && input.media_urls.length > 0
      ? input.media_urls
      : Array.isArray(input.images) && input.images.length > 0
      ? input.images
      : Array.isArray(input.attachments) && input.attachments.length > 0
      ? input.attachments
      : [imageUrl, driveUrl].filter(Boolean)
  ).filter((u: any): u is string => typeof u === 'string' && u.trim().length > 0);

  // Deduplicate URLs and File IDs so a single image is never repeated multiple times
  const seenFileIds = new Set<string>();
  const seenUrls = new Set<string>();
  const candidateUrls: string[] = [];

  for (const raw of arraySources) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const fileId = extractDriveFileId(trimmed);
    if (fileId) {
      if (seenFileIds.has(fileId)) continue;
      seenFileIds.add(fileId);
      candidateUrls.push(trimmed);
    } else {
      if (seenUrls.has(trimmed)) continue;
      seenUrls.add(trimmed);
      candidateUrls.push(trimmed);
    }
  }

  const primaryUrl = candidateUrls[0] || (typeof input.image_url === 'string' ? input.image_url.trim() : '');

  // Check if primary or any candidate is a video
  const hasVideoCandidate = isExplicitVideo || candidateUrls.some((u) => isVideoFormat(u, mimeType));

  if (hasVideoCandidate && primaryUrl) {
    const videoResult = resolveSingleMediaUrl(primaryUrl, 'video', input.media_mime_type || input.mime_type);
    return {
      ...videoResult,
      type: 'video',
      playable: true,
      mediaUrls: [videoResult.displayUrl || videoResult.thumbnailUrl || primaryUrl],
    };
  }

  // Image Gallery / Photo Post
  if (candidateUrls.length > 0) {
    const resolvedImageList = candidateUrls.map((u) => resolveSingleMediaUrl(u, 'image'));
    const primaryImage = resolvedImageList[0];

    const allImageUrls = Array.from(
      new Set(
        resolvedImageList
          .map((r) => r.displayUrl)
          .filter((u) => Boolean(u) && !u.includes('.mp4') && !u.includes('youtube.com'))
      )
    );

    return {
      type: allImageUrls.length > 0 ? 'image' : 'text',
      displayUrl: primaryImage?.displayUrl || '',
      streamUrl: '',
      thumbnailUrl: primaryImage?.thumbnailUrl || '',
      fallbackUrls: primaryImage?.fallbackUrls || [],
      webPreviewUrl: primaryImage?.webPreviewUrl || '',
      fileId: primaryImage?.fileId || null,
      mimeType: input.media_mime_type || 'image/jpeg',
      playable: false,
      isDrive: primaryImage?.isDrive || false,
      isYouTube: false,
      isVimeo: false,
      mediaUrls: allImageUrls.length > 0 ? allImageUrls : (primaryImage?.displayUrl ? [primaryImage.displayUrl] : []),
      rawUrl: primaryUrl,
    };
  }

  // Text-only post
  return {
    type: 'text',
    displayUrl: '',
    streamUrl: '',
    thumbnailUrl: '',
    fallbackUrls: [],
    webPreviewUrl: '',
    fileId: null,
    mimeType: '',
    playable: false,
    isDrive: false,
    isYouTube: false,
    isVimeo: false,
    mediaUrls: [],
    rawUrl: '',
  };
}

/**
 * Resolves a single media URL with proper Google Drive and streaming endpoints.
 */
export function resolveSingleMediaUrl(
  url: string,
  forcedType?: 'image' | 'video',
  mimeType?: string
): ResolvedCommunityMedia {
  if (!url || typeof url !== 'string') {
    return {
      type: 'none',
      displayUrl: '',
      streamUrl: '',
      thumbnailUrl: '',
      fallbackUrls: [],
      webPreviewUrl: '',
      fileId: null,
      mimeType: '',
      playable: false,
      isDrive: false,
      isYouTube: false,
      isVimeo: false,
      mediaUrls: [],
      rawUrl: '',
    };
  }

  let cleanUrl = url.trim();
  if (cleanUrl.startsWith('http://')) {
    cleanUrl = `https://${cleanUrl.slice(7)}`;
  } else if (
    !cleanUrl.startsWith('https://') &&
    !cleanUrl.startsWith('community-images1/') &&
    !cleanUrl.startsWith('community-images/') &&
    !cleanUrl.startsWith('uploads/') &&
    !cleanUrl.startsWith('avatars/') &&
    !cleanUrl.startsWith('banners/') &&
    !cleanUrl.startsWith('resources/') &&
    !cleanUrl.startsWith('support-attachments/')
  ) {
    if (/^[a-zA-Z0-9_\-./]+\.(jpe?g|png|webp|gif|svg)$/i.test(cleanUrl)) {
      cleanUrl = `community-images1/${cleanUrl}`;
    } else {
      cleanUrl = `https://${cleanUrl}`;
    }
  }

  // Check Supabase relative storage path
  if (
    cleanUrl.startsWith('community-images1/') ||
    cleanUrl.startsWith('community-images/') ||
    cleanUrl.startsWith('uploads/') ||
    cleanUrl.startsWith('avatars/') ||
    cleanUrl.startsWith('banners/') ||
    cleanUrl.startsWith('resources/') ||
    cleanUrl.startsWith('support-attachments/')
  ) {
    const fullUrl = `${SUPABASE_STORAGE_URL}/${cleanUrl}`;
    const isVideo = forcedType === 'video' || isVideoFormat(fullUrl, mimeType);
    return {
      type: isVideo ? 'video' : 'image',
      displayUrl: fullUrl,
      streamUrl: isVideo ? fullUrl : '',
      thumbnailUrl: fullUrl,
      fallbackUrls: [fullUrl],
      webPreviewUrl: fullUrl,
      fileId: null,
      mimeType: mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
      playable: isVideo,
      isDrive: false,
      isYouTube: false,
      isVimeo: false,
      mediaUrls: [fullUrl],
      rawUrl: url,
    };
  }

  // Check YouTube
  const ytId = extractYouTubeId(cleanUrl);
  if (ytId) {
    const thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    return {
      type: 'video',
      displayUrl: thumb,
      streamUrl: cleanUrl,
      thumbnailUrl: thumb,
      fallbackUrls: [
        `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${ytId}/0.jpg`,
      ],
      webPreviewUrl: `https://www.youtube.com/watch?v=${ytId}`,
      fileId: ytId,
      mimeType: 'video/youtube',
      playable: true,
      isDrive: false,
      isYouTube: true,
      isVimeo: false,
      mediaUrls: [thumb],
      rawUrl: url,
    };
  }

  // Check Vimeo
  const vimeoId = extractVimeoId(cleanUrl);
  if (vimeoId) {
    return {
      type: 'video',
      displayUrl: '',
      streamUrl: cleanUrl,
      thumbnailUrl: '',
      fallbackUrls: [],
      webPreviewUrl: `https://vimeo.com/${vimeoId}`,
      fileId: vimeoId,
      mimeType: 'video/vimeo',
      playable: true,
      isDrive: false,
      isYouTube: false,
      isVimeo: true,
      mediaUrls: [],
      rawUrl: url,
    };
  }

  // Check Google Drive
  const driveFileId = extractDriveFileId(cleanUrl);
  if (driveFileId) {
    const isVideo = forcedType === 'video' || isVideoFormat(cleanUrl, mimeType);
    const driveThumbnail = `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w800`;
    const driveDirectCdn = `https://drive.usercontent.google.com/download?id=${driveFileId}&export=download&authuser=0&confirm=t`;
    const driveDirectDownload = `https://drive.google.com/uc?export=download&id=${driveFileId}&confirm=t`;
    const driveDirectView = `https://drive.google.com/uc?export=view&id=${driveFileId}`;
    const driveLh3 = `https://lh3.googleusercontent.com/d/${driveFileId}=w600`;
    const drivePreview = `https://drive.google.com/file/d/${driveFileId}/preview`;

    if (isVideo) {
      return {
        type: 'video',
        displayUrl: driveThumbnail,
        streamUrl: driveDirectCdn,
        thumbnailUrl: driveThumbnail,
        fallbackUrls: [driveDirectCdn, driveDirectDownload, driveDirectView],
        webPreviewUrl: drivePreview,
        fileId: driveFileId,
        mimeType: mimeType || 'video/mp4',
        playable: true,
        isDrive: true,
        isYouTube: false,
        isVimeo: false,
        mediaUrls: [driveThumbnail],
        rawUrl: url,
      };
    } else {
      return {
        type: 'image',
        displayUrl: driveLh3,
        streamUrl: '',
        thumbnailUrl: driveLh3,
        fallbackUrls: [
          driveThumbnail,
          `https://lh3.googleusercontent.com/d/${driveFileId}=s800`,
          `https://lh3.googleusercontent.com/d/${driveFileId}`,
          driveDirectView,
          driveDirectDownload,
        ],
        webPreviewUrl: drivePreview,
        fileId: driveFileId,
        mimeType: mimeType || 'image/jpeg',
        playable: false,
        isDrive: true,
        isYouTube: false,
        isVimeo: false,
        mediaUrls: [driveLh3],
        rawUrl: url,
      };
    }
  }

  // General Direct HTTP(S) URL (CDN, Cloudinary, AWS S3, etc.)
  const isVideo = forcedType === 'video' || isVideoFormat(cleanUrl, mimeType);
  return {
    type: isVideo ? 'video' : 'image',
    displayUrl: cleanUrl,
    streamUrl: isVideo ? cleanUrl : '',
    thumbnailUrl: isVideo ? '' : cleanUrl,
    fallbackUrls: [cleanUrl],
    webPreviewUrl: cleanUrl,
    fileId: null,
    mimeType: mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
    playable: isVideo,
    isDrive: false,
    isYouTube: false,
    isVimeo: false,
    mediaUrls: [cleanUrl],
    rawUrl: url,
  };
}
