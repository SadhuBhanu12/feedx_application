CREATE OR REPLACE FUNCTION public.bulk_import_students(student_data JSONB)
RETURNS TEXT AS $$
DECLARE
  student RECORD;
  new_id UUID;
  success_count INT := 0;
BEGIN
  -- Loop through the JSON array of students
  FOR student IN SELECT * FROM jsonb_to_recordset(student_data) AS x(
    roll_number TEXT,
    full_name TEXT,
    email TEXT,
    college_id UUID,
    branch_id UUID,
    academic_year_id UUID
  )
  LOOP
    -- 1. Generate a new UUID for the student
    new_id := uuid_generate_v4();

    -- 2. Insert into the users table first (required for hierarchy)
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (new_id, student.email, student.full_name, 'student')
    ON CONFLICT (email) DO NOTHING;

    -- 3. Insert into the students table
    INSERT INTO public.students (id, roll_number, full_name, email, college_id, branch_id, academic_year_id, is_password_set)
    VALUES (new_id, student.roll_number, student.full_name, student.email, student.college_id, student.branch_id, student.academic_year_id, false)
    ON CONFLICT (email) DO NOTHING;

    success_count := success_count + 1;
  END LOOP;

  RETURN success_count || ' students successfully imported!';
END;
$$ LANGUAGE plpgsql;
