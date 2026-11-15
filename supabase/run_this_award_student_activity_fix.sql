-- ==============================================================================
-- FEEDX REWARD MATRIX & FUNCTION DROP FIX (Ready to run in Supabase SQL Editor)
-- ==============================================================================
-- This fixes ERROR 42P13: cannot remove parameter defaults from existing function
-- and enforces the exact SSOT reward matrix:
-- - Home Today's Mission Quick Learn: 50 Tokens
-- - Home Today's Mission Daily Quiz: 50 Tokens
-- - Explore Page Quick Learn: 10 Tokens
-- - Explore Page Quiz: 15 Tokens
-- ==============================================================================

-- 1. Drop all prior function signatures to eliminate 42P13
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, character varying, integer, integer, character varying) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, text, integer, integer, text) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity CASCADE;

-- 2. Create authoritative SSOT reward function
CREATE OR REPLACE FUNCTION public.award_student_activity(
    p_student_id UUID,
    p_activity_type VARCHAR(50),
    p_coin_reward INT,
    p_xp_reward INT,
    p_reference_id VARCHAR(100)
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_already_claimed BOOLEAN := FALSE;
    v_new_coins INT := 0;
    v_new_xp INT := 0;
    v_coin_reward_actual INT := 0;
    v_tokens_reward INT := 0;
    v_caller_uid UUID := auth.uid();
BEGIN
    -- Verify caller identity: caller must be the student or an administrator
    IF v_caller_uid IS NOT NULL AND v_caller_uid != p_student_id THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = v_caller_uid 
              AND role IN ('admin', 'inst_admin', 'super_admin', 'college_admin')
              AND is_active = TRUE
        ) THEN
            RAISE EXCEPTION 'Unauthorized: You can only claim activity rewards for your own account.';
        END IF;
    END IF;

    -- Ensure reference ID is valid
    IF p_reference_id IS NULL OR TRIM(p_reference_id) = '' THEN
        p_reference_id := CURRENT_DATE::text;
    END IF;

    -- Authoritative Single Source of Truth (SSOT) Backend Reward Enforcement:
    -- Home Today's Mission Quick Learn -> 50 Tokens
    -- Home Today's Mission Daily Quiz -> 50 Tokens
    -- Explore Page Quick Learn -> 10 Tokens
    -- Explore Page Quiz -> 15 Tokens
    -- Daily Streak Check-in -> 10 Tokens
    -- Roadmap Milestone -> 40 Tokens
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
    ELSIF p_activity_type IN ('daily_task', 'daily_mission') THEN
        v_tokens_reward := 50;
        v_coin_reward_actual := 0;
    ELSE
        -- Fallback: Cap client-supplied values to safe maximums
        v_tokens_reward := LEAST(GREATEST(COALESCE(p_xp_reward, 0), 0), 50);
        v_coin_reward_actual := LEAST(GREATEST(COALESCE(p_coin_reward, 0), 0), 10);
    END IF;

    -- Check if reward was already awarded for this specific source
    IF EXISTS (
        SELECT 1 FROM public.reward_transactions 
        WHERE (user_id = p_student_id OR student_id = p_student_id) 
          AND source_type = p_activity_type 
          AND source_id = p_reference_id
    ) THEN
        v_already_claimed := TRUE;
        -- Retrieve current wallet balances so caller always receives consistent state
        SELECT COALESCE(gold_coins, 0), COALESCE(tokens, 0)
        INTO v_new_coins, v_new_xp 
        FROM public.student_wallets 
        WHERE student_id = p_student_id;
    ELSE
        -- Insert unique reward transaction record
        INSERT INTO public.reward_transactions (user_id, student_id, source_type, source_id, coins, points)
        VALUES (p_student_id, p_student_id, p_activity_type, p_reference_id, v_coin_reward_actual, v_tokens_reward);

        -- Also record in coin_transactions if present
        INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
        VALUES (p_student_id, v_tokens_reward, p_activity_type, p_reference_id, 'Earned +' || v_tokens_reward || ' Task Tokens');

        -- Also record in fx_transactions
        BEGIN
            INSERT INTO public.fx_transactions (user_id, amount, source_type, source_id, description)
            VALUES (p_student_id, v_tokens_reward, p_activity_type, p_reference_id, 'Earned +' || v_tokens_reward || ' Task Tokens');
        EXCEPTION WHEN OTHERS THEN NULL;
        END;

        -- Atomically sync public.student_wallets table
        INSERT INTO public.student_wallets (student_id, gold_coins, tokens, total_earned, updated_at)
        VALUES (p_student_id, v_coin_reward_actual, v_tokens_reward, v_tokens_reward, NOW())
        ON CONFLICT (student_id) DO UPDATE
        SET gold_coins = COALESCE(public.student_wallets.gold_coins, 0) + v_coin_reward_actual,
            tokens = COALESCE(public.student_wallets.tokens, 0) + v_tokens_reward,
            total_earned = COALESCE(public.student_wallets.total_earned, 0) + v_tokens_reward,
            updated_at = NOW();

        SELECT gold_coins, tokens INTO v_new_coins, v_new_xp 
        FROM public.student_wallets 
        WHERE student_id = p_student_id;

        -- Atomically sync daily_streaks table
        INSERT INTO public.daily_streaks (student_id, xp_points, current_streak, longest_streak, last_active_date, updated_at)
        VALUES (p_student_id, v_tokens_reward, 1, 1, CURRENT_DATE, NOW())
        ON CONFLICT (student_id) DO UPDATE
        SET xp_points = COALESCE(public.daily_streaks.xp_points, 0) + v_tokens_reward,
            current_streak = GREATEST(COALESCE(public.daily_streaks.current_streak, 0), 1),
            longest_streak = GREATEST(COALESCE(public.daily_streaks.longest_streak, 0), 1),
            last_active_date = CURRENT_DATE,
            updated_at = NOW();
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', v_already_claimed,
        'already_earned', v_already_claimed,
        'tokens_awarded', CASE WHEN v_already_claimed THEN 0 ELSE v_tokens_reward END,
        'coins_awarded', CASE WHEN v_already_claimed THEN 0 ELSE v_coin_reward_actual END,
        'xp_awarded', CASE WHEN v_already_claimed THEN 0 ELSE v_tokens_reward END,
        'new_coins', COALESCE(v_new_coins, 0),
        'new_xp', COALESCE(v_new_xp, 0)
    );
END;
$$;

-- 3. Permissions
REVOKE EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) FROM anon;
GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) TO service_role;
