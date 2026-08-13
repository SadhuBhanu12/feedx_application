-- ==========================================
-- FeedX Production Migration — Phase 0
-- Run on EXISTING Supabase project to add missing columns/tables
-- Safe: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS
-- ==========================================

-- 1. Issues table: add missing columns for attachments and anonymous mode
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}';
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- 2. College notices table (new)
CREATE TABLE IF NOT EXISTS public.college_notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT,
    type TEXT DEFAULT 'notice',
    attachment_url TEXT,
    published_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Feature waitlist table (may be missing)
CREATE TABLE IF NOT EXISTS public.feature_waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feature_key)
);

-- 4. Issue timeline table (may be missing)
CREATE TABLE IF NOT EXISTS public.issue_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Notification reads table (may be missing)
CREATE TABLE IF NOT EXISTS public.notification_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, notification_id)
);

-- 6. Opportunity applications table (may be missing)
CREATE TABLE IF NOT EXISTS public.opportunity_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'selected', 'withdrawn')),
    cover_letter TEXT,
    resume_url TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(opportunity_id, user_id)
);

-- 7. Event registrations table (may be missing)
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'waitlist')),
    qr_token TEXT,
    certificate_url TEXT,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- 8. Bookmarks table (may be missing)
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_id)
);

-- 9. Community links table (may be missing)
CREATE TABLE IF NOT EXISTS public.community_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    members TEXT,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Activity logs table (may be missing)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- RLS for new tables
-- ==========================================

ALTER TABLE public.college_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Safe policy creation (drop if exists pattern)
DO $$ BEGIN
  -- College notices
  DROP POLICY IF EXISTS "Admin master college_notices" ON public.college_notices;
  CREATE POLICY "Admin master college_notices" ON public.college_notices FOR ALL TO authenticated USING (public.check_is_admin());
  DROP POLICY IF EXISTS "Read college_notices all" ON public.college_notices;
  CREATE POLICY "Read college_notices all" ON public.college_notices FOR SELECT TO authenticated USING (TRUE);

  -- Activity logs
  DROP POLICY IF EXISTS "Admin master activity_logs" ON public.activity_logs;
  CREATE POLICY "Admin master activity_logs" ON public.activity_logs FOR ALL TO authenticated USING (public.check_is_admin());
END $$;

-- ==========================================
-- Realtime: add new tables to publication
-- ==========================================

DO $$
DECLARE
  tbl text;
  tables text[] := array[
    'event_registrations',
    'community_links',
    'college_notices',
    'bookmarks'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    IF to_regclass('public.' || tbl) IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = tbl
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl);
    END IF;
  END LOOP;
END $$;

-- ==========================================
-- Storage buckets
-- ==========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile-photos', 'profile-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('uploads', 'uploads', true, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('support-attachments', 'support-attachments', true, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
  ('certificates', 'certificates', true, 5242880, ARRAY['application/pdf', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Users upload own profile photo"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own profile photo"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public read profile photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users upload own support attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'support-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated read support attachments"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'support-attachments');

CREATE POLICY "Public read uploads"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'uploads');

CREATE POLICY "Public read certificates"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'certificates');
