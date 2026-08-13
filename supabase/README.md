# Supabase Backend Setup (FeedX)

Run in SQL editor, in order (important):

1. `schema.sql`
2. `account_activation.sql`
3. `production_features.sql`
4. `rls.sql`
5. `realtime.sql`

If you got `relation "notifications" does not exist`, it means `rls.sql` was run before tables were created.
Run `schema.sql` first, then rerun `rls.sql` and `realtime.sql`.

## First-Time Login / Account Activation

Deploy edge functions:

```bash
supabase functions deploy verify-identity
supabase functions deploy complete-activation
supabase functions deploy check-login-eligibility
```

Student flow:
1. First Time Login → PIN + DOB verification
2. Create Password → secure password stored in Supabase Auth
3. Normal Login → Email/Roll + Password

Admin must set `pin_number` and `date_of_birth` on `users` when importing students.
Passwords are never stored in plain text in Postgres — only in Supabase Auth.

## Storage buckets

Create these buckets in Supabase Storage (public read for profile photos):

| Bucket | Purpose |
|--------|---------|
| `profile-photos` | Student avatar uploads |
| `support-attachments` | Support ticket screenshots/PDFs |
| `uploads` | Admin resource uploads |

## Environment variables (Expo)

Set in `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Edge Functions

- `functions/send-notification`
- `functions/validate-internship`

Deploy with Supabase CLI:

```bash
supabase functions deploy send-notification
supabase functions deploy validate-internship
```

## Notes

- `users.id` must match `auth.users.id`
- Add admins by updating `users.role = 'admin'`
- Realtime is enabled for notifications/applications/internships/tasks/issues/attendance/timetable
