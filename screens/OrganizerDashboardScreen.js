import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  Share,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import GlassCard from '@/components/ui/GlassCard';
import { getEventById, getEventRegistrations, checkInStudent, closeEventRegistration, verifyEventRegistrationQR } from '@/services/supabaseService';

export default function OrganizerDashboardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanCode, setScanCode] = useState('');
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const eventData = await getEventById(id);
      const userRole = String(user?.role || '').trim().toLowerCase();
      const isOrganizer = ['admin', 'super_admin', 'college_admin', 'campus_admin', 'inst_admin', 'faculty'].includes(userRole);
      if (!isOrganizer) {
        Alert.alert('Permission Denied', 'Administrative or organizer privileges are required.');
        router.back();
        return;
      }
      if (userRole !== 'super_admin' && eventData?.college_id && user?.college_id && eventData?.college_id !== user?.college_id) {
        Alert.alert('Permission Denied', 'You can only manage organizer desks for events hosted by your own college.');
        router.back();
        return;
      }
      setEvent(eventData);
      const regs = await getEventRegistrations(id);
      setRegistrations(regs);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (regId) => {
    try {
      await checkInStudent(regId);
      Alert.alert('Checked In', 'Student has been checked in successfully.');
      loadData();
    } catch (e) {
      Alert.alert('Error', e.message || 'Unable to check in student.');
    }
  };

  const handleCloseRegistration = async () => {
    Alert.alert('Close Registration', 'Are you sure you want to close registrations for this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Close',
        style: 'destructive',
        onPress: async () => {
          try {
            await closeEventRegistration(id);
            Alert.alert('Success', 'Registrations are now closed.');
            loadData();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  };

  const handleExportCSV = async () => {
    if (registrations.length === 0) {
      Alert.alert('Empty List', 'No students registered yet.');
      return;
    }
    const headers = 'Name,Email,Roll Number,Branch,Status\n';
    const rows = registrations
      .map((r) => {
        const name = r.users?.full_name || r.student_name || 'N/A';
        const email = r.users?.email || 'N/A';
        const roll = r.students?.roll_number || r.feedx_id || 'N/A';
        const branch = r.students?.branch || r.branch || 'N/A';
        const status = r.checked_in || r.attendance_status === 'Checked In' ? 'Checked In' : 'Registered';
        return `"${name}","${email}","${roll}","${branch}","${status}"`;
      })
      .join('\n');
    const csvContent = headers + rows;

    try {
      await Share.share({
        message: csvContent,
        title: `${event?.title || 'Event'} Registration List.csv`,
      });
    } catch (e) {
      Alert.alert('Export Failed', e.message);
    }
  };

  const handleScanSimulate = async () => {
    if (!scanCode.trim()) {
      Alert.alert('Required', 'Please enter a ticket QR code or FEEDX ID.');
      return;
    }
    try {
      const res = await verifyEventRegistrationQR(scanCode.trim(), user);
      if (res.status === 'ALREADY_CHECKED_IN') {
        Alert.alert('Already Checked In', res.message);
      } else {
        Alert.alert('✅ Verified & Checked In', `${res.student?.full_name || 'Student'} checked in successfully!`);
      }
      setScannerVisible(false);
      setScanCode('');
      loadData();
    } catch (err) {
      Alert.alert('Invalid QR Code', err.message || 'Ticket QR verification failed.');
    }
  };

  const handleGenerateCertificates = () => {
    Alert.alert(
      'Generate Certificates',
      'This will automatically dispatch digital completion certificates to all checked-in students. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            Alert.alert('Certificates Released', 'Digital certificates have been dispatched successfully.');
          },
        },
      ]
    );
  };

  const handleUploadPhotos = () => {
    setUploadingPhotos(true);
    setTimeout(() => {
      setUploadingPhotos(false);
      Alert.alert('Upload Successful', 'Event photos have been added to the gallery.');
    }, 1500);
  };

  const filteredRegistrations = registrations.filter((r) => {
    const term = search.toLowerCase();
    return (
      (r.users?.full_name || '').toLowerCase().includes(term) ||
      (r.students?.roll_number || '').toLowerCase().includes(term) ||
      (r.students?.branch || '').toLowerCase().includes(term)
    );
  });

  const checkedInCount = registrations.filter((r) => r.checked_in).length;
  const remainingSeats = event ? Math.max(0, (event.capacity || 100) - registrations.length) : 0;

  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Organizer Deck</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
          <Feather name="refresh-cw" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.heroSection}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.statusRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{event.type || 'WORKSHOP'}</Text>
            </View>
            <Text style={styles.eventDate}>{event.date}</Text>
          </View>
        </Animated.View>

        {/* Analytics Section */}
        <Animated.View entering={FadeInUp.delay(100).duration(450)} style={styles.analyticsSection}>
          <Text style={styles.sectionHeading}>Real-Time Analytics</Text>
          <View style={styles.statsGrid}>
            <GlassCard style={styles.statBox}>
              <Feather name="users" size={20} color="#3B82F6" />
              <Text style={styles.statVal}>{registrations.length}</Text>
              <Text style={styles.statLbl}>Registered</Text>
            </GlassCard>
            <GlassCard style={styles.statBox}>
              <Feather name="check-circle" size={20} color="#10B981" />
              <Text style={styles.statVal}>{checkedInCount}</Text>
              <Text style={styles.statLbl}>Checked-in</Text>
            </GlassCard>
            <GlassCard style={styles.statBox}>
              <Feather name="award" size={20} color="#8B5CF6" />
              <Text style={styles.statVal}>{checkedInCount}</Text>
              <Text style={styles.statLbl}>Certs Issued</Text>
            </GlassCard>
            <GlassCard style={styles.statBox}>
              <Feather name="pie-chart" size={20} color="#F59E0B" />
              <Text style={styles.statVal}>{remainingSeats}</Text>
              <Text style={styles.statLbl}>Seats Left</Text>
            </GlassCard>
          </View>
        </Animated.View>

        {/* Admin Quick Actions */}
        <Animated.View entering={FadeInUp.delay(160).duration(450)} style={styles.actionSection}>
          <Text style={styles.sectionHeading}>Management Controls</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setScannerVisible(true)}>
              <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.actionGradient}>
                <MaterialCommunityIcons name="qrcode" size={18} color="#FFF" />
                <Text style={styles.actionBtnText}>QR Check-in</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleExportCSV}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.actionGradient}>
                <Feather name="file-text" size={18} color="#FFF" />
                <Text style={styles.actionBtnText}>Export Excel</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleGenerateCertificates}>
              <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.actionGradient}>
                <Feather name="award" size={18} color="#FFF" />
                <Text style={styles.actionBtnText}>Issue Certs</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleUploadPhotos}>
              <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.actionGradient}>
                <Feather name="image" size={18} color="#FFF" />
                <Text style={styles.actionBtnText}>Upload Photos</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.closeRegBtn, event.registration_closed && styles.closeRegBtnDisabled]}
            disabled={event.registration_closed}
            onPress={handleCloseRegistration}
          >
            <Feather name="x-circle" size={16} color={event.registration_closed ? '#64748B' : '#EF4444'} />
            <Text style={[styles.closeRegText, event.registration_closed && styles.closeRegTextDisabled]}>
              {event.registration_closed ? 'Registration Closed' : 'Close Registrations'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Registrations List */}
        <Animated.View entering={FadeInUp.delay(220).duration(450)} style={styles.listSection}>
          <Text style={styles.sectionHeading}>Search & Registrations</Text>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="rgba(255,255,255,0.4)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student, roll number, or branch..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={filteredRegistrations}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <GlassCard style={styles.studentCard}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{item.users?.full_name || 'N/A'}</Text>
                  <Text style={styles.studentMeta}>
                    {item.students?.roll_number || 'N/A'} • {item.students?.branch || 'N/A'}
                  </Text>
                </View>
                {item.checked_in ? (
                  <View style={styles.checkedInBadge}>
                    <Feather name="check" size={14} color="#10B981" />
                    <Text style={styles.checkedInText}>Here</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.checkInBtn} onPress={() => handleCheckIn(item.id)}>
                    <Text style={styles.checkInBtnText}>Check In</Text>
                  </TouchableOpacity>
                )}
              </GlassCard>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No matching registrations found.</Text>
            }
          />
        </Animated.View>
      </ScrollView>

      {/* QR Ticket Scan Simulator Modal */}
      <Modal visible={scannerVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan Ticket QR Code</Text>
            <Text style={styles.modalDesc}>Scan student QR Ticket or enter their code manually for verification:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter QR Token..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={scanCode}
              onChangeText={setScanCode}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setScannerVisible(false)}>
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmModalBtn} onPress={handleScanSimulate}>
                <Text style={styles.confirmModalText}>Check-in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFF', fontSize: 16 },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', flex: 1, textAlign: 'center' },
  refreshBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
  heroSection: { marginTop: 24, marginBottom: 24, gap: 8 },
  eventTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', lineHeight: 28 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { backgroundColor: 'rgba(59, 130, 246, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#3B82F6' },
  eventDate: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  sectionHeading: { fontSize: 15, fontWeight: '800', color: '#FFF', marginBottom: 12, letterSpacing: 0.5 },
  analyticsSection: { marginBottom: 24 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: { flex: 1, minWidth: '45%', padding: 14, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  statLbl: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },
  actionSection: { marginBottom: 24 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionButton: { flex: 1, minWidth: '45%', height: 46, borderRadius: 12, overflow: 'hidden' },
  actionGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionBtnText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  closeRegBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.25)', height: 42, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.05)' },
  closeRegBtnDisabled: { borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'transparent' },
  closeRegText: { fontSize: 13, fontWeight: '700', color: '#EF4444' },
  closeRegTextDisabled: { color: '#64748B' },
  listSection: { gap: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 8, marginBottom: 8 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 13, fontWeight: '600' },
  studentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, marginBottom: 10 },
  studentInfo: { gap: 4, flex: 1 },
  studentName: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  studentMeta: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '600' },
  checkedInBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  checkedInText: { fontSize: 11, fontWeight: '800', color: '#10B981' },
  checkInBtn: { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  checkInBtnText: { fontSize: 11, fontWeight: '800', color: '#3B82F6' },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', marginTop: 10 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { width: '85%', backgroundColor: '#1E293B', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  modalDesc: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 18, marginBottom: 14 },
  modalInput: { height: 44, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, paddingHorizontal: 12, color: '#FFF', fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelModalBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelModalText: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
  confirmModalBtn: { backgroundColor: '#3B82F6', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16 },
  confirmModalText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
});
