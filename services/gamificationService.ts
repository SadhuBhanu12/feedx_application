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

// 1. Fetch Student Wallet (Hybrid Persistent Cache with Tokens & Gold Coins)
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

    const [{ data, error }, { data: streak }] = await Promise.all([
      supabase.from('student_wallets').select('*').eq('student_id', studentId).maybeSingle(),
      supabase.from('daily_streaks').select('xp_points').eq('student_id', studentId).maybeSingle()
    ]);

    if (!error && data) {
      const merged: StudentWallet = {
        student_id: studentId,
        gold_coins: data.gold_coins !== undefined ? data.gold_coins : (localWallet.gold_coins || 0),
        tokens: Math.max(streak?.xp_points !== undefined ? streak.xp_points : 0, localWallet.tokens || 0),
        total_earned: data.total_earned !== undefined ? data.total_earned : (localWallet.total_earned || 0),
        total_redeemed: data.total_redeemed !== undefined ? data.total_redeemed : (localWallet.total_redeemed || 0),
        updated_at: data.updated_at || new Date().toISOString(),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('[GamificationService] Wallet fetch fallback:', err);
  }

  return localWallet;
}

// 2. Fetch Daily Streak State
export async function fetchDailyStreak(studentId: string): Promise<DailyStreak> {
  const cacheKey = `@feedx_streak_${studentId}`;
  let localStreak: DailyStreak = {
    student_id: studentId,
    current_streak: 1,
    longest_streak: 1,
    last_active_date: new Date().toISOString().split('T')[0],
    streak_freeze_count: 1,
    xp_points: 10,
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
      const merged: DailyStreak = {
        ...data,
        current_streak: Math.max(data.current_streak || 0, localStreak.current_streak || 1),
        xp_points: Math.max(data.xp_points || 0, localStreak.xp_points || 0),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('[GamificationService] Streak fetch fallback:', err);
  }

  return localStreak;
}

// 3. Award Activity (Awards FEEDX Tokens & Gold Coins via Atomic RPC)
export async function awardActivity(
  studentId: string,
  activityType: string,
  tokenReward: number = 0,
  xpReward: number = 0,
  referenceId: string | null = null
): Promise<{ success: boolean; current_streak?: number; tokens_awarded?: number; coins_awarded?: number; xp_awarded?: number; already_earned?: boolean }> {
  const todayStr = new Date().toISOString().split('T')[0];
  const refId = referenceId || `${activityType}_${todayStr}`;

  // 1. Try atomic Supabase RPC procedure award_student_activity
  try {
    const { data, error } = await supabase.rpc('award_student_activity', {
      p_student_id: studentId,
      p_activity_type: activityType,
      p_coin_reward: tokenReward,
      p_xp_reward: xpReward,
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
        };
      }

      // Refresh wallet & transactions locally
      const currentWallet = await fetchStudentWallet(studentId);
      const tokensGained = res.tokens_awarded ?? res.coins_awarded ?? tokenReward ?? xpReward;
      const updatedWallet: StudentWallet = {
        ...currentWallet,
        tokens: (currentWallet.tokens || 0) + tokensGained,
        gold_coins: currentWallet.gold_coins || 0,
        total_earned: (currentWallet.total_earned || 0) + tokensGained,
        updated_at: new Date().toISOString(),
      };
      await AsyncStorage.setItem(`@feedx_wallet_${studentId}`, JSON.stringify(updatedWallet));

      return {
        success: true,
        already_earned: false,
        tokens_awarded: tokensGained,
        coins_awarded: 0,
        xp_awarded: res.xp_awarded ?? xpReward,
        current_streak: res.current_streak || 1,
      };
    }
  } catch (rpcErr) {
    console.warn('[awardActivity] Supabase RPC error, falling back to direct table update:', rpcErr);
  }

  // 2. Direct Table Upsert Fallback
  const currentWallet = await fetchStudentWallet(studentId);
  const currentTxs = await fetchCoinTransactions(studentId);

  const alreadyDone = currentTxs.some((t) => {
    if (t.activity_type !== activityType) return false;
    if (referenceId) {
      return t.reference_id === refId || t.reference_id === referenceId;
    }
    return t.reference_id === refId || (t.created_at && t.created_at.startsWith(todayStr));
  });

  if (alreadyDone) {
    return {
      success: true,
      already_earned: true,
      tokens_awarded: 0,
      coins_awarded: 0,
      current_streak: 1,
    };
  }

  const tokensGained = Math.max(tokenReward, xpReward, 0);

  const currentStreakState = await fetchDailyStreak(studentId);
  const oldXp = currentStreakState.xp_points || 0;
  const newXp = oldXp + tokensGained;

  // Calculate automatic coins earned (1 Coin per 1000 Points threshold crossed)
  const oldThreshold = Math.floor(oldXp / 1000);
  const newThreshold = Math.floor(newXp / 1000);
  const autoCoins = Math.max(0, newThreshold - oldThreshold);

  const currentGoldCoins = currentWallet.gold_coins || 0;
  const newGoldCoins = currentGoldCoins + autoCoins;
  const newTotal = (currentWallet.total_earned || 0) + autoCoins;

  const updatedWallet: StudentWallet = {
    ...currentWallet,
    tokens: newXp, // Store Task Points here
    gold_coins: newGoldCoins,
    total_earned: newTotal,
    updated_at: new Date().toISOString()
  };

  const updatedStreak: DailyStreak = {
    ...currentStreakState,
    xp_points: newXp
  };

  const newTx: CoinTransaction = {
    id: `act_tx_${activityType}_${Date.now()}`,
    student_id: studentId,
    amount: tokensGained,
    activity_type: activityType,
    reference_id: refId,
    description: `Earned +${tokensGained} Points for ${activityType}`,
    created_at: new Date().toISOString()
  };

  const updatedTxs = [newTx, ...currentTxs];

  await AsyncStorage.setItem(`@feedx_wallet_${studentId}`, JSON.stringify(updatedWallet));
  await AsyncStorage.setItem(`@feedx_streak_${studentId}`, JSON.stringify(updatedStreak));
  await AsyncStorage.setItem(`@feedx_transactions_${studentId}`, JSON.stringify(updatedTxs));

  try {
    await supabase.from('student_wallets').upsert({
      student_id: studentId,
      gold_coins: newGoldCoins,
      total_earned: newTotal,
      updated_at: new Date().toISOString()
    });

    await supabase.from('daily_streaks').upsert({
      student_id: studentId,
      xp_points: newXp,
      updated_at: new Date().toISOString()
    });

    await supabase.from('coin_transactions').insert({
      student_id: studentId,
      amount: tokensGained,
      activity_type: activityType,
      reference_id: refId,
      description: `Earned +${tokensGained} Points for ${activityType}`
    });
  } catch (err) {
    console.warn('[awardActivity] database sync error:', err);
  }

  return {
    success: true,
    already_earned: false,
    tokens_awarded: tokensGained,
    coins_awarded: autoCoins,
    current_streak: 1,
  };
}

