-- ==============================================================
-- FEEDX COMMUNITY REDESIGN DATABASE MIGRATION
-- ==============================================================

-- 1. Create storage bucket 'community-images1' if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('community-images1', 'community-images1', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Drop legacy tables to start fresh with new architecture
DROP TABLE IF EXISTS public.community_shares CASCADE;
DROP TABLE IF EXISTS public.community_comments CASCADE;
DROP TABLE IF EXISTS public.community_likes CASCADE;
DROP TABLE IF EXISTS public.community_posts CASCADE;

-- 2. Create community_posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    caption TEXT NOT NULL,
    image_url TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active', -- active, archived, pinned
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    visibility TEXT DEFAULT 'public' -- public, private
);

-- 3. Create community_likes table
CREATE TABLE IF NOT EXISTS public.community_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, student_id)
);

-- 4. Create community_comments table
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create community_shares table
CREATE TABLE IF NOT EXISTS public.community_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    shared_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_likes_post_student ON public.community_likes(post_id, student_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);

-- 7. Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_shares ENABLE ROW LEVEL SECURITY;

-- 8. Table RLS Policies
-- community_posts policies
DROP POLICY IF EXISTS "Read community_posts all" ON public.community_posts;
CREATE POLICY "Read community_posts all" ON public.community_posts
    FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "SuperAdmin write community_posts" ON public.community_posts;
CREATE POLICY "SuperAdmin write community_posts" ON public.community_posts
    FOR ALL TO authenticated
    USING (public.check_is_super_admin())
    WITH CHECK (public.check_is_super_admin());

-- community_likes policies
DROP POLICY IF EXISTS "Read community_likes all" ON public.community_likes;
CREATE POLICY "Read community_likes all" ON public.community_likes
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students insert community_likes" ON public.community_likes;
CREATE POLICY "Students insert community_likes" ON public.community_likes
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students delete own community_likes" ON public.community_likes;
CREATE POLICY "Students delete own community_likes" ON public.community_likes
    FOR DELETE TO authenticated USING (auth.uid() = student_id);

-- community_comments policies
DROP POLICY IF EXISTS "Read community_comments all" ON public.community_comments;
CREATE POLICY "Read community_comments all" ON public.community_comments
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students insert community_comments" ON public.community_comments;
CREATE POLICY "Students insert community_comments" ON public.community_comments
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

-- community_shares policies
DROP POLICY IF EXISTS "Read community_shares all" ON public.community_shares;
CREATE POLICY "Read community_shares all" ON public.community_shares
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students insert community_shares" ON public.community_shares;
CREATE POLICY "Students insert community_shares" ON public.community_shares
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

-- 9. Storage RLS Policies for 'community-images1' bucket
DROP POLICY IF EXISTS "Public read community-images1" ON storage.objects;
CREATE POLICY "Public read community-images1" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'community-images1');

DROP POLICY IF EXISTS "SuperAdmin upload community-images1" ON storage.objects;
CREATE POLICY "SuperAdmin upload community-images1" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'community-images1' AND 
        public.check_is_super_admin()
    );

DROP POLICY IF EXISTS "SuperAdmin update community-images1" ON storage.objects;
CREATE POLICY "SuperAdmin update community-images1" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'community-images1' AND 
        public.check_is_super_admin()
    );

DROP POLICY IF EXISTS "SuperAdmin delete community-images1" ON storage.objects;
CREATE POLICY "SuperAdmin delete community-images1" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'community-images1' AND 
        public.check_is_super_admin()
    );

-- 10. Grant Privileges
GRANT ALL ON public.community_posts TO authenticated, anon, service_role;
GRANT ALL ON public.community_likes TO authenticated, anon, service_role;
GRANT ALL ON public.community_comments TO authenticated, anon, service_role;
GRANT ALL ON public.community_shares TO authenticated, anon, service_role;
