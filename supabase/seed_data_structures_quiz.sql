-- ==============================================================================
-- FEEDX SEED SCRIPT: 10-MCQ DATA STRUCTURES DAILY QUIZ (WITH SCHEMA CREATION)
-- ==============================================================================

-- 1. Ensure public.daily_quizzes table exists
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

-- 2. Ensure public.daily_quiz_questions table exists
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

-- 3. Ensure public.daily_quiz_attempts table exists
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

-- 4. Ensure public.daily_quiz_answers table exists
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

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.daily_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quiz_answers ENABLE ROW LEVEL SECURITY;

-- 6. Setup RLS Policies
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

-- 7. Grant Permissions to authenticated and anon roles
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.daily_quizzes TO authenticated, anon;
GRANT ALL ON public.daily_quiz_questions TO authenticated, anon;
GRANT ALL ON public.daily_quiz_attempts TO authenticated;
GRANT ALL ON public.daily_quiz_answers TO authenticated;

-- 8. Create Atomic submit_daily_quiz_attempt RPC Function
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

GRANT EXECUTE ON FUNCTION public.submit_daily_quiz_attempt(UUID) TO authenticated, anon;

-- 9. Notify PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';

-- 10. Insert/Update today's quiz details and populate the 10 Data Structures MCQs
DO $$
DECLARE
    v_quiz_id UUID;
BEGIN
    -- Create the Daily Quiz header for today
    INSERT INTO public.daily_quizzes (quiz_date, title, description, status, total_questions, coins_reward)
    VALUES (
        CURRENT_DATE, 
        'Data Structures & Algorithms Challenge', 
        'Test your core knowledge on Arrays, Linked Lists, Stacks, Queues, Graphs, Trees, and Heaps to earn +5 Tokens!', 
        'published', 
        10, 
        5
    )
    ON CONFLICT (quiz_date) 
    DO UPDATE SET 
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        status = 'published'
    RETURNING id INTO v_quiz_id;

    -- Delete any existing questions for today's quiz to avoid duplicates
    DELETE FROM public.daily_quiz_questions WHERE quiz_id = v_quiz_id;

    -- Insert the 10 Data Structures Questions
    INSERT INTO public.daily_quiz_questions (
        quiz_id, 
        question_number, 
        question_text, 
        option_a, 
        option_b, 
        option_c, 
        option_d, 
        correct_option, 
        explanation
    )
    VALUES
    (
        v_quiz_id, 
        1, 
        'What is the worst-case time complexity of accessing an element in a Singly Linked List of size N?', 
        'O(1)', 
        'O(log N)', 
        'O(N)', 
        'O(N log N)', 
        'C', 
        'In a singly linked list, elements are accessed by traversing node-by-node from the head, resulting in O(N) operations in the worst case.'
    ),
    (
        v_quiz_id, 
        2, 
        'Which data structure uses Last-In, First-Out (LIFO) ordering principles?', 
        'Queue', 
        'Stack', 
        'Heap', 
        'Array List', 
        'B', 
        'Stacks operate on a Last-In, Fst-Out (LIFO) order where the last pushed element is the first one popped.'
    ),
    (
        v_quiz_id, 
        3, 
        'What is the primary advantage of a Hash Table over an Array for search operations?', 
        'Uses less memory footprint', 
        'Average-case constant time O(1) search complexity', 
        'Keeps elements in sorted order', 
        'Significantly easier to implement', 
        'B', 
        'Hash Tables map keys directly to buckets using a hashing function, allowing constant-time O(1) lookups on average.'
    ),
    (
        v_quiz_id, 
        4, 
        'What is the height of a balanced Binary Search Tree (BST) with N nodes?', 
        'O(1)', 
        'O(N)', 
        'O(log N)', 
        'O(N^2)', 
        'C', 
        'A balanced BST distributes nodes evenly, keeping its maximum depth capped at logarithmic height O(log N).'
    ),
    (
        v_quiz_id, 
        5, 
        'Which sorting algorithm is specifically designed to use a Heap data structure?', 
        'Quick Sort', 
        'Merge Sort', 
        'Heap Sort', 
        'Bubble Sort', 
        'C', 
        'Heap Sort organizes elements into a binary heap tree layout to extract elements in sorted order efficiently.'
    ),
    (
        v_quiz_id, 
        6, 
        'In a circular queue of capacity C, how is the rear index incremented?', 
        'Rear + 1', 
        '(Rear + 1) / C', 
        '(Rear + 1) % C', 
        'Rear % (C + 1)', 
        'C', 
        'Circular queues use modulo arithmetic (Rear + 1) % C to wrap the rear pointer back to index 0 when capacity is reached.'
    ),
    (
        v_quiz_id, 
        7, 
        'Which graph representation is most memory-efficient for sparse graphs?', 
        'Adjacency Matrix', 
        'Adjacency List', 
        'Incidence Matrix', 
        'Edge List', 
        'B', 
        'An Adjacency List only allocates nodes for existing edges, making it ideal for sparse graphs where vertex-edge connections are low.'
    ),
    (
        v_quiz_id, 
        8, 
        'What data structure is used internally by the runtime to implement recursion or backtracking?', 
        'Stack', 
        'Queue', 
        'Binary Tree', 
        'Priority Queue', 
        'A', 
        'The program call stack tracks function frames using a Last-In, First-Out (LIFO) stack layout.'
    ),
    (
        v_quiz_id, 
        9, 
        'What is the average-case time complexity of inserting an item into a Binary Search Tree (BST)?', 
        'O(N)', 
        'O(1)', 
        'O(log N)', 
        'O(N log N)', 
        'C', 
        'Insertion requires traversing down the tree, which takes O(log N) steps on average in a balanced BST.'
    ),
    (
        v_quiz_id, 
        10, 
        'Which data structure is best suited for implementing Dijkstra''s shortest path algorithm efficiently?', 
        'Stack', 
        'Deque', 
        'Min-Priority Queue (Heap)', 
        'Circular Linked List', 
        'C', 
        'A min-priority queue (or heap) allows fast O(log V) retrieval of the vertex with the minimum distance label during vertex exploration.'
    );
END $$;
