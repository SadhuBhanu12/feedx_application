# FeedX Polytechnic - Flutter Master Prompt

Build a production-grade Flutter app called **FeedX Polytechnic** with:

- Student app
- Admin panel
- Supabase backend
- Realtime updates
- Premium educational platform UI/UX

---

## Core Product

FeedX = Feed + X

- Feed: Skills, Opportunities, Knowledge
- X: Exposure, Exchange, Career Growth

The app should feel like a modern startup product used daily.

---

## Tech Stack

- Flutter (latest stable)
- Supabase (Auth, Database, Realtime, Storage)
- Riverpod/Bloc (pick one; use clean architecture)
- go_router / Navigator 2.0 routing
- Material 3 theming

---

## Authentication + Roles

- Supabase Auth login
- Role-based access:
  - `student`
  - `admin`
- Store role in `students.role` (`TEXT`, default `student`)
- Routing:
  - admin -> Admin Dashboard
  - student -> Student App

Pseudo:

```dart
if (user.role == 'admin') {
  context.go('/admin');
} else {
  context.go('/student');
}
```

---

## Student App Features

- Dashboard (daily summary)
- Tasks
- Timetable
- Attendance
- Academic hub (notes/resources)
- Opportunities hub
- Notifications/updates (realtime)
- Issue reporting
- Profile

---

## Admin System (Required)

Create full Admin Panel with:

### 1) Admin Dashboard
- Total students
- Active users
- Total tasks
- Total opportunities
- Recent activity feed

### 2) Student Management
- Add/edit/delete student
- Fields: name, roll no (unique), branch, year, email
- Search/filter
- Optional CSV bulk upload

### 3) Notification Management
- Create/edit/delete notifications
- Fields: title, description, target (`all/branch/year`)
- Push/store in `notifications` table

### 4) Opportunity Management
- Create/edit/delete internships/jobs/hackathons
- Fields: title, company, type, link, description
- Filter by category

### 5) Academic Content Management
- Create/edit/delete notes/resources
- Fields: subject, branch, file/pdf URL

### 6) Timetable Management
- Create/edit/delete entries
- Fields: branch, year, day, subject, time

### 7) Attendance Management
- Add/update attendance by roll + subject
- Present/total
- Optional bulk update

### 8) Task Management (Admin Side)
- Assign tasks to student or class
- Track completion

### 9) Issue Management
- View all issues
- Filter pending/resolved
- Update status and respond

### 10) Basic Analytics
- Engagement metrics
- Most used features
- Attendance trends

---

## Realtime Requirement

All admin changes must reflect immediately in student app via Supabase Realtime:

- notifications
- tasks
- opportunities
- issues
- timetable
- attendance

---

## Security + RLS

Students:
- can only read/update their own records

Admins:
- can read/write all required tables

Example policy intent:

- student read own row: `auth.uid() = user_id`
- admin full access via role check (join/profile claim approach)

Implement robust RLS for all tables.

---

## UI/UX Requirements

### Visual
- Premium educational platform look
- Clean cards, proper spacing, strong typography hierarchy
- Consistent token-based design system

### Theme System
- Full light/dark support
- Branded color tokens
- Centralized theme extension

### Onboarding
- OTP-style onboarding flow screens
- Professional first impression

### Motion
- Smooth micro-interactions:
  - press scale
  - stagger list entrance
  - modal blur/glass feel
  - polished transitions
- Keep admin animations minimal and functional

### Home
- Advanced home hero section with strong motion choreography

### Deep pages
- College detail page
- Event detail page

---

## Admin UI Guidelines

- Keep admin UI clean and fast
- Use cards + tables/lists
- Use modal forms for create/edit
- Avoid heavy animation in admin area

---

## Folder Structure

```text
lib/
  core/
  shared/
  features/
    auth/
    student/
      dashboard/
      tasks/
      timetable/
      attendance/
      academics/
      opportunities/
      updates/
      issues/
      profile/
    admin/
      dashboard/
      students/
      notifications/
      opportunities/
      academics/
      timetable/
      attendance/
      tasks/
      issues/
      analytics/
```

---

## Build Order (Strict)

1. Database schema + role column + RLS
2. Auth + role routing
3. Admin nav + core CRUD (students, notifications, opportunities)
4. Student dashboard + realtime sync
5. Remaining modules
6. Theme system + onboarding polish + advanced UI motion
7. QA pass + performance pass

---

## Goal

Deliver a startup-level SaaS ecosystem:

- Student app
- Admin control center
- Secure Supabase backend
- Realtime synchronization
- Professional, premium UX

