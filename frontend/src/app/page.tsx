"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import HeroBrickWall from "@/components/HeroBrickWall";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center text-center overflow-hidden px-6" style={{
      backgroundImage: "url('/assets/brickwall-background.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      {/* Paint splatter effects */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-16 left-8 w-32 h-32 opacity-20 animate-pulse">
          <Image
            src="/fx/paint-red.svg"
            alt=""
            fill
            className="object-contain rotate-12"
          />
        </div>
        <div className="absolute bottom-20 right-12 w-40 h-40 opacity-25">
          <Image
            src="/fx/paint-yellow.svg"
            alt=""
            fill
            className="object-contain -rotate-45"
          />
        </div>
        <div className="absolute top-1/3 right-16 w-28 h-28 opacity-30">
          <Image
            src="/fx/paint-blue.svg"
            alt=""
            fill
            className="object-contain rotate-90"
          />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col items-center">
      
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
      </div>
    </main>
  );
}
