-- ==============================================================================
-- FEEDX WALLET & STREAK RLS WRITE POLICIES & CONVERSION RPC FUNCTION
-- ==============================================================================

-- 0. Ensure reward_redemptions table has coin_cost and certificate_id columns
ALTER TABLE public.reward_redemptions ADD COLUMN IF NOT EXISTS coin_cost INTEGER;
ALTER TABLE public.reward_redemptions ADD COLUMN IF NOT EXISTS certificate_id VARCHAR(50) UNIQUE;

-- 1. Student Wallets: Insert & Update policies for owner
DROP POLICY IF EXISTS "Students can insert own wallet" ON public.student_wallets;
CREATE POLICY "Students can insert own wallet"
    ON public.student_wallets FOR INSERT
    WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can update own wallet" ON public.student_wallets;
CREATE POLICY "Students can update own wallet"
    ON public.student_wallets FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- 2. Daily Streaks: Insert & Update policies for owner
DROP POLICY IF EXISTS "Students can insert own streak" ON public.daily_streaks;
CREATE POLICY "Students can insert own streak"
    ON public.daily_streaks FOR INSERT
    WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can update own streak" ON public.daily_streaks;
CREATE POLICY "Students can update own streak"
    ON public.daily_streaks FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- 3. Coin Transactions: Insert policy for owner
DROP POLICY IF EXISTS "Students can insert own transactions" ON public.coin_transactions;
CREATE POLICY "Students can insert own transactions"
    ON public.coin_transactions FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- 4. RPC Function for Token to Gold Coin Conversion
CREATE OR REPLACE FUNCTION public.convert_tokens_to_gold_coins(
    p_student_id UUID,
    p_tokens_to_convert INT
) RETURNS JSONB AS $$
DECLARE
    v_available_tokens INT;
    v_current_coins INT;
    v_current_total INT;
    v_coins_to_award INT;
    v_used_tokens INT;
    v_remaining_tokens INT;
    v_result JSONB;
