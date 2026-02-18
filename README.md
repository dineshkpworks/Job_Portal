# JobPortal

A production-ready Job Portal built with React (Vite), Tailwind CSS, and Firebase. Uses the **free Remotive Jobs API** for remote job listings with fallback to Firestore or static data when the API fails.

## Features

- **Public:** Browse remote jobs (Remotive API), search (debounced), filter by location/type/experience/category, view job details
- **Auth:** Register, login, logout (Firebase Authentication)
- **Protected:** Saved jobs, Applied jobs, Save/unsave, Apply with PDF resume upload

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - **Firebase:** 

3. **Run**
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Project structure

- `src/app/` — App root, routes, layout, protected route
- `src/components/` — common, layout, jobs
- `src/pages/` — Home, Login, Register, SavedJobs, AppliedJobs, JobDetailsPage, NotFound
- `src/services/` — remotive.service, jobService, firebaseService, authService, savedJobService, applicationService
- `src/firebase/` — firebaseConfig
- `src/context/` — AuthContext, JobContext
- `src/hooks/` — useAuth, useJobs, useDebounce
- `src/utils/` — constants, helpers, normalizeRemotiveJobs
- `src/constants/` — cloudinary (resume upload config)

## Data flow

- **Primary:** Remotive Jobs API (`https://remotive.com/api/remote-jobs`). On success, jobs are normalized and shown.
- **Fallback:** If the request fails (network or non-200), jobs are loaded from Firestore collection `"jobs"` or in-memory static data. The app does not crash when the API fails.

## Firestore collections

- **jobs:** Fallback job listings. Use "Load sample India jobs" on the home page to seed sample data when using Firestore fallback.
- **saved_jobs:** `userId`, `jobId`, `savedAt`
- **applications:** `userId`, `jobId`, `resumeUrl`

Resumes are uploaded to **Cloudinary** (free tier, unsigned upload) and the returned `secure_url` is stored in Firestore. Config: `src/constants/cloudinary.js`. PDF only, max 5MB.
