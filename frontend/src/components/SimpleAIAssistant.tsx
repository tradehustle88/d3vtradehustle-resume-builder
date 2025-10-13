'use client';

import { useState } from 'react';
import { generateResume } from '@/lib/aiService';
import ResumeRefiner, { QuickRefineButtons } from './ResumeRefiner';

/**
 * Simple AI Resume Assistant Component - Trade Hustle Style
 * Drop this component anywhere in your resume builder for instant AI assistance
 */
export default function AIResumeAssistant() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const text = await generateResume(input);
      setOutput(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-[#001a33] text-white rounded-xl border-2 border-[#ffd700] shadow-xl">
      {/* Header with Trade Hustle branding */}
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-[#8b0000] rotate-45 mr-3"></div>
        <h2 className="text-xl font-bold text-[#ffd700] font-anton">
          🤖 AI RESUME ASSISTANT
        </h2>
        <div className="w-3 h-3 bg-[#8b0000] rotate-45 ml-3"></div>
      </div>

      {/* Input area */}
      <div className="mb-4">
        <label className="block text-[#ffd700] text-sm font-semibold mb-2">
          Describe your trade and experience:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#ffd700] focus:outline-none transition-colors"
          placeholder="e.g., Electrician with 5 years residential and commercial experience, OSHA certified..."
          rows={4}
        />
      </div>

      {/* Action button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !input.trim()}
        className="w-full bg-[#8b0000] hover:bg-[#a61010] disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <span className="flex items-center justify-center">
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              CRAFTING YOUR RESUME...
            </>
          ) : (
            <>
              ⚡ GENERATE PROFESSIONAL RESUME
            </>
          )}
        </span>
      </button>

      {/* Error display */}
      {error && (
        <div className="mt-4 p-3 bg-[#8b0000] bg-opacity-20 border border-[#8b0000] rounded-lg">
          <p className="text-red-300 text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Note: AI features require authentication. Make sure you're signed in.
          </p>
        </div>
      )}

      {/* Output display */}
      {output && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#ffd700] font-semibold flex items-center">
              <span className="mr-2">✨</span>
              Your AI-Generated Resume Content
            </h3>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs bg-[#ffd700] text-[#001a33] px-3 py-1 rounded hover:bg-yellow-300 transition-colors font-semibold"
            >
              📋 COPY
            </button>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed">
              {output}
            </pre>
          </div>

          {/* Action buttons */}
          {/* Quick Refine Options */}
          <div className="mt-3 p-2 bg-gray-800 rounded">
            <h5 className="text-xs text-[#ffd700] mb-2">🔄 Quick Refinements:</h5>
            <QuickRefineButtons 
              content={output}
              onRefined={(refined) => setOutput(refined)}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setOutput('')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              🗑️ CLEAR
            </button>
            <button
              onClick={() => setInput('')}
              className="flex-1 bg-[#001a33] hover:bg-[#002a43] text-[#ffd700] border border-[#ffd700] px-4 py-2 rounded font-semibold transition-colors"
            >
              ✏️ NEW REQUEST
            </button>
          </div>
        </div>
      )}

      {/* Tips section */}
      <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
        <h4 className="text-[#ffd700] font-semibold mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Pro Tips for Better Results
        </h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Specify your exact trade (electrician, plumber, welder, etc.)</li>
          <li>• Include years of experience and certifications</li>
          <li>• Mention specific skills or specializations</li>
          <li>• Add any leadership or safety achievements</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Compact version for inline use
 */
export function CompactAIAssistant({ 
  onResult, 
  placeholder = "Describe what resume help you need..." 
}: {
  onResult: (text: string) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateResume(input);
      onResult(result);
      setInput('');
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 p-3 bg-[#001a33] rounded-lg border border-[#ffd700]">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#ffd700] focus:outline-none"
        onKeyPress={(e) => e.key === 'Enter' && !loading && handleGenerate()}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !input.trim()}
        className="px-4 py-2 bg-[#8b0000] hover:bg-[#a61010] disabled:bg-gray-600 text-white rounded font-semibold transition-colors"
      >
        {loading ? '⏳' : '🤖'}
      </button>
    </div>
  );
}