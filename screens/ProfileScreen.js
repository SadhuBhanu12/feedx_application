import { useUser } from '@/context/UserContext';
import { useGamification } from '@/context/GamificationContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions, 
  Modal, 
  Image, 
  Share, 
  Clipboard, 
  Linking,
  Platform,
  ActivityIndicator
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';
import { UserAvatar, getGenderAvatarUri } from '@/components/ui/UserAvatar';
import QRCode from 'react-native-qrcode-svg';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

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
  { id: '12', name: 'Future Leader', url: 'https://api.dicebear.com/7.x/adventurer/png?seed=FutureLeader&backgroundColor=a855f7' }
];

function ProfileStat({ label, value, icon, color }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.statValue, { color: colors.textPrimary }]} numberOfLines={2}>{value}</Text>
      </View>
    </View>
  );
}

function LeetCodeStreakCard({ user }) {
  const { colors, isDark } = useTheme();
  const { streak: realGamificationStreak } = useGamification();
  const [viewMode, setViewMode] = React.useState('week'); // 'week' | 'month'

  const initialStreak = realGamificationStreak?.current_streak ?? user?.streak_count ?? user?.streak ?? 0;
  const initialMax = realGamificationStreak?.longest_streak ?? user?.max_streak ?? user?.longest_streak ?? initialStreak;
  const initialTotal = realGamificationStreak?.total_active_days ?? user?.total_active_days ?? initialStreak;

  const [dbStreak, setDbStreak] = React.useState({
    streakCount: initialStreak,
    maxStreak: initialMax,
    totalActiveDays: initialTotal,
  });

  React.useEffect(() => {
    if (realGamificationStreak) {
      setDbStreak({
        streakCount: realGamificationStreak.current_streak || 0,
        maxStreak: realGamificationStreak.longest_streak || realGamificationStreak.current_streak || 0,
        totalActiveDays: realGamificationStreak.total_active_days || realGamificationStreak.current_streak || 0,
      });
    }
  }, [realGamificationStreak]);

  React.useEffect(() => {
    if (!user?.id) return;

    // 1. Initial Real-time Database Fetch
    const fetchStreakFromDb = async () => {
      try {
        const { data, error } = await supabase
          .from('daily_streaks')
          .select('current_streak, longest_streak, total_active_days')
          .eq('student_id', user.id)
          .maybeSingle();

        if (data && !error) {
          setDbStreak({
            streakCount: data.current_streak || 0,
            maxStreak: data.longest_streak || data.current_streak || 0,
            totalActiveDays: data.total_active_days || data.current_streak || 0,
          });
        }
      } catch (e) {
        console.warn('Realtime streak fetch exception:', e);
      }
    };

    fetchStreakFromDb();

    // 2. Real-time Postgres Subscription
    const channel = supabase
      .channel(`streak_realtime_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_streaks', filter: `student_id=eq.${user.id}` },
        (payload) => {
          if (payload.new) {
            setDbStreak({
              streakCount: payload.new.current_streak || 0,
              maxStreak: payload.new.longest_streak || payload.new.current_streak || 0,
              totalActiveDays: payload.new.total_active_days || payload.new.current_streak || 0,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const streakCount = dbStreak.streakCount;
  const maxStreak = dbStreak.maxStreak;
  const totalActiveDays = dbStreak.totalActiveDays;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = (new Date().getDay() + 6) % 7;

  const activityGrid = Array.from({ length: 35 }, (_, idx) => {
    if (idx > 28) return 0;
    if (idx >= 24) return 3;
    if (idx % 3 === 0) return 2;
    if (idx % 2 === 0) return 1;
    return 0;
  });

  const getHeatmapColor = (level) => {
    if (level === 3) return '#10B981';
    if (level === 2) return '#059669';
    if (level === 1) return 'rgba(16, 185, 129, 0.4)';
    return isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  };

  return (
    <Animated.View entering={FadeInDown.delay(220).springify()} style={[styles.streakCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      {/* Header */}
      <View style={styles.streakHeaderRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="fire" size={24} color="#F59E0B" />
          <Text style={[styles.streakCardTitle, { color: colors.textPrimary }]}>Daily Streak & Activity</Text>
        </View>
        <View style={styles.currentStreakBadge}>
          <Text style={styles.currentStreakBadgeText}>{streakCount} Day Streak 🔥</Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.streakMetricsGrid}>
        <View style={[styles.metricBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.12)' }]}>
          <Text style={[styles.metricVal, { color: '#F59E0B' }]}>{streakCount}</Text>
          <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Current 🔥</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.12)' }]}>
          <Text style={[styles.metricVal, { color: '#3B82F6' }]}>{maxStreak}</Text>
          <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Max Streak ⚡</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.12)' }]}>
          <Text style={[styles.metricVal, { color: '#10B981' }]}>{totalActiveDays}</Text>
          <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Total Active 🎯</Text>
        </View>
      </View>

      {/* View Toggle Bar (Week vs Month) */}
      <View style={[styles.viewToggleContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'week' && { backgroundColor: '#3B82F6' }]}
          onPress={() => setViewMode('week')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleBtnText, viewMode === 'week' && { color: '#FFF' }]}>🗓️ Weekly View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'month' && { backgroundColor: '#3B82F6' }]}
          onPress={() => setViewMode('month')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleBtnText, viewMode === 'month' && { color: '#FFF' }]}>📅 Monthly Heatmap</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly View (Default) */}
      {viewMode === 'week' && (
        <View style={{ marginTop: 10 }}>
          <Text style={[styles.subSectionTitle, { color: colors.textMuted }]}>THIS WEEK'S BREAKDOWN</Text>
          <View style={styles.weeklyBubblesRow}>
            {daysOfWeek.map((day, idx) => {
              const isActive = idx <= currentDayIndex;
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
                      <MaterialCommunityIcons name="fire" size={14} color="#FFF" />
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
      )}

      {/* Monthly Heatmap View (Optional Toggle) */}
      {viewMode === 'month' && (
        <View style={{ marginTop: 10 }}>
          <View style={styles.heatmapHeaderRow}>
            <Text style={[styles.subSectionTitle, { color: colors.textMuted }]}>30-DAY ACTIVITY HEATMAP</Text>
            <View style={styles.legendRow}>
              <Text style={{ fontSize: 10, color: colors.textMuted }}>Less</Text>
              {[0, 1, 2, 3].map(lvl => (
                <View key={lvl} style={[styles.legendBox, { backgroundColor: getHeatmapColor(lvl) }]} />
              ))}
              <Text style={{ fontSize: 10, color: colors.textMuted }}>More</Text>
            </View>
          </View>

          <View style={styles.heatmapGridContainer}>
            {activityGrid.map((level, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.heatmapSquare, 
                  { backgroundColor: getHeatmapColor(level) }
                ]} 
              />
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );
}

function ActionItem({ title, icon, color, onPress, isDestructive }) {
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity style={[styles.actionItem, { borderBottomColor: colors.cardBorder }]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.actionIcon, { backgroundColor: isDestructive ? COLORS.danger + '15' : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)') }]}>
        <Feather name={icon} size={18} color={isDestructive ? COLORS.danger : colors.textSecondary} />
      </View>
      <Text style={[styles.actionTitle, { color: colors.textPrimary }, isDestructive && { color: COLORS.danger }]}>{title}</Text>
      <Feather name="chevron-right" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, setUser, signOut } = useUser();
  const router = useRouter();

  // Modals state
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

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
  const userName = user?.full_name || 'User';
  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'inst_admin';

  const getCompletionPercentage = () => {
    const fields = [
      user?.full_name,
      user?.phone,
      user?.date_of_birth,
      user?.gender,
      user?.current_status,
      user?.branch,
      user?.year,
      user?.domain,
      user?.social_links?.linkedin,
      user?.social_links?.github,
      user?.bio,
      user?.college_name
    ];
    const filled = fields.filter(f => f && String(f).trim() !== '' && String(f) !== 'User' && String(f) !== 'Student').length;
    return Math.round((filled / fields.length) * 100);
  };

  const getFeedxId = () => {
    const prefix = 'FEEDX';
    const college = user?.college_name || 'STUDENT';
    let collegeCode = college.split(' ').map(w => w[0]).join('').replace(/[^A-Za-z]/g, '').toUpperCase();
    if (collegeCode.length < 2) collegeCode = college.slice(0, 4).toUpperCase();
    const branch = user?.branch || 'GEN';
    let branchCode = branch.split(' ').map(w => w[0]).join('').replace(/[^A-Za-z]/g, '').toUpperCase();
    if (branchCode.length < 2) branchCode = branch.slice(0, 3).toUpperCase();
    const roll = (user?.roll_no || user?.roll_number || '00000').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `${prefix}-${collegeCode}-${branchCode}-${roll}`;
  };

  const handleShareProfile = async () => {
    try {
      const feedxId = getFeedxId();
      const message = `👤 Name: ${userName}\n🎓 FEEDX ID: ${feedxId}\n🔗 Profile: https://feedx.poly/profile/${user?.id || 'student'}\n\n📱 Download FEEDX Identity App for Polytechnic Students!`;
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
    Alert.alert('Copied!', 'FEEDX ID has been copied to your clipboard.');
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of FeedX?', [
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

  const skillsList = ['React Native', 'Python', 'Web Dev', 'CAD Design', 'Data Structures'];
  const completionPct = getCompletionPercentage();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFillObject} />}

      {/* Top Header Row with Share Button */}
      <View style={[styles.topHeader, { borderBottomColor: colors.cardBorder }]}>
        <Text style={[styles.topHeaderTitle, { color: colors.textPrimary }]}>Identity Profile</Text>
        <TouchableOpacity style={styles.topShareBtn} onPress={handleShareProfile}>
          <Feather name="share-2" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Animated Avatar Header */}
        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
          <View style={styles.profileBox}>
            <TouchableOpacity 
              activeOpacity={0.85} 
              onPress={() => setAvatarPickerVisible(true)}
              onLongPress={() => setAvatarModalVisible(true)}
              delayLongPress={400}
              style={styles.avatarGlowContainer}
            >
              <LinearGradient colors={['#4F46E5', '#EC4899', '#06B6D4']} style={styles.avatarGlowBackground} />
              <UserAvatar user={user} size={96} showBadge animated />
              <View style={styles.cameraEditBadge}>
                <Feather name="camera" size={14} color="#FFF" />
              </View>
            </TouchableOpacity>

            <Text style={[styles.userName, { color: colors.textPrimary }]}>{userName} {isAdmin ? '🛡️' : '✨'}</Text>
            
            {/* Clickable Roll / FEEDX ID with QR */}
            {/* Clickable Roll / FEEDX ID with QR */}
            {!isAdmin && (
              <TouchableOpacity onPress={() => setQrModalVisible(true)} activeOpacity={0.7} style={[styles.idTapContainer, { marginTop: 8 }]}>
                <Text style={[styles.userRoll, { color: colors.textSecondary }]}>{getFeedxId()}</Text>
                <Ionicons name="qr-code" size={14} color={COLORS.primary} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}

            <View style={styles.roleBadgeRow}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {isAdmin ? 'VERIFIED INSTITUTIONAL ADMIN' : '⚡ VERIFIED POLYTECHNIC STUDENT'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Profile Completion Meter */}
        {!isAdmin && (
          <Animated.View entering={FadeInDown.delay(150).springify()} style={[styles.completionCard, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }]}>
            <View style={styles.completionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="check-circle" size={16} color="#10B981" />
                <Text style={[styles.completionTitle, { color: colors.textPrimary }]}>Profile Completion</Text>
              </View>
              <Text style={styles.completionPercentage}>{completionPct}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${completionPct}%` }]} />
            </View>
            <Text style={[styles.completionSub, { color: colors.textMuted }]}>All mandatory academic details verified</Text>
          </Animated.View>
        )}

        {/* Academic Status Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.academicCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.textMuted }]}>{isAdmin ? 'Security & Access' : 'Academic Status'}</Text>

          {isAdmin ? (
            <View style={styles.gridContainer}>
              <View style={styles.gridRow}>
                <ProfileStat label="System Role" value="Inst. Admin" icon="shield-check-outline" color="#3B82F6" />
                <ProfileStat label="Campus" value={user?.college_name || 'Central Board'} icon="office-building-outline" color="#8B5CF6" />
              </View>
              <View style={styles.gridRow}>
                <ProfileStat label="Security Level" value="Lvl 4 (Full)" icon="lock-open-outline" color="#F59E0B" />
                <ProfileStat label="Uptime Status" value="Online" icon="radar" color="#10B981" />
              </View>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              <View style={styles.gridRow}>
                <ProfileStat label="Institution" value={user?.college_name || 'Govt Poly'} icon="school-outline" color="#3B82F6" />
                <ProfileStat label="Department" value={user?.branch || 'CSE'} icon="office-building-outline" color="#8B5CF6" />
              </View>
              <View style={styles.gridRow}>
                <ProfileStat label="Year / Sem" value={`${user?.year || '1'} Yr / Sem ${user?.semester || '1'}`} icon="calendar-clock" color="#F59E0B" />
                <ProfileStat label="CGPA Score" value={user?.cgpa || '8.5'} icon="trophy-outline" color="#10B981" />
              </View>
            </View>
          )}
        </Animated.View>

        {/* Daily Streak & LeetCode Heatmap Section */}
        {!isAdmin && <LeetCodeStreakCard user={user} />}

        {/* Skills & Badges Section */}
        {!isAdmin && (
          <Animated.View entering={FadeInDown.delay(300).springify()} style={[styles.skillsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: colors.textMuted }]}>Skills & Competencies</Text>
            <View style={styles.skillsChipsRow}>
              {skillsList.map(skill => (
                <View key={skill} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Appearance Theme Switcher */}
        <Animated.View entering={FadeInDown.delay(350).springify()} style={styles.actionsSection}>
          <ThemeToggle />
        </Animated.View>

        {/* Account & Privacy Section */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actionsSection}>
          <Text style={[styles.cardTitle, { color: colors.textMuted }]}>Account & Privacy</Text>
          <View style={[styles.actionsList, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <ActionItem title="Edit Personal Info" icon="user" onPress={() => router.push('/profile-edit')} />
            <ActionItem title="Institutional Settings" icon="settings" onPress={() => router.push('/institutional-settings')} />
            <ActionItem title="Security & Password" icon="shield" onPress={() => router.push('/change-password')} />
            <ActionItem title="Report a Bug" icon="alert-triangle" onPress={() => router.push('/report-bug')} />
            <ActionItem title="Mail Us" icon="mail" onPress={() => Linking.openURL('mailto:support@feedx.com?subject=FEEDX Help')} />
            <ActionItem title="Terms & Conditions" icon="file-text" onPress={() => router.push('/terms-conditions')} />
            <ActionItem title="Privacy Policy" icon="lock" onPress={() => Alert.alert('Privacy Policy', 'Your student details are encrypted and stored securely within Supabase.')} />
            <ActionItem title="About FEEDX" icon="info" onPress={() => router.push('/about-feedx')} />
            <ActionItem title="Sign Out" icon="log-out" isDestructive onPress={handleLogout} />
          </View>
        </Animated.View>

        {/* Modal: Full-screen Avatar View */}
        <Modal visible={avatarModalVisible} transparent animationType="fade" onRequestClose={() => setAvatarModalVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setAvatarModalVisible(false)}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setAvatarModalVisible(false)}>
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>
            <Image 
              source={{ uri: getGenderAvatarUri(user) }} 
              style={styles.fullAvatar}
            />
          </TouchableOpacity>
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
                  value={getFeedxId()}
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
          <Text style={styles.footerText}>FEEDX ANIMATED STUDENT IDENTITY • v5.0.4</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingTop: 50, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 24 },
  profileBox: { alignItems: 'center' },
  avatarGlowContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatarGlowBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 55,
    opacity: 0.15,
  },
  userName: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  userRoll: { fontSize: 13, color: COLORS.textMuted, fontWeight: '700', letterSpacing: 1 },
  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 70, 229, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
  },
  roleText: { fontSize: 10, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },

  completionCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 20,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionTitle: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  completionPercentage: { fontSize: 13, fontWeight: '900', color: '#10B981' },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  completionSub: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  academicCard: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    ...SHADOWS.medium,
    marginBottom: 20,
  },
  skillsCard: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  skillsChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },

  cardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },

  gridContainer: { gap: 12 },
  gridRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    minHeight: 90,
    justifyContent: 'space-between',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statInfo: { gap: 2 },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: { fontSize: 13, fontWeight: '800', color: '#FFF', lineHeight: 16 },

  actionsSection: { marginHorizontal: 20 },
  actionsList: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.textSecondary },
  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: '800', letterSpacing: 2 },
  
  // Custom Top Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 46,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  topHeaderTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  topShareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Clickable ID block
  idTapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
  fullAvatar: {
    width: width - 60,
    height: width - 60,
    borderRadius: (width - 60) / 2,
    backgroundColor: '#1E293B',
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
  cameraEditBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
    zIndex: 10,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  changeAvatarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  changeAvatarPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
  },
  avatarPickerCard: {
    width: width - 32,
    maxHeight: '85%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  pickerSubTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  uploadCustomBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  uploadCustomGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadCustomText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  presetsHeader: {
    fontSize: 13,
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 20,
  },
  presetItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 12,
  },
  presetItemActive: {
    borderColor: '#3B82F6',
  },
  presetImg: {
    width: '80%',
    height: '80%',
    borderRadius: 999,
  },
  presetName: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
  },
  updatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
  },
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  streakCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  currentStreakBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  currentStreakBadgeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
  },
  streakMetricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  metricBox: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  metricLbl: {
    fontSize: 10,
    fontWeight: '700',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    marginBottom: 14,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  subSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  weeklyBubblesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  heatmapHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  heatmapGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
  },
  heatmapSquare: {
    width: (width - 80) / 7 - 6,
    height: (width - 80) / 7 - 6,
    borderRadius: 4,
  },
});
