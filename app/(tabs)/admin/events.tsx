import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal, Pressable, Dimensions } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  event_date?: string;
  location?: string;
  venue?: string;
  category: string;
  image_url: string;
  price?: number | string;
  type?: string;
}

export default function AdminEventsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [form, setForm] = useState({ 
    id: '', title: '', description: '', date: '', 
    location: '', category: 'Workshop', image_url: '', price: '0'
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const loadItems = async () => {
    setLoading(true);
    try {
      let query = supabase.from('events').select('*');
      if (user?.college_id) {
        query = query.eq('college_id', user.college_id);
      }
      const { data, error } = await query.order('date');
      if (error) throw error;
      setItems(data || []);
    } catch (e: any) {
      console.log('Events load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();

    // Subscribe to events table changes in real-time
    const channel = supabase.channel(`admin-events-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          loadItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.college_id]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.date.trim()) {
      Alert.alert('Required', 'Title and Date are mandatory.');
      return;
    }
    setSyncing(true);
    try {
      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date.trim(),
        event_date: form.date.trim(),
        venue: form.location.trim(),
        location: 'Offline',
        category: form.category.trim(),
        price: form.price && !isNaN(Number(form.price)) ? parseFloat(form.price) : 0,
        college_id: user?.college_id || null,
        created_by: user?.id,
        created_by_role: user?.role || 'admin',
        status: 'Published'
      };
      if (form.id) {
        payload.id = form.id;
      }

      const { error } = await supabase.from('events').upsert(payload);
      if (error) throw error;
      
      Alert.alert('Success', 'Event published to student feed.');
      setForm({ id: '', title: '', description: '', date: '', location: '', category: 'Workshop', image_url: '', price: '0' });
      loadItems();
    } catch (e: any) {
      Alert.alert('Sync Error', e.message || String(e));
    } finally {
      setSyncing(false);
    }
  };

  const setFromRow = (item: EventItem) => {
    setForm({
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      date: item.event_date || item.date || '',
      location: item.venue || item.location || '',
      category: item.category || 'Workshop',
      image_url: item.image_url || '',
      price: String(item.price || '0')
    });
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Event?', 'This will remove it from students.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) Alert.alert('Error', error.message);
        loadItems();
      }},
    ]);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const formatSelectedDate = (day: number) => {
    const y = calendarMonth.getFullYear();
    const m = String(calendarMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E293B']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
           <Feather name="chevron-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Campus Events</Text>
          <Text style={styles.headerSubtitle}>Manage Workshops & Fests</Text>
        </View>
      </View>
 
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadItems}
        ListHeaderComponent={
          <Animated.View entering={FadeInDown} style={styles.headerContent}>
            <BlurView intensity={10} tint="light" style={styles.card}>
              <Text style={styles.sectionTitle}>Event Composer</Text>
              
              <View style={styles.field}>
                <Text style={styles.label}>Event Title</Text>
                <TextInput style={styles.input} value={form.title} onChangeText={t => setForm(f => ({ ...f, title: t }))} placeholder="e.g. Annual Tech Fest" placeholderTextColor="rgba(255,255,255,0.3)" />
              </View>
 
              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>
                <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]} value={form.description} onChangeText={t => setForm(f => ({ ...f, description: t }))} placeholder="Event details..." placeholderTextColor="rgba(255,255,255,0.3)" multiline />
              </View>
 
              <View style={styles.inputGrid}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Date</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => setShowCalendar(true)} style={styles.dateSelectorInput}>
                    <Text style={[styles.dateSelectorText, !form.date && styles.datePlaceholderText]}>
                      {form.date || 'Select Date'}
                    </Text>
                    <Feather name="calendar" size={16} color="rgba(255,255,255,0.4)" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Entry Fee (₹)</Text>
                  <TextInput style={styles.input} value={form.price} onChangeText={t => setForm(f => ({ ...f, price: t }))} placeholder="0" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
                </View>
              </View>
 
              <View style={styles.field}>
                <Text style={styles.label}>Location / Venue</Text>
                <TextInput style={styles.input} value={form.location} onChangeText={t => setForm(f => ({ ...f, location: t }))} placeholder="Main Seminar Hall" placeholderTextColor="rgba(255,255,255,0.3)" />
              </View>
 
              <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={syncing}>
                <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.buttonGradient}>
                   {syncing ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.primaryButtonText}>Publish Event</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
 
            <Text style={styles.listTitle}>Live Events</Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 100)} style={styles.itemCardContainer}>
            <BlurView intensity={8} tint="light" style={styles.itemCard}>
              <View style={styles.itemMain}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMeta}>{item.event_date || item.date} • {item.venue || item.location}</Text>
                <Text style={styles.priceTag}>Entry: {item.price && Number(item.price) > 0 ? `₹${item.price}` : 'Free'}</Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]} onPress={() => router.push(`/super-admin/events/scanner?eventId=${item.id}`)}>
                   <MaterialCommunityIcons name="qrcode-scan" size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setFromRow(item)}>
                   <Feather name="edit-3" size={16} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} onPress={() => handleDelete(item.id)}>
                   <Feather name="trash-2" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Calendar Picker Modal */}
      <Modal visible={showCalendar} transparent animationType="fade" onRequestClose={() => setShowCalendar(false)}>
        <BlurView intensity={30} style={StyleSheet.absoluteFillObject} tint="dark">
          <Pressable style={styles.modalOverlay} onPress={() => setShowCalendar(false)}>
            <Animated.View entering={FadeInDown.springify()} style={styles.calendarModal}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.calNavBtn}>
                  <Feather name="chevron-left" size={18} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.calendarMonthTitle}>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.calNavBtn}>
                  <Feather name="chevron-right" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.weekdaysRow}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
                  <Text key={idx} style={styles.weekdayLabel}>{day}</Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {getDaysInMonth(calendarMonth).map((day, idx) => {
                  if (day === null) {
                    return <View key={`empty-${idx}`} style={styles.emptyDayCell} />;
                  }
                  
                  const isSelected = form.date === formatSelectedDate(day);
                  
                  return (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                      onPress={() => {
                        setForm(f => ({ ...f, date: formatSelectedDate(day) }));
                        setShowCalendar(false);
                      }}
                    >
                      <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          </Pressable>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 },
  headerContent: { padding: 20 },
  card: { padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  input: { height: 48, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  inputGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  inputWrapper: { flex: 1 },
  primaryButton: { height: 52, borderRadius: 16, overflow: 'hidden', marginTop: 10 },
  buttonGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  listTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', marginTop: 32, marginBottom: 8, marginLeft: 4 },
  listContent: { paddingBottom: 120 },
  itemCardContainer: { marginHorizontal: 20, marginBottom: 12, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  itemCard: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  itemMain: { flex: 1 },
  itemTitle: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  itemMeta: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 },
  priceTag: { color: '#F59E0B', fontSize: 12, fontWeight: '800', marginTop: 6 },
  itemActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  
  // Custom Date Picker Styles
  dateSelectorInput: { height: 48, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  dateSelectorText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  datePlaceholderText: { color: 'rgba(255,255,255,0.3)' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, backgroundColor: 'rgba(0,0,0,0.6)' },
  calendarModal: { width: '100%', maxWidth: 340, backgroundColor: '#1E293B', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  calNavBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  calendarMonthTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  weekdaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  weekdayLabel: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  emptyDayCell: { width: (340 - 40 - 36) / 7, height: 40 },
  dayCell: { width: (340 - 40 - 36) / 7, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)' },
  selectedDayCell: { backgroundColor: '#8B5CF6' },
  dayText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  selectedDayText: { color: '#FFF', fontWeight: '800' }
});
