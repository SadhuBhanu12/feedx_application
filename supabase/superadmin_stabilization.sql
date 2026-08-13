-- ==============================================================
-- FEEDX SUPER ADMIN STABILIZATION MIGRATION
-- ==============================================================

-- 1. Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial settings values
INSERT INTO public.settings (key, value) VALUES
('maintenance_mode', 'false'::jsonb),
('maintenance_title', '"System Maintenance"'::jsonb),
('maintenance_description', '"We are performing scheduled database upgrades. Please check back shortly."'::jsonb),
('maintenance_expected_time', '"2 Hours"'::jsonb),
('app_version', '"1.0.0"'::jsonb),
('force_update', 'false'::jsonb),
('announcement_banner', '{"enabled": false, "text": ""}'::jsonb),
('push_notifications', 'true'::jsonb),
('registration_enabled', 'true'::jsonb),
('community_enabled', 'true'::jsonb),
('innovation_hub_enabled', 'true'::jsonb),
('event_module_enabled', 'true'::jsonb),
('resource_module_enabled', 'true'::jsonb),
('opportunity_module_enabled', 'true'::jsonb),
('feedback_module_enabled', 'true'::jsonb),
('support_desk_enabled', 'true'::jsonb),
('admin_bypass_maintenance', 'true'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Enable RLS on settings table
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for settings table
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings"
ON public.settings FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Super Admin write settings" ON public.settings;
CREATE POLICY "Super Admin write settings"
ON public.settings FOR ALL
TO authenticated
USING (public.check_is_super_admin())
WITH CHECK (public.check_is_super_admin());

-- 2. Add is_active column to colleges and users
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 3. Cascade User Deletion trigger
CREATE OR REPLACE FUNCTION public.delete_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_deleted ON public.users;
CREATE TRIGGER on_user_deleted
  AFTER DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.delete_auth_user();

-- 4. Update community_comments table columns
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE;

-- 5. Create community_comment_likes table
CREATE TABLE IF NOT EXISTS public.community_comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    UNIQUE(comment_id, user_id)
);

ALTER TABLE public.community_comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read community_comment_likes all" ON public.community_comment_likes;
CREATE POLICY "Read community_comment_likes all" ON public.community_comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insert community_comment_likes auth" ON public.community_comment_likes;
CREATE POLICY "Insert community_comment_likes auth" ON public.community_comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Delete community_comment_likes auth" ON public.community_comment_likes;
CREATE POLICY "Delete community_comment_likes auth" ON public.community_comment_likes FOR DELETE USING (auth.uid() = user_id);

-- 6. Indexes for settings, comment likes, and foreign keys
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON public.community_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_comment_likes_comment_user ON public.community_comment_likes(comment_id, user_id);

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role, anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role, anon;
