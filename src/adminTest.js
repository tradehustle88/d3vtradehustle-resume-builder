import admin from "firebase-admin";
import { readFileSync } from "fs";

// Load your service account key
const serviceAccount = JSON.parse(
  readFileSync("serviceAccountKey.json", "utf8")   // ✅ Clean path
);

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
