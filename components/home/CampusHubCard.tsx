import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface CampusHubCardProps {
  dashboard: any;
}

export function CampusHubCard({ dashboard }: CampusHubCardProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const profile = dashboard?.profile || {};
  const collegeName = profile.college_name || 'FEEDX Polytechnic';
  const location = profile.college_location || 'Campus Space';

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(150).springify()} style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="school" size={22} color={colors.primary} />
          </View>

          <View style={styles.titleWrap}>
            <Text style={[styles.collegeName, { color: colors.textPrimary }]} numberOfLines={1}>
              {collegeName}
            </Text>
            <Text style={[styles.campusLabel, { color: colors.textMuted }]}>
              Official Campus Space • {location}
            </Text>
          </View>

          <View style={styles.verifiedTag}>
            <Feather name="check-circle" size={11} color="#10B981" />
            <Text style={styles.verifiedTagText}>Verified</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.08)' }]}
            onPress={() => router.push('/(tabs)/updates')}
            activeOpacity={0.8}
          >
            <Feather name="bell" size={16} color="#3B82F6" />
            <Text style={[styles.actionBtnText, { color: '#3B82F6' }]}>Notices</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(20, 184, 166, 0.12)' : 'rgba(20, 184, 166, 0.08)' }]}
            onPress={() => router.push('/(tabs)/support')}
            activeOpacity={0.8}
          >
            <Feather name="message-circle" size={16} color="#14B8A6" />
            <Text style={[styles.actionBtnText, { color: '#14B8A6' }]}>Grievance & Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 14,
    ...SHADOWS.small,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  collegeName: {
    fontSize: 15,
    fontWeight: '800',
  },
  campusLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
