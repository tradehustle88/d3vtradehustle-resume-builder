"use client";

import Image from "next/image";

export default function HeroBrickWall() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Brick Wall Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/brickwall.webp"
          alt="Brick Wall Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Paint Splatter Effects */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Red Paint Splatter */}
        <div className="absolute top-16 left-8 w-32 h-32 opacity-20 animate-pulse">
          <Image
            src="/fx/paint-red.svg"
            alt=""
            fill
            className="object-contain rotate-12"
          />
        </div>
        
        {/* Yellow Paint Splatter */}
        <div className="absolute bottom-20 right-12 w-40 h-40 opacity-25 animate-bounce">
          <Image
            src="/fx/paint-yellow.svg"
            alt=""
            fill
            className="object-contain -rotate-45"
          />
        </div>
        
        {/* Blue Paint Splatter */}
        <div className="absolute top-1/3 right-16 w-28 h-28 opacity-30 animate-spin-slow">
          <Image
            src="/fx/paint-blue.svg"
            alt=""
            fill
            className="object-contain rotate-90"
          />
        </div>
        
        {/* Additional paint effects for more grit */}
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 opacity-15">
          <Image
            src="/fx/paint-red.svg"
            alt=""
            fill
            className="object-contain rotate-180"
          />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
        {/* Your existing content goes here */}
        <h1 className="hero-title mb-8" data-text="WELCOME TO THE GRIND">
          WELCOME TO THE GRIND
        </h1>
        
        <div className="relative">
          <Image
            src="/resume-logo.png"
            alt="Trade Hustle Logo"
            width={340}
            height={340}
            priority
            className="hero-logo"
          />
        </div>
        
        <section className="brick-block-overlay max-w-3xl w-full mt-8 p-8 rounded-lg">
          <h2 className="hero-subtitle">
            BUILT FOR THE TRADE. BACKED BY HUSTLE. POWERED BY ENHANCED INTELLIGENCE.
          </h2>
          
          <div className="mt-8">
            <a href="/unlock" className="btn-hustle">
              Unlock the Hustle
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}