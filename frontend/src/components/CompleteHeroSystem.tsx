'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const trustStats = [
  { icon: '✅', label: '92% ATS Pass Rate', value: '92%' },
  { icon: '⚡', label: 'Avg Interview in 7 Days', value: '7 Days' },
  { icon: '🛠️', label: '5,000+ Trades Hired', value: '5K+' },
  { icon: '📄', label: 'Works with Word, Google Docs, and PDF', value: 'All Formats' },
  { icon: '🤖', label: 'Enhanced Intelligence for Trades', value: 'AI Powered' },
]

const workflowSteps = [
  { number: '①', icon: '⛑️', label: 'Choose Your Trade' },
  { number: '②', icon: '⬆️', label: 'Upload or Build' },
  { number: '③', icon: '📋', label: 'Get Score' },
  { number: '④', icon: '🔧', label: 'Fix & Download' },
]

const features = [
  { icon: '💼', title: 'Trade-Specific Templates', description: '50+ templates for every skilled trade' },
  { icon: '📈', title: 'Recruiter Enhancement Score', description: 'Real-time ATS optimization' },
  { icon: '🧠', title: 'Built-In Intelligence', description: 'AI fixes grammar, format, and keywords' },
  { icon: '🧰', title: '50+ Skilled Trades', description: 'HVAC, electric, plumbing, and more' },
]

export default function CompleteHeroSystem() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            window.location.href = '/builder'
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, #031B3E, #0C2C62, #F8FAFF 130%)'
    }}>
      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        
        {/* Logo with Pulse Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative animate-pulse-glow">
            <Image
              src="/assets/resumeBuilderLogo-v3.webp"
              alt="Trade Hustle Engine"
              width={140}
              height={140}
              priority
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0ZGRDYzMyIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+"
              className="drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-[#FFD633] rounded-full blur-3xl opacity-20 animate-orbit-glow"></div>
          </div>
        </div>

        {/* Main Heading */}
        <header className="text-center space-y-6 mb-12">
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            TRADE HUSTLE RESUME BUILDER
          </h1>
          <p className="text-2xl sm:text-3xl font-bold text-[#FFD633] drop-shadow-lg">
            Built by Hustle. Backed by Results.
          </p>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Recruiter-tested templates powered by <span className="text-[#FFD633] font-semibold">Enhanced Intelligence</span> to fix your resume in 5 minutes.
          </p>
        </header>

        {/* Trust Layer - Stats Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {trustStats.map((stat, idx) => (
            <button
              key={idx}
              className="group px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 hover:border-white/40 transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-white/90 text-sm font-medium group-hover:text-white">
                  {stat.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Action Row - Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/templates"
            className="group px-8 py-4 bg-[#FFD633] text-[#0A2344] rounded-lg font-bold text-lg hover:bg-[#FFE666] hover:shadow-[0_8px_24px_rgba(255,214,51,0.4)] transition-all hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              VIEW TRADE TEMPLATES
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
          <Link
            href="/builder"
            className="px-8 py-4 bg-[#0C2C62] border-2 border-white/40 text-white rounded-lg font-bold text-lg hover:bg-[#123C6D] hover:border-white transition-all hover:scale-105 hover:shadow-xl"
          >
            UPLOAD YOUR RESUME
          </Link>
        </div>

        {/* How It Works - Step Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-center text-white/80 font-semibold text-sm uppercase tracking-wider mb-6">
            How It Works
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <div className="text-2xl font-bold text-[#FFD633]">{step.number}</div>
                <p className="text-white/90 text-sm text-center font-medium">{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hustle Engine - Interactive Upload Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-8 hover:border-[#FFD633]/50 transition-all">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <span>⚡</span>
                Hustle Engine
                <span>⚡</span>
              </h3>
              <p className="text-white/80">Drop your resume here or click to upload</p>
            </div>

            <label 
              htmlFor="file-upload" 
              className="block cursor-pointer"
            >
              <div className="border-2 border-dashed border-white/30 rounded-xl p-8 hover:border-[#FFD633] hover:bg-white/5 transition-all text-center">
                {!uploading ? (
                  <>
                    <div className="text-5xl mb-4">📄</div>
                    <p className="text-white font-semibold mb-2">Click to upload or drag and drop</p>
                    <p className="text-white/60 text-sm">PDF, DOCX, DOC, TXT (Max 5MB)</p>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="text-4xl animate-bounce">🤖</div>
                    <p className="text-white font-semibold">Hustle Engine Analyzing...</p>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-[#FFD633] transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-white/80 text-sm">{progress}% Complete</p>
                  </div>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {progress === 100 && (
              <div className="mt-4 flex gap-3 justify-center">
                <button className="px-4 py-2 bg-[#FFD633] text-[#0A2344] rounded-lg font-semibold hover:bg-[#FFE666] transition-colors">
                  View Corrections
                </button>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
                  Edit in Builder
                </button>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((feature, idx) => (
            <button
              key={idx}
              className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all hover:scale-105 text-left"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-white font-bold text-lg mb-2">{feature.title}</h4>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </button>
          ))}
        </div>

        {/* Tagline */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm italic">
            "We don't write fluff. We build careers."
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(255, 214, 51, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(255, 214, 51, 0.6));
          }
        }

        @keyframes orbit-glow {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            opacity: 0.3;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 0.2;
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-orbit-glow {
          animation: orbit-glow 6s linear infinite;
        }
      `}</style>
    </div>
  )
}
