'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import EnhancedResumeBuilder from '@/components/EnhancedResumeBuilder'

function BuilderContent() {
  const searchParams = useSearchParams()
  const trade = searchParams.get('trade') || 'electrician'
  const templateId = searchParams.get('template') || 'default'

  return <EnhancedResumeBuilder trade={trade} templateId={templateId} />
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading builder...</div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  )
}
