-- 🚀 FEEDX POLYTECHNIC UNIFIED MASTER SETUP SCHEMA (Schema + RLS + Realtime + Seed Data)
-- VERSION: 6.0 (Unified Canonical Production Ready)
-- This script merges all database requirements for auth activation, student profile queries, academic operations, RLS, and realtime.

-- ==========================================
-- 1. CLEANUP & EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop trigger on auth.users if it exists (auth.users always exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS public.handle_new_user_signup() CASCADE;
DROP FUNCTION IF EXISTS public.sync_students_to_profiles() CASCADE;
DROP FUNCTION IF EXISTS public.sync_profiles_to_students() CASCADE;
DROP FUNCTION IF EXISTS public.sync_users_to_students() CASCADE;
DROP FUNCTION IF EXISTS public.check_is_admin() CASCADE;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.activation_logs CASCADE;
DROP TABLE IF EXISTS public.activation_sessions CASCADE;
DROP TABLE IF EXISTS public.activation_attempts CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.college_notices CASCADE;
DROP TABLE IF EXISTS public.feature_waitlist CASCADE;
DROP TABLE IF EXISTS public.community_links CASCADE;
DROP TABLE IF EXISTS public.college_placements CASCADE;
DROP TABLE IF EXISTS public.college_facilities CASCADE;
DROP TABLE IF EXISTS public.college_courses CASCADE;
DROP TABLE IF EXISTS public.issue_timeline CASCADE;
DROP TABLE IF EXISTS public.issue_votes CASCADE;
DROP TABLE IF EXISTS public.issues CASCADE;
DROP TABLE IF EXISTS public.community_comments CASCADE;
DROP TABLE IF EXISTS public.community_likes CASCADE;
DROP TABLE IF EXISTS public.community_posts CASCADE;
DROP TABLE IF EXISTS public.forum_replies CASCADE;
DROP TABLE IF EXISTS public.forum_upvotes CASCADE;
DROP TABLE IF EXISTS public.forum_questions CASCADE;
DROP TABLE IF EXISTS public.collaboration_applications CASCADE;
DROP TABLE IF EXISTS public.project_collaborations CASCADE;
DROP TABLE IF EXISTS public.study_group_members CASCADE;
DROP TABLE IF EXISTS public.study_groups CASCADE;
DROP TABLE IF EXISTS public.placement_experiences CASCADE;
DROP TABLE IF EXISTS public.marketplace_items CASCADE;
DROP TABLE IF EXISTS public.alumni_directory CASCADE;
DROP TABLE IF EXISTS public.clubs CASCADE;
DROP TABLE IF EXISTS public.innovations CASCADE;
DROP TABLE IF EXISTS public.support_feedbacks CASCADE;
DROP TABLE IF EXISTS public.support_suggestions CASCADE;
DROP TABLE IF EXISTS public.bookmarks CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.notification_reads CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.opportunity_applications CASCADE;
DROP TABLE IF EXISTS public.internships CASCADE;
DROP TABLE IF EXISTS public.opportunities CASCADE;
DROP TABLE IF EXISTS public.notes CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.timetable CASCADE;
DROP TABLE IF EXISTS public.timetables CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.student_profiles CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.sections CASCADE;
DROP TABLE IF EXISTS public.academic_years CASCADE;
DROP TABLE IF EXISTS public.branches CASCADE;
DROP TABLE IF EXISTS public.colleges CASCADE;

-- Standard function for updating timestamps
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 2. ACADEMIC HIERARCHY
-- ==========================================
CREATE TABLE public.colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_name TEXT NOT NULL,
    name TEXT NOT NULL UNIQUE, -- Stored duplicate column for query compatibility
    college_code TEXT UNIQUE,
    location TEXT,
    type TEXT DEFAULT 'Private', -- Govt, Private, Autonomous
    principal_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    logo_url TEXT,
    banner_url TEXT,
    brochure_url TEXT,
    website TEXT,
    rating NUMERIC DEFAULT 4.5,
    description TEXT,
    ranking INTEGER,
    fee TEXT,
    placements TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_name TEXT NOT NULL, -- E.g. Computer Science
    name TEXT NOT NULL, -- Stored duplicate for compatibility
    branch_code TEXT NOT NULL, -- E.g. CSE
    code TEXT, -- duplicate for compatibility
    hod_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, branch_code)
);

