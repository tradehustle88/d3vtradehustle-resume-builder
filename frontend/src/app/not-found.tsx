"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Error Code */}
        <div className="relative mb-8">
          <h1 
            className="text-[200px] md:text-[300px] font-bold text-[#E50914] leading-none"
            style={{ 
              fontFamily: "Anton, sans-serif",
              textShadow: "0 4px 8px rgba(0,0,0,0.2)"
            }}
          >
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            PAGE NOT FOUND
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            Looks like this page clocked out early. 🔨
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Maybe it's on a coffee break or got relocated to a different job site.
          </p>
        </div>

        {/* Auto-redirect countdown */}
        <div className="mb-8 p-4 bg-white border-2 border-gray-200 rounded-lg inline-block shadow-lg">
          <p className="text-gray-700">
            Redirecting to homepage in{" "}
            <span className="text-[#E50914] font-bold text-2xl">{countdown}</span>{" "}
            seconds...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/"
            className="group relative px-8 py-4 bg-[#E50914] text-white font-bold text-lg rounded-lg
                     hover:bg-[#FF1B2D] transition-all duration-300 
                     shadow-lg hover:shadow-xl
                     transform hover:scale-105"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            <span className="relative z-10">🏠 GO HOME</span>
          </Link>

          <Link
            href="/dashboard"
            className="group relative px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-lg
                     hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300
                     hover:border-[#E50914] transform hover:scale-105"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            <span className="relative z-10">📊 DASHBOARD</span>
          </Link>

          <Link
            href="/pricing"
            className="group relative px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-lg
                     hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300
                     hover:border-[#E50914] transform hover:scale-105"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            <span className="relative z-10">💳 PRICING</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/unlock" className="text-[#E50914] hover:text-[#FF1B2D] transition-colors underline">
              Unlock Resume
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/dashboard/resumes" className="text-[#E50914] hover:text-[#FF1B2D] transition-colors underline">
              My Resumes
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/dashboard/jobs" className="text-[#E50914] hover:text-[#FF1B2D] transition-colors underline">
              Job Tracker
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/dashboard/certifications" className="text-[#E50914] hover:text-[#FF1B2D] transition-colors underline">
              Cert Vault
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/dashboard/blueprints" className="text-[#E50914] hover:text-[#FF1B2D] transition-colors underline">
              Career Blueprints
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/dashboard/referrals" className="text-[#E50914] hover:text-[#FF1B2D] transition-colors underline">
              Refer & Earn
            </Link>
          </div>
        </div>

        {/* Fun Error Messages */}
        <div className="mt-12 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-lg">
          <p className="text-gray-700 text-lg italic">
            "Even the best contractors hit a dead end sometimes. 
            But we always find our way back to the job site!" 🚧
          </p>
        </div>
      </div>
    </div>
  );
}
