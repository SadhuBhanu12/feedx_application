-- FEEDX First-Time Account Activation schema
-- Passwords are stored ONLY in Supabase Auth (auth.users), never in plain text here.

create extension if not exists pgcrypto;

-- ==========================================
-- USERS: activation fields
-- ==========================================
alter table public.users add column if not exists pin_number text;
alter table public.users add column if not exists date_of_birth date;
alter table public.users add column if not exists is_password_set boolean default false;
alter table public.users add column if not exists first_login_completed boolean default false;
alter table public.users add column if not exists password_changed_at timestamptz;
alter table public.users add column if not exists updated_at timestamptz default now();

create index if not exists idx_users_pin_dob on public.users (pin_number, date_of_birth);

-- Students table fallback (if used by admin import)
alter table public.students add column if not exists pin_number text;
alter table public.students add column if not exists is_password_set boolean default false;

-- Student profiles fallback (legacy schema)
alter table public.student_profiles add column if not exists pin_number text;
alter table public.student_profiles add column if not exists is_password_set boolean default false;
alter table public.student_profiles add column if not exists first_login_completed boolean default false;

-- ==========================================
-- Rate limiting & audit
-- ==========================================
create table if not exists public.activation_attempts (
  id uuid primary key default gen_random_uuid(),
  attempt_key text not null,
  failed_count int default 0,
  locked_until timestamptz,
  last_attempt_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (attempt_key)
);

create table if not exists public.activation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.activation_logs (
  id uuid primary key default gen_random_uuid(),
  attempt_key text,
  user_id uuid references public.users(id) on delete set null,
  event_type text not null,
  ip_address text,
  created_at timestamptz default now()
);

create index if not exists idx_activation_sessions_token on public.activation_sessions (token);
create index if not exists idx_activation_logs_created on public.activation_logs (created_at desc);

-- Auto-update users.updated_at
create or replace function public.set_users_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_users_updated_at();
