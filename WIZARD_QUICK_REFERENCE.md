# 🎯 Resume Builder Wizard - Quick Reference

## ✅ What's Been Created

Three powerful components for building professional trade resumes:

### 1. **HustleEngine.tsx** (NEW!)
`frontend/src/components/HustleEngine.tsx`

**A complete 4-step wizard with:**
- ✅ Step 1: Profile & Contact Info (name, email, phone, location, summary)
- ✅ Step 2: Work Experience (company, position, dates, responsibilities)
- ✅ Step 3: Skills & Certifications (technical skills, licenses, certs)
- ✅ Step 4: Education & References (degrees, professional contacts)
- ✅ Visual progress indicator with step tracking
- ✅ Form validation with error messages
- ✅ Dynamic add/remove for all sections
- ✅ Auto-save to Firestore
- ✅ Google Analytics event tracking
- ✅ Edit existing resumes
- ✅ Fully typed with TypeScript

### 2. **ResumePreview.tsx** (Enhanced)
`frontend/src/components/ResumePreview.tsx`

**Live preview with:**
- Real-time ATS score calculation
- Keyword analysis (found/missing)
- Professional formatting
- PDF export functionality

### 3. **PricingModal.tsx** (Enhanced)
`frontend/src/components/PricingModal.tsx`

**4 pricing tiers:**
- Free ($0) - Text export
- Trial ($2) - 7-day full access
- Pro Monthly ($14.95)
- Pro Annual ($119) - Best value

---

## 🚀 Quick Start (3 Methods)

### Method 1: Simple Wizard Page
**Use the standalone wizard page:**

```bash
# Visit in browser after starting dev server
http://localhost:3000/wizard?trade=electrician
```

**Page location:** `frontend/src/app/wizard/page.tsx`

### Method 2: Advanced Builder with Preview
**Side-by-side wizard and live preview:**

```bash
http://localhost:3000/builder-advanced?trade=plumber
```

**Page location:** `frontend/src/app/builder-advanced/page.tsx`

### Method 3: Integrate into Existing Page
**Add to any page:**

```tsx
import HustleEngine from '@/components/HustleEngine'

export default function MyPage() {
  return (
    <HustleEngine 
      tradeType="electrician"
      onComplete={(resumeId) => {
        console.log('Resume created:', resumeId)
      }}
    />
  )
}
```

---

## 📋 Component Props

### HustleEngine

```tsx
interface HustleEngineProps {
  tradeType: string              // Required: 'electrician', 'plumber', etc.
  templateId?: string            // Optional: default 'classic-trade'
  onComplete?: (resumeId: string) => void  // Optional: callback when saved
  existingResume?: Partial<Resume>  // Optional: for editing existing
}
```

**Examples:**

```tsx
// New resume
<HustleEngine tradeType="electrician" />

// With callback
<HustleEngine 
  tradeType="hvac"
  onComplete={(id) => router.push(`/preview/${id}`)}
/>

// Edit existing
<HustleEngine 
  tradeType="plumber"
  existingResume={myResume}
/>
```

---

## 🧪 Testing

### Run Test Script

```powershell
# From project root
.\test-wizard.ps1
```

This checks:
- ✅ All component files exist
- ✅ Page files created
- ✅ TypeScript types available
- ✅ Firebase configured
- ✅ Analytics setup

### Manual Testing

1. **Start dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test URLs:**
   - Basic: `http://localhost:3000/wizard?trade=electrician`
   - Advanced: `http://localhost:3000/builder-advanced?trade=plumber`
   - Different trades:
     - `?trade=hvac`
     - `?trade=carpenter`
     - `?trade=welder`
     - `?trade=mechanic`

3. **Test Flow:**
   - Sign in with Google or email
   - Fill out Step 1 (Profile)
   - Click "Next" (validation runs)
   - Complete all 4 steps
   - Click "Save Resume"
   - Verify saved to Firestore

---

## 🎨 Customization

### Colors
Update in `HustleEngine.tsx`:

```tsx
bg-[#ffd700]    // Gold buttons
text-[#ffd700]  // Gold text
from-[#001a33]  // Navy gradient
bg-gray-800     // Card backgrounds
```

### Validation Rules
Modify in `HustleEngine.tsx`:

```tsx
const validateStep1 = (): boolean => {
  // Add custom validation rules
  if (!profile.fullName.trim()) {
    newErrors.fullName = 'Required'
  }
  // ...
}
```

