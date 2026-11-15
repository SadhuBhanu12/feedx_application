-- ==============================================================================
-- FEEDX — COLLEGE ADMIN PANEL MASTER SYNC & REPAIR MIGRATION
-- ==============================================================================
-- Fixes:
-- 1. College data isolation, public read access, and sync between users and students
-- 2. Grievance escalation and college desk linkage on public.issues
-- 3. Campus event registration & certification settings
-- 4. Cross-panel college assignment consistency
-- ==============================================================================

-- 1. Ensure public.colleges has all required fields and public read access
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS nirf_rank INTEGER;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS annual_fee NUMERIC;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS active_students INTEGER DEFAULT 0;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS principal_name TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS website TEXT;

-- Enable RLS and add public read policy on colleges
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all users to read colleges" ON public.colleges;
CREATE POLICY "Allow all users to read colleges"
ON public.colleges FOR SELECT
TO authenticated, anon
USING (true);

-- 2. Seed Government Institute of Electronics if missing
INSERT INTO public.colleges (
    id,
    college_name,
    college_code,
    location,
    type,
    created_at
) VALUES (
    '6dd12d63-e276-4ff8-8e58-bcd2cc878626',
    'Government Institute of Electronics',
    'GIE01',
    'Secunderabad, Telangana',
    'Polytechnic',
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    college_name = EXCLUDED.college_name,
    location = EXCLUDED.location;

-- 3. Synchronize college_id between public.students and public.users
UPDATE public.users u
SET college_id = s.college_id
FROM public.students s
WHERE u.id = s.id 
  AND u.college_id IS NULL 
  AND s.college_id IS NOT NULL;

UPDATE public.students s
SET college_id = u.college_id
FROM public.users u
WHERE s.id = u.id 
  AND s.college_id IS NULL 
  AND u.college_id IS NOT NULL;

-- 4. Ensure public.admins has institution_id synced with users.college_id
UPDATE public.admins a
SET institution_id = u.college_id
FROM public.users u
WHERE a.id = u.id 
  AND a.institution_id IS NULL 
  AND u.college_id IS NOT NULL;

UPDATE public.users u
SET college_id = a.institution_id
FROM public.admins a
WHERE u.id = a.id 
  AND u.college_id IS NULL 
  AND a.institution_id IS NOT NULL;

-- 5. Ensure public.issues has all grievance escalation columns
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL;
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS triage_status TEXT DEFAULT 'pending_review';
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium';
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS response TEXT;
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Sync college_id on issues from the student who created it if college_id is null
UPDATE public.issues i
SET college_id = s.college_id
FROM public.students s
WHERE i.user_id = s.id 
  AND i.college_id IS NULL 
  AND s.college_id IS NOT NULL;

UPDATE public.issues i
SET college_id = u.college_id
FROM public.users u
WHERE i.user_id = u.id 
  AND i.college_id IS NULL 
  AND u.college_id IS NOT NULL;

-- Index for instant college desk queries
CREATE INDEX IF NOT EXISTS idx_issues_college_id ON public.issues(college_id);
CREATE INDEX IF NOT EXISTS idx_issues_triage_status ON public.issues(triage_status);
CREATE INDEX IF NOT EXISTS idx_users_college_id ON public.users(college_id);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON public.students(college_id);

-- 6. Ensure public.events has Campus Events Registration & Certification columns
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT FALSE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS certificate_available BOOLEAN DEFAULT FALSE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS eligibility TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_name TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_source TEXT DEFAULT 'feedx';

-- 7. College Dashboard Stats RPC (Safe, fast, immune to client column name mismatches)
CREATE OR REPLACE FUNCTION public.get_college_dashboard_stats(p_college_id UUID)
RETURNS JSON AS $$
DECLARE
    v_active_students INTEGER := 0;
    v_total_grievances INTEGER := 0;
    v_pending_grievances INTEGER := 0;
    v_review_grievances INTEGER := 0;
    v_resolved_grievances INTEGER := 0;
    v_total_notifications INTEGER := 0;
    v_total_resources INTEGER := 0;
    v_total_events INTEGER := 0;
BEGIN
    -- 1. Active students count
    SELECT COUNT(DISTINCT id) INTO v_active_students
    FROM public.students
    WHERE college_id = p_college_id;

    IF v_active_students = 0 THEN
        SELECT COUNT(DISTINCT id) INTO v_active_students
        FROM public.users
        WHERE college_id = p_college_id AND role = 'student';
    END IF;

    -- 2. Grievances breakdown
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COUNT(*) FILTER (WHERE status IN ('in_progress', 'under_review')),
        COUNT(*) FILTER (WHERE status = 'resolved')
    INTO 
        v_total_grievances,
        v_pending_grievances,
        v_review_grievances,
        v_resolved_grievances
    FROM public.issues
    WHERE college_id = p_college_id;

    -- 3. Notifications count
    SELECT COUNT(*) INTO v_total_notifications
    FROM public.notifications
    WHERE target_college = p_college_id::text OR user_id IS NULL;

    -- 4. Resources count
    SELECT COUNT(*) INTO v_total_resources
    FROM public.resources
    WHERE college_id = p_college_id OR college_id IS NULL;

    -- 5. Events count
    SELECT COUNT(*) INTO v_total_events
    FROM public.events
    WHERE college_id = p_college_id;

    RETURN json_build_object(
        'active_students', v_active_students,
        'total_grievances', v_total_grievances,
        'pending_grievances', v_pending_grievances,
        'review_grievances', v_review_grievances,
        'resolved_grievances', v_resolved_grievances,
        'notifications', v_total_notifications,
        'resources', v_total_resources,
        'events', v_total_events
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
