-- FeedX Production Indexing Script
-- Resolves sequential table scans and N+1 query performance issues for 3000+ concurrent users

-- 1. Users & Students
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON public.students (college_id);
CREATE INDEX IF NOT EXISTS idx_students_branch_id ON public.students (branch_id);
CREATE INDEX IF NOT EXISTS idx_students_academic_year_id ON public.students (academic_year_id);

-- 2. Resources (Academics)
CREATE INDEX IF NOT EXISTS idx_resources_college_id ON public.resources (college_id);
CREATE INDEX IF NOT EXISTS idx_resources_branch_id ON public.resources (branch_id);
CREATE INDEX IF NOT EXISTS idx_resources_academic_year_id ON public.resources (academic_year_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources (created_at DESC);

-- 3. Community Feed
CREATE INDEX IF NOT EXISTS idx_community_posts_college_id ON public.community_posts (college_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON public.community_likes (post_id);

-- 4. Events
CREATE INDEX IF NOT EXISTS idx_events_college_id ON public.events (college_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations (user_id);

-- 5. Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at DESC);

-- 6. Support & Issues
CREATE INDEX IF NOT EXISTS idx_issues_college_id ON public.issues (college_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues (status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues (created_at DESC);

-- 7. Innovations & Projects
CREATE INDEX IF NOT EXISTS idx_innovations_college_id ON public.innovations (college_id);
CREATE INDEX IF NOT EXISTS idx_innovations_status ON public.innovations (status);

-- 8. Timetable & Attendance
CREATE INDEX IF NOT EXISTS idx_timetables_batch_id ON public.timetables (batch_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance (student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance (date DESC);
