/**
 * Trade Hustle Resume Builder - Firebase Functions
 * Simplified version to avoid deployment timeouts
 */

const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");

// Set global options
setGlobalOptions({maxInstances: 10});

//
// Simple health check function
//
exports.healthCheck = onRequest((req, res) => {
  res.json({
    status: "ok",
    message: "🔥 Trade Hustle Functions Running",
    timestamp: new Date().toISOString(),
  });
});

//
// Simple signup function
//
exports.signup = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }

  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({error: "Missing email"});
    }

    // For now, just return success
    // TODO: Add Firebase Admin, Firestore, and email functionality

    res.json({
      success: true,
      message: "Signup successful",
      email: email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({error: error.message});
  }
});

//
// Simple resume unlock function
//
exports.unlockResume = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }

  try {
    const {email, idToken} = req.body;

    if (!email || !idToken) {
      return res.status(400).json({error: "Missing required fields"});
    }

    // For now, just return a mock download URL
    // TODO: Add Firebase Admin, Auth verification, and Storage functionality

    res.json({
      success: true,
      message: "Resume unlocked successfully",
      downloadUrl: "https://tradehustleresumebuilder.web.app/resume-kit.pdf",
    });
  } catch (error) {
    console.error("Unlock error:", error);
    res.status(500).json({error: error.message});
  }
});

//
// Simple AI resume editing function
//
exports.editResume = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }

  try {
    const {prompt} = req.body;

    if (!prompt) {
      return res.status(400).json({error: "Missing prompt"});
    }

    // Mock AI response for now
    // TODO: Add Gemini AI integration
    const mockResponse = "Professional summary: Experienced trade professional " +
      "with strong technical skills and customer service focus. " +
      "Proven track record in project completion and safety compliance.";

    res.json({
      success: true,
      result: mockResponse,
    });
  } catch (error) {
    console.error("Edit resume error:", error);
    res.status(500).json({error: error.message});
  }
});

//
// Simple reCAPTCHA verification
//
exports.verifyRecaptcha = onRequest(async (req, res) => {
  // Allow CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }

  try {
    // For now, just return success
    // TODO: Add actual reCAPTCHA verification
    res.json({
      success: true,
      score: 0.9,
    });
  } catch (error) {
    console.error("reCAPTCHA error:", error);
    res.status(500).json({error: error.message});
  }
});
