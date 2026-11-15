import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StudentWallet {
  student_id: string;
  tokens: number; // Spendable Gold Coins/Points
  gold_coins: number; // Spendable Gold Coins/Points (synced)
  total_earned: number;
  total_redeemed: number;
  updated_at: string;
}

export interface DailyStreak {
  student_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  streak_freeze_count: number;
  xp_points: number;
  activity_history: Record<string, boolean>;
  total_active_days?: number;
  updated_at?: string;
}

export interface CoinTransaction {
  id: string;
  student_id: string;
  amount: number;
  activity_type: string;
  reference_id?: string;
  description: string;
  created_at: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  coin_cost: number; // Priced in Gold Coins
  category: string;
  image_url?: string;
  stock: number;
  is_active: boolean;
}

export interface RewardRedemption {
  id: string;
  student_id: string;
  reward_id: string;
  coin_cost: number;
  status: 'pending' | 'fulfilled' | 'rejected';
  redeemed_at: string;
}

export interface LeaderboardUser {
  student_id: string;
  full_name: string;
  avatar_url?: string;
  branch?: string;
  gold_coins: number;
  current_streak: number;
  xp_points: number;
  rank: number;
}

// Timezone-safe calendar date helpers (SSOT)
export function getCalendarDateString(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getCalendarDaysDiff(fromDateStr: string, toDateStr: string): number {
  if (!fromDateStr || !toDateStr) return 9999;
  const [y1, m1, d1] = fromDateStr.split('-').map(Number);
  const [y2, m2, d2] = toDateStr.split('-').map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 9999;
  const utcD1 = Date.UTC(y1, m1 - 1, d1);
  const utcD2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utcD2 - utcD1) / (1000 * 60 * 60 * 24));
}

export function computeStreakUpdate(
  lastActiveDate: string | null | undefined,
  currentStreak: number = 0,
  longestStreak: number = 0,
  todayStr: string = getCalendarDateString()
): {
  newCurrentStreak: number;
  newLongestStreak: number;
  isSameDay: boolean;
  wasReset: boolean;
} {
  const curr = Math.max(0, currentStreak || 0);
  const longest = Math.max(0, longestStreak || 0);

  if (!lastActiveDate) {
    // Rule 1: First-day activity
    const newStreak = 1;
    return {
      newCurrentStreak: newStreak,
      newLongestStreak: Math.max(longest, newStreak),
      isSameDay: false,
      wasReset: false,
    };
  }

  const diffDays = getCalendarDaysDiff(lastActiveDate, todayStr);

  if (diffDays <= 0) {
    // Rule 3: Multiple activities on the same day -> streak does not increment (idempotent)
    const newStreak = Math.max(1, curr);
    return {
      newCurrentStreak: newStreak,
      newLongestStreak: Math.max(longest, newStreak),
      isSameDay: true,
      wasReset: false,
    };
  }

  if (diffDays === 1) {
    // Rule 2: Consecutive-day activity -> increment current streak by 1
    const newStreak = curr + 1;
    return {
      newCurrentStreak: newStreak,
      newLongestStreak: Math.max(longest, newStreak),
      isSameDay: false,
      wasReset: false,
    };
  }

  if (diffDays === 2) {
    // Rule 4: One missed day -> grace period preserves and increments streak
    const newStreak = curr + 1;
    return {
      newCurrentStreak: newStreak,
      newLongestStreak: Math.max(longest, newStreak),
      isSameDay: false,
      wasReset: false,
    };
  }

  // diffDays >= 3: Two or more consecutive calendar days missed -> resets to 1
  // Rule 4b & Rule 5: restarts at 1, longest streak preserved
  const newStreak = 1;
  return {
    newCurrentStreak: newStreak,
    newLongestStreak: Math.max(longest, newStreak),
    isSameDay: false,
    wasReset: true,
  };
}

