# 🔗 Integration Guide: New User Flow → Existing System

## Overview
This guide details how to integrate the newly created 12-column modular user flow components with the existing Trade Hustle Resume Builder infrastructure.

---

## 🎯 Quick Start

### 1. Update Main Landing Page Route

**File**: `frontend/src/app/page.tsx`

```typescript
import LandingPage from '@/components/LandingPage'

export default function Home() {
  return <LandingPage />
}
```

### 2. Add Navigation to Existing Layout

**File**: `frontend/src/app/layout.tsx`

Add navigation menu items:

```typescript
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/trade-selection', label: 'Build Resume' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/auth', label: 'Sign In' }
]
```

---

## 🔥 Firebase Integration

### Auth Screen → Firebase Authentication

**File**: `frontend/src/components/AuthScreen.tsx`

Replace placeholder auth calls with Firebase:

```typescript
import { auth } from '@/lib/firebase'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth'

// Google Sign-In
const handleGoogleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    // Store user token
    const idToken = await result.user.getIdToken()
    localStorage.setItem('authToken', idToken)
    router.push(redirectTo)
  } catch (error) {
    setError(error.message)
  }
}

// Apple Sign-In
const handleAppleSignIn = async () => {
  try {
    const provider = new OAuthProvider('apple.com')
    const result = await signInWithPopup(auth, provider)
    const idToken = await result.user.getIdToken()
    localStorage.setItem('authToken', idToken)
    router.push(redirectTo)
  } catch (error) {
    setError(error.message)
  }
}

// Email/Password
const handleEmailPasswordAuth = async (e) => {
  e.preventDefault()
  try {
    let result
    if (authMode === 'signup') {
      result = await createUserWithEmailAndPassword(auth, email, password)
    } else {
      result = await signInWithEmailAndPassword(auth, email, password)
    }
    const idToken = await result.user.getIdToken()
    localStorage.setItem('authToken', idToken)
    router.push(redirectTo)
  } catch (error) {
    setError(error.message)
  }
}
```

---

## 🤖 AI Integration

### Resume Builder → Gemini API

**File**: `frontend/src/components/EnhancedResumeBuilder.tsx`

Connect AI suggestions to existing Gemini endpoint:

