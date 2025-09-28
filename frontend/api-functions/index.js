// Load environment variables from .env
require("dotenv").config();

const {onRequest} = require("firebase-functions/v2/https");
const axios = require("axios");

// Read reCAPTCHA secret from environment
const SECRET_KEY = process.env.RECAPTCHA_SECRET;

if (!SECRET_KEY) {
  console.warn("⚠️ Missing RECAPTCHA_SECRET in .env file or CI/CD secrets.");
}

// ======================================================
// reCAPTCHA Verification Function with Signup Handling (Updated to v2)
// ======================================================
exports.verifyRecaptcha = onRequest(async (req, res) => {
  // Allow CORS for testing/demo
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Handle CORS preflight
    return res.status(204).send("");
  }

  try {
    const { email, token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: "Missing reCAPTCHA token" });
    }

    // Verify token with Google reCAPTCHA
    const verifyRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: SECRET_KEY,
          response: token,
        },
      }
    );

    const data = verifyRes.data;

    if (!data.success || (data.score !== undefined && data.score < 0.5)) {
      return res.status(403).json({
        success: false,
        error: "reCAPTCHA verification failed",
        details: data,
      });
    }

    // ✅ reCAPTCHA passed — handle signup logic here
    if (email) {
      console.log("New signup:", email);
      console.log("reCAPTCHA score:", data.score);
      
      // TODO: Add your signup logic here:
      // - Save email to Firestore database
      // - Send welcome email with resume kit
      // - Log analytics event
      // - Add to mailing list
      
      return res.json({
        success: true,
        message: "Verification passed and signup processed",
        email: email,
        score: data.score,
      });
    }

    // If no email provided, just return verification result
    return res.json({
      success: true,
      message: "reCAPTCHA verified successfully",
      score: data.score,
    });
  } catch (err) {
    console.error("reCAPTCHA error:", err.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ======================================================
// Example placeholder function for other endpoints (Updated to v2)
// ======================================================
exports.healthCheck = onRequest((req, res) => {
  res.json({
    status: "ok",
    message: "🔥 Trade Hustle Functions Running",
    timestamp: new Date().toISOString(),
  });
});