// 1. Fetch Student Wallet (Authoritative tokens & gold coins from student_wallets)
export async function fetchStudentWallet(studentId: string): Promise<StudentWallet> {
  const cacheKey = `@feedx_wallet_${studentId}`;
  let localWallet: StudentWallet = {
    student_id: studentId,
    tokens: 0,
    gold_coins: 0,
    total_earned: 0,
    total_redeemed: 0,
    updated_at: new Date().toISOString(),
  };

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      localWallet = JSON.parse(cached);
    }

    const { data, error } = await supabase
      .from('student_wallets')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (!error && data) {
      const merged: StudentWallet = {
        student_id: studentId,
        tokens: data.tokens !== undefined && data.tokens !== null ? Number(data.tokens) : (localWallet.tokens || 0),
        gold_coins: data.gold_coins !== undefined && data.gold_coins !== null ? Number(data.gold_coins) : (localWallet.gold_coins || 0),
        total_earned: data.total_earned !== undefined && data.total_earned !== null ? Number(data.total_earned) : (localWallet.total_earned || 0),
        total_redeemed: data.total_redeemed !== undefined && data.total_redeemed !== null ? Number(data.total_redeemed) : (localWallet.total_redeemed || 0),
        updated_at: data.updated_at || new Date().toISOString(),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(merged));
      return merged;
    }

    if (!error && !data) {
      // Row doesn't exist yet in student_wallets. Check users table to bootstrap
      const { data: uData } = await supabase
        .from('users')
        .select('tokens, gold_coins, coins, xp_points')
        .eq('id', studentId)
        .maybeSingle();

      const bootstrapTokens = uData?.tokens ?? localWallet.tokens ?? 0;
      const bootstrapCoins = uData?.gold_coins ?? uData?.coins ?? localWallet.gold_coins ?? 0;

      const initWallet: StudentWallet = {
        student_id: studentId,
        tokens: bootstrapTokens,
        gold_coins: bootstrapCoins,
        total_earned: bootstrapTokens,
        total_redeemed: 0,
        updated_at: new Date().toISOString(),
      };

      try {
        await supabase.from('student_wallets').upsert(initWallet);
      } catch (_) {}
      await AsyncStorage.setItem(cacheKey, JSON.stringify(initWallet));
      return initWallet;
    }
  } catch (err) {
    console.warn('[GamificationService] Wallet fetch fallback:', err);
  }

  return localWallet;
}

// 2. Fetch Daily Streak State (Evaluates active status against calendar dates)
export async function fetchDailyStreak(studentId: string): Promise<DailyStreak> {
  const cacheKey = `@feedx_streak_${studentId}`;
  const todayStr = getCalendarDateString();
  let localStreak: DailyStreak = {
    student_id: studentId,
    current_streak: 1,
    longest_streak: 1,
    last_active_date: todayStr,
    streak_freeze_count: 1,
    xp_points: 0,
    activity_history: {},
  };

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      localStreak = JSON.parse(cached);
    }

    const { data, error } = await supabase
      .from('daily_streaks')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (!error && data) {
      let activeCurrentStreak = Number(data.current_streak || 0);
      const longestStreak = Math.max(Number(data.longest_streak || 0), activeCurrentStreak);
      const lastActive = data.last_active_date;

      if (lastActive) {
        const diffDays = getCalendarDaysDiff(lastActive, todayStr);
        // Rule 4: Two consecutive missed days (diffDays >= 3) break the streak until next activity restarts it at 1
        if (diffDays >= 3) {
          activeCurrentStreak = 0;
        }
      }

      const merged: DailyStreak = {
        ...data,
        current_streak: activeCurrentStreak,
        longest_streak: longestStreak,
        xp_points: Number(data.xp_points || 0),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('[GamificationService] Streak fetch fallback:', err);
  }

  return localStreak;
}

// Track RPC status to avoid redundant slow network roundtrips if SQL function has schema mismatch
let isAwardStudentActivityRpcBroken = false;

