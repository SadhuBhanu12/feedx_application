-- ==============================================================================
-- FEEDX — STUDENT ACCOUNT SETUP & ACTIVATION FOR HARSHA SINGISALA
-- Target Student: harshasingisala@gmail.com
-- Run this script in the Supabase SQL Editor (as postgres / service_role) if needed.
-- 
-- Status & Workflow:
-- 1. Student record is pre-registered in:
--    - auth.users (ID: 22a2b02e-c4e0-4691-9716-97dda0e88611)
--    - public.users
--    - public.students
--    - public.student_wallets (50 Tokens / 50 Gold Coins)
--    - public.daily_streaks (1 Day Streak / 50 XP)
--    - public.coin_transactions (Welcome Bonus)
--
-- 2. Login Flow Options:
--    OPTION A (Recommended - OTP First-Time Activation):
--      Student opens FeedX App -> Taps "First Time Login" -> Enters harshasingisala@gmail.com
--      -> Receives 6-digit OTP -> Sets their own secure password.
--
--    OPTION B (Direct Password Login without OTP):
--      Run the OPTION B block below to set an immediate password (e.g., 'FeedX@123').
-- ==============================================================================

BEGIN;

DO $$
DECLARE
    v_email TEXT := 'harshasingisala@gmail.com';
    v_full_name TEXT := 'Harsha Singisala';
    v_roll_number TEXT := 'GIOE-0004';
    v_pin_number TEXT := 'GECCC-0012';
    v_feedx_id TEXT := 'FX-26-IA-0004645';
    v_quizue_id TEXT := 'QUIZUE-05170558';
    v_phone TEXT := NULL;
    v_auth_id UUID := '22a2b02e-c4e0-4691-9716-97dda0e88611';
    v_college_id UUID := '6dd12d63-e276-4ff8-8e58-bcd2cc878626'; -- Government Institute of Electronics (GIOE)
    v_branch_id UUID := '7ae3c5f3-5780-4888-a0a2-f280a0c3b1af';
    v_academic_year_id UUID := NULL;
