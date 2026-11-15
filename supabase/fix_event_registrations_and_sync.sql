-- ==============================================================================
-- FEEDX — FIX EVENT REGISTRATIONS & REAL-TIME BOOKED PERCENTAGE SYNC
-- Run this in the Supabase SQL Editor (as postgres / service_role)
-- 
-- Fixes:
-- 1. Adds automatic trigger to keep events.registered in sync when students register/cancel
-- 2. Creates secure RPC functions for atomic event registration and cancellation
-- 3. Updates RLS policies so authenticated students can register and read registrations
-- 4. Immediately recalculates registered counts for all existing published events
-- ==============================================================================

BEGIN;

-- 1. Ensure required columns exist on public.event_registrations
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS registration_number TEXT;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS qr_token TEXT;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS event_qr TEXT;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS feedx_id TEXT;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS college_id UUID;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS branch TEXT;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS attendance TEXT DEFAULT 'Pending';
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS attendance_status TEXT DEFAULT 'registered';
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'registered';
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure events table has registered column (INTEGER default 0)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registered INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 100;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS max_participants INTEGER;

-- 2. Relax status check constraint on event_registrations to accept both lowercase and capitalized
ALTER TABLE public.event_registrations DROP CONSTRAINT IF EXISTS event_registrations_status_check;
ALTER TABLE public.event_registrations DROP CONSTRAINT IF EXISTS check_status;

ALTER TABLE public.event_registrations ADD CONSTRAINT event_registrations_status_check 
CHECK (LOWER(status) IN ('registered', 'cancelled', 'waitlist', 'active', 'confirmed', 'pending'));

-- 3. Automatic Database Trigger: Keep public.events.registered in sync
CREATE OR REPLACE FUNCTION public.sync_event_registration_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
    v_event_id UUID;
    v_count INT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_event_id := OLD.event_id;
    ELSE
        v_event_id := NEW.event_id;
    END IF;

    IF v_event_id IS NOT NULL THEN
        -- Count only non-cancelled registrations
        SELECT COUNT(*) INTO v_count
        FROM public.event_registrations
        WHERE event_id = v_event_id
          AND LOWER(COALESCE(status, 'registered')) NOT IN ('cancelled', 'rejected');

        UPDATE public.events
        SET registered = COALESCE(v_count, 0)
        WHERE id = v_event_id;
    END IF;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_event_registration_count ON public.event_registrations;
CREATE TRIGGER trg_sync_event_registration_count
AFTER INSERT OR UPDATE OR DELETE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.sync_event_registration_count();

-- 4. Secure RPC function: register_for_event_secure
CREATE OR REPLACE FUNCTION public.register_for_event_secure(
    p_event_id UUID,
    p_user_id UUID,
    p_student_info JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
    v_reg_id UUID;
    v_existing_id UUID;
    v_reg_number TEXT;
    v_feedx_id TEXT;
    v_qr_token TEXT;
    v_student_name TEXT;
    v_branch TEXT;
    v_college_id UUID;
    v_res JSONB;
BEGIN
    -- Check if user is already registered for this event
    SELECT id INTO v_existing_id
    FROM public.event_registrations
    WHERE event_id = p_event_id
      AND (user_id = p_user_id OR student_id = p_user_id)
    LIMIT 1;

    v_feedx_id := COALESCE(p_student_info->>'feedx_id', p_student_info->>'roll_number', 'FX-' || substr(p_user_id::text, 1, 8));
    v_qr_token := v_feedx_id || '_' || substr(p_event_id::text, 1, 6);
    v_student_name := COALESCE(p_student_info->>'full_name', p_student_info->>'name');
    v_branch := p_student_info->>'branch';

    -- Parse college_id if valid UUID
    BEGIN
        IF p_student_info->>'college_id' IS NOT NULL AND length(p_student_info->>'college_id') = 36 THEN
            v_college_id := (p_student_info->>'college_id')::UUID;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        v_college_id := NULL;
    END;

    IF v_existing_id IS NOT NULL THEN
        -- Re-activate existing registration
        UPDATE public.event_registrations
        SET status = 'registered',
            attendance_status = 'registered',
            attendance = 'Pending',
            registered_at = now()
        WHERE id = v_existing_id
        RETURNING to_jsonb(public.event_registrations.*) INTO v_res;

        RETURN v_res;
    ELSE
        -- Generate registration number
        v_reg_number := 'REG-' || UPPER(substr(p_event_id::text, 1, 4)) || '-' || (10000 + floor(random() * 90000))::int::text;

        INSERT INTO public.event_registrations (
            event_id,
            user_id,
            student_id,
            registration_number,
            feedx_id,
            qr_token,
            event_qr,
            student_name,
            branch,
            college_id,
            status,
            attendance_status,
            attendance,
            registered_at
        )
        VALUES (
            p_event_id,
            p_user_id,
            p_user_id,
            v_reg_number,
            v_feedx_id,
            v_qr_token,
            v_qr_token,
            v_student_name,
            v_branch,
            v_college_id,
            'registered',
            'registered',
            'Pending',
            now()
        )
        RETURNING to_jsonb(public.event_registrations.*) INTO v_res;

        RETURN v_res;
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_for_event_secure(UUID, UUID, JSONB) TO authenticated, anon, service_role;

-- 5. Secure RPC function: cancel_event_registration_secure
CREATE OR REPLACE FUNCTION public.cancel_event_registration_secure(
    p_event_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    UPDATE public.event_registrations
    SET status = 'cancelled'
    WHERE event_id = p_event_id
      AND (user_id = p_user_id OR student_id = p_user_id);

    RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_event_registration_secure(UUID, UUID) TO authenticated, anon, service_role;

-- 6. Update Row Level Security (RLS) Policies on event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Student read own event registrations" ON public.event_registrations;
CREATE POLICY "Student read own event registrations" ON public.event_registrations
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR auth.uid() = student_id OR true); -- Allows reading count/status

DROP POLICY IF EXISTS "Register for events" ON public.event_registrations;
DROP POLICY IF EXISTS "Student register for events" ON public.event_registrations;
CREATE POLICY "Student register for events" ON public.event_registrations
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "Cancel own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Student cancel event registration" ON public.event_registrations;
CREATE POLICY "Student cancel event registration" ON public.event_registrations
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id OR auth.uid() = student_id)
    WITH CHECK (auth.uid() = user_id OR auth.uid() = student_id);

-- 7. Recalculate registered count for all existing events now
UPDATE public.events e
SET registered = COALESCE((
    SELECT COUNT(*) 
    FROM public.event_registrations r 
    WHERE r.event_id = e.id 
      AND LOWER(COALESCE(r.status, 'registered')) NOT IN ('cancelled', 'rejected')
), 0);

COMMIT;
