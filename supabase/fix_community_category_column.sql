-- ==============================================================
-- FIX MISSING COLUMNS IN PUBLIC.COMMUNITY_POSTS
-- Run this script in your Supabase SQL Editor if you want to support
-- post categories, drive URLs, tags, pinned, and featured posts.
-- ==============================================================

ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS drive_url TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT false;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Create index on category for fast filtering
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
