-- ==============================================================================
-- FEEDX SUPER ADMIN PANEL: COMPREHENSIVE FIXES & ENHANCEMENTS MIGRATION
-- ==============================================================================

-- 1. EVENT HUB: Support External Event Registration Links, Organizers & Deadlines
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_name TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_deadline TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS eligibility TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_source TEXT DEFAULT 'feedx'; -- 'feedx' or 'external'

CREATE INDEX IF NOT EXISTS idx_events_registration_deadline ON public.events (registration_deadline);
CREATE INDEX IF NOT EXISTS idx_events_event_source ON public.events (event_source);

-- 2. COMMUNITY MODULE: Ensure featured and pinned columns and indexes
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

CREATE INDEX IF NOT EXISTS idx_community_posts_featured ON public.community_posts (featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_community_posts_pinned ON public.community_posts (pinned) WHERE pinned = TRUE;
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts (category);

-- 3. ADMIN MANAGEMENT: Unified Atomic College Admin Creation RPC
CREATE OR REPLACE FUNCTION public.create_college_admin(
    admin_email text,
    admin_password text,
    admin_name text,
    college_id uuid DEFAULT NULL,
    admin_role text DEFAULT 'admin'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id uuid;
    encrypted_pw text;
BEGIN
    admin_email := lower(trim(admin_email));
    admin_name := trim(admin_name);

    IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = admin_email) THEN
        RETURN json_build_object('error', 'Email already in use.');
    END IF;

    new_user_id := gen_random_uuid();
    encrypted_pw := crypt(admin_password, gen_salt('bf', 10));

    -- 1. Insert into auth.users
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, recovery_sent_at, last_sign_in_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', admin_email, encrypted_pw,
        now(), NULL, NULL,
        '{"provider":"email","providers":["email"]}',
        json_build_object('full_name', admin_name, 'role', admin_role, 'college_id', college_id),
        now(), now(),
        '', '', '', ''
    );

    -- 2. Insert into public.users
    BEGIN
        INSERT INTO public.users (id, full_name, email, role, college_id, is_active, created_at, updated_at)
        VALUES (new_user_id, admin_name, admin_email, admin_role, college_id, true, now(), now())
        ON CONFLICT (id) DO UPDATE SET 
            role = EXCLUDED.role,
            college_id = EXCLUDED.college_id,
            is_active = true,
            full_name = EXCLUDED.full_name;
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO public.users (id, full_name, email, role, is_active, created_at, updated_at)
        VALUES (new_user_id, admin_name, admin_email, admin_role, true, now(), now())
        ON CONFLICT (id) DO UPDATE SET 
            role = EXCLUDED.role,
            is_active = true,
            full_name = EXCLUDED.full_name;
    END;

    -- 3. Insert into public.admins
    BEGIN
        INSERT INTO public.admins (id, admin_name, name, email, institution_id, role, created_at)
        VALUES (new_user_id, admin_name, admin_name, admin_email, college_id, admin_role, now())
        ON CONFLICT (id) DO UPDATE SET 
            institution_id = EXCLUDED.institution_id,
            role = EXCLUDED.role,
            name = EXCLUDED.name,
            admin_name = EXCLUDED.admin_name;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    RETURN json_build_object('success', true, 'user_id', new_user_id);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;

-- 4. PASSWORD RESET: Robust Password Change RPC for Admins & Super Admins
CREATE OR REPLACE FUNCTION public.change_user_password_by_admin(
    target_user_id UUID, 
    new_plain_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_requester_role TEXT;
BEGIN
  -- Get requester's role
  SELECT role INTO v_requester_role FROM public.users WHERE id = auth.uid();
  
  -- Check if requester is super_admin, admin, or inst_admin
  IF v_requester_role IS NULL OR v_requester_role NOT IN ('super_admin', 'admin', 'inst_admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators can reset user passwords.';
  END IF;

  IF new_plain_password IS NULL OR length(trim(new_plain_password)) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters.';
  END IF;

  -- Update encrypted password in auth.users
  UPDATE auth.users
  SET encrypted_password = crypt(trim(new_plain_password), gen_salt('bf', 10)),
      updated_at = now()
  WHERE id = target_user_id;

  -- Update user states
  UPDATE public.users 
  SET is_password_set = TRUE, 
      first_login_completed = TRUE,
      updated_at = now()
  WHERE id = target_user_id;

  UPDATE public.students
  SET is_password_set = TRUE
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
