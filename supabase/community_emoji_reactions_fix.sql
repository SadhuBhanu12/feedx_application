-- FEEDX — Community Emoji Reactions & Likes Database Fix
-- Ensures reaction_emoji and reaction_counts columns exist with full permissions and realtime sync.

DO $$
BEGIN
    -- 1. Ensure reaction_emoji column exists in community_likes
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='community_likes') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='community_likes' AND column_name='reaction_emoji') THEN
            ALTER TABLE public.community_likes ADD COLUMN reaction_emoji TEXT DEFAULT '❤️';
        END IF;
    END IF;

    -- 2. Ensure reaction_counts JSONB column exists in community_posts
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='community_posts') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='community_posts' AND column_name='reaction_counts') THEN
            ALTER TABLE public.community_posts ADD COLUMN reaction_counts JSONB DEFAULT '{}'::jsonb;
        END IF;
    END IF;
END $$;

-- 3. Ensure permissions and RLS policies allow students to read, insert, update and delete reactions
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read community_likes all" ON public.community_likes;
CREATE POLICY "Read community_likes all" ON public.community_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insert community_likes auth" ON public.community_likes;
CREATE POLICY "Insert community_likes auth" ON public.community_likes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Update community_likes auth" ON public.community_likes;
CREATE POLICY "Update community_likes auth" ON public.community_likes FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Delete community_likes auth" ON public.community_likes;
CREATE POLICY "Delete community_likes auth" ON public.community_likes FOR DELETE USING (true);

GRANT ALL ON public.community_likes TO authenticated, anon, service_role;