CREATE TABLE public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    year_name TEXT NOT NULL, -- E.g. 1st Year, 2nd Year
    semester TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL, -- E.g. Section A, Section B
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(academic_year_id, section_name)
);

CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    faculty_name TEXT,
    credits INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(academic_year_id, subject_code)
);

-- ==========================================
-- 3. USER PROFILE & IDENTITY SYSTEM
-- ==========================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY, -- Matches auth.users.id
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student', -- student, admin, super_admin, inst_admin, counsellor
    phone TEXT,
    avatar_url TEXT,
    pin_number TEXT,
    date_of_birth DATE,
    is_password_set BOOLEAN DEFAULT FALSE,
    first_login_completed BOOLEAN DEFAULT FALSE,
    password_changed_at TIMESTAMPTZ,
    bio TEXT,
    branch TEXT,
    year TEXT,
    section TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
    section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    date_of_birth DATE,
    cgpa NUMERIC DEFAULT 0.0,
    bio TEXT,
    profile_image TEXT,
    is_password_set BOOLEAN DEFAULT FALSE,
    year TEXT, -- E.g. 1st Year, 2nd Year
    pin_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, roll_number)
);

CREATE TABLE public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    roll_no TEXT UNIQUE NOT NULL,
    college TEXT,
    branch TEXT,
    year INTEGER, -- 1, 2, 3, 4
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    interests TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    resume_url TEXT,
    bio TEXT,
    cgpa NUMERIC DEFAULT 0.0,
    pin_number TEXT,
    is_password_set BOOLEAN DEFAULT FALSE,
    first_login_completed BOOLEAN DEFAULT FALSE,
    force_password_change BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.admins (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'inst_admin', -- inst_admin, super_admin
    institution_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. ACADEMIC OPERATIONS
-- ==========================================

CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- Duplicate/fallback
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    subject TEXT, -- duplicate/fallback
    date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Excused')),
    present INTEGER DEFAULT 0, -- duplicate/fallback
    total INTEGER DEFAULT 0, -- duplicate/fallback
    marked_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    period_number INTEGER NOT NULL,
    faculty_id UUID REFERENCES public.users(id),
    start_time TIME,
    end_time TIME,
    room_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legacy timetable alias
CREATE TABLE public.timetable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch TEXT NOT NULL,
    year INTEGER NOT NULL,
    day TEXT NOT NULL,
    subject TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMPTZ,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed')),
    completed BOOLEAN DEFAULT FALSE, -- Duplicate/fallback
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. CONTENT & DISCOVERY
-- ==========================================

CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'Notes', -- Notes, Previous Paper, Lab Manual, Syllabus
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legacy notes alias
CREATE TABLE public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject TEXT NOT NULL,
    branch TEXT NOT NULL,
    title TEXT NOT NULL,
    resource_type TEXT DEFAULT 'PDF',
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    eligible_colleges UUID[] DEFAULT '{}',
    eligible_branches TEXT[] DEFAULT '{"All"}',
    deadline DATE,
    apply_link TEXT,
    category TEXT DEFAULT 'internship', -- internship, scholarship, hackathon, job
    type TEXT DEFAULT 'Internship', -- Internship, Full-Time, Remote
    location TEXT DEFAULT 'Remote',
    stipend TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legacy internships alias
CREATE TABLE public.internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    type TEXT DEFAULT 'Internship',
    description TEXT,
    location TEXT,
    stipend TEXT,
    mode TEXT CHECK (mode IN ('remote', 'onsite', 'hybrid')),
    skills_required TEXT[] DEFAULT '{}',
    deadline DATE,
    posted_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.opportunity_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'selected', 'withdrawn')),
    cover_letter TEXT,
    resume_url TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(opportunity_id, user_id)
);

CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'selected')),
    cover_letter TEXT,
    resume_url TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- Null for broadcast
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    body TEXT,
    target_college UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    target_branch UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    target_year UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'General', -- Announcement, Jobs, Exams, Support
    branch TEXT DEFAULT 'All',
    year TEXT DEFAULT 'All',
    apply_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notification_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, notification_id)
);

CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    date DATE, -- Duplicate/fallback
    location TEXT,
    venue TEXT, -- Duplicate/fallback
    type TEXT DEFAULT 'Workshop', -- Seminar, Cultural, Workshop, Sports
    image_url TEXT,
    capacity INTEGER DEFAULT 100,
    registered INTEGER DEFAULT 0,
    price NUMERIC DEFAULT 0,
    organizer UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- compatibility
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'waitlist')),
    qr_token TEXT,
    certificate_url TEXT,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(), -- duplicate compatibility
    UNIQUE(event_id, user_id)
);

CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- event, opportunity, resource
    entity_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_id)
);

-- ==========================================
-- COMMUNITY PORTAL TABLES
-- ==========================================

CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id VARCHAR(50),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  author_name TEXT,
  author_roll TEXT,
  author_role TEXT,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE public.community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  author_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES FOR COMMUNITY POSTS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 6. SUPPORT & TRIAGE
-- ==========================================

CREATE TABLE public.support_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    expected_benefits TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.support_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER,
    category TEXT,
    feedback_text TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.issues (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    location TEXT,
    building TEXT,
    floor TEXT,
    room TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    triage_status TEXT DEFAULT 'pending_review' CHECK (triage_status IN ('pending_review', 'approved', 'rejected', 'merged')),
    affected_count INTEGER DEFAULT 1,
    merged_into_id VARCHAR(50) REFERENCES public.issues(id) ON DELETE SET NULL,
    response TEXT,
    attachments TEXT[] DEFAULT '{}',
    attachment_urls TEXT[] DEFAULT '{}',
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.issue_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id VARCHAR(50) NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(issue_id, user_id)
);

CREATE TABLE public.issue_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id VARCHAR(50) NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. INSTITUTION METRICS & ADDITIONAL ENTITIES
-- ==========================================

CREATE TABLE public.college_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_name TEXT NOT NULL,
    duration TEXT,
    seats INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.college_facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    facility_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.college_placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    package TEXT,
    year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    members TEXT,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.feature_waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feature_key)
);

CREATE TABLE public.college_notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT,
    type TEXT DEFAULT 'notice',
    attachment_url TEXT,
    published_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 8. AUTH ACTIVATION RATE LIMITS & TOKENS
-- ==========================================

CREATE TABLE public.activation_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_key TEXT NOT NULL UNIQUE,
    failed_count INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_key TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 8.5 COMMUNITY, FORUMS, COLLABS & INNOVATION TABLES
-- ==========================================

-- 1. Community Comments (Sub-table of community_posts)
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Community Likes Tracker (Sub-table of community_posts)
CREATE TABLE IF NOT EXISTS public.community_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id)
);

-- 3. Academic Discussions (Forum Questions)
CREATE TABLE IF NOT EXISTS public.forum_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'General', -- DSA, DBMS, Java, Python, Web Development, AI/ML
    upvotes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Forum Upvotes Tracker
CREATE TABLE IF NOT EXISTS public.forum_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.forum_questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    UNIQUE(question_id, user_id)
);

-- 5. Forum Replies
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.forum_questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Project Collaborations
CREATE TABLE IF NOT EXISTS public.project_collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    branch TEXT,
    skills TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Collaboration Applications Tracker
CREATE TABLE IF NOT EXISTS public.collaboration_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collaboration_id UUID REFERENCES public.project_collaborations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    UNIQUE(collaboration_id, user_id)
);

-- 8. Study Groups
CREATE TABLE IF NOT EXISTS public.study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    members_count INTEGER DEFAULT 1,
    files_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Study Group Members
CREATE TABLE IF NOT EXISTS public.study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    UNIQUE(group_id, user_id)
);

