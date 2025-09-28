"use client";

import { useState } from "react";
import { getRecaptchaToken } from "@/lib/recaptcha";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus("Please enter your email");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      // 1. Get reCAPTCHA token
      const token = await getRecaptchaToken("signup");
      if (!token) {
        throw new Error("Failed to verify reCAPTCHA");
      }

      // 2. Send token + email directly to Firebase Cloud Function
      const res = await fetch(
        "https://us-central1-tradehustleresumebuilder.cloudfunctions.net/verifyRecaptcha",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Verification failed");
      }

      setStatus("✅ Success! Check your email for the resume kit.");
      setEmail(""); // Clear form
    } catch (error: any) {
      console.error("Signup error:", error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Get Your Free Resume Kit
      </h2>
      
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sending...
            </>
          ) : (
            "Get Resume Kit"
          )}
        </button>
      </form>

      {status && (
        <div className={`mt-4 p-3 rounded-lg ${
          status.includes("✅") 
            ? "bg-green-50 text-green-800" 
            : "bg-red-50 text-red-800"
        }`}>
          <p className="text-sm">{status}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy" className="underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/terms" className="underline">
          Terms of Service
        </a>{" "}
        apply.
      </p>
    </div>
  );
}