-- ==============================================================================
-- FEEDX COMPLETE DATABASE OPTIMIZATION
-- Combines: Indexes, RLS, Storage, RPC Functions, Atomic Counters
-- Run this ONCE in Supabase SQL Editor
-- ==============================================================================

-- =========================================================
-- SECTION 1: PERFORMANCE INDEXES
-- =========================================================

-- Community Posts
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_by ON public.community_posts (created_by);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts (status);
CREATE INDEX IF NOT EXISTS idx_community_posts_visibility ON public.community_posts (visibility);
CREATE INDEX IF NOT EXISTS idx_community_posts_college_id ON public.community_posts (college_id);

-- Community Likes & Comments
CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON public.community_likes (post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_student_id ON public.community_likes (student_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments (post_id);

-- Users & Students
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON public.students (college_id);
CREATE INDEX IF NOT EXISTS idx_students_branch_id ON public.students (branch_id);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations (user_id);

-- Issues / Support
CREATE INDEX IF NOT EXISTS idx_issues_user_id ON public.issues (user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues (status);
CREATE INDEX IF NOT EXISTS idx_issues_triage_status ON public.issues (triage_status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues (created_at DESC);

-- Innovations
CREATE INDEX IF NOT EXISTS idx_innovations_status ON public.innovations (status);
CREATE INDEX IF NOT EXISTS idx_innovations_college_id ON public.innovations (college_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at DESC);

-- Resources
CREATE INDEX IF NOT EXISTS idx_resources_college_id ON public.resources (college_id);
CREATE INDEX IF NOT EXISTS idx_resources_branch_id ON public.resources (branch_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources (created_at DESC);

-- Opportunities
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities (created_at DESC);

-- Bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_entity_type ON public.bookmarks (entity_type);

-- =========================================================
-- SECTION 2: ATOMIC LIKE COUNTER RPC FUNCTIONS
-- =========================================================
-- These prevent race conditions when multiple users like simultaneously

CREATE OR REPLACE FUNCTION increment_likes(post_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts 
  SET likes_count = COALESCE(likes_count, 0) + 1 
  WHERE id = post_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes(post_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts 
  SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) 
  WHERE id = post_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================
-- SECTION 3: UNIQUE CONSTRAINT FOR LIKE DEDUPLICATION
-- =========================================================

-- Prevent duplicate likes from rapid tapping
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_community_like'
  ) THEN
    ALTER TABLE public.community_likes 
    ADD CONSTRAINT unique_community_like UNIQUE (post_id, student_id);
  END IF;
END $$;

-- =========================================================
-- SECTION 4: STORAGE BUCKET HARDENING
-- =========================================================

UPDATE storage.buckets
SET 
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'],
  public = true
WHERE id = 'community-images1';

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'community-images1', 'community-images1', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'community-images1'
);

-- =========================================================
-- SECTION 5: ROW LEVEL SECURITY
-- =========================================================

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflicts (safe to re-run)
DROP POLICY IF EXISTS "Anyone can view active community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Admins can insert community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Creators and Super Admins can update posts" ON public.community_posts;
DROP POLICY IF EXISTS "Creators and Super Admins can delete posts" ON public.community_posts;

-- SELECT: Everyone can see active posts
CREATE POLICY "Anyone can view active community posts"
ON public.community_posts FOR SELECT
USING (status = 'active');

-- INSERT: Only admin roles
CREATE POLICY "Admins can insert community posts"
ON public.community_posts FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'super_admin', 'inst_admin')
  )
);

-- UPDATE: Creator or Super Admin
CREATE POLICY "Creators and Super Admins can update posts"
ON public.community_posts FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'super_admin'
  )
);

-- DELETE: Creator or Super Admin
CREATE POLICY "Creators and Super Admins can delete posts"
ON public.community_posts FOR DELETE
TO authenticated
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'super_admin'
  )
);
