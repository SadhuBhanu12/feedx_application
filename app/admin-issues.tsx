import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView, TextInput, Platform } from 'react-native';
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
import { exportReportAsCsv } from '@/services/downloadService';
import { useUser } from '@/context/UserContext';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
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
  user_id?: string;
  users?: {
    id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    roll_number?: string;
    pin_number?: string;
    branch?: string;
    academic_year?: string;
    semester?: string;
    college_name?: string;
    college_code?: string;
  };
  colleges?: { id?: string; college_name?: string; name?: string };
  admin_users?: { full_name: string };
}

interface ChatMessage {
  id?: string;
  issue_id: string;
  status?: string;
  note: string;
  actor_id?: string;
  created_at: string;
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
  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = ['admin', 'super_admin', 'inst_admin', 'college_admin', 'campus_admin'].includes(role);

  useEffect(() => {
    if (!user || !isAdmin) {
      Alert.alert('Access Denied', 'Administrative privileges are required to access the Grievance Console.');
      router.replace('/(tabs)');
    }
  }, [user, isAdmin, router]);

  const [issues, setIssues] = useState<Issue[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [reportType, setReportType] = useState<'issues' | 'suggestions' | 'feedbacks'>('issues');
  const [loading, setLoading] = useState(true);

  if (!user || !isAdmin) {
    return null;
  }
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'triage' | 'approved'>('triage');
  const [analytics, setAnalytics] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [targetMergeId, setTargetMergeId] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);

  // Multi-dimensional Filter State
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Live Chat Session with Student
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleExportReports = async () => {
    try {
      setExportingReport(true);
      if (reportType === 'issues') {
        if (issues.length === 0) {
          Alert.alert('No Grievances', 'There are no grievance records to export.');
          return;
        }
        const headers = [
          'Grievance ID',
          'Student Name',
          'PIN / Roll No',
          'Email',
          'Phone',
          'Branch',
          'Academic Year',
          'College Campus',
          'Category',
          'Priority',
          'Title',
          'Description',
          'Affected Count',
          'Status',
          'Triage Status',
          'Reported Date',
          'Resolution Note'
        ];
        const rows = issues.map((i) => [
          i.id,
          i.is_anonymous ? 'Anonymous Student' : (i.users?.full_name || 'Student'),
          i.is_anonymous ? 'Protected' : (i.users?.pin_number || i.users?.roll_number || 'N/A'),
          i.is_anonymous ? 'Protected' : (i.users?.email || 'N/A'),
          i.is_anonymous ? 'Protected' : (i.users?.phone || 'N/A'),
          i.users?.branch || 'N/A',
          i.users?.academic_year || 'N/A',
          i.users?.college_name || i.colleges?.name || 'Institution Desk',
          i.category || 'General',
          i.priority || 'Medium',
          i.title || '',
          i.description || '',
          i.affected_count || 1,
          i.status || 'pending',
          i.triage_status || 'approved',
          i.created_at ? new Date(i.created_at).toLocaleString() : '',
          i.response || ''
        ]);
        await exportReportAsCsv(
          `feedx_grievances_report_${Date.now()}`,
          'College Grievance Support Desk Official Report',
          headers,
          rows
        );
      } else if (reportType === 'suggestions') {
        if (suggestions.length === 0) {
          Alert.alert('No Suggestions', 'There are no suggestion records to export.');
          return;
        }
        const headers = ['Suggestion ID', 'Category', 'Title', 'Description', 'Expected Benefits', 'Submitted Date'];
        const rows = suggestions.map((s) => [
          s.id || '',
          s.category || 'General',
          s.title || '',
          s.description || '',
          s.expected_benefits || 'N/A',
          s.created_at ? new Date(s.created_at).toLocaleString() : ''
        ]);
        await exportReportAsCsv(
          `feedx_suggestions_report_${Date.now()}`,
          'Student Institutional Suggestions Official Report',
          headers,
          rows
        );
      } else {
        if (feedbacks.length === 0) {
          Alert.alert('No Feedback', 'There are no feedback records to export.');
          return;
        }
        const headers = ['Feedback ID', 'Category', 'Rating (Stars)', 'Feedback Content', 'Submitted Date'];
        const rows = feedbacks.map((f) => [
          f.id || '',
          f.category || 'General',
          `${f.rating || 5}/5 Stars`,
          f.feedback_text || '',
          f.created_at ? new Date(f.created_at).toLocaleString() : ''
        ]);
        await exportReportAsCsv(
          `feedx_feedback_report_${Date.now()}`,
          'Student Feedback & Rating Official Report',
          headers,
          rows
        );
      }
    } catch (e: any) {
      Alert.alert('Export Error', e.message || 'Failed to export report.');
    } finally {
      setExportingReport(false);
    }
  };

