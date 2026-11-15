/**
 * FEEDX Central Single Source of Truth (SSOT) Reward Configuration
 * All token and reward values across the application are derived from here.
 * 
 * Rules:
 * - Quick Learn lessons: 10 Tokens
 * - Quizzes: 10 Tokens
 * - Daily Tasks / Daily Missions: 50 Tokens
 */

export const OFFICIAL_REWARDS = {
  QUICK_LEARN: 10, // 10 tokens for Explore Page Quick Learn
  DAILY_MISSION_QUICK_LEARN: 50, // 50 tokens for Home Today's Mission Quick Learn
  EXPLORE_QUIZ: 15, // 15 tokens for Explore Page Quiz
  DAILY_QUIZ: 50, // 50 tokens for Home Today's Mission Daily Quiz
  DAILY_TASK: 50, // 50 tokens for Daily Tasks
  DAILY_LOGIN: 10, // 10 tokens for Daily Check-in
  ROADMAP: 40, // 40 tokens for Daily Roadmap Milestone (10+50+50+40 = 150)
  REFERRAL: 300,
  PROFILE_COMPLETION: 50,
} as const;

export const DAILY_TARGET_TOKENS = 150;

export const REWARD_CONFIG = {
  ACTIVE_ROADMAP_TASK: OFFICIAL_REWARDS.ROADMAP,
  QUICK_LEARN_EXPLORE: OFFICIAL_REWARDS.QUICK_LEARN, // 10 Tokens
  QUICK_LEARN_DAILY: OFFICIAL_REWARDS.DAILY_MISSION_QUICK_LEARN, // 50 Tokens
  QUICK_QUIZ_EXPLORE: OFFICIAL_REWARDS.EXPLORE_QUIZ, // 15 Tokens
  QUICK_QUIZ_DAILY: OFFICIAL_REWARDS.DAILY_QUIZ, // 50 Tokens
  DAILY_TASK: OFFICIAL_REWARDS.DAILY_TASK,
  DAILY_MAX_POINTS: DAILY_TARGET_TOKENS,
  REFERRAL_POINTS: OFFICIAL_REWARDS.REFERRAL,
  TOKENS_PER_GOLD_COIN: 1000,
  DAILY_LOGIN_STREAK: OFFICIAL_REWARDS.DAILY_LOGIN,
  DAILY_TASK_COINS: 10,
} as const;

export function getDailyRewardPoints(activityType: string): number {
  switch (activityType) {
    // 1. Home - Today's Mission: Quick Learn (50 Tokens)
    case 'home_daily_quick_learn':
    case 'daily_mission_quick_learn':
    case 'daily_quick_learn':
      return OFFICIAL_REWARDS.DAILY_MISSION_QUICK_LEARN; // 50 Tokens

    // 2. Home - Today's Mission: Daily Quiz (50 Tokens)
    case 'home_daily_quiz':
    case 'daily_mission_quiz':
    case 'daily_quiz':
    case 'daily_task_quiz':
      return OFFICIAL_REWARDS.DAILY_QUIZ; // 50 Tokens

    // 3. Explore Page: Quick Learn (10 Tokens)
    case 'explore_quick_learn':
    case 'quick_learn':
    case 'resource_read':
    case 'lesson_completed':
      return OFFICIAL_REWARDS.QUICK_LEARN; // 10 Tokens

    // 4. Explore Page: Quiz (15 Tokens)
    case 'explore_quiz':
    case 'quick_quiz':
    case 'quiz_completed':
      return OFFICIAL_REWARDS.EXPLORE_QUIZ; // 15 Tokens

    case 'daily_task':
    case 'daily_mission':
    case 'daily_task_completed':
      return OFFICIAL_REWARDS.DAILY_TASK; // 50 Tokens

    case 'roadmap_task':
    case 'roadmap_completed':
    case 'roadmap':
    case 'phase_completed':
      return OFFICIAL_REWARDS.ROADMAP; // 40 Tokens

    case 'daily_login':
    case 'streak_checkin':
    case 'daily_checkin':
      return OFFICIAL_REWARDS.DAILY_LOGIN; // 10 Tokens

    case 'referral':
      return OFFICIAL_REWARDS.REFERRAL;

    default:
      return 10;
  }
}
