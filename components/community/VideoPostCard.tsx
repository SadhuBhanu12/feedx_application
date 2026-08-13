import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '@/context/ThemeContext';
import { RADIUS, SPACING, SHADOWS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface VideoPostCardProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  title?: string;
}

export function VideoPostCard({ videoUrl, thumbnailUrl, duration = '03:45', title }: VideoPostCardProps) {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const thumbUri = thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';

  const handlePlayPress = async () => {
    if (videoUrl && videoUrl.startsWith('http')) {
      try {
        await WebBrowser.openBrowserAsync(videoUrl);
      } catch (e) {
        setModalVisible(true);
      }
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePlayPress}
        style={[styles.thumbWrap, { backgroundColor: isDark ? '#0F172A' : '#1E293B' }]}
      >
        <ExpoImage source={{ uri: thumbUri }} style={styles.thumbnail} contentFit="cover" transition={200} />

        {/* Gradient / Dark overlay */}
        <View style={styles.overlay} />

        {/* Centered Play Icon */}
        <View style={styles.playBtnCircle}>
          <MaterialCommunityIcons name="play" size={32} color="#FFF" style={{ marginLeft: 3 }} />
        </View>

        {/* Duration Badge */}
        <View style={styles.durationBadge}>
          <MaterialCommunityIcons name="clock-outline" size={11} color="#FFF" />
          <Text style={styles.durationBadgeText}>{duration}</Text>
        </View>
      </TouchableOpacity>

      {/* Video Modal Player */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>{title || 'FEEDX Video Broadcast'}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.videoPlayerContainer}>
            <ExpoImage source={{ uri: thumbUri }} style={styles.modalVideoPreview} contentFit="contain" />
            <View style={styles.playerNoticeBox}>
              <MaterialCommunityIcons name="play-circle-outline" size={48} color={colors.primary} />
              <Text style={[styles.noticeTitle, { color: '#FFF' }]}>Video Playing</Text>
              <Text style={styles.noticeSub}>Tap close to return to the feed.</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  thumbWrap: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  playBtnCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    ...SHADOWS.medium,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 10,
  },
  closeBtn: {
    padding: 6,
  },
  videoPlayerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalVideoPreview: {
    width: width,
    height: 280,
  },
  playerNoticeBox: {
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  noticeSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
});
