# 📊 Google Analytics Integration - Trade Hustle Resume Builder

## ✅ Implementation Complete

Google Analytics 4 (GA4) tracking has been fully integrated into the Trade Hustle Resume Builder with custom event tracking for trade-specific user actions.

### Measurement ID
```
G-WV2HHYYKCL
```

## 🎯 What's Being Tracked

### 1. **Automatic Tracking** (Built-in GA4 Features)
- Page views on all routes
- User sessions and engagement
- Device and browser information
- Geographic location data
- Traffic sources and referrals

### 2. **Custom Event Tracking** (Trade-Specific)

#### Resume Actions:
- **`resume_unlock`** - When a user successfully unlocks the resume kit
  - Category: `conversion`
  - Value: 1
  
- **`resume_download`** - When the PDF download is triggered
  - Method: `Trade Hustle Resume Kit`
  - Category: `engagement`

#### Authentication Events:
- **`sign_up`** - New user registration
  - Methods tracked: `email`, `google`
  - Category: `engagement`
  
- **`login`** - User authentication
  - Methods tracked: `email`, `google`
  - Category: `engagement`

#### Custom Events:
- **`view_api_demo`** - API testing dashboard views
- Custom events via `trackCustomEvent()` utility
- Error tracking via `trackError()` utility

## 📁 Files Modified

### 1. **`frontend/src/app/layout.tsx`**
Added Google Analytics gtag.js script:
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-WV2HHYYKCL"
  strategy="afterInteractive"
/>
<Script id="ga" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WV2HHYYKCL', {
      page_path: window.location.pathname,
    });
  `}
</Script>
```

### 2. **`frontend/src/lib/analytics.ts`** (NEW)
Utility functions for event tracking:
- `trackPageView(url)` - Manual page view tracking
- `trackResumeDownload(method)` - Resume download events
- `trackResumeUnlock(email)` - Resume unlock conversion
- `trackSignup(method)` - User signup events
- `trackLogin(method)` - User login events
- `trackApiDemo()` - API demo page views
- `trackCustomEvent(name, params)` - Custom events
- `trackError(description, fatal)` - Error tracking

### 3. **`frontend/src/app/unlock/page.tsx`**
Added tracking for:
- Resume unlock success
- PDF download triggers

### 4. **`frontend/src/components/AuthForm.tsx`**
Added tracking for:
- Google sign-in
- Email signup
- Email login

## 🚀 How to Use Analytics Tracking

### Example: Track Resume Download
```typescript
import { trackResumeDownload } from '@/lib/analytics';

// When user downloads resume
trackResumeDownload('Trade Hustle Resume Kit');
```

### Example: Track Custom Event
```typescript
import { trackCustomEvent } from '@/lib/analytics';

// Track a custom trade-specific action
trackCustomEvent('template_selected', {
  template_name: 'HVAC Professional',
  template_type: 'modern',
});
```

### Example: Track Errors
```typescript
import { trackError } from '@/lib/analytics';

try {
  // Some operation
} catch (error) {
  trackError(`API call failed: ${error.message}`, false);
}
```

## 📈 Viewing Your Data

### Google Analytics Dashboard
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select property: **Trade Hustle Resume Builder** (G-WV2HHYYKCL)
3. Navigate to different reports:

#### Real-time Reports
- **Reports > Realtime** - See live user activity
- View current page views and events as they happen

#### Custom Events
- **Reports > Engagement > Events** - See all tracked events:
  - `resume_download`
  - `resume_unlock`
  - `sign_up`
  - `login`
  - `view_api_demo`

#### Conversions
- **Reports > Engagement > Conversions** - Track key actions:
  - Resume unlocks (primary conversion)
  - User signups

#### User Acquisition
- **Reports > Acquisition > User acquisition** - See where users come from:
  - Direct traffic
  - Google search
  - Social media referrals
  - Other sources

## 🎨 Future Custom Events to Consider

### Trade-Specific Tracking Ideas:
```typescript
// Track which trade categories users select
trackCustomEvent('trade_category_selected', {
  category: 'HVAC',
  experience_level: 'entry',
});

// Track resume template choices
trackCustomEvent('template_chosen', {
  template_name: 'Modern Trade',
  trade: 'Electrician',
});

// Track AI resume editing usage
trackCustomEvent('ai_edit_request', {
  section: 'work_experience',
  prompt_length: 150,
});

// Track cover letter downloads
trackCustomEvent('cover_letter_download', {
  template: 'Professional',
});

// Track time spent on key pages
trackCustomEvent('page_engagement', {
  page: '/resume',
  time_seconds: 120,
});
```

