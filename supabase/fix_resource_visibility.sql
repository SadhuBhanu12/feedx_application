-- Decouple Resources: Strip unnecessary columns and simplify RLS policies
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 1. Drop all branch, college, and academic columns from resources
ALTER TABLE public.resources DROP COLUMN IF EXISTS college_id CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS branch_id CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS academic_year_id CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS subject_id CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS subject CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS branch CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS year CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS section CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS regulation CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS semester CASCADE;
ALTER TABLE public.resources DROP COLUMN IF EXISTS resource_type CASCADE;

-- 2. Clean up old RLS policies
DROP POLICY IF EXISTS "Anyone can view resources" ON public.resources;
DROP POLICY IF EXISTS "Students view college resources" ON public.resources;
DROP POLICY IF EXISTS "Read resources all" ON public.resources;
DROP POLICY IF EXISTS "Read resources all authenticated" ON public.resources;
DROP POLICY IF EXISTS "Admin master resources" ON public.resources;

-- 3. Create simple global RLS policies
-- Allow all authenticated users to read resources (now completely global)
CREATE POLICY "Read resources all authenticated" ON public.resources
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to perform all operations
CREATE POLICY "Admin master resources" ON public.resources
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- PERFORMANCE INDEXES (FOR ENTERPRISE SPEED & SCALING)
-- ==========================================

-- Resources Table Indexes
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_title ON public.resources(title);

-- Community Posts Table Indexes (Fast Feed Loading)
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.community_posts(created_by);

-- Community Comments Indexes (Fast Comment Fetching)
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.community_comments(post_id);

-- Community Likes Indexes (Fast Likes Checking)
CREATE INDEX IF NOT EXISTS idx_likes_post_user ON public.community_likes(post_id, student_id);

-- Event Registrations Indexes (Fast QR & Checking)
CREATE INDEX IF NOT EXISTS idx_registrations_event_user ON public.event_registrations(event_id, user_id);

-- Attendance Table Indexes (Fast Dashboard Analytics)
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id);

-- Notifications Indexes (Fast Broadcast Loading)
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ==========================================
-- PROFILE SOCIAL LINKS (LINKEDIN & GITHUB)
-- ==========================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- ==========================================
-- CREATE MISSING COLLEGE GALLERY TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.college_gallery (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references public.colleges(id) on delete cascade,
  image_url text not null,
  created_at timestamp default now()
);
ALTER TABLE public.college_gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to college_gallery" ON public.college_gallery;
CREATE POLICY "Allow public read access to college_gallery" ON public.college_gallery FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow public read access to college_gallery_auth" ON public.college_gallery;
CREATE POLICY "Allow public read access to college_gallery_auth" ON public.college_gallery FOR SELECT TO authenticated USING (true);

-- ==========================================
-- INNOVATION HUB POLICIES (RLS BYPASS/OPEN FOR TESTING)
-- ==========================================
ALTER TABLE public.innovations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read innovations all" ON public.innovations;
CREATE POLICY "Read innovations all" ON public.innovations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert innovations auth" ON public.innovations;
CREATE POLICY "Insert innovations auth" ON public.innovations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Update innovations auth" ON public.innovations;
CREATE POLICY "Update innovations auth" ON public.innovations FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Delete innovations auth" ON public.innovations;
CREATE POLICY "Delete innovations auth" ON public.innovations FOR DELETE USING (true);

-- ==========================================
-- ADMINS TABLE POLICIES (FIX INFINITE RECURSION)
-- ==========================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin master admins" ON public.admins;
DROP POLICY IF EXISTS "Allow select for authenticated" ON public.admins;
CREATE POLICY "Allow select for authenticated" ON public.admins FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow all for super admin" ON public.admins;
CREATE POLICY "Allow all for super admin" ON public.admins FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- COMMUNITY STORAGE BUCKET & POLICIES
-- ==========================================
-- Ensure community-images1 bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('community-images1', 'community-images1', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Drop and recreate storage policies
DROP POLICY IF EXISTS "Public read community-images1" ON storage.objects;
CREATE POLICY "Public read community-images1" ON storage.objects FOR SELECT TO public USING (bucket_id = 'community-images1');

DROP POLICY IF EXISTS "Admin upload community-images1" ON storage.objects;
CREATE POLICY "Admin upload community-images1" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'community-images1');

DROP POLICY IF EXISTS "Admin update community-images1" ON storage.objects;
CREATE POLICY "Admin update community-images1" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'community-images1');

DROP POLICY IF EXISTS "Admin delete community-images1" ON storage.objects;
CREATE POLICY "Admin delete community-images1" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'community-images1');

-- ==========================================
-- COMMUNITY POSTS POLICIES (FIX USER_ID ERROR)
-- ==========================================
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read community_posts all" ON public.community_posts;
DROP POLICY IF EXISTS "Insert community_posts auth" ON public.community_posts;
DROP POLICY IF EXISTS "Update community_posts owner" ON public.community_posts;
DROP POLICY IF EXISTS "Delete community_posts owner" ON public.community_posts;
DROP POLICY IF EXISTS "Authenticated users can insert community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update own community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete own community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "SuperAdmin write community_posts" ON public.community_posts;

CREATE POLICY "Read community_posts all" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Insert community_posts auth" ON public.community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Update community_posts auth" ON public.community_posts FOR UPDATE USING (true);
CREATE POLICY "Delete community_posts auth" ON public.community_posts FOR DELETE USING (true);

-- ==========================================
-- COMMUNITY LIKES POLICIES (FIX USER_ID ERROR)
-- ==========================================
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read community_likes all" ON public.community_likes;
DROP POLICY IF EXISTS "Insert community_likes auth" ON public.community_likes;
DROP POLICY IF EXISTS "Delete community_likes auth" ON public.community_likes;
DROP POLICY IF EXISTS "Students insert community_likes" ON public.community_likes;
DROP POLICY IF EXISTS "Students delete own community_likes" ON public.community_likes;

CREATE POLICY "Read community_likes all" ON public.community_likes FOR SELECT USING (true);
CREATE POLICY "Insert community_likes auth" ON public.community_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Delete community_likes auth" ON public.community_likes FOR DELETE USING (true);

-- ==========================================
-- COMMUNITY COMMENTS POLICIES (FIX USER_ID ERROR)
-- ==========================================
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read community_comments all" ON public.community_comments;
DROP POLICY IF EXISTS "Insert community_comments auth" ON public.community_comments;
DROP POLICY IF EXISTS "Delete community_comments owner" ON public.community_comments;
DROP POLICY IF EXISTS "Students insert community_comments" ON public.community_comments;

CREATE POLICY "Read community_comments all" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Insert community_comments auth" ON public.community_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Delete community_comments auth" ON public.community_comments FOR DELETE USING (true);
