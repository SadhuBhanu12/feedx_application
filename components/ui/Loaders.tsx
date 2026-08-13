import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, DimensionValue, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS, Colors } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

// ==========================================
// REUSABLE LOADING MESSAGES
// ==========================================
export const LoadingMessages = {
  DASHBOARD: 'Loading your dashboard...',
  COMMUNITY: 'Fetching community posts...',
  OPPORTUNITIES: 'Loading opportunities...',
  RESOURCES: 'Preparing resources...',
  UPDATES: 'Syncing latest updates...',
  CONNECTING: 'Connecting securely...',
  PROFILE: 'Loading your profile...',
  DEFAULT: 'Please wait...',
};

// ==========================================
// FULL SCREEN LOADER
// ==========================================
interface FullScreenProps {
  message?: string;
  isDark?: boolean;
}
export const FullScreenLoader = ({ message = LoadingMessages.DEFAULT, isDark: explicitDark }: FullScreenProps) => {
  const { colors, isDark: contextDark } = useTheme();
  const darkTheme = explicitDark !== undefined ? explicitDark : contextDark;
  
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value === 1 ? 0.8 : 1,
  }));

  const bgColor = darkTheme ? COLORS.backgroundDark : Colors.light.background;
  const textColor = darkTheme ? COLORS.textPrimary : Colors.light.text;
  const subTextColor = darkTheme ? COLORS.textMuted : Colors.light.icon;

  return (
    <View style={[styles.fullScreenContainer, { backgroundColor: bgColor }]}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} resizeMode="cover" />
      </Animated.View>
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      <Text style={[styles.subMessage, { color: subTextColor }]}>FeedX Enterprise</Text>
    </View>
  );
};

// ==========================================
// ==========================================
// GLOBAL OVERLAY LOADER (Absolute positioning)
// ==========================================
interface GlobalLoadingProps {
  visible: boolean;
  message?: string;
  isDark?: boolean;
}
export const GlobalLoading = ({ visible, message, isDark: explicitDark }: GlobalLoadingProps) => {
  const { colors, isDark: contextDark } = useTheme();
  if (!visible) return null;
  const darkTheme = explicitDark !== undefined ? explicitDark : contextDark;
  
  const boxBg = darkTheme ? COLORS.cardElevated : colors.card;
  const textColor = colors.textPrimary;

  return (
    <View style={styles.globalOverlay}>
      <View style={[styles.globalBox, { backgroundColor: boxBg }]}>
        <View style={styles.smallLogoContainer}>
          <Image source={require('../../assets/images/icon.png')} style={styles.smallLogo} resizeMode="cover" />
        </View>
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 8 }} />
        {message && <Text style={[styles.globalMessage, { color: textColor }]}>{message}</Text>}
      </View>
    </View>
  );
};

// ==========================================
// INLINE LOADER
// ==========================================
interface InlineLoaderProps {
  message?: string;
  color?: string;
  isDark?: boolean;
}
export const InlineLoader = ({ message = 'Loading...', color, isDark: explicitDark }: InlineLoaderProps) => {
  const { colors, isDark: contextDark } = useTheme();
  const darkTheme = explicitDark !== undefined ? explicitDark : contextDark;
  const finalColor = color || COLORS.primary;
  const textColor = colors.textSecondary;

  return (
    <View style={styles.inlineContainer}>
      <View style={styles.tinyLogoContainer}>
        <Image source={require('../../assets/images/icon.png')} style={styles.tinyLogo} resizeMode="cover" />
      </View>
      <ActivityIndicator size="small" color={finalColor} style={{ marginLeft: 8 }} />
      {message ? <Text style={[styles.inlineMessage, { color: textColor }]}>{message}</Text> : null}
    </View>
  );
};

// ==========================================
// SKELETON LOADER
// ==========================================
interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  isDark?: boolean;
  style?: ViewStyle | ViewStyle[];
}
export const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = RADIUS.sm, isDark: explicitDark, style }: SkeletonLoaderProps) => {
  const { colors, isDark: contextDark } = useTheme();
  const darkTheme = explicitDark !== undefined ? explicitDark : contextDark;
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const bgColor = darkTheme ? COLORS.cardElevated : colors.skeletonBg;

  return (
    <Animated.View style={[{ width, height, borderRadius, backgroundColor: bgColor }, animatedStyle, style]} />
  );
};

// ==========================================
// BUTTON LOADING
// ==========================================
interface ButtonLoadingProps {
  color?: string;
  size?: 'small' | 'large';
}
export const ButtonLoading = ({ color = COLORS.white, size = 'small' }: ButtonLoadingProps) => (
  <View style={styles.buttonLoadingContainer}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { 
    width: 100, 
    height: 100, 
    borderRadius: RADIUS.xl, 
    overflow: 'hidden', 
    marginBottom: SPACING.xl, 
    ...SHADOWS.large
  },
  logo: { width: '100%', height: '100%' },
  spinner: { marginBottom: SPACING.lg },
  message: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, marginBottom: SPACING.sm, letterSpacing: 0.5 },
  subMessage: { fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, textTransform: 'uppercase', letterSpacing: 1.5 },
  
  globalOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 9999, 
    elevation: 9999 
  },
  globalBox: { 
    padding: SPACING.lg, 
    borderRadius: RADIUS.lg, 
    alignItems: 'center', 
    ...SHADOWS.large,
    minWidth: 150,
  },
  globalMessage: { marginTop: SPACING.md, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold },
  smallLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  smallLogo: { width: '100%', height: '100%' },
  tinyLogoContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tinyLogo: { width: '100%', height: '100%' },
  
  inlineContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md },
  inlineMessage: { marginLeft: SPACING.sm, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium },
  
  buttonLoadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
