import "server-only";
import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// Mock firestore for development when credentials are missing
const mockFirestore = {
  collection: (name: string) => ({
    add: async (data: any) => {
      console.log(`📧 Mock Firestore: Added to ${name}:`, data);
      return { id: "mock-doc-id" };
    }
  })
};

let adminDb: any;

if (!projectId || !clientEmail || !privateKey) {
  console.warn("⚠️ Firebase credentials missing. Using mock Firestore for development.");
  adminDb = mockFirestore;
} else {
  const adminApp: App =
    getApps().length > 0
      ? (getApps()[0] as App)
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
  
  adminDb = getFirestore(adminApp);
}

export { adminDb };