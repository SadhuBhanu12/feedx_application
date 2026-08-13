import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function AppLoader() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const pulseGlow = useSharedValue(0.4);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Rotation animation for outer halo ring
    rotation.value = withRepeat(
      withTiming(360, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );

    // Pulse animation for logo scale
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Glow intensity pulse
    pulseGlow.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Simulated progress bar loading loop
    progressWidth.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const animatedHaloStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    opacity: pulseGlow.value,
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />

      <View style={styles.contentBox}>
        {/* Animated Halo & Logo Box */}
        <View style={styles.logoWrapper}>
          <Animated.View style={[styles.haloRing, animatedHaloStyle]}>
            <LinearGradient
              colors={[COLORS.primary, '#8B5CF6', '#EC4899', 'transparent']}
              style={styles.haloGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          <Animated.View style={[styles.logoCard, animatedLogoStyle]}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </Animated.View>
        </View>

        {/* Brand Name & Tagline */}
        <View style={styles.brandGroup}>
          <Text style={styles.brandTitle}>FEEDX</Text>
          <Text style={styles.brandSubtitle}>POLYTECHNIC PLATFORM</Text>
        </View>

        {/* Loading Bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, animatedProgressStyle]}>
            <LinearGradient
              colors={['#06B6D4', COLORS.primary, '#8B5CF6']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </View>

        <Text style={styles.loadingText}>Initializing Workspace...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    alignItems: 'center',
    width: width * 0.85,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  haloRing: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    padding: 3,
  },
  haloGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 68,
  },
  logoCard: {
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow(COLORS.primary),
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandGroup: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 3,
  },
  progressTrack: {
    width: 180,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
