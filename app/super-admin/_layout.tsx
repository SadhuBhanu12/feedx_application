import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import HapticTab from '@/components/haptic-tab';
import { useUser } from '@/context/UserContext';

interface TabIconProps {
  icon: any;
  color: string;
  focused: boolean;
  label: string;
  family?: 'Feather' | 'Ionicons' | 'MaterialCommunityIcons';
}

function TabIcon({ icon, color, focused, label, family = 'Feather' }: TabIconProps) {
  const IconComponent = family === 'Feather' ? Feather : family === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
  
  return (
    <View style={styles.iconContainer}>
      <View style={styles.iconBox}>
        <IconComponent 
          name={icon} 
          size={24} 
          color={focused ? '#F59E0B' : 'rgba(255,255,255,0.4)'} 
        />
        {focused && <View style={styles.activePill} />}
      </View>
      <Text numberOfLines={1} style={[
        styles.tabLabel, 
        { color: focused ? '#F59E0B' : 'rgba(255,255,255,0.4)', fontWeight: focused ? '800' : '600' }
      ]}>{label}</Text>
    </View>
  );
}

export default function SuperAdminLayout() {
  const { user, booting, mustChangePassword } = useUser();
  const role = String(user?.role || '').trim().toLowerCase();
  
  if (booting) return null;

  // Extra security check for layout
  if (!user || role !== 'super_admin') {
    return <Redirect href="/login" />;
  }

  if (mustChangePassword) {
    return <Redirect href="/change-password" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
        tabBarButton: HapticTab as any,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="globe" label="Global" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="colleges"
        options={{
          title: 'Colleges',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="domain" label="Institutes" color={color} focused={focused} family="MaterialCommunityIcons" />
          ),
        }}
      />

      <Tabs.Screen
        name="admins"
        options={{
          title: 'Admins',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="shield-account-outline" label="Admins" color={color} focused={focused} family="MaterialCommunityIcons" />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="account-group-outline" label="Community" color={color} focused={focused} family="MaterialCommunityIcons" />
          ),
        }}
      />

      <Tabs.Screen
        name="support"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="settings" label="Config" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="tools"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="innovations"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="calendar-star" label="Events" color={color} focused={focused} family="MaterialCommunityIcons" />
          ),
        }}
      />
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
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 26 : 18,
    width: 72,
  },
  iconBox: {
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  activePill: {
    position: 'absolute',
    bottom: -4,
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 9, 
    letterSpacing: 0.1,
    textTransform: 'uppercase',
  }
});
