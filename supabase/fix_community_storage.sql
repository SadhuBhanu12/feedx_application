-- ============================================================
-- Community Module: Storage Bucket + Indexes
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Ensure community-images1 bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('community-images1', 'community-images1', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. Database Indexes for Community Feed Optimization
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_by ON public.community_posts (created_by);

-- ============================================================
-- IMPORTANT: Storage RLS policies CANNOT be created via SQL
-- in hosted Supabase. You must configure them through the
-- Supabase Dashboard UI. See instructions below.
-- ============================================================

/*
MANUAL STEPS - Configure in Supabase Dashboard:

1. Go to: Storage > community-images1 > Policies

2. Create SELECT policy:
   - Name: "Public read community-images1"
   - Target roles: public
   - Policy: true

3. Create INSERT policy:
   - Name: "Admin upload community-images1"  
   - Target roles: authenticated
   - WITH CHECK expression:
     EXISTS (
       SELECT 1 FROM public.users 
       WHERE id = auth.uid() 
       AND role IN ('super_admin', 'admin', 'inst_admin')
     )

4. Create UPDATE policy:
   - Name: "Admin update community-images1"
   - Target roles: authenticated
   - USING expression:
     EXISTS (
       SELECT 1 FROM public.users 
       WHERE id = auth.uid() 
       AND role IN ('super_admin', 'admin', 'inst_admin')
     )

5. Create DELETE policy:
   - Name: "Admin delete community-images1"
   - Target roles: authenticated
   - USING expression:
     EXISTS (
       SELECT 1 FROM public.users 
       WHERE id = auth.uid() 
       AND role IN ('super_admin', 'admin', 'inst_admin')
     )
*/
