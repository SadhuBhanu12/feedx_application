import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface CommunityStatsFooterProps {
  studentCount?: number;
}

export function CommunityStatsFooter({ studentCount }: CommunityStatsFooterProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [dbStudentCount, setDbStudentCount] = useState<number>(studentCount || 0);
  const [dbCollegeCount, setDbCollegeCount] = useState<number>(0);
  const [dbPostCount, setDbPostCount] = useState<number>(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [studentsRes, collegesRes, postsRes] = await Promise.all([
          supabase.from('students').select('id', { count: 'exact', head: true }),
          supabase.from('colleges').select('id', { count: 'exact', head: true }),
          supabase.from('community_posts').select('id', { count: 'exact', head: true }),
        ]);

        if (studentsRes.count !== null && studentsRes.count !== undefined) {
          setDbStudentCount(studentsRes.count);
        }
        if (collegesRes.count !== null && collegesRes.count !== undefined) {
          setDbCollegeCount(collegesRes.count);
        }
        if (postsRes.count !== null && postsRes.count !== undefined) {
          setDbPostCount(postsRes.count);
        }
      } catch (e) {
        console.warn('Error fetching community stats:', e);
      }
    }

    fetchStats();
  }, []);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.warn('Cannot open link:', url);
    });
  };

  const formattedStudents = dbStudentCount > 0 ? dbStudentCount.toLocaleString() : '1,000+';
  const formattedColleges = dbCollegeCount > 0 ? dbCollegeCount.toLocaleString() : '20+';
  const formattedPosts = dbPostCount > 0 ? dbPostCount.toLocaleString() : '500+';

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(600).springify()} style={styles.container}>
      {/* 1. Community Analytics Box */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconCircle}>
            <MaterialCommunityIcons name="account-group" size={20} color={colors.primary} />
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={[styles.statsTitle, { color: colors.textPrimary }]}>FEEDX Community Analytics</Text>
            <Text style={[styles.statsSub, { color: colors.textMuted }]}>
              Empowering diploma & degree polytechnic students nationwide
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricNumber, { color: colors.primary }]}>{formattedStudents}</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Active Students</Text>
          </View>

          <View style={styles.dividerV} />

          <View style={styles.metricItem}>
            <Text style={[styles.metricNumber, { color: '#10B981' }]}>{formattedColleges}</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Partner Campuses</Text>
          </View>

          <View style={styles.dividerV} />

          <View style={styles.metricItem}>
            <Text style={[styles.metricNumber, { color: '#8B5CF6' }]}>{formattedPosts}</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Posts & Debates</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.joinCommunityBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/community')}
          activeOpacity={0.88}
        >
          <Feather name="users" size={15} color="#FFF" />
          <Text style={styles.joinBtnText}>Join Student Community Stream</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Official Social Handles */}
      <View style={styles.handlesSection}>
        <Text style={[styles.handlesTitle, { color: colors.textMuted }]}>OFFICIAL FEEDX CHANNELS & HANDLES</Text>

        <View style={styles.handlesGrid}>
          {/* Telegram */}
          <TouchableOpacity
            style={[styles.handlePill, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => openLink('https://t.me/feedx_official')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name={"send" as any} size={16} color="#229ED9" />
            <Text style={[styles.handleLabel, { color: colors.textPrimary }]}>Telegram Channel</Text>
          </TouchableOpacity>

          {/* WhatsApp */}
          <TouchableOpacity
            style={[styles.handlePill, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => openLink('https://whatsapp.com/channel/feedx')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="whatsapp" size={16} color="#25D366" />
            <Text style={[styles.handleLabel, { color: colors.textPrimary }]}>WhatsApp Community</Text>
          </TouchableOpacity>

          {/* LinkedIn */}
          <TouchableOpacity
            style={[styles.handlePill, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => openLink('https://linkedin.com/company/feedx')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="linkedin" size={16} color="#0A66C2" />
            <Text style={[styles.handleLabel, { color: colors.textPrimary }]}>LinkedIn Network</Text>
          </TouchableOpacity>

          {/* Instagram */}
          <TouchableOpacity
            style={[styles.handlePill, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => openLink('https://instagram.com/feedx_official')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="instagram" size={16} color="#E4405F" />
            <Text style={[styles.handleLabel, { color: colors.textPrimary }]}>Instagram</Text>
          </TouchableOpacity>
        </View>

        {/* Brand Copyright */}
        <View style={styles.copyrightRow}>
          <Text style={[styles.copyrightText, { color: colors.textMuted }]}>
            © 2026 FEEDX Student Platform • All Rights Reserved
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  statsCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 12,
    ...SHADOWS.small,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  statsSub: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: RADIUS.lg,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  dividerV: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  joinCommunityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  joinBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
  },
  handlesSection: {
    marginTop: 16,
    gap: 10,
  },
  handlesTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  handlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  handlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  handleLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  copyrightRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  copyrightText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
