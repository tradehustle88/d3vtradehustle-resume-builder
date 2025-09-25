// src/app/api/unlock-resume/route.ts
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import crypto from "crypto";

export const runtime = "nodejs";

// GET handler to prevent build-time errors
export async function GET() {
  return NextResponse.json({ 
    message: "Resume unlock API endpoint - POST requests only" 
  }, { status: 405 });
}

// --- Firebase Admin Init Function ---
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      
      if (!serviceAccountKey) {
        throw new Error("Firebase service account key not found");
      }

      const serviceAccountString = Buffer.from(serviceAccountKey, "base64").toString("utf8");
      const serviceAccount = JSON.parse(serviceAccountString);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.warn("⚠️ Firebase Admin initialization failed:", error);
      throw error;
    }
  }
  return admin.firestore();
}

// --- API Route ---
export async function POST(req: NextRequest) {
  try {
    // Initialize Firebase Admin SDK
    let db;
    try {
      db = initializeFirebaseAdmin();
    } catch (initError) {
      console.error("Firebase initialization failed:", initError);
      return NextResponse.json(
        { success: false, error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    const { email, resume, recaptchaToken, idToken } = await req.json();

    // Validate required fields
    if (!email || !recaptchaToken || !idToken) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // --- 1. Verify reCAPTCHA ---
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA not configured" },
        { status: 500 }
      );
    }

    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json(
        { success: false, error: "Failed reCAPTCHA verification" },
        { status: 403 }
      );
    }

    // --- 2. Verify Firebase Auth ID Token ---
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authError) {
      console.error("❌ Firebase Auth verification failed:", authError);
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 403 }
      );
    }

    if (decodedToken.email && decodedToken.email !== email) {
      return NextResponse.json(
        { success: false, error: "Email mismatch with authenticated user" },
        { status: 403 }
      );
    }

    // --- 3. Enforce One Resume Rule ---
    const userRef = db.collection("unlocks").doc(decodedToken.uid);
    const existingDoc = await userRef.get();

    if (existingDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume already unlocked",
        },
        { status: 403 }
      );
    }

    // --- 4. Save Unlock Record ---
    await userRef.set({
      email,
      resume: resume || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      recaptchaScore: recaptchaData.score,
      userId: decodedToken.uid,
    });

    // Return success - client will handle PDF download from /resume-kit.pdf
    return NextResponse.json({
      success: true,
      message: "Resume unlocked successfully",
    });
  } catch (error: any) {
    const errorId = crypto.randomUUID();
    console.error(`unlock-resume API error [${errorId}]:`, error);

    return NextResponse.json(
      { success: false, error: "Unexpected server error", errorId },
      { status: 500 }
    );
  }
}
