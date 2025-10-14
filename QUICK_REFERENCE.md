# 🚀 Trade Hustle User Flow - Quick Reference

## Component Map

| Section | Component | Route | Status |
|---------|-----------|-------|--------|
| **A** Hero | `LandingPage.tsx` | `/` | ✅ Complete |
| **B** Trade Selection | `TradeSelectionGrid.tsx` | `/trade-selection` | ✅ Complete |
| **C** Template Gallery | `TemplateGallery.tsx` | `/templates` | ✅ Complete |
| **D** Resume Builder | `EnhancedResumeBuilder.tsx` | `/builder` | ✅ Complete |
| **E** Preview & ATS | `ResumePreview.tsx` | `/preview` | ✅ Complete |
| **F** Pricing | `PricingModal.tsx` | `/pricing` | ✅ Complete |
| **G** Authentication | `AuthScreen.tsx` | `/auth` | ✅ Complete |
| **H** Dashboard | `Dashboard.tsx` | `/dashboard` | ✅ Complete |

## User Journey

```
1. Landing Page → "Choose Your Trade & Get Started"
2. Trade Selection → Pick trade (8 options + custom)
3. Template Gallery → Choose from 25 ATS-optimized templates
4. Resume Builder → 4-step form with AI suggestions
5. Preview & ATS Score → Live preview + optimization tips
6. Pricing → 4 tiers (FREE / $2 Trial / $14.95/mo / $119/yr)
7. Auth → Google/Apple/Email/Magic Link
8. Dashboard → 5 modules (Resumes/Jobs/Certs/Blueprints/Referrals)
```

## Key Features per Section

### 🎯 A. Hero (LandingPage.tsx)
- Trust signals: "15 Min Setup", "95%+ ATS Score", "5,000+ Built"
- Primary CTA → Trade Selection
- Animated logo & brand messaging

### 🔧 B. Trade Selection (TradeSelectionGrid.tsx)
- 8 primary trades with icons & color gradients
- Custom trade input
- Hover effects & selection states

### 📄 C. Template Gallery (TemplateGallery.tsx)
- 25 templates per trade
- Category filters (ATS-Optimized, Modern, Classic, Creative, Executive)
- Preview modal
- ATS scores (85-100%)

### ✍️ D. Resume Builder (EnhancedResumeBuilder.tsx)
**Step 1**: Profile + Certifications
**Step 2**: Experience + Work History (AI-powered achievements)
**Step 3**: Skills + Tools + Licenses
**Step 4**: Education + References

### 📊 E. Preview & ATS (ResumePreview.tsx)
- **Left**: ATS Score (0-100), Keyword Analysis, AI Suggestions
- **Right**: Live resume rendering on white background

### 💰 F. Pricing (PricingModal.tsx)
- **FREE**: Plain text export
- **$2 Trial**: 7-day full access
- **$14.95/mo**: Pro Monthly
- **$119/yr**: Pro Annual (Save 33%)

### 🔐 G. Authentication (AuthScreen.tsx)
- Google Sign-In
- Apple Sign-In
- Email/Password
- Magic Link (passwordless)

### 🏠 H. Dashboard (Dashboard.tsx)
**H1**: My Resumes (edit/download/duplicate/share)
**H2**: Job Tracker (application status tracking)
**H3**: Cert Vault (license storage + expiry alerts)
**H4**: Career Blueprints (advancement paths - upsell)
**H5**: Refer & Earn (30-45% commission + bonuses)

## Trade Options

| Trade | Icon | Color Gradient |
|-------|------|----------------|
| Electrician | ⚡ | Yellow-600 → Yellow-800 |
| Plumber | 🔧 | Blue-600 → Blue-800 |
| HVAC | ❄️ | Cyan-600 → Cyan-800 |
| Carpenter | 🪚 | Amber-600 → Amber-800 |
| Mason | 🧱 | Orange-600 → Orange-800 |
| Welder | 🔥 | Red-600 → Red-800 |
| Mechanic | 🔩 | Gray-600 → Gray-800 |
| Gen. Contractor | 👷 | Green-600 → Green-800 |

