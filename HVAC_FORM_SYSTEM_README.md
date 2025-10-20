# HVAC Resume Builder - Multi-Step Form System

## 🎯 Overview

A complete AI-powered resume builder with 8 progressive steps, real-time validation, auto-save, and AI content generation. Built with React, Next.js, react-hook-form, Zod, and Framer Motion.

---

## 📁 File Structure

```
frontend/src/components/forms/
├── schema.ts                    # Zod validation schema + types
├── ai-prompts.ts                # AI prompt templates & tooltips
├── ProgressSidebar.tsx          # Desktop sidebar + mobile progress bar
├── HeaderSection.tsx            # Step 1: Contact info
├── SummarySection.tsx           # Step 2: Professional summary (AI-powered)
├── CertificationsSection.tsx    # Step 3: Certifications (max 6)
├── SkillsSection.tsx            # Step 4: Skills (max 8, chip-based)
├── ExperienceSection.tsx        # Step 5: Work history (AI achievements)
├── EducationSection.tsx         # Step 6: Education & training
├── ReferencesSection.tsx        # Step 7: References (optional)
├── ReviewSection.tsx            # Step 8: Review & export
├── ResumePreview.tsx            # Live preview component
├── MultiStepForm.tsx            # Main form controller
└── index.ts                     # Public exports

frontend/src/lib/
├── resume-storage.ts            # Firestore auto-save utilities
└── hooks/
    └── useAuth.ts               # Firebase auth hook
```

---

## 🚀 Quick Start

### 1. Import the Form

```tsx
// In your page component
import { MultiStepForm } from '@/components/forms';

export default function ResumeBuilderPage() {
  return (
    <div className="min-h-screen bg-hustle-navy">
      <MultiStepForm />
    </div>
  );
}
```

### 2. Required Dependencies

Make sure these are installed:

```bash
npm install react-hook-form @hookform/resolvers zod framer-motion lucide-react
```

### 3. Environment Setup

Ensure Firebase is configured in `frontend/src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## 🎨 Features

### ✅ Multi-Step Navigation
- 8 progressive steps with visual progress tracking
- Desktop: Vertical sidebar with clickable step navigation
- Mobile: Sticky bottom progress bar
- Smooth transitions between steps (Framer Motion)

### ✅ Form Validation
- Real-time validation with Zod
- Field-level error messages
- Visual feedback on invalid fields
- Prevents navigation with incomplete required fields

### ✅ AI Content Generation
- **Summary**: Generates professional summaries based on name, title, and certs
- **Achievements**: Creates measurable bullet points for work experience
- **Skills**: Suggests relevant technical skills
- Integrates with `/api/editResume` endpoint

### ✅ Auto-Save
- Debounced auto-save (1.5s delay)
- Saves to Firestore under `resumes/{userId}`
- Loads saved progress on mount
- Visual "Saving..." indicator

### ✅ Smart UI Components
- **Certifications**: Add up to 6, with common HVAC cert suggestions
- **Skills**: Chip-based interface (max 8), categorized by technical/safety/soft
- **Experience**: Dynamic achievement lists, date pickers, AI generation
- **Education**: Optional GPA field (only show if 3.0+)
- **References**: Quick-fill buttons ("Available upon request")

### ✅ Review & Export
- Live completion percentage
- Section-by-section checklist
- Visual resume summary
- Export to PDF or DOCX (calls `/api/exportResume`)

---

## 📝 Form Schema

All validation rules are defined in `schema.ts`:

```typescript
const resumeSchema = z.object({
  // Header (required)
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  location: z.string().min(2).max(100),
  tradeTitle: z.string().default("HVAC Technician"),
  
  // Summary
  summary: z.string().max(500).default(''),
  
  // Certifications (max 6)
  certifications: z.array(z.object({
    name: z.string().min(1),
    issuer: z.string().optional(),
    year: z.number().int().min(1950).max(2100).optional(),
  })).max(6),
  
  // Skills (max 8)
  skills: z.array(z.object({
    name: z.string().min(1),
    category: z.enum(['technical', 'safety', 'soft']).optional(),
  })).max(8),
  
  // Experience (unlimited)
  experience: z.array(z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    startDate: z.string().min(1),
    endDate: z.string().optional(),
    location: z.string().optional(),
    achievements: z.array(z.string()).max(5),
  })),
  
  // Education (unlimited)
  education: z.array(z.object({
    school: z.string().min(1),
    degree: z.string().optional(),
    field: z.string().optional(),
    year: z.number().optional(),
    gpa: z.string().optional(),
  })),
  
  // References
  references: z.string().max(300).default(''),
});
```

---

## 🤖 AI Integration

### Prompt Templates

Defined in `ai-prompts.ts`:

```typescript
AI_PROMPTS.summary({
  name: "John Smith",
  tradeTitle: "HVAC Technician",
  certifications: ["EPA 608", "NATE"]
})
// → Returns prompt for generating 3-sentence summary

