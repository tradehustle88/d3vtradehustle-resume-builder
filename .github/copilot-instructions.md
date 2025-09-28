# Trade Hustle Resume Builder - AI Coding Instructions

## Project Overview
A Next.js 14 (App Router) resume builder targeting trade professionals, integrating Firebase (Auth/Firestore/Storage), Google reCAPTCHA v3, and Google Cloud Vertex AI. Built with TypeScript, Tailwind CSS, and a trade-focused "hustle" brand identity. The project follows a monorepo structure with the main application in `/frontend/`.

## Architecture & Key Components

### Directory Structure Pattern
```
/
├── frontend/                 # Main Next.js 14 application
│   ├── src/app/             # App Router pages and API routes
│   ├── src/components/      # Reusable React components
│   ├── src/lib/             # Utility libraries (Firebase admin/client)
│   └── public/              # Static assets including trade-themed textures/icons
├── api-functions/           # Firebase Cloud Functions (production)
├── functions/               # Firebase Cloud Functions (legacy/backup)
└── resume/                  # Static resume templates and guides
```

### Core Service Integrations

**Firebase Dual Setup**: Critical pattern with separate client/admin configurations
- Client (`src/firebase.ts`): Authentication and real-time features
- Admin (`src/lib/firebaseAdmin.ts`): Server-side operations in API routes  
- Environment handling: `FIREBASE_SERVICE_ACCOUNT_KEY` supports both base64-encoded JSON string and individual variables
- Firestore collection: `unlocks` for email capture with strict security rules

**reCAPTCHA v3 Flow**: Seamless verification pattern
- Global script loaded in `layout.tsx` with `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- Window interface defined in `src/global.d.ts`
- Verification flow: `/unlock` page → `/api/unlock-resume` → reCAPTCHA verify → Firestore save → PDF download

**Google Cloud Vertex AI**: Production-ready AI integration
- Configured in `/api/vertex-test/route.ts`
- Conditional imports prevent development build errors: `require()` vs `import`
- Environment variables: `GCP_PROJECT_ID`, `GCP_LOCATION`

**Firebase Cloud Functions**: All functions use v2 syntax
- Main functions in `/api-functions/` directory
- All exports use `onRequest` from `firebase-functions/v2/https`
- Environment variables loaded via `dotenv` for local development
- Functions: `verifyRecaptcha`, `signup`, `unlockResume`, `editResume`, `app`

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
firebase deploy --only functions  # Deploy Cloud Functions
firebase deploy --only hosting    # Deploy Next.js static build
firebase serve                    # Local Firebase emulator
```

### Testing Commands
```bash
cd frontend && npm run test        # Run tests (if configured)
./test-flow.sh                     # Comprehensive flow testing script
node src/adminTest.js              # Test Firebase Admin SDK
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

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
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

### API Route Standards
```typescript
// Standard Next.js API route pattern
export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // API logic
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
```

### Firebase Admin Initialization Pattern
```typescript
// Lazy Firebase admin initialization with fallback
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf8")
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
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

## Testing Strategy
- Manual testing via `/api-demo` page for comprehensive API testing
- Use provided test scripts for Firebase Admin SDK validation
- Browser testing for reCAPTCHA flow and UI components
- Firebase emulator for local function testing
