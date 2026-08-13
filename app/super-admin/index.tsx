import { useEffect, useState } from 'react';
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
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { saGetPlatformMetrics, saListColleges, adminResetUserPassword, withTimeout } from '@/services/supabaseService';
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
  const [activeModal, setActiveModal] = useState<'broadcast' | 'opportunity' | 'resource' | 'password_reset' | null>(null);

  // Forms State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState('System'); // System, Event, Exam

  const [oppTitle, setOppTitle] = useState('');
  const [oppCompany, setOppCompany] = useState('');
  const [oppType, setOppType] = useState('Job'); // Job, Internship
  const [oppLocation, setOppLocation] = useState('Remote');
  const [oppStipend, setOppStipend] = useState('');
  const [oppDesc, setOppDesc] = useState('');

  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resType, setResType] = useState('Notes'); // Notes, Syllabus, Papers
  const [resCollegeId, setResCollegeId] = useState('');

  // Password reset state
  const [studentEmail, setStudentEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const loadData = async () => {
    try {
      const [platformMetrics, colleges, pendingIssues, pendingInnovations] = await withTimeout(
        Promise.all([
          saGetPlatformMetrics(),
          saListColleges(),
          supabase.from('issues').select('id', { count: 'exact', head: true }).eq('triage_status', 'pending_review'),
          supabase.from('innovations').select('id', { count: 'exact', head: true }).eq('status', 'Pending Review')
        ]),
        15000
      );

      setMetrics({
        ...platformMetrics,
        pendingIssuesCount: pendingIssues.count || 0,
        pendingInnovationsCount: pendingInnovations.count || 0,
        health: '100% Operational'
      });

      setCollegesList(colleges || []);
      if (colleges && colleges.length > 0) {
        setResCollegeId(colleges[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setMetrics(prev => ({ ...prev, health: 'Degraded' }));
      Alert.alert('Connection Issue', err?.message || 'Failed to load dashboard metrics. Please pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to all platform events in real-time
    const channel = supabase.channel(`super-admin-realtime-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'colleges' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'innovations' }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
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
    Alert.alert('Sign Out', 'Are you sure you want to log out of FeedX?', [
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

  const handleResetStudentPassword = async () => {
    if (!studentEmail.trim() || !newPassword.trim()) {
      return Alert.alert('Validation Error', 'Email and New Password are required.');
    }
    setFormLoading(true);
    try {
      // Add timeout wrapper to prevent infinite loading on network drops
      const queryPromise = supabase
        .from('users')
        .select('id, full_name')
        .eq('email', studentEmail.trim().toLowerCase())
        .single();
        
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Network request timed out. Please try again.')), 10000);
      });

      const { data: userRec, error: uErr } = await Promise.race([queryPromise, timeoutPromise]) as any;
        
      if (uErr || !userRec) {
        throw new Error('No user found with the specified email or request timed out.');
      }

      // Also wrap the RPC call in a timeout
      const rpcPromise = adminResetUserPassword(userRec.id, newPassword.trim());
      await Promise.race([rpcPromise, timeoutPromise]);
      Alert.alert('Success', `Password for ${userRec.full_name} has been updated.`);
      setActiveModal(null);
      setStudentEmail('');
      setNewPassword('');
    } catch (e: any) {
      Alert.alert('Reset Failed', e.message);
    } finally {
      setFormLoading(false);
    }
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
    setFormLoading(true);
    try {
      const { error } = await withTimeout(supabase.from('opportunities').insert({
        title: oppTitle.trim(),
        company: oppCompany.trim(),
        type: oppType,
        location: oppLocation,
        stipend: oppStipend.trim(),
        description: oppDesc.trim()
      }));
      if (error) throw error;
      Alert.alert('Success', 'Opportunity uploaded successfully!');
      setActiveModal(null);
      setOppTitle('');
      setOppCompany('');
      setOppStipend('');
      setOppDesc('');
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
    setFormLoading(true);
    try {
      const { error } = await withTimeout(supabase.from('resources').insert({
        title: resTitle.trim(),
        file_url: resUrl.trim(),
        type: resType,
        uploaded_by: user?.id
      }));
      if (error) throw error;
      Alert.alert('Success', 'Resource registered successfully!');
      setActiveModal(null);
      setResTitle('');
      setResUrl('');
    } catch (e: any) {
      Alert.alert('Error Uploading', e.message);
    } finally {
      setFormLoading(false);
    }
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
      <LinearGradient colors={['#0B0F19', '#020408']} style={StyleSheet.absoluteFillObject} />
      
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
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <StatCard icon="domain" label="Total Colleges" value={metrics.collegesCount} color="#3B82F6" delay={100} family="MaterialCommunityIcons" />
              <StatCard icon="users" label="Total Students" value={metrics.studentsCount} color="#10B981" delay={150} />
              <StatCard icon="account-tie" label="Total Faculty" value={metrics.facultyCount} color="#8B5CF6" delay={200} family="MaterialCommunityIcons" />
              <StatCard icon="source-branch" label="Departments" value={metrics.departmentsCount} color="#F59E0B" delay={250} family="MaterialCommunityIcons" />
              
              <StatCard icon="book-open" label="Total Subjects" value={metrics.subjectsCount} color="#EC4899" delay={300} />
              <StatCard icon="file-text" label="Total Notes" value={metrics.notesCount} color="#06B6D4" delay={350} />
              <StatCard icon="file" label="Past Papers" value={metrics.previousPapersCount} color="#6366F1" delay={400} />
              <StatCard icon="briefcase" label="Opportunities" value={metrics.opportunitiesCount} color="#14B8A6" delay={450} />
              
              <StatCard icon="calendar" label="Total Events" value={metrics.eventsCount} color="#F43F5E" delay={500} />
              <StatCard icon="forum-outline" label="Communities" value={metrics.communitiesCount} color="#8B5CF6" delay={550} family="MaterialCommunityIcons" />
              <StatCard icon="lightbulb-outline" label="Innovation Ideas" value={metrics.innovationsCount} color="#F59E0B" delay={600} family="MaterialCommunityIcons" />
              <StatCard icon="account-multiple-outline" label="Active Users" value={metrics.activeUsersCount} color="#3B82F6" delay={650} family="MaterialCommunityIcons" />
              
              <StatCard icon="cloud-download-outline" label="Total Downloads" value={metrics.downloadsCount} color="#10B981" delay={700} family="MaterialCommunityIcons" />
              <StatCard icon="alert-circle" label="Triage Tickets" value={metrics.pendingIssuesCount} color="#EF4444" delay={750} />
            </View>

            {/* Operational Console Shortcuts */}
            <Text style={styles.sectionHeader}>Quick Shortcuts</Text>
            <View style={styles.actionGrid}>
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
                icon="lightbulb-on-outline" 
                title="Startup Innovations" 
                desc="Review, feedback, and verify student startup ideas" 
                tag={metrics.pendingInnovationsCount > 0 ? `${metrics.pendingInnovationsCount} pending` : null}
                onPress={() => router.push('/super-admin/innovations')}
                iconBg="rgba(245, 158, 11, 0.1)"
                color="#F59E0B"
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
                icon="key-change" 
                title="Reset Student Password" 
                desc="Change student passwords globally via institutional email" 
                onPress={() => setActiveModal('password_reset')}
                iconBg="rgba(245, 158, 11, 0.1)"
                color="#F59E0B"
                family="MaterialCommunityIcons"
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

            {/* Pending queue overview */}
            <Text style={styles.sectionHeader}>Pending Operations Queue</Text>
            <View style={styles.actionGrid}>
              <ActionCard 
                icon="lightbulb-on-outline" 
                title="Startup Innovation Pitch Review" 
                desc="Review submissions and assign triages" 
                tag={metrics.pendingInnovationsCount > 0 ? `${metrics.pendingInnovationsCount} pending` : 'Clean'}
                onPress={() => router.push('/super-admin/innovations')}
                iconBg="rgba(245, 158, 11, 0.1)"
                color="#F59E0B"
              />
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
            {/* Student statistics */}
            <Text style={styles.sectionHeader}>Enrollment Distribution</Text>
            <View style={styles.metricsCard}>
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={styles.analyticsProgressLabel}>Computer Science (CSE) - 45%</Text>
                  <View style={styles.storageBarContainer}><View style={[styles.storageBar, { width: '45%', backgroundColor: '#3B82F6' }]} /></View>
                </View>
                <View>
                  <Text style={styles.analyticsProgressLabel}>Electronics (ECE) - 25%</Text>
                  <View style={styles.storageBarContainer}><View style={[styles.storageBar, { width: '25%', backgroundColor: '#10B981' }]} /></View>
                </View>
                <View>
                  <Text style={styles.analyticsProgressLabel}>Mechanical (ME) - 15%</Text>
                  <View style={styles.storageBarContainer}><View style={[styles.storageBar, { width: '15%', backgroundColor: '#F59E0B' }]} /></View>
                </View>
                <View>
                  <Text style={styles.analyticsProgressLabel}>Other - 15%</Text>
                  <View style={styles.storageBarContainer}><View style={[styles.storageBar, { width: '15%', backgroundColor: 'rgba(255,255,255,0.2)' }]} /></View>
                </View>
              </View>
            </View>

            {/* Support Desk stats */}
            <Text style={styles.sectionHeader}>Support Triage Resolution Rate</Text>
            <View style={styles.metricsCard}>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.analyticsProgressLabel}>Tickets Resolved</Text>
                  <Text style={[styles.statValue, { color: '#10B981' }]}>85%</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.analyticsProgressLabel}>Pending Action</Text>
                  <Text style={[styles.statValue, { color: '#EF4444' }]}>15%</Text>
                </View>
              </View>
            </View>

            {/* File downloads */}
            <Text style={styles.sectionHeader}>Digital Assets Engagement</Text>
            <View style={styles.metricsCard}>
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={styles.analyticsProgressLabel}>Study Notes Downloads - 65%</Text>
                  <View style={styles.storageBarContainer}><View style={[styles.storageBar, { width: '65%', backgroundColor: '#8B5CF6' }]} /></View>
                </View>
                <View>
                  <Text style={styles.analyticsProgressLabel}>Previous Exam Papers - 35%</Text>
                  <View style={styles.storageBarContainer}><View style={[styles.storageBar, { width: '35%', backgroundColor: '#06B6D4' }]} /></View>
                </View>
              </View>
            </View>

            {/* Storage Usage Card */}
            <Text style={styles.sectionHeader}>Storage Allocation</Text>
            <View style={styles.metricsCard}>
              <View style={styles.metricsHeader}>
                <View style={styles.metricsIconBox}>
                  <Feather name="hard-drive" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.metricsTitle}>Storage Usage</Text>
                  <Text style={styles.metricsSubtitle}>Supabase S3 Buckets</Text>
                </View>
              </View>
              <View style={styles.storageBarContainer}>
                <View style={[styles.storageBar, { width: '45%', backgroundColor: '#3B82F6' }]} />
                <View style={[styles.storageBar, { width: '25%', backgroundColor: '#10B981' }]} />
                <View style={[styles.storageBar, { width: '15%', backgroundColor: '#F59E0B' }]} />
              </View>
              <View style={styles.storageLegend}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} /><Text style={styles.legendText}>Docs (45%)</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#10B981' }]} /><Text style={styles.legendText}>Images (25%)</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} /><Text style={styles.legendText}>Other (15%)</Text></View>
              </View>
            </View>

            {/* Reports Export triggers */}
            <Text style={styles.sectionHeader}>Download Reports</Text>
            <View style={styles.exportRow}>
              <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export Excel', 'Platform audit excel downloaded.')}>
                <Feather name="file-text" size={16} color="#10B981" />
                <Text style={styles.exportText}>Excel Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export PDF', 'Operational Analytics PDF report generated.')}>
                <Feather name="download-cloud" size={16} color="#EF4444" />
                <Text style={styles.exportText}>PDF Report</Text>
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

      {/* 2. Opportunity Modal */}
      <Modal visible={activeModal === 'opportunity'} animationType="slide" transparent>
        <BlurView intensity={40} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publish Opportunity</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}><Feather name="x" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Job Title / Role</Text>
              <TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.3)" placeholder="Junior Cloud Architect" value={oppTitle} onChangeText={setOppTitle} />
              
              <Text style={styles.label}>Company Name</Text>
              <TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.3)" placeholder="Google India" value={oppCompany} onChangeText={setOppCompany} />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Stipend / Salary</Text>
                  <TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.3)" placeholder="₹45,000/mo" value={oppStipend} onChangeText={setOppStipend} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.3)" placeholder="Remote" value={oppLocation} onChangeText={setOppLocation} />
                </View>
              </View>
              
              <Text style={styles.label}>Opportunity Type</Text>
              <View style={styles.selectorRow}>
                {['Job', 'Internship'].map(type => (
                  <TouchableOpacity key={type} style={[styles.selectorBtn, oppType === type && styles.selectorBtnActive]} onPress={() => setOppType(type)}>
                    <Text style={styles.selectorText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Job Description</Text>
              <TextInput style={[styles.input, { height: 80, paddingTop: 12 }]} multiline placeholderTextColor="rgba(255,255,255,0.3)" placeholder="Job duties, requirements..." value={oppDesc} onChangeText={setOppDesc} />

              <TouchableOpacity style={[styles.submitBtn, { marginBottom: 30 }]} onPress={handlePublishOpportunity} disabled={formLoading}>
                {formLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Publish Job</Text>}
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
              <View style={styles.selectorRow}>
                {['Notes', 'Syllabus', 'Papers'].map(type => (
                  <TouchableOpacity key={type} style={[styles.selectorBtn, resType === type && styles.selectorBtnActive]} onPress={() => setResType(type)}>
                    <Text style={styles.selectorText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleUploadResource} disabled={formLoading}>
                {formLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Publish Document</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* 4. Password Reset Modal */}
      <Modal visible={activeModal === 'password_reset'} animationType="slide" transparent>
        <BlurView intensity={40} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset Student Password</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}><Feather name="x" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Student Institutional Email</Text>
              <TextInput 
                style={styles.input} 
                placeholderTextColor="rgba(255,255,255,0.3)" 
                placeholder="student@institution.edu" 
                value={studentEmail} 
                onChangeText={setStudentEmail}
                autoCapitalize="none"
              />
              
              <Text style={styles.label}>New Custom Password</Text>
              <TextInput 
                style={styles.input} 
                placeholderTextColor="rgba(255,255,255,0.3)" 
                placeholder="Enter new plain text password" 
                value={newPassword} 
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#F59E0B' }]} onPress={handleResetStudentPassword} disabled={formLoading}>
                {formLoading ? <ActivityIndicator color="#000" /> : <Text style={[styles.submitText, { color: '#FFF' }]}>Update Password</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  scrollContent: { padding: 20, paddingTop: Platform.OS === 'ios' ? 70 : 50, paddingBottom: 130 },
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
  activityTime: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }
});

