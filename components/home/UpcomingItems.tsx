import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface UpcomingItem {
  id: string;
  title: string;
  type: string;
  date: string | Date;
  venue?: string;
  source?: string;
}

interface UpcomingItemsProps {
  items: UpcomingItem[];
}

export function UpcomingItems({ items = [] }: UpcomingItemsProps) {
  const { colors } = useTheme();
  const router = useRouter();

  if (!items || items.length === 0) {
    return (
      <Animated.View entering={FadeInUp.duration(400).delay(550).springify()} style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Upcoming Activity</Text>
        </View>
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="calendar" size={22} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No upcoming deadlines</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            All your current assignments, exams, and event registrations are complete!
          </Text>
        </View>
      </Animated.View>
    );
  }

  const formatItemDate = (dateVal: string | Date) => {
    if (!dateVal) return 'Soon';
    const d = new Date(dateVal);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Assignment':
        return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
      case 'Event':
        return { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' };
      case 'Exam':
        return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' };
      default:
        return { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' };
    }
  };

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(550).springify()} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Feather name="calendar" size={18} color="#8B5CF6" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Upcoming Activity</Text>
        </View>
      </View>

      <View style={styles.list}>
        {items.map((item, idx) => {
          const dateLabel = formatItemDate(item.date);
          const badge = getBadgeStyle(item.type);

          return (
            <TouchableOpacity
              key={item.id || idx}
              style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => {
                if (item.source === 'events') router.push('/(tabs)/events');
                else if (item.source === 'tasks') router.push('/(tabs)/tasks');
                else if (item.source === 'opportunities') router.push('/(tabs)/opportunities');
                else router.push('/(tabs)/updates');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>{dateLabel}</Text>
              </View>

              <View style={styles.contentWrap}>
                <View style={styles.topRow}>
                  <Text style={[styles.itemTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.color }]}>{item.type}</Text>
                  </View>
                </View>
                {item.venue ? (
                  <Text style={[styles.venueText, { color: colors.textMuted }]} numberOfLines={1}>
                    Venue: {item.venue}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
  },
  emptyCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '700',
    marginTop: 2,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
  },
  list: {
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 12,
    ...SHADOWS.small,
  },
  dateBox: {
    width: 72,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8B5CF6',
  },
  contentWrap: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  venueText: {
    fontSize: 10,
    marginTop: 2,
  },
});
