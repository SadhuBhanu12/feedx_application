import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { convertDriveUrlToImageUrl } from '@/utils/googleDrive';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: any;
  fallbackUrl?: string;
  showLoader?: boolean;
}

const DEFAULT_PLACEHOLDER = 'L6PZ|aJ-0e_3NXxu9F-o_4s.Rj%M'; // Simple Blurhash for default grey placeholder

export function OptimizedImage({ 
  source, 
  placeholder = DEFAULT_PLACEHOLDER, 
  fallbackUrl = 'https://images.unsplash.com/photo-1562774053-701939374585?q=60&w=400&auto=format&fit=crop', 
  style, 
  showLoader = false,
  ...props 
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const rawUri = typeof source === 'string' ? source.trim() : (source?.uri ? String(source.uri).trim() : '');
  const processedUri = (rawUri.includes('drive.google.com') || rawUri.includes('googleusercontent.com'))
    ? convertDriveUrlToImageUrl(rawUri)
    : rawUri;

  const isValidSource = source && (typeof source !== 'string' || processedUri.length > 5);

  const imageSource = (error || !isValidSource)
    ? { uri: fallbackUrl }
    : (typeof source === 'string' ? { uri: processedUri } : (source?.uri ? { ...source, uri: processedUri } : source));

  const isLocalModule = typeof source === 'number' || typeof imageSource === 'number';

  return (
    <View style={[styles.container, style]}>
      <Image
        source={imageSource}
        placeholder={isLocalModule ? undefined : placeholder}
        contentFit={props.contentFit || 'cover'}
        transition={0}
        priority={isLocalModule ? undefined : 'high'}
        cachePolicy={isLocalModule ? undefined : 'memory-disk'}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={StyleSheet.absoluteFillObject}
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
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  }
});
