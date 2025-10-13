'use client'
import Link from 'next/link'
import PaintSplatter from '@/components/PaintSplatter'

export default function PricingPage() {
  const handleGetStarted = async () => {
    try {
      // Call your live Firebase Functions createCheckout endpoint
      const response = await fetch('https://us-central1-tradehustleresumebuilder.cloudfunctions.net/api/createCheckout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Using your live Stripe price ID
          priceId: 'price_1SHfAyLr4v4blpwbcvDqbej8',
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Error starting checkout. Please try again.')
    }
  }

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Paint Splatter Background Effects */}
      <PaintSplatter 
        type="multicolor" 
        size="xl" 
        animation="float" 
        style={{ top: '10%', right: '5%', opacity: 0.4 }}
      />
      <PaintSplatter 
        type="blue" 
        size="lg" 
        animation="pulse" 
        style={{ bottom: '15%', left: '10%', opacity: 0.5 }}
      />
      <PaintSplatter 
        type="spray-1" 
        size="md" 
        animation="fade-in" 
        style={{ top: '30%', left: '20%', opacity: 0.3 }}
      />

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-[#E50914] mb-4">
            TRADE HUSTLE RESUME BUILDER
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get your professional resume built with AI assistance and land your next trade job faster.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-b from-[#111] to-[#222] border-2 border-[#E50914] rounded-xl shadow-2xl p-8 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div 
              className="absolute inset-0 opacity-10 bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/brick-wall-texture.webp')" }}
            />
            
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-block bg-[#E50914] text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
                🔥 MOST POPULAR
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="text-6xl font-bold text-[#ffd700] mb-2">$47</div>
                <div className="text-gray-400 text-lg">One-time payment</div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center">
                  <span className="text-[#E50914] mr-3">✓</span>
                  <span>AI-Powered Resume Generation</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#E50914] mr-3">✓</span>
                  <span>ATS-Optimized Templates</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#E50914] mr-3">✓</span>
                  <span>Trade-Specific Content Library</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#E50914] mr-3">✓</span>
                  <span>Professional PDF Export</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#E50914] mr-3">✓</span>
                  <span>Instant Download</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#E50914] mr-3">✓</span>
                  <span>30-Day Money Back Guarantee</span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-[#E50914] to-[#8B0000] hover:from-[#FF1B2D] hover:to-[#A0001B] text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] mb-4"
              >
                START BUILDING NOW →
              </button>

              <p className="text-sm text-gray-400">
                Secure checkout powered by Stripe • No recurring charges
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link href="/" className="text-[#ffd700] hover:text-white transition-colors duration-300 underline">
            ← Back to Home
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="text-center mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-[#ffd700] mb-8">Why Trade Professionals Trust Us</h3>
          <div className="grid md:grid-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h4 className="font-bold mb-2">Built for Trades</h4>
              <p className="text-gray-400 text-sm">Templates designed specifically for construction, electrical, plumbing, and skilled trades.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="font-bold mb-2">AI-Powered</h4>
              <p className="text-gray-400 text-sm">Advanced AI helps you craft compelling job descriptions and highlight your skills.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="font-bold mb-2">ATS-Ready</h4>
              <p className="text-gray-400 text-sm">Optimized to pass Applicant Tracking Systems used by major employers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}