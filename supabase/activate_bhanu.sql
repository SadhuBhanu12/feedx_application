-- 1. Correct password and email verification for bhanu12@gmail.com in auth.users
UPDATE auth.users
SET email = 'bhanu12@gmail.com',
    encrypted_password = extensions.crypt('FeedX@123', extensions.gen_salt('bf')),
    email_confirmed_at = now(),
    confirmed_at = now(),
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin", "full_name": "Ramesh"}'::jsonb,
    updated_at = now()
WHERE email ILIKE 'bhanu12@gmail.com';

-- 2. Make sure they exist in public.users
UPDATE public.users
SET email = 'bhanu12@gmail.com',
    role = 'admin',
    is_password_set = TRUE,
    first_login_completed = TRUE
WHERE id = '3837ceb1-ce2c-40e0-b8ab-ada02bad9f14';

-- 3. Make sure they exist in public.admins
INSERT INTO public.admins (id, name, email, role)
VALUES ('3837ceb1-ce2c-40e0-b8ab-ada02bad9f14', 'Ramesh', 'bhanu12@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE
SET name = 'Ramesh', email = 'bhanu12@gmail.com', role = 'admin';
