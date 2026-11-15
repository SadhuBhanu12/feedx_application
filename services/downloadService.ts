import { Platform, Linking, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { getDriveDirectDownloadUrl } from '@/utils/googleDrive';
import { supabase } from '@/lib/supabase';

/**
 * Logs a file or resource download event to activity_logs table in Supabase.
 */
export async function logDownloadEvent(filename?: string, url?: string, title?: string): Promise<void> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    await supabase.from('activity_logs').insert({
      action: 'download',
      target_table: 'resources',
      details: {
        filename: filename || 'unknown',
        url: url || '',
        title: title || 'Resource',
        user_id: authData?.user?.id || null,
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (e) {
    // Non-blocking telemetry
  }
}

/**
 * Downloads or opens a file/image safely across platforms (Web, iOS, Android)
 * with direct PNG format enforcement for images and Expo SDK 54 compatibility.
 */
export async function downloadOrOpenFile(
  rawUrl: string,
  suggestedFilename?: string,
  title = 'Image (PNG)'
): Promise<boolean> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    Alert.alert('Download Error', 'Invalid file download URL.');
    return false;
  }

  // Resolve Google Drive URL if applicable
  const targetUrl = getDriveDirectDownloadUrl(rawUrl) || rawUrl;

  // Ensure clean .png extension if it's an image
  let cleanName = suggestedFilename || targetUrl.split('/').pop()?.split('?')[0] || `feedx_download_${Date.now()}`;
  if (!cleanName.includes('.')) {
    cleanName = `${cleanName}.png`;
  } else if (!cleanName.toLowerCase().endsWith('.pdf') && !cleanName.toLowerCase().endsWith('.png')) {
    cleanName = cleanName.replace(/\.[^/.]+$/, '.png');
  }

  // Record download activity for platform analytics
  logDownloadEvent(cleanName, targetUrl, title);

  // 1. Web Platform (Forces direct .png download in browser)
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined') {
        const link = document.createElement('a');
        link.href = targetUrl;
        link.download = cleanName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      }
    } catch {
      Linking.openURL(targetUrl).catch(() => {});
      return true;
    }
  }

  // 2. Native Mobile Platform
  try {
    let FileSystem: any = null;
    try {
      FileSystem = require('expo-file-system/legacy');
    } catch {
      try {
        FileSystem = require('expo-file-system');
      } catch {}
    }

    if (FileSystem && FileSystem.downloadAsync && (FileSystem.documentDirectory || FileSystem.cacheDirectory)) {
      const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
      const targetUri = `${baseDir}${cleanName}`;

      const res = await FileSystem.downloadAsync(targetUrl, targetUri);

      if (res && res.status === 200) {
        // Try saving directly to device Media Library / Gallery if available
        try {
          const MediaLibrary = require('expo-media-library');
          if (MediaLibrary && MediaLibrary.requestPermissionsAsync) {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
              await MediaLibrary.saveToLibraryAsync(res.uri);
              Alert.alert('Download Complete ✅', `${cleanName} has been saved directly to your Gallery.`);
              return true;
            }
          }
        } catch (_) {
          // MediaLibrary optional fallback
        }

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(res.uri, {
            mimeType: cleanName.endsWith('.png') ? 'image/png' : undefined,
            dialogTitle: `Download ${title}`,
            UTI: cleanName.endsWith('.png') ? 'public.png' : undefined,
          });
          return true;
        } else {
          Alert.alert('Download Complete ✅', `${cleanName} saved to device.`);
          return true;
        }
      }
    }

    // Fallback: Open in browser
    await Linking.openURL(targetUrl);
    return true;
  } catch (err: any) {
    console.warn('[downloadService] Native download fallback:', err);
    try {
      await Linking.openURL(targetUrl);
      return true;
    } catch (e: any) {
      Alert.alert('Download Failed', 'Unable to download file. Please check your internet connection.');
      return false;
    }
  }
}

/**
 * Shares a community post with its full caption, title, and media image file safely
 */
