-- 🎓 FEEDX STUDENT MANAGEMENT & BULK IMPORT PROCEDURES
-- This script provides tools for viewing all records and importing bulk data via CSV/JSON.

-- ==========================================
-- 1. VIEW ALL STUDENT RECORDS (Unified)
-- ==========================================
-- This view combines student details with their full hierarchy names.
CREATE OR REPLACE VIEW public.view_all_students AS
SELECT 
    s.roll_number,
    s.full_name,
    s.email,
    c.college_name,
    b.branch_name,
    y.year_name,
    sec.section_name,
    s.cgpa,
    s.phone,
    s.created_at
FROM public.students s
LEFT JOIN public.colleges c ON s.college_id = c.id
LEFT JOIN public.branches b ON s.branch_id = b.id
LEFT JOIN public.academic_years y ON s.academic_year_id = y.id
LEFT JOIN public.sections sec ON s.section_id = sec.id;

-- ==========================================
-- 2. STAGING TABLE FOR CSV UPLOADS
-- ==========================================
-- Uploading directly to 'students' is hard because of User ID requirements.
-- We use this staging table for raw CSV imports.

CREATE TABLE IF NOT EXISTS public.student_import_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number TEXT,
    full_name TEXT,
    email TEXT,
    password TEXT DEFAULT 'FeedX@123', -- Default password if not provided
    phone TEXT,
    college_name TEXT,
    branch_name TEXT,
    year_name TEXT,
    section_name TEXT,
    status TEXT DEFAULT 'pending', -- pending, processed, error
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. PROCEDURE: PROCESS STAGING DATA
-- ==========================================
-- This function converts staging records into actual student profiles.
-- It automatically finds the correct IDs based on the names provided.

CREATE OR REPLACE FUNCTION public.process_student_imports()
RETURNS TABLE (processed_count INT, error_count INT) AS $$
DECLARE
    r RECORD;
    v_college_id UUID;
    v_branch_id UUID;
    v_year_id UUID;
    v_section_id UUID;
    v_user_id UUID;
    succ_count INT := 0;
    err_count INT := 0;
BEGIN
    FOR r IN SELECT * FROM public.student_import_staging WHERE status = 'pending' LOOP
        BEGIN
            -- 1. Lookup Hierarchy IDs
            SELECT id INTO v_college_id FROM public.colleges WHERE college_name = r.college_name LIMIT 1;
            SELECT id INTO v_branch_id FROM public.branches WHERE branch_name = r.branch_name AND college_id = v_college_id LIMIT 1;
            SELECT id INTO v_year_id FROM public.academic_years WHERE year_name = r.year_name AND branch_id = v_branch_id LIMIT 1;
            SELECT id INTO v_section_id FROM public.sections WHERE section_name = r.section_name AND academic_year_id = v_year_id LIMIT 1;

            -- 2. Check if user already exists
            SELECT id INTO v_user_id FROM auth.users WHERE email = r.email;

            -- 3. Create Auth User if they don't exist
            IF v_user_id IS NULL THEN
                v_user_id := uuid_generate_v4();
                
                INSERT INTO auth.users (
                    id, 
                    email, 
                    encrypted_password, 
                    email_confirmed_at, 
                    raw_user_meta_data, 
                    aud, 
                    role
                )
                VALUES (
                    v_user_id,
                    r.email,
                    crypt(COALESCE(r.password, 'FeedX@123'), gen_salt('bf')),
                    now(),
                    jsonb_build_object(
                        'full_name', r.full_name,
                        'roll_number', r.roll_number,
                        'role', 'student'
                    ),
                    'authenticated',
                    'authenticated'
                );
            END IF;

            -- 4. The trigger 'on_auth_user_created' will have created the 'public.students' row by now.
            -- We just need to update it with the hierarchy IDs.
            
            UPDATE public.students SET
                roll_number = r.roll_number,
                full_name = r.full_name,
                college_id = v_college_id,
                branch_id = v_branch_id,
                academic_year_id = v_year_id,
                section_id = v_section_id,
                phone = r.phone
            WHERE id = v_user_id;

            UPDATE public.student_import_staging SET status = 'processed', error_message = NULL WHERE id = r.id;
            succ_count := succ_count + 1;

        EXCEPTION WHEN OTHERS THEN
            UPDATE public.student_import_staging SET status = 'error', error_message = SQLERRM WHERE id = r.id;
            err_count := err_count + 1;
        END;
    END LOOP;

    RETURN QUERY SELECT succ_count, err_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. AUTO-PROCESS TRIGGER
-- ==========================================
-- This makes the Table Editor work automatically.
CREATE OR REPLACE FUNCTION public.trigger_process_staging()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.process_student_imports();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_on_staging_insert ON public.student_import_staging;
CREATE TRIGGER tr_on_staging_insert
    AFTER INSERT ON public.student_import_staging
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.trigger_process_staging();
