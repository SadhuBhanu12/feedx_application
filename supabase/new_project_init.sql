-- 🚀 FEEDX NEW PROJECT MASTER INITIALIZATION
-- This script builds the entire ecosystem in your NEW project.

-- ==========================================
-- 1. EXTENSIONS & SECURITY
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==========================================
-- 2. CORE HIERARCHY
-- ==========================================
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.sections CASCADE;
DROP TABLE IF EXISTS public.academic_years CASCADE;
DROP TABLE IF EXISTS public.branches CASCADE;
DROP TABLE IF EXISTS public.colleges CASCADE;

CREATE TABLE public.colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_name TEXT NOT NULL,
    college_code TEXT UNIQUE,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_name TEXT NOT NULL,
    branch_code TEXT NOT NULL
);

CREATE TABLE public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    year_name TEXT NOT NULL,
    semester TEXT
);

CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL
);

CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    subject_code TEXT NOT NULL
);

-- ==========================================
-- 3. USER SYSTEM
-- ==========================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.students (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    college_id UUID REFERENCES public.colleges(id),
    branch_id UUID REFERENCES public.branches(id),
    academic_year_id UUID REFERENCES public.academic_years(id),
    section_id UUID REFERENCES public.sections(id),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. AUTH TRIGGER (Auto-create Profile)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.students (id, roll_number, full_name, email)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'roll_number', 'PENDING'), 
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- ==========================================
-- 5. API PERMISSIONS (SCHEMA FIX)
-- ==========================================
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;

-- ==========================================
-- 6. MOCK DATA (Initial Fill)
-- ==========================================
DO $$ 
DECLARE 
    v_college_id UUID;
    v_branch_id UUID;
    v_year_id UUID;
    v_section_id UUID;
BEGIN
    INSERT INTO public.colleges (college_name, college_code, location)
    VALUES ('Global Polytechnic', 'GP001', 'City Center')
    RETURNING id INTO v_college_id;

    INSERT INTO public.branches (college_id, branch_name, branch_code)
    VALUES (v_college_id, 'Computer Science', 'CSE')
    RETURNING id INTO v_branch_id;

    INSERT INTO public.academic_years (branch_id, year_name, semester)
    VALUES (v_branch_id, '3rd Year', '5')
    RETURNING id INTO v_year_id;

    INSERT INTO public.sections (academic_year_id, section_name)
    VALUES (v_year_id, 'Section A')
    RETURNING id INTO v_section_id;

    RAISE NOTICE '✅ New Project Initialized Successfully.';
END $$;
