import { supabase } from '@/lib/supabase';
import { awardActivity, fetchDailyStreak } from './gamificationService';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  challenge_type: 'mcq' | 'true_false' | 'fill_blank' | 'code_output' | 'coding' | 'short_answer';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp_reward: number;
  estimated_minutes: number;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  code_snippet?: string;
  status: string;
  target_branch?: string;
  target_year?: string;
  publish_at?: string;
  completed_today?: boolean;
}

export interface StudentProgressStats {
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  completedCount: number;
  userLevel: number;
}

export interface ChallengeAttemptResult {
  isCorrect: boolean;
  score: number;
  xpEarned: number;
  correctAnswer: string;
  explanation: string;
  currentStreak: number;
}

// 1. Get Today's Targeted Challenge for Student
export async function getTodayChallenge(userId?: string): Promise<DailyChallenge | null> {
  try {
    const { data: challenges, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !challenges || challenges.length === 0) {
      return getFallbackChallenge();
    }

    const challenge = challenges[0];
    let completedToday = false;

    if (userId) {
      const { data: attempt } = await supabase
        .from('student_challenge_progress')
        .select('id')
        .eq('student_id', userId)
        .eq('challenge_id', challenge.id)
        .maybeSingle();

      if (attempt) completedToday = true;
    }

    return {
      ...challenge,
      options: typeof challenge.options === 'string' ? JSON.parse(challenge.options) : challenge.options,
      completed_today: completedToday,
    };
  } catch (e) {
    console.warn('getTodayChallenge exception:', e);
    return getFallbackChallenge();
  }
}

// 2. Get All Available Challenges (Keep Learning Section)
export async function getAvailableChallenges(userId?: string): Promise<DailyChallenge[]> {
  try {
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data || data.length === 0) {
      return [getFallbackChallenge()];
    }

    return data.map((c) => ({
      ...c,
      options: typeof c.options === 'string' ? JSON.parse(c.options) : c.options,
    }));
  } catch (e) {
    return [getFallbackChallenge()];
  }
}

// 3. Get Student Stats (Streak, XP, Level, Completed Count)
export async function getStudentProgressStats(userId?: string): Promise<StudentProgressStats> {
  if (!userId) {
    return { currentStreak: 1, longestStreak: 1, totalXp: 0, completedCount: 0, userLevel: 1 };
  }

  try {
    const [streakData, progressRes] = await Promise.all([
      fetchDailyStreak(userId),
      supabase.from('student_challenge_progress').select('id', { count: 'exact', head: true }).eq('student_id', userId),
    ]);

    const currentStreak = streakData?.current_streak || 1;
    const longestStreak = streakData?.longest_streak || currentStreak;
    const totalXp = streakData?.xp_points || 0;
    const completedCount = progressRes?.count || 0;
    const userLevel = Math.max(1, Math.floor(totalXp / 500) + 1);

    return {
      currentStreak,
      longestStreak,
      totalXp,
      completedCount,
      userLevel,
    };
  } catch (e) {
    return { currentStreak: 1, longestStreak: 1, totalXp: 0, completedCount: 0, userLevel: 1 };
  }
}

