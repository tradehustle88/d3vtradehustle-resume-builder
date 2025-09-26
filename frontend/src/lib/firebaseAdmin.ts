import "server-only";
import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Mock firestore for development when credentials are missing
const mockFirestore = {
  collection: (name: string) => ({
    add: async (data: any) => {
      console.log(`📧 Mock Firestore: Added to ${name}:`, data);
      return { id: "mock-doc-id" };
    },
    doc: (id: string) => ({
      get: async () => ({ exists: false }),
      set: async (data: any) => {
        console.log(`📧 Mock Firestore: Set document ${id}:`, data);
      }
    })
  })
};

let adminDb: any;

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY missing. Using mock Firestore for development.");
  adminDb = mockFirestore;
} else {
  try {
    // Handle base64-encoded service account (production) or plain JSON (development)
    let serviceAccount;
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    try {
      // Try to parse as base64 first (production format)
      serviceAccount = JSON.parse(
        Buffer.from(serviceAccountKey, "base64").toString("utf8")
      );
    } catch {
      // Fallback to direct JSON parsing (development format)
      serviceAccount = JSON.parse(serviceAccountKey);
    }

    const adminApp: App =
      getApps().length > 0
        ? (getApps()[0] as App)
        : initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          });
    
    adminDb = getFirestore(adminApp);
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error);
    console.warn("⚠️ Falling back to mock Firestore for development.");
    adminDb = mockFirestore;
  }
}

export { adminDb };