```typescript
const getAISuggestions = async (field: string, value: string) => {
  setLoading(true)
  try {
    const authToken = localStorage.getItem('authToken')
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/api/editResume`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          prompt: `Generate professional resume suggestions for ${trade} ${field}: ${value}`,
          resumeContent: value
        })
      }
    )
    const data = await response.json()
    if (data.success) {
      setAiSuggestions(data.suggestions || [data.message])
    }
  } catch (error) {
    console.error('AI suggestions error:', error)
  } finally {
    setLoading(false)
  }
}
```

### Resume Preview → ATS Analysis

**File**: `frontend/src/components/ResumePreview.tsx`

```typescript
const analyzeResume = async () => {
  setLoading(true)
  try {
    const authToken = localStorage.getItem('authToken')
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/api/analyzeATS`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          resumeData,
          trade
        })
      }
    )
    const data = await response.json()
    if (data.success) {
      setAtsAnalysis(data.analysis)
    }
  } catch (error) {
    console.error('ATS analysis error:', error)
  } finally {
    setLoading(false)
  }
}
```

---

## 💾 Firestore Data Storage

### Save Resume Data

**File**: `frontend/src/lib/resumeStorage.ts` (create new)

```typescript
import { db } from '@/lib/firebase'
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore'

export async function saveResume(userId: string, resumeData: any) {
  const resumeRef = doc(db, 'resumes', `${userId}_${Date.now()}`)
  await setDoc(resumeRef, {
    ...resumeData,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  return resumeRef.id
}

export async function getResume(resumeId: string) {
  const resumeRef = doc(db, 'resumes', resumeId)
  const resumeSnap = await getDoc(resumeRef)
  return resumeSnap.exists() ? resumeSnap.data() : null
}

export async function listUserResumes(userId: string) {
  const resumesRef = collection(db, 'resumes')
  const querySnapshot = await getDocs(resumesRef)
  return querySnapshot.docs
    .filter(doc => doc.data().userId === userId)
    .map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function deleteResume(resumeId: string) {
  await deleteDoc(doc(db, 'resumes', resumeId))
}
```

### Connect Dashboard to Firestore

**File**: `frontend/src/components/Dashboard.tsx`

```typescript
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { listUserResumes } from '@/lib/resumeStorage'

export default function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserResumes()
  }, [])

  const loadUserResumes = async () => {
    try {
      const user = auth.currentUser
      if (user) {
        const userResumes = await listUserResumes(user.uid)
        setResumes(userResumes)
      }
    } catch (error) {
      console.error('Error loading resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Rest of component...
}
```

---

## 💳 Stripe Integration

### Pricing Modal → Existing Checkout

**File**: `frontend/src/components/PricingModal.tsx`

Replace placeholder checkout with existing Stripe integration:

```typescript
const handleSelectTier = async (tierId: string) => {
  if (tierId === 'free') {
    handleFreeDownload()
    return
  }

  // Map tier IDs to Stripe price IDs
  const priceIds = {
    trial: 'price_1234567890TRIAL',
    monthly: 'price_1234567890MONTHLY',
    annual: 'price_1SHfAyLr4v4blpwbcvDqbej8' // Existing annual price
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/api/createCheckout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          priceId: priceIds[tierId],
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      }
    )

    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
    }
  } catch (error) {
    console.error('Checkout error:', error)
  }
}
```

---

## 📊 State Management

### Option 1: Context API (Simpler)

**File**: `frontend/src/contexts/ResumeContext.tsx` (create new)

```typescript
'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface ResumeContextType {
  resumeData: any
  setResumeData: (data: any) => void
  trade: string
  setTrade: (trade: string) => void
  templateId: string
  setTemplateId: (id: string) => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState({})
  const [trade, setTrade] = useState('')
  const [templateId, setTemplateId] = useState('')

  return (
    <ResumeContext.Provider value={{
      resumeData,
      setResumeData,
      trade,
      setTrade,
      templateId,
      setTemplateId
    }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) throw new Error('useResume must be used within ResumeProvider')
  return context
}
```

**Update**: `frontend/src/app/layout.tsx`

```typescript
import { ResumeProvider } from '@/contexts/ResumeContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ResumeProvider>
          {children}
        </ResumeProvider>
      </body>
    </html>
  )
}
```

### Option 2: Zustand (More Scalable)

**File**: `frontend/src/store/resumeStore.ts` (create new)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ResumeStore {
  resumeData: any
  trade: string
  templateId: string
  setResumeData: (data: any) => void
  setTrade: (trade: string) => void
  setTemplateId: (id: string) => void
  reset: () => void
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: {},
      trade: '',
      templateId: '',
      setResumeData: (data) => set({ resumeData: data }),
      setTrade: (trade) => set({ trade }),
      setTemplateId: (id) => set({ templateId: id }),
      reset: () => set({ resumeData: {}, trade: '', templateId: '' })
    }),
    {
      name: 'resume-storage'
    }
  )
)
```

---

## 🔐 Protected Routes

**File**: `frontend/src/middleware.ts` (create new)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = ['/dashboard', '/builder', '/preview']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !authToken) {
    const url = new URL('/auth', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/builder/:path*', '/preview/:path*']
}
```

---

## 📧 Email Services

### Magic Link Implementation

**Backend**: `api-functions/index.js`

```javascript
app.post('/api/sendMagicLink', async (req, res) => {
  try {
    const { email } = req.body
    
    // Generate magic link token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = Date.now() + (15 * 60 * 1000) // 15 minutes
    
    // Store token in Firestore
    await db.collection('magicLinks').doc(token).set({
      email,
      expiresAt,
      used: false
    })
    
    // Send email (use SendGrid, Mailgun, etc.)
    const magicLink = `${process.env.APP_URL}/auth/verify?token=${token}`
    
    // Email sending logic here
    
    res.json({ success: true, message: 'Magic link sent' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.query
    
    const linkDoc = await db.collection('magicLinks').doc(token).get()
    if (!linkDoc.exists) {
      return res.status(404).json({ success: false, error: 'Invalid link' })
    }
    
    const linkData = linkDoc.data()
    if (linkData.used || Date.now() > linkData.expiresAt) {
      return res.status(400).json({ success: false, error: 'Link expired' })
    }
    
    // Mark as used
    await db.collection('magicLinks').doc(token).update({ used: true })
    
    // Create/sign in user
    // Generate Firebase custom token
    
    res.json({ success: true, token: 'firebase_custom_token' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
```

