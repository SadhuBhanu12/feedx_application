import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './UserContext';
import { storage } from '@/store/storage';
import {
  StudentWallet,
  DailyStreak,
  RewardItem,
  CoinTransaction,
  UserRedemption,
  fetchStudentWallet,
  fetchDailyStreak,
  fetchRewardCatalog,
  fetchCoinTransactions,
  fetchUserRedemptions,
  completeDailyLoginTask,
  awardActivity,
  redeemReward,
  convertTokensToGoldCoins,
  getCalendarDateString
} from '@/services/gamificationService';
import { rewardService, AwardRewardParams, AwardRewardResult } from '@/services/rewardService';
import { DAILY_TARGET_TOKENS, OFFICIAL_REWARDS } from '@/constants/rewardConfig';
import { rewardNotificationManager, RewardNotificationItem } from '@/services/RewardNotificationManager';
import RewardEarnedPopup from '@/components/gamification/RewardEarnedPopup';

function getInitialWallet(user: any): StudentWallet | null {
  if (!user?.id) return null;
  const cached = storage.getString(`gamification_wallet_${user.id}`);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed.gold_coins === 'number') return parsed;
    } catch (_) { }
  }
  const coins = user.gold_coins ?? user.coins ?? 0;
  return {
    student_id: user.id,
    tokens: coins,
    gold_coins: coins,
    total_earned: coins,
    total_redeemed: 0,
    updated_at: new Date().toISOString(),
  };
}

function getInitialStreak(user: any): DailyStreak | null {
  if (!user?.id) return null;
  const cached = storage.getString(`gamification_streak_${user.id}`);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed.current_streak === 'number') return parsed;
    } catch (_) { }
  }
  const streakCount = user.streak_count !== undefined ? user.streak_count : (user.streak ?? 0);
  const longestStreak = user.max_streak !== undefined ? user.max_streak : (user.longest_streak !== undefined ? user.longest_streak : streakCount);
  const totalActive = user.total_active_days !== undefined ? user.total_active_days : (streakCount > 0 ? 1 : 0);
  const xp = user.xp_points ?? user.xp ?? 0;
  return {
    student_id: user.id,
    current_streak: streakCount,
    longest_streak: longestStreak,
    total_active_days: totalActive,
    last_active_date: user.last_active_at || (streakCount > 0 ? new Date().toISOString() : ''),
    streak_freeze_count: 1,
    xp_points: xp,
    activity_history: {},
    updated_at: new Date().toISOString(),
  };
}

interface GamificationContextType {
  wallet: StudentWallet | null;
  streak: DailyStreak | null;
  catalog: RewardItem[];
  transactions: CoinTransaction[];
  redemptions: UserRedemption[];
  todayPoints: number;
  dailyGoal: number;
  loading: boolean;
  refreshGamification: () => Promise<void>;
  triggerReward: (params: AwardRewardParams) => Promise<AwardRewardResult>;
  triggerActivity: (activityType: string, coinReward?: number, xpReward?: number, referenceId?: string, skipPopup?: boolean) => Promise<any>;
  completeDailyLogin: () => Promise<any>;
  redeemCatalogItem: (rewardId: string) => Promise<{ success: boolean; message?: string; certificate_id?: string }>;
  convertTokensToGold: () => Promise<{ success: boolean; message: string }>;
  showRewardModal: (coinsEarned: number, activityType?: string, title?: string, message?: string) => void;
}

