-- ==============================================================
-- FEEDX COMMUNITY & INNOVATION HUB DATABASE SCHEMA MIGRATION
-- ==============================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Community Posts (Student Feed)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_roll TEXT,
    author_role TEXT DEFAULT 'student',
    content TEXT NOT NULL,
    type TEXT DEFAULT 'general', -- achievement, certification, internship, project, holiday, activity, question
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Community Comments
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Community Likes Tracker
CREATE TABLE IF NOT EXISTS public.community_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id)
);

-- 4. Academic Discussions (Forum Questions)
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

-- 5. Forum Upvotes Tracker
CREATE TABLE IF NOT EXISTS public.forum_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.forum_questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    UNIQUE(question_id, user_id)
);

-- 6. Forum Replies
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.forum_questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Project Collaborations
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

-- 8. Collaboration Applications Tracker
CREATE TABLE IF NOT EXISTS public.collaboration_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collaboration_id UUID REFERENCES public.project_collaborations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    UNIQUE(collaboration_id, user_id)
);

-- 9. Study Groups
CREATE TABLE IF NOT EXISTS public.study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    members_count INTEGER DEFAULT 1,
    files_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Study Group Members
CREATE TABLE IF NOT EXISTS public.study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    UNIQUE(group_id, user_id)
);

-- 11. Placement Cell Experiences
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

-- 12. Student Marketplace Items
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

-- 13. Alumni Directory
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

-- 14. Innovation Hub Ideas (Replaces innovations/projects table)
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

-- ==============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & CONSTRAINTS
-- ==============================================================

-- Enable RLS on all tables
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.innovations ENABLE ROW LEVEL SECURITY;

-- 1. community_posts Policies
DROP POLICY IF EXISTS "Read community_posts all" ON public.community_posts;
CREATE POLICY "Read community_posts all" ON public.community_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert community_posts auth" ON public.community_posts;
CREATE POLICY "Insert community_posts auth" ON public.community_posts FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Update community_posts owner" ON public.community_posts;
CREATE POLICY "Update community_posts owner" ON public.community_posts FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Delete community_posts owner" ON public.community_posts;
CREATE POLICY "Delete community_posts owner" ON public.community_posts FOR DELETE USING (true);

-- 2. community_comments Policies
DROP POLICY IF EXISTS "Read community_comments all" ON public.community_comments;
CREATE POLICY "Read community_comments all" ON public.community_comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert community_comments auth" ON public.community_comments;
CREATE POLICY "Insert community_comments auth" ON public.community_comments FOR INSERT WITH CHECK (true);

-- 3. community_likes Policies
DROP POLICY IF EXISTS "Read community_likes all" ON public.community_likes;
CREATE POLICY "Read community_likes all" ON public.community_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert community_likes auth" ON public.community_likes;
CREATE POLICY "Insert community_likes auth" ON public.community_likes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Delete community_likes auth" ON public.community_likes;
CREATE POLICY "Delete community_likes auth" ON public.community_likes FOR DELETE USING (true);

-- 4. forum_questions Policies
DROP POLICY IF EXISTS "Read forum_questions all" ON public.forum_questions;
CREATE POLICY "Read forum_questions all" ON public.forum_questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert forum_questions auth" ON public.forum_questions;
CREATE POLICY "Insert forum_questions auth" ON public.forum_questions FOR INSERT WITH CHECK (true);

-- 5. forum_upvotes Policies
DROP POLICY IF EXISTS "Read forum_upvotes all" ON public.forum_upvotes;
CREATE POLICY "Read forum_upvotes all" ON public.forum_upvotes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert forum_upvotes auth" ON public.forum_upvotes;
CREATE POLICY "Insert forum_upvotes auth" ON public.forum_upvotes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Delete forum_upvotes auth" ON public.forum_upvotes;
CREATE POLICY "Delete forum_upvotes auth" ON public.forum_upvotes FOR DELETE USING (true);

-- 6. forum_replies Policies
DROP POLICY IF EXISTS "Read forum_replies all" ON public.forum_replies;
CREATE POLICY "Read forum_replies all" ON public.forum_replies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert forum_replies auth" ON public.forum_replies;
CREATE POLICY "Insert forum_replies auth" ON public.forum_replies FOR INSERT WITH CHECK (true);

-- 7. project_collaborations Policies
DROP POLICY IF EXISTS "Read project_collaborations all" ON public.project_collaborations;
CREATE POLICY "Read project_collaborations all" ON public.project_collaborations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert project_collaborations auth" ON public.project_collaborations;
CREATE POLICY "Insert project_collaborations auth" ON public.project_collaborations FOR INSERT WITH CHECK (true);

-- 8. collaboration_applications Policies
DROP POLICY IF EXISTS "Read collaboration_applications all" ON public.collaboration_applications;
CREATE POLICY "Read collaboration_applications all" ON public.collaboration_applications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert collaboration_applications auth" ON public.collaboration_applications;
CREATE POLICY "Insert collaboration_applications auth" ON public.collaboration_applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Delete collaboration_applications auth" ON public.collaboration_applications;
CREATE POLICY "Delete collaboration_applications auth" ON public.collaboration_applications FOR DELETE USING (true);

-- 9. study_groups Policies
DROP POLICY IF EXISTS "Read study_groups all" ON public.study_groups;
CREATE POLICY "Read study_groups all" ON public.study_groups FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert study_groups auth" ON public.study_groups;
CREATE POLICY "Insert study_groups auth" ON public.study_groups FOR INSERT WITH CHECK (true);

-- 10. study_group_members Policies
DROP POLICY IF EXISTS "Read study_group_members all" ON public.study_group_members;
CREATE POLICY "Read study_group_members all" ON public.study_group_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert study_group_members auth" ON public.study_group_members;
CREATE POLICY "Insert study_group_members auth" ON public.study_group_members FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Delete study_group_members auth" ON public.study_group_members;
CREATE POLICY "Delete study_group_members auth" ON public.study_group_members FOR DELETE USING (true);

-- 11. placement_experiences Policies
DROP POLICY IF EXISTS "Read placement_experiences all" ON public.placement_experiences;
CREATE POLICY "Read placement_experiences all" ON public.placement_experiences FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert placement_experiences auth" ON public.placement_experiences;
CREATE POLICY "Insert placement_experiences auth" ON public.placement_experiences FOR INSERT WITH CHECK (true);

-- 12. marketplace_items Policies
DROP POLICY IF EXISTS "Read marketplace_items all" ON public.marketplace_items;
CREATE POLICY "Read marketplace_items all" ON public.marketplace_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert marketplace_items auth" ON public.marketplace_items;
CREATE POLICY "Insert marketplace_items auth" ON public.marketplace_items FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Update marketplace_items owner" ON public.marketplace_items;
CREATE POLICY "Update marketplace_items owner" ON public.marketplace_items FOR UPDATE USING (true);

-- 13. alumni_directory Policies
DROP POLICY IF EXISTS "Read alumni_directory all" ON public.alumni_directory;
CREATE POLICY "Read alumni_directory all" ON public.alumni_directory FOR SELECT USING (true);

-- 14. Innovations (Innovation Hub) Policies
DROP POLICY IF EXISTS "Read innovations all" ON public.innovations;
CREATE POLICY "Read innovations all" ON public.innovations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert innovations auth" ON public.innovations;
CREATE POLICY "Insert innovations auth" ON public.innovations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Update innovations auth" ON public.innovations;
CREATE POLICY "Update innovations auth" ON public.innovations FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Delete innovations auth" ON public.innovations;
CREATE POLICY "Delete innovations auth" ON public.innovations FOR DELETE USING (true);

-- Grant privileges to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
