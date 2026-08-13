-- 0. Cleanup existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Admins have full access on student_profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Admins have full access on users" ON public.users;
DROP POLICY IF EXISTS "Admins have full access on internships" ON public.internships;
DROP POLICY IF EXISTS "Admins have full access on notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins have full access on attendance" ON public.attendance;
DROP POLICY IF EXISTS "Admins have full access on notes" ON public.notes;
DROP POLICY IF EXISTS "Admins have full access on timetable" ON public.timetable;
DROP POLICY IF EXISTS "Admins have full access on colleges" ON public.colleges;
DROP POLICY IF EXISTS "Admins have full access on events" ON public.events;

DROP POLICY IF EXISTS "Students can view their own profile" ON public.student_profiles;
DROP POLICY IF EXISTS "Students can view all internships" ON public.internships;
DROP POLICY IF EXISTS "Students can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Students can view all notes" ON public.notes;
DROP POLICY IF EXISTS "Students can view all colleges" ON public.colleges;
DROP POLICY IF EXISTS "Students can view all events" ON public.events;
DROP POLICY IF EXISTS "Students can view all timetables" ON public.timetable;
DROP POLICY IF EXISTS "Students can view their own attendance" ON public.attendance;

-- 1. Grant base permissions to authenticated users
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.student_profiles TO authenticated;
GRANT ALL ON public.internships TO authenticated;
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.attendance TO authenticated;
GRANT ALL ON public.notes TO authenticated;
GRANT ALL ON public.timetable TO authenticated;
GRANT ALL ON public.colleges TO authenticated;
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.issues TO authenticated;
GRANT ALL ON public.tasks TO authenticated;
GRANT ALL ON public.applications TO authenticated;

-- 2. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 3. Create a Security Definer function to check admin role
-- This avoids the "Infinite Recursion" error by bypassing RLS during the check.
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (role = 'admin')
    FROM public.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create "Full Access for Admins" Policies
-- Using the helper function to prevent recursion.

CREATE POLICY "Admins have full access on student_profiles" 
ON public.student_profiles FOR ALL 
USING ( public.check_is_admin() );

CREATE POLICY "Admins have full access on users" 
ON public.users FOR ALL 
USING ( public.check_is_admin() OR auth.uid() = id );

CREATE POLICY "Admins have full access on internships" 
ON public.internships FOR ALL 
USING ( public.check_is_admin() );

CREATE POLICY "Admins have full access on notifications" 
ON public.notifications FOR ALL 
USING ( public.check_is_admin() );

CREATE POLICY "Admins have full access on attendance" 
ON public.attendance FOR ALL 
USING ( public.check_is_admin() );

CREATE POLICY "Admins have full access on notes" 
ON public.notes FOR ALL 
USING ( public.check_is_admin() );

CREATE POLICY "Admins have full access on timetable" 
ON public.timetable FOR ALL 
USING ( public.check_is_admin() );

CREATE POLICY "Admins have full access on colleges" 
ON public.colleges FOR ALL 
USING ( public.check_is_admin() );

CREATE POLICY "Admins have full access on events" 
ON public.events FOR ALL 
USING ( public.check_is_admin() );

-- 5. Create "Student View" Policies (Basic Read Access)

CREATE POLICY "Students can view their own profile" 
ON public.student_profiles FOR SELECT 
USING ( auth.uid() = user_id );

CREATE POLICY "Students can view all internships" 
ON public.internships FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Students can view their own notifications" 
ON public.notifications FOR SELECT 
USING ( auth.uid() = user_id OR user_id IS NULL );

CREATE POLICY "Students can view all notes" 
ON public.notes FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Students can view all colleges" 
ON public.colleges FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Students can view all events" 
ON public.events FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Students can view all timetables" 
ON public.timetable FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Students can view their own attendance" 
ON public.attendance FOR SELECT 
USING ( auth.uid() = user_id );

-- 5. Helper for sequence permissions (if using serial IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
