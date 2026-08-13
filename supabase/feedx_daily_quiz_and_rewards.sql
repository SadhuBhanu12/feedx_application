-- ==============================================================================
-- FEEDX DAILY QUIZ & IDEMPOTENT REWARDS ENGINE SCHEMA
-- ==============================================================================

-- 1. ADD UNIQUE CONSTRAINT ON COIN TRANSACTIONS (IDEMPOTENCY)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_student_activity_ref'
    ) THEN
        ALTER TABLE public.coin_transactions
        ADD CONSTRAINT uq_student_activity_ref UNIQUE (student_id, activity_type, reference_id);
    END IF;
END $$;

-- 2. DAILY QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.daily_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
    title VARCHAR(150) NOT NULL DEFAULT 'FEEDX Daily Quiz',
    description TEXT DEFAULT 'Test your daily technical knowledge and earn 5 Gold Coins!',
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    total_questions INTEGER NOT NULL DEFAULT 10 CHECK (total_questions BETWEEN 1 AND 50),
    coins_reward INTEGER NOT NULL DEFAULT 5 CHECK (coins_reward > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DAILY QUIZ QUESTIONS TABLE (EXACTLY 10 MCQs PER QUIZ)
CREATE TABLE IF NOT EXISTS public.daily_quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.daily_quizzes(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL CHECK (question_number BETWEEN 1 AND 50),
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_quiz_question_num UNIQUE (quiz_id, question_number)
);

-- 4. DAILY QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.daily_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.daily_quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    current_question INTEGER NOT NULL DEFAULT 1 CHECK (current_question BETWEEN 1 AND 50),
    score INTEGER DEFAULT 0 CHECK (score >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED')),
    coins_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_quiz_attempt UNIQUE (user_id, quiz_id)
);

-- 5. DAILY QUIZ ANSWERS TABLE (ONE ANSWER PER QUESTION PER ATTEMPT)
CREATE TABLE IF NOT EXISTS public.daily_quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.daily_quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.daily_quiz_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    selected_option CHAR(1) NOT NULL CHECK (selected_option IN ('A', 'B', 'C', 'D')),
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id)
);

-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_quizzes_date ON public.daily_quizzes(quiz_date, status);
CREATE INDEX IF NOT EXISTS idx_quiz_questions ON public.daily_quiz_questions(quiz_id, question_number ASC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.daily_quiz_attempts(user_id, quiz_id, status);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.daily_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quiz_answers ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
DROP POLICY IF EXISTS "Students can view published quizzes" ON public.daily_quizzes;
CREATE POLICY "Students can view published quizzes"
    ON public.daily_quizzes FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Students can view published quiz questions" ON public.daily_quiz_questions;
CREATE POLICY "Students can view published quiz questions"
    ON public.daily_quiz_questions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.daily_quizzes q WHERE q.id = quiz_id AND q.status = 'published'
    ));

DROP POLICY IF EXISTS "Students can manage own quiz attempts" ON public.daily_quiz_attempts;
CREATE POLICY "Students can manage own quiz attempts"
    ON public.daily_quiz_attempts FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can manage own quiz answers" ON public.daily_quiz_answers;
CREATE POLICY "Students can manage own quiz answers"
    ON public.daily_quiz_answers FOR ALL
    USING (auth.uid() = user_id);

