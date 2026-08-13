import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';

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
  const [stats, setStats] = useState<Record<string, number>>({ activeStudents: 0, pendingTasks: 0, systemLogs: 0, resources: 0, issues: 0 });
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchStats = async () => {
    setIsSyncing(true);
    try {
      const collegeId = user?.college_id;
      
      let sQuery = supabase.from('students').select('*', { count: 'exact', head: true });
      let oQuery = supabase.from('opportunities').select('*', { count: 'exact', head: true });
      let nQuery = supabase.from('notifications').select('*', { count: 'exact', head: true });
      let rQuery = supabase.from('resources').select('*', { count: 'exact', head: true });
      let iQuery = supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      if (collegeId) {
        sQuery = sQuery.eq('college_id', collegeId);
        oQuery = oQuery.eq('college_id', collegeId);
        nQuery = nQuery.eq('college_id', collegeId);
        rQuery = rQuery.eq('college_id', collegeId);
        iQuery = iQuery.eq('college_id', collegeId);
      }

      const [s, o, n, r, i] = await Promise.all([
        sQuery,
        oQuery,
        nQuery,
        rQuery,
        iQuery
      ]);

      setStats({
        activeStudents: s.count || 0,
        pendingTasks: o.count || 0,
        systemLogs: n.count || 0,
        resources: r.count || 0,
        issues: i.count || 0
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, () => fetchStats())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <View>
               <View style={styles.syncIndicator}>
                 <View style={[styles.syncDot, { backgroundColor: isSyncing ? '#F59E0B' : '#10B981' }]} />
                 <Text style={styles.syncText}>{isSyncing ? 'SYNCING...' : 'SYSTEM STABLE'}</Text>
               </View>
               <Text style={styles.brandText}>COMMAND <Text style={styles.proBadge}>DECK</Text></Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={fetchStats}>
                 <Feather name="refresh-cw" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} 
                onPress={() => {
                  Alert.alert('Sign Out', 'Close admin session?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Exit', style: 'destructive', onPress: async () => { await signOut(); router.replace('/login'); }}
                  ]);
                }}
              >
                 <Feather name="power" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
        </View>

        <View style={styles.statsGrid}>
           <StatCard title="STUDENTS" count={stats.activeStudents} icon="shield-account" />
           <StatCard title="ISSUES" count={stats.issues} icon="lifebuoy" />
           <StatCard title="NOTIFS" count={stats.systemLogs} icon="broadcast" />
           <StatCard title="CAREERS" count={stats.pendingTasks} icon="briefcase-variant" />
        </View>

        <View style={styles.operationalSection}>
           <Text style={styles.sectionTitle}>Operations</Text>
           <View style={styles.modulesGrid}>
              <ModuleBtn title="Broadcasting" subtitle="Mass announcements" icon="message-flash-outline" route="/(tabs)/admin/notifications" color="#F59E0B" />
              <ModuleBtn title="Support Desk" subtitle="Raised student concerns" icon="lifebuoy" route="/(tabs)/admin/issues" color="#EF4444" />
              <ModuleBtn title="Registry" subtitle="Student enrollment" icon="account-details" route="/(tabs)/admin/students" color="#3B82F6" />
              {user?.role === 'super_admin' && (
                <ModuleBtn title="Admin Registry" subtitle="Manage institution admins" icon="shield-account" route="/(tabs)/admin/admins" color="#A855F7" />
              )}
              <ModuleBtn title="Academics" subtitle="Timetables" icon="calendar-multiselect" route="/(tabs)/admin/timetable" color="#10B981" />
              <ModuleBtn title="Placements" subtitle="Job opportunities" icon="briefcase-plus" route="/(tabs)/admin/opportunities" color="#EC4899" />
              <ModuleBtn title="Resources" subtitle="Digital material" icon="layers-triple" route="/(tabs)/admin/resources" color="#8B5CF6" />
              <ModuleBtn title="Events Hub" subtitle="Manage campus events" icon="calendar-star" route="/(tabs)/admin/events" color="#06B6D4" />
              <ModuleBtn title="Colleges" subtitle="Institution directory" icon="school-outline" route="/(tabs)/admin/colleges" color="#14B8A6" />
              <ModuleBtn title="Task Registry" subtitle="Manage student tasks" icon="clipboard-list" route="/(tabs)/admin/tasks" color="#A855F7" />
              <ModuleBtn title="Security Matrix" subtitle="User roles & overrides" icon="shield-key" route="/(tabs)/admin/security" color="#6366F1" />
           </View>
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerText}>FEEDX OS v3.0.0 • SECURE ADMIN LINK</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { paddingTop: 60, paddingBottom: 120 },
  header: { paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  headerActions: { flexDirection: 'row', gap: 12 },
  syncIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  syncDot: { width: 6, height: 6, borderRadius: 3 },
  syncText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1 },
  brandText: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  proBadge: { color: '#3B82F6', fontWeight: '400' },
  actionBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between', marginBottom: 40 },
  statCardContainer: { width: '48%', marginBottom: 12 },
  statCard: { height: 80, borderRadius: 24, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconCircle: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statText: { flex: 1 },
  statCount: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  statTitle: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase' },
  operationalSection: { paddingHorizontal: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 20 },
  modulesGrid: { gap: 12 },
  moduleBtn: { height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 16 },
  moduleIconBox: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  moduleInfo: { flex: 1 },
  moduleTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  moduleSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  footer: { marginTop: 60, alignItems: 'center' },
  footerText: { fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: '700', letterSpacing: 1 }
});
