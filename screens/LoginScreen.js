import { COLORS, SHADOWS } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ButtonLoading } from '@/components/ui/Loaders';
import Animated, { FadeInUp, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

function AnimatedBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[styles.glowBlob, { top: -100, left: -100, backgroundColor: COLORS.primaryGlow, width: 400, height: 400, opacity: 0.2 }]} />
      <View style={[styles.glowBlob, { bottom: -100, right: -100, backgroundColor: COLORS.purpleLight, width: 400, height: 400, opacity: 0.1 }]} />
    </View>
  );
}

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, booting, signIn } = useUser();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        BackHandler.exitApp();
        return true;
      });
      return () => sub.remove();
    }, [])
  );

  useEffect(() => {
    if (!booting && user) {
      const role = String(user?.role || '').trim().toLowerCase();
      const mustChange = role === 'student' && user?.is_password_set === false;
      if (mustChange) {
        router.replace('/change-password');
      } else if (role === 'super_admin') {
        router.replace('/super-admin');
      } else if (role === 'admin' || role === 'inst_admin') {
        router.replace('/(tabs)/admin');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, booting, router]);

  const pulse = useSharedValue(1);
  const dotPulse = useSharedValue(1);
  const rotation = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const satelliteRotation = useSharedValue(0);
  const ripple = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 1200 }), withTiming(1, { duration: 1200 })),
      -1, true
    );
    dotPulse.value = withRepeat(
      withTiming(1.4, { duration: 800 }),
      -1, true
    );
    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1, false
    );
    rotation2.value = 0;
    rotation2.value = withRepeat(
      withTiming(-360, { duration: 6000, easing: Easing.linear }),
      -1, false
    );
    satelliteRotation.value = 0;
    satelliteRotation.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1, false
    );
    ripple.value = 0;
    ripple.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1, false
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.1], [0.2, 0.5]),
  }));

  const useRippleStyle = (delay) => useAnimatedStyle(() => {
    const progress = (ripple.value + delay) % 1;
    return {
      transform: [{ scale: interpolate(progress, [0, 1], [1, 2.2]) }],
      opacity: interpolate(progress, [0, 0.5, 1], [0, 0.3, 0]),
    };
  });

  const useSatelliteStyle = (angle) => useAnimatedStyle(() => {
    const rad = (satelliteRotation.value + angle) * (Math.PI / 180);
    const radius = 72;
    return {
      transform: [
        { translateX: Math.cos(rad) * radius },
        { translateY: Math.sin(rad) * radius },
        { scale: interpolate(pulse.value, [1, 1.1], [0.8, 1]) }
      ],
      opacity: interpolate(pulse.value, [1, 1.1], [0.4, 0.9]),
    };
  });

  const ringStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: interpolate(pulse.value, [1, 1.1], [1, 1.15]) }
    ],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation2.value}deg` },
      { scale: interpolate(pulse.value, [1, 1.1], [1, 1.1]) }
    ],
  }));

  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * 0.9 }],
    opacity: interpolate(pulse.value, [1, 1.1], [0.3, 0.6]),
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotPulse.value }],
    opacity: interpolate(dotPulse.value, [1, 1.4], [1, 0.4]),
  }));

  const handleSignIn = async () => {
    const trimmed = identifier.trim();
    if (!trimmed || !password) {
      setError('Invalid Student ID or Password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const logged = await signIn(trimmed, password);

      if (!logged) {
        setError('Invalid Student ID or Password. Please check your credentials.');
        return;
      }

      const role = String(logged?.role || '').trim().toLowerCase();
      const mustChange = role === 'student' && logged?.is_password_set === false;
      const needsProfileSetup = role === 'student' && !logged?.first_login_completed;

      if (mustChange) {
        router.replace('/change-password');
      } else if (role === 'super_admin') {
        router.replace('/super-admin');
      } else if (role === 'admin' || role === 'inst_admin') {
        router.replace('/(tabs)/admin');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      setError(e?.message || 'Invalid Student ID or Password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFill} />
      <AnimatedBackground />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} scrollEnabled={false}>

          <View style={styles.logoGroup}>
            {/* Data Ripples */}
            <Animated.View style={[styles.dataRipple, useRippleStyle(0)]} />
            <Animated.View style={[styles.dataRipple, useRippleStyle(0.33)]} />
            <Animated.View style={[styles.dataRipple, useRippleStyle(0.66)]} />

            <Animated.View style={[styles.logoGlow, glowStyle]} />
            <Animated.View style={[styles.orbitalRing, ringStyle]} />
            <Animated.View style={[styles.orbitalRing2, ring2Style]} />
            <Animated.View style={[styles.orbitalRing3, ring3Style]} />

            {/* Academic Satellites */}
            <Animated.View style={[styles.satellite, useSatelliteStyle(0)]}>
              <Feather name="book-open" size={14} color={COLORS.primary} />
            </Animated.View>
            <Animated.View style={[styles.satellite, useSatelliteStyle(90)]}>
              <Feather name="edit-3" size={14} color={COLORS.primary} />
            </Animated.View>
            <Animated.View style={[styles.satellite, useSatelliteStyle(180)]}>
              <Feather name="shield" size={14} color={COLORS.primary} />
            </Animated.View>
            <Animated.View style={[styles.satellite, useSatelliteStyle(270)]}>
              <Feather name="settings" size={14} color={COLORS.primary} />
            </Animated.View>

            <TouchableOpacity onPress={() => router.push('/about-feedx')} activeOpacity={0.8} style={styles.logoOuter}>
              <Image source={require('../assets/images/icon.png')} style={styles.logo} contentFit="cover" />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>FeedX Polytechnic</Text>
            <Text style={styles.subtitle}>Institutional Management System</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.glass}>

              {error ? (
                <Animated.View entering={FadeInUp} style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={18} color="rgba(255,255,255,0.4)" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={18} color="rgba(255,255,255,0.4)" />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="rgba(255,255,255,0.4)" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.forgotPasswordTouchable}
                  onPress={() => router.push('/forgot-password')}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginBtn} onPress={handleSignIn} disabled={loading} activeOpacity={0.8}>
                <LinearGradient colors={COLORS.gradientPrimary} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  {loading ? <ButtonLoading color="#FFF" /> : <Text style={styles.btnText}>Login</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => router.push('/first-time-login')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryBtnText}>First-Time Registration</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.termsTouchable}
                onPress={() => router.push('/terms-conditions')}
                activeOpacity={0.7}
              >
                <Text style={styles.termsText}>
                  By logging in, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>
              </TouchableOpacity>

            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footerBarContainer}>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>FEEDX POLYTECHNIC SYSTEM LIVE</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  glowBlob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.4 },
  particle: { position: 'absolute', width: 2, height: 2, backgroundColor: '#FFF', borderRadius: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 90 : 70, paddingBottom: 16, alignItems: 'center', justifyContent: 'flex-start' },
  logoGroup: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 35 },
  logoGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryGlow,
    opacity: 0.3,
  },
  dataRipple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  orbitalRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    opacity: 0.4,
  },
  orbitalRing2: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1,
    borderColor: COLORS.primaryGlow,
    borderStyle: 'dashed',
    opacity: 0.2,
  },
  orbitalRing3: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  logoOuter: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 15,
    overflow: 'hidden',
  },
  glint: {
    position: 'absolute',
    width: 30,
    height: '200%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: '-50%',
  },
  bracket: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderColor: COLORS.primary,
  },
  tl: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },
  satellite: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  logo: { width: '100%', height: '100%', borderRadius: 20 },
  header: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -0.8 },
  subtitle: { fontSize: 11.5, color: 'rgba(255,255,255,0.45)', fontWeight: '700', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1.2 },
  formCard: { width: '100%', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.75)' },
  glass: { padding: 22, gap: 16 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(239,68,68,0.1)', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  errorText: { color: COLORS.danger, fontSize: 13, fontWeight: '600' },
  inputGroup: { gap: 6 },
  label: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 2 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  input: { flex: 1, marginLeft: 12, color: '#FFF', fontSize: 15, fontWeight: '500' },
  loginBtn: { height: 54, borderRadius: 14, overflow: 'hidden', marginTop: 8, ...SHADOWS.glow(COLORS.primary) },
  secondaryBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  secondaryBtnText: { color: '#60A5FA', fontWeight: '800', fontSize: 14.5, letterSpacing: 0.3 },
  btnGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  footerBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowRadius: 6,
    shadowOpacity: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
  forgotBtn: { alignSelf: 'center', marginTop: 20 },
  forgotText: { color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: '600' },
  forgotPasswordTouchable: {
    alignSelf: 'flex-end',
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 2,
    minHeight: 44,
    justifyContent: 'center',
  },
  forgotPasswordText: {
    color: '#60A5FA',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  supportHelpBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  supportHelpText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  termsTouchable: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  termsText: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '600',
    textAlign: 'center',
  },
  termsLink: {
    color: '#60A5FA',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  supportEmailHighlight: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  footer: { marginTop: 40 },
  footerText: { color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 },
  infoNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(59, 130, 246, 0.2)', marginTop: 4 },
  infoNoteText: { fontSize: 10.5, color: '#93C5FD', fontWeight: '600', flex: 1, lineHeight: 14 },
});