import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Clipboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ButtonLoading } from '@/components/ui/Loaders';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AuthShell from '@/components/auth/AuthShell';
import { COLORS, SHADOWS } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { sendOtpToEmail, verifyOtpCode } from '@/services/supabaseService';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [emailInput, setEmailInput] = useState('');
  const [student, setStudent] = useState(null);

  // 6-digit OTP Array State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const validateEmailFormat = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendOtp = async () => {
    const rawEmail = emailInput.trim();
    if (!rawEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!validateEmailFormat(rawEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (lockoutTime > 0) {
      setError(`Too many failed attempts. Please wait ${Math.ceil(lockoutTime / 60)} minute(s) before trying again.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Check if user/student exists in database with this email
      const { data: userProfile, error: profileErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', rawEmail.toLowerCase())
        .maybeSingle();

      if (profileErr) throw profileErr;

      // Check students table if not found in users
      const { data: studentRecord } = await supabase
        .from('students')
        .select('*')
        .eq('email', rawEmail.toLowerCase())
        .maybeSingle();

      const foundUser = userProfile || studentRecord;

      if (!foundUser) {
        setError('This email is not registered in our database.');
        return;
      }

      const rollNo = studentRecord?.roll_number || userProfile?.roll_number || rawEmail.split('@')[0].toUpperCase();

      // Check Admin Bypass if super admin
      if (userProfile && ['super_admin', 'admin', 'inst_admin'].includes(userProfile.role)) {
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
            name: userProfile.full_name || 'Admin User',
          },
        });
        return;
      }

      // Send OTP to registered email
      await sendOtpToEmail(rollNo, rawEmail.toLowerCase(), { skipEmailCheck: true });
      setStudent({
        email: rawEmail.toLowerCase(),
        roll_number: rollNo,
        full_name: foundUser.full_name || 'FEEDX Official',
      });
      setStep(2);
      setCooldown(30);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 200);
    } catch (e) {
      setError(e.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setError('');
    try {
      await sendOtpToEmail(student.roll_number, student.email, { skipEmailCheck: true });
      setCooldown(30);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 200);
    } catch (e) {
      setError(e.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (text, index) => {
    const cleaned = text.replace(/[^0-9]/g, '');

    // Handle Paste of full 6-digit OTP
    if (cleaned.length >= 6) {
      const newDigits = cleaned.substring(0, 6).split('');
      setOtpDigits(newDigits);
      inputRefs.current[5]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned.substring(0, 1);
    setOtpDigits(newDigits);

    // Auto Focus Next Box
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      const cleaned = clipboardContent.replace(/[^0-9]/g, '');
      if (cleaned.length >= 6) {
        const newDigits = cleaned.substring(0, 6).split('');
        setOtpDigits(newDigits);
        inputRefs.current[5]?.focus();
      }
    } catch (e) {
      console.warn('Clipboard read error:', e);
    }
  };

  const handleVerifyOtp = async () => {
    if (lockoutTime > 0) {
      setError(`Account temporarily locked. Please wait ${Math.ceil(lockoutTime / 60)} minute(s).`);
      return;
    }

    const code = otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyOtpCode(student.roll_number, code);
      if (result?.verified) {
        setAttemptCount(0);
        const { data: sessionData, error: sessionError } = await supabase.rpc(
          'create_activation_session',
          {
            p_roll_number: student.roll_number.trim().toUpperCase(),
            p_email: student.email.trim().toLowerCase(),
          }
        );

        if (sessionError) throw new Error('Failed to create activation session: ' + sessionError.message);
        if (!sessionData || !sessionData.activation_token) throw new Error('Failed to generate activation token.');

        router.push({
          pathname: '/create-password',
          params: {
            token: sessionData.activation_token,
            name: sessionData.name || student.full_name || '',
          },
        });
      } else {
        const nextAttempts = attemptCount + 1;
        setAttemptCount(nextAttempts);

        if (nextAttempts >= 5) {
          setLockoutTime(15 * 60); // 15-minute lock
          setError('Maximum attempt limit reached. Account locked temporarily for 15 minutes.');
        } else {
          setError(`Incorrect or expired verification code. (${5 - nextAttempts} attempts remaining)`);
        }
      }
    } catch (e) {
      setError(e.message || 'OTP Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle={
        step === 1
          ? 'Enter your registered email address to receive a 6-digit One-Time Password (OTP).'
          : 'Enter the 6-digit verification code sent to your email.'
      }
    >
      <Animated.View entering={FadeInUp.duration(350)}>
        {step === 1 && (
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registered Email Address</Text>
              <View style={styles.inputWrap}>
                <Feather name="mail" size={18} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.input}
                  placeholder="name@gmail.com"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  value={emailInput}
                  onChangeText={(v) => {
                    setEmailInput(v);
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

            <TouchableOpacity style={styles.cta} onPress={handleSendOtp} disabled={loading || lockoutTime > 0}>
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.ctaGradient}>
                {loading ? <ButtonLoading color="#FFF" /> : <Text style={styles.ctaText}>Send OTP</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backToLoginBtn} onPress={() => router.push('/login')}>
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <View style={styles.otpNoticeBox}>
              <Feather name="check-circle" size={16} color="#10B981" />
              <Text style={styles.otpNoticeText}>
                OTP sent successfully to <Text style={{ fontWeight: '700', color: '#FFF' }}>{student?.email}</Text>
              </Text>
            </View>

            {/* 6 Digit Input Boxes */}
            <View style={styles.otpContainer}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                  value={digit}
                  onChangeText={(text) => handleDigitChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={6}
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity style={styles.pasteBtn} onPress={handlePasteClipboard}>
              <Feather name="clipboard" size={14} color="#93C5FD" />
              <Text style={styles.pasteText}>Paste OTP</Text>
            </TouchableOpacity>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.cta} onPress={handleVerifyOtp} disabled={loading || lockoutTime > 0}>
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.ctaGradient}>
                {loading ? <ButtonLoading color="#FFF" /> : <Text style={styles.ctaText}>Verify OTP</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.otpActionsRow}>
              <TouchableOpacity
                style={[styles.resendBtn, (cooldown > 0 || loading) && styles.resendDisabled]}
                onPress={handleResendOtp}
                disabled={cooldown > 0 || loading}
              >
                <Text style={styles.resendText}>
                  {cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeEmailBtn}
                onPress={() => {
                  setStep(1);
                  setError('');
                }}
              >
                <Text style={styles.changeEmailText}>Change Email</Text>
              </TouchableOpacity>
            </View>
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
  otpNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 16,
  },
  otpNoticeText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, flex: 1, fontWeight: '500' },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  pasteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  pasteText: { color: '#60A5FA', fontSize: 12, fontWeight: '800' },
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
  backToLoginBtn: { marginTop: 16, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16, minHeight: 44, justifyContent: 'center' },
  backToLoginText: { color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: 14 },
  otpActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  resendBtn: { paddingVertical: 8, minHeight: 44, justifyContent: 'center' },
  resendText: { color: '#60A5FA', fontWeight: '800', fontSize: 14 },
  resendDisabled: { opacity: 0.4 },
  changeEmailBtn: { paddingVertical: 8, minHeight: 44, justifyContent: 'center' },
  changeEmailText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 14 },
  supportBox: {
    marginTop: 28,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  supportTitle: { color: '#FFF', fontSize: 13, fontWeight: '800', marginBottom: 4 },
  supportBody: { color: 'rgba(255,255,255,0.5)', fontSize: 12, textAlign: 'center', lineHeight: 18 },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  emailText: { color: '#60A5FA', fontSize: 13, fontWeight: '800' },
  supportSub: { color: 'rgba(255,255,255,0.4)', fontSize: 11, textAlign: 'center' },
});
