-- ==============================================================================
-- FEEDX — TEST ENVIRONMENT USER RESET & BHANU000 ACCOUNT INITIALIZATION
-- Run this script in your Supabase SQL Editor (as postgres/service_role)
-- 
-- Summary:
-- 1. Safely removes old test user data in valid foreign-key dependency order.
-- 2. Preserves all institutional master data (colleges, branches, years, quizzes, roadmaps).
-- 3. Creates clean authenticated test account: bhanu000@gmail.com (Password: FeedX@123).
-- 4. Initializes bhanu000's public profile, students record, daily_streaks, and wallet.
-- 5. Updates the atomic award_student_activity function with strict streak rules.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- STEP 0: Ensure sync_gpa_and_cgpa trigger function is deletion-safe
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_gpa_and_cgpa()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id UUID;
    v_semester INTEGER;
    v_total_credits NUMERIC;
    v_total_points NUMERIC;
    v_semester_gpa NUMERIC;
    v_overall_credits NUMERIC;
    v_overall_points NUMERIC;
    v_cgpa NUMERIC;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_student_id := OLD.student_id;
        v_semester := OLD.semester_number;
    ELSE
        v_student_id := NEW.student_id;
        v_semester := NEW.semester_number;
    END IF;

    -- Guard: If student does not exist (parent record was deleted or is being deleted), skip sync
    IF NOT EXISTS (SELECT 1 FROM public.students WHERE id = v_student_id) THEN
        RETURN NULL;
    END IF;

    -- A. Calculate and update Semester GPA
    SELECT COALESCE(SUM(credits), 0), COALESCE(SUM(credits * grade_point), 0)
    INTO v_total_credits, v_total_points
    FROM public.student_grades
    WHERE student_id = v_student_id AND semester_number = v_semester;

    IF v_total_credits > 0 THEN
        v_semester_gpa := ROUND((v_total_points / v_total_credits), 2);
    ELSE
        v_semester_gpa := 0.0;
    END IF;

    INSERT INTO public.student_semesters (student_id, semester_number, total_credits, total_credit_points, gpa, updated_at)
    VALUES (v_student_id, v_semester, v_total_credits, v_total_points, v_semester_gpa, now())
    ON CONFLICT (student_id, semester_number) DO UPDATE
    SET total_credits = EXCLUDED.total_credits,
        total_credit_points = EXCLUDED.total_credit_points,
        gpa = EXCLUDED.gpa,
        updated_at = now();

    -- B. Calculate and update overall student CGPA in public.students
    SELECT COALESCE(SUM(total_credits), 0), COALESCE(SUM(total_credit_points), 0)
    INTO v_overall_credits, v_overall_points
    FROM public.student_semesters
    WHERE student_id = v_student_id;

    IF v_overall_credits > 0 THEN
        v_cgpa := ROUND((v_overall_points / v_overall_credits), 2);
    ELSE
        v_cgpa := 0.0;
    END IF;

    UPDATE public.students
    SET cgpa = v_cgpa
    WHERE id = v_student_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- STEP 1: Ordered deletion of test user-owned activity records
-- ------------------------------------------------------------------------------
-- Clean up grades and semesters with triggers disabled to prevent cascade issues
ALTER TABLE IF EXISTS public.student_grades DISABLE TRIGGER ALL;
DELETE FROM public.student_grades;
DELETE FROM public.student_semesters;
ALTER TABLE IF EXISTS public.student_grades ENABLE TRIGGER ALL;

DELETE FROM public.daily_quiz_answers;
DELETE FROM public.daily_quiz_attempts;
DELETE FROM public.daily_task_completions;
DELETE FROM public.coin_transactions;
DELETE FROM public.reward_transactions;
DELETE FROM public.reward_redemptions;
DELETE FROM public.student_wallets;
DELETE FROM public.daily_streaks;
DELETE FROM public.student_lesson_progress;
DELETE FROM public.student_roadmap_progress;
DELETE FROM public.activation_sessions;
DELETE FROM public.student_profiles;
DELETE FROM public.community_likes;
DELETE FROM public.community_comments;
DELETE FROM public.community_shares;
DELETE FROM public.community_posts;
DELETE FROM public.event_registrations;
DELETE FROM public.qr_verifications;
DELETE FROM public.support_suggestions;
DELETE FROM public.support_feedbacks;

-- Delete non-admin students and users
DELETE FROM public.students;
DELETE FROM public.users WHERE role != 'super_admin';

-- Delete test users from auth.users (excluding superadmin if any)
DELETE FROM auth.users 
WHERE email NOT ILIKE 'superadmin%' 
  AND email NOT ILIKE 'feedx.superadmin@feedx.app';

-- ------------------------------------------------------------------------------
-- STEP 2: Create new authenticated account for bhanu000@gmail.com
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    v_new_auth_id UUID := gen_random_uuid();
    v_college_id UUID;
    v_branch_id UUID;
    v_academic_year_id UUID;
