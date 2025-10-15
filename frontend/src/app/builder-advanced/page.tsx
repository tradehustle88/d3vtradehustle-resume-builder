'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { auth, onAuthStateChanged } from '@/lib/firebase'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import HustleEngine from '@/components/HustleEngine'
import ResumePreview from '@/components/ResumePreview'
import { Resume } from '@/types/database'

/**
 * Advanced Resume Builder with Live Preview
 * 
 * Features:
 * - Side-by-side wizard and preview
 * - Real-time ATS scoring
 * - Edit existing resumes
 * - Responsive layout
 * 
 * Usage:
 * - /builder-advanced?trade=electrician (new resume)
 * - /builder-advanced?resumeId=abc123 (edit existing)
 */

function BuilderAdvancedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const trade = searchParams.get('trade') || 'electrician'
  const resumeId = searchParams.get('resumeId')
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [existingResume, setExistingResume] = useState<Resume | null>(null)
  const [previewData, setPreviewData] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true)
        
        // Load existing resume if resumeId provided
        if (resumeId) {
          await loadExistingResume(resumeId)
        }
      } else {
        router.push('/unlock')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, resumeId])

  const loadExistingResume = async (id: string) => {
    try {
      const resumeRef = doc(db, 'resumes', id)
      const resumeSnap = await getDoc(resumeRef)
      
      if (resumeSnap.exists()) {
        const resumeData = { id: resumeSnap.id, ...resumeSnap.data() } as Resume
        setExistingResume(resumeData)
        setPreviewData(resumeData)
        setShowPreview(true)
      }
    } catch (error) {
      console.error('Error loading resume:', error)
    }
  }

  const handleWizardComplete = async (newResumeId: string) => {
    console.log('Resume saved:', newResumeId)
    
    // Load the saved resume for preview
    await loadExistingResume(newResumeId)
    
    // Show success notification
    alert('Resume saved successfully! 🎉')
    
    // Optional: redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push(`/dashboard?resume=${newResumeId}`)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#001a33] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffd700] mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading builder...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a33] to-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-2xl font-bold text-white">
            {existingResume ? 'Edit Resume' : 'Create Resume'}
          </h1>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-yellow-600 transition lg:hidden"
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Wizard */}
          <div className={`${showPreview ? 'hidden lg:block' : ''}`}>
            <HustleEngine
              tradeType={existingResume?.tradeType || trade}
              templateId={existingResume?.templateId}
              existingResume={existingResume || undefined}
              onComplete={handleWizardComplete}
            />
          </div>

          {/* Right Column: Live Preview */}
          <div className={`${!showPreview ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-24">
              {previewData ? (
                <div>
                  <div className="mb-4 text-center">
                    <span className="inline-block px-4 py-2 bg-gray-800 text-white rounded-full text-sm">
                      📊 Live Preview
                    </span>
                  </div>
                  <ResumePreview
                    resumeData={previewData}
                    trade={existingResume?.tradeType || trade}
                    templateId={existingResume?.templateId || 'classic-trade'}
                  />
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Live Preview
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Your resume will appear here as you fill out the form
                  </p>
                  <div className="flex flex-col items-center gap-2 text-gray-500 text-sm">
                    <span>✓ Real-time ATS scoring</span>
                    <span>✓ Professional formatting</span>
                    <span>✓ Instant PDF export</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Help */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-800 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="text-white font-bold mb-2">Need Help?</h4>
            <p className="text-gray-400 text-sm">
              Use AI Assistant for suggestions and improvements
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="text-white font-bold mb-2">ATS Optimization</h4>
            <p className="text-gray-400 text-sm">
              Get a score of 90+ to beat applicant tracking systems
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-2">📥</div>
            <h4 className="text-white font-bold mb-2">Export Options</h4>
            <p className="text-gray-400 text-sm">
              Download as PDF, Word, or plain text format
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BuilderAdvancedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#001a33] to-black flex items-center justify-center">
        <div className="text-white text-2xl">Preparing advanced builder...</div>
      </div>
    }>
      <BuilderAdvancedContent />
    </Suspense>
  )
}
