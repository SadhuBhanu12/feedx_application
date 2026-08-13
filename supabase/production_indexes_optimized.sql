-- Optimized Composite Indexes for FeedX Database (Supabase)
-- Target: 3000+ concurrent users, massive scaling, sub-300ms query performance

-- 1. Optimized composite index for student monthly/daily attendance query
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, date DESC);

-- 2. Optimized composite index for academic resources query filtering by college/branch and ordering by date
CREATE INDEX IF NOT EXISTS idx_resources_composite ON public.resources(college_id, branch_id, created_at DESC);

-- 3. Optimized composite index for user notifications list query
CREATE INDEX IF NOT EXISTS idx_notifications_composite ON public.notifications(user_id, created_at DESC);

-- 4. Optimized composite index for checking if user is registered for a specific event
CREATE INDEX IF NOT EXISTS idx_event_registrations_composite ON public.event_registrations(student_id, event_id);

-- 5. Optimized composite index for bookmarks filtering by user and type
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_entity ON public.bookmarks(user_id, entity_type);

-- 6. Optimized composite index for college opportunities list
CREATE INDEX IF NOT EXISTS idx_opportunities_composite ON public.opportunities(college_id, created_at DESC);

-- 7. Index for community posts sorting & filtering
CREATE INDEX IF NOT EXISTS idx_community_posts_college_date ON public.community_posts(college_id, created_at DESC);
