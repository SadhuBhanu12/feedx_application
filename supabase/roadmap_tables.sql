-- ============================================================================
-- FeedX Career Roadmap Database Schema & Anti-Abuse Server Functions
-- ============================================================================

-- 1. Career Roles Catalog
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

-- 2. Student Career Goals & Onboarding Information
CREATE TABLE IF NOT EXISTS public.student_career_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name VARCHAR(128),
  branch VARCHAR(128),
  academic_year VARCHAR(32) DEFAULT '1st Year', -- '1st Year', '2nd Year', 'Final Year'
  daily_learning_time VARCHAR(32) DEFAULT '1–2 hours', -- '< 1 hour', '1–2 hours', '3+ hours'
  career_goal VARCHAR(64) DEFAULT 'Job', -- 'Job', 'Government Job', 'Higher Studies', 'Startup / Business', 'Not Sure'
  selected_career_id VARCHAR(64) REFERENCES public.career_roles(id),
  target_company VARCHAR(128),
  career_selected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_career_switch_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  next_career_switch_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + INTERVAL '3 days'),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- Ensure newly added columns exist if table was already created
ALTER TABLE public.student_career_goals 
  ADD COLUMN IF NOT EXISTS student_name VARCHAR(128),
  ADD COLUMN IF NOT EXISTS branch VARCHAR(128),
  ADD COLUMN IF NOT EXISTS academic_year VARCHAR(32) DEFAULT '1st Year',
  ADD COLUMN IF NOT EXISTS daily_learning_time VARCHAR(32) DEFAULT '1–2 hours',
  ADD COLUMN IF NOT EXISTS career_goal VARCHAR(64) DEFAULT 'Job',
  ADD COLUMN IF NOT EXISTS selected_career_id VARCHAR(64),
  ADD COLUMN IF NOT EXISTS career_selected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS last_career_switch_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS next_career_switch_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + INTERVAL '3 days');

-- 3. Student Roadmap Progress & State Tracking
CREATE TABLE IF NOT EXISTS public.student_roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  career_role_id VARCHAR(64) REFERENCES public.career_roles(id),
  current_phase_id VARCHAR(64) DEFAULT 'phase-1',
  current_score INT DEFAULT 0,
  overall_progress INT DEFAULT 0,
  readiness_score INT DEFAULT 0,
  completed_phase_ids JSONB DEFAULT '[]'::jsonb,
  completed_task_ids JSONB DEFAULT '[]'::jsonb,
  phase_started_at JSONB DEFAULT '{}'::jsonb, -- Map of { [phase_id]: ISO timestamp }
  phase_completed_at JSONB DEFAULT '{}'::jsonb, -- Map of { [phase_id]: ISO timestamp }
  task_progress JSONB DEFAULT '{}'::jsonb, -- Map of { [task_id]: { completed: bool, completed_at: ISO timestamp } }
  quiz_scores JSONB DEFAULT '{}'::jsonb, -- Map of { [phase_id]: { score: number, passed: bool, attempted_at: ISO timestamp } }
  status VARCHAR(32) DEFAULT 'in_progress', -- 'in_progress', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, career_role_id)
);

ALTER TABLE public.student_roadmap_progress 
  ADD COLUMN IF NOT EXISTS current_phase_id VARCHAR(64) DEFAULT 'phase-1',
  ADD COLUMN IF NOT EXISTS current_score INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overall_progress INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS phase_started_at JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS phase_completed_at JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS task_progress JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS quiz_scores JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'in_progress';

-- 4. Enable RLS and Policies
ALTER TABLE public.career_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_roadmap_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can view career roles" ON public.career_roles;
  CREATE POLICY "Public can view career roles" ON public.career_roles FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Students view own career goals" ON public.student_career_goals;
  CREATE POLICY "Students view own career goals" ON public.student_career_goals FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Students manage own career goals" ON public.student_career_goals;
  CREATE POLICY "Students manage own career goals" ON public.student_career_goals FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Students view own roadmap progress" ON public.student_roadmap_progress;
  CREATE POLICY "Students view own roadmap progress" ON public.student_roadmap_progress FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Students update own roadmap progress" ON public.student_roadmap_progress;
  CREATE POLICY "Students update own roadmap progress" ON public.student_roadmap_progress FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ============================================================================
