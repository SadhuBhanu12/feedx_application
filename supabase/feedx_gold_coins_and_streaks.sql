-- ==============================================================================
-- FEEDX GOLD COINS & DAILY STREAK ENGINE (PRODUCTION SUPABASE SCHEMA)
-- ==============================================================================

-- 1. STUDENT COIN WALLET TABLE
CREATE TABLE IF NOT EXISTS public.student_wallets (
    student_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    gold_coins INTEGER NOT NULL DEFAULT 0 CHECK (gold_coins >= 0),
    total_earned INTEGER NOT NULL DEFAULT 0 CHECK (total_earned >= 0),
    total_redeemed INTEGER NOT NULL DEFAULT 0 CHECK (total_redeemed >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DAILY STREAK TABLE
CREATE TABLE IF NOT EXISTS public.daily_streaks (
    student_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    last_active_date DATE DEFAULT CURRENT_DATE,
    streak_freeze_count INTEGER NOT NULL DEFAULT 1 CHECK (streak_freeze_count >= 0),
    xp_points INTEGER NOT NULL DEFAULT 0 CHECK (xp_points >= 0),
    activity_history JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. COIN TRANSACTIONS AUDIT LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Positive for rewards, negative for redemptions
    activity_type VARCHAR(50) NOT NULL, -- 'daily_login', 'streak_bonus', 'quiz_completed', 'resource_read', 'innovation_submitted', 'redemption'
    reference_id VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. REWARD CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.reward_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    coin_cost INTEGER NOT NULL CHECK (coin_cost > 0),
    category VARCHAR(50) NOT NULL, -- 'certificate', 'gift_card', 'merchandise', 'ticket', 'bundle'
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT -1, -- -1 means unlimited
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. REWARD REDEMPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.reward_catalog(id),
    coin_cost INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'fulfilled', 'rejected'
    delivery_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING & IDEMPOTENCY
CREATE INDEX IF NOT EXISTS idx_coin_tx_student_id ON public.coin_transactions(student_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_coin_transactions_idempotency ON public.coin_transactions(student_id, activity_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_daily_streaks_active ON public.daily_streaks(last_active_date, current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_reward_catalog_active ON public.reward_catalog(is_active, coin_cost ASC);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_student ON public.reward_redemptions(student_id, redeemed_at DESC);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.student_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Student Wallets: Read own wallet
DROP POLICY IF EXISTS "Students can view own wallet" ON public.student_wallets;
CREATE POLICY "Students can view own wallet"
    ON public.student_wallets FOR SELECT
    USING (auth.uid() = student_id);

-- Daily Streaks: Read own streak
DROP POLICY IF EXISTS "Students can view own streak" ON public.daily_streaks;
CREATE POLICY "Students can view own streak"
    ON public.daily_streaks FOR SELECT
    USING (auth.uid() = student_id);

-- Coin Transactions: Read own transactions
DROP POLICY IF EXISTS "Students can view own transactions" ON public.coin_transactions;
CREATE POLICY "Students can view own transactions"
    ON public.coin_transactions FOR SELECT
    USING (auth.uid() = student_id);

-- Reward Catalog: Public / authenticated read active rewards
DROP POLICY IF EXISTS "Everyone can view active rewards" ON public.reward_catalog;
CREATE POLICY "Everyone can view active rewards"
    ON public.reward_catalog FOR SELECT
    USING (is_active = TRUE);

-- Reward Redemptions: View own redemptions
DROP POLICY IF EXISTS "Students can view own redemptions" ON public.reward_redemptions;
CREATE POLICY "Students can view own redemptions"
    ON public.reward_redemptions FOR SELECT
    USING (auth.uid() = student_id);

-- ==============================================================================
-- ATOMIC RPC FUNCTION 1: AWARD ACTIVITY / STREAK UPDATE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.award_student_activity(
    p_student_id UUID,
    p_activity_type VARCHAR(50),
    p_coin_reward INTEGER DEFAULT 0,
    p_xp_reward INTEGER DEFAULT 0,
    p_reference_id VARCHAR(100) DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
    v_ref_id VARCHAR(100) := COALESCE(p_reference_id, v_today::text);
    v_already_exists BOOLEAN := FALSE;
    v_last_active DATE;
    v_curr_streak INT := 0;
    v_longest_streak INT := 0;
    v_freeze_count INT := 1;
    v_new_streak INT := 1;
    v_coins_gained INT := GREATEST(p_coin_reward, 0);
    v_xp_gained INT := GREATEST(p_xp_reward, 0);
    v_result JSONB;
BEGIN
    -- Ensure wallet exists
    INSERT INTO public.student_wallets (student_id, gold_coins, total_earned)
    VALUES (p_student_id, 0, 0)
    ON CONFLICT (student_id) DO NOTHING;

    -- Ensure streak row exists
    INSERT INTO public.daily_streaks (student_id, current_streak, longest_streak, last_active_date)
    VALUES (p_student_id, 0, 0, v_today - INTERVAL '2 days')
    ON CONFLICT (student_id) DO NOTHING;

    -- Check if this specific activity reference has ALREADY been rewarded today/reference
    SELECT EXISTS (
        SELECT 1 FROM public.coin_transactions
        WHERE student_id = p_student_id
          AND activity_type = p_activity_type
          AND reference_id = v_ref_id
    ) INTO v_already_exists;

    IF v_already_exists THEN
        SELECT current_streak INTO v_new_streak FROM public.daily_streaks WHERE student_id = p_student_id;
        RETURN jsonb_build_object(
            'success', true,
            'already_earned', true,
            'coins_awarded', 0,
            'current_streak', v_new_streak,
            'message', 'Activity already rewarded'
        );
    END IF;

    -- Lock and retrieve streak details
    SELECT last_active_date, current_streak, longest_streak, streak_freeze_count
    INTO v_last_active, v_curr_streak, v_longest_streak, v_freeze_count
    FROM public.daily_streaks
    WHERE student_id = p_student_id
    FOR UPDATE;

    -- Calculate current streak transition
    IF v_last_active = v_today THEN
        v_new_streak := v_curr_streak; -- Already active today
    ELSIF v_last_active = v_today - INTERVAL '1 day' THEN
        v_new_streak := v_curr_streak + 1; -- Consecutive daily active
    ELSIF v_last_active = v_today - INTERVAL '2 days' AND v_freeze_count > 0 THEN
        v_new_streak := v_curr_streak; -- Streak freeze used
        v_freeze_count := v_freeze_count - 1;
    ELSE
        v_new_streak := 1; -- Streak broken, restart
    END IF;

    -- Streak milestone bonuses (e.g., 7 days = +5 extra coins)
    IF v_new_streak = 7 AND (v_last_active IS NULL OR v_last_active < v_today) THEN
        v_coins_gained := v_coins_gained + 5;
    ELSIF v_new_streak = 30 AND (v_last_active IS NULL OR v_last_active < v_today) THEN
        v_coins_gained := v_coins_gained + 15;
    END IF;

    -- Update daily streaks
    UPDATE public.daily_streaks
    SET current_streak = v_new_streak,
        longest_streak = GREATEST(v_longest_streak, v_new_streak),
        last_active_date = v_today,
        streak_freeze_count = v_freeze_count,
        xp_points = xp_points + v_xp_gained,
        activity_history = jsonb_set(COALESCE(activity_history, '{}'::jsonb), ARRAY[v_today::text], 'true'::jsonb),
        updated_at = NOW()
    WHERE student_id = p_student_id;

    -- Award coins in wallet
    IF v_coins_gained > 0 THEN
        UPDATE public.student_wallets
        SET gold_coins = gold_coins + v_coins_gained,
            total_earned = total_earned + v_coins_gained,
            updated_at = NOW()
        WHERE student_id = p_student_id;

        -- Record transaction entry
        INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
        VALUES (p_student_id, v_coins_gained, p_activity_type, v_ref_id, 'Reward for activity: ' || p_activity_type)
        ON CONFLICT DO NOTHING;
    END IF;

    v_result := jsonb_build_object(
        'success', true,
        'already_earned', false,
        'current_streak', v_new_streak,
        'coins_awarded', v_coins_gained,
        'xp_awarded', v_xp_gained
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ATOMIC RPC FUNCTION 2: REDEEM REWARD
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.redeem_reward(
    p_student_id UUID,
    p_reward_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_coin_cost INT;
    v_stock INT;
    v_title VARCHAR(150);
    v_current_coins INT;
    v_redemption_id UUID;
    v_result JSONB;
BEGIN
    -- Check reward item existence and details
    SELECT coin_cost, stock, title INTO v_coin_cost, v_stock, v_title
    FROM public.reward_catalog
    WHERE id = p_reward_id AND is_active = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reward item not found or unavailable';
    END IF;

    IF v_stock = 0 THEN
        RAISE EXCEPTION 'Reward item is currently out of stock';
    END IF;

    -- Lock and check wallet balance
    SELECT gold_coins INTO v_current_coins
    FROM public.student_wallets
    WHERE student_id = p_student_id
    FOR UPDATE;

    IF v_current_coins IS NULL OR v_current_coins < v_coin_cost THEN
        RAISE EXCEPTION 'Insufficient Gold Coins balance';
    END IF;

    -- Deduct balance
    UPDATE public.student_wallets
    SET gold_coins = gold_coins - v_coin_cost,
        total_redeemed = total_redeemed + v_coin_cost,
        updated_at = NOW()
    WHERE student_id = p_student_id;

    -- Decrement stock if item has finite stock
    IF v_stock > 0 THEN
        UPDATE public.reward_catalog
        SET stock = stock - 1
        WHERE id = p_reward_id;
    END IF;

    -- Insert redemption record
    INSERT INTO public.reward_redemptions (student_id, reward_id, coin_cost, status)
    VALUES (p_student_id, p_reward_id, v_coin_cost, 'pending')
    RETURNING id INTO v_redemption_id;

    -- Record negative transaction in ledger
    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, -v_coin_cost, 'redemption', v_redemption_id::text, 'Redeemed reward: ' || v_title);

    v_result := jsonb_build_object(
        'success', true,
        'redemption_id', v_redemption_id,
        'coins_spent', v_coin_cost,
        'reward_title', v_title
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- SEED DATA: REWARD TIERS (5, 10, 20, 30, 40, 50, 1000 COINS)
-- ==============================================================================
INSERT INTO public.reward_catalog (title, description, coin_cost, category, stock, is_active)
VALUES
    ('FEEDX Verified Learner Certificate', 'Official verified digital learner certificate signed by FEEDX.', 5, 'certificate', -1, true),
    ('Excellence Certificate + ₹100 Gift Card', 'FEEDX Excellence Certificate paired with a ₹100 digital shopping gift card.', 10, 'gift_card', 100, true),
    ('₹500 Gift Card + FEEDX Merchandise', '₹500 Amazon/Flipkart gift card with FEEDX notebook & sticker bundle.', 20, 'merchandise', 50, true),
    ('Premium Learning Bundle & Pass', 'Exclusive access to premium skill modules, workshops & event passes.', 30, 'bundle', 30, true),
    ('FEEDX Ambassador Badge + Hoodie', 'Official FEEDX Campus Ambassador Badge & premium custom hoodie.', 40, 'merchandise', 20, true),
    ('Annual Excellence Award + Grand Prize', 'Annual FEEDX Excellence Trophy, certificate & premium tech prize.', 50, 'ticket', 10, true),
    ('1 Gram 24K Real Physical Gold Coin 🪙', 'Redeem 1,000 FEEDX Gold Coins for an official certified 1 Gram 24K Physical Gold Coin delivered directly to your doorstep!', 1000, 'real_gold', 5, true)
ON CONFLICT DO NOTHING;
-- ==============================================================================
-- DEDICATED DAILY TASK COMPLETIONS TABLE (IDEMPOTENT LOGICAL UNIQUE CONSTRAINT)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.daily_task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL,
    task_date DATE NOT NULL DEFAULT CURRENT_DATE,
    coins_earned INTEGER NOT NULL DEFAULT 1 CHECK (coins_earned >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_student_daily_task UNIQUE (student_id, task_type, task_date)
);

ALTER TABLE public.daily_task_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own task completions" ON public.daily_task_completions;
CREATE POLICY "Students can view own task completions"
    ON public.daily_task_completions FOR SELECT
    USING (auth.uid() = student_id);

-- ==============================================================================
-- ATOMIC RPC FUNCTION: COMPLETE DAILY LOGIN TASK & SYNC WALLET
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.complete_daily_login_task(
    p_student_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
    v_already_completed BOOLEAN := FALSE;
    v_new_balance INT := 0;
    v_new_streak INT := 1;
    v_result JSONB;
BEGIN
    -- 1. Ensure wallet exists
    INSERT INTO public.student_wallets (student_id, gold_coins, total_earned)
    VALUES (p_student_id, 0, 0)
    ON CONFLICT (student_id) DO NOTHING;

    -- 2. Ensure streak row exists
    INSERT INTO public.daily_streaks (student_id, current_streak, longest_streak, last_active_date)
    VALUES (p_student_id, 0, 0, v_today - INTERVAL '2 days')
    ON CONFLICT (student_id) DO NOTHING;

    -- 3. Check if Daily Login already completed today
    SELECT EXISTS (
        SELECT 1 FROM public.daily_task_completions
        WHERE student_id = p_student_id
          AND task_type = 'daily_login'
          AND task_date = v_today
    ) INTO v_already_completed;

    IF v_already_completed THEN
        SELECT gold_coins INTO v_new_balance FROM public.student_wallets WHERE student_id = p_student_id;
        SELECT current_streak INTO v_new_streak FROM public.daily_streaks WHERE student_id = p_student_id;

        RETURN jsonb_build_object(
            'success', true,
            'task_completed', true,
            'already_completed', true,
            'coins_awarded', 0,
            'new_balance', v_new_balance,
            'current_streak', v_new_streak,
            'message', 'Daily login task already completed today'
        );
    END IF;

    -- 4. Record Task Completion
    INSERT INTO public.daily_task_completions (student_id, task_type, task_date, coins_earned, status)
    VALUES (p_student_id, 'daily_login', v_today, 1, 'COMPLETED')
    ON CONFLICT (student_id, task_type, task_date) DO NOTHING;

    -- 5. Award +1 Gold Coin in Wallet
    UPDATE public.student_wallets
    SET gold_coins = gold_coins + 1,
        total_earned = total_earned + 1,
        updated_at = NOW()
    WHERE student_id = p_student_id
    RETURNING gold_coins INTO v_new_balance;

    -- 6. Record Coin Transaction Ledger
    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, 1, 'daily_login', v_today::text, 'Daily Login Reward')
    ON CONFLICT DO NOTHING;

    -- 7. Update Daily Streak
    UPDATE public.daily_streaks
    SET current_streak = CASE
            WHEN last_active_date = v_today THEN current_streak
            WHEN last_active_date = v_today - INTERVAL '1 day' THEN current_streak + 1
            ELSE 1
        END,
        longest_streak = GREATEST(longest_streak, CASE
            WHEN last_active_date = v_today THEN current_streak
            WHEN last_active_date = v_today - INTERVAL '1 day' THEN current_streak + 1
            ELSE 1
        END),
        last_active_date = v_today,
        updated_at = NOW()
    WHERE student_id = p_student_id
    RETURNING current_streak INTO v_new_streak;

    v_result := jsonb_build_object(
        'success', true,
        'task_completed', true,
        'already_completed', false,
        'coins_awarded', 1,
        'new_balance', v_new_balance,
        'current_streak', v_new_streak,
        'message', 'Daily login completed successfully'
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION FOR GAMIFICATION TABLES
-- ==============================================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

-- ==============================================================================
-- EXPLICIT TABLE & RPC FUNCTION PERMISSIONS (SUPABASE AUTHENTICATED & ANON)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO authenticated, anon;

GRANT ALL ON public.student_wallets TO authenticated;
GRANT ALL ON public.daily_streaks TO authenticated;
GRANT ALL ON public.coin_transactions TO authenticated;
GRANT ALL ON public.reward_catalog TO authenticated, anon;
GRANT ALL ON public.reward_redemptions TO authenticated;
GRANT ALL ON public.daily_task_completions TO authenticated;

GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INTEGER, INTEGER, VARCHAR) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.complete_daily_login_task(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.redeem_reward(UUID, UUID) TO authenticated, anon;

-- RELOAD SUPABASE POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

