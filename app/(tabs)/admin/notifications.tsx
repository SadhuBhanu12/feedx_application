import React, { useEffect, useState, useMemo } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { adminCreateNotification, getNotifications } from '@/services/supabaseService';
import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { safeBack } from '@/utils/navigation';
import { SHADOWS } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  apply_url?: string;
  created_at: string;
  branch?: string;
  year?: string;
  section?: string;
  target_branch?: string;
  target_year?: string;
  type?: string;
  priority?: string;
  status?: 'Sent' | 'Scheduled' | 'Draft' | 'Failed';
  scheduled_at?: string;
}

type BroadcastCategory = 'Announcement' | 'Notice' | 'Emergency';
type DeliveryMode = 'immediate' | 'schedule' | 'draft';

const BRANCH_LIST = ['All Branches', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AI&DS'];
const YEAR_LIST = ['All Years', '1st Year', '2nd Year', '3rd Year', 'Final Year'];
const SECTION_LIST = ['All Sections', 'Section A', 'Section B', 'Section C'];

export default function AdminNotificationsScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  // Form states
  const [broadcastType, setBroadcastType] = useState<BroadcastCategory>('Announcement');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [applyUrl, setApplyUrl] = useState('');

  // Target audience selection
  const [targetScope, setTargetScope] = useState<'all' | 'custom'>('all');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedSection, setSelectedSection] = useState('All Sections');

  // Delivery options
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('immediate');
  const [scheduledDateStr, setScheduledDateStr] = useState('');

  // Data states
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<NotificationItem | null>(null);
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'All' | 'Sent' | 'Scheduled' | 'Draft'>('All');

  const isSuperAdmin = user?.role === 'super_admin';
  const effectiveCollegeId = user?.college_id || (!isSuperAdmin ? '6dd12d63-e276-4ff8-8e58-bcd2cc878626' : null);

  const filteredItems = useMemo(() => {
    if (historyStatusFilter === 'All') return items;
    return items.filter(
      (item) => (item.status || 'Sent').toLowerCase() === historyStatusFilter.toLowerCase()
    );
  }, [items, historyStatusFilter]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getNotifications(user.id, effectiveCollegeId || undefined);
      const formatted = (data || []).map((item: any) => ({
        ...item,
        status: item.status || 'Sent',
        target_branch: item.branch || item.target_branch || 'All Branches',
        target_year: item.year || item.target_year || 'All Years',
      }));
      setItems(formatted);
    } catch (err: any) {
      console.warn('[BroadcastHub] Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel('admin-broadcast-hub')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, effectiveCollegeId]);

  const targetAudienceLabel = useMemo(() => {
    if (targetScope === 'all') return 'All Students (College-Wide)';
    const parts = [];
    if (selectedBranch !== 'All Branches') parts.push(selectedBranch);
    if (selectedYear !== 'All Years') parts.push(selectedYear);
    if (selectedSection !== 'All Sections') parts.push(selectedSection);
    return parts.length > 0 ? parts.join(' • ') : 'All Students (College-Wide)';
  }, [targetScope, selectedBranch, selectedYear, selectedSection]);

  const handleSendNotification = async (overrideStatus?: 'Sent' | 'Draft' | 'Scheduled') => {
    if (!title.trim()) {
      return Alert.alert('Headline Required', 'Please enter a clear transmission headline.');
    }
    if (!message.trim()) {
      return Alert.alert('Message Required', 'Please provide the broadcast details or announcement body.');
    }

    if (deliveryMode === 'schedule' && !scheduledDateStr.trim()) {
      return Alert.alert('Date Required', 'Please enter a scheduled broadcast date & time.');
    }

    setSubmitting(true);
    try {
      const determinedStatus = overrideStatus || (deliveryMode === 'draft' ? 'Draft' : deliveryMode === 'schedule' ? 'Scheduled' : 'Sent');

      const payload = {
        title: title.trim(),
        message: message.trim(),
        apply_url: applyUrl.trim() || null,
        type: broadcastType,
        priority: broadcastType === 'Emergency' ? 'HIGH' : 'NORMAL',
        college_id: effectiveCollegeId,
        branch: targetScope === 'custom' && selectedBranch !== 'All Branches' ? selectedBranch : null,
        year: targetScope === 'custom' && selectedYear !== 'All Years' ? selectedYear : null,
        section: targetScope === 'custom' && selectedSection !== 'All Sections' ? selectedSection : null,
        status: determinedStatus,
        scheduled_at: deliveryMode === 'schedule' ? scheduledDateStr.trim() : null,
      };

      await adminCreateNotification(payload);

      Alert.alert(
        determinedStatus === 'Draft' ? 'Draft Saved' : determinedStatus === 'Scheduled' ? 'Broadcast Scheduled' : 'Broadcast Dispatched 🚀',
        determinedStatus === 'Draft'
          ? 'Your announcement has been saved to drafts.'
          : determinedStatus === 'Scheduled'
          ? `Broadcast scheduled for transmission to ${targetAudienceLabel}.`
          : `Announcement successfully broadcasted to ${targetAudienceLabel}.`
      );

      // Reset form
      setTitle('');
      setMessage('');
      setApplyUrl('');
      setScheduledDateStr('');
      setDeliveryMode('immediate');
      setTargetScope('all');
      setSelectedBranch('All Branches');
      setSelectedYear('All Years');
      setSelectedSection('All Sections');
      setShowPreviewModal(false);
      setActiveTab('history');
      loadNotifications();
    } catch (e: any) {
      Alert.alert('Transmission Failed', e.message || 'Unable to dispatch broadcast.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    Alert.alert('Delete Broadcast', 'Are you sure you want to permanently delete this broadcast record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await supabase.from('notifications').delete().eq('id', id);
            setItems((prev) => prev.filter((i) => i.id !== id));
            if (selectedDetailItem?.id === id) setSelectedDetailItem(null);
          } catch (e: any) {
            Alert.alert('Delete Failed', e.message);
          }
        },
      },
    ]);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Just Now';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const renderStatusBadge = (status?: string) => {
    let bg = 'rgba(16, 185, 129, 0.15)';
    let textCol = '#10B981';
    let iconName: any = 'check-circle';
    let label = status || 'SENT';

    if (status === 'Scheduled') {
      bg = 'rgba(59, 130, 246, 0.15)';
      textCol = '#60A5FA';
      iconName = 'clock';
    } else if (status === 'Draft') {
      bg = 'rgba(245, 158, 11, 0.15)';
      textCol = '#F59E0B';
      iconName = 'file-text';
    } else if (status === 'Failed') {
      bg = 'rgba(239, 68, 68, 0.15)';
      textCol = '#EF4444';
      iconName = 'alert-triangle';
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bg }]}>
        <Feather name={iconName} size={11} color={textCol} style={{ marginRight: 4 }} />
        <Text style={[styles.statusBadgeText, { color: textCol }]}>{label.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#030712', '#0B1120', '#020617']} style={StyleSheet.absoluteFill} />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack('/(tabs)/admin')} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Broadcast Hub</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText} numberOfLines={1}>
              {user?.college_name ? `${user.college_name.toUpperCase()} • LIVE DESK` : 'CAMPUS TRANSMISSION DESK'}
            </Text>
          </View>
        </View>

        <View style={styles.hubIconBox}>
          <MaterialCommunityIcons name="broadcast" size={22} color="#F59E0B" />
        </View>
      </View>

      {/* Segmented Controller */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'compose' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('compose')}
          activeOpacity={0.8}
        >
          <Feather
            name="send"
            size={13}
            color={activeTab === 'compose' ? '#F59E0B' : 'rgba(255,255,255,0.45)'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.segmentBtnText, activeTab === 'compose' && styles.segmentBtnTextActive]}>
            New Transmission
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'history' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.8}
        >
          <Feather
            name="activity"
            size={13}
            color={activeTab === 'history' ? '#F59E0B' : 'rgba(255,255,255,0.45)'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.segmentBtnText, activeTab === 'history' && styles.segmentBtnTextActive]}>
            History & Logs ({items.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: COMPOSE TRANSMISSION */}
      {activeTab === 'compose' && (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.composerScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(250)}>
            {/* Step 1: Category Selection */}
            <View style={styles.sectionCard}>
              <View style={styles.stepHeaderRow}>
                <View style={[styles.stepNumberBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Text style={[styles.stepNumberText, { color: '#F59E0B' }]}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>TRANSMISSION CATEGORY</Text>
                  <Text style={styles.sectionSubtitle}>Select broadcast priority and tone</Text>
                </View>
              </View>

              <View style={styles.categoryColumn}>
                {[
                  {
                    id: 'Announcement',
                    title: 'Campus Announcement',
                    desc: 'General academic updates, events, fests, or campus notices',
                    icon: 'bullhorn-outline',
                    color: '#F59E0B',
                  },
                  {
                    id: 'Notice',
                    title: 'Official Circular',
                    desc: 'Mandatory instructions, examination circulars, fee deadlines',
                    icon: 'file-document-outline',
                    color: '#38BDF8',
                  },
                  {
                    id: 'Emergency',
                    title: 'Emergency Alert',
                    desc: 'High-priority alert requiring immediate student attention',
                    icon: 'alert-octagon-outline',
                    color: '#EF4444',
                  },
                ].map((cat) => {
                  const isActive = broadcastType === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryCard,
                        isActive && {
                          borderColor: cat.color,
                          backgroundColor: `${cat.color}10`,
                        },
                      ]}
                      onPress={() => setBroadcastType(cat.id as BroadcastCategory)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.categoryIconWrap, { backgroundColor: `${cat.color}15` }]}>
                        <MaterialCommunityIcons name={cat.icon as any} size={22} color={cat.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.categoryCardTitle, isActive && { color: cat.color }]}>
                          {cat.title}
                        </Text>
                        <Text style={styles.categoryCardDesc}>{cat.desc}</Text>
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          isActive && { borderColor: cat.color, backgroundColor: cat.color },
                        ]}
                      >
                        {isActive && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Step 2: Message Content */}
            <View style={styles.sectionCard}>
              <View style={styles.stepHeaderRow}>
                <View style={[styles.stepNumberBadge, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                  <Text style={[styles.stepNumberText, { color: '#38BDF8' }]}>2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>MESSAGE HEADLINE & COPY</Text>
                  <Text style={styles.sectionSubtitle}>Draft concise, actionable text for students</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.fieldLabelRow}>
                  <Text style={styles.fieldLabel}>HEADLINE / SUBJECT *</Text>
                  <Text style={styles.charCount}>{title.length}/100</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                  placeholder={
                    broadcastType === 'Emergency'
                      ? 'e.g. CAMPUS ALERT: Immediate Examination Schedule Change'
                      : 'e.g. Mid-Term Semester Examinations Timetable Released'
                  }
                  placeholderTextColor="rgba(255,255,255,0.25)"
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.fieldLabelRow}>
                  <Text style={styles.fieldLabel}>MESSAGE BODY & INSTRUCTIONS *</Text>
                  <Text style={styles.charCount}>{message.length}/1000</Text>
                </View>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={message}
                  onChangeText={setMessage}
                  maxLength={1000}
                  multiline
                  numberOfLines={4}
                  placeholder="Provide all essential instructions, venue details, syllabus references, or rules..."
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>ATTACHED LINK OR CIRCULAR URL (OPTIONAL)</Text>
                <View style={styles.iconInputWrap}>
                  <Feather name="link" size={15} color="rgba(255,255,255,0.4)" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.inlineInput}
                    value={applyUrl}
                    onChangeText={setApplyUrl}
                    placeholder="https://drive.google.com/... or https://college.edu/circular.pdf"
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                </View>
              </View>
            </View>

            {/* Step 3: Audience Cohort Targeting */}
            <View style={styles.sectionCard}>
              <View style={styles.stepHeaderRow}>
                <View style={[styles.stepNumberBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Text style={[styles.stepNumberText, { color: '#10B981' }]}>3</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>TARGET RECIPIENT COHORT</Text>
                  <Text style={styles.sectionSubtitle}>Broadcast college-wide or filter by cohort</Text>
                </View>
              </View>

              {/* Scope Switcher Buttons */}
              <View style={styles.scopeSwitcherRow}>
                <TouchableOpacity
                  style={[styles.scopeChip, targetScope === 'all' && styles.scopeChipActive]}
                  onPress={() => setTargetScope('all')}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="account-group"
                    size={16}
                    color={targetScope === 'all' ? '#38BDF8' : 'rgba(255,255,255,0.5)'}
                  />
                  <Text style={[styles.scopeChipText, targetScope === 'all' && styles.scopeChipTextActive]}>
                    All Students (College-Wide)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.scopeChip, targetScope === 'custom' && styles.scopeChipActive]}
                  onPress={() => setTargetScope('custom')}
                  activeOpacity={0.8}
                >
                  <Feather
                    name="filter"
                    size={14}
                    color={targetScope === 'custom' ? '#38BDF8' : 'rgba(255,255,255,0.5)'}
                  />
                  <Text style={[styles.scopeChipText, targetScope === 'custom' && styles.scopeChipTextActive]}>
                    Target Specific Cohort
                  </Text>
                </TouchableOpacity>
              </View>

              {targetScope === 'custom' && (
                <View style={styles.cohortFiltersBox}>
                  {/* Branch selector */}
                  <Text style={styles.filterGroupTitle}>DEPARTMENT / BRANCH</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                    {BRANCH_LIST.map((b) => (
                      <TouchableOpacity
                        key={b}
                        style={[styles.filterChip, selectedBranch === b && styles.filterChipActive]}
                        onPress={() => setSelectedBranch(b)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.filterChipText, selectedBranch === b && styles.filterChipTextActive]}>
                          {b}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Year selector */}
                  <Text style={styles.filterGroupTitle}>ACADEMIC YEAR</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                    {YEAR_LIST.map((y) => (
                      <TouchableOpacity
                        key={y}
                        style={[styles.filterChip, selectedYear === y && styles.filterChipActive]}
                        onPress={() => setSelectedYear(y)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.filterChipText, selectedYear === y && styles.filterChipTextActive]}>
                          {y}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Section selector */}
                  <Text style={styles.filterGroupTitle}>SECTION (OPTIONAL)</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                    {SECTION_LIST.map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.filterChip, selectedSection === s && styles.filterChipActive]}
                        onPress={() => setSelectedSection(s)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.filterChipText, selectedSection === s && styles.filterChipTextActive]}>
                          {s}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Scope Confirmation Banner */}
              <View style={styles.audienceSummaryBanner}>
                <Feather name="target" size={14} color="#10B981" />
                <Text style={styles.audienceSummaryText}>
                  Audience Scope: <Text style={{ color: '#FFF', fontWeight: '800' }}>{targetAudienceLabel}</Text>
                </Text>
              </View>
            </View>

            {/* Step 4: Delivery Mode */}
            <View style={styles.sectionCard}>
              <View style={styles.stepHeaderRow}>
                <View style={[styles.stepNumberBadge, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                  <Text style={[styles.stepNumberText, { color: '#A855F7' }]}>4</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>DELIVERY TIMING & MODE</Text>
                  <Text style={styles.sectionSubtitle}>Send immediately or schedule for later</Text>
                </View>
              </View>

              <View style={styles.deliveryModeRow}>
                {[
                  { id: 'immediate', label: 'Broadcast Immediately', icon: 'zap' },
                  { id: 'schedule', label: 'Schedule Transmission', icon: 'calendar' },
                  { id: 'draft', label: 'Save Draft Only', icon: 'file-text' },
                ].map((mode) => {
                  const isActive = deliveryMode === mode.id;
                  return (
                    <TouchableOpacity
                      key={mode.id}
                      style={[styles.deliveryBtn, isActive && styles.deliveryBtnActive]}
                      onPress={() => setDeliveryMode(mode.id as DeliveryMode)}
                      activeOpacity={0.7}
                    >
                      <Feather
                        name={mode.icon as any}
                        size={15}
                        color={isActive ? '#38BDF8' : 'rgba(255,255,255,0.4)'}
                      />
                      <Text style={[styles.deliveryBtnText, isActive && styles.deliveryBtnTextActive]}>
                        {mode.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {deliveryMode === 'schedule' && (
                <View style={styles.scheduleInputWrapper}>
                  <Text style={styles.fieldLabel}>SCHEDULED TIMESTAMP (YYYY-MM-DD HH:MM) *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 2026-11-01 09:30"
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    value={scheduledDateStr}
                    onChangeText={setScheduledDateStr}
                  />
                </View>
              )}
            </View>

            {/* Dual Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.previewBtn}
                onPress={() => setShowPreviewModal(true)}
                activeOpacity={0.8}
              >
                <Feather name="eye" size={15} color="#38BDF8" style={{ marginRight: 6 }} />
                <Text style={styles.previewBtnText}>Preview Blast</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.transmitBtn}
                onPress={() => handleSendNotification()}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={
                    broadcastType === 'Emergency'
                      ? ['#DC2626', '#EF4444']
                      : ['#2563EB', '#38BDF8']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.transmitGradient}
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Feather name="send" size={15} color="#FFF" style={{ marginRight: 8 }} />
                      <Text style={styles.transmitBtnText}>
                        {deliveryMode === 'draft'
                          ? 'Save Draft'
                          : deliveryMode === 'schedule'
                          ? 'Schedule Blast'
                          : 'Transmit Broadcast'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      )}

      {/* TAB 2: LOG & ARCHIVE */}
      {activeTab === 'history' && (
        <View style={{ flex: 1 }}>
          {/* History Status Filters */}
          <View style={styles.historyFilterRow}>
            {(['All', 'Sent', 'Scheduled', 'Draft'] as const).map((st) => {
              const isActive = historyStatusFilter === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[styles.historyFilterChip, isActive && styles.historyFilterChipActive]}
                  onPress={() => setHistoryStatusFilter(st)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.historyFilterChipText,
                      isActive && styles.historyFilterChipTextActive,
                    ]}
                  >
                    {st}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#38BDF8" />
              <Text style={styles.loadingText}>Fetching broadcast registry...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.logListContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="broadcast-off" size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyTitle}>No Broadcast Logs Found</Text>
                  <Text style={styles.emptySubtitle}>
                    {historyStatusFilter !== 'All'
                      ? `No broadcasts found matching status: ${historyStatusFilter}.`
                      : 'No announcements have been dispatched from this institution yet.'}
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyActionBtn}
                    onPress={() => setActiveTab('compose')}
                  >
                    <Text style={styles.emptyActionBtnText}>Compose First Announcement</Text>
                  </TouchableOpacity>
                </View>
              }
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInRight.delay(index * 25)}>
                  <TouchableOpacity
                    style={styles.logCard}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDetailItem(item)}
                  >
                    <View style={styles.logCardTop}>
                      <View style={styles.categoryPill}>
                        <Text style={styles.categoryPillText}>{item.type || 'Announcement'}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {renderStatusBadge(item.status)}
                        <TouchableOpacity
                          onPress={() => handleDeleteNotification(item.id)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Feather name="trash-2" size={14} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={styles.logCardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.logCardBody} numberOfLines={2}>
                      {item.message}
                    </Text>

                    <View style={styles.logCardFooter}>
                      <View style={styles.targetAudiencePill}>
                        <Feather name="target" size={11} color="#38BDF8" />
                        <Text style={styles.targetAudiencePillText} numberOfLines={1}>
                          {item.target_branch || 'College-Wide'}
                        </Text>
                      </View>
                      <Text style={styles.logCardDate}>{formatDate(item.created_at)}</Text>
                    </View>

                    {item.apply_url ? (
                      <View style={styles.logLinkRow}>
                        <Feather name="link" size={12} color="#38BDF8" />
                        <Text style={styles.logLinkText} numberOfLines={1}>
                          {item.apply_url}
                        </Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          )}
        </View>
      )}

      {/* Student Feed Preview Modal */}
      <Modal visible={showPreviewModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="smartphone" size={18} color="#38BDF8" />
                <Text style={styles.previewHeaderTitle}>Student Feed Preview</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPreviewModal(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.studentFeedMock}>
              <View style={styles.previewBadgeRow}>
                <View
                  style={[
                    styles.previewTypeBadge,
                    {
                      backgroundColor:
                        broadcastType === 'Emergency'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(245, 158, 11, 0.15)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.previewTypeBadgeText,
                      { color: broadcastType === 'Emergency' ? '#EF4444' : '#F59E0B' },
                    ]}
                  >
                    {broadcastType.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.previewTargetBadge}>
                  <Text style={styles.previewTargetBadgeText}>{targetAudienceLabel}</Text>
                </View>
              </View>

              <Text style={styles.previewMockTitle}>{title || 'Headline Goes Here'}</Text>
              <Text style={styles.previewMockBody}>
                {message || 'Your detailed message will appear here for all targeted students on their live feed.'}
              </Text>

              {applyUrl ? (
                <View style={styles.previewMockCta}>
                  <Text style={styles.previewMockCtaText}>View Attached Document / Link</Text>
                  <Feather name="external-link" size={14} color="#38BDF8" />
                </View>
              ) : null}

              <View style={styles.previewMockFooter}>
                <Text style={styles.previewMockCollege}>{user?.college_name || 'FEEDX Institute'}</Text>
                <Text style={styles.previewMockTime}>Just Now</Text>
              </View>
            </View>

            <View style={styles.previewActionsRow}>
              <TouchableOpacity
                style={styles.previewEditBtn}
                onPress={() => setShowPreviewModal(false)}
              >
                <Text style={styles.previewEditText}>Back to Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewConfirmBtn}
                onPress={() => handleSendNotification()}
                disabled={submitting}
              >
                <LinearGradient
                  colors={['#2563EB', '#38BDF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.previewConfirmGradient}
                >
                  <Text style={styles.previewConfirmText}>Confirm & Dispatch</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Broadcast Log Detail Dossier Modal */}
      {selectedDetailItem && (
        <Modal visible={!!selectedDetailItem} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.detailCard}>
              <View style={styles.previewHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialCommunityIcons name="broadcast" size={20} color="#F59E0B" />
                  <Text style={styles.previewHeaderTitle}>Broadcast Dossier</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedDetailItem(null)}>
                  <Feather name="x" size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
                <View style={styles.detailFieldGroup}>
                  <Text style={styles.detailLabel}>BROADCAST HEADLINE</Text>
                  <Text style={styles.detailValueTitle}>{selectedDetailItem.title}</Text>
                </View>

                <View style={styles.detailFieldGroup}>
                  <Text style={styles.detailLabel}>DISPATCH DETAILS</Text>
                  <Text style={styles.detailValueBody}>{selectedDetailItem.message}</Text>
                </View>

                <View style={styles.detailRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>CATEGORY</Text>
                    <Text style={styles.detailValue}>{selectedDetailItem.type || 'Announcement'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>STATUS</Text>
                    <Text style={[styles.detailValue, { color: '#10B981' }]}>
                      {selectedDetailItem.status || 'Sent'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>TARGET COHORT</Text>
                    <Text style={styles.detailValue}>
                      {selectedDetailItem.target_branch || 'College-Wide'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>TIMESTAMP</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedDetailItem.created_at)}</Text>
                  </View>
                </View>

                {selectedDetailItem.apply_url ? (
                  <TouchableOpacity
                    style={styles.detailUrlBtn}
                    onPress={() => Linking.openURL(selectedDetailItem.apply_url!)}
                  >
                    <Feather name="external-link" size={14} color="#38BDF8" />
                    <Text style={styles.detailUrlBtnText}>Open Circular Link</Text>
                  </TouchableOpacity>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
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
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hubIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  segmentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  segmentBtnTextActive: {
    color: '#F59E0B',
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  composerScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: '#0B1120',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 12,
    ...SHADOWS.small,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
    marginTop: 1,
  },
  categoryColumn: {
    gap: 8,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  categoryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
  },
  categoryCardDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
  },
  inputGroup: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.6,
  },
  charCount: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    height: 46,
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  textAreaInput: {
    height: 85,
    paddingTop: 12,
    lineHeight: 18,
  },
  iconInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    height: 46,
  },
  inlineInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  scopeSwitcherRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scopeChip: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 6,
    paddingHorizontal: 8,
  },
  scopeChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: '#38BDF8',
  },
  scopeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  scopeChipTextActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  cohortFiltersBox: {
    gap: 8,
    paddingTop: 4,
  },
  filterGroupTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    borderColor: '#38BDF8',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  filterChipTextActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  audienceSummaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  audienceSummaryText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  deliveryModeRow: {
    gap: 8,
  },
  deliveryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  deliveryBtnActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  deliveryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  deliveryBtnTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  scheduleInputWrapper: {
    marginTop: 6,
    gap: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  previewBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnText: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 13,
  },
  transmitBtn: {
    flex: 1.6,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  transmitGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transmitBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  historyFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  historyFilterChip: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  historyFilterChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  historyFilterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  historyFilterChipTextActive: {
    color: '#000',
    fontWeight: '900',
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
  logListContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    gap: 10,
  },
  logCard: {
    backgroundColor: '#0B1120',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 6,
    ...SHADOWS.small,
  },
  logCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  logCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  logCardBody: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 17,
  },
  logCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  targetAudiencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  targetAudiencePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  logCardDate: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '600',
  },
  logLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  logLinkText: {
    fontSize: 11,
    color: '#38BDF8',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  emptySubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 18,
  },
  emptyActionBtn: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  emptyActionBtnText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  previewCard: {
    backgroundColor: '#0B1120',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    gap: 14,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  studentFeedMock: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 8,
  },
  previewBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  previewTypeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  previewTypeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  previewTargetBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  previewTargetBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
  },
  previewMockTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  previewMockBody: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },
  previewMockCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  previewMockCtaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  previewMockFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 6,
  },
  previewMockCollege: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  previewMockTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
  },
  previewActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  previewEditBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  previewEditText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
  },
  previewConfirmBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewConfirmGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewConfirmText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  detailCard: {
    backgroundColor: '#0B1120',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 14,
  },
  detailFieldGroup: {
    marginBottom: 10,
    gap: 4,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
  },
  detailValueTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  detailValueBody: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 12,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 2,
  },
  detailUrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    marginTop: 6,
  },
  detailUrlBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
});
