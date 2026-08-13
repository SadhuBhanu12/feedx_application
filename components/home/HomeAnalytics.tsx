import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface HomeAnalyticsProps {
  oppCount?: number;
  resourceCount?: number;
  dashboard?: any;
}

export function HomeAnalytics({ oppCount = 0, resourceCount = 0, dashboard }: HomeAnalyticsProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const totalStudents = '4,000+';
  const oppAvailable = typeof oppCount === 'number' && oppCount > 0 ? `${oppCount}+` : '150+';
  const resAvailable = typeof resourceCount === 'number' && resourceCount > 0 ? `${resourceCount}+` : '500+';
  const successRate = '98%';

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(300).springify()} style={styles.container}>
      {/* Header Title */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="chart-box-outline" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>FEEDX Platform Analytics</Text>
        </View>
      </View>

      {/* 4-Stat Metric Grid */}
      <View style={styles.gridRow}>
        {/* Stat 1: 4000+ Active Students */}
        <View style={[styles.analyticsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.14)' }]}>
              <MaterialCommunityIcons name="account-group" size={20} color="#10B981" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.textMuted }]}>STUDENTS</Text>
          </View>
          <Text style={[styles.bigStatNum, { color: '#10B981' }]}>{totalStudents}</Text>
          <Text style={[styles.bigStatLabel, { color: colors.textPrimary }]}>Active Community</Text>
        </View>

        {/* Stat 2: Opportunities */}
        <TouchableOpacity
          style={[styles.analyticsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => router.push('/(tabs)/opportunities')}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.14)' }]}>
              <Feather name="briefcase" size={18} color="#3B82F6" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.textMuted }]}>CAREERS</Text>
          </View>
          <Text style={[styles.bigStatNum, { color: '#3B82F6' }]}>{oppAvailable}</Text>
          <Text style={[styles.bigStatLabel, { color: colors.textPrimary }]}>Opportunities</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.gridRow, { marginTop: 10 }]}>
        {/* Stat 3: Resources */}
        <TouchableOpacity
          style={[styles.analyticsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => router.push('/(tabs)/academics')}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(168, 85, 247, 0.14)' }]}>
              <Feather name="book-open" size={18} color="#A855F7" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.textMuted }]}>LEARNING</Text>
          </View>
          <Text style={[styles.bigStatNum, { color: '#A855F7' }]}>{resAvailable}</Text>
          <Text style={[styles.bigStatLabel, { color: colors.textPrimary }]}>Academic Resources</Text>
        </TouchableOpacity>

        {/* Stat 4: Placement Rate */}
        <View style={[styles.analyticsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.14)' }]}>
              <MaterialCommunityIcons name="trophy-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.textMuted }]}>SUCCESS</Text>
          </View>
          <Text style={[styles.bigStatNum, { color: '#F59E0B' }]}>{successRate}</Text>
          <Text style={[styles.bigStatLabel, { color: colors.textPrimary }]}>Growth & Placements</Text>
        </View>
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
    marginBottom: 10,
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
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  analyticsCard: {
    flex: 1,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 10,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  bigStatWrap: {
    marginVertical: 2,
  },
  bigStatNum: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
  },
  bigStatLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  miniStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
  },
  miniStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  miniNum: {
    fontSize: 12,
    fontWeight: '900',
  },
  miniLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
  dividerV: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
