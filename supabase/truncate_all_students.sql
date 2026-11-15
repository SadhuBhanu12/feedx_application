-- ==============================================================================
-- FEEDX — TRUNCATE ALL STUDENT DATA ACROSS ALL COLLEGES
-- Run this script in your Supabase SQL Editor (as postgres/service_role)
-- 
-- Summary:
-- 1. Strictly PRESERVES all Administrator accounts (super_admin, admin, inst_admin).
-- 2. Completely removes student data across every college:
--    - public.student_grades & public.student_semesters
--    - public.student_wallets, coin_transactions, reward_transactions, reward_redemptions
--    - public.daily_streaks, student_streak, daily_task_completions, student_missions
--    - public.daily_quiz_attempts, daily_quiz_answers, student_quiz_attempts, explore_quiz_attempts
--    - public.student_lesson_progress, student_roadmap_progress, student_career_goals
--    - public.opportunity_applications, event_registrations, qr_verifications
--    - public.attendance & student_attendance across all colleges
--    - Student-authored community likes, comments, and shares
--    - Student support tickets & issues
--    - Student roster records across all colleges (public.students)
--    - Student users in public.users and auth.users
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- STEP 0: Safety Check - Confirm Admin Accounts to Preserve
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    v_admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_admin_count
    FROM public.users
    WHERE role IN ('admin', 'inst_admin', 'super_admin');

    RAISE NOTICE 'FEEDX Safety Check: Preserving % Administrator / SuperAdmin account(s).', v_admin_count;
END $$;

-- ------------------------------------------------------------------------------
-- STEP 1: Clear Academic Records & Subject Grades
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_grades') THEN
        DELETE FROM public.student_grades;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_semesters') THEN
        DELETE FROM public.student_semesters;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- STEP 2: Clear Gamification, Streaks, Wallets & Rewards
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='coin_transactions') THEN
        DELETE FROM public.coin_transactions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='reward_transactions') THEN
        DELETE FROM public.reward_transactions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='reward_redemptions') THEN
        DELETE FROM public.reward_redemptions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='fx_transactions') THEN
        DELETE FROM public.fx_transactions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_wallets') THEN
        DELETE FROM public.student_wallets;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_wallet') THEN
        DELETE FROM public.student_wallet;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_streaks') THEN
        DELETE FROM public.daily_streaks;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_streak') THEN
        DELETE FROM public.student_streak;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_task_completions') THEN
        DELETE FROM public.daily_task_completions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_missions') THEN
        DELETE FROM public.student_missions;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- STEP 3: Clear Quiz Attempts & Learning Progress
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_quiz_answers') THEN
        DELETE FROM public.daily_quiz_answers;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_quiz_attempts') THEN
        DELETE FROM public.daily_quiz_attempts;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_quiz_attempts') THEN
        DELETE FROM public.student_quiz_attempts;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='explore_quiz_attempts') THEN
        DELETE FROM public.explore_quiz_attempts;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_lesson_progress') THEN
        DELETE FROM public.student_lesson_progress;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_roadmap_progress') THEN
        DELETE FROM public.student_roadmap_progress;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_career_goals') THEN
        DELETE FROM public.student_career_goals;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- STEP 4: Clear Opportunities Applications, Event Registrations & Attendance
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='opportunity_applications') THEN
        DELETE FROM public.opportunity_applications;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='event_registrations') THEN
        DELETE FROM public.event_registrations;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='qr_verifications') THEN
        DELETE FROM public.qr_verifications;
    END IF;
    -- Attendance tables hold student attendance records; delete all records safely
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='attendance') THEN
        DELETE FROM public.attendance;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_attendance') THEN
        DELETE FROM public.student_attendance;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- STEP 5: Clear Student Community Interactivity, Notifications & Support Safely
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    -- Community likes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.community_likes WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'student_id') THEN
        EXECUTE 'DELETE FROM public.community_likes WHERE student_id IN (SELECT id FROM public.students)';
    END IF;

    -- Community comments
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.community_comments WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'student_id') THEN
        EXECUTE 'DELETE FROM public.community_comments WHERE student_id IN (SELECT id FROM public.students)';
    END IF;

    -- Community poll votes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_poll_votes' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.community_poll_votes WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;

    -- Notification reads
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notification_reads' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.notification_reads WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;

    -- Notifications
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.notifications WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'recipient_id') THEN
        EXECUTE 'DELETE FROM public.notifications WHERE recipient_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;

    -- Activation sessions
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'activation_sessions' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.activation_sessions WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;

    -- Support tickets
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.support_tickets WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;

    -- Support messages
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_messages' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.support_messages WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_messages' AND column_name = 'sender_id') THEN
        EXECUTE 'DELETE FROM public.support_messages WHERE sender_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;

    -- Issues / tickets
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'issues' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.issues WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;

    -- Push tokens
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_push_tokens' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.user_push_tokens WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'push_tokens' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.push_tokens WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- STEP 6: Delete All Student Records Across All Colleges
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='students') THEN
        DELETE FROM public.students;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- STEP 7: Remove Student Records from public.users (Preserve All Admins)
