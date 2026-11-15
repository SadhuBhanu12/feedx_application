import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { RADIUS, SHADOWS } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface MilestoneCelebrationModalProps {
  visible: boolean;
  milestoneTitle: string;
  milestoneType?: 'stage_completed' | 'progress_25' | 'progress_50' | 'progress_75' | 'roadmap_completed';
  pointsAwarded?: number;
  stageNumber?: number;
  overallScore?: number;
  onClose: () => void;
}

export default function MilestoneCelebrationModal({
  visible,
  milestoneTitle,
  milestoneType = 'stage_completed',
  pointsAwarded = 35,
  stageNumber,
  overallScore,
  onClose,
}: MilestoneCelebrationModalProps) {
  const { colors, isDark } = useTheme();

  const badgeScale = useSharedValue(0.6);
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (visible) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } catch {}

      badgeScale.value = withSpring(1, { damping: 10, stiffness: 120 });
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 900 }),
          withTiming(0.35, { duration: 900 })
        ),
        -1,
        true
      );
    } else {
      badgeScale.value = 0.6;
    }
  }, [visible]);

  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (!visible) return null;

  const isRoadmapDone = milestoneType === 'roadmap_completed';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          entering={ZoomIn.duration(260)}
          exiting={FadeOut.duration(200)}
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#0F1E38' : '#FFFFFF',
              borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.25)',
            },
          ]}
        >
          {/* Decorative Sparkle Glow */}
          <Animated.View style={[styles.glowRing, glowAnimStyle]}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.35)', 'rgba(16, 185, 129, 0.25)', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Feather name="x" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>

          {/* Bouncing Badge Icon */}
          <Animated.View style={[styles.badgeContainer, badgeAnimStyle]}>
            <LinearGradient
              colors={isRoadmapDone ? ['#F59E0B', '#D97706'] : ['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badgeCircle}
            >
              {isRoadmapDone ? (
                <MaterialCommunityIcons name="trophy-award" size={40} color="#FFF" />
              ) : (
                <MaterialCommunityIcons name="check-decagram" size={40} color="#FFF" />
              )}
            </LinearGradient>
          </Animated.View>

          {/* Pill category tag */}
          <View style={styles.pillTag}>
            <MaterialCommunityIcons name="star-four-points" size={13} color="#10B981" />
            <Text style={styles.pillTagText}>
              {isRoadmapDone
                ? 'ROADMAP COMPLETED!'
                : stageNumber
                ? `STAGE 0${stageNumber} VERIFIED`
                : 'MILESTONE UNLOCKED'}
            </Text>
          </View>

          {/* Title & Subtitle */}
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            {milestoneTitle}
          </Text>

          <Text style={[styles.desc, { color: isDark ? '#CBD5E1' : '#475569' }]}>
            {isRoadmapDone
              ? 'Incredible dedication! You have finished every single phase of your career curriculum.'
              : 'You have mastered the required topics, tasks, and phase assessment.'}
          </Text>

          {/* Reward and Score highlight */}
          <View
            style={[
              styles.rewardRow,
              {
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
              },
            ]}
          >
            <View style={styles.rewardCol}>
              <Text style={styles.rewardLabel}>REWARD AWARDED</Text>
              <Text style={styles.rewardVal}>+{pointsAwarded} FEEDX XP</Text>
            </View>

            {overallScore !== undefined && (
              <>
                <View style={styles.rewardDivider} />
                <View style={styles.rewardCol}>
                  <Text style={styles.rewardLabel}>OVERALL SCORE</Text>
                  <Text style={[styles.rewardVal, { color: '#38BDF8' }]}>{overallScore}%</Text>
                </View>
              </>
            )}
          </View>

          {/* Primary Dismiss Button */}
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={() => {
              try {
                Haptics.selectionAsync().catch(() => {});
              } catch {}
              onClose();
            }}
          >
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueGradient}
            >
              <Text style={styles.continueBtnText}>Continue Learning Journey →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: Math.min(width - 40, 380),
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  glowRing: {
    position: 'absolute',
    top: -40,
    left: -40,
    right: -40,
    height: 180,
    borderRadius: 90,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badgeContainer: {
    marginTop: 6,
    marginBottom: 14,
  },
  badgeCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  pillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    marginBottom: 10,
  },
  pillTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 26,
  },
  desc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  rewardCol: {
    alignItems: 'center',
    flex: 1,
  },
  rewardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  rewardVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#10B981',
  },
  rewardDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  continueBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  continueGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