export async function shareCommunityPost(post: any): Promise<boolean> {
  if (!post) return false;

  const title = post.title || '';
  const caption = post.caption || post.description || '';
  const mediaUrl =
    (Array.isArray(post.media_urls) && post.media_urls[0]) ||
    (Array.isArray(post.images) && post.images[0]) ||
    post.image_url ||
    post.media_url ||
    post.drive_url ||
    '';

  const titlePart = title ? `📌 *${title}*\n\n` : '';
  const captionPart = caption ? `${caption}\n\n` : '';
  const footerPart = `✨ Shared via FEEDX Community`;

  let FileSystem: any = null;
  try {
    FileSystem = require('expo-file-system/legacy');
  } catch {
    try {
      FileSystem = require('expo-file-system');
    } catch {}
  }

  // If there's an image URL, attempt to download to cache and share the file directly
  if (mediaUrl && FileSystem && FileSystem.downloadAsync && FileSystem.cacheDirectory) {
    try {
      const targetUrl = getDriveDirectDownloadUrl(mediaUrl) || mediaUrl;
      const cleanExt = targetUrl.toLowerCase().endsWith('.png') ? '.png' : '.jpg';
      const cacheUri = `${FileSystem.cacheDirectory}feedx_share_${Date.now()}${cleanExt}`;
      const res = await FileSystem.downloadAsync(targetUrl, cacheUri);

      if (res && res.status === 200 && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(res.uri, {
          mimeType: cleanExt === '.png' ? 'image/png' : 'image/jpeg',
          dialogTitle: title || 'Share Post',
          UTI: cleanExt === '.png' ? 'public.png' : 'public.jpeg',
        });
        return true;
      }
    } catch (fileShareErr) {
      console.warn('[shareCommunityPost] File share fallback:', fileShareErr);
    }
  }

  // Fallback to text & URL share
  const mediaPart = mediaUrl ? `🖼️ View Image: ${mediaUrl}\n\n` : '';
  const fullMessage = `${titlePart}${captionPart}${mediaPart}${footerPart}`;

  try {
    const { Share } = require('react-native');
    await Share.share({
      message: fullMessage,
      title: title || 'FEEDX Community Post',
      url: mediaUrl || undefined,
    });
    return true;
  } catch (err) {
    console.warn('[shareCommunityPost] Text share error:', err);
    return false;
  }
}

/**
 * Generates and downloads or shares a formatted CSV report file.
 */
export async function exportReportAsCsv(
  filename: string,
  title: string,
  headers: string[],
  rows: (string | number | undefined | null)[][]
): Promise<boolean> {
  try {
    // Escape and format CSV cells
    const formatCell = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headerLine = headers.map(formatCell).join(',');
    const bodyLines = rows.map((r) => r.map(formatCell).join(',')).join('\n');
    const csvContent = `\uFEFF${headerLine}\n${bodyLines}`;

    let cleanFileName = filename.endsWith('.csv') ? filename : `${filename}.csv`;

    // 1. Web Platform
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = cleanFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Alert.alert('Report Downloaded', `${cleanFileName} has been downloaded to your device.`);
        return true;
      }
    }

    // 2. Native Mobile Platform
    let FileSystem: any = null;
    try {
      FileSystem = require('expo-file-system/legacy');
    } catch {
      try {
        FileSystem = require('expo-file-system');
      } catch {}
    }

    if (FileSystem && (FileSystem.documentDirectory || FileSystem.cacheDirectory)) {
      const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
      const fileUri = `${baseDir}${cleanFileName}`;

      if (FileSystem.writeAsStringAsync) {
        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
          encoding: FileSystem.EncodingType ? FileSystem.EncodingType.UTF8 : 'utf8',
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: title || 'Download Report',
            UTI: 'public.comma-separated-values-text',
          });
          return true;
        } else {
          Alert.alert('Report Saved ✅', `${cleanFileName} saved successfully.`);
          return true;
        }
      }
    }

    // 3. Fallback to native text Share
    const { Share } = require('react-native');
    await Share.share({
      title: title || 'Report Export',
      message: `${title}\n\n${headers.join(' | ')}\n\n${rows.slice(0, 15).map(r => r.join(' | ')).join('\n')}\n\n...[Full report exported]`,
    });
    return true;
  } catch (err: any) {
    console.error('[exportReportAsCsv] Error exporting report:', err);
    Alert.alert('Export Failed', err.message || 'Unable to generate CSV report.');
    return false;
  }
}

