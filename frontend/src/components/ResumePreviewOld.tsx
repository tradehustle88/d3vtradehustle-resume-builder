'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ATSAnalysis {
  score: number
  keywords: { found: string[]; missing: string[] }
  formatting: { passed: boolean; issues: string[] }
  suggestions: string[]
}

interface ResumePreviewProps {
  resumeData: any
  trade: string
  templateId: string
}

export default function ResumePreview({ resumeData, trade, templateId }: ResumePreviewProps) {
  const router = useRouter()
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis>({
    score: 0,
    keywords: { found: [], missing: [] },
    formatting: { passed: true, issues: [] },
    suggestions: []
  })
  const [loading, setLoading] = useState(true)
  const [showPricingModal, setShowPricingModal] = useState(false)

  useEffect(() => {
    // Simulate ATS analysis
    analyzeResume()
  }, [resumeData])

  const analyzeResume = async () => {
    setLoading(true)
    
    // Simulate analysis (in production, call backend AI endpoint)
    setTimeout(() => {
      const mockAnalysis: ATSAnalysis = {
        score: calculateATSScore(),
        keywords: {
          found: ['Licensed', 'Certified', 'Safety', 'Code Compliance', 'Project Management'],
          missing: ['OSHA', 'Blueprint Reading', 'Quality Control', 'Team Leadership']
        },
        formatting: {
          passed: true,
          issues: []
        },
        suggestions: [
          'Add more quantifiable achievements (numbers, percentages)',
          'Include relevant trade certifications in prominent location',
          'Use action verbs: Led, Managed, Completed, Installed',
          'Mention specific tools and equipment expertise'
        ]
      }
      setAtsAnalysis(mockAnalysis)
      setLoading(false)
    }, 1500)
  }

  const calculateATSScore = (): number => {
    let score = 50 // Base score
    
    if (resumeData.fullName) score += 5
    if (resumeData.email) score += 5
    if (resumeData.phone) score += 5
    if (resumeData.professionalSummary?.length > 50) score += 10
    if (resumeData.workExperience?.length > 0) score += 15
    if (resumeData.skills?.length >= 5) score += 10
    
    return Math.min(score, 100)
  }

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBgColor = (score: number): string => {
    if (score >= 90) return 'from-green-600 to-green-800'
    if (score >= 70) return 'from-yellow-600 to-yellow-800'
    return 'from-red-600 to-red-800'
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-blue-50/30 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Resume <span className="text-[#E50914]">Preview</span>
          </h2>
          <p className="text-xl text-gray-300">
            Review your resume and check your ATS compatibility score
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: ATS Analysis */}
          <div className="lg:col-span-1 space-y-6">
            {/* ATS Score Card */}
            <div className={`bg-gradient-to-br ${getScoreBgColor(atsAnalysis.score)} rounded-xl p-8 text-center border-4 border-white/20`}>
              <div className="text-white/80 font-bold text-lg mb-2">ATS Compatibility Score</div>
              <div className={`text-7xl font-extrabold ${getScoreColor(atsAnalysis.score)} mb-4`}>
                {loading ? '...' : atsAnalysis.score}
              </div>
              <div className="text-white text-sm">
                {atsAnalysis.score >= 90 && '🎯 Excellent! Your resume is ATS-optimized'}
                {atsAnalysis.score >= 70 && atsAnalysis.score < 90 && '👍 Good! A few improvements recommended'}
                {atsAnalysis.score < 70 && '⚠️ Needs Work - Follow suggestions below'}
              </div>
            </div>

            {/* Keyword Optimization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <span>🔍</span> Keyword Analysis
              </h3>
              
              <div className="mb-4">
                <h4 className="text-green-500 font-bold mb-2">✓ Found Keywords ({atsAnalysis.keywords.found.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {atsAnalysis.keywords.found.map((keyword, idx) => (
                    <span key={idx} className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-yellow-500 font-bold mb-2">⚠ Missing Keywords ({atsAnalysis.keywords.missing.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {atsAnalysis.keywords.missing.map((keyword, idx) => (
                    <span key={idx} className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-[#FFD700] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(atsAnalysis.keywords.found.length / (atsAnalysis.keywords.found.length + atsAnalysis.keywords.missing.length)) * 100}%` }}
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2 text-center">
                  Keyword Match Rate
                </p>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <span>🤖</span> AI Suggestions
              </h3>
              <ul className="space-y-3">
                {atsAnalysis.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-300 text-sm">
                    <span className="text-blue-400 font-bold flex-shrink-0">{idx + 1}.</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formatting Check */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <span>📋</span> Format Check
              </h3>
              {atsAnalysis.formatting.passed ? (
                <div className="flex items-center gap-2 text-green-500">
                  <span className="text-2xl">✓</span>
                  <span className="font-bold">All formatting checks passed!</span>
                </div>
              ) : (
                <ul className="space-y-2">
                  {atsAnalysis.formatting.issues.map((issue, idx) => (
                    <li key={idx} className="flex gap-2 text-yellow-500 text-sm">
                      <span>⚠</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column: Resume Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Resume Document Preview */}
              <div className="p-12 min-h-[1100px] bg-white text-black">
                {/* Header */}
                <div className="border-b-4 border-gray-800 pb-6 mb-6">
                  <h1 className="text-4xl font-bold mb-2">{resumeData.fullName || 'YOUR NAME'}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    {resumeData.email && <span>✉ {resumeData.email}</span>}
                    {resumeData.phone && <span>📞 {resumeData.phone}</span>}
                    {resumeData.location && <span>📍 {resumeData.location}</span>}
                  </div>
                </div>

                {/* Professional Summary */}
                {resumeData.professionalSummary && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">PROFESSIONAL SUMMARY</h2>
                    <p className="text-gray-700 leading-relaxed">{resumeData.professionalSummary}</p>
                  </div>
                )}

                {/* Work Experience */}
                {resumeData.workExperience?.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">WORK EXPERIENCE</h2>
                    {resumeData.workExperience.map((exp: any, idx: number) => (
                      <div key={idx} className="mb-4">
                        <h3 className="text-xl font-bold">{exp.jobTitle}</h3>
                        <div className="text-gray-600 mb-2">
                          <span className="font-semibold">{exp.company}</span>
                          {exp.location && <span> • {exp.location}</span>}
                          <span> • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        {exp.achievements?.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {exp.achievements.filter((a: string) => a.trim()).map((achievement: string, achIdx: number) => (
                              <li key={achIdx}>{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {resumeData.skills?.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">SKILLS</h2>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="bg-gray-200 px-3 py-1 rounded text-gray-800 font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placeholder for empty resume */}
                {!resumeData.fullName && (
                  <div className="text-center py-20 text-gray-400">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-xl">Your resume preview will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => router.back()}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-all"
              >
                ← Edit Resume
              </button>
              <button
                onClick={() => setShowPricingModal(true)}
                className="flex-1 bg-[#8B0000] hover:bg-red-800 text-white font-bold py-4 rounded-lg transition-all"
              >
                Download Resume →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal Trigger */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-8">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Download?</h3>
            <p className="text-gray-300 mb-6">Choose your download option to continue</p>
            <button
              onClick={() => {
                setShowPricingModal(false)
                router.push('/pricing')
              }}
              className="w-full bg-[#8B0000] hover:bg-red-800 text-white font-bold py-4 rounded-lg mb-4"
            >
              View Pricing Options →
            </button>
            <button
              onClick={() => setShowPricingModal(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