const GamificationContext = createContext<GamificationContextType>({
  wallet: null,
  streak: null,
  catalog: [],
  transactions: [],
  redemptions: [],
  todayPoints: 0,
  dailyGoal: 140,
  loading: false,
  refreshGamification: async () => { },
  triggerReward: async () => ({
    success: false,
    pointsAwarded: 0,
    previousPoints: 0,
    newPoints: 0,
    dailyGoal: 140,
    dailyGoalReached: false,
    streakMaintained: false,
    currentStreak: 1,
    alreadyEarned: false,
    tier: 'standard',
    sourceLabel: 'Activity',
    activityName: 'Activity Completed',
  }),
  triggerActivity: async () => ({ success: false }),
  completeDailyLogin: async () => ({ success: false }),
  redeemCatalogItem: async () => ({ success: false }),
  convertTokensToGold: async () => ({ success: false, message: '' }),
  showRewardModal: () => { },
});

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser } = useUser();
  const [wallet, setWallet] = useState<StudentWallet | null>(() => getInitialWallet(user));
  const [streak, setStreak] = useState<DailyStreak | null>(() => getInitialStreak(user));
  const [catalog, setCatalog] = useState<RewardItem[]>([]);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [redemptions, setRedemptions] = useState<UserRedemption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Sync initial state if user finishes loading
  useEffect(() => {
    if (user?.id) {
      setWallet((prev: StudentWallet | null) => prev || getInitialWallet(user));
      setStreak((prev: DailyStreak | null) => prev || getInitialStreak(user));
    }
  }, [user?.id, user?.gold_coins, user?.streak_count, user?.max_streak]);

  // Active notification queue state
  const [activeNotification, setActiveNotification] = useState<RewardNotificationItem | null>(null);

  // Subscribe to Global RewardNotificationManager
  useEffect(() => {
    const unsubscribe = rewardNotificationManager.subscribe((item) => {
      setActiveNotification(item);
    });
    return () => unsubscribe();
  }, []);

  const refreshGamification = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [wData, sData, cData, tData, rData] = await Promise.all([
        fetchStudentWallet(user.id),
        fetchDailyStreak(user.id),
        fetchRewardCatalog(),
        fetchCoinTransactions(user.id),
        fetchUserRedemptions(user.id)
      ]);

      if (wData && sData) {
        if (wData.tokens === undefined || wData.tokens === null) {
          wData.tokens = sData.xp_points;
        }
      }
      if (wData) {
        setWallet(wData);
        try { storage.set(`gamification_wallet_${user.id}`, JSON.stringify(wData)); } catch (_) { }
      }
      if (sData) {
        setStreak(sData);
        try { storage.set(`gamification_streak_${user.id}`, JSON.stringify(sData)); } catch (_) { }
      }
      if (cData) setCatalog(cData);
      if (tData) setTransactions(tData);
      if (rData) setRedemptions(rData);

      // Keep UserContext user profile synchronized with fresh wallet & streak
      if (setUser && wData && sData) {
        setUser((prev: any) => ({
          ...(prev || user || {}),
          tokens: wData.tokens,
          gold_coins: wData.gold_coins,
          coins: wData.gold_coins,
          streak_count: sData.current_streak,
          streak: sData.current_streak,
          max_streak: sData.longest_streak,
          longest_streak: sData.longest_streak,
          total_active_days: sData.total_active_days,
          xp_points: sData.xp_points,
          xp: sData.xp_points,
        }));
      }
    } catch (e) {
      console.warn('[GamificationContext] refresh failed quietly:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id, setUser]);

  // Initial load + Realtime Sync (Streak only advances upon completing a qualifying activity)
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;
    const init = async () => {
      await refreshGamification();
    };

    init();

    // Set up Realtime Sync for Gamification tables
    const channel = supabase
      .channel(`gamification-realtime-${user.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_wallets', filter: `student_id=eq.${user.id}` },
        (payload: any) => {
          if (payload.new && isMounted) {
            const newWallet = payload.new as StudentWallet;
            const updatedTokens = newWallet.tokens !== undefined && newWallet.tokens !== null ? Number(newWallet.tokens) : 0;
            setWallet((prev: StudentWallet | null) => ({
              ...(prev || { student_id: user.id, gold_coins: 0, total_earned: 0, total_redeemed: 0, updated_at: '' }),
              ...newWallet,
              tokens: updatedTokens,
            }));
            try { storage.set(`gamification_wallet_${user.id}`, JSON.stringify({ ...newWallet, tokens: updatedTokens })); } catch (_) { }
            if (setUser) {
              setUser((prevUser: any) => ({
                ...(prevUser || user),
                tokens: updatedTokens,
                gold_coins: newWallet.gold_coins,
                coins: newWallet.gold_coins,
              }));
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_streaks', filter: `student_id=eq.${user.id}` },
        (payload: any) => {
          if (payload.new && isMounted) {
            const newStreak = payload.new as DailyStreak;
            setStreak(newStreak);
            try { storage.set(`gamification_streak_${user.id}`, JSON.stringify(newStreak)); } catch (_) { }
            if (setUser) {
              setUser((prevUser: any) => ({
                ...(prevUser || user),
                streak_count: newStreak.current_streak,
                streak: newStreak.current_streak,
                max_streak: newStreak.longest_streak,
                longest_streak: newStreak.longest_streak,
                total_active_days: newStreak.total_active_days,
                xp_points: newStreak.xp_points,
                xp: newStreak.xp_points,
              }));
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'coin_transactions', filter: `student_id=eq.${user.id}` },
        (payload: any) => {
          if (payload.new && isMounted) {
            setTransactions((prev) => [payload.new as CoinTransaction, ...prev.filter((t) => t.id !== payload.new.id)]);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reward_catalog' },
        (payload: any) => {
          if (payload.new && isMounted) {
            setCatalog((prev) =>
              prev.map((item) => (item.id === payload.new.id ? (payload.new as RewardItem) : item))
            );
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, refreshGamification]);

  /**
   * Unified Reward Trigger Method
   * Executes atomic backend reward transaction, updates state instantly, and enqueues notification popup.
   */
  const triggerReward = useCallback(
    async (params: AwardRewardParams): Promise<AwardRewardResult> => {
      const uId = params.userId || user?.id;
      if (!uId) {
        const fallbackRes: AwardRewardResult = {
          success: false,
          pointsAwarded: 0,
          previousPoints: 0,
          newPoints: 0,
          dailyGoal: DAILY_TARGET_TOKENS,
          dailyGoalReached: false,
          streakMaintained: false,
          currentStreak: 1,
          alreadyEarned: false,
          tier: 'standard',
          sourceLabel: 'Activity',
          activityName: 'Activity Completed',
          errorMessage: 'User not logged in',
        };
        return fallbackRes;
      }

      const pts = params.points !== undefined && params.points > 0
        ? params.points
        : rewardService.getRewardConfig(params.activityType, false, params.points).defaultPoints;

      // 1. Persist the reward atomically via awardActivity
      const actRes = await awardActivity(
        uId,
        params.activityType || 'daily_task',
        pts,
        pts,
        params.referenceId || undefined
      );

      const config = rewardService.getRewardConfig(params.activityType, false, pts);

      if (actRes.already_earned && !params.forcePopup) {
        return {
          success: true,
          pointsAwarded: 0,
          previousPoints: streak?.xp_points || 0,
          newPoints: streak?.xp_points || 0,
          dailyGoal: DAILY_TARGET_TOKENS,
          dailyGoalReached: (streak?.xp_points || 0) >= DAILY_TARGET_TOKENS,
          streakMaintained: true,
          currentStreak: actRes.current_streak || streak?.current_streak || 1,
          alreadyEarned: true,
          tier: config.tier,
          sourceLabel: config.sourceLabel,
          activityName: config.activityName,
        };
      }

      const pointsAwarded = actRes.tokens_awarded || pts;
      const currentStreak = actRes.current_streak || streak?.current_streak || 1;

      // 2. Build authoritative result object
      const rewardResult: AwardRewardResult = {
        success: true,
        pointsAwarded,
        previousPoints: streak?.xp_points || 0,
        newPoints: (streak?.xp_points || 0) + pointsAwarded,
        dailyGoal: DAILY_TARGET_TOKENS,
        dailyGoalReached: ((streak?.xp_points || 0) + pointsAwarded) >= DAILY_TARGET_TOKENS,
        streakMaintained: true,
        currentStreak,
        alreadyEarned: false,
        tier: config.tier,
        sourceLabel: config.sourceLabel,
        activityName: params.activityName || config.activityName,
        scoreText: params.scoreText,
      };

      // Queue visual celebratory modal popup only if not explicitly suppressed
      if (!params.skipPopup) {
        rewardNotificationManager.enqueue(rewardResult);
      }

      // 3. Spontaneous UI state updates
      setStreak((prev: DailyStreak | null) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          xp_points: (prev.xp_points || 0) + pointsAwarded,
          current_streak: currentStreak,
          longest_streak: actRes.longest_streak || Math.max(prev.longest_streak || 1, currentStreak),
          last_active_date: getCalendarDateString(),
        };
        try { storage.set(`gamification_streak_${uId}`, JSON.stringify(updated)); } catch (_) {}
        return updated;
      });

      setWallet((prev: StudentWallet | null) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          tokens: actRes.new_tokens !== undefined ? actRes.new_tokens : ((prev.tokens || 0) + pointsAwarded),
          total_earned: (prev.total_earned || 0) + pointsAwarded,
        };
        try { storage.set(`gamification_wallet_${uId}`, JSON.stringify(updated)); } catch (_) {}
        return updated;
      });

      if (setUser && user) {
        const finalTokens = actRes.new_tokens !== undefined ? actRes.new_tokens : ((wallet?.tokens || user?.tokens || 0) + pointsAwarded);
        const finalCoins = actRes.new_coins !== undefined ? actRes.new_coins : (wallet?.gold_coins ?? user?.gold_coins ?? user?.coins ?? 0);
        setUser((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            tokens: finalTokens,
            gold_coins: finalCoins,
            coins: finalCoins,
            xp_points: (prev?.xp_points || 0) + pointsAwarded,
            xp: (prev?.xp || 0) + pointsAwarded,
            streak_count: currentStreak,
            streak: currentStreak,
          };
        });
      }

      // 4. Background refresh to keep server cache synchronized
      refreshGamification().catch((err) => console.warn('[GamificationContext] background refresh warning:', err));

      return rewardResult;
    },
    [user, setUser, streak, refreshGamification]
  );

  /**
   * Legacy triggerActivity mapping to unified triggerReward
   */
  const triggerActivity = useCallback(
    async (
      activityType: string,
      coinReward: number = 0,
      xpReward: number = 0,
      referenceId: string | null = null,
      skipPopup: boolean = false
    ) => {
      if (!user?.id) return { success: false };
      const earnedPts = Math.max(coinReward, xpReward, 0);
      const result = await triggerReward({
        userId: user.id,
        activityType,
        points: earnedPts > 0 ? earnedPts : undefined,
        referenceId: referenceId || undefined,
        skipPopup,
      });
      return {
        success: result.success,
        already_earned: result.alreadyEarned,
        tokens_awarded: result.pointsAwarded,
        current_streak: result.currentStreak,
      };
    },
    [user?.id, triggerReward]
  );

  const showRewardModal = useCallback(
    (coinsEarned: number, activityType: string = 'quiz_completed', title?: string, message?: string) => {
      if (!user?.id) return;
      triggerReward({
        userId: user.id,
        activityType,
        points: coinsEarned,
        activityName: title,
      });
    },
    [user?.id, triggerReward]
  );

  const completeDailyLogin = useCallback(async () => {
    if (!user?.id) return { success: false };
    const todayStr = getCalendarDateString();
    const refId = `daily_login_${todayStr}`;
    const res = await triggerReward({
      userId: user.id,
      activityType: 'daily_login',
      points: OFFICIAL_REWARDS.DAILY_LOGIN,
      referenceId: refId,
      activityName: 'Daily Check-in Completed',
      source: 'daily_task',
    });
    return {
      success: res.success,
      task_completed: true,
      already_completed: res.alreadyEarned,
      tokens_awarded: res.pointsAwarded,
      current_streak: res.currentStreak,
    };
  }, [user?.id, triggerReward]);

  const redeemCatalogItem = useCallback(async (rewardId: string) => {
    if (!user?.id) return { success: false, message: 'User not logged in' };
    const res = await redeemReward(user.id, rewardId);
    if (res.success) {
      await refreshGamification();
    }
    return res;
  }, [user?.id, refreshGamification]);

  const convertTokensToGold = useCallback(async (tokensToConvert?: number) => {
    if (!user?.id) return { success: false, message: 'User not logged in' };
    const res = await convertTokensToGoldCoins(user.id, tokensToConvert);
    if (res.success) {
      if (res.new_tokens !== undefined && res.new_gold_coins !== undefined) {
        setWallet((prev) => prev ? {
          ...prev,
          tokens: res.new_tokens!,
          gold_coins: res.new_gold_coins!,
        } : null);
        if (setUser) {
          setUser((prev: any) => prev ? {
            ...prev,
            tokens: res.new_tokens,
            gold_coins: res.new_gold_coins,
            coins: res.new_gold_coins,
          } : null);
        }
      }
      await refreshGamification();
    }
    return res;
  }, [user?.id, refreshGamification, setUser]);

  const getTodayStr = () => {
    return getCalendarDateString();
  };

  const isToday = (t: { created_at?: string; reference_id?: string | null }) => {
    const todayStr = getTodayStr();
    const utcDateStr = new Date().toISOString().split('T')[0];
    if (t.reference_id && (t.reference_id.includes(todayStr) || t.reference_id.includes(utcDateStr))) return true;
    if (!t.created_at) return false;
    try {
      const txDate = new Date(t.created_at);
      const yyyy = txDate.getFullYear();
      const mm = String(txDate.getMonth() + 1).padStart(2, '0');
      const dd = String(txDate.getDate()).padStart(2, '0');
      const formatted = `${yyyy}-${mm}-${dd}`;
      return formatted === todayStr || formatted === utcDateStr;
    } catch (e) {
      return false;
    }
  };

  const dailyGoal = DAILY_TARGET_TOKENS;

  const todayPoints = React.useMemo(() => {
    const todayStr = getTodayStr();
    let pts = 0;

    if (transactions && transactions.length > 0) {
      const todayTransactions = transactions.filter(isToday);

      todayTransactions.forEach((t) => {
        const type = (t.activity_type || '').toLowerCase();
        let amt = typeof t.amount === 'number' && t.amount > 0 ? t.amount : 0;
        if (amt === 0) {
          if (type.includes('login') || type.includes('checkin')) amt = OFFICIAL_REWARDS.DAILY_LOGIN;
          else if (type.includes('quiz')) amt = OFFICIAL_REWARDS.DAILY_QUIZ;
          else if (type.includes('roadmap') || type.includes('phase')) amt = OFFICIAL_REWARDS.ROADMAP;
          else if (type.includes('quick') || type.includes('read')) amt = OFFICIAL_REWARDS.QUICK_LEARN;
          else if (type.includes('task') || type.includes('challenge')) amt = OFFICIAL_REWARDS.DAILY_TASK;
          else amt = 10;
        }
        pts += amt;
      });
    }

    if (streak?.last_active_date && streak.last_active_date.startsWith(todayStr)) {
      if (pts === 0) {
        pts = OFFICIAL_REWARDS.DAILY_LOGIN;
      }
    }

    // Check cached daily challenges if transactions aren't fetched yet
    let challengePts = 0;
    try {
      const raw = storage.getString(`@feedx_daily_challenges_${todayStr}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.daily_login || parsed.streak_checkin) challengePts += 10;
        if (parsed.home_daily_quick_learn || parsed.resource_read || parsed.explore_quick_learn) challengePts += 50;
        if (parsed.home_daily_quiz || parsed.quiz_completed || parsed.explore_quiz || parsed.daily_quiz) challengePts += 50;
        if (parsed.roadmap_completed || parsed.roadmap_task) challengePts += 40;
      }
    } catch (_) {}

    return Math.max(pts, challengePts);
  }, [transactions, streak?.last_active_date]);

  const value = React.useMemo(() => ({
    wallet,
    streak,
    catalog,
    transactions,
    redemptions,
    todayPoints,
    dailyGoal,
    loading,
    refreshGamification,
    triggerReward,
    triggerActivity,
    completeDailyLogin,
    redeemCatalogItem,
    convertTokensToGold,
    showRewardModal,
  }), [
    wallet,
    streak,
    catalog,
    transactions,
    redemptions,
    todayPoints,
    dailyGoal,
    loading,
    refreshGamification,
    triggerReward,
    triggerActivity,
    completeDailyLogin,
    redeemCatalogItem,
    convertTokensToGold,
    showRewardModal,
  ]);

  return (
    <GamificationContext.Provider value={value}>
      {children}

      {/* Global Unified Reward Notification Popup */}
      <RewardEarnedPopup
        visible={activeNotification !== null}
        data={activeNotification?.result || null}
        onClose={() => rewardNotificationManager.dismissCurrent()}
      />
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);
