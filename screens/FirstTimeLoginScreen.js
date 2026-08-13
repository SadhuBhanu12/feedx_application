import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ButtonLoading } from '@/components/ui/Loaders';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AuthShell from '@/components/auth/AuthShell';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';

export default function FirstTimeLoginScreen() {
  const router = useRouter();
  const { sendOtp, verifyOtp } = useUser();

  const [step, setStep] = useState(1); // 1: Email Lookup & Send OTP, 2: OTP Verification
  const [student, setStudent] = useState(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const maskEmail = (emailStr) => {
    const parts = emailStr.split('@');
    if (parts.length !== 2) return emailStr;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `**@${domain}`;
    return `${name.slice(0, 2)}******@${domain}`;
  };

  const handleSendOtp = async () => {
    const mail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail || !emailRegex.test(mail)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('[FirstTimeLogin] Looking up email:', mail);

      // Check if it is a superadmin/admin in the base users table
      const { data: userProfile, error: profileErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', mail)
        .maybeSingle();

      if (profileErr) throw profileErr;

      if (userProfile && (userProfile.role === 'super_admin' || userProfile.role === 'admin' || userProfile.role === 'inst_admin')) {
        console.log('[FirstTimeLogin] Admin/SuperAdmin detected, bypassing OTP');
        // Bypass OTP for admins/superadmins
        // Invalidate any old unused sessions first
        await supabase
          .from('activation_sessions')
          .update({ used: true })
          .eq('user_id', userProfile.id)
          .eq('used', false);

        const activationToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        const { error: sessionError } = await supabase
          .from('activation_sessions')
          .insert({
            user_id: userProfile.id,
            token: activationToken,
            expires_at: expiresAt,
            used: false,
          });

        if (sessionError) throw sessionError;

        router.push({
          pathname: '/create-password',
          params: {
            token: activationToken,
            name: userProfile.full_name || 'Super Admin',
          },
        });
        return;
      }

      // 1. Verify that email exists in the pre-registered students list
      const { data, error: dbError } = await supabase
        .from('students')
        .select('*')
        .eq('email', mail)
        .maybeSingle();

      if (dbError) throw dbError;

      if (!data) {
        setError('Email not found in student registry. Please contact feedxhub@gmail.com for assistance.');
        return;
      }

      if (data.is_password_set) {
        setError('This account has already been activated. Please log in.');
        return;
      }

      console.log('[FirstTimeLogin] Student found:', data.roll_number, '| Sending OTP...');

      // 2. Dispatch OTP to target email address
      // skipEmailCheck=true because we already verified the student exists in the students table
      await sendOtp(data.roll_number, mail, { skipEmailCheck: true });
      setStudent(data);
      setStep(2);
      setCooldown(30);
    } catch (e) {
      console.error('[FirstTimeLogin] handleSendOtp error:', e);
      setError(e.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || loading || !student) return;
    setLoading(true);
    setError('');
    try {
      await sendOtp(student.roll_number, email.trim().toLowerCase(), { skipEmailCheck: true });
      setCooldown(30);
    } catch (e) {
      setError(e.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.trim();
    if (code.length !== 6 || !student) {
      setError('Please enter a 6-digit verification code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('[FirstTimeLogin] Verifying OTP for:', student.roll_number);
      const result = await verifyOtp(student.roll_number, code);
      if (result?.verified) {
        console.log('[FirstTimeLogin] OTP verified! Generating secure activation session via DB RPC...');

        // Call the secure RPC function to create/merge user and generate session token in one transaction
        const { data: sessionData, error: sessionError } = await supabase.rpc(
          'create_activation_session',
          {
            p_roll_number: student.roll_number.trim().toUpperCase(),
            p_email: student.email.trim().toLowerCase(),
          }
        );

        if (sessionError) {
          console.error('[FirstTimeLogin] RPC Session creation failed:', sessionError.message);
          throw new Error('Failed to create activation session: ' + sessionError.message);
        }

        if (!sessionData || !sessionData.activation_token) {
          console.error('[FirstTimeLogin] RPC returned empty session data:', sessionData);
          throw new Error('Failed to generate activation token.');
        }

        console.log('[FirstTimeLogin] ✅ Session created securely. Token:', sessionData.activation_token.substring(0, 8) + '...');

        router.push({
          pathname: '/create-password',
          params: {
            token: sessionData.activation_token,
            name: sessionData.name || student.full_name || '',
          },
        });
      } else {
        setError('Incorrect or expired verification code.');
      }
    } catch (e) {
      console.error('[FirstTimeLogin] handleVerifyOtp error:', e);
      setError(e.message || 'OTP Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="First Time Activation"
      subtitle={
        step === 1
          ? 'Provide your email address to check your account status.'
          : 'Enter the verification code sent to your email.'
      }
    >
      <Animated.View entering={FadeInUp.duration(350)}>
        {step === 1 && (
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Feather name="mail" size={18} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.cta} onPress={handleSendOtp} disabled={loading}>
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.ctaGradient}>
                {loading ? <ButtonLoading color="#FFF" /> : <Text style={styles.ctaText}>Send OTP</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.welcomeText}>Hello, {student?.full_name}</Text>
            <Text style={styles.maskedEmailText}>OTP sent to: {maskEmail(email)}</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <View style={styles.inputWrap}>
                <Feather name="hash" size={18} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  value={otp}
                  onChangeText={(v) => {
                    setOtp(v.replace(/\s/g, ''));
                    setError('');
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.cta} onPress={handleVerifyOtp} disabled={loading}>
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.ctaGradient}>
                {loading ? <ButtonLoading color="#FFF" /> : <Text style={styles.ctaText}>Verify OTP</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.resendBtn, cooldown > 0 && styles.resendDisabled]} 
              onPress={handleResendOtp}
              disabled={cooldown > 0 || loading}
            >
              <Text style={styles.resendText}>
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  inputGroup: { gap: 6, marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 2 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  input: { flex: 1, marginLeft: 12, color: '#FFF', fontSize: 15, fontWeight: '500' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    marginBottom: 12,
  },
  errorText: { color: COLORS.danger, fontWeight: '600', flex: 1, fontSize: 13 },
  cta: { height: 54, borderRadius: 14, overflow: 'hidden', marginTop: 8, ...SHADOWS.glow(COLORS.primary) },
  ctaGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#FFF', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
  welcomeText: { color: '#FFF', fontSize: 18, fontWeight: '900', marginBottom: 4, textAlign: 'center' },
  maskedEmailText: { color: '#60A5FA', fontSize: 13.5, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  resendBtn: { marginTop: 16, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16, minHeight: 44, justifyContent: 'center' },
  resendText: { color: '#60A5FA', fontWeight: '800', fontSize: 14 },
  resendDisabled: { opacity: 0.5 },
});
