-- FEEDX production feature tables (run after schema + account_activation)

create extension if not exists pgcrypto;

-- ==========================================
-- EVENT REGISTRATIONS
-- ==========================================
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status text default 'registered' check (status in ('registered', 'cancelled', 'attended')),
  qr_token text,
  registered_at timestamptz default now(),
  unique (event_id, user_id)
);

create index if not exists idx_event_registrations_user on public.event_registrations(user_id);
create index if not exists idx_event_registrations_event on public.event_registrations(event_id);

-- Sync registered count on events
create or replace function public.sync_event_registered_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' and new.status = 'registered' then
    update public.events set registered = coalesce(registered, 0) + 1 where id = new.event_id;
  elsif tg_op = 'DELETE' and old.status = 'registered' then
    update public.events set registered = greatest(coalesce(registered, 0) - 1, 0) where id = old.event_id;
  elsif tg_op = 'UPDATE' then
    if old.status = 'registered' and new.status != 'registered' then
      update public.events set registered = greatest(coalesce(registered, 0) - 1, 0) where id = old.event_id;
    elsif old.status != 'registered' and new.status = 'registered' then
      update public.events set registered = coalesce(registered, 0) + 1 where id = new.event_id;
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_sync_event_registered on public.event_registrations;
create trigger trg_sync_event_registered
after insert or update or delete on public.event_registrations
for each row execute function public.sync_event_registered_count();

-- ==========================================
-- BOOKMARKS
-- ==========================================
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('event', 'opportunity', 'resource')),
  entity_id uuid not null,
  created_at timestamptz default now(),
  unique (user_id, entity_type, entity_id)
);

create index if not exists idx_bookmarks_user on public.bookmarks(user_id);

-- ==========================================
-- COMMUNITY LINKS (DB-backed Join Us)
-- ==========================================
create table if not exists public.community_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  url text not null,
  icon text default 'globe',
  members text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Seed default links if empty
insert into public.community_links (name, description, url, icon, sort_order)
select * from (values
  ('Website', 'Official FeedX Polytechnic Website', 'https://feedxpolytechnic.com', 'globe', 1),
  ('WhatsApp Channel', 'Join our public channel for instant updates', 'https://whatsapp.com/channel/0029Vaqm8e4IN9iqTfXumX1r', 'message-circle', 2),
  ('Instagram', 'Follow us for the latest campus moments', 'https://instagram.com/feedx_official', 'instagram', 3),
  ('LinkedIn', 'Connect with our professional community', 'https://linkedin.com/company/feedx-tg-polytechnic-community', 'linkedin', 4),
  ('YouTube', 'Subscribe for tutorials and event highlights', 'https://youtube.com/@feedx_official', 'youtube', 5)
) as v(name, description, url, icon, sort_order)
where not exists (select 1 from public.community_links limit 1);

-- ==========================================
-- COMING SOON / NOTIFY ME
-- ==========================================
create table if not exists public.feature_waitlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  feature_key text not null,
  created_at timestamptz default now(),
  unique (user_id, feature_key)
);

-- ==========================================
-- RLS (safe defaults)
-- ==========================================
alter table public.event_registrations enable row level security;
alter table public.bookmarks enable row level security;
alter table public.community_links enable row level security;
alter table public.feature_waitlist enable row level security;

drop policy if exists "event_registrations_own" on public.event_registrations;
create policy "event_registrations_own" on public.event_registrations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "bookmarks_own" on public.bookmarks;
create policy "bookmarks_own" on public.bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "community_links_read" on public.community_links;
create policy "community_links_read" on public.community_links for select using (is_active = true);

drop policy if exists "feature_waitlist_own" on public.feature_waitlist;
create policy "feature_waitlist_own" on public.feature_waitlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Support anonymous mode
alter table public.issues add column if not exists is_anonymous boolean default false;
alter table public.issues add column if not exists attachment_urls text[] default '{}';

-- Per-user read state for broadcast notifications
create table if not exists public.notification_reads (
  user_id uuid not null references public.users(id) on delete cascade,
  notification_id uuid not null references public.notifications(id) on delete cascade,
  read_at timestamptz default now(),
  primary key (user_id, notification_id)
);

alter table public.notification_reads enable row level security;
drop policy if exists "notification_reads_own" on public.notification_reads;
create policy "notification_reads_own" on public.notification_reads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ==========================================
-- OPPORTUNITY APPLICATIONS
-- ==========================================
create table if not exists public.opportunity_applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status text default 'applied' check (status in ('applied', 'shortlisted', 'rejected', 'withdrawn')),
  applied_at timestamptz default now(),
  unique (opportunity_id, user_id)
);

create index if not exists idx_opp_apps_user on public.opportunity_applications(user_id);

alter table public.opportunity_applications enable row level security;
drop policy if exists "opp_apps_own" on public.opportunity_applications;
create policy "opp_apps_own" on public.opportunity_applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ==========================================
-- ISSUE TIMELINE
-- ==========================================
create table if not exists public.issue_timeline (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  status text,
  note text,
  actor_id uuid references public.users(id),
  created_at timestamptz default now()
);

create index if not exists idx_issue_timeline_issue on public.issue_timeline(issue_id);

alter table public.issue_timeline enable row level security;
drop policy if exists "issue_timeline_read" on public.issue_timeline;
create policy "issue_timeline_read" on public.issue_timeline for select using (true);
drop policy if exists "issue_timeline_insert" on public.issue_timeline;
create policy "issue_timeline_insert" on public.issue_timeline for insert with check (auth.uid() is not null);

-- Issue admin response + tasks columns
alter table public.issues add column if not exists response text;
alter table public.issues add column if not exists updated_at timestamptz default now();
alter table public.tasks add column if not exists status text default 'Pending';
alter table public.tasks add column if not exists priority text default 'Medium';
alter table public.tasks add column if not exists deadline timestamptz;
alter table public.tasks add column if not exists description text;

do $$
declare tbl text;
begin
  foreach tbl in array array['event_registrations', 'bookmarks', 'opportunity_applications', 'issue_timeline']
  loop
    if to_regclass('public.' || tbl) is not null and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = tbl
    ) then
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    end if;
  end loop;
end $$;
