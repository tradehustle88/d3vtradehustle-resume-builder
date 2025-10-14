'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PricingTier {
  id: string
  name: string
  price: string
  originalPrice?: string
  period: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
  badge?: string
  savings?: string
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Text Export',
    price: '$0',
    period: 'Forever',
    description: 'Basic resume export for quick applications',
    features: [
      'Plain text format (.txt)',
      'Basic resume structure',
      'Copy & paste ready',
      'No credit card required',
      'Limited formatting'
    ],
    cta: 'Download Free Text',
    badge: '🎁 FREE'
  },
  {
    id: 'trial',
    name: '7-Day Trial',
    price: '$2',
    period: 'One-time',
    description: 'Test all premium features risk-free',
    features: [
      'All Pro features for 7 days',
      'PDF & Word exports',
      'Unlimited edits',
      'AI-powered suggestions',
      'ATS optimization tools',
      'Priority support'
    ],
    cta: 'Start $2 Trial',
    badge: '⚡ TRIAL',
    popular: true
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$14.95',
    period: 'per month',
    description: 'Full access with monthly flexibility',
    features: [
      'Unlimited PDF & Word exports',
      'All 200+ templates',
      'AI resume enhancement',
      'ATS score optimization',
      'Cover letter builder',
      'Job tracker & alerts',
      'Cert vault storage',
      'Priority support',
      'Cancel anytime'
    ],
    cta: 'Go Pro Monthly'
  },
  {
    id: 'annual',
    name: 'Pro Annual',
    price: '$119',
    originalPrice: '$179.40',
    period: 'per year',
    savings: 'Save 33%',
    description: 'Best value for serious job seekers',
    features: [
      'Everything in Pro Monthly',
      '✨ Career Blueprints access',
      '✨ Advanced analytics',
      '✨ Custom branding options',
      '✨ Referral program access',
      '✨ Early feature access',
      'Dedicated account manager',
      'Lifetime updates',
      'Best value guarantee'
    ],
    cta: 'Go Pro Annual',
    badge: '💎 BEST VALUE'
  }
]

interface PricingModalProps {
  onClose?: () => void
  defaultTier?: string
}

export default function PricingModal({ onClose, defaultTier }: PricingModalProps) {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<string>(defaultTier || 'trial')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId)
    
    if (tierId === 'free') {
      // Direct download of text version
      handleFreeDownload()
    } else {
      // Navigate to checkout
      router.push(`/checkout?tier=${tierId}`)
    }
  }

  const handleFreeDownload = () => {
    // Implement free text download logic
    console.log('Downloading free text version...')
    alert('Free text version downloaded! Upgrade for PDF format.')
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Choose Your <span className="text-[#E50914]">Plan</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex bg-gray-800 rounded-lg p-1 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#E50914] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-[#E50914] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual <span className="text-[#FFD700] text-sm ml-1">(Save 33%)</span>
            </button>
          </div>

          {/* Trust Badge */}
          <div className="flex justify-center gap-6 text-gray-400 text-sm">
            <span className="flex items-center gap-2">✓ No Credit Card for Free Tier</span>
            <span className="flex items-center gap-2">✓ 30-Day Money Back</span>
            <span className="flex items-center gap-2">✓ Cancel Anytime</span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PRICING_TIERS.map((tier) => {
            // Show annual or monthly based on toggle
            if (tier.id === 'monthly' && billingCycle === 'annual') return null
            if (tier.id === 'annual' && billingCycle === 'monthly') return null

            return (
              <div
                key={tier.id}
                className={`
                  relative bg-gray-800 rounded-xl overflow-hidden
                  transition-all duration-300 transform hover:scale-105
                  ${selectedTier === tier.id ? 'ring-4 ring-[#FFD700]' : ''}
                  ${tier.popular ? 'lg:scale-105 border-4 border-[#FFD700]' : 'border border-gray-700'}
                  hover:shadow-2xl hover:shadow-[#E50914]/30
                `}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className={`
                    absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold
                    ${tier.popular ? 'bg-[#FFD700] text-black' : 'bg-gray-700 text-white'}
                  `}>
                    {tier.badge}
                  </div>
                )}

                {/* Savings Badge */}
                {tier.savings && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {tier.savings}
                  </div>
                )}

                <div className="p-6">
                  {/* Tier Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  
                  {/* Price */}
                  <div className="mb-4">
                    {tier.originalPrice && (
                      <div className="text-gray-500 line-through text-lg">{tier.originalPrice}</div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold text-[#E50914]">{tier.price}</span>
                      <span className="text-gray-400 text-sm">/{tier.period}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-6">{tier.description}</p>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectTier(tier.id)}
                    className={`
                      w-full font-bold py-4 rounded-lg transition-all duration-300 mb-6
                      ${tier.popular || tier.id === 'trial'
                        ? 'bg-[#8B0000] hover:bg-red-800 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }
                    `}
                  >
                    {tier.cta}
                  </button>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-green-500 flex-shrink-0 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-12">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Feature Comparison</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-4 text-white font-bold">Feature</th>
                  <th className="pb-4 text-center text-white font-bold">Free</th>
                  <th className="pb-4 text-center text-white font-bold">Trial</th>
                  <th className="pb-4 text-center text-white font-bold">Pro</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700">
                  <td className="py-4">Resume Templates</td>
                  <td className="py-4 text-center">Basic</td>
                  <td className="py-4 text-center">All 200+</td>
                  <td className="py-4 text-center">All 200+</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4">Export Formats</td>
                  <td className="py-4 text-center">Text only</td>
                  <td className="py-4 text-center">PDF, Word</td>
                  <td className="py-4 text-center">PDF, Word, HTML</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4">AI Enhancement</td>
                  <td className="py-4 text-center">✗</td>
                  <td className="py-4 text-center">✓</td>
                  <td className="py-4 text-center">✓ Advanced</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4">ATS Optimization</td>
                  <td className="py-4 text-center">✗</td>
                  <td className="py-4 text-center">✓</td>
                  <td className="py-4 text-center">✓</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4">Job Tracker</td>
                  <td className="py-4 text-center">✗</td>
                  <td className="py-4 text-center">✗</td>
                  <td className="py-4 text-center">✓</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4">Cert Vault</td>
                  <td className="py-4 text-center">✗</td>
                  <td className="py-4 text-center">✗</td>
                  <td className="py-4 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4">Career Blueprints</td>
                  <td className="py-4 text-center">✗</td>
                  <td className="py-4 text-center">✗</td>
                  <td className="py-4 text-center">✓ Annual Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-bold mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400 text-sm">Yes! Cancel your subscription anytime. No questions asked.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">What's included in the $2 trial?</h4>
              <p className="text-gray-400 text-sm">Full access to all Pro features for 7 days. No automatic renewal.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">Do I need a credit card for free?</h4>
              <p className="text-gray-400 text-sm">No! The free text export requires no payment information.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">What's the refund policy?</h4>
              <p className="text-gray-400 text-sm">30-day money-back guarantee on all paid plans. No hassle.</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <div className="text-center mt-8">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white font-bold"
            >
              ← Back to Preview
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
