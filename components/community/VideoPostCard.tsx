import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { RADIUS, SPACING } from '@/constants/theme';
import { DoubleTapLikeWrapper } from '@/components/community/DoubleTapLikeWrapper';
import { resolveCommunityMedia } from '@/utils/mediaResolver';

// Global audio state shared across the community feed (matching Instagram behavior)
let globalFeedMuted = false;

interface VideoPostCardProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  title?: string;
  isActive?: boolean;
  onLike?: () => void;
}

export function VideoPostCard({
  videoUrl,
  thumbnailUrl,
  duration,
  title,
  isActive = false,
  onLike,
}: VideoPostCardProps) {
  const { isDark } = useTheme();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(globalFeedMuted);
  const [streamCandidateIndex, setStreamCandidateIndex] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);
  const bufferingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play/Pause feedback animation in center (Instagram style)
  const feedbackIconOpacity = useSharedValue(0);
  const feedbackIconScale = useSharedValue(0.7);
  const [feedbackIconName, setFeedbackIconName] = useState<'play' | 'pause'>('play');

  // Sound feedback animation in center
  const soundIconOpacity = useSharedValue(0);
  const soundIconScale = useSharedValue(0.6);

  // Resolve media details (Google Drive direct stream, YouTube, or direct MP4)
  const resolved = useMemo(() => {
    return resolveCommunityMedia({
      video_url: videoUrl,
      drive_url: videoUrl,
      image_url: thumbnailUrl,
      post_type: 'video',
    });
  }, [videoUrl, thumbnailUrl]);

  // Construct candidate stream URLs in priority order for robust playback (filtering out image thumbnails)
  const candidateStreamUrls = useMemo(() => {
    const isImageThumbUrl = (u?: string | null) => {
      if (!u || typeof u !== 'string') return true;
      const lower = u.toLowerCase();
      if (lower.includes('drive.google.com/thumbnail')) return true;
      if (lower.includes('lh3.googleusercontent.com') && !lower.includes('download')) return true;
      if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp')) return true;
      return false;
    };

    const list: string[] = [];
    if (resolved.streamUrl && !isImageThumbUrl(resolved.streamUrl)) list.push(resolved.streamUrl);
    if (resolved.fileId && resolved.isDrive) {
      const cdnUrl = `https://drive.usercontent.google.com/download?id=${resolved.fileId}&export=download&confirm=t`;
      const ucUrl = `https://drive.google.com/uc?export=download&id=${resolved.fileId}&confirm=t`;
      const viewUrl = `https://drive.google.com/uc?export=view&id=${resolved.fileId}`;
      if (!list.includes(cdnUrl)) list.push(cdnUrl);
      if (!list.includes(ucUrl)) list.push(ucUrl);
      if (!list.includes(viewUrl)) list.push(viewUrl);
    }
    if (resolved.fallbackUrls && resolved.fallbackUrls.length > 0) {
      for (const fb of resolved.fallbackUrls) {
        if (fb && !isImageThumbUrl(fb) && !list.includes(fb)) list.push(fb);
      }
    }
    if (resolved.rawUrl && !isImageThumbUrl(resolved.rawUrl) && !list.includes(resolved.rawUrl)) {
      list.push(resolved.rawUrl);
    }
    return list.filter(Boolean);
  }, [resolved]);

  const activeStreamSource = candidateStreamUrls[streamCandidateIndex] || candidateStreamUrls[0] || '';
  const canDirectPlay = Boolean(activeStreamSource && !resolved.isYouTube);

  // Initialize expo-video player
  const player = useVideoPlayer(canDirectPlay ? activeStreamSource : '', (p) => {
    try {
      p.loop = true;
      p.muted = isMuted;
    } catch (_) {}
  });

  // Reset buffering and pause if card is scrolled off-screen
  useEffect(() => {
    if (!isActive) {
      setIsBuffering(false);
      if (bufferingTimerRef.current) {
        clearTimeout(bufferingTimerRef.current);
        bufferingTimerRef.current = null;
      }
      try {
        if (player) player.pause();
      } catch (_) {}
    }
  }, [isActive, player]);

  // Track playback status, buffering, and error events
  useEffect(() => {
    if (!player) return;

    try {
      const statusSub = player.addListener('statusChange', (payload: any) => {
        const status = typeof payload === 'string' ? payload : payload?.status;
        if (status === 'loading') {
          if (isActive) {
            setIsBuffering(true);
            if (bufferingTimerRef.current) clearTimeout(bufferingTimerRef.current);
            bufferingTimerRef.current = setTimeout(() => {
              setIsBuffering(false);
              if (streamCandidateIndex + 1 < candidateStreamUrls.length) {
                setStreamCandidateIndex((prev) => prev + 1);
              } else {
                setHasPlaybackError(true);
              }
            }, 3500);
          }
        } else if (status === 'readyToPlay') {
          if (bufferingTimerRef.current) {
            clearTimeout(bufferingTimerRef.current);
            bufferingTimerRef.current = null;
          }
          setIsBuffering(false);
          setHasPlaybackError(false);
          if (isActive && !isUserPaused) {
            player.play();
          }
        } else if (status === 'error') {
          if (bufferingTimerRef.current) {
            clearTimeout(bufferingTimerRef.current);
            bufferingTimerRef.current = null;
          }
          setIsBuffering(false);
          // Auto fallback to next stream candidate URL
          if (streamCandidateIndex + 1 < candidateStreamUrls.length) {
            setStreamCandidateIndex((prev) => prev + 1);
          } else {
            setHasPlaybackError(true);
          }
        }
      });

      const rateSub = player.addListener('playbackRateChange', (payload: any) => {
        const rate = typeof payload === 'number' ? payload : payload?.playbackRate ?? 0;
        setIsPlaying(rate > 0);
      });

      const playingSub = (player as any).addListener?.('playingChange', (payload: any) => {
        const isCurrentlyPlaying = typeof payload === 'boolean' ? payload : payload?.isPlaying;
        setIsPlaying(Boolean(isCurrentlyPlaying));
      });

      return () => {
        if (bufferingTimerRef.current) {
          clearTimeout(bufferingTimerRef.current);
          bufferingTimerRef.current = null;
        }
        statusSub?.remove?.();
        rateSub?.remove?.();
        playingSub?.remove?.();
      };
    } catch (e) {
      console.warn('[VideoPostCard] Error attaching player listener:', e);
    }
  }, [player, activeStreamSource, streamCandidateIndex, candidateStreamUrls, isActive, isUserPaused]);

  // Synchronize stream source to player
  useEffect(() => {
    if (!player || !canDirectPlay || !activeStreamSource) return;
    try {
      player.replace(activeStreamSource);
      player.loop = true;
      player.muted = isMuted;
      if (isActive && !isUserPaused) {
        player.play();
      }
    } catch (err) {
      console.warn('[VideoPostCard] Error synchronizing stream to player:', err);
    }
  }, [activeStreamSource, player, canDirectPlay]);

  // Viewport Visibility & Play Control: Auto-play when active (in viewport), pause immediately when scrolled away
  useEffect(() => {
    if (!player || !canDirectPlay) return;

    if (isActive && !isUserPaused) {
      try {
        player.muted = globalFeedMuted;
        setIsMuted(globalFeedMuted);
        player.play();
      } catch (_) {}
    } else {
      try {
        player.pause();
      } catch (_) {}
    }
  }, [isActive, isUserPaused, player, canDirectPlay]);

  // Automatically pause playback when card unmounts
  useEffect(() => {
    return () => {
      try {
        if (player) {
          player.pause();
        }
      } catch (_) {}
    };
  }, [player]);

  const thumbUri =
    resolved.thumbnailUrl ||
    thumbnailUrl ||
    (resolved.fileId ? `https://drive.google.com/thumbnail?id=${resolved.fileId}&sz=w800` : '') ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';

  // Natural Aspect Ratio:
  // 16:9 Landscape = ~1.778
  // 1:1 Square = 1.0
  // 4:5 Instagram Portrait = 0.8
  // 9:16 Full Reel = ~0.5625
  const naturalRatio = aspectRatio || (resolved.isYouTube ? 16 / 9 : 0.85);
  const clampedRatio = Math.max(0.5625, Math.min(1.778, naturalRatio));

  // Instagram-style single tap: Toggle Play / Pause with center animation
  const handleSingleTap = () => {
    if (hasPlaybackError) {
      setHasPlaybackError(false);
      setStreamCandidateIndex(0);
      if (player && canDirectPlay) {
        try {
          player.replace(candidateStreamUrls[0] || '');
          player.play();
        } catch (_) {}
      }
      return;
    }

    if (resolved.isYouTube || (!canDirectPlay && (resolved.webPreviewUrl || activeStreamSource))) {
      try {
        Linking.openURL(resolved.webPreviewUrl || activeStreamSource);
      } catch (_) {}
      return;
    }

    if (!player) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    if (isPlaying) {
      // Pause video
      setIsUserPaused(true);
      try {
        player.pause();
      } catch (_) {}

      // Trigger pause pulse animation
      setFeedbackIconName('pause');
      feedbackIconScale.value = 0.7;
      feedbackIconOpacity.value = 1;
      feedbackIconScale.value = withSpring(1, { damping: 14, stiffness: 220 });
      feedbackIconOpacity.value = withSequence(
        withTiming(1, { duration: 350 }),
        withTiming(0, { duration: 250 })
      );
    } else {
      // Resume video
      setIsUserPaused(false);
      try {
        player.play();
      } catch (_) {}

      // Trigger play pulse animation
      setFeedbackIconName('play');
      feedbackIconScale.value = 0.7;
      feedbackIconOpacity.value = 1;
      feedbackIconScale.value = withSpring(1, { damping: 14, stiffness: 220 });
      feedbackIconOpacity.value = withSequence(
        withTiming(1, { duration: 350 }),
        withTiming(0, { duration: 250 })
      );
    }
  };

  // Mute / Unmute audio toggle
  const handleToggleSound = () => {
    if (!player) return;
    try {
      Haptics.selectionAsync();
    } catch (_) {}

    const nextMuted = !isMuted;
    globalFeedMuted = nextMuted;
    setIsMuted(nextMuted);

    try {
      player.muted = nextMuted;
      if (!nextMuted) {
        player.volume = 1.0;
        if (!isPlaying && !isUserPaused) player.play();
      }
    } catch (_) {}

    // Animate sound indicator
    soundIconScale.value = 0.6;
    soundIconOpacity.value = 1;
    soundIconScale.value = withSequence(
      withTiming(1.1, { duration: 120 }),
      withTiming(1.0, { duration: 80 })
    );
    soundIconOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 250 })
    );
  };

  const animatedFeedbackIconStyle = useAnimatedStyle(() => ({
    opacity: feedbackIconOpacity.value,
    transform: [{ scale: feedbackIconScale.value }],
  }));

  const animatedSoundIconStyle = useAnimatedStyle(() => ({
    opacity: soundIconOpacity.value,
    transform: [{ scale: soundIconScale.value }],
  }));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.thumbWrap,
          {
            aspectRatio: clampedRatio,
            maxHeight: Math.min(580, SCREEN_HEIGHT * 0.65),
            backgroundColor: isDark ? '#0B0F19' : '#0F172A',
          },
        ]}
      >
        <DoubleTapLikeWrapper
          onSingleTap={handleSingleTap}
          onDoubleTap={onLike || (() => {})}
          style={styles.playerInnerWrap}
        >
          <View style={styles.playerInnerWrap}>
            {/* Poster thumbnail under video to prevent black flash during initial buffering or when not active */}
            {(!isPlaying || !isActive) && (
              <ExpoImage
                source={{ uri: thumbUri }}
                style={[StyleSheet.absoluteFill, styles.thumbnail]}
                contentFit="contain"
                priority="high"
                cachePolicy="memory-disk"
                onLoad={(e) => {
                  if (e?.source?.width && e?.source?.height) {
                    setAspectRatio(e.source.width / e.source.height);
                  }
                }}
              />
            )}

            {canDirectPlay && player && (
              <VideoView
                style={[StyleSheet.absoluteFill, styles.videoPlayer]}
                player={player}
                allowsPictureInPicture={false}
                nativeControls={false}
                contentFit="contain"
              />
            )}

            {/* Instagram-style temporary sound toggle flash animation */}
            <Animated.View
              style={[styles.soundFeedbackCircle, animatedSoundIconStyle]}
              pointerEvents="none"
            >
              <Ionicons
                name={isMuted ? 'volume-mute' : 'volume-high'}
                size={30}
                color="#FFFFFF"
              />
            </Animated.View>

            {/* Subtle Buffering Indicator - only when active, not playing, and not in error */}
            {isBuffering && isActive && !hasPlaybackError && !isPlaying && (
              <View style={styles.bufferingOverlay} pointerEvents="none">
                <ActivityIndicator size="small" color="#3B82F6" />
              </View>
            )}

            {/* Fallback Reload / Retry icon if playback error occurs */}
            {hasPlaybackError && !isPlaying && (
              <View style={styles.pausedCenterButton} pointerEvents="box-none">
                <TouchableOpacity
                  style={styles.playButtonGlass}
                  onPress={() => {
                    setHasPlaybackError(false);
                    setStreamCandidateIndex(0);
                    if (player && canDirectPlay) {
                      try {
                        player.replace(candidateStreamUrls[0] || '');
                        player.play();
                      } catch (_) {}
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="reload" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </DoubleTapLikeWrapper>

        {/* Sound control in corner (Play/Pause icons removed by user request) */}
        {canDirectPlay && player && (
          <View style={[styles.controlsBar, { justifyContent: 'flex-end' }]}>
            {/* Sound mute/unmute toggle badge (bottom-right) */}
            <TouchableOpacity
              style={styles.controlBadge}
              onPress={handleToggleSound}
              activeOpacity={0.75}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isMuted ? 'volume-mute' : 'volume-high'}
                size={13}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    width: '100%',
    alignItems: 'center',
  },
  thumbWrap: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerInnerWrap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  pausedCenterButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 28,
  },
  playButtonGlass: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  feedbackCircle: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  soundFeedbackCircle: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  controlsBar: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 25,
    pointerEvents: 'box-none',
  },
  controlBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
