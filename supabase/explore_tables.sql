-- FeedX Explore Hub & Micro-Learning Database Schema

-- 1. Quick Learn Categories & Lessons
CREATE TABLE IF NOT EXISTS public.quick_learn_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  branch VARCHAR(64) DEFAULT 'CSE',
  category VARCHAR(64) DEFAULT 'Programming',
  difficulty VARCHAR(32) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  estimated_minutes INT DEFAULT 2,
  is_recommended BOOLEAN DEFAULT TRUE,
  fx_reward INT DEFAULT 10,
  short_description TEXT,
  content_markdown TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Quick Learn Knowledge Checks
CREATE TABLE IF NOT EXISTS public.quick_learn_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.quick_learn_lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option VARCHAR(1) CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Student Quick Learn Progress
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.quick_learn_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT TRUE,
  score INT DEFAULT 100,
  fx_awarded INT DEFAULT 10,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, lesson_id)
);

-- 4. Explore Quizzes
CREATE TABLE IF NOT EXISTS public.explore_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(64) DEFAULT 'General',
  branch VARCHAR(64) DEFAULT 'CSE',
  difficulty VARCHAR(32) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  question_count INT DEFAULT 5,
  estimated_minutes INT DEFAULT 3,
  fx_reward INT DEFAULT 15,
  is_daily BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Explore Quiz Questions
CREATE TABLE IF NOT EXISTS public.explore_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.explore_quizzes(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option VARCHAR(1) CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Student Quiz Attempts
CREATE TABLE IF NOT EXISTS public.explore_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.explore_quizzes(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  percentage INT NOT NULL,
  fx_awarded INT DEFAULT 0,
  is_first_completion BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. FX Ledger Transactions
CREATE TABLE IF NOT EXISTS public.fx_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  source_type VARCHAR(64) NOT NULL,
  source_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS & Security Policies
ALTER TABLE public.quick_learn_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_learn_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fx_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public published lessons readable" ON public.quick_learn_lessons;
CREATE POLICY "Public published lessons readable" ON public.quick_learn_lessons FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public quick learn checks readable" ON public.quick_learn_checks;
CREATE POLICY "Public quick learn checks readable" ON public.quick_learn_checks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Student read own lesson progress" ON public.student_lesson_progress;
CREATE POLICY "Student read own lesson progress" ON public.student_lesson_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Student insert own lesson progress" ON public.student_lesson_progress;
CREATE POLICY "Student insert own lesson progress" ON public.student_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public published quizzes readable" ON public.explore_quizzes;
CREATE POLICY "Public published quizzes readable" ON public.explore_quizzes FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public quiz questions readable" ON public.explore_quiz_questions;
CREATE POLICY "Public quiz questions readable" ON public.explore_quiz_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Student read own quiz attempts" ON public.explore_quiz_attempts;
CREATE POLICY "Student read own quiz attempts" ON public.explore_quiz_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Student insert own quiz attempts" ON public.explore_quiz_attempts;
CREATE POLICY "Student insert own quiz attempts" ON public.explore_quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Student read own fx transactions" ON public.fx_transactions;
CREATE POLICY "Student read own fx transactions" ON public.fx_transactions FOR SELECT USING (auth.uid() = user_id);

-- Grants
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.quick_learn_lessons TO authenticated, anon;
GRANT ALL ON public.quick_learn_checks TO authenticated, anon;
GRANT ALL ON public.student_lesson_progress TO authenticated, anon;
GRANT ALL ON public.explore_quizzes TO authenticated, anon;
GRANT ALL ON public.explore_quiz_questions TO authenticated, anon;
GRANT ALL ON public.explore_quiz_attempts TO authenticated, anon;
GRANT ALL ON public.fx_transactions TO authenticated, anon;

