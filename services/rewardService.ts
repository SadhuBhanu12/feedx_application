import { OFFICIAL_REWARDS, DAILY_TARGET_TOKENS, getDailyRewardPoints } from '@/constants/rewardConfig';

export const DAILY_POINTS_TARGET = DAILY_TARGET_TOKENS;

export interface AwardRewardParams {
  userId?: string;
  activityType?: string;
  activityId?: string;
  points?: number;
  skipPopup?: boolean;
  forcePopup?: boolean;
  scoreText?: string;
  [key: string]: any;
}

export interface AwardRewardResult {
  success: boolean;
  pointsAwarded: number;
  previousPoints: number;
  newPoints: number;
  dailyGoal: number;
  dailyGoalReached: boolean;
  streakMaintained: boolean;
  currentStreak: number;
  alreadyEarned: boolean;
  tier: string;
  sourceLabel: string;
  activityName: string;
  scoreText?: string;
  errorMessage?: string;
}

export const rewardService = {
  getRewardConfig(activityType: string = 'quiz_completed', isStreak: boolean = false, customPoints?: number) {
    const defaultPoints = customPoints !== undefined && customPoints > 0 ? customPoints : getDailyRewardPoints(activityType);
    let tier = 'standard';
    if (defaultPoints >= 50) tier = 'epic';
    else if (defaultPoints >= 25) tier = 'rare';

    let sourceLabel = 'FEEDX Activity';
    let activityName = 'Activity Completed';

    if (activityType.includes('quiz')) {
      sourceLabel = 'Daily Quiz';
      activityName = 'Quiz Challenge';
    } else if (activityType.includes('quick_learn') || activityType.includes('lesson')) {
      sourceLabel = 'Quick Learn';
      activityName = 'Concept Mastered';
    } else if (activityType.includes('task') || activityType.includes('mission')) {
      sourceLabel = 'Daily Mission';
      activityName = 'Mission Accomplished';
    } else if (activityType.includes('roadmap')) {
      sourceLabel = 'Roadmap Milestone';
      activityName = 'Skill Roadmap';
    }

    return {
      defaultPoints,
      tier,
      sourceLabel,
      activityName,
    };
  },

  async awardPoints(params: AwardRewardParams, enqueueNotification: boolean = true): Promise<AwardRewardResult> {
    const config = this.getRewardConfig(params.activityType, false, params.points);
    const pts = config.defaultPoints;
    const uId = params.userId;

    if (!uId) {
      return {
        success: false,
        pointsAwarded: 0,
        previousPoints: 0,
        newPoints: 0,
        dailyGoal: DAILY_POINTS_TARGET,
        dailyGoalReached: false,
        streakMaintained: false,
        currentStreak: 1,
        alreadyEarned: false,
        tier: config.tier,
        sourceLabel: config.sourceLabel,
        activityName: config.activityName,
        errorMessage: 'User ID missing',
      };
    }

    return {
      success: true,
      pointsAwarded: pts,
      previousPoints: 0,
      newPoints: pts,
      dailyGoal: DAILY_POINTS_TARGET,
      dailyGoalReached: pts >= DAILY_POINTS_TARGET,
      streakMaintained: true,
      currentStreak: 1,
      alreadyEarned: false,
      tier: config.tier,
      sourceLabel: config.sourceLabel,
      activityName: config.activityName,
    };
  },
};
