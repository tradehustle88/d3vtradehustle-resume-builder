
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

// Test GET endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", message: "Unlock API is live 🚀" });
}

// Production POST endpoint
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Example: store in Firestore
    await db.collection("unlocks").add({
      email: body.email,
      resume: body.resume,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unlock error:", err);
    return NextResponse.json(
      { error: "Failed to unlock" },
      { status: 500 }
    );
  }
}