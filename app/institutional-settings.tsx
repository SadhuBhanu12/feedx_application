import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function InstitutionalSettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useUser();
  const { colors, isDark } = useTheme();
  const [notifs, setNotifs] = useState(true);
  const [examAlerts, setExamAlerts] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#020617' : '#F8FAFC' }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}
      
      <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0' }]}>
        <TouchableOpacity 
          style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF', borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]} 
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Institutional Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Appearance / Theme Toggle */}
        <Animated.View entering={FadeInDown.duration(400)} style={{ marginBottom: 20 }}>
          <ThemeToggle />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(60)} style={[styles.section, { backgroundColor: colors.card, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0' }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>PREFERENCES</Text>
          
          <View style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Academic Notifications</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>Get alerts for academic schedules and timetable</Text>
            </View>
            <Switch value={notifs} onValueChange={setNotifs} trackColor={{ true: '#2563EB' }} />
          </View>

          <View style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Examination Alerts</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>Notifications for result publication</Text>
            </View>
            <Switch value={examAlerts} onValueChange={setExamAlerts} trackColor={{ true: '#2563EB' }} />
          </View>

          <TouchableOpacity style={[styles.actionBtn, { borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }]} onPress={() => Alert.alert('Switch College', 'Contact administration to migrate your account to a different institution.')}>
             <Feather name="repeat" size={18} color="#F59E0B" />
             <Text style={[styles.actionText, { color: '#F59E0B' }]}>Switch College Identity</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ACCOUNT & PRIVACY SECTION */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={[styles.section, { backgroundColor: colors.card, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0', marginTop: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ACCOUNT & PRIVACY</Text>
          
          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/profile-edit')} activeOpacity={0.7}>
            <Feather name="user" size={17} color={colors.textSecondary} />
            <Text style={[styles.actionRowText, { color: colors.textPrimary }]}>Edit Personal Info</Text>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/change-password')} activeOpacity={0.7}>
            <Feather name="shield" size={17} color={colors.textSecondary} />
            <Text style={[styles.actionRowText, { color: colors.textPrimary }]}>Security & Password</Text>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/report-bug')} activeOpacity={0.7}>
            <Feather name="alert-triangle" size={17} color={colors.textSecondary} />
            <Text style={[styles.actionRowText, { color: colors.textPrimary }]}>Report a Bug</Text>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push({ pathname: '/terms-conditions', params: { viewOnly: 'true' } })} activeOpacity={0.7}>
            <Feather name="file-text" size={17} color={colors.textSecondary} />
            <Text style={[styles.actionRowText, { color: colors.textPrimary }]}>Terms & Conditions</Text>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => Alert.alert('Privacy Policy', 'Your student details are encrypted and stored securely within Supabase.')} activeOpacity={0.7}>
            <Feather name="lock" size={17} color={colors.textSecondary} />
            <Text style={[styles.actionRowText, { color: colors.textPrimary }]}>Privacy Policy</Text>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/about-feedx')} activeOpacity={0.7}>
            <Feather name="info" size={17} color={colors.textSecondary} />
            <Text style={[styles.actionRowText, { color: colors.textPrimary }]}>About FEEDX</Text>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionRow, { borderBottomWidth: 0 }]} 
            onPress={() => {
              Alert.alert('Sign Out', 'Are you sure you want to log out of FEEDX?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Logout',
                  style: 'destructive',
                  onPress: async () => {
                    await signOut?.();
                    router.replace('/login');
                  },
                },
              ]);
            }} 
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={17} color="#EF4444" />
            <Text style={[styles.actionRowText, { color: '#EF4444' }]}>Sign Out</Text>
            <Feather name="chevron-right" size={16} color="#EF4444" />
          </TouchableOpacity>
        </Animated.View>

        <View style={[styles.infoCard, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.05)' : '#EFF6FF', borderColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.2)' }]}>
           <Feather name="info" size={18} color="#2563EB" />
           <Text style={[styles.infoText, { color: isDark ? 'rgba(255,255,255,0.5)' : '#1E40AF' }]}>
             Institutional settings are managed in conjunction with your campus authority.
           </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: 52, 
    paddingHorizontal: 16, 
    paddingBottom: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scroll: { padding: 16, paddingBottom: 60 },
  section: { 
    borderRadius: 20, 
    padding: 18, 
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 10.5, fontWeight: '900', letterSpacing: 1.2, marginBottom: 16 },
  settingItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  settingLabel: { fontSize: 14.5, fontWeight: '700', marginBottom: 2 },
  settingSub: { fontSize: 11.5 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, paddingTop: 14, borderTopWidth: 1 },
  actionText: { fontWeight: '800', fontSize: 13.5 },
  infoCard: { flexDirection: 'row', gap: 10, marginTop: 16, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  infoText: { flex: 1, fontSize: 11.5, lineHeight: 17, fontWeight: '600' },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  actionRowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 12,
  },
});
