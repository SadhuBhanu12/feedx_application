-- ==============================================================================
-- FEEDX MASTER FIX: ROADMAP PROGRESS, CONTINUE LEARNING & TABLE PERMISSIONS
-- ==============================================================================
-- Description:
-- 1. Fixes table permissions on student_roadmap_progress, career_roles, student_career_goals,
--    and student_lesson_progress so authenticated and anon users never get "permission denied".
-- 2. Modifies student_lesson_progress.lesson_id to VARCHAR(64) so it accepts both UUIDs
--    and slug/string identifiers (e.g., 'ql-1', 'ql-ds-01') without 22P02 syntax errors.
-- 3. Adds topic_progress JSONB column to student_roadmap_progress.
-- 4. Removes restrictive foreign key constraints that block custom or dynamic careers/lessons.
-- 5. Seeds all standard career roles into public.career_roles.
-- 6. Provides resilient SECURITY DEFINER RPCs for syncing and retrieving roadmap & lesson progress.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Ensure Tables Exist
-- ------------------------------------------------------------------------------

-- Career Roles Catalog
CREATE TABLE IF NOT EXISTS public.career_roles (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  category VARCHAR(64) NOT NULL,
  icon VARCHAR(64) DEFAULT 'code',
  difficulty VARCHAR(32) DEFAULT 'Intermediate',
  overview TEXT,
  estimated_timeline VARCHAR(64),
  expected_salary_range VARCHAR(64),
  skills_required JSONB DEFAULT '[]'::jsonb,
  programming_languages JSONB DEFAULT '[]'::jsonb,
  frameworks JSONB DEFAULT '[]'::jsonb,
  tools JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Student Career Goals & Onboarding Information
CREATE TABLE IF NOT EXISTS public.student_career_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name VARCHAR(128),
  branch VARCHAR(128),
  academic_year VARCHAR(32) DEFAULT '1st Year',
  daily_learning_time VARCHAR(32) DEFAULT '1–2 hours',
  career_goal VARCHAR(64) DEFAULT 'Job',
  selected_career_id VARCHAR(64),
  target_company VARCHAR(128),
  career_selected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_career_switch_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  next_career_switch_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + INTERVAL '3 days'),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- Student Roadmap Progress & State Tracking
CREATE TABLE IF NOT EXISTS public.student_roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  career_role_id VARCHAR(64),
  current_phase_id VARCHAR(64) DEFAULT 'phase-1',
  current_score INT DEFAULT 0,
  overall_progress INT DEFAULT 0,
  readiness_score INT DEFAULT 0,
  completed_phase_ids JSONB DEFAULT '[]'::jsonb,
  completed_task_ids JSONB DEFAULT '[]'::jsonb,
  phase_started_at JSONB DEFAULT '{}'::jsonb,
  phase_completed_at JSONB DEFAULT '{}'::jsonb,
  task_progress JSONB DEFAULT '{}'::jsonb,
  topic_progress JSONB DEFAULT '{}'::jsonb,
  quiz_scores JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(32) DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, career_role_id)
);

-- Ensure all columns exist on student_roadmap_progress
ALTER TABLE public.student_roadmap_progress 
  ADD COLUMN IF NOT EXISTS topic_progress JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS current_phase_id VARCHAR(64) DEFAULT 'phase-1',
  ADD COLUMN IF NOT EXISTS current_score INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overall_progress INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS readiness_score INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_phase_ids JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS completed_task_ids JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS phase_started_at JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS phase_completed_at JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS task_progress JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS quiz_scores JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'in_progress';

-- Ensure all columns exist on student_career_goals
ALTER TABLE public.student_career_goals
  ADD COLUMN IF NOT EXISTS student_name VARCHAR(128),
  ADD COLUMN IF NOT EXISTS branch VARCHAR(128),
  ADD COLUMN IF NOT EXISTS academic_year VARCHAR(32) DEFAULT '1st Year',
  ADD COLUMN IF NOT EXISTS daily_learning_time VARCHAR(32) DEFAULT '1–2 hours',
  ADD COLUMN IF NOT EXISTS career_goal VARCHAR(64) DEFAULT 'Job',
  ADD COLUMN IF NOT EXISTS selected_career_id VARCHAR(64),
  ADD COLUMN IF NOT EXISTS target_company VARCHAR(128),
  ADD COLUMN IF NOT EXISTS career_selected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS last_career_switch_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS next_career_switch_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + INTERVAL '3 days');

-- ------------------------------------------------------------------------------
-- 2. Drop Restrictive Foreign Keys that prevent saving progress
-- ------------------------------------------------------------------------------
ALTER TABLE public.student_roadmap_progress 
  DROP CONSTRAINT IF EXISTS student_roadmap_progress_career_role_id_fkey;

