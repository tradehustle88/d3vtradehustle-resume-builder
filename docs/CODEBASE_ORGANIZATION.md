# Trade Hustle Resume Builder – Codebase Organization Guide

## File Organization

### Root Structure
```
d3vtradehustle-resume-builder/
├── api-functions/          # Firebase Functions (Express backend)
├── frontend/               # Next.js 14 frontend application
├── docs/                   # Project documentation
├── firebase.json          # Firebase configuration
└── firebaserc            # Firebase project settings
```

### Frontend Structure (`frontend/`)
```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router pages
│   │   ├── layout.tsx          # Root layout (GA, fonts, theme)
│   │   ├── page.tsx            # Homepage
│   │   ├── unlock/             # Resume unlock flow
│   │   ├── templates/          # Template gallery
│   │   └── [route]/page.tsx    # Route-based pages
│   │
│   ├── components/             # Reusable React components
│   │   ├── TradeSelectionGrid.tsx  # Trade selection UI
│   │   ├── TemplateGallery.tsx     # Template browsing
│   │   └── [Component].tsx         # Other components
│   │
│   ├── lib/                    # Utility functions
│   │   ├── api.ts             # API client (fetch wrapper)
│   │   ├── analytics.ts       # Google Analytics helpers
│   │   └── firebase.ts        # Firebase client config
│   │
│   └── types/                  # TypeScript type definitions
│       └── database.ts         # Firestore schema types
│
├── public/                     # Static assets
│   ├── assets/                # Images, textures, fonts
│   ├── resume/                # Resume PDF templates
│   └── resume-kit.pdf         # Main resume download
│
└── out/                       # Build output (static export)
```

### Backend Structure (`api-functions/`)
```
api-functions/
├── index.js                   # Main Express app & route definitions
├── middleware/
│   ├── auth.js               # Firebase Auth verification
│   ├── honeypot.js           # Bot protection
│   └── rateLimiter.js        # Rate limiting
│
├── services/
│   ├── gemini.js             # AI integration (Gemini 2.5)
│   ├── stripe.js             # Payment processing
│   └── storage.js            # Firebase Storage helpers
│
└── package.json              # Dependencies
```

---

## Naming Conventions

### Files & Directories
- **React Components**: PascalCase (e.g., `TradeSelectionGrid.tsx`)
- **Utility Files**: camelCase (e.g., `api.ts`, `analytics.ts`)
- **API Routes**: kebab-case in URLs (e.g., `/api/unlock-resume`)
- **Middleware**: camelCase (e.g., `auth.js`, `rateLimiter.js`)

### Code Conventions
- **React Components**: Named exports for pages, default exports for components
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `TRADES`, `API_BASE_URL`)
- **Interfaces/Types**: PascalCase with descriptive names (e.g., `TradeOption`, `Template`)
- **Functions**: camelCase, verb-first (e.g., `handleTradeSelect`, `verifyUser`)

### CSS/Tailwind
- **Custom Classes**: kebab-case with purpose prefix
  - `btn-hustle` (buttons)
  - `hero-title` (typography)
  - `brick-block` (layout blocks)
- **Colors**: Hex values with semantic meaning
  - `#001a33` (navy/dark)
  - `#FFD700` (gold/accent)
  - `#8B0000` (red/danger)

---

## Key Patterns

### 1. **Static Export Pattern** (Frontend)
```typescript
// next.config.js
module.exports = {
  output: 'export',  // Static HTML generation
  images: {
    unoptimized: true  // Required for static export
  }
}
```
**Why**: Firebase Hosting serves static files, no Node.js server required.

### 2. **Firebase Functions v2 + Express Pattern** (Backend)
```javascript
// api-functions/index.js
const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');

const app = express();

// Middleware stack
app.use(rateLimiter);
app.use(honeypotCheck);

// Routes
app.post('/api/unlockResume', verifyUser, async (req, res) => { ... });

// Export single function
exports.app = onRequest({ 
  cors: true,
  secrets: ['STRIPE_SECRET_KEY', 'GOOGLE_API_KEY']
}, app);
```
**Why**: All routes under single Cloud Run endpoint, easier deployment.

### 3. **Graceful Degradation Pattern** (AI Integration)
```javascript
// api-functions/services/gemini.js
function getGeminiKey() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    console.warn('⚠️ GOOGLE_API_KEY not configured');
    return null;
  }
  return key;
}

async function editResume(prompt) {
  const key = getGeminiKey();
  if (!key) {
    return {
      success: false,
      error: 'AI service unavailable',
      message: 'Configure GOOGLE_API_KEY to enable AI editing'
    };
  }
  // ... actual AI logic
}
```
**Why**: Developers can work locally without AI keys; production fails gracefully.

### 4. **Client-Side Auth Pattern** (Frontend)
```typescript
'use client'  // Required for hooks

import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function ProtectedPage() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [])
}
```
**Why**: Static export can't do server-side auth; Firebase SDK handles client-side.

