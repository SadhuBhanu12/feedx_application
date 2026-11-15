import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { convertDriveUrlToImageUrl } from '@/utils/googleDrive';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: any;
  fallbackUrl?: string;
  fallbackSource?: any;
  showLoader?: boolean;
}

const DEFAULT_FEEDX_FALLBACK = require('@/assets/images/logo.jpg');

export function OptimizedImage({ 
  source, 
  placeholder, 
  fallbackUrl,
  fallbackSource, 
  style, 
  showLoader = false,
  ...props 
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const rawUri = typeof source === 'string' ? source.trim() : (source?.uri ? String(source.uri).trim() : '');
  
  React.useEffect(() => {
    setError(false);
    if (rawUri && rawUri.startsWith('http')) {
      Image.prefetch(rawUri).catch(() => {});
    }
  }, [rawUri]);

  const processedUri = (rawUri.includes('drive.google.com') || rawUri.includes('googleusercontent.com'))
    ? convertDriveUrlToImageUrl(rawUri)
    : rawUri;

  const isValidSource = source && (typeof source !== 'string' || processedUri.length > 5);

  const effectiveFallback = fallbackSource || (fallbackUrl ? { uri: fallbackUrl } : DEFAULT_FEEDX_FALLBACK);

  const imageSource = (error || !isValidSource)
    ? effectiveFallback
    : (typeof source === 'string' ? { uri: processedUri } : (source?.uri ? { ...source, uri: processedUri } : source));

  const isLocalModule = typeof source === 'number' || typeof imageSource === 'number';

  return (
    <View style={[styles.container, style]}>
      <Image
        source={imageSource}
        placeholder={placeholder}
        contentFit={props.contentFit || 'cover'}
        transition={200}
        priority={isLocalModule ? undefined : 'high'}
        cachePolicy={isLocalModule ? undefined : 'memory-disk'}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={StyleSheet.absoluteFill}
        {...props}
      />
      {loading && showLoader && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#FFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  loader: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  }
});
