import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  BackHandler,
  Image,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { uploadSupportAttachment, getIssueTimeline, addIssueTimelineEntry, submitSupportSuggestion, submitSupportFeedback, ensurePublicProfile, withTimeout } from '@/services/supabaseService';
import { downloadOrOpenFile } from '@/services/downloadService';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { validateText } from '@/utils/validation';
import FeedbackModal from '@/components/ui/FeedbackModal';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const REPORT_CATEGORIES = [
  'Anti-Ragging',
  'Harassment',
  'Girls-Related Safety',
  'Other Serious Campus Issue',
];

const SUGGESTION_CATEGORIES = [
  'Academics', 'Infrastructure', 'Placements', 'Fests', 'Extracurricular', 'Other'
];

const FEEDBACK_CATEGORIES = [
  'Department & Curriculum', 'Faculty & Teaching', 'Laboratory & Equipment', 'Campus Facilities', 'Placements & Training'
];

const FAQS = [
  { q: 'Is my identity completely safe?', a: 'Yes. When the "Anonymous Toggle" is on, your personal identifiers are completely stripped before saving to the database.' },
  { q: 'How long does triage take?', a: 'Typically under 24 hours. Tickets move from Super Admin review to College Admin within a business day.' },
  { q: 'Where do I find my certificates?', a: 'Once an event check-in is complete and feedback is submitted, certificates will appear in your profile.' }
];

