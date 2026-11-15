import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const PLANNED_FEATURES = [
  { title: 'Daily Class Schedule', desc: 'View your scheduled classes and periods day-by-day.' },
  { title: 'Subject Timings', desc: 'Know when each subject session starts and ends.' },
  { title: 'Classroom Information', desc: 'Get room numbers and class locations for offline classes.' },
  { title: 'Faculty Details', desc: 'Access instructor names and information directly.' },
  { title: 'Timetable Notifications', desc: 'Receive reminders 10 minutes before class begins.' },
  { title: 'Exam Schedule Integration', desc: 'Sync mid-sem and end-sem exam dates directly into your calendar.' },
  { title: 'Automatic Schedule Updates', desc: 'Instant updates on cancellations or rescheduled periods.' }
];

export default function TimetableScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Class Timetable</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>Manage your daily schedule</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.comingSoonWrapper}>
          <View style={[styles.comingSoonCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }]}>
            <View style={styles.comingSoonHeader}>
              <View style={[styles.iconGlow, { backgroundColor: colors.inputBg }]}>
                <MaterialCommunityIcons name="clock-outline" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.comingSoonTitle, { color: colors.textPrimary }]}>Smart Timetable</Text>
              <Text style={[styles.comingSoonSub, { color: colors.textSecondary }]}>We are building a smart, interactive timetable to organize your academics.</Text>
            </View>
            
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Planned Features</Text>

            <View style={styles.featureList}>
              {PLANNED_FEATURES.map((feature, idx) => (
                <View key={idx} style={[styles.featureItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderColor: colors.border, borderWidth: 1 }]}>
                  <View style={[styles.featureIconWrap, { backgroundColor: colors.inputBg }]}>
                    <Feather name="check" size={14} color={colors.primary} />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{feature.title}</Text>
                    <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feature.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.noticeBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)' }]}>
              <Feather name="info" size={18} color="#F59E0B" />
              <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
                No server requests or database logs are active yet. Ask your class coordinator for updates in the meantime!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  comingSoonWrapper: {
    width: '100%',
  },
  comingSoonCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  comingSoonHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconGlow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 6,
  },
  comingSoonSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  featureList: {
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  featureIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.1)',
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },
});