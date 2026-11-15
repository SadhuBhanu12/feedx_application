-- ====================================================================
-- FEEDX PRODUCTION MASTER PERFORMANCE INDEXES
-- 100% Safe, Dynamic & Resilient Execution (Auto-detects tables & columns)
-- Target: 10,000+ Concurrent Students & Instant Query Execution
-- ====================================================================

DO $$
BEGIN

  -- Helper function to safely create index only if table and all columns exist
  CREATE OR REPLACE FUNCTION pg_temp.safe_create_index(
    p_index_name TEXT,
    p_table_name TEXT,
    p_index_def TEXT,
    VARIADIC p_required_columns TEXT[]
  ) RETURNS VOID AS $sub$
  DECLARE
    col TEXT;
  BEGIN
    -- 1. Check if table exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = p_table_name
    ) THEN
      RETURN;
    END IF;

    -- 2. Check if all required columns exist
    IF array_length(p_required_columns, 1) > 0 THEN
      FOREACH col IN ARRAY p_required_columns LOOP
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = p_table_name AND column_name = col
        ) THEN
          RETURN;
        END IF;
      END LOOP;
    END IF;

    -- 3. Safely execute index creation
    EXECUTE 'CREATE INDEX IF NOT EXISTS ' || quote_ident(p_index_name) || ' ON public.' || quote_ident(p_table_name) || ' ' || p_index_def;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped index %: %', p_index_name, SQLERRM;
  END;
  $sub$ LANGUAGE plpgsql;

  -- 1. NOTIFICATIONS & TARGETING INDEXES
  PERFORM pg_temp.safe_create_index('idx_notifications_user_created', 'notifications', '(user_id, created_at DESC)', 'user_id', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_notifications_college_created', 'notifications', '(college_id, created_at DESC)', 'college_id', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_notifications_target_college', 'notifications', '(target_college, created_at DESC)', 'target_college', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_notifications_type_created', 'notifications', '(type, created_at DESC)', 'type', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_notification_reads_user_notif', 'notification_reads', '(user_id, notification_id)', 'user_id', 'notification_id');

  -- 2. COMMUNITY FEED, LIKES, POLLS & COMMENTS
  PERFORM pg_temp.safe_create_index('idx_community_posts_pinned_created', 'community_posts', '(pinned DESC, created_at DESC) WHERE (is_deleted IS NOT TRUE)', 'pinned', 'created_at', 'is_deleted');
  PERFORM pg_temp.safe_create_index('idx_community_posts_category_created', 'community_posts', '(category, created_at DESC) WHERE (is_deleted IS NOT TRUE)', 'category', 'created_at', 'is_deleted');
  PERFORM pg_temp.safe_create_index('idx_community_posts_author', 'community_posts', '(author_id, created_at DESC)', 'author_id', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_community_likes_student_post', 'community_likes', '(student_id, post_id)', 'student_id', 'post_id');
  PERFORM pg_temp.safe_create_index('idx_community_likes_user_post', 'community_likes', '(user_id, post_id)', 'user_id', 'post_id');
  PERFORM pg_temp.safe_create_index('idx_community_likes_post_id', 'community_likes', '(post_id)', 'post_id');
  PERFORM pg_temp.safe_create_index('idx_community_comments_post_created', 'community_comments', '(post_id, created_at ASC)', 'post_id', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_community_post_images_post', 'community_post_images', '(post_id, display_order ASC)', 'post_id', 'display_order');

  -- 3. GAMIFICATION, REWARDS, WALLET & STREAKS
  PERFORM pg_temp.safe_create_index('idx_student_wallets_student_id', 'student_wallets', '(student_id)', 'student_id');
  PERFORM pg_temp.safe_create_index('idx_student_wallets_user_id', 'student_wallets', '(user_id)', 'user_id');
  PERFORM pg_temp.safe_create_index('idx_daily_streaks_student_id', 'daily_streaks', '(student_id)', 'student_id');
  PERFORM pg_temp.safe_create_index('idx_daily_streaks_user_id', 'daily_streaks', '(user_id)', 'user_id');
  PERFORM pg_temp.safe_create_index('idx_daily_streaks_last_active', 'daily_streaks', '(last_active_date DESC)', 'last_active_date');
  PERFORM pg_temp.safe_create_index('idx_coin_transactions_student_created', 'coin_transactions', '(student_id, created_at DESC)', 'student_id', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_coin_transactions_user_created', 'coin_transactions', '(user_id, created_at DESC)', 'user_id', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_coin_transactions_student_activity', 'coin_transactions', '(student_id, activity_type, created_at DESC)', 'student_id', 'activity_type', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_reward_redemptions_student', 'reward_redemptions', '(student_id, created_at DESC)', 'student_id', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_reward_redemptions_user', 'reward_redemptions', '(user_id, created_at DESC)', 'user_id', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_reward_catalog_active', 'reward_catalog', '(is_active, display_order ASC)', 'is_active', 'display_order');

  -- 4. EXPLORE: QUICK LEARN & QUIZZES
  PERFORM pg_temp.safe_create_index('idx_quick_learn_lessons_published', 'quick_learn_lessons', '(is_published, branch, created_at DESC)', 'is_published', 'branch', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_quick_learn_checks_lesson', 'quick_learn_checks', '(lesson_id)', 'lesson_id');
  PERFORM pg_temp.safe_create_index('idx_student_lesson_progress_user', 'student_lesson_progress', '(user_id, completed)', 'user_id', 'completed');
  PERFORM pg_temp.safe_create_index('idx_explore_quizzes_published', 'explore_quizzes', '(is_published, branch, is_daily, created_at DESC)', 'is_published', 'branch', 'is_daily', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_explore_quiz_attempts_user', 'explore_quiz_attempts', '(user_id, quiz_id)', 'user_id', 'quiz_id');
  PERFORM pg_temp.safe_create_index('idx_explore_quiz_questions_quiz', 'explore_quiz_questions', '(quiz_id, question_number ASC)', 'quiz_id', 'question_number');

  -- 5. ACADEMIC RESOURCES, OPPORTUNITIES & EVENTS
  PERFORM pg_temp.safe_create_index('idx_resources_type_created', 'resources', '(type, created_at DESC)', 'type', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_resources_branch_year', 'resources', '(branch_id, academic_year_id, created_at DESC)', 'branch_id', 'academic_year_id', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_opportunities_type_created', 'opportunities', '(type, created_at DESC)', 'type', 'created_at');
  PERFORM pg_temp.safe_create_index('idx_events_college_date', 'events', '(college_id, event_date DESC)', 'college_id', 'event_date');
  PERFORM pg_temp.safe_create_index('idx_tasks_user_deadline', 'tasks', '(user_id, deadline ASC, completed)', 'user_id', 'deadline', 'completed');

  -- 6. USERS & STUDENTS LOOKUPS
  PERFORM pg_temp.safe_create_index('idx_students_roll_number', 'students', '(roll_number)', 'roll_number');
  PERFORM pg_temp.safe_create_index('idx_students_feedx_id', 'students', '(feedx_id)', 'feedx_id');
  PERFORM pg_temp.safe_create_index('idx_students_college_branch', 'students', '(college_id, branch_id)', 'college_id', 'branch_id');
  PERFORM pg_temp.safe_create_index('idx_users_roll_number', 'users', '(roll_number)', 'roll_number');
  PERFORM pg_temp.safe_create_index('idx_users_role', 'users', '(role)', 'role');

  -- 7. BOOKMARKS & ROADMAP PROGRESS
  PERFORM pg_temp.safe_create_index('idx_bookmarks_user_composite', 'bookmarks', '(user_id, entity_type, entity_id)', 'user_id', 'entity_type', 'entity_id');
  PERFORM pg_temp.safe_create_index('idx_student_roadmap_progress_user', 'student_roadmap_progress', '(user_id, updated_at DESC)', 'user_id', 'updated_at');

  -- 8. INSTITUTIONAL METADATA
  PERFORM pg_temp.safe_create_index('idx_colleges_slug', 'colleges', '(slug)', 'slug');
  PERFORM pg_temp.safe_create_index('idx_branches_code', 'branches', '(code)', 'code');

END $$;

-- ====================================================================
-- RLS HIGH-PERFORMANCE RECOMMENDATION:
-- When defining RLS policies, replace auth.uid() with (SELECT auth.uid())
-- to allow PostgreSQL to evaluate the user identity once per query
-- rather than on every scanned row.
-- Example:
--   USING (user_id = (SELECT auth.uid()))
-- ====================================================================
