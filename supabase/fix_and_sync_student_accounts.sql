-- ==============================================================================
-- FEEDX — STUDENT ACCOUNTS & AUTH SYNCHRONIZATION MASTER SCRIPT
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PART 1: DIAGNOSIS (Run this to see your account status across all 3 tables)
-- ------------------------------------------------------------------------------
SELECT 
    COALESCE(s.email, u.email, a.email) AS email,
    s.roll_number,
    s.id AS students_id,
    u.id AS users_id,
    a.id AS auth_id,
    s.is_password_set AS students_password_set,
    u.is_password_set AS users_password_set,
    u.role,
    CASE 
        WHEN a.id IS NULL THEN '❌ Missing in auth.users (Cannot login with password)'
        WHEN s.id IS NULL THEN '❌ Missing in public.students (Cannot activate via First Time Login)'
        WHEN s.id <> a.id THEN '❌ UUID Mismatch between auth and students'
        WHEN s.is_password_set = TRUE THEN '✅ Password is SET (Must use Login screen, NOT First Time Login)'
        ELSE '⏳ Pending First-Time Activation (Use First Time Login + OTP)'
    END AS account_status
FROM public.students s
FULL OUTER JOIN public.users u ON lower(trim(u.email)) = lower(trim(s.email))
FULL OUTER JOIN auth.users a ON lower(trim(a.email)) = lower(trim(COALESCE(s.email, u.email)))
ORDER BY account_status;


-- ------------------------------------------------------------------------------
-- PART 2: RESET PASSWORD FLAG TO ALLOW "FIRST TIME LOGIN" (OTP ACTIVATION)
-- If a student sees "This account has already been activated" or needs to set
-- their password again via OTP, run this block:
-- ------------------------------------------------------------------------------
-- To reset for a specific student, replace 'bhanuprasad092627@gmail.com' with the email:
UPDATE public.students 
SET is_password_set = FALSE
WHERE lower(trim(email)) = lower(trim('bhanuprasad092627@gmail.com'));

UPDATE public.users 
SET is_password_set = FALSE,
    first_login_completed = FALSE
WHERE lower(trim(email)) = lower(trim('bhanuprasad092627@gmail.com'));


-- ------------------------------------------------------------------------------
-- PART 3: SET A DIRECT PASSWORD (IMMEDIATE LOGIN WITHOUT OTP)
-- If you want a student to log in directly with Email/Roll No & Password 
-- (e.g. 'FeedX@123') without going through First-Time OTP:
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    target_email TEXT := 'bhanuprasad092627@gmail.com';  -- Change to target email
    new_password TEXT := 'FeedX@123';                    -- Change to desired password
    v_uid UUID;
BEGIN
    -- 1. Find or identify UID
    SELECT id INTO v_uid FROM auth.users WHERE lower(trim(email)) = lower(trim(target_email)) LIMIT 1;
    IF v_uid IS NULL THEN
        SELECT id INTO v_uid FROM public.students WHERE lower(trim(email)) = lower(trim(target_email)) LIMIT 1;
    END IF;

    -- 2. If missing in auth.users, create the auth user
    IF v_uid IS NULL THEN
        v_uid := gen_random_uuid();
        INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at
        ) VALUES (
            v_uid, '00000000-0000-0000-0000-000000000000', lower(trim(target_email)),
            extensions.crypt(new_password, extensions.gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object('role', 'student', 'is_password_set', true, 'first_login_completed', true),
            'authenticated', 'authenticated', now(), now()
        );
    ELSE
        -- Update password in auth.users
        UPDATE auth.users
        SET encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, now()),
            raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
                jsonb_build_object('is_password_set', true, 'first_login_completed', true),
            updated_at = now()
        WHERE id = v_uid;
    END IF;

    -- 3. Update public.students & public.users
    UPDATE public.students 
    SET is_password_set = TRUE 
    WHERE lower(trim(email)) = lower(trim(target_email));

    UPDATE public.users 
    SET is_password_set = TRUE,
        first_login_completed = TRUE,
        password_changed_at = now()
    WHERE lower(trim(email)) = lower(trim(target_email));

    RAISE NOTICE 'Password set to % for %', new_password, target_email;
