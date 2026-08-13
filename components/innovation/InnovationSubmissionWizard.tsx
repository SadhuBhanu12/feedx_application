import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Alert,
  AppState,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ButtonLoading } from '@/components/ui/Loaders';
import { COLORS, SHADOWS } from '@/constants/theme';
import { INNOVATION_CATEGORIES } from './InnovationCategories';

const DRAFT_KEY = 'feedx_innovation_proposal_draft';

const SUPPORT_OPTIONS = [
  'Team Members', 'Mentor', 'Web Developer', 'Mobile App Developer',
  'Backend Developer', 'UI/UX Designer', 'Graphic Designer', 'Content Writer',
  'Testing Support', 'Prototype Development', 'Documentation',
  'Industry Mentor', 'Startup Guidance', 'Funding Guidance',
  'Legal Support', 'Marketing Support', 'Other'
];

const STAGE_OPTIONS = [
  'Idea', 'Research', 'Prototype', 'Development', 'Testing', 'Completed'
];

const PROJECT_TYPES = ['Software', 'Hardware', 'Hybrid / IoT', 'Research / Whitepaper', 'Social Impact', 'Startup Pitch'];

import { useTheme } from '@/context/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess: (proposalData: any) => Promise<void>;
  currentUser: any;
  editingIdea?: any;
}

