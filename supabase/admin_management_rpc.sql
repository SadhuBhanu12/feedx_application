-- 1. Create Admin Account (Inserts into auth.users and then public.users)
-- We use SECURITY DEFINER so that any user with access (we will restrict via frontend superadmin) can execute it with Postgres superuser powers to insert into auth.users.
CREATE OR REPLACE FUNCTION create_college_admin(
    admin_email text,
    admin_password text,
    admin_name text,
    college_id uuid,
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
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
        RETURN json_build_object('error', 'Email already in use.');
    END IF;

    -- Generate a new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Encrypt the password using pgcrypto extension
    -- Supabase auth uses bcrypt
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
    INSERT INTO public.users (id, full_name, email, role, college_id, is_active)
    VALUES (new_user_id, admin_name, admin_email, admin_role, college_id, true)
    ON CONFLICT (id) DO UPDATE SET 
        role = EXCLUDED.role,
        college_id = EXCLUDED.college_id;

    -- 3. Insert into public.admins table
    INSERT INTO public.admins (id, admin_name, email, institution_id, role)
    VALUES (new_user_id, admin_name, admin_email, college_id, admin_role)
    ON CONFLICT (id) DO NOTHING;

    RETURN json_build_object('success', true, 'user_id', new_user_id);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;


-- 2. Update Admin Password
CREATE OR REPLACE FUNCTION update_admin_password(
    target_admin_id uuid,
    new_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encrypted_pw text;
BEGIN
    encrypted_pw := crypt(new_password, gen_salt('bf'));

    UPDATE auth.users 
    SET encrypted_password = encrypted_pw, updated_at = now()
    WHERE id = target_admin_id;

    IF FOUND THEN
        RETURN json_build_object('success', true);
    ELSE
        RETURN json_build_object('error', 'Admin not found');
    END IF;
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;


-- 3. Delete Admin Account entirely
CREATE OR REPLACE FUNCTION delete_college_admin(
    target_admin_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete from public tables first to avoid FK constraints
    DELETE FROM public.admins WHERE id = target_admin_id;
    DELETE FROM public.users WHERE id = target_admin_id;
    
    -- Finally, delete from auth.users
    DELETE FROM auth.users WHERE id = target_admin_id;

    RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;
