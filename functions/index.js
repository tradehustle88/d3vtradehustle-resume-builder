require("dotenv").config();

const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("cors");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const axios = require("axios");
const functions = require("firebase-functions");

// --- Firebase Options ---
setGlobalOptions({maxInstances: 10});
admin.initializeApp();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Health Check ---
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "🔥 Trade Hustle Functions Running",
    timestamp: new Date().toISOString(),
  });
});

// --- Signup ---
app.post("/signup", async (req, res) => {
  try {
    const {email, token} = req.body;
    if (!email || !token) {
      return res.status(400).json({error: "Missing fields"});
    }

    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
      return res.status(500).json({error: "reCAPTCHA not configured"});
    }

    const verifyUrl =
      `https://www.google.com/recaptcha/api/siteverify` +
      `?secret=${secret}&response=${token}`;

    const verify = await fetch(verifyUrl, {method: "POST"});
    const data = await verify.json();

    if (!data.success || data.score < 0.5) {
      return res.status(400).json({error: "reCAPTCHA failed"});
    }

    await db.collection("signups").add({
      email,
      createdAt: new Date(),
      recaptchaScore: data.score,
    });

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {user: gmailUser, pass: gmailPass},
      });

      await transporter.sendMail({
        from: `"Trade Hustle" <${gmailUser}>`,
        to: email,
        subject: "Your Free Resume Kit",
        text: "Thanks for signing up! Your resume kit will be available soon.",
        html: `
          <h2>Thanks for signing up!</h2>
          <p>Your free resume kit is ready.</p>
          <p>Visit: 
            <a href="https://nexxgennhustle.com">nexxgennhustle.com</a>
          </p>
        `,
      });
    }

    res.json({success: true});
  } catch (err) {
    console.error("Signup API error:", err);
    res.status(500).json({error: err.message});
  }
});

// --- Unlock Resume ---
app.post("/unlock-resume", async (req, res) => {
  try {
    const {email, resume, recaptchaToken, idToken} = req.body;
    if (!email || !recaptchaToken || !idToken) {
      return res.status(400).json({success: false, error: "Missing fields"});
    }

    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    if (!recaptchaSecret) {
      return res.status(500).json({
        success: false,
        error: "reCAPTCHA not configured",
      });
    }

    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
      },
    );

    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return res.status(403).json({
        success: false,
        error: "Failed reCAPTCHA verification",
      });
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (authError) {
      console.error("❌ Firebase Auth verification failed:", authError);
      return res.status(403).json({
        success: false,
        error: "Invalid authentication token",
      });
    }

    if (decodedToken.email !== email) {
      return res.status(403).json({
        success: false,
        error: "Email mismatch with authenticated user",
      });
    }

    const ref = db.collection("unlocks").doc(decodedToken.uid);
    const existingDoc = await ref.get();
    if (existingDoc.exists) {
      return res.status(403).json({
        success: false,
        error: "Resume already unlocked",
      });
    }

    let signedUrl;
    try {
      const file = bucket.file("resume-kit.pdf");
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000,
      });
      signedUrl = url;
    } catch (storageError) {
      console.error("❌ Storage signed URL failed:", storageError);
      return res.status(500).json({
        success: false,
        error: "Failed to generate download link",
      });
    }

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

// --- Edit Resume (Gemini) ---
app.post("/edit-resume", async (req, res) => {
  try {
    const {prompt} = req.body;
    if (!prompt) {
      return res.status(400).json({error: "Missing prompt"});
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025",
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({success: true, result: text});
  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({error: err.message});
  }
});

// --- Root ---
app.get("/", (req, res) => {
  res.send("🚀 Trade Hustle Resume Builder backend is live!");
});

// --- Standalone reCAPTCHA Verification ---
const SECRET_KEY = process.env.RECAPTCHA_SECRET;

exports.verifyRecaptcha = functions.https.onRequest(async (req, res) => {
  const token = req.body.token;
  try {
    const verifyRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`
    );
    res.json(verifyRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Exports ---
exports.signup = onRequest(app);
exports.unlockResume = onRequest(app);
exports.editResume = onRequest(app);
exports.app = onRequest(app);
