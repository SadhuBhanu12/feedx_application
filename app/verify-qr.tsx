import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { verifyStudentFeedxId } from '@/services/supabaseService';
import { useUser } from '@/context/UserContext';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/ThemeContext';
import SuccessCheckmark from '@/components/ui/SuccessCheckmark';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/constants/motion';

type VerificationState = 'idle' | 'scanning' | 'verifying' | 'verified';

export default function VerifyQRScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors, isDark } = useTheme();
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user.id) {
      Alert.alert('Authentication Required', 'Please log in to verify student credentials.');
      router.replace('/login');
    }
  }, [user, router]);

  const [queryId, setQueryId] = useState(id || '');
  const [stage, setStage] = useState<VerificationState>('idle');
  const [studentInfo, setStudentInfo] = useState<any>(null);

  if (!user || !user.id) {
    return null;
  }

  const scanLinePos = useSharedValue(0);

  const handleVerify = async (idToTest?: string) => {
    const rawTarget = idToTest || queryId;
    const targetId = String(rawTarget || '').trim().replace(/[^a-zA-Z0-9_\-\.\@]/g, '');
    if (!targetId) {
      Alert.alert('Missing ID', 'Please enter a valid FEEDX ID or Roll Number to verify.');
      return;
    }

    setStudentInfo(null);
    setStage('scanning');

    // Start subtle scan line animation
    scanLinePos.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    try {
      // Step 1: Scanning phase (400ms)
      await new Promise((r) => setTimeout(r, 400));
      setStage('verifying');

      // Step 2: Query DB
      const res = await verifyStudentFeedxId(targetId);

      // Step 3: Complete verification with haptic confirmation
      await new Promise((r) => setTimeout(r, 300));
      setStudentInfo(res);
      setStage('verified');

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } catch {}
    } catch (e: any) {
      setStage('idle');
      Alert.alert('Verification Failed', e.message || 'Student identity record not found in database.');
    }
  };

  const scanLineAnimatedStyle = useAnimatedStyle(() => ({
    top: `${scanLinePos.value * 80}%`,
  }));

  const isLoading = stage === 'scanning' || stage === 'verifying';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0B0F19', '#0F172A', '#1E1B4B']} style={StyleSheet.absoluteFill} />}

      {/* Header */}
      <View style={[styles.topNav, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={() => router.back()} activeOpacity={0.8}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Identity Verification Desk</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Verification Input Card */}
        <GlassCard style={{ padding: 20, gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="qrcode-scan" size={22} color="#60A5FA" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: colors.textPrimary }}>Verify Student FEEDX ID</Text>
              <Text style={{ fontSize: 11.5, color: colors.textMuted }}>Instant institutional credential verification</Text>
            </View>
          </View>

          <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Feather name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Enter FEEDX ID (e.g. FEEDX-GPTE-CSE-21001)..."
              placeholderTextColor={colors.inputPlaceholder}
              value={queryId}
              onChangeText={setQueryId}
              autoCapitalize="characters"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity style={styles.verifyBtn} onPress={() => handleVerify()} disabled={isLoading} activeOpacity={0.85}>
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.verifyGradient}>
              {isLoading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator color="#FFF" size="small" />
                  <Text style={styles.verifyBtnText}>
                    {stage === 'scanning' ? 'Scanning QR Token...' : 'Verifying Credentials...'}
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Feather name="shield" size={18} color="#FFF" />
                  <Text style={styles.verifyBtnText}>Verify Identity Credentials</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>

        {/* Dynamic Status Indicator during Scan/Verify */}
        {isLoading && (
          <Animated.View entering={FadeInUp.duration(200)} style={[styles.statusBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.scanAnimationBox}>
              <MaterialCommunityIcons name="qrcode-scan" size={32} color="#60A5FA" />
              <Animated.View style={[styles.scanLaser, scanLineAnimatedStyle]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>
                {stage === 'scanning' ? '1. Scanning Student QR Code' : '2. Verifying Institutional Record'}
              </Text>
              <Text style={[styles.statusSub, { color: colors.textMuted }]}>
                {stage === 'scanning' ? 'Extracting institutional identity token' : 'Checking cryptographic signature with server'}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Verification Result Card */}
        {stage === 'verified' && studentInfo && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <GlassCard style={{ padding: 20, marginTop: 20, gap: 14, borderColor: '#10B981', borderWidth: 1.5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <SuccessCheckmark size={36} color="#10B981" />
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#10B981' }}>STUDENT VERIFIED</Text>
                    <Text style={{ fontSize: 11, color: colors.textMuted }}>Official credentials valid</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 10, fontWeight: '900', color: '#34D399' }}>ACTIVE ID</Text>
                </View>
              </View>

              <View style={{ gap: 8, marginTop: 4 }}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>STUDENT NAME:</Text>
                  <Text style={styles.infoValue}>{studentInfo.full_name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>FEEDX ID:</Text>
                  <Text style={[styles.infoValue, { color: '#60A5FA', fontWeight: '900' }]}>{studentInfo.feedx_id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>QUIZUE ID:</Text>
                  <Text style={[styles.infoValue, { color: '#FACC15', fontWeight: '800' }]}>{studentInfo.quizue_id || 'QUIZUE-VERIFIED'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ROLL NUMBER:</Text>
                  <Text style={styles.infoValue}>{studentInfo.roll_number}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>INSTITUTION:</Text>
                  <Text style={styles.infoValue}>{studentInfo.college_name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>BRANCH / SEM:</Text>
                  <Text style={styles.infoValue}>{studentInfo.branch_name} ({studentInfo.academic_year})</Text>
                </View>
              </View>

              <View style={{ marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Security Token: Authenticated</Text>
                <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Timestamp: {new Date(studentInfo.verified_at || Date.now()).toLocaleTimeString()}</Text>
              </View>
            </GlassCard>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  verifyBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  verifyGradient: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  statusBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  scanAnimationBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scanLaser: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: '#38BDF8',
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  statusSub: {
    fontSize: 10.5,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
  },
});
