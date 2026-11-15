import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import PressableCard from '@/components/ui/PressableCard';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { UserStage } from '@/store/useAdaptiveUIStore';
import { calculateProfileCompletion } from '@/utils/profile';

export interface HomeContextCardProps {
  userStage: UserStage;
  dashboard: any;
  user: any;
}

export const HomeContextCard: React.FC<HomeContextCardProps> = ({
  userStage,
  dashboard,
  user,
}) => {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const profile = dashboard?.profile || user || {};
  const profileCompletion = calculateProfileCompletion(user || profile);

  // 1. Upcoming Event Context
  const upcomingEvent = dashboard?.upcomingEvent || (dashboard?.events && dashboard.events[0]);
  
  // 2. Applied Opportunity Context
  const activeApplication = dashboard?.activeApplication || (dashboard?.applications && dashboard.applications[0]);

  if (userStage === 'UPCOMING_EVENT' && upcomingEvent) {
    return (
      <Animated.View entering={FadeInDown.duration(300).springify()} style={styles.outer}>
        <PressableCard scaleTo={0.98} haptic onPress={() => router.push({ pathname: '/event-detail' as any, params: { id: upcomingEvent.id } })}>
          <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.cardInner}>
            <View style={styles.badgeRow}>
              <View style={styles.eventPill}>
                <Feather name="calendar" size={12} color="#10B981" />
                <Text style={styles.eventPillText}>UPCOMING REGISTERED EVENT</Text>
              </View>
              <Text style={styles.statusBadge}>TICKET ACTIVE</Text>
            </View>

            <Text style={styles.title} numberOfLines={1}>
              {upcomingEvent.title || 'Institutional Tech Symposium 2026'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="map-pin" size={12} color="#94A3B8" />
              <Text style={styles.subtitle} numberOfLines={1}>
                {upcomingEvent.venue || 'Main Auditorium'} • {upcomingEvent.event_date || 'Tomorrow'}
              </Text>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerHint}>Tap to view entry QR ticket & details</Text>
              <View style={styles.actionBtnMini}>
                <Text style={styles.actionBtnText}>View Pass</Text>
                <Feather name="arrow-right" size={14} color="#FFF" />
              </View>
            </View>
          </LinearGradient>
        </PressableCard>
      </Animated.View>
    );
  }

  if (userStage === 'APPLICATION_PENDING' && activeApplication) {
    return (
      <Animated.View entering={FadeInDown.duration(300).springify()} style={styles.outer}>
        <PressableCard scaleTo={0.98} haptic onPress={() => router.push('/(tabs)/opportunities' as any)}>
          <LinearGradient colors={['#1E293B', '#0F172A']} style={[styles.cardInner, { borderColor: 'rgba(59, 130, 246, 0.4)' }]}>
            <View style={styles.badgeRow}>
              <View style={[styles.eventPill, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <MaterialCommunityIcons name="briefcase-check" size={12} color="#60A5FA" />
                <Text style={[styles.eventPillText, { color: '#60A5FA' }]}>ACTIVE APPLICATION</Text>
              </View>
              <Text style={[styles.statusBadge, { color: '#60A5FA' }]}>UNDER REVIEW</Text>
            </View>

            <Text style={styles.title} numberOfLines={1}>
              {activeApplication.title || 'Software Engineering Intern'}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {activeApplication.company || 'Google Cloud'} • Applied {activeApplication.applied_date || 'Recently'}
            </Text>

            <View style={styles.footerRow}>
              <Text style={styles.footerHint}>Recruiter review in progress</Text>
              <View style={[styles.actionBtnMini, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.actionBtnText}>Check Status</Text>
                <Feather name="arrow-right" size={14} color="#FFF" />
              </View>
            </View>
          </LinearGradient>
        </PressableCard>
      </Animated.View>
    );
  }

  const isProfileComplete = 
    profileCompletion >= 80 || 
    user?.is_profile_saved || 
    user?.first_login_completed || 
    (!!(user?.full_name || profile?.full_name) && !!(user?.college_name || profile?.college_name || user?.college_id));

  if (!isProfileComplete && (userStage === 'NEW_USER' || profileCompletion < 60)) {
    return (
      <Animated.View entering={FadeInDown.duration(300).springify()} style={styles.outer}>
        <PressableCard scaleTo={0.98} haptic onPress={() => router.push('/profile-edit' as any)}>
          <LinearGradient colors={['#1E293B', '#0F172A']} style={[styles.cardInner, { borderColor: 'rgba(245, 158, 11, 0.4)' }]}>
            <View style={styles.badgeRow}>
              <View style={[styles.eventPill, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Feather name="user-check" size={12} color="#F59E0B" />
                <Text style={[styles.eventPillText, { color: '#F59E0B' }]}>PROFILE ONBOARDING</Text>
              </View>
              <AnimatedNumber value={profileCompletion} suffix="% Complete" style={[styles.statusBadge, { color: '#F59E0B' }]} />
            </View>

            <Text style={styles.title}>Complete Your Student Profile</Text>
            <Text style={styles.subtitle}>
              Add your branch, skills, and target company to unlock AI blueprinted recommendations.
            </Text>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${profileCompletion}%`, backgroundColor: '#F59E0B' }]} />
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerHint}>Unlocks career blueprinted opportunities</Text>
              <View style={[styles.actionBtnMini, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.actionBtnText}>Complete Now</Text>
                <Feather name="arrow-right" size={14} color="#FFF" />
              </View>
            </View>
          </LinearGradient>
        </PressableCard>
      </Animated.View>
    );
  }

  // Active Scholar Default Context (RECOMMENDED NEXT STEP removed as requested)
  return null;
};

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cardInner: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10B981',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerHint: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  actionBtnMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    flexShrink: 0,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default HomeContextCard;
