import { CAREER_ROADMAPS, CareerRoadmap } from '@/constants/roadmaps';
import { CAREER_BLUEPRINTS, CareerBlueprint } from '@/constants/roadmaps/blueprints';
import {
  StudentProfileData,
  getPersonalizedRoadmapMeta,
  getPhaseDefaultTasks,
  getPhaseQuiz,
  PhaseTaskItem,
  PhaseQuiz,
  AcademicYearOption,
  DailyLearningTimeOption,
  CareerGoalOption,
} from '@/constants/roadmaps/personalization';
import { storage } from '@/store/storage';
import { supabase } from '@/lib/supabase';

export interface UserProfileInput {
  name: string;
  branch: string;
  year: AcademicYearOption | string;
  cgpa?: string;
  careerGoal: CareerGoalOption | string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  studyHoursPerDay: DailyLearningTimeOption | string;
  preferredLanguage?: string;
  targetCompany?: string;
  graduationYear?: string;
}

export interface PersonalizedPhaseData {
  id: string;
  title: string;
  description: string;
  topics: string[];
  estimatedTime: string;
  tasks: PhaseTaskItem[];
  quiz: PhaseQuiz;
}

export interface PersonalizedBlueprintResponse {
  userProfile: UserProfileInput;
  blueprint: CareerBlueprint & {
    personalizedPhases: PersonalizedPhaseData[];
  };
  aiSummary: string;
  aiRecommendationReason: string;
  currentScore: number;
  potentialScore: number;
  paceDescription: string;
}

export type PhaseNodeState = 'locked' | 'available' | 'in_progress' | 'eligible_for_completion' | 'completed';

export interface PhaseStatusResult {
  state: PhaseNodeState;
  phaseStartedAt: string | null;
  phaseCompletedAt: string | null;
  remaining24hMs: number;
  remaining24hText: string;
  is24hPassed: boolean;
  tasksCompleted: number;
  totalTasks: number;
  isAllMandatoryTasksDone: boolean;
  quizAttempted: boolean;
  quizScore: number;
  quizPassed: boolean;
  canComplete: boolean;
}