END $$;


-- ------------------------------------------------------------------------------
-- PART 4: HOW TO ADD A NEW STUDENT PROPERLY (ALL 3 TABLES SYNCED)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    new_email TEXT := 'newstudent@gmail.com';  -- 👈 Student Email
    new_roll  TEXT := '23951A0599';            -- 👈 Roll Number
    new_name  TEXT := 'Student Name';          -- 👈 Full Name
    new_pin   TEXT := '23951A0599';            -- 👈 PIN / ID
    v_id UUID;
    v_college_id UUID;
BEGIN
    SELECT id INTO v_college_id FROM public.colleges LIMIT 1;

    -- 1. Identify canonical UUID across auth.users, public.users, or public.students
    SELECT id INTO v_id FROM auth.users WHERE lower(trim(email)) = lower(trim(new_email)) LIMIT 1;
    IF v_id IS NULL THEN
        SELECT id INTO v_id FROM public.users WHERE lower(trim(email)) = lower(trim(new_email)) LIMIT 1;
    END IF;
    IF v_id IS NULL THEN
        SELECT id INTO v_id FROM public.students WHERE lower(trim(email)) = lower(trim(new_email)) LIMIT 1;
    END IF;
    IF v_id IS NULL THEN
        v_id := gen_random_uuid();
    END IF;

    -- 2. Clean up any stale records under old temp UUIDs for this email
    DELETE FROM public.students WHERE lower(trim(email)) = lower(trim(new_email)) AND id <> v_id;
    DELETE FROM public.users WHERE lower(trim(email)) = lower(trim(new_email)) AND id <> v_id;

    -- 3. Upsert auth.users (Avoids 42P10 ON CONFLICT constraint error)
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = v_id OR lower(trim(email)) = lower(trim(new_email))) THEN
        UPDATE auth.users
        SET email = lower(trim(new_email)),
            email_confirmed_at = COALESCE(email_confirmed_at, now()),
            raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
            raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
                jsonb_build_object('role', 'student', 'full_name', new_name, 'is_password_set', false),
            updated_at = now()
        WHERE id = v_id OR lower(trim(email)) = lower(trim(new_email));
    ELSE
        INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at
        ) VALUES (
            v_id, '00000000-0000-0000-0000-000000000000', lower(trim(new_email)),
            extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object('role', 'student', 'full_name', new_name, 'is_password_set', false),
            'authenticated', 'authenticated', now(), now()
        );
    END IF;

    -- 4. Upsert into public.users
    INSERT INTO public.users (
        id, email, full_name, role, is_password_set, first_login_completed, pin_number, college_id, is_active
    ) VALUES (
        v_id, lower(trim(new_email)), new_name, 'student', FALSE, FALSE, new_pin, v_college_id, TRUE
    ) ON CONFLICT (id) DO UPDATE SET
        email = lower(trim(new_email)),
        full_name = new_name,
        pin_number = new_pin,
        is_password_set = FALSE,
        first_login_completed = FALSE;

    -- 5. Upsert into public.students (Student Registry)
    INSERT INTO public.students (
        id, roll_number, full_name, email, pin_number, is_password_set, college_id, year
    ) VALUES (
        v_id, new_roll, new_name, lower(trim(new_email)), new_pin, FALSE, v_college_id, '1st Year'
    ) ON CONFLICT (id) DO UPDATE SET
        roll_number = new_roll,
        email = lower(trim(new_email)),
        full_name = new_name,
        pin_number = new_pin,
        is_password_set = FALSE;

    RAISE NOTICE '✅ Student % successfully registered across all 3 tables with is_password_set = FALSE (Ready for First-Time Login OTP)', new_email;
END $$;
