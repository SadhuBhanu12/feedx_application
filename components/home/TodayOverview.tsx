import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';
import PressableCard from '@/components/ui/PressableCard';

interface TodayOverviewProps {
  dashboard: any;
  todayClassesCount?: number;
}

export function TodayOverview({ dashboard, todayClassesCount = 0 }: TodayOverviewProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const attendanceValue = dashboard?.hasAttendanceData
    ? `${dashboard.overallAttendance || 0}%`
    : 'Soon';

  const pendingTasks = (dashboard?.tasks || []).filter((t: any) => !t.completed).length;
  const oppCount = dashboard?.oppCount || (dashboard?.opportunities || []).length || 0;

  const cards = [
    {
      id: 'attendance',
      label: 'Attendance',
      value: attendanceValue,
      icon: 'pie-chart',
      color: dashboard?.hasAttendanceData 
        ? ((dashboard?.overallAttendance || 0) < 75 ? '#EF4444' : '#10B981')
        : '#64748B',
      route: '/(tabs)/academics',
    },
    {
      id: 'classes',
      label: 'Classes',
      value: `${todayClassesCount} Today`,
      icon: 'clock',
      color: '#3B82F6',
      route: '/(tabs)/timetable',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      value: `${pendingTasks} Pending`,
      icon: 'check-square',
      color: '#F59E0B',
      route: '/(tabs)/tasks',
    },
    {
      id: 'opps',
      label: 'Opportunities',
      value: `${oppCount} New`,
      icon: 'briefcase',
      color: '#8B5CF6',
      route: '/(tabs)/opportunities',
    },
  ];

  return (
    <Animated.View entering={FadeInUp.duration(300).delay(100)} style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today&apos;s Overview</Text>
      <View style={styles.grid}>
        {cards.map((card) => (
          <PressableCard
            key={card.id}
            style={{ flex: 1 }}
            onPress={() => router.push(card.route as any)}
          >
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={[styles.iconBox, { backgroundColor: card.color + '15' }]}>
                <Feather name={card.icon as any} size={18} color={card.color} />
              </View>
              <Text style={[styles.cardValue, { color: colors.textPrimary }]} numberOfLines={1}>
                {card.value}
              </Text>
              <Text style={[styles.cardLabel, { color: colors.textMuted }]}>{card.label}</Text>
            </View>
          </PressableCard>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    ...SHADOWS.small,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default TodayOverview;
