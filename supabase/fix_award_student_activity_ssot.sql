-- ==============================================================================
-- FEEDX GAMIFICATION & TOKEN REWARD MATRIX FIX (SSOT)
-- Run this in Supabase SQL Editor (as postgres / service_role)
-- 
-- Matrix:
-- Today's Mission | Quick Learn | 50 tokens
-- Today's Mission | Daily Quiz  | 50 tokens
-- Explore         | Quick Learn | 10 tokens
-- Explore         | Daily Quiz  | 15 tokens
-- ==============================================================================

-- 1. Ensure columns exist on student_wallets and coin_transactions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'student_wallets' AND column_name = 'tokens'
    ) THEN
        ALTER TABLE public.student_wallets ADD COLUMN tokens INTEGER NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'student_wallets' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.student_wallets ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'coin_transactions' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.coin_transactions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Drop existing award_student_activity signatures cleanly
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, character varying, integer, integer, character varying) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, text, integer, integer, text) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity CASCADE;

-- 3. Authoritative award_student_activity function
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
    v_already_claimed BOOLEAN := FALSE;
    v_new_coins INT := 0;
    v_new_tokens INT := 0;
    v_new_streak INT := 1;
    v_longest_streak INT := 1;
    v_coin_reward_actual INT := 0;
    v_tokens_reward INT := 0;
    v_ref_id VARCHAR(100);
    v_last_active DATE;
    v_curr_streak INT := 0;
BEGIN
    -- Ensure reference ID is valid
    IF p_reference_id IS NULL OR TRIM(p_reference_id) = '' THEN
        v_ref_id := p_activity_type || '_' || CURRENT_DATE::text;
    ELSE
        v_ref_id := TRIM(p_reference_id);
    END IF;

    -- Authoritative FEEDX Reward Matrix Enforcement:
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
        v_tokens_reward := LEAST(GREATEST(COALESCE(p_xp_reward, 0), 0), 50);
        v_coin_reward_actual := LEAST(GREATEST(COALESCE(p_coin_reward, 0), 0), 10);
    END IF;

    -- Idempotency check: check if already claimed via reward_transactions or coin_transactions
    IF EXISTS (
        SELECT 1 FROM public.reward_transactions 
        WHERE (user_id = p_student_id OR student_id = p_student_id) 
          AND (source_type = p_activity_type OR source_id = v_ref_id)
          AND (
            source_id = v_ref_id OR 
            (created_at::date = CURRENT_DATE AND source_type = p_activity_type)
          )
    ) OR EXISTS (
        SELECT 1 FROM public.coin_transactions
        WHERE (student_id = p_student_id OR user_id = p_student_id)
          AND reference_id = v_ref_id
    ) THEN
        v_already_claimed := TRUE;

        SELECT COALESCE(gold_coins, 0), COALESCE(tokens, 0)
        INTO v_new_coins, v_new_tokens
        FROM public.student_wallets 
        WHERE student_id = p_student_id OR user_id = p_student_id
        LIMIT 1;

        SELECT COALESCE(current_streak, 1), COALESCE(longest_streak, 1)
        INTO v_new_streak, v_longest_streak
        FROM public.daily_streaks
        WHERE student_id = p_student_id OR user_id = p_student_id
        LIMIT 1;

        RETURN jsonb_build_object(
            'success', true,
            'already_completed', true,
            'already_earned', true,
            'tokens_awarded', 0,
            'coins_awarded', 0,
            'xp_awarded', 0,
            'new_tokens', COALESCE(v_new_tokens, 0),
            'new_coins', COALESCE(v_new_coins, 0),
            'new_xp', COALESCE(v_new_tokens, 0),
            'current_streak', COALESCE(v_new_streak, 1),
            'longest_streak', COALESCE(v_longest_streak, 1)
        );
    END IF;

    -- Insert unique reward transaction
    INSERT INTO public.reward_transactions (user_id, student_id, source_type, source_id, coins, points)
    VALUES (p_student_id, p_student_id, p_activity_type, v_ref_id, v_coin_reward_actual, v_tokens_reward);

    -- Insert into coin_transactions ledger
    INSERT INTO public.coin_transactions (student_id, user_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, p_student_id, v_tokens_reward, p_activity_type, v_ref_id, 'Earned +' || v_tokens_reward || ' Task Tokens');

    -- Insert/Update student_wallets atomically
    INSERT INTO public.student_wallets (student_id, user_id, gold_coins, tokens, total_earned, updated_at)
    VALUES (p_student_id, p_student_id, v_coin_reward_actual, v_tokens_reward, v_tokens_reward, NOW())
    ON CONFLICT (student_id) DO UPDATE
    SET gold_coins = COALESCE(public.student_wallets.gold_coins, 0) + v_coin_reward_actual,
        tokens = COALESCE(public.student_wallets.tokens, 0) + v_tokens_reward,
        total_earned = COALESCE(public.student_wallets.total_earned, 0) + v_tokens_reward,
        updated_at = NOW();

    SELECT gold_coins, tokens INTO v_new_coins, v_new_tokens
    FROM public.student_wallets 
    WHERE student_id = p_student_id;

    -- Calculate streak progression
    SELECT last_active_date, COALESCE(current_streak, 0), COALESCE(longest_streak, 0)
    INTO v_last_active, v_curr_streak, v_longest_streak
    FROM public.daily_streaks
    WHERE student_id = p_student_id;

    IF v_last_active = CURRENT_DATE THEN
        v_new_streak := GREATEST(v_curr_streak, 1);
    ELSIF v_last_active = CURRENT_DATE - 1 OR v_last_active = CURRENT_DATE - 2 THEN
        v_new_streak := v_curr_streak + 1;
    ELSE
        v_new_streak := 1;
    END IF;

    v_longest_streak := GREATEST(v_longest_streak, v_new_streak);

    -- Atomically update daily_streaks
    INSERT INTO public.daily_streaks (student_id, user_id, xp_points, current_streak, longest_streak, last_active_date, updated_at)
    VALUES (p_student_id, p_student_id, v_tokens_reward, v_new_streak, v_longest_streak, CURRENT_DATE, NOW())
    ON CONFLICT (student_id) DO UPDATE
    SET xp_points = COALESCE(public.daily_streaks.xp_points, 0) + v_tokens_reward,
        current_streak = v_new_streak,
        longest_streak = v_longest_streak,
        last_active_date = CURRENT_DATE,
        updated_at = NOW();

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', false,
        'already_earned', false,
        'tokens_awarded', v_tokens_reward,
        'coins_awarded', v_coin_reward_actual,
        'xp_awarded', v_tokens_reward,
        'new_tokens', COALESCE(v_new_tokens, 0),
        'new_coins', COALESCE(v_new_coins, 0),
        'new_xp', COALESCE(v_new_tokens, 0),
        'current_streak', v_new_streak,
        'longest_streak', v_longest_streak
    );
