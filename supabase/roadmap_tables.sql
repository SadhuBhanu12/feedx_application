-- FeedX Career Roadmap Database Schema

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

CREATE TABLE IF NOT EXISTS public.student_career_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_goal_id VARCHAR(64) REFERENCES public.career_roles(id),
  secondary_interests JSONB DEFAULT '[]'::jsonb,
  current_stage VARCHAR(64) DEFAULT 'Skill Building',
  target_company VARCHAR(128),
  study_hours_per_day INT DEFAULT 3,
  graduation_year INT DEFAULT 2026,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name VARCHAR(64) NOT NULL,
  level VARCHAR(32) CHECK (level IN ('Beginner', 'Basic', 'Intermediate', 'Advanced')),
  percentage INT DEFAULT 30,
  verified BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, skill_name)
);

CREATE TABLE IF NOT EXISTS public.student_roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  career_role_id VARCHAR(64) REFERENCES public.career_roles(id),
  completed_phase_ids JSONB DEFAULT '[]'::jsonb,
  completed_task_ids JSONB DEFAULT '[]'::jsonb,
  readiness_score INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, career_role_id)
);
