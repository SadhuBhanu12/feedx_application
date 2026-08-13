# Supabase Storage Buckets — Production Setup

Create these buckets manually in **Supabase Dashboard → Storage → New Bucket**.

## Required Buckets

### 1. `profile-photos`
- **Purpose**: User avatar images
- **Public**: ✅ Yes (public read for display in app)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
- **RLS Policies**:
  - `SELECT` — public (anyone can view avatars)
  - `INSERT/UPDATE` — authenticated, path starts with `{user_id}/`
  - `DELETE` — authenticated, path starts with `{user_id}/`
- **Path pattern**: `{user_id}/avatar.jpg`
- **Referenced in**: `uploadProfilePhoto()` → [supabaseService.js L753-767](../services/supabaseService.js)

### 2. `uploads` (Resources)
- **Purpose**: Academic PDFs, notes, lab manuals, syllabus documents
- **Public**: ✅ Yes (students need direct access to URLs)
- **File size limit**: 50 MB
- **Allowed MIME types**: `application/pdf`, `image/*`, `video/*`, `application/msword`, `application/vnd.openxmlformats-officedocument.*`
- **RLS Policies**:
  - `SELECT` — public
  - `INSERT/UPDATE/DELETE` — admin only (check via `check_is_admin()`)
- **Path pattern**: `resources/{timestamp}_{filename}`
- **Referenced in**: `uploadResourceFile()` → [supabaseService.js L360-368](../services/supabaseService.js)

### 3. `support-attachments`
- **Purpose**: Images/documents attached to support tickets
- **Public**: ❌ No (private bucket — signed URLs only)
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/*`, `application/pdf`
- **RLS Policies**:
  - `SELECT` — authenticated (user can read own folder)
  - `INSERT` — authenticated, path starts with `{user_id}/`
  - `DELETE` — admin only
- **Path pattern**: `{user_id}/{timestamp}-{filename}`
- **Referenced in**: `uploadSupportAttachment()` → [supabaseService.js L769-778](../services/supabaseService.js)

> **Note**: The service code uses `getPublicUrl()` which works for public buckets. If you make this private, switch to `createSignedUrl()` in the service layer.

### 4. `certificates`
- **Purpose**: Event completion certificates (future feature)
- **Public**: ✅ Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: `application/pdf`, `image/png`
- **RLS Policies**:
  - `SELECT` — public
  - `INSERT/UPDATE/DELETE` — admin only
- **Path pattern**: `{event_id}/{user_id}_certificate.pdf`
- **Referenced in**: `event_registrations.certificate_url` column

## Quick Setup via SQL (Alternative)

```sql
-- Run in Supabase SQL Editor if you prefer SQL over dashboard
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile-photos', 'profile-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('uploads', 'uploads', true, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('support-attachments', 'support-attachments', true, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
  ('certificates', 'certificates', true, 5242880, ARRAY['application/pdf', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Allow users to upload to their own folder
CREATE POLICY "Users upload own profile photo"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own profile photo"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public read profile photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users upload own support attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'support-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public read support attachments"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'support-attachments');

CREATE POLICY "Public read uploads"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'uploads');

CREATE POLICY "Public read certificates"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'certificates');
```
