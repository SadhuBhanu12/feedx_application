-- ============================================================
-- FIX: create_activation_session - handle duplicate email constraint
-- 
-- Problem: The INSERT INTO public.users uses ON CONFLICT (id) DO NOTHING,
-- but the users table also has a UNIQUE constraint on email (users_email_key).
-- If a different user row already has the same email, the insert fails with:
--   "duplicate key value violates unique constraint: users_email_key"
--
-- Solution: Handle both conflict scenarios:
--   1. If the same id exists → do nothing (already handled)
--   2. If a different id has the same email → update that existing row's id 
--      to match the student, or just use the existing row
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_activation_session(
  p_roll_number TEXT,
  p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_student_id UUID;
  v_full_name TEXT;
  v_token TEXT;
  v_expires_at TIMESTAMPTZ;
  v_existing_user_id UUID;
BEGIN
  -- Find the pre-registered student
  SELECT id, full_name INTO v_student_id, v_full_name
  FROM public.students
  WHERE roll_number = p_roll_number AND lower(email) = lower(p_email)
  LIMIT 1;

  IF v_student_id IS NULL THEN
    -- Fallback by email only
    SELECT id, full_name INTO v_student_id, v_full_name
    FROM public.students
    WHERE lower(email) = lower(p_email)
    LIMIT 1;
  END IF;

  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Student not found in registry. Please contact administration.';
  END IF;

  -- Check if a users row already exists with this email (possibly under a different ID)
  SELECT id INTO v_existing_user_id
  FROM public.users
  WHERE lower(email) = lower(p_email)
  LIMIT 1;

  IF v_existing_user_id IS NOT NULL THEN
    -- A user row with this email already exists
    IF v_existing_user_id = v_student_id THEN
      -- Same ID, same email - perfect, just make sure fields are up to date
      UPDATE public.users
      SET full_name = COALESCE(NULLIF(full_name, ''), v_full_name),
          role = COALESCE(NULLIF(role, ''), 'student')
      WHERE id = v_student_id;
    ELSE
      -- Different ID has this email - update the existing row's ID to match the student
      -- This reconciles the orphaned/mismatched user row
      UPDATE public.users
      SET id = v_student_id,
          full_name = COALESCE(v_full_name, full_name),
          role = COALESCE(NULLIF(role, ''), 'student'),
          is_password_set = false,
          first_login_completed = false
      WHERE id = v_existing_user_id;
    END IF;
  ELSE
    -- Check if a users row exists with matching ID but different email
    SELECT id INTO v_existing_user_id
    FROM public.users
    WHERE id = v_student_id
    LIMIT 1;

    IF v_existing_user_id IS NOT NULL THEN
      -- Row exists with same ID but different email - update email
      UPDATE public.users
      SET email = lower(p_email),
          full_name = COALESCE(NULLIF(full_name, ''), v_full_name)
      WHERE id = v_student_id;
    ELSE
      -- No existing row at all - safe to insert
      INSERT INTO public.users (id, email, full_name, role, is_password_set, first_login_completed)
      VALUES (v_student_id, lower(p_email), v_full_name, 'student', false, false);
    END IF;
  END IF;

  -- Invalidate any old unused sessions for this student
  UPDATE public.activation_sessions
  SET used = true
  WHERE user_id = v_student_id;

  -- Generate a secure random token
  v_token := md5(random()::text || clock_timestamp()::text) || md5(random()::text);
  v_expires_at := now() + interval '15 minutes';

  -- Create the activation session row (bypasses RLS due to SECURITY DEFINER)
  INSERT INTO public.activation_sessions (user_id, token, expires_at, used)
  VALUES (v_student_id, v_token, v_expires_at, false);

  RETURN jsonb_build_object(
    'activation_token', v_token,
    'name', v_full_name,
    'user_id', v_student_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_activation_session(TEXT, TEXT) TO anon, authenticated;