-- ------------------------------------------------------------------------------
DELETE FROM public.users
WHERE role = 'student'
   OR role NOT IN ('admin', 'inst_admin', 'super_admin');

-- ------------------------------------------------------------------------------
-- STEP 8: Remove Student Authentication Credentials from auth.users (Preserve Admins)
-- ------------------------------------------------------------------------------
DELETE FROM auth.users
WHERE id NOT IN (
    SELECT id FROM public.users WHERE role IN ('admin', 'inst_admin', 'super_admin')
);

-- ------------------------------------------------------------------------------
-- STEP 9: Create Reusable RPC for SuperAdmin in App
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sa_truncate_all_students()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_caller_role TEXT;
    v_admin_count INTEGER;
BEGIN
    -- Verify caller is super admin or admin
    SELECT role INTO v_caller_role FROM public.users WHERE id = auth.uid();
    IF v_caller_role NOT IN ('super_admin', 'admin') THEN
        RAISE EXCEPTION 'Access Denied: Only SuperAdmin can execute global student truncation.';
    END IF;

    -- Safety check: verify admin count
    SELECT COUNT(*) INTO v_admin_count FROM public.users WHERE role IN ('admin', 'inst_admin', 'super_admin');

    -- Clear academic records
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_grades') THEN
        DELETE FROM public.student_grades;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_semesters') THEN
        DELETE FROM public.student_semesters;
    END IF;

    -- Clear gamification & wallets
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='coin_transactions') THEN
        DELETE FROM public.coin_transactions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='reward_transactions') THEN
        DELETE FROM public.reward_transactions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='reward_redemptions') THEN
        DELETE FROM public.reward_redemptions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='fx_transactions') THEN
        DELETE FROM public.fx_transactions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_wallets') THEN
        DELETE FROM public.student_wallets;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_wallet') THEN
        DELETE FROM public.student_wallet;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_streaks') THEN
        DELETE FROM public.daily_streaks;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_streak') THEN
        DELETE FROM public.student_streak;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_task_completions') THEN
        DELETE FROM public.daily_task_completions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_missions') THEN
        DELETE FROM public.student_missions;
    END IF;

    -- Clear quiz & learning
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_quiz_answers') THEN
        DELETE FROM public.daily_quiz_answers;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_quiz_attempts') THEN
        DELETE FROM public.daily_quiz_attempts;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_quiz_attempts') THEN
        DELETE FROM public.student_quiz_attempts;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='explore_quiz_attempts') THEN
        DELETE FROM public.explore_quiz_attempts;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_lesson_progress') THEN
        DELETE FROM public.student_lesson_progress;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_roadmap_progress') THEN
        DELETE FROM public.student_roadmap_progress;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_career_goals') THEN
        DELETE FROM public.student_career_goals;
    END IF;

    -- Clear registrations & attendance
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='opportunity_applications') THEN
        DELETE FROM public.opportunity_applications;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='event_registrations') THEN
        DELETE FROM public.event_registrations;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='qr_verifications') THEN
        DELETE FROM public.qr_verifications;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='attendance') THEN
        DELETE FROM public.attendance;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_attendance') THEN
        DELETE FROM public.student_attendance;
    END IF;

    -- Clear community & support safely with dynamic column existence checks
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.community_likes WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.community_comments WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notification_reads' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.notification_reads WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.notifications WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'recipient_id') THEN
        EXECUTE 'DELETE FROM public.notifications WHERE recipient_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'activation_sessions' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.activation_sessions WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.support_tickets WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'issues' AND column_name = 'user_id') THEN
        EXECUTE 'DELETE FROM public.issues WHERE user_id IN (SELECT id FROM public.users WHERE role = ''student'')';
    END IF;

    -- Delete student roster records
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='students') THEN
        DELETE FROM public.students;
    END IF;

    -- Delete student users
    DELETE FROM public.users
    WHERE role = 'student'
       OR role NOT IN ('admin', 'inst_admin', 'super_admin');

    -- Delete auth users not in remaining admin users
    DELETE FROM auth.users
    WHERE id NOT IN (
        SELECT id FROM public.users WHERE role IN ('admin', 'inst_admin', 'super_admin')
    );

    RETURN json_build_object(
        'status', 'success',
        'message', 'All students across all colleges have been truncated.',
        'preserved_admins', v_admin_count,
        'timestamp', NOW()
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.sa_truncate_all_students() TO authenticated, service_role;

COMMIT;

-- ------------------------------------------------------------------------------
-- VERIFICATION REPORT
-- ------------------------------------------------------------------------------
SELECT 
    'Students Remaining' AS metric, 
    COUNT(*)::text AS count 
FROM public.students
UNION ALL
SELECT 
    'Student Users Remaining', 
    COUNT(*)::text 
FROM public.users 
WHERE role = 'student'
UNION ALL
SELECT 
    'Preserved Admin Users', 
    COUNT(*)::text 
FROM public.users 
WHERE role IN ('admin', 'inst_admin', 'super_admin');
