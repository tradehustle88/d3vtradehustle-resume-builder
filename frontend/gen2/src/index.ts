import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import fetch from "node-fetch";
import { VertexAI } from "@google-cloud/vertexai";

// Global defaults: region + service account
setGlobalOptions({
  region: "us-central1",
  serviceAccount: "tradehustle-backend@tradehustleresumebuilder.iam.gserviceaccount.com"
});

// Health check
export const healthCheck = onRequest((req, res) => {
  res.json({status: "ok", message: "Gen 2 Functions are live 🚀"});
});

// reCAPTCHA verification
export const verifyRecaptcha = onRequest(async (req, res) => {
  try {
    const token = req.body.token;
    const secret = process.env.RECAPTCHA_SECRET;

    if (!token || !secret) {
      res.status(400).json({error: "Missing token or secret"});
      return;
    }

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      { method: "POST" }
    );

    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
});

// Resume editing with Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT,
  location: "us-central1",
});
const model = vertexAI.getGenerativeModel({model: "gemini-1.5-flash"});

export const editResume = onRequest(async (req, res) => {
  try {
    const action = req.body.action || "edit";
    const text = req.body.text || "Improve my resume.";

    const result = await model.generateContent({
      contents: [{role: "user", parts: [{text: `${action}: ${text}`}] }],
    });

    const output =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({status: "success", action, output});
  } catch (err: any) {
    console.error(err);
    res.status(500).json({status: "error", message: err.message});
  }
});
