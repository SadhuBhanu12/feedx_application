-- ============================================================================
-- FEEDX PRODUCTION SCALABILITY & HIGH-PERFORMANCE INDEXES
-- Safe Execution Script (Ignores missing optional tables gracefully)
-- Target: 10,000+ Registered Users & High Concurrent Concurrency
-- ============================================================================

DO $$
BEGIN
  -- 1. STUDENT ACTIVITY LOGS & GAMIFICATION
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_activity_logs') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_student_activity_logs_user_date ON public.student_activity_logs (user_id, created_at DESC)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_student_activity_logs_type_date ON public.student_activity_logs (user_id, activity_type, created_at DESC)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='coin_transactions') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_date ON public.coin_transactions (user_id, created_at DESC)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_streaks') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_student_streaks_user_streak ON public.student_streaks (user_id, current_streak, last_activity_date)';
  END IF;

  -- 2. COMMUNITY POSTS, LIKES & COMMENTS
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='community_posts') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts (created_at DESC)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_community_posts_college_date ON public.community_posts (college_id, created_at DESC)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_community_posts_category_date ON public.community_posts (category, created_at DESC)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='community_comments') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_community_comments_post_date ON public.community_comments (post_id, created_at DESC)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='community_likes') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_community_likes_post_user') THEN
      ALTER TABLE public.community_likes ADD CONSTRAINT uq_community_likes_post_user UNIQUE (post_id, user_id);
    END IF;
  END IF;

  -- 3. BOOKMARKS
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='bookmarks') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_bookmarks_user_content') THEN
      ALTER TABLE public.bookmarks ADD CONSTRAINT uq_bookmarks_user_content UNIQUE (user_id, content_id, content_type);
    END IF;
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_bookmarks_user_type ON public.bookmarks (user_id, content_type, created_at DESC)';
  END IF;

  -- 4. OPPORTUNITIES & RESOURCES
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='opportunities') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_opportunities_active_date ON public.opportunities (is_active, created_at DESC)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_opportunities_category_date ON public.opportunities (category, created_at DESC)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='resources') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_resources_active_category ON public.resources (is_active, category, created_at DESC)';
  END IF;

  -- 5. EVENTS
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='events') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_events_status_date ON public.events (status, created_at DESC)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_events_college_date ON public.events (college_id, event_date DESC)';
  END IF;

  -- 6. NOTIFICATIONS
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='notifications') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, is_read, is_deleted, created_at DESC)';
  END IF;

  -- 7. SUPPORT TICKETS & GRIEVANCES
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='support_tickets') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_support_tickets_user_date ON public.support_tickets (user_id, created_at DESC)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_support_tickets_status_date ON public.support_tickets (status, created_at DESC)';
  END IF;

  -- 8. STUDENTS & COLLEGES LOOKUPS
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='students') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_students_roll_number ON public.students (roll_number)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_students_feedx_id ON public.students (feedx_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_students_college_branch ON public.students (college_id, branch_id)';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Index execution completed with warnings: %', SQLERRM;
END $$;
