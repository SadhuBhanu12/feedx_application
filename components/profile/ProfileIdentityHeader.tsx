import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { resolveStandardFeedXId } from '@/services/idService';

interface ProfileIdentityHeaderProps {
  user: any;
  dashboard?: any;
  studentRoadmap?: any;
  onAvatarPress: () => void;
}

export function ProfileIdentityHeader({
  user,
  dashboard,
  studentRoadmap,
  onAvatarPress,
}: ProfileIdentityHeaderProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const userName = user?.full_name || user?.name || dashboard?.profile?.full_name || 'Student User';
  const branch = user?.branch || dashboard?.profile?.branch || 'Polytechnic Branch';
  const year = user?.year ? (String(user.year).includes('Year') ? user.year : `${user.year} Year`) : (dashboard?.profile?.year || '1st Year');
  const collegeName = user?.college_name || dashboard?.profile?.college_name || 'Polytechnic Institution';
  const targetCareer = studentRoadmap?.title || user?.domain || 'Software & Technology';
  const readinessPct = studentRoadmap?.readinessScore || 68;
  const bio = user?.bio || user?.headline || `Aspiring ${targetCareer} specialist focused on technical innovation and practical skill development.`;

  const feedxId = user?.feedx_id || resolveStandardFeedXId(user);

  const handleCopyId = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
    Clipboard.setString(feedxId);
    Alert.alert('Copied to Clipboard', `FEEDX ID: ${feedxId}`);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}>
      {/* Top Identity Block */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAvatarPress}
          style={styles.avatarWrapper}
        >
          <UserAvatar user={user} size={64} showBadge animated />
          <View style={styles.cameraPill}>
            <Feather name="camera" size={11} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={[styles.fullName, { color: colors.textPrimary }]}>
              {userName}
            </Text>
            <MaterialCommunityIcons name="check-decagram" size={16} color="#2563EB" style={{ marginLeft: 4 }} />
          </View>

          {/* FEEDX ID Badge */}
          <TouchableOpacity style={styles.idBadge} onPress={handleCopyId} activeOpacity={0.7}>
            <Text style={styles.idBadgeText}>{feedxId}</Text>
            <Feather name="copy" size={10} color="#64748B" />
          </TouchableOpacity>

          {/* College • Branch • Year */}
          <Text style={[styles.institutionalText, { color: colors.textMuted }]}>
            {branch} • {year}
          </Text>
          <Text style={[styles.collegeText, { color: colors.textMuted }]}>
            {collegeName}
          </Text>
        </View>
      </View>

      {/* Short Bio / Career Focus */}
      {bio ? (
        <View style={[styles.bioContainer, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
          <Text style={[styles.bioText, { color: colors.textSecondary }]}>
            {bio}
          </Text>
        </View>
      ) : null}

      {/* Target Career & Readiness Row */}
      <View style={[styles.targetCareerRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.careerTrackLabel}>TARGET CAREER TRACK</Text>
          <Text style={[styles.careerTrackName, { color: colors.textPrimary }]}>
            {targetCareer}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.readinessPill, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF', borderColor: 'rgba(37, 99, 235, 0.25)' }]}
          onPress={() => router.push('/roadmap')}
          activeOpacity={0.8}
        >
          <Feather name="trending-up" size={12} color="#2563EB" />
          <Text style={styles.readinessPillText}>{readinessPct}% Readiness</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Action CTA */}
      <TouchableOpacity
        style={[styles.editProfileBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9', borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
        onPress={() => {
          try { Haptics.selectionAsync(); } catch (_) {}
          router.push('/profile-edit');
        }}
        activeOpacity={0.8}
      >
        <Feather name="edit-2" size={14} color={colors.textPrimary} style={{ marginRight: 6 }} />
        <Text style={[styles.editProfileBtnText, { color: colors.textPrimary }]}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  cameraPill: {
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
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(100, 116, 139, 0.08)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginVertical: 2,
  },
  idBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  institutionalText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  collegeText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  bioContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  bioText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  targetCareerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  careerTrackLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#94A3B8',
  },
  careerTrackName: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 1,
  },
  readinessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  readinessPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
  },
  editProfileBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
