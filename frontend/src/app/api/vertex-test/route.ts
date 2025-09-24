import { NextResponse } from "next/server";
import { PredictionServiceClient } from "@google-cloud/aiplatform";

const project = process.env.GCP_PROJECT_ID!;
const location = process.env.GCP_LOCATION || "us-central1";

export async function GET() {
  try {
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