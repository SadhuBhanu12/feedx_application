-- ==========================================
-- FIX SUPPORT SUGGESTIONS & FEEDBACKS RLS POLICIES & PERMISSIONS
-- ==========================================

-- 1. Grant table permissions to authenticated users and service_role
GRANT ALL ON public.support_suggestions TO authenticated;
GRANT ALL ON public.support_suggestions TO service_role;

GRANT ALL ON public.support_feedbacks TO authenticated;
GRANT ALL ON public.support_feedbacks TO service_role;

-- 2. Ensure RLS is enabled
ALTER TABLE public.support_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_feedbacks ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to prevent duplication error
DROP POLICY IF EXISTS "Student insert own support suggestions" ON public.support_suggestions;
DROP POLICY IF EXISTS "Student read own support suggestions" ON public.support_suggestions;
DROP POLICY IF EXISTS "Admin master support_suggestions" ON public.support_suggestions;

DROP POLICY IF EXISTS "Student insert own support feedbacks" ON public.support_feedbacks;
DROP POLICY IF EXISTS "Student read own support feedbacks" ON public.support_feedbacks;
DROP POLICY IF EXISTS "Admin master support_feedbacks" ON public.support_feedbacks;

-- 4. Create complete RLS policies for support_suggestions
CREATE POLICY "Student insert own support suggestions" 
ON public.support_suggestions FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Student read own support suggestions" 
ON public.support_suggestions FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Admin master support_suggestions" 
ON public.support_suggestions FOR ALL 
TO authenticated 
USING (public.check_is_admin());

-- 5. Create complete RLS policies for support_feedbacks
CREATE POLICY "Student insert own support feedbacks" 
ON public.support_feedbacks FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Student read own support feedbacks" 
ON public.support_feedbacks FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Admin master support_feedbacks" 
ON public.support_feedbacks FOR ALL 
TO authenticated 
USING (public.check_is_admin());

-- 6. Enable Realtime Replication for Suggestions and Feedbacks
BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.support_suggestions;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.support_feedbacks;
EXCEPTION WHEN OTHERS THEN
  -- If publication doesn't exist or table already in publication, ignore
END;
COMMIT;
