-- ==============================================================================
-- FEEDX — FIX PROFILE PERSISTENCE, REWARD TOKENS, GAMIFICATION & POLL CONSTRAINTS
-- Run this in the Supabase SQL Editor (as postgres / service_role)
-- ==============================================================================

BEGIN;

-- 1. Ensure Profile Columns in public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS domain TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_status TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_profile_saved BOOLEAN DEFAULT true;

-- 2. Ensure Profile Columns in public.students
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS domain TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS current_status TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS is_profile_saved BOOLEAN DEFAULT true;

-- 3. Resilient Column Aliases for Gamification Tables (Prevent PostgREST Column Not Found Crashes)
ALTER TABLE public.coin_transactions ADD COLUMN IF NOT EXISTS user_id UUID;
UPDATE public.coin_transactions SET user_id = student_id WHERE user_id IS NULL AND student_id IS NOT NULL;

ALTER TABLE public.daily_quiz_attempts ADD COLUMN IF NOT EXISTS student_id UUID;
UPDATE public.daily_quiz_attempts SET student_id = user_id WHERE student_id IS NULL AND user_id IS NOT NULL;

ALTER TABLE public.daily_task_completions ADD COLUMN IF NOT EXISTS user_id UUID;
UPDATE public.daily_task_completions SET user_id = student_id WHERE user_id IS NULL AND student_id IS NOT NULL;

ALTER TABLE public.community_likes ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.community_likes ADD COLUMN IF NOT EXISTS student_id UUID;
UPDATE public.community_likes SET user_id = student_id WHERE user_id IS NULL AND student_id IS NOT NULL;
UPDATE public.community_likes SET student_id = user_id WHERE student_id IS NULL AND user_id IS NOT NULL;

-- 4. Standardize FX Token Rewards:
-- Daily Task Quiz: 50 FX Tokens | Explore Page Quiz: 15 FX Tokens
-- Daily Task Quick Learn: 50 FX Tokens | Explore Page Quick Learn: 10 FX Tokens
DO $$
BEGIN
    -- 1. Explore Quick Learn Lessons (10 FX)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quick_learn_lessons') THEN
        ALTER TABLE public.quick_learn_lessons ADD COLUMN IF NOT EXISTS fx_reward INTEGER DEFAULT 10;
        UPDATE public.quick_learn_lessons SET fx_reward = 10 WHERE fx_reward IS NULL OR fx_reward != 10;
    END IF;

    -- 2. Explore Quizzes (15 FX)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'explore_quizzes') THEN
        ALTER TABLE public.explore_quizzes ADD COLUMN IF NOT EXISTS fx_reward INTEGER DEFAULT 15;
        UPDATE public.explore_quizzes SET fx_reward = 15 WHERE fx_reward IS NULL OR fx_reward != 15;
    END IF;

    -- 3. Daily Quizzes (50 FX for Daily Task Quiz)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'daily_quizzes') THEN
        ALTER TABLE public.daily_quizzes ADD COLUMN IF NOT EXISTS fx_reward INTEGER DEFAULT 50;
        ALTER TABLE public.daily_quizzes ADD COLUMN IF NOT EXISTS coins_reward INTEGER DEFAULT 50;
        UPDATE public.daily_quizzes SET fx_reward = 50, coins_reward = 50 WHERE fx_reward IS NULL OR fx_reward != 50 OR coins_reward != 50;
    END IF;
END $$;

-- 5. Authoritative, Concurrency-Safe and Idempotent award_student_activity Function
-- Enforces exact token rewards:
-- Home Quick Learn = 50 FX Tokens | Home Daily Quiz = 50 FX Tokens
-- Explore Quick Learn = 10 FX Tokens | Explore Quiz = 15 FX Tokens
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
) RETURNS JSONB AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
    v_ref_id VARCHAR(100) := COALESCE(p_reference_id, p_activity_type || '_' || p_student_id::text || '_' || v_today::text);
    v_last_active DATE;
    v_curr_streak INT := 0;
    v_longest_streak INT := 0;
    v_new_streak INT := 1;
    v_tokens_reward INT := GREATEST(COALESCE(p_xp_reward, 0), 0);
    v_coin_reward_actual INT := GREATEST(COALESCE(p_coin_reward, 0), 0);
    v_day_diff INT := 0;
    v_new_xp INT := 0;
