// AI Services using Vertex AI (Gemini)
const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || 'tradehustleresumebuilder',
  location: 'us-central1'
});

// Model configurations
const models = {
  // Fast, lightweight for suggestions
  text: vertexAI.preview.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
      topP: 0.8
    }
  }),
  
  // Powerful for analysis
  analysis: vertexAI.preview.getGenerativeModel({
    model: 'gemini-1.5-pro-002',
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.5,
      topP: 0.9
    }
  })
};

/**
 * Generate resume content suggestions
 */
async function generateResumeSuggestions(trade, field, currentValue) {
  try {
    const prompt = `You are a professional resume writer specializing in ${trade} trade positions.

Improve the following ${field}:

Current text: "${currentValue}"

Provide 3 professional alternatives that:
1. Use strong action verbs (Led, Managed, Implemented, Achieved, etc.)
2. Include quantifiable achievements when possible
3. Are ATS-optimized with relevant keywords
4. Are specific to ${trade} trade work

Return ONLY a JSON array of 3 strings, no other text.
Example: ["suggestion 1", "suggestion 2", "suggestion 3"]`;

    const result = await models.text.generateContent(prompt);
    const response = result.response.text().trim();
    
    // Try to parse as JSON
    try {
      const suggestions = JSON.parse(response);
      return Array.isArray(suggestions) ? suggestions : [response];
    } catch (error) {
      // If not valid JSON, split by newlines and clean up
      return response
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 3);
    }
  } catch (error) {
    console.error('AI Suggestions Error:', error);
    throw new Error('Failed to generate suggestions');
  }
}

/**
 * Calculate ATS score and provide analysis
 */
async function calculateATSScore(resumeData, trade) {
  try {
    const prompt = `Analyze this ${trade} resume for ATS (Applicant Tracking System) compatibility.

Resume Data:
- Name: ${resumeData.fullName || 'Not provided'}
- Email: ${resumeData.email || 'Not provided'}
- Phone: ${resumeData.phone || 'Not provided'}
- Summary: ${resumeData.professionalSummary || 'Not provided'}
- Skills: ${(resumeData.skills || []).join(', ') || 'None listed'}
- Experience: ${(resumeData.workExperience || []).length} positions
- Certifications: ${(resumeData.certifications || []).length} certificates

Provide analysis in this EXACT JSON format (no other text):
{
  "score": <number 0-100>,
  "keywords": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  },
  "formatting": {
    "passed": <true/false>,
    "issues": ["issue1", "issue2"]
  },
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Key ${trade} keywords to check: license, certified, safety, code compliance, tools, experience, OSHA, blueprint reading, installation, maintenance, repair`;

    const result = await models.analysis.generateContent(prompt);
    const response = result.response.text().trim();
    
    try {
      // Remove markdown code blocks if present
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (parseError) {
      // Fallback analysis
      return generateFallbackATSAnalysis(resumeData, trade);
    }
  } catch (error) {
    console.error('ATS Analysis Error:', error);
    return generateFallbackATSAnalysis(resumeData, trade);
  }
}

/**
 * Fallback ATS analysis if AI fails
 */
function generateFallbackATSAnalysis(resumeData, trade) {
  let score = 50; // Base score
  
  // Add points for complete sections
  if (resumeData.fullName) score += 5;
  if (resumeData.email) score += 5;
  if (resumeData.phone) score += 5;
  if (resumeData.professionalSummary && resumeData.professionalSummary.length > 50) score += 10;
  if (resumeData.workExperience && resumeData.workExperience.length > 0) score += 15;
  if (resumeData.skills && resumeData.skills.length >= 5) score += 10;
  if (resumeData.certifications && resumeData.certifications.length > 0) score += 10;
  
  const tradeKeywords = {
    electrician: ['license', 'NEC', 'electrical', 'wiring', 'circuits'],
    plumber: ['license', 'piping', 'plumbing', 'fixtures', 'water'],
    hvac: ['EPA', 'refrigerant', 'HVAC', 'heating', 'cooling'],
    carpenter: ['framing', 'carpentry', 'blueprint', 'woodworking'],
    mason: ['masonry', 'concrete', 'brick', 'mortar'],
    welder: ['welding', 'MIG', 'TIG', 'fabrication'],
    mechanic: ['ASE', 'automotive', 'diagnostic', 'repair'],
    contractor: ['project management', 'supervision', 'contractor', 'scheduling']
  };
  
  const keywords = tradeKeywords[trade.toLowerCase()] || [];
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const foundKeywords = keywords.filter(kw => resumeText.includes(kw.toLowerCase()));
  
  return {
    score: Math.min(score, 100),
    keywords: {
      found: foundKeywords,
      missing: keywords.filter(kw => !foundKeywords.includes(kw))
    },
    formatting: {
      passed: true,
      issues: []
    },
    suggestions: [
      'Add more quantifiable achievements with numbers',
      'Include relevant trade certifications',
      'Use industry-specific keywords and terminology',
      'List specific tools and equipment experience'
    ]
  };
}

/**
 * Enhance a single achievement with AI
 */
async function enhanceAchievement(achievement, trade) {
  try {
    const prompt = `Enhance this ${trade} work achievement to be more impactful for a resume:

Original: "${achievement}"

Make it:
1. More specific with metrics (numbers, percentages, timeframes)
2. Action-oriented with strong verbs
3. Results-focused showing impact
4. Industry-appropriate for ${trade} work

Return ONLY the enhanced version as a single sentence, no quotes or extra text.`;

    const result = await models.text.generateContent(prompt);
    return result.response.text().trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('Enhancement Error:', error);
    return achievement; // Return original if enhancement fails
  }
}

/**
 * Match resume to job description
 */
async function matchJobDescription(resumeData, jobDescription) {
  try {
    const prompt = `Compare this resume with the job description and provide a match analysis.

Resume Summary:
- Skills: ${(resumeData.skills || []).join(', ')}
- Experience: ${(resumeData.workExperience || []).map(e => e.jobTitle).join(', ')}
- Certifications: ${(resumeData.certifications || []).map(c => c.name).join(', ')}

Job Description:
${jobDescription}

Return EXACT JSON format (no other text):
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "recommendations": ["rec1", "rec2"]
}`;

    const result = await models.analysis.generateContent(prompt);
    const response = result.response.text().trim();
    
    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (parseError) {
      return {
        matchScore: 50,
        matchedSkills: [],
        missingSkills: [],
        recommendations: ['Unable to analyze match at this time']
      };
    }
  } catch (error) {
    console.error('Job Match Error:', error);
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      recommendations: ['Error analyzing job match']
    };
  }
}

/**
 * Generate professional summary based on work history
 */
async function generateProfessionalSummary(trade, workExperience, skills) {
  try {
    const totalYears = workExperience.reduce((sum, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate);
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      return sum + years;
    }, 0);

    const prompt = `Write a professional resume summary for a ${trade} with:
- ${Math.round(totalYears)} years of experience
- Key positions: ${workExperience.map(e => e.jobTitle).join(', ')}
- Skills: ${skills.join(', ')}

Requirements:
- 2-3 sentences
- Highlight expertise and value
- Include relevant certifications mention if applicable
- ATS-optimized

Return only the summary text, no quotes.`;

    const result = await models.text.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Summary Generation Error:', error);
    return `Experienced ${trade} professional with proven expertise in the trades industry.`;
  }
}

module.exports = {
  generateResumeSuggestions,
  calculateATSScore,
  enhanceAchievement,
  matchJobDescription,
  generateProfessionalSummary
};
