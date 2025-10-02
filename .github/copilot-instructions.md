# Trade Hustle Resume Builder – AI Field Guide

## Critical Architecture
- Frontend: Next.js 14 App Router under `frontend/src/app/**`; pages live at `app/[route]/page.tsx` (no `pages/`, no `app/api/`).
- Backend: Express app in `api-functions/index.js` exported via Firebase Functions v2; treat it as the single source for APIs.
- Data/Auth: Firestore stores resume unlock + user documents; Firebase Authentication supports email/password and Google sign-in.
- AI: Gemini-powered resume editing and scoring endpoints run in Firebase Functions; guard them when `GOOGLE_API_KEY` is missing.

## Code Hotspots
- Layout + GA: `frontend/src/app/layout.tsx` (measurement ID `G-WV2HHYYKCL`, hustle fonts/theme).
- Client components: `frontend/src/components/**` start with `"use client"`; leverage Tailwind + custom classes (`btn-hustle`, `hero-title`, `brick-block`).
- API utilities: `frontend/src/lib/api.ts` calls Firebase Functions via `NEXT_PUBLIC_API_BASE_URL`, expecting `{ success, message }` JSON.
- Analytics: `frontend/src/lib/analytics.ts` centralizes custom GA events (`resume_unlock`, `resume_download`, `sign_up`, etc.).
- Middleware & routes: `api-functions/index.js` layers rate limiting (30/min), honeypot `company`, optional reCAPTCHA, and routes `/health`, `/signup`, `/unlockResume`, `/editResume`, `/verifyRecaptcha`.

## Daily Workflows
- Install/build: `cd frontend && npm install`, `npm run dev`; production bundle = `npm run build` then `npm run export` (static).
- Quality gates: `npm run lint`, `npm run type-check`, `./test-flow.sh` (unlock + AI flow), `./test-endpoints.sh` (HTTP smoke).
- Deploy: `firebase deploy --only functions:api`; Firebase Hosting serves `frontend/out`.
- Rollback Hosting: `firebase hosting:rollback` to revert to a previous version.

## Conventions & Gotchas
- Never add Next.js API routes; all server logic stays in Firebase Functions.
- Keep fetch headers explicit and include auth tokens when needed; missing honeypot or rate limits returns 400s.
- Gemini calls should return safe fallbacks when credentials are absent, mirroring existing helpers.
- Stick to Tailwind with hustle colors (`#001a33`, `#ffd700`, `#8b0000`) and textures under `frontend/public/assets/`.
- Resume payloads live in `/frontend/public/resume-kit.pdf` and `/resume/**`; downloads unlock only after `/unlockResume` succeeds.

## Environment Checklist
- Frontend: `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_API_BASE_URL`.
- Functions: Firebase Admin creds (base64 bundle or individual vars), optional `RECAPTCHA_SECRET`, required `GOOGLE_API_KEY` for Gemini endpoints.
- `serviceAccount.b64` in `frontend/` helps decode local creds; never import Firebase Admin inside the Next.js app.

Missing a workflow or integration detail? Add it here so future agents spin up fast.
