import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

function AnimatedAmbientGlow() {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const glowStyleTop = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.18, 0.32]),
  }));

  const glowStyleBottom = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.14, 0.26]),
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        style={[
          styles.glowOrb,
          {
            top: -height * 0.12,
            left: -width * 0.18,
            backgroundColor: '#10B981',
            width: width * 0.9,
            height: width * 0.9,
          },
          glowStyleTop,
        ]}
      />
      <Animated.View
        style={[
          styles.glowOrb,
          {
            bottom: -height * 0.14,
            right: -width * 0.22,
            backgroundColor: '#3B82F6',
            width: width * 0.95,
            height: width * 0.95,
          },
          glowStyleBottom,
        ]}
      />
    </View>
  );
}

export default function ActivationSuccessScreen() {
  const router = useRouter();

  const checkScale = useSharedValue(0);
  const ringScale = useSharedValue(0.6);
  const ringOpacity = useSharedValue(0.9);

  useEffect(() => {
    checkScale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 120 })
    );

    ringScale.value = withDelay(
      350,
      withRepeat(
        withTiming(1.9, { duration: 2200, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );

    ringOpacity.value = withDelay(
      350,
      withRepeat(
        withTiming(0, { duration: 2200, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#030712', '#0B0F19', '#020617']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <AnimatedAmbientGlow />

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(700).springify()}
          style={styles.card}
        >
          {/* Card Border Highlight Gradient */}
          <LinearGradient
            colors={['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.06)']}
            style={styles.cardBorderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.innerCard}>
              
              {/* Top Animated Success Check Badge */}
              <View style={styles.badgeContainer}>
                <Animated.View style={[styles.pulseRing, ringAnimatedStyle]} />
                <Animated.View style={[styles.badgeShadow, checkAnimatedStyle]}>
                  <LinearGradient
                    colors={['#10B981', '#059669', '#047857']}
                    style={styles.badgeCircle}
                    start={{ x: 0.1, y: 0 }}
                    end={{ x: 0.9, y: 1 }}
                  >
                    <Feather name="check" size={40} color="#FFFFFF" />
                  </LinearGradient>
                </Animated.View>
              </View>

              {/* Status Pill Badge */}
              <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.statusPill}>
                <Feather name="shield" size={12} color="#10B981" />
                <Text style={styles.statusPillText}>SECURITY UPDATE COMPLETED</Text>
              </Animated.View>

              {/* Title & Subtitle */}
              <Animated.Text entering={FadeInUp.delay(400).duration(600)} style={styles.title}>
                Password Updated
              </Animated.Text>

              <Animated.Text entering={FadeInUp.delay(500).duration(600)} style={styles.subtitle}>
                Your account password has been updated securely. You can now sign in using your new credentials.
              </Animated.Text>

              {/* Security Status Checklist */}
              <Animated.View entering={FadeInUp.delay(650).duration(600)} style={styles.securityBox}>
                <View style={styles.securityRow}>
                  <View style={[styles.iconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Ionicons name="shield-checkmark" size={18} color="#10B981" />
                  </View>
                  <View style={styles.securityTextWrap}>
                    <Text style={styles.securityTitle}>End-to-End Encryption</Text>
                    <Text style={styles.securitySub}>Bcrypt salted hash stored securely</Text>
                  </View>
                  <View style={styles.verifiedTag}>
                    <Feather name="check" size={11} color="#10B981" />
                    <Text style={styles.verifiedTagText}>Active</Text>
                  </View>
                </View>

                <View style={styles.securityDivider} />

                <View style={styles.securityRow}>
                  <View style={[styles.iconWrap, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                    <Ionicons name="sync" size={17} color="#60A5FA" />
                  </View>
                  <View style={styles.securityTextWrap}>
                    <Text style={styles.securityTitle}>Sessions Refreshed</Text>
                    <Text style={styles.securitySub}>Temporary tokens revoked</Text>
                  </View>
                  <View style={[styles.verifiedTag, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.25)' }]}>
                    <Feather name="check" size={11} color="#60A5FA" />
                    <Text style={[styles.verifiedTagText, { color: '#60A5FA' }]}>Verified</Text>
                  </View>
                </View>
              </Animated.View>

              {/* Action Button */}
              <Animated.View entering={FadeInUp.delay(800).duration(600)} style={styles.actionWrap}>
                <TouchableOpacity
                  style={styles.cta}
                  onPress={() => router.replace('/login')}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={COLORS.gradientPrimary || ['#3B82F6', '#2563EB']}
                    style={styles.ctaGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.ctaText}>Continue to Sign In</Text>
                    <Feather name="arrow-right" size={18} color="#FFF" style={styles.ctaIcon} />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    zIndex: 10,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 30,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.65,
        shadowRadius: 28,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  cardBorderGradient: {
    padding: 1.5,
    borderRadius: 30,
  },
  innerCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderRadius: 28.5,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  badgeContainer: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  pulseRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.45)',
  },
  badgeShadow: {
    width: 78,
    height: 78,
    borderRadius: 39,
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 18,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  badgeCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.28)',
    marginBottom: 12,
  },
  statusPillText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  securityBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityTextWrap: {
    flex: 1,
  },
  securityTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  securitySub: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11.5,
    marginTop: 1,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.28)',
  },
  verifiedTagText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  securityDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    width: '100%',
    marginVertical: 12,
  },
  actionWrap: {
    width: '100%',
  },
  cta: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.glow(COLORS.primary || '#3B82F6'),
  },
  ctaGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  ctaIcon: {
    marginLeft: 2,
  },
});
