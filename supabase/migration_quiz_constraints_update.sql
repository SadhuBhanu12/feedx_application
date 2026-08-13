-- ==============================================================================
-- FEEDX SUPABASE MIGRATION: UPDATE QUIZ CHECK CONSTRAINTS & DYNAMIC ATTEMPT RPC
-- ==============================================================================

-- 1. Alter check constraints to support up to 50 questions
ALTER TABLE public.daily_quizzes DROP CONSTRAINT IF EXISTS daily_quizzes_total_questions_check;
ALTER TABLE public.daily_quizzes ADD CONSTRAINT daily_quizzes_total_questions_check CHECK (total_questions BETWEEN 1 AND 50);

ALTER TABLE public.daily_quiz_questions DROP CONSTRAINT IF EXISTS daily_quiz_questions_question_number_check;
ALTER TABLE public.daily_quiz_questions ADD CONSTRAINT daily_quiz_questions_question_number_check CHECK (question_number BETWEEN 1 AND 50);

ALTER TABLE public.daily_quiz_attempts DROP CONSTRAINT IF EXISTS daily_quiz_attempts_current_question_check;
ALTER TABLE public.daily_quiz_attempts ADD CONSTRAINT daily_quiz_attempts_current_question_check CHECK (current_question BETWEEN 1 AND 50);

-- 2. Update submit_daily_quiz_attempt RPC function to dynamically calculate total and reward
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
NOTIFY pgrst, 'reload schema';
