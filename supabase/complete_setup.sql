-- 🚀 FEEDX DEFINITIVE ENTERPRISE SETUP (Schema + Mock Data)
-- VERSION: 5.0 (Final Comprehensive)
-- This script builds the entire 7-level hierarchy and ALL modules for a real-time ERP experience.

-- ==========================================
-- 1. CLEANUP & EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Standard function for updating timestamps
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_signup();

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.college_placements CASCADE;
DROP TABLE IF EXISTS public.college_facilities CASCADE;
DROP TABLE IF EXISTS public.college_courses CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.timetables CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.opportunities CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.sections CASCADE;
DROP TABLE IF EXISTS public.academic_years CASCADE;
DROP TABLE IF EXISTS public.branches CASCADE;
DROP TABLE IF EXISTS public.colleges CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ==========================================
-- 2. ACADEMIC HIERARCHY (Levels 1-5)
-- ==========================================

CREATE TABLE public.colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_name TEXT NOT NULL,
    college_code TEXT UNIQUE,
    location TEXT,
    type TEXT,
    principal_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_name TEXT NOT NULL,
    branch_code TEXT NOT NULL,
    hod_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, branch_code)
);

CREATE TABLE public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    year_name TEXT NOT NULL,
    semester TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,
    class_incharge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    faculty_name TEXT,
    credits INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(academic_year_id, subject_code)
);

-- ==========================================
-- 3. USER & PROFILE SYSTEM (Level 6)
-- ==========================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY, -- Linked to Auth
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student', -- student, faculty, inst_admin, super_admin
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.students (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
    section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    date_of_birth DATE, -- Used as initial password (e.g., DDMMYYYY)
    cgpa NUMERIC DEFAULT 0.0,
    bio TEXT,
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, roll_number)
);

-- ==========================================
-- 4. ACADEMIC OPERATIONS (Level 7)
-- ==========================================

CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL, -- Present, Absent, Excused
    marked_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    period_number INTEGER NOT NULL,
    faculty_id UUID REFERENCES public.users(id),
    start_time TIME,
    end_time TIME,
    room_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMPTZ,
    status TEXT DEFAULT 'Pending', -- Pending, Completed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. CONTENT & DISCOVERY MODULES
-- ==========================================

CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'Notes', -- Notes, Previous Paper
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    eligible_colleges UUID[],
    eligible_branches TEXT[],
    deadline DATE,
    apply_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_college UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    target_branch UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    target_year UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    target_section UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE,
    location TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, student_id)
);

-- ==========================================
-- 6. ERP SUB-MODULES
-- ==========================================

CREATE TABLE public.college_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_name TEXT NOT NULL,
    duration TEXT,
    seats INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.college_facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    facility_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.college_placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    package TEXT,
    year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. ADMIN & AUDIT SYSTEM
-- ==========================================

CREATE TABLE public.admins (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'inst_admin',
    institution_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 8. REAL-TIME CONFIGURATION
-- ==========================================

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.notifications,
    public.attendance,
    public.timetables,
    public.tasks,
    public.resources,
    public.events,
    public.opportunities;
COMMIT;

-- ==========================================
-- ==========================================
-- 9. TRIGGERS & AUTOMATION (Real-time Sync)
-- ==========================================

-- Auto-update timestamps
CREATE TRIGGER update_colleges_modtime BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into base users table
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  
  -- If it's a student, insert into students table
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- ==========================================
-- 10. MOCK DATA (STARTER PACK)
-- ==========================================

-- 1. Colleges
INSERT INTO public.colleges (id, college_name, college_code, location)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Government Polytechnic College', 'GPC001', 'City Center');

-- 2. Branches
INSERT INTO public.branches (id, college_id, branch_name, branch_code)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Computer Science', 'CSE');

-- 3. Academic Years
INSERT INTO public.academic_years (id, branch_id, year_name, semester)
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', '2nd Year', '3');

-- 4. Sections
INSERT INTO public.sections (id, academic_year_id, section_name)
VALUES ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'A');

-- 5. Subjects
INSERT INTO public.subjects (id, branch_id, academic_year_id, subject_name, subject_code)
VALUES ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'Data Structures', 'CS201');

-- 6. Core Users
INSERT INTO public.users (id, email, full_name, role)
VALUES 
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', 'admin@feedx.app', 'Admin Bhanu', 'super_admin'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f22', 'student@feedx.app', 'Sample Student', 'student');

-- 7. Admin Profile
INSERT INTO public.admins (id, name, email, role, institution_id)
VALUES ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', 'Admin Bhanu', 'admin@feedx.app', 'super_admin', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- 8. Student Profile
INSERT INTO public.students (id, roll_number, full_name, email, college_id, branch_id, academic_year_id, section_id, date_of_birth)
VALUES ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f22', '21001', 'Sample Student', 'student@feedx.app', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', '2005-05-15');

-- 9. Sample Attendance
INSERT INTO public.attendance (student_id, subject_id, status)
VALUES ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f22', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 'Present');

-- 10. Initial Notification
INSERT INTO public.notifications (target_college, title, message)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Welcome to FeedX', 'Professional Real-time Hierarchy Deployed.');
