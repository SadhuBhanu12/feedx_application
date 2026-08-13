create or replace function is_admin() returns boolean
language sql stable
as $$
  select exists (
    select 1 from users
    where id = auth.uid() and role = 'admin'
  );
$$;

do $$
begin
  if to_regclass('public.users') is not null then
    execute 'alter table public.users enable row level security';
    execute 'drop policy if exists "users-own-read" on public.users';
    execute 'drop policy if exists "users-own-update" on public.users';
    execute 'create policy "users-own-read" on public.users for select using (auth.uid() = id or is_admin())';
    execute 'create policy "users-own-update" on public.users for update using (auth.uid() = id or is_admin())';
  end if;

  if to_regclass('public.student_profiles') is not null then
    execute 'alter table public.student_profiles enable row level security';
    execute 'drop policy if exists "student-profile-own" on public.student_profiles';
    execute 'drop policy if exists "student-profile-write-own" on public.student_profiles';
    execute 'drop policy if exists "student-profile-update-own" on public.student_profiles';
    execute 'create policy "student-profile-own" on public.student_profiles for select using (user_id = auth.uid() or is_admin())';
    execute 'create policy "student-profile-write-own" on public.student_profiles for insert with check (user_id = auth.uid() or is_admin())';
    execute 'create policy "student-profile-update-own" on public.student_profiles for update using (user_id = auth.uid() or is_admin())';
  end if;

  if to_regclass('public.internships') is not null then
    execute 'alter table public.internships enable row level security';
    execute 'drop policy if exists "internships-read-all" on public.internships';
    execute 'drop policy if exists "internships-admin-write" on public.internships';
    execute 'create policy "internships-read-all" on public.internships for select using (true)';
    execute 'create policy "internships-admin-write" on public.internships for all using (is_admin()) with check (is_admin())';
  end if;

  if to_regclass('public.applications') is not null then
    execute 'alter table public.applications enable row level security';
    execute 'drop policy if exists "applications-own-read" on public.applications';
    execute 'drop policy if exists "applications-own-insert" on public.applications';
    execute 'drop policy if exists "applications-admin-update" on public.applications';
    execute 'create policy "applications-own-read" on public.applications for select using (user_id = auth.uid() or is_admin())';
    execute 'create policy "applications-own-insert" on public.applications for insert with check (user_id = auth.uid() or is_admin())';
    execute 'create policy "applications-admin-update" on public.applications for update using (user_id = auth.uid() or is_admin())';
  end if;

  if to_regclass('public.notifications') is not null then
    execute 'alter table public.notifications enable row level security';
    execute 'drop policy if exists "notifications-own-read" on public.notifications';
    execute 'drop policy if exists "notifications-admin-write" on public.notifications';
    execute 'create policy "notifications-own-read" on public.notifications for select using (user_id = auth.uid() or is_admin())';
    execute 'create policy "notifications-admin-write" on public.notifications for all using (is_admin()) with check (is_admin())';
  end if;

  if to_regclass('public.admin_logs') is not null then
    execute 'alter table public.admin_logs enable row level security';
    execute 'drop policy if exists "admin-logs-admin-read" on public.admin_logs';
    execute 'drop policy if exists "admin-logs-admin-write" on public.admin_logs';
    execute 'create policy "admin-logs-admin-read" on public.admin_logs for select using (is_admin())';
    execute 'create policy "admin-logs-admin-write" on public.admin_logs for insert with check (is_admin())';
  end if;

  if to_regclass('public.ai_chats') is not null then
    execute 'alter table public.ai_chats enable row level security';
    execute 'drop policy if exists "ai-chat-own" on public.ai_chats';
    execute 'drop policy if exists "ai-chat-own-insert" on public.ai_chats';
    execute 'create policy "ai-chat-own" on public.ai_chats for select using (user_id = auth.uid() or is_admin())';
    execute 'create policy "ai-chat-own-insert" on public.ai_chats for insert with check (user_id = auth.uid() or is_admin())';
  end if;

  if to_regclass('public.tasks') is not null then
    execute 'alter table public.tasks enable row level security';
    execute 'drop policy if exists "tasks-own-read" on public.tasks';
    execute 'drop policy if exists "tasks-own-write" on public.tasks';
    execute 'create policy "tasks-own-read" on public.tasks for select using (user_id = auth.uid() or is_admin())';
    execute 'create policy "tasks-own-write" on public.tasks for all using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid() or is_admin())';
  end if;

  if to_regclass('public.attendance') is not null then
    execute 'alter table public.attendance enable row level security';
    execute 'drop policy if exists "attendance-own-read" on public.attendance';
    execute 'drop policy if exists "attendance-admin-write" on public.attendance';
    execute 'create policy "attendance-own-read" on public.attendance for select using (user_id = auth.uid() or is_admin())';
    execute 'create policy "attendance-admin-write" on public.attendance for all using (is_admin()) with check (is_admin())';
  end if;

  if to_regclass('public.notes') is not null then
    execute 'alter table public.notes enable row level security';
    execute 'drop policy if exists "notes-read-all" on public.notes';
    execute 'drop policy if exists "notes-admin-write" on public.notes';
    execute 'create policy "notes-read-all" on public.notes for select using (true)';
    execute 'create policy "notes-admin-write" on public.notes for all using (is_admin()) with check (is_admin())';
  end if;

  if to_regclass('public.timetable') is not null then
    execute 'alter table public.timetable enable row level security';
    execute 'drop policy if exists "timetable-read-all" on public.timetable';
    execute 'drop policy if exists "timetable-admin-write" on public.timetable';
    execute 'create policy "timetable-read-all" on public.timetable for select using (true)';
    execute 'create policy "timetable-admin-write" on public.timetable for all using (is_admin()) with check (is_admin())';
  end if;

  if to_regclass('public.issues') is not null then
    execute 'alter table public.issues enable row level security';
    execute 'drop policy if exists "issues-own-read" on public.issues';
    execute 'drop policy if exists "issues-own-insert" on public.issues';
    execute 'drop policy if exists "issues-admin-update" on public.issues';
    execute 'create policy "issues-own-read" on public.issues for select using (user_id = auth.uid() or is_admin())';
    execute 'create policy "issues-own-insert" on public.issues for insert with check (user_id = auth.uid() or is_admin())';
    execute 'create policy "issues-admin-update" on public.issues for update using (user_id = auth.uid() or is_admin())';
  end if;

  if to_regclass('public.events') is not null then
    execute 'alter table public.events enable row level security';
    execute 'drop policy if exists "events-read-all" on public.events';
    execute 'drop policy if exists "events-admin-write" on public.events';
    execute 'create policy "events-read-all" on public.events for select using (true)';
    execute 'create policy "events-admin-write" on public.events for all using (is_admin()) with check (is_admin())';
  end if;

  if to_regclass('public.colleges') is not null then
    execute 'alter table public.colleges enable row level security';
    execute 'drop policy if exists "colleges-read-all" on public.colleges';
    execute 'drop policy if exists "colleges-admin-write" on public.colleges';
    execute 'create policy "colleges-read-all" on public.colleges for select using (true)';
    execute 'create policy "colleges-admin-write" on public.colleges for all using (is_admin()) with check (is_admin())';
  end if;

  if to_regclass('public.community_links') is not null then
    execute 'alter table public.community_links enable row level security';
    execute 'drop policy if exists "community-read-all" on public.community_links';
    execute 'drop policy if exists "community-admin-write" on public.community_links';
    execute 'create policy "community-read-all" on public.community_links for select using (true)';
    execute 'create policy "community-admin-write" on public.community_links for all using (is_admin()) with check (is_admin())';
  end if;

  if to_regclass('public.tips') is not null then
    execute 'alter table public.tips enable row level security';
    execute 'drop policy if exists "tips-read-all" on public.tips';
    execute 'drop policy if exists "tips-admin-write" on public.tips';
    execute 'create policy "tips-read-all" on public.tips for select using (true)';
    execute 'create policy "tips-admin-write" on public.tips for all using (is_admin()) with check (is_admin())';
  end if;

  if to_regclass('public.projects') is not null then
    execute 'alter table public.projects enable row level security';
    execute 'drop policy if exists "projects-read-all" on public.projects';
    execute 'drop policy if exists "projects-admin-write" on public.projects';
    execute 'create policy "projects-read-all" on public.projects for select using (true)';
    execute 'create policy "projects-admin-write" on public.projects for all using (is_admin()) with check (is_admin())';
  end if;
end $$;