// 3b. Complete Daily Login Task (Awards +10 Tokens/XP via awardActivity)
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
  const todayStr = new Date().toISOString().split('T')[0];

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
      new_balance: currentWallet.gold_coins || 0,
      current_streak: 1,
    };
  }

  // Award 10 Tokens (XP) and 0 Gold Coins
  await awardActivity(studentId, 'daily_login', 0, 10, todayStr);

  return {
    success: true,
    task_completed: true,
    already_completed: false,
    tokens_awarded: 10,
    coins_awarded: 0,
    new_balance: currentWallet.gold_coins || 0,
    current_streak: 1,
  };
}

export async function convertTokensToGoldCoins(
  studentId: string,
  tokensToConvert?: number
): Promise<{ success: boolean; message: string; new_tokens?: number; new_gold_coins?: number }> {
  try {
    // Check available balance locally/remote
    const localStreak = await fetchDailyStreak(studentId);
    const availableTokens = localStreak.xp_points || 0;
    const targetTokens = tokensToConvert && tokensToConvert > 0 ? tokensToConvert : availableTokens;

    if (targetTokens < 1000) {
      return {
        success: false,
        message: `You need at least 1,000 tokens to redeem for a Gold Coin.\n\nYour Current Balance: ${availableTokens} tokens.`
      };
    }

    // Call atomic RPC function
    const { data, error } = await supabase.rpc('convert_tokens_to_gold_coins', {
      p_student_id: studentId,
      p_tokens_to_convert: targetTokens
    });

    if (error) {
      console.warn('[convertTokensToGoldCoins] RPC failed, falling back:', error);
      throw error;
    }

    const res = data as {
      success: boolean;
      tokens_converted: number;
      coins_awarded: number;
      new_tokens: number;
      new_coins: number;
    };

    // Update local cache
    const localWallet = await fetchStudentWallet(studentId);
    const updatedWallet: StudentWallet = {
      ...localWallet,
      tokens: res.new_tokens,
      gold_coins: res.new_coins,
      total_earned: (localWallet.total_earned || 0) + res.coins_awarded,
      updated_at: new Date().toISOString()
    };
    await AsyncStorage.setItem(`@feedx_wallet_${studentId}`, JSON.stringify(updatedWallet));
    await AsyncStorage.setItem(`@feedx_streak_${studentId}`, JSON.stringify({
      ...localStreak,
      xp_points: res.new_tokens
    }));

    return {
      success: true,
      message: `Successfully converted ${res.tokens_converted.toLocaleString()} tokens into ${res.coins_awarded} Gold Coin(s)! 🪙`,
      new_tokens: res.new_tokens,
      new_gold_coins: res.new_coins
    };
  } catch (err: any) {
    console.error('[convertTokensToGoldCoins] error:', err);
    return {
      success: false,
      message: err.message || 'Failed to process token conversion. Please try again.'
    };
  }
}

