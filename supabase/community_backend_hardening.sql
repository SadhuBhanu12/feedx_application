-- ==============================================================================
-- FEEDX PRODUCTION BACKEND HARDENING
-- Addresses: Storage Bucket Configuration & Community Row Level Security (RLS)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PHASE 1: STORAGE BUCKET CONFIGURATION
-- ------------------------------------------------------------------------------
-- Enforce a 10MB file size limit and restrict MIME types to prevent abuse.
-- This ensures the RN bridge and database are never overwhelmed.

UPDATE storage.buckets
SET 
  file_size_limit = 10485760, -- 10 MB limit
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'],
  public = true
WHERE id = 'community-images1';

-- If the bucket doesn't exist, create it with the correct constraints
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'community-images1', 'community-images1', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'community-images1'
);

-- Storage Policy: Anyone can READ community images
CREATE POLICY "Public Access to Community Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-images1');

-- Storage Policy: Only authenticated users can UPLOAD (frontend enforces Admin/SuperAdmin)
CREATE POLICY "Authenticated Uploads to Community"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'community-images1');

-- ------------------------------------------------------------------------------
-- PHASE 2: ROW LEVEL SECURITY (RLS) FOR COMMUNITY POSTS
-- ------------------------------------------------------------------------------
-- Enable RLS on the table if it's not already enabled
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone (Students, Admins, etc.) can SELECT public posts
CREATE POLICY "Anyone can view active community posts"
ON public.community_posts FOR SELECT
USING (status = 'active');

-- Policy 2: ONLY Admins and Super Admins can INSERT posts
-- Requires looking up the user's role in the public.users table.
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

-- Policy 3: ONLY the creator OR Super Admins can UPDATE posts
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

-- Policy 4: ONLY the creator OR Super Admins can DELETE posts
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