### 5. **Type-Safe API Pattern** (Frontend)
```typescript
// frontend/src/lib/api.ts
interface ApiResponse {
  success: boolean
  message?: string
  error?: string
  errorId?: string
  data?: any
}

export async function unlockResume(idToken: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/api/unlockResume`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  })
  return res.json()
}
```
**Why**: Consistent error handling, type safety, easy to mock for testing.

---

## Important Files & Directories

### Must-Read Files
1. **`.github/copilot-instructions.md`** – AI agent guide, architecture overview
2. **`docs/DATABASE_SCHEMA.md`** – Complete Firestore schema (8 collections)
3. **`frontend/src/app/layout.tsx`** – Root layout, GA integration, global styles
4. **`api-functions/index.js`** – Backend entry point, all routes defined here
5. **`api-functions/middleware/auth.js`** – Auth patterns, role-based access

### Key Configuration Files
- **`firebase.json`** – Hosting, Functions, Firestore config
- **`firestore.rules`** – Security rules for all collections
- **`firestore.indexes.json`** – Composite indexes for queries
- **`frontend/next.config.js`** – Static export, redirects, env vars
- **`frontend/tailwind.config.js`** – Custom colors, font families

### Critical Data Files
- **`frontend/public/resume-kit.pdf`** – Main resume download
- **`frontend/public/resume/`** – Trade-specific resume templates
- **`frontend/src/types/database.ts`** – TypeScript interfaces for Firestore

---

## Common Tasks

### Adding a New Feature

#### 1. **New Frontend Page**
```bash
# Create page file
frontend/src/app/my-feature/page.tsx

# Page structure
'use client'
export default function MyFeaturePage() {
  return <div>Content</div>
}
```

#### 2. **New Backend Endpoint**
```javascript
// api-functions/index.js
app.post('/api/myEndpoint', verifyUser, honeypotCheck, async (req, res) => {
  try {
    // Validate input
    if (!req.body.requiredField) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        errorId: 'VALIDATION_ERROR'
      });
    }

    // Business logic
    const result = await doSomething(req.body);

    // Success response
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      errorId: 'SERVER_ERROR'
    });
  }
});
```

#### 3. **New Firestore Collection**
```typescript
// 1. Add to docs/DATABASE_SCHEMA.md
// 2. Add security rules to firestore.rules
// 3. Add TypeScript types to frontend/src/types/database.ts
// 4. Add indexes to firestore.indexes.json if needed
// 5. Deploy: firebase deploy --only firestore
```

### Working with Authentication

#### Frontend (Client-Side)
```typescript
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

// Sign in
const userCredential = await signInWithEmailAndPassword(auth, email, password)
const idToken = await userCredential.user.getIdToken()

// Make authenticated request
const response = await fetch(`${API_URL}/api/protected`, {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
})
```

#### Backend (Verify Token)
```javascript
// Use verifyUser middleware
app.post('/api/protected', verifyUser, async (req, res) => {
  // req.user is populated by middleware
  const { uid, email, subscriptionTier } = req.user;
  
  // Access control
  if (subscriptionTier === 'free') {
    return res.status(403).json({
      success: false,
      error: 'Premium feature',
      errorId: 'SUB_UPGRADE_REQUIRED'
    });
  }
  
  // Continue...
});
```

### Working with AI (Gemini Integration)

```javascript
// Backend: api-functions/services/gemini.js
const { generateContent } = require('./gemini');

// In route handler
app.post('/api/editResume', verifyUser, async (req, res) => {
  const { prompt, resumeContent } = req.body;
  
  const result = await generateContent(
    `${prompt}\n\nCurrent Resume:\n${resumeContent}`
  );
  
  if (!result.success) {
    return res.status(503).json(result);  // Graceful degradation
  }
  
  res.json({
    success: true,
    editedContent: result.content
  });
});
```

---

## External Dependencies

### Firebase Services
- **Authentication**: Email/password, Google OAuth
- **Firestore**: Database (8 collections, see DATABASE_SCHEMA.md)
- **Storage**: Resume PDFs, user uploads
- **Functions**: Cloud Run backend (Express app)
- **Hosting**: Static site serving

### Payment Processing (Stripe)
```javascript
// Fallback configuration pattern
function getStripeKey() {
  // Try environment variable first
  if (process.env.STRIPE_SECRET_KEY) {
    return process.env.STRIPE_SECRET_KEY;
  }
  
  // Fallback to Firebase config (legacy)
  try {
    return functions.config().stripe?.secret_key;
  } catch {
    return null;
  }
}
```

### AI Integration (Gemini 2.5 Flash)
- **Model**: `gemini-2.5-flash-preview-09-2025`
- **Use Cases**: Resume editing, keyword optimization, content suggestions
- **Graceful Degradation**: Returns helpful error when API key missing

### Analytics (Google Analytics 4)
```typescript
// frontend/src/lib/analytics.ts
export function trackEvent(eventName: string, params?: object) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// Usage
trackEvent('resume_unlock', { trade: 'electrician' });
```

---

## Gotchas & Non-Obvious Behaviors

### 1. **Static Export Limitations**
❌ **Can't Use**: Server-side API routes (`pages/api/`), dynamic SSR, ISR  
✅ **Must Use**: Client-side auth, external API calls, static pages only  
🔧 **Workaround**: All server logic in Firebase Functions

### 2. **Firebase Functions v2 vs v1**
❌ **v1 Pattern** (deprecated):
```javascript
const functions = require('firebase-functions');
const config = functions.config();  // Doesn't work in v2
```

✅ **v2 Pattern**:
```javascript
const { onRequest } = require('firebase-functions/v2/https');
const key = process.env.SECRET_KEY;  // Use env vars or secrets
```

### 3. **CORS Must Be Explicit**
```javascript
// Backend
exports.app = onRequest({ cors: true }, app);

