-- Run this in your Supabase SQL Editor AFTER running college_schema.sql

-- 1. Insert Mock Colleges
INSERT INTO colleges (id, name, location, type, established_year, ranking, rating, placements, fee, description, website, logo_url, banner_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Government Polytechnic, Masab Tank', 'Hyderabad, Telangana', 'Govt', 1956, 1, 4.8, '100% Placement Assistance. Top recruiters include L&T, Tech Mahindra.', '₹3,500/year', 'One of the oldest and most prestigious polytechnic institutions in Telangana, known for excellent faculty and robust infrastructure.', 'https://gptmasabtank.ac.in', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Osmania_University_Logo.svg/1200px-Osmania_University_Logo.svg.png', 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop'),
  ('22222222-2222-2222-2222-222222222222', 'Quli Qutub Shah Government Polytechnic', 'Hyderabad, Telangana', 'Govt', 1992, 4, 4.2, 'Strong alumni network with excellent industry connections.', '₹3,500/year', 'Located in the heart of the city, offering quality technical education to diverse students.', 'https://qqsgpt.ac.in', null, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop'),
  ('33333333-3333-3333-3333-333333333333', 'VNR Vignana Jyothi Institute of Engineering and Technology', 'Bachupally, Hyderabad', 'Private', 1995, 2, 4.7, 'Highest Package: 48 LPA. Top recruiters: Amazon, Microsoft, TCS.', '₹1,35,000/year', 'A premier private institution offering both diploma and degree programs with state-of-the-art facilities.', 'https://vnrvjiet.ac.in', 'https://vnrvjiet.ac.in/assets/images/vnrlogo.png', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop');

-- 2. Insert Mock Courses
INSERT INTO college_courses (college_id, course_name, duration, seats)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Diploma in Computer Engineering', '3 Years', 120),
  ('11111111-1111-1111-1111-111111111111', 'Diploma in Electronics & Communication', '3 Years', 120),
  ('11111111-1111-1111-1111-111111111111', 'Diploma in Mechanical Engineering', '3 Years', 60),
  ('33333333-3333-3333-3333-333333333333', 'Diploma in Civil Engineering', '3 Years', 60),
  ('33333333-3333-3333-3333-333333333333', 'Diploma in Automobile Engineering', '3 Years', 60);

-- 3. Insert Mock Facilities
INSERT INTO college_facilities (college_id, facility_name)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Boys & Girls Hostel'),
  ('11111111-1111-1111-1111-111111111111', 'Digital Library'),
  ('11111111-1111-1111-1111-111111111111', 'NCC / NSS Units'),
  ('33333333-3333-3333-3333-333333333333', 'Incubation Center'),
  ('33333333-3333-3333-3333-333333333333', 'High-speed Campus WiFi'),
  ('33333333-3333-3333-3333-333333333333', 'Advanced Robotics Lab');

-- 4. Insert Mock Placements
INSERT INTO college_placements (college_id, company_name, package, year)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Larsen & Toubro', '₹3.5 LPA', 2024),
  ('11111111-1111-1111-1111-111111111111', 'Tech Mahindra', '₹3.0 LPA', 2024),
  ('33333333-3333-3333-3333-333333333333', 'TCS Ninja', '₹3.36 LPA', 2024),
  ('33333333-3333-3333-3333-333333333333', 'Wipro WILP', '₹3.0 LPA + M.Tech', 2024);
