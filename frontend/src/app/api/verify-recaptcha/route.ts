import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    // Secret key from Google (keep this private)
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    // Call Google verify API
    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ success: false, errors: data["error-codes"] }, { status: 400 });
    }

    // Add extra safety (optional: check score and action)
    if (data.score < 0.5) {
      return NextResponse.json({ success: false, reason: "Low score" }, { status: 403 });
    }

    return NextResponse.json({ success: true, score: data.score });
  } catch (err: any) {
    console.error("Error verifying reCAPTCHA:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}