-- FEEDX SCHEMA SYNCHRONIZATION
-- Run this in Supabase SQL Editor to support professional admin features

-- 1. Notifications Table Updates
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS branch text DEFAULT 'All';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS year int DEFAULT 0;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS section text DEFAULT 'All';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS apply_url text;

-- 2. Internships (Opportunities) Table Updates
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS link text;
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS eligible_branches text[] DEFAULT '{All}';
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS year_eligibility text DEFAULT 'All';
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS stipend text;

-- 3. Timetable Table Updates
ALTER TABLE public.timetable ADD COLUMN IF NOT EXISTS subject_name text;
ALTER TABLE public.timetable ADD COLUMN IF NOT EXISTS start_time text;
ALTER TABLE public.timetable ADD COLUMN IF NOT EXISTS end_time text;
ALTER TABLE public.timetable ADD COLUMN IF NOT EXISTS room text;

-- 4. Colleges Table Updates
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS brochure_url text;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 4.5;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS images text[];

-- 5. Events Table Updates
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category text DEFAULT 'Workshop';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url text;

-- 6. Student Profiles Updates
ALTER TABLE public.student_profiles ALTER COLUMN date_of_birth TYPE date USING date_of_birth::date;
