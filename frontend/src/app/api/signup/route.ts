import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET_KEY!;
    const verify = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      { method: "POST" }
    );
    const data = await verify.json();

    if (!data.success || data.score < 0.5) {
      return NextResponse.json({ error: "reCAPTCHA failed" }, { status: 400 });
    }

    // Save signup to Firestore
    await db.collection("signups").add({
      email,
      createdAt: new Date(),
      recaptchaScore: data.score,
    });

    // --- Gmail API Setup with Nodemailer ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail
        pass: process.env.GMAIL_PASS, // app password (not your main Gmail pw)
      },
    });

    // Attach your PDF
    const pdfPath = path.join(process.cwd(), "public", "resume-kit.pdf");

    await transporter.sendMail({
      from: `"Trade Hustle" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Free Resume Kit",
      text: "Thanks for signing up! Attached is your free resume kit.",
      attachments: [
        {
          filename: "resume-kit.pdf",
          path: pdfPath,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Signup API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

