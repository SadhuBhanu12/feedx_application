-- ==============================================================================
-- FEEDX MASTER FIX: DAILY STREAK, WALLET & GAMIFICATION PERMISSIONS + RPC ENGINE
-- ==============================================================================

-- 1. Ensure columns exist on daily_streaks
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_streaks' AND column_name = 'total_active_days') THEN
        ALTER TABLE public.daily_streaks ADD COLUMN total_active_days INTEGER NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_streaks' AND column_name = 'user_id') THEN
        ALTER TABLE public.daily_streaks ADD COLUMN user_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'student_wallets' AND column_name = 'user_id') THEN
        ALTER TABLE public.student_wallets ADD COLUMN user_id UUID;
    END IF;
END $$;

-- 2. Grant table permissions to authenticated, anon, and service_role
GRANT ALL ON TABLE public.daily_streaks TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.student_wallets TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.coin_transactions TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.reward_transactions TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.daily_task_completions TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.daily_quiz_attempts TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.daily_quiz_answers TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.student_lesson_progress TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.reward_catalog TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.reward_redemptions TO authenticated, anon, service_role;

-- 3. Enable RLS and Configure Permissive Policies for Authenticated & Anon Access
ALTER TABLE public.daily_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

-- Daily Streaks RLS Policies
DROP POLICY IF EXISTS "Students can view own streak" ON public.daily_streaks;
DROP POLICY IF EXISTS "Allow streak select" ON public.daily_streaks;
CREATE POLICY "Allow streak select" ON public.daily_streaks
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students can insert own streak" ON public.daily_streaks;
DROP POLICY IF EXISTS "Allow streak insert" ON public.daily_streaks;
CREATE POLICY "Allow streak insert" ON public.daily_streaks
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Students can update own streak" ON public.daily_streaks;
DROP POLICY IF EXISTS "Allow streak update" ON public.daily_streaks;
CREATE POLICY "Allow streak update" ON public.daily_streaks
    FOR UPDATE USING (true) WITH CHECK (true);

-- Student Wallets RLS Policies
DROP POLICY IF EXISTS "Students can view own wallet" ON public.student_wallets;
DROP POLICY IF EXISTS "Allow wallet select" ON public.student_wallets;
CREATE POLICY "Allow wallet select" ON public.student_wallets
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow wallet insert" ON public.student_wallets;
CREATE POLICY "Allow wallet insert" ON public.student_wallets
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow wallet update" ON public.student_wallets;
CREATE POLICY "Allow wallet update" ON public.student_wallets
    FOR UPDATE USING (true) WITH CHECK (true);

-- Coin Transactions RLS Policies
DROP POLICY IF EXISTS "Students can view own transactions" ON public.coin_transactions;
DROP POLICY IF EXISTS "Allow tx select" ON public.coin_transactions;
CREATE POLICY "Allow tx select" ON public.coin_transactions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow tx insert" ON public.coin_transactions;
CREATE POLICY "Allow tx insert" ON public.coin_transactions
    FOR INSERT WITH CHECK (true);

