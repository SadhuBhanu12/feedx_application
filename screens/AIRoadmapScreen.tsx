import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Share,
  Alert,
  Dimensions,
  Modal,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCalendarDateString } from '@/services/gamificationService';
import { storage } from '@/store/storage';
import GlassCard from '@/components/ui/GlassCard';
import { PressableCard } from '@/components/ui/PressableCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/constants/motion';
import { CAREER_ROADMAPS, CAREER_CATEGORIES } from '@/constants/roadmaps';
import {
  AcademicYearOption,
  DailyLearningTimeOption,
  CareerGoalOption,
  PhaseQuizQuestion,
  PhaseTaskItem,
} from '@/constants/roadmaps/personalization';
import {
  roadmapService,
  UserProfileInput,
  PersonalizedBlueprintResponse,
  PhaseNodeState,
  CareerSwitchEligibility,
} from '@/services/roadmapService';
import { useUser } from '@/context/UserContext';
import { useGamification } from '@/context/GamificationContext';
import { OFFICIAL_REWARDS } from '@/constants/rewardConfig';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { rf, rs } from '@/constants/responsive';
import { useTheme } from '@/context/ThemeContext';
import { SHADOWS } from '@/constants/theme';
import MilestoneCelebrationModal from '@/components/roadmap/MilestoneCelebrationModal';
import { safeBack } from '@/utils/navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BRANCH_OPTIONS = [
  'Computer Science / IT',
  'Electronics & Comm (ECE)',
  'Electrical & Electronics (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence & DS',
  'Other Engineering Branch',
];

const YEAR_OPTIONS: AcademicYearOption[] = ['1st Year', '2nd Year', 'Final Year'];

const STUDY_TIME_OPTIONS: { id: DailyLearningTimeOption; label: string; desc: string }[] = [
  { id: '< 1 hour', label: 'Less than 1 hour', desc: 'Light pace, 30–45 mins daily' },
  { id: '1–2 hours', label: '1–2 hours', desc: 'Balanced theory & practical practice' },
  { id: '3+ hours', label: '3+ hours', desc: 'Intensive immersion & accelerated depth' },
];

const CAREER_GOAL_OPTIONS: { id: CareerGoalOption; label: string; icon: string }[] = [
  { id: 'Job', label: 'Industry Job / Tech Placement', icon: 'briefcase' },
  { id: 'Government Job', label: 'Government / PSU Job', icon: 'award' },
  { id: 'Higher Studies', label: 'Higher Studies (B.Tech / Masters)', icon: 'book' },
  { id: 'Startup / Business', label: 'Startup / Tech Entrepreneurship', icon: 'zap' },
  { id: 'Not Sure', label: 'Not Sure / Career Exploration', icon: 'compass' },
];

// =========================================================================
// SUB-COMPONENT: Pulsing Active Ring for Current Learning Node
// =========================================================================
function PulsingActiveRing({ isDark }: { isDark: boolean }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.28, { duration: 1100, easing: MOTION_EASINGS.standard }),
        withTiming(1, { duration: 1100, easing: MOTION_EASINGS.standard })
      ),
      -1,
      true
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.28], [0.75, 0.15], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View
      style={[
        styles.activePulseRing,
        {
          borderColor: '#38BDF8',
          backgroundColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.2)',
        },
        ringStyle,
      ]}
    />
  );
}

// =========================================================================
// SUB-COMPONENT: Connected Milestone Node
// =========================================================================
interface MilestoneNodeProps {
  state: PhaseNodeState;
  phaseNum: number;
  isDark: boolean;
  onPress: () => void;
}

function MilestoneNode({ state, phaseNum, isDark, onPress }: MilestoneNodeProps) {
  const isComp = state === 'completed';
  const isLocked = state === 'locked';
  const isInProgress = state === 'in_progress';
  const isEligible = state === 'eligible_for_completion';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isLocked}
      onPress={() => {
        try {
          Haptics.selectionAsync().catch(() => {});
        } catch {}
        onPress();
      }}
      style={styles.nodeTouchableWrap}
    >
      {isInProgress && <PulsingActiveRing isDark={isDark} />}

      <View
        style={[
          styles.nodeCircle,
          isComp
            ? styles.nodeCircleComp
            : isEligible
            ? styles.nodeCircleEligible
            : isInProgress
            ? styles.nodeCircleInProgress
            : isLocked
            ? [styles.nodeCircleLocked, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]
            : styles.nodeCircleActive,
        ]}
      >
        {isComp ? (
          <Feather name="check" size={16} color="#FFF" />
        ) : isEligible ? (
          <Feather name="award" size={15} color="#10B981" />
        ) : isInProgress ? (
          <LinearGradient
            colors={['#2563EB', '#06B6D4']}
            style={styles.activeInnerCircle}
          >
            <View style={styles.activeDot} />
          </LinearGradient>
        ) : isLocked ? (
          <Feather name="lock" size={13} color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'} />
        ) : (
          <Text style={styles.nodeNum}>{phaseNum}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// =========================================================================
// SUB-COMPONENT: Hero Shimmer Progress Bar
// =========================================================================
function HeroProgressBar({ progress }: { progress: number }) {
  const pct = Math.min(100, Math.max(0, Number(progress) || 0));
  const shimmer = useSharedValue(-1);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: MOTION_EASINGS.standard }),
        withTiming(-1, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmer.value, [-1, 1], [-60, 260]) }],
  }));

  return (
    <View style={styles.heroBarTrack}>
      <View style={[styles.heroBarFill, { width: `${pct}%`, minWidth: pct > 0 ? 6 : 0 }]}>
        <LinearGradient
          colors={['#2563EB', '#38BDF8', '#10B981']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.shimmerHighlight, shimmerStyle]}>
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.45)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

