'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  preview: string
  description: string
  features: string[]
}

export default function TemplateGallery() {
  const searchParams = useSearchParams()
  const tradeType = searchParams.get('trade')
  const customTradeName = searchParams.get('name')
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    // Load templates based on trade type
    if (tradeType) {
      loadTemplates(tradeType)
    }
  }, [tradeType])

  const loadTemplates = (trade: string) => {
    // Mock templates - in production, fetch from API
    const mockTemplates: Template[] = Array.from({ length: 25 }, (_, i) => ({
      id: `${trade}-${i + 1}`,
      name: `${getTradeDisplayName(trade)} Template ${i + 1}`,
      preview: '/api/placeholder/400/500',
      description: `Professional resume template optimized for ${getTradeDisplayName(trade)} positions`,
      features: [
        'ATS-Optimized',
        'Skills Section',
        'Certifications Highlighted',
        'Experience Focused'
      ]
    }))
    
    setTemplates(mockTemplates)
  }

  const getTradeDisplayName = (trade: string | null): string => {
    if (!trade) return 'Trade'
    
    if (trade === 'custom' && customTradeName) {
      return customTradeName
    }

    const tradeNames: { [key: string]: string } = {
      electrician: 'Electrician',
      plumber: 'Plumber',
      hvac: 'HVAC Tech',
      carpenter: 'Carpenter',
      mason: 'Mason',
      welder: 'Welder',
      mechanic: 'Mechanic',
      contractor: 'Contractor'
    }

    return tradeNames[trade] || trade.charAt(0).toUpperCase() + trade.slice(1)
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Navigate to builder with selected template
    window.location.href = `/builder?template=${templateId}&trade=${tradeType}`
  }

  // Loading state
  if (!tradeType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-[#FFD700] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
            <span className="text-gray-400">Selected Trade:</span>
            <span className="text-[#FFD700] font-bold">{getTradeDisplayName(tradeType)}</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            <span className="text-[#FFD700]">{getTradeDisplayName(tradeType)}</span> Resume Templates
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose from {templates.length} professionally designed, ATS-optimized resume templates
            specifically crafted for {getTradeDisplayName(tradeType)} professionals.
          </p>
        </div>

        {/* Filter/Sort Bar */}
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#8B0000] text-white rounded-lg font-semibold">
              All Templates
            </button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Most Popular
            </button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Modern
            </button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Classic
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">Sort by:</span>
            <select className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]">
              <option>Recommended</option>
              <option>Newest</option>
              <option>Most Used</option>
              <option>Name</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading templates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`group relative bg-gray-800 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                  selectedTemplate === template.id
                    ? 'border-[#FFD700] scale-105 shadow-2xl shadow-[#FFD700]/20'
                    : 'border-gray-700 hover:border-[#FFD700] hover:scale-105'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                {/* Preview Image */}
                <div className="aspect-[3/4] bg-gray-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  
                  {/* Placeholder for template preview */}
                  <div className="text-center p-8">
                    <div className="w-full h-48 bg-gray-700 rounded mb-4 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-600 rounded w-3/4 mx-auto"></div>
                      <div className="h-2 bg-gray-600 rounded w-full"></div>
                      <div className="h-2 bg-gray-600 rounded w-5/6 mx-auto"></div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#8B0000]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <button className="px-6 py-3 bg-[#FFD700] text-black font-bold rounded-lg hover:scale-110 transition-transform">
                        Use This Template
                      </button>
                      <p className="text-white text-sm mt-4">Click to preview & customize</p>
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-4 right-4 bg-[#FFD700] rounded-full p-2 z-10">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#FFD700] transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {template.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 2 && (
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        +{template.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-16 bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-gray-400 mb-6">
              All our templates are ATS-optimized and designed specifically for {getTradeDisplayName(tradeType)} professionals.
              Pick any template and customize it to match your experience and style.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                View Sample Resumes
              </button>
              <button className="px-6 py-3 bg-[#8B0000] text-white rounded-lg hover:bg-red-800 transition-colors">
                Get AI Suggestions
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
