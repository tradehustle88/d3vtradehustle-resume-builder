'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ResumeData {
  // Step 1: Profile + Certifications
  fullName: string
  email: string
  phone: string
  location: string
  professionalSummary: string
  certifications: Certification[]
  profilePhoto: string | null
  
  // Step 2: Experience + Work History
  workExperience: WorkExperience[]
  
  // Step 3: Skills + Tools + Licenses
  skills: string[]
  tools: Tool[]
  licenses: License[]
  
  // Step 4: Education + References
  education: Education[]
  references: Reference[]
}

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
}

interface WorkExperience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  achievements: string[]
}

interface Tool {
  name: string
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

interface License {
  id: string
  type: string
  number: string
  state: string
  expiryDate: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationDate: string
}

interface Reference {
  id: string
  name: string
  title: string
  company: string
  phone: string
  email: string
}

interface EnhancedResumeBuilderProps {
  trade: string
  templateId: string
}

export default function EnhancedResumeBuilder({ trade, templateId }: EnhancedResumeBuilderProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    professionalSummary: '',
    certifications: [],
    profilePhoto: null,
    workExperience: [],
    skills: [],
    tools: [],
    licenses: [],
    education: [],
    references: []
  })

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const totalSteps = 4

  // AI-powered suggestions
  const getAISuggestions = async (field: string, value: string) => {
    setLoading(true)
    try {
      // Call to backend AI endpoint
      const response = await fetch('/api/getSuggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade, field, value })
      })
      const data = await response.json()
      setAiSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('AI suggestions error:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Navigate to preview
      router.push(`/preview?trade=${trade}&template=${templateId}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      achievements: ['']
    }
    setResumeData({
      ...resumeData,
      workExperience: [...resumeData.workExperience, newExp]
    })
  }

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setResumeData({
      ...resumeData,
      workExperience: resumeData.workExperience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    })
  }

  const addAchievement = (expId: string) => {
    setResumeData({
      ...resumeData,
      workExperience: resumeData.workExperience.map(exp =>
        exp.id === expId ? { ...exp, achievements: [...exp.achievements, ''] } : exp
      )
    })
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1 flex items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  ${currentStep >= step ? 'bg-[#E50914] text-white' : 'bg-gray-700 text-gray-400'}
                  transition-all duration-300
                `}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`
                    flex-1 h-2 mx-2
                    ${currentStep > step ? 'bg-[#E50914]' : 'bg-gray-700'}
                    transition-all duration-300
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Profile & Certs</span>
            <span>Experience</span>
            <span>Skills & Tools</span>
            <span>Education</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
          {/* STEP 1: Profile + Certifications */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                <span className="text-[#E50914]">Step 1:</span> Profile & Certifications
              </h2>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-bold mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={resumeData.fullName}
                    onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Email *</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    placeholder="john.smith@email.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Location *</label>
                  <input
                    type="text"
                    value={resumeData.location}
                    onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    placeholder="City, State"
                  />
                </div>
              </div>

              {/* Professional Summary */}
              <div>
                <label className="block text-white font-bold mb-2">Professional Summary</label>
                <textarea
                  value={resumeData.professionalSummary}
                  onChange={(e) => {
                    setResumeData({ ...resumeData, professionalSummary: e.target.value })
                    if (e.target.value.length > 50) {
                      getAISuggestions('summary', e.target.value)
                    }
                  }}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="Experienced electrician with 10+ years in residential and commercial installations..."
                />
                {loading && <p className="text-[#FFD700] text-sm mt-2">🤖 AI is generating suggestions...</p>}
              </div>

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-3">🤖 AI Suggestions:</h4>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setResumeData({ ...resumeData, professionalSummary: suggestion })}
                        className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Upload */}
              <div>
                <label className="block text-white font-bold mb-2">Professional Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#8B0000] file:text-white hover:file:bg-red-800"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Experience + Work History */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  <span className="text-[#E50914]">Step 2:</span> Work Experience
                </h2>
                <button
                  onClick={addWorkExperience}
                  className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-6 py-3 rounded-lg transition-all"
                >
                  + Add Job
                </button>
              </div>

              {resumeData.workExperience.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">💼</div>
                  <p className="text-xl mb-4">No work experience added yet</p>
                  <button
                    onClick={addWorkExperience}
                    className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-8 py-4 rounded-lg transition-all"
                  >
                    Add Your First Job
                  </button>
                </div>
              )}

              {resumeData.workExperience.map((exp, idx) => (
                <div key={exp.id} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-white font-bold text-xl mb-4">Position #{idx + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-white font-bold mb-2">Job Title *</label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => updateWorkExperience(exp.id, 'jobTitle', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                        placeholder="Master Electrician"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2">Company *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                        placeholder="ABC Electric Co."
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2">Start Date *</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2">End Date</label>
                      <input
                        type="month"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 mt-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateWorkExperience(exp.id, 'current', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Current position</span>
                      </label>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <label className="block text-white font-bold mb-2">Key Achievements</label>
                    {exp.achievements.map((achievement, achIdx) => (
                      <div key={achIdx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => {
                            const newAchievements = [...exp.achievements]
                            newAchievements[achIdx] = e.target.value
                            updateWorkExperience(exp.id, 'achievements', newAchievements)
                          }}
                          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                          placeholder="Led team of 5 electricians on $2M commercial project"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => addAchievement(exp.id)}
                      className="text-[#FFD700] hover:text-yellow-500 font-bold text-sm mt-2"
                    >
                      + Add Achievement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Skills + Tools + Licenses */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                <span className="text-[#E50914]">Step 3:</span> Skills, Tools & Licenses
              </h2>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-white font-bold text-xl mb-4">Technical Skills</h3>
                <p className="text-gray-400 mb-4">Add skills relevant to your trade (press Enter after each)</p>
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      setResumeData({
                        ...resumeData,
                        skills: [...resumeData.skills, e.currentTarget.value.trim()]
                      })
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-4"
                  placeholder="e.g., Residential Wiring, Blueprint Reading, Code Compliance"
                />
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, idx) => (
                    <span key={idx} className="bg-[#8B0000] text-white px-4 py-2 rounded-full flex items-center gap-2">
                      {skill}
                      <button
                        onClick={() => setResumeData({
                          ...resumeData,
                          skills: resumeData.skills.filter((_, i) => i !== idx)
                        })}
                        className="text-white hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center py-8 text-gray-400">
                <p>Tools & Licenses sections coming in next update...</p>
              </div>
            </div>
          )}

          {/* STEP 4: Education + References */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                <span className="text-[#E50914]">Step 4:</span> Education & References
              </h2>

              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">🎓</div>
                <p className="text-xl">Education & References sections coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
          >
            ← Previous
          </button>

          <button
            onClick={nextStep}
            className="px-8 py-4 bg-[#8B0000] hover:bg-red-800 text-white font-bold rounded-lg transition-all"
          >
            {currentStep === totalSteps ? 'Preview Resume →' : 'Next Step →'}
          </button>
        </div>

        {/* Save Progress Prompt */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-3">Want to save your progress?</p>
          <button
            onClick={() => router.push('/auth')}
            className="text-[#FFD700] hover:text-yellow-500 font-bold"
          >
            Sign In / Create Account
          </button>
        </div>
      </div>
    </section>
  )
}
