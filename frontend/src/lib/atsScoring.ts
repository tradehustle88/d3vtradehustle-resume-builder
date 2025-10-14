// ATS Scoring Library
// Real-time resume analysis powered by Gemini AI

interface Resume {
  profile?: {
    fullName?: string
    email?: string
    phone?: string
    location?: string
    trade?: string
    yearsExperience?: number
    summary?: string
  }
  certifications?: Array<{
    id: string
    name: string
    issuer: string
    dateObtained: string
    expiryDate?: string
    licenseNumber?: string
  }>
  experience?: Array<{
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
  skills?: {
    technical: string[]
    tools: string[]
    licenses: string[]
    safety: string[]
  }
  education?: Array<{
    id: string
    degree: string
    school: string
    location: string
    graduationDate: string
  }>
  references?: Array<{
    id: string
    name: string
    relationship: string
    company: string
    phone: string
    email: string
  }>
}

interface ATSAnalysis {
  score: number
  suggestions: string[]
  strengths: string[]
  weaknesses: string[]
  keywordMatch: number
  formattingScore: number
  experienceScore: number
}

/**
 * Calculate ATS score for a resume using Gemini AI
 * @param resumeData - Complete resume data object
 * @returns Promise<ATSAnalysis> - Analysis with score and suggestions
 */
export async function calculateATSScore(resumeData: Resume): Promise<ATSAnalysis> {
  try {
    // Get Firebase Functions URL from environment
    const functionsUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
                         'https://app-fbs5jy4frq-uc.a.run.app'
    
    const response = await fetch(`${functionsUrl}/api/gemini/analyze-resume`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ resumeData })
    })
    
    if (!response.ok) {
      // Fallback to basic scoring if API fails
      console.warn('Gemini API unavailable, using fallback scoring')
      return calculateBasicScore(resumeData)
    }
    
    const analysis: ATSAnalysis = await response.json()
    return analysis
  } catch (error) {
    console.error('ATS scoring error:', error)
    // Return fallback score on error
    return calculateBasicScore(resumeData)
  }
}

/**
 * Simplified ATS score (numeric only) for quick updates
 * @param resumeData - Resume data
 * @returns Promise<number> - Score 0-100
 */
export async function getATSScoreQuick(resumeData: Resume): Promise<number> {
  const analysis = await calculateATSScore(resumeData)
  return analysis.score
}

/**
 * Fallback scoring algorithm when Gemini is unavailable
 * Provides basic scoring based on resume completion
 */
function calculateBasicScore(resumeData: Resume): ATSAnalysis {
  let score = 0
  const suggestions: string[] = []
  const strengths: string[] = []
  const weaknesses: string[] = []
  
  // Profile Section (30 points)
  if (resumeData.profile?.fullName) {
    score += 5
    strengths.push('Contact name provided')
  } else {
    weaknesses.push('Missing full name')
    suggestions.push('Add your full name to the profile section')
  }
  
  if (resumeData.profile?.email) {
    score += 5
    strengths.push('Email address included')
  } else {
    weaknesses.push('Missing email')
    suggestions.push('Add a professional email address')
  }
  
  if (resumeData.profile?.phone) {
    score += 5
    strengths.push('Phone number provided')
  } else {
    weaknesses.push('Missing phone number')
    suggestions.push('Add your contact phone number')
  }
  
  if (resumeData.profile?.location) {
    score += 5
  }
  
  if (resumeData.profile?.trade) {
    score += 5
    strengths.push('Trade specified')
  } else {
    weaknesses.push('Missing trade specification')
    suggestions.push('Specify your trade or specialty')
  }
  
  if (resumeData.profile?.summary && resumeData.profile.summary.length > 50) {
    score += 5
    strengths.push('Professional summary included')
  } else {
    weaknesses.push('Missing or short professional summary')
    suggestions.push('Add a compelling professional summary (100-150 words)')
  }
  
  // Certifications (15 points)
  const certCount = resumeData.certifications?.length || 0
  if (certCount > 0) {
    score += Math.min(certCount * 5, 15)
    strengths.push(`${certCount} certification(s) listed`)
  } else {
    weaknesses.push('No certifications listed')
    suggestions.push('Add relevant trade certifications and licenses')
  }
  
  // Experience (30 points)
  const expCount = resumeData.experience?.length || 0
  if (expCount > 0) {
    score += Math.min(expCount * 10, 20)
    strengths.push(`${expCount} work experience(s) listed`)
    
    // Check for achievements
    const hasAchievements = resumeData.experience?.some(exp => 
      exp.achievements && exp.achievements.length > 0
    )
    if (hasAchievements) {
      score += 10
      strengths.push('Quantifiable achievements included')
    } else {
      weaknesses.push('Missing measurable achievements')
      suggestions.push('Add specific achievements with numbers/metrics (e.g., "Completed 50+ projects")')
    }
  } else {
    weaknesses.push('No work experience listed')
    suggestions.push('Add your work history with responsibilities and achievements')
  }
  
  // Skills (15 points)
  const skillsTotal = (resumeData.skills?.technical?.length || 0) +
                     (resumeData.skills?.tools?.length || 0) +
                     (resumeData.skills?.licenses?.length || 0) +
                     (resumeData.skills?.safety?.length || 0)
  
  if (skillsTotal > 0) {
    score += Math.min(skillsTotal * 2, 15)
    strengths.push(`${skillsTotal} skills listed`)
  } else {
    weaknesses.push('No skills listed')
    suggestions.push('Add technical skills, tools, and equipment you\'re proficient with')
  }
  
  // Education (5 points)
  if (resumeData.education && resumeData.education.length > 0) {
    score += 5
    strengths.push('Education history included')
  } else {
    suggestions.push('Add your education history or trade school training')
  }
  
  // References (5 points)
  if (resumeData.references && resumeData.references.length > 0) {
    score += 5
    strengths.push('Professional references included')
  } else {
    suggestions.push('Consider adding 2-3 professional references')
  }
  
  // Cap score at 100
  score = Math.min(score, 100)
  
  return {
    score,
    suggestions,
    strengths,
    weaknesses,
    keywordMatch: Math.floor(score * 0.8), // Estimate
    formattingScore: 85, // Assume good formatting from template
    experienceScore: Math.floor(score * 0.9) // Estimate
  }
}

