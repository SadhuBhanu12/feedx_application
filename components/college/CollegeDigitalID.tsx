import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

import { resolveStandardFeedXId } from '@/services/idService';

interface CollegeDigitalIDProps {
  user: any;
  profile: any;
}

export function CollegeDigitalID({ user, profile }: CollegeDigitalIDProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const studentName = profile?.full_name || user?.full_name || 'Student Name';
  const feedxId = profile?.feedx_id || user?.feedx_id || resolveStandardFeedXId(profile || user);
  const rawReg = profile?.pin_number || user?.pin_number || profile?.roll_number || user?.roll_number || profile?.roll_no || user?.roll_no || profile?.student_id || user?.student_id;
  const regNo = (rawReg && rawReg !== '21001-CSE-001' && rawReg !== 'PENDING') ? rawReg : feedxId;
  const collegeName = profile?.college_name || user?.college_name || user?.colleges?.college_name || 'FEEDX Polytechnic';
  const branch = profile?.branch || user?.branch || user?.branches?.branch_name || 'Computer Science & Engineering';
  const year = profile?.year || user?.year || '3rd Year';
  const verificationStatus = profile?.verification_status || user?.identity_status || 'Verified';

  const isVerified = String(verificationStatus).toLowerCase() === 'verified';

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(100).springify()} style={styles.container}>
      <TouchableOpacity
        style={styles.touchWrap}
        onPress={() => router.push('/tools/id-generator')}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={['#0284C7', '#0369A1', '#0F4C81']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cardInner, { borderColor: 'rgba(255, 255, 255, 0.45)', borderWidth: 1.5 }]}
        >
          <View style={styles.topRow}>
            <View style={styles.headerTitleGroup}>
              <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#FFF" />
              <View>
                <Text style={styles.cardBrandTitle}>FEEDX DIGITAL</Text>
                <Text style={styles.cardBrandSub}>STUDENT IDENTITY CARD</Text>
              </View>
            </View>

            <View style={[styles.verifiedBadge, { backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)' }]}>
              <Feather name={isVerified ? "check-circle" : "clock"} size={12} color={isVerified ? "#10B981" : "#F59E0B"} />
              <Text style={[styles.verifiedBadgeText, { color: isVerified ? "#10B981" : "#F59E0B" }]}>
                {isVerified ? 'VERIFIED' : 'PENDING'}
              </Text>
            </View>
          </View>

          <View style={styles.bodyRow}>
            <UserAvatar user={user} size={50} animated />

            <View style={styles.studentInfoWrap}>
              <Text style={styles.studentName} numberOfLines={1}>
                {studentName}
              </Text>
              <Text style={styles.rollNumberText} numberOfLines={1} ellipsizeMode="tail">
                FEEDX ID: <Text style={styles.rollVal}>{feedxId}</Text>
              </Text>
              <Text style={styles.metaSubText} numberOfLines={2}>
                COLLEGE ID: {regNo} • {branch}
              </Text>
              <Text style={styles.collegeNameText} numberOfLines={2}>
                {collegeName}
              </Text>
            </View>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.qrGroup}>
              <MaterialCommunityIcons name="qrcode-scan" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.tapNotice}>Scan-ready Digital ID</Text>
            </View>
            <View style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View Card</Text>
              <Feather name="chevron-right" size={14} color="#FFF" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  touchWrap: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  cardInner: {
    padding: 16,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  cardBrandTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
  },
  cardBrandSub: {
    fontSize: 8,
    fontWeight: '800',
    color: '#E0F2FE',
    letterSpacing: 0.8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexShrink: 0,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  studentInfoWrap: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  rollNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F0F9FF',
  },
  rollVal: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  metaSubText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#E0F2FE',
    marginTop: 2,
  },
  collegeNameText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 10,
  },
  qrGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  tapNotice: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F0F9FF',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
});