// 4. Submit Challenge Attempt
export async function submitChallengeAttempt(
  challengeId: string,
  userId: string,
  userAnswer: string,
  timeTakenSeconds: number = 60
): Promise<ChallengeAttemptResult> {
  try {
    const { data: rpcRes, error: rpcErr } = await supabase.rpc('submit_daily_challenge', {
      p_challenge_id: challengeId,
      p_user_id: userId,
      p_selected_answer: userAnswer,
    });

    if (!rpcErr && rpcRes) {
      return {
        isCorrect: rpcRes.is_correct ?? false,
        score: rpcRes.score ?? 0,
        xpEarned: rpcRes.xp_earned ?? 0,
        correctAnswer: rpcRes.correct_answer || '',
        explanation: rpcRes.explanation || 'Standard challenge explanation.',
        currentStreak: 1,
      };
    }
  } catch (e) {
    console.warn('[dailyChallengeService] RPC submit failed, executing resilient client fallback:', e);
  }

  try {
    // 1. Fetch challenge details to verify answer
    const { data: challenge } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    const targetAnswer = String(challenge?.correct_answer || '').trim().toLowerCase();
    const studentAnswerClean = String(userAnswer || '').trim().toLowerCase();

    const isCorrect = targetAnswer !== '' && (targetAnswer === studentAnswerClean || studentAnswerClean.includes(targetAnswer));
    const score = isCorrect ? 100 : 0;
    const xpEarned = isCorrect ? challenge?.xp_reward || 20 : 0;

    if (userId && challengeId) {
      // 2. Record Attempt
      await supabase.from('daily_challenge_attempts').upsert({
        challenge_id: challengeId,
        user_id: userId,
        selected_answer: userAnswer,
        score,
        is_correct: isCorrect,
        xp_earned: xpEarned,
      });

      if (isCorrect) {
        // 3. Upsert Progress
        await supabase.from('student_challenge_progress').upsert({
          student_id: userId,
          challenge_id: challengeId,
          status: 'Completed',
          score,
          xp_earned: xpEarned,
        });

        // 4. Award Activity
        const todayStr = new Date().toISOString().split('T')[0];
        await awardActivity(userId, 'daily_challenge', 20, xpEarned, `challenge_${challengeId}_${todayStr}`);
      }
    }

    return {
      isCorrect,
      score,
      xpEarned,
      correctAnswer: challenge?.correct_answer || '',
      explanation: challenge?.explanation || 'Standard challenge solution explanation.',
      currentStreak: 1,
    };
  } catch (e) {
    console.error('submitChallengeAttempt exception:', e);
    return {
      isCorrect: false,
      score: 0,
      xpEarned: 0,
      correctAnswer: '',
      explanation: 'Submission failed. Please try again.',
      currentStreak: 0,
    };
  }
}

// 5. Super Admin API — Create Challenge
export async function adminCreateChallenge(challenge: Partial<DailyChallenge>) {
  try {
    const payload = {
      title: challenge.title,
      description: challenge.description,
      category: challenge.category || 'Programming',
      subcategory: challenge.subcategory || 'General',
      challenge_type: challenge.challenge_type || 'mcq',
      difficulty: challenge.difficulty || 'Medium',
      xp_reward: challenge.xp_reward || 20,
      estimated_minutes: challenge.estimated_minutes || 5,
      question: challenge.question,
      options: JSON.stringify(challenge.options || []),
      correct_answer: challenge.correct_answer,
      explanation: challenge.explanation,
      code_snippet: challenge.code_snippet || null,
      status: challenge.status || 'Published',
      target_branch: challenge.target_branch || 'All',
      target_year: challenge.target_year || 'All',
    };

    const { data, error } = await supabase.from('daily_challenges').insert(payload).select().single();
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

function getFallbackChallenge(): DailyChallenge {
  return {
    id: 'dc-fallback-1',
    title: 'Solve a Java Array & Queue Problem',
    description: 'Master the fundamental FIFO principle used in system task scheduling and message queues.',
    category: 'Programming',
    subcategory: 'Data Structures',
    challenge_type: 'mcq',
    difficulty: 'Medium',
    xp_reward: 20,
    estimated_minutes: 5,
    question: 'Which fundamental data structure uses the First In First Out (FIFO) principle?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    correct_answer: 'Queue',
    explanation: 'A Queue operates on the First-In First-Out (FIFO) principle, where the first element added is the first one processed.',
    code_snippet: 'Queue<String> tasks = new LinkedList<>();\ntasks.add("Task1");\ntasks.add("Task2");\nSystem.out.println(tasks.poll()); // Task1',
    status: 'Published',
    completed_today: false,
  };
}
