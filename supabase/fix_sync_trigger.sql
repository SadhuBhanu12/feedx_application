-- ============================================================
-- FIX: sync_students_to_profiles references missing "section" column
-- Run once in Supabase SQL Editor (v6.0 polytechnic schema)
-- ============================================================

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

  v_col_name := (SELECT name FROM public.colleges WHERE id = NEW.college_id);
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

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