---

## 📈 Analytics Integration

### Track User Flow Events

**File**: `frontend/src/lib/analytics.ts` (existing)

Add new events:

```typescript
export function trackTradeSelection(trade: string) {
  gtag('event', 'trade_selected', {
    trade_type: trade,
    event_category: 'user_flow'
  })
}

export function trackTemplateView(trade: string, templateId: string) {
  gtag('event', 'template_viewed', {
    trade_type: trade,
    template_id: templateId,
    event_category: 'user_flow'
  })
}

export function trackBuilderStep(step: number) {
  gtag('event', 'builder_step_completed', {
    step_number: step,
    event_category: 'conversion'
  })
}

export function trackResumePreview(atsScore: number) {
  gtag('event', 'resume_previewed', {
    ats_score: atsScore,
    event_category: 'conversion'
  })
}

export function trackPricingView(tier: string) {
  gtag('event', 'pricing_tier_viewed', {
    tier_name: tier,
    event_category: 'conversion'
  })
}
```

Add to components:

```typescript
// TradeSelectionGrid.tsx
import { trackTradeSelection } from '@/lib/analytics'

const handleTradeSelect = (tradeId: string) => {
  trackTradeSelection(tradeId)
  router.push(`/templates?trade=${tradeId}`)
}

// EnhancedResumeBuilder.tsx
import { trackBuilderStep } from '@/lib/analytics'

const nextStep = () => {
  trackBuilderStep(currentStep)
  setCurrentStep(currentStep + 1)
}
```

---

## 🧪 Testing Checklist

### Component Tests
- [ ] Test trade selection navigation
- [ ] Test template filtering and preview
- [ ] Test multi-step form validation
- [ ] Test resume preview rendering
- [ ] Test pricing tier selection
- [ ] Test auth form submission
- [ ] Test dashboard tab switching

### Integration Tests
- [ ] Test Firebase Auth flow
- [ ] Test resume save/load from Firestore
- [ ] Test AI suggestion generation
- [ ] Test ATS score calculation
- [ ] Test Stripe checkout redirect
- [ ] Test PDF download generation

### E2E Tests
- [ ] Complete user journey: Landing → Dashboard
- [ ] Resume creation with all steps
- [ ] Payment flow (test mode)
- [ ] Auth → Save → Resume → Download

---

## 🚀 Deployment Steps

1. **Environment Variables**
   ```bash
   NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://your-project.cloudfunctions.net
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   npm run export
   ```

3. **Deploy Functions**
   ```bash
   firebase deploy --only functions:api
   ```

4. **Deploy Hosting**
   ```bash
   firebase deploy --only hosting
   ```

5. **Verify Routes**
   - Test all new routes
   - Check Firebase Auth
   - Verify Stripe integration

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: Components not rendering
- **Solution**: Check import paths use `@/` alias
- **Solution**: Verify component is client-side (`'use client'`)

**Issue**: Navigation not working
- **Solution**: Use `useRouter` from `next/navigation`, not `next/router`
- **Solution**: Check route files exist in `app/` directory

**Issue**: Firebase Auth errors
- **Solution**: Verify Firebase config in environment variables
- **Solution**: Check Firebase console for enabled auth methods

**Issue**: State not persisting
- **Solution**: Implement state management (Context/Zustand)
- **Solution**: Use localStorage for temporary state

---

## ✅ Final Integration Checklist

- [ ] All components imported correctly
- [ ] Firebase Auth connected
- [ ] Firestore storage implemented
- [ ] Gemini AI endpoints working
- [ ] Stripe checkout integrated
- [ ] State management set up
- [ ] Protected routes configured
- [ ] Analytics tracking added
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive tested
- [ ] E2E user flow tested
- [ ] Production environment configured
- [ ] Deployed and verified

---

**Next Actions**:
1. Start with Firebase Auth integration
2. Set up state management
3. Connect to existing Gemini endpoints
4. Test complete user flow
5. Deploy to staging environment

**Questions?** Refer to `USER_FLOW_IMPLEMENTATION.md` for detailed component documentation.
