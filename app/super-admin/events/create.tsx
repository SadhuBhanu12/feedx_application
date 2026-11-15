import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { adminCreateEvent } from '@/services/supabaseService';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToSupabaseStorage } from '@/services/uploadService';

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
    organizer_name: '',
    registration_url: '',
    registration_deadline: '',
    eligibility: '',
    event_source: 'feedx', // 'feedx' or 'external'
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
              organizer_name: data.organizer_name || data.organizer || '',
              registration_url: data.registration_url || '',
              registration_deadline: data.registration_deadline || '',
              eligibility: data.eligibility || '',
              event_source: data.event_source || (data.registration_url ? 'external' : 'feedx'),
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

  const [uploadingImage, setUploadingImage] = useState(false);

  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setUploadingImage(true);
        const publicUrl = await uploadImageToSupabaseStorage(
          res.assets[0].uri,
          user?.id || 'admin',
          'events'
        );
        if (publicUrl) {
          setForm(prev => ({ ...prev, banner_url: publicUrl }));
        }
      }
    } catch (err: any) {
      Alert.alert('Upload Failed', err?.message || 'Could not upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.date.trim() || !form.venue.trim()) {
      return Alert.alert('Validation Error', 'Title, Date, and Venue are required.');
    }

    if (form.registration_url.trim()) {
      const trimmedUrl = form.registration_url.trim();
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        return Alert.alert('Validation Error', 'Registration URL must begin with http:// or https://');
      }
    }

    if (form.event_source === 'external' && !form.registration_url.trim()) {
      return Alert.alert('Validation Error', 'External opportunity requires a valid registration URL.');
    }

    setLoading(true);
    try {
      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        event_date: form.date,
        time: form.time,
        location: form.event_type,
        venue: form.venue.trim(),
        banner_url: form.banner_url.trim(),
        image_url: form.banner_url.trim(),
        organizer_name: form.organizer_name.trim() || (form.event_source === 'external' ? 'External Partner' : 'FEEDX'),
        organizer: form.organizer_name.trim() || (form.event_source === 'external' ? 'External Partner' : 'FEEDX'),
        registration_url: form.registration_url.trim() || null,
        registration_deadline: form.registration_deadline.trim() || null,
        eligibility: form.eligibility.trim() || null,
        event_source: form.event_source,
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
      <LinearGradient colors={['#0B0F19', '#020408']} style={StyleSheet.absoluteFill} />
      
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

        {/* Event Category / Source Toggle */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.label}>Event Category & Source</Text>
          <View style={styles.toggleGroup}>
            {[
              { id: 'feedx', label: 'FEEDX Organised' },
              { id: 'external', label: 'External Opportunity' }
            ].map(source => (
              <TouchableOpacity 
                key={source.id} 
                style={[styles.toggleBtn, form.event_source === source.id && styles.toggleBtnActive]}
                onPress={() => setForm({...form, event_source: source.id})}
              >
                <Text style={styles.toggleText}>{source.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InputRow 
          label="Organizer Name" 
          value={form.organizer_name} 
          onChangeText={(t: string) => setForm({...form, organizer_name: t})} 
          placeholder="FEEDX / Google Developer Groups / State Technical Board" 
        />

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Event Poster Image</Text>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <TouchableOpacity 
              style={[styles.toggleBtn, { flex: 1, backgroundColor: 'rgba(59, 130, 246, 0.12)', borderColor: '#3B82F6', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 12 }]}
              onPress={handlePickImage}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <Feather name="image" size={16} color="#3B82F6" />
              )}
              <Text style={[styles.toggleText, { color: '#3B82F6', fontWeight: '800' }]}>
                {uploadingImage ? 'Uploading Image...' : form.banner_url ? 'Change Image from Device' : 'Upload Poster from Device'}
              </Text>
            </TouchableOpacity>
          </View>

          <InputRow 
            label="Or Enter Image / Poster URL" 
            value={form.banner_url} 
            onChangeText={(t: string) => setForm({...form, banner_url: t})} 
            placeholder="https://... or leave empty for default FEEDX logo" 
          />

          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>
            💡 If no image is uploaded, the official FEEDX event brand image will be automatically used.
          </Text>
        </View>

        <InputRow 
          label="Event Registration URL (External Portal)" 
          value={form.registration_url} 
          onChangeText={(t: string) => setForm({...form, registration_url: t})} 
          placeholder="https://forms.gle/... or https://unstop.com/..." 
        />

        <InputRow 
          label="Registration Deadline" 
          value={form.registration_deadline} 
          onChangeText={(t: string) => setForm({...form, registration_deadline: t})} 
          placeholder="e.g. 2026-10-31 11:59 PM" 
        />

        <InputRow 
          label="Eligibility Criteria" 
          value={form.eligibility} 
          onChangeText={(t: string) => setForm({...form, eligibility: t})} 
          placeholder="Open to 2nd & 3rd year diploma students, all engineering branches" 
          multiline 
        />

        <InputRow label="Venue / Location *" value={form.venue} onChangeText={(t: string) => setForm({...form, venue: t})} placeholder="Main Auditorium or Google Meet" />
        
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