  const handleExportSingleIssue = async (issue: Issue) => {
    try {
      const headers = [
        'Field',
        'Details'
      ];
      const rows = [
        ['Grievance ID', issue.id],
        ['Student Reporter', issue.is_anonymous ? 'Anonymous Student' : (issue.users?.full_name || 'Student')],
        ['PIN / Roll Number', issue.is_anonymous ? 'Protected' : (issue.users?.pin_number || issue.users?.roll_number || 'N/A')],
        ['Email', issue.is_anonymous ? 'Protected' : (issue.users?.email || 'N/A')],
        ['Phone', issue.is_anonymous ? 'Protected' : (issue.users?.phone || 'N/A')],
        ['Branch & Course', issue.users?.branch || 'N/A'],
        ['Academic Year', issue.users?.academic_year || 'N/A'],
        ['Campus / College', issue.users?.college_name || issue.colleges?.name || 'Institution Desk'],
        ['Category', issue.category || 'General'],
        ['Priority Level', issue.priority || 'Medium'],
        ['Status', issue.status || 'pending'],
        ['Triage Status', issue.triage_status || 'approved'],
        ['Reported Date', issue.created_at ? new Date(issue.created_at).toLocaleString() : ''],
        ['Title', issue.title || ''],
        ['Description', issue.description || ''],
        ['Resolution Note', issue.response || 'No resolution note added yet.']
      ];
      await exportReportAsCsv(
        `feedx_ticket_${issue.id.slice(0, 8)}_${Date.now()}`,
        `Support Grievance Ticket #${issue.id.slice(0, 8)} Summary`,
        headers,
        rows
      );
    } catch (e: any) {
      Alert.alert('Export Error', e.message || 'Failed to download ticket summary.');
    }
  };