// 3. Award Activity (Awards FEEDX Tokens & Gold Coins via Atomic RPC with Client Fallback)
export async function awardActivity(
  studentId: string,
  activityType: string,
  tokenReward: number = 0,
  xpReward: number = 0,
  referenceId: string | null = null
): Promise<{
  success: boolean;
  current_streak?: number;
  longest_streak?: number;
  tokens_awarded?: number;
  coins_awarded?: number;
  xp_awarded?: number;
  new_tokens?: number;
  new_coins?: number;
  already_earned?: boolean;
}> {
  const todayStr = getCalendarDateString();
  const refId = referenceId || `${activityType}_${todayStr}`;

  // 1. Authoritative SSOT Tokens Determination
  let tokensGained = Math.max(tokenReward, xpReward, 0);
  if (['home_daily_quick_learn', 'daily_mission_quick_learn', 'daily_quick_learn'].includes(activityType)) {
    tokensGained = 50;
  } else if (['home_daily_quiz', 'daily_mission_quiz', 'daily_quiz', 'daily_task_quiz'].includes(activityType)) {
    tokensGained = 50;
  } else if (['explore_quick_learn', 'quick_learn', 'resource_read', 'lesson_completed'].includes(activityType)) {
    tokensGained = 10;
  } else if (['explore_quiz', 'quick_quiz', 'quiz_completed'].includes(activityType)) {
    tokensGained = 15;
  } else if (['daily_login', 'streak_checkin', 'daily_checkin', 'home_daily_streak'].includes(activityType)) {
    tokensGained = 10;
  } else if (['roadmap_task', 'roadmap_completed', 'phase_completed', 'home_daily_roadmap'].includes(activityType)) {
    tokensGained = 40;
  } else if (['daily_task', 'task_completed', 'task_desk', 'daily_mission'].includes(activityType)) {
    tokensGained = Math.max(tokenReward, 20);
  } else if (tokensGained <= 0) {
    tokensGained = 10;
  }

  // 2. Try atomic Supabase RPC procedure award_student_activity only if known functional
  if (!isAwardStudentActivityRpcBroken) {
    try {
      const { data, error } = await supabase.rpc('award_student_activity', {
        p_student_id: studentId,
        p_activity_type: activityType,
        p_coin_reward: 0,
        p_xp_reward: tokensGained,
        p_reference_id: refId,
      });

      if (!error && data) {
        const res = data as any;
        if (res.already_completed || res.already_earned) {
          return {
            success: true,
            already_earned: true,
            tokens_awarded: 0,
            coins_awarded: 0,
            current_streak: res.current_streak || 1,
            longest_streak: res.longest_streak || 1,
          };
        }

        // Refresh local wallet & streak concurrently
        const currentWallet = await fetchStudentWallet(studentId);
        const finalTokens = res.new_tokens !== undefined ? Number(res.new_tokens) : ((currentWallet.tokens || 0) + tokensGained);
        const updatedWallet: StudentWallet = {
          ...currentWallet,
          tokens: finalTokens,
          total_earned: (currentWallet.total_earned || 0) + tokensGained,
          updated_at: new Date().toISOString(),
        };
        await AsyncStorage.setItem(`@feedx_wallet_${studentId}`, JSON.stringify(updatedWallet));

        return {
          success: true,
          already_earned: false,
          tokens_awarded: res.tokens_awarded ?? tokensGained,
          coins_awarded: res.coins_awarded ?? 0,
          xp_awarded: res.xp_awarded ?? tokensGained,
          current_streak: res.current_streak || 1,
          longest_streak: res.longest_streak || 1,
          new_tokens: finalTokens,
          new_coins: updatedWallet.gold_coins || 0,
        };
      } else if (error) {
        if (error.code === '42703' || String(error.message || '').includes('gold_coins')) {
          isAwardStudentActivityRpcBroken = true;
        }
      }
    } catch (rpcErr: any) {
      if (String(rpcErr?.message || '').includes('gold_coins') || rpcErr?.code === '42703') {
        isAwardStudentActivityRpcBroken = true;
      }
    }
  }

  // 3. High-Speed Direct Table Synchronization (Concurrent Client-Side Fallback)
  const [currentWallet, currentTxs, currentStreakState] = await Promise.all([
    fetchStudentWallet(studentId),
    fetchCoinTransactions(studentId),
    fetchDailyStreak(studentId),
  ]);

  const isHomeQuickLearn = (type: string) =>
    ['home_daily_quick_learn', 'daily_mission_quick_learn', 'daily_quick_learn'].includes(type);
  const isHomeDailyQuiz = (type: string) =>
    ['home_daily_quiz', 'daily_mission_quiz', 'daily_quiz', 'daily_task_quiz'].includes(type);

  // Check idempotency across all alias activity types and reference keys
  const alreadyDone = currentTxs.some((t) => {
    const isMatchingType =
      t.activity_type === activityType ||
      (isHomeQuickLearn(activityType) && isHomeQuickLearn(t.activity_type)) ||
      (isHomeDailyQuiz(activityType) && isHomeDailyQuiz(t.activity_type));
    if (!isMatchingType) return false;
    if (referenceId) {
      return t.reference_id === refId || t.reference_id === referenceId;
    }
    return t.reference_id === refId || (t.created_at && (t.created_at.startsWith(todayStr) || t.created_at.includes(todayStr)));
  });

  if (alreadyDone) {
    return {
      success: true,
      already_earned: true,
      tokens_awarded: 0,
      coins_awarded: 0,
      current_streak: currentStreakState.current_streak || 1,
      longest_streak: currentStreakState.longest_streak || 1,
    };
  }

  // Compute streak update according to FeedX SSOT rules
  const streakCalc = computeStreakUpdate(
    currentStreakState.last_active_date,
    currentStreakState.current_streak,
    currentStreakState.longest_streak,
    todayStr
  );
  const newStreak = streakCalc.newCurrentStreak;
  const newLongest = streakCalc.newLongestStreak;
  const newXp = (currentStreakState.xp_points || 0) + tokensGained;

  const newWalletTokens = (currentWallet.tokens || 0) + tokensGained;
  const newTotalEarned = (currentWallet.total_earned || 0) + tokensGained;
  const currentGoldCoins = currentWallet.gold_coins || 0;

  const updatedWallet: StudentWallet = {
    ...currentWallet,
    tokens: newWalletTokens,
    gold_coins: currentGoldCoins,
    total_earned: newTotalEarned,
    updated_at: new Date().toISOString(),
  };

  const updatedStreak: DailyStreak = {
    ...currentStreakState,
    xp_points: newXp,
    current_streak: newStreak,
    longest_streak: newLongest,
    last_active_date: todayStr,
    total_active_days: (currentStreakState.total_active_days || 0) + (streakCalc.isSameDay ? 0 : 1),
    updated_at: new Date().toISOString(),
  };

  const newTx: CoinTransaction = {
    id: `act_tx_${activityType}_${Date.now()}`,
    student_id: studentId,
    amount: tokensGained,
    activity_type: activityType,
    reference_id: refId,
    description: `Earned +${tokensGained} Task Tokens for ${activityType}`,
    created_at: new Date().toISOString(),
  };

  const updatedTxs = [newTx, ...currentTxs];

  // Update AsyncStorage local caches concurrently
  await Promise.all([
    AsyncStorage.setItem(`@feedx_wallet_${studentId}`, JSON.stringify(updatedWallet)),
    AsyncStorage.setItem(`@feedx_streak_${studentId}`, JSON.stringify(updatedStreak)),
    AsyncStorage.setItem(`@feedx_transactions_${studentId}`, JSON.stringify(updatedTxs)),
  ]);

  // Persist directly to Supabase tables in parallel without blocking response
  Promise.allSettled([
    supabase.from('student_wallets').upsert({
      student_id: studentId,
      user_id: studentId,
      gold_coins: currentGoldCoins,
      tokens: newWalletTokens,
      total_earned: newTotalEarned,
      updated_at: new Date().toISOString(),
    }),
    supabase.from('daily_streaks').upsert({
      student_id: studentId,
      user_id: studentId,
      xp_points: newXp,
      current_streak: newStreak,
      longest_streak: newLongest,
      last_active_date: todayStr,
      total_active_days: updatedStreak.total_active_days,
      updated_at: new Date().toISOString(),
    }),
    supabase.from('coin_transactions').insert({
      student_id: studentId,
      user_id: studentId,
      amount: tokensGained,
      activity_type: activityType,
      reference_id: refId,
      description: `Earned +${tokensGained} Task Tokens for ${activityType}`,
    }),
    supabase.from('reward_transactions').insert({
      user_id: studentId,
      student_id: studentId,
      source_type: activityType,
      source_id: refId,
      coins: 0,
      points: tokensGained,
    }),
  ]).catch(() => {});

  return {
    success: true,
    already_earned: false,
    tokens_awarded: tokensGained,
    coins_awarded: 0,
    current_streak: newStreak,
    longest_streak: newLongest,
    new_tokens: newWalletTokens,
    new_coins: currentGoldCoins,
  };
}

