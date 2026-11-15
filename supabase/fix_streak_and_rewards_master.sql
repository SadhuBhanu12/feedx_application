-- ==============================================================================
-- FEEDX MASTER FIX MIGRATION: Daily Streak & Task Token Crediting SSOT
-- Rules Enforced:
-- Rule 1: First-day activity -> Current streak = 1
-- Rule 2: Consecutive-day activity -> Increment current streak by 1
-- Rule 3: Multiple activities on the same day -> Streak increments only once (idempotent)
-- Rule 4: One missed day -> Grace period allows streak to continue (streak resets after TWO consecutive missed days)
-- Rule 4b: Two consecutive missed days -> Current streak restarts at 1
-- Rule 5: Longest streak -> Maintained separately, never decreases on reset
-- Rule 6: Calendar date comparison via CURRENT_DATE
-- ==============================================================================

DROP FUNCTION IF EXISTS public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, character varying, integer, integer, character varying) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, text, integer, integer, text) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity CASCADE;

CREATE OR REPLACE FUNCTION public.award_student_activity(
    p_student_id UUID,
    p_activity_type VARCHAR(50),
    p_coin_reward INT DEFAULT 0,
    p_xp_reward INT DEFAULT 0,
    p_reference_id VARCHAR(100) DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
    v_ref_id VARCHAR(100) := COALESCE(p_reference_id, p_activity_type || '_' || v_today::text);
    v_already_claimed BOOLEAN := FALSE;
    v_last_active DATE;
    v_curr_streak INT := 0;
    v_longest_streak INT := 0;
    v_new_streak INT := 1;
    v_day_diff INT := 0;
    v_tokens_reward INT := 0;
    v_coin_reward_actual INT := 0;
    v_new_coins INT := 0;
    v_new_tokens INT := 0;
BEGIN
    -- Ensure reference ID is clean
    IF v_ref_id IS NULL OR TRIM(v_ref_id) = '' THEN
        v_ref_id := p_activity_type || '_' || v_today::text;
    END IF;

    -- SSOT Activity Reward Matrix
    IF p_activity_type IN ('home_daily_quick_learn', 'daily_mission_quick_learn', 'daily_quick_learn') THEN
        v_tokens_reward := 50;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('home_daily_quiz', 'daily_mission_quiz', 'daily_quiz', 'daily_task_quiz') THEN
        v_tokens_reward := 50;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('explore_quick_learn', 'quick_learn', 'resource_read', 'lesson_completed') THEN
        v_tokens_reward := 10;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('explore_quiz', 'quick_quiz', 'quiz_completed') THEN
        v_tokens_reward := 15;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('daily_login', 'streak_checkin', 'daily_checkin', 'home_daily_streak') THEN
        v_tokens_reward := 10;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('roadmap_task', 'roadmap_completed', 'roadmap', 'phase_completed', 'home_daily_roadmap') THEN
        v_tokens_reward := 40;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('daily_task', 'task_completed', 'task_desk', 'daily_mission') THEN
        v_tokens_reward := GREATEST(COALESCE(p_xp_reward, 0), 20);
        v_coin_reward_actual := 0;
    ELSE
        v_tokens_reward := LEAST(GREATEST(COALESCE(p_xp_reward, 0), 0), 50);
        v_coin_reward_actual := LEAST(GREATEST(COALESCE(p_coin_reward, 0), 0), 10);
    END IF;

    -- Idempotency check: verify if reference_id already claimed
    IF EXISTS (
        SELECT 1 FROM public.reward_transactions 
        WHERE (user_id = p_student_id OR student_id = p_student_id) 
          AND source_type = p_activity_type 
          AND source_id = v_ref_id
    ) OR EXISTS (
        SELECT 1 FROM public.coin_transactions
        WHERE student_id = p_student_id
          AND activity_type = p_activity_type
          AND reference_id = v_ref_id
    ) THEN
        v_already_claimed := TRUE;
        SELECT current_streak, longest_streak INTO v_new_streak, v_longest_streak
        FROM public.daily_streaks WHERE student_id = p_student_id;

        SELECT tokens, gold_coins INTO v_new_tokens, v_new_coins
        FROM public.student_wallets WHERE student_id = p_student_id;

        RETURN jsonb_build_object(
            'success', true,
            'already_completed', true,
            'already_earned', true,
            'tokens_awarded', 0,
            'coins_awarded', 0,
            'current_streak', COALESCE(v_new_streak, 1),
            'longest_streak', COALESCE(v_longest_streak, 1),
            'new_tokens', COALESCE(v_new_tokens, 0),
            'new_coins', COALESCE(v_new_coins, 0)
        );
    END IF;

    -- Retrieve current streak record
    SELECT last_active_date, current_streak, longest_streak
    INTO v_last_active, v_curr_streak, v_longest_streak
    FROM public.daily_streaks
    WHERE student_id = p_student_id
    FOR UPDATE;

    -- Streak logic calculation
    IF v_last_active IS NULL THEN
        -- Rule 1: First qualifying activity
        v_new_streak := 1;
    ELSE
        v_day_diff := v_today - v_last_active;
        IF v_day_diff <= 0 THEN
            -- Rule 3: Multiple activities on the same day -> streak does NOT increment
            v_new_streak := GREATEST(COALESCE(v_curr_streak, 1), 1);
        ELSIF v_day_diff = 1 THEN
            -- Rule 2: Consecutive calendar day -> increment by 1
            v_new_streak := COALESCE(v_curr_streak, 0) + 1;
        ELSIF v_day_diff = 2 THEN
            -- Rule 4: One missed day -> grace period preserves and continues streak
            v_new_streak := COALESCE(v_curr_streak, 0) + 1;
        ELSE
            -- Rule 4b: Two or more missed days (v_day_diff >= 3) -> restart at 1
            v_new_streak := 1;
        END IF;
    END IF;

    -- Rule 5: Longest streak is preserved and never reduced
    v_longest_streak := GREATEST(COALESCE(v_longest_streak, 0), v_new_streak);

    -- 1. Insert into reward_transactions
    INSERT INTO public.reward_transactions (user_id, student_id, source_type, source_id, coins, points)
    VALUES (p_student_id, p_student_id, p_activity_type, v_ref_id, v_coin_reward_actual, v_tokens_reward);

    -- 2. Insert into coin_transactions
    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, v_tokens_reward, p_activity_type, v_ref_id, 'Earned +' || v_tokens_reward || ' Task Tokens for ' || p_activity_type);

    -- 3. Atomically upsert student_wallets
    INSERT INTO public.student_wallets (student_id, gold_coins, tokens, total_earned, updated_at)
    VALUES (p_student_id, v_coin_reward_actual, v_tokens_reward, v_tokens_reward, NOW())
    ON CONFLICT (student_id) DO UPDATE
    SET gold_coins = COALESCE(public.student_wallets.gold_coins, 0) + v_coin_reward_actual,
        tokens = COALESCE(public.student_wallets.tokens, 0) + v_tokens_reward,
        total_earned = COALESCE(public.student_wallets.total_earned, 0) + v_tokens_reward,
        updated_at = NOW();

    SELECT gold_coins, tokens INTO v_new_coins, v_new_tokens
    FROM public.student_wallets
    WHERE student_id = p_student_id;

    -- 4. Atomically upsert daily_streaks
    INSERT INTO public.daily_streaks (student_id, current_streak, longest_streak, last_active_date, xp_points, total_active_days, updated_at)
    VALUES (p_student_id, v_new_streak, v_longest_streak, v_today, v_tokens_reward, 1, NOW())
    ON CONFLICT (student_id) DO UPDATE
    SET current_streak = v_new_streak,
        longest_streak = v_longest_streak,
        last_active_date = v_today,
        xp_points = COALESCE(public.daily_streaks.xp_points, 0) + v_tokens_reward,
        total_active_days = COALESCE(public.daily_streaks.total_active_days, 0) + (CASE WHEN public.daily_streaks.last_active_date = v_today THEN 0 ELSE 1 END),
        updated_at = NOW();

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', false,
        'already_earned', false,
        'tokens_awarded', v_tokens_reward,
        'coins_awarded', v_coin_reward_actual,
        'xp_awarded', v_tokens_reward,
        'current_streak', v_new_streak,
        'longest_streak', v_longest_streak,
        'new_tokens', COALESCE(v_new_tokens, 0),
        'new_coins', COALESCE(v_new_coins, 0)
    );
END;
$$;

-- Permissions
GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) TO authenticated, anon, service_role;
