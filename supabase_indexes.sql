-- SQL Script to optimize Supabase Queries for FeedX

-- Indexes for students table
CREATE INDEX IF NOT EXISTS idx_students_college_id ON public.students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_branch_id ON public.students(branch_id);
CREATE INDEX IF NOT EXISTS idx_students_academic_year_id ON public.students(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_students_roll_number ON public.students(roll_number);

-- Indexes for resources table
CREATE INDEX IF NOT EXISTS idx_resources_college_id ON public.resources(college_id);
CREATE INDEX IF NOT EXISTS idx_resources_branch_id ON public.resources(branch_id);
CREATE INDEX IF NOT EXISTS idx_resources_academic_year_id ON public.resources(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);

-- Indexes for attendance table
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date DESC);

-- Indexes for events and registrations
CREATE INDEX IF NOT EXISTS idx_events_college_id ON public.events(college_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_student_id ON public.event_registrations(student_id);

-- Indexes for opportunities
CREATE INDEX IF NOT EXISTS idx_opportunities_college_id ON public.opportunities(college_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities(created_at DESC);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_college_id ON public.notifications(college_id);
CREATE INDEX IF NOT EXISTS idx_notification_reads_user_id ON public.notification_reads(user_id);

-- Indexes for bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_entity ON public.bookmarks(entity_type, entity_id);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ==========================================
-- HIGH-PERFORMANCE COMPOSITE INDEXES
-- ==========================================

-- Optimized composite index for student monthly/daily attendance query
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, date DESC);

-- Optimized composite index for academic resources query filtering by college/branch and ordering by date
CREATE INDEX IF NOT EXISTS idx_resources_composite ON public.resources(college_id, branch_id, created_at DESC);

-- Optimized composite index for user notifications list query
CREATE INDEX IF NOT EXISTS idx_notifications_composite ON public.notifications(user_id, created_at DESC);

-- Optimized composite index for checking if user is registered for a specific event
CREATE INDEX IF NOT EXISTS idx_event_registrations_composite ON public.event_registrations(student_id, event_id);

-- Optimized composite index for bookmarks filtering by user and type
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_entity ON public.bookmarks(user_id, entity_type);

-- Optimized composite index for college opportunities list
CREATE INDEX IF NOT EXISTS idx_opportunities_composite ON public.opportunities(college_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_type_composite ON public.opportunities(college_id, type, created_at DESC);

-- Optimized composite index for events query filtering by category & status
CREATE INDEX IF NOT EXISTS idx_events_category_composite ON public.events(college_id, category, status, start_date DESC);

-- Optimized composite index for community posts feed
CREATE INDEX IF NOT EXISTS idx_community_posts_composite ON public.community_posts(college_id, created_at DESC);

-- Optimized composite index for roadmap student progress
CREATE INDEX IF NOT EXISTS idx_student_roadmap_composite ON public.student_roadmap_progress(user_id, career_role_id);

-- Support nested/reply comments in community_comments
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE;

-- ==========================================
-- CONFLICT PREVENTION (UNIQUE CONSTRAINTS)
-- ==========================================
-- Prevents race conditions on event registrations
ALTER TABLE public.event_registrations ADD CONSTRAINT unique_event_registration UNIQUE (student_id, event_id);

-- Prevents duplicate bookmarks
ALTER TABLE public.bookmarks ADD CONSTRAINT unique_bookmark UNIQUE (user_id, entity_type, entity_id);

-- Prevents duplicate notification reads
ALTER TABLE public.notification_reads ADD CONSTRAINT unique_notification_read UNIQUE (user_id, notification_id);
