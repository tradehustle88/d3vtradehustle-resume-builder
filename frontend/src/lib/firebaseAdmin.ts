import * as admin from "firebase-admin";

// Only initialize Firebase Admin if we have valid credentials
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    
    // Only initialize if we have a proper private key
    if (serviceAccount.private_key && !serviceAccount.private_key.includes('placeholder')) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  } catch (error) {
    console.warn("Firebase Admin not initialized - invalid service account key");
  }
}

export const db = admin.apps.length > 0 ? admin.firestore() : null;