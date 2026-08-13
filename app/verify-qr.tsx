import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyStudentFeedxId } from '@/services/supabaseService';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/ThemeContext';

export default function VerifyQRScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors, isDark } = useTheme();

  const [queryId, setQueryId] = useState(id || '');
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  const handleVerify = async (idToTest?: string) => {
    const targetId = idToTest || queryId;
    if (!targetId.trim()) {
      Alert.alert('Missing ID', 'Please enter a FEEDX ID or Roll Number to verify.');
      return;
    }

    setLoading(true);
    setStudentInfo(null);
    try {
      const res = await verifyStudentFeedxId(targetId);
      setStudentInfo(res);
    } catch (e: any) {
      Alert.alert('Verification Failed', e.message || 'Student identity record not found in database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0B0F19', '#0F172A', '#1E1B4B']} style={StyleSheet.absoluteFillObject} />}

      {/* Header */}
      <View style={[styles.topNav, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={() => router.back()}>
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
            />
          </View>

          <TouchableOpacity style={styles.verifyBtn} onPress={() => handleVerify()} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.verifyGradient}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Feather name="shield" size={18} color="#FFF" />
                  <Text style={styles.verifyBtnText}>Verify Identity Credentials</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>

        {/* Verification Result Card */}
        {studentInfo && (
          <GlassCard style={{ padding: 20, marginTop: 20, gap: 14, borderColor: '#10B981', borderWidth: 1.5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="check-circle" size={22} color="#10B981" />
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#10B981' }}>IDENTITY VERIFIED</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '900', color: '#34D399' }}>VALID STUDENT</Text>
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
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Timestamp: {new Date(studentInfo.verified_at).toLocaleTimeString()}</Text>
            </View>
          </GlassCard>
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
