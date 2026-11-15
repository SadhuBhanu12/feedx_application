import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Clipboard,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AuthShell from '@/components/auth/AuthShell';
import { COLORS, SHADOWS } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { sendOtpToEmail, verifyOtpCode } from '@/services/supabaseService';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [emailInput, setEmailInput] = useState(params?.email ? String(params.email).trim() : '');
  const [isFocused, setIsFocused] = useState(false);
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
    return re.test(String(email).trim().toLowerCase());
  };

  const handleSendOtp = async () => {
    const rawInput = emailInput.trim().toLowerCase();
    if (!rawInput) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!validateEmailFormat(rawInput)) {
      setError('Please enter a valid email format (e.g. student@gmail.com).');
      return;
    }

    if (lockoutTime > 0) {
      setError(`Too many failed attempts. Please wait ${Math.ceil(lockoutTime / 60)} minute(s) before trying again.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Look up user by email in students table (case-insensitive)
      const { data: studentRecord } = await supabase
        .from('students')
        .select('*')
        .ilike('email', rawInput)
        .maybeSingle();

      // 2. Look up user by email in users table (case-insensitive)
      const { data: userRecord } = await supabase
        .from('users')
        .select('*')
        .ilike('email', rawInput)
        .maybeSingle();

      const foundUser = studentRecord || userRecord;

      if (!foundUser) {
        setError('No account found with this email address. Please check your spelling or contact your college administrator.');
        return;
      }

      const rollNo = foundUser.roll_number || foundUser.pin_number || (userRecord?.roll_number) || rawInput.split('@')[0].toUpperCase();

      // Dispatch 6-digit OTP to the registered email address - ALWAYS require OTP verification
      await sendOtpToEmail(rollNo, rawInput, { skipEmailCheck: true });
      setStudent({
        email: rawInput,
        roll_number: rollNo,
        full_name: foundUser.full_name || 'User',
      });
      setStep(2);
      setCooldown(30);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 250);
    } catch (e) {
      const msg = e?.message || (typeof e === 'string' ? e : 'Failed to send verification code. Please try again.');
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || loading || !student) return;
    setLoading(true);
    setError('');
    try {
      await sendOtpToEmail(student.roll_number, student.email, { skipEmailCheck: true });
      setCooldown(30);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 250);
    } catch (e) {
      setError(e.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (text, index) => {
    const cleaned = text.replace(/[^0-9]/g, '');

    // Handle full paste of 6-digit code
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
      setError('Please enter all 6 digits of the verification code.');
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
      const msg = e?.message || (typeof e === 'string' ? e : 'OTP Verification failed.');
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle={
        step === 1
          ? 'Enter your registered email address to receive a 6-digit verification code.'
          : 'Enter the 6-digit verification code sent to your email.'
      }
    >
      <Animated.View entering={FadeInUp.duration(350)}>
        {step === 1 && (
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registered Email Address</Text>
              
              <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
                <Feather
                  name="mail"
                  size={19}
                  color={isFocused ? '#60A5FA' : 'rgba(255, 255, 255, 0.45)'}
                  style={styles.inputIcon}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.35)"
                  value={emailInput}
                  onChangeText={(v) => {
                    setEmailInput(v);
                    if (error) setError('');
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  selectionColor="#60A5FA"
                />

                {emailInput.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setEmailInput('');
                      setError('');
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.clearBtn}
                  >
                    <Feather name="x-circle" size={17} color="rgba(255, 255, 255, 0.4)" />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.helperText}>
                We will send an OTP verification code to reset your account password.
              </Text>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.cta}
              onPress={handleSendOtp}
              disabled={loading || lockoutTime > 0}
              activeOpacity={0.85}
            >
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.ctaGradient}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <View style={styles.ctaContent}>
                    <Text style={styles.ctaText}>Send Verification Code</Text>
                    <Feather name="arrow-right" size={18} color="#FFF" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginBtn}
              onPress={() => router.push('/login')}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={15} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.backToLoginText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <View style={styles.otpNoticeBox}>
              <View style={styles.otpNoticeIconWrap}>
                <Feather name="mail" size={18} color="#10B981" />
              </View>
              <View style={styles.otpNoticeTextWrap}>
                <Text style={styles.otpNoticeTitle}>Check Your Inbox</Text>
                <Text style={styles.otpNoticeText}>
                  Code sent to <Text style={styles.otpNoticeHighlight}>{student?.email}</Text>
                </Text>
              </View>
            </View>

            {/* 6-Digit OTP Boxes */}
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
                  textAlignVertical="center"
                />
              ))}
            </View>

            <TouchableOpacity style={styles.pasteBtn} onPress={handlePasteClipboard} activeOpacity={0.7}>
              <Feather name="clipboard" size={13} color="#93C5FD" />
              <Text style={styles.pasteText}>Paste from Clipboard</Text>
            </TouchableOpacity>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.cta}
              onPress={handleVerifyOtp}
              disabled={loading || lockoutTime > 0}
              activeOpacity={0.85}
            >
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.ctaGradient}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <View style={styles.ctaContent}>
                    <Text style={styles.ctaText}>Verify Code & Continue</Text>
                    <Feather name="check" size={18} color="#FFF" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.otpActionsRow}>
              <TouchableOpacity
                style={[styles.resendBtn, (cooldown > 0 || loading) && styles.resendDisabled]}
                onPress={handleResendOtp}
                disabled={cooldown > 0 || loading}
                activeOpacity={0.7}
              >
                <Feather name="rotate-cw" size={14} color={cooldown > 0 ? 'rgba(255, 255, 255, 0.4)' : '#60A5FA'} />
                <Text style={[styles.resendText, cooldown > 0 && styles.resendTextDisabled]}>
                  {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeEmailBtn}
                onPress={() => {
                  setStep(1);
                  setError('');
                }}
                activeOpacity={0.7}
              >
                <Feather name="edit-2" size={13} color="rgba(255, 255, 255, 0.6)" />
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  inputWrapperFocused: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '600',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },
  helperText: {
    marginTop: 8,
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    lineHeight: 17,
    marginLeft: 2,
  },
  otpNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 20,
  },
  otpNoticeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpNoticeTextWrap: {
    flex: 1,
  },
  otpNoticeTitle: {
    color: '#10B981',
    fontSize: 12.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  otpNoticeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  otpNoticeHighlight: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
    paddingVertical: 0,
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
    marginBottom: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  pasteText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.danger,
    fontWeight: '600',
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  cta: {
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    ...SHADOWS.glow(COLORS.primary),
  },
  ctaGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15.5,
    letterSpacing: 0.4,
  },
  backToLoginBtn: {
    marginTop: 18,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  backToLoginText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '700',
    fontSize: 14,
  },
  otpActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 4,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    minHeight: 44,
  },
  resendText: {
    color: '#60A5FA',
    fontWeight: '700',
    fontSize: 13.5,
  },
  resendTextDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  resendDisabled: {
    opacity: 0.6,
  },
  changeEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    minHeight: 44,
  },
  changeEmailText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '600',
    fontSize: 13.5,
  },
});