export default function SupportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUser();
  const { colors, isDark } = useTheme();

  const initialMode = params?.mode === 'report' ? 'report_category' : params?.mode === 'my_reports' ? 'my_reports' : 'home';
  const [viewMode, setViewMode] = useState(initialMode); // home, report_category, report_step2, report_step3, success, suggestion, feedback, my_reports, details

  // Submissions lists
  const [issues, setIssues] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [myReportsTab, setMyReportsTab] = useState('issues'); // issues, suggestions, feedbacks
  const [fetching, setFetching] = useState(true);

  // Active details
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailModalItem, setDetailModalItem] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Form states - Issue
  const [issueCategory, setIssueCategory] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueLoc, setIssueLoc] = useState('');
  const [issueBuilding, setIssueBuilding] = useState('');
  const [issueFloor, setIssueFloor] = useState('');
  const [issueRoom, setIssueRoom] = useState('');
  const [issueAnonymous, setIssueAnonymous] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [generatedId, setGeneratedId] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation error states
  const [issueTitleError, setIssueTitleError] = useState('');
  const [issueDescError, setIssueDescError] = useState('');
  const [issueLocError, setIssueLocError] = useState('');

  // Form states - Suggestion
  const [suggTitle, setSuggTitle] = useState('');
  const [suggCategory, setSuggCategory] = useState('Academics');
  const [suggDesc, setSuggDesc] = useState('');
  const [suggBenefits, setSuggBenefits] = useState('');
  const [suggAnonymous, setSuggAnonymous] = useState(true);

  // Form states - Feedback
  const [fbRating, setFbRating] = useState(5);
  const [fbCategory, setFbCategory] = useState('Academics');
  const [fbText, setFbText] = useState('');
  const [fbAnonymous, setFbAnonymous] = useState(false);

  // Search & Filter in My Reports
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Error & Feedback Modal State
  const [errorModal, setErrorModal] = useState({ visible: false, title: '', message: '' });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchUserData();

    if (!user?.id) return;

    fetchUserData();

    const channel = supabase.channel(`support-screen-updates-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues', filter: `user_id=eq.${user.id}` }, () => fetchUserData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_suggestions', filter: `user_id=eq.${user.id}` }, () => fetchUserData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_feedbacks', filter: `user_id=eq.${user.id}` }, () => fetchUserData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    if (params?.mode === 'report') {
      setViewMode('report_category');
    } else if (params?.mode === 'my_reports' || params?.mode === 'all') {
      setViewMode('my_reports');
    } else if (params?.mode === 'home') {
      setViewMode('home');
    }
  }, [params?.mode]);

  useEffect(() => {
    if (viewMode === 'my_reports' || viewMode === 'home') {
      fetchUserData();
    }
  }, [viewMode]);

  const handleBackNavigation = () => {
    if (viewMode === 'report_details') {
      setViewMode('report_category');
      return;
    }
    if (viewMode === 'report_review') {
      setViewMode('report_details');
      return;
    }
    if (viewMode === 'details') {
      setViewMode('my_reports');
      return;
    }
    if (viewMode !== 'home') {
      setViewMode('home');
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      if (viewMode === 'home') {
        if (router.canGoBack()) {
          router.back();
          return true;
        }
        router.replace('/(tabs)');
        return true;
      }
      handleBackNavigation();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [viewMode]);

  useEffect(() => {
    if (!selectedItem?.id) return;

    // Subscribe to timeline changes for selected issue
    const channel = supabase.channel(`issue-timeline-${selectedItem.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issue_timeline', filter: `issue_id=eq.${selectedItem.id}` }, async () => {
        const entries = await getIssueTimeline(selectedItem.id);
        const base = [{ status: 'pending', note: 'Ticket submitted', created_at: selectedItem.created_at }, ...entries];
        if (selectedItem.response) base.push({ status: selectedItem.status, note: selectedItem.response, created_at: selectedItem.updated_at || selectedItem.created_at });
        setTimeline(base);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedItem?.id]);

  const fetchUserData = async () => {
    if (!user?.id) {
      setFetching(false);
      return;
    }
    setFetching(true);
    try {
      const [issuesRes, suggsRes, fbsRes] = await withTimeout(
        Promise.all([
          supabase.from('issues').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('support_suggestions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('support_feedbacks').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        ]),
        15000
      );

      setIssues(issuesRes.data || []);
      setSuggestions(suggsRes.data || []);
      setFeedbacks(fbsRes.data || []);
    } catch (e) {
      console.warn('Support lists fetch error:', e);
      Alert.alert('Connection Error', 'Could not load your support tickets. Please check your internet connection.');
    } finally {
      setFetching(false);
    }
  };

  const pickAttachment = async () => {
    try {
      if (attachments.length >= 3) {
        Alert.alert('Limit Reached', 'Maximum 3 photos allowed. Please remove an existing photo to attach a new one.');
        return;
      }
      const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'], copyToCacheDirectory: true, multiple: true });
      if (result.canceled) return;
      const validAssets = (result.assets || []).filter(a => a && a.uri);
      const remainingSlots = 3 - attachments.length;
      if (validAssets.length > remainingSlots) {
        Alert.alert('Limit Applied', `Only ${remainingSlots} photo(s) added. Maximum 3 photos allowed.`);
      }
      setAttachments((prev) => [...prev, ...validAssets.slice(0, remainingSlots)]);
    } catch (e) {
      Alert.alert('Attachment Error', e.message || 'Could not pick file.');
    }
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const handleReviewTicket = () => {
    setIssueTitleError('');
    setIssueDescError('');
    setIssueLocError('');

    let hasError = false;
    const titleCheck = validateText(issueTitle, { min: 5, max: 100, fieldName: 'Issue Title' });
    if (!titleCheck.isValid) {
      setIssueTitleError(titleCheck.error || 'Please enter an issue title (min 5 characters).');
      hasError = true;
    }

    const descCheck = validateText(issueDesc, { min: 15, max: 1000, fieldName: 'Issue Description' });
    if (!descCheck.isValid) {
      setIssueDescError(descCheck.error || 'Please enter a detailed description (min 15 characters).');
      hasError = true;
    }

    if (!issueLoc.trim()) {
      setIssueLocError('Please specify the campus location / area.');
      hasError = true;
    }

    if (hasError) {
      Alert.alert('Validation Error', 'Please complete all required fields with valid details before reviewing your ticket.');
      return;
    }

    setViewMode('report_review');
  };

  const handleIssueSubmit = async () => {
    const titleCheck = validateText(issueTitle, { min: 5, max: 100, fieldName: 'Issue Title' });
    if (!titleCheck.isValid) {
      Alert.alert('Validation Error', titleCheck.error);
      return;
    }
    const descCheck = validateText(issueDesc, { min: 15, max: 1000, fieldName: 'Issue Description' });
    if (!descCheck.isValid) {
      Alert.alert('Validation Error', descCheck.error);
      return;
    }
    setLoading(true);
    try {
      await ensurePublicProfile(user);
      const attachmentUrls = [];
      for (const file of attachments) {
        const url = await uploadSupportAttachment(user.id, file.uri, file.name);
        attachmentUrls.push(url);
      }

      const randomNum = String(Math.floor(100 + Math.random() * 90000)).padStart(5, '0');
      const issueId = `FEEDX-GR-2026-${randomNum}`;
      let studentCollegeId = user?.college_id || user?.institution_id || user?.user_metadata?.college_id || null;
      if (!studentCollegeId && user?.id) {
        try {
          const { data: stRec } = await supabase.from('students').select('college_id').or(`id.eq.${user.id},user_id.eq.${user.id}`).maybeSingle();
          studentCollegeId = stRec?.college_id || null;
          if (!studentCollegeId) {
            const { data: uRec } = await supabase.from('users').select('college_id').eq('id', user.id).maybeSingle();
            studentCollegeId = uRec?.college_id || null;
          }
        } catch (_) {}
      }

      const newPayload = {
        id: issueId,
        title: issueTitle.trim(),
        description: issueDesc.trim(),
        category: issueCategory,
        location: issueLoc.trim(),
        building: issueBuilding.trim(),
        floor: issueFloor.trim(),
        room: issueRoom.trim(),
        is_anonymous: issueAnonymous,
        user_id: user.id,
        college_id: studentCollegeId,
        status: 'pending',
        triage_status: 'pending_review',
        attachment_urls: attachmentUrls,
      };

      const { data, error } = await supabase.from('issues').insert(newPayload).select();
      if (error) throw error;

      await addIssueTimelineEntry(issueId, 'pending', 'Ticket submitted', user.id);
      setGeneratedId(issueId);
      
      // Reset forms
      setIssueTitle('');
      setIssueDesc('');
      setIssueLoc('');
      setIssueBuilding('');
      setIssueFloor('');
      setIssueRoom('');
      setAttachments([]);

      await fetchUserData();
      setViewMode('success');
    } catch (e) {
      let errTitle = 'Submission Failed';
      let errMsg = e?.message || 'An unexpected issue occurred while submitting grievance.';
      const rawMsg = String(e?.message || '').toLowerCase();
      if (rawMsg.includes('network request failed') || rawMsg.includes('failed to fetch') || rawMsg.includes('is not connected')) {
        errTitle = 'Connection Error';
        errMsg = 'Could not reach server. Please check your network connection and try again.';
      } else if (rawMsg.includes('timeout') || rawMsg.includes('timed out')) {
        errTitle = 'Connection Timeout';
        errMsg = 'The server took too long to respond. Please try submitting again.';
      } else if (rawMsg.includes('jwt') || rawMsg.includes('auth') || rawMsg.includes('session')) {
        errTitle = 'Authentication Error';
        errMsg = 'Your session has expired. Please re-login and submit again.';
      } else {
        errTitle = 'Submission Notice';
        errMsg = e?.message || 'Could not complete grievance submission. Please retry.';
      }
      setErrorModal({ visible: true, title: errTitle, message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSubmit = async () => {
    const titleCheck = validateText(suggTitle, { min: 5, max: 100, fieldName: 'Suggestion Title' });
    if (!titleCheck.isValid) {
      Alert.alert('Validation Error', titleCheck.error);
      return;
    }
    const descCheck = validateText(suggDesc, { min: 10, max: 1000, fieldName: 'Description' });
    if (!descCheck.isValid) {
      Alert.alert('Validation Error', descCheck.error);
      return;
    }
    setLoading(true);
    try {
      await ensurePublicProfile(user);
      const studentCollegeId = user?.college_id || user?.user_metadata?.college_id || null;
      const payload = {
        title: suggTitle.trim(),
        category: suggCategory,
        description: suggDesc.trim(),
        expected_benefits: suggBenefits.trim(),
        is_anonymous: suggAnonymous,
        user_id: user.id,
      };
      await submitSupportSuggestion(payload);
      setSuggTitle('');
      setSuggDesc('');
      setSuggBenefits('');
      await fetchUserData();
      setViewMode('suggestion_success');
    } catch (e) {
      setErrorModal({ visible: true, title: 'Submission Error', message: e.message || 'Could not log suggestion.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    const fbCheck = validateText(fbText, { min: 5, max: 1000, fieldName: 'Feedback Text' });
    if (!fbCheck.isValid) {
      Alert.alert('Validation Error', fbCheck.error);
      return;
    }
    setLoading(true);
    try {
      await ensurePublicProfile(user);
      const payload = {
        rating: fbRating,
        category: fbCategory,
        feedback_text: fbText.trim(),
        is_anonymous: fbAnonymous,
        user_id: user.id,
      };
      await submitSupportFeedback(payload);
      setFbText('');
      setFbRating(5);
      await fetchUserData();
      setViewMode('feedback_success');
    } catch (e) {
      setErrorModal({ visible: true, title: 'Submission Error', message: e.message || 'Could not log feedback.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReportDetails = async (item) => {
    setSelectedItem(item);
    setLoading(true);
    try {
      const entries = await getIssueTimeline(item.id);
      const base = [{ status: 'pending', note: 'Ticket submitted', created_at: item.created_at }, ...entries];
      if (item.response) base.push({ status: item.status, note: item.response, created_at: item.updated_at || item.created_at });
      setTimeline(base);
      setViewMode('details');
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { error } = await supabase.from('issue_timeline').insert({
        issue_id: selectedItem.id,
        status: selectedItem.status,
        note: `User: ${newComment.trim()}`,
        actor_id: user.id,
      });
      if (error) throw error;
      setNewComment('');
      handleOpenReportDetails(selectedItem);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const getStatusConfig = (status, triage) => {
    const key = triage === 'pending_review' || triage === 'rejected' || triage === 'merged' ? triage : status;
    const config = {
      'pending_review': { color: '#F59E0B', label: 'Under Review', bgColor: 'rgba(245, 158, 11, 0.1)' },
      'approved': { color: '#3B82F6', label: 'Approved', bgColor: 'rgba(59, 130, 246, 0.1)' },
      'in_progress': { color: '#6366F1', label: 'In Progress', bgColor: 'rgba(99, 102, 241, 0.1)' },
      'resolved': { color: '#10B981', label: 'Resolved', bgColor: 'rgba(16, 185, 129, 0.1)' },
      'rejected': { color: '#EF4444', label: 'Closed', bgColor: 'rgba(239, 68, 68, 0.1)' },
      'merged': { color: '#8B5CF6', label: 'Merged', bgColor: 'rgba(139, 92, 246, 0.1)' },
    };
    return config[key] || { color: '#64748B', label: 'Submitted', bgColor: 'rgba(100, 116, 139, 0.1)' };
  };

  const getStageStates = (status, triage) => {
    const states = {
      submitted: 'completed',
      under_review: 'upcoming',
      approved: 'upcoming',
      in_progress: 'upcoming',
      resolved: 'upcoming',
    };

    const isRejected = triage === 'rejected' || status === 'rejected';
    const isMerged = triage === 'merged';

    if (isRejected) {
      states.under_review = 'completed';
      states.approved = 'rejected';
      return { states, terminal: 'rejected' };
    }
    if (isMerged) {
      states.under_review = 'completed';
      states.approved = 'merged';
      return { states, terminal: 'merged' };
    }

    if (triage === 'pending_review') {
      states.under_review = 'active';
    } else {
      states.under_review = 'completed';
      if (status === 'pending' || !status || status === 'approved') {
        states.approved = 'active';
      } else if (status === 'in_progress' || status === 'resolved') {
        states.approved = 'completed';
        if (status === 'in_progress') {
          states.in_progress = 'active';
        } else if (status === 'resolved') {
          states.in_progress = 'completed';
          states.resolved = 'active';
        }
      }
    }
    return { states, terminal: null };
  };

  const getTimelineStages = (status, triage, response) => {
    const isRejected = triage === 'rejected' || status === 'rejected';
    const isMerged = triage === 'merged';

    let stages = [
      {
        key: 'submitted',
        title: 'Grievance Submitted',
        description: 'Your report has been successfully registered in the system.',
        icon: 'file-text',
      },
      {
        key: 'under_review',
        title: 'Under Review',
        description: 'Institutional administration is validating your report details.',
        icon: 'eye',
      },
      {
        key: 'approved',
        title: 'Approved & Planned',
        description: 'The grievance is approved and queued for action.',
        icon: 'check-circle',
      },
      {
        key: 'in_progress',
        title: 'In Progress',
        description: 'Resolution works are actively underway.',
        icon: 'tool',
      },
      {
        key: 'resolved',
        title: 'Resolved',
        description: 'The issue has been successfully resolved.',
        icon: 'award',
      },
    ];

    if (isRejected) {
      stages[2] = {
        key: 'rejected',
        title: 'Grievance Closed',
        description: response || 'The grievance has been reviewed and closed by admin.',
        icon: 'x-circle',
        color: '#EF4444',
      };
      stages = stages.slice(0, 3);
    } else if (isMerged) {
      stages[2] = {
        key: 'merged',
        title: 'Duplicate Merged',
        description: response || 'Merged into an existing parent ticket.',
        icon: 'git-merge',
        color: '#8B5CF6',
      };
      stages = stages.slice(0, 3);
    }

    const { states } = getStageStates(status, triage);

    return stages.map(stage => ({
      ...stage,
      state: states[stage.key] || 'upcoming',
    }));
  };

  const getStageForLog = (entry) => {
    const note = (entry.note || '').toLowerCase();
    const status = (entry.status || '').toLowerCase();

    if (note.startsWith('user:') || note.startsWith('admin:')) {
      return null;
    }

    if (status === 'pending' || note.includes('submitted') || note.includes('registered')) {
      return 'submitted';
    }
    if (status === 'pending_review' || note.includes('review') || note.includes('triage') || status.includes('rejected by super admin') || status.includes('approved by super admin')) {
      if (status.includes('approved by super admin')) {
        return 'approved';
      }
      if (status.includes('rejected by super admin')) {
        return 'rejected';
      }
      return 'under_review';
    }
    if (status === 'approved' || note.includes('approved')) {
      return 'approved';
    }
    if (status === 'rejected' || note.includes('rejected')) {
      return 'rejected';
    }
    if (status === 'merged' || status.includes('merged') || note.includes('merged')) {
      return 'merged';
    }
    if (status === 'in_progress' || note.includes('progress') || note.includes('started')) {
      return 'in_progress';
    }
    if (status === 'resolved' || note.includes('resolved') || note.includes('fixed') || note.includes('completed')) {
      return 'resolved';
    }

    return 'under_review';
  };

  const getFilteredItems = () => {
    let baseList = [];
    if (myReportsTab === 'issues') baseList = issues;
    else if (myReportsTab === 'suggestions') baseList = suggestions;
    else baseList = feedbacks;

    return baseList.filter((item) => {
      const term = searchQuery.toLowerCase();
      const titleMatch = (item.title || item.feedback_text || item.description || '').toLowerCase().includes(term);
      const catMatch = (item.category || '').toLowerCase().includes(term);
      
      let statusMatch = true;
      if (myReportsTab === 'issues') {
        const statusConfig = getStatusConfig(item.status, item.triage_status);
        statusMatch = statusFilter === 'All' || statusConfig.label.toLowerCase() === statusFilter.toLowerCase();
      }
      return (titleMatch || catMatch) && statusMatch;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0B0F19', '#0F172A', '#131C31']} style={StyleSheet.absoluteFill} />}

      {/* Header bar */}
      <View style={[styles.topNav, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={handleBackNavigation} activeOpacity={0.7}>
          <Feather name={viewMode === 'home' ? 'arrow-left' : 'chevron-left'} size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontWeight: '900' }]}>
          {viewMode === 'suggestion' ? 'Submit Suggestion' :
           viewMode === 'feedback' ? 'Share Campus Feedback' :
           viewMode === 'report_category' || viewMode === 'report_details' || viewMode === 'report_review' ? 'Report Issue' :
           viewMode === 'my_reports' ? 'My Reports & Tickets' :
           viewMode === 'details' ? 'Ticket Details' :
           'Grievance & Support Desk'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* VIEW: HOME SCREEN */}
        {viewMode === 'home' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Serious Support Header Illustration area */}
            <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.heroSection}>
              <LinearGradient colors={isDark ? ['rgba(239, 68, 68, 0.2)', 'rgba(185, 28, 28, 0.08)'] : ['#FEE2E2', '#FEF2F2']} style={styles.heroGradient}>
                <View style={styles.heroText}>
                  <Text style={[styles.heroTitle, { color: isDark ? '#FFF' : '#7F1D1D' }]}>Campus Support Desk</Text>
                  <Text style={[styles.heroDesc, { color: isDark ? 'rgba(255,255,255,0.7)' : '#991B1B' }]}>
                    Strict safety grievance reporting, suggestions, and campus feedback.
                  </Text>
                </View>
                <MaterialCommunityIcons name="shield-alert-outline" size={76} color={isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)'} style={styles.heroIllustration} />
              </LinearGradient>
            </Animated.View>

            {/* Main Categories 3D Cards */}
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => setViewMode('report_category')}
                activeOpacity={0.85}
              >
                <View style={[styles.iconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
                  <Feather name="alert-triangle" size={24} color="#EF4444" />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Report an Issue (Strict Scope)</Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                  Priority focus: Ragging, harassment, girls-related safety, or critical campus concerns.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => setViewMode('feedback')}
                activeOpacity={0.85}
              >
                <View style={[styles.iconWrap, { backgroundColor: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                  <Feather name="message-square" size={24} color="#3B82F6" />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Submit Feedback</Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                  Share your general academic, facility, or campus experience with the administration.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => setViewMode('suggestion')}
                activeOpacity={0.85}
              >
                <View style={[styles.iconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#F59E0B" />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Submit a Suggestion</Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                  Propose constructive ideas to improve polytechnic academic or campus life.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => setViewMode('my_reports')}
                activeOpacity={0.85}
              >
                <View style={[styles.iconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                  <Feather name="list" size={24} color="#10B981" />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>My Reports & Tickets</Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                  Track the real-time resolution timeline and institutional updates for all your tickets.
                </Text>
              </TouchableOpacity>
            </View>

            {/* Warning Card */}
            <View style={[styles.warningCard, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.08)' : '#FFFBEB', borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : '#FDE68A' }]}>
              <View style={styles.warningHeader}>
                <Feather name="alert-circle" size={20} color="#F59E0B" />
                <Text style={styles.warningTitle}>Submission Guidelines & Confidentiality</Text>
              </View>
              <Text style={[styles.warningText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#92400E' }]}>
                All submissions are encrypted and handled with strict confidentiality. For serious issues, your anonymity is protected if selected.
              </Text>
            </View>

            {/* Accordion FAQ Section */}
            <View style={styles.faqSection}>
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Frequently Asked Questions</Text>
              {FAQS.map((faq, i) => {
                const isExpanded = expandedFaqIndex === i;
                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    onPress={() => setExpandedFaqIndex(isExpanded ? null : i)}
                  >
                    <GlassCard style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                      <View style={styles.faqHeaderRow}>
                        <Text style={[styles.faqQuestion, { color: colors.primary }]}>{faq.q}</Text>
                        <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
                      </View>
                      {isExpanded && (
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary, borderTopColor: colors.border }]}>{faq.a}</Text>
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* VIEW: REPORT ISSUE STEP 1 */}
        {viewMode === 'report_category' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Prominent Strict Scope Banner (Point 8 / 16) */}
            <View style={[styles.strictScopeNotice, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2', borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#F87171' }]}>
              <View style={styles.strictScopeHeader}>
                <MaterialCommunityIcons name="alert-decagram" size={22} color="#EF4444" />
                <Text style={[styles.strictScopeTitle, { color: isDark ? '#FCA5A5' : '#B91C1C' }]}>
                  Strict Safety Scope Notice
                </Text>
              </View>
              <Text style={[styles.strictScopeText, { color: isDark ? '#FECACA' : '#991B1B' }]}>
                Important: Currently, the Issue Submission system strictly focuses on serious concerns requiring immediate institutional action:
                {'\n'}• 1. Ragging & Bullying
                {'\n'}• 2. Harassment & Abuse
                {'\n'}• 3. Girls-Related Concerns & Safety
                {'\n'}• 4. Other Serious Campus Issues
                {'\n\n'}Apart from these critical categories, non-urgent matters should be submitted through the Feedback and Suggestion forms.
              </Text>
            </View>

            <View style={styles.formHero}>
              <Text style={[styles.formHeroTitle, { color: colors.textPrimary }]}>Step 1: Select Issue Domain</Text>
              <Text style={[styles.formHeroSub, { color: colors.textMuted }]}>Select the safety domain matching your concern:</Text>
            </View>

            <View style={styles.categoryGrid}>
              {REPORT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catSelectBtn,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                    issueCategory === cat && { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444', borderWidth: 1.5 },
                  ]}
                  onPress={() => {
                    setIssueCategory(cat);
                    setViewMode('report_details');
                  }}
                >
                  <Text style={[styles.catSelectText, { color: colors.textPrimary }, issueCategory === cat && { color: '#EF4444', fontWeight: '900' }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* VIEW: REPORT ISSUE STEP 2 (REGULAR DETAILS) */}
        {viewMode === 'report_details' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formHero}>
              <Text style={styles.formHeroTitle}>Step 2: Fill Details</Text>
              <Text style={styles.formHeroSub}>Category: {issueCategory}</Text>
            </View>

            <View style={[styles.inputCard, issueTitleError ? { borderColor: '#EF4444' } : {}]}>
              <Text style={styles.inputLabel}>ISSUE TITLE *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Briefly state the issue..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={issueTitle}
                onChangeText={(t) => {
                  setIssueTitle(t);
                  if (issueTitleError) setIssueTitleError('');
                }}
              />
              {issueTitleError ? (
                <Text style={styles.inlineErrorText}>{issueTitleError}</Text>
              ) : null}
            </View>

            <View style={[styles.inputCard, { minHeight: 120 }, issueDescError ? { borderColor: '#EF4444' } : {}]}>
              <Text style={styles.inputLabel}>DESCRIPTION *</Text>
              <TextInput
                style={[styles.textInput, { flex: 1, textAlignVertical: 'top', paddingVertical: 10 }]}
                placeholder="Describe the issue clearly, including what happened, where it occurred, and how it has affected you or other students."
                placeholderTextColor="rgba(255,255,255,0.2)"
                multiline
                value={issueDesc}
                onChangeText={(t) => {
                  setIssueDesc(t);
                  if (issueDescError) setIssueDescError('');
                }}
              />
              {issueDescError ? (
                <Text style={styles.inlineErrorText}>{issueDescError}</Text>
              ) : null}
            </View>

            <View style={[styles.inputCard, issueLocError ? { borderColor: '#EF4444' } : {}]}>
              <Text style={styles.inputLabel}>LOCATION / CAMPUS AREA *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Specify building, floor, room number, or campus area..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={issueLoc}
                onChangeText={(t) => {
                  setIssueLoc(t);
                  if (issueLocError) setIssueLocError('');
                }}
              />
              {issueLocError ? (
                <Text style={styles.inlineErrorText}>{issueLocError}</Text>
              ) : null}
            </View>

            {/* Toggle Anonymous */}
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>{issueAnonymous ? 'Anonymous ON' : 'Anonymous OFF'}</Text>
                <Text style={styles.toggleSub}>
                  {issueAnonymous
                    ? 'Your identity is hidden. Only your report will be shared with authorized administrators.'
                    : 'Your identity will be visible to authorized administrators for follow-up.'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIssueAnonymous(!issueAnonymous)}
                style={[styles.toggleBtn, issueAnonymous ? styles.toggleBtnOn : styles.toggleBtnOff]}
              >
                <Feather name={issueAnonymous ? 'eye-off' : 'eye'} size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Attach photos */}
            <View style={styles.formAttachmentSection}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={styles.inputLabel}>ATTACH EVIDENCE PHOTOS (MAX 3)</Text>
                <Text style={{ fontSize: 11, fontWeight: '800', color: attachments.length >= 3 ? '#EF4444' : '#10B981' }}>
                  {attachments.length}/3 selected
                </Text>
              </View>

              {attachments.length < 3 && (
                <TouchableOpacity style={styles.attachBtn} onPress={pickAttachment}>
                  <Feather name="camera" size={18} color="#FFF" />
                  <Text style={styles.attachBtnText}>
                    {attachments.length === 0 ? 'Attach Photos (Max 3)' : `Add Another Photo (${attachments.length}/3)`}
                  </Text>
                </TouchableOpacity>
              )}

              {attachments.length > 0 && (
                <View style={styles.photoThumbGrid}>
                  {attachments.map((file, idx) => (
                    <View key={idx} style={styles.photoThumbBox}>
                      <Image source={{ uri: file.uri }} style={styles.photoThumbImg} />
                      <TouchableOpacity style={styles.photoRemoveBadge} onPress={() => removeAttachment(idx)}>
                        <Feather name="x" size={12} color="#FFF" />
                      </TouchableOpacity>
                      <View style={styles.photoIndexBadge}>
                        <Text style={styles.photoIndexText}>{idx + 1}/3</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleReviewTicket} activeOpacity={0.8}>
              <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.submitGradient}>
                <Text style={styles.submitBtnText}>Next: Review Ticket →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* VIEW: REPORT ISSUE STEP 3 (REVIEW) */}
        {viewMode === 'report_review' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formHero}>
              <Text style={styles.formHeroTitle}>Step 3: Review Ticket</Text>
              <Text style={styles.formHeroSub}>Please confirm the details before submission:</Text>
            </View>

            <GlassCard style={styles.reviewCard}>
              <Text style={styles.reviewHeading}>Category</Text>
              <Text style={styles.reviewVal}>{issueCategory}</Text>

              <Text style={styles.reviewHeading}>Title</Text>
              <Text style={styles.reviewVal}>{issueTitle}</Text>

              <Text style={styles.reviewHeading}>Description</Text>
              <Text style={styles.reviewVal}>{issueDesc}</Text>

              {issueLoc ? (
                <>
                  <Text style={styles.reviewHeading}>Location</Text>
                  <Text style={styles.reviewVal}>{issueLoc}</Text>
                </>
              ) : null}

              {attachments.length > 0 && (
                <>
                  <Text style={styles.reviewHeading}>Attached Photos ({attachments.length}/3)</Text>
                  <View style={styles.photoThumbGrid}>
                    {attachments.map((file, idx) => (
                      <View key={idx} style={styles.photoThumbBox}>
                        <Image source={{ uri: file.uri }} style={styles.photoThumbImg} />
                        <TouchableOpacity style={styles.photoRemoveBadge} onPress={() => removeAttachment(idx)}>
                          <Feather name="x" size={12} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.photoIndexBadge}>
                          <Text style={styles.photoIndexText}>{idx + 1}/3</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.reviewHeading}>Identity Privacy Notice</Text>
              <Text style={[styles.reviewConfidentialityText, { color: issueAnonymous ? '#F472B6' : '#60A5FA' }]}>
                {issueAnonymous
                  ? '🛡️ Anonymous Mode Active: Your identity, student profile, and contact details are completely hidden and stripped before storing in the database. Only your report description and evidence photos will be shared with authorized administrators.'
                  : '🔓 Public Mode Active: Your verified student profile (Name, Department, Academic Year, and Contact Details) will be visible to institutional coordinators to enable direct communication and swift on-campus resolution.'}
              </Text>

              <Text style={[styles.reviewVal, { color: issueAnonymous ? '#EC4899' : '#10B981', fontWeight: '800', marginTop: 8 }]}>
                {issueAnonymous ? '🛡️ Anonymous (Identity Hidden)' : '🔓 Public (Show Student Profile)'}
              </Text>
            </GlassCard>

            <TouchableOpacity style={styles.submitBtn} onPress={handleIssueSubmit} disabled={loading}>
              <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.submitGradient}>
                {loading ? <ButtonLoading color="#FFF" /> : <Text style={styles.submitBtnText}>Submit Grievance Report</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* VIEW: SUCCESS SCREEN - GRIEVANCE */}
        {viewMode === 'success' && (
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <Feather name="check-circle" size={54} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>✅ Grievance Submitted Successfully</Text>
            <Text style={styles.successSub}>Your report has been securely submitted.</Text>
            
            <View style={styles.ticketCard}>
              <Text style={styles.ticketCardLabel}>TICKET ID</Text>
              <Text style={styles.issueIdText}>{generatedId || 'FEEDX-GR-2026-00124'}</Text>
              <Text style={styles.ticketCardSub}>You can track its progress anytime from My Reports.</Text>
            </View>

            <TouchableOpacity style={styles.successDoneBtn} onPress={() => setViewMode('my_reports')}>
              <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.submitGradient}>
                <Text style={styles.submitBtnText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.bottomNoteText}>
              Your voice matters. Every genuine grievance helps us create a better learning environment for all Polytechnic students.
            </Text>
          </View>
        )}

        {/* VIEW: SUBMIT A SUGGESTION */}
        {viewMode === 'suggestion' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formHero}>
              <Text style={styles.formHeroTitle}>💡 Submit a Suggestion</Text>
              <Text style={styles.formHeroSub}>Share your creative proposals with collegiate admins.</Text>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>SUGGESTION TITLE *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter a short title for your suggestion."
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={suggTitle}
                onChangeText={setSuggTitle}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>CATEGORY</Text>
              <View style={styles.rowChips}>
                {SUGGESTION_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.suggChip, suggCategory === cat && styles.suggChipActive]}
                    onPress={() => setSuggCategory(cat)}
                  >
                    <Text style={[styles.suggChipText, suggCategory === cat && styles.suggChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.inputCard, { minHeight: 120 }]}>
              <Text style={styles.inputLabel}>DESCRIPTION *</Text>
              <TextInput
                style={[styles.textInput, { flex: 1, textAlignVertical: 'top', paddingVertical: 10 }]}
                placeholder="Clearly explain your idea, why it is needed, and how it can be implemented."
                placeholderTextColor="rgba(255,255,255,0.2)"
                multiline
                value={suggDesc}
                onChangeText={setSuggDesc}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>{suggAnonymous ? 'Anonymous ON' : 'Anonymous OFF'}</Text>
                <Text style={styles.toggleSub}>
                  {suggAnonymous
                    ? 'Your identity is hidden. Only your report will be shared with authorized administrators.'
                    : 'Your identity will be visible to authorized administrators for follow-up.'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSuggAnonymous(!suggAnonymous)}
                style={[styles.toggleBtn, suggAnonymous ? styles.toggleBtnOn : styles.toggleBtnOff]}
              >
                <Feather name={suggAnonymous ? 'eye-off' : 'eye'} size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSuggestionSubmit} disabled={loading}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.submitGradient}>
                {loading ? <ButtonLoading color="#FFF" /> : <Text style={styles.submitBtnText}>Submit Suggestion</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.cancelBtn, { borderColor: isDark ? colors.cardBorder : '#E2E8F0', marginTop: 10 }]} 
              onPress={handleBackNavigation}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={15} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel & Return to Support Desk</Text>
            </TouchableOpacity>

            <Text style={styles.bottomNoteText}>
              Every suggestion is reviewed and helps us build a better campus for everyone.
            </Text>
          </ScrollView>
        )}

        {/* VIEW: SUCCESS SCREEN - SUGGESTION */}
        {viewMode === 'suggestion_success' && (
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <Feather name="check-circle" size={54} color="#F59E0B" />
            </View>
            <Text style={styles.successTitle}>✅ Suggestion Submitted Successfully</Text>
            <Text style={styles.successSub}>
              Thank you for sharing your idea. Your suggestion has been forwarded to the appropriate authority for review.
            </Text>

            <TouchableOpacity style={styles.successDoneBtn} onPress={() => setViewMode('home')}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.submitGradient}>
                <Text style={styles.submitBtnText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* VIEW: SHARE YOUR FEEDBACK (REDESIGNED) */}
        {viewMode === 'feedback' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Form Hero */}
            <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.formHero}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.categoryHeaderBadge}>
                  <Feather name="message-square" size={14} color="#60A5FA" />
                  <Text style={styles.categoryHeaderBadgeText}>CAMPUS FEEDBACK HUB</Text>
                </View>
              </View>
              <Text style={styles.formHeroTitle}>Share Your Feedback</Text>
              <Text style={styles.formHeroSub}>Your feedback directly influences campus policies and improves academic governance.</Text>
            </Animated.View>

            {/* 1. Interactive Star Rating Card */}
            <Animated.View entering={FadeInDown.delay(100).duration(400).springify()}>
              <GlassCard style={styles.feedbackRatingCard}>
                <Text style={styles.inputLabel}>HOW WAS YOUR EXPERIENCE? *</Text>
                
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity 
                      key={star} 
                      activeOpacity={0.7} 
                      onPress={() => setFbRating(star)}
                      style={styles.starTouchArea}
                    >
                      <MaterialCommunityIcons
                        name={star <= fbRating ? 'star' : 'star-outline'}
                        size={40}
                        color={star <= fbRating ? '#F59E0B' : 'rgba(255,255,255,0.2)'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Rating Sentiment Badge */}
                <View style={styles.sentimentBadge}>
                  <Text style={styles.sentimentText}>
                    {fbRating === 1 && '😞 Needs Immediate Attention'}
                    {fbRating === 2 && '😕 Below Expectations'}
                    {fbRating === 3 && '🙂 Satisfactory'}
                    {fbRating === 4 && '😊 Great Experience'}
                    {fbRating === 5 && '🌟 Outstanding & Exceptional'}
                  </Text>
                </View>
              </GlassCard>
            </Animated.View>

            {/* 2. Choose Domain Category */}
            <Animated.View entering={FadeInDown.delay(150).duration(400).springify()}>
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>CHOOSE CATEGORY / DOMAIN *</Text>
                <View style={styles.rowChips}>
                  {FEEDBACK_CATEGORIES.map((cat) => {
                    const isActive = fbCategory === cat;
                    let iconName = 'grid';
                    if (cat === 'Academics') iconName = 'book-open';
                    else if (cat === 'Faculty') iconName = 'user-check';
                    else if (cat === 'Facilities') iconName = 'briefcase';
                    else if (cat === 'Campus Placements') iconName = 'award';
                    else if (cat === 'Library') iconName = 'book';
                    else if (cat === 'Events') iconName = 'calendar';
                    else if (cat === 'Hostel') iconName = 'home';

                    return (
                      <TouchableOpacity
                        key={cat}
                        activeOpacity={0.75}
                        style={[styles.suggChip, isActive && styles.suggChipActive]}
                        onPress={() => setFbCategory(cat)}
                      >
                        <Feather name={iconName} size={13} color={isActive ? '#60A5FA' : 'rgba(255,255,255,0.5)'} style={{ marginRight: 6 }} />
                        <Text style={[styles.suggChipText, isActive && styles.suggChipTextActive]}>{cat}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Animated.View>

            {/* 3. Detailed Feedback Input */}
            <Animated.View entering={FadeInDown.delay(200).duration(400).springify()}>
              <View style={[styles.inputCard, { minHeight: 140 }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>DETAILED FEEDBACK *</Text>
                  <Text style={styles.charCounter}>{fbText.length} / 1000</Text>
                </View>
                <TextInput
                  style={[styles.textInput, { flex: 1, textAlignVertical: 'top', paddingVertical: 12 }]}
                  placeholder="Describe your experience, highlight specifics, or offer suggestions for improvement..."
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  multiline
                  maxLength={1000}
                  value={fbText}
                  onChangeText={setFbText}
                />
              </View>
            </Animated.View>

            {/* Submit Action Button */}
            <Animated.View entering={FadeInDown.delay(250).duration(400).springify()}>
              <TouchableOpacity style={styles.submitBtn} onPress={handleFeedbackSubmit} disabled={loading} activeOpacity={0.85}>
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.submitGradient}>
                  {loading ? (
                    <ButtonLoading color="#FFF" />
                  ) : (
                    <View style={styles.btnContentRow}>
                      <Text style={styles.submitBtnText}>Submit Campus Feedback</Text>
                      <Feather name="send" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.cancelBtn, { borderColor: isDark ? colors.cardBorder : '#E2E8F0', marginTop: 10 }]} 
                onPress={handleBackNavigation}
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={15} color={colors.textSecondary} style={{ marginRight: 6 }} />
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel & Return to Support Desk</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        )}

        {/* VIEW: SUCCESS SCREEN - FEEDBACK */}
        {viewMode === 'feedback_success' && (
          <View style={styles.successContainer}>
            <Animated.View entering={FadeInUp.springify()} style={styles.successIconCircle}>
              <LinearGradient colors={['rgba(59, 130, 246, 0.2)', 'rgba(37, 99, 235, 0.1)']} style={StyleSheet.absoluteFill} />
              <Feather name="heart" size={54} color="#60A5FA" />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <Text style={styles.successTitle}>
                🎉 Feedback Submitted!
              </Text>
            </Animated.View>
            
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <Text style={styles.successSub}>
                Thank you for sharing your experience. Your feedback helps make campus life better for everyone.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).springify()} style={{ width: '100%' }}>
              <TouchableOpacity style={styles.successDoneBtn} onPress={() => setViewMode('home')}>
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.submitGradient}>
                  <Text style={styles.submitBtnText}>Back to Support Desk</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* VIEW: MY REPORTS */}
        {viewMode === 'my_reports' && (
          <View style={{ flex: 1 }}>
            {/* Search & Status Filters */}
            <View style={styles.filterSection}>
              <View style={styles.searchBar}>
                <Feather name="search" size={18} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search logs by category or keyword..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {myReportsTab === 'issues' && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabsRow}>
                  {['All', 'Under Review', 'In Progress', 'Resolved', 'Closed', 'Merged'].map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[styles.filterChip, statusFilter === st && styles.filterChipActive]}
                      onPress={() => setStatusFilter(st)}
                    >
                      <Text style={[styles.filterChipText, statusFilter === st && styles.filterChipTextActive]}>{st}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Single Issues Header in My Reports */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>My Logged Reports ({issues.length})</Text>
            </View>

            <View style={{ flex: 1 }}>
              {fetching ? (
                <View style={{ gap: 12, padding: 16 }}>
                  <SkeletonLoader height={100} borderRadius={16} />
                  <SkeletonLoader height={100} borderRadius={16} />
                  <SkeletonLoader height={100} borderRadius={16} />
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <FlashList
                    data={getFilteredItems()}
                    keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
                    estimatedItemSize={120}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                      const statusConf = getStatusConfig(item.status, item.triage_status);
                      return (
                        <TouchableOpacity
                          onPress={() => handleOpenReportDetails(item)}
                          activeOpacity={0.8}
                        >
                          <GlassCard style={[styles.reportCard, { elevation: 0, shadowOpacity: 0, shadowColor: 'transparent', shadowRadius: 0, shadowOffset: { width: 0, height: 0 } }]}>
                            <View style={styles.cardHeader}>
                              <Text style={styles.reportCategory}>{item.category?.toUpperCase() || 'GENERAL'}</Text>
                              <View style={[styles.statusTag, { backgroundColor: statusConf.bgColor }]}>
                                <Text style={[styles.statusTagText, { color: statusConf.color }]}>{statusConf.label}</Text>
                              </View>
                            </View>
                            <Text style={styles.reportTitle} numberOfLines={1}>{item.title || item.issue_title || 'Report'}</Text>
                            <View style={styles.cardFooter}>
                              <Text style={styles.reportId}>
                                {item.id ? `ID: #${String(item.id).slice(0, 8)}` : 'Issue Log'}
                              </Text>
                              <Text style={styles.reportDate}>
                                {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                              </Text>
                            </View>
                          </GlassCard>
                        </TouchableOpacity>
                      );
                    }}
                    ListEmptyComponent={
                      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                        <Feather name="info" size={32} color="rgba(255,255,255,0.3)" style={{ marginBottom: 8 }} />
                        <Text style={styles.emptyText}>Details not found</Text>
                      </View>
                    }
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {/* VIEW: DETAILS (TIMELINE & COMMENTS) */}
        {viewMode === 'details' && selectedItem && (() => {
          const statusConf = getStatusConfig(selectedItem.status, selectedItem.triage_status);
          const comments = timeline.filter(e => e.note && (e.note.startsWith('User:') || e.note.startsWith('Admin:') || e.actor_id));
          const officialLogs = timeline.filter(e => e.note && !(e.note.startsWith('User:') || e.note.startsWith('Admin:') || e.actor_id));
          const stages = getTimelineStages(selectedItem.status, selectedItem.triage_status, selectedItem.response);

          return (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {/* Status Banner Header */}
              <View style={[styles.statusBanner, { backgroundColor: statusConf.bgColor, borderColor: statusConf.color + '40' }]}>
                <Feather name="info" size={18} color={statusConf.color} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.statusBannerTitle, { color: statusConf.color }]}>
                    Status: {statusConf.label.toUpperCase()}
                  </Text>
                  <Text style={styles.statusBannerDesc}>
                    Updated {selectedItem.updated_at ? new Date(selectedItem.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : new Date(selectedItem.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
              </View>

              {/* Main Ticket Info Card */}
              <GlassCard style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailCategory}>{selectedItem.category?.toUpperCase() || 'GENERAL'}</Text>
                  <Text style={styles.detailId}>#{String(selectedItem.id).slice(0, 8)}</Text>
                </View>
                <Text style={styles.detailTitle}>{selectedItem.title}</Text>
                <Text style={styles.detailDesc}>{selectedItem.description}</Text>

                {selectedItem.location ? (
                  <Text style={styles.detailLoc}>📍 Location: {selectedItem.location}</Text>
                ) : null}

                {/* Attachments Section */}
                {selectedItem.attachment_urls && selectedItem.attachment_urls.length > 0 ? (
                  <View style={styles.attachmentSection}>
                    <Text style={styles.attachmentHeader}>Attachments ({selectedItem.attachment_urls.length})</Text>
                    <View style={styles.attachmentGrid}>
                      {selectedItem.attachment_urls.map((url, index) => {
                        const isImg = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(url) || url.includes('image') || url.includes('uploads') || url.includes('support-attachments');
                        const fileName = url.split('/').pop()?.split('?')[0] || `Attachment_${index + 1}`;
                        return (
                          <TouchableOpacity
                            key={index}
                            style={styles.attachmentCard}
                            activeOpacity={0.8}
                            onPress={() => {
                              if (isImg) {
                                setPreviewImage(url);
                              } else {
                                downloadOrOpenFile(url, fileName, 'Attachment');
                              }
                            }}
                          >
                            {isImg ? (
                              <Image source={{ uri: url }} style={styles.attachmentThumb} resizeMode="cover" />
                            ) : (
                              <View style={styles.attachmentFileIcon}>
                                <Feather name="file-text" size={22} color="#60A5FA" />
                              </View>
                            )}
                            <View style={styles.attachmentMeta}>
                              <Text style={styles.attachmentFileName} numberOfLines={1}>{fileName}</Text>
                              <Text style={styles.attachmentActionSub}>
                                {isImg ? '🔍 Tap to view photo' : '📥 Tap to open file'}
                              </Text>
                            </View>
                            <Feather name={isImg ? 'maximize-2' : 'download'} size={15} color="#94A3B8" />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : null}
              </GlassCard>

              {/* Vertical Stage Progress Timeline */}
              <View style={styles.timelineSection}>
                <Text style={styles.sectionHeading}>Vertical Resolution Timeline</Text>
                <GlassCard style={{ padding: 16, marginTop: 12 }}>
                  {stages.map((stage, idx, arr) => {
                    const isCompleted = stage.state === 'completed';
                    const isActive = stage.state === 'active';
                    const isUpcoming = stage.state === 'upcoming';
                    const isTerminal = stage.state === 'rejected' || stage.state === 'merged';

                    let dotBg = 'rgba(255,255,255,0.03)';
                    let dotBorder = 'rgba(255,255,255,0.15)';
                    let iconColor = 'rgba(255,255,255,0.3)';

                    if (isCompleted) {
                      dotBg = 'rgba(16, 185, 129, 0.15)';
                      dotBorder = '#10B981';
                      iconColor = '#10B981';
                    } else if (isActive) {
                      dotBg = 'rgba(59, 130, 246, 0.2)';
                      dotBorder = '#3B82F6';
                      iconColor = '#3B82F6';
                    } else if (isTerminal) {
                      dotBg = stage.key === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)';
                      dotBorder = stage.key === 'rejected' ? '#EF4444' : '#8B5CF6';
                      iconColor = stage.key === 'rejected' ? '#EF4444' : '#8B5CF6';
                    }

                    const stageLogs = officialLogs.filter(log => getStageForLog(log) === stage.key);

                    return (
                      <View key={stage.key} style={styles.timelineStageRow}>
                        {/* Track Column */}
                        <View style={styles.trackCol}>
                          {idx > 0 && (
                            <View style={[
                              styles.trackLine,
                              {
                                top: 0,
                                height: '50%',
                                backgroundColor: isCompleted || isActive || isTerminal ? '#10B981' : 'rgba(255,255,255,0.1)',
                              }
                            ]} />
                          )}
                          {idx < arr.length - 1 && (
                            <View style={[
                              styles.trackLine,
                              {
                                top: '50%',
                                bottom: 0,
                                backgroundColor: isCompleted ? '#10B981' : 'rgba(255,255,255,0.1)',
                              }
                            ]} />
                          )}
                          <View style={[styles.stageDot, { backgroundColor: dotBg, borderColor: dotBorder }]}>
                            <Feather name={stage.icon} size={14} color={iconColor} />
                          </View>
                        </View>

                        {/* Stage Details */}
                        <View style={styles.stageContent}>
                          <Text style={[
                            styles.stageTitle,
                            isActive && styles.stageTitleActive,
                            isTerminal && { color: dotBorder },
                            isUpcoming && styles.stageTitleUpcoming
                          ]}>
                            {stage.title}
                          </Text>
                          <Text style={styles.stageDesc}>{stage.description}</Text>

                          {/* Nested Official Administrative Logs */}
                          {stageLogs.length > 0 && (
                            <View style={styles.nestedLogsContainer}>
                              {stageLogs.map((log, lIdx) => (
                                <View key={lIdx} style={styles.nestedLogItem}>
                                  <View style={styles.nestedLogDot} />
                                  <View style={{ flex: 1 }}>
                                    <Text style={styles.nestedLogNote}>{log.note}</Text>
                                    <Text style={styles.nestedLogTime}>
                                      {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                  </View>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </GlassCard>
              </View>

              {/* Discussion Board / Two-Way Chat with College Admin */}
              <View style={styles.commentSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialCommunityIcons 
                      name={selectedItem.status === 'resolved' ? 'lock-outline' : 'chat-processing-outline'} 
                      size={18} 
                      color={selectedItem.status === 'resolved' ? '#10B981' : '#60A5FA'} 
                    />
                    <Text style={styles.sectionHeading}>
                      {selectedItem.status === 'resolved' ? 'Resolved Chat History' : 'Live Chat with College Admin'}
                    </Text>
                  </View>
                  <View style={[styles.statusTag, { backgroundColor: selectedItem.status === 'resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)' }]}>
                    <Text style={[styles.statusTagText, { color: selectedItem.status === 'resolved' ? '#10B981' : '#60A5FA' }]}>
                      {selectedItem.status === 'resolved' ? '🔒 Resolved' : '🟢 Active Session'}
                    </Text>
                  </View>
                </View>

                <View style={styles.commentThread}>
                  {comments.length === 0 ? (
                    <Text style={styles.noCommentsText}>
                      No messages exchanged yet. Send a follow-up message to your College Admin below.
                    </Text>
                  ) : (
                    comments.map((entry, idx) => {
                      const isUser = entry.note.startsWith('User:') || entry.actor_id === user.id;
                      const commentText = entry.note.replace(/^(User:|Admin:)\s*/i, '');
                      const senderName = isUser ? 'You' : 'College Admin';

                      return (
                        <View key={idx} style={[styles.commentBubbleContainer, isUser ? styles.commentUserAlign : styles.commentAdminAlign]}>
                          <View style={[styles.commentBubble, isUser ? styles.commentUserBubble : styles.commentAdminBubble]}>
                            <Text style={[styles.commentSender, isUser ? styles.commentSenderUser : styles.commentSenderAdmin]}>{senderName}</Text>
                            <Text style={styles.commentText}>{commentText}</Text>
                            <Text style={styles.commentTime}>
                              {new Date(entry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>

                {selectedItem.status !== 'resolved' ? (
                  <>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Type a follow-up message to College Admin..."
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={newComment}
                      onChangeText={setNewComment}
                    />
                    <TouchableOpacity style={styles.sendCommentBtn} onPress={handleAddComment}>
                      <Text style={styles.sendCommentBtnText}>Send Message</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 10, marginTop: 10 }}>
                    <Feather name="check-circle" size={14} color="#10B981" />
                    <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '700', flex: 1 }}>
                      This grievance has been resolved and closed by your College Admin. Chat session is archived.
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          );
        })()}

        {/* MODAL FOR SUGGESTIONS / FEEDBACK DETAILS */}
        <Modal
          visible={!!detailModalItem}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDetailModalItem(null)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.detailModalCard}>
              <View style={styles.detailModalHeader}>
                <Text style={styles.detailCategory}>{detailModalItem?.category?.toUpperCase() || 'GENERAL'}</Text>
                <TouchableOpacity onPress={() => setDetailModalItem(null)}>
                  <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              {detailModalItem && (detailModalItem.title || detailModalItem.description) ? (
                <>
                  <Text style={styles.detailTitle}>{detailModalItem?.title}</Text>
                  <Text style={styles.detailDescLabel}>Description:</Text>
                  <Text style={styles.detailDesc}>{detailModalItem?.description}</Text>
                  {detailModalItem?.expected_benefits ? (
                    <>
                      <Text style={styles.detailDescLabel}>Expected Benefits:</Text>
                      <Text style={styles.detailDesc}>{detailModalItem?.expected_benefits}</Text>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 4 }}>
                    <Text style={{ color: '#F59E0B', fontSize: 18, fontWeight: '700' }}>
                      {'★'.repeat(detailModalItem?.rating || 5)}{'☆'.repeat(Math.max(0, 5 - (detailModalItem?.rating || 5)))}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>({detailModalItem?.rating || 5}/5 Rating)</Text>
                  </View>
                  <Text style={styles.detailDescLabel}>Feedback:</Text>
                  <Text style={styles.detailDesc}>{detailModalItem?.feedback_text}</Text>
                </>
              )}

              <View style={{ marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.reportDate}>
                  Submitted: {detailModalItem?.created_at ? new Date(detailModalItem.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                </Text>
                <Text style={styles.reportDate}>
                  Anonymous: {detailModalItem?.is_anonymous ? 'Yes' : 'No'}
                </Text>
              </View>
            </GlassCard>
          </View>
        </Modal>

        {/* Full-Screen Image Preview Modal */}
        <Modal
          visible={Boolean(previewImage)}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewImage(null)}
        >
          <View style={styles.imageViewerOverlay}>
            <View style={styles.imageViewerHeader}>
              <TouchableOpacity onPress={() => setPreviewImage(null)} style={styles.imageViewerBtn}>
                <Ionicons name="close" size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.imageViewerTitle}>Attachment Preview</Text>
              <TouchableOpacity
                onPress={() => previewImage && downloadOrOpenFile(previewImage, 'attachment.png', 'Attachment')}
                style={styles.imageViewerBtn}
              >
                <Feather name="download" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.imageViewerContent}>
              {previewImage ? (
                <Image source={{ uri: previewImage }} style={styles.fullPreviewImg} resizeMode="contain" />
              ) : null}
            </View>
          </View>
        </Modal>

        {/* Global Feedback/Error Modal */}
        <FeedbackModal
          visible={errorModal.visible}
          type="error"
          title={errorModal.title}
          message={errorModal.message}
          onRetry={() => {
            setErrorModal({ ...errorModal, visible: false });
            fetchUserData();
          }}
          onRefresh={() => {
            setErrorModal({ ...errorModal, visible: false });
            fetchUserData();
          }}
          onCancel={() => setErrorModal({ ...errorModal, visible: false })}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },

  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', flex: 1, textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  heroSection: { marginTop: 24, marginBottom: 24 },
  heroGradient: { flexDirection: 'row', padding: 24, borderRadius: 24, position: 'relative', overflow: 'hidden' },
  heroText: { flex: 1, gap: 4, zIndex: 2 },
  heroTitle: { fontSize: 22, fontWeight: '950', color: '#FFF' },
  heroDesc: { fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 18 },
  heroIllustration: { position: 'absolute', bottom: -10, right: -10 },
  actionGrid: { gap: 14, marginBottom: 24 },
  actionCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: 18, gap: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  cardTitle: { fontSize: 15, fontWeight: '900', color: '#FFF' },
  cardDesc: { fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 17 },
  warningCard: { backgroundColor: 'rgba(245, 158, 11, 0.08)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.25)', borderRadius: 16, padding: 16, marginBottom: 24 },
  warningHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  warningTitle: { fontSize: 13, fontWeight: '850', color: '#F59E0B' },
  warningText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 17 },
  faqSection: { gap: 10 },
  sectionHeading: { fontSize: 14, fontWeight: '800', color: '#FFF', letterSpacing: 0.5, marginBottom: 8 },
  faqCard: { padding: 16, gap: 8, borderRadius: 16 },
  faqHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  strictScopeNotice: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  strictScopeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  strictScopeTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  strictScopeText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  formHero: { marginTop: 20, marginBottom: 20, gap: 4 },
  formHeroTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  formHeroSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catSelectBtn: { width: '47%', height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  catSelectBtnActive: { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)' },
  catSelectText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700' },
  catSelectTextActive: { color: '#3B82F6', fontWeight: '800' },
  inputCard: { backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 12, marginBottom: 12 },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#3B82F6', letterSpacing: 0.8, marginBottom: 6 },
  textInput: { height: 40, color: '#FFF', fontSize: 13, fontWeight: '600' },
  rowInputs: { flexDirection: 'row', gap: 10 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 16 },
  toggleTitle: { fontSize: 13, fontWeight: '850', color: '#FFF' },
  toggleSub: { fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  toggleBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  toggleBtnOn: { backgroundColor: '#EF4444' },
  toggleBtnOff: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  formAttachmentSection: { gap: 10, marginBottom: 20 },
  attachBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  attachBtnText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  attachmentPreviewRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  attachmentBubble: { backgroundColor: 'rgba(59,130,246,0.1)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)' },
  attachmentBubbleText: { fontSize: 10, color: '#3B82F6', maxWidth: 120 },
  submitBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 10 },
  submitGradient: { height: 50, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '850', color: '#FFF' },
  reviewCard: { padding: 18, gap: 8, marginBottom: 16 },
  reviewHeading: { fontSize: 9, fontWeight: '900', color: '#3B82F6', letterSpacing: 0.5 },
  reviewVal: { fontSize: 13, color: '#FFF', marginBottom: 10, lineHeight: 18 },
  reviewConfidentialityText: { fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 16, fontStyle: 'italic', marginBottom: 10 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: 40 },
  successIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: 20 },
  successTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  successSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  ticketCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 24 },
  ticketCardLabel: { fontSize: 10, fontWeight: '900', color: '#3B82F6', letterSpacing: 1, marginBottom: 4 },
  issueIdText: { fontSize: 22, fontWeight: '950', color: '#10B981', letterSpacing: 1, marginVertical: 6 },
  ticketCardSub: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  successDoneBtn: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  bottomNoteText: { fontSize: 11, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 17, paddingHorizontal: 16, marginTop: 12 },
  successActions: { flexDirection: 'row', gap: 14 },
  successHomeBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  successHomeText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  successTrackBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  successTrackText: { color: '#FFF', fontWeight: '850', fontSize: 14 },
  rowChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  suggChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  suggChipActive: { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)' },
  suggChipText: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '750' },
  suggChipTextActive: { color: '#F59E0B', fontWeight: '850' },
  feedbackRatingCard: { padding: 18, alignItems: 'center', marginBottom: 12 },
  starsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  filterSection: { paddingHorizontal: 20, marginTop: 10, gap: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 8 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 13, fontWeight: '600' },
  filterTabsRow: { gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  filterChipActive: { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)' },
  filterChipText: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  filterChipTextActive: { color: '#3B82F6', fontWeight: '850' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 14, gap: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#3B82F6' },
  tabText: { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: '#3B82F6', fontWeight: '900' },
  reportCard: { padding: 14, gap: 8, marginTop: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportCategory: { fontSize: 9, fontWeight: '900', color: '#3B82F6', letterSpacing: 0.5 },
  statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusTagText: { fontSize: 9, fontWeight: '800' },
  reportTitle: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportId: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  reportDate: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', marginTop: 40 },
  detailCard: { padding: 18, gap: 10, marginTop: 20 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailCategory: { fontSize: 10, fontWeight: '900', color: '#3B82F6', letterSpacing: 0.5 },
  detailId: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.4)' },
  detailTitle: { fontSize: 16, fontWeight: '950', color: '#FFF' },
  detailDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },
  detailLoc: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  timelineSection: { marginTop: 24, paddingHorizontal: 4 },
  timelineItem: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  timelinePoint: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6', marginTop: 4 },
  timelineInfo: { gap: 2, flex: 1 },
  timelineNote: { fontSize: 12, fontWeight: '850', color: '#FFF' },
  timelineTime: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
  },
  statusBannerTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusBannerDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    marginTop: 2,
  },
  timelineStageRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  trackCol: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  trackLine: {
    position: 'absolute',
    left: 13,
    width: 2,
    zIndex: 1,
  },
  stageDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stageContent: {
    flex: 1,
    gap: 4,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  stageTitleActive: {
    color: '#3B82F6',
    fontWeight: '900',
  },
  stageTitleUpcoming: {
    color: 'rgba(255,255,255,0.35)',
  },
  stageDesc: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 16,
  },
  nestedLogsContainer: {
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 1.5,
    borderLeftColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  nestedLogItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  nestedLogDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 5,
  },
  nestedLogNote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },
  nestedLogTime: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    marginTop: 2,
  },
  commentSection: { marginTop: 24, gap: 10 },
  commentThread: {
    gap: 10,
    marginBottom: 12,
    marginTop: 6,
  },
  noCommentsText: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 14,
  },
  commentBubbleContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  commentUserAlign: {
    justifyContent: 'flex-end',
  },
  commentAdminAlign: {
    justifyContent: 'flex-start',
  },
  commentBubble: {
    maxWidth: '85%',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 14,
    gap: 3,
  },
  commentUserBubble: {
    backgroundColor: '#2563EB',
    borderTopRightRadius: 2,
  },
  commentAdminBubble: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderTopLeftRadius: 2,
  },
  commentSender: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  commentSenderUser: {
    color: 'rgba(255,255,255,0.85)',
  },
  commentSenderAdmin: {
    color: '#60A5FA',
  },
  commentText: {
    fontSize: 12.5,
    color: '#FFF',
    lineHeight: 18,
  },
  commentTime: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  attachmentSection: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  attachmentHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#60A5FA',
    marginBottom: 8,
  },
  attachmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  attachmentText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    maxWidth: 140,
  },
  commentInput: { height: 44, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, paddingHorizontal: 12, color: '#FFF', fontSize: 13, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  sendCommentBtn: { backgroundColor: '#3B82F6', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sendCommentBtnText: { color: '#FFF', fontWeight: '850', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  detailModalCard: { width: '100%', padding: 20, gap: 10, borderRadius: 20, backgroundColor: '#0F172A', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  detailModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  detailDescLabel: { fontSize: 11, fontWeight: '800', color: '#3B82F6', marginTop: 10, letterSpacing: 0.5 },
  heroBadgeRow: { marginBottom: 8 },
  categoryHeaderBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.25)', alignSelf: 'flex-start' },
  categoryHeaderBadgeText: { fontSize: 9.5, fontWeight: '900', color: '#60A5FA', letterSpacing: 0.8, marginLeft: 5 },
  starTouchArea: { padding: 4 },
  sentimentBadge: { marginTop: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.25)' },
  sentimentText: { fontSize: 12, fontWeight: '800', color: '#F59E0B' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  charCounter: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },
  toggleIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  toggleIconWrapActive: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  toggleKnob: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFF' },
  toggleKnobOn: { alignSelf: 'flex-end' },
  toggleKnobOff: { alignSelf: 'flex-start' },
  btnContentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  photoThumbGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  photoThumbBox: { width: 76, height: 76, borderRadius: 12, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(0,0,0,0.3)' },
  photoThumbImg: { width: '100%', height: '100%', borderRadius: 12 },
  photoRemoveBadge: { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.9)', alignItems: 'center', justifyContent: 'center' },
  photoIndexBadge: { position: 'absolute', bottom: 4, left: 4, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.7)' },
  photoIndexText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  inlineErrorText: { color: '#EF4444', fontSize: 11, fontWeight: '700', marginTop: 4, marginLeft: 2 },
  attachmentGrid: {
    gap: 10,
    marginTop: 4,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  attachmentThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  attachmentFileIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentMeta: {
    flex: 1,
  },
  attachmentFileName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 2,
  },
  attachmentActionSub: {
    fontSize: 11,
    color: '#60A5FA',
    fontWeight: '600',
  },
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'space-between',
  },
  imageViewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageViewerBtn: {
    padding: 6,
  },
  imageViewerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  imageViewerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullPreviewImg: {
    width: '100%',
    height: '100%',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});