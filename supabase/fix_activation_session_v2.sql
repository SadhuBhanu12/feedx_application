-- ============================================================
-- FIX: create_activation_session - handle duplicate email constraint (V2)
-- 
-- Problem: The INSERT INTO public.users uses ON CONFLICT (id) DO NOTHING,
-- but the users table also has a UNIQUE constraint on email (users_email_key).
-- If a different user row already has the same email, we cannot update its ID 
-- because of foreign key constraints (like student_profiles).
--
-- Solution: 
--   If a different user ID already occupies the email, we rename that old user's 
--   email to free it up, then insert the new user row safely.
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
  -- 1. Find the pre-registered student
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

  -- 2. Check if a users row already exists with this email (possibly under a different ID)
  SELECT id INTO v_existing_user_id
  FROM public.users
  WHERE lower(email) = lower(p_email)
  LIMIT 1;

  IF v_existing_user_id IS NOT NULL THEN
    IF v_existing_user_id = v_student_id THEN
      -- Same ID, same email - perfect, just make sure fields are up to date
      UPDATE public.users
      SET full_name = COALESCE(NULLIF(full_name, ''), v_full_name),
          role = COALESCE(NULLIF(role, ''), 'student')
      WHERE id = v_student_id;
    ELSE
      -- Different ID has this email!
      -- We cannot update its ID due to foreign keys (student_profiles).
      -- Instead, we rename the old orphaned row's email to clear the unique constraint.
      UPDATE public.users
      SET email = lower(p_email) || '_orphaned_' || substr(md5(random()::text), 1, 8)
      WHERE id = v_existing_user_id;

      -- Now we can safely insert the correct new user row
      INSERT INTO public.users (id, email, full_name, role, is_password_set, first_login_completed)
      VALUES (v_student_id, lower(p_email), v_full_name, 'student', false, false);
    END IF;
  ELSE
    -- 3. No email conflict - check if a row already exists with the same ID but different email
    SELECT id INTO v_existing_user_id
    FROM public.users
    WHERE id = v_student_id
    LIMIT 1;

    IF v_existing_user_id IS NOT NULL THEN
      -- Same ID but a different email - update the email safely
      UPDATE public.users
      SET email = lower(p_email),
          full_name = COALESCE(NULLIF(full_name, ''), v_full_name)
      WHERE id = v_student_id;
    ELSE
      -- Fresh insert - safe to create the user row
      INSERT INTO public.users (id, email, full_name, role, is_password_set, first_login_completed)
      VALUES (v_student_id, lower(p_email), v_full_name, 'student', false, false);
    END IF;
  END IF;

  -- 4. Invalidate any old unused sessions for this student
  UPDATE public.activation_sessions
  SET used = true
  WHERE user_id = v_student_id;

  -- 5. Generate a secure random token & store the activation session
  v_token := md5(random()::text || clock_timestamp()::text) || md5(random()::text);
  v_expires_at := now() + interval '15 minutes';

  INSERT INTO public.activation_sessions (user_id, token, expires_at, used)
  VALUES (v_student_id, v_token, v_expires_at, false);

  -- 6. Return the activation payload
  RETURN jsonb_build_object(
    'activation_token', v_token,
    'name', v_full_name,
    'user_id', v_student_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_activation_session(TEXT, TEXT) TO anon, authenticated;
