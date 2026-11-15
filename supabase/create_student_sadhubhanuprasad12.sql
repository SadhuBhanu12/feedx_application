-- ==============================================================================
-- FEEDX — PRE-REGISTER STUDENT ACCOUNT FOR OTP & PASSWORD SETUP WORKFLOW
-- Run this script in the Supabase SQL Editor (as postgres / service_role)
-- 
-- Flow:
-- 1. Pre-registers student in public.students & public.users with:
--      is_password_set = FALSE
--      first_login_completed = FALSE
-- 2. Student opens FeedX App -> "First Time Login"
-- 3. Student enters Email -> Receives 6-digit OTP
-- 4. Student verifies OTP -> Navigates to "Create Password" screen
-- 5. Student sets their own secure password -> Account activated!
-- ==============================================================================

BEGIN;

DO $$
DECLARE
    -- Primary target email (change if you want gayathrisadhu8@gmail.com or another email)
    v_email TEXT := 'sadhubhanuprasad12@gmail.com';
    v_full_name TEXT := 'Sadhu Bhanu Prasad';
    v_roll_number TEXT := '23951A0507';
    v_feedx_id TEXT := 'FEEDX-TG-26-BHANU12';
    v_phone TEXT := '9876543210';
    v_auth_id UUID;
    v_college_id UUID;
    v_branch_id UUID;
    v_academic_year_id UUID;
BEGIN
    -- 1. Identify or create college reference
    SELECT id INTO v_college_id 
    FROM public.colleges 
    WHERE id = '6dd12d63-e276-4ff8-8e58-bcd2cc878626'
    LIMIT 1;

    IF v_college_id IS NULL THEN
        SELECT id INTO v_college_id FROM public.colleges LIMIT 1;
    END IF;

    -- If no colleges exist at all, create Government Institute of Electronics
    IF v_college_id IS NULL THEN
        v_college_id := '6dd12d63-e276-4ff8-8e58-bcd2cc878626';
        INSERT INTO public.colleges (id, college_name, college_code, location, type, created_at)
        VALUES (v_college_id, 'Government Institute of Electronics', 'GIE01', 'Secunderabad, Telangana', 'Polytechnic', now())
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Identify or fallback branch and academic year
    SELECT id INTO v_branch_id FROM public.branches WHERE college_id = v_college_id LIMIT 1;
    IF v_branch_id IS NULL THEN
        SELECT id INTO v_branch_id FROM public.branches LIMIT 1;
    END IF;

    SELECT id INTO v_academic_year_id FROM public.academic_years LIMIT 1;

    -- 2. Check if auth.users already has an entry for this email
    SELECT id INTO v_auth_id FROM auth.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;

    IF v_auth_id IS NOT NULL THEN
        -- Existing auth user: Reset metadata to require password creation on first login
        UPDATE auth.users
        SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
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
        
        RAISE NOTICE 'Aligned existing auth.users record: % (password reset flag enabled)', v_auth_id;
    ELSE
        -- Check if public.users or public.students already has an ID for this email
        SELECT id INTO v_auth_id FROM public.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;
        IF v_auth_id IS NULL THEN
            SELECT id INTO v_auth_id FROM public.students WHERE LOWER(email) = LOWER(v_email) LIMIT 1;
        END IF;

        IF v_auth_id IS NULL THEN
            v_auth_id := gen_random_uuid();
        END IF;

        -- Create placeholder auth.users record (password will be set by the user via OTP + Create Password screen)
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
            extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), -- temporary unguessable hash until user creates password
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

        RAISE NOTICE 'Created new auth.users record: % (pending OTP activation)', v_auth_id;
    END IF;

    -- Invalidate any previous activation sessions
    UPDATE public.activation_sessions
    SET used = TRUE
    WHERE user_id = v_auth_id;

    -- 3. Upsert public.users with is_password_set = FALSE
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
        '2005-01-15',
        FALSE, -- Must be FALSE so user activates via OTP & sets password
        FALSE, -- First login has not occurred yet
        TRUE,
        v_college_id,
        v_feedx_id,
        'Computer Science / IT',
        '1st Year',
        v_roll_number,
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
        branch = COALESCE(public.users.branch, EXCLUDED.branch),
        year = '1st Year',
        pin_number = COALESCE(public.users.pin_number, EXCLUDED.pin_number),
        updated_at = now();

    -- 4. Upsert public.students with is_password_set = FALSE
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
        '2005-01-15',
        FALSE, -- Must be FALSE so FirstTimeLoginScreen allows OTP dispatch
        '1st Year',
        v_feedx_id,
        'QUIZUE-61026361',
        jsonb_build_object('v', 1, 'fid', v_feedx_id, 'qid', 'QUIZUE-61026361', 'type', 'FEEDX_STUDENT_VERIFICATION')::text,
        'verified',
        v_roll_number,
        8.85,
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = COALESCE(public.students.phone, EXCLUDED.phone),
        college_id = COALESCE(EXCLUDED.college_id, public.students.college_id),
        branch_id = COALESCE(EXCLUDED.branch_id, public.students.branch_id),
        academic_year_id = COALESCE(EXCLUDED.academic_year_id, public.students.academic_year_id),
        is_password_set = FALSE,
        year = '1st Year',
        feedx_id = EXCLUDED.feedx_id,
        qr_code_data = EXCLUDED.qr_code_data,
        identity_status = 'verified',
        pin_number = COALESCE(public.students.pin_number, EXCLUDED.pin_number);

    -- 5. Initialize or reset daily_streaks
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

    -- 6. Initialize or top-up student_wallets
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

    -- 7. Record Welcome & Verification Coins
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
    RAISE NOTICE 'STUDENT PRE-REGISTERED SUCCESSFULLY FOR OTP ACTIVATION!';
    RAISE NOTICE 'User ID: %', v_auth_id;
    RAISE NOTICE 'Email: %', v_email;
    RAISE NOTICE 'Roll Number: %', v_roll_number;
    RAISE NOTICE 'FEEDX ID: %', v_feedx_id;
    RAISE NOTICE 'Password Set: FALSE (Ready for OTP & Create Password)';
    RAISE NOTICE '=========================================================';
END $$;

COMMIT;
