# Trade Hustle Resume Builder - Security & Performance Implementation Guide

## 🔒 Security Best Practices Implementation

### 1. Content Security Policy (CSP)

**Next.js Configuration (`next.config.js`):**
```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com blob:;
      font-src 'self' https://fonts.gstatic.com data:;
      connect-src 'self' https://*.googleapis.com https://*.firebase.com wss://*.firebaseio.com https://www.google-analytics.com;
      media-src 'self' blob:;
      frame-src 'self' https://*.firebaseapp.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];

module.exports = {
  // ... existing config
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 2. Rate Limiting UI Feedback

**Create Rate Limit Hook (`lib/useRateLimit.ts`):**
```typescript
import { useState, useCallback } from 'react';

interface RateLimitState {
  limited: boolean;
  retryAfter: number | null;
  message: string;
}

export function useRateLimit() {
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    limited: false,
    retryAfter: null,
    message: '',
  });

  const checkRateLimit = useCallback((error: any) => {
    if (error?.status === 429 || error?.message?.includes('rate limit')) {
      const retryAfter = error?.retryAfter || 60;
      setRateLimit({
        limited: true,
        retryAfter,
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
      });

      // Auto-clear after retry period
      setTimeout(() => {
        setRateLimit({ limited: false, retryAfter: null, message: '' });
      }, retryAfter * 1000);

      return true;
    }
    return false;
  }, []);

  const resetRateLimit = useCallback(() => {
    setRateLimit({ limited: false, retryAfter: null, message: '' });
  }, []);

  return { rateLimit, checkRateLimit, resetRateLimit };
}
```

### 3. Environment Variable Validation

**Create Validation Schema (`lib/validateEnv.ts`):**
```typescript
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL',
];

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Please check your .env.local file.'
    );
  }
}

// Call in app initialization
if (typeof window === 'undefined') {
  validateEnvironment();
}
```

---

## ⚡ Performance Optimization

### 1. Image Optimization Script

**Convert PNGs to WebP (`scripts/optimize-images.js`):**
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath.replace(ext, '.webp'));
    
    console.log(`✅ Optimized: ${inputPath} → ${outputPath}`);
  }
}

// Optimize all images in /public/fx/
const fxDir = path.join(__dirname, '../public/fx');
const files = fs.readdirSync(fxDir);

files.forEach(async (file) => {
  const inputPath = path.join(fxDir, file);
  const outputPath = path.join(fxDir, file);
  await optimizeImage(inputPath, outputPath);
});
```

**Run:**
```bash
npm install sharp
node scripts/optimize-images.js
```

### 2. Video Optimization

**Compress MP4 with FFmpeg:**
```bash
# Install ffmpeg first (Windows: choco install ffmpeg)

# Compress video to web-optimized format
ffmpeg -i frontend/public/videos/paint-splatter.mp4 \
  -vcodec libx264 -crf 28 -preset slow \
  -vf scale=1920:-2 \
  -movflags +faststart \
  frontend/public/videos/paint-splatter-optimized.mp4

# Create WebM version for better compression
ffmpeg -i frontend/public/videos/paint-splatter.mp4 \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  frontend/public/videos/paint-splatter.webm

# Create poster image
ffmpeg -i frontend/public/videos/paint-splatter.mp4 \
  -ss 00:00:01 -vframes 1 \
  frontend/public/videos/paint-splatter-poster.jpg
```

### 3. Code Splitting & Dynamic Imports

**Optimize Imports (`app/unlock/page.tsx`):**
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'));
const Button = dynamic(() => import('@/components/Button'));
const StatusMessage = dynamic(() => import('@/components/StatusMessage'));

// Preload critical components
import { preload } from 'react-dom';
preload('/resumeBuilderlogo.png', { as: 'image' });
```

### 4. Font Optimization

**Update `layout.tsx` with Font Display:**
```typescript
import { Anton, EB_Garamond } from 'next/font/google';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap', // Critical for performance
  variable: '--font-anton',
  preload: true,
});

const ebGaramond = EB_Garamond({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-eb-garamond',
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${ebGaramond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🎯 Analytics & Monitoring

### 1. Error Tracking Integration

**Sentry Setup (`lib/sentry.ts`):**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Filter out honeypot field values
    if (event.request?.data?.company) {
      delete event.request.data.company;
    }
    return event;
  },
});

