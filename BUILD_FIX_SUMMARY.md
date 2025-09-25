# Build Error Fix Summary: unlock-resume API Route

## Issue Description
The build was failing with the error:
```
Build error occurred
Error: Failed to collect page data for /api/unlock-resume
```

This was caused by Firebase Admin SDK being imported and initialized at module-level during the build process, when Next.js tries to collect page data for static generation.

## Root Causes Identified

### 1. Static Import of Firebase Admin
The API route was using:
```typescript
import admin from "firebase-admin";
```
This caused Firebase Admin to be loaded at module-level during build time.

### 2. Client-side Firebase Initialization During SSG
The Firebase client SDK was being initialized during static site generation, causing errors when environment variables weren't available.

## Solutions Implemented

### 1. Dynamic Firebase Admin Imports
**File: `frontend/src/app/api/unlock-resume/route.ts`**

**Before:**
```typescript
import admin from "firebase-admin";

function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    // ... initialization code
  }
  return admin.firestore();
}
```

**After:**
```typescript
// No static import of firebase-admin

function getFirebase() {
  const admin = require("firebase-admin"); // Dynamic import at runtime
  
  if (!admin.apps.length) {
    // ... initialization code
  }
  
  return {
    db: admin.firestore(),
    bucket: admin.storage().bucket(),
    auth: admin.auth(),
  };
}
```

### 2. Lazy Firebase Client Initialization
**File: `frontend/src/firebase.ts`**

**Before:**
```typescript
// Firebase initialized at module level
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**After:**
```typescript
// Safe initialization only in browser environment
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

function initializeFirebase() {
  if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
      db = getFirestore(app);
      return { app, auth, db };
    } catch (error) {
      console.warn("Firebase initialization failed:", error);
      return null;
    }
  }
  return null;
}
```

### 3. Updated API Route Implementation
The API route now follows all the original specifications:

- ✅ **Lazy Firebase Admin Initialization**: Uses `getFirebase()` function with dynamic imports
- ✅ **reCAPTCHA Validation**: Proper form-encoded POST validation with score threshold
- ✅ **Firebase Auth Validation**: Verifies ID tokens and ensures email matches
- ✅ **One-Resume Rule**: Uses `.doc(uid).set()` and checks for existing unlocks
- ✅ **Signed Download URL**: Generates 1-hour signed URLs from Firebase Storage
- ✅ **Error Handling**: Comprehensive error handling with server-side logging
- ✅ **Environment Variables**: Updated configuration for all required variables

### 4. Environment Variables Added
**File: `.env.example`**

Added missing variables:
- `FIREBASE_STORAGE_BUCKET=your-project.appspot.com`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key`

## Key Changes Made

### API Route (`frontend/src/app/api/unlock-resume/route.ts`)
1. Removed static Firebase Admin import
2. Implemented `getFirebase()` with dynamic `require()`
3. Added Firebase Storage signed URL generation
4. Enhanced error handling with unique error IDs
5. Updated to return `downloadUrl` in response

### Firebase Client (`frontend/src/firebase.ts`)
1. Added browser environment checks
2. Implemented lazy initialization pattern
3. Added proper TypeScript types
4. Safe error handling for missing configuration

### Auth Component (`frontend/src/components/AuthComponent.tsx`)
1. Updated to use safe auth getter function
2. Added null checks for Firebase availability
3. Proper error handling for initialization failures

## Build Verification

The build now completes successfully:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (11/11)
```

## Next Steps for Deployment

1. **Upload PDF to Firebase Storage**: Upload `resume-kit.pdf` to Firebase Storage bucket
2. **Configure Environment Variables**: Set all required environment variables in Vercel:
   - `FIREBASE_SERVICE_ACCOUNT_KEY` (base64-encoded)
   - `FIREBASE_STORAGE_BUCKET`
   - `RECAPTCHA_SECRET_KEY`
   - All `NEXT_PUBLIC_*` variables for client-side Firebase
3. **Enable Google Fonts**: Uncomment Google Fonts imports in `layout.tsx` once deployed
4. **Test Full Flow**: Verify authentication, reCAPTCHA, and PDF download functionality

## Architecture Benefits

- **Build-time Safe**: No Firebase code executes during static generation
- **Runtime Efficient**: Firebase services only initialize when actually needed
- **Error Resilient**: Graceful handling of missing configuration
- **Vercel Compatible**: Follows Next.js App Router best practices
- **Security Compliant**: No sensitive data exposure during build process

The API route now successfully implements all requirements while being completely build-time safe.