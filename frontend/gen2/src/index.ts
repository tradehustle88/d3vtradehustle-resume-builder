/**
 * Trade Hustle Resume Builder - Gen 2 Firebase Functions
 * VertexAI-powered resume editing and optimization
 */

import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { VertexAI } from "@google-cloud/vertexai";
import * as logger from "firebase-functions/logger";
import { Request, Response } from "express";

// Init VertexAI with project + location (uses service account by default in Cloud Functions)
const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT || "tradehustleresumebuilder",
  location: "us-central1",
});

const model = vertexAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Set global options for cost control
setGlobalOptions({ maxInstances: 10, region: "us-central1" });

/**
 * Edit and optimize resume text using Gemini AI
 */
export const editResume = onRequest({
  serviceAccount: "tradehustle-backend@tradehustleresumebuilder.iam.gserviceaccount.com",
  maxInstances: 5,
  timeoutSeconds: 300,
  memory: "1GiB",
  region: "us-central1"
}, async (req: Request, res: Response) => {
    // Allow CORS for frontend access
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    try {
      const { prompt, resumeText, action = "edit" } = req.body;

      if (!prompt && !resumeText) {
        res.status(400).json({ 
          status: "error", 
          message: "Missing prompt or resumeText in request body" 
        });
        return;
      }

      // Build the AI prompt based on action type
      let aiPrompt = "";
      
      switch (action) {
        case "edit":
          aiPrompt = `You are a professional resume editor. Please edit and improve the following resume text:

${resumeText}

Additional instructions: ${prompt || "Make it more professional and impactful"}

Provide only the improved resume text without any additional commentary.`;
          break;
          
        case "optimize":
          aiPrompt = `You are a professional resume optimizer. Please optimize this resume for ATS (Applicant Tracking Systems) and make it more appealing to employers:

${resumeText}

Focus on: ${prompt || "keyword optimization, formatting, and impact statements"}

Provide only the optimized resume text.`;
          break;
          
        case "tailor":
          aiPrompt = `You are a professional resume writer. Please tailor this resume for a specific job or industry:

Resume: ${resumeText}

Job/Industry requirements: ${prompt}

Provide only the tailored resume text that matches the requirements.`;
          break;
          
        default:
          aiPrompt = prompt || "Fix and optimize my resume.";
      }

      logger.info("Processing resume edit request", { 
        action, 
        promptLength: aiPrompt.length,
        hasResumeText: !!resumeText 
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
      });

      const outputText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!outputText) {
        throw new Error("No content generated from AI model");
      }

      logger.info("Resume edit completed successfully", { 
        outputLength: outputText.length 
      });

      res.json({
        status: "success",
        action: action,
        output: outputText,
        timestamp: new Date().toISOString(),
      });

    } catch (err: any) {
      logger.error("Resume edit error:", err);
      res.status(500).json({ 
        status: "error", 
        message: err.message || "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  });

/**
 * Health check endpoint for Gen 2 functions
 */
export const healthCheck = onRequest({ region: "us-central1" }, (req: Request, res: Response) => {
  logger.info("Health check requested");
  
  res.json({
    status: "ok",
    message: "🔥 Trade Hustle Gen 2 Functions Running",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});
