import { NextResponse } from "next/server";
import { PredictionServiceClient } from "@google-cloud/aiplatform";

// ✅ Tell Node.js where to find your service account
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "./keys/serviceAccount.json";

// ✅ Project + location setup
const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tradehustleresumebuilder";
const location = "us-central1"; // match your Vertex AI region

export async function GET() {
  try {
    const client = new PredictionServiceClient({
      projectId: project,
    });

    // Ping Vertex AI model (Gemini flash as test)
    const [response] = await client.predict({
      endpoint: `projects/${project}/locations/${location}/publishers/google/models/gemini-1.5-flash`,
      instances: [
        {
          content: { role: "user", parts: [{ text: "Say 'Hustle Strong' back to me." }] },
        },
      ],
    });

    return NextResponse.json({ success: true, response });
  } catch (err: any) {
    console.error("Vertex AI Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}