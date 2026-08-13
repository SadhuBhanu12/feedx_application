-- FeedX Realtime Publication Registration
-- Run AFTER complete_setup_unified.sql if tables already exist
-- This script adds tables to the Supabase realtime publication for live subscriptions

do $$
declare
  tbl text;
  tables text[] := array[
    'notifications',
    'attendance',
    'timetables',
    'tasks',
    'resources',
    'events',
    'event_registrations',
    'opportunities',
    'bookmarks',
    'issues',
    'community_links',
    'college_notices',
    'student_profiles',
    'users'
  ];
begin
  foreach tbl in array tables
  loop
    if to_regclass('public.' || tbl) is not null and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = tbl
    ) then
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    end if;
  end loop;
end $$;
