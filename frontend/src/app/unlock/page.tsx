"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function UnlockPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] =
    useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUnlock = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setStatus("verifying");
    setMessage("Verifying...");

    if (typeof window === "undefined" || !window.grecaptcha) {
      setStatus("error");
      setMessage("reCAPTCHA not loaded.");
      return;
    }

    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_KEY!,
        { action: "unlock" }
      );

      const res = await fetch("/api/unlock-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("✅ Verified! Your download is ready.");
        window.location.href = "/trade-hustle-resume-kit.zip";
      } else {
        setStatus("error");
        setMessage("❌ Verification failed. Try again.");
      }
    } catch (err) {
      console.error("Unlock error:", err);
      setStatus("error");
      setMessage("Server error, try again later.");
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center text-center overflow-hidden px-6 bg-gradient-to-b from-electric-blue to-purple-700">
      {/* Logo in header */}
      <div className="mt-8">
        <Image
          src="/resume-logo.png"
          alt="Trade Hustle Logo"
          width={180}
          height={180}
          priority
        />
      </div>

      {/* Sign-up block */}
      <section className="max-w-xl w-full mt-8 p-8 bg-black/60 backdrop-blur rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Unlock the Hustle
        </h2>
        <p className="text-gray-300 mb-6">
          Enter your email and verify to access the Resume Kit.
        </p>

        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600 mb-4"
        />

        <button
          onClick={handleUnlock}
          disabled={status === "verifying"}
          className={`w-full p-4 font-bold text-white rounded-lg ${
            status === "verifying" ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {status === "verifying" ? "Checking..." : "Unlock the Hustle"}
        </button>

        {message && (
          <p className={`mt-4 ${
            status === "success" ? "text-green-400" :
            status === "error" ? "text-red-400" : "text-gray-300"
          }`}>
            {message}
          </p>
        )}
      </section>

      {/* Footer */}
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </main>
  );
}
