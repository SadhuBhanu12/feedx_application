-- ============================================================
-- DATABASE PERFORMANCE INDEXES FOR FEEDX MANAGEMENT SYSTEM
-- ============================================================

-- 1. Students Table Indexes
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students (email);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON public.students (college_id);
CREATE INDEX IF NOT EXISTS idx_students_academic_year_id ON public.students (academic_year_id);
CREATE INDEX IF NOT EXISTS idx_students_roll_number ON public.students (roll_number);

-- 2. Users Table Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_pin_dob ON public.users (pin_number, date_of_birth);

-- 3. Events Table Indexes
CREATE INDEX IF NOT EXISTS idx_events_college_id ON public.events (college_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events (created_at DESC);

-- 4. Subjects Table Indexes
-- (Removed branch_id index)

-- 5. Notes Table Indexes
-- (Removed branch_id index)

-- 6. Jobs & Opportunities Indexes
-- (Removed jobs indexes as table does not exist)

-- 7. Notifications Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at DESC);

-- 8. Innovations (Innovation Hub) Indexes
CREATE INDEX IF NOT EXISTS idx_innovations_user_id ON public.innovations (user_id);
CREATE INDEX IF NOT EXISTS idx_innovations_college_id ON public.innovations (college_id);
CREATE INDEX IF NOT EXISTS idx_innovations_created_at ON public.innovations (created_at DESC);

-- 9. Attendance Indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance (student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance (date DESC);
