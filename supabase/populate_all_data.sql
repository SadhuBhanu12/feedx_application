-- 🚀 FEEDX MASTER DATA POPULATION SCRIPT
-- This script fills ALL tables in the correct relational order.

DO $$ 
DECLARE 
    v_college_id UUID;
    v_branch_id UUID;
    v_year_id UUID;
    v_section_id UUID;
    v_subject_id UUID;
    v_student_id UUID;
    v_admin_id UUID;
BEGIN
    -- ==========================================
    -- 1. COLLEGES
    -- ==========================================
    INSERT INTO public.colleges (college_name, college_code, location, type)
    VALUES ('Global Institute of Technology', 'GIT001', 'Tech Park, North', 'Engineering')
    RETURNING id INTO v_college_id;

    -- ==========================================
    -- 2. BRANCHES (Linked to College)
    -- ==========================================
    INSERT INTO public.branches (college_id, branch_name, branch_code, hod_name)
    VALUES (v_college_id, 'Computer Science Engineering', 'CSE', 'Dr. Smith')
    RETURNING id INTO v_branch_id;

    -- ==========================================
    -- 3. ACADEMIC YEARS (Linked to Branch)
    -- ==========================================
    INSERT INTO public.academic_years (branch_id, year_name, semester)
    VALUES (v_branch_id, '3rd Year', '5')
    RETURNING id INTO v_year_id;

    -- ==========================================
    -- 4. SECTIONS (Linked to Academic Year)
    -- ==========================================
    INSERT INTO public.sections (academic_year_id, section_name, class_incharge)
    VALUES (v_year_id, 'Section B', 'Prof. Alice')
    RETURNING id INTO v_section_id;

    -- ==========================================
    -- 5. SUBJECTS (Linked to Year & Branch)
    -- ==========================================
    INSERT INTO public.subjects (branch_id, academic_year_id, subject_name, subject_code, faculty_name)
    VALUES (v_branch_id, v_year_id, 'Artificial Intelligence', 'AI301', 'Dr. Watson')
    RETURNING id INTO v_subject_id;

    -- ==========================================
    -- 6. ADMINS (Auth + Profile)
    -- ==========================================
    v_admin_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (v_admin_id, 'admin_global@feedx.app', '$2b$10$VcYfIAuPF6EGfmzStFPea.PdE2om3QyNSPZzHSggfn3MmtOKb.QA.', now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Chief Admin", "role": "super_admin"}', 'authenticated', 'authenticated');

    -- Trigger automatically handles public.users and public.admins

    -- Creating a second Super Admin
    v_admin_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (v_admin_id, 'feedx_admin@feedx.app', '$2b$10$QT/RjXnCCigyByFvDVQ9u.lugcTy3o0w1urpwp27t4BtkZGlV5Fhi', now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Global Super Admin", "role": "super_admin"}', 'authenticated', 'authenticated');

    -- ==========================================
    -- 7. STUDENTS (Auth + Profile + Hierarchy)
    -- ==========================================
    v_student_id := uuid_generate_v4();
    
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (v_student_id, 'student_test@feedx.app', '$2b$10$3B8JrSp1qzL69kjqj/fmj.zrRfzUgNJGQXTkWqDSy.Rquq8WY/AJO', now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "John Doe", "roll_number": "CS101", "role": "student"}', 'authenticated', 'authenticated');

    -- Link the student to the hierarchy
    UPDATE public.students SET
        college_id = v_college_id,
        branch_id = v_branch_id,
        academic_year_id = v_year_id,
        section_id = v_section_id
    WHERE id = v_student_id;

    -- ==========================================
    -- 8. TRANSACTIONAL DATA (Attendance, etc)
    -- ==========================================
    INSERT INTO public.attendance (student_id, subject_id, status, date)
    VALUES (v_student_id, v_subject_id, 'Present', CURRENT_DATE);

    INSERT INTO public.notifications (target_college, target_branch, title, message)
    VALUES (v_college_id, v_branch_id, 'Welcome to AI Batch', 'Classes start tomorrow at 9 AM.');

    RAISE NOTICE '✅ Database populated successfully with linked records.';
END $$;
