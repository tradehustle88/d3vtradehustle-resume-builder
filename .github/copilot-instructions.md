# Trade Hustle Resume Builder - AI Coding Instructions

## Project Overview
A Next.js 14 (App Router) resume builder targeting trade professionals, integrating Firebase (Auth/Firestore/Storage), Google reCAPTCHA v3, and Google Cloud Vertex AI. Built with TypeScript, Tailwind CSS, and a trade-focused "hustle" brand identity. The project follows a monorepo structure with the main application in `/frontend/`.

## Architecture & Key Components

### Directory Structure Pattern
```
frontend/                    # Main Next.js application
├── src/app/                # Next.js App Router pages and API routes
├── src/components/         # Reusable React components
├── src/lib/               # Utility libraries (Firebase admin/client)
├── public/                # Static assets including trade-themed textures
├── resume/                # Static resume templates and guides
└── keys/                  # Service account keys (gitignored)
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

## Build / Run / Debug Commands

### Essential Commands
```bash
cd frontend                 # Always work from frontend directory
npm install                # Install dependencies
npm run dev                # Development server (localhost:3000)
npm run build              # Production build with Next.js
npm run start              # Production server
./test-flow.sh             # Comprehensive flow testing script
```

### Firebase Admin Testing
```bash
# Test Firebase Admin SDK (requires service account setup)
node src/adminTest.js
```

## Critical Development Patterns

### Environment Variable Management
The project uses a sophisticated environment variable system supporting both development and production:

**Development** (`.env.local`):
```bash
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'  # JSON string
```

**Production** (Vercel):
```bash
FIREBASE_SERVICE_ACCOUNT_KEY=base64_encoded_json  # Base64-encoded
```

**Required Variables**: See `ENVIRONMENT_SETUP.md` for complete list including Firebase, reCAPTCHA, and GCP configurations.

### API Route Architecture
Standardized error handling and Firebase admin initialization patterns:

```typescript
export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

// Standard error response pattern
return NextResponse.json(
  { success: false, error: err.message },
  { status: 500 }
);

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

### Authentication Flow Pattern
Multi-provider authentication with strict verification:
1. Client-side Firebase Auth (Google OAuth + Email/Password)
2. ID token generation for API calls
3. Server-side token verification in API routes
4. One-time download enforcement via Firestore document existence check

## Brand & Styling Conventions

### Theme System
- **Visual Identity**: Construction/industrial "hustle" theme
- **Color Palette**: Dark gradients, electric blue (`#001a33`), gold accents (`#ffd700`), red highlights (`#8b0000`)
- **Typography**: Oswald (headers), Inter/JetBrains Mono from Google Fonts
- **Textures**: Brick patterns (`/assets/brickwall-background.webp`) and paint splatters (`/fx/paint-*.svg`)

### Component Styling Classes
```css
.hero-title      # Animated gradient text outline effect
.btn-hustle      # Signature red button with hover effects  
.brick-block     # Semi-transparent overlay with gold border
.hero-logo       # Logo with gold glow hover effect
```

### Responsive Design Pattern
Mobile-first Tailwind approach with desktop enhancements:
- Base styles for mobile
- `md:` prefix for desktop layouts
- Background images use `backgroundAttachment: "fixed"` for parallax

## Critical User Flow
Understanding the complete user journey is essential:

1. **Landing** (`/`) → Hero with animated title + "Unlock the Hustle" CTA
2. **Authentication** (`/unlock`) → Firebase Auth (Google/Email) + automatic reCAPTCHA v3
3. **API Verification** → `/api/unlock-resume` validates tokens + enforces one-resume rule
4. **Download** → Firebase Storage signed URL → Direct PDF download
5. **Tracking** → Firestore document creation for analytics

## Security & Performance Patterns

### Firestore Security Rules
```javascript
// Only authenticated reads, admin-only writes
match /unlocks/{docId} {
  allow read: if request.auth != null;
  allow write: if false; // Admin SDK only
}
```

### Performance Optimizations
- Next.js Image optimization for logos and backgrounds
- Font optimization with `next/font`
- Vercel Analytics and Speed Insights integrated
- Lazy loading for heavy components and external scripts

### Error Handling Standards
- Comprehensive error boundaries in React components
- Structured API error responses with error IDs
- Development vs production error messaging
- Firebase connection graceful degradation

## Integration Points & Dependencies

**External Services**:
- Google reCAPTCHA v3 (domain verification required)
- Font Awesome CDN (social media icons)
- Firebase (Auth/Firestore/Storage/Admin)
- Google Cloud Vertex AI (production environment only)
- Vercel (hosting + analytics)

**Critical Configuration Files**:
- `firestore.rules` - Database security
- `ENVIRONMENT_SETUP.md` - Complete setup guide
- `VERCEL_DEPLOYMENT.md` - Production deployment checklist
- `test-flow.sh` - Integration testing script

## Helpful Constraints for Code Changes

- **Security**: Never reveal contents of service account keys or environment variables
- **Authentication**: Maintain dual Firebase setup (client vs admin) - don't mix imports
- **API Consistency**: Follow existing error response patterns and runtime configurations
- **Brand Consistency**: Maintain trade-focused "hustle" theme in all UI components
- **Testing**: Use `test-flow.sh` to verify complete integration after changes
- **Environment**: Test both development (JSON string) and production (base64) credential formats

## Quick Navigation & Examples

- **Authentication Implementation**: `src/components/AuthComponent.tsx`
- **API Route Pattern**: `src/app/api/unlock-resume/route.ts`
- **Firebase Client Setup**: `src/firebase.ts`
- **Firebase Admin Setup**: `src/lib/firebaseAdmin.ts`
- **Brand Styling**: `src/app/globals.css`
- **Main User Flow**: `src/app/page.tsx` → `src/app/unlock/page.tsx`
- **Environment Setup**: `ENVIRONMENT_SETUP.md`

This codebase prioritizes security, user experience, and maintainability while serving trade professionals with a distinctive brand identity and robust authentication flow.
