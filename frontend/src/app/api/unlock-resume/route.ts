// src/app/api/unlock-resume/route.ts
// src/app/api/unlock-resume/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";

// ✅ Initialize Firebase Admin safely
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.apps.length ? admin.firestore() : null;

// ✅ Simple GET check (for health tests)
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Unlock API is live 🚀",
  });
}

// ✅ POST handler (real unlock flow)
export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Missing email" }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json({ success: false, error: "Missing reCAPTCHA token" }, { status: 400 });
    }

    // 🔐 Verify token with Google
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: "POST" }
    ).then(r => r.json());

    if (!verifyRes.success || verifyRes.score < 0.5) {
      return NextResponse.json({ success: false, error: "Failed reCAPTCHA" }, { status: 400 });
    }

    // 🗄️ Save to Firestore if DB is available
    if (db) {
      await db.collection("unlocks").add({
        email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unlock API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
