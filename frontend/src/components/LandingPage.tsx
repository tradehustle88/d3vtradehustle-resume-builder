'use client'
import Image from 'next/image'
import SimpleAIAssistant from './SimpleAIAssistant'

export default function LandingPage() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Top Section (No Brick Background) */}
      <div className="pt-16 text-center">
        <h1 className="text-6xl font-extrabold text-[#E50914] tracking-wide">TRADE HUSTLE</h1>
        <h2 className="mt-2 text-4xl font-bold text-white">Resume Builder</h2>

        {/* Logo between title and subtitle */}
        <div className="flex justify-center mt-6">
          <Image
            src="/assets/resumeBuilderLogo-v3.png"
            alt="Trade Hustle Logo"
            width={160}
            height={160}
            className="drop-shadow-[0_0_25px_rgba(255,215,0,0.4)] animate-float-slow"
          />
        </div>

        {/* Subtitle */}
        <p className="mt-6 text-lg text-gray-300 px-4 max-w-3xl mx-auto">
          Built for the trades. Backed by hustle. Get the tools you need to land your next job.
        </p>
      </div>

      {/* Brick Background Section */}
      <div className="relative mt-12 pb-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url('/assets/brick-bg-v3.webp')" }}
        />

        {/* Overlay to darken the brick slightly */}
        <div className="absolute inset-0 bg-black/30" />

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

        {/* AI Assistant Section */}
        <div className="relative z-10 flex justify-center px-6 mt-16">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#ffd700] mb-2">⚡ TRY THE AI ASSISTANT</h2>
              <p className="text-gray-300 text-lg">
                Get professional resume content in seconds - powered by advanced AI
              </p>
            </div>
            <SimpleAIAssistant />
          </div>
        </div>
      </div>
    </section>
  )
}