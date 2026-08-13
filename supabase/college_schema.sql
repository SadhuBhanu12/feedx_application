create extension if not exists pgcrypto;

-- 1. Main Colleges Table
create table if not exists colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  placements text,
  fee text,
  description text,
  website text,
  ranking int,
  created_at timestamp default now()
);

-- Safely add new columns to existing colleges table
alter table colleges 
  add column if not exists type text default 'Private',
  add column if not exists established_year int,
  add column if not exists rating numeric(2,1),
  add column if not exists logo_url text,
  add column if not exists banner_url text;

-- 2. College Courses (Branches)
create table if not exists college_courses (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references colleges(id) on delete cascade,
  course_name text not null,
  duration text,
  seats int,
  created_at timestamp default now()
);

-- 3. College Facilities
create table if not exists college_facilities (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references colleges(id) on delete cascade,
  facility_name text not null,
  created_at timestamp default now()
);

-- 4. College Placements History
create table if not exists college_placements (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references colleges(id) on delete cascade,
  company_name text not null,
  package text,
  year int,
  created_at timestamp default now()
);

-- 5. College Gallery
create table if not exists college_gallery (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references colleges(id) on delete cascade,
  image_url text not null,
  created_at timestamp default now()
);

-- Add Row Level Security (RLS) policies
alter table colleges enable row level security;
alter table college_courses enable row level security;
alter table college_facilities enable row level security;
alter table college_placements enable row level security;
alter table college_gallery enable row level security;

-- Allow public read access to all college data
create policy "Allow public read access to colleges" on colleges for select using (true);
create policy "Allow public read access to college_courses" on college_courses for select using (true);
create policy "Allow public read access to college_facilities" on college_facilities for select using (true);
create policy "Allow public read access to college_placements" on college_placements for select using (true);
create policy "Allow public read access to college_gallery" on college_gallery for select using (true);
