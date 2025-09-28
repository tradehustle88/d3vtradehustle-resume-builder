# Firebase Admin SDK Recurring Error - FIXED

## Problem Summary
The recurring problem was: **"Failed to parse private key: Error: Invalid PEM formatted message"**

This error was happening every time the development server started because:

1. **Static Import Issue**: `firebaseAdmin.ts` was using static imports (`import * as admin from "firebase-admin"`)
2. **Module-Level Initialization**: Firebase Admin SDK was initializing at module load time
3. **Missing Environment Variables**: No environment variables were configured
4. **Build-Time Execution**: Next.js tries to load modules during build/development startup

## Root Cause
```typescript
// OLD - PROBLEMATIC CODE
import * as admin from "firebase-admin";

// This runs immediately when the module is imported!
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,        // undefined
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,    // undefined
      privateKey: process.env.FIREBASE_PRIVATE_KEY,      // undefined
    }),
  });
}
```

When `privateKey` is undefined, the Firebase Admin SDK tries to parse it as a PEM key and fails.

## Solution Applied
```typescript
// NEW - FIXED CODE
export function getFirebaseAdminServices() {
  // Dynamic import - only loads when actually called
  const admin = require("firebase-admin");
  
  // Lazy initialization with proper error handling
  if (!_adminApp && !admin.apps.length) {
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        // Handle both base64 and JSON string formats
        let serviceAccount;
        try {
          serviceAccount = JSON.parse(
            Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf8")
          );
        } catch {
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        }
        
        _adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
      } else if (/* individual env vars exist */) {
        // Handle individual environment variables
      } else {
        console.warn("🔥 Firebase Admin SDK not initialized: Missing environment variables");
        return null;
      }
    } catch (error) {
      console.error("❌ Firebase Admin initialization failed:", error);
      return null;
    }
  }
  
  return { admin, db: _adminDb, auth: _adminAuth, storage: _adminStorage };
}
```

## Key Improvements

1. **Dynamic Imports**: Uses `require()` instead of `import` to prevent build-time loading
2. **Lazy Initialization**: Only initializes when actually needed
3. **Graceful Degradation**: Returns `null` when environment variables are missing
4. **Flexible Configuration**: Supports both JSON string and individual environment variables
5. **Error Handling**: Proper try-catch blocks with meaningful error messages

## Additional Fix
Fixed Next.js image optimization configuration:
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // Required for static export
  },
};
```

## Testing Results
✅ **Development Server**: Starts without errors  
✅ **Build Process**: Completes successfully  
✅ **All Pages**: Load with 200 status codes  
✅ **No More Firebase Errors**: Complete elimination of the recurring error  

## Usage
The API is backward compatible. Existing code can continue using:
```typescript
import { adminDb, adminAuth } from '@/lib/firebaseAdmin';
```

Or use the new safe getters:
```typescript
import { getAdminDb, getAdminAuth } from '@/lib/firebaseAdmin';
```

The Firebase Admin SDK will only initialize if environment variables are properly configured, preventing the recurring error.