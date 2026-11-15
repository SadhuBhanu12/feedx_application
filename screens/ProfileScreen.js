import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Share,
  Platform,
  Linking,
  Modal,
  ActivityIndicator,
  Clipboard,
  InteractionManager
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';
import { UserAvatar, getGenderAvatarUri } from '@/components/ui/UserAvatar';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { calculateProfileCompletion } from '@/utils/profile';
import { roadmapService } from '@/services/roadmapService';
import { resolveStandardFeedXId, resolveQuizueId, getQrVerificationPayload } from '@/services/idService';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect, useIsFocused } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { useGamification } from '@/context/GamificationContext';
import { fetchDailyStreak } from '@/services/gamificationService';
import { DAILY_TARGET_TOKENS } from '@/constants/rewardConfig';

const { width } = Dimensions.get('window');

const AVATAR_PRESETS = [
  { id: '1', name: 'Male Student 3D', url: 'https://api.dicebear.com/7.x/bottts/png?seed=MaleStudent&backgroundColor=3b82f6' },
  { id: '2', name: 'Female Student 3D', url: 'https://api.dicebear.com/7.x/bottts/png?seed=FemaleStudent&backgroundColor=ec4899' },
  { id: '3', name: 'Tech Innovator', url: 'https://api.dicebear.com/7.x/bottts/png?seed=TechInnovator&backgroundColor=8b5cf6' },
  { id: '4', name: 'AI Scholar', url: 'https://api.dicebear.com/7.x/bottts/png?seed=AIScholar&backgroundColor=10b981' },
  { id: '5', name: 'Cyber Specialist', url: 'https://api.dicebear.com/7.x/bottts/png?seed=CyberSpecialist&backgroundColor=06b6d4' },
  { id: '6', name: 'Creative Designer', url: 'https://api.dicebear.com/7.x/bottts/png?seed=CreativeDesigner&backgroundColor=f59e0b' },
  { id: '7', name: 'Lead Developer', url: 'https://api.dicebear.com/7.x/bottts/png?seed=LeadDeveloper&backgroundColor=ef4444' },
  { id: '8', name: 'Academic Scholar', url: 'https://api.dicebear.com/7.x/avataaars/png?seed=AcademicScholar&backgroundColor=3b82f6' },
  { id: '9', name: 'Polytechnic Executive', url: 'https://api.dicebear.com/7.x/avataaars/png?seed=PolytechnicExec&backgroundColor=1e293b' },
  { id: '10', name: 'Code Prodigy', url: 'https://api.dicebear.com/7.x/bottts/png?seed=CodeProdigy&backgroundColor=6366f1' },
  { id: '11', name: 'Engineering Hero', url: 'https://api.dicebear.com/7.x/adventurer/png?seed=EngineeringHero&backgroundColor=14b8a6' },
];

function PulsingFlame({ size = 16, color = '#F59E0B' }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    try {
      if (typeof withRepeat === 'function' && typeof withSequence === 'function' && typeof withTiming === 'function') {
        scale.value = withRepeat(
          withSequence(
            withTiming(1.22, { duration: 650, easing: Easing?.inOut ? Easing.inOut(Easing.ease) : undefined }),
            withTiming(1.0, { duration: 650, easing: Easing?.inOut ? Easing.inOut(Easing.ease) : undefined })
          ),
          -1,
          true
        );
      }
    } catch (_) { }
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <MaterialCommunityIcons name="fire" size={size} color={color} />
    </Animated.View>
  );
}

function AnimatedProgressBar({ percentage, color, height = 8, style = null }) {
  const { isDark } = useTheme();
  const targetPct = Math.min(100, Math.max(0, Number(percentage) || 0));
  const trackBg = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <View style={[styles.refProgressTrack, { height, backgroundColor: trackBg }, style]}>
      <View
        style={[
          styles.refProgressFill,
          {
            backgroundColor: color,
            width: `${targetPct}%`,
            minWidth: targetPct > 0 ? 6 : 0,
          },
        ]}
      />
    </View>
  );
}

