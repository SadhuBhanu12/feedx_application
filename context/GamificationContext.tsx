import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useUser } from './UserContext';
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
  awardActivity,
  completeDailyLoginTask,
  redeemReward,
  convertTokensToGoldCoins
} from '@/services/gamificationService';

interface GamificationContextType {
  wallet: StudentWallet | null;
  streak: DailyStreak | null;
  catalog: RewardItem[];
  transactions: CoinTransaction[];
  redemptions: UserRedemption[];
  loading: boolean;
  refreshGamification: () => Promise<void>;
  triggerActivity: (activityType: string, coinReward?: number, xpReward?: number, referenceId?: string) => Promise<any>;
  completeDailyLogin: () => Promise<any>;
  redeemCatalogItem: (rewardId: string) => Promise<{ success: boolean; message?: string; certificate_id?: string }>;
  convertTokensToGold: () => Promise<{ success: boolean; message: string }>;
}

const GamificationContext = createContext<GamificationContextType>({
  wallet: null,
  streak: null,
  catalog: [],
  transactions: [],
  redemptions: [],
  loading: false,
  refreshGamification: async () => {},
  triggerActivity: async () => ({ success: false }),
  completeDailyLogin: async () => ({ success: false }),
  redeemCatalogItem: async () => ({ success: false }),
  convertTokensToGold: async () => ({ success: false, message: '' }),
});

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser } = useUser();
  const [wallet, setWallet] = useState<StudentWallet | null>(null);
  const [streak, setStreak] = useState<DailyStreak | null>(null);
  const [catalog, setCatalog] = useState<RewardItem[]>([]);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [redemptions, setRedemptions] = useState<UserRedemption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshGamification = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [wData, sData, cData, tData, rData] = await Promise.all([
        fetchStudentWallet(user.id),
        fetchDailyStreak(user.id),
        fetchRewardCatalog(),
        fetchCoinTransactions(user.id),
        fetchUserRedemptions(user.id)
      ]);

      if (wData) setWallet(wData);
      if (sData) setStreak(sData);
      if (cData) setCatalog(cData);
      if (tData) setTransactions(tData);
      if (rData) setRedemptions(rData);
    } catch (e) {
      console.warn('[GamificationContext] refresh failed quietly:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial load & Daily Login trigger + Realtime Sync
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;
    const init = async () => {
      await refreshGamification();
    };

    init();

    // Set up Realtime Sync for Gamification tables
    const channel = supabase
      .channel(`gamification-realtime-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_wallets', filter: `student_id=eq.${user.id}` },
        (payload: any) => {
          if (payload.new && isMounted) {
            setWallet(payload.new as StudentWallet);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_streaks', filter: `student_id=eq.${user.id}` },
        (payload: any) => {
          if (payload.new && isMounted) {
            setStreak(payload.new as DailyStreak);
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

  const triggerActivity = async (
    activityType: string,
    coinReward: number = 0,
    xpReward: number = 0,
    referenceId: string | null = null
  ) => {
    if (!user?.id) return { success: false };
    const res = await awardActivity(user.id, activityType, coinReward, xpReward, referenceId);
    if (res.success) {
      const updatedWallet = await fetchStudentWallet(user.id);
      const updatedStreak = await fetchDailyStreak(user.id);
      setWallet(updatedWallet);
      setStreak(updatedStreak);
      if (setUser && user) {
        setUser({
          ...user,
          tokens: updatedWallet.tokens,
          gold_coins: updatedWallet.gold_coins,
          coins: updatedWallet.gold_coins,
          xp_points: updatedStreak.xp_points,
        });
      }
      await refreshGamification();
    }
    return res;
  };

  const completeDailyLogin = async () => {
    if (!user?.id) return { success: false };
    const res = await completeDailyLoginTask(user.id);
    if (res.success) {
      await refreshGamification();
    }
    return res;
  };

  const redeemCatalogItem = async (rewardId: string) => {
    if (!user?.id) return { success: false, message: 'User not logged in' };
    const res = await redeemReward(user.id, rewardId);
    if (res.success) {
      const updatedWallet = await fetchStudentWallet(user.id);
      setWallet(updatedWallet);
      if (setUser && user) {
        setUser({
          ...user,
          tokens: updatedWallet.tokens,
          gold_coins: updatedWallet.gold_coins,
          coins: updatedWallet.gold_coins,
        });
      }
      await refreshGamification();
    }
    return res;
  };

  const convertTokensToGold = async (tokensToConvert?: number) => {
    if (!user?.id) return { success: false, message: 'User not logged in' };
    const res = await convertTokensToGoldCoins(user.id, tokensToConvert);
    if (res.success) {
      const updatedWallet = await fetchStudentWallet(user.id);
      const updatedStreak = await fetchDailyStreak(user.id);
      setWallet(updatedWallet);
      setStreak(updatedStreak);
      if (setUser && user) {
        setUser({
          ...user,
          tokens: updatedWallet.tokens,
          gold_coins: updatedWallet.gold_coins,
          coins: updatedWallet.gold_coins,
          xp_points: updatedStreak.xp_points,
        });
      }
      await refreshGamification();
    }
    return res;
  };

  return (
    <GamificationContext.Provider
      value={{
        wallet,
        streak,
        catalog,
        transactions,
        redemptions,
        loading,
        refreshGamification,
        triggerActivity,
        completeDailyLogin,
        redeemCatalogItem,
        convertTokensToGold
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);
