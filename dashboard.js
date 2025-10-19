// ───────────────────────────────────────────────
// 🔥 FIRESTORE REAL-TIME MONITOR
// ───────────────────────────────────────────────
import admin from "firebase-admin";
import chalk from "chalk";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or use serviceAccount
  });
}

const db = admin.firestore();

console.log("\n📡 Listening for Firestore changes...\n");

// Watch USERS collection
db.collection("users").onSnapshot((snap) => {
  snap.docChanges().forEach((change) => {
    const data = change.doc.data();
    const uid = change.doc.id;
    if (change.type === "added") {
      console.log(chalk.greenBright(`👤 [USER ADDED] ${data.email || uid}`));
    } else if (change.type === "modified") {
      console.log(chalk.yellow(`🔄 [USER UPDATED] ${data.email || uid}`));
    } else if (change.type === "removed") {
      console.log(chalk.red(`❌ [USER REMOVED] ${uid}`));
    }
  });
});

// Watch PAYMENTS collection
db.collection("payments").onSnapshot((snap) => {
  snap.docChanges().forEach((change) => {
    const data = change.doc.data();
    const id = change.doc.id;
    if (change.type === "added") {
      console.log(
        chalk.blueBright(
          `💰 [PAYMENT] ${data.type?.toUpperCase() || "UNKNOWN"} $${data.amount} — ${data.status}`
        )
      );
    } else if (change.type === "modified") {
      console.log(
        chalk.yellowBright(
          `🔁 [PAYMENT UPDATE] ${id} → ${data.status}`
        )
      );
    } else if (change.type === "removed") {
      console.log(chalk.red(`🗑 [PAYMENT REMOVED] ${id}`));
    }
  });
});
