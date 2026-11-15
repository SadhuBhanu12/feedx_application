import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface ContinueLearningProps {
  lessons: any[];
  lessonProgress: any[];
}

export function ContinueLearning({ lessons = [], lessonProgress = [] }: ContinueLearningProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // Find in-progress or recommended active lesson
  let activeLesson: any = null;
  let progressPct = 0;

  if (lessonProgress && lessonProgress.length > 0 && lessons && lessons.length > 0) {
    const completedSet = new Set(lessonProgress.filter((p) => p.completed).map((p) => p.lesson_id));
    const nextUncompleted = lessons.find((l) => !completedSet.has(l.id));

    if (nextUncompleted) {
      activeLesson = nextUncompleted;
      const completedCount = completedSet.size;
      progressPct = Math.round((completedCount / lessons.length) * 100);
    } else {
      activeLesson = lessons[0];
      progressPct = 100;
    }
  } else if (lessons && lessons.length > 0) {
    activeLesson = lessons[0];
    progressPct = 0;
  }

  if (!activeLesson) {
    return (
      <Animated.View entering={FadeInUp.duration(400).delay(300).springify()} style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Learn</Text>
        </View>
        <View style={[styles.onboardingCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.onboardingIconCircle}>
            <Feather name="book-open" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.onboardingTitle, { color: colors.textPrimary }]}>
            Start building your skills today
          </Text>
          <Text style={[styles.onboardingSub, { color: colors.textMuted }]}>
            Master programming, web development, aptitude, and tech concepts with bite-sized modules.
          </Text>
          <TouchableOpacity
            style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/academics')}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreBtnText}>Explore Learning</Text>
            <Feather name="arrow-right" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(300).springify()} style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {lessonProgress.length > 0 ? 'Continue Learning' : 'Quick Learn'}
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/academics')}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>Browse All →</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.learningCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        onPress={() => router.push('/(tabs)/academics')}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{activeLesson.category || 'PROGRAMMING'}</Text>
          </View>
          {activeLesson.estimated_minutes && (
            <View style={styles.timeBadge}>
              <Feather name="clock" size={11} color={colors.textMuted} />
              <Text style={[styles.timeText, { color: colors.textMuted }]}>{activeLesson.estimated_minutes} min</Text>
            </View>
          )}
        </View>

        <Text style={[styles.lessonTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {activeLesson.title}
        </Text>

        {activeLesson.short_description ? (
          <Text style={[styles.lessonDesc, { color: colors.textSecondary }]} numberOfLines={2}>
            {activeLesson.short_description}
          </Text>
        ) : null}

        <View style={styles.progressRow}>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${Math.min(100, Math.max(0, progressPct))}%`, backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.pctText, { color: colors.textSecondary }]}>{progressPct}%</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/academics')}
            activeOpacity={0.8}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
            <Feather name="play" size={13} color="#FFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  sectionTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
  },
  viewAll: {
    fontSize: FONT.size.xs,
    fontWeight: '700',
  },
  onboardingCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.small,
  },
  onboardingIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  onboardingTitle: {
    fontSize: FONT.size.md,
    fontWeight: '800',
    textAlign: 'center',
  },
  onboardingSub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  exploreBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  learningCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 8,
    ...SHADOWS.small,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  lessonDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  pctText: {
    fontSize: 11,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
  },
  continueBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
