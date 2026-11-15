# FEEDX 🎓 — Academic Operating System & Student Engagement Ecosystem

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-black?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86.3-61dafb?style=flat&logo=react)](https://reactnative.dev)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ecf8e?style=flat&logo=supabase)](https://supabase.com)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448c5?style=flat&logo=cloudinary)](https://cloudinary.com)
[![Version](https://img.shields.io/badge/Version-v1.2.8-orange?style=flat)](#)

**FEEDX** is an enterprise-grade academic operating system and gamified student engagement platform engineered for polytechnic institutions and colleges. Built with **React Native (Expo SDK 57)** and backed by **Supabase (PostgreSQL 15+, Auth, Realtime, Storage)** and **Cloudinary**, FEEDX integrates daily campus workflows (attendance verification, timetables, syllabus notes, campus event ticketing) with gamified learning (daily coding challenges, micro-quizzes, coin wallets, streaks) and career enablement (internships, hackathons, placement drives).

---

## Table of Contents

1. [System Prerequisites](#1-system-prerequisites)
2. [Project Dependencies](#2-project-dependencies)
3. [Step-by-Step Installation](#3-step-by-step-installation)
4. [Environment Configuration (.env)](#4-environment-configuration-env)
5. [Procedures to Run the Application](#5-procedures-to-run-the-application)
   - [Method A: Quick Start via Expo Development Server](#method-a-quick-start-via-expo-development-server-recommended)
   - [Method B: Run on Android Emulator or Physical Device](#method-b-run-on-android-emulator-or-physical-device)
   - [Method C: Run on Web Browser](#method-c-run-on-web-browser)
   - [Method D: Build Standalone APK Locally (Offline Gradle Build)](#method-d-build-standalone-apk-locally-offline-gradle-build)
   - [Method E: Cloud Build via EAS (Expo Application Services)](#method-e-cloud-build-via-eas)
6. [Backend, Database & Cloud Services](#6-backend-database--cloud-services)
7. [Project Directory Structure](#7-project-directory-structure)
8. [Available NPM Scripts](#8-available-npm-scripts)
9. [Troubleshooting & Common Fixes](#9-troubleshooting--common-fixes)

---

## 1. System Prerequisites

Before running the application, make sure your development environment has the following tools installed:

### Required for All Platforms:
- **Node.js**: Version `v18.x`, `v20.x`, or `v22.x` (LTS recommended)
  - Verify: `node -v`
- **NPM** or **Yarn**: NPM `v9+` or Yarn `v1.22+`
  - Verify: `npm -v`
- **Git**: For version control
  - Verify: `git --version`

### Required for Native Android Development / Local Builds (Optional for Web):
- **Java Development Kit (JDK)**: **JDK 17** (Required by Gradle 8.14)
  - Verify: `javac -version`
  - Ensure `JAVA_HOME` environment variable is set to your JDK path.
- **Android Studio & Android SDK**:
  - Android SDK Platform `API 34` or `API 35`
  - Android SDK Build-Tools `35.0.0` or `34.0.0`
  - Android SDK Platform-Tools (`adb`)
  - Ensure `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) is configured in your system environment variables.
- **Expo CLI** & **EAS CLI**:
  ```bash
  npm install -g expo-cli eas-cli
  ```

---

## 2. Project Dependencies

The application relies on the following key dependency packages (pre-configured in `package.json`):

### Core Frameworks:
- **`expo`** (`~57.0.26`): Core application framework.
- **`react`** (`19.2.3`) & **`react-native`** (`0.86.3`): React core and Native runtime (with React Native New Architecture enabled).
- **`expo-router`** (`~57.0.24`): Next.js-style file-based typed routing.

### State Management & Data Fetching:
- **`@supabase/supabase-js`** (`^2.105.3`): Supabase client for database, authentication, and realtime subscriptions.
- **`@tanstack/react-query`** (`^5.101.2`): Server-state synchronization, background fetching, and cache management.
- **`zustand`** (`^5.0.14`): Lightweight global state stores.
- **`@react-native-async-storage/async-storage`** (`2.2.0`) & **`react-native-mmkv`** (`^4.3.2`): Ultra-fast persistent key-value storage.

### Hardware & Native Modules:
- **`expo-camera`** (`~57.0.6`): QR code attendance scanning and identity verification.
- **`expo-image-picker`** & **`expo-image-manipulator`**: Image capture, compression, and profile avatar uploads.
- **`expo-document-picker`**, **`expo-file-system`**, **`expo-sharing`**: Academic PDF notes download and sharing.
- **`expo-video`** (`~57.0.5`): Video learning playback.
- **`expo-haptics`** (`~57.0.3`): Haptic feedback on user interactions.

### UI & Animations:
- **`react-native-reanimated`** (`4.5.1`) & **`react-native-worklets`** (`0.10.1`): Fluid 60/120 FPS native UI animations.
- **`react-native-gesture-handler`** (`~2.32.0`): Touch gesture system.
- **`@shopify/flash-list`** (`2.0.2`): High-performance recycled lists.
- **`lucide-react-native`** & **`@expo/vector-icons`**: Scalable iconography.
- **`react-native-qrcode-svg`** (`^6.3.21`): Student identity and event QR code generation.
- **`expo-linear-gradient`** & **`expo-blur`**: Glassmorphism and gradient cards.

---

## 3. Step-by-Step Installation

### Step 3.1: Clone the Repository
```bash
git clone https://github.com/SadhuBhanu12/feedx2.git
cd feedx2
```
*(Or navigate into your extracted `feedx-main` project folder).*

### Step 3.2: Install Node Dependencies
Run the following command in the project root:

```bash
npm install
```

> [!TIP]
> If npm reports peer dependency warnings due to React 19 packages, install using:
> ```bash
> npm install --legacy-peer-deps
> ```

---

## 4. Environment Configuration (.env)

The application uses environment variables for Supabase and Cloudinary.

### Step 4.1: Create `.env` file
Copy the included template:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

### Step 4.2: Verify `.env` Contents
Ensure your `.env` contains the following active endpoints:

```env
# Supabase Backend Configuration
EXPO_PUBLIC_SUPABASE_URL=https://ktontqbfcinzqvalxyqd.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8

# Cloudinary Media Storage (Avatars, Community Posts & Documents)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=kctzl9wq
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=community_uploads

# Navigation Tweaks
EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1
```

> [!NOTE]
> The app is pre-configured with fallback credentials in [app.json](file:///c:/Users/BHANU/Downloads/feedx-main/app.json) and [lib/supabase.ts](file:///c:/Users/BHANU/Downloads/feedx-main/lib/supabase.ts) to guarantee zero-crash startups even if environment variables are not loaded by the native layer.

---

## 5. Procedures to Run the Application

You can run FEEDX using any of the methods below:

### Method A: Quick Start via Expo Development Server (Recommended)

1. **Start the Metro Bundler**:
   ```bash
   npx expo start
   ```
   *(or `npm start`)*

2. **Interactive Terminal Controls**:
   Once Metro starts, press any of the following keys in your terminal:
   - Press **`a`**: Opens the app on a connected Android phone or Android Studio emulator.
   - Press **`w`**: Opens the app directly in your default web browser.
   - Press **`r`**: Reloads the JavaScript bundle.
   - Press **`c`**: Clears the Metro bundler cache.
   - Press **`?`**: Displays all available commands.

3. **Running on a Physical Phone via Expo Go / Dev Client**:
   - Download the **Expo Go** app from Google Play Store or Apple App Store.
   - Connect your phone and computer to the **same Wi-Fi network**.
   - Scan the QR code displayed in the terminal using the Expo Go app (Android) or Camera app (iOS).

---

### Method B: Run on Android Emulator or Physical Device

To run the native Android build directly:

1. Connect your Android device via USB with **USB Debugging enabled** (or start an Android Emulator in Android Studio).
2. Check that adb recognizes your device:
   ```bash
   adb devices
   ```
3. Run:
   ```bash
   npm run android
   ```
   *(or `npx expo run:android`)*

Expo will compile the native Android code in the `/android` folder and launch the app on your device.

---

### Method C: Run on Web Browser

For desktop/browser preview:

```bash
npm run web
```
*(or `npx expo start --web`)*

The application will bundle for web and open automatically at `http://localhost:8081`.

---

### Method D: Build Standalone APK Locally (Offline Gradle Build)

If you have Android Studio and Java JDK 17 installed, you can build a standalone release APK directly without cloud tools:

#### On Windows (PowerShell / Command Prompt):
```powershell
cd android
.\gradlew.bat assembleRelease
```

#### On macOS / Linux:
```bash
cd android
./gradlew assembleRelease
```

#### Output APK Location:
Once compilation finishes, your APK will be ready at:
```
android/app/build/outputs/apk/release/app-release.apk
```
Transfer this file to any Android phone and install it directly!

---

### Method E: Cloud Build via EAS

If you don't have Android Studio installed locally, you can use Expo's cloud build servers:

1. **Install and Login to EAS**:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Build Installable Android APK**:
   ```bash
   eas build -p android --profile preview
   ```
   EAS will build the APK in the cloud and provide a download link and QR code to install it directly on your phone.

3. **Build Google Play Store Bundle (.aab)**:
   ```bash
   eas build -p android --profile production
   ```

---

## 6. Backend, Database & Cloud Services

### 1. Supabase (PostgreSQL Database & Auth)
- **Database Tables**: Students, Colleges, Branches, Academic Years, Daily Quizzes, Daily Challenges, Wallets, Streaks, Community Posts, Event Registrations, Roadmap Progress.
- **SQL Scripts**: Pre-built migrations and seeds are located in the [supabase/](file:///c:/Users/BHANU/Downloads/feedx-main/supabase) directory.
  - To initialize or register users, run SQL scripts directly in the [Supabase SQL Editor](https://supabase.com/dashboard).
  - Example student activation template: [create_student_harshasingisala.sql](file:///c:/Users/BHANU/Downloads/feedx-main/supabase/create_student_harshasingisala.sql).

### 2. Google Apps Script (Automated OTP Verification)
- Endpoint: `https://script.google.com/macros/s/AKfycbwJuFYMrwtw8EnkMNfLq3O1kbqeRj-2MHffa2dTA26A-5hzF_KIS4CDxFp-pZzc1DAZpQ/exec`
- Configured in [lib/supabase.ts](file:///c:/Users/BHANU/Downloads/feedx-main/lib/supabase.ts). Dispatches 6-digit verification codes to student email addresses for password resets and first-time account activation.

### 3. Cloudinary (Media CDN)
- Used for uploading and serving student profile pictures, campus community posts, and resource documents.

---

## 7. Project Directory Structure

```plaintext
feedx/
├── android/               # Native Android Gradle project & native configurations
├── app/                   # Expo Router file-based pages, tabs & navigation routes
│   ├── (tabs)/            # Main bottom-tab screens (Home, Explore, Community, Profile)
│   ├── _layout.tsx        # Root navigation stack and theme provider
│   ├── create-password.tsx# Password creation screen for OTP activation
│   ├── forgot-password.tsx# Account password recovery screen
│   └── ...
├── assets/                # App icons, splash screens, banners & local images
├── components/            # Reusable UI components (headers, cards, modals, sheets)
├── constants/             # Design tokens, theme colors, reward configurations
├── context/               # React Contexts (Auth, Theme, Gamification)
├── hooks/                 # Custom React hooks (network status, storage, back handler)
├── lib/                   # API clients, Supabase instance, QueryClient persistence
├── screens/               # Core full-screen view components
├── scripts/               # Icon generators, database seed scripts & validation tests
├── services/              # Supabase queries, Cloudinary API & Google OTP service
├── store/                 # Zustand stores (useAuthStore)
├── supabase/              # SQL migrations, table definitions & Deno Edge Functions
├── utils/                 # Date helpers, media resolvers, validation routines
├── .env.example           # Environment variables template
├── app.json               # Expo configuration & app manifest
├── eas.json               # EAS cloud build profiles
├── package.json           # NPM scripts & dependencies
└── README.md              # Project documentation
```

---

## 8. Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm start` | Starts the Expo development server / Metro bundler |
| `npm run android` | Builds and runs the app on a connected Android device or emulator |
| `npm run ios` | Builds and runs the app on an iOS simulator (macOS required) |
| `npm run web` | Starts the app in a web browser |
| `npm run lint` | Runs ESLint code style and syntax checks |
| `npm run export` | Exports static web/production bundles |
| `npx expo start -c` | Starts Metro with cache completely cleared |

---

## 9. Troubleshooting & Common Fixes

### 1. Metro Bundler Cache Issues / Stale Code
If code changes don't reflect or Metro crashes on start:
```bash
npx expo start -c
```

### 2. Missing Node Modules or Clean Reinstall
If dependency errors occur:
```bash
# On Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install --legacy-peer-deps

# On macOS / Linux:
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 3. Port 8081 is Already in Use
If another process is using port 8081:
```bash
npx expo start --port 8082
```

### 4. Android Build Fails with `JAVA_HOME` Error
- Ensure **Java JDK 17** is installed.
- Set `JAVA_HOME` to your JDK path (e.g. `C:\Program Files\Java\jdk-17` on Windows).
- Add `%JAVA_HOME%\bin` (Windows) or `$JAVA_HOME/bin` (macOS/Linux) to your system `PATH`.

### 5. `adb: device not found`
- Enable **USB Debugging** in your phone's Developer Options.
- Connect your phone via USB and tap **"Always allow from this computer"** when prompted.
- Verify using `adb devices`.

---

## 🤝 Support & Contribution

For technical inquiries, bug reports, or database access requests, contact the administration team at **feedxhub@gmail.com**.
