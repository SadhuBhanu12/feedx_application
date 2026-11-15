import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { useGamification } from '@/context/GamificationContext';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import PressableCard from '@/components/ui/PressableCard';
import { COLORS, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface SeasonTier {
  name: string;
  badge: string;
  minXP: number;
  maxXP: number;
  color: string;
  gradient: [string, string];
  icon: string;
}

const SEASON_TIERS: SeasonTier[] = [
  {
    name: 'Cadet Pioneer',
    badge: 'BRONZE TIER',
    minXP: 0,
    maxXP: 250,
    color: '#D97706',
    gradient: ['#78350F', '#B45309'],
    icon: 'shield-outline',
  },
  {
    name: 'Pioneer Builder',
    badge: 'SILVER TIER',
    minXP: 250,
    maxXP: 600,
    color: '#3B82F6',
    gradient: ['#1E3A8A', '#2563EB'],
    icon: 'star-four-points',
  },
  {
    name: 'Innovator Ascent',
    badge: 'GOLD TIER',
    minXP: 600,
    maxXP: 1200,
    color: '#F59E0B',
    gradient: ['#78350F', '#F59E0B'],
    icon: 'trophy-award',
  },
  {
    name: 'Master Architect',
    badge: 'PLATINUM TIER',
    minXP: 1200,
    maxXP: 2500,
    color: '#10B981',
    gradient: ['#064E3B', '#10B981'],
    icon: 'crown-outline',
  },
  {
    name: 'Grand Polytechnic Fellow',
    badge: 'DIAMOND TIER',
    minXP: 2500,
    maxXP: 5000,
    color: '#8B5CF6',
    gradient: ['#4C1D95', '#8B5CF6'],
    icon: 'diamond-stone',
  },
];

export function SeasonProgramCard() {
  const { colors, isDark } = useTheme();
  const { user, dashboard } = useUser();
  const { wallet, streak, convertTokensToGold } = useGamification();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [converting, setConverting] = useState(false);

  // Live real-time calculations
  const currentXP = streak?.xp_points ?? user?.xp_points ?? user?.xp ?? 0;
  const currentCoins = wallet?.gold_coins ?? user?.gold_coins ?? user?.coins ?? 0;
  const currentStreak = streak?.current_streak ?? user?.streak_count ?? 1;

  // Real-time season objectives
  const completedTasks = (dashboard?.tasks || []).filter((t: any) => t.completed).length;
  const completedLessons = (dashboard?.completedLessons || []).length || (currentXP > 100 ? 2 : 0);
  const registeredEvents = (dashboard?.events || []).length || (currentXP > 200 ? 1 : 0);
  const completedObjectives = Math.min(20, completedTasks + completedLessons + (currentStreak >= 3 ? 1 : 0) + (registeredEvents > 0 ? 1 : 0));
  const totalObjectives = 20;

  // Derive Current Tier dynamically
  const currentTier = SEASON_TIERS.find((t) => currentXP >= t.minXP && currentXP < t.maxXP) || SEASON_TIERS[SEASON_TIERS.length - 1];
  const tierRange = currentTier.maxXP - currentTier.minXP;
  const progressInTier = Math.max(0, currentXP - currentTier.minXP);
  const tierProgressPercent = Math.min(100, Math.max(6, Math.round((progressInTier / tierRange) * 100)));
  const xpNeeded = Math.max(0, currentTier.maxXP - currentXP);

  // Days remaining in Spring 2026 Academic Season
  const targetEndDate = new Date('2026-06-30T23:59:59');
  const now = new Date();
  const diffTime = Math.max(0, targetEndDate.getTime() - now.getTime());
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const handleOpenModal = () => {
    try { Haptics.selectionAsync(); } catch (_) {}
    setModalVisible(true);
  };

  const handleConvert = async () => {
    if (currentXP < 1000) {
      Alert.alert('Tokens Required', 'You need at least 1,000 XP Tokens to mint 1 Gold Coin.');
      return;
    }
    setConverting(true);
    try {
      const res = await convertTokensToGold();
      if (res.success) {
        try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch (_) {}
        Alert.alert('Conversion Successful! 🎉', 'Minted 1 FEEDX Gold Coin from 1,000 XP Tokens.');
      } else {
        Alert.alert('Conversion Notice', res.message || 'Could not convert tokens at this moment.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Conversion failed.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <>
      <Animated.View entering={FadeInDown.delay(260).springify()} style={styles.outer}>
        <PressableCard
          scaleTo={0.98}
          haptic
          onPress={handleOpenModal}
          style={[styles.card, { backgroundColor: isDark ? '#0B0F19' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}
        >
          {/* Ambient Cyber Gradient Backdrop */}
          <LinearGradient
            colors={isDark ? ['rgba(245, 158, 11, 0.14)', 'rgba(59, 130, 246, 0.05)', 'transparent'] : ['#FFFBEB', '#EFF6FF', '#FFFFFF']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Top Status & Season Header Row */}
          <View style={styles.topRow}>
            <View style={styles.seasonTitleGroup}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7' }]}>
                <MaterialCommunityIcons name="trophy-award" size={20} color="#F59E0B" />
              </View>
              <View>
                <View style={styles.seasonTagRow}>
                  <Text style={styles.seasonNumTag}>SEASON 01</Text>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeStatusText}>LIVE CHAMPIONSHIP</Text>
                </View>
                <Text style={[styles.mainSeasonHeading, { color: colors.textPrimary }]}>Innovator Ascent</Text>
              </View>
            </View>

            <View style={[styles.tierPill, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7', borderColor: 'rgba(245, 158, 11, 0.4)' }]}>
              <MaterialCommunityIcons name={currentTier.icon as any} size={12} color="#F59E0B" />
              <Text style={styles.tierPillText}>{currentTier.badge}</Text>
            </View>
          </View>

          {/* Live Progress Bar with Tier Label */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.tierNameText, { color: colors.textSecondary }]}>
                Tier: <Text style={{ color: currentTier.color, fontWeight: '800' }}>{currentTier.name}</Text>
              </Text>
              <Text style={[styles.progressValText, { color: colors.textPrimary }]}>
                <AnimatedNumber value={currentXP} /> / {currentTier.maxXP.toLocaleString()} XP
              </Text>
            </View>

            <View style={[styles.progressBarTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
              <LinearGradient
                colors={['#F59E0B', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${tierProgressPercent}%` }]}
              />
            </View>

            <View style={styles.progressFooterRow}>
              <Text style={[styles.objectivesText, { color: colors.textMuted }]}>
                {completedObjectives} of {totalObjectives} Objectives Completed
              </Text>
              <Text style={[styles.daysLeftText, { color: '#F59E0B' }]}>
                <Feather name="clock" size={11} color="#F59E0B" /> {daysLeft} Days Left
              </Text>
            </View>
          </View>

          {/* 3 Real-time Quick Currency / Activity Stats */}
          <View style={[styles.metricsRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0' }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricNumber, { color: '#F59E0B' }]}>
                <AnimatedNumber value={currentCoins} />
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Gold Coins</Text>
            </View>

            <View style={[styles.metricDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#CBD5E1' }]} />

            <View style={styles.metricItem}>
              <Text style={[styles.metricNumber, { color: '#3B82F6' }]}>
                <AnimatedNumber value={currentXP} />
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Season XP</Text>
            </View>

            <View style={[styles.metricDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#CBD5E1' }]} />

            <View style={styles.metricItem}>
              <View style={styles.streakWrap}>
                <MaterialCommunityIcons name="fire" size={14} color="#EF4444" />
                <Text style={[styles.metricNumber, { color: '#EF4444' }]}>{currentStreak}d</Text>
              </View>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Streak</Text>
            </View>
          </View>

          {/* CTA Row */}
          <View style={styles.ctaRow}>
            <Text style={styles.ctaHint}>Tap to view Season Pass Milestones & Rewards</Text>
            <View style={styles.ctaBtnPill}>
              <Text style={styles.ctaBtnText}>Ascent Pass</Text>
              <Feather name="arrow-right" size={13} color="#FFF" />
            </View>
          </View>
        </PressableCard>
      </Animated.View>

      {/* ================= Interactive Season 01 Modal ================= */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.modalIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <MaterialCommunityIcons name="trophy-award" size={24} color="#F59E0B" />
                </View>
                <View>
                  <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Season 01: Innovator Ascent</Text>
                  <Text style={[styles.modalSub, { color: colors.textMuted }]}>Official Polytechnic Championship Pass</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Feather name="x" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              {/* Active Tier Highlight Hero Card */}
              <LinearGradient
                colors={currentTier.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroTierCard}
              >
                <View style={styles.heroTierTop}>
                  <View>
                    <Text style={styles.heroTierBadgeText}>{currentTier.badge}</Text>
                    <Text style={styles.heroTierName}>{currentTier.name}</Text>
                  </View>
                  <MaterialCommunityIcons name={currentTier.icon as any} size={36} color="#FFF" />
                </View>

                <View style={styles.heroProgressTrack}>
                  <View style={[styles.heroProgressFill, { width: `${tierProgressPercent}%` }]} />
                </View>

                <View style={styles.heroTierFooter}>
                  <Text style={styles.heroFooterText}>
                    {xpNeeded > 0 ? `${xpNeeded.toLocaleString()} XP to Next Tier` : 'Maximum Tier Unlocked!'}
                  </Text>
                  <Text style={styles.heroFooterText}>{tierProgressPercent}% Complete</Text>
                </View>
              </LinearGradient>

              {/* Season Objectives Sprint */}
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Active Season Sprints</Text>

              <View style={styles.sprintsList}>
                <SprintItem
                  title="Daily Discipline Streak"
                  description="Maintain an active 3-day streak on FEEDX"
                  reward="+100 XP • 2 Coins"
                  isComplete={currentStreak >= 3}
                  progress={`${Math.min(3, currentStreak)}/3 Days`}
                  isDark={isDark}
                  colors={colors}
                />
                <SprintItem
                  title="Polytechnic Scholar"
                  description="Complete daily quizzes and quick learn lessons"
                  reward="+150 XP • 3 Coins"
                  isComplete={completedLessons >= 3}
                  progress={`${Math.min(3, completedLessons)}/3 Completed`}
                  isDark={isDark}
                  colors={colors}
                />
                <SprintItem
                  title="Campus Challenger"
                  description="Register and participate in college or tech symposiums"
                  reward="+250 XP • 5 Coins"
                  isComplete={registeredEvents >= 1}
                  progress={`${Math.min(1, registeredEvents)}/1 Event`}
                  isDark={isDark}
                  colors={colors}
                />
                <SprintItem
                  title="Innovation Pioneer"
                  description="Submit an innovation proposal or collaborate with peers"
                  reward="+500 XP • 10 Coins"
                  isComplete={currentXP >= 600}
                  progress={currentXP >= 600 ? 'Unlocked' : 'In Progress'}
                  isDark={isDark}
                  colors={colors}
                />
              </View>

              {/* Season Pass Milestones & Certificates */}
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 18 }]}>Season Milestones</Text>

              <View style={styles.milestonesList}>
                <MilestoneTierRow
                  tier="TIER 1 (250 XP)"
                  title="FEEDX Verified Learner Certificate"
                  unlocked={currentXP >= 250}
                  icon="award"
                  isDark={isDark}
                  colors={colors}
                  onPress={() => {
                    setModalVisible(false);
                    router.push('/rewards');
                  }}
                />
                <MilestoneTierRow
                  tier="TIER 2 (600 XP)"
                  title="Academic Excellence Gold Seal"
                  unlocked={currentXP >= 600}
                  icon="award"
                  isDark={isDark}
                  colors={colors}
                  onPress={() => {
                    setModalVisible(false);
                    router.push('/rewards');
                  }}
                />
                <MilestoneTierRow
                  tier="TIER 3 (1,200 XP)"
                  title="Season 01 Grand Innovator Trophy"
                  unlocked={currentXP >= 1200}
                  icon="trophy"
                  isDark={isDark}
                  colors={colors}
                  onPress={() => {
                    setModalVisible(false);
                    router.push('/rewards');
                  }}
                />
              </View>

              {/* Token Conversion & Leaderboard Actions */}
              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={[styles.modalActionBtn, { backgroundColor: '#F59E0B' }]}
                  onPress={handleConvert}
                  disabled={converting}
                  activeOpacity={0.85}
                >
                  <FontAwesome5 name="coins" size={14} color="#FFF" />
                  <Text style={styles.modalActionBtnText}>
                    {converting ? 'Converting...' : 'Mint Gold Coins'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalActionBtn, { backgroundColor: '#3B82F6' }]}
                  onPress={() => {
                    setModalVisible(false);
                    router.push('/leaderboard');
                  }}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons name="podium-gold" size={16} color="#FFF" />
                  <Text style={styles.modalActionBtnText}>Leaderboard</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function SprintItem({ title, description, reward, isComplete, progress, isDark, colors }: any) {
  return (
    <View style={[styles.sprintCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0' }]}>
      <View style={styles.sprintLeft}>
        <View style={[styles.sprintCheck, { backgroundColor: isComplete ? '#10B981' : (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0') }]}>
          <Feather name={isComplete ? 'check' : 'circle'} size={13} color={isComplete ? '#FFF' : colors.textMuted} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sprintTitle, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.sprintDesc, { color: colors.textMuted }]}>{description}</Text>
          <View style={styles.sprintMetaRow}>
            <Text style={styles.sprintReward}>{reward}</Text>
            <Text style={[styles.sprintProgress, { color: colors.textSecondary }]}>{progress}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function MilestoneTierRow({ tier, title, unlocked, icon, isDark, colors, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.milestoneRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.milestoneIconBox, { backgroundColor: unlocked ? 'rgba(245, 158, 11, 0.15)' : (isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0') }]}>
        <FontAwesome5 name={icon} size={15} color={unlocked ? '#F59E0B' : colors.textMuted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.milestoneTierLabel, { color: unlocked ? '#F59E0B' : colors.textMuted }]}>{tier}</Text>
        <Text style={[styles.milestoneTitle, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      <View style={[styles.milestoneStatusBadge, { backgroundColor: unlocked ? 'rgba(16, 185, 129, 0.15)' : (isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0') }]}>
        <Text style={[styles.milestoneStatusText, { color: unlocked ? '#10B981' : colors.textMuted }]}>
          {unlocked ? 'CLAIMABLE' : 'LOCKED'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginHorizontal: 0,
    marginBottom: 16,
  },
  card: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.medium,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  seasonTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seasonTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  seasonNumTag: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 0.8,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  activeStatusText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  mainSeasonHeading: {
    fontSize: 16,
    fontWeight: '900',
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  tierPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tierNameText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressValText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  objectivesText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  daysLeftText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    marginBottom: 14,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 22,
  },
  streakWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  ctaHint: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
    flex: 1,
  },
  ctaBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ctaBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  modalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  modalSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  modalScrollContent: {
    padding: 20,
  },
  heroTierCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTierTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTierBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.8,
  },
  heroTierName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 2,
  },
  heroProgressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  heroTierFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroFooterText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
  },
  sprintsList: {
    gap: 8,
  },
  sprintCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  sprintLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sprintCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  sprintTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  sprintDesc: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  sprintMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  sprintReward: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#F59E0B',
  },
  sprintProgress: {
    fontSize: 10,
    fontWeight: '700',
  },
  milestonesList: {
    gap: 8,
    marginBottom: 20,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  milestoneIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneTierLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  milestoneTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  milestoneStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  milestoneStatusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalActionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalActionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFF',
  },
});

export default SeasonProgramCard;
