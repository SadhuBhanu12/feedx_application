# FEEDX — Complete Technical Architecture & Engineering Documentation

**Document Version:** 1.0.0  
**Target Release:** FEEDX v1.2.0 (Build 5)  
**Date:** March 2026  
**Audience:** Engineering Team, Product Leadership, Technical Stakeholders  
**Repository:** [https://github.com/SadhuBhanu12/feedx2.git](https://github.com/SadhuBhanu12/feedx2.git) (Branch: `Main`)

---

## Executive Summary

**FEEDX** is an enterprise-grade academic operating system and student engagement ecosystem engineered specifically for polytechnic institutions and colleges. Built with **React Native / Expo SDK 54** on the frontend and backed by **Supabase (PostgreSQL 15+, Auth, Realtime, Storage)** and **Cloudinary**, FEEDX bridges daily campus administration (attendance, timetables, syllabus notes, event ticketing) with gamified learning (daily coding challenges, micro-quizzes, gold coin wallets, streaks) and career enablement (internships, hackathons, placement drives).

---

## Table of Contents

1. [Frontend & Client Platform](#1-frontend--client-platform)
2. [Backend, Database & Cloud Infrastructure](#2-backend-database--cloud-infrastructure)
3. [Identity, Authentication & Zero-Trust Activation](#3-identity-authentication--zero-trust-activation)
4. [Administrative Hierarchy & Panel Access](#4-administrative-hierarchy--panel-access)
5. [Hosting, CI/CD & Deployment Setup](#5-hosting-cicd--deployment-setup)
6. [Source Code Repositories & Backups](#6-source-code-repositories--backups)
7. [Database Architecture & Core Entity Schemas](#7-database-architecture--core-entity-schemas)
8. [Security Architecture & Protection Measures](#8-security-architecture--protection-measures)
9. [Build, Run & Deployment Playbook](#9-build-run--deployment-playbook)
10. [Technical Debt, Known Issues & Phase 2 Roadmap](#10-technical-debt-known-issues--phase-2-roadmap)

---

## 1. Frontend & Client Platform

### Core Technology Stack

| Component | Technology | Specification / Version |
| :--- | :--- | :--- |
| **Mobile Core** | React Native | `0.81.5` |
| **Framework & Tooling** | Expo SDK | `54.0.35` (Native New Architecture Enabled) |
| **Routing / Navigation** | Expo Router | `6.0.24` (File-based, typed routing) |
| **Language & Runtime** | TypeScript / React | TypeScript `5.9.2`, React `19.1.0` |
| **State Management** | Hybrid (Zustand + Context) | Zustand `5.0.14` (`useAuthStore`), Context API (`UserContext`, `GamificationContext`) |
| **Server State & Cache** | TanStack React Query | `5.101.2` (Background polling, 5m stale time, 1h cache) |
| **Local Storage** | MMKV + AsyncStorage | `react-native-mmkv` `4.3.2`, `@react-native-async-storage/async-storage` `2.2.0` |
| **High-Performance Lists**| FlashList | `@shopify/flash-list` `2.0.2` |
| **Animation Engine** | Reanimated 4 | `react-native-reanimated` `4.1.1` + `react-native-worklets` `0.5.1` |
| **Icons & Typography** | Lucide + Expo Vector Icons | `lucide-react-native` `1.14.0`, `@expo/vector-icons` `15.0.3` |

### Key Architectural Patterns
* **Token-Driven Theming:** Centralized design tokens ([constants/theme.ts](file:///c:/Users/BHANU/Downloads/feedx-main/constants/theme.ts)) supporting dynamic Dark and Light modes governed by [ThemeContext.tsx](file:///c:/Users/BHANU/Downloads/feedx-main/context/ThemeContext.tsx).
* **Hardware Integration:**
  * **QR Code Scanner:** Powered by `expo-camera` for real-time validation of campus event tickets and student identity cards.
  * **Media Capture & Optimization:** `expo-image-picker` with `expo-image-manipulator` for local compression prior to upload.
  * **Document Engine:** `expo-document-picker`, `expo-file-system`, and `expo-sharing` for downloading and viewing PDF lecture notes.
  * **Haptics & Audio/Video:** `expo-haptics` on micro-interactions and `expo-video` for educational clips.

---

## 2. Backend, Database & Cloud Infrastructure

### Primary Infrastructure: Supabase Cloud
* **Project Endpoint:** `https://ktontqbfcinzqvalxyqd.supabase.co`
* **Database Engine:** Managed PostgreSQL 15+ with extensions: `uuid-ossp`, `pgcrypto`.
* **Realtime Protocol:** WebSocket replication listening to database changes for immediate updates on student dashboards (attendance, tasks, broadcast alerts, events).

### Serverless Compute (Supabase Edge Functions - Deno Runtime)
Edge Functions handle server-side privileged tasks where database secret keys cannot be exposed to the mobile app:
1. `check-login-eligibility`: Validates identifier (Roll Number or Email), returns account status, and checks if password activation is required.
2. `verify-identity`: Matches student PIN number and Date of Birth against pre-seeded records; applies rate-limiting (5 attempts lock for 15 mins).
3. `complete-activation`: Verifies single-use activation tokens and securely writes credentials into `auth.users` via database RPC.
4. `send-notification`: Dispatches push broadcasts with fine-grained targeting (All, Branch, Year, or College).
5. `validate-internship`: Auto-validates student internship requirements and application deadlines.
6. `create-student`: Administrative batch/individual student provisioning.

---

## 3. Identity, Authentication & Zero-Trust Activation

FEEDX operates a dual-identifier login architecture with a zero-trust onboarding workflow:

```
[Student Receives College PIN & ID]
                │
                ▼
      [Enter PIN + Date of Birth]
                │
                ▼
   [Edge Function: verify-identity]
      ├── Failed (5x) ──► 15-Minute Lockout
      └── Verified
                │
                ▼
   [Issue 15-Min One-Time Token]
                │
                ▼
      [Set Strong Password] ──► (Min 8 chars, Upper, Lower, Number, Symbol)
                │
                ▼
 [Reconcile Auth ID <-> Public Profile]
                │
                ▼
      [Direct Login to App]
```

### Identifier Resolution
* **Direct Email Login:** Users can sign in using standard emails (e.g. `student@feedx.app`, `admin@college.edu`).
* **Roll Number Login:** Entering a roll number (e.g. `23001-CM-001`) automatically triggers an internal lookup against `public.students` to resolve the associated auth account.

### Session Lifecycle Management
* **Storage:** Persisted locally via `AsyncStorage` with auto-refresh tokens enabled.
* **AppState Lifecycle Protection:** Pauses token refresh when the app is placed in background/minimized to prevent clock drift and token exhaustion; immediately resumes on app foreground.
* **Deep Session Teardown:** Sign-out purges all local storage tokens, MMKV keys, and QueryClient cache entries to prevent shared-device credential leakage.

---

## 4. Administrative Hierarchy & Panel Access

FEEDX incorporates three distinct permission tiers:

### Tier 1: Super Admin Console (`super_admin`)
* **Access Route:** `/super-admin` ([app/super-admin/_layout.tsx](file:///c:/Users/BHANU/Downloads/feedx-main/app/super-admin/_layout.tsx))
* **Scope:** Master platform administration.
* **Capabilities:**
  * Multi-college institution onboarding (college codes, banners, domains).
  * Administrator account provisioning and access revocation.
  * System-wide health checks, telemetry, and platform analytics.
  * Global Kill Switch / Maintenance Mode toggle with administrative bypass.
  * Community feed moderation, reported content review, and issue ticketing oversight.

### Tier 2: Institutional / College Admin (`admin`, `inst_admin`)
* **Access Route:** `/(tabs)/admin` ([app/(tabs)/admin/_layout.tsx](file:///c:/Users/BHANU/Downloads/feedx-main/app/(tabs)/admin/_layout.tsx))
* **Scope:** Individual college campus, department, and faculty management.
* **Capabilities:**
  * **Student Registry:** Search students by roll number, inspect profiles, reset forgotten passwords, and perform bulk CSV roster imports.
  * **Broadcast Hub:** Publish targeted notifications (filter by All, Branch, or Year).
  * **Placement Hub:** Manage internship listings, hackathons, and placement drives.
  * **Material Registry:** Upload syllabus copies, lab manuals, and PDF question banks.
  * **Timetable Scheduling:** Weekly period grids and faculty allocations.
  * **Attendance Administration:** Subject-wise class counts and attendance marking.
  * **Event Management:** Create events, track registrations, and verify entry via camera QR check-in.
  * **Student Grievances:** Review and respond to campus issues and tickets.

### Tier 3: Student User (`student`)
* **Access Route:** `/(tabs)` ([app/(tabs)/_layout.tsx](file:///c:/Users/BHANU/Downloads/feedx-main/app/(tabs)/_layout.tsx))
* **Scope:** End-user mobile app experience (Home Feed, Academics, Timetable, Community, Explore, Gamified Quizzes & Daily Challenges, Digital ID Card).

---

## 5. Hosting, CI/CD & Deployment Setup

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   EAS Build     │ ────► │  Google Play    │ ────► │  Android Device │
│   (Cloud CI)    │       │  Console (AAB)  │       │   (FeedX App)   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│ Standalone APK  │       │  Static Web     │
│ (Internal Dist) │       │ (Cloudflare/VCL)│
└─────────────────┘       └─────────────────┘
```

| Domain | Provider | Environment & Build Specs |
| :--- | :--- | :--- |
| **CI / Cloud Build** | Expo Application Services (EAS) | Project ID: `6a4bbad8-112e-4e58-93fe-37a61a28b37d` |
| **Android Release** | EAS / Google Play | `com.bhanu121245.feedx`, Version `1.2.0`, VersionCode `5` |
| **iOS Release** | Apple App Store / TestFlight | `com.bhanu121245.feedx` |
| **Web Distribution** | Static Web Export | Static routing output deployable to Vercel/Netlify |
| **Database & Auth** | Supabase Cloud | Managed PostgreSQL hosted in AWS region |
| **Edge Functions** | Supabase Deno Edge | Serverless edge endpoints running across global edge locations |
| **Media Delivery** | Cloudinary CDN | High-performance image distribution network |

---

## 6. Source Code Repositories & Backups

* **Primary GitHub Repository:** [https://github.com/SadhuBhanu12/feedx2.git](https://github.com/SadhuBhanu12/feedx2.git)
* **Active Production Branch:** `Main`
* **Local Project Location:** `c:\Users\BHANU\Downloads\feedx-main`
* **Binary Artifact Backup:** Standalone pre-compiled release APK located in the project root: `feedx-release.apk` (135.9 MB).
* **Database DDL Backups:** Complete schema definitions preserved in `supabase/complete_setup_unified.sql` and modular migration scripts in `supabase/`.
* **Educational Content Backups:** Quiz and subject curriculum database in `FEEDX_Complete_Quick_Learn_Quiz_Content_Library.pdf`.

---

## 7. Database Architecture & Core Entity Schemas

### Entity Relationship Diagram (Key Modules)

```
[colleges] ──1:N── [branches] ──1:N── [academic_years] ──1:N── [sections]
    │                                                               │
    │ 1:N                                                           │ 1:N
[students] ◄────────────── 1:1 ────────────── [users (auth.users)] ─┘
    │
    ├── 1:N ── [attendance]
    ├── 1:N ── [tasks]
    ├── 1:N ── [event_registrations] ────► [events]
    ├── 1:1 ── [daily_streaks]
    ├── 1:1 ── [student_wallets]
    └── 1:N ── [student_quiz_attempts] ──► [daily_quizzes] ──1:N── [quiz_questions]
```

### Main Collections & Tables Summary

| Domain | Table Name | Key Columns | Purpose |
| :--- | :--- | :--- | :--- |
| **Tenancy** | `colleges` | `id`, `college_name`, `college_code`, `location`, `logo_url`, `type` | Multi-institution root records |
| | `branches` | `id`, `college_id`, `branch_name`, `branch_code` | Academic departments (CSE, ECE, ME) |
| | `academic_years`| `id`, `branch_id`, `year_name`, `semester` | Year levels and semester tracks |
| **Users** | `users` | `id` (FK auth.users), `email`, `full_name`, `role`, `pin_number`, `date_of_birth` | Master user profile & role mapping |
| | `students` | `id`, `roll_number`, `branch_id`, `feedx_id`, `qr_code_data` | Academic student metadata & identity |
| | `admins` | `id`, `institution_id`, `name`, `email`, `role` | Institution-level administrator records |
| **Academics** | `timetables` | `id`, `branch_id`, `year`, `day`, `subject`, `time` | Weekly period schedules |
| | `attendance` | `id`, `user_id`, `subject`, `present`, `total`, `updated_at` | Subject attendance metrics |
| | `resources` | `id`, `title`, `subject`, `branch`, `file_url`, `type` | PDF notes, question banks, syllabus |
| | `tasks` | `id`, `user_id`, `title`, `deadline`, `completed` | Homework and project assignments |
| **Careers** | `opportunities` | `id`, `title`, `company`, `type`, `stipend`, `deadline` | Internships, hackathons, jobs |
| | `opportunity_applications` | `id`, `opportunity_id`, `user_id`, `status`, `resume_url`| Student application submissions |
| **Community** | `events` | `id`, `title`, `venue`, `start_date`, `capacity`, `banner_url` | Campus and cultural event listings |
| | `event_registrations` | `id`, `event_id`, `user_id`, `qr_token`, `checked_in` | Ticket reservation & QR entry tokens |
| | `community_posts` | `id`, `user_id`, `content`, `image_url`, `category` | Student peer discussion board |
| | `innovations` | `id`, `user_id`, `title`, `description`, `github_url`, `likes` | Student project portfolio showcase |
| | `issues` | `id`, `user_id`, `title`, `description`, `status`, `response` | Grievance and support ticketing |
| **Gamification** | `daily_streaks` | `id`, `student_id`, `current_streak`, `longest_streak`, `xp_points` | Daily engagement streak tracker |
| | `student_wallets`| `id`, `student_id`, `coin_balance`, `lifetime_earned` | In-app FEEDX coin balance |
| | `daily_quizzes` | `id`, `title`, `category`, `time_limit_seconds`, `points` | Micro-assessment challenges |
| | `quiz_questions`| `id`, `quiz_id`, `question_text`, `options`, `correct_answer` | Multiple choice question library |
| | `student_quiz_attempts` | `id`, `quiz_id`, `student_id`, `score`, `coins_awarded` | Quiz results & point awards |
| **Security** | `activation_sessions` | `id`, `user_id`, `token`, `expires_at`, `used` | 15-minute onboarding verification tokens |
| | `activation_attempts` | `id`, `attempt_key`, `failed_count`, `locked_until` | Brute-force protection registry |
| | `settings` | `id`, `key`, `value` | Global flags & maintenance toggles |

---

## 8. Security Architecture & Protection Measures

1. **Row-Level Security (RLS):** Every PostgreSQL table has active RLS policies. Students can strictly only query and update their own rows; institutional admins are isolated to their specific college ID.
2. **Key Tiering (Client vs. Server Isolation):**
   * Mobile client only holds the public `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
   * The privileged `SUPABASE_SERVICE_ROLE_KEY` is strictly confined within Deno Edge Functions.
3. **Anti-Brute Force Throttling:**
   * Account activation attempts are tracked per IP and PIN. After 5 consecutive failures, the endpoint returns HTTP 429 and locks further requests for 15 minutes.
   * Client-side failed login tracking enforces an exponential delay on subsequent attempts.
4. **Cryptographic Token Lifecycle:** Activation tokens are generated via `crypto.getRandomValues(32)` (256-bit entropy) with a non-renewable 15-minute time-to-live.
5. **Password Complexity:** Enforced 8+ characters including uppercase, lowercase, numeric digits, and special characters.
6. **Remote Kill Switch & Maintenance Mode:** The app reads the `settings` table on startup. If `maintenance_mode: true`, student accounts are routed to an informative maintenance screen, while Super Admins and authorized staff can bypass the barrier.
7. **Cache Sanitization:** User sign-out triggers an automated purge of all query caches and MMKV storage, guaranteeing zero data leakage on shared campus devices.

---

## 9. Build, Run & Deployment Playbook

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/SadhuBhanu12/feedx2.git
cd feedx2
npm install
```

### Step 2: Environment Configuration
Create a `.env` file in the project root:
```env
EXPO_PUBLIC_SUPABASE_URL=https://ktontqbfcinzqvalxyqd.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=kctzl9wq
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=community_uploads
```

### Step 3: Local Development
```bash
# Start the Expo development server
npx expo start

# Shortcuts:
# Press 'a' to open Android Emulator / Connected Phone
# Press 'i' to launch iOS Simulator
# Press 'w' to launch Web Preview
```

### Step 4: Building Release Artifacts (via EAS)
```bash
# Install EAS CLI globally (if not already installed)
npm install -g eas-cli

# Login to Expo account
eas login

# Build standalone Android APK for direct testing / internal sharing
eas build -p android --profile preview

# Build production Android App Bundle (AAB) for Google Play Store
eas build -p android --profile production

# Build iOS release for TestFlight
eas build -p ios --profile production
```

### Step 5: Deploying Supabase Edge Functions
```bash
# Login to Supabase CLI
npx supabase login
npx supabase link --project-ref ktontqbfcinzqvalxyqd

# Deploy critical authentication and notification functions
npx supabase functions deploy check-login-eligibility
npx supabase functions deploy verify-identity
npx supabase functions deploy complete-activation
npx supabase functions deploy send-notification
```

---

## 10. Technical Debt, Known Issues & Phase 2 Roadmap

### A. Known Issues to Fix Before Next Release
1. **React Hook Ordering in `app/(tabs)/_layout.tsx`:**
   * Hooks (`usePathname`, `useQueryClient`, `useState`, `useEffect`) are called after early returns (lines 64–69 and 119–120 in `_layout.tsx`). These must be hoisted to the top level of the component to comply with React Hook rules.
2. **TypeScript & Linter Warnings:**
   * 280+ warnings recorded in `lint_errors_utf8.txt` related to unused imports, missing `useEffect` dependency arrays, and implicit `any` types.
3. **Legacy Screen Consolidation:**
   * Several redundant files in the legacy `screens/` folder can be cleaned up as their functionality has transitioned to `app/`.

### B. Phase 2 Feature Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHASE 2 ROADMAP MILESTONES                      │
├─────────────────────┬──────────────────────┬───────────────────────────┤
│    MILESTONE 1      │     MILESTONE 2      │        MILESTONE 3        │
│ Native Notifications│ Offline Task Queue   │ Digital ID Wallet Export  │
│  • FCM / APNs link  │  • SQLite mutations  │  • Passbook / Google Pay  │
│  • Background push  │  • Background sync   │  • High-res PDF download  │
├─────────────────────┼──────────────────────┼───────────────────────────┤
│    MILESTONE 4      │     MILESTONE 5      │        MILESTONE 6        │
│ AI Career Copilot   │ Direct Mentorship    │ Enterprise Attendance     │
│  • Streaming LLM    │  • 1:1 faculty chat  │  • Geo-fenced BLE beacon  │
│  • Dynamic roadmaps │  • Group channels    │  • Biometric sync         │
└─────────────────────┴──────────────────────┴───────────────────────────┘
```

1. **Native Push Notifications (FCM / APNs):** Connect Firebase Cloud Messaging server keys into the Supabase notification function to deliver push banners to backgrounded devices.
2. **Offline Mutation Queue:** Store pending task submissions and attendance logs in an offline queue, replaying them automatically upon network restoration.
3. **Digital Student ID Card Export:** Allow students to export their verified FEEDX ID card as a downloadable vector PDF or add it directly to Apple Wallet / Google Wallet.
4. **AI Career & Roadmap Copilot:** Connect `AIRoadmapScreen.tsx` to an LLM provider for customized semester-by-semester learning roadmaps.
5. **Direct Student-Faculty Messaging:** Enable secure chat channels for academic counseling and project guidance.
6. **Campus Geo-Fenced Attendance:** Add optional Bluetooth Low Energy (BLE) or GPS-verified classroom check-ins.

---

*FEEDX Engineering Documentation — Maintained by the Core Team.*
