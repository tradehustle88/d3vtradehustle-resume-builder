'use client';

import { useState } from 'react';
import { generateResume } from '@/lib/aiService';
import { getAvailableTrades, generateTradeSpecificPrompt, TradePrompt } from '@/lib/tradePrompts';
import { useResumeStorage } from '@/lib/resumeStorage';

/**
 * Enhanced AI Resume Assistant with Trade-Specific Prompts
 */
export default function TradeAIAssistant() {
  const [selectedTrade, setSelectedTrade] = useState<string>('');
  const [yearsExperience, setYearsExperience] = useState<number | null>(null);
  const [section, setSection] = useState<'summary' | 'experience' | 'skills' | 'certifications'>('summary');
  const [customPrompt, setCustomPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trades = getAvailableTrades();
  const { saveResume } = useResumeStorage();

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    
    try {
      let prompt: string;
      
      if (customPrompt.trim()) {
        // Use custom prompt if provided
        prompt = customPrompt;
      } else if (selectedTrade) {
        // Generate trade-specific prompt
        prompt = generateTradeSpecificPrompt(
          selectedTrade,
          section,
          yearsExperience || undefined,
          [], // Could add specializations input later
          undefined
        );
      } else {
        setError('Please select a trade or enter a custom prompt');
        return;
      }
      
      const result = await generateResume(prompt);
      setOutput(result);

      // Save to Firestore (when Firebase Auth is integrated)
      try {
        await saveResume({
          trade: selectedTrade || 'custom',
          section: selectedTrade ? section : 'custom',
          prompt,
          output: result,
          yearsExperience: yearsExperience || undefined,
          specializations: []
        });
      } catch (saveError) {
        console.warn('⚠️ Could not save resume (auth may be required):', saveError);
        // Don't show error to user as this is optional functionality
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewPrompt = () => {
    if (!selectedTrade || !yearsExperience) return 'Select a trade and experience level to see the prompt preview';
    
    return generateTradeSpecificPrompt(
      selectedTrade,
      section,
      yearsExperience,
      [],
      undefined
    );
  };

  return (
    <div className="bg-[#001a33] rounded-xl p-6 border-2 border-[#ffd700] shadow-xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-3 h-3 bg-[#8b0000] rotate-45 mr-3"></div>
        <h2 className="text-2xl font-bold text-[#ffd700] font-anton">
          🎯 TRADE-SPECIFIC AI ASSISTANT
        </h2>
        <div className="w-3 h-3 bg-[#8b0000] rotate-45 ml-3"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Left Column: Configuration */}
        <div className="space-y-4">
          
          {/* Trade Selection */}
          <div>
            <label className="block text-[#ffd700] font-semibold mb-2">
              Select Your Trade:
            </label>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-[#ffd700] focus:outline-none"
            >
              <option value="">Choose a trade...</option>
              {trades.map((trade) => (
                <option key={trade.id} value={trade.id}>
                  {trade.icon} {trade.name}
                </option>
              ))}
            </select>
          </div>

          {/* Years Experience */}
          <div>
            <label className="block text-[#ffd700] font-semibold mb-2">
              Years of Experience:
            </label>
            <input
              type="number"
              value={yearsExperience || ''}
              onChange={(e) => setYearsExperience(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="e.g., 5"
              min="0"
              max="50"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-[#ffd700] focus:outline-none"
            />
          </div>

          {/* Section Type */}
          <div>
            <label className="block text-[#ffd700] font-semibold mb-2">
              Resume Section:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['summary', 'experience', 'skills', 'certifications'] as const).map((sectionType) => (
                <button
                  key={sectionType}
                  onClick={() => setSection(sectionType)}
                  className={`p-2 rounded-lg font-semibold text-sm transition-colors ${
                    section === sectionType
                      ? 'bg-[#8b0000] text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Override */}
          <div>
            <label className="block text-[#ffd700] font-semibold mb-2">
              Or Enter Custom Prompt:
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe exactly what you want for your resume..."
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-[#ffd700] focus:outline-none resize-none"
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || (!selectedTrade && !customPrompt.trim())}
            className="w-full bg-[#8b0000] hover:bg-[#a61010] disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-4 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  GENERATING...
                </>
              ) : (
                '⚡ GENERATE PROFESSIONAL CONTENT'
              )}
            </span>
          </button>
        </div>

        {/* Right Column: Preview & Results */}
        <div className="space-y-4">
          
          {/* Prompt Preview */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-[#ffd700] font-semibold mb-2">📋 AI Prompt Preview:</h3>
            <p className="text-sm text-gray-300 italic">
              {customPrompt.trim() || getPreviewPrompt()}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-[#8b0000] bg-opacity-20 border border-[#8b0000] rounded-lg p-3">
              <p className="text-red-300 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Output Display */}
          {output && (
            <div className="bg-white border-2 border-hustleBlue/15 rounded-lg p-4 max-h-96 overflow-y-auto shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#ffd700] font-semibold flex items-center">
                  <span className="mr-2">✨</span>
                  Generated Content
                </h3>
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="text-xs bg-[#ffd700] text-[#001a33] px-3 py-1 rounded hover:bg-yellow-300 transition-colors font-semibold"
                >
                  📋 COPY
                </button>
              </div>
              
              <pre className="text-sm text-gray-100 whitespace-pre-wrap font-sans leading-relaxed">
                {output}
              </pre>
            </div>
          )}

          {/* Quick Actions */}
          {output && (
            <div className="flex gap-2">
              <button
                onClick={() => setOutput('')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                🗑️ CLEAR
              </button>
              <button
                onClick={() => {
                  setCustomPrompt('');
                  setSelectedTrade('');
                  setYearsExperience(null);
                }}
                className="flex-1 bg-[#001a33] hover:bg-[#002a43] text-[#ffd700] border border-[#ffd700] px-4 py-2 rounded font-semibold transition-colors"
              >
                ✏️ NEW REQUEST
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trade Examples */}
      {!selectedTrade && (
        <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
          <h4 className="text-[#ffd700] font-semibold mb-3 flex items-center">
            <span className="mr-2">🎯</span>
            Available Trades
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {trades.slice(0, 10).map((trade) => (
              <button
                key={trade.id}
                onClick={() => setSelectedTrade(trade.id)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors"
              >
                {trade.icon} {trade.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