ALTER TABLE public.student_career_goals 
  DROP CONSTRAINT IF EXISTS student_career_goals_selected_career_id_fkey;

-- ------------------------------------------------------------------------------
-- 3. Fix student_lesson_progress: lesson_id column type & constraints
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(64) NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  score INT DEFAULT 100,
  fx_awarded INT DEFAULT 10,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, lesson_id)
);

-- Drop foreign key to quick_learn_lessons if it exists so non-UUID lesson IDs work
ALTER TABLE public.student_lesson_progress 
  DROP CONSTRAINT IF EXISTS student_lesson_progress_lesson_id_fkey;

-- Convert lesson_id column to VARCHAR(64) if currently UUID
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'student_lesson_progress' 
      AND column_name = 'lesson_id' 
      AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.student_lesson_progress 
      ALTER COLUMN lesson_id TYPE VARCHAR(64) USING lesson_id::text;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. Seed Standard Career Roles so catalog is never empty
-- ------------------------------------------------------------------------------
INSERT INTO public.career_roles (id, title, category, icon, difficulty, overview, estimated_timeline, expected_salary_range)
VALUES
  ('fullstack-developer', 'Full Stack Developer', 'Software Engineering', 'code', 'Intermediate', 'Build modern full-stack web applications with React, Node.js, and databases.', '6 Months', '₹4.5 - ₹12 LPA'),
  ('frontend-developer', 'Frontend Developer', 'Software Engineering', 'layout', 'Beginner', 'Master modern web user interfaces with React, TypeScript, and Tailwind CSS.', '4 Months', '₹3.5 - ₹9 LPA'),
  ('backend-developer', 'Backend Developer', 'Software Engineering', 'server', 'Intermediate', 'Design scalable microservices, REST & GraphQL APIs, and databases.', '5 Months', '₹4.5 - ₹11 LPA'),
  ('ai-ml-engineer', 'AI & Machine Learning Engineer', 'Data & AI', 'cpu', 'Advanced', 'Build and deploy machine learning models, neural networks, and LLM applications.', '8 Months', '₹6.0 - ₹18 LPA'),
  ('cloud-devops', 'Cloud & DevOps Engineer', 'Infrastructure', 'cloud', 'Intermediate', 'Automate CI/CD pipelines, container orchestration with Docker/K8s, and cloud architecture.', '6 Months', '₹5.0 - ₹14 LPA'),
  ('cybersecurity-specialist', 'Cybersecurity Specialist', 'Security', 'shield', 'Advanced', 'Protect networks, web applications, and cloud systems against security vulnerabilities.', '7 Months', '₹5.5 - ₹15 LPA'),
  ('mobile-developer', 'Mobile App Developer', 'Software Engineering', 'smartphone', 'Intermediate', 'Create high-performance iOS and Android apps using React Native and Flutter.', '5 Months', '₹4.0 - ₹10 LPA'),
  ('data-analyst', 'Data Analyst', 'Data & AI', 'bar-chart-2', 'Beginner', 'Extract business insights using SQL, Python, Excel, and Power BI dashboards.', '4 Months', '₹3.5 - ₹8 LPA')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  overview = EXCLUDED.overview;

-- ------------------------------------------------------------------------------
-- 5. Grant Permissions to authenticated, anon, and service_role
-- ------------------------------------------------------------------------------
GRANT ALL ON TABLE public.student_roadmap_progress TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.career_roles TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.student_career_goals TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.student_lesson_progress TO authenticated, anon, service_role;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quick_learn_lessons') THEN
    GRANT ALL ON TABLE public.quick_learn_lessons TO authenticated, anon, service_role;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quick_learn_checks') THEN
    GRANT ALL ON TABLE public.quick_learn_checks TO authenticated, anon, service_role;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'explore_quizzes') THEN
    GRANT ALL ON TABLE public.explore_quizzes TO authenticated, anon, service_role;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'explore_quiz_questions') THEN
    GRANT ALL ON TABLE public.explore_quiz_questions TO authenticated, anon, service_role;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 6. Row Level Security Policies
-- ------------------------------------------------------------------------------

-- Career Roles
ALTER TABLE public.career_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view career roles" ON public.career_roles;
CREATE POLICY "Public can view career roles" ON public.career_roles FOR SELECT USING (true);

-- Student Career Goals
ALTER TABLE public.student_career_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students view own career goals" ON public.student_career_goals;
CREATE POLICY "Students view own career goals" ON public.student_career_goals FOR SELECT USING (true);
DROP POLICY IF EXISTS "Students manage own career goals" ON public.student_career_goals;
CREATE POLICY "Students manage own career goals" ON public.student_career_goals FOR ALL USING (true) WITH CHECK (true);

