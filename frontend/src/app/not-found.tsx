"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PaintSplatter from "@/components/PaintSplatter";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#003366] to-[#001a33] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Paint Splatter Background Effects */}
      <PaintSplatter 
        type="multicolor" 
        size="xl" 
        animation="float" 
        style={{ top: "10%", right: "10%", opacity: 0.3 }}
      />
      <PaintSplatter 
        type="spray-1" 
        size="lg" 
        animation="pulse" 
        style={{ bottom: "15%", left: "10%", opacity: 0.4 }}
      />
      <PaintSplatter 
        type="blue" 
        size="md" 
        animation="fade-in" 
        style={{ top: "40%", left: "20%", opacity: 0.2 }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Error Code */}
        <div className="relative mb-8">
          <h1 
            className="text-[200px] md:text-[300px] font-bold text-[#ffd700] leading-none"
            style={{ 
              fontFamily: "Anton, sans-serif",
              textShadow: "0 0 40px rgba(255,215,0,0.3), 0 4px 8px rgba(0,0,0,0.5)"
            }}
          >
            404
          </h1>
          {/* Brick texture overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "url('/assets/brick-wall.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              mixBlendMode: "multiply"
            }}
          />
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            PAGE NOT FOUND
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-4">
            Looks like this page clocked out early. 🔨
          </p>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Maybe it's on a coffee break or got relocated to a different job site.
          </p>
        </div>

        {/* Auto-redirect countdown */}
        <div className="mb-8 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg inline-block">
          <p className="text-white/80">
            Redirecting to homepage in{" "}
            <span className="text-[#ffd700] font-bold text-2xl">{countdown}</span>{" "}
            seconds...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/"
            className="group relative px-8 py-4 bg-[#ffd700] text-[#001a33] font-bold text-lg rounded-lg
                     hover:bg-[#ffed4e] transition-all duration-300 
                     shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]
                     transform hover:scale-105"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            <span className="relative z-10">🏠 GO HOME</span>
          </Link>

          <Link
            href="/dashboard"
            className="group relative px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-lg
                     hover:bg-white/20 transition-all duration-300 border-2 border-white/20
                     hover:border-[#ffd700] transform hover:scale-105"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            <span className="relative z-10">📊 DASHBOARD</span>
          </Link>

          <Link
            href="/pricing"
            className="group relative px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-lg
                     hover:bg-white/20 transition-all duration-300 border-2 border-white/20
                     hover:border-[#ffd700] transform hover:scale-105"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            <span className="relative z-10">💳 PRICING</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/unlock" className="text-[#ffd700] hover:text-white transition-colors underline">
              Unlock Resume
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/dashboard/resumes" className="text-[#ffd700] hover:text-white transition-colors underline">
              My Resumes
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/dashboard/jobs" className="text-[#ffd700] hover:text-white transition-colors underline">
              Job Tracker
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/dashboard/certifications" className="text-[#ffd700] hover:text-white transition-colors underline">
              Cert Vault
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/dashboard/blueprints" className="text-[#ffd700] hover:text-white transition-colors underline">
              Career Blueprints
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/dashboard/referrals" className="text-[#ffd700] hover:text-white transition-colors underline">
              Refer & Earn
            </Link>
          </div>
        </div>

        {/* Fun Error Messages */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <p className="text-white/80 text-lg italic">
            "Even the best contractors hit a dead end sometimes. 
            But we always find our way back to the job site!" 🚧
          </p>
        </div>
      </div>
    </div>
  );
}
