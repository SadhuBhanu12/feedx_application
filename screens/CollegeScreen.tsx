import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

// College Hub Components
import { CollegeHeader } from '@/components/college/CollegeHeader';
import { CollegeDigitalID } from '@/components/college/CollegeDigitalID';
import { CollegeNotices } from '@/components/college/CollegeNotices';
import { CollegeGrievanceSection } from '@/components/college/CollegeGrievanceSection';
import { CollegeUpdatesStream } from '@/components/college/CollegeUpdatesStream';

export default function CollegeScreen() {
  const { user, dashboard, refreshDashboard } = useUser();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'notices' | 'stream'>('notices');

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refreshDashboard();
      }
    }, [user?.id])
  );

  // Real-time Subscriptions for College Notices & Grievances
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('college_hub_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        refreshDashboard();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        refreshDashboard();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, () => {
        refreshDashboard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handlePullToRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshDashboard();
    } catch (err) {
      console.warn('[CollegeScreen] Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const profile = dashboard?.profile || user || {};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark ? (
        <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />
      ) : (
        <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={StyleSheet.absoluteFillObject} />
      )}

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
        <View style={styles.contentWrapper}>
          {/* 1. College Header */}
          <CollegeHeader
            collegeName={profile.college_name}
            location={profile.college_location}
            onNotificationPress={() => router.push('/(tabs)/updates')}
          />

          {/* 2. FEEDX Digital Identity Card */}
          <CollegeDigitalID user={user} profile={profile} />

          {/* 3. Grievance / Student Support Desk */}
          <CollegeGrievanceSection userId={user?.id} />

          {/* 4. Segmented Tab Switcher */}
          <View style={styles.tabSwitcherContainer}>
            <View style={[styles.tabSwitcher, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderColor: colors.cardBorder }]}>
              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'notices' && [styles.activeTabBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }],
                ]}
                onPress={() => setActiveTab('notices')}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name="bullhorn-outline"
                  size={16}
                  color={activeTab === 'notices' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.tabBtnText,
                    { color: activeTab === 'notices' ? colors.textPrimary : colors.textMuted },
                    activeTab === 'notices' && { fontWeight: '900' },
                  ]}
                >
                  College Notices
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'stream' && [styles.activeTabBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }],
                ]}
                onPress={() => setActiveTab('stream')}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name="newspaper-variant-outline"
                  size={16}
                  color={activeTab === 'stream' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.tabBtnText,
                    { color: activeTab === 'stream' ? colors.textPrimary : colors.textMuted },
                    activeTab === 'stream' && { fontWeight: '900' },
                  ]}
                >
                  Updates Stream
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 5. Active Selected Tab View */}
          {activeTab === 'notices' ? (
            <CollegeNotices notices={dashboard?.notifications || []} />
          ) : (
            <CollegeUpdatesStream updates={dashboard?.officialUpdates || []} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  contentWrapper: {
    gap: 16,
  },
  tabSwitcherContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: 4,
  },
  tabSwitcher: {
    flexDirection: 'row',
    borderRadius: RADIUS.xl,
    padding: 4,
    borderWidth: 1,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
  },
  activeTabBtn: {
    borderWidth: 1,
    ...SHADOWS.small,
  },
  tabBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
});
