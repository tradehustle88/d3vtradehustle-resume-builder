# Trade Hustle Resume Builder - AI Coding Instructions

## Project Overview
A Next.js 14 (App Router) resume builder targeting trade professionals, integrating Firebase, Google reCAPTCHA, and Google Cloud Vertex AI. Built with TypeScript, Tailwind CSS, and a trade-focused "hustle" brand identity.

## Architecture & Key Components

### File Structure Pattern
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components  
- `src/lib/` - Utility libraries (Firebase admin/client)
- `public/` - Static assets including trade-themed textures/icons
- `resume/` - Static resume templates and guides

### Core Services Integration

**Firebase Dual Setup**: Both client-side (`src/firebase.ts`) and admin (`src/lib/firebaseAdmin.ts`) configurations
- Client: Authentication and real-time features
- Admin: Server-side operations in API routes
- Firestore collection: `unlocks` for email capture

**reCAPTCHA v3 Flow**: 
- Global script loaded in `layout.tsx` 
- Window interface defined in `src/global.d.ts`
- Verification pattern: `/unlock` page → `/api/unlock-resume` → reCAPTCHA verify → Firestore save

**Google Cloud Vertex AI**: 
- Configured in `/api/vertex-test/route.ts`
- Production-only imports with development mocking
- Uses `@google-cloud/aiplatform` SDK

## Development Patterns

### Environment Variables
Required production environment variables (reference API routes for usage):
```
NEXT_PUBLIC_RECAPTCHA_KEY
RECAPTCHA_SECRET_KEY
FIREBASE_SERVICE_ACCOUNT_KEY (JSON string)
NEXT_PUBLIC_FIREBASE_* (standard Firebase config)
GCP_PROJECT_ID
GCP_LOCATION
```

### Styling Conventions
- **Theme**: Trade-focused "hustle" branding with construction/industrial elements
- **Colors**: Dark gradients, electric blue (#001a33), gold accents (#ffd700), red highlights (#8b0000)
- **Typography**: Oswald for headers, Inter/JetBrains Mono from Google Fonts
- **Textures**: Brick patterns (`/textures/brick-dark.png`) for backgrounds
- **Components**: Custom CSS classes like `.hero-title`, `.btn-hustle`, `.brick-block`

### Component Architecture
- Client-side components use `"use client"` directive
- Footer component includes social media icons via Font Awesome CDN
- Image optimization with Next.js `<Image>` component
- Responsive design with Tailwind mobile-first approach

## API Route Patterns

### Error Handling Standard
```typescript
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
```

### Firebase Admin Initialization Pattern
```typescript
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
```

## Critical Implementation Details

### Production vs Development Handling
- Vertex AI client uses conditional imports to prevent build errors in development
- Mock responses provided when environment variables aren't available
- Firebase admin safely handles missing service account keys

### SEO & Performance
- Comprehensive metadata in `layout.tsx` including OpenGraph and Twitter cards

- Font optimization with `next/font`
- Image optimization for logo and textures

### User Flow
1. Landing page (`/`) → Hero with "Unlock the Hustle" CTA
2. Unlock page (`/unlock`) → Email capture with reCAPTCHA
3. API verification → Firestore logging → Direct file download
4. Success state → Automatic download of `/trade-hustle-resume-kit.zip`

## Development Workflow
- `npm run dev` - Development server
- `npm run build` - Production build
- Static file serving from `/public`
- No testing framework currently configured
- TypeScript strict mode enabled

## Brand Voice & Content
Maintain consistent "trade professional hustle" messaging:
- "Built for the trade. Backed by hustle."
- Construction/industrial terminology
- Professional yet approachable tone
- Focus on ATS optimization and trade-specific needs