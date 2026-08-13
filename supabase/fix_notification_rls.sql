-- 1. Redefine is_admin() helper function to support all administrative roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND (role = 'admin' OR role = 'super_admin' OR role = 'inst_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Redefine check_is_admin() helper function to support all administrative roles
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

-- 3. Audit RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. Recreate Policies to ensure correctness
DROP POLICY IF EXISTS "Admins have full access on notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications-admin-write" ON public.notifications;
DROP POLICY IF EXISTS "Students can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications-own-read" ON public.notifications;

-- Admin Full Access Policy
CREATE POLICY "Admins have full access on notifications" 
ON public.notifications FOR ALL 
USING ( public.check_is_admin() )
WITH CHECK ( public.check_is_admin() );

-- Student Selective Read Access Policy
CREATE POLICY "Students can view their own notifications" 
ON public.notifications FOR SELECT 
USING ( auth.uid() = user_id OR user_id IS NULL );
