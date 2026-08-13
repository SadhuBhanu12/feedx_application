-- 1. Add missing UI and logic columns to the opportunities table
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS company_logo TEXT;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS eligible_years TEXT[] DEFAULT '{"All"}';
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL;

-- 2. Grant table privileges to authenticated and anon users
GRANT ALL ON public.opportunities TO authenticated, anon, service_role;

-- 3. Confirm RLS configuration
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read opportunities all" ON public.opportunities;
CREATE POLICY "Read opportunities all" ON public.opportunities
    FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "Admin master opportunities" ON public.opportunities;
CREATE POLICY "Admin master opportunities" ON public.opportunities
    FOR ALL TO authenticated USING (public.check_is_admin());
