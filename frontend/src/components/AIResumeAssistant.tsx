'use client';

import React, { useState } from 'react';
import { useAI } from '@/lib/aiService';

/**
 * AI Resume Assistant Component
 * Provides a user interface for AI-powered resume generation
 */
export default function AIResumeAssistant() {
  const { generateResume, isLoading, error } = useAI();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    const generated = await generateResume(prompt);
    if (generated) {
      setResult(generated);
    }
  };

  return (
    <div className="ai-assistant bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-[#001a33] mb-4 flex items-center">
        🤖 AI Resume Assistant
      </h3>
      
      <div className="mb-4">
        <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Describe what you need help with for your resume:
        </label>
        <textarea
          id="ai-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Help me write a professional summary for a software engineer with 5 years of experience..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:border-transparent"
          rows={4}
        />
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={isLoading || !prompt.trim()}
        className="btn-hustle w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating with AI...
          </span>
        ) : (
          '✨ Generate with AI'
        )}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 flex items-center">
            <span className="mr-2">❌</span>
            {error}
          </p>
        </div>
      )}
      
      {result && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-semibold text-[#001a33] mb-3 flex items-center">
            <span className="mr-2">✨</span>
            AI Suggestion:
          </h4>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {result}
            </pre>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-4 py-2 text-sm bg-[#001a33] text-white rounded hover:bg-[#002a43] transition-colors"
            >
              📋 Copy to Clipboard
            </button>
            <button
              onClick={() => setResult('')}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-semibold text-blue-800 mb-2">💡 Tips for better results:</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be specific about your role and industry</li>
          <li>• Mention years of experience and key skills</li>
          <li>• Specify the type of content you need (summary, bullet points, etc.)</li>
          <li>• Include any specific achievements or technologies</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Compact AI Assistant for integration into existing forms
 */
export function CompactAIAssistant({ 
  onSuggestion, 
  placeholder = "Ask AI to help improve this section..." 
}: {
  onSuggestion: (suggestion: string) => void;
  placeholder?: string;
}) {
  const { generateContent, isLoading, error } = useAI();
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    const result = await generateContent({ prompt });
    if (result) {
      onSuggestion(result);
      setPrompt(''); // Clear after successful generation
    }
  };

  return (
    <div className="compact-ai-assistant">
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="px-4 py-2 text-sm bg-[#001a33] text-white rounded-lg hover:bg-[#002a43] disabled:opacity-50 transition-colors"
        >
          {isLoading ? '⏳' : '🤖'}
        </button>
      </div>
      
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
