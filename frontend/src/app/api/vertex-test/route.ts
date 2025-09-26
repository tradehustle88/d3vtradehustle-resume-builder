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
  // Guard: Only allow real Vertex calls in production; skip in dev/build
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({
      success: true,
      message: "Vertex test skipped in dev/build."
    }, { status: 200 });
  }
  try {
    // Only make real API calls in preview/prod with proper credentials
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json({
        success: false,
        error: "Missing FIREBASE_SERVICE_ACCOUNT_KEY."
      }, { status: 500 });
    }

    const client = new PredictionServiceClient();
    // Use the correct model path for Google's hosted Gemini models
    const modelPath = `projects/google/locations/us-central1/publishers/google/models/gemini-1.5-flash`;
    const request = {
      endpoint: modelPath,
      instances: [
        {
          content: "Hello from Vertex AI + Next.js API route!"
        }
      ],
      parameters: {
        temperature: 0.7,
        maxOutputTokens: 256,
        topP: 0.8,
        topK: 40
      }
    };
    const response = await client.predict(request);
    console.log("Vertex raw response:", response);
    return NextResponse.json({
      success: true,
      modelPath,
      predictions: response[0]?.predictions ?? null,
      rawResponse: response[0]
    });
  } catch (error: any) {
    console.error("Vertex API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.details || "No additional details",
        code: error.code || "UNKNOWN"
      },
      { status: 500 }
    );
  }
}