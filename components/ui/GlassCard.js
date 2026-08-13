import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const GlassCard = ({ children, style }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }, style]}>
      {Platform.OS === 'web' ? (
        <View style={[styles.absolute, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(241, 245, 249, 0.85)' }]} />
      ) : (
        <BlurView
          style={styles.absolute}
          tint={isDark ? 'dark' : 'light'}
          intensity={20}
        />
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
    borderWidth: 1,
    ...SHADOWS.medium,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default GlassCard;
