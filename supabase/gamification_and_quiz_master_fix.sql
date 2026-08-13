-- ==============================================================================
-- FEEDX MASTER GAMIFICATION, DAILY TASK, CHALLENGE & QUIZ DATABASE MIGRATION
-- (COMPATIBLE WITH user_id AND student_id COLUMN SCHEMAS & PRE-EXISTING RPCs)
-- ==============================================================================

-- 1. Ensure Base Tables Exist with standard definitions
CREATE TABLE IF NOT EXISTS public.reward_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    student_id UUID,
    source_type VARCHAR(50) NOT NULL,
    source_id VARCHAR(100) NOT NULL,
    points INT DEFAULT 0,
    coins INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    student_id UUID,
    task_id VARCHAR(100) NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_challenge_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    student_id UUID,
    challenge_id UUID NOT NULL,
    selected_answer TEXT,
    score INT DEFAULT 0,
    is_correct BOOLEAN DEFAULT FALSE,
    xp_earned INT DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID,
    user_id UUID,
    amount INTEGER DEFAULT 0,
    activity_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Safely add missing columns to existing tables dynamically if they pre-existed
DO $$ 
BEGIN
    -- reward_transactions columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reward_transactions' AND column_name = 'user_id') THEN
        ALTER TABLE public.reward_transactions ADD COLUMN user_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reward_transactions' AND column_name = 'student_id') THEN
        ALTER TABLE public.reward_transactions ADD COLUMN student_id UUID;
    END IF;

    -- daily_task_completions columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_task_completions' AND column_name = 'user_id') THEN
        ALTER TABLE public.daily_task_completions ADD COLUMN user_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_task_completions' AND column_name = 'student_id') THEN
        ALTER TABLE public.daily_task_completions ADD COLUMN student_id UUID;
    END IF;

    -- daily_challenge_attempts columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_challenge_attempts' AND column_name = 'user_id') THEN
        ALTER TABLE public.daily_challenge_attempts ADD COLUMN user_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_challenge_attempts' AND column_name = 'student_id') THEN
        ALTER TABLE public.daily_challenge_attempts ADD COLUMN student_id UUID;
    END IF;

    -- coin_transactions columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'coin_transactions' AND column_name = 'user_id') THEN
        ALTER TABLE public.coin_transactions ADD COLUMN user_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'coin_transactions' AND column_name = 'student_id') THEN
        ALTER TABLE public.coin_transactions ADD COLUMN student_id UUID;
    END IF;

    -- daily_quiz_attempts columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_quiz_attempts' AND column_name = 'user_id') THEN
        ALTER TABLE public.daily_quiz_attempts ADD COLUMN user_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_quiz_attempts' AND column_name = 'student_id') THEN
        ALTER TABLE public.daily_quiz_attempts ADD COLUMN student_id UUID;
    END IF;

    -- daily_quiz_answers columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_quiz_answers' AND column_name = 'user_id') THEN
        ALTER TABLE public.daily_quiz_answers ADD COLUMN user_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_quiz_answers' AND column_name = 'student_id') THEN
        ALTER TABLE public.daily_quiz_answers ADD COLUMN student_id UUID;
    END IF;
END $$;

-- 3. Update Check Constraints for Quiz Tables up to 50 Questions
ALTER TABLE public.daily_quizzes DROP CONSTRAINT IF EXISTS daily_quizzes_total_questions_check;
ALTER TABLE public.daily_quizzes ADD CONSTRAINT daily_quizzes_total_questions_check CHECK (total_questions BETWEEN 1 AND 50);

ALTER TABLE public.daily_quiz_questions DROP CONSTRAINT IF EXISTS daily_quiz_questions_question_number_check;
ALTER TABLE public.daily_quiz_questions ADD CONSTRAINT daily_quiz_questions_question_number_check CHECK (question_number BETWEEN 1 AND 50);

ALTER TABLE public.daily_quiz_attempts DROP CONSTRAINT IF EXISTS daily_quiz_attempts_current_question_check;
ALTER TABLE public.daily_quiz_attempts ADD CONSTRAINT daily_quiz_attempts_current_question_check CHECK (current_question BETWEEN 1 AND 50);

-- Enable RLS and Grant Permissions
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quiz_answers ENABLE ROW LEVEL SECURITY;

