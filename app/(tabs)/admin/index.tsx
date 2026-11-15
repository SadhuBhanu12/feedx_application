import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, Alert, Platform } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

interface StatCardProps {
  title: string;
  count: number | string;
  icon: any;
}

const StatCard = ({ title, count, icon }: StatCardProps) => (
  <View style={styles.statCardContainer}>
    <View style={styles.statCard}>
      <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
         <MaterialCommunityIcons name={icon} size={24} color="#3B82F6" />
      </View>
      <View style={styles.statText}>
        <Text style={styles.statCount}>{count || 0}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  </View>
);

interface ModuleBtnProps {
  title: string;
  subtitle: string;
  icon: any;
  route: any;
  color: string;
}

const ModuleBtn = ({ title, subtitle, icon, route, color }: ModuleBtnProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity 
      style={styles.moduleBtn} 
      activeOpacity={0.8}
      onPress={() => router.push(route)}
    >
      <View style={[styles.moduleIconBox, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <View style={styles.moduleInfo}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
    </TouchableOpacity>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut } = useUser();
  const [stats, setStats] = useState<Record<string, number>>({
    activeStudents: 0,
    pendingTasks: 0,
    systemLogs: 0,
    resources: 0,
    totalGrievances: 0,
    pendingGrievances: 0,
    reviewGrievances: 0,
    resolvedGrievances: 0,
    issueCount: 0,
    suggestionCount: 0,
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [scopeMode, setScopeMode] = useState<'global' | 'college'>(user?.role === 'super_admin' ? 'global' : 'college');

  const isSuperAdmin = user?.role === 'super_admin';

  const fetchStats = async () => {
    setIsSyncing(true);
    try {
      const effectiveCollegeId = user?.college_id || (!isSuperAdmin ? '6dd12d63-e276-4ff8-8e58-bcd2cc878626' : null);
      const collegeId = isSuperAdmin 
        ? (scopeMode === 'college' ? effectiveCollegeId : null) 
        : effectiveCollegeId;

      // Direct queries scoped strictly by college
      let sQuery = supabase.from('students').select('*', { count: 'exact', head: true });
      let eQuery = supabase.from('events').select('*', { count: 'exact', head: true });
      let nQuery = supabase.from('notifications').select('*', { count: 'exact', head: true });
      let rQuery = supabase.from('resources').select('*', { count: 'exact', head: true });

      // Grievance metrics from issues table
      let iTotalQuery = supabase.from('issues').select('*', { count: 'exact', head: true });
      let iPendingQuery = supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      let iReviewQuery = supabase.from('issues').select('*', { count: 'exact', head: true }).in('status', ['in_progress', 'under_review']);
      let iResolvedQuery = supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'resolved');

      // Ideas & Feedback from dedicated tables
      let suggQuery = supabase.from('support_suggestions').select('*', { count: 'exact', head: true });
      let fbQuery = supabase.from('support_feedbacks').select('*', { count: 'exact', head: true });

      if (collegeId) {
        sQuery = sQuery.eq('college_id', collegeId);
        eQuery = eQuery.eq('college_id', collegeId);
        nQuery = nQuery.eq('college_id', collegeId);
        rQuery = rQuery.eq('college_id', collegeId);
        iTotalQuery = iTotalQuery.eq('college_id', collegeId).neq('status', 'rejected');
        iPendingQuery = iPendingQuery.eq('college_id', collegeId).neq('status', 'rejected');
        iReviewQuery = iReviewQuery.eq('college_id', collegeId).in('status', ['in_progress', 'under_review']).neq('status', 'rejected');
        iResolvedQuery = iResolvedQuery.eq('college_id', collegeId).eq('status', 'resolved');
        suggQuery = suggQuery.eq('college_id', collegeId);
        fbQuery = fbQuery.eq('college_id', collegeId);
      }

      const [s, ev, n, r, iTotal, iPending, iReview, iResolved, sSugg, sFb] = await Promise.all([
        sQuery,
        eQuery,
        nQuery,
        rQuery,
        iTotalQuery,
        iPendingQuery,
        iReviewQuery,
        iResolvedQuery,
        suggQuery,
        fbQuery,
      ]);

      let studentCount = s.count || 0;
      if (studentCount === 0 && collegeId) {
        const { count: userStudentCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('college_id', collegeId);
        studentCount = userStudentCount || 0;
      }

      setStats({
        activeStudents: studentCount,
        pendingTasks: ev.count || 0,
        systemLogs: n.count || 0,
        resources: r.count || 0,
        totalGrievances: iTotal.count || 0,
        pendingGrievances: iPending.count || 0,
        reviewGrievances: iReview.count || 0,
        resolvedGrievances: iResolved.count || 0,
        issueCount: iTotal.count || 0,
        suggestionCount: sSugg.count || 0,
      });
    } catch (e: any) {
      console.log('Stats error', e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to all metric-influencing tables for real-time dashboard updates
    const channel = supabase.channel(`admin-dashboard-metrics-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, () => fetchStats())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scopeMode, user?.college_id]);

  const handleExitPortal = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/user_profile' as any);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 }}>
              <TouchableOpacity 
                style={[styles.actionBtn, { marginRight: 10, backgroundColor: 'rgba(255,255,255,0.06)' }]} 
                onPress={handleExitPortal}
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={20} color="#FFF" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <View style={styles.syncIndicator}>
                  <View style={[styles.syncDot, { backgroundColor: isSyncing ? '#F59E0B' : '#10B981' }]} />
                  <Text style={styles.syncText}>{isSyncing ? 'SYNCING...' : 'SYSTEM STABLE'}</Text>
                  <Text style={[styles.roleScopeBadge, { color: isSuperAdmin ? '#A855F7' : '#3B82F6' }]}>
                    {isSuperAdmin ? '• SUPER ADMIN' : '• CAMPUS ADMIN'}
                  </Text>
                </View>
                <Text style={styles.brandText}>COMMAND <Text style={styles.proBadge}>DECK</Text></Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', marginTop: 3 }} numberOfLines={1}>
                  {user?.college_name || (isSuperAdmin ? 'FEEDX Master Control' : 'Government Institute of Electronics')}
                </Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={fetchStats}>
                 <Feather name="refresh-cw" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} 
                onPress={() => {
                  Alert.alert(
                    'Admin Portal Session',
                    'Choose an action:',
                    [
                      {
                        text: 'Close Portal',
                        onPress: handleExitPortal,
                      },
                      {
                        text: 'Sign Out',
                        style: 'destructive',
                        onPress: async () => {
                          await signOut();
                          router.replace('/login');
                        },
                      },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  );
                }}
              >
                 <Feather name="power" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
        </View>

        {/* Super Admin Scope Toggle Pill */}
        {isSuperAdmin && (
          <View style={styles.scopeToggleContainer}>
            <TouchableOpacity
              style={[styles.scopeBtn, scopeMode === 'global' && styles.scopeBtnActive]}
              onPress={() => setScopeMode('global')}
            >
              <MaterialCommunityIcons name="earth" size={14} color={scopeMode === 'global' ? '#FFF' : '#94A3B8'} />
              <Text style={[styles.scopeBtnText, scopeMode === 'global' && styles.scopeBtnTextActive]}>Global System Scope</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scopeBtn, scopeMode === 'college' && styles.scopeBtnActive]}
              onPress={() => setScopeMode('college')}
            >
              <MaterialCommunityIcons name="school" size={14} color={scopeMode === 'college' ? '#FFF' : '#94A3B8'} />
              <Text style={[styles.scopeBtnText, scopeMode === 'college' && styles.scopeBtnTextActive]}>Campus Scope</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.statsGrid}>
           <StatCard title="STUDENTS" count={stats.activeStudents} icon="shield-account" />
           <StatCard title="GRIEVANCES" count={stats.totalGrievances || stats.pendingGrievances} icon="lifebuoy" />
           <StatCard title="NOTIFS" count={stats.systemLogs} icon="broadcast" />
           <StatCard title="RESOURCES" count={stats.resources} icon="layers-triple" />
        </View>

        {/* Support Desk Live Breakdown Banner */}
        <View style={styles.supportBreakdownContainer}>
          <View style={styles.supportBreakdownHeader}>
            <View style={styles.supportBreakdownTitleRow}>
              <MaterialCommunityIcons name="lifebuoy" size={16} color="#EF4444" />
              <Text style={styles.supportBreakdownTitle}>SUPPORT DESK SUMMARY</Text>
            </View>
            <Text style={styles.supportBreakdownTotal}>{stats.totalGrievances} Total</Text>
          </View>
          <View style={styles.supportPillRow}>
            <View style={[styles.supportPill, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF444440' }]}>
              <Text style={[styles.supportPillText, { color: '#EF4444' }]}>{stats.pendingGrievances} Pending</Text>
            </View>
            <View style={[styles.supportPill, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B40' }]}>
              <Text style={[styles.supportPillText, { color: '#F59E0B' }]}>{stats.reviewGrievances} Review</Text>
            </View>
            <View style={[styles.supportPill, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B98140' }]}>
              <Text style={[styles.supportPillText, { color: '#10B981' }]}>{stats.resolvedGrievances} Resolved</Text>
            </View>
            <View style={[styles.supportPill, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F640' }]}>
              <Text style={[styles.supportPillText, { color: '#3B82F6' }]}>{stats.suggestionCount} Ideas</Text>
            </View>
          </View>
        </View>

        {/* Host Campus Event Banner Action */}
        <TouchableOpacity
          style={styles.hostEventBanner}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/admin/events' as any)}
        >
          <LinearGradient
            colors={['rgba(6, 182, 212, 0.18)', 'rgba(59, 130, 246, 0.18)']}
            style={styles.hostEventGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.hostEventIconBox}>
              <MaterialCommunityIcons name="calendar-star" size={24} color="#06B6D4" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.hostEventTitle}>Host Campus Event</Text>
                <View style={styles.hostEventNewBadge}>
                  <Text style={styles.hostEventNewBadgeText}>NEW</Text>
                </View>
              </View>
              <Text style={styles.hostEventSub}>
                Publish college fests, workshops & hackathons for your students to register
              </Text>
            </View>
            <View style={styles.hostEventActionBtn}>
              <Text style={styles.hostEventActionBtnText}>Create</Text>
              <Feather name="arrow-right" size={13} color="#FFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.operationalSection}>
           <Text style={styles.sectionTitle}>Operations</Text>
           <View style={styles.modulesGrid}>
              {isSuperAdmin && (
                <ModuleBtn
                  title="College Profile"
                  subtitle="Manage college information"
                  icon="school-outline"
                  route="/(tabs)/admin/colleges"
                  color="#14B8A6"
                />
              )}
              <ModuleBtn
                title="Broadcasting"
                subtitle="Announcements, Notices & Polls"
                icon="message-flash-outline"
                route="/(tabs)/admin/notifications"
                color="#F59E0B"
              />
              <ModuleBtn
                title="Support Desk"
                subtitle={`${stats.totalGrievances} Total • ${stats.pendingGrievances} Pending • ${stats.reviewGrievances} Review`}
                icon="lifebuoy"
                route="/(tabs)/admin/issues"
                color="#EF4444"
              />
              <ModuleBtn
                title={isSuperAdmin ? "Student Registry" : "Manage Students"}
                subtitle={isSuperAdmin ? "Global student enrollment & registry" : `${stats.activeStudents} Campus Students • Edit & Manage Records`}
                icon={isSuperAdmin ? "account-details" : "account-group-outline"}
                route="/(tabs)/admin/students"
                color="#3B82F6"
              />
              <ModuleBtn
                title="Previous Papers"
                subtitle="Exam questions & study resources"
                icon="layers-triple"
                route="/(tabs)/admin/resources"
                color="#8B5CF6"
              />
              <ModuleBtn
                title="Events Hub"
                subtitle="Registrations & QR attendance"
                icon="calendar-star"
                route="/(tabs)/admin/events"
                color="#06B6D4"
              />
              {isSuperAdmin && (
                <ModuleBtn
                  title="Task Registry"
                  subtitle="Assign tasks & track completion"
                  icon="clipboard-list"
                  route="/(tabs)/admin/tasks"
                  color="#A855F7"
                />
              )}
              {isSuperAdmin && (
                <ModuleBtn
                  title="Admin Registry"
                  subtitle="Manage institution admins"
                  icon="shield-account"
                  route="/(tabs)/admin/admins"
                  color="#A855F7"
                />
              )}
              {isSuperAdmin && (
                <ModuleBtn
                  title="Academics"
                  subtitle="Timetables & schedules"
                  icon="calendar-multiselect"
                  route="/(tabs)/admin/timetable"
                  color="#10B981"
                />
              )}
              <ModuleBtn
                title="Placements"
                subtitle="Job & internship opportunities"
                icon="briefcase-plus"
                route="/(tabs)/admin/opportunities"
                color="#EC4899"
              />
              {isSuperAdmin && (
                <ModuleBtn
                  title="Security Matrix"
                  subtitle="User roles & overrides"
                  icon="shield-key"
                  route="/(tabs)/admin/security"
                  color="#6366F1"
                />
              )}
           </View>
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerText}>FEEDX OS v3.0.0 • CONCURRENT ADMIN CONTROL</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { paddingTop: Platform.OS === 'ios' ? 56 : 42, paddingBottom: 120 },
  header: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerActions: { flexDirection: 'row', gap: 12 },
  syncIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  syncDot: { width: 6, height: 6, borderRadius: 3 },
  syncText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1 },
  roleScopeBadge: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  scopeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 4,
  },
  scopeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  scopeBtnActive: {
    backgroundColor: '#3B82F6',
  },
  scopeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  scopeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  brandText: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  proBadge: { color: '#3B82F6', fontWeight: '400' },
  actionBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between', marginBottom: 24 },
  statCardContainer: { width: '48%', marginBottom: 12 },
  statCard: { minHeight: 76, borderRadius: 24, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconCircle: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statText: { flex: 1 },
  statCount: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  statTitle: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase' },
  operationalSection: { paddingHorizontal: 20 },
  supportBreakdownContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  supportBreakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportBreakdownTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  supportBreakdownTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 1,
  },
  supportBreakdownTotal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  supportPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  supportPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  supportPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 16 },
  modulesGrid: { gap: 12 },
  moduleBtn: { minHeight: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 16 },
  moduleIconBox: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  moduleInfo: { flex: 1 },
  moduleTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', textAlign: 'left' },
  moduleSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3, textAlign: 'left', lineHeight: 17 },
  footer: { marginTop: 60, alignItems: 'center' },
  footerText: { fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: '700', letterSpacing: 1 },
  hostEventBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.35)',
  },
  hostEventGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostEventIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  hostEventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  hostEventNewBadge: {
    backgroundColor: '#06B6D4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hostEventNewBadgeText: {
    color: '#042F2E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hostEventSub: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 2,
    lineHeight: 16,
  },
  hostEventActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#06B6D4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  hostEventActionBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
