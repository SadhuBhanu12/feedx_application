-- ============================================================
-- GPA & CGPA AUTOMATED DATABASE ENGINE
-- ============================================================

-- 1. Create student_grades table (Subject Details)
CREATE TABLE IF NOT EXISTS public.student_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    internal_marks NUMERIC DEFAULT 0,
    external_marks NUMERIC DEFAULT 0,
    total_marks NUMERIC NOT NULL,
    grade VARCHAR(5),
    grade_point INTEGER,
    semester_number INTEGER NOT NULL,
    pass_status VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create student_semesters table (Semester Details)
CREATE TABLE IF NOT EXISTS public.student_semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    semester_number INTEGER NOT NULL,
    total_credits NUMERIC DEFAULT 0,
    total_credit_points NUMERIC DEFAULT 0,
    gpa NUMERIC DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, semester_number)
);

-- 3. Trigger to calculate Grade & Grade Point automatically before insert/update
CREATE OR REPLACE FUNCTION public.calculate_grade_from_marks()
RETURNS TRIGGER AS $$
BEGIN
    -- Convert total_marks (percentage) to Grade & Grade Point
    IF NEW.total_marks >= 90 THEN
        NEW.grade := 'O';
        NEW.grade_point := 10;
        NEW.pass_status := 'PASS';
    ELSIF NEW.total_marks >= 80 THEN
        NEW.grade := 'A+';
        NEW.grade_point := 9;
        NEW.pass_status := 'PASS';
    ELSIF NEW.total_marks >= 70 THEN
        NEW.grade := 'A';
        NEW.grade_point := 8;
        NEW.pass_status := 'PASS';
    ELSIF NEW.total_marks >= 60 THEN
        NEW.grade := 'B+';
        NEW.grade_point := 7;
        NEW.pass_status := 'PASS';
    ELSIF NEW.total_marks >= 50 THEN
        NEW.grade := 'B';
        NEW.grade_point := 6;
        NEW.pass_status := 'PASS';
    ELSIF NEW.total_marks >= 40 THEN
        NEW.grade := 'C';
        NEW.grade_point := 5;
        NEW.pass_status := 'PASS';
    ELSE
        NEW.grade := 'F';
        NEW.grade_point := 0;
        NEW.pass_status := 'FAIL';
    END IF;
    
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_grade_points ON public.student_grades;
CREATE TRIGGER trg_calculate_grade_points
BEFORE INSERT OR UPDATE ON public.student_grades
FOR EACH ROW
EXECUTE FUNCTION public.calculate_grade_from_marks();

-- 4. Trigger to sync Semester GPA and overall student CGPA automatically
CREATE OR REPLACE FUNCTION public.sync_gpa_and_cgpa()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id UUID;
    v_semester INTEGER;
    v_total_credits NUMERIC;
    v_total_points NUMERIC;
    v_semester_gpa NUMERIC;
    
    v_overall_credits NUMERIC;
    v_overall_points NUMERIC;
    v_cgpa NUMERIC;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_student_id := OLD.student_id;
        v_semester := OLD.semester_number;
    ELSE
        v_student_id := NEW.student_id;
        v_semester := NEW.semester_number;
    END IF;

    -- Guard: If student does not exist (parent record was deleted or is being deleted), skip sync
    IF NOT EXISTS (SELECT 1 FROM public.students WHERE id = v_student_id) THEN
        RETURN NULL;
    END IF;

    -- A. Calculate and update Semester GPA
    SELECT COALESCE(SUM(credits), 0), COALESCE(SUM(credits * grade_point), 0)
    INTO v_total_credits, v_total_points
    FROM public.student_grades
    WHERE student_id = v_student_id AND semester_number = v_semester;

    IF v_total_credits > 0 THEN
        v_semester_gpa := ROUND((v_total_points / v_total_credits), 2);
    ELSE
        v_semester_gpa := 0.0;
    END IF;

    INSERT INTO public.student_semesters (student_id, semester_number, total_credits, total_credit_points, gpa, updated_at)
    VALUES (v_student_id, v_semester, v_total_credits, v_total_points, v_semester_gpa, now())
    ON CONFLICT (student_id, semester_number) DO UPDATE
    SET total_credits = EXCLUDED.total_credits,
        total_credit_points = EXCLUDED.total_credit_points,
        gpa = EXCLUDED.gpa,
        updated_at = now();

    -- B. Calculate and update overall student CGPA in public.students
    SELECT COALESCE(SUM(total_credits), 0), COALESCE(SUM(total_credit_points), 0)
    INTO v_overall_credits, v_overall_points
    FROM public.student_semesters
    WHERE student_id = v_student_id;

    IF v_overall_credits > 0 THEN
        v_cgpa := ROUND((v_overall_points / v_overall_credits), 2);
    ELSE
        v_cgpa := 0.0;
    END IF;

    UPDATE public.students
    SET cgpa = v_cgpa
    WHERE id = v_student_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_gpa_and_cgpa ON public.student_grades;
CREATE TRIGGER trg_sync_gpa_and_cgpa
AFTER INSERT OR UPDATE OR DELETE ON public.student_grades
FOR EACH ROW
EXECUTE FUNCTION public.sync_gpa_and_cgpa();

-- 5. Row Level Security Policies
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_semesters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students_manage_own_grades" ON public.student_grades;
CREATE POLICY "students_manage_own_grades" ON public.student_grades
    FOR ALL TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "admins_read_all_grades" ON public.student_grades;
CREATE POLICY "admins_read_all_grades" ON public.student_grades
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "students_manage_own_semesters" ON public.student_semesters;
CREATE POLICY "students_manage_own_semesters" ON public.student_semesters
    FOR ALL TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "admins_read_all_semesters" ON public.student_semesters;
CREATE POLICY "admins_read_all_semesters" ON public.student_semesters
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

-- 6. Permissions
GRANT ALL ON public.student_grades TO authenticated;
GRANT ALL ON public.student_semesters TO authenticated;
