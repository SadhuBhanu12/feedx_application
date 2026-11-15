import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useGamification } from '@/context/GamificationContext';
import { useUser } from '@/context/UserContext';

interface ProfileStreakTrackerProps {
  currentStreak?: number;
  longestStreak?: number;
  isCompletedToday?: boolean;
}

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function ProfileStreakTracker({
  currentStreak: propStreak,
  longestStreak: propLongest,
  isCompletedToday: propCompletedToday,
}: ProfileStreakTrackerProps) {
  const { colors, isDark } = useTheme();
  const { streak, transactions } = useGamification();
  const { user } = useUser();

  const realStreak = propStreak !== undefined ? propStreak : (streak?.current_streak ?? user?.streak_count ?? user?.streak ?? 0);
  const realLongest = propLongest !== undefined ? propLongest : (streak?.longest_streak ?? user?.max_streak ?? user?.longest_streak ?? realStreak);

  // Calculate day index (0 = Monday, ..., 6 = Sunday)
  const now = new Date();
  const todayDayIndex = (now.getDay() + 6) % 7;

  // Real-time active days map for the current week
  const weekActiveMap = useMemo(() => {
    const monday = new Date(now);
    monday.setDate(now.getDate() - todayDayIndex);

    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      weekDates.push(`${y}-${m}-${dd}`);
    }

    const txDates = new Set<string>();
    (transactions || []).forEach((t) => {
      if (t.created_at) {
        try {
          const d = new Date(t.created_at);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          txDates.add(`${y}-${m}-${dd}`);
        } catch (_) {}
      }
      if (t.reference_id) {
        const match = t.reference_id.match(/\d{4}-\d{2}-\d{2}/);
        if (match) txDates.add(match[0]);
      }
    });

    const activeMap: Record<number, boolean> = {};
    weekDates.forEach((dateStr, idx) => {
      const isPastOrToday = idx <= todayDayIndex;
      const daysAgo = todayDayIndex - idx;
      const hasTx = txDates.has(dateStr);
      const inStreak = isPastOrToday && realStreak > 0 && daysAgo < realStreak;
      activeMap[idx] = hasTx || inStreak;
    });

    return activeMap;
  }, [transactions, realStreak, todayDayIndex]);

  const isCompletedToday = propCompletedToday !== undefined ? propCompletedToday : !!weekActiveMap[todayDayIndex];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.streakInfoGroup}>
          <View style={styles.fireIconWrapper}>
            <Ionicons name="flame" size={20} color="#F59E0B" />
          </View>
          <View>
            <Text style={[styles.streakTitle, { color: colors.textPrimary }]}>{realStreak} Day Streak</Text>
            <Text style={[styles.streakSub, { color: colors.textMuted }]}>Keep learning every day</Text>
          </View>
        </View>

        <View style={[styles.bestStreakPill, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7' }]}>
          <Text style={styles.bestStreakPillText}>Best: {realLongest} Days</Text>
        </View>
      </View>

      {/* 7-Day Weekly Activity Visualizer (M T W T F S S) */}
      <View style={styles.weekGridRow}>
        {WEEK_DAYS.map((dayLabel, idx) => {
          const isActive = !!weekActiveMap[idx];
          const isToday = idx === todayDayIndex;

          return (
            <View key={idx} style={styles.dayColumn}>
              <View
                style={[
                  styles.dayCircle,
                  isActive && styles.dayCircleCompleted,
                  isToday && !isActive && styles.dayCircleToday,
                  !isActive && { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }
                ]}
              >
                {isActive ? (
                  <Feather name="check" size={13} color="#FFFFFF" />
                ) : isToday ? (
                  <Ionicons name="flame" size={14} color="#F59E0B" />
                ) : (
                  <View style={[styles.emptyDot, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1' }]} />
                )}
              </View>
              <Text style={[styles.dayLabel, isToday && { color: '#2563EB', fontWeight: '800' }, { color: colors.textMuted }]}>
                {dayLabel}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Footer Activity Status Indicator */}
      <View style={[styles.footerStatusRow, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
        <Feather name="check-circle" size={13} color={isCompletedToday ? "#10B981" : colors.textMuted} />
        <Text style={[styles.footerStatusText, { color: colors.textMuted }]}>
          {isCompletedToday ? 'Daily learning activity completed today' : 'Complete today\'s task to maintain your streak'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  streakInfoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fireIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  streakSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  bestStreakPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestStreakPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D97706',
  },
  weekGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 6,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleCompleted: {
    backgroundColor: '#10B981',
  },
  dayCircleToday: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  footerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  footerStatusText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
