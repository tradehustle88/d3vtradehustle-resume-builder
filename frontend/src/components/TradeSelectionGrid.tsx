'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TradeOption {
  id: string
  name: string
  icon: string
  templateCount: number
  popularJobs: string[]
  description: string
  color: string
}

const trades: TradeOption[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    icon: '⚡',
    templateCount: 25,
    popularJobs: ['Journeyman Electrician', 'Master Electrician', 'Electrical Foreman'],
    description: 'Wire systems, install fixtures, troubleshoot electrical issues',
    color: 'from-yellow-600 to-orange-700'
  },
  {
    id: 'plumber',
    name: 'Plumber',
    icon: '🔧',
    templateCount: 25,
    popularJobs: ['Journeyman Plumber', 'Pipefitter', 'Plumbing Foreman'],
    description: 'Install and repair piping systems, fixtures, and appliances',
    color: 'from-blue-600 to-cyan-700'
  },
  {
    id: 'hvac',
    name: 'HVAC Tech',
    icon: '❄️',
    templateCount: 25,
    popularJobs: ['HVAC Technician', 'HVAC Installer', 'Service Technician'],
    description: 'Install, maintain, and repair heating and cooling systems',
    color: 'from-cyan-600 to-blue-700'
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    icon: '🔨',
    templateCount: 25,
    popularJobs: ['Rough Carpenter', 'Finish Carpenter', 'Framing Carpenter'],
    description: 'Build and repair structures, frameworks, and finish work',
    color: 'from-amber-700 to-yellow-800'
  },
  {
    id: 'mason',
    name: 'Mason',
    icon: '🧱',
    templateCount: 25,
    popularJobs: ['Bricklayer', 'Stone Mason', 'Concrete Finisher'],
    description: 'Construct and repair structures using brick, stone, concrete',
    color: 'from-orange-700 to-red-800'
  },
  {
    id: 'welder',
    name: 'Welder',
    icon: '🔥',
    templateCount: 25,
    popularJobs: ['MIG Welder', 'TIG Welder', 'Pipe Welder'],
    description: 'Join metal parts using various welding techniques',
    color: 'from-red-600 to-orange-700'
  },
  {
    id: 'mechanic',
    name: 'Mechanic',
    icon: '🔩',
    templateCount: 25,
    popularJobs: ['Auto Mechanic', 'Diesel Mechanic', 'Heavy Equipment Mechanic'],
    description: 'Diagnose and repair vehicles and machinery',
    color: 'from-gray-700 to-slate-800'
  },
  {
    id: 'contractor',
    name: 'Contractor',
    icon: '👷',
    templateCount: 25,
    popularJobs: ['General Contractor', 'Project Manager', 'Construction Supervisor'],
    description: 'Manage construction projects and coordinate trades',
    color: 'from-green-700 to-emerald-800'
  }
]

export default function TradeSelectionGrid() {
  const router = useRouter()
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customTrade, setCustomTrade] = useState('')

  const handleTradeSelect = (tradeId: string) => {
    setSelectedTrade(tradeId)
    router.push(`/templates?trade=${tradeId}`)
  }

  const handleCustomSubmit = () => {
    if (customTrade.trim()) {
      router.push(`/templates?trade=custom&name=${encodeURIComponent(customTrade)}`)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Choose Your <span className="text-[#FFD700]">Trade</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select your trade to unlock industry-specific resume templates optimized for ATS systems
            and hiring managers in your field.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trades.map((trade) => (
            <button
              key={trade.id}
              onClick={() => handleTradeSelect(trade.id)}
              className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 ${selectedTrade === trade.id ? 'ring-4 ring-[#FFD700]' : ''} bg-gradient-to-br ${trade.color} hover:shadow-2xl`}
            >
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                {trade.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {trade.name}
              </h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-full">
                  {trade.templateCount} Templates
                </span>
              </div>
              <p className="text-sm text-gray-200 opacity-90 mb-3">
                {trade.description}
              </p>
              <div className="text-xs text-gray-300 space-y-1">
                <p className="font-semibold">Popular Jobs:</p>
                {trade.popularJobs.slice(0, 2).map((job, idx) => (
                  <p key={idx} className="opacity-80">• {job}</p>
                ))}
              </div>
              {selectedTrade === trade.id && (
                <div className="absolute top-4 right-4 bg-[#FFD700] rounded-full p-2">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </button>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 shadow-lg border-2 border-gray-600 hover:border-[#FFD700]"
          >
            <span className="text-3xl mr-3">📝</span>
            <span className="text-xl">Custom Trade / Other</span>
          </button>

          {showCustomInput && (
            <div className="mt-6 bg-gray-800 p-6 rounded-xl border border-gray-700">
              <label className="block text-white font-bold mb-3">
                Enter Your Trade or Specialty:
              </label>
              <input
                type="text"
                value={customTrade}
                onChange={(e) => setCustomTrade(e.target.value)}
                placeholder="e.g., Landscaper, Roofer, Painter..."
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
              />
              <button
                onClick={handleCustomSubmit}
                disabled={!customTrade.trim()}
                className="w-full bg-[#8B0000] hover:bg-red-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Continue with {customTrade || 'Custom Trade'} →
              </button>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>ATS-Optimized Templates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Industry-Specific Keywords</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>AI-Powered Suggestions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
