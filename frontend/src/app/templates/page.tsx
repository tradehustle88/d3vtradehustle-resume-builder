'use client'
import { Suspense } from 'react'
import TemplateGallery from '@/components/TemplateGallery'

export default function TemplatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading templates...</div>
      </div>
    }>
      <TemplateGallery />
    </Suspense>
  )
}
