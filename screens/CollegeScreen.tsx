import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { SPACING, RADIUS, SHADOWS, FONT } from '@/constants/theme';
import { PressableCard } from '@/components/ui/PressableCard';

// College Hub Components
import { CollegeHeader } from '@/components/college/CollegeHeader';
import { CollegeDigitalID } from '@/components/college/CollegeDigitalID';
import { CollegeNotices } from '@/components/college/CollegeNotices';
import { CollegeEvents } from '@/components/college/CollegeEvents';
import { CollegeGrievanceSection } from '@/components/college/CollegeGrievanceSection';

export default function CollegeScreen() {
  const { user, dashboard, refreshDashboard } = useUser();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'notices' | 'events' | 'support'>('notices');

  useEffect(() => {
    if (params.tab && ['notices', 'events', 'support'].includes(params.tab)) {
      setActiveTab(params.tab as any);
    }
  }, [params.tab]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refreshDashboard();
      }
    }, [user?.id])
  );

  // Real-time Subscriptions for College Notices, Events & Grievances
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`college_hub_realtime_${Date.now()}`)
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
  const notifList = dashboard?.notifications || [];
  const unreadCount = notifList.filter((n: any) => !n.is_read).length;

  const tabs = [
    {
      id: 'notices' as const,
      label: 'Notices',
      icon: 'bullhorn-outline',
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
    },
    {
      id: 'events' as const,
      label: 'Events',
      icon: 'calendar-star',
      badge: undefined,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark ? (
        <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />
      ) : (
        <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={StyleSheet.absoluteFill} />
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
          {/* 1. Student & College Identity Header */}
          <CollegeHeader
            collegeName={profile.college_name}
            location={profile.college_location}
          />

          {/* 2. FEEDX Student Digital Identity Card */}
          <CollegeDigitalID user={user} profile={profile} />

          {/* 3. Report Issue / College Grievance Card (Placed directly under FEEDX Digital Card) */}
          <CollegeGrievanceSection userId={user?.id} />

          {/* Admin Management Toolbar */}
          {(user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'inst_admin') && (
            <View style={{ paddingHorizontal: SPACING.md }}>
              <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', borderRadius: RADIUS.lg, padding: 14, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)', gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialCommunityIcons name="shield-crown" size={18} color="#3B82F6" />
                    <Text style={{ fontSize: 13, fontWeight: '900', color: colors.textPrimary }}>College Admin Desk</Text>
                  </View>
                  <View style={{ backgroundColor: '#3B82F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ fontSize: 9, fontWeight: '900', color: '#FFF' }}>ADMIN ACCESS</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/admin/notifications' as any)}
                    style={{ flex: 1, backgroundColor: '#3B82F6', paddingVertical: 10, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>+ Create Poll / Notice</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push('/admin-issues' as any)}
                    style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: '#EF4444', paddingVertical: 10, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '800' }}>Manage Grievances</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* 3. Navigation Tab Switcher */}
          <View style={styles.tabSwitcherContainer}>
            <View style={[styles.tabSwitcher, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.tabBtn,
                      isActive && [styles.activeTabBtn, { backgroundColor: colors.primary, borderColor: colors.primary }],
                    ]}
                    onPress={() => {
                      try {
                        Haptics.selectionAsync().catch(() => {});
                      } catch {}
                      setActiveTab(tab.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name={tab.icon as any}
                      size={16}
                      color={isActive ? '#FFF' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.tabBtnText,
                        { color: isActive ? '#FFF' : colors.textSecondary },
                      ]}
                    >
                      {tab.label}
                    </Text>
                    {tab.badge && (
                      <View style={[styles.tabBadge, { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#EF4444' }]}>
                        <Text style={[styles.tabBadgeText, { color: '#FFF' }]}>{tab.badge}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Active Tab Content */}
          {activeTab === 'notices' && (
            <CollegeNotices notices={notifList} />
          )}

          {activeTab === 'events' && (
            <CollegeEvents />
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
  },
  tabSwitcher: {
    flexDirection: 'row',
    borderRadius: RADIUS.xl,
    padding: 4,
    borderWidth: 1,
    gap: 4,
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
    fontWeight: '800',
  },
  tabBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginLeft: 2,
  },
  tabBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
  },
});