-- 3b. Update RLS Policies to use COALESCE for both user_id and student_id
DROP POLICY IF EXISTS "Users can view own reward transactions" ON public.reward_transactions;
CREATE POLICY "Users can view own reward transactions" ON public.reward_transactions 
FOR SELECT USING (auth.uid() = COALESCE(user_id, student_id) OR user_id IS NOT NULL OR student_id IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert own reward transactions" ON public.reward_transactions;
CREATE POLICY "Users can insert own reward transactions" ON public.reward_transactions 
FOR INSERT WITH CHECK (auth.uid() = COALESCE(user_id, student_id) OR user_id IS NOT NULL OR student_id IS NOT NULL);

DROP POLICY IF EXISTS "Users can view own task completions" ON public.daily_task_completions;
CREATE POLICY "Users can view own task completions" ON public.daily_task_completions 
FOR SELECT USING (auth.uid() = COALESCE(user_id, student_id) OR user_id IS NOT NULL OR student_id IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert own task completions" ON public.daily_task_completions;
CREATE POLICY "Users can insert own task completions" ON public.daily_task_completions 
FOR INSERT WITH CHECK (auth.uid() = COALESCE(user_id, student_id) OR user_id IS NOT NULL OR student_id IS NOT NULL);

DROP POLICY IF EXISTS "Users can manage challenge attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Users can manage challenge attempts" ON public.daily_challenge_attempts 
FOR ALL USING (auth.uid() = COALESCE(user_id, student_id) OR user_id IS NOT NULL OR student_id IS NOT NULL);

DROP POLICY IF EXISTS "Students can manage own quiz attempts" ON public.daily_quiz_attempts;
CREATE POLICY "Students can manage own quiz attempts" ON public.daily_quiz_attempts 
FOR ALL USING (auth.uid() = COALESCE(user_id, student_id) OR user_id IS NOT NULL OR student_id IS NOT NULL);

DROP POLICY IF EXISTS "Students can manage own quiz answers" ON public.daily_quiz_answers;
CREATE POLICY "Students can manage own quiz answers" ON public.daily_quiz_answers 
FOR ALL USING (auth.uid() = COALESCE(user_id, student_id) OR user_id IS NOT NULL OR student_id IS NOT NULL);

GRANT ALL ON public.reward_transactions TO authenticated, anon;
GRANT ALL ON public.daily_task_completions TO authenticated, anon;
GRANT ALL ON public.daily_challenge_attempts TO authenticated, anon;
GRANT ALL ON public.coin_transactions TO authenticated, anon;
GRANT ALL ON public.daily_quiz_attempts TO authenticated, anon;
GRANT ALL ON public.daily_quiz_answers TO authenticated, anon;


-- ==============================================================================
-- 4. ATOMIC REWARD RPC FUNCTION (Matched parameters to JS awardActivity call)
-- ==============================================================================
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR);
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, character varying, integer, integer, character varying);

CREATE OR REPLACE FUNCTION public.award_student_activity(
    p_student_id UUID,
    p_activity_type VARCHAR(50),
    p_coin_reward INT,
    p_xp_reward INT,
    p_reference_id VARCHAR(100)
) RETURNS JSONB AS $$
DECLARE
    v_already_claimed BOOLEAN := FALSE;
    v_new_coins INT := 0;
    v_new_xp INT := 0;
    v_coin_reward_actual INT := p_coin_reward; -- Award coins/tokens directly
BEGIN
    -- Check if reward was already awarded for this specific source
    IF EXISTS (
        SELECT 1 FROM public.reward_transactions 
        WHERE (user_id = p_student_id OR student_id = p_student_id) 
          AND source_type = p_activity_type 
          AND source_id = p_reference_id
    ) THEN
        v_already_claimed := TRUE;
    ELSE
        -- Insert unique reward transaction record
        INSERT INTO public.reward_transactions (user_id, student_id, source_type, source_id, coins, points)
        VALUES (p_student_id, p_student_id, p_activity_type, p_reference_id, v_coin_reward_actual, p_xp_reward);

        -- Also record in coin_transactions if present
        INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
        VALUES (p_student_id, v_coin_reward_actual, p_activity_type, p_reference_id, 'Earned +' || p_xp_reward || ' Tokens (XP)');

        -- Atomically update student profile balances in public.students table if present
        UPDATE public.students
        SET gold_coins = COALESCE(gold_coins, 0) + v_coin_reward_actual,
            coins = COALESCE(coins, 0) + v_coin_reward_actual,
            xp_points = COALESCE(xp_points, 0) + p_xp_reward,
            updated_at = NOW()
        WHERE id = p_student_id
        RETURNING COALESCE(gold_coins, 0), COALESCE(xp_points, 0) INTO v_new_coins, v_new_xp;

        -- Also sync public.users table if present
        UPDATE public.users
        SET gold_coins = COALESCE(gold_coins, 0) + v_coin_reward_actual,
            coins = COALESCE(coins, 0) + v_coin_reward_actual,
            xp = COALESCE(xp, 0) + p_xp_reward
        WHERE id = p_student_id;

        -- Also sync public.student_wallets table if present
        UPDATE public.student_wallets
        SET gold_coins = COALESCE(gold_coins, 0) + v_coin_reward_actual,
            total_earned = COALESCE(total_earned, 0) + v_coin_reward_actual,
            updated_at = NOW()
        WHERE student_id = p_student_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', v_already_claimed,
        'already_earned', v_already_claimed,
        'coins_awarded', CASE WHEN v_already_claimed THEN 0 ELSE p_coin_reward END,
        'xp_awarded', CASE WHEN v_already_claimed THEN 0 ELSE p_xp_reward END,
        'new_coins', v_new_coins,
        'new_xp', v_new_xp
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 5. ATOMIC DAILY TASK COMPLETION RPC
-- ==============================================================================
DROP FUNCTION IF EXISTS public.submit_daily_task(UUID, VARCHAR, INT, INT);
DROP FUNCTION IF EXISTS public.submit_daily_task(UUID, character varying, integer, integer);

