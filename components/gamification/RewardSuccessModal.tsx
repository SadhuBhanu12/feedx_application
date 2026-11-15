import React from 'react';
import RewardEarnedPopup from './RewardEarnedPopup';
import { rewardService, AwardRewardResult } from '@/services/rewardService';
import { useGamification } from '@/context/GamificationContext';

interface RewardSuccessModalProps {
  visible: boolean;
  activityType?: string;
  coinsEarned: number;
  title?: string;
  message?: string;
  onClose: () => void;
}

export default function RewardSuccessModal({
  visible,
  activityType = 'quiz_completed',
  coinsEarned,
  title,
  message,
  onClose,
}: RewardSuccessModalProps) {
  const { streak } = useGamification();
  const config = rewardService.getRewardConfig(activityType, false, coinsEarned);
  const currentTokens = streak?.xp_points || 0;

  const mockData: AwardRewardResult = {
    success: true,
    pointsAwarded: coinsEarned || config.defaultPoints,
    previousPoints: Math.max(0, currentTokens - (coinsEarned || config.defaultPoints)),
    newPoints: currentTokens,
    dailyGoal: 140,
    dailyGoalReached: currentTokens >= 140,
    streakMaintained: true,
    currentStreak: streak?.current_streak || 1,
    alreadyEarned: false,
    tier: config.tier,
    sourceLabel: config.sourceLabel,
    activityName: title || config.activityName,
  };

  return (
    <RewardEarnedPopup
      visible={visible}
      data={mockData}
      onClose={onClose}
    />
  );
}
