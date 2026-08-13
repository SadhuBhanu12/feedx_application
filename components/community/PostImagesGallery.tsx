import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { RADIUS, SPACING } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface PostImagesGalleryProps {
  images: string[];
}

export function PostImagesGallery({ images = [] }: PostImagesGalleryProps) {
  const { colors } = useTheme();

  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loadingState, setLoadingState] = useState<Record<number, boolean>>({});

  if (!images || images.length === 0) return null;

  const handleImagePress = (idx: number) => {
    setSelectedIdx(idx);
    setViewerVisible(true);
  };

  const isSingle = images.length === 1;

  return (
    <View style={styles.container}>
      {isSingle ? (
        <View style={styles.singleImageContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleImagePress(0)}
            style={styles.singleImageWrap}
          >
            {loadingState[0] && (
              <View style={StyleSheet.absoluteFillObject}>
                <SkeletonLoader width="100%" height={280} borderRadius={RADIUS.md} />
              </View>
            )}
            <ExpoImage
              source={{ uri: images[0] }}
              style={styles.singleImage}
              contentFit="contain"
              transition={200}
              onLoadStart={() => setLoadingState((prev) => ({ ...prev, 0: true }))}
              onLoad={() => setLoadingState((prev) => ({ ...prev, 0: false }))}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselList}>
            {images.map((imgUrl, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.9}
                onPress={() => handleImagePress(idx)}
                style={styles.carouselItem}
              >
                {loadingState[idx] && (
                  <View style={StyleSheet.absoluteFillObject}>
                    <SkeletonLoader width={180} height={180} borderRadius={RADIUS.md} />
                  </View>
                )}
                <ExpoImage
                  source={{ uri: imgUrl }}
                  style={styles.carouselImage}
                  contentFit="contain"
                  transition={200}
                  onLoadStart={() => setLoadingState((prev) => ({ ...prev, [idx]: true }))}
                  onLoad={() => setLoadingState((prev) => ({ ...prev, [idx]: false }))}
                />
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{idx + 1}/{images.length}</Text>
                </View>
              </TouchableOpacity>
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
          <View style={styles.viewerHeader}>
            <Text style={styles.viewerCounterText}>
              Image {selectedIdx + 1} of {images.length}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setViewerVisible(false)}>
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: selectedIdx * width, y: 0 }}
            onMomentumScrollEnd={(e) => {
              const newIdx = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedIdx(newIdx);
            }}
            style={styles.viewerScroll}
          >
            {images.map((url, i) => (
              <View key={i} style={styles.viewerSlide}>
                <ExpoImage
                  source={{ uri: url }}
                  style={styles.fullImage}
                  contentFit="contain"
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
  },
  singleImageContainer: {
    marginHorizontal: -SPACING.md,
  },
  singleImageWrap: {
    width: '100%',
    height: 280,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  gridContainer: {
    marginHorizontal: -SPACING.md,
  },
  carouselList: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  carouselItem: {
    width: 220,
    height: 220,
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
  viewerCounterText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  viewerScroll: {
    flex: 1,
  },
  viewerSlide: {
    width: width,
    height: height - 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: width,
    height: '100%',
  },
});