-- 10. Placement Cell Experiences
CREATE TABLE IF NOT EXISTS public.placement_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    company TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Student Marketplace Items
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    title TEXT NOT NULL,
    price NUMERIC DEFAULT 0,
    condition TEXT DEFAULT 'Good', -- Like New, Good, Fair
    category TEXT DEFAULT 'Books', -- Books, Electronics, Lab Gear, Others
    description TEXT NOT NULL,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Alumni Directory
CREATE TABLE IF NOT EXISTS public.alumni_directory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    class_of TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    skills TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Clubs Directory
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    members_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Innovation Hub Ideas (Replaces innovations/projects table)
CREATE TABLE IF NOT EXISTS public.innovations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- AI, IoT, Robotics, Web Development, Healthcare, Agriculture, Cybersecurity, etc.
    problem_statement TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    description TEXT NOT NULL,
    expected_impact TEXT NOT NULL,
    tech_stack TEXT,
    team_members TEXT,
    supporting_docs TEXT, -- Supporting images or document link
    demo_link TEXT,
    stage TEXT DEFAULT 'Idea', -- Idea, Prototype, MVP, Completed
    patent_status TEXT,
    status TEXT DEFAULT 'Pending Review', -- Pending Review, Under Review, Recommended, Approved, Rejected, Featured
    college_feedback TEXT,
    super_feedback TEXT,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activation_sessions_token ON public.activation_sessions (token);
CREATE INDEX idx_activation_logs_created ON public.activation_logs (created_at DESC);

-- ==========================================
-- 9. TRIGGERS & MUTUAL SYNCHRONIZATION
-- ==========================================

-- Trigger to sync user_id/student_id/subject/present/total on attendance
CREATE OR REPLACE FUNCTION public.sync_attendance_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = NEW.student_id;
  IF NEW.subject_id IS NOT NULL THEN
    NEW.subject = (SELECT subject_name FROM public.subjects WHERE id = NEW.subject_id);
  END IF;
  IF NEW.status = 'Present' THEN
    NEW.present = 1;
  ELSE
    NEW.present = 0;
  END IF;
  NEW.total = 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_attendance_fields
BEFORE INSERT OR UPDATE ON public.attendance
FOR EACH ROW EXECUTE FUNCTION public.sync_attendance_fields();

-- Trigger to keep colleges.name and colleges.college_name in sync
CREATE OR REPLACE FUNCTION public.sync_college_names()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.college_name IS NULL AND NEW.name IS NOT NULL THEN
    NEW.college_name = NEW.name;
  ELSIF NEW.name IS NULL AND NEW.college_name IS NOT NULL THEN
    NEW.name = NEW.college_name;
  ELSIF NEW.college_name IS NOT NULL AND NEW.name IS NOT NULL THEN
    NEW.college_name = NEW.name; -- 'name' is dominant
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_college_names
BEFORE INSERT OR UPDATE ON public.colleges
FOR EACH ROW EXECUTE FUNCTION public.sync_college_names();

-- Trigger to keep branches.name and branches.branch_name in sync
CREATE OR REPLACE FUNCTION public.sync_branch_names()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.branch_name IS NULL AND NEW.name IS NOT NULL THEN
    NEW.branch_name = NEW.name;
  ELSIF NEW.name IS NULL AND NEW.branch_name IS NOT NULL THEN
    NEW.name = NEW.branch_name;
  ELSIF NEW.branch_name IS NOT NULL AND NEW.name IS NOT NULL THEN
    NEW.branch_name = NEW.name;
  END IF;
  IF NEW.branch_code IS NOT NULL THEN
    NEW.code = NEW.branch_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_branch_names
BEFORE INSERT OR UPDATE ON public.branches
FOR EACH ROW EXECUTE FUNCTION public.sync_branch_names();

-- Trigger to keep tasks.status and tasks.completed in sync
CREATE OR REPLACE FUNCTION public.sync_task_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = TRUE THEN
    NEW.status = 'Completed';
  ELSIF NEW.status = 'Completed' THEN
    NEW.completed = TRUE;
  ELSE
    NEW.completed = FALSE;
    NEW.status = 'Pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_task_status
