import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  addIssueTimelineEntry, 
  superAdminApproveIssue, 
  superAdminRejectIssue, 
  superAdminMergeIssues, 
  getSuperAdminSupportAnalytics 
} from '@/services/supabaseService';
import { useUser } from '@/context/UserContext';
import { COLORS, SHADOWS } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  triage_status?: string;
  priority?: string;
  category?: string;
  attachments?: string[];
  assigned_admin?: string;
  affected_count?: number;
  created_at: string;
  is_anonymous?: boolean;
  response?: string;
  college_id?: string;
  users?: { full_name: string; email: string };
  colleges?: { name: string };
  admin_users?: { full_name: string };
}

const TriageBadge = ({ triageStatus, status }: { triageStatus?: string; status: string }) => {
  const config: Record<string, { color: string; label: string }> = {
    'pending_review': { color: '#F59E0B', label: 'SUPER ADMIN TRIAGE' },
    'approved': { color: '#3B82F6', label: 'COLLEGE DESK' },
    'rejected': { color: '#EF4444', label: 'REJECTED' },
    'merged': { color: '#8B5CF6', label: 'MERGED' },
    'in_progress': { color: '#6366F1', label: 'IN PROGRESS' },
    'resolved': { color: '#10B981', label: 'RESOLVED' },
  };

  const key = (triageStatus === 'pending_review' || triageStatus === 'rejected' || triageStatus === 'merged')
    ? triageStatus
    : (status === 'resolved' ? 'resolved' : status === 'in_progress' ? 'in_progress' : 'approved');

  const current = config[key] || { color: '#F59E0B', label: 'TRIAGE' };

  return (
    <View style={[styles.badge, { backgroundColor: current.color + '20', borderColor: current.color + '40' }]}>
      <Text style={[styles.badgeText, { color: current.color }]}>{current.label}</Text>
    </View>
  );
};