/**
 * Get keyword suggestions for a specific trade
 * @param trade - Trade type (e.g., 'electrician', 'plumber')
 * @returns Promise<string[]> - Suggested keywords
 */
export async function getTradeKeywords(trade: string): Promise<string[]> {
  try {
    const functionsUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
                         'https://app-fbs5jy4frq-uc.a.run.app'
    
    const response = await fetch(`${functionsUrl}/api/gemini/trade-keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trade })
    })
    
    if (!response.ok) {
      return getDefaultKeywords(trade)
    }
    
    const { keywords } = await response.json()
    return keywords
  } catch (error) {
    console.error('Keyword fetch error:', error)
    return getDefaultKeywords(trade)
  }
}

/**
 * Default keywords for common trades (fallback)
 */
function getDefaultKeywords(trade: string): string[] {
  const keywordMap: Record<string, string[]> = {
    electrician: [
      'electrical systems', 'wiring', 'conduit', 'circuit breaker', 'troubleshooting',
      'NEC compliance', 'blueprint reading', 'voltage testing', 'residential', 'commercial'
    ],
    plumber: [
      'plumbing systems', 'pipefitting', 'drain cleaning', 'water heater', 'fixture installation',
      'code compliance', 'leak detection', 'backflow prevention', 'gas lines', 'sewer systems'
    ],
    hvac: [
      'HVAC systems', 'refrigeration', 'air conditioning', 'heating systems', 'EPA certified',
      'ductwork', 'preventive maintenance', 'thermostat', 'ventilation', 'climate control'
    ],
    carpenter: [
      'framing', 'finish carpentry', 'blueprint reading', 'cabinet installation', 'trim work',
      'drywall', 'flooring', 'deck construction', 'renovation', 'custom woodwork'
    ],
    welder: [
      'MIG welding', 'TIG welding', 'stick welding', 'blueprint reading', 'metal fabrication',
      'AWS certified', 'pipe welding', 'structural welding', 'quality inspection', 'safety procedures'
    ],
    mechanic: [
      'diagnostics', 'engine repair', 'brake systems', 'electrical systems', 'transmission',
      'preventive maintenance', 'ASE certified', 'computerized diagnostics', 'hydraulics', 'safety inspections'
    ]
  }
  
  return keywordMap[trade.toLowerCase()] || [
    'safety compliance', 'quality control', 'team collaboration', 'problem solving',
    'time management', 'customer service', 'project completion', 'technical skills'
  ]
}

export type { Resume, ATSAnalysis }