BEFORE INSERT OR UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.sync_task_status();

-- Trigger to sync user event registrations fields
CREATE OR REPLACE FUNCTION public.sync_event_registration_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.student_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_event_registration_fields
BEFORE INSERT OR UPDATE ON public.event_registrations
FOR EACH ROW EXECUTE FUNCTION public.sync_event_registration_fields();

-- Trigger to sync student details to student_profiles
CREATE OR REPLACE FUNCTION public.sync_students_to_profiles()
RETURNS TRIGGER AS $$
DECLARE
  v_col_name TEXT;
  v_br_name TEXT;
  v_yr_val INTEGER;
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  v_col_name := (SELECT name FROM public.colleges WHERE id = NEW.college_id);
  v_br_name := (SELECT branch_name FROM public.branches WHERE id = NEW.branch_id);
  -- Extract integer from "1st Year", "2nd Year" etc.
  v_yr_val := COALESCE(substring(NEW.year from '[0-9]+')::INTEGER, 1);

  INSERT INTO public.student_profiles (
    user_id, roll_no, college, branch, year, date_of_birth, cgpa, pin_number, is_password_set
  )
  VALUES (
    NEW.id, NEW.roll_number, v_col_name, v_br_name, v_yr_val,
    NEW.date_of_birth, NEW.cgpa, NEW.pin_number, NEW.is_password_set
  )
  ON CONFLICT (user_id) DO UPDATE SET
    roll_no = EXCLUDED.roll_no,
    college = EXCLUDED.college,
    branch = EXCLUDED.branch,
    year = EXCLUDED.year,
    date_of_birth = EXCLUDED.date_of_birth,
    cgpa = EXCLUDED.cgpa,
    pin_number = EXCLUDED.pin_number,
    is_password_set = EXCLUDED.is_password_set;

  -- Also sync users table status columns
  UPDATE public.users SET
    pin_number = NEW.pin_number,
    date_of_birth = NEW.date_of_birth,
    is_password_set = NEW.is_password_set,
    branch = v_br_name,
    year = NEW.year
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_students_to_profiles
AFTER INSERT OR UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.sync_students_to_profiles();

-- Trigger to sync profile updates back to students table
CREATE OR REPLACE FUNCTION public.sync_profiles_to_students()
RETURNS TRIGGER AS $$
DECLARE
  v_col_id UUID;
  v_br_id UUID;
  v_yr_id UUID;  
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  v_col_id := (SELECT id FROM public.colleges WHERE name = NEW.college LIMIT 1);
  v_br_id := (SELECT id FROM public.branches WHERE college_id = v_col_id AND (branch_name = NEW.branch OR branch_code = NEW.branch) LIMIT 1);
  v_yr_id := (SELECT id FROM public.academic_years WHERE branch_id = v_br_id AND year_name LIKE (NEW.year || '%') LIMIT 1);

  -- Perform update without triggering recursion (handled by update checks)
  UPDATE public.students SET
    roll_number = NEW.roll_no,
    college_id = COALESCE(v_col_id, college_id),
    branch_id = COALESCE(v_br_id, branch_id),
    academic_year_id = COALESCE(v_yr_id, academic_year_id),
    date_of_birth = NEW.date_of_birth,
    cgpa = NEW.cgpa,
    pin_number = NEW.pin_number,
    is_password_set = NEW.is_password_set,
    year = NEW.year || 'nd Year'
  WHERE id = NEW.user_id;

  -- Also sync users table activation status columns
  UPDATE public.users SET
    pin_number = NEW.pin_number,
    date_of_birth = NEW.date_of_birth,
    is_password_set = NEW.is_password_set,
    first_login_completed = NEW.first_login_completed
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_profiles_to_students
AFTER INSERT OR UPDATE ON public.student_profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_profiles_to_students();

