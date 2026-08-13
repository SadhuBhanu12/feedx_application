import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ButtonLoading } from '@/components/ui/Loaders';
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        // Add helpful hints for common errors
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
    return (
      <AuthShell title="Create Password" subtitle="Session expired.">
        <Text style={styles.errorText}>Please verify your identity again.</Text>
        <TouchableOpacity style={styles.linkBtn} onPress={() => router.replace('/first-time-login')}>
          <Text style={styles.linkText}>Go to First Time Login</Text>
        </TouchableOpacity>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create Password"
      subtitle={name ? `Welcome ${name}. Set a secure password for your account.` : 'Set a secure password for your account.'}
      showBack={false}>
      <Animated.View entering={FadeInUp.duration(350)}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color="rgba(255,255,255,0.4)" />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="rgba(255,255,255,0.25)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setError('');
              }}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color="rgba(255,255,255,0.4)" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255,255,255,0.25)"
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={(v) => {
                setConfirm(v);
                setError('');
              }}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirm((p) => !p)}>
              <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          </View>
        </View>

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
          <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[validation.strength] }]}>
            Password strength: {validation.strength}
          </Text>
        </View>

        <View style={styles.rules}>
          {validation.rules.map((rule) => (
            <View key={rule.key} style={styles.ruleRow}>
              <Feather
                name={validation.checks[rule.key] ? 'check-circle' : 'circle'}
                size={14}
                color={validation.checks[rule.key] ? COLORS.success : 'rgba(255,255,255,0.25)'}
              />
              <Text style={[styles.ruleText, validation.checks[rule.key] && styles.ruleMet]}>{rule.label}</Text>
            </View>
          ))}
        </View>

        {confirm.length > 0 && !matched ? <Text style={styles.errorText}>Passwords do not match.</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={[styles.cta, !canSubmit && styles.ctaDisabled]} onPress={handleCreate} disabled={!canSubmit}>
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.ctaGradient}>
            {loading ? <ButtonLoading color="#FFF" /> : <Text style={styles.ctaText}>Create Password</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  inputGroup: { gap: 6, marginBottom: 14 },
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
  strengthWrap: { marginBottom: 12 },
  strengthBarBg: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  strengthBarFill: { height: 6, borderRadius: 3 },
  strengthLabel: { marginTop: 6, fontSize: 12, fontWeight: '800' },
  rules: { gap: 6, marginBottom: 12 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ruleText: { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '500' },
  ruleMet: { color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  errorText: { color: COLORS.danger, fontWeight: '600', marginBottom: 8, fontSize: 13 },
  cta: { height: 54, borderRadius: 14, overflow: 'hidden', marginTop: 8, ...SHADOWS.glow(COLORS.primary) },
  ctaDisabled: { opacity: 0.5 },
  ctaGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#FFF', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
  linkBtn: { marginTop: 14, alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  linkText: { color: '#60A5FA', fontWeight: '800', fontSize: 14 },
});
