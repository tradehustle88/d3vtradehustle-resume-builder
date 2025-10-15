# Resume Builder Wizard Integration Guide

## 🎯 Components Created

### 1. **HustleEngine.tsx** ✅
**Location:** `frontend/src/components/HustleEngine.tsx`

A complete 4-step wizard for building professional trade resumes with:
- ✅ Step 1: Profile & Contact Info
- ✅ Step 2: Work Experience (with dynamic add/remove)
- ✅ Step 3: Skills & Certifications (technical skills, licenses, certs)
- ✅ Step 4: Education & References
- ✅ Progress indicator with visual step tracking
- ✅ Form validation on each step
- ✅ Auto-save to Firestore
- ✅ Google Analytics tracking
- ✅ TypeScript with proper types from `@/types/database`

### 2. **ResumePreview.tsx** ✅ (Already Exists)
**Location:** `frontend/src/components/ResumePreview.tsx`

Live preview component with:
- Real-time ATS score analysis
- Professional formatting
- PDF export functionality

### 3. **PricingModal.tsx** ✅ (Already Exists)
**Location:** `frontend/src/components/PricingModal.tsx`

Pricing modal with 4 tiers:
- Free ($0) - Text export
- Trial ($2) - 7-day full access
- Monthly ($14.95)
- Annual ($119)

---

## 🚀 How to Use the Components

### Option 1: Replace Existing Builder Page

**File:** `frontend/src/app/builder/page.tsx`

```tsx
'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import HustleEngine from '@/components/HustleEngine'

function BuilderContent() {
  const searchParams = useSearchParams()
  const trade = searchParams.get('trade') || 'electrician'
  const templateId = searchParams.get('template') || 'classic-trade'

  return (
    <HustleEngine 
      tradeType={trade}
      templateId={templateId}
      onComplete={(resumeId) => {
        console.log('Resume created:', resumeId)
        // Redirect to preview or dashboard
      }}
    />
  )
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading wizard...</div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  )
}
```

### Option 2: Create New Wizard Page

**File:** `frontend/src/app/wizard/page.tsx`

```tsx
'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import HustleEngine from '@/components/HustleEngine'
import ResumePreview from '@/components/ResumePreview'
import PricingModal from '@/components/PricingModal'

function WizardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const trade = searchParams.get('trade') || 'electrician'
  
  const [resumeData, setResumeData] = useState(null)
  const [showPricing, setShowPricing] = useState(false)

  const handleWizardComplete = (resumeId: string) => {
    console.log('Resume created:', resumeId)
    // Fetch resume data and show preview
    // Or redirect to dashboard
    router.push(`/dashboard?resume=${resumeId}`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Wizard Form */}
      <div>
        <HustleEngine 
          tradeType={trade}
          onComplete={handleWizardComplete}
        />
      </div>

      {/* Right: Live Preview */}
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        {resumeData ? (
          <ResumePreview 
            resumeData={resumeData}
            trade={trade}
            templateId="classic-trade"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Fill out the form to see live preview</p>
          </div>
        )}
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <PricingModal onClose={() => setShowPricing(false)} />
      )}
    </div>
  )
}

export default function WizardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WizardContent />
    </Suspense>
  )
}
```

### Option 3: Dashboard Integration

**File:** `frontend/src/app/dashboard/resumes/page.tsx`

```tsx
'use client'
import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import HustleEngine from '@/components/HustleEngine'
import { Resume } from '@/types/database'

export default function ResumesPage() {
  const [showWizard, setShowWizard] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)

  useEffect(() => {
    loadResumes()
  }, [])

  const loadResumes = async () => {
    if (!auth.currentUser) return

    const q = query(
      collection(db, 'resumes'),
      where('userId', '==', auth.currentUser.uid)
    )
    const snapshot = await getDocs(q)
    const resumeList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Resume[]

    setResumes(resumeList)
  }

  const handleCreateNew = () => {
    setSelectedResume(null)
    setShowWizard(true)
  }

  const handleEdit = (resume: Resume) => {
    setSelectedResume(resume)
    setShowWizard(true)
  }

  if (showWizard) {
    return (
      <div>
        <button 
          onClick={() => setShowWizard(false)}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
        >
          ← Back to Resumes
        </button>
        
        <HustleEngine
          tradeType={selectedResume?.tradeType || 'electrician'}
          existingResume={selectedResume || undefined}
          onComplete={(resumeId) => {
            setShowWizard(false)
            loadResumes()
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">My Resumes</h1>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-yellow-600"
          >
            + Create New Resume
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(resume => (
            <div 
              key={resume.id}
              className="bg-gray-800 rounded-lg p-6 hover:shadow-xl transition cursor-pointer"
              onClick={() => handleEdit(resume)}
            >
              <h3 className="text-xl font-bold text-white mb-2">{resume.title}</h3>
              <p className="text-gray-400 mb-4">{resume.tradeType}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  ATS Score: {resume.atsScore}%
                </span>
                <button className="text-[#ffd700] hover:text-yellow-600">
                  Edit →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## 📋 Component Props Reference

### HustleEngine Props

```tsx
interface HustleEngineProps {
  tradeType: string              // Required: 'electrician', 'plumber', etc.
  templateId?: string            // Optional: default 'classic-trade'
  onComplete?: (resumeId: string) => void  // Optional: callback when saved
  existingResume?: Partial<Resume>  // Optional: for editing existing resume
}
```

**Usage Examples:**

```tsx
// New resume
<HustleEngine tradeType="electrician" />

