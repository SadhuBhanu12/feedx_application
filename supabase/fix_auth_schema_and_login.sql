-- ==============================================================================
-- FEEDX — CRITICAL FIX: "Database error querying schema" & LOGIN RESTORATION (V2)
-- ==============================================================================
-- Fixed: Removed phone = '' to prevent unique constraint violation on users_phone_key.
-- In auth.users, phone must remain NULL for users without a phone number.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- STEP 1: RESTORE phone = NULL (avoid duplicate empty string on users_phone_key)
-- AND FIX ALL NULL TOKEN COLUMNS
-- ------------------------------------------------------------------------------
UPDATE auth.users
SET phone = NULL
WHERE phone = '';

UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  reauthentication_token = COALESCE(reauthentication_token, ''),
  is_sso_user = COALESCE(is_sso_user, false),
  is_anonymous = COALESCE(is_anonymous, false),
  email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE 
  confirmation_token IS NULL 
  OR email_change IS NULL 
  OR email_change_token_new IS NULL 
  OR recovery_token IS NULL
  OR email_change_token_current IS NULL
  OR reauthentication_token IS NULL
  OR is_sso_user IS NULL
  OR is_anonymous IS NULL
  OR email_confirmed_at IS NULL;

-- ------------------------------------------------------------------------------
-- STEP 2: POPULATE MISSING ENTRIES IN auth.identities
-- Required by GoTrue for email/password authentication
-- ------------------------------------------------------------------------------
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    u.id,
    jsonb_build_object(
        'sub', u.id::text,
        'email', u.email,
        'email_verified', true
    ),
    'email',
    u.id::text,
    NOW(),
    NOW(),
    NOW()
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities i 
    WHERE i.user_id = u.id AND i.provider = 'email'
);

-- ------------------------------------------------------------------------------
-- STEP 3: UPGRADE get_student_email_for_login (Multi-Identifier Resolver)
-- Supports Roll Number, PIN, FeedX ID, and Email!
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_student_email_for_login(p_roll_number TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_email TEXT;
    v_search TEXT := UPPER(TRIM(p_roll_number));
BEGIN
    IF v_search IS NULL OR v_search = '' THEN
        RETURN NULL;
    END IF;

    -- Match roll_number, pin_number, feedx_id, or email in students table
    SELECT email INTO v_email
    FROM public.students
    WHERE UPPER(TRIM(COALESCE(roll_number, ''))) = v_search
       OR UPPER(TRIM(COALESCE(pin_number, ''))) = v_search
       OR UPPER(TRIM(COALESCE(feedx_id, ''))) = v_search
       OR UPPER(TRIM(COALESCE(email, ''))) = v_search
    LIMIT 1;

    IF v_email IS NOT NULL THEN
        RETURN v_email;
    END IF;

    -- Fallback: check users table
    SELECT email INTO v_email
    FROM public.users
    WHERE UPPER(TRIM(COALESCE(email, ''))) = v_search
    LIMIT 1;

    RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_student_email_for_login(TEXT) TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- STEP 4: HARDEN set_auth_password_direct TO KEEP auth.identities IN SYNC
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_auth_password_direct(
  p_user_id UUID,
  p_password TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_catalog
AS $$
BEGIN
  UPDATE auth.users
  SET encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      confirmation_token = COALESCE(confirmation_token, ''),
      recovery_token = COALESCE(recovery_token, ''),
      email_change = COALESCE(email_change, ''),
      email_change_token_new = COALESCE(email_change_token_new, ''),
      email_change_token_current = COALESCE(email_change_token_current, ''),
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        jsonb_build_object(
          'must_change_password', false,
          'is_password_set', true,
          'first_login_completed', true
        ),
      updated_at = now()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found in auth.users';
  END IF;

  INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
  )
  SELECT 
      gen_random_uuid(),
      u.id,
      jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
      'email',
      u.id::text,
      NOW(),
      NOW(),
      NOW()
  FROM auth.users u
  WHERE u.id = p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i 
      WHERE i.user_id = p_user_id AND i.provider = 'email'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_auth_password_direct(UUID, TEXT) TO service_role;

COMMIT;

-- ------------------------------------------------------------------------------
-- VERIFICATION
-- ------------------------------------------------------------------------------
SELECT 
    (SELECT COUNT(*) FROM auth.users) AS total_auth_users,
    (SELECT COUNT(*) FROM auth.identities WHERE provider = 'email') AS total_email_identities,
    'All auth accounts synchronized and ready for login!' AS status;
