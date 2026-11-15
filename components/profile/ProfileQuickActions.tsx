import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';

interface ProfileQuickActionsProps {
  currentStep: number;
  totalSteps: number;
  activeApps: number;
  targetCareer: string;
  onOpenQrModal: () => void;
  onLogout: () => void;
}

export function ProfileQuickActions({
  currentStep = 1,
  totalSteps = 5,
  activeApps = 0,
  targetCareer = 'Software & Technology',
  onOpenQrModal,
  onLogout,
}: ProfileQuickActionsProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>STUDENT ACTIONS</Text>

      {/* Item 1: My Career Roadmap */}
      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
        onPress={() => {
          try { Haptics.selectionAsync(); } catch (_) {}
          router.push('/roadmap');
        }}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }]}>
          <MaterialCommunityIcons name="source-branch" size={19} color="#2563EB" />
        </View>
        <View style={styles.contentCol}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>My Career Roadmap</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {targetCareer} progression
          </Text>
        </View>
        <View style={styles.rightGroup}>
          <View style={[styles.pillBadge, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }]}>
            <Text style={styles.pillBadgeText}>Step {currentStep}/{totalSteps}</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#94A3B8" />
        </View>
      </TouchableOpacity>

      {/* Item 2: My Applications */}
      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
        onPress={() => {
          try { Haptics.selectionAsync(); } catch (_) {}
          router.push('/(tabs)/opportunities');
        }}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }]}>
          <Feather name="clipboard" size={18} color="#2563EB" />
        </View>
        <View style={styles.contentCol}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>My Applications</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            Track internships & opportunity status
          </Text>
        </View>
        <View style={styles.rightGroup}>
          <View style={[styles.pillBadge, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }]}>
            <Text style={styles.pillBadgeText}>{activeApps} Active</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#94A3B8" />
        </View>
      </TouchableOpacity>

      {/* Item 3: Saved Opportunities */}
      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
        onPress={() => {
          try { Haptics.selectionAsync(); } catch (_) {}
          router.push('/bookmarks');
        }}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }]}>
          <Feather name="bookmark" size={18} color="#2563EB" />
        </View>
        <View style={styles.contentCol}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Saved Opportunities</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            Bookmarked internships and events
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color="#94A3B8" />
      </TouchableOpacity>

      {/* Item 4: FEEDX Digital ID QR */}
      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
        onPress={onOpenQrModal}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }]}>
          <MaterialCommunityIcons name="qrcode-scan" size={19} color="#2563EB" />
        </View>
        <View style={styles.contentCol}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>FEEDX Digital ID QR</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            Verified institutional QR credential
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color="#94A3B8" />
      </TouchableOpacity>

      {/* Item 5: Sign Out */}
      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}
        onPress={onLogout}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
          <Feather name="log-out" size={18} color="#EF4444" />
        </View>
        <View style={styles.contentCol}>
          <Text style={[styles.title, { color: '#EF4444' }]}>Sign Out</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            Log out of your FEEDX session
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },
});
