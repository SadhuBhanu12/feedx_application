-- 🏛️ FEEDX PROFESSIONAL HIERARCHY-BASED DATABASE ARCHITECTURE
-- VERSION: 4.0 (Enterprise ERP Standard)
-- This schema implements a strict Parent-Child hierarchy for maximum scalability and data integrity.

-- ==========================================
-- 1. EXTENSIONS & UTILITIES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 2. CLEANUP (Full Reset)
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_signup();

DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.college_placements CASCADE;
DROP TABLE IF EXISTS public.college_facilities CASCADE;
DROP TABLE IF EXISTS public.college_courses CASCADE;
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
-- 3. LEVEL 1: COLLEGES
-- ==========================================
CREATE TABLE public.colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_name TEXT NOT NULL,
    college_code TEXT UNIQUE,
    location TEXT,
    type TEXT, -- e.g., Polytechnic, Engineering, Arts
    principal_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. LEVEL 2: BRANCHES / DEPARTMENTS
-- ==========================================
CREATE TABLE public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_name TEXT NOT NULL, -- e.g., CSE, ECE, MECH
    branch_code TEXT NOT NULL, -- e.g., 05
    hod_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, branch_code)
);

-- ==========================================
-- 5. LEVEL 3: ACADEMIC YEARS
-- ==========================================
CREATE TABLE public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    year_name TEXT NOT NULL, -- e.g., 1st Year, 2nd Year
    semester TEXT, -- e.g., 1, 2, 3, 4, 5, 6
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. LEVEL 4: SECTIONS
-- ==========================================
CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL, -- e.g., A, B, C
    class_incharge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. LEVEL 5: SUBJECTS
-- ==========================================
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
-- 8. LEVEL 6: USERS & STUDENTS
-- ==========================================

-- Core Users (Auth Mapping)
CREATE TABLE public.users (
    id UUID PRIMARY KEY, -- Removed strict auth.users reference for mock data flexibility
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student', -- student, faculty, admin
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Profiles (Detailed Hierarchy Link)
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
    cgpa NUMERIC DEFAULT 0.0,
    bio TEXT,
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, roll_number)
);

-- ==========================================
-- 9. LEVEL 7: ATTENDANCE
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

-- ==========================================
-- 10. RESOURCE HIERARCHY
-- ==========================================
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'Notes', -- Notes, Previous Paper, Syllabus
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 11. OPPORTUNITIES & CAREER
-- ==========================================
CREATE TABLE public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    eligible_colleges UUID[], -- Array of college IDs
    eligible_branches TEXT[], -- Array of branch names or codes
    eligible_years TEXT[], -- Array of year names
    deadline DATE,
    apply_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 12. NOTIFICATIONS & BROADCASTS
-- ==========================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_college UUID,
    target_branch UUID,
    target_year UUID,
    target_section UUID,
    type TEXT DEFAULT 'General',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 13. EVENTS & REGISTRATIONS
-- ==========================================
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE,
    location TEXT,
    registration_link TEXT,
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
-- 14. COLLEGE MODULES (ERP Sub-modules)
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
-- 15. ADMIN & AUDIT SYSTEM
-- ==========================================
CREATE TABLE public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'inst_admin', -- super_admin, inst_admin
    institution_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g., "Marked Attendance", "Uploaded Resource"
    target_table TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 16. TRIGGERS & RLS
-- ==========================================

-- Auto-update timestamps
CREATE TRIGGER update_colleges_modtime BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'student');
  
  INSERT INTO public.students (id, full_name, email, roll_number)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email, COALESCE(NEW.raw_user_meta_data->>'roll_number', 'PENDING'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- Enable RLS
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for setup, restrict as needed)
CREATE POLICY "Public Read Colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Users Read Own Student Profile" ON public.students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students Read Attendance" ON public.attendance FOR SELECT USING (student_id = auth.uid());

-- ==========================================
-- 17. REALTIME
-- ==========================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.notifications,
    public.attendance,
    public.resources,
    public.events;
COMMIT;
