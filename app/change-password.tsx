import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import { useUser } from '@/context/UserContext';
import { passwordsMatch, validatePassword } from '@/utils/passwordValidation';

export default function ChangePasswordScreen() {
  const { user, booting, mustChangePassword, changePassword, signOut } = useUser();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const validation = useMemo(() => validatePassword(password), [password]);
  const matched = passwordsMatch(password, confirm);

  useEffect(() => {
    if (!booting && !user) {
      router.replace('/login');
      return;
    }
  }, [user, booting, router]);

  useEffect(() => {
    if (!mustChangePassword) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Exit Setup?',
        'Do you want to cancel password setup and return to the login screen?',
        [
          { text: 'Stay Here', style: 'cancel' },
          {
            text: 'Return to Login',
            style: 'destructive',
            onPress: async () => {
              await signOut();
              router.replace('/login');
            },
          },
        ]
      );
      return true;
    });
    return () => sub.remove();
  }, [mustChangePassword, signOut, router]);

  const handleSave = async () => {
    if (saving) return;

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (!validation.isValid) {
      setError('Password must meet all security requirements.');
      return;
    }

    if (confirm && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await changePassword(password);
      Alert.alert('Password Created', 'Your account password has been set successfully.');
      
      const role = String(user?.role || '').trim().toLowerCase();
      const isAdmin = role === 'admin' || role === 'super_admin' || role === 'inst_admin';
      
      if (isAdmin) {
        router.replace('/(tabs)/admin');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e.message || 'Unable to update password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#070A13', '#0F172A', '#131C31']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={async () => {
            if (mustChangePassword) {
              await signOut();
              router.replace('/login');
            } else {
              router.back();
            }
          }}
          activeOpacity={0.8}
        >
          <Feather name={mustChangePassword ? "log-out" : "arrow-left"} size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Settings</Text>
        <TouchableOpacity
          style={styles.textBtn}
          onPress={async () => {
            await signOut();
            router.replace('/login');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.exitText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInUp.duration(500).springify()} style={styles.headerSection}>
        <View style={styles.badgeGlowRing} />
        <View style={styles.badge}>
          <Feather name="shield" size={26} color="#FFF" />
        </View>
        <Text style={styles.title}>{mustChangePassword ? 'Create Your Password' : 'Change Your Password'}</Text>
        <Text style={styles.subtitle}>
          {mustChangePassword 
            ? 'First-time login uses date of birth. Please update it now.' 
            : 'Enter a strong new password below to secure your credentials.'}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ flex: 1 }}>
        <GlassCard style={[styles.card, { shadowOpacity: 0, elevation: 0 }]}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="rgba(255,255,255,0.4)" />
              <TextInput
                placeholder="Enter new password"
                placeholderTextColor="rgba(255,255,255,0.2)"
                secureTextEntry={!showPassword}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                value={password}
                style={styles.input}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="rgba(255,255,255,0.4)" />
              <TextInput
                placeholder="Retype password"
                placeholderTextColor="rgba(255,255,255,0.2)"
                secureTextEntry={!showConfirm}
                onChangeText={(text) => {
                  setConfirm(text);
                  setError('');
                }}
                value={confirm}
                style={styles.input}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Feather name={showConfirm ? "eye" : "eye-off"} size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>
          </View>

          {password.length > 0 && (
            <View style={styles.strengthWrap}>
              <View style={styles.strengthHeader}>
                <Text style={styles.strengthLabel}>Complexity Score</Text>
                <Text style={[
                  styles.strengthText,
                  { color: validation.strength === 'strong' ? '#10B981' : validation.strength === 'medium' ? '#F59E0B' : '#EF4444' }
                ]}>
                  {validation.strength.toUpperCase()}
                </Text>
              </View>
              <View style={styles.strengthBarTrack}>
                <View 
                  style={[
                    styles.strengthBarFill, 
                    { 
                      width: `${(validation.score / 5) * 100}%`,
                      backgroundColor: validation.strength === 'strong' ? '#10B981' : validation.strength === 'medium' ? '#F59E0B' : '#EF4444'
                    }
                  ]} 
                />
              </View>
            </View>
          )}

          <View style={styles.rulesGrid}>
            {validation.rules.map((rule) => {
              const checked = (validation.checks as any)[rule.key];
              return (
                <View key={rule.key} style={[styles.ruleRow, checked && styles.ruleRowOk]}>
                  <Feather 
                    name={checked ? "check-circle" : "circle"} 
                    size={12} 
                    color={checked ? "#10B981" : "rgba(255,255,255,0.25)"} 
                  />
                  <Text style={[styles.ruleText, checked && styles.ruleTextOk]}>{rule.label}</Text>
                </View>
              );
            })}
          </View>

          {error ? (
            <Animated.View entering={FadeInUp} style={styles.errorBox}>
              <Feather name="alert-triangle" size={14} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          ) : null}

          <TouchableOpacity style={styles.cta} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.btnGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.ctaText}>Set Password & Continue</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#070A13' },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 30, marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  headerSection: { alignItems: 'center', marginBottom: 24, position: 'relative' },
  badgeGlowRing: { position: 'absolute', top: -3, width: 66, height: 66, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(59, 130, 246, 0.4)' },
  badge: { width: 60, height: 60, borderRadius: 18, backgroundColor: 'rgba(59, 130, 246, 0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)' },
  title: { fontSize: 20, fontWeight: '900', color: '#FFF', marginTop: 14, textAlign: 'center' },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6, textAlign: 'center', lineHeight: 18, paddingHorizontal: 16 },
  card: { padding: 20, gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  input: { flex: 1, marginLeft: 12, color: '#FFF', fontSize: 15, fontWeight: '500' },
  eyeBtn: { padding: 4 },
  strengthWrap: { gap: 6, marginVertical: 2 },
  strengthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  strengthLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' },
  strengthText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  strengthBarTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  strengthBarFill: { height: '100%', borderRadius: 2 },
  rulesGrid: { gap: 8, marginVertical: 4 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.6 },
  ruleRowOk: { opacity: 1 },
  ruleText: { fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  ruleTextOk: { color: '#10B981' },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.08)', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(239, 68, 68, 0.2)' },
  errorText: { color: '#FCA5A5', fontSize: 12, fontWeight: '600', flex: 1 },
  cta: { height: 52, borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#FFF', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  textBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  exitText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
});
