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

function AnimatedBackground() {
  const pulse = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 3000 }), withTiming(1, { duration: 3000 })),
      -1,
      true
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 25000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const glowStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }, { rotate: `${rotation.value}deg` }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.2, 0.4]),
  }));

  const glowStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }, { rotate: `-${rotation.value}deg` }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.15, 0.3]),
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.glowBlob, { top: -height * 0.1, left: -width * 0.2, backgroundColor: COLORS.success, width: width * 0.8, height: width * 0.8 }, glowStyle1]} />
      <Animated.View style={[styles.glowBlob, { bottom: -height * 0.1, right: -width * 0.2, backgroundColor: COLORS.primaryGlow || COLORS.primary, width: width * 0.8, height: width * 0.8 }, glowStyle2]} />
    </View>
  );
}

export default function ActivationSuccessScreen() {
  const router = useRouter();
  
  const checkScale = useSharedValue(0);
  const ringScale = useSharedValue(0.5);
  const ringOpacity = useSharedValue(1);

  useEffect(() => {
    checkScale.value = withDelay(300, withSpring(1, { damping: 14, stiffness: 100 }));
    
    ringScale.value = withDelay(400, withRepeat(
      withTiming(2.2, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    ));
    
    ringOpacity.value = withDelay(400, withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    ));
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }]
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientHome || ['#000000', '#0a0a0a']} style={StyleSheet.absoluteFill} />
      <AnimatedBackground />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.card}>
          <View style={styles.glassContainer}>
            
            <View style={styles.iconWrapper}>
              <Animated.View style={[styles.rippleRing, animatedRingStyle]} />
              <Animated.View style={[styles.badge, checkStyle]}>
                <LinearGradient colors={[COLORS.success, '#059669']} style={styles.badgeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Feather name="check" size={44} color="#FFF" />
                </LinearGradient>
              </Animated.View>
            </View>

            <Animated.Text entering={FadeInUp.delay(400).duration(600)} style={styles.title}>
              ✅ Password Updated Successfully
            </Animated.Text>
            
            <Animated.Text entering={FadeInUp.delay(550).duration(600)} style={styles.subtitle}>
              Your password has been updated successfully. You can now log in using your new password.
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(700).duration(600)} style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
                </View>
                <Text style={styles.detailText}>Password Encrypted</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                </View>
                <Text style={styles.detailText}>Identity Verified</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(850).duration(600)} style={{ width: '100%' }}>
              <TouchableOpacity style={styles.cta} onPress={() => router.replace('/login')} activeOpacity={0.85}>
                <LinearGradient 
                  colors={COLORS.gradientPrimary || ['#3b82f6', '#2563eb']} 
                  style={styles.ctaGradient}
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.ctaText}>Return to Login</Text>
                  <Feather name="arrow-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',
  },
  glowBlob: { 
    position: 'absolute', 
    borderRadius: 999, 
    opacity: 0.3,
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 24,
    zIndex: 10,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(20,20,20,0.5)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
  glassContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  iconWrapper: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  rippleRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  badgeGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
    color: '#FFF', 
    fontSize: 26, 
    fontWeight: '900', 
    textAlign: 'center', 
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: { 
    color: 'rgba(255,255,255,0.6)', 
    fontSize: 14,
    textAlign: 'center', 
    lineHeight: 22, 
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    width: '100%',
    marginVertical: 12,
  },
  cta: { 
    width: '100%', 
    height: 56, 
    borderRadius: 18, 
    overflow: 'hidden',
    shadowColor: COLORS.primary || '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: { 
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  ctaText: { 
    color: '#FFF', 
    fontWeight: '800', 
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