AI_PROMPTS.achievement({
  role: "HVAC Technician",
  company: "Cool Air HVAC",
  startDate: "2020-01",
  endDate: "Present"
})
// → Returns prompt for 3 measurable achievements
```

### API Call Pattern

```typescript
const handleAIGenerate = async () => {
  const response = await fetch('/api/editResume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: AI_PROMPTS.summary({ /* context */ }),
      resumeContent: currentValue,
    }),
  });

  const data = await response.json();
  if (data.success) {
    setValue('summary', data.message);
  }
};
```

---

## 💾 Auto-Save System

### How It Works

```typescript
useEffect(() => {
  if (!user) return;

  const subscription = watch((data) => {
    const timer = setTimeout(async () => {
      await saveResumeProgress(user.uid, data);
    }, 1500); // Debounce 1.5 seconds

    return () => clearTimeout(timer);
  });

  return () => subscription.unsubscribe();
}, [watch, user]);
```

### Firestore Structure

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

## 🎨 Styling

Uses Tailwind with custom Hustle theme:

```css
/* Custom classes used throughout */
.btn-hustle          /* Primary button (gold bg) */
.btn-hustle-secondary /* Secondary button (gold outline) */
.hero-title          /* Anton font for headings */
.font-merriweather   /* Body text */

/* Colors */
bg-hustle-navy       /* #001a33 */
bg-hustle-navy-dark  /* Darker navy variant */
text-hustle-gold     /* #ffd700 */
border-hustle-gold   /* Gold borders */
```

---

## 📱 Responsive Design

### Desktop (≥768px)
- Sidebar navigation on left
- Large form fields
- Multi-column layouts for certs/skills

### Mobile (<768px)
- Sidebar hidden
- Sticky bottom progress bar
- Single-column stacked layout
- Touch-friendly buttons

---

## ♿ Accessibility

All components follow WCAG 2.1 guidelines:

- ✅ Semantic HTML (`<label>`, `<input>`, `<button>`)
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ High contrast ratios (gold on navy)
- ✅ Error announcements
- ✅ Focus indicators

---

## 🧪 Testing Checklist

### Required Tests
- [ ] Form validation (Zod schema)
- [ ] Step navigation (next/prev/jump)
- [ ] AI generation endpoints
- [ ] Auto-save functionality
- [ ] Export (PDF/DOCX)
- [ ] Mobile responsiveness
- [ ] Accessibility (screen reader)

### Manual Testing Flow
1. Fill out all 8 sections
2. Trigger AI generation for summary + achievements
3. Verify auto-save indicator appears
4. Refresh page → data should persist
5. Complete to review section
6. Export to PDF and DOCX

---

## 🛠️ Customization

### Add a New Section

1. Create component in `components/forms/NewSection.tsx`
2. Add to `STEPS` array in `MultiStepForm.tsx`:

```typescript
const STEPS = [
  // ... existing steps
  { id: 9, label: 'New Section', component: NewSection },
];
```

3. Update schema if new fields needed

### Modify AI Prompts

Edit `ai-prompts.ts`:

```typescript
export const AI_PROMPTS = {
  customField: (context: { /* your context */ }) => `
    Your custom prompt here...
  `,
};
```

### Change Colors

Update Tailwind config or use custom classes:

```tsx
className="bg-your-color text-your-text border-your-border"
```

---

## 🐛 Common Issues

### "Cannot find module '@/lib/hooks/useAuth'"
**Fix**: Ensure `useAuth.ts` exists at `frontend/src/lib/hooks/useAuth.ts`

### "Auto-save not working"
**Fix**: Check Firebase config + user authentication status

### "AI generation failing"
**Fix**: Verify `GOOGLE_API_KEY` is set in Firebase Functions environment

### "Export buttons not working"
**Fix**: Implement `/api/exportResume` endpoint (see Backend section)

---

## 📚 Next Steps

### Backend Implementation

Create `/api/exportResume` endpoint:

```typescript
// api-functions/index.js
app.post('/api/exportResume', verifyUser, async (req, res) => {
  const { format, resumeData } = req.body;
  
  if (format === 'pdf') {
    // Generate PDF with puppeteer or similar
  } else if (format === 'docx') {
    // Generate DOCX with docxtemplater
  }
  
  res.setHeader('Content-Type', `application/${format}`);
  res.send(buffer);
});
```

### Analytics Tracking

Add events for user actions:

```typescript
import { trackCustomEvent } from '@/lib/analytics';

trackCustomEvent('resume_section_completed', { section: 'header' });
trackCustomEvent('ai_generation_used', { field: 'summary' });
trackCustomEvent('resume_exported', { format: 'pdf' });
```

---

## 📄 License

Part of the Trade Hustle Resume Builder project.

---

## 🤝 Contributing

When adding new features:
1. Follow existing naming conventions
2. Add proper TypeScript types
3. Include accessibility attributes
4. Test on mobile + desktop
5. Update this README

---

**Built with hustle. Powered by AI. 🔥**