BEGIN
    -- Server-side authoritative reward mapping: Never trust client-supplied token amounts
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
    END IF;

    -- Idempotency check: prevent duplicate reward/activity recording
    IF EXISTS (
        SELECT 1 FROM public.coin_transactions
        WHERE student_id = p_student_id
          AND activity_type = p_activity_type
          AND reference_id = v_ref_id
    ) OR EXISTS (
        SELECT 1 FROM public.reward_transactions 
        WHERE (user_id = p_student_id OR student_id = p_student_id) 
          AND source_type = p_activity_type 
          AND source_id = v_ref_id
    ) THEN
        SELECT current_streak, xp_points INTO v_new_streak, v_new_xp FROM public.daily_streaks WHERE student_id = p_student_id;
        RETURN jsonb_build_object(
            'success', true,
            'already_completed', true,
            'already_earned', true,
            'tokens_awarded', 0,
            'coins_awarded', 0,
            'current_streak', COALESCE(v_new_streak, 1),
            'new_xp', COALESCE(v_new_xp, 0)
        );
    END IF;

    -- Ensure daily_streaks row exists for this user
    INSERT INTO public.daily_streaks (student_id, current_streak, longest_streak, last_active_date, xp_points)
    VALUES (p_student_id, 0, 0, NULL, 0)
    ON CONFLICT (student_id) DO NOTHING;

    -- Acquire row lock on daily_streaks to prevent concurrent race conditions
    SELECT last_active_date, current_streak, longest_streak, xp_points
    INTO v_last_active, v_curr_streak, v_longest_streak, v_new_xp
    FROM public.daily_streaks
    WHERE student_id = p_student_id
    FOR UPDATE;

    -- Streak calculation rules:
    -- Case 1: First qualifying activity (v_last_active is NULL) -> streak = 1
    -- Case 2: Another activity on the same date (v_day_diff = 0) -> streak = v_curr_streak (do not increment again)
    -- Case 3: Next consecutive calendar date (v_day_diff = 1) -> streak = v_curr_streak + 1
    -- Case 4: 1 or more calendar days missed (v_day_diff >= 2) -> streak = 1 (restart at Day 1)
    IF v_last_active IS NULL THEN
        v_new_streak := 1;
    ELSE
        v_day_diff := v_today - v_last_active;
        IF v_day_diff = 0 THEN
            v_new_streak := GREATEST(v_curr_streak, 1);
        ELSIF v_day_diff = 1 THEN
            v_new_streak := COALESCE(v_curr_streak, 0) + 1;
        ELSE
            v_new_streak := 1;
        END IF;
    END IF;

    v_longest_streak := GREATEST(COALESCE(v_longest_streak, 0), v_new_streak);
    v_new_xp := COALESCE(v_new_xp, 0) + v_tokens_reward;

    -- Insert coin_transactions atomically
    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, v_tokens_reward, p_activity_type, v_ref_id, 'Earned +' || v_tokens_reward || ' Task Tokens for ' || p_activity_type)
    ON CONFLICT (student_id, activity_type, reference_id) DO NOTHING;

    -- Insert reward_transactions if table exists
    BEGIN
        INSERT INTO public.reward_transactions (user_id, student_id, source_type, source_id, coins, points)
        VALUES (p_student_id, p_student_id, p_activity_type, v_ref_id, v_coin_reward_actual, v_tokens_reward)
        ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- Update daily_streaks atomically
    UPDATE public.daily_streaks
    SET current_streak = v_new_streak,
        longest_streak = v_longest_streak,
        total_active_days = COALESCE(total_active_days, 0) + (CASE WHEN v_last_active = v_today THEN 0 ELSE 1 END),
        last_active_date = v_today,
        xp_points = v_new_xp,
        updated_at = now()
    WHERE student_id = p_student_id;

    -- Update student_wallets atomically (no references to non-existent students.gold_coins)
    INSERT INTO public.student_wallets (student_id, gold_coins, tokens, total_earned, total_redeemed, updated_at)
    VALUES (p_student_id, v_coin_reward_actual, v_tokens_reward, v_tokens_reward, 0, now())
    ON CONFLICT (student_id) DO UPDATE SET
        gold_coins = public.student_wallets.gold_coins + EXCLUDED.gold_coins,
        tokens = public.student_wallets.tokens + EXCLUDED.tokens,
        total_earned = public.student_wallets.total_earned + EXCLUDED.tokens,
        updated_at = now();

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', false,
        'already_earned', false,
        'tokens_awarded', v_tokens_reward,
        'coins_awarded', v_coin_reward_actual,
        'current_streak', v_new_streak,
        'longest_streak', v_longest_streak,
        'new_xp', v_new_xp
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) TO authenticated, anon, service_role;

