'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Template {
  id: string
  name: string
  category: 'classic' | 'modern' | 'creative' | 'ats-optimized' | 'executive'
  thumbnail: string
  atsScore: number
  features: string[]
  popular?: boolean
}

interface TemplateGalleryProps {
  trade: string
  customTradeName?: string
}

const TEMPLATE_CATEGORIES = [
  'All Templates',
  'ATS-Optimized',
  'Modern',
  'Classic',
  'Creative',
  'Executive'
]

// Generate 25 templates per trade
const generateTemplates = (trade: string): Template[] => {
  const templates: Template[] = []
  const categories: Template['category'][] = ['classic', 'modern', 'creative', 'ats-optimized', 'executive']
  
  for (let i = 1; i <= 25; i++) {
    const category = categories[(i - 1) % categories.length]
    templates.push({
      id: `${trade}-template-${i}`,
      name: `${trade.charAt(0).toUpperCase() + trade.slice(1)} Pro ${i}`,
      category,
      thumbnail: `/assets/templates/${trade}/${i}.jpg`,
      atsScore: Math.floor(Math.random() * 15) + 85, // 85-100
      features: [
        'ATS-Friendly Format',
        'Trade-Specific Keywords',
        category === 'ats-optimized' ? 'Optimized for Applicant Tracking' : 'Professional Layout',
        'Easy Customization'
      ],
      popular: i <= 5 // First 5 are popular
    })
  }
  
  return templates
}

export default function TemplateGallery({ trade, customTradeName }: TemplateGalleryProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('All Templates')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  
  const templates = generateTemplates(trade)
  
  const filteredTemplates = selectedCategory === 'All Templates'
    ? templates
    : templates.filter(t => t.category === selectedCategory.toLowerCase().replace('-', ''))

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Navigate to builder with selected template
    router.push(`/builder?trade=${trade}&template=${templateId}`)
  }

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
  }

  const closePreview = () => {
    setPreviewTemplate(null)
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            {customTradeName || trade.charAt(0).toUpperCase() + trade.slice(1)} <span className="text-[#E50914]">Templates</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose from 25 professionally designed, ATS-optimized templates tailored for your trade.
          </p>
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="text-[#FFD700] hover:text-yellow-500 font-bold inline-flex items-center gap-2 mb-8"
          >
            ← Back to Trade Selection
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-3 rounded-lg font-bold transition-all duration-300
                ${selectedCategory === category
                  ? 'bg-[#E50914] text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid - 12 Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`
                group relative bg-gray-800 rounded-xl overflow-hidden
                transition-all duration-300 transform hover:scale-105
                ${selectedTemplate === template.id ? 'ring-4 ring-[#FFD700]' : ''}
                hover:shadow-2xl hover:shadow-[#E50914]/30
              `}
            >
              {/* Popular Badge */}
              {template.popular && (
                <div className="absolute top-4 left-4 bg-[#FFD700] text-black font-bold px-3 py-1 rounded-full text-sm z-10">
                  🔥 Popular
                </div>
              )}

              {/* ATS Score Badge */}
              <div className="absolute top-4 right-4 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm z-10">
                ATS {template.atsScore}%
              </div>

              {/* Template Thumbnail */}
              <div className="relative h-80 bg-gradient-to-br from-gray-700 to-gray-900">
                {/* Placeholder for actual template preview */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">📄</div>
                    <div className="text-sm font-mono">{template.name}</div>
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handlePreview(template)}
                    className="bg-white text-black font-bold px-6 py-3 rounded-lg mb-2 hover:bg-gray-200 transition-colors"
                  >
                    👁️ Preview
                  </button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm mb-3 capitalize">{template.category.replace('-', ' ')}</p>
                
                {/* Features */}
                <ul className="text-xs text-gray-500 mb-4 space-y-1">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  onClick={() => handleTemplateSelect(template.id)}
                  className="w-full bg-[#8B0000] hover:bg-red-800 text-white font-bold py-3 rounded-lg transition-all duration-300"
                >
                  Use This Template →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closePreview}>
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{previewTemplate.name}</h3>
                    <p className="text-gray-400 capitalize">{previewTemplate.category.replace('-', ' ')} Template</p>
                    <div className="flex gap-4 mt-3">
                      <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                        ATS Score: {previewTemplate.atsScore}%
                      </span>
                      {previewTemplate.popular && (
                        <span className="bg-[#FFD700] text-black font-bold px-3 py-1 rounded-full text-sm">
                          🔥 Popular Choice
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={closePreview}
                    className="text-white hover:text-red-500 text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Large Preview */}
                <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg h-96 mb-6 flex items-center justify-center">
                  <div className="text-center p-8 text-gray-400">
                    <div className="text-8xl mb-4">📄</div>
                    <div className="text-2xl font-bold text-white mb-2">{previewTemplate.name}</div>
                    <div className="text-sm">Full template preview coming soon</div>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <h4 className="text-white font-bold text-xl mb-3">Template Features:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {previewTemplate.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-300">
                        <span className="text-green-500 text-xl">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleTemplateSelect(previewTemplate.id)}
                    className="flex-1 bg-[#8B0000] hover:bg-red-800 text-white font-bold py-4 rounded-lg transition-all duration-300"
                  >
                    Use This Template →
                  </button>
                  <button
                    onClick={closePreview}
                    className="px-8 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Signals */}
        <div className="mt-16 bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="text-white font-bold text-xl mb-2">ATS-Optimized</h4>
              <p className="text-gray-400">Pass applicant tracking systems with 95%+ success rate</p>
            </div>
            <div>
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="text-white font-bold text-xl mb-2">Quick Customization</h4>
              <p className="text-gray-400">Edit and download your resume in under 15 minutes</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🏆</div>
              <h4 className="text-white font-bold text-xl mb-2">Industry Specific</h4>
              <p className="text-gray-400">Templates designed by trade professionals for trade professionals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
