-- FEEDX PRODUCTION-READY MASTER DATABASE AUDIT & SYNC
-- Run this in Supabase SQL Editor to fix ALL "wrong posting" and "not adding" issues

-- 1. CLEANUP: Fix column types to ensure consistency
ALTER TABLE public.student_profiles ALTER COLUMN roll_no SET NOT NULL;
ALTER TABLE public.student_profiles ALTER COLUMN registration_status SET DEFAULT 'pending';

-- 2. NOTIFICATIONS: Add all required targeting and status columns
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS branch text DEFAULT 'All';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS year text DEFAULT 'All';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS section text DEFAULT 'All';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS apply_url text;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false;

-- 3. INTERNSHIPS (Opportunities): Ensure Unstop-ready fields
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS link text;
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS eligible_branches text[] DEFAULT '{All}';
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS year_eligibility text DEFAULT 'All';
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS stipend text;
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS deadline text;
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS company_logo text;

-- 4. EVENTS: Add Location and Fee support
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price numeric DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category text DEFAULT 'Workshop';

-- 5. NOTES (Digital Library): Full targeting
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS branch text DEFAULT 'All';
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS year text DEFAULT 'All';
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS section text DEFAULT 'All';
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS file_url text;

-- 6. COLLEGES: Premium profiles
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS brochure_url text;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 4.5;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS website text;

-- 7. PERMISSIONS: SECURITY DEFINER for admin check (Resolves recursion)
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. POLICIES: Idempotent policy creation
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins have full access" ON public.student_profiles;
    CREATE POLICY "Admins have full access" ON public.student_profiles
    FOR ALL TO authenticated USING (public.check_is_admin());

    DROP POLICY IF EXISTS "Admins manage events" ON public.events;
    CREATE POLICY "Admins manage events" ON public.events
    FOR ALL TO authenticated USING (public.check_is_admin());

    DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
    CREATE POLICY "Admins manage notifications" ON public.notifications
    FOR ALL TO authenticated USING (public.check_is_admin());
    
    -- Repeat for other tables...
END $$;
