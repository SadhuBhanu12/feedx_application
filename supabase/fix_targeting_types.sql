-- FIX: Ensure targeting columns are TEXT to support "All" string values
ALTER TABLE public.notifications ALTER COLUMN year TYPE TEXT;
ALTER TABLE public.notifications ALTER COLUMN section TYPE TEXT;
ALTER TABLE public.notifications ALTER COLUMN branch TYPE TEXT;

ALTER TABLE public.student_profiles ALTER COLUMN year TYPE TEXT;
ALTER TABLE public.student_profiles ALTER COLUMN section TYPE TEXT;
ALTER TABLE public.student_profiles ALTER COLUMN branch TYPE TEXT;

ALTER TABLE public.internships ALTER COLUMN year_eligibility TYPE TEXT;

-- RE-ENABLE REALTIME for the refined schema
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER TABLE public.internships REPLICA IDENTITY FULL;
