-- ==========================================
-- FeedX Production Migration — Phase 0 v2
-- Incremental updates for 3-tier roles & Super Admin Support Triage Pipeline
-- Safe: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS
-- ==========================================

-- 1. Extend issues table
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE;
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS triage_status TEXT DEFAULT 'pending_review';
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS affected_count INTEGER DEFAULT 1;
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS merged_into_id UUID REFERENCES public.issues(id) ON DELETE SET NULL;
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}';
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- 2. Issue Votes table
CREATE TABLE IF NOT EXISTS public.issue_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(issue_id, user_id)
);

-- 3. Check Super Admin helper function
CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS for Issue Votes
ALTER TABLE public.issue_votes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admin master issue_votes" ON public.issue_votes;
  CREATE POLICY "Admin master issue_votes" ON public.issue_votes FOR ALL TO authenticated USING (public.check_is_admin());

  DROP POLICY IF EXISTS "Student vote on support issues" ON public.issue_votes;
  CREATE POLICY "Student vote on support issues" ON public.issue_votes FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

  DROP POLICY IF EXISTS "Student read own support issues" ON public.issues;
  CREATE POLICY "Student read own support issues" ON public.issues FOR SELECT TO authenticated USING (user_id = auth.uid() OR triage_status = 'approved');
END $$;
