import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

export interface CollegeUpdateItem {
  id: string;
  title: string;
  description: string;
  category: string;
  source: string;
  created_at: string;
  route?: string;
}

interface CollegeUpdatesStreamProps {
  updates?: CollegeUpdateItem[];
}

const UPDATE_CATEGORIES = ['All', 'Announcements', 'Events', 'Placements', 'Academia'];

export function CollegeUpdatesStream({ updates = [] }: CollegeUpdatesStreamProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredUpdates = (updates || []).filter((item) => {
    if (selectedCat === 'All') return true;
    const cat = String(item.category || '').toLowerCase();
    const source = String(item.source || '').toLowerCase();
    const target = selectedCat.toLowerCase();
    return cat.includes(target) || source.includes(target);
  });

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(400).springify()} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="newspaper-variant-outline" size={22} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>College Updates Stream</Text>
        </View>
      </View>

      {/* Stream Category Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {UPDATE_CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterPill,
                {
                  backgroundColor: isActive ? colors.primary : isDark ? 'rgba(255,255,255,0.04)' : colors.card,
                  borderColor: isActive ? colors.primary : colors.cardBorder,
                },
              ]}
              onPress={() => setSelectedCat(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterPillText, { color: isActive ? '#FFF' : colors.textSecondary }, isActive && { fontWeight: '900' }]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filteredUpdates.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="check-circle" size={24} color="#10B981" />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No updates match this category</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Official announcements, placement drives, and academic event schedules will update here.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredUpdates.map((item) => {
            const rawDate = item.created_at || (item as any).timestamp;
            const formattedTime = rawDate ? new Date(rawDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently';

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => {
                  if (item.route) router.push(item.route as any);
                }}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.sourcePill, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)' }]}>
                    <Feather name="shield" size={10} color={colors.primary} />
                    <Text style={[styles.sourcePillText, { color: colors.primary }]}>{item.source || 'College Department'}</Text>
                  </View>
                  <Text style={[styles.timeText, { color: colors.textMuted }]}>{formattedTime}</Text>
                </View>

                <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                  {item.title}
                </Text>

                <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={[styles.categoryTag, { color: colors.primary }]}>{item.category || 'Official Update'}</Text>
                  <Feather name="chevron-right" size={14} color={colors.primary} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  filterRow: {
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '800',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 8,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sourcePillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  timeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 18,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
    marginTop: 2,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '800',
  },
});