BEGIN
    -- 1. Ensure college ID exists
    IF NOT EXISTS (SELECT 1 FROM public.colleges WHERE id = v_college_id) THEN
        SELECT id INTO v_college_id FROM public.colleges LIMIT 1;
    END IF;

    -- 2. Verify or create auth.users entry
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_auth_id) THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            role,
            aud
        )
        VALUES (
            v_auth_id,
            '00000000-0000-0000-0000-000000000000',
            v_email,
            extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object(
                'full_name', v_full_name,
                'role', 'student',
                'is_password_set', false,
                'must_change_password', true,
                'first_login_completed', false
            ),
            now(),
            now(),
            'authenticated',
            'authenticated'
        );
    ELSE
        -- Update user metadata
        UPDATE auth.users
        SET email = v_email,
            email_confirmed_at = COALESCE(email_confirmed_at, now()),
            raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
            raw_user_meta_data = jsonb_build_object(
                'full_name', v_full_name,
                'role', 'student',
                'is_password_set', false,
                'must_change_password', true,
                'first_login_completed', false
            ),
            role = 'authenticated',
            aud = 'authenticated',
            updated_at = now()
        WHERE id = v_auth_id;
    END IF;

    -- 3. Invalidate any stale activation sessions
    UPDATE public.activation_sessions
    SET used = TRUE
    WHERE user_id = v_auth_id;

    -- 4. Upsert public.users
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
        quizue_id,
        branch,
        year,
        pin_number,
        created_at,
        updated_at
    )
    VALUES (
        v_auth_id,
        v_email,
        v_full_name,
        'student',
        v_phone,
        NULL,
        FALSE,
        FALSE,
        TRUE,
        v_college_id,
        v_feedx_id,
        v_quizue_id,
        'Multimedia and Electronics Engineering',
        '1st Year',
        v_pin_number,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = 'student',
        phone = COALESCE(public.users.phone, EXCLUDED.phone),
        is_password_set = FALSE,
        first_login_completed = FALSE,
        is_active = TRUE,
        college_id = COALESCE(EXCLUDED.college_id, public.users.college_id),
        feedx_id = EXCLUDED.feedx_id,
        quizue_id = EXCLUDED.quizue_id,
        branch = COALESCE(public.users.branch, EXCLUDED.branch),
        year = '1st Year',
        pin_number = COALESCE(public.users.pin_number, EXCLUDED.pin_number),
        updated_at = now();

    -- 5. Upsert public.students
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
        quizue_id,
        qr_code_data,
        identity_status,
        pin_number,
        cgpa,
        created_at
    )
    VALUES (
        v_auth_id,
        v_roll_number,
        v_full_name,
        v_email,
        v_phone,
        v_college_id,
        v_branch_id,
        v_academic_year_id,
        NULL,
        FALSE,
        '1st Year',
        v_feedx_id,
        v_quizue_id,
        jsonb_build_object('v', 1, 'fid', v_feedx_id, 'qid', v_quizue_id, 'type', 'FEEDX_STUDENT_VERIFICATION')::text,
        'verified',
        v_pin_number,
        0,
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = COALESCE(public.students.phone, EXCLUDED.phone),
        college_id = COALESCE(EXCLUDED.college_id, public.students.college_id),
        branch_id = COALESCE(EXCLUDED.branch_id, public.students.branch_id),
        is_password_set = FALSE,
        year = '1st Year',
        feedx_id = EXCLUDED.feedx_id,
        quizue_id = EXCLUDED.quizue_id,
        qr_code_data = EXCLUDED.qr_code_data,
        identity_status = 'verified',
        pin_number = COALESCE(public.students.pin_number, EXCLUDED.pin_number);

    -- 6. Initialize daily streaks
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
        v_auth_id,
        1,
        1,
        1,
        CURRENT_DATE,
        1,
        50,
        jsonb_build_object(to_char(CURRENT_DATE, 'YYYY-MM-DD'), jsonb_build_object('completed', true, 'points', 50)),
        now()
    )
    ON CONFLICT (student_id) DO UPDATE SET
        current_streak = GREATEST(1, public.daily_streaks.current_streak),
        longest_streak = GREATEST(1, public.daily_streaks.longest_streak),
        total_active_days = GREATEST(1, public.daily_streaks.total_active_days),
        last_active_date = CURRENT_DATE,
        streak_freeze_count = COALESCE(public.daily_streaks.streak_freeze_count, 1),
        xp_points = GREATEST(50, COALESCE(public.daily_streaks.xp_points, 0)),
        updated_at = now();

    -- 7. Initialize student wallet
    INSERT INTO public.student_wallets (
        student_id,
        gold_coins,
        tokens,
        total_earned,
        total_redeemed,
        updated_at
    )
    VALUES (
        v_auth_id,
        50,
        50,
        50,
        0,
        now()
    )
    ON CONFLICT (student_id) DO UPDATE SET
        gold_coins = GREATEST(50, COALESCE(public.student_wallets.gold_coins, 0)),
        tokens = GREATEST(50, COALESCE(public.student_wallets.tokens, 0)),
        total_earned = GREATEST(50, COALESCE(public.student_wallets.total_earned, 0)),
        updated_at = now();

    -- 8. Welcome Coins Transaction
    INSERT INTO public.coin_transactions (
        student_id,
        user_id,
        amount,
        activity_type,
        reference_id,
        description,
        created_at
    )
    SELECT
        v_auth_id,
        v_auth_id,
        50,
        'welcome_bonus',
        'welcome_' || v_auth_id::text,
        'Welcome & Student Identity Verification Bonus (+50 Tokens)',
        now()
    WHERE NOT EXISTS (
        SELECT 1 FROM public.coin_transactions WHERE reference_id = 'welcome_' || v_auth_id::text
    );

    RAISE NOTICE '=========================================================';
    RAISE NOTICE 'HARSHA SINGISALA ACCOUNT READY FOR FIRST-TIME OTP LOGIN!';
    RAISE NOTICE 'User ID: %', v_auth_id;
    RAISE NOTICE 'Email: %', v_email;
    RAISE NOTICE 'Roll Number: %', v_roll_number;
    RAISE NOTICE 'PIN: %', v_pin_number;
    RAISE NOTICE 'FEEDX ID: %', v_feedx_id;
    RAISE NOTICE '=========================================================';
END $$;

COMMIT;

-- ==============================================================================
-- OPTIONAL: IF YOU WANT TO SET A DIRECT PASSWORD (e.g. FeedX@123) WITHOUT OTP:
-- Run this block below:
-- ==============================================================================
-- UPDATE auth.users
-- SET encrypted_password = extensions.crypt('FeedX@123', extensions.gen_salt('bf')),
--     email_confirmed_at = COALESCE(email_confirmed_at, now()),
--     raw_user_meta_data = raw_user_meta_data || '{"is_password_set": true, "must_change_password": false, "first_login_completed": true}'::jsonb,
--     updated_at = now()
-- WHERE id = '22a2b02e-c4e0-4691-9716-97dda0e88611';
-- 
-- UPDATE public.users
-- SET is_password_set = TRUE,
--     first_login_completed = TRUE
-- WHERE id = '22a2b02e-c4e0-4691-9716-97dda0e88611';
-- 
-- UPDATE public.students
-- SET is_password_set = TRUE
-- WHERE id = '22a2b02e-c4e0-4691-9716-97dda0e88611';

