'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from 'next/navigation';
import { localUnlockResume } from "@/lib/api";
import { trackResumeUnlock, trackResumeDownload } from "@/lib/analytics";
import Link from 'next/link';

export default function UnlockPage() {
  const [unlockStatus, setUnlockStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [unlockMessage, setUnlockMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const { user, loading, getIdToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Auto-unlock if user is already authenticated
    if (user && unlockStatus === "idle") {
      handleUnlockResume();
    }
  }, [user, unlockStatus]);

  const handleUnlockResume = async () => {
    if (!user) {
      setUnlockStatus("error");
      setUnlockMessage("Please sign in to unlock your resume");
      return;
    }

    try {
      setUnlockStatus("loading");

      // Get Firebase Auth token
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error("Authentication token not available");
      }

      const response = await localUnlockResume(idToken, { company: honeypot });
      if (response.success) {
        setUnlockStatus("success");
        setUnlockMessage("🔓 Resume unlock successful! Your download is ready.");
        trackResumeUnlock();

        // Auto-download the resume kit
        const link = document.createElement('a');
        link.href = '/resume-kit.pdf';
        link.download = 'TradeHustle-Resume-Kit.pdf';
        link.click();
        trackResumeDownload();
      } else {
        throw new Error(response.message || "Unlock failed");
      }
    } catch (error) {
      setUnlockStatus("error");
      setUnlockMessage(
        `⚠️ Failed to unlock resume: ${error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="hero-title text-6xl font-black bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg mb-8">
            UNLOCK YOUR HUSTLE
          </div>

          <div className="brick-block p-8 max-w-md mx-auto">
            {!user && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-yellow-300 mb-4">
                  🔒 Resume Access Required
                </h2>
                <p className="text-gray-300 mb-6">
                  Sign in to unlock your Trade Hustle resume templates and career tools.
                </p>
                <Link
                  href="/auth"
                  className="btn-hustle w-full inline-block text-center"
                >
                  Sign In to Unlock Resume
                </Link>
              </div>
            )}

            {user && unlockStatus === "idle" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-yellow-300 mb-4">
                  Welcome back, {user.displayName || user.email}!
                </h2>
                <p className="text-gray-300 mb-4">
                  Ready to unlock your complete resume package?
                </p>

                {/* Honeypot field - hidden from humans, visible to bots */}
                <input
                  type="text"
                  name="company"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <button
                  onClick={handleUnlockResume}
                  className="btn-hustle w-full"
                  disabled={unlockStatus === "loading"}
                >
                  🚀 Unlock My Resume Kit
                </button>
              </div>
            )}

            {unlockStatus === "loading" && (
              <div className="space-y-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                <h2 className="text-xl font-bold text-yellow-300">
                  Unlocking Your Resume Kit...
                </h2>
                <p className="text-gray-300">
                  Preparing your download package
                </p>
              </div>
            )}

            {unlockStatus === "success" && (
              <div className="space-y-6">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-400 mb-2">
                  Resume Kit Unlocked!
                </h2>
                <p className="text-gray-300 mb-4">
                  Your download should start automatically. If it doesn't,{' '}
                  <a
                    href="/resume-kit.pdf"
                    className="text-yellow-400 hover:text-yellow-300 underline"
                    onClick={() => trackResumeDownload()}
                  >
                    click here
                  </a>
                  .
                </p>
                <div className="text-sm text-green-400">
                  📧 Confirmation sent to {user?.email}
                </div>
                <Link
                  href="/dashboard"
                  className="btn-hustle w-full inline-block text-center"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}

            {unlockStatus === "error" && (
              <div className="space-y-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-red-400 mb-2">
                  Unlock Failed
                </h2>
                <p className="text-gray-300 mb-4">
                  {unlockMessage}
                </p>
                <button
                  onClick={() => setUnlockStatus("idle")}
                  className="btn-hustle w-full"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* What's Included Section */}
          <div className="brick-block p-6 mt-8">
            <h3 className="text-2xl font-bold text-yellow-300 mb-6">
              📦 What's Included in Your Resume Kit
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-2xl">📄</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Resume Templates</h4>
                  <p className="text-gray-300 text-sm">
                    ATS-optimized templates for various trade positions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-2xl">💼</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Sample Resumes</h4>
                  <p className="text-gray-300 text-sm">
                    Real examples from successful trade professionals
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-2xl">📝</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Cover Letter Templates</h4>
                  <p className="text-gray-300 text-sm">
                    Professional cover letter formats and examples
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-2xl">📚</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Editing Guide</h4>
                  <p className="text-gray-300 text-sm">
                    Step-by-step instructions for customization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
