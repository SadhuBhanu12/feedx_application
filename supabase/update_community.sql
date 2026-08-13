-- Update community_posts to support new features
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS media_urls JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS hashtags TEXT[] DEFAULT '{}';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS tagged_colleges TEXT[] DEFAULT '{}';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS tagged_branches TEXT[] DEFAULT '{}';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;
ALTER TABLE public.community_posts DROP COLUMN IF EXISTS video_url;
