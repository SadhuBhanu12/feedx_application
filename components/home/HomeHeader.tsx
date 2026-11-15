import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '@/context/UserContext';
import { useGamification } from '@/context/GamificationContext';
import StreakModal from '@/components/gamification/StreakModal';

import FeedxAppLogo from '@/components/ui/FeedxAppLogo';

interface HomeHeaderProps {
  user: any;
  dashboard: any;
  onNotificationPress?: () => void;
}

export function HomeHeader({ user: propUser, dashboard, onNotificationPress }: HomeHeaderProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user: ctxUser, notifications: ctxNotifications, unreadNotificationsCount: rawUnreadCount } = useUser();
  const user = ctxUser || propUser;
  const { wallet, streak } = useGamification();
  const [streakModalVisible, setStreakModalVisible] = React.useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const profile = dashboard?.profile || {};
  const rawName = 
    user?.full_name || 
    user?.name || 
    user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    profile?.full_name || 
    profile?.name ||
    user?.student?.full_name ||
    dashboard?.student?.full_name;
  const studentName = rawName ? String(rawName).trim() : null;

  // Dynamic base font size based on character count so long names adjust cleanly
  const getDynamicFontSize = (name: string | null) => {
    if (!name) return 17;
    const len = name.length;
    if (len > 26) return 12;
    if (len > 20) return 13.5;
    if (len > 15) return 15;
    if (len > 10) return 16.5;
    return 18;
  };
  const collegeName = 
    profile?.college_name || 
    profile?.college?.name || 
    user?.college_name || 
    user?.college?.name || 
    user?.colleges?.name || 
    user?.user_metadata?.college_name || 
    'FEEDX Polytechnic';
  const streakCount = streak?.current_streak ?? user?.streak_count ?? user?.streak ?? 0;
  const xpPoints = wallet?.tokens !== undefined ? wallet.tokens : (user?.tokens !== undefined ? user.tokens : (streak?.xp_points ?? user?.xp_points ?? 0));
  const activeNotifs = ctxNotifications && ctxNotifications.length > 0 ? ctxNotifications : (dashboard?.notifications || []);
  const unreadCount = rawUnreadCount !== undefined ? rawUnreadCount : activeNotifs.filter((n: any) => !n.is_read).length;

  return (
    <>
    <Animated.View entering={FadeInDown.duration(400).springify()} style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 12) }]}>
      <View style={styles.leftGroup}>
        <TouchableOpacity 
          style={[styles.logoWrap, { backgroundColor: '#FFFFFF', borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.25)' }]} 
          onPress={() => router.push('/about-feedx')}
          activeOpacity={0.8}
        >
          <Image source={require('../../assets/images/icon.png')} style={styles.logoImage} contentFit="contain" />
        </TouchableOpacity>
        <View style={styles.textWrap}>
          <Text style={[styles.greetingSubtitle, { color: isDark ? '#60A5FA' : '#2563EB' }]}>
            {getGreeting()}
          </Text>
          <Text
            style={[
              styles.greetingName, 
              { 
                color: colors.textPrimary,
                fontSize: getDynamicFontSize(studentName),
              }
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.65}
            ellipsizeMode="tail"
          >
            {studentName || 'Welcome to FEEDX'}
          </Text>
        </View>
      </View>

      <View style={styles.rightGroup}>
        {/* Streak indicator */}
        <TouchableOpacity 
          style={[styles.badgePill, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}
          onPress={() => setStreakModalVisible(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="fire" size={14} color="#F59E0B" />
          <Text style={[styles.badgeText, { color: '#F59E0B' }]}>{streakCount}</Text>
        </TouchableOpacity>

        {/* Spendable Points indicator */}
        <TouchableOpacity 
          style={[styles.badgePill, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}
          onPress={() => router.push('/rewards')}
          activeOpacity={0.8}
        >
          <Feather name="star" size={12} color="#3B82F6" />
          <Text style={[styles.badgeText, { color: '#3B82F6' }]}>{xpPoints}</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={onNotificationPress || (() => router.push('/(tabs)/updates'))}
          activeOpacity={0.7}
        >
          <Feather name="bell" size={17} color={colors.textSecondary} />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
    <StreakModal visible={streakModalVisible} onClose={() => setStreakModalVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    minWidth: 0,
  },
  logoWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
  textWrap: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    minWidth: 0,
  },
  greetingSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  greetingName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  unreadCountText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
  },
});
