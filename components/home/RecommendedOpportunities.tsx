import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import BookmarkButton from '@/components/ui/BookmarkButton';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface RecommendedOpportunitiesProps {
  opportunities: any[];
}

export function RecommendedOpportunities({ opportunities = [] }: RecommendedOpportunitiesProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const activeOpps = (opportunities || []).slice(0, 5);

  if (!activeOpps || activeOpps.length === 0) {
    return (
      <Animated.View entering={FadeInUp.duration(400).delay(350).springify()} style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recommended Opportunities</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/opportunities')}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>Explore →</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="briefcase" size={24} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No new opportunities right now.</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Check Explore to discover latest internships, jobs, and hackathons.
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(350).springify()} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Feather name="briefcase" size={18} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Opportunities</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/opportunities')}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>View All Opportunities →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {activeOpps.map((opp: any, idx: number) => {
          const deadlineText = opp.deadline
            ? new Date(opp.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : 'Open';

          return (
            <TouchableOpacity
              key={opp.id || idx}
              style={[styles.oppCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => router.push(`/(tabs)/opportunities`)}
              activeOpacity={0.8}
            >
              <View style={styles.oppHeader}>
                <View style={styles.typeTag}>
                  <Text style={styles.typeTagText}>{opp.type || 'INTERNSHIP'}</Text>
                </View>
                <BookmarkButton
                  isBookmarked={false}
                  onPress={() => router.push('/bookmarks')}
                  size={30}
                  iconSize={14}
                />
              </View>

              <Text style={[styles.oppTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                {opp.title}
              </Text>

              <Text style={[styles.companyText, { color: colors.textSecondary }]} numberOfLines={1}>
                {opp.company || opp.organization || 'FeedX Community'}
              </Text>

              <View style={styles.metaRow}>
                {opp.stipend || opp.location ? (
                  <View style={styles.metaItem}>
                    <Feather name="map-pin" size={11} color={colors.textMuted} />
                    <Text style={[styles.metaText, { color: colors.textMuted }]} numberOfLines={1}>
                      {opp.location || opp.stipend || 'Remote'}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.metaItem}>
                  <Feather name="calendar" size={11} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>Deadline: {deadlineText}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.viewBtn, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }]}
                onPress={() => router.push(`/(tabs)/opportunities`)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewBtnText}>View Opportunity</Text>
                <Feather name="arrow-right" size={12} color="#3B82F6" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
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
    marginHorizontal: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '700',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
  },
  scrollList: {
    paddingHorizontal: SPACING.md,
    gap: 12,
  },
  oppCard: {
    width: 240,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    justifyContent: 'space-between',
    ...SHADOWS.small,
  },
  oppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8B5CF6',
    letterSpacing: 0.5,
  },
  oppTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 4,
  },
  companyText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  metaRow: {
    gap: 4,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3B82F6',
  },
});
