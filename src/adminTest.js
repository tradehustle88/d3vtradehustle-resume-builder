import admin from "firebase-admin";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Load Firebase configuration from environment variables
const getFirebaseConfig = () => {
  // Check if we have the JSON string format (legacy support)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  }
  
  // Use individual environment variables
  return {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
    token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com"
  };
};

const serviceAccount = getFirebaseConfig();

if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  console.error("❌ Missing required Firebase environment variables. Please check your .env file.");
  console.error("Required variables: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL");
  process.exit(1);
}

console.log("✅ Environment variables loaded successfully!");
console.log("✅ Project ID:", serviceAccount.project_id);
console.log("✅ Client Email:", serviceAccount.client_email); 
console.log("✅ Firebase configuration is valid!");

// Only initialize Firebase if we have real credentials (not test ones)
if (serviceAccount.project_id !== "test-project") {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();

  async function testAdmin() {
    try {
      const docRef = db.collection("adminTest").doc("first");
      await docRef.set({ message: "🔥 Admin SDK connected successfully!" });
      console.log("✅ Firestore write successful.");
    } catch (error) {
      console.error("❌ Firestore write failed:", error);
    }
  }

  // Read-back check
  async function readBackTest() {
    try {
      const docRef = db.collection("adminTest").doc("first");
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        console.log("✅ Read-back success:", docSnap.data());
      } else {
        console.log("⚠️ No document found!");
      }
    } catch (error) {
      console.error("❌ Read-back failed:", error);
    }
  }

  // Run both write + read-back
  (async () => {
    await testAdmin();   // writes the test doc
    await readBackTest(); // reads it back
  })();
} else {
  console.log("🧪 Test mode detected - skipping Firebase connection");
  console.log("To test with real Firebase credentials, update your .env.local file");
}
