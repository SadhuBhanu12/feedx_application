import { Tabs, Redirect, useRouter , usePathname } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, BackHandler, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS, SHADOWS } from '@/constants/theme';
import HapticTab from '@/components/haptic-tab';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SCALE } from '@/constants/motion';
import { useAuthStore } from '@/store/useAuthStore';

interface TabIconProps {
  icon: any;
  color?: any;
  focused: boolean;
  family?: 'Feather' | 'Ionicons' | 'MaterialCommunityIcons';
}

const TabIcon = React.memo(function TabIcon({ icon, color, focused, family = 'Feather' }: TabIconProps) {
  const { colors, isDark } = useTheme();
  const IconComponent = family === 'Feather' ? Feather : family === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
  
  const scaleProgress = useSharedValue(focused ? 1.06 : 1);

  useEffect(() => {
    scaleProgress.value = withSpring(focused ? 1.06 : 1, {
      damping: 18,
      stiffness: 380,
    });
  }, [focused]);

  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleProgress.value }],
    backgroundColor: focused 
      ? (isDark ? 'rgba(37, 99, 235, 0.22)' : 'rgba(37, 99, 235, 0.12)')
      : 'transparent',
    borderColor: focused
      ? (isDark ? 'rgba(96, 165, 250, 0.35)' : 'rgba(37, 99, 235, 0.25)')
      : 'transparent',
  }));

  const activeIconColor = isDark ? '#60A5FA' : '#2563EB';
  const inactiveIconColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <Animated.View style={[styles.iconBox, animatedBoxStyle]}>
      <IconComponent 
        name={icon} 
        size={22} 
        color={focused ? activeIconColor : inactiveIconColor} 
      />
    </Animated.View>
  );
});

export default function TabLayout() {
  const { user, booting, mustChangePassword, globalSettings } = useUser();
  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'inst_admin';

  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Phase 9: Navigation Optimization (Preloading data)
  useEffect(() => {
    if (!user?.id || isAdmin) return;
    
    const prefetchData = async () => {
      try {
        // Prefetch Opportunities
        if (globalSettings?.opportunity_module_enabled !== false) {
          queryClient.prefetchQuery({
            queryKey: ['opportunities'],
            queryFn: async () => {
              const { data } = await supabase.from('opportunities').select('id, title, company, company_logo, type, location, stipend, duration, deadline, created_at').order('created_at', { ascending: false }).limit(20);
              return data || [];
            },
            staleTime: 1000 * 60 * 10 // 10 minutes
          });
        }
        
        // Prefetch Resources
        if (globalSettings?.resource_module_enabled !== false) {
          queryClient.prefetchQuery({
            queryKey: ['resources'],
            queryFn: async () => {
              const { data } = await supabase.from('resources').select('id, title, file_url, type, created_at, uploaded_by').order('created_at', { ascending: false }).limit(20);
              return data || [];
            },
            staleTime: 1000 * 60 * 10
          });
        }

        // Prefetch Events
        if (globalSettings?.event_module_enabled !== false) {
          queryClient.prefetchQuery({
            queryKey: ['events'],
            queryFn: async () => {
              const { data } = await supabase.from('events').select('id, title, description, category, event_type, location, venue, start_date, end_date, banner_url, created_at').eq('status', 'Published').order('created_at', { ascending: false }).limit(20);
              return data || [];
            },
            staleTime: 1000 * 60 * 10
          });
        }
      } catch (e) {
        console.warn('Prefetching failed quietly:', e);
      }
    };

    // Run prefetch in background after short delay to not block initial render
    const timeout = setTimeout(prefetchData, 2000);
    return () => clearTimeout(timeout);
  }, [user?.id, isAdmin, globalSettings, queryClient]);

  const router = useRouter();
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (router.canGoBack()) {
        router.back();
        return true;
      }

      const isRootTab = pathname === '/' || 
                        pathname === '/(tabs)' || 
                        pathname === '/index' || 
                        pathname === '/(tabs)/index' ||
                        pathname === '/user_profile' ||
                        pathname === '/(tabs)/user_profile' ||
                        pathname === '/college' ||
                        pathname === '/(tabs)/college' ||
                        pathname === '/explore' ||
                        pathname === '/(tabs)/explore' ||
                        pathname === '/community' ||
                        pathname === '/(tabs)/community' ||
                        pathname === '/admin' ||
                        pathname === '/(tabs)/admin';

      if (!isRootTab) {
        router.replace(isAdmin ? '/(tabs)/admin' : '/(tabs)' as any);
        return true;
      }

      if (isAdmin && (pathname === '/admin' || pathname === '/(tabs)/admin')) {
        if (router.canGoBack()) {
          router.back();
          return true;
        }
      }

      Alert.alert(
        'Exit FEEDX?',
        'Are you sure you want to exit the application?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
          { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() }
        ],
        { cancelable: true }
      );
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [pathname, router, isAdmin]);

  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  if (booting) {
    return null;
  }

  if (!user || !user.id) {
    return <Redirect href="/login" />;
  }

  if (mustChangePassword) {
    return <Redirect href="/change-password" />;
  }

  // Calculate safe bottom padding & height dynamically across all phone models
  const safeBottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 8);
  const tabHeight = (Platform.OS === 'ios' ? 62 : 64) + safeBottom;

  return (
    <Tabs
      initialRouteName={isAdmin ? 'admin' : 'index'}
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#60A5FA' : '#2563EB',
        tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8',
        tabBarButton: (props: any) => <HapticTab {...props} />,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          letterSpacing: 0.15,
          marginBottom: Platform.OS === 'ios' ? 0 : 3,
          includeFontPadding: false,
        },
        tabBarIconStyle: {
          marginTop: 4,
          marginBottom: 1,
        },
        tabBarStyle: [
          styles.tabBar, 
          { 
            backgroundColor: colors.navBg, 
            borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            height: tabHeight,
            paddingBottom: safeBottom,
          }
        ],
        tabBarItemStyle: styles.tabBarItem,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: isAdmin ? null : '/(tabs)',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="home" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="admin"
        options={{
          title: isAdmin ? 'Command' : 'Admin',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={isAdmin ? "shield-check" : "grid"} 
              color={color} 
              focused={focused} 
              family={isAdmin ? "MaterialCommunityIcons" : "Feather"}
            />
          ),
          href: isAdmin ? '/(tabs)/admin' : null,
        }}
      />

      <Tabs.Screen
        name="college"
        options={{
          title: 'College',
          href: isAdmin ? null : ('/(tabs)/college' as any),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="school" color={color} focused={focused} family="MaterialCommunityIcons" />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          href: (isAdmin || globalSettings?.community_enabled === false) ? null : ('/(tabs)/community' as any),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="users" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          href: isAdmin ? null : ('/(tabs)/explore' as any),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="compass" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="user_profile"
        options={{
          title: 'Profile',
          href: '/(tabs)/user_profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="user" color={color} focused={focused} />
          ),
        }}
      />

      {/* Hidden Routes */}
      <Tabs.Screen name="opportunities" options={{ href: null }} />
      <Tabs.Screen name="tools" options={{ href: null }} />
      <Tabs.Screen name="events" options={{ href: null }} />
      <Tabs.Screen name="academics" options={{ href: null }} />
      <Tabs.Screen name="timetable" options={{ href: null }} />
      <Tabs.Screen name="updates" options={{ href: null }} />
      <Tabs.Screen name="tasks" options={{ href: null }} />
      <Tabs.Screen name="support" options={{ href: null }} />
      <Tabs.Screen name="attendance" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 2,
  },
  iconBox: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
