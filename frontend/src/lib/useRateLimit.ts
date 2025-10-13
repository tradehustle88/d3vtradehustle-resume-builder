/**
 * Rate Limit Hook
 * Handles API rate limiting with user-friendly countdown and retry logic
 * 
 * Features:
 * - Detects 429 status codes from API
 * - Shows countdown timer to user
 * - Auto-enables retry after cooldown
 * - Persists state across component remounts
 * 
 * Usage:
 * ```tsx
 * const { rateLimit, checkRateLimit, resetRateLimit } = useRateLimit();
 * 
 * try {
 *   const response = await api.unlockResume();
 * } catch (error) {
 *   if (checkRateLimit(error)) {
 *     // UI will show rate limit message automatically
 *   }
 * }
 * 
 * {rateLimit.isLimited && (
 *   <StatusMessage
 *     type="warning"
 *     title="Rate Limit Reached"
 *     message={`Too many requests. Try again in ${rateLimit.secondsRemaining}s.`}
 *   />
 * )}
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface RateLimitState {
  isLimited: boolean;
  retryAfter: number | null; // Unix timestamp
  secondsRemaining: number;
  message: string;
}

interface RateLimitError {
  response?: {
    status: number;
    headers?: {
      get?: (header: string) => string | null;
      'retry-after'?: string;
    };
  };
  status?: number;
  headers?: {
    'retry-after'?: string;
  };
}

const STORAGE_KEY = 'trade_hustle_rate_limit';
const DEFAULT_RETRY_SECONDS = 60; // Default to 60 seconds if no Retry-After header

/**
 * Parse Retry-After header (can be seconds or HTTP date)
 */
function parseRetryAfter(retryAfter: string | null | undefined): number {
  if (!retryAfter) return DEFAULT_RETRY_SECONDS;
  
  // Try parsing as seconds
  const seconds = parseInt(retryAfter, 10);
  if (!isNaN(seconds)) {
    return seconds;
  }
  
  // Try parsing as HTTP date
  try {
    const date = new Date(retryAfter);
    const now = Date.now();
    const diff = Math.ceil((date.getTime() - now) / 1000);
    return diff > 0 ? diff : DEFAULT_RETRY_SECONDS;
  } catch {
    return DEFAULT_RETRY_SECONDS;
  }
}

/**
 * Load rate limit state from localStorage
 */
function loadRateLimitState(): RateLimitState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const state = JSON.parse(stored);
    const now = Date.now();
    
    // Check if rate limit has expired
    if (state.retryAfter && state.retryAfter > now) {
      const secondsRemaining = Math.ceil((state.retryAfter - now) / 1000);
      return {
        ...state,
        secondsRemaining,
        isLimited: true,
      };
    }
    
    // Expired, clear storage
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

/**
 * Save rate limit state to localStorage
 */
function saveRateLimitState(state: RateLimitState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silent fail (localStorage might be disabled)
  }
}

/**
 * Custom hook for handling API rate limiting
 */
export function useRateLimit() {
  const [rateLimit, setRateLimit] = useState<RateLimitState>(() => {
    const stored = loadRateLimitState();
    return stored || {
      isLimited: false,
      retryAfter: null,
      secondsRemaining: 0,
      message: '',
    };
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * Start countdown timer
   */
  const startCountdown = useCallback((retryAfter: number) => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Update every second
    intervalRef.current = setInterval(() => {
      setRateLimit(prev => {
        if (!prev.retryAfter) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        
        const now = Date.now();
        const secondsRemaining = Math.ceil((prev.retryAfter - now) / 1000);
        
        // Rate limit expired
        if (secondsRemaining <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          localStorage.removeItem(STORAGE_KEY);
          
          return {
            isLimited: false,
            retryAfter: null,
            secondsRemaining: 0,
            message: '',
          };
        }
        
        // Update countdown
        const newState = {
          ...prev,
          secondsRemaining,
          message: `Too many requests. Please try again in ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''}.`,
        };
        
        saveRateLimitState(newState);
        return newState;
      });
    }, 1000);
  }, []);
  
  /**
   * Check if error is a rate limit error and update state
   */
  const checkRateLimit = useCallback((error: unknown): boolean => {
    const rateLimitError = error as RateLimitError;
    
    // Check for 429 status code
    const status = rateLimitError.response?.status || rateLimitError.status;
    if (status !== 429) return false;
    
    // Extract Retry-After header
    let retryAfterHeader: string | null | undefined;
    
    if (rateLimitError.response?.headers?.get) {
      // Fetch API response
      retryAfterHeader = rateLimitError.response.headers.get('Retry-After');
    } else if (rateLimitError.response?.headers?.['retry-after']) {
      // Axios response
      retryAfterHeader = rateLimitError.response.headers['retry-after'];
    } else if (rateLimitError.headers?.['retry-after']) {
      // Direct headers object
      retryAfterHeader = rateLimitError.headers['retry-after'];
    }
    
    const retrySeconds = parseRetryAfter(retryAfterHeader);
    const retryAfter = Date.now() + (retrySeconds * 1000);
    
    const newState: RateLimitState = {
      isLimited: true,
      retryAfter,
      secondsRemaining: retrySeconds,
      message: `Too many requests. Please try again in ${retrySeconds} second${retrySeconds !== 1 ? 's' : ''}.`,
    };
    
    setRateLimit(newState);
    saveRateLimitState(newState);
    startCountdown(retryAfter);
    
    return true;
  }, [startCountdown]);
  
  /**
   * Manually reset rate limit state
   */
  const resetRateLimit = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    localStorage.removeItem(STORAGE_KEY);
    
    setRateLimit({
      isLimited: false,
      retryAfter: null,
      secondsRemaining: 0,
      message: '',
    });
  }, []);
  
  /**
   * Start countdown on mount if rate limit is active
   */
  useEffect(() => {
    if (rateLimit.isLimited && rateLimit.retryAfter) {
      startCountdown(rateLimit.retryAfter);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [rateLimit.isLimited, rateLimit.retryAfter, startCountdown]);
  
  return {
    rateLimit,
    checkRateLimit,
    resetRateLimit,
    isRateLimited: rateLimit.isLimited,
  };
}

export default useRateLimit;
