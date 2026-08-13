-- ============================================================
-- CORRECT WAY: Add one student (works with OTP activation)
-- Run in Supabase SQL Editor
-- DO NOT insert into students table alone
--
-- PREREQUISITE: Run fix_sync_trigger.sql first if you see
-- "column section of relation users does not exist"
-- ============================================================

-- Replace these values for each new student:
DO $$
DECLARE
  v_id UUID := uuid_generate_v4();
  v_roll   TEXT := '23951A0501';
  v_name   TEXT := 'Bhanu Prasad';
  v_email  TEXT := 'bhanuprasad092627@gmail.com';
  v_pin    TEXT := '23951A0501';
  v_dob    DATE := '2005-05-15';          -- required if using PIN+DOB flow
  v_pass   TEXT := '2005-05-15';          -- initial auth password (usually DOB)
  -- Optional hierarchy UUIDs (set NULL if unknown)
  v_college_id UUID := NULL;
  v_branch_id  UUID := NULL;
  v_year_id    UUID := NULL;
  v_year_text  TEXT := '1st Year';
BEGIN
  -- 1. Create auth account (canonical identity)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  )
  VALUES (
    v_id,
    '00000000-0000-0000-0000-000000000000',
    v_email,
    crypt(v_pass, gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name',     v_name,
      'roll_number',   v_roll,
      'role',          'student',
      'pin_number',    v_pin,
      'date_of_birth', v_dob::TEXT
    ),
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
  );

  -- 2. Trigger auto-creates public.users + public.students
  -- 3. Enrich the student row
  UPDATE public.students SET
    roll_number      = v_roll,
    full_name        = v_name,
    email            = v_email,
    pin_number       = v_pin,
    date_of_birth    = v_dob,
    college_id       = v_college_id,
    branch_id        = v_branch_id,
    academic_year_id = v_year_id,
    year             = v_year_text,
    is_password_set  = FALSE
  WHERE id = v_id;

  UPDATE public.users SET
    pin_number       = v_pin,
    date_of_birth    = v_dob,
    is_password_set  = FALSE,
    first_login_completed = FALSE
  WHERE id = v_id;

  RAISE NOTICE 'Student created. ID: %', v_id;
END $$;

-- Verify all 3 layers match
SELECT
  s.id AS students_id,
  u.id AS users_id,
  a.id AS auth_id,
  s.email,
  s.roll_number,
  s.is_password_set
FROM public.students s
JOIN public.users u ON u.id = s.id
JOIN auth.users a ON a.id = s.id
WHERE lower(s.email) = 'bhanuprasad092627@gmail.com';

-- ============================================================
-- CLEAN UP a bad manual insert (run BEFORE re-adding student)
-- ============================================================
-- DELETE FROM public.activation_sessions WHERE user_id IN (
--   SELECT id FROM public.students WHERE lower(email) = 'bhanuprasad092627@gmail.com'
-- );
-- DELETE FROM public.student_profiles WHERE user_id IN (
--   SELECT id FROM public.students WHERE lower(email) = 'bhanuprasad092627@gmail.com'
-- );
-- DELETE FROM public.students WHERE lower(email) = 'bhanuprasad092627@gmail.com';
-- DELETE FROM public.users WHERE lower(email) = 'bhanuprasad092627@gmail.com';
-- DELETE FROM auth.users WHERE lower(email) = 'bhanuprasad092627@gmail.com';
