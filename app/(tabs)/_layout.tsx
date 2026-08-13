import { Tabs, Redirect, useRouter , usePathname } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, BackHandler, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS, SHADOWS } from '@/constants/theme';
import HapticTab from '@/components/haptic-tab';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface TabIconProps {
  icon: any;
  color: string;
  focused: boolean;
  label: string;
  family?: 'Feather' | 'Ionicons' | 'MaterialCommunityIcons';
}

const TabIcon = React.memo(function TabIcon({ icon, color, focused, label, family = 'Feather' }: TabIconProps) {
  const { colors, isDark } = useTheme();
  const IconComponent = family === 'Feather' ? Feather : family === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
  
  return (
    <View style={styles.iconContainer}>
      <View style={[
        styles.iconBox,
        { backgroundColor: focused ? colors.primary : 'transparent' }
      ]}>
        <IconComponent 
          name={icon} 
          size={20} 
          color={focused ? '#FFFFFF' : colors.tabInactive} 
        />
      </View>
      <Text 
        numberOfLines={1} 
        style={[
          styles.tabLabel, 
          { 
            color: focused ? (isDark ? '#60A5FA' : '#2563EB') : colors.tabInactive,
            fontWeight: focused ? '800' : '700'
          }
        ]}
      >
        {label}
      </Text>
    </View>
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

      const isHomeTab = pathname === '/' || 
                        pathname === '/(tabs)' || 
                        pathname === '/index' || 
                        pathname === '/(tabs)/index' ||
                        (isAdmin && (pathname === '/admin' || pathname === '/(tabs)/admin'));

      if (!isHomeTab) {
        router.replace(isAdmin ? '/(tabs)/admin' : '/(tabs)' as any);
        return true;
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

  if (booting) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (mustChangePassword) {
    return <Redirect href="/change-password" />;
  }

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#60A5FA' : '#2563EB',
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarButton: HapticTab as any,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: colors.navBg, borderTopColor: colors.border }],
        tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
      }}>
      
      <Tabs.Screen
        name="admin"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={isAdmin ? "shield-check" : "grid"} 
              label={isAdmin ? "Command" : "Admin"} 
              color={color} 
              focused={focused} 
              family={isAdmin ? "MaterialCommunityIcons" : "Feather"}
            />
          ),
          href: isAdmin ? '/(tabs)/admin' : null,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: isAdmin ? null : '/(tabs)',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="home" label="Home" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="college"
        options={{
          href: isAdmin ? null : ('/(tabs)/college' as any),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="school" label="College" color={color} focused={focused} family="MaterialCommunityIcons" />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          href: (isAdmin || globalSettings?.community_enabled === false) ? null : ('/(tabs)/community' as any),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="users" label="Community" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          href: isAdmin ? null : ('/(tabs)/explore' as any),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="compass" label="Explore" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="user_profile"
        options={{
          href: '/(tabs)/user_profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="user" label="Profile" color={color} focused={focused} />
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 98 : 82,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingHorizontal: 2,
    flex: 1,
  },
  iconBox: {
    width: 52,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 11.5,
    letterSpacing: 0.2,
    textAlign: 'center',
    width: '100%',
  }
});
