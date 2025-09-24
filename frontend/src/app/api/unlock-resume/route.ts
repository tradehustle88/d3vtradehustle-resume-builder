
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

// Handle POST for unlocking
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await db.collection("unlocks").add(body);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unlock error:", err);
    return NextResponse.json({ error: "Failed to unlock" }, { status: 500 });
  }
}

// 👇 Add this for browser GET requests
export async function GET() {
  return NextResponse.json({ status: "ok", message: "Unlock API is live 🚀" });
}