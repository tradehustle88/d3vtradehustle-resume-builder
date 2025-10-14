'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import TemplateGallery from '@/components/TemplateGallery'

function TemplatesContent() {
  const searchParams = useSearchParams()
  const trade = searchParams.get('trade') || 'electrician'
  const customTradeName = searchParams.get('name')

  return <TemplateGallery trade={trade} customTradeName={customTradeName || undefined} />
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading templates...</div>
      </div>
    }>
      <TemplatesContent />
    </Suspense>
  )
}
