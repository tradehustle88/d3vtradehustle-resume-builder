import { NextResponse } from "next/server";

// Only import client if we're in production (where env vars are set)
let PredictionServiceClient: any;
if (process.env.NODE_ENV === "production") {
  // Dynamically import to avoid build-time errors in dev
  PredictionServiceClient = require("@google-cloud/aiplatform").PredictionServiceClient;
}

const project = process.env.GCP_PROJECT_ID || "demo-project";
const location = process.env.GCP_LOCATION || "us-central1";

export async function GET() {
  try {
    // If no creds, mock the response
    if (!process.env.GCP_PROJECT_ID || !process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json({
        success: true,
        mocked: true,
        predictions: ["⚡ Mocked Vertex response: Hello Hustler!"],
      });
    }

    // Otherwise, real client call
    const client = new PredictionServiceClient();
    const result = await client.predict({
      endpoint: `projects/${project}/locations/${location}/publishers/google/models/gemini-1.5-flash`,
      instances: [{ prompt: "Hello from Vertex AI + Next.js API route!" }],
    });

    return NextResponse.json({
      success: true,
      predictions: result[0]?.predictions ?? null,
    });
  } catch (error: any) {
    console.error("Vertex API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}