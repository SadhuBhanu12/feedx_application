-- ============================================================
-- FEEDX v6.0 — STUDENT CSV / INSERT ROW IMPORT SETUP
-- Run once in Supabase SQL Editor after complete_setup_unified.sql
-- ============================================================

-- 1. Staging table (import CSV here OR use Insert Row)
CREATE TABLE IF NOT EXISTS public.student_import_staging (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number     TEXT NOT NULL,
    full_name       TEXT NOT NULL,
    email           TEXT NOT NULL,
    password        TEXT,                          -- defaults to date_of_birth, else 'FeedX@123'
    phone           TEXT,
    college_name    TEXT NOT NULL,
    branch_name     TEXT NOT NULL,
    year_name       TEXT NOT NULL,                 -- must match academic_years.year_name, e.g. '1st Year'
    pin_number      TEXT NOT NULL,
    date_of_birth   DATE NOT NULL,                 -- also used as initial login password
    status          TEXT DEFAULT 'pending',        -- pending | processed | error
    error_message   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Unified view to verify imported students
CREATE OR REPLACE VIEW public.view_all_students AS
SELECT
    s.roll_number,
    s.full_name,
    s.email,
    s.phone,
    c.name            AS college_name,
    b.branch_name,
    y.year_name,
    s.year,
    s.pin_number,
    s.date_of_birth,
    s.cgpa,
    s.is_password_set,
    s.created_at
FROM public.students s
LEFT JOIN public.colleges       c ON c.id = s.college_id
LEFT JOIN public.branches       b ON b.id = s.branch_id
LEFT JOIN public.academic_years y ON y.id = s.academic_year_id;

-- 3. Process staging rows into auth + students
CREATE OR REPLACE FUNCTION public.process_student_imports()
RETURNS TABLE (processed_count INT, error_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    r               RECORD;
    v_college_id    UUID;
    v_branch_id     UUID;
    v_year_id       UUID;
    v_user_id       UUID;
    v_password      TEXT;
    succ_count      INT := 0;
    err_count       INT := 0;
BEGIN
    FOR r IN
        SELECT * FROM public.student_import_staging
        WHERE status = 'pending'
        ORDER BY created_at
    LOOP
        BEGIN
            -- Resolve hierarchy by name (v6.0: no sections)
            SELECT id INTO v_college_id
            FROM public.colleges
            WHERE name = r.college_name OR college_name = r.college_name
            LIMIT 1;

            IF v_college_id IS NULL THEN
                RAISE EXCEPTION 'College not found: %', r.college_name;
            END IF;

            SELECT id INTO v_branch_id
            FROM public.branches
            WHERE college_id = v_college_id
              AND (branch_name = r.branch_name OR name = r.branch_name)
            LIMIT 1;

            IF v_branch_id IS NULL THEN
                RAISE EXCEPTION 'Branch not found: % (college: %)', r.branch_name, r.college_name;
            END IF;

            SELECT id INTO v_year_id
            FROM public.academic_years
            WHERE branch_id = v_branch_id
              AND year_name = r.year_name
            LIMIT 1;

            IF v_year_id IS NULL THEN
                RAISE EXCEPTION 'Academic year not found: % (branch: %)', r.year_name, r.branch_name;
            END IF;

            v_password := COALESCE(NULLIF(TRIM(r.password), ''), r.date_of_birth::TEXT, 'FeedX@123');

            -- Check existing auth user
            SELECT id INTO v_user_id
            FROM auth.users
            WHERE email = r.email;

            -- Create auth user if missing (trigger auto-creates users + students)
            IF v_user_id IS NULL THEN
                v_user_id := uuid_generate_v4();

                INSERT INTO auth.users (
                    id,
                    instance_id,
                    email,
                    encrypted_password,
                    email_confirmed_at,
                    raw_app_meta_data,
                    raw_user_meta_data,
                    aud,
                    role,
                    created_at,
                    updated_at
                )
                VALUES (
                    v_user_id,
                    '00000000-0000-0000-0000-000000000000',
                    r.email,
                    crypt(v_password, gen_salt('bf')),
                    NOW(),
                    '{"provider":"email","providers":["email"]}'::jsonb,
                    jsonb_build_object(
                        'full_name',     r.full_name,
                        'roll_number',   r.roll_number,
                        'role',          'student',
                        'pin_number',    r.pin_number,
                        'date_of_birth', r.date_of_birth::TEXT
                    ),
                    'authenticated',
                    'authenticated',
                    NOW(),
                    NOW()
                );
            END IF;

            -- Link student to hierarchy + activation fields
            UPDATE public.students SET
                roll_number      = UPPER(TRIM(r.roll_number)),
                full_name        = TRIM(r.full_name),
                email            = LOWER(TRIM(r.email)),
                phone            = r.phone,
                college_id       = v_college_id,
                branch_id        = v_branch_id,
                academic_year_id = v_year_id,
                year             = r.year_name,
                pin_number       = r.pin_number,
                date_of_birth    = r.date_of_birth,
                is_password_set  = FALSE
            WHERE id = v_user_id;

            IF NOT FOUND THEN
                INSERT INTO public.students (
                    id, roll_number, full_name, email, phone,
                    college_id, branch_id, academic_year_id,
                    year, pin_number, date_of_birth, is_password_set
                )
                VALUES (
                    v_user_id,
                    UPPER(TRIM(r.roll_number)),
                    TRIM(r.full_name),
                    LOWER(TRIM(r.email)),
                    r.phone,
                    v_college_id,
                    v_branch_id,
                    v_year_id,
                    r.year_name,
                    r.pin_number,
                    r.date_of_birth,
                    FALSE
                );
            END IF;

            UPDATE public.student_import_staging
            SET status = 'processed', error_message = NULL
            WHERE id = r.id;

            succ_count := succ_count + 1;

        EXCEPTION WHEN OTHERS THEN
            UPDATE public.student_import_staging
            SET status = 'error', error_message = SQLERRM
            WHERE id = r.id;

            err_count := err_count + 1;
        END;
    END LOOP;

    RETURN QUERY SELECT succ_count, err_count;
END;
$$;

-- 4. Auto-process after CSV import
CREATE OR REPLACE FUNCTION public.trigger_process_staging()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM public.process_student_imports();
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS tr_on_staging_insert ON public.student_import_staging;
CREATE TRIGGER tr_on_staging_insert
    AFTER INSERT ON public.student_import_staging
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.trigger_process_staging();

-- 5. RLS (allow service role + admins; staging is admin-only in practice)
ALTER TABLE public.student_import_staging ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage student imports" ON public.student_import_staging;
CREATE POLICY "Admin manage student imports"
    ON public.student_import_staging
    FOR ALL
    TO authenticated
    USING (public.check_is_admin())
    WITH CHECK (public.check_is_admin());

GRANT ALL ON public.student_import_staging TO authenticated, service_role;

-- ============================================================
-- HOW TO USE
-- ============================================================
--
-- A) INSERT ROW (Table Editor → student_import_staging → Insert row)
--    Fill: roll_number, full_name, email, college_name, branch_name,
--          year_name, pin_number, date_of_birth
--    Optional: phone, password
--    Leave status as 'pending' — auto-processes on save.
--
-- B) CSV IMPORT (Table Editor → student_import_staging → Import CSV)
--    CSV columns:
--    roll_number,full_name,email,phone,college_name,branch_name,year_name,pin_number,date_of_birth,password
--
-- C) VERIFY
--    SELECT * FROM public.view_all_students;
--    SELECT roll_number, email, status, error_message FROM public.student_import_staging;
--
-- D) RE-RUN FAILED ROWS
--    UPDATE public.student_import_staging SET status = 'pending' WHERE status = 'error';
--    SELECT * FROM public.process_student_imports();
--
-- ============================================================
-- SAMPLE CSV (college/branch/year names must match your DB exactly)
-- ============================================================
--
-- roll_number,full_name,email,phone,college_name,branch_name,year_name,pin_number,date_of_birth,password
-- 22K61A0501,Jane Doe,jane@college.edu,9876543210,ABC Polytechnic,Computer Science,1st Year,123456,2005-05-15,
-- 22K61A0502,John Smith,john@college.edu,9876543211,ABC Polytechnic,Computer Science,2nd Year,654321,2004-08-20,
--
-- Initial login password = date_of_birth (or password column if set)
-- First-time app login = PIN + DOB verification → student sets permanent password
