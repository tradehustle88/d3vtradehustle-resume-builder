# 🚀 Production Deployment Checklist
# Complete this checklist before deploying to production

## ✅ Pre-Deployment Tasks

### 1. Image Optimization
- [ ] Install Sharp: `cd frontend && npm install sharp`
- [ ] Run optimization: `node scripts/optimize-images.js`
- [ ] Verify WebP files created in `public/fx/optimized/`
- [ ] Update image imports to use optimized versions
- [ ] Test on Safari (PNG fallback) and Chrome (WebP)

### 2. Video Optimization
- [ ] Install FFmpeg: `choco install ffmpeg` (Windows) or `brew install ffmpeg` (macOS)
- [ ] Run optimization: `.\scripts\optimize-video.ps1` (PowerShell)
- [ ] Verify files created:
  - `public/videos/optimized/paint-splatter-optimized.mp4`
  - `public/videos/optimized/paint-splatter-optimized.webm`
  - `public/videos/optimized/paint-splatter-poster.jpg`
- [ ] Replace video components with OptimizedVideo component
- [ ] Test on Safari (MP4) and Chrome (WebM)

### 3. Security Headers (Firebase Hosting)
- [ ] Add headers to `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://*.cloudfunctions.net https://www.google-analytics.com; media-src 'self' blob:; frame-src 'self' https://*.firebaseapp.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "camera=(), microphone=(), geolocation=()"
          },
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=63072000; includeSubDomains; preload"
          }
        ]
      }
    ]
  }
}
```

### 4. Environment Variables
- [ ] Create `.env.local` from `.env.example`
- [ ] Verify all required Firebase credentials set
- [ ] Set production Firebase Functions URL
- [ ] Add Google Analytics measurement ID
- [ ] **Never commit `.env.local` to git**

### 5. Performance Monitoring
- [ ] Install web-vitals: `npm install web-vitals`
- [ ] Import webVitals in `app/layout.tsx`:
```tsx
import '../lib/webVitals';
```
- [ ] Verify Core Web Vitals logging in browser console
- [ ] Set up Sentry (optional but recommended):
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 6. Code Quality
- [ ] Run TypeScript check: `npm run type-check`
- [ ] Run linter: `npm run lint`
- [ ] Fix all errors and warnings
- [ ] Run build: `npm run build`
- [ ] Test production build locally: `npm run start`

### 7. Testing
- [ ] Test authentication flow (Google + Email)
- [ ] Test resume unlock feature
- [ ] Test PDF download
- [ ] Test on mobile devices (iOS Safari, Chrome Android)
- [ ] Test keyboard navigation (Tab, Enter, Esc)
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Test with slow 3G connection
- [ ] Test error states (network failure, 429 rate limit)

### 8. Accessibility
- [ ] Run Lighthouse accessibility audit (score > 90)
- [ ] Verify no Axe violations (if using test script)
- [ ] Test skip-to-content link (Tab on page load)
- [ ] Verify focus indicators visible
- [ ] Test with prefers-reduced-motion enabled

### 9. Performance
- [ ] Run Lighthouse performance audit (score > 85)
- [ ] Verify LCP < 2.5s
- [ ] Verify FID < 100ms
- [ ] Verify CLS < 0.1
- [ ] Check bundle size: `npm run build` (look for warnings)
- [ ] Verify images lazy load below fold
- [ ] Verify videos don't block page load

### 10. Analytics
- [ ] Verify Google Analytics tracking
- [ ] Test custom events:
  - `resume_unlock`
  - `resume_download`
  - `sign_up`
  - `sign_in`
- [ ] Verify Web Vitals events in GA4

---

## 🚀 Deployment Steps

### Frontend (Firebase Hosting)
```bash
cd frontend
npm run build
npm run export
firebase deploy --only hosting
```

### Backend (Firebase Functions)
```bash
cd api-functions
npm install
firebase deploy --only functions:api
```

### Verify Deployment
- [ ] Visit production URL
- [ ] Check browser console for errors
- [ ] Verify SSL certificate active (HTTPS)
- [ ] Test all features end-to-end
- [ ] Monitor error logs in Firebase Console

---

## 📊 Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor Firebase Functions logs for errors
- [ ] Check Google Analytics real-time users
- [ ] Review Core Web Vitals in GA4
- [ ] Monitor Sentry error tracking (if configured)
- [ ] Check Firebase Auth success rate
- [ ] Review Firestore read/write counts

### First Week
- [ ] Analyze user behavior in GA4
- [ ] Review conversion funnel (sign up → unlock → download)
- [ ] Check Core Web Vitals trends
- [ ] Review error logs and fix issues
- [ ] Monitor bandwidth usage
- [ ] Check mobile vs desktop performance

### Success Metrics
- **Performance:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Accessibility:** Lighthouse score > 90
- **Security:** No CSP violations, HTTPS enforced
- **Conversion:** > 25% unlock rate
- **Error Rate:** < 1% of sessions
- **Mobile:** > 50% of traffic (optimize if needed)

---

## 🔄 Rollback Plan

### If Critical Issues Found
```bash
# Rollback hosting
firebase hosting:rollback

# Rollback functions
firebase functions:delete api
# Then redeploy previous version
```

### Emergency Contacts
- Firebase Console: https://console.firebase.google.com
- Google Analytics: https://analytics.google.com
- Sentry (if configured): https://sentry.io

---

## 📝 Notes

### What We Implemented
- ✅ CSP security headers (ready for Firebase Hosting)
- ✅ Image optimization script (PNG → WebP)
- ✅ Video optimization scripts (MP4 + WebM)
- ✅ Font preloading and display=swap
- ✅ Rate limit UI handling with countdown
- ✅ Environment variable validation
- ✅ Web Vitals monitoring
- ✅ OptimizedVideo component with error handling
- ✅ Error boundaries for resilience
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Mobile-first responsive design
- ✅ Reduced motion support

### What's Optional (But Recommended)
- ⏳ Sentry error tracking
- ⏳ Automated accessibility tests
- ⏳ Visual regression tests
- ⏳ E2E tests with Playwright
- ⏳ Performance budgets
- ⏳ CDN configuration

### Known Limitations
- Static export doesn't support Next.js API routes (using Firebase Functions instead)
- Static export doesn't support `headers()` in next.config.js (use Firebase Hosting headers)
- Image optimization requires external script (Next.js Image component limited in static export)

---

**Last Updated:** October 10, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for Production Deployment
