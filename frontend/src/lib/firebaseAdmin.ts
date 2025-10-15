// Firebase Admin SDK with dynamic imports and lazy initialization
// This prevents build-time errors and handles missing environment variables gracefully

let _adminApp: any = null;
let _adminDb: any = null;
let _adminAuth: any = null;
let _adminStorage: any = null;

export function getFirebaseAdminServices() {
  // Dynamic import to prevent build-time issues
  const admin = require("firebase-admin");
  
  // Lazy initialization
  if (!_adminApp && !admin.apps.length) {
    try {
      // Option 1: Full service account JSON string (recommended for development)
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        let serviceAccount;
        try {
          // Try base64 decoding first
          serviceAccount = JSON.parse(
            Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf8")
          );
        } catch {
          // If base64 fails, try parsing as direct JSON string
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        }
        
        _adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
      }
      // Option 2: Individual environment variables (recommended for production)
      else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        _adminApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          }),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
      }
      else {
        console.warn("🔥 Firebase Admin SDK not initialized: Missing environment variables");
        return null;
      }

      _adminDb = admin.firestore();
      _adminAuth = admin.auth();
      _adminStorage = admin.storage().bucket();
      
      console.log("✅ Firebase Admin SDK initialized successfully");
    } catch (error) {
      console.error("❌ Firebase Admin initialization failed:", error);
      return null;
    }
  } else if (admin.apps.length > 0) {
    // Use existing app if already initialized
    _adminApp = admin.apps[0];
    _adminDb = admin.firestore();
    _adminAuth = admin.auth();
    _adminStorage = admin.storage().bucket();
  }

  return {
    admin,
    app: _adminApp,
    db: _adminDb,
    auth: _adminAuth,
    storage: _adminStorage,
  };
}

// Safe getters that return null if not initialized
export function getAdminDb() {
  const services = getFirebaseAdminServices();
  return services?.db || null;
}

export function getAdminAuth() {
  const services = getFirebaseAdminServices();
  return services?.auth || null;
}

export function getAdminStorage() {
  const services = getFirebaseAdminServices();
  return services?.storage || null;
}

// Legacy exports for backward compatibility - these will be null if not initialized
export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