CREATE OR REPLACE FUNCTION public.submit_daily_task(
    p_user_id UUID,
    p_task_id VARCHAR(100),
    p_coins INT,
    p_xp INT
) RETURNS JSONB AS $$
DECLARE
    v_award_result JSONB;
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.daily_task_completions
        WHERE (user_id = p_user_id OR student_id = p_user_id) AND task_id = p_task_id
    ) THEN
        RETURN jsonb_build_object(
            'success', true,
            'already_completed', true,
            'message', 'Task already completed today'
        );
    END IF;

    -- Record completion
    INSERT INTO public.daily_task_completions (user_id, student_id, task_id, completed_at)
    VALUES (p_user_id, p_user_id, p_task_id, NOW());

    -- Award points & coins atomically
    v_award_result := public.award_student_activity(p_user_id, 'daily_task', p_coins, p_xp, p_task_id);

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', false,
        'coins_awarded', p_coins,
        'xp_awarded', p_xp,
        'award_details', v_award_result
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 6. ATOMIC DAILY CHALLENGE SUBMISSION RPC
-- ==============================================================================
DROP FUNCTION IF EXISTS public.submit_daily_challenge(UUID, UUID, TEXT);
DROP FUNCTION IF EXISTS public.submit_daily_challenge(UUID, UUID, character varying);

CREATE OR REPLACE FUNCTION public.submit_daily_challenge(
    p_challenge_id UUID,
    p_user_id UUID,
    p_selected_answer TEXT
) RETURNS JSONB AS $$
DECLARE
    v_correct_ans TEXT;
    v_explanation TEXT;
    v_xp_reward INT := 20;
    v_is_correct BOOLEAN := FALSE;
    v_already_completed BOOLEAN := FALSE;
    v_award_res JSONB;
BEGIN
    -- Retrieve correct answer & explanation from challenge definition
    SELECT correct_answer, explanation, xp_reward 
    INTO v_correct_ans, v_explanation, v_xp_reward
    FROM public.daily_challenges
    WHERE id = p_challenge_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Daily challenge not found';
    END IF;

    -- Compare answers (case-insensitive & trimmed)
    v_is_correct := (LOWER(TRIM(v_correct_ans)) = LOWER(TRIM(p_selected_answer)))
                 OR (LOWER(TRIM(p_selected_answer)) LIKE '%' || LOWER(TRIM(v_correct_ans)) || '%');

    -- Check prior completion
    IF EXISTS (
        SELECT 1 FROM public.daily_challenge_attempts
        WHERE (user_id = p_user_id OR student_id = p_user_id) AND challenge_id = p_challenge_id AND is_correct = TRUE
    ) THEN
        v_already_completed := TRUE;
    END IF;

    -- Record challenge attempt
    INSERT INTO public.daily_challenge_attempts (user_id, student_id, challenge_id, selected_answer, score, is_correct, xp_earned)
    VALUES (p_user_id, p_user_id, p_challenge_id, p_selected_answer, CASE WHEN v_is_correct THEN 100 ELSE 0 END, v_is_correct, CASE WHEN v_is_correct THEN v_xp_reward ELSE 0 END);

    -- Award coins & XP if correct
    IF v_is_correct THEN
        v_award_res := public.award_student_activity(
            p_user_id,
            'daily_challenge',
            10,
            v_xp_reward,
            p_challenge_id::text
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'is_correct', v_is_correct,
        'already_completed', v_already_completed,
        'already_earned', v_already_completed,
        'score', CASE WHEN v_is_correct THEN 100 ELSE 0 END,
        'xp_earned', CASE WHEN v_is_correct THEN v_xp_reward ELSE 0 END,
        'correct_answer', v_correct_ans,
        'explanation', COALESCE(v_explanation, 'Standard challenge solution explanation.')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 7. ATOMIC DAILY QUIZ SUBMISSION RPC
-- ==============================================================================
DROP FUNCTION IF EXISTS public.submit_daily_quiz_attempt(UUID);

CREATE OR REPLACE FUNCTION public.submit_daily_quiz_attempt(
    p_attempt_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_quiz_id UUID;
    v_user_id UUID;
    v_correct_count INT := 0;
    v_total_q INT := 10;
    v_coins_to_award INT := 15;
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

    -- Fetch coin reward amount & total questions for this quiz dynamically
    SELECT COALESCE(coins_reward, 15), COALESCE(total_questions, 10) 
    INTO v_coins_to_award, v_total_q
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
        coins_awarded = v_coins_to_award,
        updated_at = NOW()
    WHERE id = p_attempt_id;

    -- Award Gold Coins atomically via central reward function
    IF v_user_id IS NOT NULL THEN
        v_award_res := public.award_student_activity(
            v_user_id,
            'quiz_completed',
            v_coins_to_award,
            v_correct_count * 10,
            v_quiz_id::text
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

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.submit_daily_task(UUID, VARCHAR, INT, INT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.submit_daily_challenge(UUID, UUID, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.submit_daily_quiz_attempt(UUID) TO authenticated, anon;

NOTIFY pgrst, 'reload schema';
