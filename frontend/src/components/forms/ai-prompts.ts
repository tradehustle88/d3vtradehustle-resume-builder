/**
 * AI Prompt Templates for Resume Generation
 * Each section has tailored prompts for generating content
 */

export const AI_PROMPTS = {
  summary: (context: { name: string; tradeTitle: string; certifications: string[] }) => `
    Write a compelling 3-sentence professional summary for ${context.name}, an ${context.tradeTitle}.
    ${context.certifications.length > 0 ? `They hold certifications in: ${context.certifications.join(', ')}.` : ''}
    Focus on: years of experience, key technical skills, and measurable results.
    Make it confident, concise, and results-oriented.
    Return only the summary text, no formatting.
  `,

  achievement: (context: { role: string; company: string; startDate: string; endDate?: string }) => `
    Generate 3 short, powerful bullet points describing measurable achievements for an HVAC professional.
    Role: ${context.role} at ${context.company}
    Period: ${context.startDate}${context.endDate ? ` - ${context.endDate}` : ' - Present'}
    
    Each bullet should:
    - Start with a strong action verb
    - Include specific metrics (%, $, time saved, customers served)
    - Be 15-25 words maximum
    - Focus on HVAC-specific accomplishments (installations, repairs, efficiency improvements, customer satisfaction)
    
    Return as a JSON array of strings: ["achievement 1", "achievement 2", "achievement 3"]
  `,

  skills: (context: { role: string; certifications: string[] }) => `
    Suggest 5 relevant technical skills for an HVAC ${context.role}.
    ${context.certifications.length > 0 ? `Certifications held: ${context.certifications.join(', ')}` : ''}
    
    Focus on:
    - Hands-on technical skills (installation, diagnostics, repair)
    - Equipment and systems expertise
    - Industry-specific tools and software
    
    Return as a JSON array of strings: ["skill 1", "skill 2", ...]
  `,

  certifications: (context: { role: string; yearsExperience?: number }) => `
    Recommend 4 essential certifications for an HVAC ${context.role}
    ${context.yearsExperience ? `with ${context.yearsExperience} years of experience` : ''}.
    
    Prioritize:
    1. EPA certifications
    2. Safety certifications (OSHA)
    3. Trade-specific credentials (NATE, etc.)
    4. Advanced specializations
    
    Return as a JSON array of certification names: ["cert 1", "cert 2", ...]
  `,

  roleDescription: (context: { role: string; company: string }) => `
    Write a 1-sentence description of what a ${context.role} does at ${context.company}.
    Focus on primary responsibilities and technical scope.
    Keep it under 20 words.
    Return only the description text.
  `,
};

/**
 * Helper tooltips for each field
 */
export const FIELD_TOOLTIPS = {
  summary: "A brief overview highlighting your experience, certifications, and key strengths. Keep it concise and impactful.",
  certifications: "List your most relevant credentials. Prioritize EPA, NATE, OSHA, and trade licenses.",
  skills: "Highlight 6-8 core competencies. Mix technical skills with safety and soft skills.",
  achievements: "Quantify your impact! Use numbers, percentages, or timeframes to show results.",
  references: "Optional. You can write 'Available upon request' or list 2-3 professional contacts.",
};

/**
 * Validation error messages
 */
export const ERROR_MESSAGES = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  tooLong: (max: number) => `Maximum ${max} characters`,
  tooShort: (min: number) => `Minimum ${min} characters`,
  maxItems: (max: number) => `Maximum ${max} items allowed`,
};
