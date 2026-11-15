import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import {
    createInnovation,
    deleteInnovation,
    getInnovations,
    updateInnovation,
    updateInnovationStatus,
    upvoteInnovation,
    toggleInnovationUpvote
} from '@/services/supabaseService';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextArea } from '@/components/ui/FormTextArea';
import { FormSelect } from '@/components/ui/FormSelect';
import { INNOVATION_VALIDATION, validateSelect, validateGoogleDriveOrImageUrl, validatePrototypeUrl } from '@/utils/validation';
import FeedbackModal from '@/components/ui/FeedbackModal';
import { useRouter } from 'expo-router';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import React, { useEffect, useMemo, useState } from 'react';
import InnovationCategories from '@/components/innovation/InnovationCategories';
import InnovationSubmissionWizard from '@/components/innovation/InnovationSubmissionWizard';
import CommunityProjectsView from '@/components/innovation/CommunityProjectsView';
import ProjectDetailModal from '@/components/innovation/ProjectDetailModal';

import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Dimensions,
    Linking,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface InnovationItem {
  id: string;
  college_id?: string;
  user_id?: string;
  title: string;
  category: string;
  problem_statement: string;
  proposed_solution: string;
  description: string;
  expected_impact: string;
  tech_stack?: string;
  team_members?: string;
  supporting_docs?: string;
  demo_link?: string;
  stage: string;
  patent_status?: string;
  status: string;
  college_feedback?: string;
  super_feedback?: string;
  upvotes: number;
  created_at: string;
  author_name?: string;
  college_name?: string;
  feedx_id?: string;
}

const CATEGORIES = [
  'AI', 'IoT', 'Robotics', 'Web Development', 'Healthcare', 'Agriculture', 'Cybersecurity', 'Others'
];

const DEVELOPMENT_STAGES = [
  'Idea', 'Prototype', 'MVP', 'Completed'
];

const NO_LIVE_RECORDS: never[] = [];

import { useGamification } from '@/context/GamificationContext';

