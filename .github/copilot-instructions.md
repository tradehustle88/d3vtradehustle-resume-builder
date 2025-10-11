# Trade Hustle Resume Builder – AI Field Guide

## Critical Architecture
- Frontend: Next.js 14 App Router under `frontend/src/app/**`; pages live at `app/[route]/page.tsx` (no `pages/`, no `app/api/`).
- Backend: Express app in `api-functions/index.js` exported via Firebase Functions v2; treat it as the single source for APIs.
- Data/Auth: Firestore stores resume unlock + user documents; Firebase Authentication supports email/password and Google sign-in.
- AI: Gemini 2.5 Flash Preview powers resume editing endpoints; gracefully degrades when `GOOGLE_API_KEY` missing.
- Build: Static export (`output: 'export'`) generates `frontend/out/` for Firebase Hosting.

## AI Model Integration
- **Primary Model**: Gemini 2.5 Flash Preview (`gemini-2.5-flash-preview-09-2025`) for resume editing
- **Graceful Degradation**: Backend returns 503 with helpful message when `GOOGLE_API_KEY` missing - devs don't panic in local
- **API Pattern**: `frontend/src/lib/api.ts` uses fetch wrapper with error handling; expects `{ success, message }` responses

## Code Hotspots
- Layout + GA: `frontend/src/app/layout.tsx` (measurement ID from env, Anton/Merriweather fonts, hustle theme).
- Client components: `frontend/src/components/**` start with `"use client"`; leverage Tailwind + custom classes (`btn-hustle`, `hero-title`, `brick-block`).
- API utilities: `frontend/src/lib/api.ts` calls Firebase Functions via `NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL`, expecting `{ success, message }` JSON.
- Analytics: `frontend/src/lib/analytics.ts` centralizes custom GA events (`resume_unlock`, `resume_download`, `sign_up`, etc.).
- Middleware & routes: `api-functions/index.js` layers rate limiting (30/min), honeypot `company`, auth middleware, and routes `/health`, `/signup`, `/unlockResume`, `/editResume`.

## Backend/Functions Architecture
- **Functions v2 + Express**: Use `app.use(...)` patterns, not inline `onRequest` logic
- **Required Middleware**: All new endpoints need `honeypotCheck`, `verifyUser` (auth), and rate limiting
- **Key Endpoints**:
  - `POST /api/unlockResume`: Auth required, saves to Firestore `unlocks` collection
  - `POST /api/editResume`: Auth + Gemini integration, expects `{ prompt, resumeContent? }`
  - `POST /signup`: Email capture with honeypot protection
- **Error Handling**: Return `{ success: false, error: string, errorId?: string }` format consistently

## Frontend/Next.js Patterns
- **App Router**: Routes in `app/` map directly to Firebase Hosting paths
- **Static Export**: `output: 'export'` outputs to `frontend/out/` (no server-side rendering)
- **Brand Styling**: Tailwind + custom classes (`btn-hustle`, `hero-title`, `brick-block`) for gritty visuals
- **Auth Protection**: Client-side auth checks using Firebase Auth tokens

## Daily Workflows
- Install/build: `cd frontend && npm install`, `npm run dev`; production bundle = `npm run build` then `npm run export` (static).
- Quality gates: `npm run lint`, `npm run type-check`, `./test-flow.sh` (unlock + AI flow), `./test-endpoints.sh` (HTTP smoke).
- Deploy: `firebase deploy --only functions:api`; Firebase Hosting serves `frontend/out`.
- Rollback Hosting: `firebase hosting:rollback` to revert to a previous version.

## Testing Workflow
- **Prerequisites**: Run `firebase emulators:start` before executing tests
- **Scripts**: `./test-flow.sh` (complete auth flow), `./test-endpoints.sh` (API smoke tests)
- **Manual Testing**: Visit `/unlock` page, test Google/email auth, verify PDF download
- **cURL Examples**:
  ```bash
  # Without auth (should fail)
  curl -X POST "$BASE_URL/api/unlockResume" -H "Content-Type: application/json"
  
  # With auth token
  curl -X POST "$BASE_URL/api/unlockResume" \
    -H "Authorization: Bearer $ID_TOKEN" \
    -H "Content-Type: application/json"
  ```

## Conventions & Gotchas
- Never add Next.js API routes; all server logic stays in Firebase Functions.
- Keep fetch headers explicit and include auth tokens when needed; missing honeypot or rate limits returns 400s.
- Gemini calls should return safe fallbacks when credentials are absent, mirroring existing helpers.
- Stick to Tailwind with hustle colors (`#001a33`, `#ffd700`, `#8b0000`) and textures under `frontend/public/assets/`.
- Resume payloads live in `/frontend/public/resume-kit.pdf` and `/resume/**`; downloads unlock only after `/unlockResume` succeeds.

## Environment Checklist
- Frontend: `NEXT_PUBLIC_FIREBASE_*` config vars, `NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL` (defaults to production if unset).
- Functions: Firebase Admin creds (base64 bundle or individual vars), optional `RECAPTCHA_SECRET`, required `GOOGLE_API_KEY` for Gemini endpoints.
- Local dev: `serviceAccount.b64` in `frontend/` helps decode creds; never import Firebase Admin inside Next.js client code.
- Emulators: `firebase.json` configures local ports (functions:5001, hosting:5000, ui:4000).
- **Environment Files**: Never commit `.env.local`; keep `.env.example` updated with required vars

Missing a workflow or integration detail? Add it here so future agents spin up fast.
