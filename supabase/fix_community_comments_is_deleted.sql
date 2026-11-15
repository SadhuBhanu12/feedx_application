-- ==============================================================================
-- FEEDX — COMMUNITY COMMENTS is_deleted COLUMN & TRIGGER FIX
-- Resolves error: column "is_deleted" does not exist when posting a comment
-- ==============================================================================

-- 1. Ensure is_deleted column exists on public.community_comments
ALTER TABLE public.community_comments 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- 2. Index for optimal comment filtering performance
CREATE INDEX IF NOT EXISTS idx_community_comments_post_deleted 
ON public.community_comments (post_id, is_deleted);

-- 3. Resilient Trigger Function to synchronize comments_count
CREATE OR REPLACE FUNCTION public.sync_community_post_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_post_id UUID;
    v_new_count INT := 0;
BEGIN
    v_post_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.post_id ELSE NEW.post_id END;

    IF v_post_id IS NOT NULL THEN
        BEGIN
            SELECT COUNT(*) INTO v_new_count
            FROM public.community_comments
            WHERE post_id = v_post_id 
              AND (is_deleted IS NULL OR is_deleted = FALSE);
        EXCEPTION WHEN undefined_column THEN
            SELECT COUNT(*) INTO v_new_count
            FROM public.community_comments
            WHERE post_id = v_post_id;
        END;

        UPDATE public.community_posts
        SET comments_count = v_new_count,
            updated_at = NOW()
        WHERE id = v_post_id;
    END IF;

    RETURN NULL;
END;
$$;

-- 4. Re-bind the trigger cleanly
DROP TRIGGER IF EXISTS trg_sync_community_comments ON public.community_comments;
CREATE TRIGGER trg_sync_community_comments
AFTER INSERT OR UPDATE OR DELETE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.sync_community_post_comments_count();

-- 5. Backfill/Resynchronize comments_count for all existing posts
UPDATE public.community_posts p
SET comments_count = COALESCE((
    SELECT COUNT(*) 
    FROM public.community_comments c 
    WHERE c.post_id = p.id 
      AND (c.is_deleted IS NULL OR c.is_deleted = FALSE)
), 0);

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'community_comments' AND column_name = 'is_deleted';
