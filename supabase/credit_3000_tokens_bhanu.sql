-- ==============================================================================
-- CREDIT 3,000 TASK TOKENS FOR USER: bhanuprasad092627@gmail.com
-- ==============================================================================

DO $$
DECLARE
    v_user_id UUID;
    v_current_xp INTEGER;
BEGIN
    -- 1. Find user ID from auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE LOWER(email) = LOWER('bhanuprasad092627@gmail.com')
    LIMIT 1;

    IF v_user_id IS NULL THEN
        -- Fallback check in public.profiles or public.users
        SELECT id INTO v_user_id
        FROM public.profiles
        WHERE LOWER(email) = LOWER('bhanuprasad092627@gmail.com')
        LIMIT 1;
    END IF;

    IF v_user_id IS NOT NULL THEN
        -- 2. Fetch current xp_points or default 0
        SELECT COALESCE(xp_points, 0) INTO v_current_xp
        FROM public.daily_streaks
        WHERE student_id = v_user_id;

        IF v_current_xp IS NULL THEN
            v_current_xp := 0;
        END IF;

        -- 3. Upsert daily_streaks with +3,000 Task Tokens
        INSERT INTO public.daily_streaks (student_id, current_streak, longest_streak, xp_points, updated_at)
        VALUES (v_user_id, 1, 1, v_current_xp + 3000, NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            xp_points = public.daily_streaks.xp_points + 3000,
            updated_at = NOW();

        -- 4. Record Transaction in coin_transactions
        INSERT INTO public.coin_transactions (student_id, amount, activity_type, description)
        VALUES (v_user_id, 3000, 'bonus_reward', 'Admin Bonus Credit: +3,000 Task Tokens');

        RAISE NOTICE 'Successfully added 3,000 Task Tokens for user % (ID: %)', 'bhanuprasad092627@gmail.com', v_user_id;
    ELSE
        RAISE NOTICE 'User bhanuprasad092627@gmail.com not found in auth.users';
    END IF;
END $$;
