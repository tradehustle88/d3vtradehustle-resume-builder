/**
 * Trade Hustle Resume Engine
 * Core module for data-driven resume generation
 * 
 * Architecture:
 * 1. Template (base layout with placeholders)
 * 2. Trade Data (from trades_data.json)
 * 3. Code (this module - orchestrates replacement)
 * 4. AI (Gemini fills remaining placeholders)
 */

const fs = require('fs');
const path = require('path');

// Load trades data (runtime require for Functions environment)
let tradesData = null;

/**
 * Load trades data from JSON file
 * @returns {Object} Trades data object
 */
function loadTradesData() {
  if (!tradesData) {
    const dataPath = path.join(__dirname, '..', 'trades_data.json');
    tradesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  return tradesData;
}

/**
 * Get trade-specific data by trade key
 * @param {string} tradeKey - Trade identifier (HVAC, ELECTRICIAN, PLUMBER, etc.)
 * @returns {Object|null} Trade data or null if not found
 */
function getTradeData(tradeKey) {
  const data = loadTradesData();
  const normalizedKey = tradeKey.toUpperCase().trim();
  
  if (!data[normalizedKey]) {
    console.warn(`⚠️ Trade key "${tradeKey}" not found in trades_data.json`);
    return null;
  }
  
  return data[normalizedKey];
}

/**
 * Get all available trade keys
 * @returns {string[]} Array of trade keys
 */
function getAvailableTrades() {
  const data = loadTradesData();
  return Object.keys(data);
}

/**
 * Replace placeholders in template content
 * @param {string} template - Template string with [PLACEHOLDER] markers
 * @param {Object} placeholders - Object with placeholder key-value pairs
 * @returns {string} Template with replaced placeholders
 */
function replacePlaceholders(template, placeholders) {
  let result = template;
  
  for (const [key, value] of Object.entries(placeholders)) {
    // Replace [KEY] format placeholders
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    result = result.replace(regex, value);
  }
  
  return result;
}

/**
 * Generate AI prompt for trade-specific resume content
 * @param {string} tradeKey - Trade identifier
 * @param {Object} userData - User-provided data (name, experience, etc.)
 * @param {string} [customPrompt] - Optional custom instructions
 * @returns {Object} Prompt configuration for Gemini
 */
function generateResumePrompt(tradeKey, userData = {}, customPrompt = '') {
  const tradeData = getTradeData(tradeKey);
  
  if (!tradeData) {
    throw new Error(`Invalid trade key: ${tradeKey}`);
  }
  
  const {TRADE_TITLE, CERTIFICATIONS, SKILLS, PLACEHOLDERS} = tradeData;
  
  // Build structured prompt
  const systemPrompt = `You are an expert resume writer specializing in skilled trades resumes. 
Your task is to create ATS-optimized, one-page resume content that follows industry best practices.

CRITICAL REQUIREMENTS:
- Keep content to ONE PAGE maximum (approximately 400-500 words)
- Use ATS-friendly formatting (no tables, no graphics, clear section headers)
- Focus on measurable achievements and impact
- Use action verbs and quantifiable results
- Maintain professional tone appropriate for ${TRADE_TITLE} role
- Ensure all certifications and skills are prominently featured`;

  const userPrompt = `Generate resume content for a ${TRADE_TITLE} position.

TRADE-SPECIFIC DATA:
Title: ${TRADE_TITLE}
Certifications: ${CERTIFICATIONS.join(', ')}
Core Skills: ${SKILLS.join(', ')}

${userData.name ? `Candidate Name: ${userData.name}` : ''}
${userData.yearsExperience ? `Years of Experience: ${userData.yearsExperience}` : ''}
${userData.location ? `Location: ${userData.location}` : ''}

${customPrompt ? `ADDITIONAL INSTRUCTIONS:\n${customPrompt}\n` : ''}

OUTPUT FORMAT:
Please generate content for these placeholders as a JSON object:
{
  "SUMMARY_SENTENCE_1": "First sentence of professional summary",
  "SUMMARY_SENTENCE_2": "Second sentence highlighting expertise",
  "SKILL_1": "Primary skill with specifics",
  "SKILL_2": "Secondary skill with specifics",
  "SKILL_3": "Third skill with specifics",
  "SKILL_4": "Fourth skill with specifics",
  "SKILL_5": "Fifth skill with specifics",
  "SKILL_6": "Sixth skill with specifics",
  "CERT_1": "${CERTIFICATIONS[0] || 'Primary certification'}",
  "CERT_2": "${CERTIFICATIONS[1] || 'Secondary certification'}",
  "CERT_3": "${CERTIFICATIONS[2] || 'Additional certification'}",
  "EXPERIENCE_TITLE_1": "${TRADE_TITLE}",
  "EXPERIENCE_COMPANY_1": "${userData.currentCompany || '[Company Name]'}",
  "EXPERIENCE_DATES_1": "${userData.currentJobDates || '[Start Date] - Present'}",
  "EXPERIENCE_BULLET_1": "Achievement-focused bullet point with metrics",
  "EXPERIENCE_BULLET_2": "Second achievement with quantifiable results",
  "EXPERIENCE_BULLET_3": "Third achievement demonstrating impact"
}

Use the trade-specific data provided above. Make it compelling and professional.`;

  return {
    systemPrompt,
    userPrompt,
    tradeData,
    metadata: {
      tradeKey,
      tradeTitle: TRADE_TITLE,
      certificationsCount: CERTIFICATIONS.length,
      skillsCount: SKILLS.length
    }
  };
}

/**
 * Build complete resume content from template and AI-generated placeholders
 * @param {string} templateContent - Base template content
 * @param {Object} aiPlaceholders - Placeholders generated by AI
 * @param {Object} tradeData - Trade-specific data
 * @returns {string} Complete resume content
 */
function buildResumeContent(templateContent, aiPlaceholders, tradeData) {
  // Merge trade data placeholders with AI-generated ones
  const allPlaceholders = {
    ...tradeData.PLACEHOLDERS,
    ...aiPlaceholders,
    TRADE_TITLE: tradeData.TRADE_TITLE
  };
  
  return replacePlaceholders(templateContent, allPlaceholders);
}

/**
 * Validate resume content meets requirements
 * @param {string} content - Resume content to validate
 * @returns {Object} Validation result
 */
function validateResumeContent(content) {
  const wordCount = content.split(/\s+/).length;
  const hasUnfilledPlaceholders = /\[([A-Z_0-9]+)\]/.test(content);
  
  const warnings = [];
  
  if (wordCount > 600) {
    warnings.push(`Content may be too long (${wordCount} words). Target: 400-500 words.`);
  }
  
  if (hasUnfilledPlaceholders) {
    const matches = content.match(/\[([A-Z_0-9]+)\]/g);
    warnings.push(`Unfilled placeholders found: ${matches.join(', ')}`);
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
    wordCount,
    hasUnfilledPlaceholders
  };
}

module.exports = {
  loadTradesData,
  getTradeData,
  getAvailableTrades,
  replacePlaceholders,
  generateResumePrompt,
  buildResumeContent,
  validateResumeContent
};
