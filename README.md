# Habit Tracker PWA

A mobile-first, local-first Progressive Web App built with Next.js 16 to help users build and track daily habits with deterministic persistence and streak tracking.

## Project Overview

This application is a Stage 3 implementation of a Habit Tracker PWA. It focuses on technical discipline, testability, and a premium user experience while maintaining all data locally within the browser.

### Key Features
- **Deterministic Auth:** Signup and Login simulation using localized user data.
- **Habit Management:** Robust CRUD operations for daily habits.
- **Streak Tracking:** Algorithmic calculation of consecutive daily completions.
- **Profile Switching:** Seamlessly jump between multiple local accounts.
- **PWA Ready:** Installable with offline shell support via Serwist.

---

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/CodeKageFX/HabitTracker-hngWeb3.git
   cd habit-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers (for E2E tests):
   ```bash
   npx playwright install
   ```

---

## 🏃 Running the App

### Development Mode
Runs the app with Turbopack for the fastest development experience.
```bash
npm run dev
```

### Production Build
Builds the app for production and runs a local server.
```bash
npm run build
npm run start
```

---

## 🧪 Test Instructions

This project includes a comprehensive test suite covering unit, integration, and E2E layers.

| Script | Purpose |
| :--- | :--- |
| `npm run test:unit` | Runs Vitest for core utility logic with 80%+ coverage. |
| `npm run test:integration` | Runs Vitest for component and hook integration flows. |
| `npm run test:e2e` | Runs Playwright for full end-to-end user journeys. |
| `npm run test` | Runs the full suite in sequence. |

## Run Instructions

1.  **Clone the Repo**: `git clone ...`
2.  **Install**: `npm install`
3.  **Dev**: `npm run dev`
4.  **Test**: `npm run test`

## Test File Mapping

- `tests/unit/slug.test.ts` -> `src/lib/slug.ts`
- `tests/unit/validators.test.ts` -> `src/lib/validators.ts`
- `tests/unit/streaks.test.ts` -> `src/lib/streaks.ts`
- `tests/unit/habits.test.ts` -> `src/lib/habits.ts`
- `tests/integration/auth-flow.test.tsx` -> `src/components/auth/*`
- `tests/integration/habit-form.test.tsx` -> `src/components/habits/*`
- `tests/e2e/app.spec.ts` -> `src/app/*`

---

## 📂 Test Mapping

| File | Verify Behavior |
| :--- | :--- |
| `tests/unit/slug.test.ts` | **getHabitSlug**: Ensures consistent, URL-safe habit slugs. |
| `tests/unit/validators.test.ts` | **validateHabitName**: Enforces input constraints and error messaging. |
| `tests/unit/streaks.test.ts` | **calculateCurrentStreak**: Validates consecutive day logic and edge cases. |
| `tests/unit/habits.test.ts` | **toggleHabitCompletion**: Ensures immutable updates and duplicate prevention. |
| `tests/integration/auth-flow.test.tsx` | **Auth Logic**: Verifies signup persistence and login validation. |
| `tests/integration/habit-form.test.tsx` | **Habit Ops**: Verifies form validation, CRUD state, and streak UI updates. |
| `tests/e2e/app.spec.ts` | **User Journey**: Validates splash screen, guest redirects, and full CRUD cycles. |

---

## 💾 Local Persistence Structure

The application uses `localStorage` for deterministic persistence across three main keys:

1.  **`habit-tracker-users`**: Stores a JSON array of registered user objects including email and hashed-equivalent passwords.
2.  **`habit-tracker-session`**: Stores the active `userId` and `email` to maintain login state.
3.  **`habit-tracker-habits`**: Stores a global list of habits, filtered at the component level by `userId` to ensure data isolation between profiles.

---

## 📱 PWA Support

PWA functionality is implemented using **Serwist** (`@serwist/next`), which provides:
- **Service Worker:** Located at `public/sw.js`, it handles caching the App Shell.
- **Manifest:** Defined in `src/app/manifest.ts`, configuring standalone display mode and icons.
- **Offline Support:** The app shell remains accessible offline once loaded, preventing crash screens during connectivity loss.

---

## ⚖️ Trade-offs and Limitations

1.  **Local vs. Cloud:** This is a local-first application. No data is synced to a server. If you clear your browser data or use a different device, your habits will not carry over.
2.  **Security:** Authentication is simulated for architectural demonstration. Passwords are stored in plain-text JSON within LocalStorage, which is suitable for this technical stage but not for production environments.
3.  **Turbopack Conflict:** Next.js 16 uses Turbopack by default. Because PWA plugins often inject Webpack-specific configs, we acknowledge an empty `turbopack: {}` block in `next.config.ts` to allow both to coexist.