-- 5. Anti-Abuse Server Functions (RPC)
-- ============================================================================

-- Function: Select / Switch Student Career with Enforced 3-Day Window
CREATE OR REPLACE FUNCTION public.select_student_career(
  p_career_id VARCHAR(64),
  p_student_name VARCHAR(128) DEFAULT NULL,
  p_branch VARCHAR(128) DEFAULT NULL,
  p_academic_year VARCHAR(32) DEFAULT '1st Year',
  p_daily_learning_time VARCHAR(32) DEFAULT '1–2 hours',
  p_career_goal VARCHAR(64) DEFAULT 'Job',
  p_target_company VARCHAR(128) DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_existing RECORD;
  v_now TIMESTAMPTZ := timezone('utc'::text, now());
  v_next_switch TIMESTAMPTZ;
  v_started_map JSONB;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: User session required';
  END IF;

  -- Check existing career goal record
  SELECT * INTO v_existing FROM public.student_career_goals WHERE user_id = v_user_id;

  IF v_existing IS NOT NULL AND v_existing.selected_career_id IS NOT NULL AND v_existing.selected_career_id <> p_career_id THEN
    -- Check if 3 days have elapsed since last switch
    IF v_existing.next_career_switch_at IS NOT NULL AND v_now < v_existing.next_career_switch_at THEN
      RAISE EXCEPTION 'Career switch locked: You can switch to another career only after %', v_existing.next_career_switch_at;
    END IF;
  END IF;

  v_next_switch := v_now + INTERVAL '3 days';

  -- Upsert career goal
  INSERT INTO public.student_career_goals (
    user_id,
    student_name,
    branch,
    academic_year,
    daily_learning_time,
    career_goal,
    selected_career_id,
    target_company,
    career_selected_at,
    last_career_switch_at,
    next_career_switch_at,
    updated_at
  ) VALUES (
    v_user_id,
    COALESCE(p_student_name, v_existing.student_name, 'Student'),
    COALESCE(p_branch, v_existing.branch, 'Engineering'),
    COALESCE(p_academic_year, v_existing.academic_year, '1st Year'),
    COALESCE(p_daily_learning_time, v_existing.daily_learning_time, '1–2 hours'),
    COALESCE(p_career_goal, v_existing.career_goal, 'Job'),
    p_career_id,
    COALESCE(p_target_company, v_existing.target_company, 'Top Tech Companies'),
    v_now,
    v_now,
    v_next_switch,
    v_now
  )
  ON CONFLICT (user_id) DO UPDATE SET
    student_name = EXCLUDED.student_name,
    branch = EXCLUDED.branch,
    academic_year = EXCLUDED.academic_year,
    daily_learning_time = EXCLUDED.daily_learning_time,
    career_goal = EXCLUDED.career_goal,
    selected_career_id = EXCLUDED.selected_career_id,
    target_company = EXCLUDED.target_company,
    career_selected_at = CASE WHEN student_career_goals.selected_career_id = EXCLUDED.selected_career_id THEN student_career_goals.career_selected_at ELSE v_now END,
    last_career_switch_at = CASE WHEN student_career_goals.selected_career_id = EXCLUDED.selected_career_id THEN student_career_goals.last_career_switch_at ELSE v_now END,
    next_career_switch_at = CASE WHEN student_career_goals.selected_career_id = EXCLUDED.selected_career_id THEN student_career_goals.next_career_switch_at ELSE v_next_switch END,
    updated_at = v_now;

  -- Initialize roadmap progress if not exists
  v_started_map := jsonb_build_object('phase-1', to_jsonb(v_now));
  INSERT INTO public.student_roadmap_progress (
    user_id,
    career_role_id,
    current_phase_id,
    current_score,
    overall_progress,
    readiness_score,
    completed_phase_ids,
    completed_task_ids,
    phase_started_at,
    phase_completed_at,
    task_progress,
    quiz_scores,
    status,
    updated_at
  ) VALUES (
    v_user_id,
    p_career_id,
    'phase-1',
    0,
    0,
    0,
    '[]'::jsonb,
    '[]'::jsonb,
    v_started_map,
    '{}'::jsonb,
    '{}'::jsonb,
    '{}'::jsonb,
    'in_progress',
    v_now
  )
  ON CONFLICT (user_id, career_role_id) DO UPDATE SET
    updated_at = v_now;

  RETURN jsonb_build_object(
    'success', true,
    'career_id', p_career_id,
    'last_career_switch_at', v_now,
    'next_career_switch_at', v_next_switch
  );
END;
$$;

-- Function: Complete Phase with Enforced 24-Hour Progression Window
CREATE OR REPLACE FUNCTION public.complete_roadmap_phase(
  p_career_id VARCHAR(64),
  p_phase_id VARCHAR(64),
  p_total_phases INT DEFAULT 6
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_progress RECORD;
  v_now TIMESTAMPTZ := timezone('utc'::text, now());
  v_phase_start_str TEXT;
  v_phase_start TIMESTAMPTZ;
  v_completed_phases JSONB;
  v_phase_started_map JSONB;
  v_phase_completed_map JSONB;
  v_next_phase_id TEXT;
  v_new_score INT;
  v_new_progress INT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO v_progress 
  FROM public.student_roadmap_progress 
  WHERE user_id = v_user_id AND career_role_id = p_career_id;

  IF v_progress IS NULL THEN
    RAISE EXCEPTION 'Roadmap progress not found for user';
  END IF;

  -- 1. Check phase started timestamp
  v_phase_started_map := COALESCE(v_progress.phase_started_at, '{}'::jsonb);
  v_phase_start_str := v_phase_started_map ->> p_phase_id;

  IF v_phase_start_str IS NULL THEN
    -- If not marked started, set started now and reject immediate completion
    v_phase_started_map := jsonb_set(v_phase_started_map, ARRAY[p_phase_id], to_jsonb(v_now));
    UPDATE public.student_roadmap_progress
    SET phase_started_at = v_phase_started_map, updated_at = v_now
    WHERE id = v_progress.id;
    
    RAISE EXCEPTION 'Phase started now. Minimum 24 hours required for phase completion.';
  END IF;

  v_phase_start := v_phase_start_str::TIMESTAMPTZ;

  -- 2. Anti-Abuse: Check 24-Hour Rule
  IF v_now < (v_phase_start + INTERVAL '24 hours') THEN
    RAISE EXCEPTION 'Minimum 24 hours study requirement not met. Phase can be completed after %', (v_phase_start + INTERVAL '24 hours');
  END IF;

  -- 3. Check if already completed
  v_completed_phases := COALESCE(v_progress.completed_phase_ids, '[]'::jsonb);
  IF v_completed_phases ? p_phase_id THEN
    RETURN jsonb_build_object('success', true, 'already_completed', true, 'current_score', v_progress.current_score);
  END IF;

  -- 4. Mark completed and unlock next phase
  v_completed_phases := v_completed_phases || jsonb_build_array(p_phase_id);
  v_phase_completed_map := COALESCE(v_progress.phase_completed_at, '{}'::jsonb);
  v_phase_completed_map := jsonb_set(v_phase_completed_map, ARRAY[p_phase_id], to_jsonb(v_now));

  -- Calculate score & overall progress
  v_new_progress := Math_round_pct(jsonb_array_length(v_completed_phases), p_total_phases);
  v_new_score := v_new_progress;

  UPDATE public.student_roadmap_progress
  SET 
    completed_phase_ids = v_completed_phases,
    phase_completed_at = v_phase_completed_map,
    current_score = v_new_score,
    overall_progress = v_new_progress,
    readiness_score = v_new_score,
    updated_at = v_now
  WHERE id = v_progress.id;

  RETURN jsonb_build_object(
    'success', true,
    'phase_id', p_phase_id,
    'completed_at', v_now,
    'current_score', v_new_score,
    'overall_progress', v_new_progress,
    'completed_phases', v_completed_phases
  );
END;
$$;

-- Helper calculation function
CREATE OR REPLACE FUNCTION public.Math_round_pct(completed_count INT, total_count INT)
RETURNS INT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF total_count <= 0 THEN RETURN 0; END IF;
  RETURN LEAST(100, GREATEST(0, ROUND((completed_count::NUMERIC / total_count::NUMERIC) * 100)));
END;
$$;
