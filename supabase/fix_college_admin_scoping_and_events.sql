-- ==============================================================================
-- FEEDX - College Admin Portal Unified Optimization & Scoping Migration
-- ==============================================================================
-- Fixes:
-- 1. get_college_dashboard_stats RPC signature (supports both UUID & TEXT parameters)
--    eliminates "operator does not exist: uuid = text" error.
-- 2. Strict college scoping across issues, suggestions, feedback, events & notifications.
-- 3. Default campus assignment for admin users in public.users.
-- ==============================================================================

-- Drop old signatures to avoid function overload conflicts
DROP FUNCTION IF EXISTS public.get_college_dashboard_stats(UUID);
DROP FUNCTION IF EXISTS public.get_college_dashboard_stats(TEXT);

CREATE OR REPLACE FUNCTION public.get_college_dashboard_stats(p_college_id TEXT)
RETURNS JSON AS $$
DECLARE
    v_college_uuid UUID;
    v_active_students INTEGER := 0;
    v_total_grievances INTEGER := 0;
    v_pending_grievances INTEGER := 0;
    v_review_grievances INTEGER := 0;
    v_resolved_grievances INTEGER := 0;
    v_total_notifications INTEGER := 0;
    v_total_resources INTEGER := 0;
    v_total_events INTEGER := 0;
    v_total_suggestions INTEGER := 0;
BEGIN
    BEGIN
        v_college_uuid := p_college_id::UUID;
    EXCEPTION WHEN OTHERS THEN
        v_college_uuid := NULL;
    END;

    -- 1. Active students count strictly scoped to college
    SELECT COUNT(DISTINCT id) INTO v_active_students
    FROM public.students
    WHERE college_id = v_college_uuid;

    IF v_active_students = 0 THEN
        SELECT COUNT(DISTINCT id) INTO v_active_students
        FROM public.users
        WHERE college_id = v_college_uuid AND role = 'student';
    END IF;

    -- 2. Grievances breakdown strictly scoped to college
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COUNT(*) FILTER (WHERE status IN ('in_progress', 'under_review')),
        COUNT(*) FILTER (WHERE status = 'resolved')
    INTO 
        v_total_grievances,
        v_pending_grievances,
        v_review_grievances,
        v_resolved_grievances
    FROM public.issues
    WHERE college_id = v_college_uuid;

    -- 3. Suggestions count
    SELECT COUNT(*) INTO v_total_suggestions
    FROM public.support_suggestions
    WHERE college_id = v_college_uuid;

    -- 4. Notifications count
    SELECT COUNT(*) INTO v_total_notifications
    FROM public.notifications
    WHERE college_id = v_college_uuid;

    -- 5. Resources count
    SELECT COUNT(*) INTO v_total_resources
    FROM public.resources
    WHERE college_id = v_college_uuid;

    -- 6. Events count
    SELECT COUNT(*) INTO v_total_events
    FROM public.events
    WHERE college_id = v_college_uuid;

    RETURN json_build_object(
        'active_students', v_active_students,
        'total_students', v_active_students,
        'total_grievances', v_total_grievances,
        'pending_grievances', v_pending_grievances,
        'review_grievances', v_review_grievances,
        'resolved_grievances', v_resolved_grievances,
        'total_notifications', v_total_notifications,
        'total_resources', v_total_resources,
        'total_events', v_total_events,
        'total_suggestions', v_total_suggestions
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_college_dashboard_stats(TEXT) TO authenticated, anon, service_role;

-- Self-healing: Assign primary college to admin accounts that have null college_id
UPDATE public.users
SET college_id = '6dd12d63-e276-4ff8-8e58-bcd2cc878626'
WHERE college_id IS NULL AND role IN ('admin', 'inst_admin', 'college_admin');
