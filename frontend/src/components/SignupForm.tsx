"use client";

import { useState } from "react";
import { localSignup, localVerifyRecaptcha } from "@/lib/api";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const executeRecaptcha = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error("reCAPTCHA not loaded"));
        return;
      }

      window.grecaptcha.ready(() => {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (!siteKey) {
          reject(new Error("reCAPTCHA site key not configured"));
          return;
        }

        window.grecaptcha
          .execute(siteKey, { action: "signup" })
          .then(resolve)
          .catch(reject);
      });
    });
  };

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
      const recaptchaToken = await executeRecaptcha();
      
      // 2. Verify reCAPTCHA (optional extra validation step)
      const recaptchaResult = await localVerifyRecaptcha(recaptchaToken);
      if (!recaptchaResult.success) {
        throw new Error("reCAPTCHA verification failed");
      }

      // 3. Sign up user using our centralized API client
      const result = await localSignup(email, recaptchaToken);

      if (result.success) {
        setStatus("✅ Success! Check your email for the resume kit.");
        setEmail(""); // Clear form
      } else {
        setStatus(result.message || "Signup failed");
      }
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