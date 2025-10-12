/**
 * Frontend integration for Gemini AI Agent
 * Trade Hustle Resume Builder - AI Service Layer
 */

// Firebase Cloud Functions URL
const BASE_URL = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL ||
  "https://us-central1-tradehustleresumebuilder.cloudfunctions.net";

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }
  
  return response.json();
}

/**
 * AI service configuration options
 */
export interface AIServiceOptions {
  prompt: string;
  useVertexAI?: boolean;
  model?: 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'gemini-2.0-flash-exp';
  temperature?: number;
  maxTokens?: number;
}

/**
 * AI service response structure
 */
export interface AIServiceResponse {
  success: boolean;
  output?: string;
  provider?: string;
  model?: string;
  message?: string;
  error?: string;
}

/**
 * Main AI service class for interacting with Gemini/Vertex AI
 */
export class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

/**
 * Generate AI content using Gemini or Vertex AI
 * @param options - AI generation options
 * @returns Promise with AI response
 */
async generateContent(options: AIServiceOptions): Promise<AIServiceResponse> {
  try {
    const response = await apiCall('/api/geminiAgent', {
      method: 'POST',
      body: JSON.stringify({
        prompt: options.prompt,
        useVertexAI: options.useVertexAI || false,
        model: options.model || 'gemini-1.5-flash',
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      }),
    });

    return response;
  } catch (error) {
    console.error('❌ AI Service Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AI service unavailable',
    };
  }
}

/**
 * Simple AI resume generation - Direct function access
 * @param prompt - User prompt for resume generation
 * @returns Promise with generated resume content
 */
async generateResume(prompt: string): Promise<string> {
  const authToken = await this.getAuthToken();
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json',
  };
  
  // Only add auth header if we have a token
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const res = await fetch(
    'https://us-central1-tradehustleresumebuilder.cloudfunctions.net/geminiAgent',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt }),
    }
  );
  
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'AI generation failed');
  return data.output;
}

/**
 * Get Firebase Auth token for API calls
 * @returns Promise with auth token
 */
private async getAuthToken(): Promise<string> {
  // This will be implemented based on your Firebase Auth setup
  // For now, return empty string - you'll need to integrate with your auth
  // TODO: Integrate with Firebase Auth when ready
  return '';
}  /**
   * Generate resume content with AI assistance
   * @param prompt - User prompt for resume generation
   * @param currentResume - Optional current resume content
   * @returns Promise with AI-generated resume content
   */
  async generateResumeContent(prompt: string, currentResume?: string): Promise<AIServiceResponse> {
    const enhancedPrompt = currentResume
      ? `${prompt}\n\nCurrent Resume:\n${currentResume}\n\nPlease provide professional suggestions.`
      : `${prompt}\n\nPlease generate professional resume content.`;

    return this.generateContent({
      prompt: enhancedPrompt,
      model: 'gemini-1.5-flash',
      useVertexAI: false, // Default to Gemini API for resume content
    });
  }

  /**
   * Improve existing resume section
   * @param section - Resume section to improve
   * @param content - Current section content
   * @returns Promise with improved content
   */
  async improveResumeSection(section: string, content: string): Promise<AIServiceResponse> {
    const prompt = `Improve this ${section} section of my resume:\n\n${content}\n\nProvide a more professional and impactful version.`;
    
    return this.generateContent({
      prompt,
      model: 'gemini-1.5-flash',
      useVertexAI: false,
    });
  }

  /**
   * Generate job-specific resume tailoring suggestions
   * @param jobDescription - Target job description
   * @param currentResume - Current resume content
   * @returns Promise with tailoring suggestions
   */
  async tailorResumeForJob(jobDescription: string, currentResume: string): Promise<AIServiceResponse> {
    const prompt = `
      Analyze this job description and provide specific suggestions to tailor my resume:
      
      Job Description:
      ${jobDescription}
      
      Current Resume:
      ${currentResume}
      
      Please provide:
      1. Keywords to add
      2. Skills to highlight
      3. Experience points to emphasize
      4. Specific improvements for better job matching
    `;

    return this.generateContent({
      prompt,
      model: 'gemini-1.5-pro', // Use more powerful model for complex analysis
      useVertexAI: true, // Use Vertex AI for better enterprise features
    });
  }

  /**
   * Check AI service availability
   * @returns Promise indicating if AI services are available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await apiCall('/api/status');
      return response.environment?.googleAI === 'configured' || 
             response.environment?.vertexAI === 'configured';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();

/**
 * Standalone function for simple AI resume generation
 * @param prompt - User prompt describing the resume content needed
 * @returns Promise with generated resume text
 */
export async function generateResume(prompt: string): Promise<string> {
  const res = await fetch(
    'https://us-central1-tradehustleresumebuilder.cloudfunctions.net/geminiAgent',
    {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Note: You'll need to add Firebase Auth token here for production
        // 'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ prompt }),
    }
  );
  
  const data = await res.json();
  
  // Handle authentication errors gracefully
  if (!data.success) {
    if (data.message && data.message.includes('Authentication required')) {
      throw new Error('Please sign in to use AI features');
    }
    throw new Error(data.error || data.message || 'AI generation failed');
  }
  
  return data.output;
}

/**
 * React hooks for easy AI integration
 */
import { useState, useCallback } from 'react';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async (options: AIServiceOptions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiService.generateContent(options);
      if (!result.success) {
        setError(result.error || 'AI generation failed');
        return null;
      }
      return result.output;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateResume = useCallback(async (prompt: string, currentResume?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiService.generateResumeContent(prompt, currentResume);
      if (!result.success) {
        setError(result.error || 'Resume generation failed');
        return null;
      }
      return result.output;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateContent,
    generateResume,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * Usage examples:
 * 
 * // Basic AI generation
 * const aiService = AIService.getInstance();
 * const response = await aiService.generateContent({
 *   prompt: 'Write a professional summary for a software engineer',
 *   model: 'gemini-1.5-flash'
 * });
 * 
 * // Resume-specific generation
 * const resumeContent = await aiService.generateResumeContent(
 *   'Create a summary for someone with 5 years in web development'
 * );
 * 
 * // Job tailoring
 * const tailored = await aiService.tailorResumeForJob(jobDescription, currentResume);
 * 
 * // Using React hooks
 * const { generateContent, isLoading, error } = useAI();
 * const result = await generateContent({ prompt: 'your prompt here' });
 */