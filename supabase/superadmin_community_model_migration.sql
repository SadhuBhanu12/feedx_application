-- ==============================================================================
-- FEEDX COMMUNITY: SUPERADMIN PUBLISHING MODEL & RLS POLICIES (BULLETPROOF MIGRATION)
-- ==============================================================================

-- 1. Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID,
    title VARCHAR(255) NOT NULL,
    caption TEXT,
    description TEXT,
    category VARCHAR(64) DEFAULT 'Announcements',
    post_type VARCHAR(32) DEFAULT 'text',
    image_url TEXT,
    images TEXT[],
    video_url TEXT,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    pinned BOOLEAN DEFAULT FALSE,
    comments_enabled BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure all columns exist on community_posts
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_id UUID;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS category VARCHAR(64) DEFAULT 'Announcements';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS post_type VARCHAR(32) DEFAULT 'text';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS comments_count INT DEFAULT 0;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS comments_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- 2. Community Likes
CREATE TABLE IF NOT EXISTS public.community_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    student_id UUID,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Safely drop old restrictive foreign keys that break on legacy data
ALTER TABLE public.community_likes DROP CONSTRAINT IF EXISTS community_likes_user_id_fkey;
ALTER TABLE public.community_likes DROP CONSTRAINT IF EXISTS community_likes_student_id_fkey;

ALTER TABLE public.community_likes ADD COLUMN IF NOT EXISTS student_id UUID;
ALTER TABLE public.community_likes ADD COLUMN IF NOT EXISTS user_id UUID;

-- Synchronize existing columns
UPDATE public.community_likes SET user_id = student_id WHERE user_id IS NULL AND student_id IS NOT NULL;
UPDATE public.community_likes SET student_id = user_id WHERE student_id IS NULL AND user_id IS NOT NULL;

-- 3. Community Comments (Supports 1-level threaded replies)
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    student_id UUID,
    user_id UUID,
    parent_id UUID,
    comment TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.community_comments DROP CONSTRAINT IF EXISTS community_comments_user_id_fkey;
ALTER TABLE public.community_comments DROP CONSTRAINT IF EXISTS community_comments_student_id_fkey;

ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS student_id UUID;
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS parent_id UUID;
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;

UPDATE public.community_comments SET user_id = student_id WHERE user_id IS NULL AND student_id IS NOT NULL;
UPDATE public.community_comments SET student_id = user_id WHERE student_id IS NULL AND user_id IS NOT NULL;

-- 4. Comment Likes
CREATE TABLE IF NOT EXISTS public.comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    student_id UUID,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.comment_likes DROP CONSTRAINT IF EXISTS comment_likes_user_id_fkey;
ALTER TABLE public.comment_likes DROP CONSTRAINT IF EXISTS comment_likes_student_id_fkey;

ALTER TABLE public.comment_likes ADD COLUMN IF NOT EXISTS student_id UUID;
ALTER TABLE public.comment_likes ADD COLUMN IF NOT EXISTS user_id UUID;

UPDATE public.comment_likes SET user_id = student_id WHERE user_id IS NULL AND student_id IS NOT NULL;
UPDATE public.comment_likes SET student_id = user_id WHERE student_id IS NULL AND user_id IS NOT NULL;

-- 5. Community Saves / Bookmarks
CREATE TABLE IF NOT EXISTS public.community_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID,
    student_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.community_saves DROP CONSTRAINT IF EXISTS community_saves_user_id_fkey;
ALTER TABLE public.community_saves DROP CONSTRAINT IF EXISTS community_saves_student_id_fkey;

ALTER TABLE public.community_saves ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.community_saves ADD COLUMN IF NOT EXISTS student_id UUID;

-- 6. Community Reports
CREATE TABLE IF NOT EXISTS public.community_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID,
    reported_by UUID,
    user_id UUID,
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(32) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.community_reports DROP CONSTRAINT IF EXISTS community_reports_reported_by_fkey;
ALTER TABLE public.community_reports DROP CONSTRAINT IF EXISTS community_reports_user_id_fkey;

ALTER TABLE public.community_reports ADD COLUMN IF NOT EXISTS reported_by UUID;
ALTER TABLE public.community_reports ADD COLUMN IF NOT EXISTS user_id UUID;

-- 7. Community Polls & Votes
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    total_votes INT DEFAULT 0,
    created_by UUID,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
    user_id UUID,
    student_id UUID,
    option_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.poll_votes DROP CONSTRAINT IF EXISTS poll_votes_user_id_fkey;
ALTER TABLE public.poll_votes DROP CONSTRAINT IF EXISTS poll_votes_student_id_fkey;

ALTER TABLE public.poll_votes ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.poll_votes ADD COLUMN IF NOT EXISTS student_id UUID;

