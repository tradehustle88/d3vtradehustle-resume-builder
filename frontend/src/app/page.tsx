'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  // Initialize magnetic button effect and ambient animations
  useEffect(() => {
    import('@/styles/button-magnetic').then(module => {
      module.initMagneticButtons();
    });
    
    // Mouse glow effect
    const handleMouseMove = (e: MouseEvent) => {
      const glow = document.getElementById('mouseGlow');
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };
    
    // Parallax scroll effect
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroVideo = document.getElementById('heroVideo');
      const toolsBackground = document.querySelector('.hero-gradient') as HTMLElement;
      
      if (heroVideo) {
        heroVideo.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
      if (toolsBackground) {
        toolsBackground.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="bg-white min-h-screen">
      {/* Mouse glow effect */}
      <div id="mouseGlow" className="mouse-glow" />
      
      {/* Hero Section with Video & Tools Gradient Backdrop */}
      <section className="hero-gradient overflow-hidden">
        {/* Background Video Loop */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          id="heroVideo"
          className="hero-video"
          poster="/tools-background.png"
        >
          <source src="/videos/trade-hero.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
        </video>
        
        <div className="hero-content relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="flex gap-3 mb-6">
                <span className="px-4 py-1.5 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-full text-[#DC2626] text-sm font-semibold" style={{boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)'}}>
                  92% ATS Pass Rate
                </span>
                <span className="px-4 py-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full text-[#3B82F6] text-sm font-semibold" style={{boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'}}>
                  Avg Interview in 7 Days
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                Get Past the Bots.
                <br />
                <span className="text-[#1673FF]" style={{textShadow: '0 2px 20px rgba(22, 115, 255, 0.3)'}}>Impress the Recruiter.</span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Recruiter-tested templates + Enhanced Intelligence that fixes your resume in 5 minutes. 
                No fluff. Just results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/templates" className="btn-primary text-center">
                  View Templates & Start
                </Link>
                <Link href="/builder" className="btn-secondary text-center">
                  Import from Indeed
                </Link>
              </div>
            </div>
            
            {/* Right: Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 to-transparent blur-3xl" />
              <img 
                src="/assets/resumeBuilderLogo-v3.png" 
                alt="Trade Hustle Resume Builder" 
                className="relative w-full max-w-md mx-auto animate-pulse"
                style={{filter: 'drop-shadow(0 0 40px rgba(255, 215, 0, 0.6))'}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:bg-gray-100 transition-all group hover:shadow-lg">
            <div className="w-16 h-16 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'}}>
              <svg className="w-8 h-8 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Import from Indeed or Upload Yours</h3>
            <p className="text-gray-600 mb-4">Link your Indeed profile or drop a Word/PDF. We pull your info instantly—no retyping.</p>
            <p className="text-sm text-gray-500">One-click import • Word, PDF, or Indeed link</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:bg-gray-100 transition-all group hover:shadow-lg">
            <div className="w-16 h-16 bg-[#DC2626]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-[#DC2626]/20">
              <svg className="w-8 h-8 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Recruiter Bot Scores Your Resume</h3>
            <p className="text-gray-600 mb-4">Our Enhanced Intelligence plays recruiter. Get a real-time score + fixes for ATS systems and human hiring managers.</p>
            <p className="text-sm text-gray-500">See your score in 60 seconds</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:bg-gray-100 transition-all group hover:shadow-lg">
            <div className="w-16 h-16 bg-[#FFD700]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-[#FFD700]/30">
              <svg className="w-8 h-8 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Trade-Specific Templates That Work</h3>
            <p className="text-gray-600 mb-4">12+ layouts tested with HVAC, electrical, plumbing, and construction recruiters. Pick one, we auto-fill the rest.</p>
            <p className="text-sm text-gray-500">Recruiter-approved • ATS-optimized</p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">ATS-Optimized</div>
              <div className="text-sm text-gray-600">Beats 92% of bots</div>
            </div>
            <div className="h-12 w-px bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">Recruiter Approved</div>
              <div className="text-sm text-gray-600">200+ hiring managers</div>
            </div>
            <div className="h-12 w-px bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1673FF]" style={{textShadow: '0 2px 15px rgba(22, 115, 255, 0.3)'}}>2,847 Hires</div>
              <div className="text-sm text-gray-600">Verified placements</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-white">
        <h2 className="text-4xl font-black text-gray-900 text-center mb-16">Built by Tradespeople. <span className="text-[#1673FF]">Backed by Results.</span></h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#DC2626] rounded-full" />
              <div>
                <div className="font-bold text-gray-900">Marcus Chen</div>
                <div className="text-sm text-gray-600">Journeyman Electrician</div>
                <div className="text-xs text-gray-500">Chicago, IL</div>
              </div>
            </div>
            <p className="text-gray-700 italic">"Got 3 interview calls in the first week. The recruiter score nailed what was missing."</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#DC2626] to-[#FFD700] rounded-full" />
              <div>
                <div className="font-bold text-gray-900">Tasha Williams</div>
                <div className="text-sm text-gray-600">HVAC Technician</div>
                <div className="text-xs text-gray-500">Phoenix, AZ</div>
              </div>
            </div>
            <p className="text-gray-700 italic">"Imported from Indeed, fixed my bullets with Enhanced Intelligence, hired within 14 days at a union shop. $8/hr raise."</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#3B82F6] rounded-full" />
              <div>
                <div className="font-bold text-gray-900">Jake Ortiz</div>
                <div className="text-sm text-gray-600">Pipe Welder</div>
                <div className="text-xs text-gray-500">Houston, TX</div>
              </div>
            </div>
            <p className="text-gray-700 italic">"My old resume scored 34%. TradeHustle got me to 91% in 5 minutes."</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-5xl font-black text-gray-900 mb-6">
            Your Data. <span className="text-[#1673FF]" style={{textShadow: '0 2px 20px rgba(22, 115, 255, 0.3)'}}>Your Control.</span>
          </h2>
          <p className="text-xl text-gray-700 mb-4">We never sell your info. Ever.</p>
          <p className="text-lg text-gray-600 mb-12">Delete your resume anytime—one click, it's gone for good.</p>
          
          <Link href="/builder" className="btn-primary btn-lg inline-block">
            Start Building Your Resume
          </Link>
        </div>
      </section>
    </div>
  );
}
