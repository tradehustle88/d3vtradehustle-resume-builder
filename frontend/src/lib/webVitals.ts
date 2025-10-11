/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and sends to Google Analytics
 * 
 * Features:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * 
 * Usage:
 * Import in app/layout.tsx:
 * ```tsx
 * import './webVitals';
 * ```
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';

/**
 * Send metric to Google Analytics
 */
function sendToGoogleAnalytics(metric: Metric) {
  // Check if gtag is available
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics not loaded, skipping metric:', metric.name);
    return;
  }

  // Send to GA4
  window.gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: getMetricRating(metric),
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: getMetricRating(metric),
      delta: metric.delta,
    });
  }
}

/**
 * Get rating (good/needs-improvement/poor) based on Web Vitals thresholds
 */
function getMetricRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[metric.name as keyof typeof thresholds];
  if (!threshold) return 'good';

  if (metric.value <= threshold.good) return 'good';
  if (metric.value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Log vitals summary to console
 */
function logVitalsSummary(metrics: Record<string, Metric>) {
  console.group('🚀 Web Vitals Summary');
  
  Object.entries(metrics).forEach(([name, metric]) => {
    const rating = getMetricRating(metric);
    const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
    const value = name === 'CLS' ? metric.value.toFixed(3) : `${Math.round(metric.value)}ms`;
    
    console.log(`${emoji} ${name}: ${value} (${rating})`);
  });
  
  console.groupEnd();
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  const metrics: Record<string, Metric> = {};

  // Track all Core Web Vitals (web-vitals v5 API)
  onCLS((metric) => {
    metrics.CLS = metric;
    sendToGoogleAnalytics(metric);
  });

  onINP((metric) => {
    metrics.INP = metric;
    sendToGoogleAnalytics(metric);
  });

  onFCP((metric) => {
    metrics.FCP = metric;
    sendToGoogleAnalytics(metric);
  });

  onLCP((metric) => {
    metrics.LCP = metric;
    sendToGoogleAnalytics(metric);
  });

  onTTFB((metric) => {
    metrics.TTFB = metric;
    sendToGoogleAnalytics(metric);
  });

  // Log summary after page load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (Object.keys(metrics).length > 0) {
          logVitalsSummary(metrics);
        }
      }, 3000); // Wait 3s for all metrics to be collected
    });
  }
}

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  initWebVitals();
}