### Add Custom Fields
In `HustleEngine.tsx`:

```tsx
// 1. Add to state
const [profile, setProfile] = useState({
  fullName: '',
  customField: '',  // <-- Add here
  // ...
})

// 2. Add input in JSX
<input
  value={profile.customField}
  onChange={(e) => setProfile({ ...profile, customField: e.target.value })}
/>

// 3. Update Firestore save
const resumeData = {
  profile: {
    fullName: profile.fullName,
    customField: profile.customField,  // <-- Add here
  }
}
```

---

## 📊 Analytics Events

Automatically tracked:

```tsx
resume_wizard_started   // When wizard opens
wizard_step_completed   // Each step completed
resume_created          // New resume saved
resume_updated          // Existing resume updated
```

View in Google Analytics:
1. Go to GA4 Dashboard
2. Navigate to Events
3. Filter by event name

---

## 🔥 Features Breakdown

### Step 1: Profile & Contact
- Full name, email, phone (required)
- Location (required)
- Professional summary (min 50 chars)
- LinkedIn URL (optional)
- Portfolio URL (optional)

### Step 2: Work Experience
- Company name, position (required)
- Start/end dates (required)
- "Current position" checkbox
- Location
- Multiple responsibilities (dynamic)
- Add/remove experience entries

### Step 3: Skills & Certifications
- Technical skills (min 3 required)
- Licenses (with number, issuer, expiry)
- Certifications (with dates)
- All dynamically add/remove

### Step 4: Education & References
- Institution, degree, field, date
- Professional references with contact info
- All optional but recommended
- Dynamic add/remove

---

## 🐛 Common Issues

### Issue 1: "User must be logged in"
**Solution:** User authentication is required before wizard access.

```tsx
// Wizard page auto-redirects to /unlock if not authenticated
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) router.push('/unlock')
  })
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
**Solution:** Import all required types:

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

### Issue 4: Resume not saving
**Solution:** Check Firebase console:
1. Firestore Database tab
2. Look for `resumes` collection
3. Check document created with your userId
4. Verify timestamps

---

## 📱 Mobile Responsiveness

The wizard is fully responsive:
- **Desktop:** Full 2-column layout
- **Tablet:** Stacked layout with toggle
- **Mobile:** Single column, step-by-step

Toggle preview on mobile:
```tsx
<button onClick={() => setShowPreview(!showPreview)}>
  {showPreview ? 'Hide' : 'Show'} Preview
</button>
```

---

## 🎯 Next Steps

### Immediate:
1. ✅ Test the wizard at `/wizard?trade=electrician`
2. ✅ Verify Firestore saves working
3. ✅ Check analytics events firing

### Enhancement Ideas:
- [ ] Add auto-save every 30 seconds
- [ ] Add "Save Draft" button
- [ ] Implement live preview updates
- [ ] Add AI suggestions per step
- [ ] Add template selection
- [ ] Add progress persistence (localStorage)
- [ ] Add keyboard shortcuts (Ctrl+S to save)
- [ ] Add export to multiple formats

---

## 📚 Documentation

**Full Guide:** `WIZARD_INTEGRATION_GUIDE.md`

**Related Files:**
- Types: `frontend/src/types/database.ts`
- Firebase: `frontend/src/lib/firebase.ts`
- API: `frontend/src/lib/api.ts`
- Analytics: `frontend/src/lib/analytics.ts`

---

## 💡 Pro Tips

1. **Pre-fill with URL params:**
   ```
   /wizard?trade=electrician&name=John+Doe&email=john@example.com
   ```

2. **Use existing data:**
   ```tsx
   <HustleEngine existingResume={loadedResume} />
   ```

3. **Customize redirect:**
   ```tsx
   onComplete={(id) => router.push(`/preview/${id}`)}
   ```

4. **Add loading states:**
   ```tsx
   {loading && <div>Saving...</div>}
   ```

5. **Validate before navigation:**
   All steps auto-validate before allowing "Next"

---

## 🎉 You're Ready!

Start building resumes:

```bash
cd frontend
npm run dev
# Visit http://localhost:3000/wizard?trade=electrician
```

**Need help?** Check the integration guide or existing component code!

---

**Created by:** GitHub Copilot  
**Date:** October 14, 2025  
**Version:** 1.0.0
