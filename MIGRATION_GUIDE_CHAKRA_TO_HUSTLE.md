# Migration Guide: Chakra UI → Hustle Theme Resume Builder

## Overview

This guide helps you migrate from the Chakra UI resume builder to the new **Hustle-themed Tailwind CSS** version with full AI integration.

---

## 🔄 What Changed

### Before (Chakra UI)
```tsx
import { Box, Button, FormControl, Input } from '@chakra-ui/react';

<Box bg="gray.50" p={6}>
  <FormControl>
    <Input size="lg" />
  </FormControl>
  <Button colorScheme="orange">Next</Button>
</Box>
```

### After (Hustle Theme + Tailwind)
```tsx
import { HVACResumeBuilder } from '@/components/forms';

<HVACResumeBuilder 
  userId={user.uid}
  onSave={handleSave}
  initialData={savedData}
/>
```

---

## 📦 Installation Steps

### 1. Install New Dependencies

```bash
cd frontend
npm install react-hook-form @hookform/resolvers zod framer-motion lucide-react
```

### 2. Remove Chakra UI (Optional)

If you're not using Chakra elsewhere:

```bash
npm uninstall @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### 3. Verify Tailwind Config

Ensure your `tailwind.config.js` has Hustle theme colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'hustle-navy': '#001a33',
        'hustle-navy-dark': '#000d1a',
        'hustle-gold': '#ffd700',
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
      },
    },
  },
};
```

---

## 🎯 Component Mapping

| Old (Chakra) | New (Hustle Theme) | Location |
|--------------|-------------------|----------|
| `HVACResumeBuilder` (single file) | `HVACResumeBuilder` (component wrapper) | `/components/forms/HVACResumeBuilder.tsx` |
| `ProgressSidebar` | `ProgressSidebar` | `/components/forms/ProgressSidebar.tsx` |
| `HeaderSection` | `HeaderSection` | `/components/forms/HeaderSection.tsx` |
| `SummarySection` | `SummarySection` | `/components/forms/SummarySection.tsx` |
| `PlaceholderSection` | Replaced with real components | See below |

### New Components Added

- **CertificationsSection** - Full certification management
- **SkillsSection** - Chip-based skill interface
- **ExperienceSection** - Work history with AI achievements
- **EducationSection** - Education records
- **ReferencesSection** - References with quick-fill
- **ReviewSection** - Completion summary + export

---

## 🔧 Code Updates

### Old Page Implementation

```tsx
// OLD: pages/resume-builder.tsx
import HVACResumeBuilder from '@/components/HVACResumeBuilder';

export default function Page() {
  return <HVACResumeBuilder />;
}
```

### New Page Implementation

```tsx
// NEW: app/resume-builder/page.tsx
"use client";

import { HVACResumeBuilder } from '@/components/forms';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveResumeProgress, loadResumeProgress } from '@/lib/resume-storage';

export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const [initialData, setInitialData] = useState();

  useEffect(() => {
    if (user) {
      loadResumeProgress(user.uid).then(setInitialData);
    }
  }, [user]);

  const handleSave = async (data) => {
    if (user) {
      await saveResumeProgress(user.uid, data);
    }
  };

  return (
    <HVACResumeBuilder 
      userId={user?.uid}
      onSave={handleSave}
      initialData={initialData}
    />
  );
}
```

---

## 🎨 Style Migration

### Chakra Props → Tailwind Classes

| Chakra Prop | Tailwind Class |
|-------------|----------------|
| `bg="gray.50"` | `bg-hustle-navy` |
| `p={6}` | `p-6` |
| `borderRadius="xl"` | `rounded-xl` |
| `shadow="sm"` | `shadow-sm` |
| `colorScheme="orange"` | `btn-hustle` (custom class) |
| `size="lg"` | `text-lg px-4 py-3` |

### Button Styles

```tsx
// OLD
<Button colorScheme="orange">Next</Button>
<Button variant="outline">Back</Button>

// NEW
<button className="btn-hustle">Next</button>
<button className="btn-hustle-secondary">Back</button>
```

### Form Fields

```tsx
// OLD
<FormControl isInvalid={!!errors.name}>
  <FormLabel>Name</FormLabel>
  <Input {...register('name')} size="lg" />
  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
</FormControl>

// NEW
<div>
  <label className="flex items-center gap-2 text-hustle-gold font-merriweather mb-2">
    <User className="w-4 h-4" />
    Name <span className="text-red-500">*</span>
  </label>
  <input
    {...register('name')}
    className="w-full px-4 py-3 bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg text-white font-merriweather focus:border-hustle-gold"
  />
  {errors.name && (
    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
  )}
</div>
```

---

## 🤖 New AI Features

### AI-Powered Summary Generation

