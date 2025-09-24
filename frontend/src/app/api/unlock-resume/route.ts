
import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    // Verify token with reCAPTCHA secret
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: "POST" }
    ).then(r => r.json());

    if (!verifyRes.success || verifyRes.score < 0.5) {
      return NextResponse.json({ success: false, error: "Failed reCAPTCHA" }, { status: 400 });
    }

    // Store email in Firestore
    await db.collection("unlocks").add({
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unlock API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}