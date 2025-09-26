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
    // Always return mocked response during build or if no proper credentials
    if (!process.env.GCP_PROJECT_ID || !process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.NODE_ENV !== "development") {
      return NextResponse.json({
        success: true,
        mocked: true,
        reason: "No GCP credentials or not in development mode",
        predictions: ["⚡ Mocked Vertex response: Hello Hustler!"],
      });
    }

    // Only make real API calls in development with proper credentials
    const client = new PredictionServiceClient();
    
    // Correct model path for Google's hosted Gemini models
    const modelPath = `projects/google/locations/${location}/publishers/google/models/gemini-1.5-flash`;
    
    // Prepare the request in the correct format for Vertex AI Generative models
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

    // If response is wrapped, handle it safely:
    console.log("Vertex raw response:", response);

    return NextResponse.json({
      success: true,
      modelPath,
      predictions: response[0]?.predictions ?? null,
      rawResponse: response[0] // Include for debugging
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