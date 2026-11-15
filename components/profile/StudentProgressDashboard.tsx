import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { DAILY_TARGET_TOKENS } from '@/constants/rewardConfig';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/constants/motion';

interface StudentProgressDashboardProps {
  totalPoints: number;
  totalCoins: number;
  todayPoints?: number;
  dailyTarget?: number;
  learningProgressPct?: number;
  quizzesCompleted?: number;
}

export function StudentProgressDashboard({
  totalPoints = 12450,
  totalCoins = 12,
  todayPoints = 90,
  dailyTarget = DAILY_TARGET_TOKENS,
  learningProgressPct = 68,
  quizzesCompleted = 24,
}: StudentProgressDashboardProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const progressRatio = Math.min(1, Math.max(0, todayPoints / dailyTarget));
  const progressPercent = Math.round(progressRatio * 100);

  const fillAnim = useSharedValue(0);

  useEffect(() => {
    fillAnim.value = 0;
    const t = setTimeout(() => {
      fillAnim.value = withTiming(progressPercent, {
        duration: MOTION_DURATIONS.progressBar,
        easing: MOTION_EASINGS.standard,
      });
    }, 100);
    return () => clearTimeout(t);
  }, [progressPercent]);

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: `${fillAnim.value}%`,
  }));

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>STUDENT PROGRESS</Text>

      {/* Main Metric Cards Grid */}
      <View style={styles.metricsGrid}>
        {/* Card 1: FEEDX Points */}
        <TouchableOpacity
          style={[styles.metricCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
          onPress={() => {
            try { Haptics.selectionAsync(); } catch (_) {}
            router.push('/rewards');
          }}
          activeOpacity={0.85}
        >
          <View style={[styles.iconPill, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }]}>
            <Feather name="zap" size={17} color="#2563EB" />
          </View>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{totalPoints.toLocaleString()}</Text>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>FEEDX Points</Text>
        </TouchableOpacity>

        {/* Card 2: FEEDX Coins */}
        <TouchableOpacity
          style={[styles.metricCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
          onPress={() => {
            try { Haptics.selectionAsync(); } catch (_) {}
            router.push('/rewards');
          }}
          activeOpacity={0.85}
        >
          <View style={[styles.iconPill, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7' }]}>
            <MaterialCommunityIcons name="bitcoin" size={19} color="#F59E0B" />
          </View>
          <Text style={[styles.metricValue, { color: '#F59E0B' }]}>{totalCoins}</Text>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>FEEDX Coins</Text>
        </TouchableOpacity>

        {/* Card 3: Learning Progress */}
        <TouchableOpacity
          style={[styles.metricCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
          onPress={() => {
            try { Haptics.selectionAsync(); } catch (_) {}
            router.push('/roadmap');
          }}
          activeOpacity={0.85}
        >
          <View style={[styles.iconPill, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
            <Feather name="trending-up" size={17} color="#10B981" />
          </View>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{learningProgressPct}%</Text>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Roadmap Progress</Text>
        </TouchableOpacity>

        {/* Card 4: Quiz Activity */}
        <TouchableOpacity
          style={[styles.metricCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
          onPress={() => {
            try { Haptics.selectionAsync(); } catch (_) {}
            router.push('/daily-quiz');
          }}
          activeOpacity={0.85}
        >
          <View style={[styles.iconPill, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF' }]}>
            <Feather name="check-square" size={17} color="#8B5CF6" />
          </View>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{quizzesCompleted}</Text>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Quizzes Done</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Progress Goal Bar */}
      <View style={[styles.dailyGoalCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}>
        <View style={styles.dailyGoalHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Feather name="target" size={15} color="#2563EB" />
            <Text style={[styles.dailyGoalTitle, { color: colors.textPrimary }]}>Today&apos;s Target</Text>
          </View>
          <Text style={[styles.dailyGoalCount, { color: colors.textPrimary }]}>
            <Text style={{ fontWeight: '900', color: '#2563EB' }}>{todayPoints}</Text> / {dailyTarget} Points
          </Text>
        </View>

        {/* Progress Track */}
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}>
          <Animated.View style={[styles.progressFill, { backgroundColor: '#2563EB' }, animatedFillStyle]} />
        </View>

        <Text style={[styles.dailyGoalSub, { color: colors.textMuted }]}>
          {todayPoints >= dailyTarget ? '🎉 Daily goal completed!' : `Earn ${dailyTarget - todayPoints} more points from daily tasks`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48.3%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 4,
  },
  iconPill: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  dailyGoalCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyGoalTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  dailyGoalCount: {
    fontSize: 12.5,
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
  dailyGoalSub: {
    fontSize: 11,
    fontWeight: '500',
  },
});
