import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { getFilteredGrievances } from '@/services/supabaseService';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface CollegeGrievanceSectionProps {
  userId?: string;
}

const STATUS_STEPS = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

export function CollegeGrievanceSection({ userId }: CollegeGrievanceSectionProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(300).springify()} style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="shield-alert" size={20} color="#EF4444" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Grievance & Support Desk</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/(tabs)/support', params: { mode: 'home' } } as any)}
          style={[styles.helpdeskLinkBtn, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)' }]}
        >
          <Text style={styles.helpdeskLinkText}>Helpdesk Hub →</Text>
        </TouchableOpacity>
      </View>

      {/* Main Serious Support / Safety Card Banner (Red Palette Theme - Point 15 & 16) */}
      <LinearGradient
        colors={isDark ? ['#2A0808', '#1F0606', '#110303'] : ['#FEF2F2', '#FEE2E2', '#FFF5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderColor: isDark ? 'rgba(239, 68, 68, 0.45)' : 'rgba(239, 68, 68, 0.35)',
            borderWidth: 1.5,
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.35 : 0.12,
            shadowRadius: 10,
            elevation: 4,
          },
        ]}
      >
        {/* Banner Hero Row */}
        <View style={styles.bannerHeaderRow}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)' }]}>
            <MaterialCommunityIcons name="shield-alert" size={28} color={isDark ? '#F87171' : '#DC2626'} />
          </View>
          <View style={styles.promoTextWrap}>
            <View style={styles.badgeRow}>
              <Text style={[styles.badgeText, { color: isDark ? '#FCA5A5' : '#B91C1C' }]}>OFFICIAL SAFETY & HELPDESK</Text>
              <View style={[styles.dotSeparator, { backgroundColor: isDark ? '#F87171' : '#DC2626' }]} />
              <MaterialCommunityIcons name="shield-check-outline" size={12} color={isDark ? '#34D399' : '#059669'} />
              <Text style={[styles.confidentialTag, { color: isDark ? '#34D399' : '#047857' }]}>100% Confidential</Text>
            </View>
            <Text style={[styles.promoTitle, { color: isDark ? '#FFFFFF' : '#7F1D1D' }]}>Student Support & Grievances</Text>
            <Text style={[styles.promoSub, { color: isDark ? '#FECACA' : '#991B1B' }]}>
              Submit & track resolution for academic, campus safety, fee, or department concerns.
            </Text>
          </View>
        </View>

        {/* Dual Primary Action Buttons with Professional Spacing & Responsive Alignment */}
        <View style={styles.actionRowGrid}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(tabs)/support', params: { mode: 'home' } } as any)}
            activeOpacity={0.85}
            style={{ flex: 1.15 }}
          >
            <LinearGradient
              colors={['#EF4444', '#DC2626', '#B91C1C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryActionBtnGradient}
            >
              <Feather name="plus-circle" size={15} color="#FFFFFF" />
              <Text style={styles.primaryActionText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                Report Concern
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryActionBtn,
              {
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FFFFFF',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.45)' : 'rgba(220, 38, 38, 0.35)',
              },
            ]}
            onPress={() => router.push({ pathname: '/(tabs)/support', params: { mode: 'my_reports' } } as any)}
            activeOpacity={0.85}
          >
            <Feather name="list" size={14} color={isDark ? '#FCA5A5' : '#B91C1C'} />
            <Text style={[styles.secondaryActionText, { color: isDark ? '#FFFFFF' : '#B91C1C' }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              My Grievances
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  helpdeskLinkBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  helpdeskLinkText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    gap: 14,
    ...SHADOWS.medium,
  },
  bannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoTextWrap: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  badgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    opacity: 0.6,
  },
  confidentialTag: {
    fontSize: 8.5,
    fontWeight: '700',
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  promoSub: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 16,
  },
  actionRowGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  primaryActionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: RADIUS.lg,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12.5,
    letterSpacing: 0.2,
  },
  secondaryActionBtn: {
    flex: 0.85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },
  secondaryActionText: {
    fontWeight: '800',
    fontSize: 11.5,
  },
  ticketsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(239, 68, 68, 0.2)',
    paddingTop: 10,
    gap: 10,
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketsHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  viewAllLink: {
    fontSize: 11,
    fontWeight: '800',
  },
  ticketItem: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 10,
    gap: 6,
  },
  ticketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  ticketTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepCol: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  stepLabel: {
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
});