BEGIN
    -- Ensure wallet exists
    INSERT INTO public.student_wallets (student_id, gold_coins, total_earned)
    VALUES (p_student_id, 0, 0)
    ON CONFLICT (student_id) DO NOTHING;

    -- Ensure streak exists
    INSERT INTO public.daily_streaks (student_id, current_streak, longest_streak, xp_points)
    VALUES (p_student_id, 0, 0, 0)
    ON CONFLICT (student_id) DO NOTHING;

    -- Get current tokens (XP) and coins
    SELECT xp_points INTO v_available_tokens
    FROM public.daily_streaks
    WHERE student_id = p_student_id;

    SELECT gold_coins, total_earned INTO v_current_coins, v_current_total
    FROM public.student_wallets
    WHERE student_id = p_student_id;

    IF v_available_tokens IS NULL OR v_available_tokens < 1000 OR p_tokens_to_convert < 1000 THEN
        RAISE EXCEPTION 'Insufficient Task Tokens. Need at least 1,000 tokens.';
    END IF;

    v_coins_to_award := FLOOR(p_tokens_to_convert / 1000);
    v_used_tokens := v_coins_to_award * 1000;
    v_remaining_tokens := v_available_tokens - v_used_tokens;

    -- Update daily streaks (Task Tokens)
    UPDATE public.daily_streaks
    SET xp_points = v_remaining_tokens,
        updated_at = NOW()
    WHERE student_id = p_student_id;

    -- Update student wallets (Gold Coins)
    UPDATE public.student_wallets
    SET gold_coins = gold_coins + v_coins_to_award,
        total_earned = total_earned + v_coins_to_award,
        updated_at = NOW()
    WHERE student_id = p_student_id;

    -- Record transaction
    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, v_coins_to_award, 'token_conversion', 'conv_' || extract(epoch from now())::text, 'Redeemed ' || v_used_tokens::text || ' tokens for ' || v_coins_to_award::text || ' Gold Coin(s)');

    v_result := jsonb_build_object(
        'success', true,
        'tokens_converted', v_used_tokens,
        'coins_awarded', v_coins_to_award,
        'new_tokens', v_remaining_tokens,
        'new_coins', v_current_coins + v_coins_to_award
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.convert_tokens_to_gold_coins(UUID, INT) TO authenticated, anon;


-- 5. RPC Function for Redeeming Reward with Auto-Incrementing Unique Certificate ID
CREATE OR REPLACE FUNCTION public.redeem_reward(
    p_student_id UUID,
    p_reward_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_coin_cost INT;
    v_stock INT;
    v_title VARCHAR(150);
    v_category VARCHAR(50);
    v_current_coins INT;
    v_redemption_id UUID;
    v_cert_type VARCHAR(10);
    v_cert_count INT;
    v_cert_id VARCHAR(50);
    v_result JSONB;
BEGIN
    -- Check reward item existence and details
    SELECT coin_cost, stock, title, category INTO v_coin_cost, v_stock, v_title, v_category
    FROM public.reward_catalog
    WHERE id = p_reward_id AND is_active = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reward item not found or unavailable';
    END IF;

    IF v_stock = 0 THEN
        RAISE EXCEPTION 'Reward item is currently out of stock';
    END IF;

    -- Prevent double redemption: ensure user only redeems each certificate/reward once
    IF EXISTS (
        SELECT 1 FROM public.reward_redemptions 
        WHERE student_id = p_student_id AND reward_id = p_reward_id
    ) THEN
        RAISE EXCEPTION 'You have already redeemed this certificate reward.';
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

    -- Generate Unique Certificate ID if applicable
    IF v_category = 'certificate' OR v_title ILIKE '%certificate%' THEN
        IF v_title ILIKE '%excellence%' THEN
            v_cert_type := 'EX';
        ELSIF v_title ILIKE '%verified%' OR v_title ILIKE '%learner%' THEN
            v_cert_type := 'VL';
        ELSE
            v_cert_type := 'AV';
        END IF;

        -- Get next unique number
        SELECT COALESCE(COUNT(*), 0) + 1 INTO v_cert_count
        FROM public.reward_redemptions
        WHERE certificate_id LIKE 'FX-' || v_cert_type || '-%';

        v_cert_id := 'FX-' || v_cert_type || '-' || LPAD(v_cert_count::text, 3, '0');

        -- Ensure it is strictly unique
        WHILE EXISTS (SELECT 1 FROM public.reward_redemptions WHERE certificate_id = v_cert_id) LOOP
            v_cert_count := v_cert_count + 1;
            v_cert_id := 'FX-' || v_cert_type || '-' || LPAD(v_cert_count::text, 3, '0');
        END LOOP;
    ELSE
        v_cert_id := NULL;
    END IF;

    -- Insert redemption record
    INSERT INTO public.reward_redemptions (student_id, reward_id, coin_cost, status, certificate_id)
    VALUES (p_student_id, p_reward_id, v_coin_cost, 'pending', v_cert_id)
    RETURNING id INTO v_redemption_id;

    -- Record negative transaction in ledger
    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, -v_coin_cost, 'redemption', v_redemption_id::text, 'Redeemed reward: ' || v_title);

    v_result := jsonb_build_object(
        'success', true,
        'redemption_id', v_redemption_id,
        'coins_spent', v_coin_cost,
        'reward_title', v_title,
        'certificate_id', v_cert_id
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.redeem_reward(UUID, UUID) TO authenticated, anon;


-- 6. RPC Function to Award Activity and auto-convert points to coins
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
    v_old_xp INT := 0;
    v_new_xp INT := 0;
    v_auto_coins INT := 0;
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
            'xp_awarded', 0,
            'current_streak', v_new_streak,
            'message', 'Activity already rewarded'
        );
    END IF;

    -- Lock and retrieve streak details
    SELECT last_active_date, current_streak, longest_streak, streak_freeze_count, xp_points
    INTO v_last_active, v_curr_streak, v_longest_streak, v_freeze_count, v_old_xp
    FROM public.daily_streaks
    WHERE student_id = p_student_id
    FOR UPDATE;

    IF v_old_xp IS NULL THEN
        v_old_xp := 0;
    END IF;

    v_new_xp := v_old_xp + v_xp_gained;

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

    -- Calculate automatic coins earned (1 Coin per 1000 Points threshold crossed)
    v_auto_coins := FLOOR(v_new_xp / 1000) - FLOOR(v_old_xp / 1000);

    -- Update daily streaks
    UPDATE public.daily_streaks
    SET current_streak = v_new_streak,
        longest_streak = GREATEST(v_longest_streak, v_new_streak),
        last_active_date = v_today,
        streak_freeze_count = v_freeze_count,
        xp_points = v_new_xp,
        activity_history = jsonb_set(COALESCE(activity_history, '{}'::jsonb), ARRAY[v_today::text], 'true'::jsonb),
        updated_at = NOW()
    WHERE student_id = p_student_id;

    -- Award coins in wallet (direct reward + auto threshold coin reward)
    IF v_coins_gained > 0 OR v_auto_coins > 0 THEN
        UPDATE public.student_wallets
        SET gold_coins = gold_coins + v_coins_gained + v_auto_coins,
            total_earned = total_earned + v_coins_gained + v_auto_coins,
            updated_at = NOW()
        WHERE student_id = p_student_id;
    END IF;

    -- ALWAYS record transaction entry to mark activity as completed and track points history
    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (
        p_student_id, 
        v_xp_gained, 
        p_activity_type, 
        v_ref_id, 
        'Completed ' || p_activity_type || ' (' || v_xp_gained::text || ' Points' || CASE WHEN v_auto_coins > 0 THEN ', +1 Coin' ELSE '' END || ')'
    )
    ON CONFLICT DO NOTHING;

    v_result := jsonb_build_object(
        'success', true,
        'already_earned', false,
        'current_streak', v_new_streak,
        'coins_awarded', v_coins_gained + v_auto_coins,
        'xp_awarded', v_xp_gained
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INTEGER, INTEGER, VARCHAR) TO authenticated, anon;


-- 7. RPC Function for atomic submit quiz attempt
CREATE OR REPLACE FUNCTION public.submit_daily_quiz_attempt(
    p_attempt_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_quiz_id UUID;
    v_user_id UUID;
    v_correct_count INT := 0;
    v_total_q INT := 10;
    v_coins_to_award INT := 0;
    v_status VARCHAR(20);
    v_award_res JSONB;
BEGIN
    -- Retrieve attempt details
    SELECT quiz_id, COALESCE(user_id, student_id), status INTO v_quiz_id, v_user_id, v_status
    FROM public.daily_quiz_attempts
    WHERE id = p_attempt_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quiz attempt not found';
    END IF;

    -- Fetch total questions for this quiz dynamically
    SELECT COALESCE(total_questions, 10) 
    INTO v_total_q
    FROM public.daily_quizzes WHERE id = v_quiz_id;

    -- Count actual total questions from question table if present
    SELECT COUNT(*) INTO v_total_q
    FROM public.daily_quiz_questions
    WHERE quiz_id = v_quiz_id;

    IF v_total_q = 0 THEN
        v_total_q := 10;
    END IF;

    -- If attempt is already completed, return existing score without duplicate rewards
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

    -- Calculate total correct answers by joining answers with questions by question_id
    SELECT COUNT(*) INTO v_correct_count
    FROM public.daily_quiz_answers a
    JOIN public.daily_quiz_questions q ON q.id = a.question_id
    WHERE a.attempt_id = p_attempt_id 
      AND UPPER(TRIM(a.selected_option)) = UPPER(TRIM(q.correct_option));

    -- Update attempt record with authoritative score and status
    UPDATE public.daily_quiz_attempts
    SET status = 'COMPLETED',
        score = v_correct_count,
        total_questions = v_total_q,
        completed_at = NOW(),
        coins_awarded = 0,
        updated_at = NOW()
    WHERE id = p_attempt_id;

    -- Award Points atomically (0 direct coins, +6 points per correct answer)
    IF v_user_id IS NOT NULL THEN
        v_award_res := public.award_student_activity(
            v_user_id,
            'quiz_completed',
            0,
            v_correct_count * 6,
            v_quiz_id::text
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', false,
        'score', v_correct_count,
        'total', v_total_q,
        'coins_awarded', 0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.submit_daily_quiz_attempt(UUID) TO authenticated, anon;
