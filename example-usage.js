/**
 * Trade Resume Engine - Example Usage
 * 
 * This file demonstrates how to use the trade resume generation system
 * in various scenarios (backend, frontend, testing).
 */

// ============================================
// BACKEND USAGE (Firebase Functions)
// ============================================

// Example 1: Generate HVAC resume with user data
async function exampleGenerateHVACResume(req, res) {
  const { generateTradeResume } = require('./lib/api');
  
  const idToken = req.headers.authorization.split('Bearer ')[1];
  
  const result = await generateTradeResume(
    idToken,
    'HVAC',
    {
      name: 'John Doe',
      yearsExperience: 5,
      location: 'Chicago, IL',
      currentCompany: 'ABC HVAC Services',
      currentJobDates: '2019 - Present'
    },
    'Focus on commercial HVAC systems and large-scale installations'
  );
  
  console.log('Generated resume:', result.tradeTitle);
  console.log('Placeholders:', result.placeholders);
  console.log('Validation:', result.validation);
}

// Example 2: Test resume engine directly (without API call)
async function testResumeEngineDirectly() {
  const {
    getTradeData,
    generateResumePrompt,
    validateResumeContent
  } = require('./api-functions/resumeEngine');
  
  // Get trade data
  const hvacData = getTradeData('HVAC');
  console.log('HVAC Certifications:', hvacData.CERTIFICATIONS);
  
  // Generate prompt
  const promptConfig = generateResumePrompt('HVAC', {
    name: 'Jane Smith',
    yearsExperience: 3
  });
  
  console.log('System Prompt:', promptConfig.systemPrompt);
  console.log('User Prompt:', promptConfig.userPrompt);
  
  // Simulate AI response
  const mockAIResponse = JSON.stringify({
    SUMMARY_SENTENCE_1: "Certified HVAC technician with 3 years of experience...",
    SKILL_1: "System Diagnostics & Troubleshooting"
  });
  
  // Validate
  const validation = validateResumeContent(mockAIResponse);
  console.log('Validation result:', validation);
}

// ============================================
// FRONTEND USAGE (Next.js / React)
// ============================================

// Example 3: React component for trade resume generation
import { useState } from 'react';
import { generateTradeResume } from '@/lib/api';
import { getAuth } from 'firebase/auth';
import { getAvailableTrades, getTradeTitle } from '@/lib/tradesData';

