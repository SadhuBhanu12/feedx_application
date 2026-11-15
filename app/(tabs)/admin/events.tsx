import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Pressable,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { safeBack } from '@/utils/navigation';
import { Image as ExpoImage } from 'expo-image';

const { width } = Dimensions.get('window');

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  event_date?: string;
  time?: string;
  event_time?: string;
  location?: string;
  venue?: string;
  category: string;
  image_url?: string;
  banner_url?: string;
  price?: number | string;
  type?: string;
  capacity?: number | string;
  max_participants?: number | string;
  registered?: number;
  registration_required?: boolean;
  registration_method?: string;
  event_source?: string;
  registration_url?: string;
  certificate_available?: boolean;
  eligibility?: string;
  registration_deadline?: string;
  organizer_name?: string;
  college_id?: string | null;
}

const CATEGORIES = ['Workshop', 'Tech Fest', 'Cultural', 'Seminar', 'Hackathon', 'Placement Drive'];

const INITIAL_FORM = {
  id: '',
  title: '',
  description: '',
  date: '',
  time: '10:00 AM',
  location: '',
  category: 'Workshop',
  image_url: '',
  price: '0',
  capacity: '100',
  registration_required: true,
  registration_method: 'in_app', // 'in_app' | 'external'
  registration_url: '',
  certificate_available: true,
  eligibility: 'Open to All Students',
  registration_deadline: ''
};

