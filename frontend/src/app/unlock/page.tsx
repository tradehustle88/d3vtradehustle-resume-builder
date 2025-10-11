'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from 'next/navigation';
import { localUnlockResume } from "@/lib/api";
import { trackResumeUnlock, trackResumeDownload } from "@/lib/analytics";
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import StatusMessage from '@/components/StatusMessage';
import FeatureCard from '@/components/FeatureCard';
import ErrorBoundary from '@/components/ErrorBoundary';

type UnlockStatus = "idle" | "loading" | "success" | "error";

function UnlockPageContent() {
  const [unlockStatus, setUnlockStatus] = useState<UnlockStatus>("idle");
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
        `⚠️ Failed to unlock resume: ${error instanceof Error ? error.message : "Unknown error"}`
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
    <section className="relative min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-b from-black via-[#0A1B3A] to-black overflow-hidden pt-24">

      {/* --- TITLE ABOVE CARD --- */}
      <div className="text-center mb-8">
        <h1 className="text-7xl md:text-8xl font-extrabold tracking-widest rotating-glow font-heading">
          TRADE HUSTLE
        </h1>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold rotating-glow font-heading">
          RESUME BUILDER
        </h2>
      </div>

      {/* --- BRICK CARD --- */}
      <div className="relative z-10 w-[85%] max-w-5xl rounded-2xl overflow-hidden border border-neutral-800 shadow-[0_0_60px_rgba(22,115,255,0.25)]">
        
        {/* Brick background */}
        <div className="absolute inset-0 bg-[url('/assets/brickwall-background.webp')] bg-cover bg-center opacity-90" />

        {/* Blue-dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0A1B3A]/70 to-black/80 mix-blend-overlay" />

        {/* Paint splatter accent */}
        <Image
          src="/fx/paint_splatters_2.png"
          alt="paint splash"
          width={224}
          height={224}
          className="absolute right-6 top-24 w-56 opacity-65 mix-blend-lighten pointer-events-none"
          loading="lazy"
        />
        <Image
          src="/fx/paint_splatters_1.png"
          alt="paint splash"
          width={192}
          height={192}
          className="absolute left-6 bottom-16 w-48 opacity-55 mix-blend-lighten pointer-events-none"
          loading="lazy"
        />

        {/* --- CONTENT: Two-Card Grid --- */}
        <div className="relative z-20 p-8 md:p-12">
          {/* Logo Above Cards */}
          <Image
            src="/resumeBuilderlogo.png"
            alt="Trade Hustle Logo"
            width={224}
            height={224}
            className="mx-auto w-48 md:w-56 mb-12 opacity-95"
            priority
          />

          {/* Two-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Card 1: Unlock the Hustle (Silver Outline) */}
            <div className="relative bg-black/70 border-2 border-gray-300 rounded-xl p-8 text-center shadow-[0_0_25px_rgba(192,192,192,0.3)] hover:shadow-[0_0_40px_rgba(192,192,192,0.6)] transition-all duration-300">
              <div className="text-6xl mb-4">📄</div>
              <h2 className="text-white text-2xl font-extrabold mb-3 font-heading">Unlock the Hustle</h2>
              <p className="text-gray-300 text-sm leading-relaxed font-body">
                Download your <span className="text-yellow-400 font-semibold">Free Trade Hustle PDF</span> packed with trade insights, salary breakdowns, and starter career tools.
              </p>
            </div>

            {/* Card 2: Craft Your Hustle (Gold Outline + Button) */}
            <div className="relative bg-black/70 border-2 border-yellow-500 rounded-xl p-8 text-center shadow-[0_0_25px_rgba(212,160,23,0.3)] hover:shadow-[0_0_40px_rgba(212,160,23,0.6)] transition-all duration-300">
              <div className="text-6xl mb-4">🔨</div>
              <h2 className="text-yellow-400 text-2xl font-extrabold mb-3 font-heading">Craft Your Hustle</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 font-body">
                Access the <span className="text-blue-400 font-semibold">Enhanced Intelligence Resume Builder</span> to design, edit, and upgrade your trade resume in real time.
              </p>
              <Link 
                href="/resume-builder"
                className="inline-block mt-2 px-6 py-3 bg-red-700 text-white font-semibold rounded-full shadow-md hover:bg-red-800 transition-all duration-300"
              >
                🚀 SIGN IN TO UNLOCK RESUME
              </Link>
            </div>

          </div>
        </div>

        {/* Auth/Unlock Flow Below Cards */}
        <div className="relative z-20 px-8 md:px-12 pb-12">
          <div className="brick-block p-6 sm:p-8 max-w-md mx-auto mt-8">
            {!user && (
              <StatusMessage
                type="info"
                icon="🔒"
                title="Resume Access Required"
                message="Sign in to unlock your Trade Hustle resume templates and career tools."
                action={
                  <Link href="/auth" className="block">
                    <Button fullWidth leftIcon="🚀">
                      Sign In to Unlock Resume
                    </Button>
                  </Link>
                }
              />
            )}

            {user && unlockStatus === "idle" && (
              <StatusMessage
                type="info"
                title={`Welcome back, ${user.displayName || user.email}!`}
                message="Ready to unlock your complete resume package?"
                action={
                  <>
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
                    <Button
                      onClick={handleUnlockResume}
                      fullWidth
                      leftIcon="🚀"
                      disabled={unlockStatus !== "idle"}
                    >
                      Unlock My Resume Kit
                    </Button>
                  </>
                }
              />
            )}

            {unlockStatus === "loading" && (
              <StatusMessage
                type="loading"
                title="Unlocking Your Resume Kit..."
                message="Preparing your download package"
              />
            )}

            {unlockStatus === "success" && (
              <StatusMessage
                type="success"
                title="Resume Kit Unlocked!"
                message={
                  <>
                    <p className="mb-4">
                      Your download should start automatically. If it doesn't,{' '}
                      <a
                        href="/resume-kit.pdf"
                        className="text-yellow-400 hover:text-yellow-300 underline focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        onClick={() => trackResumeDownload()}
                      >
                        click here
                      </a>
                      .
                    </p>
                    <div className="text-sm text-green-400">
                      📧 Confirmation sent to {user?.email}
                    </div>
                  </>
                }
                action={
                  <Link href="/dashboard">
                    <Button fullWidth variant="secondary">
                      Go to Dashboard
                    </Button>
                  </Link>
                }
              />
            )}

            {unlockStatus === "error" && (
              <StatusMessage
                type="error"
                title="Unlock Failed"
                message={unlockMessage}
                action={
                  <Button
                    onClick={() => setUnlockStatus("idle")}
                    fullWidth
                    variant="danger"
                  >
                    Try Again
                  </Button>
                }
              />
            )}
          </div>

          {/* What's Included Section */}
          <div className="brick-block p-6 sm:p-8 mt-8">
            <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-6 text-center">
              📦 What's Included in Your Resume Kit
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left list-none" role="list">
              <FeatureCard
                icon="📄"
                iconLabel="Document icon"
                iconColor="text-yellow-400"
                title="Resume Templates"
                description="ATS-optimized templates for various trade positions"
              />
              <FeatureCard
                icon="💼"
                iconLabel="Briefcase icon"
                iconColor="text-blue-400"
                title="Sample Resumes"
                description="Real examples from successful trade professionals"
              />
              <FeatureCard
                icon="📝"
                iconLabel="Pen and paper icon"
                iconColor="text-green-400"
                title="Cover Letter Templates"
                description="Professional cover letter formats and examples"
              />
              <FeatureCard
                icon="📚"
                iconLabel="Books icon"
                iconColor="text-purple-400"
                title="Editing Guide"
                description="Step-by-step instructions for customization"
              />
            </ul>
          </div>
        </div>
      </div>

      <div className="h-[120px]" />
    </section>
  );
}

// Wrap with ErrorBoundary for resilience
export default function UnlockPage() {
  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content">
        <UnlockPageContent />
      </main>
    </ErrorBoundary>
  );
}