function LeetCodeStreakCard({ user }) {
  const { colors, isDark } = useTheme();
  const { streak: realGamificationStreak, transactions, completeDailyLogin, refreshGamification } = useGamification();

  const initialStreak = realGamificationStreak?.current_streak ?? user?.streak_count ?? user?.streak ?? 0;
  const initialMax = realGamificationStreak?.longest_streak ?? user?.max_streak ?? user?.longest_streak ?? initialStreak;
  const initialTotal = realGamificationStreak?.total_active_days ?? user?.total_active_days ?? initialStreak;

  const [dbStreak, setDbStreak] = React.useState({
    streakCount: initialStreak,
    maxStreak: initialMax,
    totalActiveDays: initialTotal,
  });

  // Streak state synced from verified activities only (not merely opening profile)

  // Sync with Gamification Context updates
  React.useEffect(() => {
    if (realGamificationStreak) {
      const curr = realGamificationStreak.current_streak ?? 0;
      setDbStreak({
        streakCount: curr,
        maxStreak: realGamificationStreak.longest_streak ?? curr,
        totalActiveDays: realGamificationStreak.total_active_days ?? curr,
      });
    }
  }, [realGamificationStreak]);

  // Fetch real-time streak on focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      if (!user?.id) return;

      const fetchStreakFromDb = async () => {
        try {
          const data = await fetchDailyStreak(user.id);
          if (data && isMounted) {
            const curr = data.current_streak !== undefined ? data.current_streak : 0;
            setDbStreak({
              streakCount: curr,
              maxStreak: data.longest_streak !== undefined ? data.longest_streak : curr,
              totalActiveDays: data.total_active_days !== undefined ? data.total_active_days : curr,
            });
          }
        } catch (e) {
          console.warn('Realtime streak fetch exception:', e);
        }
      };

      fetchStreakFromDb();
      return () => {
        isMounted = false;
      };
    }, [user?.id])
  );

  React.useEffect(() => {
    if (!user?.id) return;

    // Real-time Postgres Subscription for instant DB updates
    const channel = supabase
      .channel(`streak_realtime_profile_${user.id}_${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_streaks', filter: `student_id=eq.${user.id}` },
        (payload) => {
          if (payload.new) {
            const curr = payload.new.current_streak !== undefined ? payload.new.current_streak : 0;
            setDbStreak({
              streakCount: curr,
              maxStreak: payload.new.longest_streak !== undefined ? payload.new.longest_streak : curr,
              totalActiveDays: payload.new.total_active_days !== undefined ? payload.new.total_active_days : curr,
            });
            if (refreshGamification) {
              refreshGamification().catch(() => { });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refreshGamification]);

  const streakCount = dbStreak.streakCount;
  const maxStreak = dbStreak.maxStreak;
  const totalActiveDays = dbStreak.totalActiveDays;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = (new Date().getDay() + 6) % 7;

  // Real-time weekly active days computed dynamically from database transactions & streak
  const thisWeekActiveMap = React.useMemo(() => {
    const activeMap = {};
    const now = new Date();
    const currentDayIdx = (now.getDay() + 6) % 7; // 0 for Mon, 6 for Sun

    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayIdx);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      weekDates.push(`${y}-${m}-${dd}`);
    }

    const txDates = new Set();
    if (transactions && transactions.length > 0) {
      transactions.forEach((tx) => {
        if (tx.created_at) {
          try {
            const d = new Date(tx.created_at);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            txDates.add(`${y}-${m}-${dd}`);
          } catch (_) { }
        }
        if (tx.reference_id) {
          const match = tx.reference_id.match(/\d{4}-\d{2}-\d{2}/);
          if (match) txDates.add(match[0]);
        }
      });
    }

    weekDates.forEach((dateStr, idx) => {
      const isPastOrToday = idx <= currentDayIdx;
      const daysAgo = currentDayIdx - idx;
      const hasTx = txDates.has(dateStr);
      const inStreak = isPastOrToday && daysAgo < streakCount;
      activeMap[idx] = hasTx || inStreak;
    });

    return activeMap;
  }, [transactions, streakCount]);

  return (
    <Animated.View entering={FadeInDown.delay(220).springify()} style={[styles.streakCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      {/* Header */}
      <View style={styles.streakHeaderRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <PulsingFlame size={24} color="#F59E0B" />
          <Text style={[styles.streakCardTitle, { color: colors.textPrimary }]}>Daily Streak & Activity</Text>
        </View>
        <View style={styles.currentStreakBadge}>
          <Text style={styles.currentStreakBadgeText}>
            <AnimatedNumber value={streakCount} /> Day Streak 🔥
          </Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.streakMetricsGrid}>
        <View style={[styles.metricBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.12)' }]}>
          <Text style={[styles.metricVal, { color: '#F59E0B' }]}>
            <AnimatedNumber value={streakCount} />
          </Text>
          <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Current 🔥</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.12)' }]}>
          <Text style={[styles.metricVal, { color: '#3B82F6' }]}>
            <AnimatedNumber value={maxStreak} />
          </Text>
          <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Max Streak ⚡</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.12)' }]}>
          <Text style={[styles.metricVal, { color: '#10B981' }]}>
            <AnimatedNumber value={totalActiveDays} />
          </Text>
          <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Total Active 🎯</Text>
        </View>
      </View>

      {/* Weekly Breakdown Section */}
      <View style={{ marginTop: 14 }}>
        <Text style={[styles.subSectionTitle, { color: colors.textMuted }]}>THIS WEEK'S BREAKDOWN</Text>
        <View style={styles.weeklyBubblesRow}>
          {daysOfWeek.map((day, idx) => {
            const isActive = !!thisWeekActiveMap[idx];
            const isToday = idx === currentDayIndex;
            return (
              <View key={day} style={styles.dayBubbleItem}>
                <View style={[
                  styles.dayBubble,
                  isActive && { backgroundColor: '#10B981' },
                  isToday && { borderWidth: 2, borderColor: '#F59E0B' },
                  !isActive && { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }
                ]}>
                  {isActive ? (
                    <PulsingFlame size={15} color="#FFF" />
                  ) : (
                    <Text style={[styles.dayBubbleText, { color: colors.textMuted }]}>{day[0]}</Text>
                  )}
                </View>
                <Text style={[styles.dayLabelText, { color: isToday ? colors.primary : colors.textMuted }]}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const { user, setUser, signOut, refreshDashboard, refreshProfile, notifications: ctxNotifications, unreadNotificationsCount: rawUnreadCount } = useUser();
  const unreadNotifs = rawUnreadCount !== undefined ? rawUnreadCount : (ctxNotifications || []).filter((n) => !n.is_read).length;
  const { wallet: gamificationWallet, streak: realGamificationStreak, transactions, todayPoints: ctxTodayPoints, dailyGoal: ctxDailyGoal, refreshGamification } = useGamification();
  const router = useRouter();
  const isFocused = useIsFocused();

  const dailyTarget = ctxDailyGoal || DAILY_TARGET_TOKENS;
  const currentTodayPoints = ctxTodayPoints !== undefined ? ctxTodayPoints : 0;
  const todayProgressPercent = Math.min(100, Math.max(0, Math.round((currentTodayPoints / dailyTarget) * 100)));

  // Auto-refresh gamification & real-time progress smoothly after navigation transitions finish
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (refreshProfile) refreshProfile().catch(() => {});
        if (refreshGamification) refreshGamification().catch(() => {});
        if (refreshDashboard) refreshDashboard(true).catch(() => {});
      });
      return () => task.cancel();
    }, [refreshProfile, refreshGamification, refreshDashboard])
  );

  const currentCoins = gamificationWallet?.gold_coins !== undefined ? gamificationWallet.gold_coins : (user?.gold_coins ?? 0);
  const MILESTONES = [
    { target: 5, title: 'Verified Learner Certificate' },
    { target: 10, title: 'Academic Excellence Certificate' },
    { target: 25, title: 'Pro Membership Pass' },
    { target: 50, title: 'Annual Excellence Award' },
    { target: 100, title: 'Honor Roll Trophy' },
    { target: 250, title: 'Hall of Fame Distinction' },
  ];
  const nextMilestone = MILESTONES.find((m) => m.target > currentCoins) || MILESTONES[MILESTONES.length - 1];
  const milestoneProgress = Math.min(100, Math.max(0, Math.round((currentCoins / nextMilestone.target) * 100)));

  // Dynamic Real-Time Weekly Progress from Database Transactions & Streak
  const { activeWeeklyDays, weeklyPct, weeklyBonus } = useMemo(() => {
    const now = new Date();
    const currentDayIdx = (now.getDay() + 6) % 7; // 0 for Mon, 6 for Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayIdx);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      weekDates.push(`${y}-${m}-${dd}`);
    }

    const txDates = new Set();
    if (transactions && transactions.length > 0) {
      transactions.forEach((tx) => {
        if (tx.created_at) {
          try {
            const d = new Date(tx.created_at);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            txDates.add(`${y}-${m}-${dd}`);
          } catch (_) {}
        }
        if (tx.reference_id) {
          const match = tx.reference_id.match(/\d{4}-\d{2}-\d{2}/);
          if (match) txDates.add(match[0]);
        }
      });
    }

    const streakCount = realGamificationStreak?.current_streak ?? user?.streak_count ?? 0;

    let activeCount = 0;
    weekDates.forEach((dateStr, idx) => {
      const isPastOrToday = idx <= currentDayIdx;
      const daysAgo = currentDayIdx - idx;
      const hasTx = txDates.has(dateStr);
      const inStreak = isPastOrToday && streakCount > 0 && daysAgo < streakCount;
      if (hasTx || inStreak) {
        activeCount++;
      }
    });

    const days = Math.min(7, Math.max(0, activeCount));
    const pct = Math.min(100, Math.round((days / 7) * 100));
    const bonus = days * 100;

    return { activeWeeklyDays: days, weeklyPct: pct, weeklyBonus: bonus };
  }, [transactions, realGamificationStreak, user?.streak_count]);

  // Modals state
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  // Dynamic Real-Time Active Roadmap State
  const [activeRoadmap, setActiveRoadmap] = useState(() => roadmapService.getActiveRoadmapSummary(user?.domain));

  useEffect(() => {
    const summary = roadmapService.getActiveRoadmapSummary(user?.domain);
    setActiveRoadmap(summary);

    if (user?.id) {
      roadmapService.fetchProgressFromSupabase(user.id, user?.domain)
        .then(() => {
          const updated = roadmapService.getActiveRoadmapSummary(user?.domain);
          setActiveRoadmap(updated);
        })
        .catch(() => { });
    }
  }, [user?.id, user?.domain]);

  const handleSelectAvatar = async (url) => {
    if (!user?.id) return;
    setUpdatingAvatar(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: url })
        .eq('id', user.id);

      if (error) console.warn('[handleSelectAvatar] Supabase warning:', error.message);

      setUser({ ...user, avatar_url: url });
      setAvatarPickerVisible(false);
      Alert.alert('Avatar Updated', 'Your student profile avatar has been updated successfully!');
    } catch (err) {
      console.error('[handleSelectAvatar] Error:', err);
      Alert.alert('Update Failed', err?.message || 'Unable to update profile avatar.');
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handlePickCustomImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        handleSelectAvatar(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Image Selection Failed', 'Unable to pick image from gallery.');
    }
  };

  if (!user) return null;
  const derivedEmailName = user?.email ? user.email.split('@')[0].replace(/[._0-9]+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase()) : '';
  const userName = (user?.full_name && user.full_name !== 'User' && user.full_name !== 'Student') ? user.full_name : (derivedEmailName || 'Student');
  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'inst_admin' || role === 'college_admin';

  const rollNumber = isAdmin ? null : (user?.pin_number || user?.roll_no || user?.roll_number || user?.student_id || null);
  const collegeName = user?.college_name || user?.colleges?.college_name || user?.colleges?.name || user?.college?.name || (isAdmin ? (role === 'super_admin' ? 'FEEDX Master Control' : 'State Polytechnic Institution') : 'State Polytechnic Institution');
  const departmentName = user?.department || (isAdmin ? (role === 'super_admin' ? 'Executive Administration' : 'Campus Administration') : null);
  const branchName = isAdmin ? '' : (user?.branch || 'Polytechnic Engineering');
  const yearText = (!isAdmin && user?.year) ? `${user.year}${user.semester ? ` • Sem ${user.semester}` : ''}` : '';

  const getCompletionPercentage = () => {
    return calculateProfileCompletion(user);
  };

  const getFeedxId = () => {
    return resolveStandardFeedXId(user);
  };

  const handleShareProfile = async () => {
    try {
      const feedxId = getFeedxId();
      const message = `👤 Name: ${userName}\n🎓 FEEDX ID: ${feedxId}\n🔗 Profile: https://feedxpolytechnic.com/verify/${feedxId}\n\n📱 Download FEEDX Identity App for Polytechnic Students!`;
      await Share.share({
        message,
        title: `${userName}'s FEEDX Profile`,
      });
    } catch (e) {
      console.warn('Share profile error:', e);
    }
  };

  const handleCopyFeedxId = () => {
    const feedxId = getFeedxId();
    Clipboard.setString(feedxId);
    Alert.alert('Copied!', `FEEDX ID (${feedxId}) copied to your clipboard.`);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of FEEDX?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/login');
          } catch (e) {
            Alert.alert('Logout Failed', e.message);
          }
        },
      },
    ]);
  };

  const completionPct = getCompletionPercentage();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFill} />}

      {/* Top Header Row with Top-Right Settings Gear & Share Button */}
      <View style={[styles.topHeader, { borderBottomColor: colors.cardBorder }]}>
        <Text style={[styles.topHeaderTitle, { color: colors.textPrimary }]}>{isAdmin ? 'Administrator Profile' : 'Student Profile'}</Text>

        <View style={styles.topHeaderActionsRow}>
          {/* Notifications Button */}
          <TouchableOpacity
            style={styles.topHeaderIconBtn}
            onPress={() => router.push(isAdmin ? '/(tabs)/admin/notifications' : '/(tabs)/updates')}
            activeOpacity={0.75}
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={18} color={colors.textPrimary} />
            {unreadNotifs > 0 && (
              <View style={styles.headerUnreadBadge}>
                <Text style={styles.headerUnreadBadgeText}>
                  {unreadNotifs > 99 ? '99+' : unreadNotifs}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.topHeaderIconBtn}
            onPress={() => router.push('/profile-edit')}
            activeOpacity={0.75}
            accessibilityLabel="Edit Profile"
          >
            <Feather name="edit-3" size={18} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Saved Bookmarks Button */}
          <TouchableOpacity
            style={styles.topHeaderIconBtn}
            onPress={() => router.push('/bookmarks')}
            activeOpacity={0.75}
          >
            <Feather name="bookmark" size={19} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Top-Right Settings Button */}
          <TouchableOpacity
            style={styles.topHeaderIconBtn}
            onPress={() => router.push('/institutional-settings')}
            activeOpacity={0.75}
          >
            <Feather name="settings" size={19} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Share Profile Button */}
          <TouchableOpacity
            style={styles.topHeaderIconBtn}
            onPress={handleShareProfile}
            activeOpacity={0.75}
          >
            <Feather name="share-2" size={19} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 1. Student Identity Overview (Redesigned with Zero Overflow) */}
        <Animated.View entering={FadeInUp.duration(450).springify()} style={[styles.horizontalProfileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Top Section: Avatar & Essential Identity */}
          <View style={styles.profileCardTopRow}>
            {/* Avatar Column */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setAvatarPickerVisible(true)}
              onLongPress={() => setAvatarModalVisible(true)}
              delayLongPress={400}
              style={styles.horizontalAvatarWrapper}
            >
              <UserAvatar user={user} size={66} showBadge animated />
              <View style={styles.horizontalCameraBadge}>
                <Feather name="camera" size={11} color="#FFF" />
              </View>
            </TouchableOpacity>

            {/* Name & Role Column */}
            <View style={styles.profileCardNameCol}>
              <View style={styles.horizontalNameRow}>
                <Text
                  style={[styles.horizontalNameText, { color: colors.textPrimary }]}
                >
                  {userName}
                </Text>
                <MaterialCommunityIcons name="check-decagram" size={18} color="#2563EB" style={{ marginLeft: 4, flexShrink: 0 }} />
              </View>

              {/* Role Badge */}
              <View style={styles.horizontalRoleRow}>
                <View style={[styles.horizontalRoleBadge, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }]}>
                  <Text style={styles.horizontalRoleText}>
                    {role === 'super_admin' ? '🛡️ SUPER ADMIN' : isAdmin ? '🏛️ COLLEGE ADMIN' : '⚡ VERIFIED STUDENT'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Identifiers Chips (FEEDX ID & Roll No / PIN) */}
          <View style={styles.identifiersRow}>
            {/* Clickable FEEDX ID Pill */}
            {!isAdmin && (
              <TouchableOpacity
                onPress={() => setQrModalVisible(true)}
                activeOpacity={0.7}
                style={[styles.horizontalIdPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9', borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}
              >
                <Text style={[styles.idLabelText, { color: isDark ? '#94A3B8' : '#64748B' }]}>ID:</Text>
                <Text style={[styles.horizontalIdText, { color: colors.textPrimary }]}>{getFeedxId()}</Text>
                <Ionicons name="qr-code-outline" size={13} color="#2563EB" style={{ marginLeft: 4, flexShrink: 0 }} />
              </TouchableOpacity>
            )}

            {/* Roll Number / PIN Badge */}
            {Boolean(rollNumber) && (
              <View style={[styles.rollNoPill, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7', borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : '#FDE68A' }]}>
                <Feather name="hash" size={11} color="#F59E0B" style={{ flexShrink: 0 }} />
                <Text style={[styles.rollNoLabel, { color: isDark ? '#FBBF24' : '#D97706' }]}>PIN:</Text>
                <Text style={[styles.rollNoText, { color: isDark ? '#FDE68A' : '#92400E' }]}>{rollNumber}</Text>
              </View>
            )}
          </View>

          {/* Academic / Institutional Metadata */}
          <View style={[styles.academicDetailsBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0' }]}>
            {isAdmin ? (
              <>
                <View style={styles.academicDetailRow}>
                  <Feather name="shield" size={13} color="#3B82F6" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Text style={[styles.academicDetailText, { color: colors.textSecondary, fontWeight: '700' }]}>
                    {departmentName || 'Campus Administration'}
                  </Text>
                </View>
                <View style={styles.academicDetailRow}>
                  <Feather name="map-pin" size={13} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Text style={[styles.academicDetailText, { color: colors.textMuted }]}>
                    {collegeName}
                  </Text>
                </View>
              </>
            ) : (
              <>
                {Boolean(branchName) && (
                  <View style={styles.academicDetailRow}>
                    <Feather name="book-open" size={12} color="#3B82F6" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Text style={[styles.academicDetailText, { color: colors.textSecondary }]}>
                      {branchName}{yearText ? ` • ${yearText}` : ''}
                    </Text>
                  </View>
                )}
                <View style={styles.academicDetailRow}>
                  <Feather name="map-pin" size={12} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Text style={[styles.academicDetailText, { color: colors.textMuted }]}>
                    {collegeName}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Quick Actions at Card Bottom */}
          <View style={styles.cardQuickActionsRow}>
            {!isAdmin && (
              <TouchableOpacity
                style={[styles.cardQuickActionBtn, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF', borderColor: isDark ? 'rgba(37, 99, 235, 0.3)' : '#BFDBFE' }]}
                onPress={() => setQrModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="card-outline" size={13} color="#2563EB" />
                <Text style={[styles.cardQuickActionText, { color: '#2563EB' }]}>Digital ID Card</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.cardQuickActionBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9', borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' }]}
              onPress={() => router.push('/profile-edit')}
              activeOpacity={0.8}
            >
              <Feather name="edit-2" size={12} color={colors.textSecondary} />
              <Text style={[styles.cardQuickActionText, { color: colors.textSecondary }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Profile Completion Meter (Auto-hides when profile is 100% completed) */}
        {!isAdmin && completionPct < 100 && (
          <Animated.View entering={FadeInDown.delay(150).springify()} style={[styles.completionCard, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }]}>
            <View style={styles.completionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="check-circle" size={16} color="#10B981" />
                <Text style={[styles.completionTitle, { color: colors.textPrimary }]}>Profile Completion</Text>
              </View>
              <Text style={styles.completionPercentage}>
                <AnimatedNumber value={completionPct} suffix="%" />
              </Text>
            </View>
            <AnimatedProgressBar percentage={completionPct} color="#10B981" height={6} />
            <Text style={[styles.completionSub, { color: colors.textMuted }]}>Complete your student profile</Text>
          </Animated.View>
        )}

        {/* 2. Daily Streak Activity */}
        {!isAdmin && <LeetCodeStreakCard user={user} />}

        {/* 3. Student Dashboard / Student Performance (Reference Design) */}
        {!isAdmin && (
          <Animated.View entering={FadeInDown.delay(180).springify()} style={[styles.referencePerformanceCard, { backgroundColor: isDark ? '#0B132B' : '#0F172A', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#1E293B' }]}>
            {/* Top Header: STUDENT PERFORMANCE + Wallet Button */}
            <View style={styles.refPerfHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="activity" size={18} color="#38BDF8" />
                <Text style={styles.refPerfTitle}>STUDENT PERFORMANCE</Text>
              </View>

              <TouchableOpacity
                style={styles.refWalletBtn}
                onPress={() => router.push('/rewards')}
                activeOpacity={0.8}
              >
                <Feather name="credit-card" size={13} color="#F59E0B" />
                <Text style={styles.refWalletText}>Wallet</Text>
              </TouchableOpacity>
            </View>

            {/* 4 Stat Boxes: TOKENS, COINS, STREAK, LEVEL */}
            <View style={styles.ref4StatRow}>
              {/* Box 1: TOKENS */}
              <View style={styles.refStatBox}>
                <Text style={styles.refPointsVal}>
                  <AnimatedNumber value={gamificationWallet?.tokens !== undefined ? gamificationWallet.tokens : (user?.tokens !== undefined ? user.tokens : (realGamificationStreak?.xp_points !== undefined ? realGamificationStreak.xp_points : (user?.xp_points ?? 0)))} />
                </Text>
                <View style={styles.refStatLblRow}>
                  <Feather name="zap" size={10} color="#38BDF8" />
                  <Text style={styles.refStatLbl}>TOKENS</Text>
                </View>
              </View>

              {/* Box 2: COINS */}
              <View style={styles.refStatBox}>
                <Text style={styles.refCoinsVal}>
                  <AnimatedNumber value={gamificationWallet?.gold_coins !== undefined ? gamificationWallet.gold_coins : (user?.gold_coins !== undefined ? user.gold_coins : (user?.coins ?? 0))} />
                </Text>
                <View style={styles.refStatLblRow}>
                  <MaterialCommunityIcons name="circle-multiple-outline" size={10} color="#F59E0B" />
                  <Text style={styles.refStatLbl}>COINS</Text>
                </View>
              </View>

              {/* Box 3: STREAK */}
              <View style={styles.refStatBox}>
                <Text style={styles.refStreakVal}>
                  <AnimatedNumber value={realGamificationStreak?.current_streak || user?.streak_count || 1} suffix="d" />
                </Text>
                <View style={styles.refStatLblRow}>
                  <Ionicons name="flame" size={11} color="#EF4444" />
                  <Text style={styles.refStatLbl}>STREAK</Text>
                </View>
              </View>

              {/* Box 4: LEVEL */}
              <View style={styles.refStatBox}>
                <Text style={styles.refLevelVal}>
                  <AnimatedNumber value={Math.max(1, Math.floor(((realGamificationStreak?.xp_points ?? gamificationWallet?.tokens ?? user?.xp_points ?? 0) / 500)) + 1)} />
                </Text>
                <View style={styles.refStatLblRow}>
                  <Feather name="shield" size={10} color="#10B981" />
                  <Text style={styles.refStatLbl}>LEVEL</Text>
                </View>
              </View>
            </View>

            {/* Progress Section 1: Today's Progress */}
            <View style={styles.refProgressSection}>
              <View style={styles.refProgressHeaderRow}>
                <Text style={styles.refProgressTitle}>Today's Progress</Text>
                <Text style={styles.refProgressValText}>
                  <AnimatedNumber value={currentTodayPoints} /> / {dailyTarget} Tokens
                </Text>
              </View>
              <AnimatedProgressBar percentage={todayProgressPercent} color="#10B981" height={8} />
              <Text style={styles.refProgressSub}>
                {currentTodayPoints >= dailyTarget
                  ? `Daily Goal Complete! +${currentTodayPoints} Tokens earned`
                  : `${Math.max(0, dailyTarget - currentTodayPoints)} Tokens remaining to reach daily goal`}
              </Text>
            </View>

            {/* Progress Section 2: Active Roadmap (100% Dynamic & Real-time) */}
            <TouchableOpacity 
              style={styles.refProgressSection}
              onPress={() => router.push('/roadmap')}
              activeOpacity={0.85}
            >
              <View style={styles.refProgressHeaderRow}>
                <Text style={[styles.refProgressTitle, { flex: 1, marginRight: 8 }]}>
                  Active Roadmap: {activeRoadmap.title} <Feather name="chevron-right" size={12} color="#94A3B8" />
                </Text>
                <Text style={styles.refProgressValText}>
                  <AnimatedNumber value={activeRoadmap.percentage} suffix="%" /> Completed
                </Text>
              </View>
              <AnimatedProgressBar percentage={activeRoadmap.percentage} color="#38BDF8" height={8} />
              <Text style={styles.refProgressSub}>
                {activeRoadmap.completedPhasesCount} of {activeRoadmap.totalPhasesCount} Phases Complete ({activeRoadmap.remainingDays} Days Remaining)
              </Text>
            </TouchableOpacity>

            {/* Progress Section 3: Next Achievement */}
            <View style={styles.refProgressSection}>
              <View style={styles.refProgressHeaderRow}>
                <Text style={styles.refProgressTitle}>Next Achievement</Text>
                <Text style={styles.refProgressValText}>
                  <AnimatedNumber value={currentCoins} /> / {nextMilestone.target} Coins
                </Text>
              </View>
              <AnimatedProgressBar percentage={milestoneProgress} color="#F59E0B" height={8} />
              <Text style={styles.refProgressSub}>
                {currentCoins >= nextMilestone.target
                  ? `🎉 Unlocked: ${nextMilestone.title}`
                  : `Earn ${nextMilestone.target - currentCoins} more coins to unlock ${nextMilestone.title}`}
              </Text>
            </View>

            {/* Progress Section 4: Weekly Progress */}
            <View style={styles.refProgressSection}>
              <View style={styles.refProgressHeaderRow}>
                <Text style={styles.refProgressTitle}>Weekly Progress</Text>
                <Text style={styles.refProgressValText}>
                  <AnimatedNumber value={weeklyPct} suffix="%" />
                </Text>
              </View>
              <AnimatedProgressBar percentage={weeklyPct} color="#8B5CF6" height={8} />
              <Text style={styles.refProgressSub}>{activeWeeklyDays} / 7 Days Active This Week (+{weeklyBonus} Tokens Bonus)</Text>
            </View>
          </Animated.View>
        )}

        {/* 4. Saved Bookmarks & Quick Actions Hub */}
        {!isAdmin && (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginHorizontal: 16, marginTop: 14 }}>
            <TouchableOpacity 
              style={[styles.savedBookmarksActionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => router.push('/bookmarks')}
              activeOpacity={0.85}
            >
              <View style={[styles.savedBookmarksIconBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
                <Feather name="bookmark" size={20} color="#3B82F6" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.savedBookmarksTitle, { color: colors.textPrimary }]}>Saved Bookmarks</Text>
                  <View style={styles.savedBookmarksBadge}>
                    <Text style={styles.savedBookmarksBadgeText}>COLLECTION</Text>
                  </View>
                </View>
                <Text style={[styles.savedBookmarksSubtitle, { color: colors.textMuted }]}>
                  View saved academic notes, job listings, community posts & events
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Modal: Fullscreen Avatar View */}
        <Modal visible={avatarModalVisible} transparent animationType="fade" onRequestClose={() => setAvatarModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setAvatarModalVisible(false)}>
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>
            <UserAvatar user={user} size={Math.min(width - 80, 280)} showBadge={false} />
            <TouchableOpacity
              style={[styles.uploadCustomBtn, { width: Math.min(width - 80, 280), marginTop: 24 }]}
              onPress={() => {
                setAvatarModalVisible(false);
                setAvatarPickerVisible(true);
              }}
            >
              <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.uploadCustomGradient}>
                <Feather name="camera" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.uploadCustomText}>Change Avatar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Modal: Full-screen FEEDX ID QR Code */}
        <Modal visible={qrModalVisible} transparent animationType="slide" onRequestClose={() => setQrModalVisible(false)}>
          <View style={styles.qrOverlay}>
            <View style={styles.qrCard}>
              <View style={styles.qrHeader}>
                <Text style={styles.qrTitle}>FEEDX Digital ID QR</Text>
                <TouchableOpacity onPress={() => setQrModalVisible(false)}>
                  <Feather name="x" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.qrBody}>
                <QRCode
                  value={getQrVerificationPayload(getFeedxId(), resolveQuizueId(user))}
                  size={200}
                  color="#000"
                  backgroundColor="#FFF"
                />
                <Text style={styles.qrIdText}>{getFeedxId()}</Text>
                <Text style={styles.qrNameText}>{userName}</Text>
              </View>

              <TouchableOpacity style={styles.copyBtn} onPress={handleCopyFeedxId}>
                <Feather name="copy" size={16} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.copyBtnText}>Copy FEEDX ID</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal: Interactive Avatar Picker */}
        <Modal visible={avatarPickerVisible} transparent animationType="slide" onRequestClose={() => setAvatarPickerVisible(false)}>
          <View style={styles.qrOverlay}>
            <View style={[styles.avatarPickerCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.qrHeader}>
                <Text style={[styles.qrTitle, { color: colors.textPrimary }]}>Choose Profile Avatar</Text>
                <TouchableOpacity onPress={() => setAvatarPickerVisible(false)}>
                  <Feather name="x" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.pickerSubTitle, { color: colors.textMuted }]}>
                Select a 3D animated avatar preset or upload a custom photo from your device gallery.
              </Text>

              {/* Upload Custom Image Button */}
              <TouchableOpacity
                style={styles.uploadCustomBtn}
                onPress={handlePickCustomImage}
                disabled={updatingAvatar}
                activeOpacity={0.8}
              >
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.uploadCustomGradient}>
                  <Feather name="image" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.uploadCustomText}>Upload Photo from Gallery</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={[styles.presetsHeader, { color: colors.textSecondary }]}>3D Preset Avatars:</Text>

              {/* Avatar Presets Grid */}
              <ScrollView contentContainerStyle={styles.avatarGrid} showsVerticalScrollIndicator={false}>
                {AVATAR_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.presetItem,
                      { backgroundColor: colors.inputBg, borderColor: colors.cardBorder },
                      user?.avatar_url === preset.url && styles.presetItemActive
                    ]}
                    onPress={() => handleSelectAvatar(preset.url)}
                    disabled={updatingAvatar}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: preset.url }} style={styles.presetImg} />
                    <Text style={[styles.presetName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {preset.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {updatingAvatar && (
                <View style={styles.updatingOverlay}>
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text style={{ color: '#FFF', fontWeight: '700', marginTop: 10 }}>Updating Avatar...</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>

        <View style={styles.footer}>
          <Text style={styles.footerText}>FEEDX POLYTECHNIC • STUDENT PORTAL</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingTop: 6, paddingBottom: 100 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  topHeaderActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topHeaderIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerUnreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  headerUnreadBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    includeFontPadding: false,
  },

  // Horizontal Profile Card Styles (Zero Overflow, Responsive)
  horizontalProfileCard: {
    flexDirection: 'column',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  profileCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  horizontalAvatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  horizontalCameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileCardNameCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 4,
  },
  horizontalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    flexWrap: 'wrap',
    gap: 4,
  },
  horizontalNameText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  horizontalRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  horizontalRoleText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  identifiersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  horizontalIdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: '100%',
  },
  idLabelText: {
    fontSize: 10,
    fontWeight: '800',
    marginRight: 4,
  },
  horizontalIdText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  rollNoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    maxWidth: '100%',
  },
  rollNoLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  rollNoText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  academicDetailsBox: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  academicDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  academicDetailText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    flex: 1,
  },
  cardQuickActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  cardQuickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 5,
  },
  cardQuickActionText: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  // Profile Completion Meter
  completionCard: {
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionTitle: { fontSize: 13, fontWeight: '800' },
  completionPercentage: { fontSize: 13, fontWeight: '900', color: '#10B981' },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  completionSub: { fontSize: 11, fontWeight: '600' },

  // Reference Performance Card Styles (Dark Navy Layout)
  referencePerformanceCard: {
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  refPerfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refPerfTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  refWalletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  refWalletText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F59E0B',
  },
  ref4StatRow: {
    flexDirection: 'row',
    gap: 8,
  },
  refStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  refPointsVal: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  refCoinsVal: {
    fontSize: 19,
    fontWeight: '900',
    color: '#F59E0B',
    marginBottom: 4,
  },
  refStreakVal: {
    fontSize: 19,
    fontWeight: '900',
    color: '#EF4444',
    marginBottom: 4,
  },
  refLevelVal: {
    fontSize: 19,
    fontWeight: '900',
    color: '#38BDF8',
    marginBottom: 4,
  },
  refStatLblRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  refStatLbl: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  refProgressSection: {
    gap: 6,
  },
  refProgressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refProgressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  refProgressValText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
  },
  refProgressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  refProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  refProgressSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },

  // Season Card Styles
  seasonCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  seasonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seasonTitle: {
    fontSize: 14.5,
    fontWeight: '900',
  },
  seasonSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  seasonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  seasonBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  seasonProgressTrack: {
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    overflow: 'hidden',
    marginTop: 2,
  },
  seasonProgressFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  seasonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seasonMetaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  seasonRewardsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  seasonRewardsBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#D97706',
  },

  // Streak Card Styles
  streakCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakCardTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  currentStreakBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  currentStreakBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#F59E0B',
  },
  streakMetricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricVal: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 2,
  },
  metricLbl: {
    fontSize: 10,
    fontWeight: '700',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#94A3B8',
  },
  subSectionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  weeklyBubblesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayBubbleItem: {
    alignItems: 'center',
    gap: 6,
  },
  dayBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBubbleText: {
    fontSize: 12,
    fontWeight: '800',
  },
  dayLabelText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Avatar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },

  // QR Modal Styles
  qrOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCard: {
    width: width - 40,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  qrTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  qrBody: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  qrIdText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  qrNameText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 14,
    width: '100%',
    marginTop: 20,
  },
  copyBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Avatar Picker Modal Styles
  avatarPickerCard: {
    width: width - 40,
    maxHeight: '80%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  pickerSubTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 16,
  },
  uploadCustomBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  uploadCustomGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  uploadCustomText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  presetsHeader: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  presetItem: {
    width: (width - 100) / 3,
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  presetItemActive: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  presetImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
  },
  presetName: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  updatingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },

  savedBookmarksActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  savedBookmarksIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedBookmarksTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  savedBookmarksBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  savedBookmarksBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  savedBookmarksSubtitle: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
  },
});
