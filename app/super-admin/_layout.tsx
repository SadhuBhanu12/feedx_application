import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import HapticTab from '@/components/haptic-tab';
import { useUser } from '@/context/UserContext';

interface TabIconProps {
  icon: any;
  color?: any;
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
          size={22} 
          color={focused ? '#F59E0B' : 'rgba(255,255,255,0.4)'} 
        />
        {focused && <View style={styles.activePill} />}
      </View>
      <Text 
        numberOfLines={1} 
        adjustsFontSizeToFit={true}
        minimumFontScale={0.8}
        maxFontSizeMultiplier={1.15}
        style={[
          styles.tabLabel, 
          { color: focused ? '#F59E0B' : 'rgba(255,255,255,0.4)', fontWeight: focused ? '800' : '600' }
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function SuperAdminLayout() {
  const insets = useSafeAreaInsets();
  const { user, booting, mustChangePassword } = useUser();
  const role = String(user?.role || '').trim().toLowerCase();
  
  if (booting) return null;

  // Extra security check for layout
  if (!user || role !== 'super_admin') {
    return <Redirect href="/login" />;
  }

  if (user.is_active === false) {
    return <Redirect href="/login" />;
  }

  if (mustChangePassword) {
    return <Redirect href="/login" />;
  }

  const safeBottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 8);
  const tabHeight = (Platform.OS === 'ios' ? 56 : 58) + safeBottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
        tabBarButton: (props: any) => <HapticTab {...props} />,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabHeight,
            paddingBottom: safeBottom,
          }
        ],
        tabBarItemStyle: styles.tabBarItem,
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

      <Tabs.Screen
        name="analytics"
        options={{
          href: null,
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
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 2,
  },
  iconBox: {
    width: 38,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 3,
  },
  activePill: {
    position: 'absolute',
    bottom: -3,
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 9.5, 
    lineHeight: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    width: '100%',
  }
});