// 3b. Complete Daily Login Task (Awards +10 Tokens via awardActivity)
export async function completeDailyLoginTask(
  studentId: string
): Promise<{
  success: boolean;
  task_completed?: boolean;
  already_completed?: boolean;
  tokens_awarded?: number;
  coins_awarded?: number;
  new_balance?: number;
  current_streak?: number;
}> {
  const todayStr = getCalendarDateString();

  const currentWallet = await fetchStudentWallet(studentId);
  const currentTxs = await fetchCoinTransactions(studentId);

  const alreadyDone = currentTxs.some(
    (t) => t.activity_type === 'daily_login' && (t.reference_id === todayStr || t.created_at?.startsWith(todayStr))
  );

  if (alreadyDone) {
    return {
      success: true,
      task_completed: true,
      already_completed: true,
      tokens_awarded: 0,
      coins_awarded: 0,
      new_balance: currentWallet.tokens || 0,
      current_streak: 1,
    };
  }

  // Award 10 Tokens and 0 Gold Coins
  const res = await awardActivity(studentId, 'daily_login', 0, 10, todayStr);

  return {
    success: true,
    task_completed: true,
    already_completed: false,
    tokens_awarded: 10,
    coins_awarded: 0,
    new_balance: res.new_tokens ?? ((currentWallet.tokens || 0) + 10),
    current_streak: res.current_streak || 1,
  };
}

