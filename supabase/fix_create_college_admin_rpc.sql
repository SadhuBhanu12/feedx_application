-- Fix create_college_admin RPC function ambiguity and schema compatibility
-- Run once in Supabase SQL Editor

-- 1. Drop old overloaded versions of the function to eliminate candidate function ambiguity
DROP FUNCTION IF EXISTS public.create_college_admin(text, text, text, text, uuid);
DROP FUNCTION IF EXISTS public.create_college_admin(text, text, text, uuid, text);
DROP FUNCTION IF EXISTS public.create_college_admin(text, text, text, text);
DROP FUNCTION IF EXISTS public.create_college_admin(text, text, text, uuid);

-- 2. Ensure college_id exists on public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS college_id UUID;

-- 3. Create single, unified function signature
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
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
        RETURN json_build_object('error', 'Email already in use.');
    END IF;

    new_user_id := gen_random_uuid();
    encrypted_pw := crypt(admin_password, gen_salt('bf'));

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
        INSERT INTO public.users (id, full_name, email, role, college_id, is_active)
        VALUES (new_user_id, admin_name, admin_email, admin_role, college_id, true)
        ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO public.users (id, full_name, email, role, is_active)
        VALUES (new_user_id, admin_name, admin_email, admin_role, true)
        ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
    END;

    -- 3. Insert into public.admins
    BEGIN
        INSERT INTO public.admins (id, admin_name, name, email, institution_id, role)
        VALUES (new_user_id, admin_name, admin_name, admin_email, college_id, admin_role)
        ON CONFLICT (id) DO UPDATE SET institution_id = EXCLUDED.institution_id;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    RETURN json_build_object('success', true, 'user_id', new_user_id);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;
