'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { auth, onAuthStateChanged } from '@/lib/firebase'
import HustleEngine from '@/components/HustleEngine'

/**
 * Complete Resume Builder Wizard Page
 * 
 * Usage:
 * - /wizard?trade=electrician
 * - /wizard?trade=plumber
 * - /wizard?trade=hvac&template=modern
 */

function WizardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const trade = searchParams.get('trade') || 'electrician'
  const templateId = searchParams.get('template') || 'classic-trade'
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        // Redirect to unlock page if not authenticated
        router.push('/unlock')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleWizardComplete = (resumeId: string) => {
    console.log('Resume created/updated:', resumeId)
    
    // Option 1: Redirect to dashboard
    router.push(`/dashboard?resume=${resumeId}`)
    
    // Option 2: Redirect to preview
    // router.push(`/preview/${resumeId}`)
    
    // Option 3: Show success message
    // alert('Resume saved successfully!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#001a33] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffd700] mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading wizard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to /unlock
  }

  return (
    <HustleEngine 
      tradeType={trade}
      templateId={templateId}
      onComplete={handleWizardComplete}
    />
  )
}

export default function WizardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#001a33] to-black flex items-center justify-center">
        <div className="text-white text-2xl">Preparing your resume builder...</div>
      </div>
    }>
      <WizardContent />
    </Suspense>
  )
}
