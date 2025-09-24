"use client";

import Image from "next/image";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-hero relative min-h-screen flex flex-col items-center text-center overflow-hidden px-6">
      {/* Title */}
      <h1 className="hero-title mt-12" data-text="WELCOME TO THE GRIND">
        WELCOME TO THE GRIND
      </h1>

      {/* Logo */}
      <div className="mt-6 relative z-10">
        <Image
          src="/resume-logo.png"
          alt="Trade Hustle Logo"
          width={340}
          height={340}
          priority
          className="hero-logo"
        />
      </div>

      {/* Subtitle with Brick Plate */}
      <section className="brick-block max-w-3xl w-full mt-8 p-8 relative z-10 rounded-lg">
        <h2 className="hero-subtitle">
          BUILT FOR THE TRADE. BACKED BY HUSTLE. POWERED BY ENHANCED INTELLIGENCE.
        </h2>

        {/* Unlock Button */}
        <div className="mt-8">
          <a href="/unlock" className="btn-hustle">
            Unlock the Hustle
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