export async function convertTokensToGoldCoins(
  studentId: string,
  tokensToConvert?: number
): Promise<{ success: boolean; message: string; new_tokens?: number; new_gold_coins?: number }> {
  try {
    // Check available balance in wallet (SSOT)
    const localWallet = await fetchStudentWallet(studentId);
    const availableTokens = localWallet.tokens || 0;
    const targetTokens = tokensToConvert && tokensToConvert > 0 ? tokensToConvert : availableTokens;

    if (targetTokens < 1000) {
      return {
        success: false,
        message: `You need at least 1,000 tokens to redeem for a Gold Coin.\n\nYour Current Balance: ${availableTokens.toLocaleString()} tokens.`
      };
    }

    if (targetTokens > availableTokens) {
      return {
        success: false,
        message: `Cannot convert ${targetTokens.toLocaleString()} tokens: you only have ${availableTokens.toLocaleString()} tokens available.`
      };
    }

    // Try atomic RPC function first
    let rpcSucceeded = false;
    let convertedTokens = 0;
    let awardedCoins = 0;
    let resultingTokens = 0;
    let resultingCoins = 0;

    try {
      const { data, error } = await supabase.rpc('convert_tokens_to_gold_coins', {
        p_student_id: studentId,
        p_tokens_to_convert: targetTokens
      });

      if (!error && data) {
        const res = data as {
          success: boolean;
          tokens_converted: number;
          coins_awarded: number;
          new_tokens: number;
          new_coins: number;
        };
        convertedTokens = res.tokens_converted;
        awardedCoins = res.coins_awarded;
        resultingTokens = res.new_tokens;
        resultingCoins = res.new_coins;
        rpcSucceeded = true;
      }
    } catch (rpcErr) {
      console.warn('[convertTokensToGoldCoins] RPC failed, using direct table fallback:', rpcErr);
    }

    // Direct table update fallback if RPC is not available or errored
    if (!rpcSucceeded) {
      awardedCoins = Math.floor(targetTokens / 1000);
      convertedTokens = awardedCoins * 1000;
      resultingTokens = availableTokens - convertedTokens;
      resultingCoins = (localWallet.gold_coins || 0) + awardedCoins;

      await supabase.from('student_wallets').upsert({
        student_id: studentId,
        tokens: resultingTokens,
        gold_coins: resultingCoins,
        total_earned: (localWallet.total_earned || 0) + awardedCoins,
        updated_at: new Date().toISOString(),
      });

      await supabase.from('coin_transactions').insert({
        student_id: studentId,
        amount: -convertedTokens,
        activity_type: 'token_conversion',
        reference_id: `conv_${Date.now()}`,
        description: `Converted ${convertedTokens.toLocaleString()} Tokens into ${awardedCoins} Gold Coin(s)`,
      });
    }

    // Keep users table in sync with wallet
    try {
      await supabase.from('users').update({
        tokens: resultingTokens,
        gold_coins: resultingCoins,
        coins: resultingCoins,
      }).eq('id', studentId);
    } catch (_) {}

    // Update local cache
    const updatedWallet: StudentWallet = {
      ...localWallet,
      tokens: resultingTokens,
      gold_coins: resultingCoins,
      total_earned: (localWallet.total_earned || 0) + awardedCoins,
      updated_at: new Date().toISOString()
    };
    await AsyncStorage.setItem(`@feedx_wallet_${studentId}`, JSON.stringify(updatedWallet));

    const localStreak = await fetchDailyStreak(studentId);
    await AsyncStorage.setItem(`@feedx_streak_${studentId}`, JSON.stringify(localStreak));

    return {
      success: true,
      message: `Successfully converted ${convertedTokens.toLocaleString()} tokens into ${awardedCoins} Gold Coin(s)! 🪙`,
      new_tokens: resultingTokens,
      new_gold_coins: resultingCoins
    };
  } catch (err: any) {
    console.error('[convertTokensToGoldCoins] error:', err);
    return {
      success: false,
      message: err.message || 'Failed to process token conversion. Please try again.'
    };
  }
}

