import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS } from '@/constants/theme';

import { useGamification } from '@/context/GamificationContext';
import StreakModal from '@/components/gamification/StreakModal';

interface HomeHeaderProps {
  user: any;
  dashboard: any;
  onNotificationPress?: () => void;
}

export function HomeHeader({ user, dashboard, onNotificationPress }: HomeHeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const { wallet, streak } = useGamification();
  const [streakModalVisible, setStreakModalVisible] = React.useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  const profile = dashboard?.profile || {};
  const rawName = user?.full_name || user?.name || profile?.full_name || profile?.name;
  const studentName = rawName ? String(rawName).trim() : null;
  const collegeName = profile.college_name || user?.college_name || 'FeedX Polytechnic';
  const streakCount = streak?.current_streak || user?.streak_count || user?.streak || 0;
  const coinsCount = wallet?.gold_coins !== undefined ? wallet.gold_coins : (user?.gold_coins ?? user?.coins ?? 0);
  const xpPoints = streak?.xp_points !== undefined ? streak.xp_points : (user?.xp_points ?? user?.xp ?? 0);
  const unreadCount = (dashboard?.notifications || []).filter((n: any) => !n.is_read).length;

  return (
    <>
    <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.container}>
      <View style={styles.leftGroup}>
        <TouchableOpacity 
          style={styles.logoWrap} 
          onPress={() => router.push('/about-feedx')}
          activeOpacity={0.8}
        >
          <Image source={require('../../assets/images/icon.png')} style={styles.logoImage} contentFit="cover" />
        </TouchableOpacity>
        <View style={styles.textWrap}>
          <Text style={[styles.greetingText, { color: colors.textPrimary }]}>
            {studentName ? (
              <>
                {getGreeting()}, <Text style={styles.nameHighlight}>{studentName}</Text>
              </>
            ) : (
              'Welcome to FEEDX'
            )}
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
          <MaterialCommunityIcons name="fire" size={16} color="#F59E0B" />
          <Text style={[styles.badgeText, { color: '#F59E0B' }]}>{streakCount}</Text>
        </TouchableOpacity>

        {/* Milestone Coins indicator */}
        <TouchableOpacity 
          style={[styles.badgePill, { backgroundColor: 'rgba(234, 179, 8, 0.12)' }]}
          onPress={() => router.push('/rewards')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="circle-multiple" size={15} color="#EAB308" />
          <Text style={[styles.badgeText, { color: '#EAB308' }]}>{coinsCount}</Text>
        </TouchableOpacity>

        {/* Spendable Points indicator */}
        <TouchableOpacity 
          style={[styles.badgePill, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}
          onPress={() => router.push('/rewards')}
          activeOpacity={0.8}
        >
          <Feather name="star" size={13} color="#3B82F6" />
          <Text style={[styles.badgeText, { color: '#3B82F6' }]}>{xpPoints}</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={onNotificationPress || (() => router.push('/(tabs)/updates'))}
          activeOpacity={0.7}
        >
          <Feather name="bell" size={19} color={colors.textSecondary} />
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
    paddingTop: 52,
    paddingBottom: SPACING.sm,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textWrap: {
    flex: 1,
    marginLeft: 10,
  },
  instLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
  },
  nameHighlight: {
    fontWeight: '900',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
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