UPDATE public.poll_votes SET user_id = student_id WHERE user_id IS NULL AND student_id IS NOT NULL;
UPDATE public.poll_votes SET student_id = user_id WHERE student_id IS NULL AND user_id IS NOT NULL;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Helper to check if caller is superadmin or admin
CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = user_uid AND role IN ('super_admin', 'admin', 'inst_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Community Posts Policies:
DROP POLICY IF EXISTS "Public can view published community posts" ON public.community_posts;
CREATE POLICY "Public can view published community posts" ON public.community_posts
    FOR SELECT USING (is_published = true OR public.is_admin_or_superadmin(auth.uid()));

DROP POLICY IF EXISTS "Only Superadmins can insert community posts" ON public.community_posts;
CREATE POLICY "Only Superadmins can insert community posts" ON public.community_posts
    FOR INSERT WITH CHECK (public.is_admin_or_superadmin(auth.uid()));

DROP POLICY IF EXISTS "Only Superadmins can update community posts" ON public.community_posts;
CREATE POLICY "Only Superadmins can update community posts" ON public.community_posts
    FOR UPDATE USING (public.is_admin_or_superadmin(auth.uid()));

DROP POLICY IF EXISTS "Only Superadmins can delete community posts" ON public.community_posts;
CREATE POLICY "Only Superadmins can delete community posts" ON public.community_posts
    FOR DELETE USING (public.is_admin_or_superadmin(auth.uid()));

-- Community Likes Policies:
DROP POLICY IF EXISTS "Users can view likes" ON public.community_likes;
CREATE POLICY "Users can view likes" ON public.community_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own like" ON public.community_likes;
CREATE POLICY "Users can insert own like" ON public.community_likes 
    FOR INSERT WITH CHECK (auth.uid() = COALESCE(student_id, user_id));

DROP POLICY IF EXISTS "Users can delete own like" ON public.community_likes;
CREATE POLICY "Users can delete own like" ON public.community_likes 
    FOR DELETE USING (auth.uid() = COALESCE(student_id, user_id));

-- Community Comments Policies:
DROP POLICY IF EXISTS "Users can view comments" ON public.community_comments;
CREATE POLICY "Users can view comments" ON public.community_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert own comments" ON public.community_comments;
CREATE POLICY "Authenticated users can insert own comments" ON public.community_comments 
    FOR INSERT WITH CHECK (auth.uid() = COALESCE(student_id, user_id));

DROP POLICY IF EXISTS "Users can delete own comments or superadmin can delete" ON public.community_comments;
CREATE POLICY "Users can delete own comments or superadmin can delete" ON public.community_comments 
    FOR DELETE USING (auth.uid() = COALESCE(student_id, user_id) OR public.is_admin_or_superadmin(auth.uid()));

-- Comment Likes Policies:
DROP POLICY IF EXISTS "Users can view comment likes" ON public.comment_likes;
CREATE POLICY "Users can view comment likes" ON public.comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own comment like" ON public.comment_likes;
CREATE POLICY "Users can insert own comment like" ON public.comment_likes 
    FOR INSERT WITH CHECK (auth.uid() = COALESCE(student_id, user_id));

DROP POLICY IF EXISTS "Users can delete own comment like" ON public.comment_likes;
CREATE POLICY "Users can delete own comment like" ON public.comment_likes 
    FOR DELETE USING (auth.uid() = COALESCE(student_id, user_id));

-- Community Saves Policies:
DROP POLICY IF EXISTS "Users can view own saves" ON public.community_saves;
CREATE POLICY "Users can view own saves" ON public.community_saves 
    FOR SELECT USING (auth.uid() = COALESCE(user_id, student_id));

DROP POLICY IF EXISTS "Users can insert own saves" ON public.community_saves;
CREATE POLICY "Users can insert own saves" ON public.community_saves 
    FOR INSERT WITH CHECK (auth.uid() = COALESCE(user_id, student_id));

DROP POLICY IF EXISTS "Users can delete own saves" ON public.community_saves;
CREATE POLICY "Users can delete own saves" ON public.community_saves 
    FOR DELETE USING (auth.uid() = COALESCE(user_id, student_id));

-- Community Reports Policies:
DROP POLICY IF EXISTS "Users can insert reports" ON public.community_reports;
CREATE POLICY "Users can insert reports" ON public.community_reports 
    FOR INSERT WITH CHECK (auth.uid() = COALESCE(reported_by, user_id));

DROP POLICY IF EXISTS "Superadmins can view reports" ON public.community_reports;
CREATE POLICY "Superadmins can view reports" ON public.community_reports 
    FOR SELECT USING (public.is_admin_or_superadmin(auth.uid()));

-- Polls & Poll Votes Policies:
DROP POLICY IF EXISTS "Users can view polls" ON public.polls;
CREATE POLICY "Users can view polls" ON public.polls FOR SELECT USING (true);

DROP POLICY IF EXISTS "Superadmins can manage polls" ON public.polls;
CREATE POLICY "Superadmins can manage polls" ON public.polls 
    FOR ALL USING (public.is_admin_or_superadmin(auth.uid()));

DROP POLICY IF EXISTS "Users can view poll votes" ON public.poll_votes;
CREATE POLICY "Users can view poll votes" ON public.poll_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert own poll vote" ON public.poll_votes;
CREATE POLICY "Authenticated users can insert own poll vote" ON public.poll_votes 
    FOR INSERT WITH CHECK (auth.uid() = COALESCE(user_id, student_id));