// 4. Fetch Reward Catalog (Exact 4 Reference Rewards from Specification)
export async function fetchRewardCatalog(): Promise<RewardItem[]> {
  const EXACT_CATALOG: RewardItem[] = [
    {
      id: 'cat_5_coins',
      title: 'FEEDX VERIFIED LEARNER CERTIFICATE',
      description: 'Official verified digital learner certificate signed by FEEDX.',
      coin_cost: 5,
      category: 'certificate',
      stock: -1,
      is_active: true,
      image_url: 'certificate_verified',
    },
    {
      id: 'cat_10_coins',
      title: 'FEEDX CERTIFICATE OF EXCELLENCE',
      description: 'Official FEEDX Certificate of Excellence with Gold Seal & Special Recognition.',
      coin_cost: 10,
      category: 'certificate',
      stock: -1,
      is_active: true,
      image_url: 'certificate_giftcard_100',
    },
    {
      id: 'cat_30_coins',
      title: 'PREMIUM LEARNING BUNDLE & PASS',
      description: 'Exclusive access to premium skill modules, workshops & event passes.',
      coin_cost: 30,
      category: 'bundle',
      stock: 50,
      is_active: true,
      image_url: 'giftcard_500_merch',
    },
    {
      id: 'cat_50_coins',
      title: 'ANNUAL EXCELLENCE AWARD + GRAND PRIZE',
      description: 'Annual FEEDX Excellence Trophy, certificate & premium tech prize.',
      coin_cost: 50,
      category: 'ticket',
      stock: 10,
      is_active: true,
      image_url: 'excellence_award_trophy',
    },
  ];

  try {
    const { data, error } = await supabase
      .from('reward_catalog')
      .select('*')
      .eq('is_active', true)
      .order('coin_cost', { ascending: true });

    if (!error && data && data.length > 0) {
      // Find matching items from DB for each of the 4 defined tiers
      const finalItems: RewardItem[] = [];

      // Tier 1: 5 Coins - Verified Learner Certificate
      const db5 = data.find((d) => d.coin_cost === 5 || d.title.toLowerCase().includes('verified'));
      finalItems.push({
        id: db5?.id || 'cat_5_coins',
        title: 'FEEDX VERIFIED LEARNER CERTIFICATE',
        description: 'Official verified digital learner certificate signed by FEEDX.',
        coin_cost: 5,
        category: 'certificate',
        stock: db5?.stock ?? -1,
        is_active: true,
        image_url: 'certificate_verified',
      });

      // Tier 2: 10 Coins - Certificate of Excellence
      const db10 = data.find((d) => (d.coin_cost === 10 && d.category === 'certificate') || d.title.toLowerCase().includes('excellence certificate'));
      finalItems.push({
        id: db10?.id || 'cat_10_coins',
        title: 'FEEDX CERTIFICATE OF EXCELLENCE',
        description: 'Official FEEDX Certificate of Excellence with Gold Seal & Special Recognition.',
        coin_cost: 10,
        category: 'certificate',
        stock: db10?.stock ?? -1,
        is_active: true,
        image_url: 'certificate_giftcard_100',
      });

      // Tier 3: 30 Coins - Premium Learning Bundle & Pass
      const db30 = data.find((d) => d.coin_cost === 30 || d.title.toLowerCase().includes('bundle'));
      finalItems.push({
        id: db30?.id || 'cat_30_coins',
        title: 'PREMIUM LEARNING BUNDLE & PASS',
        description: 'Exclusive access to premium skill modules, workshops & event passes.',
        coin_cost: 30,
        category: 'bundle',
        stock: db30?.stock ?? 50,
        is_active: true,
        image_url: 'giftcard_500_merch',
      });

      // Tier 4: 50 Coins - Annual Excellence Award + Grand Prize
      const db50 = data.find((d) => d.coin_cost === 50 && (d.title.toLowerCase().includes('grand prize') || d.category === 'ticket')) ||
        data.find((d) => d.coin_cost === 50);
      finalItems.push({
        id: db50?.id || 'cat_50_coins',
        title: 'ANNUAL EXCELLENCE AWARD + GRAND PRIZE',
        description: 'Annual FEEDX Excellence Trophy, certificate & premium tech prize.',
        coin_cost: 50,
        category: 'ticket',
        stock: db50?.stock ?? 10,
        is_active: true,
        image_url: 'excellence_award_trophy',
      });

      return finalItems;
    }
  } catch (err) {
    console.warn('Failed to fetch reward catalog from database:', err);
  }

  return EXACT_CATALOG;
}

