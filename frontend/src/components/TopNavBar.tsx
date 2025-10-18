'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function TopNavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm" style={{
      background: 'linear-gradient(to right, #0A2344, #123C6D)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/assets/resumeBuilderLogo-v3.webp"
              alt="Trade Hustle Resume Builder Logo"
              width={40}
              height={40}
              className="drop-shadow-[0_0_8px_rgba(255,214,51,0.4)]"
              quality={85}
              sizes="40px"
            />
            <span className="hidden sm:inline-block text-white font-semibold text-sm tracking-wide">
              TRADE HUSTLE
            </span>
          </Link>

          {/* Center: Announcement Banner */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-xl">🚀</span>
            <p className="text-white/90 text-sm font-medium">
              Resume Builder 2.0 now live — <span className="text-[#FFD633] font-semibold">Faster. Smarter. Guaranteed.</span>
            </p>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="px-4 py-2 text-sm font-semibold text-white hover:text-[#FFD633] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="px-5 py-2 bg-[#FFD633] text-[#0A2344] rounded-lg text-sm font-bold hover:bg-[#FFE666] hover:shadow-lg transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Announcement */}
      <div className="md:hidden border-t border-white/10 px-4 py-2 bg-white/5">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-lg">🚀</span>
          <p className="text-white/90 text-xs font-medium">
            Resume Builder 2.0 — <span className="text-[#FFD633]">Faster. Smarter.</span>
          </p>
        </div>
      </div>
    </nav>
  )
}