export default function AdminIssuesConsole() {
  const router = useRouter();
  const { user, isSuperAdmin } = useUser();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [reportType, setReportType] = useState<'issues' | 'suggestions' | 'feedbacks'>('issues');
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [activeTab, setActiveTab] = useState<'triage' | 'approved'>('triage');
  const [analytics, setAnalytics] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [targetMergeId, setTargetMergeId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('issues')
        .select('*, users(full_name, email), colleges(name)')
        .order('created_at', { ascending: false });

      // If college admin, filter strictly to approved issues for their specific college
      if (!isSuperAdmin) {
        query = query.eq('triage_status', 'approved');
        if (user?.college_id) {
          query = query.eq('college_id', user.college_id);
        }
      }

      const [issuesRes, suggRes, fbRes] = await Promise.all([
        query,
        supabase.from('support_suggestions').select('*').order('created_at', { ascending: false }),
        supabase.from('support_feedbacks').select('*').order('created_at', { ascending: false })
      ]);

      setIssues(issuesRes.data || []);
      setSuggestions(suggRes.data || []);
      setFeedbacks(fbRes.data || []);

      if (isSuperAdmin) {
        const stats = await getSuperAdminSupportAnalytics();
        setAnalytics(stats);
      }
    } catch (e: any) {
      console.error('Fetch issues error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    const sub = supabase.channel(`admin-issues-rt-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, fetchIssues)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_suggestions' }, fetchIssues)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_feedbacks' }, fetchIssues)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [isSuperAdmin]);

  const handleApprove = async (issue: Issue) => {
    setActionLoading(true);
    try {
      await superAdminApproveIssue(issue.id, issue.college_id || user?.college_id, user?.id);
      Alert.alert('Approved', `Issue #${issue.id.slice(0, 8)} approved & routed to College Admin desk.`);
      setSelectedIssue(null);
      fetchIssues();
    } catch (e: any) {
      Alert.alert('Action Failed', e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (issue: Issue) => {
    setActionLoading(true);
    try {
      await superAdminRejectIssue(issue.id, rejectReason.trim(), user?.id);
      Alert.alert('Rejected', `Issue #${issue.id.slice(0, 8)} rejected.`);
      setSelectedIssue(null);
      setRejectReason('');
      fetchIssues();
    } catch (e: any) {
      Alert.alert('Action Failed', e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMerge = async (sourceIssue: Issue) => {
    if (!targetMergeId.trim()) {
      Alert.alert('Merge Error', 'Please enter a valid target main issue ID.');
      return;
    }
    setActionLoading(true);
    try {
      await superAdminMergeIssues(sourceIssue.id, targetMergeId.trim(), user?.id);
      Alert.alert('Merged', `Issue #${sourceIssue.id.slice(0, 8)} merged into #${targetMergeId.trim().slice(0, 8)}.`);
      setSelectedIssue(null);
      setTargetMergeId('');
      fetchIssues();
    } catch (e: any) {
      Alert.alert('Merge Failed', e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCollegeAdminStatusToggle = async (issue: Issue) => {
    const nextStatus = issue.status === 'resolved' ? 'in_progress' : 'resolved';
    setActionLoading(true);
    try {
      await supabase.from('issues').update({ status: nextStatus, updated_at: new Date().toISOString() }).eq('id', issue.id);
      await addIssueTimelineEntry(issue.id, nextStatus, `College Admin changed status to ${nextStatus}`, user?.id);
      Alert.alert('Updated', `Status updated to ${nextStatus.toUpperCase()}`);
      setSelectedIssue(null);
      fetchIssues();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const displayedIssues = issues.filter(issue => {
    if (!isSuperAdmin) return true;
    if (activeTab === 'triage') return issue.triage_status === 'pending_review' || !issue.triage_status;
    return issue.triage_status === 'approved' || issue.triage_status === 'merged' || issue.triage_status === 'rejected';
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>{isSuperAdmin ? 'Super Admin Support Triage' : 'College Support Desk'}</Text>
          <Text style={styles.headerSubtitle}>{isSuperAdmin ? 'Governance & Impact Analysis' : 'Institutional Resolution'}</Text>
        </View>
        <TouchableOpacity onPress={fetchIssues}>
          <Feather name="refresh-cw" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Primary Report Category Selector (Issues / Suggestions / Feedbacks) */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12, gap: 8 }}>
        <TouchableOpacity
          style={[styles.tabBtn, reportType === 'issues' && styles.tabBtnActive]}
          onPress={() => setReportType('issues')}
        >
          <Text style={[styles.tabText, reportType === 'issues' && styles.tabTextActive]}>Issues ({issues.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, reportType === 'suggestions' && styles.tabBtnActive]}
          onPress={() => setReportType('suggestions')}
        >
          <Text style={[styles.tabText, reportType === 'suggestions' && styles.tabTextActive]}>Suggestions ({suggestions.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, reportType === 'feedbacks' && styles.tabBtnActive]}
          onPress={() => setReportType('feedbacks')}
        >
          <Text style={[styles.tabText, reportType === 'feedbacks' && styles.tabTextActive]}>Feedback ({feedbacks.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Super Admin Analytics Banner */}
      {isSuperAdmin && analytics && (
        <View style={styles.analyticsBar}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{analytics.pendingReview}</Text>
            <Text style={styles.statLabel}>TRIAGE QUEUE</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#3B82F6' }]}>{analytics.totalAffectedStudents}</Text>
            <Text style={styles.statLabel}>AFFECTED</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{analytics.approved}</Text>
            <Text style={styles.statLabel}>APPROVED</Text>
          </View>
        </View>
      )}

      {/* Tabs for Super Admin */}
      {isSuperAdmin && (
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'triage' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('triage')}
          >
            <Text style={[styles.tabText, activeTab === 'triage' && styles.tabTextActive]}>
              Triage Queue ({issues.filter(i => i.triage_status === 'pending_review' || !i.triage_status).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'approved' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('approved')}
          >
            <Text style={[styles.tabText, activeTab === 'approved' && styles.tabTextActive]}>
              Processed & Approved
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 60 }} />
      ) : reportType === 'suggestions' ? (
        suggestions.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="lightbulb-outline" size={56} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyTitle}>No Suggestions Yet</Text>
            <Text style={styles.emptyDesc}>Student institutional suggestions will appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => item.id || String(index)}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity activeOpacity={0.8} onPress={() => Alert.alert(item.title, `${item.description}\n\nExpected Benefits:\n${item.expected_benefits || 'N/A'}`)}>
                <Animated.View entering={FadeInDown.delay(index * 40)} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.studentName}>{item.category?.toUpperCase() || 'SUGGESTION'}</Text>
                    <View style={[styles.badge, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                      <Text style={[styles.badgeText, { color: '#3B82F6' }]}>Suggestion</Text>
                    </View>
                  </View>
                  <Text style={styles.issueTitle}>{item.title}</Text>
                  <Text style={styles.issueDesc} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.dateText}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            )}
          />
        )
      ) : reportType === 'feedbacks' ? (
        feedbacks.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="message-text-outline" size={56} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyTitle}>No Feedback Submitted</Text>
            <Text style={styles.emptyDesc}>Student feedback logs will appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={feedbacks}
            keyExtractor={(item, index) => item.id || String(index)}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity activeOpacity={0.8} onPress={() => Alert.alert(`Feedback (${item.rating || 5}/5 Stars)`, item.feedback_text)}>
                <Animated.View entering={FadeInDown.delay(index * 40)} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.studentName}>{item.category?.toUpperCase() || 'FEEDBACK'}</Text>
                    <View style={[styles.badge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                      <Text style={[styles.badgeText, { color: '#F59E0B' }]}>★ {item.rating || 5}/5</Text>
                    </View>
                  </View>
                  <Text style={styles.issueTitle}>{item.feedback_text}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.dateText}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            )}
          />
        )
      ) : displayedIssues.length === 0 ? (
        <View style={styles.emptyBox}>
          <MaterialCommunityIcons name="shield-check-outline" size={56} color="rgba(255,255,255,0.2)" />
          <Text style={styles.emptyTitle}>No Pending Issues</Text>
          <Text style={styles.emptyDesc}>All student support tickets have been processed.</Text>
        </View>
      ) : (
        <FlatList
          data={displayedIssues}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedIssue(item)}>
              <Animated.View entering={FadeInDown.delay(index * 40)} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentName}>
                      {item.is_anonymous ? 'Anonymous Student' : (item.users?.full_name || 'Student')}
                    </Text>
                    <Text style={styles.studentMeta}>
                      {item.is_anonymous ? 'Identity hidden' : item.users?.email}
                    </Text>
                  </View>
                  <TriageBadge triageStatus={item.triage_status} status={item.status} />
                </View>

                <Text style={styles.issueTitle}>{item.title}</Text>
                <Text style={styles.issueDesc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.affectedTag}>
                    <Feather name="users" size={12} color="#3B82F6" />
                    <Text style={styles.affectedText}>{item.affected_count || 1} Student(s) Affected</Text>
                  </View>
                  <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal Detail / Triage Actions */}
      <Modal visible={!!selectedIssue} transparent animationType="slide" onRequestClose={() => setSelectedIssue(null)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setSelectedIssue(null)} />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalStudent}>{selectedIssue?.is_anonymous ? 'Anonymous Student' : selectedIssue?.users?.full_name}</Text>
                <Text style={styles.modalEmail}>{selectedIssue?.is_anonymous ? 'Identity hidden' : selectedIssue?.users?.email}</Text>
              </View>
              <TriageBadge triageStatus={selectedIssue?.triage_status} status={selectedIssue?.status || 'pending'} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 280 }}>
              <Text style={styles.modalIssueTitle}>{selectedIssue?.title}</Text>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {selectedIssue?.category && <View style={styles.metaBadge}><Text style={styles.metaText}>{selectedIssue.category}</Text></View>}
                {selectedIssue?.priority && <View style={[styles.metaBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}><Text style={[styles.metaText, { color: '#EF4444' }]}>{selectedIssue.priority} PRIORITY</Text></View>}
                {selectedIssue?.colleges?.name && <View style={[styles.metaBadge, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}><Text style={[styles.metaText, { color: '#3B82F6' }]}>{selectedIssue.colleges.name}</Text></View>}
                {selectedIssue?.admin_users?.full_name && <View style={[styles.metaBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}><Text style={[styles.metaText, { color: '#10B981' }]}>Assigned: {selectedIssue.admin_users.full_name}</Text></View>}
              </View>

              <Text style={styles.modalIssueDesc}>{selectedIssue?.description}</Text>
              
              {selectedIssue?.attachments && selectedIssue.attachments.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.replyLabel}>ATTACHMENTS ({selectedIssue.attachments.length})</Text>
                  {selectedIssue.attachments.map((att, i) => (
                    <Text key={i} style={{ color: '#3B82F6', fontSize: 12, marginBottom: 4 }}>📎 {att.split('/').pop()}</Text>
                  ))}
                </View>
              )}

              {selectedIssue?.response && (
                <View style={styles.replyBox}>
                  <Text style={styles.replyLabel}>ADMIN RESPONSE / NOTE:</Text>
                  <Text style={styles.replyText}>{selectedIssue.response}</Text>
                </View>
              )}
            </ScrollView>

            {/* Actions */}
            {actionLoading ? (
              <ActivityIndicator color="#3B82F6" style={{ marginVertical: 20 }} />
            ) : isSuperAdmin && (selectedIssue?.triage_status === 'pending_review' || !selectedIssue?.triage_status) ? (
              <View style={styles.superActionGroup}>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#10B981' }]} 
                  onPress={() => selectedIssue && handleApprove(selectedIssue)}
                >
                  <Feather name="check" size={16} color="#FFF" />
                  <Text style={styles.actionBtnText}>Approve & Route to College</Text>
                </TouchableOpacity>

                <TextInput 
                  style={styles.modalInput} 
                  placeholder="Rejection reason (if rejecting)..." 
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={rejectReason}
                  onChangeText={setRejectReason}
                />

                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#EF4444' }]} 
                  onPress={() => selectedIssue && handleReject(selectedIssue)}
                >
                  <Feather name="x" size={16} color="#FFF" />
                  <Text style={styles.actionBtnText}>Reject Issue</Text>
                </TouchableOpacity>

                <View style={styles.mergeRow}>
                  <TextInput 
                    style={[styles.modalInput, { flex: 1 }]} 
                    placeholder="Main Issue ID to merge into..." 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={targetMergeId}
                    onChangeText={setTargetMergeId}
                  />
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: '#8B5CF6', paddingHorizontal: 16 }]} 
                    onPress={() => selectedIssue && handleMerge(selectedIssue)}
                  >
                    <Feather name="git-merge" size={16} color="#FFF" />
                    <Text style={styles.actionBtnText}>Merge Duplicate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: selectedIssue?.status === 'resolved' ? 'rgba(255,255,255,0.1)' : '#3B82F6', marginTop: 20 }]} 
                onPress={() => selectedIssue && handleCollegeAdminStatusToggle(selectedIssue)}
              >
                <Text style={styles.actionBtnText}>
                  {selectedIssue?.status === 'resolved' ? 'REOPEN ISSUE' : 'MARK RESOLVED & CLOSE'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  headerSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '700', marginTop: 2 },
  analyticsBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 16, padding: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#F59E0B' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '800', marginTop: 2, letterSpacing: 0.5 },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.08)' },
  tabContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#3B82F6' },
  tabText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  tabTextActive: { color: '#FFF' },
  metaBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' },
  metaText: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase' },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  studentName: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  studentMeta: { color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 9, fontWeight: '900' },
  issueTitle: { color: '#3B82F6', fontSize: 15, fontWeight: '800', marginBottom: 6 },
  issueDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 18, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  affectedTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  affectedText: { fontSize: 11, fontWeight: '700', color: '#3B82F6' },
  dateText: { fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: '600' },
  emptyBox: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginTop: 16 },
  emptyDesc: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 6 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalDismiss: { flex: 1 },
  modalContent: { backgroundColor: '#1E293B', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '85%', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  modalHandle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalStudent: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  modalEmail: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  modalIssueTitle: { color: '#3B82F6', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  modalIssueDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  replyBox: { backgroundColor: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  replyLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  replyText: { color: '#FFF', fontSize: 13, lineHeight: 18 },
  superActionGroup: { marginTop: 16, gap: 10 },
  actionBtn: { height: 48, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  modalInput: { backgroundColor: 'rgba(0,0,0,0.3)', height: 44, borderRadius: 12, paddingHorizontal: 14, color: '#FFF', fontSize: 13, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  mergeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' }
});
