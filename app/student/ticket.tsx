import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { getUserEventRegistration, getEventById } from '@/services/supabaseService';
import { useUser } from '@/context/UserContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TicketScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const { user } = useUser();
  const [event, setEvent] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadTicket = React.useCallback(async () => {
    try {
      setLoading(true);
      const ev = await getEventById(eventId as string);
      const reg = await getUserEventRegistration(eventId as string, user?.id);
      
      if (!reg) {
        Alert.alert('Not Found', 'You are not registered for this event.');
        router.back();
        return;
      }
      
      setEvent(ev);
      setRegistration(reg);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load ticket.');
    } finally {
      setLoading(false);
    }
  }, [eventId, user?.id, router]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const isVerified = registration?.verified || registration?.checked_in || registration?.attendance === 'Present' || registration?.attendance_status === 'present';
  const eventDateStr = event?.event_date || event?.date ? new Date(event?.event_date || event?.date).toDateString() : 'TBA';
  const qrCodeValue = registration?.feedx_id || registration?.event_qr || registration?.qr_token || `FEEDX-TG-26-${user?.id?.substring(0,6).toUpperCase() || 'STUDENT'}`;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0B0F19', '#000000']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entry Ticket</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View entering={FadeInDown.duration(500)} style={styles.ticketWrap}>
        <BlurView intensity={30} tint="dark" style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Text style={styles.eventTitle}>{event?.title || 'Event Ticket'}</Text>
            <Text style={styles.eventVenue}>{eventDateStr} {event?.time ? `@ ${event?.time}` : ''} ({event?.venue || 'TBA'})</Text>
          </View>
          
          <View style={styles.divider}>
            <View style={[styles.cutout, { left: -16 }]} />
            <View style={styles.dashedLine} />
            <View style={[styles.cutout, { right: -16 }]} />
          </View>

          <View style={styles.qrContainer}>
            {isVerified ? (
              <View style={styles.verifiedBox}>
                <Feather name="check-circle" size={64} color="#10B981" />
                <Text style={styles.verifiedText}>Checked In</Text>
                <Text style={styles.verifiedTime}>{new Date(registration?.verified_at || registration?.updated_at || Date.now()).toLocaleTimeString()}</Text>
              </View>
            ) : (
              <View style={styles.qrWrapper}>
                <QRCode
                  value={qrCodeValue}
                  size={200}
                  color="#000"
                  backgroundColor="#FFF"
                  logoSize={40}
                />
              </View>
            )}
            
            <Text style={styles.regNumber}>{registration?.registration_number || 'REG-1234'}</Text>
            <Text style={styles.hint}>
              {isVerified ? 'You have successfully attended this event.' : 'Present this QR code at the entrance.'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Registration</Text>
              <Text style={styles.statusValue}>{registration?.status || 'Confirmed'}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Certificate</Text>
              <Text style={[styles.statusValue, { color: '#F59E0B' }]}>{registration?.certificate_status || 'Pending'}</Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {!isVerified && (
        <TouchableOpacity style={styles.refreshBtn} onPress={loadTicket}>
          <Feather name="refresh-cw" size={16} color="#FFF" />
          <Text style={styles.refreshText}>Refresh Status</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, zIndex: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  
  ticketWrap: { paddingHorizontal: 24, marginTop: 40 },
  ticketCard: { borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  ticketHeader: { padding: 24, alignItems: 'center' },
  eventTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  eventVenue: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600', textAlign: 'center' },
  
  divider: { height: 32, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  cutout: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#000', position: 'absolute' },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed', marginHorizontal: 24 },
  
  qrContainer: { padding: 24, alignItems: 'center' },
  qrWrapper: { padding: 16, backgroundColor: '#FFF', borderRadius: 16, marginBottom: 16 },
  verifiedBox: { width: 200, height: 200, borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: 'rgba(16, 185, 129, 0.3)' },
  verifiedText: { fontSize: 20, fontWeight: '900', color: '#10B981', marginTop: 12 },
  verifiedTime: { fontSize: 13, color: 'rgba(16, 185, 129, 0.7)', fontWeight: '600', marginTop: 4 },
  regNumber: { fontSize: 24, fontWeight: '900', color: '#8B5CF6', letterSpacing: 2 },
  hint: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8, textAlign: 'center' },
  
  statusRow: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', padding: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  statusItem: { flex: 1, alignItems: 'center' },
  statusLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: '800', marginBottom: 4 },
  statusValue: { fontSize: 14, color: '#FFF', fontWeight: '700' },
  
  refreshBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'center', marginTop: 30, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  refreshText: { color: '#FFF', fontSize: 14, fontWeight: '700' }
});