```tsx
// Available in SummarySection
<button onClick={handleAIGenerate}>
  <Sparkles className="w-4 h-4" />
  AI Generate
</button>
```

**What it does**: Generates 3-sentence professional summary based on name, trade title, and certifications.

### AI-Powered Achievement Generation

```tsx
// Available in ExperienceSection (per job)
<button onClick={() => handleGenerateAchievements(index)}>
  <Sparkles className="w-4 h-4" />
  AI Generate
</button>
```

**What it does**: Creates 3 measurable bullet points for work achievements.

---

## 💾 Auto-Save Integration

### Old Behavior
Manual save button, no auto-save.

### New Behavior
Automatic debounced saves every 1.5 seconds.

```tsx
// Implemented in HVACResumeBuilder
const handleSave = async (data: Partial<ResumeFormData>) => {
  if (user) {
    await saveResumeProgress(user.uid, data);
  }
};

<HVACResumeBuilder onSave={handleSave} />
```

**Firestore Structure**:
```
resumes/
  {userId}/
    name: "John Smith"
    email: "john@email.com"
    certifications: [...]
    skills: [...]
    lastUpdated: "2025-10-16T12:34:56Z"
```

---

## 📤 Export Functionality

### PDF/DOCX Export

**Backend endpoint needed**:

```javascript
// api-functions/index.js
app.post('/api/exportResume', verifyUser, async (req, res) => {
  const { format, resumeData } = req.body;
  
  if (format === 'pdf') {
    // Generate PDF
    const pdf = await generatePDF(resumeData);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf);
  } else if (format === 'docx') {
    // Generate DOCX
    const docx = await generateDOCX(resumeData);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(docx);
  }
});
```

---

## 🔍 Schema Changes

### Old Schema (Partial)
```typescript
const resumeSchema = z.object({
  fullName: z.string().min(2),
  tradeTitle: z.string().default('HVAC Technician'),
  email: z.string().email(),
  phone: z.string().min(10),
  location: z.string().min(2),
  summary: z.string().optional(),
});
```

### New Schema (Complete)
```typescript
const resumeSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  location: z.string().min(2).max(100),
  tradeTitle: z.string().default("HVAC Technician"),
  summary: z.string().max(500).default(''),
  certifications: z.array(/* ... */).max(6),
  skills: z.array(/* ... */).max(8),
  experience: z.array(/* ... */),
  education: z.array(/* ... */),
  references: z.string().max(300).default(''),
});
```

**Field name changes**:
- `fullName` → `name`

---

## 🧪 Testing Checklist

After migration:

- [ ] Form loads without errors
- [ ] All 8 steps are navigable
- [ ] Field validation works (try submitting empty fields)
- [ ] Auto-save indicator appears when typing
- [ ] Refresh page → data persists
- [ ] AI generation buttons work (summary, achievements)
- [ ] Export buttons appear on final step
- [ ] Mobile view works (sidebar collapses)
- [ ] Back/Next navigation works
- [ ] Error messages display correctly

---

## 📱 Responsive Behavior

### Desktop (≥768px)
- ✅ Sidebar visible on left
- ✅ Large form fields
- ✅ Multi-column layouts

### Mobile (<768px)
- ✅ Sidebar hidden
- ✅ Sticky bottom progress bar
- ✅ Single-column stacked layout
- ✅ Touch-friendly buttons

---

## 🐛 Common Migration Issues

### Issue: "Cannot find module '@/components/forms'"

**Fix**: Ensure the new form components are in `frontend/src/components/forms/`.

### Issue: "useAuth is not defined"

**Fix**: Create `frontend/src/lib/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
```

### Issue: Styles not applying

**Fix**: Import fonts in `app/layout.tsx`:

```tsx
import { Anton, Merriweather } from 'next/font/google';

const anton = Anton({ subsets: ['latin'], weight: ['400'] });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700'] });
```

---

## 🎯 Migration Steps Summary

1. ✅ Install new dependencies (`react-hook-form`, `zod`, `framer-motion`, `lucide-react`)
2. ✅ Copy all form components to `/components/forms/`
3. ✅ Create `useAuth` hook in `/lib/hooks/`
4. ✅ Create `resume-storage.ts` in `/lib/`
5. ✅ Update page to use `HVACResumeBuilder`
6. ✅ Test all 8 form steps
7. ✅ Implement `/api/exportResume` endpoint
8. ✅ Deploy and celebrate! 🎉

---

## 📚 Additional Resources

- **Full Documentation**: `HVAC_FORM_SYSTEM_README.md`
- **Component Flow**: `HVAC_FORM_FLOW_DIAGRAMS.md`
- **Quick Reference**: `HVAC_FORM_QUICK_REFERENCE.md`

---

**Migration complete! You now have a production-ready AI-powered resume builder.** 🚀
