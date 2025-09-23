<!-- Copilot instructions for d3vtradehustle-resume-builder -->
# Repo snapshot

This repository is a small Firebase-backed resume builder with a Next.js frontend. Key parts:
- Frontend (Next.js app): `frontend/` — run via `npm run dev` inside `frontend/` (script: `next dev --turbopack`).
- Firebase admin script: `src/adminTest.js` uses `serviceAccountKey.json` and the `firebase-admin` SDK.
- Shared/top-level config: `package.json` (firebase deps) and `serviceAccountKey.json` (sensitive; ignored by git).

## What an AI coding agent should know first

- Big picture: UI is a Next.js App Router project under `frontend/` (pages in `frontend/src/app/`). The app is client-side React + Next server runtime; expect to use `next dev`/`next build`/`next start` from `frontend/`.
- Backend/integration: Firestore + Firebase Admin SDK live in top-level `src/` scripts. `src/adminTest.js` demonstrates how the service account key is loaded and how Firestore is accessed.
- Secrets and environment: `serviceAccountKey.json` contains the Firebase service account. Do not print or commit keys. During edits, treat it as a private file required for local admin scripts.

## Build / run / debug commands (explicit)

- Start frontend (development):
  - cd frontend
  - npm install (if needed)
  - npm run dev   # runs `next dev --turbopack`
- Build frontend for production:
  - cd frontend
  - npm run build  # `next build --turbopack`
  - npm run start  # `next start`
- Run admin SDK smoke test (requires `serviceAccountKey.json` present):
  - node src/adminTest.js

## Project-specific patterns & conventions

- Code locations: UI components live under `frontend/src/app/` (App Router). Smaller utilities and scripts are at top-level `src/`.
- Firebase usage: The repo mixes client SDK (`frontend` likely uses `firebase`) and server admin SDK (`firebase-admin` used by `src/adminTest.js`). Keep imports separate: server-only code uses `firebase-admin` and the service account; frontend uses the client `firebase` config.
- Styling: Tailwind / PostCSS are configured in `frontend/` (see `frontend/package.json` and `postcss.config.mjs`).
- Do not modify `serviceAccountKey.json` in repo; local changes are allowed for testing but must remain out of commits.

## Integration & external dependencies

- Firebase: Firestore and FCM. Look for FCM/VAPID or push code in `frontend` or Cloud Functions (not present here). If adding cloud functions, follow existing pattern in `src/adminTest.js` to initialize admin credentials.
- Next.js: app uses latest App Router conventions (React 19 + Next 15+). Use `frontend/src/app/page.tsx` and `frontend/src/app/resume/page.tsx` as examples for routing and component structure.

## Examples & quick navigation

- To check server-side Firestore usage: open `src/adminTest.js`.
- To see how a form component is implemented: open `src/components/SignupForm.tsx`.
- To view resume route: `frontend/src/app/resume/page.tsx`.

## Helpful constraints for code changes

- Avoid revealing secrets. Never output contents of `serviceAccountKey.json` in PRs or comments.
- Keep interfaces stable between frontend and any server code; the current repo contains no API server — adding one should reuse Firestore collections used by `src/adminTest.js` (e.g., `adminTest`).
- Follow existing Next.js conventions: use App Router files under `frontend/src/app/` and prefer React server components only where appropriate.

If anything here is unclear or you'd like more detail (CI, deployment, Cloud Functions, or where FCM is wired), tell me which area to expand and I will iterate.
