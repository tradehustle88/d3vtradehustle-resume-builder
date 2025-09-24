"use client";

import Image from "next/image";
import Footer from "@/components/Footer";

export default function UnlockPage() {
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
          Sign up to Unlock Your Resume Kit
        </h2>
        <p className="text-gray-300 mb-6">
          Why TradeHustle Resume Builder is the #1 choice for resume optimization:
          fast, trade-focused, and built with hustle. Check out our resource page for more.
        </p>

        {/* Example form */}
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded bg-gray-900 text-white border border-gray-600"
          />
          <button type="submit" className="btn-hustle">
            Sign Up
          </button>
        </form>
      </section>

      {/* Footer */}
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </main>
  );
}