## Pricing Tiers

| Tier | Price | Key Features | Badge |
|------|-------|--------------|-------|
| Free | $0 | Plain text export, basic structure | 🎁 FREE |
| Trial | $2 | 7-day full access, no renewal | ⚡ TRIAL |
| Monthly | $14.95/mo | All features, cancel anytime | - |
| Annual | $119/yr | Save 33%, Career Blueprints | 💎 BEST VALUE |

## Color System

```css
Primary Red:   #8B0000 (hustleRed)
Accent Gold:   #FFD700 (hustleGold)
Navy Blue:     #001A33 (hustleNavy)
Netflix Red:   #E50914 (headings)
Background:    Black → Gray-900 gradient
Cards:         Gray-800 + Gray-700 borders
```

## Grid System

- **Mobile**: 1 column (full width)
- **Tablet**: 2-4 columns (md:grid-cols-2, lg:grid-cols-4)
- **Desktop**: 4-12 columns (full 12-column grid)

## Navigation Flow

```
/ → /trade-selection → /templates → /builder → /preview → /pricing → /dashboard
                                          ↓
                                      /auth (Save Progress)
```

## Backend Endpoints Needed

| Endpoint | Purpose | Priority |
|----------|---------|----------|
| `POST /api/auth` | Email/password auth | 🔴 High |
| `POST /api/saveResume` | Save resume data | 🔴 High |
| `POST /api/getSuggestions` | AI content suggestions | 🟡 Medium |
| `POST /api/analyzeATS` | ATS score analysis | 🟡 Medium |
| `POST /api/generatePDF` | PDF export | 🔴 High |
| `POST /api/createCheckout` | Stripe checkout | 🔴 High |
| `POST /api/sendMagicLink` | Magic link email | 🟢 Low |

## Environment Variables

```bash
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://...cloudfunctions.net
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Quick Commands

```bash
# Dev
cd frontend && npm run dev

# Build
npm run build && npm run export

# Deploy Functions
firebase deploy --only functions:api

# Deploy Hosting
firebase deploy --only hosting

# Test
npm run lint
npm run type-check
./test-endpoints.sh
```

## Files Created

### Components (8 new)
- ✅ `frontend/src/components/LandingPage.tsx` (enhanced)
- ✅ `frontend/src/components/TradeSelectionGrid.tsx`
- ✅ `frontend/src/components/TemplateGallery.tsx`
- ✅ `frontend/src/components/EnhancedResumeBuilder.tsx`
- ✅ `frontend/src/components/ResumePreview.tsx`
- ✅ `frontend/src/components/PricingModal.tsx`
- ✅ `frontend/src/components/AuthScreen.tsx`
- ✅ `frontend/src/components/Dashboard.tsx`

### Routes (4 new)
- ✅ `frontend/src/app/trade-selection/page.tsx`
- ✅ `frontend/src/app/templates/page.tsx`
- ✅ `frontend/src/app/builder/page.tsx`
- ✅ `frontend/src/app/preview/page.tsx`

### Documentation (3 new)
- ✅ `USER_FLOW_IMPLEMENTATION.md`
- ✅ `INTEGRATION_GUIDE.md`
- ✅ `QUICK_REFERENCE.md` (this file)

### Configuration
- ✅ `frontend/tailwind.config.js` (enhanced with 12-column grid)

## Next Steps

1. **Integrate Firebase Auth** → `AuthScreen.tsx`
2. **Add State Management** → Context API or Zustand
3. **Connect AI Endpoints** → Gemini suggestions
4. **Implement PDF Generation** → Download functionality
5. **Test Complete Flow** → E2E user journey
6. **Deploy to Staging** → Test in production-like env

## Support

- 📖 Full docs: `USER_FLOW_IMPLEMENTATION.md`
- 🔧 Integration: `INTEGRATION_GUIDE.md`
- 🎨 Design: Brand colors in `tailwind.config.js`
- 🔥 Backend: `api-functions/index.js`

---

**Status**: ✅ Core implementation complete, ready for integration
**Version**: 1.0.0
**Last Updated**: October 13, 2025
