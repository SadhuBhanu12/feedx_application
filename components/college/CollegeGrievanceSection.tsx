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

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const data = await getFilteredGrievances(userId, 0, 5);
      setTickets(data || []);
    } catch (e) {
      console.warn('[CollegeGrievanceSection] error loading tickets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [userId]);

  const getStatusStepIndex = (statusStr: string) => {
    const s = String(statusStr || '').toLowerCase();
    if (s.includes('resolved')) return 4;
    if (s.includes('progress')) return 3;
    if (s.includes('assigned')) return 2;
    if (s.includes('review')) return 1;
    return 0;
  };

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(300).springify()} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="shield-alert" size={20} color="#0D9488" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Grievance & Support Desk</Text>
        </View>
      </View>

      {/* Main Grievance Card Banner with Luxury Royal Indigo Palette */}
      <LinearGradient
        colors={isDark ? ['#1E1B4B', '#2E2A72', '#0F172A'] : ['#EEF2FF', '#E0E7FF', '#F1F5F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderColor: isDark ? '#818CF8' : '#6366F1',
            borderWidth: 1.5,
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.35 : 0.15,
            shadowRadius: 10,
            elevation: 4,
          },
        ]}
      >
        {/* Banner Hero Row */}
        <View style={styles.bannerHeaderRow}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.15)' }]}>
            <MaterialCommunityIcons name="shield-alert" size={28} color={isDark ? '#818CF8' : '#4F46E5'} />
          </View>
          <View style={styles.promoTextWrap}>
            <View style={styles.badgeRow}>
              <Text style={[styles.badgeText, { color: isDark ? '#818CF8' : '#4338CA' }]}>OFFICIAL STUDENT HELPDESK</Text>
              <View style={[styles.dotSeparator, { backgroundColor: isDark ? '#818CF8' : '#4338CA' }]} />
              <MaterialCommunityIcons name="shield-check-outline" size={12} color={isDark ? '#34D399' : '#059669'} />
              <Text style={[styles.confidentialTag, { color: isDark ? '#10B981' : '#047857' }]}>100% Confidential</Text>
            </View>
            <Text style={[styles.promoTitle, { color: isDark ? '#FFFFFF' : '#1E1B4B' }]}>Student Support & Grievances</Text>
            <Text style={[styles.promoSub, { color: isDark ? '#C7D2FE' : '#3730A3' }]}>
              Submit & track resolution for academic, fee, campus, or faculty concerns.
            </Text>
          </View>
        </View>

        {/* Dual Primary Action Buttons */}
        <View style={styles.actionRowGrid}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(tabs)/support', params: { mode: 'report' } } as any)}
            activeOpacity={0.88}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              style={styles.primaryActionBtnGradient}
            >
              <Feather name="plus-circle" size={16} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Report New Concern</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryActionBtn,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
                borderColor: isDark ? '#818CF8' : '#6366F1',
                borderWidth: 1.5,
              },
            ]}
            onPress={() => router.push({ pathname: '/(tabs)/support', params: { mode: 'my_reports' } } as any)}
            activeOpacity={0.85}
          >
            <Feather name="list" size={15} color={isDark ? '#FFFFFF' : '#4338CA'} />
            <Text style={[styles.secondaryActionText, { color: isDark ? '#FFFFFF' : '#4338CA' }]}>My Grievances</Text>
          </TouchableOpacity>
        </View>

        {/* Existing Submitted Tickets Status Tracker */}
        {loading ? (
          <ActivityIndicator size="small" color={isDark ? '#818CF8' : '#6366F1'} style={{ marginVertical: 12 }} />
        ) : tickets.length > 0 ? (
          <View style={styles.ticketsContainer}>
            <View style={styles.ticketHeaderRow}>
              <Text style={[styles.ticketsHeaderTitle, { color: isDark ? '#F8FAFC' : '#1E1B4B' }]}>
                My Grievance Tickets ({tickets.length})
              </Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/support', params: { mode: 'my_reports' } } as any)}>
                <Text style={[styles.viewAllLink, { color: isDark ? '#818CF8' : '#4F46E5' }]}>View All →</Text>
              </TouchableOpacity>
            </View>

            {tickets.map((ticket) => {
              const currentStep = getStatusStepIndex(ticket.status);

              return (
                <TouchableOpacity
                  key={ticket.id}
                  style={[
                    styles.ticketItem,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(99, 102, 241, 0.2)',
                    },
                  ]}
                  onPress={() => router.push({ pathname: '/(tabs)/support', params: { mode: 'my_reports' } } as any)}
                  activeOpacity={0.85}
                >
                  <View style={styles.ticketTop}>
                    <View style={styles.catBadge}>
                      <Text style={styles.catBadgeText}>{ticket.category || 'Grievance'}</Text>
                    </View>
                    <Text style={[styles.statusText, { color: ticket.status === 'Resolved' ? '#10B981' : '#F59E0B' }]}>
                      {ticket.status || 'Submitted'}
                    </Text>
                  </View>

                  <Text style={[styles.ticketTitle, { color: isDark ? '#F1F5F9' : '#1E1B4B' }]} numberOfLines={1}>
                    {ticket.title}
                  </Text>

                  {/* Status Steps Stepper Bar */}
                  <View style={styles.stepperRow}>
                    {STATUS_STEPS.map((step, idx) => {
                      const isReached = idx <= currentStep;
                      return (
                        <View key={step} style={styles.stepCol}>
                          <View
                            style={[
                              styles.stepDot,
                              { backgroundColor: isReached ? (isDark ? '#818CF8' : '#4F46E5') : isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1' },
                            ]}
                          />
                          <Text style={[styles.stepLabel, { color: isReached ? (isDark ? '#818CF8' : '#4F46E5') : '#64748B' }]}>
                            {step}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
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
  allIssuesBtn: {
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  allIssuesBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#14B8A6',
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
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
  },
  badgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0D9488',
    letterSpacing: 0.6,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#0D9488',
    opacity: 0.6,
  },
  confidentialTag: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#10B981',
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
    gap: 10,
    marginTop: 2,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: RADIUS.lg,
    backgroundColor: '#0D9488',
    ...SHADOWS.small,
  },
  primaryActionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.lg,
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  secondaryActionText: {
    fontWeight: '800',
    fontSize: 12.5,
  },
  ticketsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
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
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#14B8A6',
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
