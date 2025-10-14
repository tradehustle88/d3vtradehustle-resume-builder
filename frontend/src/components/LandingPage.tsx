1. process.env.STRIPE_SECRET_KEY     (Cloud Run - Best for v2)
   ↓
2. functions.config().stripe.secret_key  (Legacy - Auto fallback)
   ↓
3. null (Graceful degradation)'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Top Section (No Brick Background) */}
      <div className="pt-16 text-center">
        <h1 className="text-6xl font-extrabold text-[#E50914] tracking-wide">TRADE HUSTLE</h1>
        <h2 className="mt-2 text-4xl font-bold text-white">Resume Builder</h2>

        {/* Logo between title and subtitle */}
        <div className="flex justify-center mt-6">
          <Image
            src="/assets/trade-hustle-logo-new.png"
            alt="Trade Hustle Resume Builder Logo"
            width={160}
            height={160}
            className="drop-shadow-[0_0_25px_rgba(255,215,0,0.4)] animate-float-slow"
          />
        </div>

        {/* Enhanced Value Proposition */}
        <div className="mt-8 px-4 max-w-4xl mx-auto">
          <p className="text-2xl font-bold text-white mb-4">
            ATS-Optimized Resumes Built by Tradespeople, for Tradespeople
          </p>
          <p className="text-lg text-gray-300">
            Land more interviews with AI-powered resumes designed specifically for your trade. 
            No fluff. No guesswork. Just results.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-[#FFD700] text-2xl">⚡</span>
            <span className="font-bold">15 Min Setup</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FFD700] text-2xl">✓</span>
            <span className="font-bold">95%+ ATS Score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FFD700] text-2xl">🎯</span>
            <span className="font-bold">Trade-Specific</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FFD700] text-2xl">🔥</span>
            <span className="font-bold">5,000+ Built</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="mt-12">
          <button
            onClick={() => router.push('/trade-selection')}
            className="bg-[#8B0000] hover:bg-red-800 text-white font-extrabold text-2xl py-6 px-12 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-[#FFD700]/50 hover:scale-105 transform"
          >
            Choose Your Trade & Get Started →
          </button>
          <p className="text-gray-400 text-sm mt-3">Free to start • No credit card required</p>
        </div>
      </div>

      {/* Background Section */}
      <div className="relative mt-12 pb-24 bg-gradient-to-b from-gray-900 to-black">
        {/* Dark gradient background instead of brick */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-8 px-6 mt-10">
          {/* Card 1 */}
          <div className="bg-gradient-to-b from-[#111] to-[#222] border border-gray-700 rounded-xl shadow-xl text-center p-8 max-w-md w-full">
            <div className="text-5xl mb-4">🔓</div>
            <h3 className="text-2xl font-bold mb-2">Unlock the Hustle</h3>
            <p className="text-gray-300 mb-6">
              Get your free Trade Hustle PDF and start your blueprint.
            </p>
            <a
              href="/free-pdf"
              className="bg-[#8B0000] hover:bg-red-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg"
            >
              UNLOCK NOW →
            </a>
            <p className="text-sm text-gray-400 mt-4">Free download • No signup required</p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-b from-[#111] to-[#222] border border-yellow-700 rounded-xl shadow-xl text-center p-8 max-w-md w-full">
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="text-2xl font-bold mb-2">Craft Your Hustle</h3>
            <p className="text-gray-300 mb-6">
              Build your resume with Enhanced Intelligence and get hired faster.
            </p>
            <a
              href="/resume-builder"
              className="bg-[#8B0000] hover:bg-red-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg"
            >
              LAUNCH BUILDER →
            </a>
            <p className="text-sm text-gray-400 mt-4">AI-powered • ATS-optimized</p>
          </div>
        </div>

        {/* Removed AI Assistant Section */}
      </div>
    </section>
  )
}