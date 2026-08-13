-- Migration to add extra student identity & college details columns to public.innovations table
ALTER TABLE public.innovations ADD COLUMN IF NOT EXISTS feedx_id TEXT;
ALTER TABLE public.innovations ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.innovations ADD COLUMN IF NOT EXISTS author_email TEXT;
ALTER TABLE public.innovations ADD COLUMN IF NOT EXISTS college_name TEXT;
ALTER TABLE public.innovations ADD COLUMN IF NOT EXISTS branch TEXT;
ALTER TABLE public.innovations ADD COLUMN IF NOT EXISTS year TEXT;

-- Ensure RLS policies permit authenticated inserts and reads
DROP POLICY IF EXISTS "Read innovations all" ON public.innovations;
CREATE POLICY "Read innovations all" ON public.innovations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insert innovations auth" ON public.innovations;
CREATE POLICY "Insert innovations auth" ON public.innovations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Update innovations auth" ON public.innovations;
CREATE POLICY "Update innovations auth" ON public.innovations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Delete innovations auth" ON public.innovations;
CREATE POLICY "Delete innovations auth" ON public.innovations FOR DELETE USING (true);