export default function AdminEventsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const isSuperAdmin = user?.role === 'super_admin';
  const effectiveCollegeId = user?.college_id || (!isSuperAdmin ? '6dd12d63-e276-4ff8-8e58-bcd2cc878626' : null);

  const loadItems = async () => {
    setLoading(true);
    try {
      let query = supabase.from('events').select('*');
      if (!isSuperAdmin) {
        if (effectiveCollegeId) {
          query = query.eq('college_id', effectiveCollegeId);
        }
      }
      const { data, error } = await query.order('date', { ascending: false });
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
    const channelName = `admin-events-rt-${effectiveCollegeId || 'all'}-${Date.now()}`;
    const channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          ...(!isSuperAdmin && effectiveCollegeId ? { filter: `college_id=eq.${effectiveCollegeId}` } : {})
        },
        () => {
          loadItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [effectiveCollegeId, isSuperAdmin]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.date.trim()) {
      Alert.alert('Required Fields Missing', 'Please enter Event Title and Date to publish.');
      return;
    }
    setSyncing(true);
    try {
      const parsedCapacity = form.capacity && !isNaN(Number(form.capacity)) ? parseInt(form.capacity, 10) : 100;
      const isExternal = form.registration_required && form.registration_method === 'external';
      const organizerTitle = user?.college_name || 'Government Institute of Electronics';

      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date.trim(),
        event_date: form.date.trim(),
        time: form.time.trim() || '10:00 AM',
        event_time: form.time.trim() || '10:00 AM',
        venue: form.location.trim() || 'Campus Auditorium',
        location: form.location.trim() || 'Offline',
        category: form.category.trim(),
        image_url: form.image_url.trim() || null,
        banner_url: form.image_url.trim() || null,
        price: form.price && !isNaN(Number(form.price)) ? parseFloat(form.price) : 0,
        capacity: parsedCapacity,
        max_participants: parsedCapacity,
        registered: 0,
        registration_required: form.registration_required,
        registration_method: form.registration_required ? form.registration_method : 'none',
        event_source: isExternal ? 'external' : 'feedx',
        registration_url: isExternal ? (form.registration_url.trim() || null) : null,
        certificate_available: form.certificate_available,
        eligibility: form.eligibility.trim() || 'Open to All Students',
        registration_deadline: form.registration_deadline.trim() || null,
        organizer_name: organizerTitle,
        organizer: organizerTitle,
        college_id: isSuperAdmin ? (form.id ? undefined : null) : effectiveCollegeId,
        created_by: user?.id,
        created_by_role: user?.role || 'college_admin',
        status: 'Published',
        visibility: isSuperAdmin ? 'global' : 'college'
      };

      if (form.id) {
        payload.id = form.id;
        if (!isSuperAdmin) {
          const existing = items.find(i => i.id === form.id);
          if (existing && existing.college_id && existing.college_id !== effectiveCollegeId) {
            Alert.alert('Permission Denied', 'You cannot edit events hosted by another college.');
            setSyncing(false);
            return;
          }
          payload.college_id = effectiveCollegeId;
        }
      } else if (!isSuperAdmin) {
        payload.college_id = effectiveCollegeId;
      }

      const { error } = await supabase.from('events').upsert(payload);
      if (error) throw error;
      
      Alert.alert(
        'Success 🎉', 
        form.id ? 'Event details updated successfully.' : 'Event published to campus student feed.',
        [
          {
            text: 'View Published Events',
            onPress: () => {
              setForm(INITIAL_FORM);
              setActiveTab('list');
              loadItems();
            }
          },
          {
            text: 'Add Another Event',
            onPress: () => {
              setForm(INITIAL_FORM);
              loadItems();
            }
          }
        ]
      );
    } catch (e: any) {
      Alert.alert('Sync Error', e.message || String(e));
    } finally {
      setSyncing(false);
    }
  };

  const setFromRow = (item: EventItem) => {
    if (!isSuperAdmin && item.college_id && item.college_id !== effectiveCollegeId) {
      Alert.alert('Permission Denied', 'You can only edit events hosted by your own college.');
      return;
    }
    const isExt = !!item.registration_url || item.registration_method === 'external' || item.event_source === 'external';
    setForm({
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      date: item.event_date || item.date || '',
      time: item.event_time || item.time || '10:00 AM',
      location: item.venue || item.location || '',
      category: item.category || 'Workshop',
      image_url: item.banner_url || item.image_url || '',
      price: String(item.price || '0'),
      capacity: String(item.capacity || item.max_participants || '100'),
      registration_required: item.registration_required !== undefined ? !!item.registration_required : true,
      registration_method: isExt ? 'external' : 'in_app',
      registration_url: item.registration_url || '',
      certificate_available: item.certificate_available !== undefined ? !!item.certificate_available : true,
      eligibility: item.eligibility || 'Open to All Students',
      registration_deadline: item.registration_deadline || ''
    });
    setActiveTab('create');
  };

  const handleCancelEdit = () => {
    setForm(INITIAL_FORM);
  };

  const handleDelete = async (item: EventItem) => {
    if (!isSuperAdmin && item.college_id && item.college_id !== effectiveCollegeId) {
      Alert.alert('Permission Denied', 'You can only delete events hosted by your own college.');
      return;
    }
    Alert.alert('Delete Event?', 'This will permanently remove it from the campus student feed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        let deleteQuery = supabase.from('events').delete().eq('id', item.id);
        if (!isSuperAdmin && effectiveCollegeId) {
          deleteQuery = deleteQuery.eq('college_id', effectiveCollegeId);
        }
        const { error } = await deleteQuery;
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
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack('/(tabs)/admin')}>
          <Feather name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Campus Events Hub</Text>
          <View style={styles.headerSubtitleRow}>
            <View style={styles.statusDot} />
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {user?.college_name ? `${user.college_name.toUpperCase()} • SCOPED` : 'CAMPUS WORKSHOPS & FESTS'}
            </Text>
          </View>
        </View>
        <View style={styles.hubIconBox}>
          <MaterialCommunityIcons name="calendar-star" size={22} color="#06B6D4" />
        </View>
      </View>

      {/* Segmented Controller: Create vs Published */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'create' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('create')}
          activeOpacity={0.8}
        >
          <Feather
            name={form.id ? "edit-3" : "plus-circle"}
            size={14}
            color={activeTab === 'create' ? '#06B6D4' : '#94A3B8'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.segmentBtnText, activeTab === 'create' && styles.segmentBtnTextActive]}>
            {form.id ? 'Edit Event' : 'Create Event'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'list' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('list')}
          activeOpacity={0.8}
        >
          <Feather
            name="calendar"
            size={14}
            color={activeTab === 'list' ? '#06B6D4' : '#94A3B8'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.segmentBtnText, activeTab === 'list' && styles.segmentBtnTextActive]}>
            Published ({items.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: STRUCTURED EVENT COMPOSER */}
      {activeTab === 'create' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(200)}>
            {/* Edit Mode Notice Banner */}
            {form.id ? (
              <View style={styles.editNoticeBanner}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                  <Feather name="info" size={16} color="#F59E0B" />
                  <Text style={styles.editNoticeText} numberOfLines={1}>
                    Editing Event ID: {form.id.slice(0, 8)}...
                  </Text>
                </View>
                <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelEditBtn}>
                  <Text style={styles.cancelEditBtnText}>Cancel Edit</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* SECTION 1: EVENT IDENTITY */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionStepBadge, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                  <Text style={[styles.sectionStepText, { color: '#06B6D4' }]}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>EVENT IDENTITY & DETAILS</Text>
                  <Text style={styles.sectionSubtitle}>Title, category, objectives and poster image</Text>
                </View>
              </View>

              {/* Event Title */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>EVENT TITLE *</Text>
                <TextInput
                  style={styles.input}
                  value={form.title}
                  onChangeText={(t) => setForm((f) => ({ ...f, title: t }))}
                  placeholder="e.g. Annual State Polytechnic Tech Fest 2026"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </View>

              {/* Category Chips */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>CATEGORY CLASSIFICATION</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                  {CATEGORIES.map((cat) => {
                    const isCatActive = form.category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.categoryChip, isCatActive && styles.categoryChipActive]}
                        onPress={() => setForm((f) => ({ ...f, category: cat }))}
                      >
                        <Text style={[styles.categoryChipText, isCatActive && styles.categoryChipTextActive]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Description & Rules */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>DESCRIPTION & HIGHLIGHTS</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={form.description}
                  onChangeText={(t) => setForm((f) => ({ ...f, description: t }))}
                  placeholder="Overview of the event, eligibility, key speaker details, and guidelines..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                />
              </View>

              {/* Poster Image URL */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>POSTER / BANNER (IMAGE URL)</Text>
                <TextInput
                  style={styles.input}
                  value={form.image_url}
                  onChangeText={(t) => setForm((f) => ({ ...f, image_url: t }))}
                  placeholder="https://images.unsplash.com/... or event banner link"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  autoCapitalize="none"
                />
                {form.image_url ? (
                  <View style={styles.imagePreviewRow}>
                    <ExpoImage source={{ uri: form.image_url }} style={styles.imagePreviewThumb} />
                    <Text style={styles.imagePreviewText} numberOfLines={1}>
                      Banner preview connected
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* SECTION 2: SCHEDULE & VENUE */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionStepBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Text style={[styles.sectionStepText, { color: '#3B82F6' }]}>2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>DATE, TIME & VENUE</Text>
                  <Text style={styles.sectionSubtitle}>When and where this session will take place</Text>
                </View>
              </View>

              {/* 2-Column Grid: Event Date + Event Time */}
              <View style={styles.twoColumnGrid}>
                <View style={styles.columnItem}>
                  <Text style={styles.fieldLabel}>EVENT DATE *</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowCalendar(true)}
                    style={styles.dateSelectorInput}
                  >
                    <Text style={[styles.dateSelectorText, !form.date && styles.datePlaceholderText]}>
                      {form.date || 'YYYY-MM-DD'}
                    </Text>
                    <Feather name="calendar" size={16} color="#06B6D4" />
                  </TouchableOpacity>
                </View>

                <View style={styles.columnItem}>
                  <Text style={styles.fieldLabel}>EVENT TIME</Text>
                  <TextInput
                    style={styles.input}
                    value={form.time}
                    onChangeText={(t) => setForm((f) => ({ ...f, time: t }))}
                    placeholder="10:00 AM"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                  />
                </View>
              </View>

              {/* Location / Venue */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>LOCATION & AUDITORIUM VENUE</Text>
                <TextInput
                  style={styles.input}
                  value={form.location}
                  onChangeText={(t) => setForm((f) => ({ ...f, location: t }))}
                  placeholder="Main Campus Auditorium, CSE Seminar Block 2"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </View>
            </View>

            {/* SECTION 3: CAPACITY & PRICING */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionStepBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Text style={[styles.sectionStepText, { color: '#F59E0B' }]}>3</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>CAPACITY & REGISTRATION FEE</Text>
                  <Text style={styles.sectionSubtitle}>Set attendee limits and ticket pricing</Text>
                </View>
              </View>

              {/* 2-Column Grid: Capacity + Fee */}
              <View style={styles.twoColumnGrid}>
                <View style={styles.columnItem}>
                  <Text style={styles.fieldLabel}>MAX CAPACITY</Text>
                  <TextInput
                    style={styles.input}
                    value={form.capacity}
                    onChangeText={(t) => setForm((f) => ({ ...f, capacity: t }))}
                    placeholder="100"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.columnItem}>
                  <Text style={styles.fieldLabel}>ENTRY FEE (₹)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.price}
                    onChangeText={(t) => setForm((f) => ({ ...f, price: t }))}
                    placeholder="0"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.pricingHintBanner}>
                <MaterialCommunityIcons
                  name={Number(form.price) > 0 ? "cash" : "tag-outline"}
                  size={16}
                  color={Number(form.price) > 0 ? "#F59E0B" : "#10B981"}
                />
                <Text style={styles.pricingHintText}>
                  {Number(form.price) > 0
                    ? `Paid Event: ₹${form.price} entry fee per student`
                    : 'Free Campus Event: 100% Free Entry for all enrolled students'}
                </Text>
              </View>
            </View>

            {/* SECTION 4: REGISTRATION & CERTIFICATION */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionStepBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Text style={[styles.sectionStepText, { color: '#10B981' }]}>4</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>REGISTRATION & CERTIFICATION RULES</Text>
                  <Text style={styles.sectionSubtitle}>Verification format, eligibility and certificates</Text>
                </View>
              </View>

              {/* Registration Required Toggle */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>ENTRY TYPE</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, form.registration_required && styles.toggleBtnActive]}
                    onPress={() => setForm((f) => ({ ...f, registration_required: true }))}
                  >
                    <Text style={[styles.toggleBtnText, form.registration_required && styles.toggleBtnTextActive]}>
                      ✓ Pre-registration Required
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleBtn, !form.registration_required && styles.toggleBtnActive]}
                    onPress={() => setForm((f) => ({ ...f, registration_required: false }))}
                  >
                    <Text style={[styles.toggleBtnText, !form.registration_required && styles.toggleBtnTextActive]}>
                      ✕ Open Walk-in Entry
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Conditional Registration Fields */}
              {form.registration_required && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>REGISTRATION CHANNEL</Text>
                    <View style={styles.toggleRow}>
                      <TouchableOpacity
                        style={[styles.toggleBtn, form.registration_method === 'in_app' && styles.toggleBtnActive]}
                        onPress={() => setForm((f) => ({ ...f, registration_method: 'in_app' }))}
                      >
                        <Text style={[styles.toggleBtnText, form.registration_method === 'in_app' && styles.toggleBtnTextActive]}>
                          ⚡ In-App (FEEDX Pass)
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.toggleBtn, form.registration_method === 'external' && styles.toggleBtnActive]}
                        onPress={() => setForm((f) => ({ ...f, registration_method: 'external' }))}
                      >
                        <Text style={[styles.toggleBtnText, form.registration_method === 'external' && styles.toggleBtnTextActive]}>
                          🔗 External Link / Form
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {form.registration_method === 'external' && (
                    <View style={styles.formGroup}>
                      <Text style={styles.fieldLabel}>EXTERNAL REGISTRATION URL</Text>
                      <TextInput
                        style={styles.input}
                        value={form.registration_url}
                        onChangeText={(t) => setForm((f) => ({ ...f, registration_url: t }))}
                        placeholder="https://forms.google.com/... or event signup link"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        autoCapitalize="none"
                      />
                    </View>
                  )}

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>REGISTRATION DEADLINE</Text>
                    <TextInput
                      style={styles.input}
                      value={form.registration_deadline}
                      onChangeText={(t) => setForm((f) => ({ ...f, registration_deadline: t }))}
                      placeholder="e.g. 2026-10-25 11:59 PM"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                    />
                  </View>
                </>
              )}

              {/* Certificate Available Toggle */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>PARTICIPATION CERTIFICATE</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, form.certificate_available && styles.toggleBtnActiveCert]}
                    onPress={() => setForm((f) => ({ ...f, certificate_available: true }))}
                  >
                    <Text style={[styles.toggleBtnText, form.certificate_available && { color: '#10B981', fontWeight: '800' }]}>
                      📜 Official Certificate Provided
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleBtn, !form.certificate_available && styles.toggleBtnActive]}
                    onPress={() => setForm((f) => ({ ...f, certificate_available: false }))}
                  >
                    <Text style={[styles.toggleBtnText, !form.certificate_available && styles.toggleBtnTextActive]}>
                      No Certificate
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Eligibility */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>ELIGIBILITY CRITERIA</Text>
                <TextInput
                  style={styles.input}
                  value={form.eligibility}
                  onChangeText={(t) => setForm((f) => ({ ...f, eligibility: t }))}
                  placeholder="e.g. All Branches / Diploma 2nd & 3rd Year"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </View>
            </View>

            {/* PUBLISH ACTION BUTTON */}
            <View style={styles.actionRow}>
              {form.id ? (
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={handleCancelEdit}
                  disabled={syncing}
                >
                  <Text style={styles.secondaryBtnText}>Cancel</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={[styles.primaryButton, form.id ? { flex: 2 } : { flex: 1 }]}
                onPress={handleSave}
                disabled={syncing}
                activeOpacity={0.85}
              >
                <LinearGradient colors={['#06B6D4', '#2563EB']} style={styles.buttonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {syncing ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.primaryButtonText}>
                        {form.id ? 'Save & Update Event' : 'Publish Campus Event'}
                      </Text>
                      <Feather name={form.id ? 'check-circle' : 'arrow-right'} size={18} color="#FFF" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      )}

      {/* TAB 2: PUBLISHED CAMPUS EVENTS LIST */}
      {activeTab === 'list' && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={loadItems}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.listHeaderRow}>
              <Text style={styles.listSectionTitle}>Active Events on Campus Feed</Text>
              <Text style={styles.listCountBadge}>{items.length} Events</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={56} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyTitle}>No Published Events Yet</Text>
              <Text style={styles.emptySubtitle}>
                Create workshops, technical fests, and cultural events to engage your campus students.
              </Text>
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={() => setActiveTab('create')}
              >
                <Text style={styles.emptyActionBtnText}>Create First Event</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInRight.delay(Math.min(index, 8) * 40)} style={styles.itemCardContainer}>
              <BlurView intensity={12} tint="dark" style={styles.itemCard}>
                <View style={styles.itemMain}>
                  {/* Category & Price Badge Row */}
                  <View style={styles.itemBadgeRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{item.category || 'Workshop'}</Text>
                    </View>
                    <View style={[styles.priceBadge, Number(item.price) > 0 ? styles.priceBadgePaid : styles.priceBadgeFree]}>
                      <Text style={[styles.priceBadgeText, Number(item.price) > 0 ? { color: '#F59E0B' } : { color: '#10B981' }]}>
                        {item.price && Number(item.price) > 0 ? `₹${item.price}` : 'FREE ENTRY'}
                      </Text>
                    </View>
                  </View>

                  {/* Title & Description */}
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.description ? (
                    <Text style={styles.itemDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}

                  {/* Date, Time & Venue Row */}
                  <View style={styles.metaRow}>
                    <Feather name="calendar" size={13} color="#06B6D4" />
                    <Text style={styles.metaText}>
                      {item.event_date || item.date}
                      {(item.event_time || item.time) ? ` • ${item.event_time || item.time}` : ''}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <Feather name="map-pin" size={13} color="#94A3B8" />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {item.venue || item.location || 'Campus Auditorium'}
                    </Text>
                  </View>
                  
                  {/* Feature Tags Row */}
                  <View style={styles.tagsRow}>
                    {item.certificate_available && (
                      <View style={styles.certPill}>
                        <Text style={styles.certPillText}>📜 CERTIFICATE</Text>
                      </View>
                    )}
                    {item.registration_required ? (
                      <View style={styles.regPill}>
                        <Text style={styles.regPillText}>
                          {item.registration_method === 'external' || item.registration_url ? '🔗 EXT REGISTRATION' : '⚡ IN-APP REGISTER'}
                        </Text>
                      </View>
                    ) : (
                      <View style={[styles.regPill, { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
                        <Text style={[styles.regPillText, { color: 'rgba(255, 255, 255, 0.5)' }]}>WALK-IN ENTRY</Text>
                      </View>
                    )}
                    {item.capacity ? (
                      <View style={styles.eligPill}>
                        <Text style={styles.eligPillText}>Max {item.capacity} Seats</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {/* Action Buttons Column */}
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)' }]}
                    onPress={() => router.push(`/admin/scanner?eventId=${item.id}` as any)}
                  >
                    <MaterialCommunityIcons name="qrcode-scan" size={18} color="#06B6D4" />
                  </TouchableOpacity>

                  {(isSuperAdmin || !item.college_id || item.college_id === effectiveCollegeId) ? (
                    <>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}
                        onPress={() => setFromRow(item)}
                      >
                        <Feather name="edit-3" size={16} color="#60A5FA" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}
                        onPress={() => handleDelete(item)}
                      >
                        <Feather name="trash-2" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={[styles.actionBtn, { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
                      <Feather name="lock" size={14} color="rgba(255,255,255,0.4)" />
                    </View>
                  )}
                </View>
              </BlurView>
            </Animated.View>
          )}
        />
      )}

      {/* Calendar Picker Modal */}
      <Modal visible={showCalendar} transparent animationType="fade" onRequestClose={() => setShowCalendar(false)}>
        <BlurView intensity={35} style={StyleSheet.absoluteFill} tint="dark">
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
                        setForm((f) => ({ ...f, date: formatSelectedDate(day) }));
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
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06B6D4',
  },
  headerSubtitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  hubIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  segmentBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  segmentBtnTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  editNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  editNoticeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
  },
  cancelEditBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  cancelEditBtnText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionStepBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionStepText: {
    fontSize: 12.5,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  formGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.8,
    marginBottom: 6,
    textAlign: 'left',
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    paddingHorizontal: 14,
    color: '#FFF',
    fontSize: 13.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  multilineInput: {
    height: 85,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  columnItem: {
    flex: 1,
  },
  chipScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  categoryChipActive: {
    backgroundColor: '#06B6D4',
    borderColor: '#22D3EE',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  categoryChipTextActive: {
    color: '#042F2E',
    fontWeight: '900',
  },
  dateSelectorInput: {
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  dateSelectorText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  datePlaceholderText: {
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '500',
  },
  imagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  imagePreviewThumb: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  imagePreviewText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  pricingHintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  pricingHintText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: '#06B6D4',
  },
  toggleBtnActiveCert: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  toggleBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  toggleBtnTextActive: {
    color: '#22D3EE',
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 40,
  },
  secondaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryBtnText: {
    color: '#94A3B8',
    fontWeight: '800',
    fontSize: 13,
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  listSectionTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  listCountBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#06B6D4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyActionBtn: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#06B6D4',
  },
  emptyActionBtnText: {
    color: '#042F2E',
    fontWeight: '900',
    fontSize: 12.5,
  },
  itemCardContainer: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  itemCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  itemMain: {
    flex: 1,
  },
  itemBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  categoryBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#22D3EE',
    textTransform: 'uppercase',
  },
  priceBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceBadgeFree: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  priceBadgePaid: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  priceBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
  },
  itemTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'left',
  },
  itemDesc: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  certPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  certPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  regPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  regPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#22D3EE',
    letterSpacing: 0.5,
  },
  eligPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  eligPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  itemActions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  calendarModal: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMonthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  emptyDayCell: {
    width: (340 - 40 - 36) / 7,
    height: 40,
  },
  dayCell: {
    width: (340 - 40 - 36) / 7,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  selectedDayCell: {
    backgroundColor: '#06B6D4',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  selectedDayText: {
    color: '#042F2E',
    fontWeight: '900',
  },
});
