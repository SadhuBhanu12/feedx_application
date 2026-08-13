-- 1. Grant basic DML privileges on all community tables to authenticated users
GRANT ALL ON public.community_posts TO authenticated, anon, service_role;
GRANT ALL ON public.community_likes TO authenticated, anon, service_role;
GRANT ALL ON public.community_comments TO authenticated, anon, service_role;
GRANT ALL ON public.community_shares TO authenticated, anon, service_role;

-- 2. Enable RLS on community_posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- 3. Recreate policies to allow student publishing and updating
DROP POLICY IF EXISTS "Read community_posts all" ON public.community_posts;
CREATE POLICY "Read community_posts all" ON public.community_posts
    FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert community_posts" ON public.community_posts;
CREATE POLICY "Authenticated users can insert community_posts" ON public.community_posts
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own community_posts" ON public.community_posts;
CREATE POLICY "Users can update own community_posts" ON public.community_posts
    FOR UPDATE TO authenticated USING (auth.uid() = created_by OR public.check_is_admin());

DROP POLICY IF EXISTS "Users can delete own community_posts" ON public.community_posts;
CREATE POLICY "Users can delete own community_posts" ON public.community_posts
    FOR DELETE TO authenticated USING (auth.uid() = created_by OR public.check_is_admin());

-- Re-grant RLS policies for likes and comments to be safe
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read community_likes all" ON public.community_likes;
CREATE POLICY "Read community_likes all" ON public.community_likes
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students insert community_likes" ON public.community_likes;
CREATE POLICY "Students insert community_likes" ON public.community_likes
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students delete own community_likes" ON public.community_likes;
CREATE POLICY "Students delete own community_likes" ON public.community_likes
    FOR DELETE TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Read community_comments all" ON public.community_comments;
CREATE POLICY "Read community_comments all" ON public.community_comments
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students insert community_comments" ON public.community_comments;
CREATE POLICY "Students insert community_comments" ON public.community_comments
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
