-- SUPPORT FOR BULK STUDENT IMPORT
-- 1. Allow student profiles to exist without a user_id (for pre-registration)
ALTER TABLE public.student_profiles ALTER COLUMN user_id DROP NOT NULL;

-- 2. Ensure roll_no is unique for lookups
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'student_profiles_roll_no_key') THEN
    ALTER TABLE public.student_profiles ADD CONSTRAINT student_profiles_roll_no_key UNIQUE (roll_no);
  END IF;
END $$;

-- 3. Add a status column to track registration
ALTER TABLE public.student_profiles ADD COLUMN IF NOT EXISTS registration_status text DEFAULT 'pending'; -- 'pending' or 'active'