-- ==============================================================================
-- ATOMIC RPC FUNCTION: SUBMIT QUIZ ATTEMPT & AWARD COINS IDEMPOTENTLY
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.submit_daily_quiz_attempt(
    p_attempt_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_quiz_id UUID;
    v_user_id UUID;
    v_correct_count INT := 0;
    v_total_q INT := 10;
    v_coins_to_award INT := 5;
    v_status VARCHAR(20);
    v_result JSONB;
BEGIN
    -- Retrieve attempt details
    SELECT quiz_id, user_id, status INTO v_quiz_id, v_user_id, v_status
    FROM public.daily_quiz_attempts
    WHERE id = p_attempt_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quiz attempt not found';
    END IF;

    -- Fetch coin reward amount & total questions for this quiz dynamically
    SELECT coins_reward, total_questions INTO v_coins_to_award, v_total_q
    FROM public.daily_quizzes WHERE id = v_quiz_id;

    -- If already completed, return existing score
    IF v_status = 'COMPLETED' THEN
        SELECT score INTO v_correct_count FROM public.daily_quiz_attempts WHERE id = p_attempt_id;
        RETURN jsonb_build_object(
            'success', true,
            'already_completed', true,
            'score', v_correct_count,
            'total', v_total_q,
            'coins_awarded', v_coins_to_award
        );
    END IF;

    -- Calculate total correct answers
    SELECT COUNT(*) INTO v_correct_count
    FROM public.daily_quiz_answers a
    JOIN public.daily_quiz_questions q ON q.id = a.question_id
    WHERE a.attempt_id = p_attempt_id AND a.selected_option = q.correct_option;

    -- Update attempt record
    UPDATE public.daily_quiz_attempts
    SET status = 'COMPLETED',
        score = v_correct_count,
        completed_at = NOW(),
        coins_awarded = v_coins_to_award,
        updated_at = NOW()
    WHERE id = p_attempt_id;

    -- Award Gold Coins atomically (Idempotent via unique transaction constraint)
    PERFORM public.award_student_activity(
        v_user_id,
        'quiz_completed',
        v_coins_to_award,
        v_correct_count * 10,
        v_quiz_id::text
    );

    v_result := jsonb_build_object(
        'success', true,
        'already_completed', false,
        'score', v_correct_count,
        'total', v_total_q,
        'coins_awarded', v_coins_to_award
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- REALTIME REPLICATION FOR QUIZ TABLES
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_quizzes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_quiz_attempts;

-- ==============================================================================
-- SEED TODAY'S DAILY QUIZ (10 MCQs) IF NOT EXISTS
-- ==============================================================================
DO $$
DECLARE
    v_quiz_id UUID;
BEGIN
    INSERT INTO public.daily_quizzes (quiz_date, title, description, status, total_questions, coins_reward)
    VALUES (CURRENT_DATE, 'FEEDX Daily Engineering & Tech Quiz', 'Test your daily core concepts and earn 5 Gold Coins!', 'published', 10, 5)
    ON CONFLICT (quiz_date) DO UPDATE SET status = 'published'
    RETURNING id INTO v_quiz_id;

    IF v_quiz_id IS NOT NULL THEN
        -- Insert 10 Questions
        INSERT INTO public.daily_quiz_questions (quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
        VALUES
        (v_quiz_id, 1, 'Which protocol is used for secure encrypted web communication?', 'HTTP', 'HTTPS', 'FTP', 'SMTP', 'B', 'HTTPS uses TLS/SSL encryption to secure HTTP requests.'),
        (v_quiz_id, 2, 'What does CPU stand for in computer science?', 'Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Performance Utility', 'B', 'CPU stands for Central Processing Unit.'),
        (v_quiz_id, 3, 'Which data structure follows the First-In, First-Out (FIFO) principle?', 'Stack', 'Queue', 'Tree', 'Graph', 'B', 'A Queue follows FIFO where the first inserted item is removed first.'),
        (v_quiz_id, 4, 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?', 'O(1)', 'O(N)', 'O(log N)', 'O(N^2)', 'C', 'Searching in a balanced BST takes logarithmic O(log N) time.'),
        (v_quiz_id, 5, 'Which SQL command is used to remove a table entirely from a database?', 'DELETE', 'REMOVE', 'DROP', 'TRUNCATE', 'C', 'DROP TABLE permanently removes the table schema and data.'),
        (v_quiz_id, 6, 'What does HTML stand for?', 'Hyper Text Markup Language', 'High Technical Transfer Language', 'Hyper Transfer Machine Logic', 'Home Text Management Language', 'A', 'HTML stands for Hyper Text Markup Language.'),
        (v_quiz_id, 7, 'Which layer in the OSI model is responsible for IP routing?', 'Transport Layer', 'Network Layer', 'Data Link Layer', 'Physical Layer', 'B', 'The Network Layer handles IP addressing and routing.'),
        (v_quiz_id, 8, 'Which sorting algorithm has an average time complexity of O(N log N)?', 'Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort', 'C', 'Quick Sort has an average case performance of O(N log N).'),
        (v_quiz_id, 9, 'What is the primary function of RAM in a computing system?', 'Permanent Storage', 'Volatile Memory for Active Tasks', 'Network Routing', 'Power Distribution', 'B', 'RAM is volatile memory used to store temporary data for active programs.'),
        (v_quiz_id, 10, 'In Git version control, which command creates a new working branch?', 'git checkout -b', 'git commit', 'git push', 'git merge', 'A', 'git checkout -b <name> creates and switches to a new branch.')
        ON CONFLICT (quiz_id, question_number) DO NOTHING;
    END IF;
END $$;

-- EXPLICIT GRANTS FOR DAILY QUIZ TABLES & RPCs
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.daily_quizzes TO authenticated, anon;
GRANT ALL ON public.daily_quiz_questions TO authenticated, anon;
GRANT ALL ON public.daily_quiz_attempts TO authenticated;
GRANT ALL ON public.daily_quiz_answers TO authenticated;

GRANT EXECUTE ON FUNCTION public.submit_daily_quiz_attempt(UUID) TO authenticated, anon;

-- RELOAD SUPABASE POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
