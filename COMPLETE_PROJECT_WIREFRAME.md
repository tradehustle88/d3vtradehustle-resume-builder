# 🏗️ Trade Hustle Resume Builder - Complete Project Wireframe

**Last Updated:** October 15, 2025  
**Project Type:** Full-stack SaaS Platform  
**Status:** Production-Ready

---

## 📋 Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Application Structure](#application-structure)
4. [User Flows & Journeys](#user-flows--journeys)
5. [Component Hierarchy](#component-hierarchy)
6. [API Endpoints](#api-endpoints)
7. [Database Schema](#database-schema)
8. [Authentication & Authorization](#authentication--authorization)
9. [Payment & Monetization](#payment--monetization)
10. [AI Integration Layer](#ai-integration-layer)
11. [Deployment Architecture](#deployment-architecture)
12. [Security & Performance](#security--performance)
13. [Development Workflows](#development-workflows)

---

## 🏛️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     TRADE HUSTLE PLATFORM                        │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────┐         ┌──────────────────┐
│   FRONTEND LAYER   │◄────────►│  BACKEND LAYER   │
│   Next.js 14 App   │         │ Firebase Functions│
│   Static Export    │         │   Express API     │
└────────────────────┘         └──────────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌────────────────────┐         ┌──────────────────┐
│  HOSTING LAYER     │         │   DATA LAYER     │
│ Firebase Hosting   │         │   Firestore DB   │
│ CDN Distribution   │         │  Auth Service    │
└────────────────────┘         └──────────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌────────────────────┐         ┌──────────────────┐
│  EXTERNAL SERVICES │         │   AI SERVICES    │
│ • Stripe Payment   │         │ • Gemini 2.5 AI  │
│ • Email (Gmail)    │         │ • Vertex AI      │
│ • Google Analytics │         │ • Smart Prompts  │
└────────────────────┘         └──────────────────┘
```

---

## 🛠️ Technology Stack

### **Frontend Stack**
```yaml
Framework: Next.js 14 (App Router)
Export Mode: Static Site Generation (output: 'export')
Language: TypeScript + React
Styling: Tailwind CSS + Custom "Hustle" Theme
Fonts: Anton (Headers), Merriweather (Body)
Assets: Public folder (/assets/, /resume-kit.pdf)
State Management: React Context (AuthProvider)
Forms: React Hook Form (planned)
Analytics: Google Analytics 4 (GA4)
```

### **Backend Stack**
```yaml
Runtime: Node.js 20
Framework: Express.js
Serverless: Firebase Functions v2
API Pattern: RESTful JSON APIs
Middleware:
  - CORS (origin: true)
  - Rate Limiting (30 req/min)
  - Honeypot Protection
  - Firebase Auth Token Verification
Security:
  - JWT Token Validation
  - Input Sanitization
  - Firestore Rules
```

### **Data & Auth Stack**
```yaml
Database: Firestore (NoSQL)
Authentication: Firebase Auth
  - Email/Password
  - Google OAuth
  - Token-based sessions
Storage: Firebase Storage (future)
Real-time: Firestore Listeners (planned)
```

### **AI & ML Stack**
```yaml
Primary Model: Gemini 2.5 Flash Preview
Model ID: gemini-2.5-flash-preview-09-2025
Backup: Vertex AI (Google Cloud)
Features:
  - Resume Content Enhancement
  - ATS Score Analysis
  - Trade-specific Keyword Optimization
  - Job Description Matching
  - Smart Suggestions Engine
```

### **Payment Stack**
```yaml
Provider: Stripe
Features:
  - Subscription Billing
  - Checkout Sessions
  - Webhook Handlers
  - Customer Portal
Tiers:
  - Free (Basic features)
  - Pro Monthly ($19.99/mo)
  - Pro Annual ($179.88/yr, save 25%)
```

### **DevOps Stack**
```yaml
Version Control: Git + GitHub
CI/CD: GitHub Actions (planned)
Deployment: Firebase CLI
Emulators:
  - Functions (port 5001)
  - Firestore (port 8080)
  - Hosting (port 5000)
  - UI Dashboard (port 4000)
Environment: .env.local files (gitignored)
Monitoring: Firebase Performance + Google Analytics
```

---

## 📁 Application Structure

### **Frontend Directory Tree**
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (fonts, GA, AuthProvider)
│   │   ├── page.tsx            # Landing page (/)
│   │   ├── auth/               # Auth pages
│   │   │   └── page.tsx        # /auth - Sign in/up
│   │   ├── dashboard/          # User dashboard
│   │   │   └── page.tsx        # /dashboard - Resume management
│   │   ├── builder/            # Resume builder (basic)
│   │   │   └── page.tsx        # /builder
│   │   ├── builder-advanced/   # Advanced builder
│   │   │   └── page.tsx        # /builder-advanced
│   │   ├── wizard/             # Step-by-step resume wizard
│   │   │   └── page.tsx        # /wizard
│   │   ├── complete-ai/        # Full AI-powered builder
│   │   │   └── page.tsx        # /complete-ai
│   │   ├── unlock/             # Resume unlock/download
│   │   │   └── page.tsx        # /unlock
│   │   ├── pricing/            # Subscription pricing
│   │   │   └── page.tsx        # /pricing
│   │   ├── success/            # Payment success
│   │   │   └── page.tsx        # /success
│   │   ├── preview/            # Resume preview
│   │   │   └── page.tsx        # /preview
│   │   ├── templates/          # Template gallery
│   │   │   └── page.tsx        # /templates
│   │   ├── trade-selection/    # Trade picker
│   │   │   └── page.tsx        # /trade-selection
│   │   ├── ai-demo/            # AI demo page
│   │   │   └── page.tsx        # /ai-demo
│   │   ├── api-demo/           # API testing dashboard
│   │   │   └── page.tsx        # /api-demo
│   │   └── globals.css         # Global styles + Tailwind
│   │
│   ├── components/             # Reusable React components
│   │   ├── AuthForm.tsx        # Email/password form
│   │   ├── AuthScreen.tsx      # Auth container
│   │   ├── Button.tsx          # Custom button styles
│   │   ├── Dashboard.tsx       # Dashboard layout
│   │   ├── EnhancedResumeBuilder.tsx    # Advanced builder
│   │   ├── ResumeBuilderWithAI.tsx      # AI-integrated builder
│   │   ├── ResumePreview.tsx   # Live resume preview
│   │   ├── AIResumeAssistant.tsx        # AI chat interface
│   │   ├── TradeAIAssistant.tsx         # Trade-specific AI
│   │   ├── HustleEngine.tsx    # AI engine UI
│   │   ├── TemplateGallery.tsx # Resume templates
│   │   ├── PricingModal.tsx    # Pricing plans
│   │   ├── HeroBrickWall.tsx   # Animated hero
│   │   ├── HeroLogo.tsx        # Brand logo component
│   │   ├── Footer.tsx          # Site footer
│   │   ├── ErrorBoundary.tsx   # Error handling
│   │   └── ... (25+ components)
│   │
│   └── lib/                    # Utility libraries
│       ├── useAuth.tsx         # Auth context + hooks
│       ├── api.ts              # API client wrapper
│       ├── analytics.ts        # GA4 event tracking
│       ├── firebase.ts         # Firebase config
│       └── types.ts            # TypeScript definitions
│
├── public/                     # Static assets
│   ├── assets/                 # Images, textures
│   │   ├── trade-hustle-logo-new.png
│   │   ├── concrete-texture.jpg
│   │   ├── brick-wall.jpg
│   │   └── ...
│   ├── resume/                 # Resume templates
│   │   └── resume-kit.pdf
│   └── favicon.ico
│
├── out/                        # Build output (gitignored)
├── next.config.js              # Next.js config (static export)
├── tailwind.config.js          # Tailwind customization
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies

```

### **Backend Directory Tree**
```
api-functions/
├── index.js                    # Main Express app + Cloud Function
├── stripe-config.js            # Stripe pricing tiers
├── package.json                # Backend dependencies
├── .env.local                  # Environment variables (gitignored)
└── node_modules/               # Dependencies (gitignored)
```

### **Root Configuration Files**
```
d3vtradehustle-resume-builder/
├── firebase.json               # Firebase hosting + functions config
├── .firebaserc                 # Firebase project aliases
├── firestore.rules             # Database security rules
├── firestore.indexes.json      # Query indexes
├── .gitignore                  # Git exclusions
├── README.md                   # Project documentation
├── COMPLETE_PROJECT_WIREFRAME.md  # This file
└── ... (40+ documentation files)
```

---

## 🚶 User Flows & Journeys

### **Flow 1: Anonymous Visitor → Lead Capture**
```
┌──────────────┐
│ Landing Page │  (/) 
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Hero Section │  Watch video, see value prop
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Email Signup │  "Get Early Access" → POST /signup
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Confirmation │  "Check your email!"
└──────────────┘
```

**Technical Details:**
- Honeypot field (`company`) prevents bot submissions
- Email stored in Firestore `leads` collection
- Confirmation email sent via Nodemailer + Gmail SMTP
- Google Analytics event: `sign_up`

---

### **Flow 2: Free User → Resume Download**
```
┌──────────────┐
│   /unlock    │  User lands on unlock page
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Auth Prompt  │  "Sign in to unlock resume"
└──────┬───────┘
       │
       ├─────────────────┬─────────────────┐
       ▼                 ▼                 ▼
  ┌────────┐      ┌──────────┐      ┌──────────┐
  │ Google │      │  Email   │      │ Password │
  │ OAuth  │      │ Sign Up  │      │ Sign In  │
  └────┬───┘      └─────┬────┘      └─────┬────┘
       │                │                  │
       └────────────────┴──────────────────┘
                        │
                        ▼
               ┌────────────────┐
               │ Auth Success   │  Firebase Auth token
               └────────┬───────┘
                        │
                        ▼
               ┌────────────────┐
               │ POST /api/     │  Auth token + honeypot
               │ unlock-resume  │
               └────────┬───────┘
                        │
                        ▼
               ┌────────────────┐
               │ Firestore Save │  `unlocks/{userId}`
               └────────┬───────┘
                        │
                        ▼
               ┌────────────────┐
               │ Download PDF   │  /resume/resume-kit.pdf
               └────────────────┘
```

**Technical Details:**
- Endpoint: `POST /api/unlock-resume`
- Middleware: `honeypotCheck`, `verifyUser`
- Firestore document structure:
  ```json
  {
    "userId": "uid123",
    "email": "user@example.com",
    "unlockedAt": "2025-10-15T12:00:00Z",
    "ipAddress": "203.0.113.42"
  }
  ```
- Google Analytics event: `resume_unlock`

---

### **Flow 3: Authenticated User → AI Resume Builder**
```
┌──────────────┐
│  /dashboard  │  User dashboard
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Choose Path  │
└──────┬───────┘
       │
       ├─────────────────┬─────────────────┬──────────────┐
       ▼                 ▼                 ▼              ▼
  ┌────────┐      ┌──────────┐      ┌──────────┐   ┌──────────┐
  │/builder│      │/builder- │      │ /wizard  │   │/complete-│
  │ (Basic)│      │ advanced │      │(Guided)  │   │   ai     │
  └────┬───┘      └─────┬────┘      └─────┬────┘   └─────┬────┘
       │                │                  │              │
       └────────────────┴──────────────────┴──────────────┘
                        │
                        ▼
               ┌────────────────┐
               │ Resume Editor  │  Form fields + AI panel
               └────────┬───────┘
                        │
                        ▼
               ┌────────────────┐
               │ AI Assistance  │
               └────────┬───────┘
                        │
                        ├──────────────┬────────────────┬───────────────┐
                        ▼              ▼                ▼               ▼
                ┌────────────┐  ┌────────────┐  ┌────────────┐ ┌────────────┐
                │ Enhance    │  │ ATS Score  │  │ Keywords   │ │ Job Match  │
                │ Content    │  │ Analysis   │  │ Extract    │ │ Optimize   │
                └────────────┘  └────────────┘  └────────────┘ └────────────┘
                        │
                        │    All AI calls → POST /api/geminiAgent
                        │                    or /api/ai/[function]
                        │
                        ▼
               ┌────────────────┐
               │ Save to        │  POST /api/resumes
               │ Firestore      │
               └────────┬───────┘
                        │
                        ▼
               ┌────────────────┐
               │ Export Options │
               └────────┬───────┘
                        │
                        ├──────────────┬────────────────┐
                        ▼              ▼                ▼
                ┌────────────┐  ┌────────────┐  ┌────────────┐
                │ PDF Export │  │ Share Link │  │ Print View │
                └────────────┘  └────────────┘  └────────────┘
```

**Technical Details:**
- AI Model: Gemini 2.5 Flash Preview
- Endpoints:
  - `POST /api/geminiAgent` - General AI interactions
  - `POST /api/ai/suggestions` - Smart content suggestions
  - `POST /api/ai/ats-score` - ATS scoring
  - `POST /api/ai/enhance` - Content enhancement
  - `POST /api/ai/match-job` - Job description matching
- All require `verifyUser` middleware
- Responses cached in Firestore for performance

---

### **Flow 4: Free User → Pro Subscription**
```
┌──────────────┐
│  /dashboard  │  Feature limits visible
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Upgrade CTA  │  "Unlock unlimited resumes"
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  /pricing    │  Pricing table
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Select Plan  │  Pro Monthly ($19.99) or Annual ($179.88)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ POST /api/   │  Create Stripe Checkout Session
│ create-      │
│ checkout     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Stripe       │  Hosted checkout page
│ Checkout     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Payment      │  Card details + confirm
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Stripe       │  POST /api/webhook/stripe
│ Webhook      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Update User  │  subscriptionStatus = 'active'
│ in Firestore │  subscriptionTier = 'pro-monthly'
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  /success    │  Confirmation page
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  /dashboard  │  Full features unlocked
└──────────────┘
```

**Technical Details:**
- Stripe Integration:
  - Price IDs in `stripe-config.js`
  - Customer creation + subscription
  - Webhook signature verification
- Firestore Updates:
  ```json
  {
    "subscriptionStatus": "active",
    "subscriptionTier": "pro-monthly",
    "stripeCustomerId": "cus_xxx",
    "stripeSubscriptionId": "sub_xxx",
    "subscriptionStartDate": "2025-10-15T12:00:00Z"
  }
  ```
- Google Analytics events: `begin_checkout`, `purchase`

---

## 🧩 Component Hierarchy

### **Page Component Breakdown**

#### **Landing Page (`app/page.tsx`)**
```tsx
<LandingPage>
  ├── <HeroBrickWall>           // Animated brick background
  │   ├── <HeroLogo />          // Brand logo
  │   └── <OptimizedVideo />    // Demo video
  ├── <StackedPowerHero>        // Main hero section
  │   ├── <PaintSplatter />     // Visual effects
  │   └── <SignupForm />        // Email capture
  ├── <FeatureCard> × 3         // Feature highlights
  ├── <SocialBar>               // Social proof
  │   └── <SocialCoin />        // Social icons
  └── <Footer>                  // Site footer
</LandingPage>
```

#### **Dashboard (`app/dashboard/page.tsx`)**
```tsx
<Dashboard>
  ├── <AuthScreen>              // Auth check wrapper
  │   └── <Dashboard>           // Protected content
  │       ├── Header            // User menu
  │       ├── Stats Panel       // Resume count, AI credits
  │       ├── Quick Actions     // New resume, templates
  │       ├── Resume List       // Saved resumes
  │       │   └── <ResumeCard> × N
  │       └── <PricingModal>    // Upgrade prompt (if free)
  └── <ErrorBoundary>           // Error handling
</Dashboard>
```

#### **AI Resume Builder (`app/complete-ai/page.tsx`)**
```tsx
<AIResumeBuilder>
  ├── <AuthScreen>
  │   └── <EnhancedIntelligenceBuilder>
  │       ├── <ResumeEditor>
  │       │   ├── Personal Info Section
  │       │   ├── Work Experience Section × N
  │       │   ├── Education Section × N
  │       │   ├── Skills Section
  │       │   └── Certifications Section
  │       │
  │       ├── <AIResumeAssistant>
  │       │   ├── Chat Interface
  │       │   ├── AI Suggestions Panel
  │       │   ├── ATS Score Meter
  │       │   └── Action Buttons
  │       │       ├── Enhance Content
  │       │       ├── Analyze ATS
  │       │       ├── Extract Keywords
  │       │       └── Match Job
  │       │
  │       └── <ResumePreview>
  │           └── Live Preview (PDF-like)
  └── <ErrorBoundary>
```

### **Component Dependencies**
```
AuthProvider (Context)
  ├── useAuth() → All protected pages
  │
  ├── Dashboard
  │   ├── PricingModal
  │   └── StatusMessage
  │
  ├── ResumeBuilderWithAI
  │   ├── AIResumeAssistant
  │   │   └── HustleEngine
  │   └── ResumePreview
  │
  └── AuthScreen
      └── AuthForm
          └── Button
```

---

## 🔌 API Endpoints

### **Authentication Endpoints**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Email signup + lead capture |
| POST | `/api/unlock-resume` | Yes | Unlock free resume download |

### **Resume Management Endpoints**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/resumes` | Yes | Create new resume |
| GET | `/api/resumes` | Yes | List user's resumes |
| GET | `/api/resumes/:id` | Yes | Get single resume |
| DELETE | `/api/resumes/:id` | Yes | Delete resume |

### **AI-Powered Endpoints**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/editResume` | Yes | **Legacy** - Gemini editing |
| POST | `/api/geminiAgent` | Yes | General AI agent interactions |
| POST | `/api/gemini/analyze-resume` | No | Analyze resume content (public demo) |
| POST | `/api/gemini/trade-keywords` | No | Extract trade-specific keywords |
| POST | `/api/ai/suggestions` | Yes | AI content suggestions |
| POST | `/api/ai/ats-score` | Yes | Calculate ATS score |
| POST | `/api/ai/enhance` | Yes | Enhance resume content |
| POST | `/api/ai/match-job` | Yes | Match resume to job description |

### **Job Tracker Endpoints**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/jobs` | Yes | Create job application entry |
| GET | `/api/jobs` | Yes | List tracked jobs |
| PUT | `/api/jobs/:id` | Yes | Update job status |
| DELETE | `/api/jobs/:id` | Yes | Delete job entry |

### **Payment Endpoints**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/create-checkout` | Yes | Create Stripe checkout session |
| POST | `/api/webhook/stripe` | No* | Stripe webhook handler (signature verified) |

### **Health Check Endpoints**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/status` | No | Health check + environment info |
| GET | `/` | No | API root - returns version |

### **Middleware Stack (Applied to all endpoints)**
```javascript
app.use(cors({origin: true}));
app.use(express.json());
app.use(rateLimiter); // 30 req/min
app.use(honeypotCheck); // Reject if "company" field present
```

### **Example API Request**
```bash
# Unlock resume with authentication
curl -X POST https://your-project.cloudfunctions.net/api/api/unlock-resume \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{}'

# AI content enhancement
curl -X POST https://your-project.cloudfunctions.net/api/api/ai/enhance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{
    "content": "Worked on HVAC systems",
    "section": "experience"
  }'
```

### **Response Format (All endpoints)**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* endpoint-specific data */ }
}

// Or on error:
{
  "success": false,
  "error": "Error message",
  "errorId": "err_1234567890" // For debugging
}
```

---

## 🗄️ Database Schema

### **Firestore Collections**

#### **`users` Collection**
```json
{
  "uid": "firebase_auth_uid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "createdAt": "2025-10-15T12:00:00Z",
  "lastLoginAt": "2025-10-15T12:00:00Z",
  
  // Subscription Info
  "subscriptionStatus": "active" | "inactive" | "canceled" | "past_due",
  "subscriptionTier": "free" | "pro-monthly" | "pro-annual",
  "stripeCustomerId": "cus_xxx",
  "stripeSubscriptionId": "sub_xxx",
  "subscriptionStartDate": "2025-10-15T12:00:00Z",
  "subscriptionEndDate": "2026-10-15T12:00:00Z",
  
  // Referral Info (future)
  "referralCode": "TRADE123",
  "referredBy": "other_user_uid",
  "referralEarnings": 0.00,
  "totalReferrals": 0,
  
  // Usage Limits
  "resumesCreated": 5,
  "aiCreditsUsed": 50,
  "aiCreditsRemaining": 150
}
```

**Indexes:**
- `email` (Ascending)
- `subscriptionStatus` (Ascending)
- `stripeCustomerId` (Ascending)

---

#### **`resumes` Collection**
```json
{
  "userId": "firebase_auth_uid",
  "title": "HVAC Technician Resume",
  "trade": "hvac",
  "templateId": "modern-trade",
  
  // Content Sections
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "location": "Chicago, IL",
    "linkedIn": "https://linkedin.com/in/johndoe",
    "website": "https://johndoe.com"
  },
  
  "summary": "Experienced HVAC technician with 5+ years...",
  
  "experience": [
    {
      "id": "exp_1",
      "jobTitle": "HVAC Technician",
      "company": "ABC Heating & Cooling",
      "location": "Chicago, IL",
      "startDate": "2020-01",
      "endDate": "2025-10",
      "current": true,
      "responsibilities": [
        "Installed and repaired HVAC systems...",
        "Diagnosed issues using multimeter..."
      ]
    }
  ],
  
  "education": [
    {
      "id": "edu_1",
      "degree": "Associate Degree",
      "school": "Chicago Trade College",
      "location": "Chicago, IL",
      "graduationDate": "2019-05",
      "gpa": "3.8"
    }
  ],
  
  "skills": [
    "EPA 608 Certification",
    "Refrigerant Handling",
    "Blueprint Reading",
    "Customer Service"
  ],
  
  "certifications": [
    {
      "id": "cert_1",
      "name": "EPA Section 608",
      "issuer": "EPA",
      "issueDate": "2019-06",
      "expiryDate": null,
      "credentialId": "EPA608123"
    }
  ],
  
  // Metadata
  "createdAt": "2025-10-15T12:00:00Z",
  "updatedAt": "2025-10-15T14:30:00Z",
  "lastEditedBy": "ai" | "user",
  
  // AI Metrics
  "atsScore": 85,
  "aiEnhancementCount": 3,
  "lastAIAnalysis": "2025-10-15T14:00:00Z",
  
  // Sharing
  "shareEnabled": false,
  "shareToken": "abc123xyz",
  "shareUrl": "https://resume.nexxgennhustle.com/share/abc123xyz"
}
```

**Indexes:**
- `userId` (Ascending)
- `createdAt` (Descending)
- `trade` (Ascending)

---

#### **`unlocks` Collection**
```json
{
  "userId": "firebase_auth_uid",
  "email": "user@example.com",
  "unlockedAt": "2025-10-15T12:00:00Z",
  "ipAddress": "203.0.113.42",
  "userAgent": "Mozilla/5.0..."
}
```

**Indexes:**
- `userId` (Ascending)
- `unlockedAt` (Descending)

---

#### **`jobs` Collection** (Job Tracker)
```json
{
  "userId": "firebase_auth_uid",
  "jobTitle": "HVAC Technician",
  "company": "XYZ Corp",
  "location": "Chicago, IL",
  "jobUrl": "https://linkedin.com/jobs/123",
  "jobDescription": "We are looking for...",
  "status": "applied" | "interview" | "offer" | "rejected" | "accepted",
  "appliedDate": "2025-10-15T12:00:00Z",
  "followUpDate": "2025-10-22T12:00:00Z",
  "notes": "Reached out to hiring manager...",
  "resumeId": "resume_document_id",
  "matchScore": 85,
  "createdAt": "2025-10-15T12:00:00Z",
  "updatedAt": "2025-10-20T12:00:00Z"
}
```

**Indexes:**
- `userId` (Ascending)
- `status` (Ascending)
- `appliedDate` (Descending)

---

#### **`leads` Collection** (Email Signups)
```json
{
  "email": "prospect@example.com",
  "source": "landing_page" | "pricing_page" | "blog",
  "capturedAt": "2025-10-15T12:00:00Z",
  "ipAddress": "203.0.113.42",
  "userAgent": "Mozilla/5.0...",
  "emailSent": true,
  "emailSentAt": "2025-10-15T12:01:00Z"
}
```

**Indexes:**
- `email` (Ascending, Unique)
- `capturedAt` (Descending)

---

#### **`ai_interactions` Collection** (Future - Analytics)
```json
{
  "userId": "firebase_auth_uid",
  "resumeId": "resume_doc_id",
  "interactionType": "enhance" | "analyze" | "keywords" | "match",
  "prompt": "User's request or action",
  "response": "AI's response",
  "model": "gemini-2.5-flash-preview-09-2025",
  "tokensUsed": 1500,
  "latencyMs": 3200,
  "timestamp": "2025-10-15T12:00:00Z",
  "success": true
}
```

---

### **Firestore Security Rules Summary**

```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Resumes can be shared publicly if shareEnabled
match /resumes/{resumeId} {
  allow read: if resource.data.userId == request.auth.uid 
              || resource.data.shareEnabled == true;
  allow write: if request.auth.uid == resource.data.userId;
}

// Jobs are private to the user
match /jobs/{jobId} {
  allow read, write: if request.auth.uid == resource.data.userId;
}

// Unlocks are write-only (server-side only)
match /unlocks/{unlockId} {
  allow read: if request.auth.uid == resource.data.userId;
  allow write: if false; // Server-side only
}
```

---

## 🔐 Authentication & Authorization

### **Authentication Providers**
1. **Email/Password** - Firebase Auth native
2. **Google OAuth** - One-click sign-in
3. *(Future)* GitHub OAuth, Microsoft OAuth

### **Auth Flow**
```
User Action → Firebase Auth SDK (client-side)
              ↓
          ID Token Generated
              ↓
          Sent in Authorization Header: Bearer {token}
              ↓
          Backend verifyUser() Middleware
              ↓
          Token Verified via Firebase Admin SDK
              ↓
          req.user populated with {uid, email, displayName}
              ↓
          Request proceeds to endpoint logic
```

### **Token Management**
- **Client-side:** `frontend/src/lib/useAuth.tsx`
  ```tsx
  const { user, loading, signIn, signOut } = useAuth();
  const token = await user?.getIdToken();
  ```

- **Server-side:** `api-functions/index.js`
  ```javascript
  async function verifyUser(req, res, next) {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  }
  ```

### **Authorization Levels**
1. **Anonymous** - Landing page, public demos
2. **Authenticated (Free)** - Resume unlock, basic builder
3. **Pro Subscriber** - Advanced AI, unlimited resumes
4. *(Future)* **Admin** - Dashboard, user management

### **Rate Limiting**
- **30 requests/minute per IP**
- Configured via `express-rate-limit`
- Bypass available for authenticated users (future)

---

## 💰 Payment & Monetization

### **Pricing Tiers** (Stripe)

| Tier | Price | Features | Stripe Price ID |
|------|-------|----------|----------------|
| **Free** | $0/mo | • 1 resume<br>• Basic templates<br>• Limited AI (10 credits/mo) | N/A |
| **Pro Monthly** | $19.99/mo | • Unlimited resumes<br>• All templates<br>• Unlimited AI<br>• Job tracker<br>• Priority support | `price_xxxxx` |
| **Pro Annual** | $179.88/yr | • All Pro features<br>• **Save 25%**<br>• Early access to new features | `price_yyyyy` |

### **Stripe Integration Points**

1. **Checkout Session Creation**
   ```javascript
   // POST /api/create-checkout
   const session = await stripe.checkout.sessions.create({
     customer: stripeCustomerId,
     line_items: [{ price: priceId, quantity: 1 }],
     mode: 'subscription',
     success_url: 'https://yoursite.com/success',
     cancel_url: 'https://yoursite.com/pricing'
   });
   ```

2. **Webhook Handler**
   ```javascript
   // POST /api/webhook/stripe
   const event = stripe.webhooks.constructEvent(
     req.body, 
     sig, 
     webhookSecret
   );
   
   switch (event.type) {
     case 'checkout.session.completed':
       // Activate subscription
       break;
     case 'customer.subscription.updated':
       // Update subscription status
       break;
     case 'customer.subscription.deleted':
       // Cancel subscription
       break;
   }
   ```

3. **Customer Portal**
   ```javascript
   const session = await stripe.billingPortal.sessions.create({
     customer: stripeCustomerId,
     return_url: 'https://yoursite.com/dashboard'
   });
   ```

### **Subscription Lifecycle**
```
Free User
  └─> Click "Upgrade" → /pricing
        └─> Select Plan → POST /api/create-checkout
              └─> Stripe Checkout
                    ├─> Payment Success → Webhook → Update Firestore
                    │     └─> subscriptionStatus = 'active'
                    │           └─> Redirect to /success
                    └─> Payment Failed → Redirect to /pricing (error)

Pro User
  └─> Dashboard → "Manage Subscription"
        └─> Stripe Customer Portal
              ├─> Update payment method
              ├─> Change plan
              └─> Cancel subscription → Webhook → Update Firestore
                    └─> subscriptionStatus = 'canceled'
```

---

## 🤖 AI Integration Layer

### **Primary AI Model**
- **Model:** Gemini 2.5 Flash Preview
- **Model ID:** `gemini-2.5-flash-preview-09-2025`
- **API:** Google Generative AI SDK
- **Fallback:** Vertex AI (Google Cloud)

### **AI Capabilities**

#### **1. Resume Content Enhancement**
```javascript
// POST /api/ai/enhance
Input: {
  "content": "Worked on HVAC systems",
  "section": "experience",
  "trade": "hvac"
}

Output: {
  "enhanced": "Installed, maintained, and repaired residential and commercial HVAC systems, including split systems, heat pumps, and ductless mini-splits. Diagnosed issues using multimeter and pressure gauges, achieving 95% first-call resolution rate.",
  "improvements": [
    "Added specific HVAC system types",
    "Included technical tools",
    "Quantified achievement with metric"
  ]
}
```

#### **2. ATS Score Analysis**
```javascript
// POST /api/ai/ats-score
Input: {
  "resumeContent": "Full resume text...",
  "jobDescription": "Job posting text..." // Optional
}

Output: {
  "score": 85,
  "breakdown": {
    "keywords": 90,
    "formatting": 80,
    "experience": 85,
    "skills": 90
  },
  "suggestions": [
    "Add more action verbs (e.g., 'implemented', 'optimized')",
    "Include EPA 608 certification in skills section",
    "Quantify HVAC installations (e.g., 'Installed 50+ systems')"
  ]
}
```

#### **3. Trade-Specific Keywords**
```javascript
// POST /api/gemini/trade-keywords
Input: {
  "trade": "hvac",
  "jobDescription": "Job posting text..."
}

Output: {
  "keywords": [
    "EPA 608 Certification",
    "Refrigerant Handling",
    "Load Calculations",
    "Duct Design",
    "SEER Ratings",
    "Heat Pump Installation"
  ],
  "actionVerbs": [
    "Installed",
    "Diagnosed",
    "Repaired",
    "Maintained",
    "Optimized"
  ]
}
```

#### **4. Job Description Matching**
```javascript
// POST /api/ai/match-job
Input: {
  "resumeContent": "Full resume text...",
  "jobDescription": "Job posting text..."
}

Output: {
  "matchScore": 82,
  "strengths": [
    "5+ years HVAC experience matches requirement",
    "EPA 608 certification present",
    "Commercial experience highlighted"
  ],
  "gaps": [
    "Missing: Chiller experience",
    "Weak: Building automation systems",
    "Could add: LEED certification"
  ],
  "recommendations": [
    "Add 'Performed routine maintenance on 100-ton chillers' to work experience",
    "Include any BAS training or projects in skills section"
  ]
}
```

### **AI Prompt Engineering**

#### **System Prompt Template**
```javascript
const systemPrompt = `
You are an expert resume writer specializing in trade and skilled labor professions.
Your goal is to help users create ATS-optimized resumes that get them interviews.

Trade Focus: ${trade}
Target Role: ${jobTitle}

Guidelines:
- Use industry-specific terminology
- Include quantifiable achievements
- Optimize for Applicant Tracking Systems
- Maintain professional tone
- Focus on skills, certifications, and hands-on experience
- Avoid generic corporate jargon

Response Format: ${responseFormat}
`;
```

### **AI Error Handling**
```javascript
// Graceful degradation when GOOGLE_API_KEY missing
if (!genAI) {
  return res.status(503).json({
    success: false,
    error: "AI service temporarily unavailable. Please try again later or contact support.",
    message: "The AI feature requires configuration. Please ensure GOOGLE_API_KEY is set."
  });
}
```

### **AI Usage Limits** (Future)
- **Free Tier:** 10 AI interactions/month
- **Pro Tier:** Unlimited AI interactions
- **Rate Limiting:** 5 AI requests/minute per user

---

## 🚀 Deployment Architecture

### **Production Stack**
```
┌───────────────────────────────────────────────────────┐
│                   FIREBASE HOSTING                     │
│         Static Site (frontend/out/)                    │
│         CDN: Global Edge Locations                     │
│         SSL: Auto-provisioned by Firebase              │
│         Domain: resume.nexxgennhustle.com              │
└───────────────────────────────────────────────────────┘
                           │
                           │ API Calls
                           ▼
┌───────────────────────────────────────────────────────┐
│               FIREBASE CLOUD FUNCTIONS                 │
│         Region: us-central1                            │
│         Runtime: Node.js 20                            │
│         Max Instances: 10                              │
│         Function Name: api                             │
│         URL: *.cloudfunctions.net/api                  │
└───────────────────────────────────────────────────────┘
                           │
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────┐              ┌──────────────────┐
│   FIRESTORE DB   │              │   FIREBASE AUTH  │
│  Multi-region    │              │   Identity       │
│  Automatic       │              │   Platform       │
│  Backups         │              │                  │
└──────────────────┘              └──────────────────┘
```

### **Deployment Commands**

#### **Deploy Everything**
```powershell
# Build frontend
cd frontend
npm run build
npm run export

# Deploy hosting + functions
cd ..
firebase deploy
```

#### **Deploy Functions Only**
```powershell
firebase deploy --only functions:api
```

#### **Deploy Hosting Only**
```powershell
firebase deploy --only hosting
```

#### **Deploy Firestore Rules**
```powershell
firebase deploy --only firestore:rules
```

### **Environment Variables**

#### **Frontend (.env.local)**
```bash
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# API URL
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-your-project.cloudfunctions.net/api

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App URL
NEXT_PUBLIC_APP_URL=https://resume.nexxgennhustle.com
```

#### **Backend (Functions .env)**
```bash
# Google AI
GOOGLE_API_KEY=AIzaSy...
PROJECT_ID=your-project-id
REGION=us-central1

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO_MONTHLY=price_...
STRIPE_PRICE_ID_PRO_ANNUAL=price_...

# Email (Gmail SMTP)
GMAIL_USER=noreply@nexxgennhustle.com
GMAIL_APP_PASSWORD=your-app-password

# reCAPTCHA (Optional)
RECAPTCHA_SECRET=6Le...

# Firebase Admin (Auto-injected by Firebase)
# FIREBASE_CONFIG (JSON string)
```

### **Rollback Strategy**
```powershell
# Hosting rollback
firebase hosting:rollback

# Functions rollback (manual - redeploy previous version)
git checkout <previous-commit>
firebase deploy --only functions:api
```

---

## 🔒 Security & Performance

### **Security Measures**

#### **1. API Security**
- ✅ **HTTPS Only** - All traffic encrypted (Firebase enforced)
- ✅ **CORS** - Origin restrictions (`cors({origin: true})`)
- ✅ **Rate Limiting** - 30 req/min per IP
- ✅ **Honeypot** - Bot detection via hidden field
- ✅ **JWT Validation** - Firebase token verification
- ✅ **Input Sanitization** - All user input validated
- ✅ **Webhook Signature** - Stripe signature verification

#### **2. Firestore Security**
- ✅ **User Isolation** - Users can only access own data
- ✅ **Write Validation** - Schema validation in rules
- ✅ **Read Limits** - Query size restrictions
- ✅ **Admin-only Collections** - Server-side only access

#### **3. Secret Management**
- ✅ **Environment Variables** - No hardcoded secrets
- ✅ **`.gitignore`** - Excludes `.env.local`, `serviceAccount.json`
- ✅ **Firebase Secrets** - Sensitive vars encrypted
- ✅ **Stripe Webhook Secret** - Signature validation

#### **4. Auth Security**
- ✅ **Email Verification** - Required for sensitive actions
- ✅ **Token Expiry** - Short-lived tokens (1 hour)
- ✅ **Session Management** - Auto-refresh tokens
- ✅ **Password Requirements** - Firebase default (6+ chars)

### **Performance Optimizations**

#### **Frontend**
- ✅ **Static Export** - No server-side rendering overhead
- ✅ **CDN Distribution** - Firebase Hosting global edge
- ✅ **Image Optimization** - Next.js Image component
- ✅ **Code Splitting** - Automatic route-based splitting
- ✅ **Lazy Loading** - Components loaded on demand
- ✅ **Font Optimization** - `font-display: swap`

#### **Backend**
- ✅ **Function Cold Start** - < 1s (Node.js 20)
- ✅ **Max Instances: 10** - Auto-scaling
- ✅ **Database Indexes** - All common queries indexed
- ✅ **Connection Pooling** - Firebase Admin SDK pooling
- ✅ **Response Caching** - AI responses cached (planned)

#### **AI Performance**
- ✅ **Model:** Gemini 2.5 Flash (fast inference)
- ✅ **Streaming:** Planned for chat interface
- ✅ **Prompt Caching:** Planned for common requests
- ✅ **Timeout:** 30s max per AI request

---

## 🛠️ Development Workflows

### **Local Development Setup**

#### **1. Initial Setup**
```powershell
# Clone repository
git clone https://github.com/tradehustle88/d3vtradehustle-resume-builder.git
cd d3vtradehustle-resume-builder

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../api-functions
npm install

# Copy environment variables
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your Firebase config

cd ../api-functions
cp .env.example .env.local
# Edit .env.local with your secrets
```

#### **2. Run Emulators (Recommended)**
```powershell
# Start Firebase emulators (from project root)
firebase emulators:start

# Emulator ports:
# - Functions: http://localhost:5001
# - Firestore: http://localhost:8080
# - Hosting: http://localhost:5000
# - Emulator UI: http://localhost:4000
```

#### **3. Run Frontend Dev Server**
```powershell
cd frontend
npm run dev

# Opens at http://localhost:3000
```

### **Testing Workflows**

#### **Manual Testing Scripts**
```powershell
# Test unlock flow (auth + API)
./test-flow.sh

# Test all API endpoints
./test-endpoints.sh

# Test Gemini AI integration
./test-gemini-agent.ps1

# Test frontend build
./test-frontend-complete.sh
```

#### **Key Test Scenarios**
1. **Auth Flow**
   - Sign up with email/password
   - Sign in with Google OAuth
   - Token refresh
   - Sign out

2. **Resume Unlock**
   - Anonymous → Auth prompt
   - Sign in → Unlock PDF
   - Download success

3. **AI Builder**
   - Create new resume
   - AI enhancement
   - ATS score analysis
   - Export PDF

4. **Subscription**
   - View pricing
   - Start checkout
   - Complete payment (Stripe test mode)
   - Verify Firestore update

### **Code Quality Tools**

```powershell
# Frontend linting
cd frontend
npm run lint

# TypeScript type checking
npm run type-check

# Format code (if configured)
npm run format
```

### **Git Workflow**
```powershell
# Feature branch workflow
git checkout -b feature/your-feature
# Make changes
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature

# Create pull request on GitHub

# After merge
git checkout main
git pull origin main
```

### **Deployment Checklist**
- [ ] Run `npm run lint` (no errors)
- [ ] Run `npm run type-check` (no errors)
- [ ] Test locally with emulators
- [ ] Test auth flows
- [ ] Test AI endpoints
- [ ] Build frontend (`npm run build && npm run export`)
- [ ] Deploy to staging (if available)
- [ ] Test staging environment
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Monitor logs for errors

---

## 📊 Monitoring & Analytics

### **Google Analytics 4 Events**

| Event Name | Trigger | Purpose |
|------------|---------|---------|
| `sign_up` | Email signup form submit | Track lead generation |
| `login` | User signs in | Track auth events |
| `resume_unlock` | PDF download | Track free tier conversion |
| `resume_create` | New resume created | Track user engagement |
| `resume_download` | Resume exported | Track feature usage |
| `begin_checkout` | Checkout session started | Track conversion funnel |
| `purchase` | Subscription completed | Track revenue |
| `ai_interaction` | AI feature used | Track AI engagement |

### **Firebase Performance Monitoring**
- Trace API endpoint latency
- Track Firestore query performance
- Monitor function cold starts
- Track page load times

### **Firebase Crashlytics** (Planned)
- Track client-side errors
- Group errors by type
- Monitor error rates

---

## 🎯 Key User Personas

### **1. Travis - HVAC Apprentice**
- **Age:** 22
- **Goal:** Get first HVAC job
- **Pain Point:** No professional resume experience
- **Journey:** Landing page → Email signup → Free resume unlock → AI builder (free tier) → Download PDF → Apply to jobs

### **2. Marcus - Experienced Electrician**
- **Age:** 35
- **Goal:** Move from residential to commercial
- **Pain Point:** Resume doesn't highlight commercial skills
- **Journey:** Google search → Sign in → Create new resume → AI enhancement (Pro tier) → Match to job description → Export PDF → Get interview

### **3. Sarah - Maintenance Manager**
- **Age:** 42
- **Goal:** Transition to facility management role
- **Pain Point:** Need to showcase leadership skills
- **Journey:** Referral → Sign in → Upgrade to Pro → Create multiple resumes → Track job applications → Manage subscriptions

---

## 🚀 Future Roadmap

### **Phase 1: MVP (Current)**
- ✅ Landing page + email capture
- ✅ Firebase Auth (email + Google)
- ✅ Basic resume builder
- ✅ AI integration (Gemini)
- ✅ Stripe subscriptions
- ✅ PDF export

### **Phase 2: Enhanced Features**
- [ ] Advanced resume templates (5+ designs)
- [ ] Cover letter generator
- [ ] LinkedIn profile optimizer
- [ ] Chrome extension (import from LinkedIn)
- [ ] Mobile app (React Native)

### **Phase 3: Platform Expansion**
- [ ] Job board integration (Indeed, LinkedIn)
- [ ] Referral program
- [ ] Affiliate partnerships
- [ ] API for third-party integrations
- [ ] White-label solution

### **Phase 4: AI Enhancements**
- [ ] Voice-to-resume (speech input)
- [ ] Resume scoring dashboard
- [ ] Personalized job matching algorithm
- [ ] Interview prep AI coach
- [ ] Salary negotiation AI assistant

---

## 📞 Support & Resources

### **Documentation Files**
- `README.md` - Quick start guide
- `QUICK_START.md` - Setup instructions
- `DEPLOYMENT_GUIDE.md` - Production deployment
- `GEMINI_AI_INTEGRATION.md` - AI implementation details
- `STRIPE_DEPLOYMENT_COMPLETE.md` - Payment setup
- `COMPLETE_PROJECT_WIREFRAME.md` - This document

### **External Resources**
- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Stripe Docs](https://stripe.com/docs)

### **Contact**
- **Developer:** Trade Hustle Team
- **GitHub:** [tradehustle88/d3vtradehustle-resume-builder](https://github.com/tradehustle88/d3vtradehustle-resume-builder)
- **Support Email:** support@nexxgennhustle.com

---

## 🎨 Visual Design System

### **Brand Colors**
```css
/* Primary Colors */
--hustle-navy: #001a33;        /* Dark blue - Headers, CTAs */
--hustle-gold: #ffd700;        /* Gold - Accents, success */
--hustle-red: #8b0000;         /* Dark red - Errors, emphasis */

/* Neutrals */
--concrete-gray: #6b7280;      /* Body text */
--light-gray: #f3f4f6;         /* Backgrounds */
--white: #ffffff;              /* Cards, modals */

/* Status Colors */
--success: #10b981;            /* Green - Success states */
--warning: #f59e0b;            /* Orange - Warnings */
--error: #ef4444;              /* Red - Errors */
--info: #3b82f6;               /* Blue - Info */
```

### **Typography**
```css
/* Headings */
font-family: 'Anton', sans-serif;
font-weight: 400;

/* Body Text */
font-family: 'Merriweather', serif;
font-weight: 400, 700;

/* Monospace (code) */
font-family: 'JetBrains Mono', monospace;
```

### **Component Classes**
```css
.btn-hustle         /* Primary CTA button */
.hero-title         /* Large hero headings */
.brick-block        /* Textured container */
.paint-splatter     /* Decorative element */
.concrete-bg        /* Textured background */
```

---

## 🔧 Troubleshooting Guide

### **Common Issues**

#### **1. Firebase Auth Errors**
```
Error: Firebase: Error (auth/configuration-not-found)
```
**Solution:** Verify `frontend/.env.local` has all Firebase config vars.

#### **2. AI Endpoint Returns 503**
```
{ "error": "AI service temporarily unavailable" }
```
**Solution:** Set `GOOGLE_API_KEY` in `api-functions/.env.local`.

#### **3. Stripe Webhook Not Firing**
```
Stripe webhook signature verification failed
```
**Solution:** 
1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
2. Test with Stripe CLI: `stripe listen --forward-to localhost:5001/api/api/webhook/stripe`

#### **4. Build Fails on Deployment**
```
Error: Cannot find module '@/lib/api'
```
**Solution:** Check `tsconfig.json` paths config and run `npm install`.

---

## 📈 Metrics & KPIs

### **User Acquisition**
- Landing page visitors/month
- Email signup conversion rate
- Auth signup rate
- Free → Pro conversion rate

### **User Engagement**
- Resumes created/user
- AI interactions/resume
- Average session duration
- Return user rate

### **Revenue Metrics**
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (LTV)
- Churn rate
- Average Revenue Per User (ARPU)

### **Technical Metrics**
- API response time (p50, p95, p99)
- Error rate (%)
- Function cold start time
- Database query latency

---

**End of Wireframe Document**

*Last Updated: October 15, 2025*  
*Version: 1.0.0*  
*Maintained by: Trade Hustle Team*
