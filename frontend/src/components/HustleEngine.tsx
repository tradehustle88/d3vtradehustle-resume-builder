'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { Resume, WorkExperience, TechnicalSkill, License, Certification, Education, Reference } from '@/types/database'
import { trackEvent } from '@/lib/analytics'

interface WizardStep {
  id: number
  title: string
  description: string
  icon: string
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Profile & Contact',
    description: 'Your basic information and how employers can reach you',
    icon: '👤'
  },
  {
    id: 2,
    title: 'Work Experience',
    description: 'Your trade history and accomplishments',
    icon: '🔧'
  },
  {
    id: 3,
    title: 'Skills & Certifications',
    description: 'Technical skills, licenses, and credentials',
    icon: '🏆'
  },
  {
    id: 4,
    title: 'Education & References',
    description: 'Your education background and professional references',
    icon: '🎓'
  }
]

interface HustleEngineProps {
  tradeType: string
  templateId?: string
  onComplete?: (resumeId: string) => void
  existingResume?: Partial<Resume>
}

export default function HustleEngine({ 
  tradeType, 
  templateId = 'classic-trade',
  onComplete,
  existingResume 
}: HustleEngineProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null)

  // Form State - Step 1: Profile & Contact
  const [profile, setProfile] = useState({
    fullName: existingResume?.profile?.fullName || '',
    email: existingResume?.profile?.email || '',
    phone: existingResume?.profile?.phone || '',
    location: existingResume?.profile?.location || '',
    summary: existingResume?.profile?.summary || '',
    linkedIn: existingResume?.profile?.linkedIn || '',
    portfolio: existingResume?.profile?.portfolio || ''
  })

  // Form State - Step 2: Work Experience
  const [experience, setExperience] = useState<WorkExperience[]>(
    existingResume?.experience || [{
      id: crypto.randomUUID(),
      companyName: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: [''],
      achievements: [],
      atsOptimized: false
    }]
  )

  // Form State - Step 3: Skills & Certifications
  const [skills, setSkills] = useState({
    technical: existingResume?.skills?.technical || [] as TechnicalSkill[],
    licenses: existingResume?.skills?.licenses || [] as License[],
    certifications: existingResume?.skills?.certifications || [] as Certification[]
  })

  const [newSkill, setNewSkill] = useState('')
  const [newLicense, setNewLicense] = useState({ name: '', number: '', issuingAuthority: '', expirationDate: '', issueDate: '' })
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', dateObtained: '', expirationDate: '' })

  // Form State - Step 4: Education & References
  const [education, setEducation] = useState<Education[]>(
    existingResume?.education || [{
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: undefined,
      honors: []
    }]
  )

  const [references, setReferences] = useState<Reference[]>(
    existingResume?.references || [{
      id: crypto.randomUUID(),
      name: '',
      title: '',
      relationship: '',
      company: '',
      phone: '',
      email: ''
    }]
  )

  // Initialize form with existing resume data
  useEffect(() => {
    if (existingResume) {
      trackEvent('resume_edit_started', { tradeType })
    } else {
      trackEvent('resume_wizard_started', { tradeType })
    }
  }, [])

  // Validation Functions
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!profile.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!profile.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!profile.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!profile.location.trim()) newErrors.location = 'Location is required'
    if (!profile.summary.trim()) newErrors.summary = 'Professional summary is required'
    else if (profile.summary.length < 50) {
      newErrors.summary = 'Summary should be at least 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (experience.length === 0) {
      newErrors.experience = 'At least one work experience entry is required'
    } else {
      experience.forEach((exp, idx) => {
        if (!exp.companyName.trim()) newErrors[`exp${idx}_company`] = 'Company name required'
        if (!exp.position.trim()) newErrors[`exp${idx}_position`] = 'Position required'
        if (!exp.startDate) newErrors[`exp${idx}_startDate`] = 'Start date required'
        if (!exp.current && !exp.endDate) newErrors[`exp${idx}_endDate`] = 'End date required'
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (skills.technical.length === 0) {
      newErrors.skills = 'Add at least 3 technical skills'
    } else if (skills.technical.length < 3) {
      newErrors.skills = 'Add at least 3 technical skills for better ATS scoring'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep4 = (): boolean => {
    // Step 4 is optional, so always return true
    return true
  }

  // Navigation Functions
  const nextStep = () => {
    let isValid = false

    switch (currentStep) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
      case 4:
        isValid = validateStep4()
        break
    }

    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
        trackEvent('wizard_step_completed', { step: currentStep, tradeType })
      } else {
        handleSaveResume()
      }
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Save Resume to Firestore
  const handleSaveResume = async () => {
    if (!auth.currentUser) {
      alert('You must be logged in to save your resume')
      router.push('/unlock')
      return
    }

    setLoading(true)
    try {
      const resumeData: Omit<Resume, 'id'> = {
        userId: auth.currentUser.uid,
        templateId,
        tradeType,
        title: `${profile.fullName} - ${tradeType} Resume`,
        profile: {
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          summary: profile.summary,
          linkedIn: profile.linkedIn,
          portfolio: profile.portfolio
        },
        experience,
        skills: {
          technical: skills.technical,
          tools: [], // Can be extended later
          licenses: skills.licenses,
          certifications: skills.certifications
        },
        education,
        references,
        atsScore: 0, // Will be calculated by backend
        aiOptimized: false,
        versions: existingResume ? (existingResume.versions || 1) + 1 : 1,
        lastModified: Timestamp.now(),
        createdAt: existingResume?.createdAt || Timestamp.now(),
        shareEnabled: false,
        downloads: existingResume?.downloads || 0,
        views: existingResume?.views || 0
      }

      let resumeId: string

      if (savedResumeId || existingResume?.id) {
        // Update existing resume
        resumeId = savedResumeId || existingResume!.id
        const resumeRef = doc(db, 'resumes', resumeId)
        await updateDoc(resumeRef, resumeData as any)
        trackEvent('resume_updated', { resumeId, tradeType })
      } else {
        // Create new resume
        const docRef = await addDoc(collection(db, 'resumes'), resumeData)
        resumeId = docRef.id
        setSavedResumeId(resumeId)
        trackEvent('resume_created', { resumeId, tradeType })
      }

      // Success!
      if (onComplete) {
        onComplete(resumeId)
      } else {
        router.push(`/dashboard?resume=${resumeId}`)
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Experience Management
  const addExperience = () => {
    setExperience([...experience, {
      id: crypto.randomUUID(),
      companyName: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: [''],
      achievements: []
    }])
  }

  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id))
  }

  const updateExperience = (id: string, field: string, value: any) => {
    setExperience(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const addResponsibility = (expId: string) => {
    setExperience(experience.map(exp => 
      exp.id === expId 
        ? { ...exp, responsibilities: [...exp.responsibilities, ''] }
        : exp
    ))
  }

  const updateResponsibility = (expId: string, index: number, value: string) => {
    setExperience(experience.map(exp => {
      if (exp.id === expId) {
        const newResp = [...exp.responsibilities]
        newResp[index] = value
        return { ...exp, responsibilities: newResp }
      }
      return exp
    }))
  }

  const removeResponsibility = (expId: string, index: number) => {
    setExperience(experience.map(exp => {
      if (exp.id === expId) {
        return { 
          ...exp, 
          responsibilities: exp.responsibilities.filter((_, i) => i !== index) 
        }
      }
      return exp
    }))
  }

  // Skills Management
  const addSkill = () => {
    if (newSkill.trim()) {
      const skill: TechnicalSkill = {
        id: crypto.randomUUID(),
        name: newSkill.trim(),
        category: 'technical',
        proficiency: 'intermediate',
        yearsOfExperience: 1
      }
      setSkills({ ...skills, technical: [...skills.technical, skill] })
      setNewSkill('')
    }
  }

  const removeSkill = (id: string) => {
    setSkills({
      ...skills,
      technical: skills.technical.filter(s => s.id !== id)
    })
  }

  const addLicense = () => {
    if (newLicense.name.trim()) {
      const license: License = {
        id: crypto.randomUUID(),
        name: newLicense.name,
        number: newLicense.number,
        issuer: newLicense.issuer,
        issueDate: '',
        expiryDate: newLicense.expiryDate,
        verified: false
      }
      setSkills({ ...skills, licenses: [...skills.licenses, license] })
      setNewLicense({ name: '', number: '', issuer: '', expiryDate: '' })
    }
  }

  const removeLicense = (id: string) => {
    setSkills({
      ...skills,
      licenses: skills.licenses.filter(l => l.id !== id)
    })
  }

  const addCertification = () => {
    if (newCertification.name.trim()) {
      const cert: Certification = {
        id: crypto.randomUUID(),
        name: newCertification.name,
        issuer: newCertification.issuer,
        issueDate: newCertification.issueDate,
        expiryDate: newCertification.expiryDate,
        credentialID: '',
        credentialURL: ''
      }
      setSkills({ ...skills, certifications: [...skills.certifications, cert] })
      setNewCertification({ name: '', issuer: '', issueDate: '', expiryDate: '' })
    }
  }

  const removeCertification = (id: string) => {
    setSkills({
      ...skills,
      certifications: skills.certifications.filter(c => c.id !== id)
    })
  }

  // Education Management
  const addEducation = () => {
    setEducation([...education, {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      graduationDate: '',
      gpa: undefined,
      honors: []
    }])
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id))
  }

  const updateEducation = (id: string, field: string, value: any) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  // References Management
  const addReference = () => {
    setReferences([...references, {
      id: crypto.randomUUID(),
      name: '',
      relationship: '',
      company: '',
      phone: '',
      email: ''
    }])
  }

  const removeReference = (id: string) => {
    setReferences(references.filter(ref => ref.id !== id))
  }

  const updateReference = (id: string, field: string, value: any) => {
    setReferences(references.map(ref => 
      ref.id === id ? { ...ref, [field]: value } : ref
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a33] via-gray-900 to-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Build Your <span className="text-[#ffd700]">Trade Resume</span>
          </h1>
          <p className="text-xl text-gray-300">
            {existingResume ? 'Update your resume' : 'Create your professional resume in 4 easy steps'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {WIZARD_STEPS.map((step, idx) => (
              <div key={step.id} className="flex-1 relative">
                {/* Step Circle */}
                <div 
                  className={`
                    relative z-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl
                    ${currentStep >= step.id 
                      ? 'bg-gradient-to-r from-[#ffd700] to-yellow-600 text-black' 
                      : 'bg-gray-700 text-gray-400'
                    }
                    transition-all duration-300
                  `}
                >
                  {step.icon}
                </div>
                
                {/* Connecting Line */}
                {idx < WIZARD_STEPS.length - 1 && (
                  <div 
                    className={`
                      absolute top-8 left-1/2 w-full h-1
                      ${currentStep > step.id ? 'bg-[#ffd700]' : 'bg-gray-700'}
                      transition-all duration-300
                    `}
                  />
                )}

                {/* Step Label */}
                <div className="text-center mt-3">
                  <p className={`font-bold ${currentStep >= step.id ? 'text-[#ffd700]' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700">
          {/* Step 1: Profile & Contact */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Profile & Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                    placeholder="City, State"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn (Optional)
                  </label>
                  <input
                    type="url"
                    value={profile.linkedIn}
                    onChange={(e) => setProfile({ ...profile, linkedIn: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Portfolio/Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={profile.portfolio}
                    onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Professional Summary <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-2">
                    ({profile.summary.length} / 300+ recommended)
                  </span>
                </label>
                <textarea
                  value={profile.summary}
                  onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                  placeholder="Write a compelling summary that highlights your experience, skills, and what makes you stand out..."
                />
                {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
                <p className="text-gray-400 text-sm mt-2">
                  💡 Tip: Include years of experience, specialties, and key achievements
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Work Experience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Work Experience</h2>
                <button
                  onClick={addExperience}
                  className="px-4 py-2 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-yellow-600 transition"
                >
                  + Add Experience
                </button>
              </div>

              {errors.experience && <p className="text-red-500 mb-4">{errors.experience}</p>}

              {experience.map((exp, expIdx) => (
                <div key={exp.id} className="bg-gray-700 rounded-lg p-6 relative">
                  {experience.length > 1 && (
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-400"
                    >
                      ✕ Remove
                    </button>
                  )}

                  <h3 className="text-xl font-bold text-[#ffd700] mb-4">Experience #{expIdx + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.companyName}
                        onChange={(e) => updateExperience(exp.id, 'companyName', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="ABC Construction"
                      />
                      {errors[`exp${expIdx}_company`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`exp${expIdx}_company`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Master Electrician"
                      />
                      {errors[`exp${expIdx}_position`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`exp${expIdx}_position`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      />
                      {errors[`exp${expIdx}_startDate`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`exp${expIdx}_startDate`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Date {!exp.current && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none disabled:opacity-50"
                      />
                      <label className="flex items-center mt-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="mr-2"
                        />
                        Currently working here
                      </label>
                      {errors[`exp${expIdx}_endDate`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`exp${expIdx}_endDate`]}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Key Responsibilities
                    </label>
                    {exp.responsibilities.map((resp, respIdx) => (
                      <div key={respIdx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => updateResponsibility(exp.id, respIdx, e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                          placeholder="Led installation of commercial electrical systems..."
                        />
                        {exp.responsibilities.length > 1 && (
                          <button
                            onClick={() => removeResponsibility(exp.id, respIdx)}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addResponsibility(exp.id)}
                      className="mt-2 text-[#ffd700] hover:text-yellow-600 text-sm"
                    >
                      + Add Responsibility
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Skills & Certifications */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">Skills & Certifications</h2>

              {/* Technical Skills */}
              <div>
                <h3 className="text-xl font-bold text-[#ffd700] mb-4">
                  Technical Skills <span className="text-red-500">*</span>
                </h3>
                {errors.skills && <p className="text-red-500 mb-4">{errors.skills}</p>}
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                    placeholder="e.g., Electrical Wiring, Blueprint Reading, Code Compliance"
                  />
                  <button
                    onClick={addSkill}
                    className="px-6 py-2 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-yellow-600"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.technical.map(skill => (
                    <span
                      key={skill.id}
                      className="px-4 py-2 bg-gray-700 text-white rounded-full flex items-center gap-2"
                    >
                      {skill.name}
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Licenses */}
              <div>
                <h3 className="text-xl font-bold text-[#ffd700] mb-4">Professional Licenses</h3>
                
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={newLicense.name}
                      onChange={(e) => setNewLicense({ ...newLicense, name: e.target.value })}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      placeholder="License Name"
                    />
                    <input
                      type="text"
                      value={newLicense.number}
                      onChange={(e) => setNewLicense({ ...newLicense, number: e.target.value })}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      placeholder="License Number"
                    />
                    <input
                      type="text"
                      value={newLicense.issuer}
                      onChange={(e) => setNewLicense({ ...newLicense, issuer: e.target.value })}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      placeholder="Issuing Authority"
                    />
                    <input
                      type="month"
                      value={newLicense.expiryDate}
                      onChange={(e) => setNewLicense({ ...newLicense, expiryDate: e.target.value })}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      placeholder="Expiry Date"
                    />
                  </div>
                  <button
                    onClick={addLicense}
                    className="w-full py-2 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-yellow-600"
                  >
                    + Add License
                  </button>
                </div>

                <div className="space-y-2">
                  {skills.licenses.map(license => (
                    <div key={license.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold">{license.name}</p>
                        <p className="text-gray-400 text-sm">
                          {license.number} • {license.issuer} • Expires: {license.expiryDate}
                        </p>
                      </div>
                      <button
                        onClick={() => removeLicense(license.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-xl font-bold text-[#ffd700] mb-4">Certifications</h3>
                
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={newCertification.name}
                      onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      placeholder="Certification Name"
                    />
                    <input
                      type="text"
                      value={newCertification.issuer}
                      onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      placeholder="Issuing Organization"
                    />
                    <input
                      type="month"
                      value={newCertification.issueDate}
                      onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      placeholder="Issue Date"
                    />
                    <input
                      type="month"
                      value={newCertification.expiryDate}
                      onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      placeholder="Expiry Date (if applicable)"
                    />
                  </div>
                  <button
                    onClick={addCertification}
                    className="w-full py-2 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-yellow-600"
                  >
                    + Add Certification
                  </button>
                </div>

                <div className="space-y-2">
                  {skills.certifications.map(cert => (
                    <div key={cert.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold">{cert.name}</p>
                        <p className="text-gray-400 text-sm">
                          {cert.issuer} • Issued: {cert.issueDate}
                          {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeCertification(cert.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Education & References */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">Education & References</h2>

              {/* Education */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#ffd700]">Education</h3>
                  <button
                    onClick={addEducation}
                    className="px-4 py-2 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-yellow-600 transition"
                  >
                    + Add Education
                  </button>
                </div>

                {education.map((edu, eduIdx) => (
                  <div key={edu.id} className="bg-gray-700 rounded-lg p-6 mb-4 relative">
                    {education.length > 1 && (
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-400"
                      >
                        ✕ Remove
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Institution Name"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Degree/Certificate"
                      />
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Field of Study"
                      />
                      <input
                        type="month"
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Graduation Date"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* References */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#ffd700]">Professional References</h3>
                  <button
                    onClick={addReference}
                    className="px-4 py-2 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-yellow-600 transition"
                  >
                    + Add Reference
                  </button>
                </div>

                <p className="text-gray-400 text-sm mb-4">
                  💡 Tip: Add 2-3 professional references who can vouch for your work ethic and skills
                </p>

                {references.map((ref, refIdx) => (
                  <div key={ref.id} className="bg-gray-700 rounded-lg p-6 mb-4 relative">
                    {references.length > 1 && (
                      <button
                        onClick={() => removeReference(ref.id)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-400"
                      >
                        ✕ Remove
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={ref.name}
                        onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Reference Name"
                      />
                      <input
                        type="text"
                        value={ref.relationship}
                        onChange={(e) => updateReference(ref.id, 'relationship', e.target.value)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Relationship (e.g., Former Supervisor)"
                      />
                      <input
                        type="text"
                        value={ref.company}
                        onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Company"
                      />
                      <input
                        type="tel"
                        value={ref.phone}
                        onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Phone Number"
                      />
                      <input
                        type="email"
                        value={ref.email}
                        onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                        className="md:col-span-2 px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                        placeholder="Email Address"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t border-gray-700">
            <button
              onClick={previousStep}
              disabled={currentStep === 1}
              className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="text-gray-400">
              Step {currentStep} of 4
            </div>

            <button
              onClick={nextStep}
              disabled={loading}
              className="px-8 py-3 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Saving...'
              ) : currentStep === 4 ? (
                '✓ Save Resume'
              ) : (
                'Next →'
              )}
            </button>
          </div>
        </div>

        {/* Auto-save Indicator */}
        {savedResumeId && (
          <div className="mt-4 text-center text-green-500">
            ✓ Resume saved successfully
          </div>
        )}
      </div>
    </div>
  )
}
