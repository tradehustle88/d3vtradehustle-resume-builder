# 🏗️ Trade Hustle Resume Builder - Complete Wireframe & Pipeline

**Last Updated:** October 17, 2025  
**Status:** Production-Ready  
**Live URL:** https://d3vtradehustle-resume-builder.web.app

---

## 📋 Quick Navigation
- [System Architecture](#-system-architecture)
- [Complete Pipeline Flow](#-complete-pipeline-flow)
- [Frontend Structure](#-frontend-structure)
- [Backend Structure](#-backend-structure)
- [Data Flow & API](#-data-flow--api)
- [Development Pipeline](#-development-pipeline)
- [Deployment Pipeline](#-deployment-pipeline)
- [User Journeys](#-user-journeys)

---

## 🏛️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    TRADE HUSTLE PLATFORM                              │
│                 Resume Builder for Skilled Trades                     │
└──────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   USERS     │
                              │  (Browser)  │
                              └──────┬──────┘
                                     │
                         ┌───────────▼──────────┐
                         │  FIREBASE HOSTING   │
                         │  (CDN Distribution) │
                         │  frontend/out/      │
                         └───────────┬─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
            ┌───────▼──────┐  ┌──────▼─────┐  ┌──────▼─────┐
            │  Next.js 14  │  │ Static    │  │  Assets    │
            │  React App   │  │ HTML/CSS  │  │ /public/   │
            │  (Client)    │  │ /out/     │  │ Images/PDF │
            └───────┬──────┘  └───────────┘  └────────────┘
                    │
                    │ API Calls (fetch)
                    │
            ┌───────▼──────────────────────────┐
            │  FIREBASE FUNCTIONS v2           │
            │  api-functions/index.js          │
            │  Express.js API                  │
            └───────┬──────────────────────────┘
                    │
        ┌───────────┼───────────┬──────────────┐
        │           │           │              │
   ┌────▼───┐  ┌───▼────┐  ┌───▼────┐  ┌──────▼──────┐
   │Firebase│  │Firestore│  │ Gemini│  │   Stripe    │
   │  Auth  │  │Database │  │2.5 AI │  │   Payment   │
   └────────┘  └─────────┘  └────────┘  └─────────────┘
```

---

## 🔄 Complete Pipeline Flow

### **1. Development Pipeline**

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOCAL DEVELOPMENT                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: CODE CHANGES
├─ frontend/src/               → Next.js React Components
├─ api-functions/              → Firebase Functions (Express)
└─ Testing Scripts             → test-flow.sh, test-endpoints.sh

Step 2: LOCAL TESTING
├─ npm run dev                 → Frontend dev server (localhost:3000)
├─ firebase emulators:start    → Functions + Firestore (localhost:5001)
└─ ./test-flow.sh              → Integration tests

Step 3: QUALITY CHECKS
├─ npm run lint                → ESLint validation
├─ npm run type-check          → TypeScript validation
└─ npm run build               → Production build test

Step 4: VERSION CONTROL
├─ git add .
├─ git commit -m "message"
└─ git push origin [branch]
```

### **2. Build Pipeline**

```
┌─────────────────────────────────────────────────────────────────┐
│                        BUILD PROCESS                             │
└─────────────────────────────────────────────────────────────────┘

FRONTEND BUILD (frontend/)
├─ Step 1: npm install
├─ Step 2: npm run build       → Creates .next/ optimized bundle
├─ Step 3: npm run export      → Exports to out/ static files
└─ Output: frontend/out/       → Static HTML/CSS/JS ready for hosting

BACKEND BUILD (api-functions/)
├─ Step 1: npm install
├─ Step 2: Firebase deploys source directly (no build step)
└─ Output: Cloud Functions deployed to Firebase

ARTIFACTS GENERATED:
frontend/out/
├─ _next/static/               → Optimized JS/CSS bundles
├─ assets/                     → Images, textures, fonts
├─ resume-kit.pdf              → Downloadable resume template
├─ index.html                  → Landing page
├─ unlock.html                 → Auth/unlock page
└─ builder.html                → Resume builder app
```

### **3. Deployment Pipeline**

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT FLOW                               │
└─────────────────────────────────────────────────────────────────┘

MANUAL DEPLOYMENT (Current Method):

1. DEPLOY FUNCTIONS
   $ firebase deploy --only functions:api
   ├─ Uploads api-functions/ to Google Cloud
   ├─ Provisions Node.js 20 runtime
   └─ ✅ Live at: us-central1-api endpoint

2. BUILD & DEPLOY FRONTEND
   $ cd frontend
   $ npm run build
   $ npm run export
   $ cd ..
   $ firebase deploy --only hosting
   ├─ Uploads frontend/out/ to Firebase Hosting
   ├─ CDN distribution globally
   └─ ✅ Live at: https://d3vtradehustle-resume-builder.web.app

AUTOMATED DEPLOYMENT (GitHub Actions - Optional):

Trigger: Push to main branch
├─ .github/workflows/deploy.yml runs
├─ Installs dependencies
├─ Runs tests
├─ Builds frontend
├─ Deploys functions + hosting
└─ Sends notification

ROLLBACK:
$ firebase hosting:rollback     → Reverts to previous hosting version
```

---

## 🎨 Frontend Structure

### **App Router Layout**

```
frontend/src/app/
├─ layout.tsx                   → Root layout (fonts, GA, metadata)
├─ page.tsx                     → Landing page (/)
├─ unlock/
│  └─ page.tsx                  → Auth + resume unlock page (/unlock)
├─ builder/
│  └─ page.tsx                  → AI resume editor (/builder)
├─ dashboard/
│  └─ page.tsx                  → User dashboard (/dashboard)
└─ templates/
   └─ page.tsx                  → Resume templates gallery (/templates)
```

### **Component Hierarchy**

```
frontend/src/components/
├─ ui/
│  ├─ Button.tsx               → Hustle-themed buttons (btn-hustle, btn-gold)
│  ├─ Modal.tsx                → Reusable modal component
│  └─ Spinner.tsx              → Loading indicators
├─ auth/
│  ├─ AuthProvider.tsx         → Firebase Auth context
│  ├─ SignInModal.tsx          → Email/password sign-in
│  └─ GoogleSignIn.tsx         → Google OAuth button
├─ resume/
│  ├─ ResumeEditor.tsx         → AI-powered editor
│  ├─ ResumePreview.tsx        → Live preview panel
│  └─ DownloadButton.tsx       → PDF download logic
└─ layout/
   ├─ Header.tsx               → Navigation bar
   ├─ Footer.tsx               → Site footer
   └─ Hero.tsx                 → Landing page hero section
```

### **Key Libraries & Utilities**

```
frontend/src/lib/
├─ firebase.ts                 → Firebase SDK initialization
├─ api.ts                      → API fetch wrapper with auth headers
├─ analytics.ts                → Google Analytics event tracking
└─ utils.ts                    → Helper functions (formatDate, etc.)

frontend/public/
├─ assets/
│  ├─ brick-texture.jpg        → Hustle theme texture
│  ├─ paint-gold.png           → Gold paint splatter
│  └─ logo.svg                 → Brand logo
└─ resume-kit.pdf              → Downloadable template (unlocked users)
```

---

## ⚙️ Backend Structure

### **Express API Routes**

```
api-functions/index.js (Main Entry Point)

MIDDLEWARE STACK:
├─ CORS (origin: true)
├─ Rate Limiting (30 req/min)
├─ Honeypot Check (rejects bots)
└─ Auth Verification (verifyUser)

ENDPOINTS:

PUBLIC:
├─ GET  /api/health            → Health check (no auth)
└─ POST /api/signup            → Email capture (honeypot protected)

AUTHENTICATED:
├─ POST /api/unlockResume      → Unlock resume kit (requires auth token)
│  ├─ Verifies Firebase ID token
│  ├─ Saves unlock to Firestore users/{uid}
│  └─ Returns { success: true, message: "Resume unlocked" }
│
└─ POST /api/editResume        → AI resume editing (requires auth token)
   ├─ Body: { prompt: string, resumeContent?: string }
   ├─ Calls Gemini 2.5 Flash Preview API
   ├─ Returns AI-generated suggestions
   └─ Graceful degradation if GOOGLE_API_KEY missing
```

### **Middleware Files**

```
api-functions/middleware/
├─ auth.js
│  ├─ verifyUser()             → Validates Firebase ID token
│  └─ requireRole(role)        → Role-based access control
│
├─ rateLimiter.js
│  └─ rateLimiter              → 30 requests/minute per IP
│
└─ honeypot.js
   └─ honeypotCheck            → Rejects requests with "company" field
```

### **Services Layer**

```
api-functions/services/
├─ resumeEngine.js
│  ├─ generateTradeResume()    → Smart resume generation
│  ├─ enhanceWithAI()          → AI content enhancement
│  └─ Trade-specific templates (HVAC, Electrical, etc.)
│
└─ email-automation.js
   ├─ sendWelcomeEmail()       → Welcome email on signup
   ├─ sendUnlockEmail()        → Resume kit delivery
   └─ sendPaymentConfirmation()→ Stripe payment receipt
```

---

## 🔄 Data Flow & API

### **Authentication Flow**

```
┌──────────┐                  ┌──────────────┐
│  CLIENT  │                  │   FIREBASE   │
│ Browser  │                  │    AUTH      │
└─────┬────┘                  └──────┬───────┘
      │                              │
      │ 1. User clicks "Sign In"     │
      ├─────────────────────────────>│
      │                              │
      │ 2. Google OAuth popup        │
      │<─────────────────────────────┤
      │                              │
      │ 3. User authorizes           │
      ├─────────────────────────────>│
      │                              │
      │ 4. ID Token returned         │
      │<─────────────────────────────┤
      │                              │
      │ 5. Store token in localStorage
      │    + Set AuthContext         │
      │                              │
      │ 6. API calls include token   │
      │    Authorization: Bearer <token>
      └──────────────────────────────┘
```

### **Resume Unlock Flow**

```
USER JOURNEY:
1. User lands on /unlock page
2. Sign in with Google or Email/Password
3. Click "Unlock Resume Kit"
   │
   ├─> POST /api/unlockResume
   │   Headers: { Authorization: Bearer <token> }
   │
   ├─> BACKEND VALIDATES:
   │   ├─ Token valid?
   │   ├─ User exists?
   │   └─ Rate limit OK?
   │
   ├─> FIRESTORE UPDATE:
   │   users/{uid} { hasUnlockedResume: true, unlockedAt: Date }
   │
   └─> RESPONSE:
       { success: true, message: "Resume kit unlocked!" }

4. Frontend shows download button
5. User downloads resume-kit.pdf
   └─> Google Analytics event: resume_download
```

### **AI Resume Editing Flow**

```
USER JOURNEY:
1. User navigates to /builder
2. Enters resume content or uses template
3. Enters AI prompt: "Make this sound more professional"
   │
   ├─> POST /api/editResume
   │   Headers: { Authorization: Bearer <token> }
   │   Body: { prompt: "...", resumeContent: "..." }
   │
   ├─> BACKEND PROCESSING:
   │   ├─ Validate auth token
   │   ├─ Check rate limits
   │   ├─> Call Gemini API:
   │       {
   │         model: "gemini-2.5-flash-preview-09-2025",
   │         prompt: "Improve this resume: [content]..."
   │       }
   │   └─> AI returns enhanced text
   │
   └─> RESPONSE:
       {
         success: true,
         editedContent: "Enhanced resume text...",
         suggestions: ["Add quantifiable metrics", "..."]
       }

4. Frontend displays AI suggestions
5. User applies changes to resume
   └─> Google Analytics event: ai_edit_applied
```

---

## 🛠️ Development Pipeline

### **Local Development Setup**

```bash
# 1. Clone Repository
git clone https://github.com/tradehustle88/d3vtradehustle-resume-builder.git
cd d3vtradehustle-resume-builder

# 2. Install Dependencies
cd frontend
npm install
cd ../api-functions
npm install
cd ..

# 3. Configure Environment Variables
# Create frontend/.env.local with:
NEXT_PUBLIC_FIREBASE_API_KEY=<your-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=http://localhost:5001/<project-id>/us-central1/api

# Create api-functions/.env with:
GOOGLE_API_KEY=<your-gemini-key>
FIREBASE_SERVICE_ACCOUNT_KEY=<base64-encoded-json>

# 4. Start Development Servers
# Terminal 1: Firebase Emulators
firebase emulators:start

# Terminal 2: Frontend Dev Server
cd frontend
npm run dev
# Visit http://localhost:3000

# 5. Run Tests
cd frontend
./test-flow.sh       # Tests auth + unlock flow
./test-endpoints.sh  # Tests API endpoints
```

### **Testing Strategy**

```
UNIT TESTS (Planned):
├─ Jest for React components
├─ Mocha/Chai for backend functions
└─ Test coverage target: 80%+

INTEGRATION TESTS (Current):
├─ test-flow.sh
│  ├─ Tests signup endpoint
│  ├─ Tests unlock endpoint with auth
│  └─ Validates Firestore writes
│
└─ test-endpoints.sh
   ├─ Health check
   ├─ Honeypot validation
   └─ Rate limiter validation

MANUAL TESTING CHECKLIST:
□ Sign in with Google
□ Sign in with Email/Password
□ Unlock resume kit
□ Download PDF
□ Edit resume with AI
□ Check Google Analytics events
□ Test on mobile devices
□ Test on different browsers
```

---

## 🚀 Deployment Pipeline

### **Pre-Deployment Checklist**

```
BEFORE DEPLOYING:

□ Code Quality
  ├─ npm run lint (no errors)
  ├─ npm run type-check (TypeScript valid)
  └─ npm run build (builds successfully)

□ Environment Variables
  ├─ frontend/.env.local configured
  ├─ api-functions/.env configured
  └─ Firebase project selected: firebase use production

□ Testing
  ├─ ./test-flow.sh passes
  ├─ ./test-endpoints.sh passes
  └─ Manual QA completed

□ Version Control
  ├─ All changes committed
  ├─ Branch merged to main
  └─ Tagged release: git tag v1.0.x
```

### **Deployment Commands**

```bash
# FULL DEPLOYMENT (Functions + Hosting)

# Step 1: Build Frontend
cd frontend
npm run build
npm run export
cd ..

# Step 2: Deploy Everything
firebase deploy
# OR deploy separately:
firebase deploy --only functions:api
firebase deploy --only hosting

# Step 3: Verify Deployment
curl https://us-central1-<project-id>.cloudfunctions.net/api/health
curl https://d3vtradehustle-resume-builder.web.app

# Step 4: Monitor Logs
firebase functions:log --only api

# ROLLBACK if needed:
firebase hosting:rollback
```

### **CI/CD with GitHub Actions (Optional)**

```yaml
# .github/workflows/deploy.yml

name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Dependencies
        run: |
          cd frontend && npm ci
          cd ../api-functions && npm ci
      
      - name: Run Tests
        run: |
          cd frontend
          npm run lint
          npm run type-check
          ./test-flow.sh
      
      - name: Build Frontend
        run: |
          cd frontend
          npm run build
          npm run export
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

---

## 👤 User Journeys

### **Journey 1: New Visitor → Resume Download**

```
STEP 1: DISCOVERY
├─ User finds site via Google search or social media
├─ Lands on homepage (/)
└─ Sees hero: "Build Professional Trade Resumes"

STEP 2: ENGAGEMENT
├─ Scrolls to features section
├─ Clicks "Get Your Free Resume Kit"
└─ Redirected to /unlock

STEP 3: AUTHENTICATION
├─ Clicks "Continue with Google" or "Sign in with Email"
├─ Completes OAuth or creates account
└─ Redirected back to /unlock (now authenticated)

STEP 4: UNLOCK
├─ Clicks "Unlock Resume Kit" button
├─ Backend saves unlock to Firestore
├─ Button changes to "Download Resume Kit"
└─ Google Analytics event: resume_unlock

STEP 5: DOWNLOAD
├─ Clicks "Download Resume Kit" button
├─ Browser downloads resume-kit.pdf
├─ Google Analytics event: resume_download
└─ User has PDF template

CONVERSION COMPLETE ✅
└─ Email automation sends welcome email with tips
```

### **Journey 2: Returning User → AI Resume Builder**

```
STEP 1: RETURN VISIT
├─ User returns to site (already authenticated)
├─ Clicks "Resume Builder" in navigation
└─ Navigated to /builder

STEP 2: CONTENT INPUT
├─ User pastes existing resume or starts from template
├─ Resume preview updates in real-time
└─ User sees AI editing panel

STEP 3: AI ENHANCEMENT
├─ User types prompt: "Make this sound more confident"
├─ Clicks "Enhance with AI" button
├─ Loading spinner appears
├─ Backend calls Gemini 2.5 Flash API
└─ AI suggestions appear in sidebar

STEP 4: APPLY CHANGES
├─ User reviews AI suggestions
├─ Clicks "Apply Suggestions"
├─ Resume preview updates with enhanced text
└─ Google Analytics event: ai_edit_applied

STEP 5: DOWNLOAD
├─ User clicks "Download as PDF"
├─ Browser generates PDF from preview
├─ Google Analytics event: resume_download
└─ User has professionally enhanced resume

CONVERSION COMPLETE ✅
└─ User can edit and download unlimited times
```

### **Journey 3: Admin → Monitor System**

```
ADMIN DASHBOARD (Future Feature):
├─ Admin logs in at /admin (role-based access)
├─ Views analytics dashboard
│  ├─ Total signups today
│  ├─ Resume unlocks today
│  ├─ AI edits performed
│  └─ Revenue metrics (Stripe integration)
├─ Monitors Firebase Functions logs
├─ Checks error rates and API latency
└─ Manages user accounts and permissions
```

---

## 📊 System Metrics & Monitoring

### **Key Performance Indicators**

```
USER METRICS:
├─ Daily Active Users (DAU)
├─ Signup conversion rate
├─ Resume unlock rate
├─ AI edit usage
└─ PDF download rate

TECHNICAL METRICS:
├─ Page load time (target: <2s)
├─ API response time (target: <500ms)
├─ Firebase Functions execution time
├─ Error rate (target: <1%)
└─ Uptime (target: 99.9%)

BUSINESS METRICS (Future):
├─ Stripe payment success rate
├─ Subscription retention rate
├─ Monthly Recurring Revenue (MRR)
└─ Customer Lifetime Value (CLV)
```

### **Monitoring Tools**

```
GOOGLE ANALYTICS 4:
├─ Page views, user sessions
├─ Custom events (signup, unlock, download)
├─ Conversion funnels
└─ Real-time user tracking

FIREBASE CONSOLE:
├─ Functions logs and errors
├─ Firestore usage and query performance
├─ Authentication activity
└─ Hosting bandwidth and requests

LIGHTHOUSE AUDITS:
├─ Performance score: 95+
├─ Accessibility score: 100
├─ Best Practices score: 100
└─ SEO score: 100
```

---

## 🔒 Security & Compliance

### **Security Measures**

```
AUTHENTICATION:
├─ Firebase JWT token validation
├─ Token expiration (1 hour)
├─ Secure httpOnly cookies (future)
└─ Rate limiting (30 req/min)

DATA PROTECTION:
├─ Firestore security rules (role-based)
├─ No sensitive data in client-side code
├─ Environment variables for secrets
└─ HTTPS-only connections

API SECURITY:
├─ CORS restricted to allowed origins
├─ Honeypot spam protection
├─ Input sanitization
└─ Error messages don't leak sensitive info

COMPLIANCE:
├─ GDPR-compliant (user data deletion on request)
├─ Privacy policy displayed
├─ Cookie consent (future)
└─ Terms of service accepted on signup
```

### **Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Users can read/write their own data
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
      
      // Admins can read all users
      allow read: if request.auth != null 
                  && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Unlocks collection (audit trail)
    match /unlocks/{unlockId} {
      // Only authenticated users can create unlocks
      allow create: if request.auth != null;
      
      // Users can read their own unlocks
      allow read: if request.auth != null 
                  && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 📈 Future Enhancements

### **Phase 1: Current State (COMPLETE)**
- ✅ Landing page with hero and features
- ✅ Authentication (Google + Email/Password)
- ✅ Resume unlock system
- ✅ PDF download functionality
- ✅ AI resume editing with Gemini 2.5
- ✅ Google Analytics integration
- ✅ Production deployment

### **Phase 2: Monetization (In Progress)**
- ⏳ Stripe payment integration
- ⏳ Subscription tiers (Free, Pro Monthly, Pro Annual)
- ⏳ Checkout flow (/pricing page)
- ⏳ Subscription management dashboard
- ⏳ Webhook handlers for payment events

### **Phase 3: Enhanced Features (Planned)**
- 🔲 Advanced resume templates (trade-specific)
- 🔲 Resume version history
- 🔲 Collaborative editing
- 🔲 ATS (Applicant Tracking System) optimization
- 🔲 Cover letter generator
- 🔲 Job application tracking

### **Phase 4: Scale & Optimize (Planned)**
- 🔲 Multi-language support
- 🔲 Mobile app (React Native)
- 🔲 Advanced analytics dashboard
- 🔲 A/B testing framework
- 🔲 Content delivery optimization
- 🔲 Customer support chat integration

---

## 🎯 Quick Reference Commands

```bash
# DEVELOPMENT
npm run dev                     # Start frontend dev server
firebase emulators:start        # Start backend emulators
./test-flow.sh                  # Run integration tests
npm run lint                    # Check code quality

# BUILD
npm run build                   # Build Next.js app
npm run export                  # Export to static files
npm run type-check              # Validate TypeScript

# DEPLOYMENT
firebase deploy                 # Deploy everything
firebase deploy --only functions:api    # Deploy backend only
firebase deploy --only hosting          # Deploy frontend only
firebase hosting:rollback              # Rollback hosting

# MONITORING
firebase functions:log --only api      # View backend logs
firebase hosting:channel:list          # List hosting versions

# UTILITIES
firebase use                    # Show active project
firebase projects:list          # List all projects
firebase serve                  # Preview locally with emulators
```

---

## 📞 Support & Resources

**Live Site:** https://d3vtradehustle-resume-builder.web.app  
**GitHub Repo:** https://github.com/tradehustle88/d3vtradehustle-resume-builder  
**Firebase Console:** https://console.firebase.google.com/project/d3vtradehustle-resume-builder  
**Google Cloud Console:** https://console.cloud.google.com  

**Key Documentation:**
- `BACKEND_ARCHITECTURE.md` - Detailed backend systems
- `COMPLETE_PROJECT_WIREFRAME.md` - Original wireframe document
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment
- `QUICK_START.md` - Quick setup guide

**Contact:**
- Developer: tradehustle88@gmail.com
- Issues: GitHub Issues tab

---

**Document Version:** 2.0  
**Last Review:** October 17, 2025  
**Next Review:** November 2025
