import * as admin from "firebase-admin";

let app: admin.app.App;

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
  );

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  app = admin.app();
}

export const db = admin.firestore(app);
