-- ============================================================
-- FIX: Activation "email already registered" ID mismatch
-- Run once in Supabase SQL Editor
-- ============================================================

-- 1. Reliable auth lookup by email (bypasses slow listUsers pagination)
CREATE OR REPLACE FUNCTION public.get_auth_user_id_by_email(p_email TEXT)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT id
  FROM auth.users
  WHERE lower(trim(email)) = lower(trim(p_email))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_auth_user_id_by_email(TEXT) TO service_role;

-- 2. Merge public profile rows onto the canonical auth.users id
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

  -- Drop old sessions (cannot re-point FK before students row exists at auth id)
  DELETE FROM public.activation_sessions WHERE user_id = p_profile_id;
  DELETE FROM public.student_profiles WHERE user_id = p_profile_id;
  DELETE FROM public.students WHERE id = p_profile_id;
  DELETE FROM public.users WHERE id = p_profile_id;

  -- Upsert canonical users row (auth id)
  IF v_email IS NOT NULL THEN
    INSERT INTO public.users (
      id, email, full_name, role, phone, avatar_url,
      pin_number, date_of_birth, is_password_set, first_login_completed,
      bio, branch, year
    )
    VALUES (
      p_auth_id,
      v_email,
      COALESCE(v_full_name, v_email),
      COALESCE(u.role, 'student'),
      u.phone,
      u.avatar_url,
      COALESCE(u.pin_number, s.pin_number),
      COALESCE(u.date_of_birth, s.date_of_birth),
      COALESCE(u.is_password_set, s.is_password_set, FALSE),
      COALESCE(u.first_login_completed, FALSE),
      u.bio,
      u.branch,
      u.year
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      pin_number = COALESCE(public.users.pin_number, EXCLUDED.pin_number),
      date_of_birth = COALESCE(public.users.date_of_birth, EXCLUDED.date_of_birth),
      role = COALESCE(public.users.role, EXCLUDED.role);
  END IF;

  -- Upsert canonical students row (auth id)
  IF s.id IS NOT NULL OR v_roll_number IS NOT NULL THEN
    INSERT INTO public.students (
      id, roll_number, full_name, email, phone,
      college_id, branch_id, academic_year_id,
      date_of_birth, cgpa, bio, profile_image,
      is_password_set, year, pin_number
    )
    VALUES (
      p_auth_id,
      COALESCE(v_roll_number, 'PENDING'),
      COALESCE(v_full_name, v_email),
      v_email,
      s.phone,
      s.college_id, s.branch_id, s.academic_year_id,
      s.date_of_birth, COALESCE(s.cgpa, 0), s.bio, s.profile_image,
      COALESCE(s.is_password_set, FALSE), s.year, s.pin_number
    )
    ON CONFLICT (id) DO UPDATE SET
      roll_number = EXCLUDED.roll_number,
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      phone = COALESCE(public.students.phone, EXCLUDED.phone),
      college_id = COALESCE(public.students.college_id, EXCLUDED.college_id),
      branch_id = COALESCE(public.students.branch_id, EXCLUDED.branch_id),
      academic_year_id = COALESCE(public.students.academic_year_id, EXCLUDED.academic_year_id),
      pin_number = COALESCE(public.students.pin_number, EXCLUDED.pin_number),
      date_of_birth = COALESCE(public.students.date_of_birth, EXCLUDED.date_of_birth),
      year = COALESCE(public.students.year, EXCLUDED.year);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reconcile_student_to_auth_id(UUID, UUID) TO service_role;

-- ============================================================
-- DIAGNOSTIC: find students whose id does not match auth.users
-- ============================================================
-- SELECT s.email, s.id AS students_id, a.id AS auth_id, s.full_name
-- FROM public.students s
-- LEFT JOIN auth.users a ON lower(a.email) = lower(s.email)
-- WHERE a.id IS NULL OR a.id <> s.id;

-- ============================================================
-- MANUAL FIX for one student (replace email)
-- ============================================================
-- DO $$
-- DECLARE
--   v_email TEXT := 'student@college.edu';
--   v_auth_id UUID;
--   v_profile_id UUID;
-- BEGIN
--   SELECT id INTO v_profile_id FROM public.students WHERE lower(email) = lower(v_email);
--   SELECT public.get_auth_user_id_by_email(v_email) INTO v_auth_id;
--   IF v_profile_id IS NOT NULL AND v_auth_id IS NOT NULL THEN
--     PERFORM public.reconcile_student_to_auth_id(v_profile_id, v_auth_id);
--   END IF;
-- END $$;
