import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { adminCreateEvent } from '@/services/supabaseService';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';

export default function CreateEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEdit = !!id;
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setForm({...form, date: dateStr});
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      let hours = selectedTime.getHours();
      let minutes = selectedTime.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? '0'+minutes : minutes;
      const strTime = hours + ':' + minutesStr + ' ' + ampm;
      setForm({...form, time: strTime});
    }
  };

  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    time: '',
    banner_url: '',
    max_participants: '',
    event_type: 'Offline',
    registration_required: true,
    certificate_available: false,
    attendance_required: true,
    registration_fee: 'Free',
    status: 'Published'
  });

  useEffect(() => {
    if (id) {
      const loadEvent = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
          if (error) throw error;
          if (data) {
            setForm({
              title: data.title || '',
              description: data.description || '',
              venue: data.venue || '',
              date: data.date || data.event_date || '',
              time: data.time || '',
              banner_url: data.banner_url || data.image_url || '',
              max_participants: data.max_participants ? String(data.max_participants) : '',
              event_type: data.location || 'Offline',
              registration_required: !!data.registration_required,
              certificate_available: !!data.certificate_available,
              attendance_required: !!data.attendance_required,
              registration_fee: data.price ? String(data.price) : 'Free',
              status: data.status || 'Published'
            });
          }
        } catch (e: any) {
          Alert.alert('Error Loading Event', e.message);
        } finally {
          setLoading(false);
        }
      };
      loadEvent();
    }
  }, [id]);

  const handleCreate = async () => {
    console.log('handleCreate started', form);
    if (!form.title || !form.date || !form.venue) {
      console.log('Validation failed');
      return Alert.alert('Validation Error', 'Title, Date, and Venue are required.');
    }
    console.log('Validation passed, setting loading true');
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        date: form.date,
        event_date: form.date,
        time: form.time,
        location: form.event_type,
        venue: form.venue,
        banner_url: form.banner_url,
        image_url: form.banner_url,
        max_participants: form.max_participants ? parseInt(form.max_participants) : null,
        registration_required: form.registration_required,
        attendance_required: form.attendance_required,
        certificate_available: form.certificate_available,
        price: form.registration_fee === 'Free' || isNaN(Number(form.registration_fee)) ? 0 : parseFloat(form.registration_fee),
        status: form.status,
      };

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Database operation timed out after 15 seconds. Please try again.")), 15000));

      if (isEdit) {
        const updatePromise = supabase.from('events').update(payload).eq('id', id);
        const { error } = await Promise.race([updatePromise, timeoutPromise]) as any;
        if (error) throw error;
        setLoading(false);
        if (Platform.OS === 'web') {
          alert('Event updated successfully!');
          router.back();
        } else {
          Alert.alert('Success', 'Event updated successfully!', [{ text: 'OK', onPress: () => router.back() }]);
        }
      } else {
        const insertPromise = supabase.from('events').insert({
          ...payload,
          college_id: user?.role === 'inst_admin' ? user?.college_id : null,
          created_by: user?.id,
          created_by_role: user?.role || 'admin'
        });
        const { error } = await Promise.race([insertPromise, timeoutPromise]) as any;
        if (error) throw error;
        setLoading(false);
        if (Platform.OS === 'web') {
          alert('Event created successfully!');
          router.back();
        } else {
          Alert.alert('Success', 'Event created successfully!', [{ text: 'OK', onPress: () => router.back() }]);
        }
      }
    } catch (err: any) {
      console.error('Error in handleCreate:', err);
      setLoading(false);
      const errMsg = err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
      if (Platform.OS === 'web') {
        alert('Error: ' + errMsg);
      } else {
        Alert.alert('Error', errMsg);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0B0F19', '#020408']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Event' : 'Create Event'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <InputRow label="Event Title *" value={form.title} onChangeText={(t: string) => setForm({...form, title: t})} placeholder="Tech Symposium 2026" />
        <InputRow label="Description" value={form.description} onChangeText={(t: string) => setForm({...form, description: t})} placeholder="About the event..." multiline />
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            {Platform.OS === 'web' ? (
              <InputRow label="Date (YYYY-MM-DD) *" value={form.date} onChangeText={(t: string) => setForm({...form, date: t})} placeholder="2026-10-15" />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
                  <View pointerEvents="none">
                    <InputRow label="Date *" value={form.date} placeholder="YYYY-MM-DD" />
                  </View>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={form.date ? new Date(form.date) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </>
            )}
          </View>
          <View style={{ flex: 1 }}>
            {Platform.OS === 'web' ? (
              <InputRow label="Time" value={form.time} onChangeText={(t: string) => setForm({...form, time: t})} placeholder="10:00 AM" />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowTimePicker(true)} activeOpacity={0.8}>
                  <View pointerEvents="none">
                    <InputRow label="Time" value={form.time} placeholder="10:00 AM" />
                  </View>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </>
            )}
          </View>
        </View>

        <InputRow label="Venue / Location *" value={form.venue} onChangeText={(t: string) => setForm({...form, venue: t})} placeholder="Main Auditorium" />
        <InputRow label="Banner Image URL" value={form.banner_url} onChangeText={(t: string) => setForm({...form, banner_url: t})} placeholder="https://..." />
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <InputRow label="Max Participants" value={form.max_participants} onChangeText={(t: string) => setForm({...form, max_participants: t})} placeholder="Leave blank for ∞" keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Event Type</Text>
            <View style={styles.toggleGroup}>
              {['Offline', 'Online'].map(type => (
                <TouchableOpacity 
                  key={type} 
                  style={[styles.toggleBtn, form.event_type === type && styles.toggleBtnActive]}
                  onPress={() => setForm({...form, event_type: type})}
                >
                  <Text style={styles.toggleText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />
        <Text style={styles.sectionTitle}>Registration & Policies</Text>

        <SwitchRow label="Registration Required" value={form.registration_required} onValueChange={(v: boolean) => setForm({...form, registration_required: v})} />
        <SwitchRow label="Attendance Marking Required" value={form.attendance_required} onValueChange={(v: boolean) => setForm({...form, attendance_required: v})} />
        <SwitchRow label="Issue E-Certificates" value={form.certificate_available} onValueChange={(v: boolean) => setForm({...form, certificate_available: v})} />
        
        <Text style={styles.label}>Publish Status</Text>
        <View style={styles.toggleGroup}>
          {['Draft', 'Published'].map(st => (
            <TouchableOpacity 
              key={st} 
              style={[styles.toggleBtn, form.status === st && { backgroundColor: st === 'Published' ? '#10B981' : '#F59E0B', borderColor: 'transparent' }]}
              onPress={() => setForm({...form, status: st})}
            >
              <Text style={styles.toggleText}>{st}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>{isEdit ? 'Save Changes' : 'Create Event'}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const InputRow = ({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && { height: 100, paddingTop: 16 }]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.3)"
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const SwitchRow = ({ label, value, onValueChange }: any) => (
  <View style={styles.switchRow}>
    <Text style={styles.switchLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#10B981' }}
      thumbColor="#FFF"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  input: { height: 52, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 16, color: '#FFF', fontSize: 15, fontWeight: '500' },
  
  toggleGroup: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  toggleBtn: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  toggleBtnActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  toggleText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  
  sectionDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 20 },
  
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  switchLabel: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  
  submitBtn: { height: 56, backgroundColor: '#FFF', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  submitText: { color: '#000', fontSize: 16, fontWeight: '800' }
});
