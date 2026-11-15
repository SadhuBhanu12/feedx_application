import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useGamification } from '@/context/GamificationContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { SPACING, RADIUS, FONT } from '@/constants/theme';
import { roadmapService } from '@/services/roadmapService';
import { DAILY_TARGET_TOKENS } from '@/constants/rewardConfig';

const { width } = Dimensions.get('window');

const MILESTONES = [
  { coins: 5, reward: 'Verified Learner Certificate' },
  { coins: 10, reward: 'Academic Excellence Certificate' },
  { coins: 50, reward: 'Annual Excellence Award' },
];

export default function GamificationDashboard() {
  const { wallet, streak, transactions, todayPoints: ctxTodayPoints, dailyGoal: ctxDailyGoal, loading } = useGamification();
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  // 1. Get Today's Date String
  const getTodayStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getTodayStr();

  const isToday = (t: { created_at?: string; reference_id?: string | null }) => {
    if (t.reference_id && t.reference_id.includes(todayStr)) return true;
    if (!t.created_at) return false;
    try {
      const txDate = new Date(t.created_at);
      const yyyy = txDate.getFullYear();
      const mm = String(txDate.getMonth() + 1).padStart(2, '0');
      const dd = String(txDate.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}` === todayStr;
    } catch (e) {
      return false;
    }
  };

  // 2. Extract Gamification State
  const xpPoints = streak?.xp_points !== undefined ? streak.xp_points : (user?.xp_points ?? user?.xp ?? 0);
  const tokens = wallet?.tokens !== undefined ? wallet.tokens : (user?.tokens ?? xpPoints);
  const coins = wallet?.gold_coins !== undefined ? wallet.gold_coins : (user?.gold_coins ?? user?.coins ?? 0);
  const currentStreak = streak?.current_streak !== undefined ? streak.current_streak : (user?.streak_count ?? user?.streak ?? 0);
  const userLevel = Math.max(1, Math.floor(xpPoints / 1000) + 1);

  // 3. Calculate Today's Points dynamically
  const dailyGoal = ctxDailyGoal || DAILY_TARGET_TOKENS;
  const todayPoints = ctxTodayPoints !== undefined ? ctxTodayPoints : 0;
  const progressPercent = Math.min((todayPoints / dailyGoal) * 100, 100);
  const remainingPoints = Math.max(dailyGoal - todayPoints, 0);

  // 4. Calculate Roadmap Progress dynamically from MMKV storage
  const [roadmapData, setRoadmapData] = useState<{
    title: string;
    currentDay: number;
    totalDays: number;
    daysRemaining: number;
    progressPercent: number;
    hasRoadmap: boolean;
  }>({
    title: 'No Active Roadmap',
    currentDay: 0,
    totalDays: 30,
    daysRemaining: 30,
    progressPercent: 0,
    hasRoadmap: false,
  });

  useEffect(() => {
    const loadActiveRoadmap = () => {
      try {
        const summary = roadmapService.getActiveRoadmapSummary();
        const progressPercent = summary.percentage;
        const currentDay = Math.min(Math.round((summary.percentage / 100) * 30), 30);
        const daysRemaining = Math.max(0, 30 - currentDay);

        setRoadmapData({
          title: summary.title,
          currentDay,
          totalDays: 30,
          daysRemaining,
          progressPercent,
          hasRoadmap: summary.hasActiveRoadmap,
        });
      } catch (err) {
        console.warn('loadActiveRoadmap error:', err);
        setRoadmapData({
          title: 'No Active Roadmap',
          currentDay: 0,
          totalDays: 30,
          daysRemaining: 30,
          progressPercent: 0,
          hasRoadmap: false,
        });
      }
    };

    loadActiveRoadmap();
  }, [transactions]);

  // 5. Calculate Next Milestone Progress
  const nextMilestone = useMemo(() => {
    const next = MILESTONES.find((m) => m.coins > coins) || MILESTONES[MILESTONES.length - 1];
    const target = next.coins;
    const remaining = Math.max(target - coins, 0);
    const percent = Math.min((coins / target) * 100, 100);

    return {
      coinsRequired: target,
      remainingCoins: remaining,
      progressPercent: percent,
      rewardName: next.reward,
    };
  }, [coins]);

  // 6. Calculate Weekly Progress dynamically from transaction dates
  const weeklyProgress = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      const daysComplete = Math.min(currentStreak > 0 ? (currentStreak % 7 || 7) : 0, 7);
      const percent = Math.round((daysComplete / 7) * 100);
      return { percent, daysComplete };
    }

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    });

    let daysComplete = 0;
    last7Days.forEach((day) => {
      const hasTx = transactions.some((t) => {
        if (!t.created_at) return false;
        try {
          const txDate = new Date(t.created_at);
          const yyyy = txDate.getFullYear();
          const mm = String(txDate.getMonth() + 1).padStart(2, '0');
          const dd = String(txDate.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}` === day;
        } catch (_) {
          return false;
        }
      });
      if (hasTx) daysComplete++;
    });

    if (daysComplete === 0 && currentStreak > 0) {
      daysComplete = Math.min(currentStreak, 7);
    }

    const percent = Math.round((daysComplete / 7) * 100);
    return {
      percent,
      daysComplete,
    };
  }, [transactions, currentStreak]);

  // 7. Micro-animation state
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View 
      entering={FadeInDown.delay(100).duration(550).springify()}
      style={[styles.container, animStyle, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
    >
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <FontAwesome5 name="chart-line" size={14} color="#3B82F6" />
          <Text style={[styles.seasonTitle, { color: colors.textPrimary }]}>STUDENT PERFORMANCE</Text>
        </View>
        <TouchableOpacity 
          style={[styles.walletBtn, { backgroundColor: isDark ? 'rgba(234, 179, 8, 0.12)' : '#FEF08A' }]}
          onPress={() => router.push('/rewards')}
          onPressIn={() => { scale.value = withSpring(0.97); }}
          onPressOut={() => { scale.value = withSpring(1); }}
        >
          <MaterialCommunityIcons name="wallet-outline" size={13} color="#854D0E" />
          <Text style={styles.walletBtnText}>Wallet</Text>
        </TouchableOpacity>
      </View>

      {/* Grid Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{xpPoints}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <MaterialCommunityIcons name="star-outline" size={12} color={colors.textMuted} />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Points</Text>
          </View>
        </View>

        <View style={[styles.statBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: '#EAB308' }]}>{coins}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <MaterialCommunityIcons name="circle-multiple-outline" size={12} color="#EAB308" />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Coins</Text>
          </View>
        </View>

        <View style={[styles.statBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>{currentStreak}d</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <MaterialCommunityIcons name="fire" size={12} color="#EF4444" />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Streak</Text>
          </View>
        </View>

        <View style={[styles.statBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: '#3B82F6' }]}>{userLevel}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <MaterialCommunityIcons name="shield-star-outline" size={12} color="#3B82F6" />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Level</Text>
          </View>
        </View>
      </View>


      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* 1. Today's Progress */}
      <TouchableOpacity 
        style={styles.section} 
        activeOpacity={0.8}
        onPress={() => router.push('/daily-quiz')}
      >
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today&apos;s Progress</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
          </View>
          <Text style={[styles.sectionValue, { color: colors.textSecondary }]}>{todayPoints} / {dailyGoal} Points</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
          <View style={[styles.progressBar, { width: `${progressPercent}%`, backgroundColor: '#10B981' }]} />
        </View>
        <Text style={[styles.sectionFooter, { color: colors.textMuted }]}>
          {todayPoints >= dailyGoal ? `Daily Goal Complete! +${todayPoints} Points earned` : `${remainingPoints} Points remaining`}
        </Text>
      </TouchableOpacity>

      {/* 2. Roadmap Progress */}
      <TouchableOpacity 
        style={styles.section} 
        activeOpacity={0.8}
        onPress={() => router.push('/roadmap')}
      >
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Active Roadmap: {roadmapData.title}</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
          </View>
          <Text style={[styles.sectionValue, { color: colors.textSecondary }]}>{roadmapData.progressPercent}% Completed</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
          <View style={[styles.progressBar, { width: `${roadmapData.progressPercent}%`, backgroundColor: '#3B82F6' }]} />
        </View>
        <Text style={[styles.sectionFooter, { color: colors.textMuted }]}>
          {roadmapData.hasRoadmap ? `${roadmapData.daysRemaining} Days Remaining (${roadmapData.progressPercent}% Done)` : 'Create your career plan now'}
        </Text>
      </TouchableOpacity>

      {/* 2b. Gold Coin Progress (1 Coin = 1,000 Tokens) */}
      <TouchableOpacity 
        style={styles.section} 
        activeOpacity={0.8}
        onPress={() => router.push('/rewards')}
      >
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Progress to Next Gold Coin</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
          </View>
          <Text style={[styles.sectionValue, { color: '#F59E0B' }]}>
            {(tokens % 1000)} / 1,000 Tokens ({Math.round(((tokens % 1000) / 1000) * 100)}%)
          </Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
          <View style={[styles.progressBar, { width: `${Math.min(((tokens % 1000) / 1000) * 100, 100)}%`, backgroundColor: '#F59E0B' }]} />
        </View>
        <Text style={[styles.sectionFooter, { color: colors.textMuted }]}>
          {Math.floor(tokens / 1000)} Earned Coins • {1000 - (tokens % 1000)} Tokens remaining for next coin
        </Text>
      </TouchableOpacity>

      {/* 3. Next Milestone Achievement */}
      <TouchableOpacity 
        style={styles.section} 
        activeOpacity={0.8}
        onPress={() => router.push('/rewards')}
      >
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Next Achievement</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
          </View>
          <Text style={[styles.sectionValue, { color: colors.textSecondary }]}>{coins} / {nextMilestone.coinsRequired} Coins</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
          <View style={[styles.progressBar, { width: `${nextMilestone.progressPercent}%`, backgroundColor: '#F59E0B' }]} />
        </View>
        <Text style={[styles.sectionFooter, { color: colors.textMuted }]}>
          {coins >= nextMilestone.coinsRequired 
            ? `🎉 Unlocked: ${nextMilestone.rewardName}` 
            : `${nextMilestone.remainingCoins} Coin(s) remaining for ${nextMilestone.rewardName}`}
        </Text>
      </TouchableOpacity>

      {/* 4. Weekly Progress */}
      <TouchableOpacity 
        style={styles.section} 
        activeOpacity={0.8}
        onPress={() => router.push('/rewards')}
      >
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Weekly Progress</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
          </View>
          <Text style={[styles.sectionValue, { color: colors.textSecondary }]}>{weeklyProgress.percent}%</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
          <View style={[styles.progressBar, { width: `${weeklyProgress.percent}%`, backgroundColor: '#8B5CF6' }]} />
        </View>
        <Text style={[styles.sectionFooter, { color: colors.textMuted }]}>
          {weeklyProgress.daysComplete} / 7 Days Complete (Current Bonus: +{weeklyProgress.percent >= 100 ? '1000' : weeklyProgress.percent >= 80 ? '850' : weeklyProgress.percent >= 60 ? '600' : '0'} Points)
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seasonTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  walletBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  walletBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  section: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  sectionFooter: {
    fontSize: 10,
    fontWeight: '600',
  },
});
