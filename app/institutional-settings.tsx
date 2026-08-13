import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function InstitutionalSettingsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [notifs, setNotifs] = useState(true);
  const [examAlerts, setExamAlerts] = useState(true);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Institutional Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Academic Notifications</Text>
              <Text style={styles.settingSub}>Get alerts for academic schedules and timetable</Text>
            </View>
            <Switch value={notifs} onValueChange={setNotifs} trackColor={{ true: COLORS.primary }} />
          </View>

          <View style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Examination Alerts</Text>
              <Text style={styles.settingSub}>Notifications for result publication</Text>
            </View>
            <Switch value={examAlerts} onValueChange={setExamAlerts} trackColor={{ true: COLORS.primary }} />
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Switch College', 'Contact administration to migrate your account to a different institution.')}>
             <Feather name="repeat" size={18} color="#F59E0B" />
             <Text style={[styles.actionText, { color: '#F59E0B' }]}>Switch College Identity</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.infoCard}>
           <Feather name="info" size={20} color={COLORS.primary} />
           <Text style={styles.infoText}>Institutional settings are managed by your campus administrator. Some options may be restricted.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  scroll: { padding: 24 },
  section: { backgroundColor: COLORS.card, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 20 },
  settingItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  settingLabel: { fontSize: 15, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  settingSub: { fontSize: 12, color: COLORS.textMuted },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  actionText: { fontWeight: '800', fontSize: 14 },
  infoCard: { flexDirection: 'row', gap: 12, marginTop: 24, padding: 16, backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.1)' },
  infoText: { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 18, fontWeight: '600' },
});
