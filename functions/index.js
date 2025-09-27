/**
 * Trade Hustle Resume Builder - Firebase Functions
 * Features:
 *  - Signup with reCAPTCHA + Firestore + Gmail
 *  - Unlock Resume PDF with secure token + signed URL
 *  - Resume Editing powered by Gemini 2.5 Flash Preview
 *  - Health check and root routes
 */

const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Set global options
setGlobalOptions({ maxInstances: 10 });

// Firebase + Express setup
admin.initializeApp();
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

//
// Health check
//
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "🔥 Trade Hustle Functions Running",
    timestamp: new Date().toISOString(),
  });
});

//
// Signup endpoint
//
app.post("/signup", async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Verify reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) return res.status(500).json({ error: "reCAPTCHA not configured" });

    const verify = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      { method: "POST" }
    );
    const data = await verify.json();
    if (!data.success || data.score < 0.5) {
      return res.status(400).json({ error: "reCAPTCHA failed" });
    }

    // Save signup
    await db.collection("signups").add({
      email,
      createdAt: new Date(),
      recaptchaScore: data.score,
    });

    // Send Gmail confirmation
    const gmail_user = process.env.GMAIL_USER;
    const gmail_pass = process.env.GMAIL_PASS;
    if (gmail_user && gmail_pass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmail_user, pass: gmail_pass },
      });

      await transporter.sendMail({
        from: `"Trade Hustle" <${gmail_user}>`,
        to: email,
        subject: "Your Free Resume Kit",
        html: `
          <h2>Thanks for signing up!</h2>
          <p>Your free resume kit is ready. You can download it from our website.</p>
          <p>Visit: <a href="https://nexxgennhustle.com">nexxgennhustle.com</a></p>
        `,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Signup API error:", err);
    res.status(500).json({ error: err.message });
  }
});

//
// Unlock Resume endpoint
//
app.post("/unlock-resume", async (req, res) => {
  try {
    const { email, resume, recaptchaToken, idToken } = req.body;
    if (!email || !recaptchaToken || !idToken) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Verify reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      return res.status(500).json({ success: false, error: "reCAPTCHA not configured" });
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
      return res.status(403).json({ success: false, error: "Failed reCAPTCHA verification" });
    }

    // Verify Firebase Auth
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (authError) {
      console.error("❌ Firebase Auth verification failed:", authError);
      return res.status(403).json({ success: false, error: "Invalid authentication token" });
    }

    if (decodedToken.email !== email) {
      return res.status(403).json({ success: false, error: "Email mismatch with authenticated user" });
    }

    // Enforce one unlock per user
    const ref = db.collection("unlocks").doc(decodedToken.uid);
    const existingDoc = await ref.get();
    if (existingDoc.exists) {
      return res.status(403).json({ success: false, error: "Resume already unlocked" });
    }

    // Generate signed download URL
    let signedUrl;
    try {
      const file = bucket.file("resume-kit.pdf");
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000,
      });
      signedUrl = url;
    } catch (storageError) {
      console.error("❌ Firebase Storage signed URL generation failed:", storageError);
      return res.status(500).json({ success: false, error: "Failed to generate download link" });
    }

    // Save unlock record
    await ref.set({
      email,
      resume: resume || "",
      createdAt: new Date(),
      recaptchaScore: recaptchaData.score,
      userId: decodedToken.uid,
      downloadUrl: signedUrl,
    });

    res.json({
      success: true,
      message: "Resume unlocked successfully",
      downloadUrl: signedUrl,
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`unlock-resume API error [${errorId}]:`, error);

    res.status(500).json({
      success: false,
      error: "Unexpected server error",
      errorId,
    });
  }
});

//
// Resume Editing (Gemini 2.5 Flash Preview)
//
app.post("/edit-resume", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025",
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ success: true, result: text });
  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({ error: err.message });
  }
});

//
// Root route
//
app.get("/", (req, res) => {
  res.send("🚀 Trade Hustle Resume Builder backend is live!");
});

//
// Exports
//
exports.signup = onRequest((req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const mockReq = { ...req, url: "/signup", path: "/signup" };
  return app(mockReq, res);
});

exports.unlockResume = onRequest((req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const mockReq = { ...req, url: "/unlock-resume", path: "/unlock-resume" };
  return app(mockReq, res);
});

exports.editResume = onRequest((req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const mockReq = { ...req, url: "/edit-resume", path: "/edit-resume" };
  return app(mockReq, res);
});

exports.app = onRequest(app);