// =========================================================================
// MAIN COMPONENT: AIRoadmapScreen
// =========================================================================
export default function AIRoadmapScreen() {
  const router = useRouter();
  const { careerId } = useLocalSearchParams<{ careerId?: string }>();
  const { user } = useUser();
  const { streak, refreshGamification, triggerReward, triggerActivity } = useGamification();
  const { colors, isDark } = useTheme();

  const scrollRef = useRef<ScrollView>(null);
  const phaseLayoutOffsets = useRef<Record<string, number>>({});

  // Wizard Steps: 1 = Student Profile & Onboarding, 2 = Choose Career, 3 = Blueprint Dashboard
  const [step, setStep] = useState<1 | 2 | 3>(3);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('fullstack-developer');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Student Onboarding Information (Page 1)
  const [studentName, setStudentName] = useState<string>(user?.full_name || 'Student');
  const [branch, setBranch] = useState<string>(user?.branch || 'Computer Science / IT');
  const [dailyTime, setDailyTime] = useState<DailyLearningTimeOption>('1–2 hours');
  const [academicYear, setAcademicYear] = useState<AcademicYearOption>('1st Year');
  const [careerGoal, setCareerGoal] = useState<CareerGoalOption>('Job');
  const [targetCompany, setTargetCompany] = useState<string>('Top Tech Companies');

  // Blueprint Response & Progress
  const [loading, setLoading] = useState<boolean>(true);
  const [blueprintData, setBlueprintData] = useState<PersonalizedBlueprintResponse | null>(null);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [taskProgressMap, setTaskProgressMap] = useState<Record<string, { completed: boolean }>>({});
  const [topicProgressMap, setTopicProgressMap] = useState<Record<string, { completed: boolean }>>({});
  const [quizScoresMap, setQuizScoresMap] = useState<Record<string, { score: number; passed: boolean }>>({});

  // Celebration Modal State
  const [celebrationModalVisible, setCelebrationModalVisible] = useState<boolean>(false);
  const [celebrationDetails, setCelebrationDetails] = useState<{
    title: string;
    type: 'stage_completed' | 'progress_25' | 'progress_50' | 'progress_75' | 'roadmap_completed';
    stageNum?: number;
    score?: number;
    pointsAwarded?: number;
  }>({
    title: '',
    type: 'stage_completed',
    pointsAwarded: 35,
  });

  // Floating "Back to Current Stage" visible flag
  const [showScrollToCurrentBtn, setShowScrollToCurrentBtn] = useState<boolean>(false);

  // Career Switch Restriction State
  const [switchEligibility, setSwitchEligibility] = useState<CareerSwitchEligibility>({
    allowed: true,
    remainingMs: 0,
    remainingText: 'Available now',
    nextAvailableAt: null,
    lastSelectedCareerId: null,
  });

  // Quiz Modal State
  const [activeQuizModalPhase, setActiveQuizModalPhase] = useState<any | null>(null);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResultScore, setQuizResultScore] = useState<number>(0);
  const [quizPassedStatus, setQuizPassedStatus] = useState<boolean>(false);

  // Sync state helpers
  const refreshLocalState = useCallback(
    (targetCareer: string) => {
      const completed = roadmapService.getProgress(targetCareer);
      setCompletedPhases(completed);
      setBookmarked(roadmapService.isBookmarked(targetCareer));
      setTaskProgressMap(roadmapService.getTaskProgressMap(targetCareer));
      setTopicProgressMap(roadmapService.getTopicProgressMap(targetCareer));
      setQuizScoresMap(roadmapService.getQuizScoresMap(targetCareer));
      setSwitchEligibility(roadmapService.canSwitchCareer(user?.id));
    },
    [user?.id]
  );

  // Load and personalize blueprint
  const loadBlueprint = useCallback(
    async (careerIdToLoad: string, profileOverride?: UserProfileInput) => {
      setLoading(true);
      const profile: UserProfileInput = profileOverride || {
        name: studentName || user?.full_name || 'Student',
        branch: branch || user?.branch || 'Computer Science / IT',
        year: academicYear || '1st Year',
        studyHoursPerDay: dailyTime || '1–2 hours',
        careerGoal: careerGoal || 'Job',
        targetCompany: targetCompany || 'Top Tech Companies',
      };

      try {
        const res = await roadmapService.generateCareerBlueprint(profile, careerIdToLoad);
        setBlueprintData(res);
        refreshLocalState(res.blueprint.id);
        if (res.blueprint.personalizedPhases.length > 0) {
          // Auto-expand the first in-progress or available phase
          const completedList = roadmapService.getProgress(res.blueprint.id);
          const firstUnfinished = res.blueprint.personalizedPhases.find((p) => !completedList.includes(p.id)) || res.blueprint.personalizedPhases[0];
          setExpandedPhases({ [firstUnfinished.id]: true });
          roadmapService.ensurePhaseStarted(res.blueprint.id, firstUnfinished.id);
        }
        if (user?.id) {
          roadmapService.syncProgressToSupabase(res.blueprint.id, user.id);
        }
      } catch (err) {
        console.warn('[AIRoadmapScreen] loadBlueprint error:', err);
        Alert.alert('Error', 'Unable to generate career blueprint.');
      } finally {
        setLoading(false);
      }
    },
    [studentName, branch, academicYear, dailyTime, careerGoal, targetCompany, user, refreshLocalState]
  );

  // Initial mount check
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const savedProfileRaw = storage.getString('student_profile_data');
        if (savedProfileRaw) {
          const parsed = JSON.parse(savedProfileRaw);
          if (parsed.studentName) setStudentName(parsed.studentName);
          if (parsed.branch) setBranch(parsed.branch);
          if (parsed.dailyLearningTime) setDailyTime(parsed.dailyLearningTime);
          if (parsed.academicYear) setAcademicYear(parsed.academicYear);
          if (parsed.careerGoal) setCareerGoal(parsed.careerGoal);
          if (parsed.targetCompany) setTargetCompany(parsed.targetCompany);
        }
      } catch {}

      if (user?.id) {
        try {
          await roadmapService.fetchProgressFromSupabase(user.id);
        } catch {}
      }

      let targetId = careerId;
      if (!targetId) {
        targetId = storage.getString('last_active_career_id') || storage.getString('active_roadmap_id');
      }

      if (targetId && isMounted) {
        setSelectedCareerId(targetId);
        setStep(3);
        await loadBlueprint(targetId);
      } else if (isMounted) {
        setStep(1);
        setLoading(false);
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, [careerId, user?.id]);

  // Overall Verified Score
  const verifiedScore = useMemo(() => {
    if (!blueprintData) return 0;
    return roadmapService.getVerifiedScore(
      blueprintData.blueprint.id,
      blueprintData.blueprint.personalizedPhases.length
    );
  }, [blueprintData, completedPhases]);

  // Total topics statistics
  const topicStats = useMemo(() => {
    if (!blueprintData) return { completed: 0, total: 0 };
    let total = 0;
    let completed = 0;

    blueprintData.blueprint.personalizedPhases.forEach((phase) => {
      total += phase.topics.length;
      phase.topics.forEach((topic) => {
        const key = `${phase.id}::${topic}`;
        if (topicProgressMap[key]?.completed) {
          completed++;
        }
      });
    });

    return { completed, total };
  }, [blueprintData, topicProgressMap]);

  // Find currently learning active phase
  const currentActivePhase = useMemo(() => {
    if (!blueprintData) return null;
    return (
      blueprintData.blueprint.personalizedPhases.find((p) => !completedPhases.includes(p.id)) ||
      blueprintData.blueprint.personalizedPhases[0]
    );
  }, [blueprintData, completedPhases]);

  const currentActivePhaseIndex = useMemo(() => {
    if (!blueprintData || !currentActivePhase) return 0;
    return blueprintData.blueprint.personalizedPhases.findIndex((p) => p.id === currentActivePhase.id);
  }, [blueprintData, currentActivePhase]);

  // Filter careers for Step 2
  const filteredCareers = useMemo(() => {
    return Object.values(CAREER_ROADMAPS).filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skillsRequired.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handle Onboarding Next -> Step 2
  const handleOnboardingSubmit = () => {
    if (!studentName.trim()) {
      Alert.alert('Student Name Required', 'Please enter your name to personalize your roadmap.');
      return;
    }
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setStep(2);
  };

  // Handle Career Selection from Step 2 -> Step 3
  const handleSelectCareer = async (careerIdChosen: string) => {
    const profileData = {
      studentName,
      branch,
      academicYear,
      dailyLearningTime: dailyTime,
      careerGoal,
      targetCompany: targetCompany || 'Top Tech Companies',
    };

    const result = await roadmapService.saveCareerSelection(profileData, careerIdChosen, user?.id);
    if (!result.success) {
      Alert.alert('Career Switch Locked', result.message || 'You can switch careers only after 3 days.');
      return;
    }

    setSelectedCareerId(careerIdChosen);
    setStep(3);
    await loadBlueprint(careerIdChosen, {
      name: studentName,
      branch,
      year: academicYear,
      studyHoursPerDay: dailyTime,
      careerGoal,
      targetCompany,
    });
  };

  // Handle "Choose Another Career" button press
  const handleChooseAnotherCareerPress = () => {
    const eligibility = roadmapService.canSwitchCareer(user?.id);
    if (!eligibility.allowed) {
      Alert.alert(
        'Career Switch Locked 🔒',
        `To build deep consistency and mastery, career changes are limited to once every 3 days.\n\nYou can switch to another career in ${eligibility.remainingText}.\n\n(Available at: ${eligibility.nextAvailableAt ? new Date(eligibility.nextAvailableAt).toLocaleString() : 'in 3 days'})`,
        [{ text: 'Got it', style: 'default' }]
      );
      return;
    }
    setStep(2);
  };

  // Smooth Scroll to Active / In-Progress Stage
  const handleContinueLearningPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    if (currentActivePhase) {
      setExpandedPhases((prev) => ({ ...prev, [currentActivePhase.id]: true }));
      const targetY = phaseLayoutOffsets.current[currentActivePhase.id] || 380;
      scrollRef.current?.scrollTo({ y: Math.max(0, targetY - 20), animated: true });
    }
  };

  // Handle Scroll to Toggle "Back to Current Stage" Floating Pill
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    if (currentActivePhase) {
      const activeY = phaseLayoutOffsets.current[currentActivePhase.id] || 450;
      if (Math.abs(scrollY - activeY) > 280) {
        setShowScrollToCurrentBtn(true);
      } else {
        setShowScrollToCurrentBtn(false);
      }
    }
  };

  // Handle Interactive Topic Completion Toggle
  const handleToggleTopic = async (phaseId: string, topicName: string, isLocked = false) => {
    if (!blueprintData) return;
    if (isLocked) {
      Alert.alert('Stage Locked ⏳', 'Complete previous stages and satisfy the daily unlock cycle before checking topics here.');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const topicKey = `${phaseId}::${topicName}`;
    const wasCompleted = !!topicProgressMap[topicKey]?.completed;

    const updated = roadmapService.toggleTopic(blueprintData.blueprint.id, phaseId, topicName, user?.id, isLocked);
    setTopicProgressMap({ ...updated });

    const isNowCompleted = !!updated[topicKey]?.completed;

    // When newly completed, award daily task coins (+40 Tokens) and mark daily challenge complete!
    if (!wasCompleted && isNowCompleted && user?.id) {
      const todayDate = getCalendarDateString();
      const refId = `roadmap_daily_${todayDate}`;

      try {
        const globalKey = `@feedx_daily_challenges_${todayDate}`;
        const userKey = `@feedx_daily_challenges_${user.id}_${todayDate}`;
        const savedGlobal = storage.getString(globalKey);
        const parsed = savedGlobal ? JSON.parse(savedGlobal) : {};
        parsed.roadmap_completed = true;
        parsed.roadmap_task = true;
        parsed.home_daily_roadmap = true;
        parsed.phase_completed = true;
        storage.set(globalKey, JSON.stringify(parsed));
        storage.set(userKey, JSON.stringify(parsed));
        AsyncStorage.setItem(globalKey, JSON.stringify(parsed)).catch(() => {});
        AsyncStorage.setItem(userKey, JSON.stringify(parsed)).catch(() => {});
      } catch (_) {}

      if (triggerReward) {
        triggerReward({
          userId: user.id,
          activityType: 'roadmap_task',
          points: 40,
          referenceId: refId,
          activityName: `Roadmap Module: ${topicName}`,
        })
          .then(() => refreshGamification && refreshGamification())
          .catch((err) => console.warn('Roadmap module reward error:', err));
      } else if (triggerActivity) {
        triggerActivity('roadmap_task', 40, 40, refId).catch(() => {});
      }
    }
  };

  // Handle Task Completion Toggle
  const handleToggleTask = async (phaseId: string, taskId: string, isLocked = false) => {
    if (!blueprintData) return;
    if (isLocked) {
      Alert.alert('Stage Locked ⏳', 'Complete previous stages and wait for the daily 12:00 AM unlock cycle before doing tasks here.');
      return;
    }
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}

    const wasTaskDone = !!taskProgressMap[taskId]?.completed;
    const updatedTasks = roadmapService.toggleTask(blueprintData.blueprint.id, phaseId, taskId, user?.id, isLocked);
    setTaskProgressMap({ ...updatedTasks });

    const isNowTaskDone = !!updatedTasks[taskId]?.completed;

    if (!wasTaskDone && isNowTaskDone && user?.id) {
      const todayDate = getCalendarDateString();
      const refId = `roadmap_daily_${todayDate}`;

      try {
        const globalKey = `@feedx_daily_challenges_${todayDate}`;
        const userKey = `@feedx_daily_challenges_${user.id}_${todayDate}`;
        const savedGlobal = storage.getString(globalKey);
        const parsed = savedGlobal ? JSON.parse(savedGlobal) : {};
        parsed.roadmap_completed = true;
        parsed.roadmap_task = true;
        parsed.home_daily_roadmap = true;
        parsed.phase_completed = true;
        storage.set(globalKey, JSON.stringify(parsed));
        storage.set(userKey, JSON.stringify(parsed));
        AsyncStorage.setItem(globalKey, JSON.stringify(parsed)).catch(() => {});
        AsyncStorage.setItem(userKey, JSON.stringify(parsed)).catch(() => {});
      } catch (_) {}

      const taskItem = blueprintData.blueprint.personalizedPhases
        .find((p) => p.id === phaseId)
        ?.tasks.find((t: any) => t.id === taskId);

      if (triggerReward) {
        triggerReward({
          userId: user.id,
          activityType: 'roadmap_task',
          points: 40,
          referenceId: refId,
          activityName: taskItem?.title ? `Roadmap Task: ${taskItem.title}` : 'Roadmap Milestone Completed',
        })
          .then(() => refreshGamification && refreshGamification())
          .catch((err) => console.warn('Roadmap task reward error:', err));
      } else if (triggerActivity) {
        triggerActivity('roadmap_task', 40, 40, refId).catch(() => {});
      }
    }
  };

  // Open Quiz Modal for Phase
  const handleOpenQuiz = (phase: any, isLocked = false) => {
    if (isLocked) {
      Alert.alert('Quiz Locked 🔒', 'This stage is locked. Complete prior milestones and wait for the daily unlock cycle.');
      return;
    }
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setActiveQuizModalPhase(phase);
    setQuizSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResultScore(0);
    setQuizPassedStatus(false);
  };

  // Submit Phase Quiz
  const handleSubmitQuiz = () => {
    if (!activeQuizModalPhase || !blueprintData) return;
    const questions: PhaseQuizQuestion[] = activeQuizModalPhase.quiz.questions;
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (quizSelectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= activeQuizModalPhase.quiz.passingScorePct;

    setQuizResultScore(scorePct);
    setQuizPassedStatus(passed);
    setQuizSubmitted(true);

    try {
      if (passed) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch {}

    roadmapService.submitPhaseQuiz(blueprintData.blueprint.id, activeQuizModalPhase.id, scorePct, passed, user?.id);
    setQuizScoresMap(roadmapService.getQuizScoresMap(blueprintData.blueprint.id));
  };

  // Complete Phase Action with Lightweight Celebration Trigger
  const handleCompletePhase = async (phaseId: string, phaseIndex: number) => {
    if (!blueprintData) return;
    const totalPhases = blueprintData.blueprint.personalizedPhases.length;
    const nextPhase = blueprintData.blueprint.personalizedPhases[phaseIndex + 1];

    const result = await roadmapService.completePhase(
      blueprintData.blueprint.id,
      phaseId,
      phaseIndex,
      totalPhases,
      nextPhase?.id,
      user?.id
    );

    if (!result.success) {
      Alert.alert('Stage Progression Incomplete', result.reason || 'Please complete all requirements first.');
      return;
    }

    if (result.alreadyCompleted) {
      Alert.alert('Stage Already Verified', 'You have already verified and claimed rewards for this stage.');
      return;
    }

    setCompletedPhases(result.completedPhases);
    refreshLocalState(blueprintData.blueprint.id);

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    // Award rewards
    if (user?.id) {
      try {
        const isMilestone = result.completedPhases.length === totalPhases;
        const rewardPts = isMilestone ? 75 : 40;
        const todayDate = getCalendarDateString();
        const uniquePhaseRefId = `roadmap_${blueprintData.blueprint.id}_phase_${phaseId}_${todayDate}`;

        try {
          const globalKey = `@feedx_daily_challenges_${todayDate}`;
          const userKey = `@feedx_daily_challenges_${user.id}_${todayDate}`;
          const savedGlobal = storage.getString(globalKey);
          const parsed = savedGlobal ? JSON.parse(savedGlobal) : {};
          parsed.roadmap_completed = true;
          parsed.roadmap_task = true;
          parsed.home_daily_roadmap = true;
          parsed.phase_completed = true;
          storage.set(globalKey, JSON.stringify(parsed));
          storage.set(userKey, JSON.stringify(parsed));
          AsyncStorage.setItem(globalKey, JSON.stringify(parsed)).catch(() => {});
          AsyncStorage.setItem(userKey, JSON.stringify(parsed)).catch(() => {});
        } catch (_) {}

        if (triggerReward) {
          await triggerReward({
            userId: user.id,
            activityType: isMilestone ? 'roadmap_milestone' : 'roadmap_task',
            points: rewardPts,
            referenceId: uniquePhaseRefId,
            activityName: isMilestone ? 'Roadmap Track Completed (+75 FX)' : `Roadmap Phase ${phaseIndex + 1} Verified (+40 FX)`,
            isMilestone,
          });
        } else if (triggerActivity) {
          await triggerActivity('roadmap_task', rewardPts, rewardPts, uniquePhaseRefId, true);
        }
        await refreshGamification();
      } catch (err) {
        console.warn('Point award error:', err);
      }
    }

    // Trigger Tasteful Celebration Modal (Ensured once per milestone)
    const celebrationKey = `stage_${phaseId}`;
    if (!roadmapService.hasMilestoneBeenCelebrated(blueprintData.blueprint.id, celebrationKey)) {
      roadmapService.markMilestoneCelebrated(blueprintData.blueprint.id, celebrationKey);
      const isMilestone = result.completedPhases.length === totalPhases;
      setCelebrationDetails({
        title: `${blueprintData.blueprint.personalizedPhases[phaseIndex].title} Verified!`,
        type: isMilestone ? 'roadmap_completed' : 'stage_completed',
        stageNum: phaseIndex + 1,
        score: result.newScore,
        pointsAwarded: isMilestone ? 75 : 35,
      });
      setCelebrationModalVisible(true);
    }
  };

  const toggleExpand = (phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
    if (blueprintData) {
      roadmapService.ensurePhaseStarted(blueprintData.blueprint.id, phaseId);
    }
  };

  const handleToggleBookmark = () => {
    if (!blueprintData) return;
    const isSaved = roadmapService.toggleBookmark(blueprintData.blueprint.id);
    setBookmarked(isSaved);
    Alert.alert(isSaved ? 'Bookmarked' : 'Removed', isSaved ? 'Blueprint saved to bookmarks!' : 'Blueprint removed.');
  };

  const handleShare = async () => {
    if (!blueprintData) return;
    try {
      await Share.share({
        message: `My FEEDX Learning Journey for ${blueprintData.blueprint.title} (${verifiedScore}% Complete). Exploring practical engineering skills on FEEDX!`,
      });
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && (
        <LinearGradient
          colors={['#080E1C', '#0B1528', '#050A14']}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Top App Bar Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
          onPress={() => {
            if (step === 2) setStep(1);
            else safeBack('/(tabs)');
          }}
        >
          <Feather name="arrow-left" size={19} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>AI Career Roadmap</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            {step === 1 ? 'Step 1: Student Profile' : step === 2 ? 'Step 2: Choose Career' : 'Interactive Learning Journey'}
          </Text>
        </View>
      </View>

      {/* ========================================================================= */}
      {/* STEP 1: STUDENT ONBOARDING QUESTIONNAIRE */}
      {/* ========================================================================= */}
      {step === 1 && (
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Personalize Your Roadmap</Text>
          <Text style={[styles.stepSub, { color: colors.textMuted }]}>
            We build a tailored curriculum based on your academic year, available daily study time, and post-diploma goals.
          </Text>

          <GlassCard style={styles.formCard}>
            {/* 1. Student Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>1. Student Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
                value={studentName}
                onChangeText={setStudentName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.inputPlaceholder}
              />
            </View>

            {/* 2. Branch */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>2. Diploma / Engineering Branch</Text>
              <View style={styles.chipGrid}>
                {BRANCH_OPTIONS.map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={[
                      styles.choiceChip,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      branch === b && styles.choiceChipSelected,
                    ]}
                    onPress={() => setBranch(b)}
                  >
                    <Text style={[styles.choiceChipText, { color: colors.textSecondary }, branch === b && styles.choiceChipTextSelected]}>
                      {b}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 3. Available Learning Time Per Day */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>3. Available Learning Time Each Day</Text>
              <View style={{ gap: 8 }}>
                {STUDY_TIME_OPTIONS.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.radioCard,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      dailyTime === t.id && styles.radioCardSelected,
                    ]}
                    onPress={() => setDailyTime(t.id)}
                  >
                    <View style={styles.radioRow}>
                      <Ionicons
                        name={dailyTime === t.id ? 'radio-button-on' : 'radio-button-off'}
                        size={18}
                        color={dailyTime === t.id ? '#3B82F6' : colors.textMuted}
                      />
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={[styles.radioLabel, { color: colors.textPrimary }, dailyTime === t.id && styles.radioLabelSelected]}>
                          {t.label}
                        </Text>
                        <Text style={[styles.radioDesc, { color: colors.textMuted }]}>{t.desc}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 4. Current Year */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>4. Current Academic Year</Text>
              <View style={styles.segmentedRow}>
                {YEAR_OPTIONS.map((yr) => (
                  <TouchableOpacity
                    key={yr}
                    style={[
                      styles.segmentedBtn,
                      { backgroundColor: colors.inputBg },
                      academicYear === yr && styles.segmentedBtnSelected,
                    ]}
                    onPress={() => setAcademicYear(yr)}
                  >
                    <Text style={[styles.segmentedText, { color: colors.textSecondary }, academicYear === yr && styles.segmentedTextSelected]}>
                      {yr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 5. Goal after Diploma */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>5. What do you want to do after Diploma?</Text>
              <View style={{ gap: 8 }}>
                {CAREER_GOAL_OPTIONS.map((g) => (
                  <TouchableOpacity
                    key={g.id}
                    style={[
                      styles.radioCard,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      careerGoal === g.id && styles.radioCardSelected,
                    ]}
                    onPress={() => setCareerGoal(g.id)}
                  >
                    <View style={styles.radioRow}>
                      <Feather
                        name={g.icon as any}
                        size={16}
                        color={careerGoal === g.id ? '#3B82F6' : colors.textMuted}
                      />
                      <Text style={[styles.radioLabel, { color: colors.textPrimary, marginLeft: 8 }, careerGoal === g.id && styles.radioLabelSelected]}>
                        {g.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleOnboardingSubmit} activeOpacity={0.85}>
              <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.submitGradient}>
                <Text style={styles.submitBtnText}>Next: Select Career Path →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: CAREER SELECTION */}
      {/* ========================================================================= */}
      {step === 2 && (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={styles.filterSection}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Choose Your Career Track</Text>
            <Text style={[styles.stepSub, { color: colors.textMuted }]}>
              Select your goal to unlock step-by-step milestones, interactive topic checklists, and interview blueprints.
            </Text>

            {/* Search Input */}
            <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="search" size={17} color={colors.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search career roles or skills..."
                placeholderTextColor={colors.inputPlaceholder}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Category horizontal scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {CAREER_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: colors.inputBg, borderColor: colors.border },
                    activeCategory === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, { color: colors.textSecondary }, activeCategory === cat && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Careers List */}
          <View style={styles.careersGrid}>
            {filteredCareers.map((c) => (
              <GlassCard key={c.id} style={styles.careerCard}>
                <TouchableOpacity onPress={() => handleSelectCareer(c.id)} activeOpacity={0.8}>
                  <View style={styles.careerCardHeader}>
                    <View style={styles.careerIconCircle}>
                      <Feather name={(c.icon as any) || 'compass'} size={20} color="#3B82F6" />
                    </View>
                    <View
                      style={[
                        styles.diffBadge,
                        {
                          backgroundColor:
                            c.difficulty === 'Beginner'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : c.difficulty === 'Intermediate'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.diffText,
                          {
                            color:
                              c.difficulty === 'Beginner'
                                ? '#10B981'
                                : c.difficulty === 'Intermediate'
                                ? '#3B82F6'
                                : '#F59E0B',
                          },
                        ]}
                      >
                        {c.difficulty}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.careerTitle, { color: colors.textPrimary }]}>{c.title}</Text>
                  <Text style={styles.careerCategory}>{c.category}</Text>
                  <Text style={[styles.careerDesc, { color: colors.textMuted }]} numberOfLines={2}>
                    {c.overview}
                  </Text>

                  <View style={styles.cardFooterRow}>
                    <Text style={styles.timelineTag}>⏱ {c.estimatedTimeline}</Text>
                    <Text style={styles.selectTrackCTA}>Start Blueprint →</Text>
                  </View>
                </TouchableOpacity>
              </GlassCard>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: INTERACTIVE CONNECTED LEARNING JOURNEY DASHBOARD */}
      {/* ========================================================================= */}
      {step === 3 && (
        <View style={{ flex: 1 }}>
          {loading || !blueprintData ? (
            <View style={{ padding: 20 }}>
              <SkeletonLoader width="100%" height={160} borderRadius={16} />
              <View style={{ height: 16 }} />
              <SkeletonLoader width="100%" height={110} borderRadius={16} />
              <View style={{ height: 16 }} />
              <SkeletonLoader width="100%" height={240} borderRadius={16} />
            </View>
          ) : (
            <ScrollView
              ref={scrollRef}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.blueprintScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Top Controls: Change Career Path button & Bookmark/Share */}
              <View style={styles.topControlRow}>
                <TouchableOpacity
                  style={[styles.switchCareerBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  onPress={handleChooseAnotherCareerPress}
                  activeOpacity={0.8}
                >
                  <Feather name="refresh-cw" size={13} color={colors.textPrimary} />
                  <Text style={[styles.switchCareerText, { color: colors.textPrimary }]}>Switch Path</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={handleToggleBookmark} style={styles.bookmarkBtn}>
                    <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={18} color="#60A5FA" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShare} style={styles.bookmarkBtn}>
                    <Feather name="share-2" size={16} color="#60A5FA" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ------------------------------------------------------------- */}
              {/* 1. ANIMATED HERO SECTION */}
              {/* ------------------------------------------------------------- */}
              <Animated.View entering={FadeInDown.duration(400).springify()}>
                <GlassCard style={styles.heroCard}>
                  {/* Top Badge */}
                  <View style={styles.heroBadgePill}>
                    <Feather name="compass" size={12} color="#38BDF8" />
                    <Text style={styles.heroBadgeText}>YOUR LEARNING JOURNEY</Text>
                  </View>

                  {/* Main Headings */}
                  <Text style={[styles.heroHeading, { color: colors.textPrimary }]}>
                    Your Learning Journey
                  </Text>
                  <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>
                    Small steps. Real skills. Bigger opportunities.
                  </Text>

                  {/* Career Track Info Card */}
                  <View
                    style={[
                      styles.heroTrackBox,
                      {
                        backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(37, 99, 235, 0.06)',
                        borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(37, 99, 235, 0.2)',
                      },
                    ]}
                  >
                    <View style={styles.heroTrackLeft}>
                      <View style={styles.heroTrackIcon}>
                        <MaterialCommunityIcons name="school" size={22} color="#38BDF8" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.heroTrackTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                          {blueprintData.blueprint.title}
                        </Text>
                        <Text style={styles.heroTrackCategory}>
                          {blueprintData.blueprint.category} • {blueprintData.blueprint.difficulty}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.heroReadinessBadge}>
                      <AnimatedNumber value={verifiedScore} suffix="%" style={styles.heroReadinessScore} />
                      <Text style={styles.heroReadinessLabel}>Mastery</Text>
                    </View>
                  </View>

                  {/* Progress Shimmer Bar & Stats */}
                  <View style={styles.heroProgressSection}>
                    <View style={styles.heroProgressMetaRow}>
                      <Text style={[styles.heroProgressMetaText, { color: colors.textMuted }]}>
                        {topicStats.completed} of {topicStats.total} Topics Mastered
                      </Text>
                      <Text style={[styles.heroProgressMetaHighlight, { color: '#10B981' }]}>
                        {completedPhases.length} / {blueprintData.blueprint.personalizedPhases.length} Stages Done
                      </Text>
                    </View>

                    <HeroProgressBar progress={verifiedScore} />
                  </View>

                  {/* Primary CTA: Continue Learning Button */}
                  <TouchableOpacity
                    style={styles.heroContinueBtn}
                    onPress={handleContinueLearningPress}
                    activeOpacity={0.88}
                  >
                    <LinearGradient
                      colors={['#2563EB', '#1D4ED8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.heroContinueGradient}
                    >
                      <Feather name="play-circle" size={17} color="#FFF" />
                      <Text style={styles.heroContinueBtnText}>
                        {currentActivePhase
                          ? `Continue Learning: Stage 0${currentActivePhaseIndex + 1} →`
                          : 'Review Completed Blueprint →'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </GlassCard>
              </Animated.View>

              {/* ------------------------------------------------------------- */}
              {/* 2. INTERACTIVE PROGRESS DASHBOARD (STATISTICS) */}
              {/* ------------------------------------------------------------- */}
              <Animated.View entering={FadeInDown.duration(400).delay(80).springify()}>
                <View style={styles.statsGrid}>
                  {/* Stat 1: Overall Mastery */}
                  <GlassCard style={styles.statBox}>
                    <View style={[styles.statIconWrap, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                      <Feather name="pie-chart" size={16} color="#38BDF8" />
                    </View>
                    <AnimatedNumber value={verifiedScore} suffix="%" style={styles.statNumber} />
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Overall Mastery</Text>
                  </GlassCard>

                  {/* Stat 2: Stages Finished */}
                  <GlassCard style={styles.statBox}>
                    <View style={[styles.statIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                      <Feather name="check-circle" size={16} color="#10B981" />
                    </View>
                    <Text style={[styles.statNumber, { color: '#10B981' }]}>
                      {completedPhases.length} / {blueprintData.blueprint.personalizedPhases.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Stages Done</Text>
                  </GlassCard>

                  {/* Stat 3: Topics Mastered */}
                  <GlassCard style={styles.statBox}>
                    <View style={[styles.statIconWrap, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                      <Feather name="book-open" size={16} color="#818CF8" />
                    </View>
                    <Text style={[styles.statNumber, { color: '#818CF8' }]}>
                      {topicStats.completed} / {topicStats.total}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Topics Done</Text>
                  </GlassCard>

                  {/* Stat 4: Learning Streak */}
                  <GlassCard style={styles.statBox}>
                    <View style={[styles.statIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                      <MaterialCommunityIcons name="fire" size={18} color="#F59E0B" />
                    </View>
                    <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
                      {streak?.current_streak || 1}d
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Learning Streak</Text>
                  </GlassCard>
                </View>
              </Animated.View>

              {/* 24-Hour Daily Unlock Cycle & Anti-Farming Policy Banner */}
              <View
                style={[
                  styles.cyclePolicyBanner,
                  {
                    backgroundColor: isDark ? 'rgba(30, 58, 138, 0.22)' : 'rgba(239, 246, 255, 0.95)',
                    borderColor: isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(59, 130, 246, 0.25)',
                  },
                ]}
              >
                <View style={styles.cyclePolicyHeader}>
                  <View style={styles.cyclePolicyIconCircle}>
                    <Feather name="shield" size={16} color="#3B82F6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cyclePolicyTitle, { color: colors.textPrimary }]}>
                      24-Hour Daily Unlock Cycle (12:00 AM – 12:00 AM)
                    </Text>
                    <Text style={[styles.cyclePolicySub, { color: colors.textMuted }]}>
                      Anti-Farming Active • 1 Verified Stage Unlocked per 24-Hour Cycle
                    </Text>
                  </View>
                </View>
                <View style={styles.cyclePolicyRules}>
                  <View style={styles.cycleRuleRow}>
                    <Feather name="check-circle" size={13} color="#10B981" />
                    <Text style={[styles.cycleRuleText, { color: colors.textSecondary }]}>
                      <Text style={{ fontWeight: '700' }}>Fair Gamification:</Text> Stage progression and token rewards require completing all mandatory tasks + passing the phase quiz (≥70%).
                    </Text>
                  </View>
                  <View style={styles.cycleRuleRow}>
                    <Feather name="clock" size={13} color="#F59E0B" />
                    <Text style={[styles.cycleRuleText, { color: colors.textSecondary }]}>
                      <Text style={{ fontWeight: '700' }}>Daily Pace:</Text> Next stage unlocks after 24 hours at 12:00 AM midnight. Selecting "All" or switching career tracks does not bypass unlock rules.
                    </Text>
                  </View>
                  <View style={styles.cycleRuleRow}>
                    <Feather name="lock" size={13} color="#3B82F6" />
                    <Text style={[styles.cycleRuleText, { color: colors.textSecondary }]}>
                      <Text style={{ fontWeight: '700' }}>Anti-Exploit:</Text> Rewards can only be claimed once per activity. Repeated access cannot farm tokens.
                    </Text>
                  </View>
                </View>
              </View>

              {/* ------------------------------------------------------------- */}
              {/* 3. INTERACTIVE CONNECTED ROADMAP PATH */}
              {/* ------------------------------------------------------------- */}
              <View style={styles.pathHeaderSection}>
                <View>
                  <Text style={[styles.pathSectionTitle, { color: colors.textPrimary }]}>
                    Interactive Learning Path
                  </Text>
                  <Text style={[styles.pathSectionSub, { color: colors.textMuted }]}>
                    Connected progression milestones with anti-abuse verified completion.
                  </Text>
                </View>
              </View>

              <View style={styles.connectedPathContainer}>
                {blueprintData.blueprint.personalizedPhases.map((phase, pIdx) => {
                  const isExp = !!expandedPhases[phase.id];
                  const phaseNum = pIdx + 1;
                  const totalPhases = blueprintData.blueprint.personalizedPhases.length;
                  const isFirst = pIdx === 0;
                  const isLast = pIdx === totalPhases - 1;

                  const status = roadmapService.getPhaseStatus(
                    blueprintData.blueprint.id,
                    phase.id,
                    pIdx,
                    totalPhases,
                    user?.id
                  );

                  const isComp = status.state === 'completed';
                  const isInProgress = status.state === 'in_progress' || status.state === 'eligible_for_completion';
                  const isPrevComp = pIdx === 0 || completedPhases.length >= pIdx;
                  const quizRecord = quizScoresMap[phase.id];

                  // Count completed topics for this specific phase
                  const completedTopicsInPhase = phase.topics.filter(
                    (t) => topicProgressMap[`${phase.id}::${t}`]?.completed
                  ).length;

                  return (
                    <View
                      key={phase.id}
                      onLayout={(e) => {
                        phaseLayoutOffsets.current[phase.id] = e.nativeEvent.layout.y;
                      }}
                      style={styles.stagePathRow}
                    >
                      {/* Left Column: Continuous Connected Railway Line */}
                      <View style={styles.railColumn}>
                        {/* Top Rail Segment */}
                        <View
                          style={[
                            styles.railSegmentTop,
                            {
                              backgroundColor: isFirst
                                ? 'transparent'
                                : isPrevComp
                                ? '#10B981'
                                : isDark
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.1)',
                            },
                          ]}
                        />

                        {/* Milestone Node */}
                        <MilestoneNode
                          state={status.state}
                          phaseNum={phaseNum}
                          isDark={isDark}
                          onPress={() => toggleExpand(phase.id)}
                        />

                        {/* Bottom Rail Segment */}
                        <View
                          style={[
                            styles.railSegmentBottom,
                            {
                              backgroundColor: isLast
                                ? 'transparent'
                                : isComp
                                ? '#10B981'
                                : isInProgress
                                ? '#38BDF8'
                                : isDark
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.1)',
                            },
                          ]}
                        />
                      </View>

                      {/* Right Column: Stage Card */}
                      <View style={styles.stageCardColumn}>
                        <GlassCard
                          style={[
                            styles.stageCard,
                            isInProgress && {
                              borderColor: isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(37, 99, 235, 0.4)',
                            },
                            isComp && {
                              borderColor: 'rgba(16, 185, 129, 0.35)',
                            },
                          ]}
                        >
                          {/* Pressable Stage Card Header */}
                          <TouchableOpacity
                            activeOpacity={0.75}
                            delayPressIn={0}
                            onPress={() => toggleExpand(phase.id)}
                            style={styles.stageHeaderTouchable}
                          >
                            <View style={styles.stageHeaderMetaRow}>
                              <View style={styles.stageNumberPill}>
                                <Text style={styles.stageNumberText}>STAGE 0{phaseNum}</Text>
                              </View>
                              <Text style={styles.stageTimeText}>⏱ {phase.estimatedTime}</Text>

                              {/* Status Badge */}
                              {isComp ? (
                                <View style={styles.statusPillComp}>
                                  <Feather name="check-circle" size={11} color="#10B981" />
                                  <Text style={styles.statusPillCompText}>Completed</Text>
                                </View>
                              ) : status.state === 'eligible_for_completion' ? (
                                <View style={styles.statusPillEligible}>
                                  <Feather name="award" size={11} color="#10B981" />
                                  <Text style={styles.statusPillEligibleText}>Ready to Verify</Text>
                                </View>
                              ) : isInProgress ? (
                                <View style={styles.statusPillActive}>
                                  <View style={styles.statusActiveDot} />
                                  <Text style={styles.statusPillActiveText}>Currently Learning</Text>
                                </View>
                              ) : (
                                <View style={styles.statusPillLocked}>
                                  <Feather name="lock" size={10} color="#94A3B8" />
                                  <Text style={styles.statusPillLockedText}>Locked</Text>
                                </View>
                              )}
                            </View>

                            <Text style={[styles.stageTitle, { color: colors.textPrimary }]}>
                              {phase.title}
                            </Text>

                            <Text style={[styles.stageDesc, { color: colors.textMuted }]} numberOfLines={isExp ? undefined : 2}>
                              {phase.description}
                            </Text>

                            {/* Micro Progress Track in Collapsed / Header */}
                            <View style={styles.stageMicroProgressRow}>
                              <View style={styles.microBarTrack}>
                                <View
                                  style={[
                                    styles.microBarFill,
                                    {
                                      width: `${Math.round((completedTopicsInPhase / phase.topics.length) * 100)}%`,
                                      backgroundColor: isComp ? '#10B981' : '#38BDF8',
                                    },
                                  ]}
                                />
                              </View>
                              <Text style={[styles.microProgressText, { color: colors.textMuted }]}>
                                {completedTopicsInPhase}/{phase.topics.length} Topics
                              </Text>

                              <View style={styles.chevronWrap}>
                                <Feather
                                  name={isExp ? 'chevron-up' : 'chevron-down'}
                                  size={18}
                                  color={colors.textMuted}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>

                          {/* --------------------------------------------------- */}
                          {/* EXPANDED CONTENT: ANIMATED TOPIC LIST & TASKS */}
                          {/* --------------------------------------------------- */}
                          {isExp && (
                            <View style={[styles.stageBody, { borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border }]}>
                              {/* 1. Interactive Topic Checklist */}
                              <View style={styles.topicsSection}>
                                <View style={styles.sectionTitleRow}>
                                  <Feather name="list" size={14} color="#38BDF8" />
                                  <Text style={[styles.topicsSectionHeading, { color: colors.textPrimary }]}>
                                    Core Topics & Modules ({completedTopicsInPhase}/{phase.topics.length})
                                  </Text>
                                </View>

                                {phase.topics.map((topic, tIdx) => {
                                  const topicKey = `${phase.id}::${topic}`;
                                  const isTopicDone = !!topicProgressMap[topicKey]?.completed;

                                  return (
                                    <TouchableOpacity
                                      key={topic}
                                      activeOpacity={0.65}
                                      delayPressIn={0}
                                      disabled={status.state === 'locked'}
                                      onPress={() => handleToggleTopic(phase.id, topic, status.state === 'locked')}
                                      style={[
                                        styles.interactiveTopicRow,
                                        {
                                          backgroundColor: isTopicDone
                                            ? isDark
                                              ? 'rgba(16, 185, 129, 0.08)'
                                              : 'rgba(16, 185, 129, 0.06)'
                                            : isDark
                                            ? 'rgba(255, 255, 255, 0.03)'
                                            : 'rgba(0, 0, 0, 0.02)',
                                          borderColor: isTopicDone ? 'rgba(16, 185, 129, 0.3)' : colors.border,
                                        },
                                      ]}
                                    >
                                      <Ionicons
                                        name={isTopicDone ? 'checkbox' : 'square-outline'}
                                        size={20}
                                        color={isTopicDone ? '#10B981' : colors.textMuted}
                                      />
                                      <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Text
                                          style={[
                                            styles.topicRowTitle,
                                            { color: colors.textPrimary },
                                            isTopicDone && styles.topicRowTitleDone,
                                          ]}
                                        >
                                          {topic}
                                        </Text>
                                        <Text style={[styles.topicRowMeta, { color: colors.textMuted }]}>
                                          Module 0{tIdx + 1} • Est. 45–60 mins study
                                        </Text>
                                      </View>

                                      <View
                                        style={[
                                          styles.topicDoneBadge,
                                          {
                                            backgroundColor: isTopicDone
                                              ? 'rgba(16, 185, 129, 0.15)'
                                              : isDark
                                              ? 'rgba(255,255,255,0.06)'
                                              : 'rgba(0,0,0,0.04)',
                                          },
                                        ]}
                                      >
                                        <Text
                                          style={[
                                            styles.topicDoneBadgeText,
                                            { color: isTopicDone ? '#10B981' : colors.textMuted },
                                          ]}
                                        >
                                          {isTopicDone ? 'Done ✓' : 'Mark Done'}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>

                              {/* 2. Mandatory Hands-on Action Tasks */}
                              <View style={[styles.tasksContainer, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : colors.inputBg, borderColor: colors.border }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                  <Text style={[styles.tasksHeading, { color: colors.textPrimary }]}>
                                    📋 Mandatory Practice Tasks ({status.tasksCompleted}/{status.totalTasks})
                                  </Text>
                                  {status.isAllMandatoryTasksDone && (
                                    <Text style={{ fontSize: rf(11), color: '#10B981', fontWeight: '800' }}>✓ Tasks Done</Text>
                                  )}
                                </View>

                                {phase.tasks.map((task: PhaseTaskItem) => {
                                  const isTaskDone = !!taskProgressMap[task.id]?.completed;
                                  return (
                                    <TouchableOpacity
                                      key={task.id}
                                      activeOpacity={0.65}
                                      delayPressIn={0}
                                      disabled={status.state === 'locked'}
                                      style={[styles.taskItemRow, { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : colors.border }]}
                                      onPress={() => handleToggleTask(phase.id, task.id, status.state === 'locked')}
                                    >
                                      <Ionicons
                                        name={isTaskDone ? 'checkbox' : 'square-outline'}
                                        size={19}
                                        color={isTaskDone ? '#10B981' : colors.textMuted}
                                      />
                                      <View style={{ flex: 1, marginLeft: 8 }}>
                                        <Text
                                          style={[
                                            styles.taskTitle,
                                            { color: colors.textPrimary },
                                            isTaskDone && styles.taskTitleDone,
                                          ]}
                                        >
                                          {task.title} {task.mandatory && <Text style={{ color: '#EF4444' }}>*</Text>}
                                        </Text>
                                        <Text style={[styles.taskDesc, { color: colors.textMuted }]}>
                                          {task.description} (⏱ {task.estimatedMinutes}m)
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>

                              {/* 3. Phase Knowledge Check Quiz */}
                              <View
                                style={[
                                  styles.quizBanner,
                                  {
                                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.12)',
                                    borderColor: 'rgba(59, 130, 246, 0.35)',
                                  },
                                ]}
                              >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <View style={{ flex: 1 }}>
                                    <Text style={[styles.quizBannerTitle, { color: colors.textPrimary }]}>
                                      🧠 Stage Knowledge Check
                                    </Text>
                                    <Text style={[styles.quizBannerSub, { color: colors.textMuted }]}>
                                      {quizRecord?.passed
                                        ? `✅ Quiz Passed (Score: ${quizRecord.score}%)`
                                        : quizRecord
                                        ? `❌ Score: ${quizRecord.score}%. Minimum 70% required.`
                                        : '3 Questions. Passing threshold: 70%.'}
                                    </Text>
                                  </View>
                                  <TouchableOpacity
                                    activeOpacity={0.7}
                                    delayPressIn={0}
                                    disabled={status.state === 'locked'}
                                    style={[
                                      styles.quizActionBtn,
                                      {
                                        backgroundColor:
                                          status.state === 'locked'
                                            ? colors.inputBg
                                            : quizRecord?.passed
                                            ? 'rgba(16, 185, 129, 0.2)'
                                            : '#3B82F6',
                                      },
                                    ]}
                                    onPress={() => {
                                      if (status.state !== 'locked') handleOpenQuiz(phase);
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.quizActionBtnText,
                                        { color: status.state === 'locked' ? colors.textMuted : quizRecord?.passed ? '#10B981' : '#FFFFFF' },
                                      ]}
                                    >
                                      {quizRecord?.passed ? 'Review Quiz' : quizRecord ? 'Retake Quiz' : 'Take Quiz'}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>

                              {/* 4. Anti-Abuse Phase Completion Verification */}
                              {status.state !== 'completed' && (
                                <TouchableOpacity
                                  activeOpacity={0.75}
                                  delayPressIn={0}
                                  disabled={!status.canComplete}
                                  onPress={() => handleCompletePhase(phase.id, pIdx)}
                                  style={[
                                    styles.phaseActionBtn,
                                    {
                                      backgroundColor: status.canComplete ? '#10B981' : colors.inputBg,
                                      borderColor: status.canComplete ? '#10B981' : colors.border,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.phaseActionText,
                                      { color: status.canComplete ? '#FFFFFF' : colors.textMuted },
                                    ]}
                                  >
                                    {status.canComplete
                                      ? '✓ Verify & Complete Stage (+35 Pts)'
                                      : !status.isAllMandatoryTasksDone
                                      ? '⚠️ Complete all mandatory tasks first'
                                      : !status.quizPassed
                                      ? '⚠️ Pass the Stage Knowledge Quiz first'
                                      : `⏳ 24h Study Period (${status.remaining24hText})`}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </GlassCard>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* ------------------------------------------------------------- */}
              {/* 4. TARGET COMPANY PREPARATION SECTION */}
              {/* ------------------------------------------------------------- */}
              <GlassCard style={styles.sectionCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  🏢 Target Company Preparation ({targetCompany})
                </Text>
                <Text style={[styles.stepSub, { color: colors.textMuted, marginBottom: 8 }]}>
                  Supplementary interview prep layer tailored for placement and competitive evaluations.
                </Text>
                <View style={styles.quotaRow}>
                  <View style={[styles.quotaBox, { backgroundColor: colors.inputBg }]}>
                    <Text style={styles.quotaVal}>40+</Text>
                    <Text style={[styles.quotaLab, { color: colors.textMuted }]}>Coding Problems</Text>
                  </View>
                  <View style={[styles.quotaBox, { backgroundColor: colors.inputBg }]}>
                    <Text style={styles.quotaVal}>3</Text>
                    <Text style={[styles.quotaLab, { color: colors.textMuted }]}>Mock Interviews</Text>
                  </View>
                  <View style={[styles.quotaBox, { backgroundColor: colors.inputBg }]}>
                    <Text style={styles.quotaVal}>100%</Text>
                    <Text style={[styles.quotaLab, { color: colors.textMuted }]}>ATS Resume Check</Text>
                  </View>
                </View>
              </GlassCard>

              {/* ------------------------------------------------------------- */}
              {/* 5. PORTFOLIO PROJECTS */}
              {/* ------------------------------------------------------------- */}
              <Text style={[styles.sectionHeader, { color: colors.textPrimary, marginTop: 14, marginBottom: 8 }]}>
                Portfolio Showcase Projects
              </Text>
              {blueprintData.blueprint.projects.map((p) => (
                <GlassCard key={p.name} style={styles.subCard}>
                  <Text style={[styles.subCardTitle, { color: colors.textPrimary }]}>{p.name}</Text>
                  <Text style={[styles.subCardDesc, { color: colors.textSecondary }]}>{p.description}</Text>
                  <View style={styles.tagRow}>
                    {p.tech.map((t) => (
                      <View key={t} style={[styles.miniTag, { backgroundColor: colors.inputBg }]}>
                        <Text style={[styles.miniTagText, { color: colors.textSecondary }]}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </GlassCard>
              ))}
            </ScrollView>
          )}

          {/* Floating Action Button: Jump Back to Current Stage */}
          {showScrollToCurrentBtn && currentActivePhase && (
            <Animated.View entering={FadeInUp.duration(200)} style={styles.floatingJumpWrap}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleContinueLearningPress}
                style={styles.floatingJumpBtn}
              >
                <LinearGradient
                  colors={['#2563EB', '#0284C7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.floatingJumpGradient}
                >
                  <Feather name="arrow-up" size={15} color="#FFF" />
                  <Text style={styles.floatingJumpText}>Jump to Current Stage</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}

      {/* ========================================================================= */}
      {/* MILESTONE CELEBRATION MODAL */}
      {/* ========================================================================= */}
      <MilestoneCelebrationModal
        visible={celebrationModalVisible}
        milestoneTitle={celebrationDetails.title}
        milestoneType={celebrationDetails.type}
        pointsAwarded={celebrationDetails.pointsAwarded || 35}
        stageNumber={celebrationDetails.stageNum}
        overallScore={celebrationDetails.score}
        onClose={() => setCelebrationModalVisible(false)}
      />

      {/* ========================================================================= */}
      {/* PHASE KNOWLEDGE QUIZ MODAL */}
      {/* ========================================================================= */}
      <Modal
        visible={!!activeQuizModalPhase}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveQuizModalPhase(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {activeQuizModalPhase?.quiz.title || 'Stage Knowledge Check'}
              </Text>
              <TouchableOpacity onPress={() => setActiveQuizModalPhase(null)} style={styles.modalCloseBtn}>
                <Feather name="x" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={[styles.modalSub, { color: colors.textMuted }]}>
                Passing score required: {activeQuizModalPhase?.quiz.passingScorePct}% (Instant grading)
              </Text>

              {activeQuizModalPhase?.quiz.questions.map((q: PhaseQuizQuestion, qIdx: number) => {
                const selectedOpt = quizSelectedAnswers[qIdx];
                return (
                  <View key={q.id} style={[styles.questionBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                    <Text style={[styles.questionText, { color: colors.textPrimary }]}>
                      {qIdx + 1}. {q.question}
                    </Text>

                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      let optBg = colors.card;
                      let optBorder = colors.border;

                      if (quizSubmitted) {
                        if (isCorrect) {
                          optBg = 'rgba(16, 185, 129, 0.2)';
                          optBorder = '#10B981';
                        } else if (isSelected && !isCorrect) {
                          optBg = 'rgba(239, 68, 68, 0.2)';
                          optBorder = '#EF4444';
                        }
                      } else if (isSelected) {
                        optBg = 'rgba(59, 130, 246, 0.15)';
                        optBorder = '#3B82F6';
                      }

                      return (
                        <TouchableOpacity
                          key={opt}
                          disabled={quizSubmitted}
                          activeOpacity={0.8}
                          style={[styles.quizOptionRow, { backgroundColor: optBg, borderColor: optBorder }]}
                          onPress={() => {
                            setQuizSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                          }}
                        >
                          <Ionicons
                            name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                            size={16}
                            color={isSelected ? '#3B82F6' : colors.textMuted}
                          />
                          <Text style={[styles.quizOptionText, { color: colors.textPrimary }]}>{opt}</Text>
                        </TouchableOpacity>
                      );
                    })}

                    {quizSubmitted && (
                      <View style={styles.explanationBox}>
                        <Text style={styles.explanationText}>💡 {q.explanation}</Text>
                      </View>
                    )}
                  </View>
                );
              })}

              {quizSubmitted ? (
                <View
                  style={[
                    styles.quizResultBox,
                    { backgroundColor: quizPassedStatus ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
                  ]}
                >
                  <Text style={[styles.quizResultTitle, { color: quizPassedStatus ? '#10B981' : '#EF4444' }]}>
                    {quizPassedStatus ? '🎉 Quiz Passed!' : '❌ Quiz Not Passed'}
                  </Text>
                  <Text style={[styles.quizResultSub, { color: colors.textPrimary }]}>
                    Your Score: {quizResultScore}% (Threshold: {activeQuizModalPhase?.quiz.passingScorePct}%)
                  </Text>
                  <TouchableOpacity
                    style={[styles.modalDoneBtn, { backgroundColor: quizPassedStatus ? '#10B981' : '#3B82F6' }]}
                    onPress={() => {
                      if (quizPassedStatus) {
                        setActiveQuizModalPhase(null);
                      } else {
                        setQuizSubmitted(false);
                        setQuizSelectedAnswers({});
                      }
                    }}
                  >
                    <Text style={styles.modalDoneBtnText}>
                      {quizPassedStatus ? 'Done & Return to Roadmap' : 'Try Again'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.submitQuizBtn,
                    {
                      opacity:
                        Object.keys(quizSelectedAnswers).length ===
                        activeQuizModalPhase?.quiz.questions.length
                          ? 1
                          : 0.5,
                    },
                  ]}
                  disabled={
                    Object.keys(quizSelectedAnswers).length !==
                    activeQuizModalPhase?.quiz.questions.length
                  }
                  onPress={handleSubmitQuiz}
                >
                  <Text style={styles.submitQuizBtnText}>Submit Quiz & Check Score</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  headerSub: { fontSize: 12, marginTop: 2 },

  // Step 1 Form
  formContainer: { padding: 16, paddingBottom: 40 },
  stepTitle: { fontSize: 19, fontWeight: '900', marginBottom: 4 },
  stepSub: { fontSize: 13, lineHeight: 18, marginBottom: 16 },
  formCard: { padding: 16, borderRadius: 16, gap: 16 },
  formGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: '800' },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  choiceChipSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3B82F6',
  },
  choiceChipText: { fontSize: 12, fontWeight: '700' },
  choiceChipTextSelected: { color: '#3B82F6', fontWeight: '800' },
  radioCard: { padding: 12, borderRadius: 10, borderWidth: 1 },
  radioCardSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: '#3B82F6',
  },
  radioRow: { flexDirection: 'row', alignItems: 'center' },
  radioLabel: { fontSize: 13, fontWeight: '800' },
  radioLabelSelected: { color: '#3B82F6' },
  radioDesc: { fontSize: 11, marginTop: 2 },
  segmentedRow: { flexDirection: 'row', gap: 8 },
  segmentedBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentedBtnSelected: {
    backgroundColor: '#3B82F6',
  },
  segmentedText: { fontSize: 13, fontWeight: '800' },
  segmentedTextSelected: { color: '#FFF' },
  submitBtn: { marginTop: 12, borderRadius: 12, overflow: 'hidden' },
  submitGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },

  // Step 2 Careers Filter
  filterSection: { paddingHorizontal: 16, paddingTop: 14 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  categoryRow: { gap: 8, paddingBottom: 10 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryChipText: { fontSize: 12, fontWeight: '700' },
  categoryChipTextActive: { color: '#FFF', fontWeight: '800' },
  careersGrid: { padding: 16, gap: 12, paddingBottom: 40 },
  careerCard: { padding: 16, borderRadius: 16, gap: 6 },
  careerCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  careerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  diffText: { fontSize: 10, fontWeight: '800' },
  careerTitle: { fontSize: 16, fontWeight: '900', marginTop: 4 },
  careerCategory: { fontSize: 11, color: '#38BDF8', fontWeight: '800' },
  careerDesc: { fontSize: 12, lineHeight: 16 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  timelineTag: { fontSize: 11, color: '#94A3B8', fontWeight: '700' },
  selectTrackCTA: { fontSize: 12, color: '#3B82F6', fontWeight: '900' },

  // Step 3 Learning Journey
  blueprintScroll: { padding: 16, gap: 14, paddingBottom: 60 },
  topControlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  switchCareerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  switchCareerText: { fontSize: 12, fontWeight: '800' },
  bookmarkBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero Section
  heroCard: {
    padding: 18,
    borderRadius: 20,
    gap: 12,
  },
  heroBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  heroBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.6,
  },
  heroHeading: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: -4,
  },
  heroTrackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  heroTrackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  heroTrackIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTrackTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  heroTrackCategory: {
    fontSize: 11,
    color: '#60A5FA',
    fontWeight: '700',
    marginTop: 1,
  },
  heroReadinessBadge: {
    alignItems: 'center',
    marginLeft: 8,
  },
  heroReadinessScore: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
  },
  heroReadinessLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  heroProgressSection: {
    gap: 6,
    marginTop: 4,
  },
  heroProgressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroProgressMetaText: {
    fontSize: 11,
    fontWeight: '700',
  },
  heroProgressMetaHighlight: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBarFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerHighlight: {
    width: 60,
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  heroContinueBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  heroContinueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  heroContinueBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  // Stats Dashboard
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#38BDF8',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Connected Path Structure
  pathHeaderSection: {
    marginTop: 6,
    marginBottom: 2,
  },
  pathSectionTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  pathSectionSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  connectedPathContainer: {
    gap: 0,
  },
  stagePathRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  railColumn: {
    width: 44,
    alignItems: 'center',
  },
  railSegmentTop: {
    width: 3,
    height: 18,
    borderRadius: 1.5,
  },
  railSegmentBottom: {
    width: 3,
    flex: 1,
    borderRadius: 1.5,
  },
  nodeTouchableWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activePulseRing: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
  },
  nodeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeCircleComp: { backgroundColor: '#10B981' },
  nodeCircleEligible: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  nodeCircleInProgress: {
    backgroundColor: '#3B82F6',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  activeInnerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  nodeCircleLocked: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  nodeCircleActive: { backgroundColor: '#3B82F6' },
  nodeNum: { fontSize: 12, fontWeight: '900', color: '#FFF' },

  // Stage Card Column
  stageCardColumn: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 16,
  },
  stageCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  stageHeaderTouchable: {
    gap: 6,
  },
  stageHeaderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  stageNumberPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  stageNumberText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  stageTimeText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statusPillComp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  statusPillCompText: { fontSize: 9.5, color: '#10B981', fontWeight: '800' },
  statusPillEligible: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  statusPillEligibleText: { fontSize: 9.5, color: '#10B981', fontWeight: '900' },
  statusPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  statusActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  statusPillActiveText: { fontSize: 9.5, color: '#38BDF8', fontWeight: '800' },
  statusPillLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  statusPillLockedText: { fontSize: 9.5, color: '#94A3B8', fontWeight: '700' },

  stageTitle: {
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  stageDesc: {
    fontSize: 12,
    lineHeight: 16.5,
  },
  stageMicroProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  microBarTrack: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  microBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  microProgressText: {
    fontSize: 10,
    fontWeight: '700',
  },
  chevronWrap: {
    padding: 2,
  },

  // Expanded Stage Body
  stageBody: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 12,
  },
  topicsSection: {
    gap: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  topicsSectionHeading: {
    fontSize: 12.5,
    fontWeight: '900',
  },
  interactiveTopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  topicRowTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    flexShrink: 1,
  },
  topicRowTitleDone: {
    color: '#10B981',
    fontWeight: '800',
  },
  topicRowMeta: {
    fontSize: 10,
    marginTop: 1,
  },
  topicDoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  topicDoneBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },

  // Tasks in Expanded Phase
  tasksContainer: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  tasksHeading: { fontSize: 12, fontWeight: '900' },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  taskTitle: { fontSize: 12, fontWeight: '800', flexShrink: 1 },
  taskTitleDone: { color: '#10B981', fontWeight: '800' },
  taskDesc: { fontSize: 10, marginTop: 1, flexShrink: 1 },

  // Quiz in Expanded Phase
  quizBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  quizBannerTitle: { fontSize: 13, fontWeight: '900' },
  quizBannerSub: { fontSize: 11, marginTop: 2 },
  quizActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexShrink: 0,
    marginLeft: 8,
  },
  quizActionBtnText: { fontSize: 11, fontWeight: '900' },

  // Verification CTA
  phaseActionBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  phaseActionText: { fontSize: 12.5, fontWeight: '900', textAlign: 'center', paddingHorizontal: 8 },

  // Floating Return Button
  floatingJumpWrap: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    zIndex: 20,
  },
  floatingJumpBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  floatingJumpGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  floatingJumpText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },

  // Bottom supplementary sections
  sectionCard: { padding: 16, borderRadius: 16, gap: 10, marginTop: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '900' },
  sectionHeader: { fontSize: 16, fontWeight: '900' },
  quotaRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  quotaBox: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  quotaVal: { fontSize: 16, fontWeight: '900', color: '#60A5FA' },
  quotaLab: { fontSize: 10, fontWeight: '700', marginTop: 2, textAlign: 'center' },
  subCard: { padding: 12, borderRadius: 12, marginBottom: 8, gap: 4 },
  subCardTitle: { fontSize: 13, fontWeight: '800' },
  subCardDesc: { fontSize: 11, lineHeight: 15 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  miniTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  miniTagText: { fontSize: 10, fontWeight: '700' },

  // Quiz Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: '900', flex: 1 },
  modalCloseBtn: { padding: 4 },
  modalSub: { fontSize: 12, marginBottom: 16 },
  questionBox: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12, gap: 8 },
  questionText: { fontSize: 13, fontWeight: '800', lineHeight: 18 },
  quizOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  quizOptionText: { fontSize: 12, flex: 1 },
  explanationBox: { backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 8, borderRadius: 6, marginTop: 4 },
  explanationText: { fontSize: 11, color: '#38BDF8' },
  submitQuizBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitQuizBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  quizResultBox: { padding: 16, borderRadius: 12, alignItems: 'center', gap: 6, marginTop: 10 },
  quizResultTitle: { fontSize: 18, fontWeight: '900' },
  quizResultSub: { fontSize: 13, fontWeight: '700' },
  modalDoneBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 8 },
  modalDoneBtnText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  cyclePolicyBanner: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  cyclePolicyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cyclePolicyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cyclePolicyTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  cyclePolicySub: {
    fontSize: 11,
    marginTop: 2,
  },
  cyclePolicyRules: {
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  cycleRuleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  cycleRuleText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
});