// 4. Fetch Reward Catalog (Exact 5 Reference Rewards)
export async function fetchRewardCatalog(): Promise<RewardItem[]> {
  const EXACT_CATALOG: RewardItem[] = [
    {
      id: 'cat_5_coins',
      title: 'FEEDX VERIFIED LEARNER CERTIFICATE',
      description: 'Earn 5 Gold Coins and get your FEEDX Verified Learner Certificate.',
      coin_cost: 5,
      category: 'certificate',
      stock: -1,
      is_active: true,
      image_url: 'certificate_verified',
    },
    {
      id: 'cat_10_coins',
      title: 'FEEDX EXCELLENCE CERTIFICATE + ₹100 GIFT CARD',
      description: 'Earn 10 Gold Coins and get a FEEDX Excellence Certificate along with a ₹100 Gift Card.',
      coin_cost: 10,
      category: 'gift_card',
      stock: 100,
      is_active: true,
      image_url: 'certificate_giftcard_100',
    },
    {
      id: 'cat_20_coins',
      title: '₹500 GIFT CARD + FEEDX MERCHANDISE',
      description: 'Earn 20 Gold Coins and get a ₹500 Gift Card along with exclusive FEEDX Merchandise (Backpack, T-Shirt, Mug, Notebook).',
      coin_cost: 20,
      category: 'merchandise',
      stock: 50,
      is_active: true,
      image_url: 'giftcard_500_merch',
    },
    {
      id: 'cat_50_coins',
      title: 'ANNUAL FEEDX EXCELLENCE AWARD + SPECIAL RECOGNITION + PREMIUM PRIZE',
      description: 'Earn 50 Gold Coins and become eligible for the Annual FEEDX Excellence Award, special recognition and premium prizes.',
      coin_cost: 50,
      category: 'award',
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
      const seenCosts = new Set<number>();
      const deduped: RewardItem[] = [];

      for (const dbItem of data) {
        if (!seenCosts.has(dbItem.coin_cost)) {
          seenCosts.add(dbItem.coin_cost);

          let img = 'excellence_award_trophy';
          if (dbItem.coin_cost <= 5) img = 'certificate_verified';
          else if (dbItem.coin_cost <= 10) img = 'certificate_giftcard_100';
          else if (dbItem.coin_cost <= 25) img = 'giftcard_500_merch';

          deduped.push({
            id: dbItem.id, // Real database UUID
            title: dbItem.title.toUpperCase(),
            description: dbItem.description || '',
            coin_cost: dbItem.coin_cost,
            category: dbItem.category,
            stock: dbItem.stock,
            is_active: dbItem.is_active,
            image_url: img,
          });
        }
      }
      return deduped;
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
export async function fetchLeaderboard(): Promise<LeaderboardUser[]> {
  return [
    { student_id: '1', full_name: 'Bhanu Prakash', gold_coins: 125, current_streak: 7, xp_points: 1250, rank: 1 },
    { student_id: '2', full_name: 'Ananya Sharma', gold_coins: 98, current_streak: 5, xp_points: 980, rank: 2 },
    { student_id: '3', full_name: 'Rahul Verma', gold_coins: 84, current_streak: 4, xp_points: 840, rank: 3 },
    { student_id: '4', full_name: 'Priya Patel', gold_coins: 72, current_streak: 3, xp_points: 720, rank: 4 },
    { student_id: '5', full_name: 'Karan Singh', gold_coins: 60, current_streak: 2, xp_points: 600, rank: 5 },
  ];
}
