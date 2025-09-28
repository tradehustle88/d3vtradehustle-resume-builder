import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
import {VertexAI} from "@google-cloud/vertexai";

// Ensure functions run in your region with the right account
setGlobalOptions({
  region: "us-central1",
  serviceAccount: "tradehustle-backend@tradehustleresumebuilder.iam.gserviceaccount.com",
});

// Simple health check
export const healthCheck = onRequest((req, res) => {
  res.json({status: "ok", message: "Gen 2 Functions are live 🚀"});
});

// Vertex AI setup
const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT,
  location: "us-central1",
});
const model = vertexAI.getGenerativeModel({model: "gemini-1.5-flash"});

// Resume editing function
export const editResume = onRequest(async (req, res) => {
  try {
    const action = req.body.action || "edit";
    const text = req.body.text || "Improve my resume.";

    const result = await model.generateContent({
      contents: [{role: "user", parts: [{text: `${action}: ${text}`}]}],
    });

    const output =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({status: "success", action, output});
  } catch (err: any) {
    console.error(err);
    res.status(500).json({status: "error", message: err.message});
  }
});