export function trackError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, { extra: context });
}
```

### 2. Performance Monitoring

**Web Vitals Tracking (`app/layout.tsx`):**
```typescript
import { sendGTMEvent } from '@next/third-parties/google';

export function reportWebVitals(metric: any) {
  const { name, value, id } = metric;
  
  sendGTMEvent({
    event: 'web_vitals',
    event_category: 'Web Vitals',
    event_action: name,
    event_value: Math.round(name === 'CLS' ? value * 1000 : value),
    event_label: id,
  });
}
```

---

## 🧪 Testing Implementation

### 1. Accessibility Testing Script

**Create `scripts/test-accessibility.js`:**
```javascript
const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/unlock');
  await page.waitForSelector('main');

  const results = await new AxePuppeteer(page).analyze();

  console.log('Accessibility Violations:', results.violations.length);
  results.violations.forEach((violation) => {
    console.log(`\n❌ ${violation.id}: ${violation.description}`);
    console.log(`   Impact: ${violation.impact}`);
    console.log(`   Elements affected: ${violation.nodes.length}`);
  });

  await browser.close();
})();
```

**Run:**
```bash
npm install @axe-core/puppeteer puppeteer
node scripts/test-accessibility.js
```

### 2. Performance Testing

**Lighthouse CI Configuration (`.lighthouserc.json`):**
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/unlock"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["warn", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 📦 Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run build` successfully
- [ ] Test all pages in production mode (`npm run start`)
- [ ] Verify environment variables in production
- [ ] Test authentication flow end-to-end
- [ ] Verify file downloads work
- [ ] Test on mobile devices (iOS Safari, Chrome Android)
- [ ] Run Lighthouse audit (all scores >85)
- [ ] Run accessibility tests (0 violations)
- [ ] Test with slow 3G throttling
- [ ] Verify error boundaries catch errors

### Security
- [ ] CSP headers configured
- [ ] HTTPS enforced
- [ ] Rate limiting active
- [ ] Honeypot field functional
- [ ] Firebase security rules deployed
- [ ] API keys rotated and secured
- [ ] Sensitive data not logged
- [ ] CORS properly configured

### Performance
- [ ] Images converted to WebP
- [ ] Videos compressed (<5MB)
- [ ] Fonts optimized with display:swap
- [ ] Code split and lazy loaded
- [ ] CDN configured for static assets
- [ ] Compression enabled (Brotli/Gzip)
- [ ] Browser caching headers set
- [ ] Core Web Vitals pass thresholds

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Analytics tracking verified (GA4)
- [ ] Performance monitoring active
- [ ] Uptime monitoring set up
- [ ] Alert thresholds configured

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
cd frontend
npm install

# Development
npm run dev

# Build for production
npm run build

# Test production build locally
npm run start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Optimize images
node scripts/optimize-images.js

# Run accessibility tests
node scripts/test-accessibility.js

# Lighthouse CI
npx lhci autorun
```

---

## 📊 Success Metrics

### Performance Targets
- **LCP (Largest Contentful Paint):** <2.5s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1
- **TTI (Time to Interactive):** <3.5s
- **Total Blocking Time:** <300ms

### Accessibility Targets
- **WCAG 2.1 Level:** AA compliance
- **Axe Violations:** 0
- **Color Contrast:** 4.5:1 minimum
- **Keyboard Navigation:** 100% functional
- **Screen Reader:** Complete compatibility

### Security Targets
- **CSP Violations:** 0
- **Security Headers:** All present
- **Rate Limit:** <0.1% of requests blocked
- **Bot Traffic:** <5% filtered by honeypot

---

## 🔧 Troubleshooting

### Common Issues

**1. Images not loading:**
- Check file paths are relative to `/public`
- Verify WebP fallback for old browsers
- Check CSP img-src directive

**2. Videos not playing:**
- Verify `autoplay muted playsInline` attributes
- Check video codec compatibility
- Add poster image for fallback

**3. Fonts not applying:**
- Verify font-heading/font-body classes used
- Check font files loaded in layout.tsx
- Clear browser cache

**4. Error boundary not catching errors:**
- Ensure ErrorBoundary wraps all components
- Check error is thrown during render, not async

**5. Rate limit not working:**
- Verify backend rate limiting configured
- Check useRateLimit hook integration
- Test with multiple rapid requests

---

## 📚 Additional Resources

- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Performance](https://web.dev/performance/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)

---

**Document Version:** 1.0
**Last Updated:** October 10, 2025
**Maintained By:** Trade Hustle Development Team
