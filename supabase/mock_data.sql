-- 🧪 FEEDX STARTER MOCK DATA (Idempotent Version)
-- This script populates the 7-Level Hierarchy with sample data for testing.
-- Run this AFTER production_ready_schema.sql

-- 1. LEVEL 1: COLLEGES
INSERT INTO public.colleges (id, college_name, college_code, location, type, principal_name)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Government Polytechnic College', 'GPC001', 'City Center', 'Polytechnic', 'Dr. Arshad Khan'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Apex Institute of Technology', 'AIT002', 'North Zone', 'Engineering', 'Prof. Sarah Williams')
ON CONFLICT (id) DO NOTHING;

-- 2. LEVEL 2: BRANCHES
INSERT INTO public.branches (id, college_id, branch_name, branch_code, hod_name)
VALUES 
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Computer Science', 'CSE', 'Dr. John Doe'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Electronics & Comm', 'ECE', 'Prof. Jane Smith')
ON CONFLICT (id) DO NOTHING;

-- 3. LEVEL 3: ACADEMIC YEARS
INSERT INTO public.academic_years (id, branch_id, year_name, semester)
VALUES 
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', '2nd Year', '3'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', '3rd Year', '5')
ON CONFLICT (id) DO NOTHING;

-- 4. LEVEL 4: SECTIONS
INSERT INTO public.sections (id, academic_year_id, section_name, class_incharge)
VALUES 
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'A', 'Prof. Alice'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'B', 'Prof. Bob')
ON CONFLICT (id) DO NOTHING;

-- 5. LEVEL 5: SUBJECTS
INSERT INTO public.subjects (branch_id, academic_year_id, subject_name, subject_code, faculty_name)
VALUES 
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'Data Structures', 'CS201', 'Prof. Alice'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'Operating Systems', 'CS202', 'Prof. Bob'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'Machine Learning', 'CS301', 'Dr. John Doe')
ON CONFLICT (academic_year_id, subject_code) DO NOTHING;

-- 6. NOTIFICATIONS
INSERT INTO public.notifications (target_college, title, message, type)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Welcome to FeedX', 'Your college ERP is now live!', 'General')
ON CONFLICT DO NOTHING;

-- 7. USERS & ADMINS
-- Base User entry
INSERT INTO public.users (id, email, full_name, role)
VALUES 
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', 'admin@feedx.app', 'Admin Bhanu', 'super_admin')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

-- Admin Profile entry
INSERT INTO public.admins (id, name, email, role, institution_id)
VALUES 
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', 'Admin Bhanu', 'admin@feedx.app', 'super_admin', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
ON CONFLICT (id) DO NOTHING;

-- 8. ACTIVITY LOGS
INSERT INTO public.activity_logs (admin_id, action, target_table)
VALUES 
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', 'Initialized System', 'colleges')
ON CONFLICT DO NOTHING;