export function TradeResumeGenerator() {
  const [tradeKey, setTradeKey] = useState('HVAC');
  const [userData, setUserData] = useState({
    name: '',
    yearsExperience: 0,
    location: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error('Not authenticated');
      
      const idToken = await user.getIdToken();
      
      const response = await generateTradeResume(
        idToken,
        tradeKey,
        userData,
        undefined, // no custom prompt
        true // use Vertex AI
      );
      
      setResult(response);
      console.log('Resume generated:', response);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate resume: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="trade-resume-generator">
      <h2>Generate Trade Resume</h2>
      
      {/* Trade Selection */}
      <select value={tradeKey} onChange={(e) => setTradeKey(e.target.value)}>
        {getAvailableTrades().map(key => (
          <option key={key} value={key}>
            {getTradeTitle(key)}
          </option>
        ))}
      </select>
      
      {/* User Input */}
      <input
        type="text"
        placeholder="Your Name"
        value={userData.name}
        onChange={(e) => setUserData({...userData, name: e.target.value})}
      />
      
      <input
        type="number"
        placeholder="Years of Experience"
        value={userData.yearsExperience}
        onChange={(e) => setUserData({...userData, yearsExperience: parseInt(e.target.value)})}
      />
      
      <input
        type="text"
        placeholder="Location"
        value={userData.location}
        onChange={(e) => setUserData({...userData, location: e.target.value})}
      />
      
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Resume'}
      </button>
      
      {/* Results */}
      {result && (
        <div className="results">
          <h3>{result.tradeTitle} Resume</h3>
          
          <div className="validation">
            <p>Word Count: {result.validation.wordCount}</p>
            <p>Valid: {result.validation.valid ? '✅' : '❌'}</p>
            {result.validation.warnings.length > 0 && (
              <ul>
                {result.validation.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="placeholders">
            <h4>Generated Content:</h4>
            <pre>{JSON.stringify(result.placeholders, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMMAND LINE TESTING
// ============================================

// Example 4: Test script (Node.js)
// Run with: node example-usage.js
async function testFromCommandLine() {
  const {
    getTradeData,
    getAvailableTrades,
    generateResumePrompt
  } = require('./api-functions/resumeEngine');
  
  console.log('=== Available Trades ===');
  const trades = getAvailableTrades();
  console.log(trades.join(', '));
  
  console.log('\n=== HVAC Trade Data ===');
  const hvacData = getTradeData('HVAC');
  console.log('Title:', hvacData.TRADE_TITLE);
  console.log('Certifications:', hvacData.CERTIFICATIONS);
  console.log('Skills:', hvacData.SKILLS);
  
  console.log('\n=== Generated Prompt ===');
  const promptConfig = generateResumePrompt('ELECTRICIAN', {
    name: 'Mike Johnson',
    yearsExperience: 7,
    location: 'New York, NY'
  });
  console.log('System Prompt (first 200 chars):');
  console.log(promptConfig.systemPrompt.substring(0, 200) + '...');
  console.log('\nUser Prompt (first 300 chars):');
  console.log(promptConfig.userPrompt.substring(0, 300) + '...');
}

// ============================================
// INTEGRATION WITH EXISTING SYSTEMS
// ============================================

// Example 5: Add to existing resume builder flow
async function integrateWithExistingFlow(userId, selectedTrade) {
  // 1. Get user's existing profile data from Firestore
  const db = require('firebase-admin').firestore();
  const userDoc = await db.collection('users').doc(userId).get();
  const userProfile = userDoc.data();
  
  // 2. Generate trade-specific content
  const { generateTradeResume } = require('./lib/api');
  const idToken = await getIdTokenForUser(userId); // Your auth function
  
  const resumeData = await generateTradeResume(
    idToken,
    selectedTrade,
    {
      name: userProfile.name,
      yearsExperience: userProfile.yearsExperience,
      location: userProfile.location,
      currentCompany: userProfile.currentEmployer
    }
  );
  
  // 3. Merge with existing resume template
  const template = await loadResumeTemplate('hvac_template1_base.docx');
  const { replacePlaceholders } = require('./api-functions/resumeEngine');
  const finalResume = replacePlaceholders(template, resumeData.placeholders);
  
  // 4. Save to user's resume collection
  await db.collection('resumes').add({
    userId,
    tradeKey: selectedTrade,
    content: finalResume,
    placeholders: resumeData.placeholders,
    generatedAt: new Date(),
    metadata: resumeData.metadata
  });
  
  return finalResume;
}

// ============================================
// BULK GENERATION (Admin/Testing)
// ============================================

// Example 6: Generate sample resumes for all trades
async function generateSamplesForAllTrades() {
  const { getAvailableTrades } = require('./api-functions/resumeEngine');
  const { generateTradeResume } = require('./lib/api');
  
  const trades = getAvailableTrades();
  const adminToken = await getAdminIdToken(); // Your admin auth
  
  const sampleUserData = {
    name: 'Sample User',
    yearsExperience: 5,
    location: 'Sample City, ST'
  };
  
  const results = [];
  
  for (const tradeKey of trades) {
    console.log(`Generating sample resume for ${tradeKey}...`);
    
    try {
      const result = await generateTradeResume(
        adminToken,
        tradeKey,
        sampleUserData
      );
      
      results.push({
        trade: tradeKey,
        success: true,
        wordCount: result.validation.wordCount,
        valid: result.validation.valid
      });
    } catch (error) {
      results.push({
        trade: tradeKey,
        success: false,
        error: error.message
      });
    }
  }
  
  console.table(results);
  return results;
}

// ============================================
// EXPORT FOR USE
// ============================================

module.exports = {
  exampleGenerateHVACResume,
  testResumeEngineDirectly,
  TradeResumeGenerator, // React component
  testFromCommandLine,
  integrateWithExistingFlow,
  generateSamplesForAllTrades
};

// Run tests if called directly
if (require.main === module) {
  console.log('Running command line test...\n');
  testFromCommandLine().catch(console.error);
}
