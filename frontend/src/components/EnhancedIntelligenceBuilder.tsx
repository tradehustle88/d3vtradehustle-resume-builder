'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Types
interface Resume {
  profile: {
    fullName: string
    email: string
    phone: string
    location: string
    trade: string
    yearsExperience: number
    summary: string
  }
  certifications: Array<{
    id: string
    name: string
    issuer: string
    dateObtained: string
    expiryDate?: string
    licenseNumber?: string
  }>
  experience: Array<{
    id: string
    jobTitle: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    responsibilities: string[]
    achievements: string[]
  }>
  skills: {
    technical: string[]
    tools: string[]
    licenses: string[]
    safety: string[]
  }
  education: Array<{
    id: string
    degree: string
    school: string
    location: string
    graduationDate: string
  }>
  references: Array<{
    id: string
    name: string
    relationship: string
    company: string
    phone: string
    email: string
  }>
}

interface Step {
  number: number
  title: string
  description: string
}

// Step Components
function ProfileStep({ data, onChange }: { data: Resume; onChange: (data: Resume) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">Profile Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-bold mb-2">Full Name *</label>
          <input
            type="text"
            value={data.profile?.fullName || ''}
            onChange={(e) => onChange({ ...data, profile: { ...data.profile, fullName: e.target.value } as any })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-white font-bold mb-2">Email *</label>
          <input
            type="email"
            value={data.profile?.email || ''}
            onChange={(e) => onChange({ ...data, profile: { ...data.profile, email: e.target.value } as any })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-white font-bold mb-2">Phone *</label>
          <input
            type="tel"
            value={data.profile?.phone || ''}
            onChange={(e) => onChange({ ...data, profile: { ...data.profile, phone: e.target.value } as any })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-white font-bold mb-2">Location *</label>
          <input
            type="text"
            value={data.profile?.location || ''}
            onChange={(e) => onChange({ ...data, profile: { ...data.profile, location: e.target.value } as any })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="City, State"
          />
        </div>
        <div>
          <label className="block text-white font-bold mb-2">Trade *</label>
          <input
            type="text"
            value={data.profile?.trade || ''}
            onChange={(e) => onChange({ ...data, profile: { ...data.profile, trade: e.target.value } as any })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="Electrician"
          />
        </div>
        <div>
          <label className="block text-white font-bold mb-2">Years of Experience</label>
          <input
            type="number"
            value={data.profile?.yearsExperience || 0}
            onChange={(e) => onChange({ ...data, profile: { ...data.profile, yearsExperience: parseInt(e.target.value) } as any })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="5"
          />
        </div>
      </div>

      <div>
        <label className="block text-white font-bold mb-2">Professional Summary</label>
        <textarea
          value={data.profile?.summary || ''}
          onChange={(e) => onChange({ ...data, profile: { ...data.profile, summary: e.target.value } as any })}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
          rows={4}
          placeholder="Brief overview of your experience and expertise..."
        />
      </div>

      <div className="mt-8">
        <h4 className="text-xl font-bold text-white mb-4">Certifications & Licenses</h4>
        <button className="px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-yellow-500">
          + Add Certification
        </button>
      </div>
    </div>
  )
}

function ExperienceStep({ data, onChange }: { data: Resume; onChange: (data: Resume) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">Work Experience</h3>
      <p className="text-gray-400 mb-6">Add your work history, starting with your most recent position.</p>
      
      <button className="px-6 py-3 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-yellow-500">
        + Add Work Experience
      </button>
      
      <div className="text-gray-400 text-center py-10">
        No work experience added yet. Click the button above to add your first position.
      </div>
    </div>
  )
}

function SkillsStep({ data, onChange }: { data: Resume; onChange: (data: Resume) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">Skills, Tools & Licenses</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-white font-bold mb-2">Technical Skills</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="e.g., Wiring, Troubleshooting, Blueprint Reading"
          />
        </div>
        
        <div>
          <label className="block text-white font-bold mb-2">Tools & Equipment</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="e.g., Multimeter, Conduit Bender, Wire Stripper"
          />
        </div>
        
        <div>
          <label className="block text-white font-bold mb-2">Professional Licenses</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="e.g., Master Electrician License #12345"
          />
        </div>
        
        <div>
          <label className="block text-white font-bold mb-2">Safety Certifications</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
            placeholder="e.g., OSHA 30, CPR, First Aid"
          />
        </div>
      </div>
    </div>
  )
}

function EducationStep({ data, onChange }: { data: Resume; onChange: (data: Resume) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">Education & References</h3>
      
      <div className="mb-8">
        <h4 className="text-xl font-bold text-white mb-4">Education</h4>
        <button className="px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-yellow-500">
          + Add Education
        </button>
      </div>
      
      <div>
        <h4 className="text-xl font-bold text-white mb-4">Professional References</h4>
        <button className="px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-yellow-500">
          + Add Reference
        </button>
      </div>
    </div>
  )
}

// UI Components
function StepIndicator({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${currentStep >= step.number ? 'bg-[#FFD700] text-black' : 'bg-gray-700 text-gray-400'}
              `}
            >
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <div className="text-xs mt-2 text-center max-w-[100px]">
              <div className={`font-bold ${currentStep >= step.number ? 'text-white' : 'text-gray-400'}`}>
                {step.title}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 ${currentStep > step.number ? 'bg-[#FFD700]' : 'bg-gray-700'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function StepContent({ step, data, onChange }: { step: number; data: Resume; onChange: (data: Resume) => void }) {
  const components = [ProfileStep, ExperienceStep, SkillsStep, EducationStep]
  const Component = components[step - 1]
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 min-h-[500px]">
      <Component data={data} onChange={onChange} />
    </div>
  )
}

function NavigationButtons({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev 
}: { 
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void 
}) {
  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={onPrev}
        disabled={currentStep === 1}
        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
      >
        ← Previous
      </button>
      <button
        onClick={onNext}
        className="px-6 py-3 bg-[#FFD700] hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors"
      >
        {currentStep === totalSteps ? 'Generate Resume →' : 'Next →'}
      </button>
    </div>
  )
}

function LivePreview({ data, templateId }: { data: Resume; templateId: string | null }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-4">
      <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>
      <div className="aspect-[8.5/11] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-gray-800 text-sm">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">{data.profile?.fullName || 'Your Name'}</h1>
            <p className="text-gray-600">{data.profile?.email || 'email@example.com'} | {data.profile?.phone || '(555) 123-4567'}</p>
            <p className="text-gray-600">{data.profile?.location || 'City, State'}</p>
          </div>
          
          {data.profile?.summary && (
            <div className="mb-4">
              <h2 className="text-lg font-bold border-b-2 border-gray-300 mb-2">Professional Summary</h2>
              <p className="text-xs">{data.profile.summary}</p>
            </div>
          )}
          
          <div className="text-xs text-gray-400 text-center mt-8">
            Continue filling out the form to see your resume update in real-time...
          </div>
        </div>
      </div>
    </div>
  )
}

function ATSScoreMeter({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Good'
    return 'Needs Improvement'
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-4">
      <h3 className="text-lg font-bold text-white mb-4">ATS Score</h3>
      <div className="text-center">
        <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </div>
        <div className="text-gray-400 mt-2">{getScoreLabel(score)}</div>
        <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function IntelligenceSuggestions({ data }: { data: Resume }) {
  const suggestions = [
    { icon: '💡', text: 'Add specific certifications to boost your ATS score', action: 'Add Now' },
    { icon: '⚡', text: 'Include measurable achievements in your experience', action: 'Learn How' },
    { icon: '🎯', text: 'Use industry-specific keywords for better matching', action: 'View Keywords' },
  ]

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4">AI Suggestions</h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-gray-900 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{suggestion.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-2">{suggestion.text}</p>
                <button className="text-xs text-[#FFD700] hover:text-yellow-500 font-bold">
                  {suggestion.action} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Real-time ATS scoring function
async function calculateATSScore(data: Resume): Promise<number> {
  // TODO: Integrate with Gemini API for real-time scoring
  // For now, return a mock score based on completion
  let score = 0
  
  if (data.profile?.fullName) score += 10
  if (data.profile?.email) score += 10
  if (data.profile?.phone) score += 10
  if (data.profile?.summary) score += 20
  if (data.certifications?.length > 0) score += 15
  if (data.experience?.length > 0) score += 20
  if (data.skills) score += 10
  if (data.education?.length > 0) score += 5
  
  return Math.min(score, 100)
}

// Main Component
export default function EnhancedIntelligenceBuilder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedTemplate = searchParams.get('template')
  
  const [currentStep, setCurrentStep] = useState(1)
  const [resumeData, setResumeData] = useState<Resume>({
    profile: {} as any,
    certifications: [],
    experience: [],
    skills: { technical: [], tools: [], licenses: [], safety: [] },
    education: [],
    references: []
  })
  const [atsScore, setAtsScore] = useState(0)

  const steps: Step[] = [
    { number: 1, title: 'Profile + Certifications', description: 'Basic information and credentials' },
    { number: 2, title: 'Experience + Work History', description: 'Your work experience' },
    { number: 3, title: 'Skills + Tools + Licenses', description: 'Technical abilities' },
    { number: 4, title: 'Education + References', description: 'Education and contacts' },
  ]

  // Real-time ATS scoring via Gemini
  useEffect(() => {
    calculateATSScore(resumeData).then(setAtsScore)
  }, [resumeData])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Generate and download resume
      console.log('Generate resume with data:', resumeData)
      // TODO: Implement resume generation
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Build Your <span className="text-[#FFD700]">Resume</span>
          </h1>
          <p className="text-xl text-gray-300">
            AI-powered resume builder with real-time ATS scoring
          </p>
        </div>

        {/* Builder Interface */}
        <div className="builder-interface grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Form Steps (8 cols on desktop) */}
          <div className="lg:col-span-8">
            <StepIndicator steps={steps} currentStep={currentStep} />
            <StepContent
              step={currentStep}
              data={resumeData}
              onChange={setResumeData}
            />
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={steps.length}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>

          {/* Right: Live Preview (4 cols on desktop) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-20">
              <LivePreview data={resumeData} templateId={selectedTemplate} />
              <ATSScoreMeter score={atsScore} />
              <IntelligenceSuggestions data={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
