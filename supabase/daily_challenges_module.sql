-- =========================================================
-- FEEDX — DAILY CHALLENGES MODULE (FULL SCHEMA & SEED)
-- =========================================================

-- 1. Daily Challenges Table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Programming', -- 'Programming', 'Aptitude', 'Career', 'Communication', 'General Knowledge', 'Academic'
    subcategory VARCHAR(50) DEFAULT 'Java',
    challenge_type VARCHAR(30) NOT NULL DEFAULT 'mcq', -- 'mcq', 'true_false', 'fill_blank', 'code_output', 'coding', 'short_answer'
    difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
    xp_reward INTEGER NOT NULL DEFAULT 20,
    estimated_minutes INTEGER NOT NULL DEFAULT 5,
    question TEXT NOT NULL,
    options JSONB, -- e.g. ["Stack", "Queue", "Tree", "Graph"]
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    code_snippet TEXT,
    test_cases JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'Published', -- 'Draft', 'Scheduled', 'Published', 'Archived'
    target_branch TEXT DEFAULT 'All',
    target_year TEXT DEFAULT 'All',
    target_college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    publish_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Challenge Attempts Table
CREATE TABLE IF NOT EXISTS public.challenge_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    answer TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0, -- Percentage 0-100
    is_correct BOOLEAN NOT NULL DEFAULT false,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Completed', -- 'In_Progress', 'Completed', 'Expired'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Student Challenge Progress Table
CREATE TABLE IF NOT EXISTS public.student_challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'Completed',
    score INTEGER NOT NULL DEFAULT 100,
    xp_earned INTEGER NOT NULL DEFAULT 20,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, challenge_id)
);

-- 4. Student Streaks Table
CREATE TABLE IF NOT EXISTS public.student_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_completed_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. XP Transactions Table
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL DEFAULT 'daily_challenge', -- 'daily_challenge', 'quiz', 'streak_bonus'
    source_id UUID,
    xp_amount INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS Policies
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Grants & Policies
DROP POLICY IF EXISTS "Public view challenges" ON public.daily_challenges;
CREATE POLICY "Public view challenges" ON public.daily_challenges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full manage challenges" ON public.daily_challenges;
CREATE POLICY "Admins full manage challenges" ON public.daily_challenges FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Students view own attempts" ON public.challenge_attempts;
CREATE POLICY "Students view own attempts" ON public.challenge_attempts FOR ALL USING (true);

DROP POLICY IF EXISTS "Students view own progress" ON public.student_challenge_progress;
CREATE POLICY "Students view own progress" ON public.student_challenge_progress FOR ALL USING (true);

DROP POLICY IF EXISTS "Students view own streaks" ON public.student_streaks;
CREATE POLICY "Students view own streaks" ON public.student_streaks FOR ALL USING (true);

DROP POLICY IF EXISTS "Students view own xp" ON public.xp_transactions;
CREATE POLICY "Students view own xp" ON public.xp_transactions FOR ALL USING (true);

GRANT ALL ON public.daily_challenges TO authenticated, anon;
GRANT ALL ON public.challenge_attempts TO authenticated, anon;
GRANT ALL ON public.student_challenge_progress TO authenticated, anon;
GRANT ALL ON public.student_streaks TO authenticated, anon;
GRANT ALL ON public.xp_transactions TO authenticated, anon;

-- SEED PRODUCTION READY DAILY CHALLENGES
INSERT INTO public.daily_challenges (title, description, category, subcategory, challenge_type, difficulty, xp_reward, estimated_minutes, question, options, correct_answer, explanation, code_snippet, status) VALUES
(
    'Find First Non-Repeating Character',
    'Given a string of lowercase English letters, find the index of the first non-repeating character in it. If it does not exist, return -1.',
    'Programming',
    'Data Structures',
    'code_output',
    'Medium',
    20,
    5,
    'What will be the output of searching first non-repeating character in string "swiss"?',
    '["s", "w", "i", "-1"]'::jsonb,
    'w',
    'Character "s" appears 3 times. The next character "w" appears only once at index 1.',
    'public class Solution {\n  public static char firstUniqChar(String s) {\n    int[] freq = new int[26];\n    for (char c : s.toCharArray()) freq[c - ''a'']++;\n    for (char c : s.toCharArray()) {\n      if (freq[c - ''a''] == 1) return c;\n    }\n    return ''-'';\n  }\n}',
    'Published'
),
(
    'Queue Data Structure FIFO Principle',
    'Which fundamental data structure uses the First In First Out (FIFO) property for processing elements?',
    'Programming',
    'Data Structures',
    'mcq',
    'Easy',
    10,
    3,
    'Which data structure uses the FIFO principle?',
    '["Stack", "Queue", "Tree", "Graph"]'::jsonb,
    'Queue',
    'A Queue removes elements in the exact order they were added (First In, First Out). Stack uses LIFO.',
    NULL,
    'Published'
),
(
    'Quantitative Aptitude: Speed & Distance',
    'A train traveling at 60 km/h crosses a 200m long platform in 18 seconds. Find the length of the train.',
    'Aptitude',
    'Quantitative',
    'mcq',
    'Medium',
    20,
    5,
    'What is the length of the train in meters?',
    '["100m", "150m", "200m", "250m"]'::jsonb,
    '100m',
    'Speed in m/s = 60 * 5/18 = 50/3 m/s. Distance covered in 18s = 50/3 * 18 = 300m. Train length = 300 - 200 = 100m.',
    NULL,
    'Published'
),
(
    'Technical HR Interview Readiness',
    'When asked "Tell me about a time you faced a technical obstacle", which framework produces the strongest response?',
    'Career',
    'HR Interview',
    'mcq',
    'Easy',
    10,
    3,
    'Which behavioral response framework is best?',
    '["SWOT Method", "STAR Method (Situation, Task, Action, Result)", "SMART Criteria", "PESTEL Analysis"]'::jsonb,
    'STAR Method (Situation, Task, Action, Result)',
    'The STAR method provides a structured narrative describing the Situation, Task required, Action you took, and measurable Result achieved.',
    NULL,
    'Published'
);
