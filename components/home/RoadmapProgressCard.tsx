import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface RoadmapProgressCardProps {
  roadmapProgress: any;
}

export function RoadmapProgressCard({ roadmapProgress }: RoadmapProgressCardProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const roleTitle = roadmapProgress?.career_roles?.title || roadmapProgress?.role_title || 'Frontend Developer';
  const readinessPct = roadmapProgress?.readiness_score || roadmapProgress?.percentage || 64;

  const completedSkills = roadmapProgress?.completed_skills || ['HTML', 'CSS', 'JavaScript'];
  const currentSkill = roadmapProgress?.current_skill || 'React';
  const nextSkill = roadmapProgress?.next_skill || 'Advanced React & Redux';

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(450).springify()} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Feather name="compass" size={18} color="#06B6D4" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>My Roadmap</Text>
        </View>
        <TouchableOpacity onPress={() => router.push({ pathname: '/roadmap' as any, params: { careerId: roadmapProgress?.career_role_id } })}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>Continue Roadmap →</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        onPress={() => router.push({ pathname: '/roadmap' as any, params: { careerId: roadmapProgress?.career_role_id } })}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.roleTitle, { color: colors.textPrimary }]}>{roleTitle}</Text>
            <Text style={[styles.subTag, { color: colors.textMuted }]}>CAREER TRACK</Text>
          </View>

          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{readinessPct}%</Text>
          </View>
        </View>

        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${readinessPct}%` }]} />
        </View>

        <View style={styles.skillsContainer}>
          <View style={styles.skillSection}>
            <Text style={[styles.skillLabel, { color: colors.textMuted }]}>COMPLETED</Text>
            <Text style={[styles.skillValue, { color: '#10B981' }]} numberOfLines={1}>
              {Array.isArray(completedSkills) ? completedSkills.slice(0, 3).join(', ') : completedSkills}
            </Text>
          </View>

          <View style={styles.skillSection}>
            <Text style={[styles.skillLabel, { color: colors.textMuted }]}>CURRENT</Text>
            <Text style={[styles.skillValue, { color: '#3B82F6' }]} numberOfLines={1}>
              {currentSkill}
            </Text>
          </View>

          <View style={styles.skillSection}>
            <Text style={[styles.skillLabel, { color: colors.textMuted }]}>NEXT</Text>
            <Text style={[styles.skillValue, { color: colors.textSecondary }]} numberOfLines={1}>
              {nextSkill}
            </Text>
          </View>
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
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 12,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  subTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#06B6D4',
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#06B6D4',
    borderRadius: 3,
  },
  skillsContainer: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
  },
  skillSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skillLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    width: 80,
  },
  skillValue: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
});
