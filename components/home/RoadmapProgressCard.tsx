import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';
import { PressableCard } from '@/components/ui/PressableCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/constants/motion';

interface RoadmapProgressCardProps {
  roadmapProgress: any;
}

export function RoadmapProgressCard({ roadmapProgress }: RoadmapProgressCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const totalTasks = roadmapProgress?.total_tasks || roadmapProgress?.total_steps || roadmapProgress?.totalPhasesCount || (Array.isArray(roadmapProgress?.phases) ? roadmapProgress.phases.length : 0);
  const completedTasks = roadmapProgress?.completed_tasks?.length || roadmapProgress?.completed_task_ids?.length || roadmapProgress?.completedPhasesCount || (Array.isArray(roadmapProgress?.completed_phases) ? roadmapProgress.completed_phases.length : 0);
  
  let readinessPct = 0;
  if (roadmapProgress?.percentage !== undefined && roadmapProgress?.percentage !== null) {
    readinessPct = Number(roadmapProgress.percentage);
  } else if (totalTasks > 0) {
    readinessPct = Math.min(100, Math.max(0, Math.round((completedTasks / totalTasks) * 100)));
  } else if (roadmapProgress?.readiness_score !== undefined && roadmapProgress?.readiness_score !== null) {
    readinessPct = Number(roadmapProgress.readiness_score);
  }

  // Accurate progress percentage strictly reflecting verified work
  const displayPct = Math.min(100, Math.max(0, readinessPct));

  // Display only if user has an active roadmap, or has started progress, and not 100% completed
  const hasRoadmap = !!roadmapProgress && 
    (roadmapProgress.hasActiveRoadmap !== false) && 
    (!!roadmapProgress.career_role_id || !!roadmapProgress.role_title || !!roadmapProgress.id || completedTasks > 0);
  
  const shouldDisplay = hasRoadmap && readinessPct < 100;

  if (!shouldDisplay) {
    return null;
  }

  const roleTitle = roadmapProgress?.career_roles?.title || roadmapProgress?.role_title || roadmapProgress?.title || 'Career Roadmap';
  const completedSkills = roadmapProgress?.completed_skills || (completedTasks > 0 ? [`${completedTasks} of ${totalTasks || 6} Phases Finished`] : ['Phase 1: Getting Started']);
  const currentSkill = roadmapProgress?.currentPhaseTitle || roadmapProgress?.current_skill || 'Phase 1: Foundations';
  const nextSkill = roadmapProgress?.next_skill || 'Upcoming Milestone';
  const roadmapRoute = { pathname: '/roadmap' as any, params: { careerId: roadmapProgress?.career_role_id || roadmapProgress?.id } };

  return (
    <Animated.View entering={FadeInUp.duration(300).delay(150)} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Feather name="compass" size={18} color="#06B6D4" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Continue Learning</Text>
        </View>
        <TouchableOpacity onPress={() => router.push(roadmapRoute)}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>Continue Learning →</Text>
        </TouchableOpacity>
      </View>

      <PressableCard onPress={() => router.push(roadmapRoute)}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.roleTitle, { color: colors.textPrimary }]} numberOfLines={1}>{roleTitle}</Text>
              <View style={styles.statusPill}>
                <View style={styles.statusDot} />
                <Text style={styles.statusPillText}>IN PROGRESS • CONTINUE LEARNING</Text>
              </View>
            </View>

            <View style={styles.scoreCircle}>
              <AnimatedNumber
                value={displayPct}
                suffix="%"
                duration={MOTION_DURATIONS.countUp}
                style={styles.scoreValue}
              />
            </View>
          </View>

          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${displayPct}%` }]} />
          </View>

          <View style={styles.skillsContainer}>
            <View style={styles.skillSection}>
              <Text style={[styles.skillLabel, { color: colors.textMuted }]}>COMPLETED</Text>
              <Text style={[styles.skillValue, { color: '#10B981' }]} numberOfLines={1}>
                {Array.isArray(completedSkills) ? completedSkills.slice(0, 2).join(', ') : completedSkills}
              </Text>
            </View>

            <View style={styles.skillSection}>
              <Text style={[styles.skillLabel, { color: colors.textMuted }]}>CURRENT STEP</Text>
              <Text style={[styles.skillValue, { color: '#38BDF8' }]} numberOfLines={1}>
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

          <View style={[styles.actionRow, { borderTopColor: colors.cardBorder }]}>
            <Text style={[styles.actionSubtext, { color: colors.textMuted }]} numberOfLines={1} ellipsizeMode="tail">
              {roadmapProgress?.remainingDays ? `${roadmapProgress.remainingDays} days to completion` : `${100 - displayPct}% remaining to master`}
            </Text>
            <View style={[styles.continueBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.continueBtnText}>Continue Learning →</Text>
            </View>
          </View>
        </View>
      </PressableCard>
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
    width: 90,
  },
  skillValue: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
  },
  actionSubtext: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  continueBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexShrink: 0,
  },
  continueBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
});

export default RoadmapProgressCard;
