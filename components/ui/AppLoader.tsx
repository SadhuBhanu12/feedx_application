import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export interface AppLoaderProps {
  message?: string;
  subMessage?: string;
  theme?: 'light' | 'dark';
  showTagline?: boolean;
  isReady?: boolean;
  onFinish?: () => void;
  showRetry?: boolean;
  onRetry?: () => void;
  isOffline?: boolean;
}

export default function AppLoader({
  message = 'Preparing your experience...',
  subMessage,
  theme = 'dark',
  showTagline = true,
  isReady = false,
  onFinish,
  showRetry = false,
  onRetry,
  isOffline = false,
}: AppLoaderProps) {
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';

  // Animation shared values
  const logoScale = useSharedValue(0.94);
  const logoOpacity = useSharedValue(0);
  const auraScale = useSharedValue(0.9);
  const progressSweep = useSharedValue(-150);
  const exitOpacity = useSharedValue(1);

  // Entrance & looping animations
  useEffect(() => {
    // 1. Entrance fade-in
    logoOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    // 2. Entrance gentle scale-up
    logoScale.value = withTiming(
      1,
      {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      },
      () => {
        // Continuous subtle resting breath
        logoScale.value = withRepeat(
          withSequence(
            withTiming(1.015, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
            withTiming(0.995, { duration: 1600, easing: Easing.inOut(Easing.quad) })
          ),
          -1,
          true
        );
      }
    );

    // 3. Subtle ambient aura breathing
    auraScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.96, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // 4. Smooth slim progress shimmer loop
    progressSweep.value = withRepeat(
      withTiming(160, { duration: 1300, easing: Easing.bezier(0.4, 0.0, 0.2, 1) }),
      -1,
      false
    );
  }, []);

  // Smooth exit transition when ready
  useEffect(() => {
    if (isReady) {
      exitOpacity.value = withTiming(
        0,
        {
          duration: 220,
          easing: Easing.in(Easing.cubic),
        },
        (finished) => {
          if (finished && onFinish) {
            runOnJS(onFinish)();
          }
        }
      );
    }
  }, [isReady, onFinish]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
    transform: [
      {
        scale: interpolate(exitOpacity.value, [0, 1], [1.02, 1]),
      },
    ],
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedAuraStyle = useAnimatedStyle(() => ({
    opacity: interpolate(auraScale.value, [0.96, 1.08], [0.4, 0.7]),
    transform: [{ scale: auraScale.value }],
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progressSweep.value }],
  }));

  // Exact 160px width matching native expo-splash-screen for seamless alignment
  const logoDimension = Math.min(width * 0.42, 160);

  return (
    <Animated.View
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
        animatedContainerStyle,
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Subtle modern background gradient complementing logo */}
      <LinearGradient
        colors={
          isDark
            ? ['#0D1527', '#0A0F1D', '#060913']
            : ['#FFFFFF', '#F8FAFC', '#F1F5F9']
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Center Branding Content */}
      <View style={styles.centerContainer}>
        {/* Ambient Soft Glow Behind Logo */}
        <Animated.View
          style={[
            styles.ambientAura,
            isDark ? styles.ambientAuraDark : styles.ambientAuraLight,
            animatedAuraStyle,
          ]}
        />

        {/* Official FEEDX Logo (Exact project asset, unclipped & crisp) */}
        <Animated.View
          style={[
            styles.logoWrapper,
            { width: logoDimension, height: logoDimension },
            animatedLogoStyle,
          ]}
        >
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logoImage}
            contentFit="contain"
            priority="high"
            cachePolicy="memory-disk"
          />
        </Animated.View>

        {/* Clean Modern App Title */}
        <Animated.Text
          style={[
            styles.brandTitle,
            isDark ? styles.brandTitleDark : styles.brandTitleLight,
          ]}
        >
          FEEDX
        </Animated.Text>

        {/* Category Pill Badge */}
        <View
          style={[
            styles.badgeWrap,
            isDark ? styles.badgeWrapDark : styles.badgeWrapLight,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isDark ? styles.badgeTextDark : styles.badgeTextLight,
            ]}
          >
            POLYTECHNIC STUDENT ECOSYSTEM
          </Text>
        </View>

        {/* Slim Animated Progress Bar */}
        <View
          style={[
            styles.progressTrack,
            isDark ? styles.progressTrackDark : styles.progressTrackLight,
          ]}
        >
          <Animated.View style={[styles.progressBar, animatedProgressStyle]}>
            <LinearGradient
              colors={['#38BDF8', '#3B82F6', '#6366F1']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </View>

        {/* Real Status Messages */}
        <View style={styles.statusBox}>
          {isOffline ? (
            <View style={styles.offlineRow}>
              <Feather name="wifi-off" size={12} color="#F59E0B" style={{ marginRight: 6 }} />
              <Text style={styles.offlineText}>Offline Mode • Loading cached session</Text>
            </View>
          ) : (
            <Text
              style={[
                styles.messageText,
                isDark ? styles.messageTextDark : styles.messageTextLight,
              ]}
              numberOfLines={1}
            >
              {message}
            </Text>
          )}

          {subMessage ? (
            <Text
              style={[
                styles.subMessageText,
                isDark ? styles.subMessageTextDark : styles.subMessageTextLight,
              ]}
              numberOfLines={1}
            >
              {subMessage}
            </Text>
          ) : null}
        </View>

        {/* Graceful Fallback Action on Prolonged Loading */}
        {showRetry && onRetry ? (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Feather name="arrow-right-circle" size={14} color="#60A5FA" />
            <Text style={styles.retryText}>Continue to App</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Elegant Footer Tagline */}
      {showTagline && (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          <Text
            style={[
              styles.taglineText,
              isDark ? styles.taglineTextDark : styles.taglineTextLight,
            ]}
          >
            Skills  •  Opportunities  •  Knowledge
          </Text>
          <Text
            style={[
              styles.versionText,
              isDark ? styles.versionTextDark : styles.versionTextLight,
            ]}
          >
            Empowering Next-Gen Engineers
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerDark: {
    backgroundColor: '#0A0F1D',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  ambientAura: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    top: '18%',
  },
  ambientAuraDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  ambientAuraLight: {
    backgroundColor: 'rgba(37, 99, 235, 0.04)',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 4.5,
    marginBottom: 8,
  },
  brandTitleDark: {
    color: '#F8FAFC',
  },
  brandTitleLight: {
    color: '#0F172A',
  },
  badgeWrap: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 26,
  },
  badgeWrapDark: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.22)',
  },
  badgeWrapLight: {
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.15)',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  badgeTextDark: {
    color: '#60A5FA',
  },
  badgeTextLight: {
    color: '#2563EB',
  },
  progressTrack: {
    width: 140,
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressTrackDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  progressTrackLight: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  progressBar: {
    width: 80,
    height: '100%',
    borderRadius: 1.5,
  },
  statusBox: {
    alignItems: 'center',
    marginTop: 14,
    minHeight: 34,
  },
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#F59E0B',
  },
  messageText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  messageTextDark: {
    color: '#94A3B8',
  },
  messageTextLight: {
    color: '#475569',
  },
  subMessageText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  subMessageTextDark: {
    color: '#64748B',
  },
  subMessageTextLight: {
    color: '#64748B',
  },
  retryBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  retryText: {
    color: '#60A5FA',
    fontSize: 11.5,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  taglineTextDark: {
    color: '#94A3B8',
  },
  taglineTextLight: {
    color: '#475569',
  },
  versionText: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  versionTextDark: {
    color: '#475569',
  },
  versionTextLight: {
    color: '#94A3B8',
  },
});