// With callback
<HustleEngine 
  tradeType="plumber"
  onComplete={(id) => router.push(`/preview/${id}`)}
/>

// Edit existing
<HustleEngine 
  tradeType="hvac"
  existingResume={myResume}
/>
```

### ResumePreview Props

```tsx
interface ResumePreviewProps {
  resumeData: any       // Resume data object
  trade: string         // Trade type
  templateId: string    // Template ID
}
```

### PricingModal Props

```tsx
interface PricingModalProps {
  onClose?: () => void      // Optional: close callback
  defaultTier?: string      // Optional: pre-select tier
}
```

---

## 🎨 Styling & Customization

The wizard uses your existing design system:
- **Colors:** `#001a33` (navy), `#ffd700` (gold), `#8b0000` (red)
- **Fonts:** Anton for headings, Merriweather for body
- **Tailwind Classes:** Consistent with your app

### Custom Colors

Update colors in the component:

```tsx
// Replace these in HustleEngine.tsx
bg-[#ffd700]  // Gold buttons
text-[#ffd700]  // Gold text
from-[#001a33]  // Navy gradient
```

---

## 🔥 Key Features

### 1. **Auto-Save**
- Automatically creates document in Firestore
- Updates existing documents when editing
- Tracks version numbers

### 2. **Form Validation**
- Required fields marked with red asterisks
- Email format validation
- Minimum character counts
- Step-by-step validation

### 3. **Dynamic Fields**
- Add/remove work experiences
- Add/remove responsibilities
- Add/remove skills, licenses, certs
- Add/remove education & references

### 4. **Analytics Tracking**
- `resume_wizard_started`
- `wizard_step_completed`
- `resume_created`
- `resume_updated`

### 5. **Mobile Responsive**
- Adapts to all screen sizes
- Touch-friendly buttons
- Stacked layout on mobile

---

## 🧪 Testing

### Test the Wizard:

```bash
# Start dev server
cd frontend
npm run dev

# Visit
http://localhost:3000/builder?trade=electrician
```

### Test with different trades:
- `/builder?trade=electrician`
- `/builder?trade=plumber`
- `/builder?trade=hvac`
- `/builder?trade=carpenter`

---

## 🚨 Common Issues & Solutions

### Issue 1: "User must be logged in"
**Solution:** Make sure user is authenticated before showing wizard:

```tsx
import { auth, onAuthStateChanged } from '@/lib/firebase'

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/unlock')
    }
  })
  return () => unsubscribe()
}, [])
```

### Issue 2: Firestore permission denied
**Solution:** Check `firestore.rules`:

```
match /resumes/{resumeId} {
  allow read, write: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}
```

### Issue 3: TypeScript errors
**Solution:** Ensure all types are imported:

```tsx
import { 
  Resume, 
  WorkExperience, 
  TechnicalSkill, 
  License, 
  Certification,
  Education,
  Reference 
} from '@/types/database'
```

---

## 🎯 Next Steps

1. **Test the wizard** at `/builder?trade=electrician`
2. **Integrate with dashboard** using Option 3 above
3. **Add live preview** side-by-side with wizard
4. **Connect to AI endpoints** for resume enhancement
5. **Add PDF export** after wizard completion

---

## 📚 Related Files

- **Types:** `frontend/src/types/database.ts`
- **Firebase:** `frontend/src/lib/firebase.ts`
- **API:** `frontend/src/lib/api.ts`
- **Analytics:** `frontend/src/lib/analytics.ts`
- **Existing Builder:** `frontend/src/components/EnhancedResumeBuilder.tsx`

---

## 💡 Pro Tips

1. **Use URL params** to pre-fill trade type
2. **Add auto-save indicator** for better UX
3. **Show step completion checkmarks** after validation
4. **Add "Save Draft" button** for partial saves
5. **Implement "Skip" for optional steps**

---

## 🎉 You're Ready!

The wizard is fully integrated with:
- ✅ Firebase Authentication
- ✅ Firestore Database
- ✅ Google Analytics
- ✅ Your design system
- ✅ TypeScript types

**Start building resumes with:** `/builder?trade=electrician`

Need help? Check the example implementations above! 🚀
