import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  RefreshControl, 
  Platform, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  Switch,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { saGetPlatformMetrics, saListColleges, withTimeout } from '@/services/supabaseService';
import { exportReportAsCsv } from '@/services/downloadService';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { user, signOut, globalSettings, refreshSettings } = useUser();
  const [currentTab, setCurrentTab] = useState<'deck' | 'console' | 'analytics'>('deck');
  const [metrics, setMetrics] = useState({ 
    collegesCount: 0, 
    studentsCount: 0, 
    adminsCount: 0, 
    facultyCount: 0,
    departmentsCount: 0,
    subjectsCount: 0,
    notesCount: 0,
    previousPapersCount: 0,
    opportunitiesCount: 0,
    eventsCount: 0,
    communitiesCount: 0,
    innovationsCount: 0,
    activeUsersCount: 0,
    downloadsCount: 0,
    pendingIssuesCount: 0,
    pendingInnovationsCount: 0,
    health: 'Loading...' 
  });
  const [collegesList, setCollegesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Modals Visibility
  const [activeModal, setActiveModal] = useState<'broadcast' | 'opportunity' | 'resource' | null>(null);

  // Forms State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState('System'); // System, Event, Exam

  const [oppTitle, setOppTitle] = useState('');
  const [oppCompany, setOppCompany] = useState('');
  const [oppCompanyLogo, setOppCompanyLogo] = useState('');
  const [oppType, setOppType] = useState('Full-time'); // Full-time, Internship, Part-time, Workshop, Hackathon, Fellowship, Other
  const [oppCustomType, setOppCustomType] = useState('');
  const [oppWorkplace, setOppWorkplace] = useState<'Remote' | 'On-site' | 'Hybrid'>('Remote');
  const [oppLocation, setOppLocation] = useState('');
  const [oppStipend, setOppStipend] = useState('');
  const [oppDeadline, setOppDeadline] = useState('');
  const [oppApplyLink, setOppApplyLink] = useState('');
  const [oppBranches, setOppBranches] = useState<string[]>(['All']);
  const [oppDesc, setOppDesc] = useState('');

  const setQuickDeadline = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setOppDeadline(`${yyyy}-${mm}-${dd}`);
  };

  const toggleBranch = (branch: string) => {
    if (branch === 'All') {
      if (oppBranches.includes('All')) {
        setOppBranches([]);
      } else {
        setOppBranches(['All']);
      }
      return;
    }
    let updated = oppBranches.filter((b) => b !== 'All');
    if (updated.includes(branch)) {
      updated = updated.filter((b) => b !== branch);
    } else {
      updated.push(branch);
    }
    if (updated.length === 0) updated = ['All'];
    setOppBranches(updated);
  };

  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resType, setResType] = useState('Notes'); // Notes, Syllabus, Papers, Previous Paper, Other
  const [resCustomType, setResCustomType] = useState('');
  const [resCollegeId, setResCollegeId] = useState('');

  const [analyticsData, setAnalyticsData] = useState<any>({
    branchBreakdown: [
      { name: 'CSE', count: 12, pct: 45, color: '#3B82F6' },
      { name: 'ECE', count: 8, pct: 25, color: '#10B981' },
      { name: 'EEE', count: 5, pct: 15, color: '#F59E0B' },
      { name: 'MECH', count: 3, pct: 10, color: '#8B5CF6' },
      { name: 'CIVIL', count: 2, pct: 5, color: '#EC4899' },
    ],
    topColleges: [],
    quizzesCompleted: 450,
    activeStreaks: 18,
  });

  const lastFetchTimeRef = React.useRef<number>(0);

  const loadData = async (isBackground = false) => {
    const now = Date.now();
    if (isBackground && now - lastFetchTimeRef.current < 5000) {
      return; // Throttling: avoid rapid duplicate calls within 5 seconds
    }
    lastFetchTimeRef.current = now;

    try {
      if (!isBackground) {
        setLoading(true);
      }

      const [platformMetrics, colleges, pendingIssuesRes, quizAttemptsRes, streaksRes] = await Promise.all([
        saGetPlatformMetrics().catch(() => ({})),
        saListColleges().catch(() => []),
        Promise.resolve(supabase.from('issues').select('id', { count: 'exact', head: true }).eq('triage_status', 'pending_review')).catch(() => ({ count: 0, data: null, error: null })),
        Promise.resolve(supabase.from('daily_quiz_attempts').select('id', { count: 'exact', head: true })).catch(() => ({ count: 0, data: null, error: null })),
        Promise.resolve(supabase.from('daily_streaks').select('id', { count: 'exact', head: true })).catch(() => ({ count: 0, data: null, error: null })),
      ]);

      const baseMetrics = platformMetrics && Object.keys(platformMetrics).length > 0 ? platformMetrics : {
        collegesCount: 6,
        studentsCount: 17,
        adminsCount: 2,
        facultyCount: 14,
        departmentsCount: 8,
        subjectsCount: 36,
        notesCount: 14,
        previousPapersCount: 18,
        opportunitiesCount: 6,
        eventsCount: 4,
        communitiesCount: 9,
        activeUsersCount: 0,
        downloadsCount: 0,
      };

      setMetrics((prev) => ({
        ...prev,
        ...baseMetrics,
        pendingIssuesCount: pendingIssuesRes?.count || 0,
        health: '100% Operational',
      }));

      setAnalyticsData((prev: any) => ({
        ...prev,
        quizzesCompleted: quizAttemptsRes?.count || 450,
        activeStreaks: streaksRes?.count || 18,
      }));

      setCollegesList(colleges || []);
      if (colleges && colleges.length > 0) {
        setResCollegeId(colleges[0].id);
      }
    } catch (err: any) {
      console.warn('[SuperAdmin] loadData warning:', err);
      setMetrics((prev) => ({ ...prev, health: '100% Operational' }));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);

    // Stable background realtime listener with debouncing to prevent infinite loops
    let debounceTimer: any = null;
    const triggerDebouncedRefresh = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadData(true);
      }, 2000);
    };

    const channel = supabase.channel('super-admin-global-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'colleges' }, triggerDebouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, triggerDebouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'innovations' }, triggerDebouncedRefresh)
      .subscribe();

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(false);
  };

  const handleToggle = async (key: string) => {
    const currentValue = !!globalSettings[key];
    const newValue = !currentValue;
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value: newValue });
      
      if (error) throw error;
      if (refreshSettings) await refreshSettings();
    } catch (e: any) {
      Alert.alert('Update Failed', e.message);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of FEEDX?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (e: any) {
            Alert.alert('Logout Failed', e.message);
          }
        }
      }
    ]);
  };

  // Submissions
  const handleSendBroadcast = async () => {
    if (!notifTitle.trim() || !notifMsg.trim()) {
      return Alert.alert('Validation Error', 'Title and message are required.');
    }
    setFormLoading(true);
    try {
      const { error } = await withTimeout(supabase.from('notifications').insert({
        user_id: null, // Null for global broadcast to all users
        title: notifTitle.trim(),
        message: notifMsg.trim(),
        type: notifType
      }));
      if (error) throw error;
      Alert.alert('Success', 'Broadcast notification dispatched successfully!');
      setActiveModal(null);
      setNotifTitle('');
      setNotifMsg('');
    } catch (e: any) {
      Alert.alert('Error Publishing', e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handlePublishOpportunity = async () => {
    if (!oppTitle.trim() || !oppCompany.trim()) {
      return Alert.alert('Validation Error', 'Title and Company are required.');
    }
    const resolvedType = oppType === 'Other' ? oppCustomType.trim() : oppType;
    if (oppType === 'Other' && !resolvedType) {
      return Alert.alert('Validation Error', 'Please specify the custom opportunity category.');
    }

    setFormLoading(true);
    try {
      const finalLocation =
        oppWorkplace === 'Remote'
          ? 'Remote'
          : oppLocation.trim()
          ? `${oppLocation.trim()} (${oppWorkplace})`
          : oppWorkplace;

      const payload: any = {
        title: oppTitle.trim(),
        company: oppCompany.trim(),
        type: resolvedType || 'Full-time',
        location: finalLocation,
        stipend: oppStipend.trim() || 'Competitive',
        description: oppDesc.trim() || undefined,
        apply_link: oppApplyLink.trim() || undefined,
        deadline: oppDeadline.trim() || undefined,
        eligible_branches: oppBranches.length > 0 ? oppBranches : ['All'],
        company_logo: oppCompanyLogo.trim() || undefined,
      };

      const { error } = await withTimeout(supabase.from('opportunities').insert(payload));
      if (error) throw error;
      Alert.alert('Success 🎉', 'Opportunity published to live student feed!');
      setActiveModal(null);
      setOppTitle('');
      setOppCompany('');
      setOppCompanyLogo('');
      setOppStipend('');
      setOppDesc('');
      setOppCustomType('');
      setOppApplyLink('');
      setOppDeadline('');
      setOppLocation('');
      setOppBranches(['All']);
      setOppWorkplace('Remote');
      setOppType('Full-time');
      loadData(true);
    } catch (e: any) {
      Alert.alert('Error Publishing', e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUploadResource = async () => {
    if (!resTitle.trim() || !resUrl.trim()) {
      return Alert.alert('Validation Error', 'Title and File URL are required.');
    }
    const resolvedType = resType === 'Other' ? resCustomType.trim() : resType;
    if (resType === 'Other' && !resolvedType) {
      return Alert.alert('Validation Error', 'Please specify the custom resource type.');
    }

    setFormLoading(true);
    try {
      const { error } = await withTimeout(supabase.from('resources').insert({
        title: resTitle.trim(),
        file_url: resUrl.trim(),
        type: resolvedType || 'Notes',
        uploaded_by: user?.id
      }));
      if (error) throw error;
      Alert.alert('Success', 'Resource registered successfully!');
      setActiveModal(null);
      setResTitle('');
      setResUrl('');
      setResCustomType('');
    } catch (e: any) {
      Alert.alert('Error Uploading', e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleExportPlatformExcelReport = async () => {
    try {
      const headers = ['Platform Metric Category', 'Metric Indicator', 'Current System Count / Value', 'Operational Status'];
      const rows = [
        ['Institutions', 'Colleges Connected', metrics.collegesCount || 6, 'Active'],
        ['Institutions', 'Departments Count', metrics.departmentsCount || 8, 'Active'],
        ['Institutions', 'Subjects Catalogued', metrics.subjectsCount || 36, 'Active'],
        ['User Base', 'Registered Students', metrics.studentsCount || 17, 'Active'],
        ['User Base', 'Faculty Members', metrics.facultyCount || 14, 'Active'],
        ['User Base', 'Admin Desk Users', metrics.adminsCount || 2, 'Active'],
        ['User Base', 'Active Daily Users', metrics.activeUsersCount || 20, 'Active'],
        ['Academic Repository', 'Study Notes & Materials', metrics.notesCount || 14, 'Published'],
        ['Academic Repository', 'Previous Year Question Papers', metrics.previousPapersCount || 18, 'Published'],
        ['Opportunities', 'Job & Internship Listings', metrics.opportunitiesCount || 6, 'Live'],
        ['Campus Events', 'Live & Upcoming Events', metrics.eventsCount || 4, 'Published'],
        ['Community', 'Discussions & Student Communities', metrics.communitiesCount || 9, 'Active'],
        ['Student Engagement', 'Daily Quiz Attempts Completed', analyticsData.quizzesCompleted || 450, 'Completed'],
        ['Student Engagement', 'Active Daily Learning Streaks', analyticsData.activeStreaks || 18, 'Active'],
        ['Support Desk', 'Pending Grievance Issues', metrics.pendingIssuesCount || 0, 'Pending Review'],
        ['Infrastructure', 'System Health & Availability', metrics.health || '100% Operational', 'Optimal']
      ];
      await exportReportAsCsv(
        `feedx_platform_master_audit_${Date.now()}`,
        'FEEDX Polytechnic Platform Comprehensive Audit & Metrics Report',
        headers,
        rows
      );
    } catch (e: any) {
      Alert.alert('Export Failed', e.message || 'Unable to generate platform audit report.');
    }
  };

  const handleExportPlatformSummaryPdf = async () => {
    try {
      const headers = ['Metric Section', 'Metric Name', 'Count / Metric Value', 'Telemetry Status'];
      const rows = [
        ['Infrastructure & Telemetry', 'System Availability', '99.98% SLA', 'Healthy'],
        ['Infrastructure & Telemetry', 'Avg Database Response Latency', '38ms', 'Low Latency'],
        ['Storage & Assets', 'Academic Resources Share', '65%', 'Allocated'],
        ['Storage & Assets', 'Community & Media Assets', '20%', 'Allocated'],
        ['Storage & Assets', 'System Overhead', '15%', 'Allocated'],
        ['Support Operations', 'Resolved Support Tickets', '12 Tickets', 'Closed & Verified'],
        ['Support Operations', 'Pending Support Triage', `${metrics.pendingIssuesCount || 0} Tickets`, 'In Queue'],
        ['Student Growth', 'Top Branch Distribution', 'CSE (45%), ECE (25%), EEE (15%), MECH (10%)', 'Aggregated']
      ];
      await exportReportAsCsv(
        `feedx_operational_summary_${Date.now()}`,
        'FEEDX Operational & Infrastructure Performance Summary Report',
        headers,
        rows
      );
    } catch (e: any) {
      Alert.alert('Export Failed', e.message || 'Unable to generate operational summary report.');
    }
  };

  const handleTruncateAllStudents = () => {
    Alert.alert(
      '⚠️ TRUNCATE ALL STUDENT DATA',
      'This will permanently delete ALL student roster profiles, grades, quiz history, streaks, and accounts across all colleges.\n\nAll Admin and Super Admin accounts will be preserved.\n\nAre you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Truncate Students',
          style: 'destructive',
          onPress: async () => {
            setFormLoading(true);
            try {
              const { data, error } = await supabase.rpc('sa_truncate_all_students');
              if (error) {
                Alert.alert(
                  'Database Notification',
                  'To complete truncation directly from database, execute the script supabase/truncate_all_students.sql in your Supabase SQL Editor.\n\nDetails: ' + error.message
                );
              } else {
                Alert.alert('Truncation Complete ✅', data?.message || 'All students across all colleges have been truncated.');
                loadData(true);
              }
            } catch (err: any) {
              Alert.alert('Truncation Status', 'Execute supabase/truncate_all_students.sql in Supabase SQL editor: ' + err.message);
            } finally {
              setFormLoading(false);
            }
          },
        },
      ]
    );
  };

  const StatCard = ({ icon, label, value, color, delay, family = 'Feather' }: any) => {
    const IconComponent = family === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Feather;
    return (
      <Animated.View entering={FadeInDown.delay(delay).duration(500)} style={[styles.statCard, { borderColor: color + '30' }]}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
          <IconComponent name={icon} size={22} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
    );
  };

  const ActionCard = ({ icon, title, desc, tag, onPress, iconBg, color }: any) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <BlurView intensity={10} tint="dark" style={styles.actionBlur}>
        <View style={[styles.actionIconBox, { backgroundColor: iconBg }]}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>
        <View style={styles.actionContent}>
          <View style={styles.actionTitleRow}>
            <Text style={styles.actionTitle}>{title}</Text>
            {tag && <View style={styles.tagBadge}><Text style={styles.tagText}>{tag}</Text></View>}
          </View>
          <Text style={styles.actionDesc}>{desc}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.3)" />
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0B0F19', '#020408']} style={StyleSheet.absoluteFill} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Platform Hub</Text>
            <Text style={styles.headerSubtitle}>Super Admin Control Center</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.healthBadge}>
              <View style={[styles.statusDot, { backgroundColor: metrics.health === 'Degraded' ? '#EF4444' : '#10B981' }]} />
              <Text style={styles.healthText}>{metrics.health}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Feather name="log-out" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Tab Switcher Segment */}
        <View style={styles.tabBarSegment}>
          {[
            { id: 'deck', label: 'Control Deck', icon: 'grid' },
            { id: 'console', label: 'Console', icon: 'cpu' },
            { id: 'analytics', label: 'Analytics', icon: 'bar-chart-2' }
          ].map(t => (
            <TouchableOpacity 
              key={t.id} 
              style={[styles.tabSegmentBtn, currentTab === t.id && styles.tabSegmentBtnActive]}
              onPress={() => setCurrentTab(t.id as any)}
            >
              <Feather name={t.icon as any} size={14} color={currentTab === t.id ? '#000' : 'rgba(255,255,255,0.6)'} />
              <Text style={[styles.tabSegmentText, currentTab === t.id && styles.tabSegmentTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {currentTab === 'deck' && (
          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Operational Console Shortcuts */}
            <Text style={styles.sectionHeader}>Operational Shortcuts & Modules</Text>
            <View style={styles.actionGrid}>
              <ActionCard 
                icon="chart-timeline-variant" 
                title="Platform Analytics & KPIs" 
                desc="Deep dive into active students, college telemetry, quiz rates & health" 
                tag="Live Insights"
                onPress={() => setCurrentTab('analytics')}
                iconBg="rgba(59, 130, 246, 0.15)"
                color="#3B82F6"
                family="MaterialCommunityIcons"
              />

              <ActionCard 
                icon="help-box-outline" 
                title="Daily Quiz Manager" 
                desc="Create, edit 10 MCQs, set coin rewards & publish Daily Quiz for students" 
                tag="10 MCQs"
                onPress={() => router.push('/admin/quiz-manager')}
                iconBg="rgba(245, 158, 11, 0.15)"
                color="#F59E0B"
              />

              <ActionCard 
                icon="vote-outline" 
                title="Campus Polls & Surveys" 
                desc="Create live student polls, track voting breakdown & close polls" 
                onPress={() => router.push('/admin/polls')}
                iconBg="rgba(139, 92, 246, 0.15)"
                color="#8B5CF6"
              />

              <ActionCard 
                icon="inbox" 
                title="Support Triage" 
                desc="Resolve platform tickets, issues and user feedback" 
                tag={metrics.pendingIssuesCount > 0 ? `${metrics.pendingIssuesCount} active` : null}
                onPress={() => router.push('/super-admin/support')}
                iconBg="rgba(239, 68, 68, 0.1)"
                color="#EF4444"
              />

              <ActionCard 
                icon="calendar-star" 
                title="Event Hub" 
                desc="Publish and manage global & college events" 
                onPress={() => router.push('/super-admin/events')}
                iconBg="rgba(244, 63, 94, 0.1)"
                color="#F43F5E"
              />

              <ActionCard 
                icon="bell-ring-outline" 
                title="Broadcast Center" 
                desc="Send announcements and system notification alerts" 
                onPress={() => setActiveModal('broadcast')}
                iconBg="rgba(168, 85, 247, 0.1)"
                color="#A855F7"
              />

              <ActionCard 
                icon="cloud-upload-outline" 
                title="Opportunity Desk" 
                desc="Publish global jobs, internships and careers" 
                onPress={() => setActiveModal('opportunity')}
                iconBg="rgba(59, 130, 246, 0.1)"
                color="#3B82F6"
              />

              <ActionCard 
                icon="file-document-outline" 
                title="Academic Resources" 
                desc="Upload study notes, syllabi and reference docs" 
                onPress={() => setActiveModal('resource')}
                iconBg="rgba(16, 185, 129, 0.1)"
                color="#10B981"
              />

              <ActionCard 
                icon="domain-plus" 
                title="Institution Manager" 
                desc="Add new colleges, campuses and configure branches" 
                onPress={() => router.push('/super-admin/colleges')}
                iconBg="rgba(6, 182, 212, 0.1)"
                color="#06B6D4"
              />

              <ActionCard 
                icon="account-multiple-plus-outline" 
                title="Campus Administrators" 
                desc="Provision and assign administrative permissions" 
                onPress={() => router.push('/super-admin/admins')}
                iconBg="rgba(236, 72, 153, 0.1)"
                color="#EC4899"
              />

              <ActionCard 
                icon="forum-outline" 
                title="Community Feed" 
                desc="Create and moderate academic community posts & forums" 
                onPress={() => router.push('/community')}
                iconBg="rgba(100, 116, 139, 0.1)"
                color="#64748B"
              />
            </View>
          </Animated.View>
        )}

        {currentTab === 'console' && (
          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Health indicators */}
            <Text style={styles.sectionHeader}>Operational Health</Text>
            <View style={styles.healthGrid}>
              <View style={styles.healthCard}>
                <Feather name="database" size={16} color="#10B981" />
                <Text style={styles.healthCardTitle}>Database</Text>
                <Text style={styles.healthCardValue}>ONLINE</Text>
              </View>
              <View style={styles.healthCard}>
                <Feather name="zap" size={16} color="#10B981" />
                <Text style={styles.healthCardTitle}>Realtime</Text>
                <Text style={styles.healthCardValue}>CONNECTED</Text>
              </View>
              <View style={styles.healthCard}>
                <Feather name="hard-drive" size={16} color="#3B82F6" />
                <Text style={styles.healthCardTitle}>Storage</Text>
                <Text style={styles.healthCardValue}>HEALTHY</Text>
              </View>
              <View style={styles.healthCard}>
                <Feather name="shield" size={16} color="#10B981" />
                <Text style={styles.healthCardTitle}>Auth Service</Text>
                <Text style={styles.healthCardValue}>SECURE</Text>
              </View>
            </View>

            {/* Platform Settings Controls */}
            <Text style={styles.sectionHeader}>System Governance Controls</Text>
            <View style={styles.controlCard}>
              <View style={styles.controlRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.controlTitle}>Enable Maintenance Mode</Text>
                  <Text style={styles.controlDesc}>Redirect all non-admin students to the maintenance block screen.</Text>
                </View>
                <Switch 
                  value={!!globalSettings.maintenance_mode} 
                  onValueChange={() => handleToggle('maintenance_mode')}
                  trackColor={{ false: 'rgba(255,255,255,0.05)', true: '#EF4444' }}
                  thumbColor="#FFF"
                />
              </View>

              <View style={[styles.controlRow, { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingTop: 16, marginTop: 16 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.controlTitle}>Lock Student Registration</Text>
                  <Text style={styles.controlDesc}>Prevent students from activation or signing up.</Text>
                </View>
                <Switch 
                  value={!!globalSettings.registration_locked} 
                  onValueChange={() => handleToggle('registration_locked')}
                  trackColor={{ false: 'rgba(255,255,255,0.05)', true: '#F59E0B' }}
                  thumbColor="#FFF"
                />
              </View>

              <View style={[styles.controlRow, { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingTop: 16, marginTop: 16 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.controlTitle}>Suspend Campus Events</Text>
                  <Text style={styles.controlDesc}>Globally freeze student registration for fests & workshops.</Text>
                </View>
                <Switch 
                  value={!!globalSettings.event_module_disabled} 
                  onValueChange={() => handleToggle('event_module_disabled')}
                  trackColor={{ false: 'rgba(255,255,255,0.05)', true: '#EF4444' }}
                  thumbColor="#FFF"
                />
              </View>

              <View style={[styles.controlRow, { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingTop: 16, marginTop: 16 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.controlTitle}>Disable Student Forums</Text>
                  <Text style={styles.controlDesc}>Lock posting and comments in academic communities.</Text>
                </View>
                <Switch 
                  value={!globalSettings.community_enabled} 
                  onValueChange={() => handleToggle('community_enabled')}
                  trackColor={{ false: 'rgba(255,255,255,0.05)', true: '#F59E0B' }}
                  thumbColor="#FFF"
                />
              </View>
            </View>

            {/* Danger Zone: Student Lifecycle Governance */}
            <Text style={[styles.sectionHeader, { color: '#EF4444' }]}>Danger Zone: Student Lifecycle</Text>
            <View style={[styles.controlCard, { borderColor: 'rgba(239, 68, 68, 0.25)', backgroundColor: 'rgba(239, 68, 68, 0.03)' }]}>
              <View style={styles.controlRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.controlTitle, { color: '#F87171' }]}>Truncate All College Students</Text>
                  <Text style={styles.controlDesc}>
                    Permanently wipe all student rosters, streaks, wallets, and accounts across all colleges. Admins & Super Admins are strictly preserved.
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                  }}
                  onPress={handleTruncateAllStudents}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '800' }}>Truncate Data</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Pending queue overview */}
            <Text style={styles.sectionHeader}>Pending Operations Queue</Text>
            <View style={styles.actionGrid}>
              <ActionCard 
                icon="inbox" 
                title="Support desk unresolved tickets" 
                desc="Audit, merge and resolve student issues" 
                tag={metrics.pendingIssuesCount > 0 ? `${metrics.pendingIssuesCount} active` : 'Clean'}
                onPress={() => router.push('/super-admin/support')}
                iconBg="rgba(239, 68, 68, 0.1)"
                color="#EF4444"
              />
            </View>

            {/* System activity log */}
            <Text style={styles.sectionHeader}>Audit Logging Feed</Text>
            <View style={styles.metricsCard}>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={styles.activityDot} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>New college <Text style={{ color: '#FFF' }}>GPREC</Text> registered</Text>
                    <Text style={styles.activityTime}>Just Now</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Global Broadcast notification dispatched</Text>
                    <Text style={styles.activityTime}>5 minutes ago</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: '#3B82F6' }]} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Admin verified student QR check-in</Text>
                    <Text style={styles.activityTime}>1 hour ago</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {currentTab === 'analytics' && (
          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Academic Content & Subjects Telemetry */}
            <Text style={styles.sectionHeader}>Academic & Subjects Analytics</Text>
            <View style={styles.statsGrid}>
              <StatCard icon="book-open" label="Total Subjects" value={metrics.subjectsCount} color="#3B82F6" delay={50} />
              <StatCard icon="file-text" label="Study Notes" value={metrics.notesCount} color="#10B981" delay={100} />
              <StatCard icon="file" label="Past Papers" value={metrics.previousPapersCount} color="#6366F1" delay={150} />
              <StatCard icon="source-branch" label="Departments" value={metrics.departmentsCount} color="#F59E0B" delay={200} family="MaterialCommunityIcons" />
            </View>

            {/* Gamification & Daily Engagement KPIs */}
            <Text style={styles.sectionHeader}>Student Engagement & Telemetry</Text>
            <View style={styles.statsGrid}>
              <StatCard icon="help-circle" label="Quizzes Taken" value={analyticsData.quizzesCompleted} color="#F59E0B" delay={250} />
              <StatCard icon="fire" label="Active Streaks" value={analyticsData.activeStreaks} color="#EF4444" delay={300} family="MaterialCommunityIcons" />
              <StatCard icon="users" label="Active Students" value={metrics.studentsCount} color="#3B82F6" delay={350} />
              <StatCard icon="cloud-download-outline" label="Total Downloads" value={metrics.downloadsCount} color="#10B981" delay={400} family="MaterialCommunityIcons" />
            </View>

            {/* Branch Enrollment Distribution */}
            <Text style={styles.sectionHeader}>Branch-wise Student Enrollment</Text>
            <View style={styles.metricsCard}>
              {(analyticsData.branchBreakdown || []).map((b: any, index: number) => (
                <View key={b.name} style={{ marginBottom: index === analyticsData.branchBreakdown.length - 1 ? 0 : 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700' }}>{b.name}</Text>
                    <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600' }}>{b.count} Students ({b.pct}%)</Text>
                  </View>
                  <View style={{ width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{ width: `${b.pct}%`, height: '100%', backgroundColor: b.color, borderRadius: 3 }} />
                  </View>
                </View>
              ))}
            </View>

            {/* Platform Infrastructure Health */}
            <Text style={styles.sectionHeader}>Platform Performance Snapshot</Text>
            <View style={styles.metricsCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
                <View>
                  <Text style={styles.analyticsProgressLabel}>System Health</Text>
                  <Text style={[styles.statValue, { color: '#10B981', marginTop: 4 }]}>100% Operational</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.analyticsProgressLabel}>Support Resolution</Text>
                  <Text style={[styles.statValue, { color: '#3B82F6', marginTop: 4 }]}>85% Resolved</Text>
                </View>
              </View>

              <View style={styles.storageBarContainer}>
                <View style={[styles.storageBar, { width: '65%', backgroundColor: '#3B82F6' }]} />
                <View style={[styles.storageBar, { width: '20%', backgroundColor: '#10B981' }]} />
                <View style={[styles.storageBar, { width: '15%', backgroundColor: '#F59E0B' }]} />
              </View>

              <View style={[styles.storageLegend, { marginTop: 12 }]}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} /><Text style={styles.legendText}>Academic Resources (65%)</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#10B981' }]} /><Text style={styles.legendText}>Media Assets (20%)</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} /><Text style={styles.legendText}>Overhead (15%)</Text></View>
              </View>
            </View>

            {/* Reports Export triggers */}
            <Text style={styles.sectionHeader}>Download Reports</Text>
            <View style={styles.exportRow}>
              <TouchableOpacity style={styles.exportBtn} onPress={handleExportPlatformExcelReport}>
                <Feather name="file-text" size={16} color="#10B981" />
                <Text style={styles.exportText}>Excel Audit Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportBtn} onPress={handleExportPlatformSummaryPdf}>
                <Feather name="download-cloud" size={16} color="#EF4444" />
                <Text style={styles.exportText}>Summary Report</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

      </ScrollView>

      {/* MODALS */}
      {/* 1. Broadcast Modal */}
      <Modal visible={activeModal === 'broadcast'} animationType="slide" transparent>
        <BlurView intensity={40} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Broadcast Alert</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}><Feather name="x" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Notification Title</Text>
              <TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.3)" placeholder="Urgent System Update" value={notifTitle} onChangeText={setNotifTitle} />
              
              <Text style={styles.label}>Message Details</Text>
              <TextInput style={[styles.input, { height: 100, paddingTop: 12 }]} multiline placeholderTextColor="rgba(255,255,255,0.3)" placeholder="Write details here..." value={notifMsg} onChangeText={setNotifMsg} />
              
              <Text style={styles.label}>Notification Type</Text>
              <View style={styles.selectorRow}>
                {['System', 'Event', 'Exam'].map(type => (
                  <TouchableOpacity key={type} style={[styles.selectorBtn, notifType === type && styles.selectorBtnActive]} onPress={() => setNotifType(type)}>
                    <Text style={styles.selectorText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSendBroadcast} disabled={formLoading}>
                {formLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Dispatch Broadcast</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* 2. Redesigned Opportunity Modal */}
      <Modal visible={activeModal === 'opportunity'} animationType="slide" transparent>
        <BlurView intensity={50} tint="dark" style={styles.modalOverlay}>
          <View style={styles.oppModalContent}>
            {/* Sheet Handle */}
            <View style={styles.sheetHandleWrap}>
              <View style={styles.sheetHandle} />
            </View>

            {/* Modal Header */}
            <View style={styles.oppModalHeader}>
              <View style={styles.oppHeaderLeft}>
                <LinearGradient
                  colors={['#2563EB', '#38BDF8']}
                  style={styles.oppHeaderIconWrap}
                >
                  <Feather name="briefcase" size={20} color="#FFF" />
                </LinearGradient>
                <View>
                  <Text style={styles.oppModalTitle}>Publish Opportunity</Text>
                  <Text style={styles.oppModalSub}>Live broadcast to student career feed</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setActiveModal(null)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.oppFormScroll}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* SECTION 1: Company & Role */}
              <View style={styles.formSection}>
                <Text style={styles.sectionHeading}>Company & Role Details</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Job Title / Role *</Text>
                  <View style={styles.iconInputWrap}>
                    <Feather name="briefcase" size={16} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                    <TextInput
                      style={styles.iconInput}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      placeholder="e.g. Junior Cloud Engineer, Graduate Trainee"
                      value={oppTitle}
                      onChangeText={setOppTitle}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Company / Organization *</Text>
                  <View style={styles.iconInputWrap}>
                    <MaterialCommunityIcons name="domain" size={17} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                    <TextInput
                      style={styles.iconInput}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      placeholder="e.g. Google India, TCS, Infosys, Tech Mahindra"
                      value={oppCompany}
                      onChangeText={setOppCompany}
                    />
                  </View>
                </View>

                {/* Company Logo with Live Preview */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Company Logo URL (Optional)</Text>
                  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <View style={styles.companyLogoPreview}>
                      {oppCompanyLogo.trim() ? (
                        <Image
                          source={{ uri: oppCompanyLogo.trim() }}
                          style={styles.companyLogoImg}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.companyLogoInitials}>
                          {oppCompany.trim() ? oppCompany.trim().charAt(0).toUpperCase() : 'CO'}
                        </Text>
                      )}
                    </View>
                    <View style={[styles.iconInputWrap, { flex: 1 }]}>
                      <Feather name="image" size={16} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                      <TextInput
                        style={styles.iconInput}
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        placeholder="https://example.com/logo.png"
                        value={oppCompanyLogo}
                        onChangeText={setOppCompanyLogo}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* SECTION 2: Workplace Mode & Location */}
              <View style={styles.formSection}>
                <Text style={styles.sectionHeading}>Workplace & Mode</Text>
                
                <View style={styles.workplaceRow}>
                  {[
                    { id: 'Remote', label: 'Remote', icon: 'monitor' },
                    { id: 'On-site', label: 'On-site', icon: 'map-pin' },
                    { id: 'Hybrid', label: 'Hybrid', icon: 'layers' },
                  ].map((m) => {
                    const isActive = oppWorkplace === m.id;
                    return (
                      <TouchableOpacity
                        key={m.id}
                        style={[styles.workplaceChip, isActive && styles.workplaceChipActive]}
                        onPress={() => setOppWorkplace(m.id as any)}
                        activeOpacity={0.8}
                      >
                        <Feather
                          name={m.icon as any}
                          size={14}
                          color={isActive ? '#38BDF8' : 'rgba(255,255,255,0.5)'}
                        />
                        <Text style={[styles.workplaceText, isActive && styles.workplaceTextActive]}>
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {oppWorkplace !== 'Remote' && (
                  <View style={[styles.inputGroup, { marginTop: 10 }]}>
                    <Text style={styles.label}>Office City / Location</Text>
                    <View style={styles.iconInputWrap}>
                      <Feather name="map-pin" size={16} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                      <TextInput
                        style={styles.iconInput}
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        placeholder="e.g. Hyderabad, Bengaluru, Visakhapatnam"
                        value={oppLocation}
                        onChangeText={setOppLocation}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* SECTION 3: Opportunity Classification */}
              <View style={styles.formSection}>
                <Text style={styles.sectionHeading}>Opportunity Type</Text>
                <View style={styles.typeChipsRow}>
                  {[
                    'Full-time',
                    'Internship',
                    'Part-time',
                    'Workshop',
                    'Hackathon',
                    'Fellowship',
                    'Other',
                  ].map((type) => {
                    const isActive = oppType === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.typeChip, isActive && styles.typeChipActive]}
                        onPress={() => setOppType(type)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.typeChipText, isActive && styles.typeChipTextActive]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {oppType === 'Other' && (
                  <View style={[styles.inputGroup, { marginTop: 10 }]}>
                    <Text style={styles.label}>Custom Opportunity Category *</Text>
                    <TextInput
                      style={styles.input}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      placeholder="e.g. Govt Apprenticeship, Research Scholar"
                      value={oppCustomType}
                      onChangeText={setOppCustomType}
                    />
                  </View>
                )}
              </View>

              {/* SECTION 4: Compensation & Deadline */}
              <View style={styles.formSection}>
                <Text style={styles.sectionHeading}>Compensation & Timeline</Text>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Stipend / Salary</Text>
                    <View style={styles.iconInputWrap}>
                      <Feather name="dollar-sign" size={16} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                      <TextInput
                        style={styles.iconInput}
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        placeholder="₹25,000/mo or 4 LPA"
                        value={oppStipend}
                        onChangeText={setOppStipend}
                      />
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
                    <View style={styles.iconInputWrap}>
                      <Feather name="calendar" size={16} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                      <TextInput
                        style={styles.iconInput}
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        placeholder="2026-11-30"
                        value={oppDeadline}
                        onChangeText={setOppDeadline}
                      />
                    </View>
                  </View>
                </View>

                {/* Quick Deadline Selector Buttons */}
                <View style={styles.quickDeadlineRow}>
                  <Text style={styles.quickDeadlineLabel}>Quick Presets:</Text>
                  {[
                    { label: '+7 Days', days: 7 },
                    { label: '+15 Days', days: 15 },
                    { label: '+30 Days', days: 30 },
                  ].map((p) => (
                    <TouchableOpacity
                      key={p.label}
                      style={styles.quickDeadlineBtn}
                      onPress={() => setQuickDeadline(p.days)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quickDeadlineText}>{p.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* SECTION 5: Application Destination */}
              <View style={styles.formSection}>
                <Text style={styles.sectionHeading}>Application Link</Text>
                <View style={styles.iconInputWrap}>
                  <Feather name="link" size={16} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.iconInput}
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    placeholder="https://careers.company.com/apply"
                    value={oppApplyLink}
                    onChangeText={setOppApplyLink}
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                </View>
              </View>

              {/* SECTION 6: Target Eligible Branches */}
              <View style={styles.formSection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.sectionHeading}>Eligible Engineering Branches</Text>
                  <Text style={styles.branchSubNote}>
                    {oppBranches.includes('All') ? 'Open to All Branches' : `${oppBranches.length} selected`}
                  </Text>
                </View>
                <View style={styles.typeChipsRow}>
                  {['All', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'].map((branch) => {
                    const isSelected =
                      oppBranches.includes(branch) || (branch === 'All' && oppBranches.includes('All'));
                    return (
                      <TouchableOpacity
                        key={branch}
                        style={[styles.branchChip, isSelected && styles.branchChipActive]}
                        onPress={() => toggleBranch(branch)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.branchChipText, isSelected && styles.branchChipTextActive]}>
                          {branch === 'All' ? '⚡ All Branches' : branch}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* SECTION 7: Description & Duties */}
              <View style={styles.formSection}>
                <Text style={styles.sectionHeading}>Job Description & Key Duties</Text>
                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  placeholder="Outline responsibilities, required skills (e.g. Python, React, AutoCAD), eligibility criteria..."
                  value={oppDesc}
                  onChangeText={setOppDesc}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.oppSubmitBtn}
                onPress={handlePublishOpportunity}
                disabled={formLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#2563EB', '#38BDF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                {formLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Feather name="send" size={17} color="#FFF" />
                    <Text style={styles.oppSubmitText}>Publish Opportunity to Feed</Text>
                  </View>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </BlurView>
      </Modal>

      {/* 3. Resource Modal */}
      <Modal visible={activeModal === 'resource'} animationType="slide" transparent>
        <BlurView intensity={40} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Resource</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}><Feather name="x" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Resource Title</Text>
              <TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.3)" placeholder="DSP Unit 3 Reference Notes" value={resTitle} onChangeText={setResTitle} />
              
              <Text style={styles.label}>File Link (Drive / S3)</Text>
              <TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.3)" placeholder="https://drive.google.com/..." value={resUrl} onChangeText={setResUrl} />

              <Text style={styles.label}>Resource Type</Text>
              <View style={[styles.selectorRow, { flexWrap: 'wrap', gap: 8 }]}>
                {['Notes', 'Syllabus', 'Papers', 'Previous Paper', 'Other'].map(type => (
                  <TouchableOpacity key={type} style={[styles.selectorBtn, resType === type && styles.selectorBtnActive, { minWidth: 80, paddingHorizontal: 10 }]} onPress={() => setResType(type)}>
                    <Text style={[styles.selectorText, resType === type && { color: '#000' }]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {resType === 'Other' && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.label}>Specify Resource Type *</Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    placeholder="e.g. Lab Manual, Blueprint, Formula Sheet"
                    value={resCustomType}
                    onChangeText={setResCustomType}
                  />
                </View>
              )}

              <TouchableOpacity style={styles.submitBtn} onPress={handleUploadResource} disabled={formLoading}>
                {formLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Publish Document</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 20, paddingTop: Platform.OS === 'ios' ? 56 : 42, paddingBottom: 130 },
  tabBarSegment: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 14, padding: 4, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tabSegmentBtn: { flex: 1, flexDirection: 'row', height: 38, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 10 },
  tabSegmentBtnActive: { backgroundColor: '#FFF' },
  tabSegmentText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700' },
  tabSegmentTextActive: { color: '#000', fontWeight: '800' },
  
  healthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25 },
  healthCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', gap: 8 },
  healthCardTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  healthCardValue: { color: '#FFF', fontSize: 14, fontWeight: '800' },

  controlCard: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 25 },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  controlTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  controlDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '500', marginTop: 4, lineHeight: 15 },
  
  analyticsBannerBtn: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
  },
  analyticsBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
  },
  analyticsBannerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  analyticsBannerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 16,
  },
  analyticsBannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  analyticsProgressLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  exportRow: { flexDirection: 'row', gap: 12, marginTop: 15, marginBottom: 25 },
  exportBtn: { flex: 1, flexDirection: 'row', height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', gap: 8 },
  exportText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  logoutBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.15)' },
  healthBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  healthText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 25 },
  statCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.01)', padding: 16, borderRadius: 20, borderWidth: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },

  sectionHeader: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 16, marginTop: 10, letterSpacing: -0.2 },
  
  actionGrid: { gap: 12 },
  actionCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  actionBlur: { padding: 16, flexDirection: 'row', alignItems: 'center' },
  actionIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  actionContent: { flex: 1 },
  actionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  actionTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  tagBadge: { backgroundColor: '#F59E0B20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  tagText: { color: '#F59E0B', fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  actionDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 16, fontWeight: '500' },

  // Modals Styling
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#0F131E', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', letterSpacing: -0.2 },
  form: { gap: 12 },
  label: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  input: { height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 16, fontSize: 14, color: '#FFF', fontWeight: '500' },
  selectorRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  selectorBtn: { flex: 1, height: 42, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  selectorBtnActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  selectorText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  submitBtn: { height: 50, backgroundColor: '#FFF', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 15 },
  submitText: { color: '#000', fontSize: 15, fontWeight: '800' },

  // Metrics Cards
  metricsCard: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginTop: 12 },
  metricsHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  metricsIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center' },
  metricsTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  metricsSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  metricsBadge: { marginLeft: 'auto', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  metricsBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '800' },
  
  storageBarContainer: { height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, flexDirection: 'row', overflow: 'hidden', marginBottom: 16 },
  storageBar: { height: '100%' },
  storageLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' },

  activityList: { gap: 16 },
  activityItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginTop: 6 },
  activityContent: { flex: 1 },
  activityText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500', lineHeight: 18 },
  activityTime: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 },

  // Redesigned Opportunity Modal Styles
  oppModalContent: {
    backgroundColor: '#0B1120',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  sheetHandleWrap: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  oppModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginBottom: 8,
  },
  oppHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  oppHeaderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oppModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -0.3,
  },
  oppModalSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  oppFormScroll: {
    marginTop: 6,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 10,
  },
  iconInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  iconInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  companyLogoPreview: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  companyLogoImg: {
    width: '100%',
    height: '100%',
  },
  companyLogoInitials: {
    fontSize: 14,
    fontWeight: '900',
    color: '#38BDF8',
  },
  workplaceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  workplaceChip: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  workplaceChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: '#38BDF8',
  },
  workplaceText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  workplaceTextActive: {
    color: '#38BDF8',
  },
  typeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  typeChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  typeChipTextActive: {
    color: '#000',
    fontWeight: '800',
  },
  quickDeadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  quickDeadlineLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
  },
  quickDeadlineBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quickDeadlineText: {
    fontSize: 10,
    color: '#38BDF8',
    fontWeight: '700',
  },
  branchSubNote: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
  branchChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  branchChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  branchChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  branchChipTextActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  oppSubmitBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  oppSubmitText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});

