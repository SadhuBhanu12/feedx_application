-- ==============================================================================
-- FEEDX ID STANDARDIZATION & QUIZUE ID MIGRATION (ROBUST)
-- Standard Format: FX-YY-CC-XXXXXXX (e.g., FX-26-IA-0004582)
-- ==============================================================================

-- 0. Fix sync_students_to_profiles trigger to prevent foreign key errors on orphan rows
CREATE OR REPLACE FUNCTION public.sync_students_to_profiles()
RETURNS TRIGGER AS $$
DECLARE
  v_col_name TEXT;
  v_br_name TEXT;
  v_yr_val INTEGER;
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  -- Prevent error when updating a pre-registered/orphan student that doesn't have a user account
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  BEGIN
    v_col_name := (SELECT college_name FROM public.colleges WHERE id = NEW.college_id);
    IF v_col_name IS NULL THEN
      v_col_name := (SELECT name FROM public.colleges WHERE id = NEW.college_id);
    END IF;
    v_br_name := (SELECT branch_name FROM public.branches WHERE id = NEW.branch_id);
    v_yr_val := COALESCE(substring(NEW.year from '[0-9]+')::INTEGER, 1);

    INSERT INTO public.student_profiles (
      user_id, roll_no, college, branch, year, date_of_birth, cgpa, pin_number, is_password_set
    )
    VALUES (
      NEW.id, NEW.roll_number, v_col_name, v_br_name, v_yr_val,
      NEW.date_of_birth, NEW.cgpa, NEW.pin_number, NEW.is_password_set
    )
    ON CONFLICT (user_id) DO UPDATE SET
      roll_no = EXCLUDED.roll_no,
      college = EXCLUDED.college,
      branch = EXCLUDED.branch,
      year = EXCLUDED.year,
      date_of_birth = EXCLUDED.date_of_birth,
      cgpa = EXCLUDED.cgpa,
      pin_number = EXCLUDED.pin_number,
      is_password_set = EXCLUDED.is_password_set;

    UPDATE public.users SET
      pin_number = NEW.pin_number,
      date_of_birth = NEW.date_of_birth,
      is_password_set = NEW.is_password_set,
      branch = v_br_name,
      year = NEW.year
    WHERE id = NEW.id;
  EXCEPTION WHEN OTHERS THEN
    -- Silently handle foreign key or missing table edge cases
    NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Ensure columns exist on students and users tables
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS feedx_id VARCHAR(32);
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS quizue_id VARCHAR(32);
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS qr_code_data TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS identity_status VARCHAR(32) DEFAULT 'verified';

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS feedx_id VARCHAR(32);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS quizue_id VARCHAR(32);

-- 2. Sequence for generating unique 7-digit student IDs
CREATE SEQUENCE IF NOT EXISTS public.feedx_student_seq START WITH 4582 INCREMENT BY 1;

-- 3. Stored Procedure to generate standardized FEEDX ID
CREATE OR REPLACE FUNCTION public.generate_standard_feedx_id(
    p_year INT DEFAULT 26,
    p_college_code TEXT DEFAULT 'IA'
) RETURNS TEXT AS $$
DECLARE
    v_seq_val BIGINT;
    v_padded_seq TEXT;
    v_clean_year TEXT;
    v_clean_code TEXT;
BEGIN
    SELECT nextval('public.feedx_student_seq') INTO v_seq_val;
    v_padded_seq := LPAD(v_seq_val::TEXT, 7, '0');
    v_clean_year := LPAD(COALESCE(p_year, 26)::TEXT, 2, '0');
    v_clean_code := UPPER(SUBSTRING(COALESCE(p_college_code, 'IA') FROM 1 FOR 2));
    
    RETURN 'FX-' || v_clean_year || '-' || v_clean_code || '-' || v_padded_seq;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Stored Procedure to generate persistent Quizue ID
CREATE OR REPLACE FUNCTION public.generate_quizue_id(
    p_feedx_id TEXT
) RETURNS TEXT AS $$
DECLARE
    v_hash INT;
BEGIN
    v_hash := ABS(hashtext(COALESCE(p_feedx_id, 'QUIZUE_DEFAULT'))) % 100000000;
    RETURN 'QUIZUE-' || LPAD(v_hash::TEXT, 8, '0');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 5. Trigger Function to automatically assign feedx_id & quizue_id on student insert
CREATE OR REPLACE FUNCTION public.trg_assign_feedx_id()
RETURNS TRIGGER AS $$
DECLARE
    v_year INT := 26;
    v_code TEXT := 'IA';
BEGIN
    -- Extract year from roll_number if present
    IF NEW.roll_number ~ '^[0-9]{2}' THEN
        v_year := SUBSTRING(NEW.roll_number FROM 1 FOR 2)::INT;
    END IF;

    -- Assign standardized FEEDX ID if null or non-standard
    IF NEW.feedx_id IS NULL OR NEW.feedx_id !~ '^FX-[0-9]{2}-[A-Z0-9]{2}-[0-9]{7}$' THEN
        NEW.feedx_id := public.generate_standard_feedx_id(v_year, v_code);
    END IF;

    -- Assign Quizue ID if null
    IF NEW.quizue_id IS NULL THEN
        NEW.quizue_id := public.generate_quizue_id(NEW.feedx_id);
    END IF;

    -- Sync qr_code_data
    IF NEW.qr_code_data IS NULL THEN
        NEW.qr_code_data := jsonb_build_object(
            'fid', NEW.feedx_id,
            'qid', NEW.quizue_id,
            'type', 'FEEDX_STUDENT_VERIFICATION',
            'v', 1
        )::TEXT;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_students_assign_feedx_id ON public.students;
CREATE TRIGGER trg_students_assign_feedx_id
    BEFORE INSERT OR UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_assign_feedx_id();

-- 6. Backfill existing records with standardized FX-YY-CC-XXXXXXX IDs
DO $$
DECLARE
    r RECORD;
    v_new_fid TEXT;
    v_new_qid TEXT;
    v_year INT;
    v_code TEXT;
BEGIN
    FOR r IN SELECT id, roll_number, feedx_id FROM public.students WHERE feedx_id IS NULL OR feedx_id !~ '^FX-[0-9]{2}-[A-Z0-9]{2}-[0-9]{7}$' LOOP
        v_year := 26;
        v_code := 'IA';
        IF r.roll_number ~ '^[0-9]{2}' THEN
            v_year := SUBSTRING(r.roll_number FROM 1 FOR 2)::INT;
        END IF;

        v_new_fid := public.generate_standard_feedx_id(v_year, v_code);
        v_new_qid := public.generate_quizue_id(v_new_fid);

        UPDATE public.students
        SET feedx_id = v_new_fid,
            quizue_id = v_new_qid,
            qr_code_data = jsonb_build_object('fid', v_new_fid, 'qid', v_new_qid, 'type', 'FEEDX_STUDENT_VERIFICATION', 'v', 1)::TEXT,
            identity_status = 'verified'
        WHERE id = r.id;

        -- Sync users table if user exists
        UPDATE public.users
        SET feedx_id = v_new_fid,
            quizue_id = v_new_qid
        WHERE id = r.id;
    END LOOP;
END;
$$;

-- 7. Add Unique & Performance Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_feedx_id_unique ON public.students(feedx_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_quizue_id_unique ON public.students(quizue_id);
CREATE INDEX IF NOT EXISTS idx_users_feedx_id ON public.users(feedx_id);
