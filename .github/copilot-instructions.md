# Trade Hustle Resume Builder - AI Coding Instructions

## Project Overview
A Next.js 14 (App Router) resume builder targeting trade professionals, integrating Firebase Cloud Functions, Google reCAPTCHA v3, and Google Gemini AI. Built with TypeScript, Tailwind CSS, and a trade-focused "hustle" brand identity. 

**CRITICAL ARCHITECTURE**: 
- **App Router**: All routes are in `frontend/src/app/` with `page.tsx` files (NOT Pages Router with `pages/`)
- **Firebase Functions-First**: API routes are handled by Firebase Cloud Functions, NOT Next.js API routes
- **Static Export**: Configured for static builds with `output: 'export'` (commented in `next.config.js` for dev)

## Architecture & Key Components

### Directory Structure Pattern
```
/
├── frontend/                 # Next.js 14 frontend (static hosting)
│   ├── src/app/             # App Router pages (NO API routes)
│   ├── src/components/      # React components with "use client" 
│   ├── src/lib/             # Client utilities (Firebase client, API calls)
│   └── public/              # Static assets, resume PDFs, textures
├── api-functions/           # Firebase Cloud Functions v2 (PRIMARY API)
├── backend/                 # Alternative Firebase Functions (secondary)
├── functions/               # Legacy Firebase Functions (backup)
└── resume/                  # Static resume templates (.docx, .pdf)
```

### Critical Architecture Decisions

**Next.js App Router (NOT Pages Router)**: Routes use App Router pattern
- Routes: `frontend/src/app/[route]/page.tsx` (NOT `pages/[route].tsx`)
- Config: `next.config.js` has NO `appDir: false` - App Router is enabled by default in Next.js 14
- Layout: Global layout in `app/layout.tsx` with metadata exports
- NO `pages/` directory - this is pure App Router architecture

**Firebase Functions-First**: All backend logic lives in Firebase Cloud Functions (`/api-functions/index.js`), not Next.js API routes
- Frontend calls Firebase Functions via CORS-enabled endpoints
- All authentication, reCAPTCHA verification, and Firestore operations handled server-side
- Functions use Express.js routing with `onRequest` from `firebase-functions/v2/https`
- NO `app/api/` routes - API functionality is in Firebase Functions

### Core Service Integrations

**Firebase Client-Only Setup**: Frontend uses client SDK only - no server-side Firebase in Next.js
- Client (`frontend/src/firebase.ts`): Safe initialization with browser checks and fallbacks
- NO Firebase Admin in frontend - all server operations in Cloud Functions
- Environment handling: Functions use `dotenv` + individual env vars OR base64 JSON string
- Firestore collections: `unlocks` for email capture, `users` for authentication

**Bot Protection**: Multi-layer defense without reCAPTCHA dependency
- Rate limiting: 30 requests/minute per IP via `express-rate-limit` in Cloud Functions
- Honeypot field: Hidden "company" input that bots fill but humans don't
- Optional reCAPTCHA: Bypasses when `RECAPTCHA_SECRET` not set (dev-friendly)
- Flow: `/unlock` page → Firebase Auth → `/api-functions/unlockResume` → Firestore save → PDF download

**Google Gemini AI**: Resume editing with AI assistance  
- Integrated in `api-functions/index.js` using `@google/generative-ai`
- Uses `GOOGLE_API_KEY` environment variable
- Endpoint: `/editResume` for AI-powered resume content generation

**Firebase Cloud Functions v2**: Single Express app serving all endpoints
- Main function: `api-functions/index.js` exports single Express app
- Uses `onRequest` from `firebase-functions/v2/https`  
- Endpoints: `/health`, `/signup`, `/unlockResume`, `/editResume`, `/verifyRecaptcha`
- CORS enabled for frontend requests

## Build / Run / Debug Commands

### Essential Commands
```bash
cd frontend                 # Always work from frontend directory
npm install                 # Install dependencies
npm run dev                 # Development server (localhost:3000)
npm run build               # Production build with Next.js
npm run start               # Production server
npm run lint                # ESLint checking
npm run type-check          # TypeScript type checking
```

### Firebase Commands  
```bash
firebase deploy --only functions:api    # Deploy api-functions codebase
firebase deploy --only functions:backend # Deploy backend codebase  
firebase deploy --only hosting          # Deploy Next.js static build
firebase serve                          # Local Firebase emulator
```

### Testing Commands
```bash
cd frontend && ./test-flow.sh     # Comprehensive API flow testing script
node src/adminTest.js              # Test Firebase Admin SDK (root level)
cd frontend && npm run export      # Build static Next.js export
```

## Environment Variables

### Required Production Variables
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server-side)
FIREBASE_SERVICE_ACCOUNT_KEY=      # Base64-encoded JSON or raw JSON string
FIREBASE_PROJECT_ID=               # Alternative individual variables
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# reCAPTCHA (Optional - bypasses when not set)
RECAPTCHA_SECRET=

# Google Cloud AI
GCP_PROJECT_ID=
GCP_LOCATION=
GOOGLE_API_KEY=                    # For Gemini API

# Email (Optional)
GMAIL_USER=
GMAIL_PASS=
```

## Development Patterns

### Firebase Functions API Pattern with Bot Protection
```javascript
// Bot protection middleware in api-functions/index.js
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60_000,
  max: 30, // 30 req/min per IP
});
app.use(limiter);

