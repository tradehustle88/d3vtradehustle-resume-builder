/**
 * Trade Hustle Resume Builder - Firebase Functions
 * Features:
 *  - Signup with reCAPTCHA + Firestore + Gmail
 *  - Unlock Resume PDF with secure token + signed URL
 *  - Resume Editing powered by Gemini 2.5 Flash Preview
 *  - Health check and root routes
 */

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

// Set global options
setGlobalOptions({maxInstances: 10});

// Firebase + Express setup
admin.initializeApp();
const app = express();

// Middleware
app.use(cors({origin: true}));
app.use(express.json());

// Rate limiting: 30 requests per minute per IP
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Honeypot middleware - reject requests with "company" field filled
const honeypotCheck = (req, res, next) => {
  if (req.body.company) {
    console.warn("🍯 Honeypot triggered - likely bot activity");
    return res.status(400).json({success: false, error: "Invalid request"});
  }
  next();
};

/**
 * Authentication middleware - verify Firebase Auth token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @return {Promise<void>}
 */
async function verifyUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required - please sign in",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    console.log(`✅ Authenticated user: ${req.user.email} (${req.user.uid})`);
    next();
  } catch (error) {
    console.error("🚫 Authentication failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
}
app.use(honeypotCheck);

const db = admin.firestore();

// Gemini setup - only initialize if API key is available
const genAI = process.env.GOOGLE_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY) : null;

// reCAPTCHA setup
const SECRET_KEY = process.env.RECAPTCHA_SECRET;

/**
 * Helper function to verify reCAPTCHA token
 * Bypasses verification if RECAPTCHA_SECRET is not configured
 * @param {string} token - reCAPTCHA token to verify
 * @return {Promise<Object>} Verification result
 */
async function verifyRecaptcha(token) {
  if (!SECRET_KEY) {
    // No secret configured - bypass for dev/staging
    return {success: true, score: 1.0, bypass: true};
  }

  try {
    const verifyRes = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`,
    );
    return verifyRes.data;
  } catch (err) {
    console.error("❌ reCAPTCHA verification error:", err);
    throw err;
  }
}

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
    const {email, token} = req.body;
    if (!email) {
      return res.status(400).json({error: "Missing email"});
    }

    // Verify reCAPTCHA (bypasses if not configured)
    let recaptchaData = {success: true, score: 1.0};
    if (token) {
      try {
        recaptchaData = await verifyRecaptcha(token);
        if (!recaptchaData.success || (recaptchaData.score && recaptchaData.score < 0.5)) {
          return res.status(400).json({error: "reCAPTCHA failed"});
        }
      } catch (err) {
        console.error("❌ reCAPTCHA verification failed:", err);
        // Continue without reCAPTCHA if it fails
      }
    }

    // Save signup
    await db.collection("signups").add({
      email,
      createdAt: new Date(),
      recaptchaScore: recaptchaData.score || 1.0,
      recaptchaBypassed: recaptchaData.bypass || false,
    });

    // Send Gmail confirmation
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
        html: `
          <h2>Thanks for signing up!</h2>
          <p>Your free resume kit is ready. You can download it from our
          website.</p>
          <p>Visit: <a href="https://nexxgennhustle.com">nexxgennhustle.com</a></p>
        `,
      });
    }

    res.json({success: true});
  } catch (err) {
    console.error("Signup API error:", err);
    res.status(500).json({error: err.message});
  }
});

//
// Unlock Resume endpoint - Protected with authentication
//
app.post("/api/unlock-resume", honeypotCheck, verifyUser, async (req, res) => {
  try {
    // User is already authenticated via verifyUser middleware
    const {uid, email, displayName} = req.user;

    console.log(`🔓 Processing unlock request for ${email} (${uid})`);

    // Check honeypot (already handled by middleware, but log if triggered)
    if (req.body.company) {
      console.warn(`🍯 Honeypot detected for user ${email}`);
      return res.status(400).json({
        success: false,
        message: "Invalid request detected",
      });
    }

    // Check if user already unlocked (allow re-unlocks for now)
    const ref = db.collection("unlocks").doc(uid);
    const existingDoc = await ref.get();

    if (existingDoc.exists) {
      console.log(`♻️ Re-unlock detected for ${email} - allowing access`);
    }

    // Save/update unlock record with user data
    await ref.set({
      email,
      displayName,
      userId: uid,
      createdAt: existingDoc.exists ? existingDoc.data().createdAt : new Date(),
      lastAccessAt: new Date(),
      accessCount: ((existingDoc.data() && existingDoc.data().accessCount) || 0) + 1,
    }, {merge: true});

    res.json({
      success: true,
      message: `🔓 Resume unlocked for ${displayName || email}`,
      userId: uid,
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
// Resume Editing (Gemini 2.5 Flash Preview) - Protected with authentication
//
app.post("/api/editResume", honeypotCheck, verifyUser, async (req, res) => {
  try {
    // User is already authenticated via verifyUser middleware
    const {uid, email, displayName} = req.user;
    const {prompt, resumeContent} = req.body;

    console.log(`✏️ Processing edit request for ${email} (${uid})`);

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Missing prompt for resume editing",
      });
    }

    if (!genAI) {
      return res.status(503).json({
        success: false,
        message: "AI service not available. Please configure GOOGLE_API_KEY.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025",
    });

    // Enhanced prompt with user context
    const enhancedPrompt = `
      User: ${displayName || email}
      Task: Resume editing assistance
      Request: ${prompt}
      ${resumeContent ? `Current resume content: ${resumeContent}` : ""}
      
      Please provide professional resume editing suggestions.
    `;

    const result = await model.generateContent(enhancedPrompt);
    const text = result.response.text();

    // Save editing session to user's history
    await db.collection("resumeEdits").add({
      userId: uid,
      email,
      prompt,
      result: text,
      createdAt: new Date(),
      model: "gemini-2.5-flash-preview-09-2025",
    });

    res.json({
      success: true,
      result: text,
      message: `Resume editing completed for ${displayName || email}`,
    });
  } catch (err) {
    console.error("❌ Resume editing error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
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
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }
  const mockReq = {...req, url: "/signup", path: "/signup"};
  return app(mockReq, res);
});

exports.unlockResume = onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }
  const mockReq = {...req, url: "/unlock-resume", path: "/unlock-resume"};
  return app(mockReq, res);
});

exports.editResume = onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }
  const mockReq = {...req, url: "/edit-resume", path: "/edit-resume"};
  return app(mockReq, res);
});

// Updated to v2 function to fix deployment migration issues
exports.verifyRecaptcha = onRequest(async (req, res) => {
  // Allow CORS for testing/demo
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Handle CORS preflight
    return res.status(204).send("");
  }

  const token = req.body.token;
  try {
    const result = await verifyRecaptcha(token);
    res.json(result);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

exports.app = onRequest(app);