// ----------------------------------------------------
// Validation Helper Functions
// ----------------------------------------------------
function validateText(value: string, minLen: number, maxLen: number, fieldName: string): string | null {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return `${fieldName} is required.`;
  }
  if (trimmed.length < minLen) {
    return `${fieldName} must be at least ${minLen} characters (currently ${trimmed.length}).`;
  }
  if (trimmed.length > maxLen) {
    return `${fieldName} must not exceed ${maxLen} characters (currently ${trimmed.length}).`;
  }
  // Ignore inputs consisting only of spaces, dots, symbols, or repetitive non-alphanumeric noise
  const meaningfulChars = trimmed.replace(/[\s\.\,\_\-\!\?\@\#\$\%\^\&\*\(\)\=\+\<\>\/\\\|\[\]\{\}\;\:\'\"`~]/g, '');
  const minRequiredMeaningful = Math.max(3, Math.floor(minLen * 0.4));
  if (meaningfulChars.length < minRequiredMeaningful) {
    return `${fieldName} contains invalid symbols or random characters. Please provide meaningful text.`;
  }
  return null;
}

function validateDriveUrl(url: string): string | null {
  const trimmed = (url || '').trim();
  if (!trimmed) return null; // Optional
  const lower = trimmed.toLowerCase();
  const isDrive = lower.includes('drive.google.com') || lower.includes('docs.google.com');
  const isImg = lower.match(/\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/) || 
                lower.includes('cloudinary') || 
                lower.includes('supabase') || 
                lower.includes('unsplash') || 
                lower.includes('googleusercontent');
  if (isDrive || isImg) return null;
  return 'Invalid URL. Enter a valid Google Drive or Image link.';
}

function validatePrototypeUrl(url: string): string | null {
  const trimmed = (url || '').trim();
  if (!trimmed) return null; // Optional
  const lower = trimmed.toLowerCase();
  const isGithub = lower.includes('github.com');
  const isYoutube = lower.includes('youtube.com') || lower.includes('youtu.be');
  const isWebsite = lower.startsWith('http://') || lower.startsWith('https://');
  if (isGithub || isYoutube || isWebsite) return null;
  return 'Invalid URL. Enter a valid GitHub, YouTube, or website link.';
}

function validateTeamMembers(membersText: string): string | null {
  const trimmed = (membersText || '').trim();
  if (!trimmed) return null;
  const list = trimmed.split(/,|\n/).map(m => m.trim()).filter(m => m.length > 0);
  if (list.length > 10) {
    return 'Maximum 10 team members allowed.';
  }
  return null;
}

function validateTechStack(techText: string): string | null {
  const trimmed = (techText || '').trim();
  if (!trimmed) return null;
  const list = trimmed.split(/,|\n/).map(t => t.trim()).filter(t => t.length > 0);
  if (list.length > 10) {
    return 'Maximum 10 technologies allowed.';
  }
  return null;
}

export default function InnovationSubmissionWizard({
  visible,
  onClose,
  onSubmitSuccess,
  currentUser,
  editingIdea,
}: Props) {
  const { colors, isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Step 1: Basic Information
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence');
  const [projectType, setProjectType] = useState('Software');
  const [summary, setSummary] = useState('');
  const [projectImage, setProjectImage] = useState('');

  // Step 2: Project Information
  const [problemStatement, setProblemStatement] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [expectedImpact, setExpectedImpact] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [prototypeLink, setPrototypeLink] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [demoVideo, setDemoVideo] = useState('');

  // Step 3: Team Information
  const [isTeam, setIsTeam] = useState(false);
  const [teamMembers, setTeamMembers] = useState('');
  const [memberRoles, setMemberRoles] = useState('');
  const [facultyGuide, setFacultyGuide] = useState('');

  // Step 4: Support Needed
  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);

  // Step 5: Current Stage
  const [selectedStage, setSelectedStage] = useState('Idea');

  // Compute Validation Errors
  const titleError = useMemo(() => validateText(title, 10, 100, 'Idea Title'), [title]);
  const summaryError = useMemo(() => validateText(summary, 20, 300, 'Brief Summary'), [summary]);
  
  const problemError = useMemo(() => validateText(problemStatement, 30, 500, 'Problem Statement'), [problemStatement]);
  const solutionError = useMemo(() => validateText(proposedSolution, 30, 500, 'Proposed Solution'), [proposedSolution]);
  const descriptionError = useMemo(() => validateText(detailedDescription, 100, 2000, 'Detailed Description'), [detailedDescription]);
  const impactError = useMemo(() => validateText(expectedImpact, 20, 500, 'Expected Impact'), [expectedImpact]);
  
  const driveLinkError = useMemo(() => validateDriveUrl(driveLink), [driveLink]);
  const prototypeLinkError = useMemo(() => validatePrototypeUrl(prototypeLink), [prototypeLink]);
  const githubLinkError = useMemo(() => validatePrototypeUrl(githubLink), [githubLink]);
  const demoVideoError = useMemo(() => validatePrototypeUrl(demoVideo), [demoVideo]);
  
  const teamMembersError = useMemo(() => isTeam ? validateTeamMembers(teamMembers) : null, [isTeam, teamMembers]);
  const techStackError = useMemo(() => validateTechStack(techStack), [techStack]);

  const isStep1Valid = !titleError && !summaryError;
  const isStep2Valid = !problemError && !solutionError && !descriptionError && !impactError && 
                       !driveLinkError && !prototypeLinkError && !githubLinkError && !demoVideoError && !techStackError;
  const isStep3Valid = !isTeam || (!teamMembersError && teamMembers.trim().length > 0);
  const isStep4Valid = selectedSupport.length > 0;
  const isStep5Valid = isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid;

  const markTouched = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  // Load editing idea or draft on open
  useEffect(() => {
    if (editingIdea) {
      setTitle(editingIdea.title || '');
      setCategory(editingIdea.category || 'Artificial Intelligence');
      setProjectType(editingIdea.project_type || 'Software');
      setSummary(editingIdea.summary || editingIdea.description || '');
      setProblemStatement(editingIdea.problem_statement || '');
      setProposedSolution(editingIdea.proposed_solution || '');
      setDetailedDescription(editingIdea.description || '');
      setExpectedImpact(editingIdea.expected_impact || '');
      setTechStack(editingIdea.tech_stack || '');
      setGithubLink(editingIdea.github_link || '');
      setPrototypeLink(editingIdea.demo_link || '');
      setDriveLink(editingIdea.supporting_docs || '');
      setDemoVideo(editingIdea.demo_video || '');
      setIsTeam(!!editingIdea.team_members);
      setTeamMembers(editingIdea.team_members || '');
      setMemberRoles(editingIdea.member_roles || '');
      setFacultyGuide(editingIdea.faculty_guide || '');
      setSelectedSupport(editingIdea.support_needed || []);
      setSelectedStage(editingIdea.stage || 'Idea');
    } else {
      loadDraft();
    }
  }, [editingIdea, visible]);

  // Auto save draft every 10 seconds and on app blur
  useEffect(() => {
    if (!visible || editingIdea || submittedSuccess) return;

    const interval = setInterval(() => {
      saveDraftSilently();
    }, 10000);

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        saveDraftSilently();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [
    visible, title, category, projectType, summary, problemStatement,
    proposedSolution, detailedDescription, expectedImpact, techStack, githubLink,
    prototypeLink, driveLink, demoVideo, isTeam, teamMembers, memberRoles,
    facultyGuide, selectedSupport, selectedStage, editingIdea, submittedSuccess
  ]);

  const loadDraft = async () => {
    try {
      const saved = await AsyncStorage.getItem(DRAFT_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.title) setTitle(d.title);
        if (d.category) setCategory(d.category);
        if (d.projectType) setProjectType(d.projectType);
        if (d.summary) setSummary(d.summary);
        if (d.problemStatement) setProblemStatement(d.problemStatement);
        if (d.proposedSolution) setProposedSolution(d.proposedSolution);
        if (d.detailedDescription) setDetailedDescription(d.detailedDescription);
        if (d.expectedImpact) setExpectedImpact(d.expectedImpact);
        if (d.techStack) setTechStack(d.techStack);
        if (d.githubLink) setGithubLink(d.githubLink);
        if (d.prototypeLink) setPrototypeLink(d.prototypeLink);
        if (d.driveLink) setDriveLink(d.driveLink);
        if (d.demoVideo) setDemoVideo(d.demoVideo);
        if (d.isTeam !== undefined) setIsTeam(d.isTeam);
        if (d.teamMembers) setTeamMembers(d.teamMembers);
        if (d.memberRoles) setMemberRoles(d.memberRoles);
        if (d.facultyGuide) setFacultyGuide(d.facultyGuide);
        if (d.selectedSupport) setSelectedSupport(d.selectedSupport);
        if (d.selectedStage) setSelectedStage(d.selectedStage);
      }
    } catch (e) {
      console.warn('Draft load error:', e);
    }
  };

  const saveDraftSilently = async () => {
    if (!title.trim() && !summary.trim()) return;
    try {
      const draftData = {
        title, category, projectType, summary, projectImage,
        problemStatement, proposedSolution, detailedDescription, expectedImpact,
        techStack, githubLink, prototypeLink, driveLink, demoVideo, isTeam,
        teamMembers, memberRoles, facultyGuide, selectedSupport, selectedStage,
        updatedAt: Date.now()
      };
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      triggerDraftToast();
    } catch (e) {
      console.warn('Draft save error:', e);
    }
  };

  const triggerDraftToast = () => {
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 2000);
  };

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } catch (e) {}
  };

  const handlePickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0]?.uri) {
      setProjectImage(res.assets[0].uri);
    }
  };

  const toggleSupportItem = (item: string) => {
    if (selectedSupport.includes(item)) {
      setSelectedSupport(prev => prev.filter(i => i !== item));
    } else {
      setSelectedSupport(prev => [...prev, item]);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      setTouchedFields({ title: true, summary: true });
      if (!isStep1Valid) {
        Alert.alert('Validation Error', titleError || summaryError || 'Please fix errors in Step 1.');
        return;
      }
    } else if (step === 2) {
      setTouchedFields(prev => ({
        ...prev,
        problemStatement: true,
        proposedSolution: true,
        detailedDescription: true,
        expectedImpact: true,
        driveLink: true,
        prototypeLink: true,
      }));
      if (!isStep2Valid) {
        Alert.alert('Validation Error', problemError || solutionError || descriptionError || impactError || driveLinkError || prototypeLinkError || 'Please fix errors in Step 2.');
        return;
      }
    } else if (step === 3) {
      setTouchedFields(prev => ({ ...prev, teamMembers: true }));
      if (!isStep3Valid) {
        Alert.alert('Validation Error', teamMembersError || 'Please provide team member details.');
        return;
      }
    } else if (step === 4) {
      if (!isStep4Valid) {
        Alert.alert('Support Needed', 'Please select at least one type of support needed from FEEDX.');
        return;
      }
    }
    saveDraftSilently();
    setStep(prev => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitFinal = async () => {
    if (!isStep5Valid) {
      Alert.alert('Validation Error', 'Please complete all required fields with valid input before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        category,
        project_type: projectType,
        description: detailedDescription.trim() || summary.trim(),
        problem_statement: problemStatement.trim(),
        proposed_solution: proposedSolution.trim(),
        expected_impact: expectedImpact.trim(),
        tech_stack: techStack.trim() || null,
        github_link: githubLink.trim() || null,
        demo_link: prototypeLink.trim() || null,
        supporting_docs: driveLink.trim() || null,
        demo_video: demoVideo.trim() || null,
        team_members: isTeam ? teamMembers.trim() : null,
        member_roles: isTeam ? memberRoles.trim() : null,
        faculty_guide: facultyGuide.trim() || null,
        support_needed: selectedSupport,
        stage: selectedStage,
        user_id: currentUser?.id,
        author_name: currentUser?.full_name || 'Student Innovator',
        college_name: currentUser?.college_name || 'FEEDX Polytechnic',
        status: 'Submitted'
      };

      await onSubmitSuccess(payload);
      await clearDraft();
      setSubmittedSuccess(true);
    } catch (e: any) {
      Alert.alert('Submission Error', e.message || 'Failed to submit proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedSuccess(false);
    setStep(1);
    setTitle('');
    setSummary('');
    setProblemStatement('');
    setProposedSolution('');
    setDetailedDescription('');
    setExpectedImpact('');
    setTechStack('');
    setGithubLink('');
    setPrototypeLink('');
    setDriveLink('');
    setDemoVideo('');
    setTeamMembers('');
    setMemberRoles('');
    setFacultyGuide('');
    setSelectedSupport([]);
    setTouchedFields({});
    onClose();
  };

  const stepPct = step * 20;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />}

        {/* Floating Draft Saved Toast */}
        {draftSavedToast && (
          <View style={styles.draftToastBox}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.draftToastText}>Draft Saved Successfully</Text>
          </View>
        )}

        {submittedSuccess ? (
          /* Full Screen Success Screen with Proposal Details Summary */
          <ScrollView contentContainerStyle={styles.successScreenContainer} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={resetAndClose} style={[styles.successCloseBtn, { backgroundColor: colors.inputBg }]}>
              <Feather name="x" size={20} color={colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.successBadgeCircle}>
              <Feather name="check" size={48} color="#FFF" />
            </View>

            <Text style={[styles.successEmojiTitle, { color: colors.textPrimary }]}>🎉 Innovation Proposal Submitted!</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Status: Under Review</Text>
            </View>

            {/* Proposal Details Summary Box */}
            <View style={{
              width: '100%',
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 16,
              marginVertical: 16,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 10,
            }}>
              <Text style={{ fontSize: 12, fontWeight: '900', color: '#60A5FA', letterSpacing: 0.5 }}>YOUR SUBMITTED PROPOSAL DETAILS</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.textPrimary }}>{title || 'Innovation Project'}</Text>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#60A5FA' }}>Domain: {category}</Text>
                </View>
                <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#34D399' }}>Type: {projectType}</Text>
                </View>
                <View style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#FBBF24' }}>Stage: {selectedStage}</Text>
                </View>
              </View>

              {summary ? (
                <View style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textMuted }}>Summary:</Text>
                  <Text style={{ fontSize: 12.5, color: colors.textSecondary, lineHeight: 18 }}>{summary}</Text>
                </View>
              ) : null}

              {problemStatement ? (
                <View style={{ marginTop: 2 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textMuted }}>Problem Statement:</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 17 }}>{problemStatement}</Text>
                </View>
              ) : null}

              {proposedSolution ? (
                <View style={{ marginTop: 2 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textMuted }}>Proposed Solution:</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 17 }}>{proposedSolution}</Text>
                </View>
              ) : null}

              {techStack ? (
                <View style={{ marginTop: 2 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textMuted }}>Tech Stack:</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{techStack}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.successActionsColumn}>
              <TouchableOpacity style={styles.primarySuccessCta} onPress={resetAndClose}>
                <Text style={styles.ctaText}>Return to Innovation Hub</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          /* 5-Step Guided Submission Wizard */
          <View style={{ flex: 1 }}>

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.inputBg }]}>
                <Feather name="x" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Submit Innovation Proposal</Text>
              <View style={{ width: 36 }} />
            </View>

            {/* Step Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTextRow}>
                <Text style={[styles.progressStepText, { color: colors.textPrimary }]}>Step {step} of 5</Text>
                <Text style={styles.progressPctText}>{stepPct}% Completed</Text>
              </View>

              {/* Visual Step Bar */}
              <View style={[styles.stepTrackBg, { backgroundColor: colors.border }]}>
                <View style={[styles.stepTrackFill, { width: `${stepPct}%` }]} />
              </View>

              {/* 5 Visual Track Dots */}
              <View style={styles.dotsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <View
                    key={s}
                    style={[
                      styles.dotItem,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      s <= step && styles.dotActive,
                      s === step && styles.dotCurrent,
                    ]}
                  >
                    <Text style={[styles.dotText, { color: colors.textMuted }, s <= step && styles.dotTextActive]}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Step Body Form */}
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <View style={styles.stepSection}>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Step 1: Basic Information</Text>
                  <Text style={[styles.stepSubtitle, { color: colors.textMuted }]}>Provide title, category, project type, and cover image</Text>

                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.label, { color: colors.textSecondary }]}>Idea Title *</Text>
                      <Text style={[styles.counterText, { color: colors.textMuted }, title.length > 100 && styles.counterError]}>
                        {title.length}/100
                      </Text>
                    </View>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, (touchedFields.title || title) && titleError && styles.inputError]}
                      placeholder="e.g. Smart Water Telemetry System (Min 10 chars)"
                      placeholderTextColor={colors.textMuted}
                      value={title}
                      onChangeText={(val) => { setTitle(val); markTouched('title'); }}
                      maxLength={100}
                    />
                    {(touchedFields.title || title.length > 0) && titleError && (
                      <Text style={styles.errorText}>{titleError}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Category *</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalChips}>
                      {INNOVATION_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={[styles.chipBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }, category === cat.name && styles.chipBtnSelected]}
                          onPress={() => setCategory(cat.name)}
                        >
                          <Text style={[styles.chipText, { color: colors.textSecondary }, category === cat.name && styles.chipTextSelected]}>{cat.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Project Type *</Text>
                    <View style={styles.typesRow}>
                      {PROJECT_TYPES.map((t) => (
                        <TouchableOpacity
                          key={t}
                          style={[styles.typeBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }, projectType === t && styles.typeBtnSelected]}
                          onPress={() => setProjectType(t)}
                        >
                          <Text style={[styles.typeText, { color: colors.textSecondary }, projectType === t && styles.typeTextSelected]}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.label, { color: colors.textSecondary }]}>Brief Summary / Abstract *</Text>
                      <Text style={[styles.counterText, { color: colors.textMuted }, summary.length > 300 && styles.counterError]}>
                        {summary.length}/300
                      </Text>
                    </View>
                    <TextInput
                      style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, (touchedFields.summary || summary) && summaryError && styles.inputError]}
                      placeholder="Describe your innovation project in 2-3 sentences (Min 20 chars)..."
                      placeholderTextColor={colors.textMuted}
                      multiline
                      numberOfLines={4}
                      value={summary}
                      onChangeText={(val) => { setSummary(val); markTouched('summary'); }}
                      maxLength={300}
                    />
                    {(touchedFields.summary || summary.length > 0) && summaryError && (
                      <Text style={styles.errorText}>{summaryError}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Cover Image (Optional)</Text>
                    <TouchableOpacity style={[styles.imagePickerBox, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handlePickImage}>
                      <Feather name="image" size={24} color="#60A5FA" />
                      <Text style={styles.imagePickerText}>{projectImage ? 'Cover Image Selected (Tap to change)' : 'Upload Cover Image'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Step 2: Project Information */}
              {step === 2 && (
                <View style={styles.stepSection}>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Step 2: Project Information</Text>
                  <Text style={[styles.stepSubtitle, { color: colors.textMuted }]}>Explain problem statement, proposed solution, and documentation links</Text>

                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.label, { color: colors.textSecondary }]}>Problem Statement *</Text>
                      <Text style={[styles.counterText, { color: colors.textMuted }, problemStatement.length > 500 && styles.counterError]}>
                        {problemStatement.length}/500
                      </Text>
                    </View>
                    <TextInput
                      style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, (touchedFields.problemStatement || problemStatement) && problemError && styles.inputError]}
                      placeholder="What real-world problem does your project address? (30 - 500 characters)"
                      placeholderTextColor={colors.textMuted}
                      multiline
                      numberOfLines={3}
                      value={problemStatement}
                      onChangeText={(val) => { setProblemStatement(val); markTouched('problemStatement'); }}
                      maxLength={500}
                    />
                    {(touchedFields.problemStatement || problemStatement.length > 0) && problemError && (
                      <Text style={styles.errorText}>{problemError}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.label, { color: colors.textSecondary }]}>Proposed Solution *</Text>
                      <Text style={[styles.counterText, { color: colors.textMuted }, proposedSolution.length > 500 && styles.counterError]}>
                        {proposedSolution.length}/500
                      </Text>
                    </View>
                    <TextInput
                      style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, (touchedFields.proposedSolution || proposedSolution) && solutionError && styles.inputError]}
                      placeholder="Describe how your technology solves this problem... (30 - 500 characters)"
                      placeholderTextColor={colors.textMuted}
                      multiline
                      numberOfLines={3}
                      value={proposedSolution}
                      onChangeText={(val) => { setProposedSolution(val); markTouched('proposedSolution'); }}
                      maxLength={500}
                    />
                    {(touchedFields.proposedSolution || proposedSolution.length > 0) && solutionError && (
                      <Text style={styles.errorText}>{solutionError}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.label, { color: colors.textSecondary }]}>Detailed Description *</Text>
                      <Text style={[styles.counterText, { color: colors.textMuted }, detailedDescription.length > 2000 && styles.counterError]}>
                        {detailedDescription.length}/2000
                      </Text>
                    </View>
                    <TextInput
                      style={[styles.input, styles.textAreaLarge, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, (touchedFields.detailedDescription || detailedDescription) && descriptionError && styles.inputError]}
                      placeholder="Provide full technical architecture, features, and methodology... (100 - 2000 characters)"
                      placeholderTextColor={colors.textMuted}
                      multiline
                      numberOfLines={5}
                      value={detailedDescription}
                      onChangeText={(val) => { setDetailedDescription(val); markTouched('detailedDescription'); }}
                      maxLength={2000}
                    />
                    {(touchedFields.detailedDescription || detailedDescription.length > 0) && descriptionError && (
                      <Text style={styles.errorText}>{descriptionError}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.label, { color: colors.textSecondary }]}>Expected Impact *</Text>
                      <Text style={[styles.counterText, { color: colors.textMuted }, expectedImpact.length > 500 && styles.counterError]}>
                        {expectedImpact.length}/500
                      </Text>
                    </View>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, (touchedFields.expectedImpact || expectedImpact) && impactError && styles.inputError]}
                      placeholder="e.g. Reduces campus water consumption by 35% (20 - 500 characters)"
                      placeholderTextColor={colors.textMuted}
                      value={expectedImpact}
                      onChangeText={(val) => { setExpectedImpact(val); markTouched('expectedImpact'); }}
                      maxLength={500}
                    />
                    {(touchedFields.expectedImpact || expectedImpact.length > 0) && impactError && (
                      <Text style={styles.errorText}>{impactError}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Technology Stack (Max 10 technologies)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, techStackError && styles.inputError]}
                      placeholder="e.g. Python, TensorFlow, React Native, ESP32 (comma separated)"
                      placeholderTextColor={colors.textMuted}
                      value={techStack}
                      onChangeText={setTechStack}
                    />
                    {techStackError && <Text style={styles.errorText}>{techStackError}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>GitHub Repository Link</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, githubLinkError && styles.inputError]}
                      placeholder="https://github.com/username/repository"
                      placeholderTextColor={colors.textMuted}
                      value={githubLink}
                      onChangeText={setGithubLink}
                      autoCapitalize="none"
                    />
                    {githubLinkError && <Text style={styles.errorText}>{githubLinkError}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Prototype / Demo Link</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, prototypeLinkError && styles.inputError]}
                      placeholder="Accepts valid GitHub, YouTube, or Website URLs"
                      placeholderTextColor={colors.textMuted}
                      value={prototypeLink}
                      onChangeText={setPrototypeLink}
                      autoCapitalize="none"
                    />
                    {prototypeLinkError && <Text style={styles.errorText}>{prototypeLinkError}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Supporting Documents Link</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, driveLinkError && styles.inputError]}
                      placeholder="Accepts valid Google Drive or Image URLs"
                      placeholderTextColor={colors.textMuted}
                      value={driveLink}
                      onChangeText={setDriveLink}
                      autoCapitalize="none"
                    />
                    {driveLinkError && <Text style={styles.errorText}>{driveLinkError}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Demo Video Link (YouTube / Drive)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, demoVideoError && styles.inputError]}
                      placeholder="https://youtube.com/watch?v=..."
                      placeholderTextColor={colors.textMuted}
                      value={demoVideo}
                      onChangeText={setDemoVideo}
                      autoCapitalize="none"
                    />
                    {demoVideoError && <Text style={styles.errorText}>{demoVideoError}</Text>}
                  </View>
                </View>
              )}

              {/* Step 3: Team Information */}
              {step === 3 && (
                <View style={styles.stepSection}>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Step 3: Team Information</Text>
                  <Text style={[styles.stepSubtitle, { color: colors.textMuted }]}>Specify if this is a Solo or Team project</Text>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Submission Mode *</Text>
                    <View style={styles.modeToggleRow}>
                      <TouchableOpacity
                        style={[styles.modeBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }, !isTeam && styles.modeBtnActive]}
                        onPress={() => setIsTeam(false)}
                      >
                        <Feather name="user" size={16} color={!isTeam ? '#FFF' : colors.textMuted} />
                        <Text style={[styles.modeBtnText, { color: colors.textSecondary }, !isTeam && styles.modeBtnTextActive]}>Solo Project</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modeBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }, isTeam && styles.modeBtnActive]}
                        onPress={() => setIsTeam(true)}
                      >
                        <Feather name="users" size={16} color={isTeam ? '#FFF' : colors.textMuted} />
                        <Text style={[styles.modeBtnText, { color: colors.textSecondary }, isTeam && styles.modeBtnTextActive]}>Team Project</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {isTeam && (
                    <>
                      <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Team Members * (Limit: Max 10 members)</Text>
                        <TextInput
                          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }, teamMembersError && styles.inputError]}
                          placeholder="e.g. Rahul Sharma, Priya Verma (Comma separated)"
                          placeholderTextColor={colors.textMuted}
                          value={teamMembers}
                          onChangeText={(val) => { setTeamMembers(val); markTouched('teamMembers'); }}
                        />
                        {teamMembersError && <Text style={styles.errorText}>{teamMembersError}</Text>}
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Roles & Responsibilities</Text>
                        <TextInput
                          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
                          placeholder="e.g. Rahul (Backend & ML), Priya (UI/UX)"
                          placeholderTextColor={colors.textMuted}
                          value={memberRoles}
                          onChangeText={setMemberRoles}
                        />
                      </View>
                    </>
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Faculty Guide (Optional)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
                      placeholder="e.g. Dr. K. V. Rao (ECE Dept)"
                      placeholderTextColor={colors.textMuted}
                      value={facultyGuide}
                      onChangeText={setFacultyGuide}
                    />
                  </View>
                </View>
              )}

              {/* Step 4: Support Needed */}
              {step === 4 && (
                <View style={styles.stepSection}>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Step 4: Support Needed</Text>
                  <Text style={[styles.stepSubtitle, { color: colors.textMuted }]}>What support do you need from FEEDX?</Text>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>What support do you need from FEEDX? (Select at least 1) *</Text>
                    <View style={styles.supportGrid}>
                      {SUPPORT_OPTIONS.map((item) => {
                        const selected = selectedSupport.includes(item);
                        return (
                          <TouchableOpacity
                            key={item}
                            style={[styles.supportTag, { backgroundColor: colors.inputBg, borderColor: colors.border }, selected && styles.supportTagSelected]}
                            onPress={() => toggleSupportItem(item)}
                          >
                            <Feather
                              name={selected ? "check-square" : "square"}
                              size={14}
                              color={selected ? "#10B981" : colors.textMuted}
                              style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.supportTagText, { color: colors.textSecondary }, selected && styles.supportTagTextSelected]}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>
              )}

              {/* Step 5: Current Stage & Final Checklist */}
              {step === 5 && (
                <View style={styles.stepSection}>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Step 5: Current Stage & Review</Text>
                  <Text style={[styles.stepSubtitle, { color: colors.textMuted }]}>What stage is your project currently in?</Text>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Select Current Stage *</Text>
                    <View style={styles.stagesRow}>
                      {STAGE_OPTIONS.map((st) => (
                        <TouchableOpacity
                          key={st}
                          style={[styles.stagePill, { backgroundColor: colors.inputBg, borderColor: colors.border }, selectedStage === st && styles.stagePillSelected]}
                          onPress={() => setSelectedStage(st)}
                        >
                          <Text style={[styles.stagePillText, { color: colors.textSecondary }, selectedStage === st && styles.stagePillTextSelected]}>
                            {st}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={[styles.summaryReviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.summaryReviewTitle, { color: colors.textPrimary }]}>Proposal Summary Checklist</Text>
                    <Text style={[styles.summaryReviewText, { color: colors.textSecondary }]}>• Title: {title}</Text>
                    <Text style={[styles.summaryReviewText, { color: colors.textSecondary }]}>• Category: {category}</Text>
                    <Text style={[styles.summaryReviewText, { color: colors.textSecondary }]}>• Type: {projectType}</Text>
                    <Text style={[styles.summaryReviewText, { color: colors.textSecondary }]}>• Mode: {isTeam ? 'Team Project' : 'Solo Project'}</Text>
                    <Text style={[styles.summaryReviewText, { color: colors.textSecondary }]}>• Support Items: {selectedSupport.length} selected</Text>
                    <Text style={[styles.summaryReviewText, { color: colors.textSecondary }]}>• Stage: {selectedStage}</Text>
                  </View>
                </View>
              )}

            </ScrollView>

            {/* Wizard Navigation Footer */}
            <View style={[styles.wizardFooter, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
              {step > 1 ? (
                <TouchableOpacity style={[styles.prevBtn, { backgroundColor: colors.inputBg }]} onPress={handlePrevStep}>
                  <Feather name="arrow-left" size={16} color={colors.textPrimary} style={{ marginRight: 4 }} />
                  <Text style={[styles.prevBtnText, { color: colors.textPrimary }]}>Previous</Text>
                </TouchableOpacity>
              ) : <View />}

              {step < 5 ? (
                <TouchableOpacity
                  style={[
                    styles.nextBtn,
                    ((step === 1 && !isStep1Valid) || 
                     (step === 2 && !isStep2Valid) || 
                     (step === 3 && !isStep3Valid) || 
                     (step === 4 && !isStep4Valid)) && styles.btnDisabled
                  ]}
                  onPress={handleNextStep}
                >
                  <LinearGradient
                    colors={
                      ((step === 1 && !isStep1Valid) || 
                       (step === 2 && !isStep2Valid) || 
                       (step === 3 && !isStep3Valid) || 
                       (step === 4 && !isStep4Valid))
                        ? ['#475569', '#334155']
                        : COLORS.gradientPrimary
                    }
                    style={styles.nextGradient}
                  >
                    <Text style={styles.nextBtnText}>Next Step</Text>
                    <Feather name="arrow-right" size={16} color="#FFF" style={{ marginLeft: 4 }} />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.nextBtn, !isStep5Valid && styles.btnDisabled]}
                  onPress={handleSubmitFinal}
                  disabled={submitting || !isStep5Valid}
                >
                  <LinearGradient
                    colors={!isStep5Valid ? ['#475569', '#334155'] : ['#10B981', '#059669']}
                    style={styles.nextGradient}
                  >
                    {submitting ? <ButtonLoading color="#FFF" /> : (
                      <>
                        <Text style={styles.nextBtnText}>Submit Proposal</Text>
                        <Feather name="check" size={16} color="#FFF" style={{ marginLeft: 4 }} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  draftToastBox: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  draftToastText: { color: '#10B981', fontSize: 12, fontWeight: '700' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  progressContainer: { padding: 16, gap: 10 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressStepText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  progressPctText: { color: '#3B82F6', fontSize: 13, fontWeight: '800' },
  stepTrackBg: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  stepTrackFill: { height: 6, borderRadius: 3, backgroundColor: '#3B82F6' },
  dotsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  dotItem: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  dotActive: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3B82F6' },
  dotCurrent: { backgroundColor: '#3B82F6' },
  dotText: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700' },
  dotTextActive: { color: '#FFF' },
  scrollBody: { padding: 16, paddingBottom: 100 },
  stepSection: { gap: 14 },
  stepTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  stepSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: -8 },
  inputGroup: { gap: 6 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  counterText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  counterError: { color: '#EF4444' },
  input: {
    height: 52, borderRadius: 14, paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    color: '#FFF', fontSize: 15,
  },
  inputError: { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' },
  errorText: { color: '#EF4444', fontSize: 11, fontWeight: '600', marginTop: 2 },
  textArea: { height: 90, paddingTop: 12, textAlignVertical: 'top' },
  textAreaLarge: { height: 120, paddingTop: 12, textAlignVertical: 'top' },
  horizontalChips: { gap: 8, paddingVertical: 4 },
  chipBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  chipBtnSelected: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3B82F6' },
  chipText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  chipTextSelected: { color: '#FFF', fontWeight: '800' },
  typesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  typeBtnSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  typeText: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  typeTextSelected: { color: '#FFF', fontWeight: '700' },
  imagePickerBox: {
    height: 80, borderRadius: 16, borderStyle: 'dashed', borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.4)', backgroundColor: 'rgba(59, 130, 246, 0.05)',
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  imagePickerText: { color: '#93C5FD', fontSize: 13, fontWeight: '600' },
  modeToggleRow: { flexDirection: 'row', gap: 10 },
  modeBtn: {
    flex: 1, height: 48, borderRadius: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  modeBtnActive: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3B82F6' },
  modeBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '600' },
  modeBtnTextActive: { color: '#FFF', fontWeight: '800' },
  supportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  supportTag: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  supportTagSelected: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' },
  supportTagText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  supportTagTextSelected: { color: '#FFF', fontWeight: '800' },
  stagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stagePill: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  stagePillSelected: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  stagePillText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  stagePillTextSelected: { color: '#FFF', fontWeight: '800' },
  summaryReviewCard: {
    marginTop: 14, padding: 16, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 6,
  },
  summaryReviewTitle: { color: '#FFF', fontSize: 13, fontWeight: '800', marginBottom: 4 },
  summaryReviewText: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  wizardFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 70, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
  },
  prevBtn: {
    height: 48, paddingHorizontal: 16, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  prevBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  nextBtn: { height: 48, borderRadius: 14, overflow: 'hidden', minWidth: 140 },
  btnDisabled: { opacity: 0.5 },
  nextGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  nextBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },

  // Success Screen
  successScreenContainer: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  successCloseBtn: {
    position: 'absolute', top: 50, right: 20,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  successBadgeCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, ...SHADOWS.glow('#10B981'),
  },
  successEmojiTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 12 },
  statusPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: 20,
  },
  statusPillText: { color: '#10B981', fontWeight: '800', fontSize: 13 },
  successMessage: { color: 'rgba(255,255,255,0.75)', fontSize: 14, textAlign: 'center', lineHeight: 23, marginBottom: 32, fontStyle: 'italic', paddingHorizontal: 10 },
  successActionsColumn: { width: '100%', gap: 12 },
  primarySuccessCta: {
    height: 52, borderRadius: 16, backgroundColor: '#3B82F6',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});
