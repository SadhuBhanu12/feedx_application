import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AuthShell from '@/components/auth/AuthShell';
import { COLORS, SHADOWS } from '@/constants/theme';
import { completeAccountActivation } from '@/services/supabaseService';
import { passwordsMatch, validatePassword } from '@/utils/passwordValidation';

const STRENGTH_COLORS = {
  weak: COLORS.danger,
  medium: COLORS.warning,
  strong: COLORS.success,
};

export default function CreatePasswordScreen() {
  const router = useRouter();
  const { token, name } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  const validation = useMemo(() => validatePassword(password), [password]);
  const matched = passwordsMatch(password, confirm);
  const canSubmit = validation.isValid && matched && !!token && !loading;

  const handleCreate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      console.log('[CreatePassword] Submitting password creation with token:', token?.substring(0, 8) + '...');
      console.log('[CreatePassword] Password length:', password?.length, '| Confirm length:', confirm?.length);
      await completeAccountActivation(String(token), password, confirm);
      console.log('[CreatePassword] ✅ Password created successfully, navigating to activation-success');
      router.replace('/activation-success');
    } catch (e) {
      console.error('[CreatePassword] ❌ Error:', e);
      console.error('[CreatePassword] Error details:', JSON.stringify(e, Object.getOwnPropertyNames(e)));
      let errorMsg = 'Unable to create password. Please try again.';
      if (typeof e === 'string') {
        errorMsg = e;
      } else if (e?.message) {
        errorMsg = e.message;
        if (errorMsg.includes('expired') || errorMsg.includes('Session')) {
          errorMsg += '\n\nPlease go back and verify your identity again.';
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <AuthShell
      title="Create Password"
      subtitle={name ? `Welcome ${name}. Set a secure password for your account.` : 'Set a secure password for your account.'}
      showBack={true}
      onBack={() => router.replace('/login')}
    >
      <Animated.View entering={FadeInUp.duration(350)}>
        
        {/* New Password Input Group */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={[styles.inputWrap, focusedField === 'password' && styles.inputWrapFocused]}>
            <Feather
              name="lock"
              size={18}
              color={focusedField === 'password' ? '#60A5FA' : 'rgba(255,255,255,0.45)'}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="rgba(255,255,255,0.35)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setError('');
              }}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#60A5FA"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((p) => !p)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.eyeBtn}
            >
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={18}
                color={showPassword ? '#60A5FA' : 'rgba(255,255,255,0.45)'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input Group */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={[styles.inputWrap, focusedField === 'confirm' && styles.inputWrapFocused]}>
            <Feather
              name="check-circle"
              size={18}
              color={focusedField === 'confirm' ? '#60A5FA' : 'rgba(255,255,255,0.45)'}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor="rgba(255,255,255,0.35)"
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={(v) => {
                setConfirm(v);
                setError('');
              }}
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#60A5FA"
            />
            <TouchableOpacity
              onPress={() => setShowConfirm((p) => !p)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.eyeBtn}
            >
              <Feather
                name={showConfirm ? 'eye' : 'eye-off'}
                size={18}
                color={showConfirm ? '#60A5FA' : 'rgba(255,255,255,0.45)'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Strength Indicator */}
        {password.length > 0 && (
          <View style={styles.strengthWrap}>
            <View style={styles.strengthBarBg}>
              <View
                style={[
                  styles.strengthBarFill,
                  {
                    width: `${(validation.score / 5) * 100}%`,
                    backgroundColor: STRENGTH_COLORS[validation.strength],
                  },
                ]}
              />
            </View>
            <View style={styles.strengthLabelRow}>
              <Text style={styles.strengthSubText}>Security Assessment:</Text>
              <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[validation.strength] }]}>
                {validation.strength?.toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        {/* Password Policy Rules */}
        <View style={styles.rules}>
          {validation.rules.map((rule) => {
            const isMet = validation.checks[rule.key];
            return (
              <View key={rule.key} style={styles.ruleRow}>
                <Feather
                  name={isMet ? 'check-circle' : 'circle'}
                  size={13}
                  color={isMet ? COLORS.success : 'rgba(255,255,255,0.25)'}
                />
                <Text style={[styles.ruleText, isMet && styles.ruleMet]}>{rule.label}</Text>
              </View>
            );
          })}
        </View>

        {confirm.length > 0 && !matched ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={15} color={COLORS.danger} />
            <Text style={styles.errorText}>Passwords do not match.</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={15} color={COLORS.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.cta, !canSubmit && styles.ctaDisabled]}
          onPress={handleCreate}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.ctaGradient}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <View style={styles.ctaContent}>
                <Text style={styles.ctaText}>Set Password & Finish</Text>
                <Feather name="arrow-right" size={18} color="#FFF" />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

      </Animated.View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  inputWrapFocused: {
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
  eyeBtn: {
    padding: 6,
    marginLeft: 6,
  },
  strengthWrap: {
    marginTop: 4,
    marginBottom: 14,
  },
  strengthBarBg: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  strengthSubText: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
  },
  strengthLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rules: {
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '500',
  },
  ruleMet: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.danger,
    fontWeight: '600',
    fontSize: 13,
    flex: 1,
  },
  cta: {
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 6,
    ...SHADOWS.glow(COLORS.primary),
  },
  ctaDisabled: {
    opacity: 0.45,
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
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15.5,
    letterSpacing: 0.4,
  },
});
