-- 1. Ensure the issues table exists with correct public user mapping
CREATE TABLE IF NOT EXISTS public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);
-- 2. Add year column to students if missing
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS year INTEGER DEFAULT 1;

-- 3. Grant permissions
GRANT ALL ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;

-- 2.5 Fix foreign key if it points to auth.users (to allow schema joining)
ALTER TABLE public.issues DROP CONSTRAINT IF EXISTS issues_user_id_fkey;
ALTER TABLE public.issues ADD CONSTRAINT issues_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 3. Update global admin check function
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

-- 4. Drop old policies
DROP POLICY IF EXISTS "Students can create issues" ON public.issues;
DROP POLICY IF EXISTS "Students can view own issues" ON public.issues;
DROP POLICY IF EXISTS "Admins have full access on issues" ON public.issues;

-- 5. Create new robust policies
CREATE POLICY "Students can create issues"
ON public.issues FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view own issues"
ON public.issues FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.check_is_admin());

CREATE POLICY "Admins have full access on issues"
ON public.issues FOR ALL
TO authenticated
USING (public.check_is_admin());
-- 6. Enable Realtime Replication for Issues
BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;
EXCEPTION WHEN OTHERS THEN
  -- If publication doesn't exist or table already in, ignore
END;
COMMIT;
