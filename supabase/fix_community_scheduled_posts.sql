-- ==============================================================================
-- FEEDX COMMUNITY: FIX MISSING SCHEDULED COLUMNS MIGRATION
-- ==============================================================================

-- 1. Ensure scheduled columns exist on community_posts
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_scheduled BOOLEAN DEFAULT FALSE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'active';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- 2. Create index for fast scheduled posts queries
CREATE INDEX IF NOT EXISTS idx_community_posts_scheduled_at ON public.community_posts (scheduled_at) WHERE (is_scheduled IS TRUE);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts (status);

-- 3. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