-- 6. Atomic submit_daily_quiz_attempt RPC Function
CREATE OR REPLACE FUNCTION public.submit_daily_quiz_attempt(
    p_attempt_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_quiz_id UUID;
    v_status VARCHAR(50);
    v_coins_to_award INT := 50;
    v_activity_type VARCHAR(50) := 'daily_quiz';
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
        v_activity_type := 'daily_quiz';
        v_ref_id := 'daily_quiz_' || v_user_id::text || '_' || CURRENT_DATE::text;
    ELSE
        v_coins_to_award := 15;
        v_activity_type := 'explore_quiz';
        v_ref_id := 'explore_quiz_' || v_quiz_id::text || '_' || v_user_id::text || '_' || CURRENT_DATE::text;
    END IF;

    IF v_total_q IS NULL OR v_total_q = 0 THEN
        SELECT COUNT(*) INTO v_total_q
        FROM public.daily_quiz_questions
        WHERE quiz_id = v_quiz_id;
        IF v_total_q = 0 THEN
            v_total_q := 10;
        END IF;
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
GRANT EXECUTE ON FUNCTION public.submit_daily_quiz_attempt(UUID) TO authenticated, anon, service_role;

-- 5. Safe Indexes for Fast Dashboard, Profile & Gamification Queries
CREATE INDEX IF NOT EXISTS idx_coin_txs_student_created ON public.coin_transactions(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coin_txs_user_created ON public.coin_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_task_student_date ON public.daily_task_completions(student_id, task_date);
CREATE INDEX IF NOT EXISTS idx_daily_quiz_user ON public.daily_quiz_attempts(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_community_likes_post ON public.community_likes(post_id);

-- 6. Fix Community Polls Schema, Foreign Key Constraints & Permissions
-- Unify polls table to support both poll_options relational model and options JSONB model
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    allow_multiple BOOLEAN DEFAULT false,
    anonymous_voting BOOLEAN DEFAULT true,
    show_results_before_vote BOOLEAN DEFAULT false,
    allow_vote_change BOOLEAN DEFAULT false,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add missing columns to public.polls
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS post_id UUID;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS question TEXT DEFAULT 'Poll';
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS allow_multiple BOOLEAN DEFAULT false;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS anonymous_voting BOOLEAN DEFAULT true;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS show_results_before_vote BOOLEAN DEFAULT false;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS allow_vote_change BOOLEAN DEFAULT false;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS total_votes INT DEFAULT 0;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb;

-- Drop NOT NULL constraint on options if it was set in prior migrations
DO $$
BEGIN
    ALTER TABLE public.polls ALTER COLUMN options DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- 7. Ensure poll_options table and constraints
CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.poll_options ADD COLUMN IF NOT EXISTS poll_id UUID;
ALTER TABLE public.poll_options ADD COLUMN IF NOT EXISTS option_text TEXT;
ALTER TABLE public.poll_options ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 8. Ensure poll_votes table and constraints
CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
    option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE,
    student_id UUID,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.poll_votes ADD COLUMN IF NOT EXISTS poll_id UUID;
ALTER TABLE public.poll_votes ADD COLUMN IF NOT EXISTS option_id UUID;
ALTER TABLE public.poll_votes ADD COLUMN IF NOT EXISTS student_id UUID;
ALTER TABLE public.poll_votes ADD COLUMN IF NOT EXISTS user_id UUID;

-- 9. Guarantee Foreign Key Constraints so PostgREST Embedded Resource Joins Work
DO $$
BEGIN
    -- polls -> community_posts
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'polls_post_id_fkey') THEN
        ALTER TABLE public.polls ADD CONSTRAINT polls_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;
    END IF;

    -- poll_options -> polls
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'poll_options_poll_id_fkey') THEN
        ALTER TABLE public.poll_options ADD CONSTRAINT poll_options_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.polls(id) ON DELETE CASCADE;
    END IF;

    -- poll_votes -> polls
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'poll_votes_poll_id_fkey') THEN
        ALTER TABLE public.poll_votes ADD CONSTRAINT poll_votes_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.polls(id) ON DELETE CASCADE;
    END IF;

    -- poll_votes -> poll_options
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'poll_votes_option_id_fkey') THEN
        ALTER TABLE public.poll_votes ADD CONSTRAINT poll_votes_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.poll_options(id) ON DELETE CASCADE;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- 10. Table Privileges for authenticated and anon roles
GRANT ALL ON public.polls TO authenticated, service_role;
GRANT SELECT ON public.polls TO anon;

GRANT ALL ON public.poll_options TO authenticated, service_role;
GRANT SELECT ON public.poll_options TO anon;

GRANT ALL ON public.poll_votes TO authenticated, service_role;
GRANT SELECT ON public.poll_votes TO anon;

GRANT ALL ON public.community_posts TO authenticated, anon, service_role;
GRANT ALL ON public.community_post_images TO authenticated, anon, service_role;

-- 11. Row Level Security Policies for Polls & Options
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read polls" ON public.polls;
CREATE POLICY "Anyone can read polls" ON public.polls FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create polls" ON public.polls;
CREATE POLICY "Authenticated users can create polls" ON public.polls FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update polls" ON public.polls;
CREATE POLICY "Authenticated users can update polls" ON public.polls FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete polls" ON public.polls;
CREATE POLICY "Authenticated users can delete polls" ON public.polls FOR DELETE TO authenticated USING (true);

-- poll_options RLS
DROP POLICY IF EXISTS "Anyone can read poll_options" ON public.poll_options;
CREATE POLICY "Anyone can read poll_options" ON public.poll_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage poll_options" ON public.poll_options;
CREATE POLICY "Authenticated users can manage poll_options" ON public.poll_options FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- poll_votes RLS
DROP POLICY IF EXISTS "Anyone can read poll_votes" ON public.poll_votes;
CREATE POLICY "Anyone can read poll_votes" ON public.poll_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can vote" ON public.poll_votes;
CREATE POLICY "Authenticated users can vote" ON public.poll_votes FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can change vote" ON public.poll_votes;
CREATE POLICY "Authenticated users can change vote" ON public.poll_votes FOR DELETE TO authenticated USING (true);

-- 12. Enable Realtime Publications for Polls & Votes
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_options;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_votes;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

COMMIT;
