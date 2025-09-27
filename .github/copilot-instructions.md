# Trade Hustle Resume Builder - AI Coding Instructions

## Project Overview
A Next.js 14 (App Router) resume builder targeting trade professionals, integrating Firebase (Auth/Firestore/Storage), Google reCAPTCHA v3, and Google Cloud Vertex AI. Built with TypeScript, Tailwind CSS, and a trade-focused "hustle" brand identity. The project follows a monorepo structure with the main application in `/frontend/`.

## Architecture & Key Components

### Directory Structure Pattern

### Core Service Integrations

**Firebase Dual Setup**: Critical pattern with separate client/admin configurations
- Client (`src/firebase.ts`): Authentication and real-time features
- Admin (`src/lib/firebaseAdmin.ts`): Server-side operations in API routes  
- Environment handling: `FIREBASE_SERVICE_ACCOUNT_KEY` supports both base64-encoded JSON string and individual variables
- Firestore collection: `unlocks` for email capture with strict security rules

**reCAPTCHA v3 Flow**: Seamless verification pattern
- Global script loaded in `layout.tsx` with `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- Window interface defined in `src/global.d.ts`
- Verification flow: `/unlock` page → `/api/unlock-resume` → reCAPTCHA verify → Firestore save → PDF download

**Google Cloud Vertex AI**: Production-ready AI integration
- Configured in `/api/vertex-test/route.ts`
- Conditional imports prevent development build errors: `require()` vs `import`
- Environment variables: `GCP_PROJECT_ID`, `GCP_LOCATION`

## Build / Run / Debug Commands

### Essential Commands
```bash
cd frontend                 # Always work from frontend directory
npm install                 # Install dependencies
npm run dev                 # Development server (localhost:3000)
npm run build               # Production build with Next.js
npm run start               # Production server
./test-flow.sh              # Comprehensive flow testing script
# Test Firebase Admin SDK (requires service account setup)
node src/adminTest.js
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'  # JSON string
FIREBASE_SERVICE_ACCOUNT_KEY=base64_encoded_json  # Base64-encoded
export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

// Standard error response pattern
return NextResponse.json(
  { success: false, error: err.message },
  { status: 500 }
);

// Lazy Firebase admin initialization with fallback
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf8")
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
.hero-title      # Animated gradient text outline effect
.btn-hustle      # Signature red button with hover effects  
.brick-block     # Semi-transparent overlay with gold border
.hero-logo       # Logo with gold glow hover effect
// Only authenticated reads, admin-only writes
match /unlocks/{docId} {
  allow read: if request.auth != null;
  allow write: if false; // Admin SDK only
}
