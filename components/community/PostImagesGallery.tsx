import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Image as RNImage,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import { RADIUS, SPACING } from '@/constants/theme';
import { downloadOrOpenFile } from '@/services/downloadService';
import { DoubleTapLikeWrapper } from '@/components/community/DoubleTapLikeWrapper';
import { resolveMediaUrl, extractDriveFileId } from '@/utils/googleDrive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PostImagesGalleryProps {
  images: string[];
  onDoubleTap?: () => void;
  onLike?: () => void;
}

export function PostImagesGallery({ images = [], onDoubleTap, onLike }: PostImagesGalleryProps) {
  const { isDark } = useTheme();

  const cleanImages = React.useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    (images || []).forEach((u) => {
      if (typeof u === 'string' && u.trim()) {
        const resolved = resolveMediaUrl(u);
        if (resolved && !seen.has(resolved)) {
          seen.add(resolved);
          list.push(resolved);
        }
      }
    });
    return list;
  }, [images]);

  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  if (!cleanImages || cleanImages.length === 0) return null;

  const handleImagePress = (idx: number) => {
    setSelectedIdx(idx);
    setViewerVisible(true);
  };

  const handleDownloadActiveImage = async () => {
    const url = cleanImages[selectedIdx];
    if (!url) return;
    const rawName = url.split('/').pop()?.split('?')[0] || `feedx_post_${selectedIdx}_${Date.now()}`;
    const cleanBase = rawName.replace(/\.[^/.]+$/, '');
    const filename = `${cleanBase}.png`;
    await downloadOrOpenFile(url, filename, 'Image (PNG)');
  };

  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});
  const [activeUrls, setActiveUrls] = useState<Record<number, string>>({});

  // Reset states and prefetch images when images prop changes
  useEffect(() => {
    setFailedIndices({});
    const initialMap: Record<number, string> = {};
    cleanImages.forEach((url, i) => {
      initialMap[i] = url;
      if (url && typeof url === 'string') {
        ExpoImage.prefetch(url).catch(() => {});
      }
    });
    setActiveUrls(initialMap);

    // Proactively measure aspect ratio for single images
    const singleUrl = cleanImages[0];
    if (cleanImages.length === 1 && singleUrl && typeof singleUrl === 'string') {
      RNImage.getSize(
        singleUrl,
        (w, h) => {
          if (w && h && h > 0) {
            setAspectRatio(w / h);
          }
        },
        () => {}
      );
    }
  }, [cleanImages]);

  const handleImageError = (index: number) => {
    const currentUrl = activeUrls[index] || cleanImages[index];
    if (!currentUrl) {
      setFailedIndices((prev) => ({ ...prev, [index]: true }));
      return;
    }

    const driveId = extractDriveFileId(currentUrl);
    if (driveId) {
      // Try next alternative Google CDN endpoint
      if (currentUrl.includes('lh3.googleusercontent.com') && (currentUrl.includes('=w800') || currentUrl.includes('=s1600'))) {
        setActiveUrls((prev) => ({ ...prev, [index]: `https://drive.google.com/thumbnail?id=${driveId}&sz=w800` }));
        return;
      }
      if (currentUrl.includes('drive.google.com/thumbnail')) {
        setActiveUrls((prev) => ({ ...prev, [index]: `https://lh3.googleusercontent.com/d/${driveId}` }));
        return;
      }
      if (currentUrl.includes('lh3.googleusercontent.com')) {
        setActiveUrls((prev) => ({ ...prev, [index]: `https://drive.google.com/uc?export=view&id=${driveId}` }));
        return;
      }
    }

    setFailedIndices((prev) => ({ ...prev, [index]: true }));
  };

  const isSingle = cleanImages.length === 1;
  const naturalRatio = aspectRatio || 1.33;
  const clampedRatio = Math.max(0.75, Math.min(1.78, naturalRatio));

  return (
    <View style={styles.container}>
      {isSingle ? (
        <View style={styles.singleImageContainer}>
          <DoubleTapLikeWrapper
            style={[
              styles.singleImageWrap,
              {
                aspectRatio: clampedRatio,
                maxHeight: 520,
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              },
            ]}
            onSingleTap={() => handleImagePress(0)} // 1 tap: Open full-screen photo viewer
            onDoubleTap={onLike || onDoubleTap || (() => {})} // 2 taps: Heart like animation
          >
            {failedIndices[0] ? (
              <View style={styles.fallbackBox}>
                <Feather name="image" size={32} color={isDark ? '#475569' : '#94A3B8'} />
                <Text style={[styles.fallbackText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  FEEDX Image
                </Text>
              </View>
            ) : (
              <ExpoImage
                source={{ uri: activeUrls[0] || cleanImages[0] }}
                style={styles.singleImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
                priority="high"
                onError={() => handleImageError(0)}
                onLoad={(e: any) => {
                  const w = e?.source?.width || e?.nativeEvent?.source?.width;
                  const h = e?.source?.height || e?.nativeEvent?.source?.height;
                  if (w && h && h > 0) {
                    setAspectRatio(w / h);
                  }
                }}
              />
            )}
          </DoubleTapLikeWrapper>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselList}
          >
            {cleanImages.map((imgUrl, idx) => (
              <DoubleTapLikeWrapper
                key={idx}
                style={[styles.carouselItem, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                onSingleTap={() => handleImagePress(idx)} // 1 tap: Open viewer at index
                onDoubleTap={onLike || onDoubleTap || (() => {})} // 2 taps: Heart like animation
              >
                {failedIndices[idx] ? (
                  <View style={styles.fallbackBox}>
                    <Feather name="image" size={28} color={isDark ? '#475569' : '#94A3B8'} />
                    <Text style={[styles.fallbackText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      FEEDX Media
                    </Text>
                  </View>
                ) : (
                  <ExpoImage
                    source={{ uri: activeUrls[idx] || imgUrl }}
                    style={styles.carouselImage}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                    priority="high"
                    onError={() => handleImageError(idx)}
                  />
                )}
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {idx + 1}/{cleanImages.length}
                  </Text>
                </View>
              </DoubleTapLikeWrapper>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Full-Screen Image Viewer Modal */}
      <Modal
        visible={viewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <View style={styles.viewerOverlay}>
          {/* Header Bar */}
          <View style={styles.viewerHeader}>
            <TouchableOpacity onPress={() => setViewerVisible(false)} style={styles.headerBtn}>
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.viewerCounterText}>
              Image {selectedIdx + 1} of {cleanImages.length}
            </Text>

            <TouchableOpacity onPress={handleDownloadActiveImage} style={styles.headerBtn}>
              <Feather name="download" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Large Slides */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: selectedIdx * SCREEN_WIDTH, y: 0 }}
            onMomentumScrollEnd={(e) => {
              const newIdx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setSelectedIdx(newIdx);
            }}
            style={styles.viewerScroll}
          >
            {cleanImages.map((url, i) => (
              <View key={i} style={styles.viewerSlide}>
                <ExpoImage
                  source={{ uri: url }}
                  style={styles.fullImage}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    width: '100%',
  },
  singleImageContainer: {
    width: '100%',
  },
  singleImageWrap: {
    width: '100%',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  gridContainer: {
    width: '100%',
  },
  carouselList: {
    paddingHorizontal: 0,
    gap: 8,
  },
  carouselItem: {
    width: 280,
    height: 320,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  countBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  viewerOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 10,
  },
  headerBtn: {
    padding: 8,
  },
  viewerCounterText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  viewerScroll: {
    flex: 1,
  },
  viewerSlide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  fallbackBox: {
    width: '100%',
    height: '100%',
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fallbackText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
