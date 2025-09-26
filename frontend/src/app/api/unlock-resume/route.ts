// src/app/api/unlock-resume/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

// GET handler to prevent build-time errors
export async function GET() {
  return NextResponse.json({ 
    message: "Resume unlock API endpoint - POST requests only" 
  }, { status: 405 });
}

// --- API Route ---
export async function POST(req: NextRequest) {
  try {
    // Dynamic Firebase Admin initialization - only at runtime
    let admin: any;
    let db: any;
    let bucket: any;
    let auth: any;
    
    try {
      // Use eval to prevent bundler from analyzing this at build time
      admin = require("firebase-admin");
      
      if (!admin.apps.length) {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
        
        if (!serviceAccountKey) {
          throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable not found");
        }
        
        if (!storageBucket) {
          throw new Error("FIREBASE_STORAGE_BUCKET environment variable not found");  
        }

        const serviceAccountString = Buffer.from(serviceAccountKey, "base64").toString("utf8");
        const serviceAccount = JSON.parse(serviceAccountString);

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: storageBucket,
        });
      }
      
      db = admin.firestore();
      bucket = admin.storage().bucket();
      auth = admin.auth();
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
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (authError) {
      console.error("❌ Firebase Auth verification failed:", authError);
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 403 }
      );
    }

    if (decodedToken.email !== email) {
      return NextResponse.json(
        { success: false, error: "Email mismatch with authenticated user" },
        { status: 403 }
      );
    }

    // --- 3. Enforce One Resume Rule ---
    const ref = db.collection("unlocks").doc(decodedToken.uid);
    const existingDoc = await ref.get();

    if (existingDoc.exists) {
      return NextResponse.json(
        { success: false, error: "Resume already unlocked" },
        { status: 403 }
      );
    }

    // --- 4. Generate Signed Download URL ---
    let signedUrl;
    try {
      const file = bucket.file("resume-kit.pdf");
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });
      signedUrl = url;
    } catch (storageError) {
      console.error("❌ Firebase Storage signed URL generation failed:", storageError);
      return NextResponse.json(
        { success: false, error: "Failed to generate download link" },
        { status: 500 }
      );
    }

    // --- 5. Save Unlock Record ---
    await ref.set({
      email,
      resume: resume || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      recaptchaScore: recaptchaData.score,
      userId: decodedToken.uid,
      downloadUrl: signedUrl,
    });

    // Return success with download URL
    return NextResponse.json({
      success: true,
      message: "Resume unlocked successfully",
      downloadUrl: signedUrl,
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
