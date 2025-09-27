'use client';

import { useState, useCallback } from "react";
import { User } from "firebase/auth";
import AuthComponent from "@/components/AuthComponent";
import { getIdToken } from "@/firebase";
import { localUnlockResume, localVerifyRecaptcha } from "@/lib/api";

export default function UnlockPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUserAuthenticated = useCallback((authenticatedUser: User) => {
    setUser(authenticatedUser);
  }, []);

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
          .execute(siteKey, { action: "unlock_resume" })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const handleUnlockResume = async () => {
    if (!user) {
      setError("Please sign in first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha();

      // 2. Verify reCAPTCHA first (optional step for extra validation)
      const recaptchaResult = await localVerifyRecaptcha(recaptchaToken);
      if (!recaptchaResult.success) {
        throw new Error("reCAPTCHA verification failed");
      }

      // 3. Get Firebase ID token
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error("Failed to get authentication token");
      }

      // 4. Call unlock resume API using our centralized client
      const data = await localUnlockResume(user.email!, recaptchaToken);

      if (data.success) {
        setSuccess(true);
        // Download PDF
        setTimeout(() => {
          window.location.href = "/resume-kit.pdf";
        }, 1500);
      } else {
        setError("Failed to unlock resume");
      }
    } catch (err: any) {
      console.error("Unlock error:", err);
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔓 Unlock the Trade Hustle Resume Kit
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Get instant access to professional resume templates, samples, and
            guides designed specifically for skilled trades professionals.
          </p>
        </div>

        {/* Authentication Component */}
        <AuthComponent onUserAuthenticated={handleUserAuthenticated} />

        {/* Unlock Button */}
        {user && !success && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Ready to Unlock Your Resume Kit?
              </h3>
              <p className="text-gray-600 mb-6">
                Click below to verify you're human and download your complete
                resume package.
              </p>

              <button
                onClick={handleUnlockResume}
                disabled={loading}
                className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Verifying & Unlocking...
                  </>
                ) : (
                  <>🚀 Unlock Resume Kit Now</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Resume Kit Unlocked!
              </h3>
              <p className="text-green-700 mb-4">
                Your download should start automatically. If it doesn't,
                <a href="/resume-kit.pdf" className="underline ml-1">
                  click here
                </a>
                .
              </p>
              <div className="text-sm text-green-600">
                📧 Confirmation sent to {user?.email}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 text-xl mr-3">⚠️</div>
              <div>
                <h4 className="text-red-800 font-medium">Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* What's Included */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📦 What's Included in Your Resume Kit
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-orange-600 text-xl">📄</span>
              <div>
                <h4 className="font-medium text-gray-900">Resume Templates</h4>
                <p className="text-gray-600 text-sm">
                  ATS-optimized templates for various trade positions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-xl">💼</span>
              <div>
                <h4 className="font-medium text-gray-900">Sample Resumes</h4>
                <p className="text-gray-600 text-sm">
                  Real examples from successful trade professionals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">📝</span>
              <div>
                <h4 className="font-medium text-gray-900">
                  Cover Letter Templates
                </h4>
                <p className="text-gray-600 text-sm">
                  Professional cover letter formats and examples
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 text-xl">📚</span>
              <div>
                <h4 className="font-medium text-gray-900">Editing Guide</h4>
                <p className="text-gray-600 text-sm">
                  Step-by-step instructions for customization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
