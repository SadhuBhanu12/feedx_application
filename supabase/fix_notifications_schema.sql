-- Add required columns to notifications table for event triggers
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS branch TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE;

-- Also rename target_branch to branch if it exists but branch does not
-- Note: the above ADD COLUMN IF NOT EXISTS is safer.

NOTIFY pgrst, 'reload schema';
