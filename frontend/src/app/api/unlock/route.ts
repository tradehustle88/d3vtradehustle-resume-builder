import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    // Verify reCAPTCHA with Google
    const secret = process.env.RECAPTCHA_SECRET_KEY!;
    const verify = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      { method: "POST" }
    );
    const data = await verify.json();

    if (!data.success) {
      return NextResponse.json({ error: "reCAPTCHA failed" }, { status: 400 });
    }

    // TODO: Save email to Firestore / ActiveCampaign
    // TODO: Send email with resume kit attached

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}