END;
$$;

-- 4. Authoritative submit_daily_quiz_attempt function
CREATE OR REPLACE FUNCTION public.submit_daily_quiz_attempt(
    p_attempt_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_quiz_id UUID;
    v_status VARCHAR(50);
    v_coins_to_award INT := 50;
    v_activity_type VARCHAR(50) := 'home_daily_quiz';
    v_ref_id VARCHAR(100);
    v_total_q INT := 10;
    v_correct_count INT := 0;
    v_award_res JSONB;
BEGIN
    SELECT user_id, quiz_id, status, score INTO v_user_id, v_quiz_id, v_status, v_correct_count
    FROM public.daily_quiz_attempts WHERE id = p_attempt_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Attempt not found');
    END IF;

    -- Determine whether this is a daily quiz (50 tokens) or explore quiz (15 tokens)
    IF EXISTS (SELECT 1 FROM public.daily_quizzes WHERE id = v_quiz_id) THEN
        v_coins_to_award := 50;
        v_activity_type := 'home_daily_quiz';
        v_ref_id := 'daily_quiz_' || v_user_id::text || '_' || CURRENT_DATE::text;
    ELSE
        v_coins_to_award := 15;
        v_activity_type := 'explore_quiz';
        v_ref_id := 'explore_quiz_' || v_quiz_id::text || '_' || v_user_id::text || '_' || CURRENT_DATE::text;
    END IF;

    IF v_status = 'COMPLETED' THEN
        SELECT score INTO v_correct_count FROM public.daily_quiz_attempts WHERE id = p_attempt_id;
        RETURN jsonb_build_object(
            'success', true,
            'already_completed', true,
            'already_earned', true,
            'score', v_correct_count,
            'total', v_total_q,
            'coins_awarded', 0
        );
    END IF;

    -- Calculate correct answers count
    SELECT COUNT(*) INTO v_correct_count
    FROM public.daily_quiz_answers a
    JOIN public.daily_quiz_questions q ON q.id = a.question_id
    WHERE a.attempt_id = p_attempt_id 
      AND UPPER(TRIM(a.selected_option)) = UPPER(TRIM(q.correct_option));

    IF v_correct_count = 0 THEN
        SELECT COALESCE(score, 0) INTO v_correct_count FROM public.daily_quiz_attempts WHERE id = p_attempt_id;
    END IF;

    UPDATE public.daily_quiz_attempts
    SET status = 'COMPLETED',
        score = v_correct_count,
        total_questions = v_total_q,
        completed_at = NOW(),
        coins_awarded = v_coins_to_award,
        updated_at = NOW()
    WHERE id = p_attempt_id;

    IF v_user_id IS NOT NULL THEN
        v_award_res := public.award_student_activity(
            v_user_id,
            v_activity_type,
            0,
            v_coins_to_award,
            v_ref_id
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', false,
        'already_earned', false,
        'score', v_correct_count,
        'total', v_total_q,
        'coins_awarded', v_coins_to_award,
        'award_details', v_award_res
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Permissions
GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.submit_daily_quiz_attempt(UUID) TO authenticated, anon, service_role;

GRANT ALL ON public.student_wallets TO authenticated, anon, service_role;
GRANT ALL ON public.daily_streaks TO authenticated, anon, service_role;
GRANT ALL ON public.coin_transactions TO authenticated, anon, service_role;
GRANT ALL ON public.reward_transactions TO authenticated, anon, service_role;
