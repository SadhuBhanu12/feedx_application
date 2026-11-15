import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { adminListEvents, adminDeleteEvent, getEventAnalytics } from '@/services/supabaseService';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

export default function SuperAdminEventsDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Analytics
  const [analytics, setAnalytics] = useState({
    total: 0,
    live: 0,
    completed: 0,
    totalRegistrations: 0,
  });

  const loadData = async () => {
    try {
      // If user is inst_admin, restrict to their college, else super_admin gets all.
      const collegeId = user?.role === 'inst_admin' ? user?.college_id : null;
      const data = await adminListEvents(collegeId);
      setEvents(data || []);
      
      let regs = 0;
      let live = 0;
      let comp = 0;
      
      // Calculate basic stats and fetch deep analytics in parallel
      const enrichedEvents = await Promise.all(data.map(async (ev) => {
        if (ev.status === 'Published') live++;
        if (ev.status === 'Closed') comp++;
        
        try {
          const stats = await getEventAnalytics(ev.id);
          regs += stats.totalRegistrations;
          return { ...ev, stats };
        } catch (e) {
          return { ...ev, stats: { totalRegistrations: 0, present: 0, absent: 0 } };
        }
      }));
      
      setEvents(enrichedEvents);
      setAnalytics({
        total: data.length,
        live,
        completed: comp,
        totalRegistrations: regs
      });
      
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to load events.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const channelId = `events-sa-realtime-${Date.now()}`;
    const channel = supabase.channel(channelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations' }, () => loadData())
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Delete Event', `Are you sure you want to delete "${title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await adminDeleteEvent(id);
          Alert.alert('Success', 'Event deleted.');
          loadData();
        } catch (err: any) {
          Alert.alert('Error', err.message);
        }
      }}
    ]);
  };

  const renderEventItem = ({ item, index }: any) => {
    const isLive = item.status === 'Published';
    
    return (
      <Animated.View entering={FadeInDown.delay(index * 100).duration(400)} style={styles.eventCard}>
        <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                  <Text style={[styles.statusText, { color: isLive ? '#10B981' : '#EF4444' }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.eventSub}>{new Date(item.date).toDateString()} | {item.time || 'TBA'} | {item.venue}</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{item.stats?.totalRegistrations || 0}</Text>
              <Text style={styles.statLbl}>Registrations</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{item.stats?.present || 0}</Text>
              <Text style={styles.statLbl}>Verified</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{item.max_participants || '∞'}</Text>
              <Text style={styles.statLbl}>Capacity</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/super-admin/events/scanner?eventId=${item.id}`)}>
              <MaterialCommunityIcons name="qrcode-scan" size={16} color="#3B82F6" />
              <Text style={[styles.actionText, { color: '#3B82F6' }]}>Scan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/super-admin/events/create?id=${item.id}`)}>
              <Feather name="edit-2" size={16} color="#FFF" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>

            {item.status === 'Draft' ? (
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }]} 
                onPress={async () => {
                  try {
                    const { error } = await supabase.from('events').update({ status: 'Published' }).eq('id', item.id);
                    if (error) throw error;
                    Alert.alert('Published', 'Event is now visible to students!');
                    loadData();
                  } catch (e: any) { Alert.alert('Error', e.message); }
                }}
              >
                <Feather name="check" size={16} color="#10B981" />
                <Text style={[styles.actionText, { color: '#10B981' }]}>Publish</Text>
              </TouchableOpacity>
            ) : item.status === 'Published' ? (
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }]} 
                onPress={async () => {
                  try {
                    const { error } = await supabase.from('events').update({ status: 'Closed' }).eq('id', item.id);
                    if (error) throw error;
                    Alert.alert('Closed', 'Registrations closed.');
                    loadData();
                  } catch (e: any) { Alert.alert('Error', e.message); }
                }}
              >
                <Feather name="x" size={16} color="#F59E0B" />
                <Text style={[styles.actionText, { color: '#F59E0B' }]}>Close</Text>
              </TouchableOpacity>
            ) : null}
            
            <TouchableOpacity style={[styles.actionBtn, { borderColor: 'rgba(239, 68, 68, 0.3)', flex: 0, width: 40 }]} onPress={() => handleDelete(item.id, item.title)}>
              <Feather name="trash-2" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0B0F19', '#020408']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Hub</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/super-admin/events/create')}>
          <Feather name="plus" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryVal}>{analytics.live}</Text>
          <Text style={styles.summaryLbl}>Live Events</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryVal}>{analytics.totalRegistrations}</Text>
          <Text style={styles.summaryLbl}>Total Registered</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryVal}>{analytics.total}</Text>
          <Text style={styles.summaryLbl}>All Events</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#FFF" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="calendar" size={48} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyTitle}>No Events Found</Text>
              <Text style={styles.emptyDesc}>Click the + button to create a new event.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  createBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  
  summaryGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  summaryBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  summaryVal: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  summaryLbl: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase' },

  listContent: { paddingHorizontal: 20, paddingBottom: 100, gap: 16 },
  eventCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardBlur: { padding: 16 },
  cardHeader: { marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 },
  eventTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  eventSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 12, marginBottom: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  statLbl: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, textTransform: 'uppercase' },
  
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  actionText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 8 }
});
