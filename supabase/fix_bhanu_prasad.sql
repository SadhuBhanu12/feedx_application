-- ============================================================
-- IMMEDIATE FIX: Bhanu Prasad (activation_sessions FK fix)
-- Run entire script in Supabase SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION public.reconcile_student_to_auth_id(
  p_profile_id UUID,
  p_auth_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s public.students%ROWTYPE;
  u public.users%ROWTYPE;
  v_email TEXT;
  v_full_name TEXT;
  v_roll_number TEXT;
BEGIN
  IF p_profile_id IS NULL OR p_auth_id IS NULL OR p_profile_id = p_auth_id THEN
    RETURN;
  END IF;

  SELECT * INTO s FROM public.students WHERE id = p_profile_id;
  SELECT * INTO u FROM public.users WHERE id = p_profile_id;

  v_email := COALESCE(u.email, s.email);
  v_full_name := COALESCE(u.full_name, s.full_name);
  v_roll_number := s.roll_number;

  -- Delete old sessions (FK points to students — cannot UPDATE user_id before row exists)
  DELETE FROM public.activation_sessions WHERE user_id = p_profile_id;
  DELETE FROM public.student_profiles WHERE user_id = p_profile_id;
  DELETE FROM public.students WHERE id = p_profile_id;
  DELETE FROM public.users WHERE id = p_profile_id;

  IF v_email IS NOT NULL THEN
    INSERT INTO public.users (
      id, email, full_name, role, phone, avatar_url,
      pin_number, date_of_birth, is_password_set, first_login_completed,
      bio, branch, year
    )
    VALUES (
      p_auth_id, v_email, COALESCE(v_full_name, v_email),
      COALESCE(u.role, 'student'), u.phone, u.avatar_url,
      COALESCE(u.pin_number, s.pin_number),
      COALESCE(u.date_of_birth, s.date_of_birth),
      COALESCE(u.is_password_set, s.is_password_set, FALSE),
      COALESCE(u.first_login_completed, FALSE),
      u.bio, u.branch, u.year
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      pin_number = COALESCE(public.users.pin_number, EXCLUDED.pin_number),
      date_of_birth = COALESCE(public.users.date_of_birth, EXCLUDED.date_of_birth);
  END IF;

  IF s.id IS NOT NULL OR v_roll_number IS NOT NULL OR v_email IS NOT NULL THEN
    INSERT INTO public.students (
      id, roll_number, full_name, email, phone,
      college_id, branch_id, academic_year_id,
      date_of_birth, cgpa, bio, profile_image,
      is_password_set, year, pin_number
    )
    VALUES (
      p_auth_id, COALESCE(v_roll_number, 'PENDING'),
      COALESCE(v_full_name, v_email), v_email, s.phone,
      s.college_id, s.branch_id, s.academic_year_id,
      s.date_of_birth, COALESCE(s.cgpa, 0), s.bio, s.profile_image,
      COALESCE(s.is_password_set, FALSE), s.year, s.pin_number
    )
    ON CONFLICT (id) DO UPDATE SET
      roll_number = EXCLUDED.roll_number,
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      college_id = COALESCE(public.students.college_id, EXCLUDED.college_id),
      branch_id = COALESCE(public.students.branch_id, EXCLUDED.branch_id),
      academic_year_id = COALESCE(public.students.academic_year_id, EXCLUDED.academic_year_id),
      pin_number = COALESCE(public.students.pin_number, EXCLUDED.pin_number),
      date_of_birth = COALESCE(public.students.date_of_birth, EXCLUDED.date_of_birth);
  END IF;
END;
$$;

-- Reconcile Bhanu Prasad
SELECT public.reconcile_student_to_auth_id(
  'e8eb4ff1-cad8-4377-984f-84e582f10819'::UUID,
  '6d0d38c9-9176-4c87-b1dd-5c7c3e0a4c4d'::UUID
);

-- Verify — should return ONE row, all IDs matching
SELECT s.email, s.id AS students_id, a.id AS auth_id, u.id AS users_id, s.full_name
FROM public.students s
JOIN auth.users a ON lower(a.email) = lower(s.email)
LEFT JOIN public.users u ON u.id = s.id
WHERE lower(s.email) = 'bhanuprasad092627@gmail.com';

-- Confirm no orphan rows remain
SELECT id, email FROM public.users WHERE lower(email) = 'bhanuprasad092627@gmail.com';
SELECT id, email FROM public.students WHERE lower(email) = 'bhanuprasad092627@gmail.com';
