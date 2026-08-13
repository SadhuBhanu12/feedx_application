-- 🚀 FEEDX MASTER PRODUCTION SCHEMA (v2.0)
-- This script ensures full relatability and concurrent data integrity across the platform.

-- ==========================================
-- 1. EXTENSIONS & SETUP
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. CORE USERS TABLE (Linked to Auth)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. COLLEGES (Institution Registry)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    location TEXT,
    type TEXT DEFAULT 'Private', -- Govt, Private, Autonomous
    ranking INTEGER,
    fee TEXT,
    placements TEXT,
    banner_url TEXT,
    brochure_url TEXT,
    website TEXT,
    rating NUMERIC DEFAULT 4.5,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. STUDENT PROFILES (Relatable to Users & Colleges)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.student_profiles (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    roll_no TEXT UNIQUE NOT NULL,
    college TEXT REFERENCES public.colleges(name) ON UPDATE CASCADE,
    branch TEXT,
    year TEXT,
    section TEXT DEFAULT 'A',
    bio TEXT,
    registration_status TEXT DEFAULT 'pending',
    academic_cgpa NUMERIC DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. NOTIFICATIONS (Broadcast & Direct)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- NULL for broadcasts
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    body TEXT, -- Fallback for message
    type TEXT DEFAULT 'General',
    branch TEXT DEFAULT 'All',
    year TEXT DEFAULT 'All',
    section TEXT DEFAULT 'All',
    apply_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. INTERNSHIPS & OPPORTUNITIES (Placement Cell)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.internships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    type TEXT DEFAULT 'Internship',
    location TEXT DEFAULT 'Remote',
    stipend TEXT,
    deadline TEXT,
    link TEXT,
    eligible_branches TEXT[] DEFAULT '{All}',
    year_eligibility TEXT DEFAULT 'All',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. CAMPUS EVENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    time TEXT,
    venue TEXT,
    type TEXT DEFAULT 'Workshop',
    image_url TEXT,
    capacity INTEGER DEFAULT 100,
    registered INTEGER DEFAULT 0,
    price NUMERIC DEFAULT 0, -- 0 for Free
    organizer UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 8. ATTENDANCE (Relatable to Users)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    present INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, subject)
);

-- ==========================================
-- 9. DIGITAL LIBRARY (Resources)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT,
    author TEXT,
    file_url TEXT,
    branch TEXT DEFAULT 'All',
    year TEXT DEFAULT 'All',
    section TEXT DEFAULT 'All',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 10. SECURITY & POLICIES
-- ==========================================

CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND (role = 'admin' OR role = 'super_admin' OR role = 'inst_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Dynamic Policy Creation
DO $$ 
BEGIN
    -- Users Policies
    DROP POLICY IF EXISTS "Users view own record" ON public.users;
    CREATE POLICY "Users view own record" ON public.users FOR SELECT USING (auth.uid() = id OR public.check_is_admin());
    
    -- Student Profiles Policies
    DROP POLICY IF EXISTS "Students view own profile" ON public.student_profiles;
    CREATE POLICY "Students view own profile" ON public.student_profiles FOR SELECT USING (auth.uid() = user_id OR public.check_is_admin());
    
    -- Global Read Tables
    DROP POLICY IF EXISTS "Public read colleges" ON public.colleges;
    CREATE POLICY "Public read colleges" ON public.colleges FOR SELECT TO authenticated USING (TRUE);
    
    DROP POLICY IF EXISTS "Public read internships" ON public.internships;
    CREATE POLICY "Public read internships" ON public.internships FOR SELECT TO authenticated USING (TRUE);
    
    DROP POLICY IF EXISTS "Public read events" ON public.events;
    CREATE POLICY "Public read events" ON public.events FOR SELECT TO authenticated USING (TRUE);

    -- Admin Master Policy (applied to all tables)
    DROP POLICY IF EXISTS "Admin master users" ON public.users;
    CREATE POLICY "Admin master users" ON public.users FOR ALL TO authenticated USING (public.check_is_admin());
    
    DROP POLICY IF EXISTS "Admin master profiles" ON public.student_profiles;
    CREATE POLICY "Admin master profiles" ON public.student_profiles FOR ALL TO authenticated USING (public.check_is_admin());
    
    DROP POLICY IF EXISTS "Admin master colleges" ON public.colleges;
    CREATE POLICY "Admin master colleges" ON public.colleges FOR ALL TO authenticated USING (public.check_is_admin());
    
    DROP POLICY IF EXISTS "Admin master notifications" ON public.notifications;
    CREATE POLICY "Admin master notifications" ON public.notifications FOR ALL TO authenticated USING (public.check_is_admin());
    
    DROP POLICY IF EXISTS "Admin master internships" ON public.internships;
    CREATE POLICY "Admin master internships" ON public.internships FOR ALL TO authenticated USING (public.check_is_admin());
    
    DROP POLICY IF EXISTS "Admin master events" ON public.events;
    CREATE POLICY "Admin master events" ON public.events FOR ALL TO authenticated USING (public.check_is_admin());
    
    DROP POLICY IF EXISTS "Admin master notes" ON public.notes;
    CREATE POLICY "Admin master notes" ON public.notes FOR ALL TO authenticated USING (public.check_is_admin());
    
    DROP POLICY IF EXISTS "Admin master attendance" ON public.attendance;
    CREATE POLICY "Admin master attendance" ON public.attendance FOR ALL TO authenticated USING (public.check_is_admin());
END $$;

-- ==========================================
-- 11. REALTIME REPLICATION
-- ==========================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.notifications, 
    public.events, 
    public.internships, 
    public.student_profiles,
    public.attendance,
    public.colleges;
COMMIT;
