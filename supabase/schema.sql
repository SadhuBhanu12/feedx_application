-- FeedX Polytechnic production schema
create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text check (role in ('student','admin','counsellor')) default 'student',
  phone text,
  avatar_url text,
  pin_number text,
  date_of_birth date,
  is_password_set boolean default false,
  first_login_completed boolean default false,
  password_changed_at timestamptz,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id) on delete cascade,
  roll_no text unique,
  college text,
  branch text,
  year int,
  section text,
  date_of_birth date,
  gender text,
  address text,
  interests text[],
  skills text[],
  resume_url text,
  bio text,
  cgpa numeric,
  force_password_change boolean default true,
  created_at timestamp default now()
);

create table if not exists internships (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  type text default 'Internship',
  description text,
  location text,
  stipend text,
  mode text check (mode in ('remote','onsite','hybrid')),
  skills_required text[],
  deadline date,
  posted_by uuid references users(id),
  created_at timestamp default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  internship_id uuid references internships(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  status text check (status in ('applied','shortlisted','rejected','selected')) default 'applied',
  cover_letter text,
  resume_url text,
  applied_at timestamp default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  message text not null,
  type text,
  is_read boolean default false,
  created_at timestamp default now()
);

create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references users(id),
  action text not null,
  target_type text,
  target_id uuid,
  created_at timestamp default now()
);

create table if not exists ai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  message text,
  response text,
  created_at timestamp default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  deadline date,
  completed boolean default false,
  created_at timestamp default now()
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  subject text not null,
  present int default 0,
  total int default 0,
  updated_at timestamp default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  branch text not null,
  title text not null,
  resource_type text default 'PDF',
  file_url text not null,
  created_at timestamp default now()
);

create table if not exists timetable (
  id uuid primary key default gen_random_uuid(),
  branch text not null,
  year int not null,
  day text not null,
  subject text not null,
  time text not null,
  created_at timestamp default now()
);

create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  description text not null,
  status text check (status in ('pending','in_progress','resolved')) default 'pending',
  response text,
  created_at timestamp default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  venue text,
  type text,
  description text,
  capacity int default 0,
  registered int default 0,
  created_at timestamp default now()
);

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

create table if not exists community_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  members text,
  url text not null,
  created_at timestamp default now()
);

create table if not exists tips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type text,
  created_at timestamp default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  byline text,
  likes int default 0,
  created_at timestamp default now()
);
