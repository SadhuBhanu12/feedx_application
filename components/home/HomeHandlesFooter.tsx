import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';

export function HomeHandlesFooter() {
  const { colors, isDark } = useTheme();

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.warn('Could not open handle link:', err));
  };

  const socialHandles = [
    { id: 'whatsapp', icon: 'logo-whatsapp', url: 'https://whatsapp.com/channel/0029Vaqm8e4IN9iqTfXumX1r', color: '#25D366' },
    { id: 'instagram', icon: 'logo-instagram', url: 'https://instagram.com/feedx_official', color: '#E1306C' },
    { id: 'linkedin', icon: 'logo-linkedin', url: 'https://linkedin.com/company/feedx-tg-polytechnic-community', color: '#0A66C2' },
    { id: 'youtube', icon: 'logo-youtube', url: 'https://youtube.com/@feedx_official', color: '#EF4444' },
    { id: 'website', icon: 'globe-outline', url: 'https://feedxpolytechnic.com', color: colors.primary },
  ];

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(400).springify()} style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.title, { color: colors.textMuted }]}>OFFICIAL FEEDX HANDLES & PLATFORMS</Text>

        <View style={styles.handlesRow}>
          {socialHandles.map((handle) => (
            <TouchableOpacity
              key={handle.id}
              style={[
                styles.handleBtn,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', borderColor: colors.cardBorder },
              ]}
              onPress={() => openLink(handle.url)}
              activeOpacity={0.75}
            >
              <Ionicons name={handle.icon as any} size={20} color={handle.color} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.footerSub, { color: colors.textMuted }]}>
          © 2026 FEEDX Student Platform • All Rights Reserved
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    gap: 12,
    ...SHADOWS.small,
  },
  title: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  handlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 4,
  },
  handleBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSub: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