export interface CareerSwitchEligibility {
  allowed: boolean;
  remainingMs: number;
  remainingText: string;
  nextAvailableAt: string | null;
  lastSelectedCareerId: string | null;
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

class RoadmapService {
  /**
   * Generates a complete AI Career Blueprint customized by:
   * 1. Student Name
   * 2. Branch
   * 3. Available learning time per day (<1h, 1-2h, 3+h)
   * 4. Current Academic Year (1st Year, 2nd Year, Final Year)
   * 5. Post-Diploma Goal (Job, Govt Job, Higher Studies, Startup, Not Sure)
   */
  async generateCareerBlueprint(
    profile: UserProfileInput,
    careerId: string
  ): Promise<PersonalizedBlueprintResponse> {
    const studentProfile: StudentProfileData = {
      studentName: profile.name || 'Student',
      branch: profile.branch || 'Engineering',
      academicYear: (profile.year as AcademicYearOption) || '1st Year',
      dailyLearningTime: (profile.studyHoursPerDay as DailyLearningTimeOption) || '1–2 hours',
      careerGoal: (profile.careerGoal as CareerGoalOption) || 'Job',
      targetCompany: profile.targetCompany || 'Top Tech Companies',
    };

    let baseBlueprint = CAREER_BLUEPRINTS[careerId];
    if (!baseBlueprint) {
      const roadmap = CAREER_ROADMAPS[careerId] || CAREER_ROADMAPS['fullstack-developer'] || Object.values(CAREER_ROADMAPS)[0];
      baseBlueprint = {
        id: roadmap.id,
        title: roadmap.title,
        category: roadmap.category,
        icon: roadmap.icon,
        difficulty: roadmap.difficulty,
        overview: roadmap.overview,
        estimatedTimeline: roadmap.estimatedTimeline,
        expectedSalaryRange: roadmap.expectedSalaryRange,
        initialReadinessScore: 0,
        potentialReadinessScore: 92,
        aiSummaryTemplate: `Tailored curriculum for ${roadmap.title} with structured milestones.`,
        motivationalMessage: `Mastering ${roadmap.title} unlocks significant placement and career advancement opportunities.`,
        currentSkillsSample: [roadmap.skillsRequired[0] || 'Basic Programming'],
        missingSkills: roadmap.skillsRequired.slice(1).length > 0 ? roadmap.skillsRequired.slice(1) : ['Advanced concepts', 'System design'],
        weeklySchedule: {
          Monday: `DSA & Problem Solving in ${roadmap.programmingLanguages[0] || 'TypeScript'} (1.5 Hrs)`,
          Tuesday: `Learn ${roadmap.frameworks[0] || 'Core Frameworks'} (2 Hrs)`,
          Wednesday: `Study ${roadmap.tools[0] || 'Development Tools'} (1.5 Hrs)`,
          Thursday: `Hands-on Project Building (2 Hrs)`,
          Friday: `Review ${roadmap.skillsRequired.slice(0, 3).join(', ')} (1.5 Hrs)`,
          Saturday: `Quiz & Practice Milestones (2 Hrs)`,
          Sunday: `Weekly Revision & Portfolio Update (1.5 Hrs)`,
        },
        monthlyGoals: [
          { month: 'Month 1', goal: `Master ${roadmap.programmingLanguages.join(', ')} Syntax & Logic` },
          { month: 'Month 2', goal: `Build projects using ${roadmap.frameworks.join(', ')}` },
          { month: 'Month 3', goal: `Deploy portfolio projects and complete phase assessments` },
        ],
        phases: roadmap.phases.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          topics: p.topics,
          estimatedTime: p.estimatedTime,
        })),
        projects: roadmap.projects,
        certifications: roadmap.certifications,
        softSkills: ['Technical Communication', 'Problem Solving', 'Structured Thinking'],
        placementPrep: {
          easyProblems: 40,
          mediumProblems: 60,
          hardProblems: 10,
          mockInterviews: 3,
          checklist: ['ATS-optimized resume PDF', 'GitHub Portfolio', 'Active LinkedIn Profile'],
        },
        companyPrep: {
          General: ['Core Programming Principles', 'Data Structures & Algorithms', 'System Architecture'],
        },
        recommendedBooks: ['Clean Code by Robert C. Martin', 'Cracking the Coding Interview'],
        youtubeChannels: ['freeCodeCamp', 'take U forward'],
        websites: ['roadmap.sh', 'LeetCode', 'GeeksforGeeks'],
      };
    }

    const meta = getPersonalizedRoadmapMeta(studentProfile, baseBlueprint.title);

    // Personalize phases with tasks and quizzes
    const personalizedPhases: PersonalizedPhaseData[] = baseBlueprint.phases.map((p, idx) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      topics: p.topics,
      estimatedTime: p.estimatedTime,
      tasks: getPhaseDefaultTasks(baseBlueprint.id, idx, p.title),
      quiz: getPhaseQuiz(baseBlueprint.id, p.id, idx),
    }));

    // Adjust timeline based on daily study pace
    const calculatedScore = this.getVerifiedScore(baseBlueprint.id);

    const aiSummary = `We analyzed your academic profile (${studentProfile.branch}, ${studentProfile.academicYear}) and post-diploma goal (${studentProfile.careerGoal}). Based on your daily commitment (${studentProfile.dailyLearningTime}), ${meta.yearFocus} ${meta.goalFocus}`;

    return {
      userProfile: profile,
      blueprint: {
        ...baseBlueprint,
        initialReadinessScore: 0,
        potentialReadinessScore: 95,
        personalizedPhases,
      },
      aiSummary,
      aiRecommendationReason: meta.aiRecommendationReason,
      currentScore: calculatedScore,
      potentialScore: 95,
      paceDescription: meta.paceDescription,
    };
  }

  /**
   * Check if student is eligible to switch career (Minimum 3-Day / 72-Hour Rule)
   */
  canSwitchCareer(userId?: string): CareerSwitchEligibility {
    try {
      const lastActive = storage.getString('last_active_career_id') || storage.getString('active_roadmap_id');
      const switchDateStr = storage.getString('next_career_switch_at');
      const lastSwitchStr = storage.getString('last_career_switch_at');

      if (!switchDateStr || !lastActive) {
        return {
          allowed: true,
          remainingMs: 0,
          remainingText: 'Available now',
          nextAvailableAt: null,
          lastSelectedCareerId: lastActive || null,
        };
      }

      const nextSwitchTime = new Date(switchDateStr).getTime();
      const now = Date.now();
      const diff = nextSwitchTime - now;

      if (diff <= 0) {
        return {
          allowed: true,
          remainingMs: 0,
          remainingText: 'Available now',
          nextAvailableAt: switchDateStr,
          lastSelectedCareerId: lastActive,
        };
      }

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      let remainingText = '';
      if (days > 0) {
        remainingText = `${days} day${days > 1 ? 's' : ''} ${hours} hr${hours !== 1 ? 's' : ''}`;
      } else if (hours > 0) {
        remainingText = `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
      } else {
        remainingText = `${Math.max(1, minutes)} minute${minutes !== 1 ? 's' : ''}`;
      }

      return {
        allowed: false,
        remainingMs: diff,
        remainingText,
        nextAvailableAt: switchDateStr,
        lastSelectedCareerId: lastActive,
      };
    } catch {
      return {
        allowed: true,
        remainingMs: 0,
        remainingText: 'Available now',
        nextAvailableAt: null,
        lastSelectedCareerId: null,
      };
    }
  }

  /**
   * Save student career selection with 3-day restriction check
   */
  async saveCareerSelection(
    profile: StudentProfileData,
    careerId: string,
    userId?: string
  ): Promise<{ success: boolean; message?: string }> {
    const eligibility = this.canSwitchCareer(userId);

    // If trying to switch to a DIFFERENT career and restriction is active
    if (eligibility.lastSelectedCareerId && eligibility.lastSelectedCareerId !== careerId && !eligibility.allowed) {
      return {
        success: false,
        message: `Career change is locked. You can choose another career after ${eligibility.remainingText}.`,
      };
    }

    const nowIso = new Date().toISOString();
    const nextSwitchIso = new Date(Date.now() + THREE_DAYS_MS).toISOString();

    // Persist locally
    storage.set('last_active_career_id', careerId);
    storage.set('active_roadmap_id', careerId);
    storage.set('student_profile_data', JSON.stringify(profile));

    if (!eligibility.lastSelectedCareerId || eligibility.lastSelectedCareerId !== careerId) {
      storage.set('last_career_switch_at', nowIso);
      storage.set('next_career_switch_at', nextSwitchIso);
      // Initialize Phase 1 start timestamp if not present
      this.ensurePhaseStarted(careerId, 'phase-1');
    }

    // Persist to Supabase
    if (userId) {
      try {
        // Try RPC first for server-side enforcement
        const { data, error } = await supabase.rpc('select_student_career', {
          p_career_id: careerId,
          p_student_name: profile.studentName,
          p_branch: profile.branch,
          p_academic_year: profile.academicYear,
          p_daily_learning_time: profile.dailyLearningTime,
          p_career_goal: profile.careerGoal,
          p_target_company: profile.targetCompany || 'Top Tech Companies',
        });

        if (error) {
          console.warn('[roadmapService] select_student_career RPC fallback:', error.message);
          // Fallback direct upsert
          await supabase.from('student_career_goals').upsert({
            user_id: userId,
            student_name: profile.studentName,
            branch: profile.branch,
            academic_year: profile.academicYear,
            daily_learning_time: profile.dailyLearningTime,
            career_goal: profile.careerGoal,
            selected_career_id: careerId,
            target_company: profile.targetCompany,
            career_selected_at: nowIso,
            last_career_switch_at: nowIso,
            next_career_switch_at: nextSwitchIso,
            updated_at: nowIso,
          }, { onConflict: 'user_id' });

          await supabase.from('student_roadmap_progress').upsert({
            user_id: userId,
            career_role_id: careerId,
            current_phase_id: 'phase-1',
            current_score: this.getVerifiedScore(careerId),
            overall_progress: this.getVerifiedScore(careerId),
            readiness_score: this.getVerifiedScore(careerId),
            completed_phase_ids: this.getProgress(careerId),
            phase_started_at: this.getPhaseStartedMap(careerId),
            updated_at: nowIso,
          }, { onConflict: 'user_id,career_role_id' });
        }
      } catch (e) {
        console.warn('[roadmapService] saveCareerSelection db error:', e);
      }
      this.syncProgressToSupabase(careerId, userId);
    }

    return { success: true };
  }

  /**
   * Retrieve Phase Progress State & Anti-Abuse Timers
   */
  getPhaseStatus(
    careerId: string,
    phaseId: string,
    phaseIndex: number,
    totalPhases: number,
    userId?: string
  ): PhaseStatusResult {
    const completedPhases = this.getProgress(careerId);
    const isCompleted = completedPhases.includes(phaseId);

    const startedMap = this.getPhaseStartedMap(careerId);
    const completedMap = this.getPhaseCompletedMap(careerId);
    const taskProgress = this.getTaskProgressMap(careerId);
    const quizMap = this.getQuizScoresMap(careerId);

    const phaseStartedAt = startedMap[phaseId] || null;
    const phaseCompletedAt = completedMap[phaseId] || null;

    // Previous phase completed check
    const isPreviousCompleted = phaseIndex === 0 || (completedPhases.length >= phaseIndex);

    // Midnight 12:00 AM to 12:00 AM Daily Cycle validation
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);

    // Global daily unlock validation: check if ANY phase across ANY career was completed today
    const globalLastCompIso = storage.getString('roadmap_global_last_completed_at');
    let anyPhaseCompletedTodayGlobally = false;
    if (globalLastCompIso) {
      try {
        const d = new Date(globalLastCompIso);
        if (d.getTime() >= todayStart.getTime()) {
          anyPhaseCompletedTodayGlobally = true;
        }
      } catch {}
    }

    // Check if any other phase was completed today
    const anyOtherPhaseCompletedToday = Object.entries(completedMap).some(([k, compIso]) => {
      if (k === phaseId || !compIso) return false;
      try {
        const d = new Date(compIso);
        return d.getTime() >= todayStart.getTime();
      } catch {
        return false;
      }
    });

    // If another phase was completed today (globally or within this track), next phase is locked until next 12:00 AM midnight
    const isDailyUnlocked = !isCompleted && !anyOtherPhaseCompletedToday && !anyPhaseCompletedTodayGlobally;

    let state: PhaseNodeState = 'locked';
    if (isCompleted) {
      state = 'completed';
    } else if (isPreviousCompleted && isDailyUnlocked) {
      if (phaseStartedAt) {
        state = 'in_progress';
      } else {
        state = 'available';
      }
    } else {
      state = 'locked';
    }

    // 24-Hour / Midnight Timer validation
    let remaining24hMs = 0;
    let is24hPassed = false;
    let remaining24hText = '';

    if (isCompleted) {
      is24hPassed = true;
      remaining24hMs = 0;
      remaining24hText = 'Completed';
    } else if (!isDailyUnlocked && isPreviousCompleted) {
      is24hPassed = false;
      remaining24hMs = Math.max(0, nextMidnight.getTime() - now.getTime());
      const totalMin = Math.ceil(remaining24hMs / (1000 * 60));
      const hrs = Math.floor(totalMin / 60);
      const mins = totalMin % 60;
      remaining24hText = hrs > 0 ? `${hrs}h ${mins}m until 12:00 AM unlock` : `${mins}m until 12:00 AM unlock`;
    } else if (phaseStartedAt) {
      const startDate = new Date(phaseStartedAt);
      const startMidnight = new Date(startDate);
      startMidnight.setHours(24, 0, 0, 0);

      if (startDate.getTime() < todayStart.getTime()) {
        is24hPassed = true;
        remaining24hMs = 0;
        remaining24hText = 'Daily study window completed';
      } else {
        remaining24hMs = Math.max(0, startMidnight.getTime() - now.getTime());
        if (remaining24hMs === 0) {
          is24hPassed = true;
          remaining24hText = 'Daily study window completed';
        } else {
          is24hPassed = false;
          const totalMin = Math.ceil(remaining24hMs / (1000 * 60));
          const hrs = Math.floor(totalMin / 60);
          const mins = totalMin % 60;
          remaining24hText = hrs > 0 ? `${hrs}h ${mins}m until 12:00 AM unlock` : `${mins}m until 12:00 AM unlock`;
        }
      }
    } else {
      is24hPassed = false;
      remaining24hMs = Math.max(0, nextMidnight.getTime() - now.getTime());
      remaining24hText = 'Starts upon opening';
    }

    // Task completion check
    const defaultTasks = getPhaseDefaultTasks(careerId, phaseIndex, `Phase ${phaseIndex + 1}`);
    const totalTasks = defaultTasks.length;
    let tasksCompletedCount = 0;
    let isAllMandatoryTasksDone = true;

    for (const t of defaultTasks) {
      const isDone = !!taskProgress[t.id]?.completed;
      if (isDone) tasksCompletedCount++;
      if (t.mandatory && !isDone) {
        isAllMandatoryTasksDone = false;
      }
    }

    // Quiz check
    const quizRecord = quizMap[phaseId];
    const quizAttempted = !!quizRecord;
    const quizScore = quizRecord?.score || 0;
    const quizPassed = !!quizRecord?.passed;

    // Eligibility check
    const canComplete = !isCompleted && isPreviousCompleted && isDailyUnlocked && isAllMandatoryTasksDone && quizPassed && is24hPassed;
    if (canComplete && state === 'in_progress') {
      state = 'eligible_for_completion';
    }

    return {
      state,
      phaseStartedAt,
      phaseCompletedAt,
      remaining24hMs,
      remaining24hText,
      is24hPassed,
      tasksCompleted: tasksCompletedCount,
      totalTasks,
      isAllMandatoryTasksDone,
      quizAttempted,
      quizScore,
      quizPassed,
      canComplete,
    };
  }

  /**
   * Ensures a phase start timestamp is registered (begins 24h countdown)
   */
  ensurePhaseStarted(careerId: string, phaseId: string): string {
    const map = this.getPhaseStartedMap(careerId);
    if (!map[phaseId]) {
      const nowIso = new Date().toISOString();
      map[phaseId] = nowIso;
      storage.set(`roadmap_phase_started_${careerId}`, JSON.stringify(map));
      return nowIso;
    }
    return map[phaseId];
  }

  /**
   * Complete a task within a phase
   */
  toggleTask(careerId: string, phaseId: string, taskId: string, userId?: string, isLocked: boolean = false) {
    if (isLocked) {
      return this.getTaskProgressMap(careerId);
    }
    this.ensurePhaseStarted(careerId, phaseId);
    const map = this.getTaskProgressMap(careerId);
    const current = map[taskId]?.completed || false;
    const nextState = !current;

    map[taskId] = {
      completed: nextState,
      completed_at: nextState ? new Date().toISOString() : null,
    };

    storage.set(`roadmap_tasks_${careerId}`, JSON.stringify(map));
    this.syncProgressToSupabase(careerId, userId);
    return map;
  }

  /**
   * Get topic progress map for a career
   */
  getTopicProgressMap(careerId: string): Record<string, { completed: boolean; completed_at?: string }> {
    try {
      const raw = storage.getString(`roadmap_topics_${careerId}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  /**
   * Toggle topic completion within a phase
   */
  toggleTopic(careerId: string, phaseId: string, topicName: string, userId?: string, isLocked: boolean = false) {
    if (isLocked) {
      return this.getTopicProgressMap(careerId);
    }
    this.ensurePhaseStarted(careerId, phaseId);
    const map = this.getTopicProgressMap(careerId);
    const topicKey = `${phaseId}::${topicName}`;
    const current = map[topicKey]?.completed || false;
    const nextState = !current;

    map[topicKey] = {
      completed: nextState,
      completed_at: nextState ? new Date().toISOString() : undefined,
    };

    storage.set(`roadmap_topics_${careerId}`, JSON.stringify(map));
    this.syncProgressToSupabase(careerId, userId);
    return map;
  }

  /**
   * Check if any roadmap topic, task, or phase was completed today
   */
  hasCompletedAnyRoadmapActivityToday(targetCareerId?: string): boolean {
    const todayStr = new Date().toISOString().split('T')[0];
    const careers = targetCareerId
      ? [targetCareerId]
      : ['fullstack-developer', 'mobile-developer', 'ai-engineer', 'devops-cloud', 'cybersecurity-analyst', 'data-scientist', 'uiux-designer'];
    for (const cid of careers) {
      const topics = this.getTopicProgressMap(cid);
      if (Object.values(topics).some((t: any) => t?.completed && t?.completed_at && String(t.completed_at).startsWith(todayStr))) {
        return true;
      }
      const tasks = this.getTaskProgressMap(cid);
      if (Object.values(tasks).some((t: any) => t?.completed && t?.completed_at && String(t.completed_at).startsWith(todayStr))) {
        return true;
      }
      const phases = this.getPhaseCompletedMap(cid);
      if (Object.values(phases).some((iso: any) => iso && String(iso).startsWith(todayStr))) {
        return true;
      }
    }
    const globalLast = storage.getString('roadmap_global_last_completed_at');
    if (globalLast && globalLast.startsWith(todayStr)) {
      return true;
    }
    return false;
  }

  /**
   * Check if a milestone was already celebrated to avoid repeating animations
   */
  hasMilestoneBeenCelebrated(careerId: string, milestoneKey: string): boolean {
    try {
      const raw = storage.getString(`roadmap_celebrated_${careerId}`);
      const list: string[] = raw ? JSON.parse(raw) : [];
      return list.includes(milestoneKey);
    } catch {
      return false;
    }
  }

  /**
   * Mark a milestone as celebrated
   */
  markMilestoneCelebrated(careerId: string, milestoneKey: string) {
    try {
      const raw = storage.getString(`roadmap_celebrated_${careerId}`);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(milestoneKey)) {
        list.push(milestoneKey);
        storage.set(`roadmap_celebrated_${careerId}`, JSON.stringify(list));
      }
    } catch {}
  }

  /**
   * Submit a Phase Knowledge Quiz
   */
  submitPhaseQuiz(
    careerId: string,
    phaseId: string,
    score: number,
    passed: boolean,
    userId?: string,
    isLocked: boolean = false
  ) {
    if (isLocked) {
      return this.getQuizScoresMap(careerId)[phaseId];
    }
    this.ensurePhaseStarted(careerId, phaseId);
    const map = this.getQuizScoresMap(careerId);
    map[phaseId] = {
      score,
      passed,
      attempted_at: new Date().toISOString(),
    };

    storage.set(`roadmap_quizzes_${careerId}`, JSON.stringify(map));
    this.syncProgressToSupabase(careerId, userId);
    return map[phaseId];
  }

  /**
   * Complete a Phase with Anti-Abuse Verification (Tasks + Quiz + 24 Hours)
   */
  async completePhase(
    careerId: string,
    phaseId: string,
    phaseIndex: number,
    totalPhases: number,
    nextPhaseId?: string,
    userId?: string
  ): Promise<{ success: boolean; reason?: string; newScore: number; completedPhases: string[]; alreadyCompleted?: boolean }> {
    const status = this.getPhaseStatus(careerId, phaseId, phaseIndex, totalPhases, userId);

    if (status.state === 'completed') {
      return {
        success: true,
        alreadyCompleted: true,
        newScore: this.getVerifiedScore(careerId),
        completedPhases: this.getProgress(careerId),
      };
    }

    if (!status.isAllMandatoryTasksDone) {
      return {
        success: false,
        reason: 'Please complete all mandatory tasks and practice exercises for this phase before submitting.',
        newScore: this.getVerifiedScore(careerId),
        completedPhases: this.getProgress(careerId),
      };
    }

    if (!status.quizPassed) {
      return {
        success: false,
        reason: 'Please attempt and pass the Phase Knowledge Quiz (min. 70% score) to verify your mastery.',
        newScore: this.getVerifiedScore(careerId),
        completedPhases: this.getProgress(careerId),
      };
    }

    if (!status.is24hPassed) {
      return {
        success: false,
        reason: `Minimum 24-hour study requirement not yet completed (${status.remaining24hText}). Please use this time to review concepts and write code.`,
        newScore: this.getVerifiedScore(careerId),
        completedPhases: this.getProgress(careerId),
      };
    }

    // All conditions satisfied: Mark Completed!
    const currentCompleted = this.getProgress(careerId);
    if (!currentCompleted.includes(phaseId)) {
      currentCompleted.push(phaseId);
    }
    storage.set(`roadmap_progress_${careerId}`, JSON.stringify(currentCompleted));

    // Record completion timestamp locally and globally
    const compMap = this.getPhaseCompletedMap(careerId);
    const nowIso = new Date().toISOString();
    compMap[phaseId] = nowIso;
    storage.set(`roadmap_phase_completed_${careerId}`, JSON.stringify(compMap));
    storage.set('roadmap_global_last_completed_at', nowIso);

    // Unlock & start next phase
    if (nextPhaseId) {
      this.ensurePhaseStarted(careerId, nextPhaseId);
    }

    const newScore = this.getVerifiedScore(careerId, totalPhases);

    // Sync to Supabase
    if (userId) {
      try {
        await supabase.rpc('complete_roadmap_phase', {
          p_career_id: careerId,
          p_phase_id: phaseId,
          p_total_phases: totalPhases,
        });
      } catch (e) {
        console.warn('[roadmapService] complete_roadmap_phase RPC fallback:', e);
      }
      this.syncProgressToSupabase(careerId, userId);
    }

    return {
      success: true,
      newScore,
      completedPhases: currentCompleted,
    };
  }

  /**
   * Sync complete verified progress to Supabase
   */
  async syncProgressToSupabase(careerId: string, userId?: string) {
    if (!userId || !careerId) return;
    try {
      storage.set('last_active_career_id', careerId);
      storage.set('active_roadmap_id', careerId);

      const completed = this.getProgress(careerId);
      const score = this.getVerifiedScore(careerId);
      const started = this.getPhaseStartedMap(careerId);
      const completedMap = this.getPhaseCompletedMap(careerId);
      const tasks = this.getTaskProgressMap(careerId);
      const topics = this.getTopicProgressMap(careerId);
      const quizzes = this.getQuizScoresMap(careerId);

      const payload = {
        user_id: userId,
        career_role_id: careerId,
        completed_phase_ids: completed,
        phase_started_at: started,
        phase_completed_at: completedMap,
        task_progress: tasks,
        topic_progress: topics,
        quiz_scores: quizzes,
        current_score: score,
        overall_progress: score,
        readiness_score: score,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from('student_roadmap_progress')
        .upsert(payload, { onConflict: 'user_id,career_role_id' });

      if (upsertErr) {
        // Fallback to high-reliability SECURITY DEFINER RPC
        await supabase.rpc('sync_student_roadmap_progress', {
          p_user_id: userId,
          p_career_role_id: careerId,
          p_completed_phase_ids: completed,
          p_phase_started_at: started,
          p_phase_completed_at: completedMap,
          p_task_progress: tasks,
          p_topic_progress: topics,
          p_quiz_scores: quizzes,
          p_score: score,
        });
      }
    } catch (e) {
      console.warn('[roadmapService] syncProgressToSupabase error:', e);
    }
  }

  /**
   * Accurately calculate verified score:
   * Starts strictly at 0% when no verified work is done.
   */
  getVerifiedScore(careerId: string, totalPhasesCount?: number): number {
    try {
      const completedPhases = this.getProgress(careerId);
      const roadmap = CAREER_ROADMAPS[careerId] || CAREER_BLUEPRINTS[careerId];
      const totalPhases = totalPhasesCount || roadmap?.phases?.length || 6;
      if (totalPhases <= 0) return 0;

      // Base score purely based on completed, verified phases
      let calculatedPct = (completedPhases.length / totalPhases) * 100;

      // Also account for tasks and topics in current active phase
      if (completedPhases.length < totalPhases) {
        const taskMap = this.getTaskProgressMap(careerId);
        const topicMap = this.getTopicProgressMap(careerId);
        const tasksDone = Object.values(taskMap).filter((t: any) => t?.completed).length;
        const topicsDone = Object.values(topicMap).filter((t: any) => t?.completed).length;
        const partialPhasePct = Math.min((1 / totalPhases) * 100, (tasksDone * 4 + topicsDone * 2));
        calculatedPct += partialPhasePct;
      }

      return Math.min(100, Math.max(0, Math.round(calculatedPct)));
    } catch {
      return 0;
    }
  }

  getProgress(roadmapId: string): string[] {
    try {
      const raw = storage.getString(`roadmap_progress_${roadmapId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getPhaseStartedMap(careerId: string): Record<string, string> {
    try {
      const raw = storage.getString(`roadmap_phase_started_${careerId}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  getPhaseCompletedMap(careerId: string): Record<string, string> {
    try {
      const raw = storage.getString(`roadmap_phase_completed_${careerId}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  getTaskProgressMap(careerId: string): Record<string, { completed: boolean; completed_at: string | null }> {
    try {
      const raw = storage.getString(`roadmap_tasks_${careerId}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  getQuizScoresMap(careerId: string): Record<string, { score: number; passed: boolean; attempted_at: string }> {
    try {
      const raw = storage.getString(`roadmap_quizzes_${careerId}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  isBookmarked(roadmapId: string): boolean {
    try {
      const raw = storage.getString('bookmarked_roadmaps');
      const list: string[] = raw ? JSON.parse(raw) : [];
      return list.includes(roadmapId);
    } catch {
      return false;
    }
  }

  toggleBookmark(roadmapId: string): boolean {
    try {
      const raw = storage.getString('bookmarked_roadmaps');
      const list: string[] = raw ? JSON.parse(raw) : [];
      const updated = list.includes(roadmapId)
        ? list.filter((id) => id !== roadmapId)
        : [...list, roadmapId];

      storage.set('bookmarked_roadmaps', JSON.stringify(updated));
      return updated.includes(roadmapId);
    } catch {
      return false;
    }
  }

  /**
   * Completely clear all local roadmap progress and cache from device storage
   */
  clearAllRoadmapProgress() {
    try {
      const knownCareers = [
        'fullstack-developer',
        'frontend-developer',
        'backend-developer',
        'ai-ml-engineer',
        'ai-engineer',
        'cloud-devops',
        'devops-cloud',
        'cybersecurity-specialist',
        'cybersecurity-analyst',
        'mobile-developer',
        'data-analyst',
        'data-scientist',
        'uiux-designer',
      ];
      for (const cid of knownCareers) {
        storage.remove(`roadmap_progress_${cid}`);
        storage.remove(`roadmap_tasks_${cid}`);
        storage.remove(`roadmap_topics_${cid}`);
        storage.remove(`roadmap_quizzes_${cid}`);
        storage.remove(`roadmap_phase_started_${cid}`);
        storage.remove(`roadmap_phase_completed_${cid}`);
        storage.remove(`roadmap_celebrated_${cid}`);
      }
      storage.remove('last_active_career_id');
      storage.remove('active_roadmap_id');
      storage.remove('student_profile_data');
      storage.remove('next_career_switch_at');
      storage.remove('last_career_switch_at');
      storage.remove('roadmap_global_last_completed_at');
      storage.remove('last_roadmap_user_id');
      console.log('[roadmapService] ✅ Cleared all local roadmap progress');
    } catch (e) {
      console.warn('[roadmapService] clearAllRoadmapProgress error:', e);
    }
  }

  /**
   * Reset roadmap progress for a specific user in Supabase and locally
   */
  async resetUserRoadmap(userId: string, careerId?: string) {
    this.clearAllRoadmapProgress();
    if (!userId) return { success: true };
    try {
      if (careerId) {
        await supabase
          .from('student_roadmap_progress')
          .delete()
          .eq('user_id', userId)
          .eq('career_role_id', careerId);
      } else {
        await supabase
          .from('student_roadmap_progress')
          .delete()
          .eq('user_id', userId);
        await supabase
          .from('student_career_goals')
          .delete()
          .eq('user_id', userId);
      }
      return { success: true };
    } catch (e) {
      console.warn('[roadmapService] resetUserRoadmap error:', e);
      return { success: false, error: e };
    }
  }

  /**
   * Fetch roadmap progress from Supabase on app start
   */
  async fetchProgressFromSupabase(userId: string, careerId?: string) {
    if (!userId) return null;
    try {
      const cachedUserId = storage.getString('last_roadmap_user_id');
      if (cachedUserId && cachedUserId !== userId) {
        console.log(`[roadmapService] User changed (${cachedUserId} -> ${userId}). Clearing local roadmap cache.`);
        this.clearAllRoadmapProgress();
      }
      storage.set('last_roadmap_user_id', userId);

      let data = null;

      // 1. If careerId provided, try matching that career first
      if (careerId) {
        const { data: specificData } = await supabase
          .from('student_roadmap_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('career_role_id', careerId)
          .maybeSingle();
        data = specificData;
      }

      // 2. If no specific match or no careerId passed, fetch the user's most recently updated active roadmap
      if (!data) {
        const { data: latestData } = await supabase
          .from('student_roadmap_progress')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        data = latestData;
      }

      if (data && data.career_role_id) {
        const cId = data.career_role_id;
        if (Array.isArray(data.completed_phase_ids)) {
          storage.set(`roadmap_progress_${cId}`, JSON.stringify(data.completed_phase_ids));
        }
        if (data.phase_started_at) {
          storage.set(`roadmap_phase_started_${cId}`, JSON.stringify(data.phase_started_at));
        }
        if (data.phase_completed_at) {
          storage.set(`roadmap_phase_completed_${cId}`, JSON.stringify(data.phase_completed_at));
        }
        if (data.task_progress) {
          storage.set(`roadmap_tasks_${cId}`, JSON.stringify(data.task_progress));
        }
        if (data.topic_progress) {
          storage.set(`roadmap_topics_${cId}`, JSON.stringify(data.topic_progress));
        }
        if (data.quiz_scores) {
          storage.set(`roadmap_quizzes_${cId}`, JSON.stringify(data.quiz_scores));
        }
        storage.set('last_active_career_id', cId);
        storage.set('active_roadmap_id', cId);

        // Also fetch student career goals if available to restore profile data
        try {
          const { data: goals } = await supabase
            .from('student_career_goals')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
          if (goals && goals.student_name) {
            storage.set(
              'student_profile_data',
              JSON.stringify({
                studentName: goals.student_name,
                branch: goals.branch || 'Computer Science / IT',
                academicYear: goals.academic_year || '1st Year',
                dailyLearningTime: goals.daily_learning_time || '1–2 hours',
                careerGoal: goals.career_goal || 'Job',
                targetCompany: goals.target_company || 'Top Tech Companies',
              })
            );
          }
        } catch {}

        return data;
      } else {
        // No roadmap progress exists in Supabase for this user (fresh user or wiped database).
        // Ensure stale local cache from previous accounts is wiped!
        console.log('[roadmapService] User has no active roadmap in Supabase. Ensuring fresh start.');
        this.clearAllRoadmapProgress();
        storage.set('last_roadmap_user_id', userId);
        return null;
      }
    } catch (e) {
      console.warn('[roadmapService] fetchProgressFromSupabase error:', e);
      return null;
    }
  }

  /**
   * Single Source of Truth for active roadmap summary
   */
  getActiveRoadmapSummary(targetCareerId?: string) {
    try {
      const storedActive = storage.getString('last_active_career_id') || storage.getString('active_roadmap_id');
      const activeId = storedActive || targetCareerId || 'fullstack-developer';
      const roadmap =
        CAREER_ROADMAPS[activeId] ||
        Object.values(CAREER_ROADMAPS).find((r) => r.id === activeId || r.title.toLowerCase().includes((targetCareerId || '').toLowerCase())) ||
        CAREER_ROADMAPS['fullstack-developer'] ||
        Object.values(CAREER_ROADMAPS)[0];

      if (!roadmap) {
        return {
          id: 'fullstack-developer',
          title: 'Full Stack Developer',
          percentage: 0,
          readiness_score: 0,
          completedPhasesCount: 0,
          totalPhasesCount: 6,
          remainingDays: 30,
          currentPhaseTitle: 'Phase 1: Foundations',
          hasActiveRoadmap: !!storedActive,
        };
      }

      const completed = this.getProgress(roadmap.id);
      const totalPhases = roadmap.phases?.length || 6;
      const completedCount = completed.length;
      
      let calculatedPct = (completedCount / totalPhases) * 100;
      if (completedCount < totalPhases) {
        const taskMap = this.getTaskProgressMap(roadmap.id);
        const topicMap = this.getTopicProgressMap(roadmap.id);
        const tasksDone = Object.values(taskMap).filter((t: any) => t?.completed).length;
        const topicsDone = Object.values(topicMap).filter((t: any) => t?.completed).length;
        const partialPhasePct = Math.min((1 / totalPhases) * 100, (tasksDone * 4 + topicsDone * 2));
        calculatedPct += partialPhasePct;
      }
      const percentage = Math.min(100, Math.max(0, Math.round(calculatedPct)));
      const remainingDays = Math.max(0, Math.round(30 * (1 - percentage / 100)));
      const currentPhaseIndex = Math.min(completedCount, totalPhases - 1);
      const currentPhaseTitle = roadmap.phases?.[currentPhaseIndex]?.title || 'Phase 1: Foundations';

      return {
        id: roadmap.id,
        title: roadmap.title,
        percentage,
        readiness_score: percentage,
        completedPhasesCount: completedCount,
        totalPhasesCount: totalPhases,
        remainingDays,
        currentPhaseTitle,
        hasActiveRoadmap: !!storedActive,
      };
    } catch {
      return {
        id: 'fullstack-developer',
        title: 'Full Stack Developer',
        percentage: 0,
        readiness_score: 0,
        completedPhasesCount: 0,
        totalPhasesCount: 6,
        remainingDays: 30,
        currentPhaseTitle: 'Phase 1: Foundations',
        hasActiveRoadmap: false,
      };
    }
  }
}

export const roadmapService = new RoadmapService();