-- 4. Atomic Award Student Activity RPC with Full Streak Calculation & Persistence
CREATE OR REPLACE FUNCTION public.award_student_activity(
    p_student_id UUID,
    p_activity_type VARCHAR(50),
    p_coin_reward INT DEFAULT 0,
    p_xp_reward INT DEFAULT 0,
    p_reference_id VARCHAR(100) DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
    v_ref_id VARCHAR(100) := COALESCE(p_reference_id, p_activity_type || '_' || v_today::text);
    v_already_claimed BOOLEAN := FALSE;
    v_last_active DATE;
    v_curr_streak INT := 0;
    v_longest_streak INT := 0;
    v_freeze_count INT := 1;
    v_total_active INT := 0;
    v_new_streak INT := 1;
    v_new_longest INT := 1;
    v_new_total_active INT := 1;
    v_coin_reward_actual INT := GREATEST(COALESCE(p_coin_reward, 0), 0);
    v_tokens_reward INT := GREATEST(COALESCE(p_xp_reward, 0), 0);
    v_old_xp INT := 0;
    v_new_xp INT := 0;
    v_new_coins INT := 0;
BEGIN
    -- 1. Ensure student wallet exists
    INSERT INTO public.student_wallets (student_id, gold_coins, total_earned, updated_at)
    VALUES (p_student_id, 0, 0, NOW())
    ON CONFLICT (student_id) DO NOTHING;

    -- 2. Ensure daily streak row exists
    INSERT INTO public.daily_streaks (student_id, current_streak, longest_streak, total_active_days, last_active_date, updated_at)
    VALUES (p_student_id, 0, 0, 0, v_today - INTERVAL '2 days', NOW())
    ON CONFLICT (student_id) DO NOTHING;

    -- 3. Check idempotency (prevent duplicate reward for same reference)
    IF EXISTS (
        SELECT 1 FROM public.coin_transactions
        WHERE (student_id = p_student_id OR user_id = p_student_id)
          AND activity_type = p_activity_type
          AND reference_id = v_ref_id
    ) OR EXISTS (
        SELECT 1 FROM public.reward_transactions
        WHERE (student_id = p_student_id OR user_id = p_student_id)
          AND source_type = p_activity_type
          AND source_id = v_ref_id
    ) THEN
        v_already_claimed := TRUE;
        SELECT current_streak, longest_streak, xp_points INTO v_new_streak, v_new_longest, v_new_xp
        FROM public.daily_streaks WHERE student_id = p_student_id;
        
        RETURN jsonb_build_object(
            'success', true,
            'already_completed', true,
            'already_earned', true,
            'tokens_awarded', 0,
            'coins_awarded', 0,
            'xp_awarded', 0,
            'current_streak', COALESCE(v_new_streak, 1),
            'longest_streak', COALESCE(v_new_longest, 1),
            'new_xp', COALESCE(v_new_xp, 0)
        );
    END IF;

    -- 4. Lock streak row and retrieve existing streak metrics
    SELECT last_active_date, current_streak, longest_streak, total_active_days, streak_freeze_count, xp_points
    INTO v_last_active, v_curr_streak, v_longest_streak, v_total_active, v_freeze_count, v_old_xp
    FROM public.daily_streaks
    WHERE student_id = p_student_id
    FOR UPDATE;

    v_curr_streak := COALESCE(v_curr_streak, 0);
    v_longest_streak := COALESCE(v_longest_streak, 0);
    v_total_active := COALESCE(v_total_active, 0);
    v_freeze_count := COALESCE(v_freeze_count, 1);
    v_old_xp := COALESCE(v_old_xp, 0);
    v_new_xp := v_old_xp + v_tokens_reward;

    -- 5. Calculate streak transitions
    IF v_last_active = v_today THEN
        v_new_streak := GREATEST(v_curr_streak, 1);
        v_new_total_active := GREATEST(v_total_active, 1);
    ELSIF v_last_active = v_today - INTERVAL '1 day' THEN
        v_new_streak := v_curr_streak + 1;
        v_new_total_active := v_total_active + 1;
    ELSIF v_last_active = v_today - INTERVAL '2 days' AND v_freeze_count > 0 THEN
        v_new_streak := GREATEST(v_curr_streak, 1);
        v_freeze_count := v_freeze_count - 1;
        v_new_total_active := v_total_active + 1;
    ELSE
        v_new_streak := 1;
        v_new_total_active := v_total_active + 1;
    END IF;

    v_new_longest := GREATEST(v_longest_streak, v_new_streak);

    -- 6. Insert audit transaction records
    BEGIN
        INSERT INTO public.coin_transactions (student_id, user_id, amount, activity_type, reference_id, description, created_at)
        VALUES (p_student_id, p_student_id, v_tokens_reward, p_activity_type, v_ref_id, 'Earned +' || v_tokens_reward || ' Task Tokens for ' || p_activity_type, NOW());
    EXCEPTION WHEN OTHERS THEN
        -- Ignore FK errors if student not yet mirrored in users
    END;

    BEGIN
        INSERT INTO public.reward_transactions (user_id, student_id, source_type, source_id, coins, points, created_at)
        VALUES (p_student_id, p_student_id, p_activity_type, v_ref_id, v_coin_reward_actual, v_tokens_reward, NOW());
    EXCEPTION WHEN OTHERS THEN
    END;

    -- 7. Persist updated streak metrics into daily_streaks
    UPDATE public.daily_streaks
    SET current_streak = v_new_streak,
        longest_streak = v_new_longest,
        total_active_days = v_new_total_active,
        last_active_date = v_today,
        streak_freeze_count = v_freeze_count,
        xp_points = v_new_xp,
        activity_history = jsonb_set(COALESCE(activity_history, '{}'::jsonb), ARRAY[v_today::text], 'true'::jsonb),
        updated_at = NOW()
    WHERE student_id = p_student_id;

    -- 8. Update student_wallets
    UPDATE public.student_wallets
    SET gold_coins = COALESCE(gold_coins, 0) + v_coin_reward_actual,
        tokens = v_new_xp,
        total_earned = COALESCE(total_earned, 0) + v_tokens_reward,
        updated_at = NOW()
    WHERE student_id = p_student_id
    RETURNING gold_coins INTO v_new_coins;

    -- 9. Mirror to students and users table
    UPDATE public.students
    SET gold_coins = COALESCE(gold_coins, 0) + v_coin_reward_actual,
        xp_points = v_new_xp,
        updated_at = NOW()
    WHERE id = p_student_id;

    UPDATE public.users
    SET gold_coins = COALESCE(gold_coins, 0) + v_coin_reward_actual,
        xp = v_new_xp,
        updated_at = NOW()
    WHERE id = p_student_id;

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', false,
        'already_earned', false,
        'tokens_awarded', v_tokens_reward,
        'coins_awarded', v_coin_reward_actual,
        'xp_awarded', v_tokens_reward,
        'current_streak', v_new_streak,
        'longest_streak', v_new_longest,
        'total_active_days', v_new_total_active,
        'new_coins', COALESCE(v_new_coins, 0),
        'new_xp', v_new_xp
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) TO authenticated, anon, service_role;
