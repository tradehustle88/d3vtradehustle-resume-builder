import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import * as admin from "firebase-admin";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    // 1. Verify reCAPTCHA
    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success || data.score < 0.5) {
      return NextResponse.json(
        { success: false, reason: "Recaptcha failed" },
        { status: 403 }
      );
    }

    // 2. Save email to Firestore (if available)
    if (db) {
      const docRef = db.collection("unlocks").doc();
      await docRef.set({
        email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log("📩 Email saved to Firestore:", email);
    } else {
      console.log("📩 Email captured (Firestore not available):", email);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unlock error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}