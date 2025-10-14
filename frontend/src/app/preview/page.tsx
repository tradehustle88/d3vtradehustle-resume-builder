'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ResumePreview from '@/components/ResumePreview'

function PreviewContent() {
  const searchParams = useSearchParams()
  const trade = searchParams.get('trade') || 'electrician'
  const templateId = searchParams.get('template') || 'default'

  // In production, fetch actual resume data from state/storage
  const mockResumeData = {
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    location: 'New York, NY',
    professionalSummary: 'Experienced electrician with 10+ years in residential and commercial installations.',
    workExperience: [],
    skills: ['Residential Wiring', 'Commercial Installations', 'Code Compliance']
  }

  return <ResumePreview resumeData={mockResumeData} trade={trade} templateId={templateId} />
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading preview...</div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
