/**
 * Trade Hustle Resume Builder - Firebase Functions
 * Features:
 *  - Signup with reCAPTCHA + Firestore + Gmail
 *  - Unlock Resume PDF with secure token + signed URL
 *  - Resume Editing powered by Gemini 2.5 Flash Preview
 *  - Health check and root routes
 */

// Note: dotenv not needed in production - Firebase injects env vars automatically
// require("dotenv").config();

const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("cors");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const {VertexAI} = require("@google-cloud/vertexai");
const axios = require("axios");
const {
  pricingTiers,
  getTierById,
  getTierFromPriceId,
} = require("./stripe-config");

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

// Vertex AI setup - alternative to direct Gemini API
let vertexAI = null;
try {
  if (process.env.PROJECT_ID) {
    vertexAI = new VertexAI({
      project: process.env.PROJECT_ID,
      location: process.env.REGION || "us-central1",
    });
  }
} catch (error) {
  console.warn("⚠️ Vertex AI initialization failed:", error.message);
}

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
    environment: {
      projectId: process.env.PROJECT_ID || "not-configured",
      region: process.env.REGION || "not-configured",
      googleAI: process.env.GOOGLE_API_KEY ? "configured" : "not-configured",
      vertexAI: !!vertexAI && !!process.env.PROJECT_ID ? "configured" : "not-configured",
      recaptcha: process.env.RECAPTCHA_SECRET ? "configured" : "not-configured",
      gmail: !!process.env.GMAIL_USER && !!process.env.GMAIL_PASS ? "configured" : "not-configured",
    },
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
// Gemini AI Agent - Flexible AI endpoint with dual provider support
//
app.post("/api/geminiAgent", honeypotCheck, verifyUser, async (req, res) => {
  try {
    const {uid, email, displayName} = req.user;
    const {prompt, useVertexAI = false, model = "gemini-1.5-flash"} = req.body;

    console.log(`🤖 AI request from ${email} (${uid}) - Provider: ${useVertexAI ? "Vertex AI" : "Gemini API"}`);

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Missing prompt for AI generation",
      });
    }

    let result;
    let aiProvider;
    let modelUsed;

    if (useVertexAI && vertexAI) {
      // Use Vertex AI
      try {
        const vertexModel = vertexAI.getGenerativeModel({
          model: model || "gemini-1.5-flash",
        });

        const input = prompt || "Write a concise summary for a trade professional résumé.";
        const vertexResult = await vertexModel.generateContent(input);
        result = vertexResult.response.candidates[0].content.parts[0].text;
        aiProvider = "Vertex AI";
        modelUsed = model || "gemini-1.5-flash";
      } catch (vertexError) {
        console.warn("⚠️ Vertex AI failed, falling back to Gemini API:", vertexError.message);
        // Fallback to Gemini API
        if (!genAI) {
          throw new Error("Both Vertex AI and Gemini API are unavailable");
        }
        const geminiModel = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
        const geminiResult = await geminiModel.generateContent(prompt);
        result = geminiResult.response.text();
        aiProvider = "Gemini API (fallback)";
        modelUsed = "gemini-1.5-flash";
      }
    } else {
      // Use direct Gemini API
      if (!genAI) {
        return res.status(503).json({
          success: false,
          message: "AI service not available. Please configure GOOGLE_API_KEY or enable Vertex AI.",
        });
      }

      const geminiModel = genAI.getGenerativeModel({
        model: model || "gemini-1.5-flash",
      });

      const geminiResult = await geminiModel.generateContent(prompt);
      result = geminiResult.response.text();
      aiProvider = "Gemini API";
      modelUsed = model || "gemini-1.5-flash";
    }

    // Save AI interaction to user's history
    await db.collection("aiInteractions").add({
      userId: uid,
      email,
      prompt,
      result,
      provider: aiProvider,
      model: modelUsed,
      createdAt: new Date(),
    });

    res.json({
      success: true,
      output: result,
      provider: aiProvider,
      model: modelUsed,
      message: `AI generation completed for ${displayName || email}`,
    });
  } catch (err) {
    console.error("❌ Gemini Agent error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ATS Resume Analysis - Analyze resume and calculate ATS score
app.post("/api/gemini/analyze-resume", honeypotCheck, async (req, res) => {
  try {
    const {resumeData} = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: "Resume data is required",
      });
    }

    // Check if Gemini is available
    if (!genAI && !vertexAI) {
      return res.status(503).json({
        success: false,
        error: "AI service unavailable",
        message: "GOOGLE_API_KEY not configured",
      });
    }

    const trade = resumeData.profile && resumeData.profile.trade ? resumeData.profile.trade : "unknown";
    console.log(`📊 ATS Analysis request for trade: ${trade}`);

    const tradeForPrompt = resumeData.profile && resumeData.profile.trade ? resumeData.profile.trade : "the trade";
    const prompt = `
Analyze this tradesperson's resume for ATS (Applicant Tracking System) compatibility.

Score 0-100 based on:
- Keywords relevant to ${tradeForPrompt}
- Quantifiable achievements and metrics
- Proper formatting and structure
- Skill clarity and specificity
- Experience depth and relevance
- Certifications and licenses
- Contact information completeness

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "score": <number 0-100>,
  "suggestions": [<array of 3-5 actionable improvement suggestions>],
  "strengths": [<array of 2-3 resume strengths>],
  "weaknesses": [<array of 2-3 areas to improve>],
  "keywordMatch": <number 0-100>,
  "formattingScore": <number 0-100>,
  "experienceScore": <number 0-100>
}`;

    let result;
    let aiProvider;

    try {
      // Try Vertex AI first
      if (vertexAI) {
        const vertexModel = vertexAI.preview.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
        const vertexResult = await vertexModel.generateContent(prompt);
        result = vertexResult.response.candidates[0].content.parts[0].text;
        aiProvider = "Vertex AI";
      }
    } catch (vertexError) {
      console.warn("⚠️ Vertex AI failed, trying Gemini API:", vertexError.message);
    }

    // Fallback to Gemini API if Vertex failed or unavailable
    if (!result && genAI) {
      const geminiModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-09-2025",
      });
      const geminiResult = await geminiModel.generateContent(prompt);
      result = geminiResult.response.text();
      aiProvider = "Gemini API";
    }

    if (!result) {
      throw new Error("No AI provider available");
    }

    // Clean up JSON response (remove markdown code blocks if present)
    let cleanResult = result.trim();
    if (cleanResult.startsWith("```json")) {
      cleanResult = cleanResult.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanResult.startsWith("```")) {
      cleanResult = cleanResult.replace(/```\n?/g, "");
    }

    const analysis = JSON.parse(cleanResult);

    // Validate response structure
    if (typeof analysis.score !== "number" || !Array.isArray(analysis.suggestions)) {
      throw new Error("Invalid AI response format");
    }

    console.log(`✅ ATS Analysis complete - Score: ${analysis.score}% (via ${aiProvider})`);

    res.json(analysis);
  } catch (err) {
    console.error("❌ ATS Analysis error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Analysis failed",
    });
  }
});

// Trade Keywords - Get suggested keywords for a trade
app.post("/api/gemini/trade-keywords", honeypotCheck, async (req, res) => {
  try {
    const {trade} = req.body;

    if (!trade) {
      return res.status(400).json({
        success: false,
        error: "Trade type is required",
      });
    }

    // Check if Gemini is available
    if (!genAI && !vertexAI) {
      return res.status(503).json({
        success: false,
        error: "AI service unavailable",
      });
    }

    console.log(`🔑 Keyword request for trade: ${trade}`);

    const prompt = `
Generate a list of the top 20 ATS-optimized keywords for ${trade} trade positions.
Include:
- Technical skills specific to ${trade}
- Common tools and equipment
- Industry certifications
- Safety requirements
- Job responsibilities
- Compliance standards

Return ONLY a JSON array of keywords (no markdown, no code blocks):
["keyword1", "keyword2", "keyword3", ...]`;

    let result;

    if (genAI) {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      const geminiResult = await model.generateContent(prompt);
      result = geminiResult.response.text();
    } else if (vertexAI) {
      const model = vertexAI.preview.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      const vertexResult = await model.generateContent(prompt);
      result = vertexResult.response.candidates[0].content.parts[0].text;
    }

    // Clean up JSON response
    let cleanResult = result.trim();
    if (cleanResult.startsWith("```json")) {
      cleanResult = cleanResult.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanResult.startsWith("```")) {
      cleanResult = cleanResult.replace(/```\n?/g, "");
    }

    const keywords = JSON.parse(cleanResult);

    if (!Array.isArray(keywords)) {
      throw new Error("Invalid keywords format");
    }

    console.log(`✅ Generated ${keywords.length} keywords for ${trade}`);

    res.json({
      success: true,
      keywords,
      trade,
    });
  } catch (err) {
    console.error("❌ Keyword generation error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

//
// Service Imports
//
const stripeService = require("./services/stripe");
const firestoreService = require("./services/firestore");
const aiService = require("./services/ai");

//
// Resume & Data Management Routes
//

/**
 * Save resume
 * POST /api/resumes
 */
app.post("/api/resumes", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const result = await firestoreService.saveResume(uid, req.body);
    res.json(result);
  } catch (error) {
    console.error("❌ Save Resume Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Get user's resumes
 * GET /api/resumes
 */
app.get("/api/resumes", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const resumes = await firestoreService.getUserResumes(uid);
    res.json({success: true, resumes});
  } catch (error) {
    console.error("❌ Get Resumes Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Get single resume
 * GET /api/resumes/:id
 */
app.get("/api/resumes/:id", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const resume = await firestoreService.getResume(req.params.id, uid);
    res.json({success: true, resume});
  } catch (error) {
    console.error("❌ Get Resume Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Delete resume
 * DELETE /api/resumes/:id
 */
app.delete("/api/resumes/:id", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const result = await firestoreService.deleteResume(req.params.id, uid);
    res.json(result);
  } catch (error) {
    console.error("❌ Delete Resume Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Create job entry
 * POST /api/jobs
 */
app.post("/api/jobs", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const result = await firestoreService.createJob(uid, req.body);
    res.json(result);
  } catch (error) {
    console.error("❌ Create Job Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Get user's jobs
 * GET /api/jobs
 */
app.get("/api/jobs", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const statusFilter = req.query.status || null;
    const jobs = await firestoreService.getUserJobs(uid, statusFilter);
    res.json({success: true, jobs});
  } catch (error) {
    console.error("❌ Get Jobs Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Update job status
 * PUT /api/jobs/:id
 */
app.put("/api/jobs/:id", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const {status, notes} = req.body;
    const result = await firestoreService.updateJobStatus(req.params.id, uid, status, notes);
    res.json(result);
  } catch (error) {
    console.error("❌ Update Job Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Delete job
 * DELETE /api/jobs/:id
 */
app.delete("/api/jobs/:id", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const result = await firestoreService.deleteJob(req.params.id, uid);
    res.json(result);
  } catch (error) {
    console.error("❌ Delete Job Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

//
// AI Enhancement Routes
//

/**
 * Get AI resume suggestions
 * POST /api/ai/suggestions
 */
app.post("/api/ai/suggestions", verifyUser, async (req, res) => {
  try {
    const {resumeContent, trade} = req.body;
    const result = await aiService.generateResumeSuggestions(resumeContent, trade);
    res.json({success: true, suggestions: result});
  } catch (error) {
    console.error("❌ AI Suggestions Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Calculate ATS score
 * POST /api/ai/ats-score
 */
app.post("/api/ai/ats-score", verifyUser, async (req, res) => {
  try {
    const {resumeContent, jobDescription} = req.body;
    const result = await aiService.calculateATSScore(resumeContent, jobDescription);
    res.json({success: true, score: result});
  } catch (error) {
    console.error("❌ ATS Score Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Enhance achievement
 * POST /api/ai/enhance
 */
app.post("/api/ai/enhance", verifyUser, async (req, res) => {
  try {
    const {achievement, context} = req.body;
    const result = await aiService.enhanceAchievement(achievement, context);
    res.json({success: true, enhanced: result});
  } catch (error) {
    console.error("❌ Enhance Achievement Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

/**
 * Match job description
 * POST /api/ai/match-job
 */
app.post("/api/ai/match-job", verifyUser, async (req, res) => {
  try {
    const {resumeContent, jobDescription} = req.body;
    const result = await aiService.matchJobDescription(resumeContent, jobDescription);
    res.json({success: true, match: result});
  } catch (error) {
    console.error("❌ Match Job Error:", error);
    res.status(500).json({success: false, error: error.message});
  }
});

//
// Stripe Payment Routes
//

/**
 * Create Stripe checkout session
 * POST /api/create-checkout
 * Body: { priceId, successUrl, cancelUrl, metadata }
 */
app.post("/api/create-checkout", verifyUser, async (req, res) => {
  try {
    const {priceId, successUrl, cancelUrl, metadata} = req.body;
    const {uid, email} = req.user;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: priceId, successUrl, cancelUrl",
      });
    }

    const result = await stripeService.createCheckoutSession(
        uid,
        email,
        priceId,
        successUrl,
        cancelUrl,
        metadata || {},
    );

    res.json(result);
  } catch (error) {
    console.error("❌ Create Checkout Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Stripe webhook handler
 * POST /api/webhook/stripe
 * Handles: checkout.session.completed, subscription updates, payment events
 */
app.post("/api/webhook/stripe", express.raw({type: "application/json"}), async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    // Firebase Functions v2 uses environment variables only
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("⚠️ STRIPE_WEBHOOK_SECRET not configured");
      return res.status(500).json({error: "Webhook secret not configured"});
    }

    // Verify webhook signature
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const stripe = require("stripe")(stripeKey);
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).json({error: "Invalid signature"});
    }

    // Handle the event
    await stripeService.handleWebhookEvent(event);

    res.json({received: true});
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).json({error: error.message});
  }
});

/**
 * Get subscription details
 * GET /api/subscription
 */
app.get("/api/subscription", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const details = await stripeService.getSubscriptionDetails(uid);

    res.json({
      success: true,
      subscription: details,
    });
  } catch (error) {
    console.error("❌ Get Subscription Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Cancel subscription
 * POST /api/cancel-subscription
 */
app.post("/api/cancel-subscription", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const result = await stripeService.cancelSubscription(uid);

    res.json(result);
  } catch (error) {
    console.error("❌ Cancel Subscription Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Create customer portal session
 * POST /api/create-portal-session
 * Body: { returnUrl }
 */
app.post("/api/create-portal-session", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const {returnUrl} = req.body;

    if (!returnUrl) {
      return res.status(400).json({
        success: false,
        error: "returnUrl is required",
      });
    }

    const result = await stripeService.createPortalSession(uid, returnUrl);

    res.json(result);
  } catch (error) {
    console.error("❌ Create Portal Session Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//
// ============================================
// BLUEPRINT PURCHASE ENDPOINTS
// ============================================
//

/**
 * POST /api/blueprints/purchase
 * Create Stripe checkout session for blueprint purchase
 * Body: { blueprintId, price }
 */
app.post("/api/blueprints/purchase", honeypotCheck, verifyUser, async (req, res) => {
  try {
    const {uid, email} = req.user;
    const {blueprintId, price} = req.body;

    if (!blueprintId || !price) {
      return res.status(400).json({
        success: false,
        error: "blueprintId and price are required",
      });
    }

    console.log(`📘 Blueprint purchase initiated: ${blueprintId} by ${email}`);

    // Create Stripe checkout session for one-time payment
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const frontendUrl = process.env.FRONTEND_URL || "https://tradehustle.co";
    const successUrl = `${frontendUrl}/dashboard/blueprints?` +
      `success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontendUrl}/dashboard/blueprints?canceled=true`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Career Blueprint: ${blueprintId}`,
              description: "One-time purchase, lifetime access",
            },
            unit_amount: price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: uid,
      metadata: {
        blueprintId: blueprintId,
        userId: uid,
        type: "blueprint_purchase",
      },
    });

    // Log purchase attempt
    await db.collection("blueprintPurchaseAttempts").add({
      userId: uid,
      blueprintId: blueprintId,
      price: price,
      sessionId: session.id,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("❌ Blueprint Purchase Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/blueprints/verify
 * Verify blueprint purchase after Stripe webhook
 * Body: { sessionId }
 */
app.post("/api/blueprints/verify", honeypotCheck, verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const {sessionId} = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "sessionId is required",
      });
    }

    // Check if purchase record exists
    const purchaseSnapshot = await db.collection("blueprintPurchases")
        .where("userId", "==", uid)
        .where("stripeSessionId", "==", sessionId)
        .get();

    if (purchaseSnapshot.empty) {
      return res.status(404).json({
        success: false,
        error: "Purchase not found or not yet processed",
      });
    }

    const purchase = purchaseSnapshot.docs[0].data();

    res.json({
      success: true,
      purchase: {
        blueprintId: purchase.blueprintId,
        purchaseDate: purchase.purchaseDate,
        downloadUrl: purchase.downloadUrl,
      },
    });
  } catch (error) {
    console.error("❌ Blueprint Verify Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//
// ============================================
// REFERRAL PROGRAM ENDPOINTS
// ============================================
//

/**
 * POST /api/referrals/generate
 * Generate unique referral code for user
 */
app.post("/api/referrals/generate", honeypotCheck, verifyUser, async (req, res) => {
  try {
    const {uid, email} = req.user;

    // Check if user already has a referral code
    const userDoc = await db.collection("users").doc(uid).get();

    if (userDoc.exists() && userDoc.data().referralCode) {
      return res.json({
        success: true,
        referralCode: userDoc.data().referralCode,
      });
    }

    // Generate unique referral code (8 characters)
    const generateCode = () => {
      return crypto.randomBytes(4).toString("hex").toUpperCase();
    };

    let referralCode = generateCode();
    let isUnique = false;

    // Ensure referral code is unique
    while (!isUnique) {
      const existingCode = await db.collection("users")
          .where("referralCode", "==", referralCode)
          .get();

      if (existingCode.empty) {
        isUnique = true;
      } else {
        referralCode = generateCode();
      }
    }

    // Save referral code to user document
    await db.collection("users").doc(uid).set({
      email: email,
      referralCode: referralCode,
      referralStats: {
        totalReferrals: 0,
        converted: 0,
        totalEarnings: 0,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});

    console.log(`🔗 Referral code generated: ${referralCode} for ${email}`);

    res.json({
      success: true,
      referralCode: referralCode,
    });
  } catch (error) {
    console.error("❌ Generate Referral Code Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/referrals/track
 * Track referral signup
 * Body: { referralCode, referredEmail }
 */
app.post("/api/referrals/track", honeypotCheck, async (req, res) => {
  try {
    const {referralCode, referredEmail} = req.body;

    if (!referralCode || !referredEmail) {
      return res.status(400).json({
        success: false,
        error: "referralCode and referredEmail are required",
      });
    }

    // Find referrer by code
    const referrerSnapshot = await db.collection("users")
        .where("referralCode", "==", referralCode)
        .get();

    if (referrerSnapshot.empty) {
      return res.status(404).json({
        success: false,
        error: "Invalid referral code",
      });
    }

    const referrerId = referrerSnapshot.docs[0].id;

    // Create referral record
    await db.collection("referrals").add({
      referrerId: referrerId,
      referredEmail: referredEmail,
      status: "signed_up",
      commission: 10.00, // $10 per referral
      paid: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update referrer stats
    await db.collection("users").doc(referrerId).update({
      "referralStats.totalReferrals": admin.firestore.FieldValue.increment(1),
    });

    console.log(`🎯 Referral tracked: ${referredEmail} referred by ${referralCode}`);

    res.json({
      success: true,
      message: "Referral tracked successfully",
    });
  } catch (error) {
    console.error("❌ Track Referral Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/referrals/payout
 * Request referral payout
 * Body: { amount }
 */
app.post("/api/referrals/payout", honeypotCheck, verifyUser, async (req, res) => {
  try {
    const {uid, email} = req.user;
    const {amount} = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({
        success: false,
        error: "Minimum payout amount is $50",
      });
    }

    // Get user's referral stats
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData || !userData.referralStats) {
      return res.status(404).json({
        success: false,
        error: "No referral data found",
      });
    }

    // Get unpaid referrals
    const unpaidReferrals = await db.collection("referrals")
        .where("referrerId", "==", uid)
        .where("status", "==", "converted")
        .where("paid", "==", false)
        .get();

    const availableAmount = unpaidReferrals.docs.reduce((sum, doc) => {
      return sum + doc.data().commission;
    }, 0);

    if (availableAmount < amount) {
      return res.status(400).json({
        success: false,
        error: `Insufficient funds. Available: $${availableAmount.toFixed(2)}`,
      });
    }

    // Create payout request
    const payoutRequest = await db.collection("payoutRequests").add({
      userId: uid,
      email: email,
      amount: amount,
      status: "pending",
      referralIds: unpaidReferrals.docs.map((doc) => doc.id),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`💰 Payout requested: $${amount} for ${email}`);

    // TODO: Integrate with PayPal or Stripe payouts API

    res.json({
      success: true,
      message: "Payout request submitted successfully",
      payoutId: payoutRequest.id,
      amount: amount,
    });
  } catch (error) {
    console.error("❌ Payout Request Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//
// ============================================
// SUBSCRIPTION MANAGEMENT ROUTES
// ============================================
//

/**
 * Create Subscription
 * POST /api/subscription/create
 * Create new subscription with Stripe checkout
 */
app.post("/api/subscription/create", honeypotCheck, verifyUser, async (req, res) => {
  try {
    const {uid, email} = req.user;
    const {priceId, tierId} = req.body;

    if (!priceId || !tierId) {
      return res.status(400).json({
        success: false,
        error: "Missing priceId or tierId",
      });
    }

    // Validate tier exists
    const tierConfig = getTierById(tierId);
    if (!tierConfig) {
      return res.status(400).json({
        success: false,
        error: "Invalid tier",
      });
    }

    // Check if user already has active subscription
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (userData && userData.subscriptionStatus === "active") {
      return res.status(400).json({
        success: false,
        error: "You already have an active subscription",
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || "https://tradehustle.co";
    const successUrl = `${frontendUrl}/dashboard?subscription=success`;
    const cancelUrl = `${frontendUrl}/pricing?subscription=canceled`;

    // Create Stripe checkout session
    const result = await stripeService.createCheckoutSession(
        uid,
        email,
        priceId,
        successUrl,
        cancelUrl,
        {
          tierId,
          type: "subscription",
        },
    );

    // Log subscription attempt
    await db.collection("subscriptionAttempts").add({
      userId: uid,
      email: email,
      tierId: tierId,
      priceId: priceId,
      sessionId: result.sessionId,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`💳 Subscription checkout created: ${tierId} for ${email}`);

    res.json({
      success: true,
      sessionId: result.sessionId,
      checkoutUrl: result.url,
    });
  } catch (error) {
    console.error("❌ Create Subscription Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Get User Subscription Status
 * GET /api/subscription/status
 * Get current user's subscription details
 */
app.get("/api/subscription/status", verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.json({
        success: true,
        subscription: {
          tier: "free",
          status: "active",
          features: getTierById("free").limits,
        },
      });
    }

    const userData = userDoc.data();
    const currentTier = userData.subscriptionTier || "free";
    const tierConfig = getTierById(currentTier);

    res.json({
      success: true,
      subscription: {
        tier: currentTier,
        status: userData.subscriptionStatus || "inactive",
        expiry: userData.subscriptionExpiry || null,
        features: tierConfig.limits,
        stripeCustomerId: userData.stripeCustomerId || null,
        stripeSubscriptionId: userData.stripeSubscriptionId || null,
      },
    });
  } catch (error) {
    console.error("❌ Get Subscription Status Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Update Subscription (Upgrade/Downgrade)
 * POST /api/subscription/update
 * Update existing subscription to new tier
 */
app.post("/api/subscription/update", honeypotCheck, verifyUser, async (req, res) => {
  try {
    const {uid} = req.user;
    const {newPriceId, newTierId} = req.body;

    if (!newPriceId || !newTierId) {
      return res.status(400).json({
        success: false,
        error: "Missing newPriceId or newTierId",
      });
    }

    // Get user's current subscription
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData || !userData.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        error: "No active subscription found",
      });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const stripe = require("stripe")(stripeKey);

    // Update subscription in Stripe
    const subscription = await stripe.subscriptions.retrieve(
        userData.stripeSubscriptionId,
    );

    await stripe.subscriptions.update(userData.stripeSubscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: "create_prorations",
    });

    // Update Firestore
    await db.collection("users").doc(uid).update({
      subscriptionTier: newTierId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`🔄 Subscription updated: ${userData.subscriptionTier} → ${newTierId}`);

    res.json({
      success: true,
      message: "Subscription updated successfully",
    });
  } catch (error) {
    console.error("❌ Update Subscription Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
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
// ============================================
// EXPORTS - Single App Function (Simplified Deployment)
// ============================================
// All routes are accessible via: /app/api/...
// Example: https://...cloudfunctions.net/app/api/create-checkout
//

// ✅ MAIN EXPORT - Keep this one
exports.app = onRequest(app);

// ❌ INDIVIDUAL EXPORTS - Commented out to avoid deployment conflicts
// These cause "Secret environment variable overlaps" errors
// All routes are still accessible via the app function above

/*
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

exports.geminiAgent = onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }
  const mockReq = {...req, url: "/api/geminiAgent", path: "/api/geminiAgent"};
  return app(mockReq, res);
});

exports.verifyRecaptcha = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
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

exports.createCheckout = onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }
  const mockReq = {...req, url: "/api/create-checkout", path: "/api/create-checkout"};
  return app(mockReq, res);
});

exports.stripeWebhook = onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }
  const mockReq = {...req, url: "/api/webhook/stripe", path: "/api/webhook/stripe"};
  return app(mockReq, res);
});

exports.getSubscription = onRequest((req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({error: "Method not allowed"});
  }
  const mockReq = {...req, url: "/api/subscription", path: "/api/subscription"};
  return app(mockReq, res);
});

exports.cancelSubscription = onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }
  const mockReq = {...req, url: "/api/cancel-subscription", path: "/api/cancel-subscription"};
  return app(mockReq, res);
});

exports.createPortalSession = onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }
  const mockReq = {...req, url: "/api/create-portal-session", path: "/api/create-portal-session"};
  return app(mockReq, res);
});
*/