BEGIN
    -- Fetch first available college, branch, and academic year for student identity
    SELECT id INTO v_college_id FROM public.colleges LIMIT 1;
    SELECT id INTO v_branch_id FROM public.branches LIMIT 1;
    SELECT id INTO v_academic_year_id FROM public.academic_years LIMIT 1;

    -- 1. Insert into auth.users (Password: FeedX@123)
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        role,
        aud
    )
    VALUES (
        v_new_auth_id,
        '00000000-0000-0000-0000-000000000000',
        'bhanu000@gmail.com',
        extensions.crypt('FeedX@123', extensions.gen_salt('bf')),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Bhanu Prasad","role":"student"}'::jsonb,
        now(),
        now(),
        'authenticated',
        'authenticated'
    );

    -- 2. Insert into public.users
    INSERT INTO public.users (
        id,
        email,
        full_name,
        role,
        phone,
        date_of_birth,
        is_password_set,
        first_login_completed,
        is_active,
        college_id,
        feedx_id,
        branch,
        year,
        created_at,
        updated_at
    )
    VALUES (
        v_new_auth_id,
        'bhanu000@gmail.com',
        'Bhanu Prasad',
        'student',
        '9876543210',
        '2005-01-15',
        TRUE,
        TRUE,
        TRUE,
        v_college_id,
        'FEEDX-TG-26-BHANU0',
        'Computer Science / IT',
        '1st Year',
        now(),
        now()
    );

    -- 3. Insert into public.students
    INSERT INTO public.students (
        id,
        roll_number,
        full_name,
        email,
        phone,
        college_id,
        branch_id,
        academic_year_id,
        date_of_birth,
        is_password_set,
        year,
        feedx_id,
        qr_code_data,
        identity_status,
        created_at
    )
    VALUES (
        v_new_auth_id,
        '23951A0501',
        'Bhanu Prasad',
        'bhanu000@gmail.com',
        '9876543210',
        v_college_id,
        v_branch_id,
        v_academic_year_id,
        '2005-01-15',
        TRUE,
        '1st Year',
        'FEEDX-TG-26-BHANU0',
        'FEEDX-TG-26-BHANU0',
        'verified',
        now()
    );

    -- 4. Initialize clean daily_streaks (0 active days, 0 streak)
    INSERT INTO public.daily_streaks (
        student_id,
        current_streak,
        longest_streak,
        total_active_days,
        last_active_date,
        streak_freeze_count,
        xp_points,
        activity_history,
        updated_at
    )
    VALUES (
        v_new_auth_id,
        0,
        0,
        0,
        NULL,
        1,
        0,
        '{}'::jsonb,
        now()
    );

    -- 5. Initialize clean student_wallets (0 tokens, 0 coins)
    INSERT INTO public.student_wallets (
        student_id,
        gold_coins,
        tokens,
        total_earned,
        total_redeemed,
        updated_at
    )
    VALUES (
        v_new_auth_id,
        0,
        0,
        0,
        0,
        now()
    );

    RAISE NOTICE 'Created new user bhanu000@gmail.com with ID: %', v_new_auth_id;
END $$;

-- ------------------------------------------------------------------------------
-- STEP 3: Deploy Authoritative, Concurrency-Safe award_student_activity Function
-- ------------------------------------------------------------------------------
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
    v_last_active DATE;
    v_curr_streak INT := 0;
    v_longest_streak INT := 0;
    v_new_streak INT := 1;
    v_tokens_reward INT := GREATEST(COALESCE(p_xp_reward, 0), 0);
    v_coin_reward_actual INT := GREATEST(COALESCE(p_coin_reward, 0), 0);
    v_day_diff INT := 0;
BEGIN
    -- Idempotency check: prevent duplicate reward/activity recording
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
        SELECT current_streak INTO v_new_streak FROM public.daily_streaks WHERE student_id = p_student_id;
        RETURN jsonb_build_object(
            'success', true,
            'already_completed', true,
            'already_earned', true,
            'tokens_awarded', 0,
            'coins_awarded', 0,
            'current_streak', COALESCE(v_new_streak, 1)
        );
    END IF;

    -- Ensure daily_streaks row exists for this user
    INSERT INTO public.daily_streaks (student_id, current_streak, longest_streak, last_active_date)
    VALUES (p_student_id, 0, 0, NULL)
    ON CONFLICT (student_id) DO NOTHING;

    -- Acquire row lock on daily_streaks to prevent concurrent race conditions
    SELECT last_active_date, current_streak, longest_streak
    INTO v_last_active, v_curr_streak, v_longest_streak
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

    -- Insert reward transactions
    INSERT INTO public.reward_transactions (user_id, student_id, source_type, source_id, coins, points)
    VALUES (p_student_id, p_student_id, p_activity_type, v_ref_id, v_coin_reward_actual, v_tokens_reward);

    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, v_tokens_reward, p_activity_type, v_ref_id, 'Earned +' || v_tokens_reward || ' Task Tokens for ' || p_activity_type);

    -- Update daily_streaks atomically
    UPDATE public.daily_streaks
    SET current_streak = v_new_streak,
        longest_streak = v_longest_streak,
        total_active_days = COALESCE(total_active_days, 0) + (CASE WHEN v_last_active = v_today THEN 0 ELSE 1 END),
        last_active_date = v_today,
        xp_points = COALESCE(xp_points, 0) + v_tokens_reward,
        activity_history = COALESCE(activity_history, '{}'::jsonb) || jsonb_build_object(v_today::text, true),
        updated_at = now()
    WHERE student_id = p_student_id;

    -- Update student_wallets atomically
    INSERT INTO public.student_wallets (student_id, gold_coins, tokens, total_earned, total_redeemed, updated_at)
    VALUES (p_student_id, v_coin_reward_actual, v_tokens_reward, v_coin_reward_actual, 0, now())
    ON CONFLICT (student_id) DO UPDATE SET
        gold_coins = public.student_wallets.gold_coins + EXCLUDED.gold_coins,
        tokens = public.student_wallets.tokens + EXCLUDED.tokens,
        total_earned = public.student_wallets.total_earned + EXCLUDED.gold_coins,
        updated_at = now();

    RETURN jsonb_build_object(
        'success', true,
        'current_streak', v_new_streak,
        'longest_streak', v_longest_streak,
        'tokens_awarded', v_tokens_reward,
        'coins_awarded', v_coin_reward_actual
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) TO authenticated, anon, service_role;

COMMIT;
