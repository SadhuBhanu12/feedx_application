import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface PriorityAlertsProps {
  notifications: any[];
}

export function PriorityAlerts({ notifications = [] }: PriorityAlertsProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // Filter unread or important notifications (top 3)
  const activeAlerts = (notifications || []).slice(0, 3);

  const getPriorityTag = (item: any) => {
    const p = String(item.priority || item.type || 'Normal').toLowerCase();
    if (p.includes('critical') || p.includes('exam') || p.includes('urgent')) {
      return { label: 'CRITICAL', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', icon: 'alert-triangle' };
    }
    if (p.includes('important') || p.includes('job') || p.includes('deadline')) {
      return { label: 'IMPORTANT', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', icon: 'bell' };
    }
    if (p.includes('event')) {
      return { label: 'EVENT', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)', icon: 'calendar' };
    }
    return { label: 'INFO', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', icon: 'info' };
  };

  if (!activeAlerts || activeAlerts.length === 0) {
    return (
      <Animated.View entering={FadeInUp.duration(400).delay(250).springify()} style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Priority Alerts</Text>
        </View>
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="check-circle" size={22} color="#10B981" />
          <Text style={[styles.emptyText, { color: colors.textPrimary }]}>You&apos;re all caught up!</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>No urgent alerts or pending actions right now.</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(250).springify()} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Feather name="alert-triangle" size={18} color="#F59E0B" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Priority Alerts</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/updates')}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>View All →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {activeAlerts.map((alert: any, idx: number) => {
          const tag = getPriorityTag(alert);
          const timeText = alert.created_at
            ? new Date(alert.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : 'Today';

          return (
            <TouchableOpacity
              key={alert.id || idx}
              style={[styles.alertCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => {
                if (alert.apply_url) {
                  router.push(alert.apply_url as any);
                } else {
                  router.push('/(tabs)/updates');
                }
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: tag.bg }]}>
                <Feather name={tag.icon as any} size={16} color={tag.color} />
              </View>

              <View style={styles.contentWrap}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.priorityBadge, { backgroundColor: tag.bg }]}>
                    <Text style={[styles.priorityBadgeText, { color: tag.color }]}>{tag.label}</Text>
                  </View>
                  <Text style={[styles.timeText, { color: colors.textMuted }]}>{timeText}</Text>
                </View>

                <Text style={[styles.alertTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                  {alert.title || 'Important Notice'}
                </Text>
                <Text style={[styles.alertDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                  {alert.message || alert.body || alert.description || 'Tap to view full details.'}
                </Text>
              </View>

              <Feather name="chevron-right" size={18} color={colors.textMuted} />
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
  viewAll: {
    fontSize: FONT.size.xs,
    fontWeight: '700',
  },
  emptyCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyText: {
    fontSize: FONT.size.sm,
    fontWeight: '700',
    marginTop: 2,
  },
  emptySub: {
    fontSize: 11,
  },
  list: {
    gap: 8,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 12,
    ...SHADOWS.small,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrap: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
});