-- Auto-create profile on signup from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_full_name TEXT;
  v_roll_number TEXT;
  v_dob DATE;
  v_pin TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  v_roll_number := COALESCE(NEW.raw_user_meta_data->>'roll_number', 'PENDING');
  v_dob := (NEW.raw_user_meta_data->>'date_of_birth')::DATE;
  v_pin := COALESCE(NEW.raw_user_meta_data->>'pin_number', '123456');

  -- Insert into base users table
  INSERT INTO public.users (
    id, email, full_name, role, pin_number, date_of_birth, is_password_set, first_login_completed
  )
  VALUES (
    NEW.id, NEW.email, v_full_name, v_role, v_pin, v_dob, FALSE, FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- If it's a student, insert into students table
  IF v_role = 'student' THEN
    INSERT INTO public.students (
      id, roll_number, full_name, email, pin_number, date_of_birth, is_password_set, year
    )
    VALUES (
      NEW.id, v_roll_number, v_full_name, NEW.email, v_pin, v_dob, FALSE, '1st Year'
    )
    ON CONFLICT (id) DO NOTHING;
  -- If admin
  ELSIF v_role = 'admin' OR v_role = 'super_admin' OR v_role = 'inst_admin' THEN
    INSERT INTO public.admins (id, name, email, role)
    VALUES (NEW.id, v_full_name, NEW.email, v_role)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- ==========================================
-- 10. SECURITY & ROW LEVEL SECURITY (RLS)
-- ==========================================

CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND (role = 'admin' OR role = 'super_admin' OR role = 'inst_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Grant permissions to roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role, anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role, anon;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Define Policies

-- Admin overrides for everything
CREATE POLICY "Admin master users" ON public.users FOR ALL TO authenticated USING (public.check_is_admin() OR id = auth.uid()) WITH CHECK (public.check_is_admin() OR id = auth.uid());
CREATE POLICY "Admin master students" ON public.students FOR ALL TO authenticated USING (public.check_is_admin() OR id = auth.uid()) WITH CHECK (public.check_is_admin() OR id = auth.uid());
CREATE POLICY "Allow public read for OTP check" ON public.students FOR SELECT USING (TRUE);

-- Activation Flow Policies
CREATE POLICY "Allow public insert to activation_sessions" ON public.activation_sessions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow public select on activation_sessions" ON public.activation_sessions FOR SELECT USING (TRUE);
CREATE POLICY "Allow public update on activation_sessions" ON public.activation_sessions FOR UPDATE USING (TRUE);

CREATE POLICY "Allow public insert to activation_attempts" ON public.activation_attempts FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow public select on activation_attempts" ON public.activation_attempts FOR SELECT USING (TRUE);

CREATE POLICY "Allow public insert to activation_logs" ON public.activation_logs FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow public select on activation_logs" ON public.activation_logs FOR SELECT USING (TRUE);
CREATE POLICY "Admin master student_profiles" ON public.student_profiles FOR ALL TO authenticated USING (public.check_is_admin() OR user_id = auth.uid()) WITH CHECK (public.check_is_admin() OR user_id = auth.uid());
CREATE POLICY "Admin master admins" ON public.admins FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master colleges" ON public.colleges FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master branches" ON public.branches FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master academic_years" ON public.academic_years FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master subjects" ON public.subjects FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master attendance" ON public.attendance FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master timetables" ON public.timetables FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master timetable" ON public.timetable FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master tasks" ON public.tasks FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master resources" ON public.resources FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master notes" ON public.notes FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master opportunities" ON public.opportunities FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master internships" ON public.internships FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master opportunity_applications" ON public.opportunity_applications FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master applications" ON public.applications FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master notifications" ON public.notifications FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master notification_reads" ON public.notification_reads FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master events" ON public.events FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master event_registrations" ON public.event_registrations FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master bookmarks" ON public.bookmarks FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master issues" ON public.issues FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master issue_timeline" ON public.issue_timeline FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master issue_votes" ON public.issue_votes FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master support_suggestions" ON public.support_suggestions FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master support_feedbacks" ON public.support_feedbacks FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master community_links" ON public.community_links FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master feature_waitlist" ON public.feature_waitlist FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master college_notices" ON public.college_notices FOR ALL TO authenticated USING (public.check_is_admin());
CREATE POLICY "Admin master activity_logs" ON public.activity_logs FOR ALL TO authenticated USING (public.check_is_admin());

-- Student views/select policies
CREATE POLICY "Student read own profile" ON public.student_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Student read own user" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Student read own student record" ON public.students FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Student read own attendance" ON public.attendance FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Student read own tasks" ON public.tasks FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Student insert own support suggestions" ON public.support_suggestions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Student read own support suggestions" ON public.support_suggestions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Student insert own support feedbacks" ON public.support_feedbacks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Student read own support feedbacks" ON public.support_feedbacks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Student read own applications" ON public.opportunity_applications FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Student read own legacy applications" ON public.applications FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Student read own support issues" ON public.issues FOR SELECT TO authenticated USING (user_id = auth.uid() OR triage_status = 'approved');
CREATE POLICY "Student write own support issues" ON public.issues FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Student vote on support issues" ON public.issue_votes FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Student read own support issue timeline" ON public.issue_timeline FOR SELECT TO authenticated USING (
  issue_id IN (SELECT id FROM public.issues WHERE user_id = auth.uid()) OR actor_id = auth.uid()
);
CREATE POLICY "Student insert own support issue timeline" ON public.issue_timeline FOR INSERT TO authenticated WITH CHECK (
  actor_id = auth.uid()
);
CREATE POLICY "Student read own bookmarks" ON public.bookmarks FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Student read own notification reads" ON public.notification_reads FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Global reads
CREATE POLICY "Read colleges all" ON public.colleges FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read branches all" ON public.branches FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read academic_years all" ON public.academic_years FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read subjects all" ON public.subjects FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read timetables all" ON public.timetables FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read legacy timetable all" ON public.timetable FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read resources all" ON public.resources FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read legacy notes all" ON public.notes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read opportunities all" ON public.opportunities FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read legacy internships all" ON public.internships FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read community_links all" ON public.community_links FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read events all" ON public.events FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Read college_notices all" ON public.college_notices FOR SELECT TO authenticated USING (TRUE);

-- Specific actions
CREATE POLICY "Student read own event registrations" ON public.event_registrations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Student register for events" ON public.event_registrations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Student cancel event registration" ON public.event_registrations FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Student read targeting notifications" ON public.notifications FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR user_id IS NULL
);

CREATE POLICY "Student join waitlist" ON public.feature_waitlist FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Enable RLS for all new community tables
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovations ENABLE ROW LEVEL SECURITY;

-- Global reads for public academic hierarchy (including sections)
CREATE POLICY "Read sections all" ON public.sections FOR SELECT TO authenticated USING (TRUE);

-- Community Posts Policies
CREATE POLICY "Read community_posts all" ON public.community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert community_posts auth" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update community_posts owner" ON public.community_posts FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete community_posts owner" ON public.community_posts FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Community Comments Policies
CREATE POLICY "Read community_comments all" ON public.community_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert community_comments auth" ON public.community_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete community_comments owner" ON public.community_comments FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Community Likes Policies
CREATE POLICY "Read community_likes all" ON public.community_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert community_likes auth" ON public.community_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete community_likes auth" ON public.community_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Forum Questions Policies
CREATE POLICY "Read forum_questions all" ON public.forum_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert forum_questions auth" ON public.forum_questions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Forum Upvotes Policies
CREATE POLICY "Read forum_upvotes all" ON public.forum_upvotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert forum_upvotes auth" ON public.forum_upvotes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete forum_upvotes auth" ON public.forum_upvotes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Forum Replies Policies
CREATE POLICY "Read forum_replies all" ON public.forum_replies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert forum_replies auth" ON public.forum_replies FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Project Collaborations Policies
CREATE POLICY "Read project_collaborations all" ON public.project_collaborations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert project_collaborations auth" ON public.project_collaborations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Collaboration Applications Policies
CREATE POLICY "Read collaboration_applications all" ON public.collaboration_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert collaboration_applications auth" ON public.collaboration_applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete collaboration_applications auth" ON public.collaboration_applications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Study Groups Policies
CREATE POLICY "Read study_groups all" ON public.study_groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert study_groups auth" ON public.study_groups FOR INSERT TO authenticated WITH CHECK (true);

-- Study Group Members Policies
CREATE POLICY "Read study_group_members all" ON public.study_group_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert study_group_members auth" ON public.study_group_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete study_group_members auth" ON public.study_group_members FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Placement Experiences Policies
CREATE POLICY "Read placement_experiences all" ON public.placement_experiences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert placement_experiences auth" ON public.placement_experiences FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Marketplace Items Policies
CREATE POLICY "Read marketplace_items all" ON public.marketplace_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert marketplace_items auth" ON public.marketplace_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update marketplace_items owner" ON public.marketplace_items FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Alumni Directory Policies
CREATE POLICY "Read alumni_directory all" ON public.alumni_directory FOR SELECT TO authenticated USING (true);

-- Clubs Policies
CREATE POLICY "Read clubs all" ON public.clubs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage clubs" ON public.clubs FOR ALL TO authenticated USING (public.check_is_admin());

-- Innovations Policies
CREATE POLICY "Read innovations all" ON public.innovations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert innovations auth" ON public.innovations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update innovations owner" ON public.innovations FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete innovations owner" ON public.innovations FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ==========================================
-- 11. REAL-TIME REGISTRATION (Publication)
-- ==========================================

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.notifications,
    public.attendance,
    public.timetables,
    public.tasks,
    public.resources,
    public.events,
    public.event_registrations,
    public.opportunities,
    public.bookmarks,
    public.issues,
    public.community_links,
    public.college_notices,
    public.student_profiles,
    public.users,
    public.sections,
    public.community_posts,
    public.community_comments,
    public.community_likes,
    public.forum_questions,
    public.forum_replies,
    public.forum_upvotes,
    public.project_collaborations,
    public.collaboration_applications,
    public.study_groups,
    public.study_group_members,
    public.placement_experiences,
    public.alumni_directory,
    public.innovations,
    public.feature_waitlist,
    public.clubs;
COMMIT;

-- Custom SECURITY DEFINER function to allow admins to reset student passwords
CREATE OR REPLACE FUNCTION public.change_user_password_by_admin(target_user_id UUID, new_plain_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_requester_role TEXT;
BEGIN
  -- Get requester's role
  SELECT role INTO v_requester_role FROM public.users WHERE id = auth.uid();
  
  -- Check if requester is super_admin or admin/inst_admin
  IF v_requester_role IS NULL OR v_requester_role NOT IN ('super_admin', 'admin', 'inst_admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators can reset user passwords.';
  END IF;

  -- Update encrypted password in auth.users table using security definer privileges
  UPDATE auth.users
  SET encrypted_password = crypt(new_plain_password, gen_salt('bf', 10))
  WHERE id = target_user_id;

  -- Reset password set states so user is forced to re-initialize or knows it is changed
  UPDATE public.users 
  SET is_password_set = TRUE, first_login_completed = TRUE
  WHERE id = target_user_id;

  UPDATE public.students
  SET is_password_set = TRUE
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Custom SECURITY DEFINER function to allow super admin to create new users/admins
CREATE OR REPLACE FUNCTION public.create_new_user_by_admin(
  p_email TEXT, 
  p_password TEXT, 
  p_full_name TEXT, 
  p_role TEXT
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_requester_role TEXT;
BEGIN
  -- Get requester's role
  SELECT role INTO v_requester_role FROM public.users WHERE id = auth.uid();
  
  -- Check if requester is super_admin
  IF v_requester_role IS NULL OR v_requester_role != 'super_admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only super admins can create new administrative users.';
  END IF;

  v_user_id := uuid_generate_v4();

  -- Insert into auth.users (gen_salt('bf', 10) for standard Supabase bcrypt)
  INSERT INTO auth.users (
    id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    aud, 
    role
  )
  VALUES (
    v_user_id, 
    p_email, 
    crypt(p_password, gen_salt('bf', 10)), 
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('full_name', p_full_name, 'role', p_role), 
    'authenticated', 
    'authenticated'
  );

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


