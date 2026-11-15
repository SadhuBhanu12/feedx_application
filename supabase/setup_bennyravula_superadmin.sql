-- ==============================================================================
-- FEEDX — PRE-REGISTER SUPER ADMIN (OTP ACTIVATION WORKFLOW)
-- Email: bennyravula386@gmail.com
-- Run this script in the Supabase SQL Editor (as postgres / service_role)
-- 
-- Workflow:
-- 1. Pre-registers Benny Ravula in Supabase with `is_password_set = FALSE`.
-- 2. No password is set upfront.
-- 3. Open FeedX App -> Go to "First Time Login".
-- 4. Enter `bennyravula386@gmail.com` -> 6-digit OTP is sent to the inbox.
-- 5. Enter & verify OTP -> Navigates to "Create Password" screen.
-- 6. User sets their own secure password -> Logs into Super Admin Command Deck!
-- ==============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    v_email TEXT := 'bennyravula386@gmail.com';
    v_full_name TEXT := 'Benny Ravula';
    v_pin TEXT := 'GECCC-0001';
    v_feedx_id TEXT := 'FX-26-IA-0004765';
    v_auth_id UUID;
    v_college_id UUID;
    v_branch_id UUID;
    v_academic_year_id UUID;
BEGIN
    -- 1. Identify primary college reference
    SELECT id INTO v_college_id 
    FROM public.colleges 
    ORDER BY created_at ASC 
    LIMIT 1;

    -- 2. Identify branch and academic year
    SELECT id INTO v_branch_id 
    FROM public.branches 
    WHERE college_id = v_college_id 
    LIMIT 1;

    IF v_branch_id IS NULL THEN
        SELECT id INTO v_branch_id FROM public.branches LIMIT 1;
    END IF;

    SELECT id INTO v_academic_year_id 
    FROM public.academic_years 
    LIMIT 1;

    -- 3. Check for existing auth.users record
    SELECT id INTO v_auth_id 
    FROM auth.users 
    WHERE LOWER(email) = LOWER(v_email) 
    LIMIT 1;

    IF v_auth_id IS NOT NULL THEN
        -- Reset existing auth user to require OTP and password creation
        UPDATE auth.users
        SET encrypted_password = extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, now()),
            raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
            raw_user_meta_data = jsonb_build_object(
                'full_name', v_full_name,
                'role', 'super_admin',
                'college_id', v_college_id,
                'is_password_set', false,
                'must_change_password', true,
                'first_login_completed', false
            ),
            role = 'authenticated',
            aud = 'authenticated',
            updated_at = now()
        WHERE id = v_auth_id;
        
        RAISE NOTICE 'Aligned existing auth.users record for %: % (OTP activation mode)', v_email, v_auth_id;
    ELSE
        -- Check public.users or public.students for existing UUID
        SELECT id INTO v_auth_id FROM public.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;
        IF v_auth_id IS NULL THEN
            SELECT id INTO v_auth_id FROM public.students WHERE LOWER(email) = LOWER(v_email) LIMIT 1;
        END IF;
        IF v_auth_id IS NULL THEN
            v_auth_id := gen_random_uuid();
        END IF;

        -- Create new auth.users record (unguessable temporary hash until user creates password via OTP)
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
            aud,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            v_auth_id,
            '00000000-0000-0000-0000-000000000000',
            v_email,
            extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object(
                'full_name', v_full_name,
                'role', 'super_admin',
                'college_id', v_college_id,
                'is_password_set', false,
                'must_change_password', true,
                'first_login_completed', false
            ),
            now(),
            now(),
            'authenticated',
            'authenticated',
            '',
            '',
            '',
            ''
        );

        RAISE NOTICE 'Created new auth.users record for %: % (OTP activation mode)', v_email, v_auth_id;
    END IF;

    -- Invalidate any previous activation sessions
    UPDATE public.activation_sessions
    SET used = TRUE
    WHERE user_id = v_auth_id;

    -- 4. Upsert into public.users with is_password_set = FALSE
    INSERT INTO public.users (
        id,
        email,
        full_name,
        role,
        pin_number,
        is_password_set,
        first_login_completed,
        is_active,
        college_id,
        feedx_id,
        created_at,
        updated_at
    ) VALUES (
        v_auth_id,
        v_email,
        v_full_name,
        'super_admin',
        v_pin,
        FALSE, -- Password will be set by the user via OTP
        FALSE,
        TRUE,
        v_college_id,
        v_feedx_id,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = 'super_admin',
        pin_number = EXCLUDED.pin_number,
        is_password_set = FALSE,
        first_login_completed = FALSE,
        is_active = TRUE,
        college_id = EXCLUDED.college_id,
        feedx_id = EXCLUDED.feedx_id,
        updated_at = now();

    -- 5. Upsert into public.admins table
    INSERT INTO public.admins (
        id,
        name,
        email,
        role,
        institution_id,
        created_at
    ) VALUES (
        v_auth_id,
        v_full_name,
        v_email,
        'super_admin',
        v_college_id,
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        role = 'super_admin',
        institution_id = EXCLUDED.institution_id;

    -- 6. Upsert into public.students table with is_password_set = FALSE
    INSERT INTO public.students (
        id,
        roll_number,
        pin_number,
        full_name,
        email,
        college_id,
        branch_id,
        academic_year_id,
        is_password_set,
        feedx_id,
        created_at
    ) VALUES (
        v_auth_id,
        v_pin,
        v_pin,
        v_full_name,
        v_email,
        v_college_id,
        v_branch_id,
        v_academic_year_id,
        FALSE, -- Enables FirstTimeLoginScreen OTP verification
        v_feedx_id,
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        roll_number = EXCLUDED.roll_number,
        pin_number = EXCLUDED.pin_number,
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        college_id = EXCLUDED.college_id,
        branch_id = EXCLUDED.branch_id,
        academic_year_id = EXCLUDED.academic_year_id,
        is_password_set = FALSE,
        feedx_id = EXCLUDED.feedx_id;

    -- 7. Initialize student_wallets
    INSERT INTO public.student_wallets (
        student_id,
        user_id,
        tokens,
        gold_coins,
        total_earned,
        total_redeemed,
        updated_at
    ) VALUES (
        v_auth_id,
        v_auth_id,
        500,
        500,
        500,
        0,
        now()
    )
    ON CONFLICT (student_id) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        tokens = GREATEST(public.student_wallets.tokens, 500),
        gold_coins = GREATEST(public.student_wallets.gold_coins, 500),
        updated_at = now();

    -- 8. Initialize daily_streaks
    INSERT INTO public.daily_streaks (
        student_id,
        user_id,
        current_streak,
        longest_streak,
        last_active_date,
        xp_points,
        updated_at
    ) VALUES (
        v_auth_id,
        v_auth_id,
        1,
        1,
        CURRENT_DATE,
        100,
        now()
    )
    ON CONFLICT (student_id) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        current_streak = GREATEST(public.daily_streaks.current_streak, 1),
        longest_streak = GREATEST(public.daily_streaks.longest_streak, 1),
        updated_at = now();

    RAISE NOTICE 'SUCCESS: bennyravula386@gmail.com is pre-registered! Ready for OTP activation via First Time Login.';
END $$;

COMMIT;
