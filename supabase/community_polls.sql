-- ==============================================================
-- FEEDX COMMUNITY POLLS & IMAGE ATTACHMENTS MIGRATION
-- ==============================================================

-- 1. Alter community_posts to support additional metadata fields
ALTER TABLE public.community_posts 
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'text',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS audience_type TEXT DEFAULT 'all',
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 2. Create community_post_images table
CREATE TABLE IF NOT EXISTS public.community_post_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create polls table
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    allow_multiple BOOLEAN DEFAULT false,
    anonymous_voting BOOLEAN DEFAULT true,
    show_results_before_vote BOOLEAN DEFAULT false,
    allow_vote_change BOOLEAN DEFAULT false,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    status TEXT DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, CLOSED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create poll_options table
CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create poll_votes table
CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
    option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poll_id, student_id, option_id)
);

-- 6. Indexes for queries
CREATE INDEX IF NOT EXISTS idx_community_post_images_post ON public.community_post_images(post_id);
CREATE INDEX IF NOT EXISTS idx_polls_post_id ON public.polls(post_id);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON public.poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_student_id ON public.poll_votes(student_id);

-- 7. Trigger validation on poll votes submission
CREATE OR REPLACE FUNCTION check_vote_multiplicity()
RETURNS TRIGGER AS $$
DECLARE
    is_multi BOOLEAN;
    existing_count INT;
    ends_time TIMESTAMPTZ;
    poll_status TEXT;
BEGIN
    -- Check if poll has ended or is closed
    SELECT ends_at, status, allow_multiple INTO ends_time, poll_status, is_multi FROM public.polls WHERE id = NEW.poll_id;
    
    IF poll_status = 'CLOSED' OR (ends_time IS NOT NULL AND ends_time < NOW()) THEN
        RAISE EXCEPTION 'This poll is closed and no longer accepting votes.';
    END IF;

    IF NOT is_multi THEN
        -- If single choice, check if student already voted for this poll
        SELECT COUNT(*) INTO existing_count FROM public.poll_votes WHERE poll_id = NEW.poll_id AND student_id = NEW.student_id;
        IF existing_count > 0 THEN
            RAISE EXCEPTION 'Student has already voted in this poll.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_vote_multiplicity ON public.poll_votes;
CREATE TRIGGER trigger_check_vote_multiplicity
BEFORE 
INSERT ON public.poll_votes
FOR EACH ROW
EXECUTE FUNCTION check_vote_multiplicity();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.community_post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- 9. Setup RLS Policies
-- community_post_images
DROP POLICY IF EXISTS "Allow public read community_post_images" ON public.community_post_images;
CREATE POLICY "Allow public read community_post_images" ON public.community_post_images FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow admin write community_post_images" ON public.community_post_images;
CREATE POLICY "Allow admin write community_post_images" ON public.community_post_images FOR ALL TO authenticated USING (public.check_is_admin());

-- polls
DROP POLICY IF EXISTS "Allow public read polls" ON public.polls;
CREATE POLICY "Allow public read polls" ON public.polls FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow admin write polls" ON public.polls;
CREATE POLICY "Allow admin write polls" ON public.polls FOR ALL TO authenticated USING (public.check_is_admin());

-- poll_options
DROP POLICY IF EXISTS "Allow public read poll_options" ON public.poll_options;
CREATE POLICY "Allow public read poll_options" ON public.poll_options FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow admin write poll_options" ON public.poll_options;
CREATE POLICY "Allow admin write poll_options" ON public.poll_options FOR ALL TO authenticated USING (public.check_is_admin());

-- poll_votes
DROP POLICY IF EXISTS "Allow public read poll_votes" ON public.poll_votes;
CREATE POLICY "Allow public read poll_votes" ON public.poll_votes FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow student insert poll_votes" ON public.poll_votes;
CREATE POLICY "Allow student insert poll_votes" ON public.poll_votes FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
DROP POLICY IF EXISTS "Allow student delete poll_votes" ON public.poll_votes;
CREATE POLICY "Allow student delete poll_votes" ON public.poll_votes FOR DELETE TO authenticated USING (
    student_id = auth.uid() AND (SELECT allow_vote_change FROM public.polls WHERE id = poll_id) = true
);

-- 10. Enable realtime replication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_rel pr 
    JOIN pg_class c ON c.oid = pr.prrelid 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    JOIN pg_publication p ON p.oid = pr.prpubid 
    WHERE p.pubname = 'supabase_realtime' 
      AND n.nspname = 'public' 
      AND c.relname = 'polls'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_rel pr 
    JOIN pg_class c ON c.oid = pr.prrelid 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    JOIN pg_publication p ON p.oid = pr.prpubid 
    WHERE p.pubname = 'supabase_realtime' 
      AND n.nspname = 'public' 
      AND c.relname = 'poll_options'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_options;
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_rel pr 
    JOIN pg_class c ON c.oid = pr.prrelid 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    JOIN pg_publication p ON p.oid = pr.prpubid 
    WHERE p.pubname = 'supabase_realtime' 
      AND n.nspname = 'public' 
      AND c.relname = 'poll_votes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_votes;
  END IF;
END;
$$;
