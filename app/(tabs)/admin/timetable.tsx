import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useUser } from '@/context/UserContext';

const TIMETABLE_FEATURES = [
  {
    id: '1',
    title: 'AI-Powered Class Schedule Generator',
    description: 'Automated timetable generation that eliminates faculty conflicts and optimizes room allocations across all branches.',
    badge: 'IN DEVELOPMENT',
    badgeColor: '#F59E0B',
    icon: 'robot-industrial',
    highlights: ['Zero-conflict slot allocation', 'Smart room & lab assignment', '1-click full semester schedule creation']
  },
  {
    id: '2',
    title: 'Substitute Teacher Allocation Engine',
    description: '1-tap emergency substitute assignment when a faculty member takes leave, with automatic push notifications to students.',
    badge: 'TESTING PHASE',
    badgeColor: '#3B82F6',
    icon: 'account-switch',
    highlights: ['Real-time free faculty matching', 'Instant student push alerts', 'Automated period logs']
  },
  {
    id: '3',
    title: 'Live Class Status & Room Swapping',
    description: 'Dynamic room re-assignment and live class status tracking (On Time, Delayed, Cancelled, Moved to Lab).',
    badge: 'PLANNED',
    badgeColor: '#A855F7',
    icon: 'map-marker-path',
    highlights: ['Live classroom tracking', 'Lab vs Lecture mode toggle', 'Emergency class cancellation broadcast']
  },
  {
    id: '4',
    title: 'Google & iOS Calendar Integration',
    description: 'Students and faculty can synchronize their daily timetable directly to Google Calendar, Apple Calendar, and Outlook.',
    badge: 'PLANNED',
    badgeColor: '#10B981',
    icon: 'calendar-sync',
    highlights: ['Auto-sync on timetable update', 'Custom reminder alerts', 'Offline widget support']
  }
];

export default function AdminTimetableScreen() {
  const router = useRouter();
  const { user } = useUser();
  const activeTab = 'timetable';
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      Alert.alert('Permission Denied', 'Academic Roadmap is reserved for Super Administrators.');
      router.replace('/(tabs)/admin');
    }
  }, [user]);

  const features = TIMETABLE_FEATURES;

  const handleNotifyToggle = () => {
    setNotified(!notified);
    Alert.alert(
      !notified ? 'Notification Registered' : 'Preference Updated',
      !notified 
        ? 'You will be notified via admin push notifications as soon as Academic Timetables v3.5 launches!' 
        : 'Update notifications disabled.'
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={styles.badgeRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.badgeText}>FEATURE IN DEVELOPMENT • NEXT UPDATE v3.5</Text>
          </View>
          <Text style={styles.headerTitle}>Academic Roadmap</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(450)} style={styles.heroCard}>
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.15)', 'rgba(15, 23, 42, 0.8)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroIconBox}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={36}
                color="#10B981"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Academic Timetables Module</Text>
              <Text style={styles.heroSub}>
                Next-generation AI timetable engine designed for seamless schedule management across all departments.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Roadmap Features Section */}
        <Text style={styles.sectionHeaderTitle}>FEATURES ARRIVING IN NEXT UPDATE</Text>

        {features.map((item, idx) => (
          <Animated.View
            key={item.id}
            entering={FadeInUp.delay(150 + idx * 80).duration(400)}
            style={styles.featureCard}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: item.badgeColor + '20' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={22} color={item.badgeColor} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: item.badgeColor + '25', borderColor: item.badgeColor + '50' }]}>
                    <Text style={[styles.statusBadgeText, { color: item.badgeColor }]}>{item.badge}</Text>
                  </View>
                </View>
                <Text style={styles.featureDescription}>{item.description}</Text>
              </View>
            </View>

            <View style={styles.highlightContainer}>
              {item.highlights.map((h, hIdx) => (
                <View key={hIdx} style={styles.highlightItem}>
                  <Feather name="check-circle" size={13} color="#10B981" />
                  <Text style={styles.highlightText}>{h}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Notify Me Button */}
        <TouchableOpacity style={styles.notifyBtn} onPress={handleNotifyToggle}>
          <LinearGradient colors={notified ? ['#10B981', '#059669'] : ['#3B82F6', '#2563EB']} style={styles.notifyGradient}>
            <Feather name={notified ? 'check' : 'bell'} size={18} color="#FFF" />
            <Text style={styles.notifyBtnText}>
              {notified ? 'NOTIFICATIONS ACTIVE FOR RELEASE' : 'NOTIFY ME ON v3.5 LAUNCH'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B' },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#F59E0B', letterSpacing: 0.8 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 120 },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabBtnActive: { backgroundColor: 'rgba(255,255,255,0.08)' },
  tabBtnText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  tabBtnTextActive: { color: '#FFF', fontWeight: '900' },

  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroGradient: { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontSize: 17, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 17 },

  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1.2,
    marginBottom: 16,
  },

  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardHeader: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  featureTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: '#FFF' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  statusBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  featureDescription: { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 17 },

  highlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  highlightItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  highlightText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  notifyBtn: { marginTop: 12, borderRadius: 16, overflow: 'hidden' },
  notifyGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  notifyBtnText: { color: '#FFF', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
});
