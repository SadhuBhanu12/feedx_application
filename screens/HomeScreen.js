import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { SPACING, RADIUS, FONT } from '@/constants/theme';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import GlobalSearchModal from '@/components/GlobalSearchModal';
import { SkeletonLoader } from '@/components/ui/Loaders';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import DailyChallengesCard from '@/components/gamification/DailyChallengesCard';

// Restored Previous Home Hierarchy Components
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeBanner } from '@/components/home/HomeBanner';
import { HomeAnalytics } from '@/components/home/HomeAnalytics';
import { QuickActionsGrid } from '@/components/home/QuickActionsGrid';
import { HomeHandlesFooter } from '@/components/home/HomeHandlesFooter';
import { CommunityStatsFooter } from '@/components/home/CommunityStatsFooter';

export default function HomeScreen() {
  const { user, dashboard, refreshDashboard } = useUser();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'inst_admin';

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refreshDashboard().catch(() => setHasError(true));
      }
    }, [user?.id])
  );

  // Real-time Subscriptions for Daily Student Productivity
  useEffect(() => {
    if (!user?.id) return;

    const channelName = `home_realtime_student_dashboard_${user.id}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        refreshDashboard();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, () => {
        refreshDashboard();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, () => {
        refreshDashboard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

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

  const isLoading = !dashboard && !hasError;

  const dynamicBanners = React.useMemo(() => {
    const updates = dashboard?.officialUpdates || [];
    if (!updates || updates.length === 0) return undefined;
    
    // Only display notifications within the last 7 days
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

    return activeUpdates.slice(0, 5).map((upd, idx) => ({
      id: upd.id || `banner_${idx}`,
      badge: String(upd.category || upd.source || 'CAMPUS UPDATE').toUpperCase(),
      title: upd.title,
      subtitle: upd.description || 'Tap to view full details on College Tab.',
      gradient: gradients[idx % gradients.length],
      route: upd.route || '/(tabs)/college',
      iconName: icons[idx % icons.length]
    }));
  }, [dashboard?.officialUpdates]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <AnimatedBackground />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handlePullToRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* 1. Header (Greeting, Name, Avatar, Streak, Coins, Bell) */}
        <HomeHeader
          user={user}
          dashboard={dashboard}
          onNotificationPress={() => router.push(isAdmin ? '/(tabs)/admin/notifications' : '/(tabs)/updates')}
        />

        {/* 2. Dynamic Banner Carousel (Career Opportunities, Internship Campaigns, Skill Challenges) */}
        <HomeBanner banners={dynamicBanners} />

        {/* Gamification Streak & Challenges */}
        {!isAdmin && (
          <>
            <GamificationDashboard />
            <DailyChallengesCard />
          </>
        )}

        {/* 4. Quick Actions Grid */}
        <QuickActionsGrid isAdmin={isAdmin} />

        {/* 5. FEEDX Official Social Handles Footer */}
        <HomeHandlesFooter />
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