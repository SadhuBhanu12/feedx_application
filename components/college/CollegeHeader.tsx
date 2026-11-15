import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface CollegeHeaderProps {
  collegeName?: string;
  location?: string;
  onNotificationPress?: () => void;
}

export function CollegeHeader({ collegeName, location, onNotificationPress }: CollegeHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user, dashboard, notifications: ctxNotifications, unreadNotificationsCount: rawUnreadCount } = useUser();
  const [showDetails, setShowDetails] = useState(false);

  const activeNotifs = ctxNotifications && ctxNotifications.length > 0 ? ctxNotifications : (dashboard?.notifications || []);
  const unreadCount = rawUnreadCount !== undefined ? rawUnreadCount : activeNotifs.filter((n: any) => !n.is_read).length;
  
  const studentCollege = user?.college_name || dashboard?.profile?.college_name || collegeName || 'Polytechnic Institution';
  const collegeLocation = location || dashboard?.profile?.college_location || user?.college_location || user?.city || 'Campus Location';
  const feedxCollegeId = user?.college_id ? `CLG-${String(user.college_id).slice(0, 8).toUpperCase()}` : 'FEEDX-CAMPUS';

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 14) }]}>
      {/* Top Banner Header */}
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)' }]}>
            <MaterialCommunityIcons name="school-outline" size={24} color={colors.primary} />
          </View>

          <View style={styles.textWrap}>
            <View style={styles.verifiedRow}>
              <Text style={[styles.campusLabel, { color: colors.textMuted }]}>STUDENT&apos;S COLLEGE</Text>
              <View style={styles.verifiedTag}>
                <Feather name="check-circle" size={10} color="#10B981" />
                <Text style={styles.verifiedTagText}>VERIFIED CAMPUS</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 2 }}>
              <Text 
                style={[styles.collegeName, { color: colors.textPrimary }]}
                numberOfLines={2}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {studentCollege}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <View style={{ backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: colors.primary }}>ID: {feedxCollegeId}</Text>
              </View>
              <Text style={[styles.locationText, { color: colors.textMuted, flexShrink: 1 }]} numberOfLines={1}>
                {collegeLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={onNotificationPress || (() => router.push('/(tabs)/updates'))}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
        >
          <Feather name="bell" size={17} color={colors.textSecondary} />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCountText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* College Details Modal */}
      <Modal visible={showDetails} transparent animationType="slide" onRequestClose={() => setShowDetails(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleGroup}>
                <MaterialCommunityIcons name="school" size={24} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalCampusTag, { color: colors.primary }]}>GOVERNMENT AUTONOMOUS INSTITUTION</Text>
                  <Text style={[styles.modalCollegeTitle, { color: colors.textPrimary }]}>{studentCollege}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <Feather name="x" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>CAMPUS LOCATION & AFFILIATION</Text>
                <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{collegeLocation}</Text>
                <Text style={[styles.detailSub, { color: colors.textSecondary }]}>
                  Approved by AICTE New Delhi & Affiliated to State Board of Technical Education & Training (SBTET).
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>ACADEMIC DEPARTMENTS</Text>
                <View style={styles.pillRow}>
                  {['Computer Science & Engg', 'Electronics & Comm', 'Biomedical Engg', 'Mechanical Engg', 'Civil Engg', 'AI & Data Science'].map((dept) => (
                    <View key={dept} style={[styles.deptPill, { backgroundColor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(37,99,235,0.08)' }]}>
                      <Text style={[styles.deptPillText, { color: colors.primary }]}>{dept}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>CAMPUS FACILITIES & INFRASTRUCTURE</Text>
                <View style={styles.facilityGrid}>
                  {[
                    { icon: 'book-open', name: 'Digital Central Library' },
                    { icon: 'cpu', name: 'Robotics & AI Labs' },
                    { icon: 'wifi', name: 'Campus High-Speed Wi-Fi' },
                    { icon: 'monitor', name: 'CAD/CAM Machining Lab' },
                    { icon: 'users', name: 'Auditorium & Sports Complex' },
                    { icon: 'shield-check', name: '24/7 Student Support Desk' },
                  ].map((fac) => (
                    <View key={fac.name} style={[styles.facilityItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
                      <Feather name={fac.icon as any} size={14} color={colors.primary} />
                      <Text style={[styles.facilityText, { color: colors.textPrimary }]}>{fac.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: colors.primary }]}
              onPress={() => setShowDetails(false)}
            >
              <Text style={styles.closeBtnText}>Close College Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    flexShrink: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  campusLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#10B981',
  },
  collegeName: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 1,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '82%',
    borderWidth: 1,
    gap: 12,
    ...SHADOWS.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  modalCampusTag: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  modalCollegeTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 1,
  },
  modalScroll: {
    maxHeight: 380,
  },
  detailSection: {
    gap: 6,
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  detailValue: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  detailSub: {
    fontSize: 11.5,
    lineHeight: 17,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  deptPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  deptPillText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  facilityGrid: {
    gap: 8,
    marginTop: 4,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: RADIUS.md,
  },
  facilityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  closeBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 13,
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