// Frontend - must specify full URL
const API_URL = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
                'https://app-fbs5jy4frq-uc.a.run.app';
```

### 4. **Firestore Security Rules Are Strict**
```javascript
// Firestore rules validate on every request
match /resumes/{resumeId} {
  allow read: if request.auth != null &&
    (resource.data.userId == request.auth.uid || 
     resource.data.shareSettings.enabled);
}

// Backend can bypass with admin SDK
await admin.firestore().collection('resumes').doc(id).get();
```

### 5. **Rate Limiting is Per-Function Instance**
```javascript
// Rate limiter uses in-memory store
// Multiple Cloud Run instances = independent rate limits
// For strict limits, use Redis or Firestore-based limiter
```

### 6. **Tailwind Classes in Template Literals**
```typescript
// ❌ Dynamic classes may not be detected
className={`text-${color}-500`}  // Won't work

// ✅ Use full class names
className={color === 'red' ? 'text-red-500' : 'text-blue-500'}

// ✅ Or define in safelist (tailwind.config.js)
safelist: ['text-red-500', 'text-blue-500']
```

### 7. **Environment Variables Must Be Prefixed**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=...     # ✅ Exposed to browser
FIREBASE_PRIVATE_KEY=...             # ❌ Not accessible

# Backend (Firebase secrets)
firebase functions:secrets:set STRIPE_SECRET_KEY
```

### 8. **Build Order Matters**
```bash
# Correct deployment order:
1. firebase deploy --only firestore       # Deploy rules & indexes
2. cd frontend && npm run build           # Build static site
3. firebase deploy --only hosting         # Deploy frontend
4. firebase deploy --only functions:app   # Deploy backend
```

### 9. **TypeScript Config Inheritance**
```json
// frontend/tsconfig.json
{
  "extends": "./tsconfig.dev.json",  // Dev overrides
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // Import alias
    }
  }
}
```

### 10. **Firestore Timestamps**
```javascript
// Backend: Use admin SDK format
createdAt: admin.firestore.FieldValue.serverTimestamp()

// Frontend: Use client SDK format
createdAt: serverTimestamp()  // from 'firebase/firestore'

// Both serialize to ISO strings in JSON
```

---

## Quick Reference Commands

```bash
# Development
cd frontend && npm run dev                    # Start Next.js dev server
firebase emulators:start                      # Start local emulators

# Build & Deploy
cd frontend && npm run build && npm run export
firebase deploy --only hosting
firebase deploy --only functions:app
firebase deploy --only firestore

# Testing
cd frontend && npm run lint                   # Lint frontend
cd frontend && npm run type-check             # TypeScript check
./frontend/test-endpoints.sh                  # API smoke tests
./frontend/test-flow.sh                       # Auth flow test

# Firestore Management
firebase firestore:delete --recursive         # Clear collection
firebase firestore:indexes                    # List indexes

# Secrets Management
firebase functions:secrets:set SECRET_NAME
firebase functions:secrets:access SECRET_NAME
```

---

## When Adding New Code

### ✅ **DO**
- Use existing middleware (`verifyUser`, `honeypotCheck`, `rateLimiter`)
- Follow the `{ success, error, errorId }` response format
- Add TypeScript types to `database.ts` for new Firestore collections
- Track analytics events for user actions
- Test with emulators before deploying
- Update `DATABASE_SCHEMA.md` for schema changes

### ❌ **DON'T**
- Add routes to `frontend/pages/api/` (use Firebase Functions)
- Use `functions.config()` (Functions v2 deprecation)
- Hardcode secrets or API keys
- Skip authentication middleware on protected endpoints
- Forget to add security rules for new collections
- Use dynamic Tailwind classes without safelist

---

**Last Updated**: October 14, 2025  
**Maintainer**: Trade Hustle Team  
**Questions?** See `.github/copilot-instructions.md` for AI agent guide