export default function InnovationScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { listRef, handleScroll } = useScrollRestoration('innovation');
  const { user } = useUser();
  const { triggerActivity } = useGamification();

  // Role detection
  const role = String(user?.role || 'student').trim().toLowerCase();
  const isSuperAdmin = role === 'super_admin';
  const isCollegeAdmin = role === 'admin' || role === 'inst_admin';
  const isStudent = !isSuperAdmin && !isCollegeAdmin;

  const defaultTab = isSuperAdmin ? 'admin-dashboard' : isCollegeAdmin ? 'review-queue' : 'landing';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  useEffect(() => {
    const newDefault = isSuperAdmin ? 'admin-dashboard' : isCollegeAdmin ? 'review-queue' : 'landing';
    setActiveTab(newDefault);
  }, [isCollegeAdmin, isSuperAdmin]);

  const [ideas, setIdeas] = useState<InnovationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Modals & Forms
  const [ideaModalVisible, setIdeaModalVisible] = useState<boolean>(false);
  const [wizardModalVisible, setWizardModalVisible] = useState<boolean>(false);
  const [selectedIdea, setSelectedIdea] = useState<InnovationItem | null>(null);
  const [viewDetailsVisible, setViewDetailsVisible] = useState<boolean>(false);
  
  // Bookmarks
  const [bookmarkedIdeaIds, setBookmarkedIdeaIds] = useState<string[]>([]);
  
  // Feedback Action modal
  const [feedbackModalVisible, setFeedbackModalVisible] = useState<boolean>(false);
  const [feedbackActionType, setFeedbackActionType] = useState<string>('Approve');
  const [feedbackComment, setFeedbackComment] = useState<string>('');

  // Filtering / Search
  const [votedIdeaIds, setVotedIdeaIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCollege, setFilterCollege] = useState<string>('All');

  // Form Field States
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('AI');
  const [formProblem, setFormProblem] = useState('');
  const [formSolution, setFormSolution] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImpact, setFormImpact] = useState('');
  const [formTech, setFormTech] = useState('');
  const [formTeam, setFormTeam] = useState('');
  const [formDocs, setFormDocs] = useState('');
  const [formDemo, setFormDemo] = useState('');
  const [formStage, setFormStage] = useState('Idea');
  const [formPatent, setFormPatent] = useState('');
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  const [showInnovationSuccessModal, setShowInnovationSuccessModal] = useState<boolean>(false);

  const validateInnovationForm = () => {
    const errors: Record<string, string | null> = {};

    const titleCheck = INNOVATION_VALIDATION.title(formTitle);
    if (!titleCheck.isValid) errors.title = titleCheck.error;

    const catCheck = validateSelect(formCategory, 'Category', ['']);
    if (!catCheck.isValid) errors.category = catCheck.error;

    const probCheck = INNOVATION_VALIDATION.problemStatement(formProblem);
    if (!probCheck.isValid) errors.problem = probCheck.error;

    const solCheck = INNOVATION_VALIDATION.proposedSolution(formSolution);
    if (!solCheck.isValid) errors.solution = solCheck.error;

    const descCheck = INNOVATION_VALIDATION.description(formDesc);
    if (!descCheck.isValid) errors.description = descCheck.error;

    const impactCheck = INNOVATION_VALIDATION.expectedImpact(formImpact);
    if (!impactCheck.isValid) errors.impact = impactCheck.error;

    const teamCheck = INNOVATION_VALIDATION.teamMembers(formTeam);
    if (!teamCheck.isValid) errors.team = teamCheck.error;

    const techCheck = INNOVATION_VALIDATION.techStack(formTech);
    if (!techCheck.isValid) errors.tech = techCheck.error;

    if (formDocs && formDocs.trim()) {
      const docsCheck = validateGoogleDriveOrImageUrl(formDocs);
      if (!docsCheck.isValid) errors.docs = docsCheck.error;
    }

    if (formDemo && formDemo.trim()) {
      const demoCheck = validatePrototypeUrl(formDemo);
      if (!demoCheck.isValid) errors.demo = demoCheck.error;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = useMemo(() => {
    return (
      INNOVATION_VALIDATION.title(formTitle).isValid &&
      INNOVATION_VALIDATION.problemStatement(formProblem).isValid &&
      INNOVATION_VALIDATION.proposedSolution(formSolution).isValid &&
      INNOVATION_VALIDATION.description(formDesc).isValid &&
      INNOVATION_VALIDATION.expectedImpact(formImpact).isValid &&
      INNOVATION_VALIDATION.teamMembers(formTeam).isValid &&
      INNOVATION_VALIDATION.techStack(formTech).isValid &&
      (!formDocs || !formDocs.trim() || validateGoogleDriveOrImageUrl(formDocs).isValid) &&
      (!formDemo || !formDemo.trim() || validatePrototypeUrl(formDemo).isValid)
    );
  }, [formTitle, formProblem, formSolution, formDesc, formImpact, formTeam, formTech, formDocs, formDemo]);


  // Back button routing
  useEffect(() => {
    const onBackPress = () => {
      if (activeTab !== defaultTab) {
        setActiveTab(defaultTab);
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [activeTab, defaultTab]);

  useEffect(() => {
    loadIdeas();

    if (!user?.id) return;

    // Realtime channel for innovations list updates
    const channelId = `innovations-list-realtime-${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'innovations' },
        () => {
          loadIdeas();
        }
      );

    channel.subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {}
    };
  }, [user?.id]);

  const loadIdeas = async () => {
    try {
      const data = await getInnovations();
      setIdeas(data || []);
    } catch (err) {
      console.warn("Failed to load innovations:", err);
      setIdeas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadIdeas();
  };

  const openSubmitModal = (item?: InnovationItem) => {
    if (item) {
      setEditingIdeaId(item.id);
      setFormTitle(item.title);
      setFormCategory(item.category);
      setFormProblem(item.problem_statement);
      setFormSolution(item.proposed_solution);
      setFormDesc(item.description);
      setFormImpact(item.expected_impact);
      setFormTech(item.tech_stack || '');
      setFormTeam(item.team_members || '');
      setFormDocs(item.supporting_docs || '');
      setFormDemo(item.demo_link || '');
      setFormStage(item.stage);
      setFormPatent(item.patent_status || '');
    } else {
      setEditingIdeaId(null);
      setFormTitle('');
      setFormCategory('AI');
      setFormProblem('');
      setFormSolution('');
      setFormDesc('');
      setFormImpact('');
      setFormTech('');
      setFormTeam('');
      setFormDocs('');
      setFormDemo('');
      setFormStage('Idea');
      setFormPatent('');
    }
    setFormErrors({});
    setIdeaModalVisible(true);
  };

  const handleCreateOrUpdateIdea = async () => {
    const errors: Record<string, string | null> = {};

    const titleCheck = INNOVATION_VALIDATION.title(formTitle);
    if (!titleCheck.isValid) errors.title = titleCheck.error;

    const probCheck = INNOVATION_VALIDATION.problemStatement(formProblem);
    if (!probCheck.isValid) errors.problem = probCheck.error;

    const solCheck = INNOVATION_VALIDATION.proposedSolution(formSolution);
    if (!solCheck.isValid) errors.solution = solCheck.error;

    const descCheck = INNOVATION_VALIDATION.description(formDesc);
    if (!descCheck.isValid) errors.description = descCheck.error;

    const impactCheck = INNOVATION_VALIDATION.expectedImpact(formImpact);
    if (!impactCheck.isValid) errors.impact = impactCheck.error;

    const teamCheck = INNOVATION_VALIDATION.teamMembers(formTeam);
    if (!teamCheck.isValid) errors.team = teamCheck.error;

    const techCheck = INNOVATION_VALIDATION.techStack(formTech);
    if (!techCheck.isValid) errors.tech = techCheck.error;

    if (formDocs && formDocs.trim()) {
      const docsCheck = validateGoogleDriveOrImageUrl(formDocs);
      if (!docsCheck.isValid) errors.docs = docsCheck.error;
    }

    if (formDemo && formDemo.trim()) {
      const demoCheck = validatePrototypeUrl(formDemo);
      if (!demoCheck.isValid) errors.demo = demoCheck.error;
    }

    setFormErrors(errors);

    const firstError = Object.values(errors).find(Boolean);
    if (firstError) {
      Alert.alert('Validation Error', firstError);
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        title: formTitle.trim(),
        category: formCategory,
        problem_statement: formProblem.trim(),
        proposed_solution: formSolution.trim(),
        description: formDesc.trim(),
        expected_impact: formImpact.trim(),
        tech_stack: formTech.trim() || null,
        team_members: formTeam.trim() || null,
        supporting_docs: formDocs.trim() || null,
        demo_link: formDemo.trim() || null,
        stage: formStage,
        patent_status: formPatent.trim() || null,
        user_id: user?.id || null,
        college_id: user?.college_id || null,
        author_name: user?.full_name || 'Student Innovator',
        college_name: user?.college_name || 'FEEDX Polytechnic',
        status: 'Pending Review'
      };

      if (editingIdeaId) {
        const currentIdea = ideas.find(i => i.id === editingIdeaId);
        const updatePayload = {
          ...payload,
          status: currentIdea ? currentIdea.status : 'Pending Review',
        };
        await updateInnovation(editingIdeaId, updatePayload);
        setIdeas(prev => prev.map(i => i.id === editingIdeaId ? { ...i, ...updatePayload } : i));
      } else {
        const newIdea = await createInnovation(payload);
        if (newIdea) {
          setIdeas(prev => [newIdea, ...prev]);
          // Award +5 Gold Coins on Innovation Submission
          try {
            await triggerActivity('innovation_submitted', 5, 50, undefined, true);
          } catch (e) {}
        }
      }
      setIdeaModalVisible(false);
      setShowInnovationSuccessModal(true);
    } catch (err: any) {
      Alert.alert('Save failed', err?.message || 'Unable to save the innovation proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWizardSubmit = async (proposalData: any) => {
    try {
      const fullPayload = {
        ...proposalData,
        user_id: user?.id || proposalData?.user_id,
        feedx_id: user?.feedx_id || proposalData?.feedx_id,
        college_id: user?.college_id || proposalData?.college_id,
        author_name: user?.full_name || proposalData?.author_name || 'Student Innovator',
        author_email: user?.email || proposalData?.author_email || '',
        college_name: user?.college_name || proposalData?.college_name || 'FEEDX Polytechnic',
        branch: user?.branch || proposalData?.branch || '',
        year: user?.year || proposalData?.year || '',
      };
      const newIdea = await createInnovation(fullPayload);
      if (newIdea) {
        setIdeas(prev => [newIdea, ...prev.filter(i => i.id !== newIdea.id)]);
      }
      await loadIdeas();
    } catch (err: any) {
      console.error('Wizard submit failed:', err);
      Alert.alert('Submission Error', err?.message || 'Failed to submit proposal.');
    }
  };

  const handleBookmarkToggle = async (id: string) => {
    const isBookmarked = bookmarkedIdeaIds.includes(id);
    if (isBookmarked) {
      setBookmarkedIdeaIds(prev => prev.filter(bId => bId !== id));
    } else {
      setBookmarkedIdeaIds(prev => [...prev, id]);
    }
  };


  const handleWithdrawIdea = async (id: string) => {
    Alert.alert('Withdraw Proposal', 'Are you sure you want to withdraw this innovation proposal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Withdraw', style: 'destructive', onPress: async () => {
          try {
            await deleteInnovation(id);
            Alert.alert('Withdrawn', 'Proposal has been deleted.');
            loadIdeas();
          } catch {
            setIdeas(ideas.filter(i => i.id !== id));
            Alert.alert('Withdrawn locally', 'Removed proposal draft.');
          }
      }}
    ]);
  };

  const handleAdminFeedbackAction = async () => {
    if (!selectedIdea) return;
    try {
      let nextStatus = 'Pending Review';
      let feedbackField: any = isCollegeAdmin ? 'college_feedback' : 'super_feedback';
      
      if (feedbackActionType === 'Approve') nextStatus = 'Approved';
      else if (feedbackActionType === 'Reject') nextStatus = 'Rejected';
      else if (feedbackActionType === 'Recommend') nextStatus = 'Recommended';
      else if (feedbackActionType === 'Feature') nextStatus = 'Featured';
      else if (feedbackActionType === 'Review') nextStatus = 'Under Review';

      await updateInnovationStatus(selectedIdea.id, nextStatus, feedbackField, feedbackComment);
      Alert.alert('Success', `Proposal marked as ${nextStatus}.`);
      setFeedbackModalVisible(false);
      setViewDetailsVisible(false);
      loadIdeas();
    } catch (err: any) {
      Alert.alert('Review failed', err?.message || 'Unable to submit the review decision.');
    }
  };

  const handleUpvote = async (item: InnovationItem) => {
    const isLiked = votedIdeaIds.includes(item.id);
    try {
      const nextCount = await toggleInnovationUpvote(item.id, item.upvotes || 0, isLiked);
      if (isLiked) {
        setVotedIdeaIds(prev => prev.filter(id => id !== item.id));
      } else {
        setVotedIdeaIds(prev => [...prev, item.id]);
      }
      setIdeas((current) => current.map((entry) => (entry.id === item.id ? { ...entry, upvotes: nextCount } : entry)));
    } catch (err: any) {
      Alert.alert('Upvote failed', err?.message || 'Unable to record your vote right now.');
    }
  };

  const studentIdeas = useMemo(() => {
    if (!user) return [];
    return ideas.filter(i => {
      const matchUserId = i.user_id && user.id && String(i.user_id).toLowerCase() === String(user.id).toLowerCase();
      const matchAuthor = i.author_name && user.full_name && String(i.author_name).toLowerCase().trim() === String(user.full_name).toLowerCase().trim();
      const matchFeedxId = i.feedx_id && user.feedx_id && String(i.feedx_id).toLowerCase().trim() === String(user.feedx_id).toLowerCase().trim();
      return matchUserId || matchAuthor || matchFeedxId;
    });
  }, [ideas, user]);

  const collegeAdminIdeas = useMemo(() => {
    if (!user) return [];
    return ideas.filter(i => {
      const matchCollegeId = i.college_id && user.college_id && String(i.college_id).toLowerCase() === String(user.college_id).toLowerCase();
      const matchCollegeName = i.college_name && user.college_name && String(i.college_name).toLowerCase().trim() === String(user.college_name).toLowerCase().trim();
      return matchCollegeId || matchCollegeName;
    });
  }, [ideas, user]);

  const allFilteredIdeas = useMemo(() => {
    return ideas.filter(i => {
      const matchesSearch = searchQuery.trim() === '' || 
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.tech_stack || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || i.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || i.status === filterStatus;
      const matchesCollege = filterCollege === 'All' || i.college_name === filterCollege;
      return matchesSearch && matchesCategory && matchesStatus && matchesCollege;
    });
  }, [ideas, searchQuery, filterCategory, filterStatus, filterCollege]);

  const stageAnalytics = useMemo(() => {
    const counts: Record<string, number> = { Idea: 0, Prototype: 0, MVP: 0, Completed: 0 };
    ideas.forEach(i => {
      if (counts[i.stage] !== undefined) counts[i.stage]++;
    });
    return counts;
  }, [ideas]);

  const uniqueColleges = useMemo(() => {
    const list = new Set<string>();
    ideas.forEach(i => { if (i.college_name) list.add(i.college_name); });
    return Array.from(list);
  }, [ideas]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Review': return '#F59E0B';
      case 'Under Review': return '#3B82F6';
      case 'Recommended': return '#8B5CF6';
      case 'Approved': return '#10B981';
      case 'Rejected': return '#EF4444';
      case 'Featured': return '#EC4899';
      default: return '#64748B';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { padding: 20 }]}>
        <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />
        
        {/* Header Skeleton */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 40 }}>
          <SkeletonLoader width={40} height={40} borderRadius={20} />
          <SkeletonLoader width={150} height={30} borderRadius={8} />
          <SkeletonLoader width={40} height={40} borderRadius={20} />
        </View>

        {/* Search Bar Skeleton */}
        <SkeletonLoader width="100%" height={50} borderRadius={25} style={{ marginBottom: 25 }} />
        
        {/* Tabs Skeleton */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <SkeletonLoader width={100} height={35} borderRadius={20} />
          <SkeletonLoader width={100} height={35} borderRadius={20} />
          <SkeletonLoader width={100} height={35} borderRadius={20} />
        </View>

        {/* Banner Skeleton */}
        <SkeletonLoader width="100%" height={160} borderRadius={20} style={{ marginBottom: 25 }} />

        {/* Cards Skeleton */}
        <SkeletonLoader width="100%" height={140} borderRadius={16} style={{ marginBottom: 15 }} />
        <SkeletonLoader width="100%" height={140} borderRadius={16} style={{ marginBottom: 15 }} />
      </View>
    );
  }

  const getTabStyle = (tabKey: string) => {
    const isActive = activeTab === tabKey;
    return [
      styles.tabBtn,
      { backgroundColor: colors.card, borderColor: colors.border },
      isActive && styles.activeTab
    ];
  };

  const getTabTextStyle = (tabKey: string) => {
    const isActive = activeTab === tabKey;
    return [
      styles.tabText,
      { color: colors.textSecondary },
      isActive && styles.activeTabText
    ];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}
      {isDark && <View style={[styles.glowBlob, { top: -100, left: -50, backgroundColor: 'rgba(59, 130, 246, 0.15)' }]} />}
      {isDark && <View style={[styles.glowBlob, { bottom: 100, right: -100, backgroundColor: 'rgba(139, 92, 246, 0.12)' }]} />}

      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>🚀 Innovation Hub</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>Incubator & Start-up Workspace</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {isStudent && (
          <>
            <TouchableOpacity style={getTabStyle('landing')} onPress={() => setActiveTab('landing')}>
              <Text style={getTabTextStyle('landing')}>Explore</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('community-projects')} onPress={() => setActiveTab('community-projects')}>
              <Text style={getTabTextStyle('community-projects')}>Community Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('my-ideas')} onPress={() => setActiveTab('my-ideas')}>
              <Text style={getTabTextStyle('my-ideas')}>My Proposals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('challenges')} onPress={() => setActiveTab('challenges')}>
              <Text style={getTabTextStyle('challenges')}>Grants</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('mentors')} onPress={() => setActiveTab('mentors')}>
              <Text style={getTabTextStyle('mentors')}>Mentors</Text>
            </TouchableOpacity>
          </>
        )}

        {isCollegeAdmin && (
          <>
            <TouchableOpacity style={getTabStyle('review-queue')} onPress={() => setActiveTab('review-queue')}>
              <Text style={getTabTextStyle('review-queue')}>Review Queue ({collegeAdminIdeas.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('trends')} onPress={() => setActiveTab('trends')}>
              <Text style={getTabTextStyle('trends')}>Trends</Text>
            </TouchableOpacity>
          </>
        )}

        {isSuperAdmin && (
          <>
            <TouchableOpacity style={getTabStyle('admin-dashboard')} onPress={() => setActiveTab('admin-dashboard')}>
              <Text style={getTabTextStyle('admin-dashboard')}>Evaluation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('trends')} onPress={() => setActiveTab('trends')}>
              <Text style={getTabTextStyle('trends')}>Analytics</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView 
        ref={listRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFF" />}
      >
        {activeTab === 'landing' && (
          <View>
            <View style={styles.banner}>
              <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={StyleSheet.absoluteFill} start={{ x:0, y:0 }} end={{ x:1, y:1 }} />
              <Text style={styles.bannerTitle}>Turn Ideas into Reality 🚀</Text>
              <Text style={styles.bannerDesc}>Submit start-up pitches, project definitions, and research proposals to institutional reviewers.</Text>
              <TouchableOpacity style={styles.bannerBtn} onPress={() => setWizardModalVisible(true)}>
                <Text style={styles.bannerBtnText}>Submit New Idea</Text>
                <Feather name="plus" size={16} color="#4F46E5" />
              </TouchableOpacity>
            </View>

            {/* Project Category Grid */}
            <InnovationCategories
              selectedCategory={filterCategory}
              onSelectCategory={(catName) => setFilterCategory(catName)}
            />

            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>💡 Trending Student Solutions</Text>
            {ideas.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.ideaCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => { setSelectedIdea(item); setViewDetailsVisible(true); }}>
                <View style={styles.ideaHeader}>
                  <View style={{ flex:1 }}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.stageBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.stageText}>{item.status.toUpperCase()}</Text>
                      </View>
                      <View style={[styles.categoryBadge, { backgroundColor: colors.inputBg }]}>
                        <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{item.category}</Text>
                      </View>
                    </View>
                    <Text style={[styles.ideaTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.ideaAuthor, { color: colors.textMuted }]}>By {item.author_name} • {item.college_name}</Text>
                  </View>
                </View>
                <Text style={[styles.ideaAbstract, { color: colors.textSecondary }]} numberOfLines={3}>{item.description}</Text>
                <View style={[styles.ideaFooter, { borderColor: colors.border }]}>
                  <Text style={[styles.stageTag, { color: colors.textMuted }]}>Stage: <Text style={{ color:'#8B5CF6', fontWeight:'800' }}>{item.stage}</Text></Text>
                  <TouchableOpacity 
                    style={[
                      styles.upvoteBtn,
                      { backgroundColor: colors.inputBg },
                      votedIdeaIds.includes(item.id) && { backgroundColor: 'rgba(236, 72, 153, 0.25)', borderColor: '#EC4899', borderWidth: 1 }
                    ]} 
                    onPress={() => handleUpvote(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={votedIdeaIds.includes(item.id) ? "heart" : "heart-outline"} 
                      size={14} 
                      color={votedIdeaIds.includes(item.id) ? "#EC4899" : colors.textPrimary} 
                      style={{ marginRight: 6 }} 
                    />
                    <Text style={[
                      styles.upvoteText,
                      { color: colors.textPrimary },
                      votedIdeaIds.includes(item.id) && { color: '#EC4899', fontWeight: 'bold' }
                    ]}>{item.upvotes}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'my-ideas' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.viewHeading, { color: colors.textPrimary }]}>My Submissions</Text>
              <TouchableOpacity style={styles.composerBtn} onPress={() => openSubmitModal()}>
                <Feather name="plus" size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.composerBtnText}>New Idea</Text>
              </TouchableOpacity>
            </View>

            {studentIdeas.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="file-text" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Details not found</Text>
              </View>
            ) : (
              studentIdeas.map(item => (
                <View key={item.id} style={[styles.ideaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.ideaHeader}>
                    <View style={{ flex:1 }}>
                      <View style={styles.badgeRow}>
                        <View style={[styles.stageBadge, { backgroundColor: getStatusColor(item.status) }]}>
                          <Text style={styles.stageText}>{item.status}</Text>
                        </View>
                        <View style={[styles.categoryBadge, { backgroundColor: colors.inputBg }]}>
                          <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{item.category}</Text>
                        </View>
                      </View>
                      <Text style={[styles.ideaTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                    </View>
                  </View>
                  <Text style={[styles.ideaAbstract, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>
                  
                  {(item.college_feedback || item.super_feedback) && (
                    <View style={styles.feedbackSection}>
                      <Text style={styles.feedbackTitle}>Feedback Received:</Text>
                      {item.college_feedback && <Text style={styles.feedbackComment}>• College Admin: {item.college_feedback}</Text>}
                      {item.super_feedback && <Text style={styles.feedbackComment}>• Super Admin: {item.super_feedback}</Text>}
                    </View>
                  )}

                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity style={[styles.actionBtnSecondary, { backgroundColor: colors.inputBg }]} onPress={() => { setSelectedIdea(item); setViewDetailsVisible(true); }}>
                      <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Details</Text>
                    </TouchableOpacity>
                    {item.status === 'Pending Review' && (
                      <TouchableOpacity style={[styles.actionBtnPrimary, { backgroundColor: '#EF4444' }]} onPress={() => handleWithdrawIdea(item.id)}>
                        <Feather name="trash-2" size={12} color="#FFF" style={{ marginRight: 4 }} />
                        <Text style={styles.actionBtnText}>Withdraw</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'challenges' && (
          <View>
            <Text style={styles.sectionHeading}>🏆 Open Innovation Challenges</Text>
            {NO_LIVE_RECORDS.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="calendar" size={44} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No live challenge records are available yet.</Text>
              </View>
            ) : null}

            <Text style={styles.sectionHeading}>💰 Startup Incubator Funding Schemes</Text>
            {NO_LIVE_RECORDS.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="dollar-sign" size={44} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No live funding records are available yet.</Text>
              </View>
            ) : null}
          </View>
        )}

        {activeTab === 'mentors' && (
          <View>
            <Text style={styles.sectionHeading}>🎓 Book Session with Incubator Mentors</Text>
            {NO_LIVE_RECORDS.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="users" size={44} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No mentor records are available yet.</Text>
              </View>
            ) : null}
          </View>
        )}

        {activeTab === 'review-queue' && (
          <View>
            <Text style={styles.sectionHeading}>📂 Submissions from My College students ({collegeAdminIdeas.length})</Text>
            
            <View style={styles.filterBar}>
              <View style={styles.pickerRow}>
                <Text style={styles.filterLabel}>Category:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['All', ...CATEGORIES].map(cat => (
                    <TouchableOpacity key={cat} style={[styles.filterChip, filterCategory === cat && styles.activeFilterChip]} onPress={() => setFilterCategory(cat)}>
                      <Text style={styles.filterChipText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.pickerRow}>
                <Text style={styles.filterLabel}>Status:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['All', 'Pending Review', 'Approved', 'Rejected', 'Recommended'].map(st => (
                    <TouchableOpacity key={st} style={[styles.filterChip, filterStatus === st && styles.activeFilterChip]} onPress={() => setFilterStatus(st)}>
                      <Text style={styles.filterChipText}>{st}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {collegeAdminIdeas.filter(i => {
              return (filterCategory === 'All' || i.category === filterCategory) &&
                     (filterStatus === 'All' || i.status === filterStatus);
            }).map(item => (
              <TouchableOpacity key={item.id} style={styles.ideaCard} onPress={() => { setSelectedIdea(item); setViewDetailsVisible(true); }}>
                <View style={styles.ideaHeader}>
                  <View style={{ flex:1 }}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.stageBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.stageText}>{item.status}</Text>
                      </View>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.ideaTitle}>{item.title}</Text>
                    <Text style={styles.ideaAuthor}>By {item.author_name} ({item.stage})</Text>
                  </View>
                </View>
                <Text style={styles.ideaAbstract} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardActionsRow}>
                  <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                  <Text style={{ color:'#8B5CF6', fontWeight:'700', fontSize:12 }}>Evaluate Proposal →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'admin-dashboard' && (
          <View>
            <Text style={styles.sectionHeading}>🌐 Platform-wide Submissions Evaluation ({allFilteredIdeas.length})</Text>

            <View style={styles.filterBlock}>
              <TextInput 
                placeholder="Search by Title or Tech Stack..." 
                placeholderTextColor="rgba(255,255,255,0.4)" 
                style={styles.searchBar} 
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginVertical: 8, gap: 8 }}>
                {['All', ...CATEGORIES].map(cat => (
                  <TouchableOpacity key={cat} style={[styles.filterChip, filterCategory === cat && styles.activeFilterChip]} onPress={() => setFilterCategory(cat)}>
                    <Text style={styles.filterChipText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.pickerRow}>
                <Text style={styles.filterLabel}>Colleges:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['All', ...uniqueColleges].map(col => (
                    <TouchableOpacity key={col} style={[styles.filterChip, filterCollege === col && styles.activeFilterChip]} onPress={() => setFilterCollege(col)}>
                      <Text style={styles.filterChipText}>{col}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {allFilteredIdeas.map(item => (
              <TouchableOpacity key={item.id} style={styles.ideaCard} onPress={() => { setSelectedIdea(item); setViewDetailsVisible(true); }}>
                <View style={styles.ideaHeader}>
                  <View style={{ flex:1 }}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.stageBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.stageText}>{item.status}</Text>
                      </View>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.ideaTitle}>{item.title}</Text>
                    <Text style={styles.ideaAuthor}>By {item.author_name} ({item.college_name})</Text>
                  </View>
                </View>
                <Text style={styles.ideaAbstract} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardActionsRow}>
                  <Text style={styles.dateText}>{item.stage.toUpperCase()}</Text>
                  <Text style={{ color:'#8B5CF6', fontWeight:'700', fontSize:12 }}>Super Admin Audit →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'trends' && (
          <View>
            <Text style={styles.sectionHeading}>📊 Development Stage Distribution</Text>
            <View style={styles.analyticsCard}>
              {DEVELOPMENT_STAGES.map(stage => {
                const count = stageAnalytics[stage] || 0;
                const total = ideas.length || 1;
                const pct = (count / total) * 100;
                return (
                  <View key={stage} style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>{stage} ({count})</Text>
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { width: `${pct}%`, backgroundColor:'#8B5CF6' }]} />
                    </View>
                  </View>
                );
              })}
            </View>

            <Text style={styles.sectionHeading}>🔥 Top Categories</Text>
            <View style={styles.analyticsCard}>
              {CATEGORIES.map(cat => {
                const count = ideas.filter(i => i.category === cat).length;
                return (
                  <View key={cat} style={{ flexDirection:'row', justifyContent:'space-between', paddingVertical: 8, borderBottomWidth:1, borderColor:'rgba(255,255,255,0.05)' }}>
                    <Text style={{ color:'#FFF' }}>{cat}</Text>
                    <Text style={{ color:'#8B5CF6', fontWeight:'bold' }}>{count} Submissions</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 'community-projects' && (
          <CommunityProjectsView
            projects={ideas}
            currentUser={user}
            onLike={(id) => {
              const item = ideas.find(i => i.id === id);
              if (item) handleUpvote(item);
            }}
            onBookmark={handleBookmarkToggle}
            likedProjectIds={votedIdeaIds}
            bookmarkedProjectIds={bookmarkedIdeaIds}
          />
        )}
      </ScrollView>

      {/* MODAL 1: Submission / Edit Form */}
      <Modal visible={ideaModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {isDark && ( <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} start={{ x:0, y:0 }} end={{ x:1, y:1 }} /> )}
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalHeaderTitle, { color: colors.textPrimary }]}>{editingIdeaId ? 'Edit Proposal' : 'New Innovation Proposal'}</Text>
              <TouchableOpacity onPress={() => setIdeaModalVisible(false)}>
                <Feather name="x" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
              <FormInput
                label="Idea Title (Min 10 characters)"
                required
                min={10}
                max={100}
                showCharCount
                placeholder="e.g. Smart Agri-Telemetry System"
                value={formTitle}
                onChangeText={(val) => {
                  setFormTitle(val);
                  setFormErrors(prev => ({ ...prev, title: INNOVATION_VALIDATION.title(val).error }));
                }}
                error={formErrors.title}
              />

              <FormSelect
                label="Innovation Category"
                required
                options={CATEGORIES}
                selectedValue={formCategory}
                onSelect={(cat) => {
                  setFormCategory(cat);
                  setFormErrors(prev => ({ ...prev, category: null }));
                }}
                error={formErrors.category}
              />

              <FormTextArea
                label="Problem Statement (Min 30 characters)"
                required
                min={30}
                max={500}
                height={80}
                placeholder="What is the problem faced by end users?"
                value={formProblem}
                onChangeText={(val) => {
                  setFormProblem(val);
                  setFormErrors(prev => ({ ...prev, problem: INNOVATION_VALIDATION.problemStatement(val).error }));
                }}
                error={formErrors.problem}
              />

              <FormTextArea
                label="Proposed Solution (Min 30 characters)"
                required
                min={30}
                max={500}
                height={80}
                placeholder="How does your idea solve the problem?"
                value={formSolution}
                onChangeText={(val) => {
                  setFormSolution(val);
                  setFormErrors(prev => ({ ...prev, solution: INNOVATION_VALIDATION.proposedSolution(val).error }));
                }}
                error={formErrors.solution}
              />

              <FormTextArea
                label="Detailed Description (Min 100 characters)"
                required
                min={100}
                max={1000}
                height={110}
                placeholder="Complete technical architecture of your project..."
                value={formDesc}
                onChangeText={(val) => {
                  setFormDesc(val);
                  setFormErrors(prev => ({ ...prev, description: INNOVATION_VALIDATION.description(val).error }));
                }}
                error={formErrors.description}
              />

              <FormTextArea
                label="Expected Impact (Min 20 characters)"
                required
                min={20}
                max={500}
                height={80}
                placeholder="Social, environmental or financial gains..."
                value={formImpact}
                onChangeText={(val) => {
                  setFormImpact(val);
                  setFormErrors(prev => ({ ...prev, impact: INNOVATION_VALIDATION.expectedImpact(val).error }));
                }}
                error={formErrors.impact}
              />

              <FormInput
                label="Technology Stack (Optional)"
                placeholder="e.g. React Native, Node.js, ESP32"
                value={formTech}
                onChangeText={setFormTech}
                max={200}
              />

              <FormInput
                label="Team Members (Optional)"
                placeholder="e.g. Rahul Sen (CSE-3), Amit K. (ECE-2)"
                value={formTeam}
                onChangeText={setFormTeam}
                max={200}
              />

              <FormInput
                label="Supporting Documents or Images Link (Optional)"
                placeholder="Drive/Image URL"
                value={formDocs}
                onChangeText={setFormDocs}
              />

              <FormInput
                label="Prototype or Demo Link (Optional)"
                placeholder="GitHub / YouTube Demo URL"
                value={formDemo}
                onChangeText={setFormDemo}
              />

              <FormSelect
                label="Current Development Stage"
                required
                options={DEVELOPMENT_STAGES}
                selectedValue={formStage}
                onSelect={setFormStage}
              />

              <FormInput
                label="Patent Status (Optional)"
                placeholder="e.g. Filed, Granted, None"
                value={formPatent}
                onChangeText={setFormPatent}
                max={100}
              />

              <TouchableOpacity 
                style={[styles.submitBtn, submitting && { opacity: 0.5 }]} 
                onPress={handleCreateOrUpdateIdea} 
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>{editingIdeaId ? 'Update Proposal' : 'Submit Proposal'}</Text>}
              </TouchableOpacity>
            </ScrollView>
        </View>
      </View>
</Modal>

      {/* Production Success Modal */}
      <FeedbackModal
        visible={showInnovationSuccessModal}
        type="success"
        title="🎉 Innovation Proposal Submitted Successfully!"
        message={"Thank you for sharing your idea with FEEDX.\n\nEvery great innovation starts with a single step. Our team will review your proposal and contact you if it is shortlisted.\n\nKeep building. Keep innovating."}
        confirmText="Done"
        onConfirm={() => setShowInnovationSuccessModal(false)}
      />


      {/* MODAL 2: View Detailed Proposal */}
      <Modal visible={viewDetailsVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {isDark && ( <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} start={{ x:0, y:0 }} end={{ x:1, y:1 }} /> )}
            {selectedIdea && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text style={[styles.modalHeaderTitle, { fontSize:18, flex: 1, color: colors.textPrimary }]} numberOfLines={1}>{selectedIdea.title}</Text>
                  <TouchableOpacity onPress={() => setViewDetailsVisible(false)}>
                    <Feather name="x" size={24} color={colors.textPrimary} style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                  <View style={{ flexDirection:'row', gap: 10, marginVertical: 10, flexWrap:'wrap' }}>
                    <View style={[styles.stageBadge, { backgroundColor: getStatusColor(selectedIdea.status) }]}>
                      <Text style={styles.stageText}>{selectedIdea.status.toUpperCase()}</Text>
                    </View>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.inputBg }]}>
                      <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{selectedIdea.category}</Text>
                    </View>
                    <View style={[styles.categoryBadge, { backgroundColor:'rgba(16, 185, 129, 0.15)' }]}>
                      <Text style={[styles.categoryText, { color:'#10B981' }]}>Stage: {selectedIdea.stage}</Text>
                    </View>
                  </View>

                  <Text style={styles.detailLabel}>Author & College</Text>
                  <Text style={[styles.detailText, { color: colors.textPrimary }]}>{selectedIdea.author_name} ({selectedIdea.college_name})</Text>

                  <Text style={styles.detailLabel}>Problem Statement</Text>
                  <Text style={[styles.detailText, { color: colors.textPrimary }]}>{selectedIdea.problem_statement}</Text>

                  <Text style={styles.detailLabel}>Proposed Solution</Text>
                  <Text style={[styles.detailText, { color: colors.textPrimary }]}>{selectedIdea.proposed_solution}</Text>

                  <Text style={styles.detailLabel}>Detailed Proposal Description</Text>
                  <Text style={[styles.detailText, { color: colors.textPrimary }]}>{selectedIdea.description}</Text>

                  <Text style={styles.detailLabel}>Expected Impact</Text>
                  <Text style={[styles.detailText, { color: colors.textPrimary }]}>{selectedIdea.expected_impact}</Text>

                  {selectedIdea.tech_stack && (
                    <>
                      <Text style={styles.detailLabel}>Technology Stack</Text>
                      <Text style={[styles.detailText, { color: colors.textPrimary }]}>{selectedIdea.tech_stack}</Text>
                    </>
                  )}

                  {selectedIdea.team_members && (
                    <>
                      <Text style={styles.detailLabel}>Team Members</Text>
                      <Text style={[styles.detailText, { color: colors.textPrimary }]}>{selectedIdea.team_members}</Text>
                    </>
                  )}

                  {selectedIdea.patent_status && (
                    <>
                      <Text style={styles.detailLabel}>Patent Status</Text>
                      <Text style={[styles.detailText, { color: colors.textPrimary }]}>{selectedIdea.patent_status}</Text>
                    </>
                  )}

                  {selectedIdea.supporting_docs && (
                    <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL(selectedIdea.supporting_docs!)}>
                      <Feather name="file-text" size={16} color="#3B82F6" style={{ marginRight: 6 }} />
                      <Text style={styles.linkText}>View Supporting Documents</Text>
                    </TouchableOpacity>
                  )}

                  {selectedIdea.demo_link && (
                    <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL(selectedIdea.demo_link!)}>
                      <Feather name="external-link" size={16} color="#10B981" style={{ marginRight: 6 }} />
                      <Text style={[styles.linkText, { color:'#10B981' }]}>Prototype Demo Link</Text>
                    </TouchableOpacity>
                  )}

                  {(selectedIdea.college_feedback || selectedIdea.super_feedback) && (
                    <View style={[styles.feedbackSection, { marginTop: 20 }]}>
                      <Text style={styles.feedbackTitle}>Feedback Remarks:</Text>
                      {selectedIdea.college_feedback && <Text style={styles.feedbackComment}>• College Admin: {selectedIdea.college_feedback}</Text>}
                      {selectedIdea.super_feedback && <Text style={styles.feedbackComment}>• Super Admin: {selectedIdea.super_feedback}</Text>}
                    </View>
                  )}

                  {isCollegeAdmin && (
                    <View style={styles.adminActionContainer}>
                      <Text style={styles.adminHeading}>Evaluate Submission (College level)</Text>
                      <View style={{ flexDirection:'row', gap:10, flexWrap:'wrap', marginVertical:10 }}>
                        <TouchableOpacity style={[styles.adminBtn, { backgroundColor:'#10B981' }]} onPress={() => { setFeedbackActionType('Approve'); setFeedbackModalVisible(true); }}>
                          <Text style={styles.adminBtnText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.adminBtn, { backgroundColor:'#8B5CF6' }]} onPress={() => { setFeedbackActionType('Recommend'); setFeedbackModalVisible(true); }}>
                          <Text style={styles.adminBtnText}>Recommend</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.adminBtn, { backgroundColor:'#EF4444' }]} onPress={() => { setFeedbackActionType('Reject'); setFeedbackModalVisible(true); }}>
                          <Text style={styles.adminBtnText}>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {isSuperAdmin && (
                    <View style={styles.adminActionContainer}>
                      <Text style={styles.adminHeading}>Evaluate Submission (Super Admin level)</Text>
                      <View style={{ flexDirection:'row', gap:10, flexWrap:'wrap', marginVertical:10 }}>
                        <TouchableOpacity style={[styles.adminBtn, { backgroundColor:'#EC4899' }]} onPress={() => { setFeedbackActionType('Feature'); setFeedbackModalVisible(true); }}>
                          <Text style={styles.adminBtnText}>Feature</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.adminBtn, { backgroundColor:'#10B981' }]} onPress={() => { setFeedbackActionType('Approve'); setFeedbackModalVisible(true); }}>
                          <Text style={styles.adminBtnText}>Platform Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.adminBtn, { backgroundColor:'#3B82F6' }]} onPress={() => { setFeedbackActionType('Review'); setFeedbackModalVisible(true); }}>
                          <Text style={styles.adminBtnText}>Under Review</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.adminBtn, { backgroundColor:'#EF4444' }]} onPress={() => { setFeedbackActionType('Reject'); setFeedbackModalVisible(true); }}>
                          <Text style={styles.adminBtnText}>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Admin Review Decision Comments */}
      <Modal visible={feedbackModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.commentModalContent}>
            <Text style={styles.commentModalTitle}>{feedbackActionType} Decision Comments</Text>
            <Text style={styles.commentModalDesc}>Please provide your reviews, remarks, or suggestions for the student project.</Text>
            
            <TextInput 
              multiline 
              numberOfLines={4} 
              style={styles.commentInput as any} 
              placeholder="Write feedback comments here..." 
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={feedbackComment}
              onChangeText={setFeedbackComment}
            />

            <View style={{ flexDirection:'row', gap: 12, marginTop: 16, alignSelf:'flex-end' }}>
              <TouchableOpacity style={styles.commentCancelBtn as any} onPress={() => setFeedbackModalVisible(false)}>
                <Text style={{ color:'#FFF' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentConfirmBtn as any} onPress={handleAdminFeedbackAction}>
                <Text style={{ color:'#FFF', fontWeight:'bold' }}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4-Step Innovation Submission Wizard */}
      <InnovationSubmissionWizard
        visible={wizardModalVisible}
        onClose={() => setWizardModalVisible(false)}
        onSubmitSuccess={handleWizardSubmit}
        currentUser={user}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  glowBlob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.15 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginTop: 1 },
  
  // Tabs
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginVertical: 12, gap: 8, flexWrap: 'wrap' },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeTab: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  tabText: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  activeTabText: { color: '#FFF' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 80 },
  sectionHeading: { fontSize: 15, fontWeight: '800', color: '#FFF', marginVertical: 14, letterSpacing: -0.2 },
  
  // Banner
  banner: { padding: 24, borderRadius: 24, overflow: 'hidden', gap: 8, marginBottom: 20 },
  bannerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  bannerDesc: { fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 16 },
  bannerBtn: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, gap: 6, marginTop: 8 },
  bannerBtnText: { fontSize: 12, fontWeight: '800', color: '#4F46E5' },

  // Idea Card
  ideaCard: { padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 14 },
  ideaHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  stageBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  stageText: { fontSize: 8, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)' },
  categoryText: { fontSize: 8, fontWeight: '900', color: 'rgba(255,255,255,0.7)' },
  ideaTitle: { fontSize: 15, fontWeight: '800', color: '#FFF', lineHeight: 20 },
  ideaAuthor: { fontSize: 10.5, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontWeight: '600' },
  ideaAbstract: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18, marginVertical: 8 },
  ideaFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.03)', paddingTop: 10, marginTop: 6 },
  stageTag: { fontSize: 10.5, color: 'rgba(255,255,255,0.4)' },
  upvoteBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  upvoteText: { fontSize: 11, fontWeight: '800', color: '#FFF' },

  // Glass Card Challenges
  glassCard: { padding: 18, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  cardDetail: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginVertical: 2 },
  applyBtnMini: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(139,92,246,0.15)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.25)', marginTop: 8 },
  applyBtnMiniText: { fontSize: 10, fontWeight: '800', color: '#A855F7' },

  // Filters
  filterBar: { marginBottom: 16 },
  pickerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6, gap: 10 },
  filterLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)', width: 60 },
  filterChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', marginRight: 6 },
  activeFilterChip: { backgroundColor: '#8B5CF6' },
  filterChipText: { fontSize: 10.5, fontWeight: '700', color: '#FFF' },

  filterBlock: { padding: 16, backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', marginBottom: 16 },
  searchBar: { height: 40, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, paddingHorizontal: 14, color: '#FFF', fontSize: 12 },

  // Empty List
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12, textAlign: 'center', paddingHorizontal: 40 },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 },
  viewHeading: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  composerBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#8B5CF6' },
  composerBtnText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  dateText: { fontSize: 10.5, color: 'rgba(255,255,255,0.3)', fontWeight: '700' },

  // Action buttons
  cardActionsRow: { flexDirection: 'row', gap: 8, marginTop: 10, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.03)', paddingTop: 10, justifyContent: 'flex-end', alignItems:'center' },
  actionBtnSecondary: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)' },
  actionBtnPrimary: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(139,92,246,0.2)' },
  actionBtnText: { fontSize: 11, fontWeight: '700', color: '#FFF' },

  // Feedback section
  feedbackSection: { padding: 14, backgroundColor: 'rgba(239,68,68,0.03)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.08)', marginVertical: 10 },
  feedbackTitle: { fontSize: 11, fontWeight: '800', color: '#FBBF24', marginBottom: 4 },
  feedbackComment: { fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 16 },

  // Modals Overlay
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { height: '88%', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalHeaderTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  
  // Forms helper
  formLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.4)', marginTop: 12, marginBottom: 6, letterSpacing: 0.5 },
  formInput: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 14, paddingVertical: 10, color: '#FFF', fontSize: 12 },
  pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 6 },
  pickerBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth:1, borderColor:'rgba(255,255,255,0.05)' },
  pickerBtnActive: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  pickerBtnText: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  pickerBtnTextActive: { color: '#FFF' },
  submitBtn: { backgroundColor: '#8B5CF6', height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  submitBtnText: { fontSize: 13, fontWeight: '800', color: '#FFF' },

  // Details modal helper
  detailLabel: { fontSize: 10, fontWeight: '800', color: '#8B5CF6', letterSpacing: 0.5, marginTop: 16, marginBottom: 4 },
  detailText: { fontSize: 13, color: '#FFF', lineHeight: 18 },
  linkRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  linkText: { fontSize: 12, fontWeight: '700', color: '#3B82F6', textDecorationLine: 'underline' },

  // Admin evaluation layout
  adminActionContainer: { padding: 18, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', marginTop: 24 },
  adminHeading: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  adminBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, alignSelf:'flex-start' },
  adminBtnText: { fontSize: 11, fontWeight: '800', color: '#FFF' },

  // Feedback action modal details
  commentModalContent: { width: '88%', backgroundColor: '#0F172A', borderRadius: 24, padding: 24, alignSelf: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  commentModalTitle: { fontSize: 15, fontWeight: '900', color: '#FFF' },
  commentModalDesc: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginVertical: 6 },
  commentInput: { height: 80, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, color: '#FFF', fontSize: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  commentCancelBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems:'center', justifyContent:'center' },
  commentConfirmBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#8B5CF6', alignItems:'center', justifyContent:'center' },

  // Trends Charts
  analyticsCard: { padding: 16, backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: 24, borderWidth:1, borderColor:'rgba(255,255,255,0.04)', marginBottom: 20 },
  analyticsRow: { marginVertical: 6 },
  analyticsLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 }
});