// 5. Fetch Coin Transactions Ledger
export async function fetchCoinTransactions(studentId: string): Promise<CoinTransaction[]> {
  const cacheKey = `@feedx_transactions_${studentId}`;
  let localTxs: CoinTransaction[] = [];

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      localTxs = JSON.parse(cached);
    }
  } catch (err) {}

  try {
    const { data, error } = await supabase
      .from('coin_transactions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data && data.length > 0) {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      return data as CoinTransaction[];
    }
  } catch (err) {
    console.warn('[GamificationService] fetchCoinTransactions DB fallback:', err);
  }

  return localTxs;
}

export interface UserRedemption {
  id: string;
  student_id: string;
  reward_id: string;
  coin_cost: number;
  status: string;
  certificate_id?: string;
  created_at: string;
}

export async function fetchUserRedemptions(studentId: string): Promise<UserRedemption[]> {
  const cacheKey = `@feedx_redemptions_${studentId}`;
  try {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .select('*')
      .eq('student_id', studentId);

    if (!error && data) {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      return data as UserRedemption[];
    }
  } catch (err) {
    console.warn('[GamificationService] fetchUserRedemptions error:', err);
  }

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (_) {}

  return [];
}

// 6. Redeem Reward Item (Deducts Gold Coins)
export async function redeemReward(
  studentId: string,
  rewardId: string
): Promise<{ success: boolean; message?: string; certificate_id?: string }> {
  try {
    const catalog = await fetchRewardCatalog();
    const item = catalog.find((i) => i.id === rewardId);

    if (!item) {
      return { success: false, message: 'Reward item not found' };
    }

    const isFallbackId = rewardId.startsWith('cat_');

    if (isFallbackId) {
      // Offline/local fallback logic
      const localWallet = await fetchStudentWallet(studentId);
      if ((localWallet.gold_coins || 0) < item.coin_cost) {
        return { success: false, message: `Insufficient Gold Coins. You need ${item.coin_cost} Gold Coins to redeem this item.` };
      }
      const newCoins = localWallet.gold_coins - item.coin_cost;
      const updatedWallet: StudentWallet = {
        ...localWallet,
        gold_coins: newCoins,
        total_redeemed: (localWallet.total_redeemed || 0) + item.coin_cost,
        updated_at: new Date().toISOString(),
      };
      await AsyncStorage.setItem(`@feedx_wallet_${studentId}`, JSON.stringify(updatedWallet));
      return { success: true, message: `Successfully redeemed ${item.title}!` };
    }

    // Call atomic RPC function in Database
    const { data, error } = await supabase.rpc('redeem_reward', {
      p_student_id: studentId,
      p_reward_id: rewardId
    });

    if (error) {
      console.warn('[redeemReward] RPC failed:', error);
      return { success: false, message: error.message || 'Redemption failed.' };
    }

    const res = data as {
      success: boolean;
      redemption_id: string;
      coins_spent: number;
      reward_title: string;
      certificate_id?: string;
    };

    // Update local cache
    const localWallet = await fetchStudentWallet(studentId);
    const newCoins = (localWallet.gold_coins || 0) - res.coins_spent;
    const updatedWallet: StudentWallet = {
      ...localWallet,
      gold_coins: newCoins,
      total_redeemed: (localWallet.total_redeemed || 0) + res.coins_spent,
      updated_at: new Date().toISOString(),
    };

    const newTx: CoinTransaction = {
      id: res.redemption_id,
      student_id: studentId,
      amount: -res.coins_spent,
      activity_type: 'redemption',
      reference_id: rewardId,
      description: `Redeemed reward: ${res.reward_title}`,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('users').update({
        gold_coins: newCoins,
        coins: newCoins,
      }).eq('id', studentId);
    } catch (_) {}

    const currentTxs = await fetchCoinTransactions(studentId);
    await AsyncStorage.setItem(`@feedx_wallet_${studentId}`, JSON.stringify(updatedWallet));
    await AsyncStorage.setItem(`@feedx_transactions_${studentId}`, JSON.stringify([newTx, ...currentTxs]));

    return { 
      success: true, 
      message: `Successfully redeemed ${res.reward_title}!`,
      certificate_id: res.certificate_id
    };
  } catch (err: any) {
    console.error('[GamificationService] redeemReward exception:', err);
    return { success: false, message: err.message || 'Redemption failed.' };
  }
}

// 7. Fetch Leaderboard Users
export async function fetchLeaderboard(timeframe?: string): Promise<LeaderboardUser[]> {
  return [
    { student_id: '1', full_name: 'Bhanu Prakash', gold_coins: 125, current_streak: 7, xp_points: 1250, rank: 1 },
    { student_id: '2', full_name: 'Ananya Sharma', gold_coins: 98, current_streak: 5, xp_points: 980, rank: 2 },
    { student_id: '3', full_name: 'Rahul Verma', gold_coins: 84, current_streak: 4, xp_points: 840, rank: 3 },
    { student_id: '4', full_name: 'Priya Patel', gold_coins: 72, current_streak: 3, xp_points: 720, rank: 4 },
    { student_id: '5', full_name: 'Karan Singh', gold_coins: 60, current_streak: 2, xp_points: 600, rank: 5 },
  ];
}
