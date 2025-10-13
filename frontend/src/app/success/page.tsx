'use client'
import Link from 'next/link'
import { PaintPreset } from '@/components/PaintSplatter'

export default function SuccessPage() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Celebration Paint Splatters */}
      <PaintPreset preset="successCelebration" />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Success Icon */}
        <div className="text-8xl mb-8">🎉</div>
        
        {/* Success Message */}
        <h1 className="text-5xl font-extrabold text-[#E50914] mb-6">
          PAYMENT SUCCESSFUL!
        </h1>
        
        <h2 className="text-3xl font-bold text-[#ffd700] mb-8">
          Welcome to Trade Hustle Resume Builder
        </h2>
        
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Your payment has been processed successfully. You now have full access to our AI-powered resume builder. 
          Let's get you that dream job!
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
          <Link href="/resume-builder">
            <button className="w-full sm:w-auto bg-gradient-to-r from-[#E50914] to-[#8B0000] hover:from-[#FF1B2D] hover:to-[#A0001B] text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] mb-4 sm:mb-0">
              START BUILDING →
            </button>
          </Link>
          
          <Link href="/">
            <button className="w-full sm:w-auto bg-transparent border-2 border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-black font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300">
              BACK TO HOME
            </button>
          </Link>
        </div>
        
        {/* Additional Info */}
        <div className="mt-16 p-6 bg-gradient-to-b from-[#111] to-[#222] border border-gray-700 rounded-xl">
          <h3 className="text-xl font-bold text-[#ffd700] mb-4">What's Next?</h3>
          <div className="text-left space-y-3 text-gray-300">
            <div className="flex items-start">
              <span className="text-[#E50914] mr-3 mt-1">1.</span>
              <span>Start with our AI assistant to generate professional content</span>
            </div>
            <div className="flex items-start">
              <span className="text-[#E50914] mr-3 mt-1">2.</span>
              <span>Choose from trade-specific templates</span>
            </div>
            <div className="flex items-start">
              <span className="text-[#E50914] mr-3 mt-1">3.</span>
              <span>Download your ATS-optimized PDF resume</span>
            </div>
            <div className="flex items-start">
              <span className="text-[#E50914] mr-3 mt-1">4.</span>
              <span>Land your next trade job with confidence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}