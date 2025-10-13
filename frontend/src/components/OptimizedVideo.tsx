/**
 * Video Optimization Component
 * Enhanced video component with multiple formats, fallbacks, and error handling
 * 
 * Features:
 * - WebM and MP4 formats (browser picks best)
 * - Poster image for instant display
 * - Error handling with retry
 * - Accessibility (hidden from screen readers)
 * - Performance optimized (lazy loading ready)
 * 
 * Usage:
 * ```tsx
 * <OptimizedVideo
 *   src="/videos/paint-splatter"
 *   poster="/videos/paint-splatter-poster.jpg"
 *   className="absolute inset-0 w-full h-full object-cover"
 * />
 * ```
 */

'use client';

import { useState, useRef, useEffect } from 'react';

interface OptimizedVideoProps {
  src: string; // Path without extension (e.g., "/videos/paint-splatter")
  poster?: string; // Poster image path
  className?: string;
  loop?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
  style?: React.CSSProperties;
  onError?: () => void;
}

export default function OptimizedVideo({
  src,
  poster,
  className = '',
  loop = true,
  muted = true,
  autoPlay = true,
  playsInline = true,
  style,
  onError,
}: OptimizedVideoProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  /**
   * Handle video load error with retry logic
   */
  const handleError = () => {
    if (retryCountRef.current < MAX_RETRIES) {
      retryCountRef.current++;
      console.warn(`Video load failed, retrying... (${retryCountRef.current}/${MAX_RETRIES})`);
      
      // Retry after delay
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 1000 * retryCountRef.current); // Exponential backoff
    } else {
      console.error('Video failed to load after maximum retries');
      setHasError(true);
      onError?.();
    }
  };

  /**
   * Handle video loaded
   */
  const handleLoadedData = () => {
    setIsLoaded(true);
    retryCountRef.current = 0; // Reset retry count on success
  };

  /**
   * Attempt to play video (handle autoplay restrictions)
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        // Autoplay was prevented (common on mobile/Safari)
        console.warn('Autoplay prevented:', error);
        // Video will show poster image instead
      }
    };

    if (isLoaded) {
      playVideo();
    }
  }, [isLoaded, autoPlay]);

  /**
   * Respect prefers-reduced-motion
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        // User prefers reduced motion - pause video
        video.pause();
        video.style.display = 'none';
      } else {
        video.style.display = '';
        if (autoPlay) {
          video.play().catch(() => {
            // Silently handle autoplay failure
          });
        }
      }
    };

    // Check initial state
    handleMotionChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [autoPlay]);

  // Don't render if error occurred
  if (hasError) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      loop={loop}
      muted={muted}
      autoPlay={autoPlay}
      playsInline={playsInline}
      poster={poster}
      onError={handleError}
      onLoadedData={handleLoadedData}
      aria-hidden="true"
    >
      {/* WebM format (better compression, Chrome/Firefox) */}
      <source src={`${src}.webm`} type="video/webm" />
      
      {/* MP4 format (fallback, Safari/iOS) */}
      <source src={`${src}.mp4`} type="video/mp4" />
      
      {/* Fallback text for browsers without video support */}
      Your browser does not support the video tag.
    </video>
  );
}
