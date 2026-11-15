import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  AccessibilityInfo,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { AwardRewardResult, DAILY_POINTS_TARGET } from '@/services/rewardService';
import { MOTION_EASINGS } from '@/constants/motion';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface RewardEarnedPopupProps {
  visible: boolean;
  data: AwardRewardResult | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onRetry?: () => void;
}

export default function RewardEarnedPopup({
  visible,
  data,
  loading = false,
  error = null,
  onClose,
  onRetry,
}: RewardEarnedPopupProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleCloseAndNavigateBack = (hapticStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    try { Haptics.impactAsync(hapticStyle); } catch (_) {}
    onClose();

    // If user is on daily-quiz-result, DO NOT kick them back to daily-quiz
    const currentPath = pathname || '';
    const isRootTab =
      currentPath === '/' ||
      currentPath === '/(tabs)' ||
      currentPath === '/(tabs)/index' ||
      currentPath === '/(tabs)/explore' ||
      currentPath === '/(tabs)/profile' ||
      currentPath === '/(tabs)/academic' ||
      currentPath === '/index';

    const isResultScreen =
      currentPath.includes('result') ||
      currentPath.includes('daily-quiz-result') ||
      currentPath.includes('rewards');

    if (!isRootTab && !isResultScreen && router.canGoBack()) {
      setTimeout(() => {
        try {
          if (router.canGoBack()) {
            router.back();
          }
        } catch (navErr) {
          console.warn('[RewardEarnedPopup] router.back error:', navErr);
        }
      }, 120);
    }
  };

  const isAlreadyEarned = Boolean(data?.alreadyEarned);
  const isGoalCompleted = Boolean(data?.dailyGoalReached);

  // Animations
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const badgeScale = useSharedValue(0.5);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReducedMotion(enabled);
    });
  }, []);

  // 10-second comfortable auto-dismiss if student doesn't tap
  useEffect(() => {
    if (!visible) return;
    const autoDismiss = setTimeout(() => {
      onClose();
    }, 10000);
    return () => clearTimeout(autoDismiss);
  }, [visible, onClose]);

  useEffect(() => {
    if (visible) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        });
      } catch (_) {}

      cardScale.value = withSpring(1, { damping: 18, stiffness: 280 });
      cardOpacity.value = withTiming(1, { duration: 180, easing: MOTION_EASINGS.decelerate });
      badgeScale.value = withSpring(1, { damping: 14, stiffness: 240 });

      if (data) {
        const targetPct = Math.min(1, Math.max(0, data.newPoints / (data.dailyGoal || DAILY_POINTS_TARGET)));
        progressWidth.value = 0;
        const t = setTimeout(() => {
          progressWidth.value = withTiming(targetPct, {
            duration: 800,
            easing: MOTION_EASINGS.standard,
          });
        }, 120);
        return () => clearTimeout(t);
      }
    } else {
      cardScale.value = 0.9;
      cardOpacity.value = 0;
      badgeScale.value = 0.5;
      progressWidth.value = 0;
    }
  }, [visible, data]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      accessibilityViewIsModal
      accessibilityLabel="Reward Notification"
    >
      <View style={[styles.overlay, { paddingBottom: Math.max(insets.bottom + 20, 24) }]}>
        {/* Animated Executive Modal Card */}
        <Animated.View
          style={[
            styles.card,
            animatedCardStyle,
            {
              backgroundColor: isDark ? '#0B101D' : '#FFFFFF',
              borderColor: isDark ? 'rgba(245, 158, 11, 0.4)' : 'rgba(245, 158, 11, 0.28)',
            },
          ]}
        >
          {/* Top Dismiss Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (_) {}
              onClose();
            }}
            activeOpacity={0.7}
            accessibilityLabel="Close reward modal"
          >
            <View style={[styles.closeIconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}>
              <Ionicons name="close" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            </View>
          </TouchableOpacity>

          {/* LOADING STATE */}
          {loading && (
            <View style={styles.stateCenterBox}>
              <ActivityIndicator size="large" color="#F59E0B" />
              <Text style={[styles.stateTitle, { color: colors.textPrimary }]}>Crediting Rewards...</Text>
              <Text style={[styles.stateSub, { color: colors.textMuted }]}>
                Synchronizing your FEEDX wallet and streak ledger.
              </Text>
            </View>
          )}

          {/* ERROR STATE */}
          {!loading && (error || !data?.success) && (
            <View style={styles.stateCenterBox}>
              <View style={[styles.statusIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.12)', borderColor: '#EF4444' }]}>
                <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
              </View>
              <Text style={[styles.stateTitle, { color: colors.textPrimary }]}>Notice</Text>
              <Text style={[styles.stateSub, { color: colors.textMuted }]}>
                {error || data?.errorMessage || 'Unable to register reward points at this time.'}
              </Text>
              {onRetry ? (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EF4444' }]} onPress={onRetry} activeOpacity={0.85}>
                  <Text style={styles.actionBtnText}>Retry Sync</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={onClose} activeOpacity={0.85}>
                  <Text style={styles.actionBtnText}>Dismiss</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ALREADY CLAIMED STATE */}
          {!loading && !error && data?.success && isAlreadyEarned && (
            <View style={styles.stateCenterBox}>
              <View style={[styles.statusIconBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5', borderColor: '#10B981' }]}>
                <Ionicons name="checkmark-done" size={30} color="#10B981" />
              </View>
              <Text style={[styles.stateTitle, { color: colors.textPrimary }]}>Tokens Already Credited</Text>
              <Text style={[styles.stateSub, { color: colors.textMuted }]}>
                Your rewards for this activity were already safely credited to your wallet today.
              </Text>
              <TouchableOpacity
                style={[styles.primaryActionBtn, { backgroundColor: '#10B981', marginTop: 12 }]}
                onPress={() => handleCloseAndNavigateBack(Haptics.ImpactFeedbackStyle.Light)}
                activeOpacity={0.85}
              >
                <Text style={styles.actionBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PROFESSIONAL CELEBRATORY SUCCESS STATE */}
          {!loading && !error && data?.success && !isAlreadyEarned && (
            <View style={styles.contentWrap}>
              {/* Radiant Golden Emblem */}
              <Animated.View style={[styles.emblemContainer, animatedBadgeStyle]}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706', '#92400E']}
                  style={styles.emblemGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome5 name="coins" size={30} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.emblemGlowHalo} />
              </Animated.View>

              {/* Upper Kicker Badge */}
              <View style={[styles.kickerBadge, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                <Ionicons name="sparkles" size={12} color="#F59E0B" />
                <Text style={styles.kickerBadgeText}>
                  {data.sourceLabel ? `${data.sourceLabel.toUpperCase()} • REWARD UNLOCKED` : 'MISSION COMPLETED'}
                </Text>
              </View>

              {/* Central Token Credited Pill */}
              <View style={[styles.tokenHeroBox, { backgroundColor: isDark ? '#111827' : '#F8FAFC', borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : '#FDE68A' }]}>
                <View style={styles.tokenAmountRow}>
                  <MaterialCommunityIcons name="flash" size={26} color="#F59E0B" />
                  <Text style={styles.tokenHeroAmount}>+{data.pointsAwarded}</Text>
                  <Text style={styles.tokenHeroUnit}>FEEDX TOKENS</Text>
                </View>
                <Text style={[styles.tokenHeroSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  DEPOSITED TO YOUR STUDENT WALLET
                </Text>
              </View>

              {/* Activity Name */}
              <Text style={[styles.activityTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                {data.activityName || 'Mission Accomplished'}
              </Text>

              {/* Stat Badges Row: Streak & Accuracy Score */}
              <View style={styles.statsRow}>
                {/* Streak Badge */}
                <View style={[styles.statPill, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2', borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : '#FECACA' }]}>
                  <Text style={{ fontSize: 13 }}>🔥</Text>
                  <Text style={[styles.statPillText, { color: '#EF4444' }]}>
                    {data.currentStreak > 1 ? `${data.currentStreak}-Day Streak` : 'Streak Active'}
                  </Text>
                </View>

                {/* Score or Status Pill */}
                {data.scoreText ? (
                  <View style={[styles.statPill, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5', borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : '#A7F3D0' }]}>
                    <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                    <Text style={[styles.statPillText, { color: '#10B981' }]}>{data.scoreText}</Text>
                  </View>
                ) : (
                  <View style={[styles.statPill, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : '#EFF6FF', borderColor: isDark ? 'rgba(59, 130, 246, 0.25)' : '#BFDBFE' }]}>
                    <Ionicons name="wallet-outline" size={13} color="#3B82F6" />
                    <Text style={[styles.statPillText, { color: '#3B82F6' }]}>Wallet Synced</Text>
                  </View>
                )}
              </View>

              {/* Daily Progress Gauge */}
              <View style={[styles.progressCard, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC', borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0' }]}>
                <View style={styles.progressHeaderRow}>
                  <Text style={[styles.progressLabel, { color: colors.textMuted }]}>Today&apos;s Target Progress</Text>
                  <Text style={[styles.progressNumbers, { color: colors.textPrimary }]}>
                    <Text style={{ fontWeight: '900', color: isGoalCompleted ? '#10B981' : '#F59E0B' }}>
                      {data.newPoints}
                    </Text>{' '}
                    / {data.dailyGoal} Tokens
                  </Text>
                </View>

                {/* Progress Track */}
                <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      { backgroundColor: isGoalCompleted ? '#10B981' : '#F59E0B' },
                      animatedProgressStyle,
                    ]}
                  />
                </View>

                {isGoalCompleted && (
                  <View style={styles.goalBanner}>
                    <Ionicons name="checkmark-done-circle" size={14} color="#10B981" />
                    <Text style={styles.goalBannerText}>Daily 150 Token Target Completed! 🎯</Text>
                  </View>
                )}
              </View>

              {/* Primary Call to Action Button */}
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() => handleCloseAndNavigateBack(Haptics.ImpactFeedbackStyle.Medium)}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={['#2563EB', '#1D4ED8']}
                  style={styles.btnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="checkmark-circle" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>Awesome, Continue</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Secondary Rewards Ledger Link */}
              <TouchableOpacity
                style={styles.secondaryLinkBtn}
                onPress={() => {
                  onClose();
                  router.push('/rewards');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryLinkText}>View Rewards Ledger & Gold Store ➔</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 390,
    borderRadius: 26,
    borderWidth: 1.5,
    padding: 24,
    alignItems: 'center',
    elevation: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    padding: 4,
  },
  closeIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateCenterBox: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  statusIconBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  contentWrap: {
    width: '100%',
    alignItems: 'center',
  },
  emblemContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emblemGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  emblemGlowHalo: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    zIndex: -1,
  },
  kickerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  kickerBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 0.7,
  },
  tokenHeroBox: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1.2,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tokenAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tokenHeroAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: -0.5,
  },
  tokenHeroUnit: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F59E0B',
    marginLeft: 4,
    letterSpacing: 0.4,
  },
  tokenHeroSub: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 3,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressNumbers: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.2)',
  },
  goalBannerText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#10B981',
  },
  primaryActionBtn: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    width: '100%',
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  secondaryLinkBtn: {
    marginTop: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  secondaryLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#3B82F6',
  },
});
