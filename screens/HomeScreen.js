import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter, useFocusEffect } from 'expo-router';

import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import GlobalSearchModal from '@/components/GlobalSearchModal';

// Home Hierarchy Components
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeBanner } from '@/components/home/HomeBanner';
import { QuickActionsGrid } from '@/components/home/QuickActionsGrid';
import { HomeHandlesFooter } from '@/components/home/HomeHandlesFooter';
import { HomeContextCard } from '@/components/home/HomeContextCard';
import { RoadmapProgressCard } from '@/components/home/RoadmapProgressCard';
import DailyChallengesCard from '@/components/gamification/DailyChallengesCard';
import { roadmapService } from '@/services/roadmapService';
import { CollegeGrievanceSection } from '@/components/college/CollegeGrievanceSection';
import { useAdaptiveUIStore } from '@/store/useAdaptiveUIStore';

export default function HomeScreen() {
  const { user, dashboard, refreshDashboard } = useUser();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const hasAnimatedRef = useRef(false);

  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'inst_admin';

  const setUserStageStore = useAdaptiveUIStore((state) => state.setUserStage);

  const computedUserStage = React.useMemo(() => {
    const profile = dashboard?.profile || user || {};
    const hasUpcomingEvent = !!(dashboard?.upcomingEvent || (dashboard?.events && dashboard.events.length > 0));
    const hasPendingApp = !!(dashboard?.activeApplication || (dashboard?.applications && dashboard.applications.length > 0));
    const isProfileComplete = 
      !!(profile.full_name || user?.full_name) || 
      user?.is_profile_saved || 
      user?.first_login_completed || 
      (profile.completion_percentage && profile.completion_percentage >= 60);

    if (hasUpcomingEvent) return 'UPCOMING_EVENT';
    if (hasPendingApp) return 'APPLICATION_PENDING';
    if (!isProfileComplete) return 'NEW_USER';
    return 'ACTIVE_SCHOLAR';
  }, [dashboard, user]);

  useEffect(() => {
    setUserStageStore(computedUserStage);
  }, [computedUserStage, setUserStageStore]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        const task = InteractionManager.runAfterInteractions(() => {
          refreshDashboard().catch(() => setHasError(true));
        });
        return () => task.cancel();
      }
    }, [user?.id, refreshDashboard])
  );

  useEffect(() => {
    hasAnimatedRef.current = true;
  }, []);

  const handlePullToRefresh = async () => {
    setRefreshing(true);
    setHasError(false);
    try {
      await refreshDashboard();
    } catch (err) {
      console.warn('[HomeScreen] Refresh error:', err);
      setHasError(true);
    } finally {
      setRefreshing(false);
    }
  };

  const dynamicBanners = React.useMemo(() => {
    const updates = dashboard?.officialUpdates || [];
    if (!updates || updates.length === 0) return undefined;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeUpdates = updates.filter((upd) => {
      const createdDate = new Date(upd.created_at || upd.timestamp || Date.now());
      return createdDate >= sevenDaysAgo;
    });

    if (activeUpdates.length === 0) return undefined;
    
    const gradients = [
      ['#2563EB', '#1D4ED8'],
      ['#0D9488', '#059669'],
      ['#7C3AED', '#6D28D9'],
      ['#EA580C', '#C2410C'],
      ['#4338CA', '#3730A3'],
    ];
    const icons = ['bullhorn-outline', 'newspaper-variant-outline', 'shield-alert-outline', 'briefcase-outline', 'calendar-star'];

    return activeUpdates.slice(0, 5).map((upd, idx) => {
      let targetRoute = upd.route;
      if (upd.eventId) targetRoute = `/event-detail?id=${upd.eventId}`;
      else if (upd.oppId) targetRoute = `/opportunity-detail?id=${upd.oppId}`;
      else if (upd.notifId) targetRoute = `/(tabs)/updates?notificationId=${upd.notifId}`;
      else if (!targetRoute) targetRoute = '/(tabs)/updates';

      return {
        id: upd.id || `banner_${idx}`,
        badge: String(upd.badgeText || upd.category || upd.source || 'CAMPUS UPDATE').toUpperCase(),
        title: upd.title,
        subtitle: upd.body || upd.description || 'Tap to view full details.',
        gradient: gradients[idx % gradients.length],
        route: targetRoute,
        iconName: icons[idx % icons.length],
        noticeData: upd,
      };
    });
  }, [dashboard?.officialUpdates]);

  const [liveRoadmapSummary, setLiveRoadmapSummary] = useState(() => roadmapService.getActiveRoadmapSummary());

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      if (user?.id) {
        roadmapService.fetchProgressFromSupabase(user.id, user?.domain || user?.target_role)
          .then((res) => {
            if (isMounted) {
              setLiveRoadmapSummary(roadmapService.getActiveRoadmapSummary(user?.domain || user?.target_role));
            }
          })
          .catch(() => {
            if (isMounted) {
              setLiveRoadmapSummary(roadmapService.getActiveRoadmapSummary(user?.domain || user?.target_role));
            }
          });
      } else {
        setLiveRoadmapSummary(roadmapService.getActiveRoadmapSummary());
      }
      return () => {
        isMounted = false;
      };
    }, [user?.id, user?.domain, user?.target_role])
  );

  const activeRoadmap = React.useMemo(() => {
    if (dashboard?.roadmapProgress) return dashboard.roadmapProgress;
    return liveRoadmapSummary;
  }, [dashboard?.roadmapProgress, liveRoadmapSummary]);

  const isFirstMount = !hasAnimatedRef.current;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <AnimatedBackground />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handlePullToRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* 1. Header */}
        <Animated.View entering={isFirstMount ? FadeInUp.duration(260).delay(0) : undefined}>
          <HomeHeader
            user={user}
            dashboard={dashboard}
            onNotificationPress={() => router.push(isAdmin ? '/(tabs)/admin/notifications' : '/(tabs)/updates')}
          />
        </Animated.View>

        {/* 2. Context Hero Card (Student ID Card / Onboarding / Active Application) */}
        {!isAdmin && (
          <Animated.View entering={isFirstMount ? FadeInUp.duration(260).delay(40) : undefined}>
            <HomeContextCard userStage={computedUserStage} dashboard={dashboard} user={user} />
          </Animated.View>
        )}

        {/* 3. Dynamic Banner Carousel (Scrolling Notification Tab) */}
        <Animated.View entering={isFirstMount ? FadeInUp.duration(260).delay(80) : undefined}>
          <HomeBanner banners={dynamicBanners} />
        </Animated.View>

        {/* 4. Quick Actions Grid (Placed directly after scrolling notification tab) */}
        <Animated.View entering={isFirstMount ? FadeInUp.duration(260).delay(120) : undefined}>
          <QuickActionsGrid isAdmin={isAdmin} />
        </Animated.View>

        {/* 5. Active In-Progress Career Roadmap Progress Bar (Only visible if started & <100%, placed after Quick Actions) */}
        {!isAdmin && (
          <Animated.View entering={isFirstMount ? FadeInUp.duration(260).delay(160) : undefined}>
            <RoadmapProgressCard roadmapProgress={activeRoadmap} />
          </Animated.View>
        )}

        {/* 6. Daily Student Missions (Missions list with vibrant momentum progress bar) */}
        {!isAdmin && (
          <Animated.View entering={isFirstMount ? FadeInUp.duration(260).delay(200) : undefined}>
            <DailyChallengesCard showSummaryProgress={true} />
          </Animated.View>
        )}

        {/* 7. FEEDX Official Social Handles Footer */}
        <Animated.View entering={isFirstMount ? FadeInUp.duration(260).delay(240) : undefined}>
          <HomeHandlesFooter />
        </Animated.View>
      </ScrollView>

      {/* Global Search Modal */}
      <GlobalSearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} userId={user?.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
});