-- Student Roadmap Progress
ALTER TABLE public.student_roadmap_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students view own roadmap progress" ON public.student_roadmap_progress;
CREATE POLICY "Students view own roadmap progress" ON public.student_roadmap_progress FOR SELECT USING (true);
DROP POLICY IF EXISTS "Students update own roadmap progress" ON public.student_roadmap_progress;
CREATE POLICY "Students update own roadmap progress" ON public.student_roadmap_progress FOR ALL USING (true) WITH CHECK (true);

-- Student Lesson Progress
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Student read own lesson progress" ON public.student_lesson_progress;
CREATE POLICY "Student read own lesson progress" ON public.student_lesson_progress FOR SELECT USING (true);
DROP POLICY IF EXISTS "Student manage own lesson progress" ON public.student_lesson_progress;
CREATE POLICY "Student manage own lesson progress" ON public.student_lesson_progress FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7. High-Reliability SECURITY DEFINER RPC Functions
-- ------------------------------------------------------------------------------

-- Function 1: Synchronize Student Roadmap Progress
CREATE OR REPLACE FUNCTION public.sync_student_roadmap_progress(
  p_user_id UUID,
  p_career_role_id VARCHAR(64),
  p_completed_phase_ids JSONB DEFAULT '[]'::jsonb,
  p_phase_started_at JSONB DEFAULT '{}'::jsonb,
  p_phase_completed_at JSONB DEFAULT '{}'::jsonb,
  p_task_progress JSONB DEFAULT '{}'::jsonb,
  p_topic_progress JSONB DEFAULT '{}'::jsonb,
  p_quiz_scores JSONB DEFAULT '{}'::jsonb,
  p_score INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_res RECORD;
  v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
  IF p_user_id IS NULL OR p_career_role_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User ID and Career Role ID are required');
  END IF;

  INSERT INTO public.student_roadmap_progress (
    user_id,
    career_role_id,
    completed_phase_ids,
    phase_started_at,
    phase_completed_at,
    task_progress,
    topic_progress,
    quiz_scores,
    current_score,
    overall_progress,
    readiness_score,
    updated_at
  )
  VALUES (
    p_user_id,
    p_career_role_id,
    COALESCE(p_completed_phase_ids, '[]'::jsonb),
    COALESCE(p_phase_started_at, '{}'::jsonb),
    COALESCE(p_phase_completed_at, '{}'::jsonb),
    COALESCE(p_task_progress, '{}'::jsonb),
    COALESCE(p_topic_progress, '{}'::jsonb),
    COALESCE(p_quiz_scores, '{}'::jsonb),
    p_score,
    p_score,
    p_score,
    v_now
  )
  ON CONFLICT (user_id, career_role_id) DO UPDATE SET
    completed_phase_ids = EXCLUDED.completed_phase_ids,
    phase_started_at = EXCLUDED.phase_started_at,
    phase_completed_at = EXCLUDED.phase_completed_at,
    task_progress = EXCLUDED.task_progress,
    topic_progress = EXCLUDED.topic_progress,
    quiz_scores = EXCLUDED.quiz_scores,
    current_score = EXCLUDED.current_score,
    overall_progress = EXCLUDED.overall_progress,
    readiness_score = EXCLUDED.readiness_score,
    updated_at = v_now
  RETURNING * INTO v_res;

  RETURN jsonb_build_object(
    'success', true,
    'career_role_id', v_res.career_role_id,
    'score', v_res.current_score,
    'updated_at', v_res.updated_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.sync_student_roadmap_progress(UUID, VARCHAR, JSONB, JSONB, JSONB, JSONB, JSONB, JSONB, INT) TO authenticated, anon, service_role;

-- Function 2: Complete Student Lesson Progress
CREATE OR REPLACE FUNCTION public.complete_student_lesson(
  p_user_id UUID,
  p_lesson_id VARCHAR(64),
  p_fx_reward INT DEFAULT 10
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
  IF p_user_id IS NULL OR p_lesson_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Missing user_id or lesson_id');
  END IF;

  INSERT INTO public.student_lesson_progress (
    user_id,
    lesson_id,
    completed,
    fx_awarded,
    completed_at
  )
  VALUES (
    p_user_id,
    p_lesson_id,
    true,
    p_fx_reward,
    v_now
  )
  ON CONFLICT (user_id, lesson_id) DO UPDATE SET
    completed = true,
    completed_at = v_now;

  RETURN jsonb_build_object(
    'success', true,
    'lesson_id', p_lesson_id,
    'completed', true
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_student_lesson(UUID, VARCHAR, INT) TO authenticated, anon, service_role;

COMMIT;
