"use client";

import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "@/firebase";

export default function UnlockWithRecaptcha() {
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const auth = getAuth(app);

  async function handleGoogleSignIn() {
    try {
      // 1. Run reCAPTCHA v3
      const recaptchaToken = await grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_KEY!,
        { action: "unlock" }
      );
      setToken(recaptchaToken);
      console.log("✅ reCAPTCHA v3 token:", recaptchaToken);

      // 2. Google Sign-in
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      console.log("✅ User signed in:", user.email);

      // 3. Send { email, recaptchaToken } to backend
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          token: recaptchaToken,
        }),
      });

      if (!res.ok) throw new Error("API unlock failed");
      console.log("📩 Resume Kit email sent!");

    } catch (err: any) {
      console.error("❌ Unlock flow failed:", err.message);
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-electric-blue to-purple-600 text-white">
      <img src="/resume-logo.png" alt="Trade Hustle Logo" className="h-28 mb-6" />

      <h1 className="text-3xl font-extrabold">Unlock the Hustle</h1>
      <p className="mt-2 max-w-md text-center text-yellow-400">
        Trade Hustle Resume Builder is the #1 choice for optimized, recruiter-ready resumes.
      </p>

      <button
        onClick={handleGoogleSignIn}
        className="mt-6 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 font-bold"
      >
        Sign in with Google
      </button>

      {error && <p className="mt-4 text-red-400">Error: {error}</p>}
      {token && <p className="mt-2 text-green-400 text-xs">reCAPTCHA Verified</p>}
    </div>
  );
}
