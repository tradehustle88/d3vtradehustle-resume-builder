'use client';

import { useState } from 'react';
import { editResume } from '@/lib/api';
import { useResumeStorage } from '@/lib/resumeStorage';

/**
 * Resume refinement types
 */
export type RefinementType = 'shorten' | 'expand' | 'ats-optimize' | 'rewrite' | 'custom';

/**
 * Resume Refinement Component - Connects to existing editResume API
 */
export default function ResumeRefiner({ 
  originalContent, 
  onRefined,
  className = ''
}: {
  originalContent: string;
  onRefined: (refinedContent: string) => void;
  className?: string;
}) {
  const [refinementType, setRefinementType] = useState<RefinementType>('ats-optimize');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const { saveResume } = useResumeStorage();

  const refinementPrompts: Record<RefinementType, string> = {
    'shorten': 'Make this resume content more concise and impactful while keeping all key information. Remove unnecessary words and focus on strong action verbs.',
    'expand': 'Expand this resume content with more detailed achievements, specific examples, and quantifiable results. Add relevant industry terminology.',
    'ats-optimize': 'Optimize this resume content for ATS (Applicant Tracking Systems) by incorporating relevant keywords, industry terms, and formatting that will pass through automated screening.',
    'rewrite': 'Completely rewrite this resume content to be more professional, engaging, and impactful. Maintain the same core information but improve the language and structure.',
    'custom': customInstructions
  };

  const handleRefine = async () => {
    if (!originalContent.trim()) {
      setError('No content to refine');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const prompt = refinementType === 'custom' 
        ? customInstructions 
        : refinementPrompts[refinementType];

      if (!prompt.trim()) {
        setError('Please enter custom instructions');
        return;
      }

      // Use the existing editResume function
      // Note: This requires Firebase Auth token - you'll need to implement getAuthToken
      const authToken = ''; // TODO: Get from Firebase Auth
      
      if (!authToken) {
        throw new Error('Authentication required for refinement features');
      }

      const response = await editResume(authToken, prompt, originalContent);
      
      if (response.success) {
        setResult(response.result);
        onRefined(response.result);

        // Save refinement to storage
        try {
          await saveResume({
            trade: 'refined',
            section: 'custom',
            prompt,
            output: response.result,
            isRefined: true
          });
        } catch (saveError) {
          console.warn('Could not save refinement:', saveError);
        }
      } else {
        setError('Refinement failed: ' + response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refinement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-[#001a33] rounded-lg p-4 border border-[#ffd700] ${className}`}>
      <h3 className="text-[#ffd700] font-semibold mb-4 flex items-center">
        <span className="mr-2">✨</span>
        Refine Your Resume Content
      </h3>

      {/* Refinement Type Selection */}
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">
          Refinement Type:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['ats-optimize', 'shorten', 'expand', 'rewrite'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setRefinementType(type)}
              className={`p-2 rounded text-sm font-medium transition-colors ${
                refinementType === type
                  ? 'bg-[#8b0000] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setRefinementType('custom')}
          className={`mt-2 w-full p-2 rounded text-sm font-medium transition-colors ${
            refinementType === 'custom'
              ? 'bg-[#8b0000] text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Custom Instructions
        </button>
      </div>

      {/* Custom Instructions */}
      {refinementType === 'custom' && (
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Custom Refinement Instructions:
          </label>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Describe exactly how you want to refine this content..."
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white focus:border-[#ffd700] focus:outline-none resize-none"
            rows={3}
          />
        </div>
      )}

      {/* Preview Current Instructions */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <h4 className="text-xs text-[#ffd700] mb-1">AI Instructions:</h4>
        <p className="text-xs text-gray-300 italic">
          {refinementType === 'custom' ? customInstructions || 'Enter custom instructions above...' : refinementPrompts[refinementType]}
        </p>
      </div>

      {/* Original Content Preview */}
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">
          Content to Refine:
        </label>
        <div className="bg-gray-800 rounded p-3 max-h-32 overflow-y-auto">
          <p className="text-sm text-gray-300">
            {originalContent.length > 200 
              ? `${originalContent.substring(0, 200)}...` 
              : originalContent}
          </p>
        </div>
      </div>

      {/* Refine Button */}
      <button
        onClick={handleRefine}
        disabled={loading || !originalContent.trim() || (refinementType === 'custom' && !customInstructions.trim())}
        className="w-full bg-[#8b0000] hover:bg-[#a61010] disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-3 rounded font-bold text-white transition-all duration-300"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            REFINING...
          </span>
        ) : (
          '🔄 REFINE CONTENT'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-[#8b0000] bg-opacity-20 border border-[#8b0000] rounded">
          <p className="text-red-300 text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
          {error.includes('Authentication required') && (
            <p className="text-xs text-gray-400 mt-1">
              Please sign in to use refinement features.
            </p>
          )}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mt-4 p-3 bg-white border-2 border-hustleBlue/15 rounded shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[#ffd700] font-medium text-sm">✨ Refined Content:</h4>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-xs bg-[#ffd700] text-[#001a33] px-2 py-1 rounded hover:bg-yellow-300 transition-colors"
            >
              📋 COPY
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto">
            <pre className="text-sm text-gray-100 whitespace-pre-wrap font-sans">
              {result}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Quick Refine Buttons - Compact version for inline use
 */
export function QuickRefineButtons({ 
  content, 
  onRefined 
}: {
  content: string;
  onRefined: (refined: string) => void;
}) {
  const [loading, setLoading] = useState<RefinementType | null>(null);

  const quickRefine = async (type: RefinementType) => {
    setLoading(type);
    
    try {
      // Implementation would be similar to main refiner
      // This is a simplified version for quick actions
      console.log(`Quick refine: ${type} for content:`, content.substring(0, 50));
      
      // Mock implementation - replace with actual API call
      setTimeout(() => {
        onRefined(`[Refined for ${type}] ${content}`);
        setLoading(null);
      }, 2000);
      
    } catch (error) {
      console.error('Quick refine failed:', error);
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {(['ats-optimize', 'shorten', 'expand'] as const).map((type) => (
        <button
          key={type}
          onClick={() => quickRefine(type)}
          disabled={loading !== null}
          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded transition-colors"
        >
          {loading === type ? '⏳' : '✨'} {type.split('-')[0]}
        </button>
      ))}
    </div>
  );
}
