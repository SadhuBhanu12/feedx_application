import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

export function IssueFeedbackCard() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(200).springify()} style={styles.container}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: 'rgba(20, 184, 166, 0.25)' }]}
        onPress={() => router.push('/(tabs)/support')}
        activeOpacity={0.85}
      >
        <View style={styles.innerRow}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="shield-alert" size={24} color="#14B8A6" />
          </View>

          <View style={styles.textWrap}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>SECURE STUDENT FEEDBACK</Text>
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Report an Issue / Share Feedback
            </Text>
            <Text style={[styles.subText, { color: colors.textMuted }]}>
              Academics • Faculty • Campus Concerns • Infrastructure
            </Text>
          </View>

          <View style={styles.openBtn}>
            <Text style={styles.openBtnText}>Open</Text>
            <Feather name="arrow-right" size={14} color="#14B8A6" />
          </View>
        </View>
      </TouchableOpacity>
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
    ...SHADOWS.small,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  badgeRow: {
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#14B8A6',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  subText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
  },
  openBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#14B8A6',
  },
});
