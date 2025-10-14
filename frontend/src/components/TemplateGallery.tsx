'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  name: string
  thumbnailURL: string
  atsScore: number
  tradeType: string
  style: 'classic' | 'modern' | 'minimal' | 'bold'
  featured: boolean
}

interface TemplateCardProps {
  template: Template
  selected: boolean
  onSelect: () => void
}

function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        group relative overflow-hidden rounded-lg border-2 
        transition-all duration-300 transform hover:scale-105
        ${selected ? 'border-[#FFD700] ring-4 ring-[#FFD700] ring-opacity-50' : 'border-gray-700 hover:border-[#FFD700]'}
        bg-gray-800 hover:shadow-2xl
      `}
    >
      {/* Featured Badge */}
      {template.featured && (
        <div className="absolute top-2 left-2 z-10 bg-[#FFD700] text-black text-xs font-bold px-2 py-1 rounded">
          ⭐ Featured
        </div>
      )}

      {/* ATS Score Badge */}
      <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
        ATS {template.atsScore}%
      </div>

      {/* Template Thumbnail */}
      <div className="aspect-[8.5/11] bg-gray-900 relative overflow-hidden">
        {template.thumbnailURL ? (
          <img
            src={template.thumbnailURL}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <span className="text-4xl">📄</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
          <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Preview
          </span>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-3 text-left">
        <h3 className="text-sm font-bold text-white mb-1 truncate">
          {template.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="capitalize">{template.style}</span>
          {selected && (
            <span className="text-[#FFD700]">✓ Selected</span>
          )}
        </div>
      </div>
    </button>
  )
}

interface PreviewModalProps {
  templateId: string | null
  onClose: () => void
}

function PreviewModal({ templateId, onClose }: PreviewModalProps) {
  if (!templateId) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Template Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="aspect-[8.5/11] bg-white rounded-lg shadow-2xl">
            {/* Preview content would go here */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <span className="text-6xl mb-4 block">📄</span>
                <p>Template ID: {templateId}</p>
                <p className="text-sm mt-2">Preview loading...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-4 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // TODO: Navigate to resume builder with selected template
              console.log('Use template:', templateId)
            }}
            className="px-6 py-2 bg-[#FFD700] hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors"
          >
            Use This Template →
          </button>
        </div>
      </div>
    </div>
  )
}

// Mock function to load templates - replace with actual API call
async function loadTemplates(tradeType: string): Promise<Template[]> {
  // TODO: Replace with actual API call to Firebase Functions
  // const response = await fetch(`/api/templates?trade=${tradeType}`)
  // return response.json()
  
  // Mock data for development
  const styles: Array<'classic' | 'modern' | 'minimal' | 'bold'> = ['classic', 'modern', 'minimal', 'bold']
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `${tradeType}-template-${i + 1}`,
    name: `${tradeType.charAt(0).toUpperCase() + tradeType.slice(1)} Resume ${i + 1}`,
    thumbnailURL: '', // TODO: Add actual thumbnail URLs
    atsScore: Math.floor(Math.random() * 15) + 85, // Random score between 85-100
    tradeType,
    style: styles[i % 4],
    featured: i < 3 // First 3 are featured
  }))
}

interface TemplateGalleryProps {
  tradeType: string
}

export default function TemplateGallery({ tradeType }: TemplateGalleryProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'classic' | 'modern' | 'minimal' | 'bold'>('all')

  useEffect(() => {
    // Fetch 25 templates for selected trade
    setLoading(true)
    loadTemplates(tradeType)
      .then(setTemplates)
      .finally(() => setLoading(false))
  }, [tradeType])

  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(t => t.style === filter)

  const featuredTemplates = templates.filter(t => t.featured)
  const regularTemplates = templates.filter(t => !t.featured)

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            <span className="text-[#FFD700]">{tradeType.charAt(0).toUpperCase() + tradeType.slice(1)}</span> Resume Templates
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose from {templates.length} professionally designed, ATS-optimized resume templates
            tailored for {tradeType} positions.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(['all', 'classic', 'modern', 'minimal', 'bold'] as const).map(styleFilter => (
            <button
              key={styleFilter}
              onClick={() => setFilter(styleFilter)}
              className={`
                px-6 py-2 rounded-lg font-bold transition-all duration-300
                ${filter === styleFilter 
                  ? 'bg-[#FFD700] text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'}
              `}
            >
              {styleFilter.charAt(0).toUpperCase() + styleFilter.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700]"></div>
            <p className="text-gray-400 mt-4">Loading templates...</p>
          </div>
        )}

        {/* Template Gallery */}
        {!loading && (
          <div className="template-gallery">
            {/* Featured Templates */}
            {filter === 'all' && featuredTemplates.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>⭐</span> Featured Templates
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {featuredTemplates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      selected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Templates */}
            {filteredTemplates.length > 0 ? (
              <>
                {filter === 'all' && regularTemplates.length > 0 && (
                  <h3 className="text-2xl font-bold text-white mb-6">All Templates</h3>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {(filter === 'all' ? regularTemplates : filteredTemplates).map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      selected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No templates found for this filter.</p>
              </div>
            )}
          </div>
        )}

        {/* Preview Modal */}
        <PreviewModal 
          templateId={selectedTemplate} 
          onClose={() => setSelectedTemplate(null)}
        />

        {/* Bottom CTA */}
        {!loading && templates.length > 0 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => router.back()}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
            >
              ← Back to Trade Selection
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
