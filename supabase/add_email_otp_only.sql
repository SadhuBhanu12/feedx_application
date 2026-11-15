-- ==============================================================================
-- FEEDX — ACTIVATE EMAIL FOR OTP FIRST-TIME LOGIN
-- Sets is_password_set = false so user receives OTP and creates password
-- ==============================================================================

-- 1. Enable OTP first-time login on users table
UPDATE public.users 
SET is_password_set = false, 
    first_login_completed = false 
WHERE LOWER(email) = 'bennyravula386@gmail.com';

-- 2. Enable OTP first-time login on students table
UPDATE public.students 
SET is_password_set = false 
WHERE LOWER(email) = 'bennyravula386@gmail.com';

-- 3. If adding a brand new student email that isn't in students yet:
INSERT INTO public.students (
    id, 
    email, 
    full_name, 
    roll_number, 
    pin_number, 
    is_password_set
) 
VALUES (
    gen_random_uuid(), 
    'bennyravula386@gmail.com', 
    'Benny Ravula', 
    'GECCC-0001', 
    'GECCC-0001', 
    false
)
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, 
    is_password_set = false;