  const fetchIssues = async () => {
    try {
      setLoading(true);
      let issuesQuery = supabase
        .from('issues')
        .select(`
          *,
          users:user_id(
            id,
            full_name,
            email,
            phone,
            roll_number,
            pin_number,
            branch,
            academic_year,
            semester,
            college_id,
            college_name,
            college_code
          ),
          colleges(id, college_name)
        `)
        .order('created_at', { ascending: false });

      let suggQuery = supabase
        .from('support_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      let fbQuery = supabase
        .from('support_feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      // Role-based College isolation: strictly scope grievances, suggestions & feedback to their own college
      const effectiveCollegeId = user?.college_id || (!isSuperAdmin ? '6dd12d63-e276-4ff8-8e58-bcd2cc878626' : null);

      if (!isSuperAdmin) {
        if (effectiveCollegeId) {
          issuesQuery = issuesQuery
            .eq('college_id', effectiveCollegeId)
            .neq('status', 'rejected');
          suggQuery = suggQuery.eq('college_id', effectiveCollegeId);
          fbQuery = fbQuery.eq('college_id', effectiveCollegeId);
        } else {
          setIssues([]);
          setSuggestions([]);
          setFeedbacks([]);
          setLoading(false);
          return;
        }
      }

      const [issuesRes, suggRes, fbRes] = await Promise.all([
        issuesQuery,
        suggQuery,
        fbQuery
      ]);

      let loadedIssues = issuesRes.data || [];
      let loadedSuggestions = suggRes.data || [];
      let loadedFeedbacks = fbRes.data || [];

      if (!isSuperAdmin) {
        // College Admins can view grievances from their college or their students that are approved / escalated
        loadedIssues = loadedIssues.filter((i: any) => {
          const matchesCollege = i.college_id === effectiveCollegeId || i.users?.college_id === effectiveCollegeId;
          if (!matchesCollege) return false;
          if (i.status === 'rejected' || i.triage_status === 'rejected') return false;
          // Approved by Super Admin, explicitly routed to College Desk, or escalated
          const isApproved = i.triage_status === 'approved' || i.triage_status === 'college_desk' || i.triage_status === 'escalated' || (!i.triage_status && i.status !== 'pending_review');
          return isApproved;
        });

        if (effectiveCollegeId) {
          loadedSuggestions = loadedSuggestions.filter((s: any) => s.college_id === effectiveCollegeId);
          loadedFeedbacks = loadedFeedbacks.filter((f: any) => f.college_id === effectiveCollegeId);
        }

        // Self-heal: if an approved issue matches this college via student profile, persist college_id to db
        loadedIssues.forEach((i: any) => {
          if (!i.college_id && effectiveCollegeId) {
            supabase.from('issues').update({ college_id: effectiveCollegeId }).eq('id', i.id).then();
          }
        });
      }

      setIssues(loadedIssues);
      setSuggestions(loadedSuggestions);
      setFeedbacks(loadedFeedbacks);

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

  const fetchChatTimeline = async (issueId: string) => {
    try {
      const { data, error } = await supabase
        .from('issue_timeline')
        .select('*')
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });
      if (!error && data) {
        setChatMessages(data);
      }
    } catch (err) {
      console.warn('[AdminIssues] Timeline fetch error:', err);
    }
  };

  useEffect(() => {
    const effectiveCollegeId = user?.college_id || (!isSuperAdmin ? '6dd12d63-e276-4ff8-8e58-bcd2cc878626' : null);
    fetchIssues();
    const rtFilter = (!isSuperAdmin && effectiveCollegeId) ? { filter: `college_id=eq.${effectiveCollegeId}` } : {};
    const channelName = `admin-issues-rt-${effectiveCollegeId || 'super'}-${Date.now()}`;
    const sub = supabase.channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues', ...rtFilter }, fetchIssues)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_suggestions', ...rtFilter }, fetchIssues)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_feedbacks', ...rtFilter }, fetchIssues)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [isSuperAdmin, user?.college_id]);

  // Real-time Chat Subscription when an issue is opened
  useEffect(() => {
    if (!selectedIssue?.id) {
      setChatMessages([]);
      return;
    }

    fetchChatTimeline(selectedIssue.id);

    const chatChannel = supabase.channel(`issue-chat-${selectedIssue.id}-${Date.now()}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'issue_timeline', 
        filter: `issue_id=eq.${selectedIssue.id}` 
      }, () => {
        fetchChatTimeline(selectedIssue.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [selectedIssue?.id]);

  const handleSendChatMessage = async () => {
    if (!newChatMessage.trim() || !selectedIssue?.id) return;
    const textToSend = newChatMessage.trim();
    setNewChatMessage('');
    setSendingMessage(true);
    try {
      await addIssueTimelineEntry(
        selectedIssue.id,
        'Admin Message',
        `Admin: ${textToSend}`,
        user?.id
      );
      await fetchChatTimeline(selectedIssue.id);
    } catch (e: any) {
      Alert.alert('Message Error', 'Could not send message: ' + e.message);
    } finally {
      setSendingMessage(false);
    }
  };

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
    const isResolving = issue.status !== 'resolved';
    const nextStatus = isResolving ? 'resolved' : 'in_progress';
    const finalNote = resolutionNote.trim() || (isResolving ? 'Marked resolved by College Admin.' : 'Reopened for further review.');

    setActionLoading(true);
    try {
      const updatePayload: any = {
        status: nextStatus,
        updated_at: new Date().toISOString(),
      };
      if (isResolving && resolutionNote.trim()) {
        updatePayload.response = resolutionNote.trim();
      }

      await supabase.from('issues').update(updatePayload).eq('id', issue.id);
      await addIssueTimelineEntry(issue.id, nextStatus, finalNote, user?.id);
      Alert.alert('Success', `Issue #${issue.id.slice(0, 8)} marked as ${nextStatus.toUpperCase()}.`);
      setSelectedIssue(null);
      setResolutionNote('');
      fetchIssues();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const displayedIssues = useMemo(() => {
    const list = issues.filter((issue) => {
      if (isSuperAdmin) {
        if (activeTab === 'triage') {
          if (issue.triage_status !== 'pending_review' && issue.triage_status) return false;
        } else {
          if (issue.triage_status !== 'approved' && issue.triage_status !== 'merged' && issue.triage_status !== 'rejected') return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'in_progress') {
          if (issue.status !== 'in_progress' && issue.status !== 'under_review') return false;
        } else if (issue.status !== statusFilter) {
          return false;
        }
      }

      // Priority filter
      if (priorityFilter !== 'all') {
        const p = (issue.priority || 'medium').toLowerCase();
        if (priorityFilter === 'high') {
          if (p !== 'high' && p !== 'critical') return false;
        } else if (p !== priorityFilter) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all') {
        if ((issue.category || 'general').toLowerCase() !== categoryFilter.toLowerCase()) return false;
      }

      return true;
    });

    // Sort high priority escalated issues to the top
    return list.sort((a, b) => {
      const aHigh = a.priority === 'high' || a.priority === 'critical' ? 1 : 0;
      const bHigh = b.priority === 'high' || b.priority === 'critical' ? 1 : 0;
      if (aHigh !== bHigh) return bHigh - aHigh;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [issues, isSuperAdmin, activeTab, statusFilter, priorityFilter, categoryFilter]);

  // Support Desk counts
  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const reviewCount = issues.filter(i => i.status === 'in_progress' || i.status === 'under_review').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const escalatedCount = issues.filter(i => i.priority === 'high' || i.priority === 'critical').length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>{isSuperAdmin ? 'Super Admin Support Triage' : 'College Support Desk'}</Text>
          <Text style={styles.headerSubtitle}>{isSuperAdmin ? 'Governance & Impact Analysis' : 'Grievances & Suggestions Desk'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.exportTopBtn, exportingReport && { opacity: 0.6 }]}
          onPress={handleExportReports}
          disabled={exportingReport}
        >
          {exportingReport ? (
            <ActivityIndicator size="small" color="#10B981" />
          ) : (
            <>
              <Feather name="download" size={15} color="#10B981" />
              <Text style={styles.exportTopText}>Export</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchIssues}>
          <Feather name="refresh-cw" size={17} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Institutional Support Desk KPI Summary Banner */}
      {!isSuperAdmin && (
        <View style={styles.kpiContainer}>
          <TouchableOpacity
            style={[styles.kpiBox, statusFilter === 'all' && styles.kpiBoxActive]}
            onPress={() => setStatusFilter('all')}
          >
            <Text style={styles.kpiNum}>{issues.length}</Text>
            <Text style={styles.kpiLabel}>TOTAL</Text>
          </TouchableOpacity>
          <View style={styles.kpiDivider} />
          <TouchableOpacity
            style={[styles.kpiBox, statusFilter === 'pending' && styles.kpiBoxActive]}
            onPress={() => setStatusFilter('pending')}
          >
            <Text style={[styles.kpiNum, { color: '#EF4444' }]}>{pendingCount}</Text>
            <Text style={styles.kpiLabel}>PENDING</Text>
          </TouchableOpacity>
          <View style={styles.kpiDivider} />
          <TouchableOpacity
            style={[styles.kpiBox, statusFilter === 'in_progress' && styles.kpiBoxActive]}
            onPress={() => setStatusFilter('in_progress')}
          >
            <Text style={[styles.kpiNum, { color: '#F59E0B' }]}>{reviewCount}</Text>
            <Text style={styles.kpiLabel}>REVIEW</Text>
          </TouchableOpacity>
          <View style={styles.kpiDivider} />
          <TouchableOpacity
            style={[styles.kpiBox, statusFilter === 'resolved' && styles.kpiBoxActive]}
            onPress={() => setStatusFilter('resolved')}
          >
            <Text style={[styles.kpiNum, { color: '#10B981' }]}>{resolvedCount}</Text>
            <Text style={styles.kpiLabel}>RESOLVED</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Primary Segmented Tab Switcher */}
      <View style={styles.segmentedContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, reportType === 'issues' && styles.segmentBtnActive]}
          onPress={() => setReportType('issues')}
        >
          <Text style={[styles.segmentText, reportType === 'issues' && styles.segmentTextActive]}>
            🔴 Grievances ({issues.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, reportType === 'suggestions' && styles.segmentBtnActive]}
          onPress={() => setReportType('suggestions')}
        >
          <Text style={[styles.segmentText, reportType === 'suggestions' && styles.segmentTextActive]}>
            💡 Suggestions ({suggestions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, reportType === 'feedbacks' && styles.segmentBtnActive]}
          onPress={() => setReportType('feedbacks')}
        >
          <Text style={[styles.segmentText, reportType === 'feedbacks' && styles.segmentTextActive]}>
            💬 Feedback ({feedbacks.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Secondary Status & Priority Filter Chips (Fixed Non-Stretching Layout) */}
      {reportType === 'issues' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[styles.chipBtn, statusFilter === 'all' && priorityFilter === 'all' && styles.chipBtnActive]}
            onPress={() => {
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
          >
            <Text style={[styles.chipText, statusFilter === 'all' && priorityFilter === 'all' && styles.chipTextActive]}>
              All ({issues.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chipBtn, statusFilter === 'pending' && styles.chipBtnActivePending]}
            onPress={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          >
            <View style={[styles.dotIndicator, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.chipText, statusFilter === 'pending' && { color: '#EF4444', fontWeight: '800' }]}>
              Pending ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chipBtn, statusFilter === 'in_progress' && styles.chipBtnActiveReview]}
            onPress={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
          >
            <View style={[styles.dotIndicator, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.chipText, statusFilter === 'in_progress' && { color: '#F59E0B', fontWeight: '800' }]}>
              Under Review ({reviewCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chipBtn, statusFilter === 'resolved' && styles.chipBtnActiveResolved]}
            onPress={() => setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved')}
          >
            <View style={[styles.dotIndicator, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.chipText, statusFilter === 'resolved' && { color: '#10B981', fontWeight: '800' }]}>
              Resolved ({resolvedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chipBtn,
              priorityFilter === 'high' && styles.chipBtnActiveEscalated,
              { borderColor: priorityFilter === 'high' ? '#EF4444' : 'rgba(239, 68, 68, 0.3)' }
            ]}
            onPress={() => setPriorityFilter(priorityFilter === 'high' ? 'all' : 'high')}
          >
            <MaterialCommunityIcons name="alert-decagram" size={13} color="#EF4444" style={{ marginRight: 4 }} />
            <Text style={[styles.chipText, { color: '#EF4444', fontWeight: priorityFilter === 'high' ? '900' : '700' }]}>
              Escalated ({escalatedCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

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

      {/* List Views */}
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
            style={{ flex: 1 }}
            data={suggestions}
            keyExtractor={(item, index) => item.id || String(index)}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedSuggestion(item)}>
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
                    <Text style={styles.tapToViewText}>Tap to view whole report →</Text>
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
            style={{ flex: 1 }}
            data={feedbacks}
            keyExtractor={(item, index) => item.id || String(index)}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedFeedback(item)}>
                <Animated.View entering={FadeInDown.delay(index * 40)} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.studentName}>{item.category?.toUpperCase() || 'FEEDBACK'}</Text>
                    <View style={[styles.badge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                      <Text style={[styles.badgeText, { color: '#F59E0B' }]}>★ {item.rating || 5}/5</Text>
                    </View>
                  </View>
                  <Text style={styles.issueTitle}>{item.feedback_text}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.tapToViewText}>Tap to view details →</Text>
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
          <Text style={styles.emptyTitle}>No Grievance Issues Found</Text>
          <Text style={styles.emptyDesc}>No tickets match the selected filters.</Text>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={displayedIssues}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          renderItem={({ item, index }) => {
            const studentPin = item.users?.pin_number || item.users?.roll_number;
            const studentBranch = item.users?.branch;
            const studentYear = item.users?.academic_year;
            const isEscalated = item.priority === 'high' || item.priority === 'critical';

            return (
              <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedIssue(item)}>
                <Animated.View entering={FadeInDown.delay(index * 40)} style={[styles.card, isEscalated && { borderColor: 'rgba(239, 68, 68, 0.4)', borderWidth: 1.5 }]}>
                  {isEscalated && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(239, 68, 68, 0.15)', alignSelf: 'flex-start' }}>
                      <MaterialCommunityIcons name="alert-decagram" size={12} color="#EF4444" />
                      <Text style={{ fontSize: 10, fontWeight: '900', color: '#EF4444', letterSpacing: 0.5 }}>HIGH PRIORITY ESCALATED</Text>
                    </View>
                  )}

                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName}>
                        {item.is_anonymous ? 'Anonymous Student' : (item.users?.full_name || 'Student')}
                      </Text>
                      <View style={styles.studentBadgeRow}>
                        {!item.is_anonymous && studentPin ? (
                          <View style={styles.pinPill}>
                            <Text style={styles.pinPillText}>PIN: {studentPin}</Text>
                          </View>
                        ) : null}
                        {!item.is_anonymous && studentBranch ? (
                          <Text style={styles.studentMeta}>
                            {studentBranch} {studentYear ? `• ${studentYear}` : ''}
                          </Text>
                        ) : (
                          <Text style={styles.studentMeta}>
                            {item.is_anonymous ? 'Identity protected' : item.users?.email || 'Student Account'}
                          </Text>
                        )}
                      </View>
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
            );
          }}
        />
      )}

      {/* 1. Grievance Detail Modal / Triage Actions & Live Chat */}
      <Modal visible={!!selectedIssue} transparent animationType="slide" onRequestClose={() => setSelectedIssue(null)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setSelectedIssue(null)} />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalStudent}>
                  {selectedIssue?.is_anonymous ? 'Anonymous Student Report' : selectedIssue?.users?.full_name || 'Student Report'}
                </Text>
                <Text style={styles.modalEmail}>
                  {selectedIssue?.is_anonymous ? 'Identity hidden by student request' : selectedIssue?.users?.email || 'Email verified'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                  style={styles.modalExportIconBtn}
                  onPress={() => selectedIssue && handleExportSingleIssue(selectedIssue)}
                >
                  <Feather name="download" size={15} color="#10B981" />
                </TouchableOpacity>
                <TriageBadge triageStatus={selectedIssue?.triage_status} status={selectedIssue?.status || 'pending'} />
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Comprehensive Student Profile Card */}
              {!selectedIssue?.is_anonymous && (
                <View style={styles.studentProfileCard}>
                  <View style={styles.profileCardHeader}>
                    <MaterialCommunityIcons name="card-account-details-outline" size={16} color="#3B82F6" />
                    <Text style={styles.profileCardTitle}>STUDENT REPORTER INFORMATION</Text>
                  </View>

                  <View style={styles.profileGrid}>
                    <View style={styles.profileGridItem}>
                      <Text style={styles.profileItemLabel}>Full Name</Text>
                      <Text style={styles.profileItemValue}>{selectedIssue?.users?.full_name || 'N/A'}</Text>
                    </View>

                    <View style={styles.profileGridItem}>
                      <Text style={styles.profileItemLabel}>Roll No / PIN</Text>
                      <Text style={[styles.profileItemValue, { color: '#3B82F6', fontWeight: '900' }]}>
                        {selectedIssue?.users?.pin_number || selectedIssue?.users?.roll_number || 'N/A'}
                      </Text>
                    </View>

                    <View style={styles.profileGridItem}>
                      <Text style={styles.profileItemLabel}>Branch / Course</Text>
                      <Text style={styles.profileItemValue}>{selectedIssue?.users?.branch || selectedIssue?.category || 'N/A'}</Text>
                    </View>

                    <View style={styles.profileGridItem}>
                      <Text style={styles.profileItemLabel}>Academic Year</Text>
                      <Text style={styles.profileItemValue}>
                        {selectedIssue?.users?.academic_year || (selectedIssue?.users?.semester ? `Sem ${selectedIssue.users.semester}` : 'Diploma Scholar')}
                      </Text>
                    </View>

                    <View style={styles.profileGridItem}>
                      <Text style={styles.profileItemLabel}>Phone Number</Text>
                      <Text style={styles.profileItemValue}>{selectedIssue?.users?.phone || 'Not provided'}</Text>
                    </View>

                    <View style={styles.profileGridItem}>
                      <Text style={styles.profileItemLabel}>College Campus</Text>
                      <Text style={styles.profileItemValue}>
                        {selectedIssue?.users?.college_name || selectedIssue?.colleges?.name || 'Institution Desk'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Issue Content Header */}
              <Text style={styles.modalIssueTitle}>{selectedIssue?.title}</Text>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {selectedIssue?.category && (
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>{selectedIssue.category}</Text>
                  </View>
                )}
                {selectedIssue?.priority && (
                  <View style={[styles.metaBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                    <Text style={[styles.metaText, { color: '#EF4444' }]}>{selectedIssue.priority} PRIORITY</Text>
                  </View>
                )}
                <View style={[styles.metaBadge, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Text style={[styles.metaText, { color: '#3B82F6' }]}>
                    Reported: {selectedIssue?.created_at ? new Date(selectedIssue.created_at).toLocaleString() : ''}
                  </Text>
                </View>
              </View>

              <Text style={styles.modalIssueDesc}>{selectedIssue?.description}</Text>
              
              {selectedIssue?.attachments && selectedIssue.attachments.length > 0 && (
                <View style={{ marginTop: 14 }}>
                  <Text style={styles.replyLabel}>ATTACHMENTS ({selectedIssue.attachments.length})</Text>
                  {selectedIssue.attachments.map((att, i) => (
                    <Text key={i} style={{ color: '#3B82F6', fontSize: 12, marginBottom: 4 }}>📎 {att.split('/').pop()}</Text>
                  ))}
                </View>
              )}

              {/* Two-Way Live Chat Session Widget */}
              <View style={styles.chatSessionContainer}>
                <View style={styles.chatHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialCommunityIcons 
                      name={selectedIssue?.status === 'resolved' ? 'lock-outline' : 'chat-processing-outline'} 
                      size={18} 
                      color={selectedIssue?.status === 'resolved' ? '#10B981' : '#3B82F6'} 
                    />
                    <Text style={styles.chatHeaderTitle}>
                      {selectedIssue?.status === 'resolved' ? 'RESOLVED CHAT ARCHIVE' : 'LIVE CHAT WITH STUDENT'}
                    </Text>
                  </View>
                  <View style={[styles.chatStatusTag, { backgroundColor: selectedIssue?.status === 'resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)' }]}>
                    <Text style={[styles.chatStatusTagText, { color: selectedIssue?.status === 'resolved' ? '#10B981' : '#60A5FA' }]}>
                      {selectedIssue?.status === 'resolved' ? '🔒 Resolved' : '🟢 Open Session'}
                    </Text>
                  </View>
                </View>

                {/* Messages List */}
                <View style={styles.chatMessagesWrap}>
                  {chatMessages.filter(m => m.note && (m.note.startsWith('User:') || m.note.startsWith('Admin:') || m.actor_id)).length === 0 ? (
                    <View style={styles.noChatBox}>
                      <Text style={styles.noChatText}>No messages exchanged yet. Send a message to the student below.</Text>
                    </View>
                  ) : (
                    chatMessages
                      .filter(m => m.note && (m.note.startsWith('User:') || m.note.startsWith('Admin:') || m.actor_id))
                      .map((msg, idx) => {
                        const isFromAdmin = msg.note.startsWith('Admin:') || (msg.actor_id === user?.id);
                        const cleanContent = msg.note.replace(/^(User:|Admin:)\s*/i, '');
                        return (
                          <View 
                            key={idx} 
                            style={[
                              styles.chatBubbleRow, 
                              isFromAdmin ? styles.chatBubbleRowAdmin : styles.chatBubbleRowStudent
                            ]}
                          >
                            <View 
                              style={[
                                styles.chatBubble, 
                                isFromAdmin ? styles.chatBubbleAdmin : styles.chatBubbleStudent
                              ]}
                            >
                              <Text style={[styles.chatSenderLabel, { color: isFromAdmin ? '#93C5FD' : '#A7F3D0' }]}>
                                {isFromAdmin ? 'College Admin (You)' : (selectedIssue?.is_anonymous ? 'Student' : selectedIssue?.users?.full_name || 'Student')}
                              </Text>
                              <Text style={styles.chatMessageText}>{cleanContent}</Text>
                              <Text style={styles.chatMessageTime}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Text>
                            </View>
                          </View>
                        );
                      })
                  )}
                </View>

                {/* Chat Send Input */}
                {selectedIssue?.status !== 'resolved' ? (
                  <View style={styles.chatInputRow}>
                    <TextInput
                      style={styles.chatTextInput}
                      placeholder="Type a message to the student..."
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={newChatMessage}
                      onChangeText={setNewChatMessage}
                    />
                    <TouchableOpacity
                      style={[styles.chatSendBtn, (!newChatMessage.trim() || sendingMessage) && { opacity: 0.5 }]}
                      onPress={handleSendChatMessage}
                      disabled={!newChatMessage.trim() || sendingMessage}
                    >
                      {sendingMessage ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Feather name="send" size={15} color="#FFF" />
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.chatArchivedNotice}>
                    <Feather name="lock" size={13} color="#10B981" />
                    <Text style={styles.chatArchivedText}>
                      Issue is resolved. This chat session is closed and preserved as official audit log.
                    </Text>
                  </View>
                )}
              </View>

              {/* Resolution Note */}
              {selectedIssue?.response && (
                <View style={styles.replyBox}>
                  <Text style={styles.replyLabel}>EXISTING RESOLUTION / NOTE:</Text>
                  <Text style={styles.replyText}>{selectedIssue.response}</Text>
                </View>
              )}

              {/* College Admin Resolution Note Input before closing */}
              {!isSuperAdmin && selectedIssue?.status !== 'resolved' && (
                <View style={{ marginTop: 14 }}>
                  <Text style={styles.replyLabel}>RESOLUTION NOTE FOR STUDENT (OPTIONAL):</Text>
                  <TextInput
                    style={[styles.modalInput, { height: 50, textAlignVertical: 'top' }]}
                    placeholder="e.g. Inspected on campus and resolved by Department HOD."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    multiline
                    value={resolutionNote}
                    onChangeText={setResolutionNote}
                  />
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
                style={[
                  styles.actionBtn, 
                  { 
                    backgroundColor: selectedIssue?.status === 'resolved' ? 'rgba(255,255,255,0.1)' : '#10B981', 
                    marginTop: 12 
                  }
                ]} 
                onPress={() => selectedIssue && handleCollegeAdminStatusToggle(selectedIssue)}
              >
                <Feather 
                  name={selectedIssue?.status === 'resolved' ? 'rotate-ccw' : 'check-circle'} 
                  size={16} 
                  color="#FFF" 
                />
                <Text style={styles.actionBtnText}>
                  {selectedIssue?.status === 'resolved' ? 'REOPEN ISSUE' : 'MARK RESOLVED & CLOSE'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* 2. Suggestion Detail Modal */}
      <Modal visible={!!selectedSuggestion} transparent animationType="slide" onRequestClose={() => setSelectedSuggestion(null)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setSelectedSuggestion(null)} />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalStudent}>Institutional Suggestion Report</Text>
                <Text style={styles.modalEmail}>
                  Submitted: {selectedSuggestion?.created_at ? new Date(selectedSuggestion.created_at).toLocaleString() : 'Recent'}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                <Text style={[styles.badgeText, { color: '#3B82F6' }]}>{selectedSuggestion?.category?.toUpperCase() || 'SUGGESTION'}</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={styles.modalIssueTitle}>{selectedSuggestion?.title}</Text>
              
              <Text style={styles.replyLabel}>PROPOSED SUGGESTION:</Text>
              <Text style={[styles.modalIssueDesc, { marginBottom: 16 }]}>{selectedSuggestion?.description}</Text>

              {selectedSuggestion?.expected_benefits && (
                <>
                  <Text style={styles.replyLabel}>EXPECTED BENEFITS TO STUDENTS / CAMPUS:</Text>
                  <View style={styles.replyBox}>
                    <Text style={styles.replyText}>{selectedSuggestion.expected_benefits}</Text>
                  </View>
                </>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: '#3B82F6', marginTop: 12 }]}
              onPress={() => setSelectedSuggestion(null)}
            >
              <Text style={styles.actionBtnText}>CLOSE REPORT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Feedback Detail Modal */}
      <Modal visible={!!selectedFeedback} transparent animationType="slide" onRequestClose={() => setSelectedFeedback(null)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setSelectedFeedback(null)} />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalStudent}>Student Feedback & Rating Report</Text>
                <Text style={styles.modalEmail}>
                  Submitted: {selectedFeedback?.created_at ? new Date(selectedFeedback.created_at).toLocaleString() : 'Recent'}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                <Text style={[styles.badgeText, { color: '#F59E0B' }]}>★ {selectedFeedback?.rating || 5}/5 STARS</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={styles.replyLabel}>CATEGORY: {selectedFeedback?.category?.toUpperCase() || 'GENERAL EXPERIENCE'}</Text>
              <Text style={styles.replyLabel}>STUDENT FEEDBACK:</Text>
              <View style={styles.replyBox}>
                <Text style={styles.replyText}>{selectedFeedback?.feedback_text}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: '#3B82F6', marginTop: 12 }]}
              onPress={() => setSelectedFeedback(null)}
            >
              <Text style={styles.actionBtnText}>CLOSE REPORT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 42, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 19, fontWeight: '900', color: '#FFF' },
  headerSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '700', marginTop: 2 },
  exportTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginRight: 8,
  },
  exportTopText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  modalExportIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 16, padding: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#F59E0B' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '800', marginTop: 2, letterSpacing: 0.5 },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.1)' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 10 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  tabBtnActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: '#FFF' },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  studentName: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  studentBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  pinPill: { backgroundColor: 'rgba(59, 130, 246, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)' },
  pinPillText: { color: '#60A5FA', fontSize: 10, fontWeight: '900' },
  studentMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' },
  issueTitle: { color: '#FFF', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  issueDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  affectedTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  affectedText: { color: '#3B82F6', fontSize: 11, fontWeight: '700' },
  tapToViewText: { color: '#3B82F6', fontSize: 11, fontWeight: '700' },
  dateText: { color: 'rgba(255,255,255,0.3)', fontSize: 11 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  emptyTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptyDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', marginTop: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalDismiss: { ...StyleSheet.absoluteFill },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxHeight: '92%',
    minHeight: 380,
    flex: 1,
  },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: 14 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  modalStudent: { color: '#FFF', fontSize: 17, fontWeight: '900' },
  modalEmail: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  studentProfileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  profileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 6,
  },
  profileCardTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#60A5FA',
    letterSpacing: 0.6,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  profileGridItem: {
    width: '50%',
    paddingRight: 6,
  },
  profileItemLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
  },
  profileItemValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 1,
  },
  modalIssueTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  metaBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)' },
  metaText: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700' },
  modalIssueDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 20 },
  chatSessionContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  chatHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  chatStatusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  chatStatusTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  chatMessagesWrap: {
    paddingVertical: 10,
    gap: 8,
    minHeight: 80,
    maxHeight: 180,
  },
  noChatBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  noChatText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    textAlign: 'center',
  },
  chatBubbleRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  chatBubbleRowAdmin: {
    justifyContent: 'flex-end',
  },
  chatBubbleRowStudent: {
    justifyContent: 'flex-start',
  },
  chatBubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chatBubbleAdmin: {
    backgroundColor: '#1E40AF',
    borderTopRightRadius: 2,
  },
  chatBubbleStudent: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatSenderLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  chatMessageText: {
    color: '#FFF',
    fontSize: 12.5,
    lineHeight: 17,
  },
  chatMessageTime: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    color: '#FFF',
    fontSize: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatSendBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatArchivedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  chatArchivedText: {
    fontSize: 10.5,
    color: '#10B981',
    fontWeight: '700',
    flex: 1,
  },
  replyBox: { marginTop: 14, padding: 12, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
  replyLabel: { color: '#3B82F6', fontSize: 10, fontWeight: '800', marginBottom: 4 },
  replyText: { color: '#FFF', fontSize: 12 },
  superActionGroup: { gap: 10, marginTop: 16 },
  actionBtn: { height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  modalInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#FFF', fontSize: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  mergeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  kpiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  kpiBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 10,
  },
  kpiBoxActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  kpiNum: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFF',
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  kpiDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  segmentedContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#3B82F6',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  filterScrollView: {
    flexGrow: 0,
    height: 48,
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  chipBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipBtnActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3B82F6',
  },
  chipBtnActivePending: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  chipBtnActiveReview: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#F59E0B',
  },
  chipBtnActiveResolved: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  chipBtnActiveEscalated: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