## 🔧 Integration with Firebase Hosting

### Deployment
When you deploy to Firebase Hosting, the Analytics code is automatically included:

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

The GA script loads on every page after deployment.

### Verification
1. Deploy to Firebase
2. Visit your live site
3. Check Real-time reports in Google Analytics
4. You should see your visit within 30-60 seconds

## 🛡️ Privacy & Compliance

### Data Collected:
- Anonymous user interactions
- Page views and navigation patterns
- Custom events (resume unlocks, downloads)
- No personally identifiable information (PII) is sent to GA

### Best Practices:
- ✅ Email addresses are NOT sent to Google Analytics
- ✅ User IDs are anonymized
- ✅ All tracking complies with GA4 privacy policies
- ⚠️ Consider adding cookie consent banner for EU users (GDPR)

## 🐛 Troubleshooting

### Analytics Not Working?

1. **Check if gtag is loaded:**
```javascript
// In browser console
console.log(typeof window.gtag); // Should be 'function'
console.log(window.dataLayer); // Should be an array
```

2. **Verify GA ID in code:**
```bash
grep -r "G-WV2HHYYKCL" frontend/src/
```

3. **Check Network Tab:**
   - Open DevTools > Network
   - Filter by "google-analytics" or "gtag"
   - You should see requests to `www.google-analytics.com`

4. **Test Events Manually:**
```javascript
// In browser console
window.gtag('event', 'test_event', { test: 'value' });
```

### Events Not Appearing?

- Events can take 24-48 hours to appear in standard reports
- Use **Realtime** reports to see events immediately
- Check Events tab under Realtime to debug

### Measurement ID Warning?

If you still see "Tag not detected" in GA dashboard:
1. Wait 5-10 minutes after deployment
2. Clear browser cache
3. Visit site in incognito mode
4. Check Real-time reports (not standard reports)

## 📊 Key Metrics to Monitor

### Primary Goals:
1. **Resume Unlock Rate** - `resume_unlock` / total visits
2. **Download Completion** - `resume_download` / `resume_unlock`
3. **Signup Conversion** - `sign_up` / total visits
4. **User Retention** - Returning users / Total users

### Secondary Metrics:
1. Average session duration on `/unlock` page
2. Google vs Email signup ratio
3. Traffic sources driving most unlocks
4. Mobile vs Desktop usage

## 🎉 Success Metrics

Once live, you'll be able to answer:
- ✅ How many people visit the resume builder?
- ✅ What percentage unlock the resume kit?
- ✅ Which authentication method is most popular?
- ✅ Where is traffic coming from?
- ✅ Which pages have the highest engagement?
- ✅ What's the typical user journey?

## 📝 Next Steps

### Recommended Enhancements:

1. **Set up Conversions:**
   - Mark `resume_unlock` as a key conversion in GA4
   - Set a monetary value if applicable

2. **Create Custom Reports:**
   - Funnel analysis: Visit → Signup → Unlock → Download
   - Cohort analysis for user retention

3. **Enable Enhanced Measurement:**
   - Scroll tracking
   - Outbound link clicks
   - File downloads

4. **Add Cookie Consent (Optional):**
   - For GDPR compliance
   - Use a package like `react-cookie-consent`

5. **Track Additional Events:**
   - AI usage frequency
   - Template selection
   - Page engagement time

---

## 🚀 Quick Reference

### Import Analytics:
```typescript
import { 
  trackResumeDownload, 
  trackResumeUnlock, 
  trackSignup, 
  trackLogin,
  trackCustomEvent 
} from '@/lib/analytics';
```

### Track Event:
```typescript
trackCustomEvent('event_name', { param: 'value' });
```

### View Live Data:
```
https://analytics.google.com/analytics/web/#/p[YOUR_PROPERTY_ID]/realtime
```

---

**Implementation Date:** October 1, 2025  
**Status:** ✅ Live and Tracking  
**Measurement ID:** G-WV2HHYYKCL