// Honeypot check - rejects if "company" field is filled
const honeypotCheck = (req, res, next) => {
  if (req.body.company) {
    return res.status(400).json({success: false, error: "Invalid request"});
  }
  next();
};
app.use(honeypotCheck);

// Helper function for optional reCAPTCHA (bypasses when not configured)
async function verifyRecaptcha(token) {
  if (!process.env.RECAPTCHA_SECRET) {
    return {success: true, score: 1.0, bypass: true};
  }
  // ...call siteverify if configured
}

// API endpoint example
app.post('/unlockResume', async (req, res) => {
  try {
    const { email, recaptchaToken } = req.body;
    
    // Optional reCAPTCHA verification (bypasses in dev)
    const recaptchaData = await verifyRecaptcha(recaptchaToken);
    
    // Save to Firestore using admin SDK
    await admin.firestore().collection('unlocks').add({ 
      email, 
      timestamp: new Date(),
      recaptchaBypassed: recaptchaData.bypass || false
    });
    
    res.json({ success: true, message: 'Resume unlocked' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Frontend API Calls Pattern
```typescript
// Frontend calls Firebase Functions directly (src/lib/api.ts)
export async function unlockResume(email: string, recaptchaToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/unlockResume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, recaptchaToken })
  });
  return response.json();
}
```

### Firebase Functions Pattern (v2)
```javascript
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");

// Set global options
setGlobalOptions({maxInstances: 10});

// Export function
exports.functionName = onRequest(async (req, res) => {
  // Function logic
});
```

## Styling & UI Guidelines

### Brand Identity
- **Theme**: Trade-focused "hustle" branding with construction/industrial elements
- **Colors**: Dark gradients, electric blue (#001a33), gold accents (#ffd700), red highlights (#8b0000)
- **Typography**: Oswald for headers, Inter/JetBrains Mono from Google Fonts
- **Textures**: Brick patterns (`/textures/brick-dark.png`) for backgrounds

### CSS Classes
```css
.hero-title      # Animated gradient text outline effect
.btn-hustle      # Signature red button with hover effects  
.brick-block     # Semi-transparent overlay with gold border
.hero-logo       # Logo with gold glow hover effect
```

### Component Architecture
- Client-side components use `"use client"` directive
- Footer component includes social media icons via Font Awesome CDN
- Image optimization with Next.js `<Image>` component
- Responsive design with Tailwind mobile-first approach

## Security & Best Practices

### Firestore Security Rules
```javascript
// Only authenticated reads, admin-only writes
match /unlocks/{docId} {
  allow read: if request.auth != null;
  allow write: if false; // Admin SDK only
}
```

### Environment Security
- ⚠️ **Never commit `.env` files** - they're in `.gitignore`
- Use base64-encoded service account keys in production
- Individual environment variables recommended for CI/CD
- Test credentials loading with `node src/adminTest.js`

## Critical Implementation Details

### Production vs Development Handling
- Vertex AI client uses conditional imports to prevent build errors
- Mock responses provided when environment variables aren't available
- Firebase admin safely handles missing service account keys
- All functions use v2 syntax to avoid deployment migration issues

### User Flow
1. Landing page (`/`) → Hero with "Unlock the Hustle" CTA
2. Unlock page (`/unlock`) → Email capture with reCAPTCHA
3. API verification → Firestore logging → Direct file download
4. Success state → Automatic download of `/trade-hustle-resume-kit.zip`

### SEO & Performance
- Comprehensive metadata in `layout.tsx` including OpenGraph and Twitter cards
- Font optimization with `next/font`
- Image optimization for logo and textures
- Static site generation for optimal performance

## Brand Voice & Content
Maintain consistent "trade professional hustle" messaging:
- "Built for the trade. Backed by hustle."
- Construction/industrial terminology
- Professional yet approachable tone
- Focus on ATS optimization and trade-specific needs

## Deployment & CI/CD

### GitHub Actions Workflow
- Automated deployment to Firebase Hosting and Functions
- Environment variables injected from GitHub Secrets
- Next.js static build optimized for Firebase Hosting
- Function deployment uses `api-functions/` directory

### Firebase Configuration
- Hosting points to `frontend/out` (Next.js static export)
- Functions deployed from `api-functions/` codebase
- Rewrites configured for API endpoints
- CORS properly configured for frontend requests

## Common Issues & Solutions

### Firebase Deployment Issues
- **Mixed v1/v2 functions**: Ensure all functions use `onRequest` from `firebase-functions/v2/https`
- **Environment variables**: Use dotenv in functions, GitHub Secrets in CI/CD
- **Service account**: Base64-encode JSON for environment variables

### Development Setup
- Always work from `frontend/` directory for Next.js commands
- Use `firebase serve` for local testing with functions
- Test environment loading with provided scripts
- Check `.env.example` files for required variables

### Next.js Configuration Notes
- `next.config.js` has `output: 'export'` COMMENTED OUT for development
- Enable `output: 'export'` only for production static builds
- `images.unoptimized: true` required for Firebase Hosting compatibility
- App Router is enabled by default (no `experimental.appDir` needed in Next.js 14)

## Testing Strategy
- Manual testing via `/api-demo` page for comprehensive API testing
- Use provided test scripts for Firebase Admin SDK validation
- Browser testing for reCAPTCHA flow and UI components
- Firebase emulator for local function testing
