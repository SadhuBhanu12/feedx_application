-- 🏛️ FEEDX MULTI-TENANT DATABASE SCHEMA (UNIFIED USER DESIGN)
-- Redesigned from scratch with a comprehensive Users table holding all personal and academic details.

-- ==========================================
-- 1. EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. CORE REGISTRY (Colleges)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE,
    location TEXT,
    type TEXT DEFAULT 'Private', -- Govt, Private, Autonomous
    established_year INTEGER,
    rating NUMERIC DEFAULT 4.5,
    logo_url TEXT,
    banner_url TEXT,
    website TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. BRANCHES / COURSES (College Specific)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., CSE, ECE, Mechanical, B.Sc
    code TEXT, -- e.g., 05 for CSE
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, name)
);

-- ==========================================
-- 4. UNIFIED USERS TABLE
-- Comprehensive table storing personal, contact, and academic details
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    
    -- Personal Details
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    profile_picture_url TEXT,
    bio TEXT,
    
    -- Contact Details
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    
    -- Academic Details
    role TEXT DEFAULT 'student', -- student, faculty, admin
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    class_name TEXT, -- E.g., "B.Tech CSE"
    year INTEGER,    -- 1, 2, 3, 4
    semester INTEGER,
    section TEXT DEFAULT 'A',
    roll_no TEXT,
    
    -- App/System Status
    registration_status TEXT DEFAULT 'pending',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- A roll number should be unique within a college
    UNIQUE(college_id, roll_no)
);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Function to handle new user signup
-- This automatically creates a public.users entry when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, profile_picture_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 5. ACADEMIC RESOURCES (Library/Notes)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    author TEXT,
    file_url TEXT NOT NULL,
    year INTEGER,
    semester INTEGER,
    type TEXT DEFAULT 'Notes', -- Notes, Previous Paper, Syllabus
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. ATTENDANCE SYSTEM
-- ==========================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    present_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    last_marked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, college_id, subject)
);

-- ==========================================
-- 7. TIMETABLES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    year INTEGER,
    semester INTEGER,
    section TEXT DEFAULT 'A',
    day_of_week INTEGER NOT NULL, -- 1 (Mon) to 6 (Sat)
    period_number INTEGER NOT NULL,
    subject_name TEXT NOT NULL,
    faculty_name TEXT,
    start_time TIME,
    end_time TIME,
    room_no TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 8. ANNOUNCEMENTS & NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_branch_id UUID REFERENCES public.branches(id), -- NULL for all branches
    target_year INTEGER, -- NULL for all years
    is_critical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 9. ROW LEVEL SECURITY (Multi-Tenancy Isolation)
-- ==========================================

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ FOR COLLEGES
CREATE POLICY "Anyone can view colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Anyone can view branches" ON public.branches FOR SELECT USING (true);

-- USERS: Users can view/edit their own data
CREATE POLICY "Users view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RESOURCES: Students view resources belonging to their college
CREATE POLICY "Students view college resources" ON public.resources FOR SELECT 
USING (college_id = (SELECT college_id FROM public.users WHERE id = auth.uid()));

-- ATTENDANCE: Users view their own attendance
CREATE POLICY "Users view own attendance" ON public.attendance FOR SELECT 
USING (user_id = auth.uid());

-- TIMETABLES: Students view their college timetable
CREATE POLICY "Students view college timetable" ON public.timetables FOR SELECT 
USING (college_id = (SELECT college_id FROM public.users WHERE id = auth.uid()));

-- ANNOUNCEMENTS: Students view their college announcements
CREATE POLICY "Students view college announcements" ON public.announcements FOR SELECT 
USING (college_id = (SELECT college_id FROM public.users WHERE id = auth.uid()));

-- ==========================================
-- 10. REALTIME CONFIGURATION
-- ==========================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.users,
    public.attendance,
    public.announcements,
    public.timetables;
COMMIT;
