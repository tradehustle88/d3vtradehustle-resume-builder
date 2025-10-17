# 🎨 Trade Resume Generator - Template Page Wireframe

**Page:** `/generate-resume` or `/resume/create`  
**Purpose:** Interactive form for users to select a trade and generate an AI-powered resume

---

## 📐 Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER                                  │
│  [Logo]  Resume Builder    [Dashboard] [Profile] [Sign Out]    │
└─────────────────────────────────────────────────────────────────┘
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    HERO SECTION                           │ │
│  │                                                           │ │
│  │         🔧 Build Your Professional Resume                 │ │
│  │         ATS-Optimized • AI-Powered • 1-Page              │ │
│  │                                                           │ │
│  │         [Select Your Trade ▼]  [Get Started →]           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────┬─────────────────────────────────┐ │
│  │   SIDEBAR (Step Nav)    │    MAIN CONTENT AREA            │ │
│  │                         │                                 │ │
│  │  ◉ 1. Select Trade      │  ┌─────────────────────────┐   │ │
│  │  ○ 2. Your Info         │  │   STEP 1: SELECT TRADE  │   │ │
│  │  ○ 3. Customize         │  │                         │   │ │
│  │  ○ 4. Generate          │  │   [Trade Cards Grid]    │   │ │
│  │  ○ 5. Download          │  │                         │   │ │
│  │                         │  └─────────────────────────┘   │ │
│  │  ┌─────────────────┐   │                                 │ │
│  │  │  PROGRESS BAR   │   │  [Continue Button]              │ │
│  │  │  ████░░░░░ 20%  │   │                                 │ │
│  │  └─────────────────┘   │                                 │ │
│  │                         │                                 │ │
│  └─────────────────────────┴─────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    FOOTER                                 │ │
│  │  © 2025 Trade Hustle | Privacy | Terms | Help            │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Step-by-Step Flow

### **STEP 1: Select Your Trade**

```
┌─────────────────────────────────────────────────────────────────┐
│                   📋 Select Your Trade                          │
│                                                                 │
│  Choose the skilled trade that matches your experience:        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   🌡️ HVAC    │  │   ⚡ ELECTRIC │  │   🔧 PLUMBER │         │
│  │              │  │              │  │              │         │
│  │  HVAC        │  │  Electrician │  │  Plumber     │         │
│  │  Technician  │  │              │  │              │         │
│  │              │  │              │  │              │         │
│  │  ✓ 3 Certs   │  │  ✓ 3 Certs   │  │  ✓ 2 Certs   │         │
│  │  ✓ 6 Skills  │  │  ✓ 4 Skills  │  │  ✓ 3 Skills  │         │
│  │              │  │              │  │              │         │
│  │  [Select]    │  │  [Select]    │  │  [Select]    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  🔨 CARPENTER│  │  🏗️ WELDER   │  │  🎨 PAINTER   │         │
│  │              │  │              │  │              │         │
│  │  Coming Soon │  │  Coming Soon │  │  Coming Soon │         │
│  │              │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│                         [Continue →]                           │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- Trade card grid (3-column responsive)
- Each card shows: Icon, Title, Cert count, Skills count
- Hover effect: Card lifts, border highlights
- Selected state: Gold border, checkmark overlay
- "Coming Soon" badge for unavailable trades

---

### **STEP 2: Your Information**

```
┌─────────────────────────────────────────────────────────────────┐
│              👤 Tell Us About Yourself                          │
│                                                                 │
│  Selected Trade: ⚡ ELECTRICIAN                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  PERSONAL DETAILS                                               │
│  ┌─────────────────────────────────────────────────┐           │
│  │ Full Name *                                     │           │
│  │ [John Doe                                    ]  │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
│  ┌─────────────────────────┐  ┌──────────────────────────┐    │
│  │ Email Address *         │  │ Phone Number *           │    │
│  │ [john@example.com     ] │  │ [(555) 123-4567        ] │    │
│  └─────────────────────────┘  └──────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────┐  ┌──────────────────────────┐    │
│  │ City, State *           │  │ Years of Experience *    │    │
│  │ [Chicago, IL          ] │  │ [5                     ] │    │
│  └─────────────────────────┘  └──────────────────────────┘    │
│                                                                 │
│  CURRENT POSITION (Optional)                                    │
│  ┌─────────────────────────────────────────────────┐           │
│  │ Current Employer                                │           │
│  │ [ABC Electric Company                        ]  │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
│  ┌─────────────────────────┐  ┌──────────────────────────┐    │
│  │ Start Date              │  │ ☑ Currently Working Here │    │
│  │ [01/2019              ] │  │                          │    │
│  └─────────────────────────┘  └──────────────────────────┘    │
│                                                                 │
│  [← Back]                               [Continue →]           │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Form validation (required fields marked with *)
- Phone number auto-formatting
- Date picker for start date
- "Currently working here" checkbox
- Real-time validation feedback
- Save progress to local storage

---

### **STEP 3: Customize Your Resume**

```
┌─────────────────────────────────────────────────────────────────┐
│           ✨ Customize & Add Details (Optional)                │
│                                                                 │
│  AI will generate professional content, but you can guide it:  │
│                                                                 │
│  SPECIAL INSTRUCTIONS                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Tell AI what to emphasize (e.g., "Focus on commercial │   │
│  │ electrical work" or "Highlight safety certifications") │   │
│  │                                                         │   │
│  │ [________________________________________________     ] │   │
│  │ [________________________________________________     ] │   │
│  │ [________________________________________________     ] │   │
│  │                                                         │   │
│  │ Character count: 0 / 500                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  RESUME PREFERENCES                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────┐    │
│  │ ☑ Include Summary       │  │ ☑ Include Certifications │    │
│  │ ☑ Include Skills        │  │ ☑ Include Experience     │    │
│  └─────────────────────────┘  └──────────────────────────┘    │
│                                                                 │
│  CERTIFICATIONS (from your trade)                               │
│  ☑ Journeyman Electrician License                              │
│  ☑ OSHA 10-Hour Safety Training                                │
│  ☑ NFPA 70E Arc Flash Training                                 │
│  ☐ Add Custom Certification [+]                                │
│                                                                 │
│  SKILLS (Select up to 6)                                        │
│  ☑ Electrical Panel Installation                               │
│  ☑ Circuit Design & Troubleshooting                            │
│  ☑ Conduit Bending & Installation                              │
│  ☑ Blueprint & Schematic Reading                               │
│  ☑ NEC Code Compliance                                         │
│  ☑ Safety & LOTO Procedures                                    │
│                                                                 │
│  [← Back]          [Skip & Use Defaults]      [Continue →]     │
└─────────────────────────────────────────────────────────────────┘
```

**Interactive Elements:**
- Textarea with character counter
- Checkbox toggles for sections
- Multi-select for certifications/skills
- "Add Custom" button for additional items
- Preview tooltip on hover

---

### **STEP 4: Generate Resume**

```
┌─────────────────────────────────────────────────────────────────┐
│              🤖 Generating Your Resume...                       │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │              [Animated AI Brain Icon]                     │ │
│  │                                                           │ │
│  │          AI is crafting your professional resume          │ │
│  │                                                           │ │
│  │  ████████████████████████████░░░░ 75%                    │ │
│  │                                                           │ │
│  │  ✓ Analyzing trade requirements                          │ │
│  │  ✓ Optimizing for ATS systems                            │ │
│  │  ⏳ Generating compelling content...                     │ │
│  │  ○ Validating format                                     │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  This usually takes 3-5 seconds...                             │
└─────────────────────────────────────────────────────────────────┘
```

**Animation States:**
1. Loading spinner with pulsing AI icon
2. Progress bar (animated)
3. Checkmarks appear as steps complete
4. Success animation when done

---

### **STEP 5: Preview & Download**

```
┌─────────────────────────────────────────────────────────────────┐
│              ✅ Your Resume is Ready!                           │
│                                                                 │
│  ┌──────────────────┐  ┌────────────────────────────────────┐  │
│  │  PREVIEW PANE    │  │  DETAILS & ACTIONS                │  │
│  │  ┌────────────┐  │  │                                   │  │
│  │  │  John Doe  │  │  │  Quality Score: ⭐⭐⭐⭐⭐ (98%)  │  │
│  │  │  Electrician│ │  │                                   │  │
│  │  │            │  │  │  ✓ ATS-Optimized                  │  │
│  │  │ Summary    │  │  │  ✓ One-Page Format                │  │
│  │  │ Licensed...│  │  │  ✓ 450 words (Optimal)            │  │
│  │  │            │  │  │  ✓ All sections included          │  │
│  │  │ Skills     │  │  │                                   │  │
│  │  │ • Panel... │  │  │  Model: Gemini 2.5 Flash          │  │
│  │  │ • Circuit..│  │  │  Generated: Just now              │  │
│  │  │            │  │  │                                   │  │
│  │  │ Experience │  │  │  ┌──────────────────────────┐    │  │
│  │  │ Journeyman │  │  │  │  [📥 Download PDF]       │    │  │
│  │  │ Electrician│  │  │  └──────────────────────────┘    │  │
│  │  │ • Install..│  │  │  ┌──────────────────────────┐    │  │
│  │  │            │  │  │  │  [📄 Download DOCX]      │    │  │
│  │  │ Certs      │  │  │  └──────────────────────────┘    │  │
│  │  │ • Journey..│  │  │                                   │  │
│  │  └────────────┘  │  │  [✏️ Edit Content]  [🔄 Regenerate]│ │
│  │                  │  │                                   │  │
│  │  [Zoom: 100%]    │  │  [💾 Save to Dashboard]           │  │
│  └──────────────────┘  └────────────────────────────────────┘  │
│                                                                 │
│  ⚠️ TIP: Download both formats! PDF for online applications,  │
│     DOCX for email submissions and custom edits.               │
│                                                                 │
│  [← Start New Resume]              [Share] [Print]             │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Live preview (PDF-like rendering)
- Zoom controls (75%, 100%, 125%)
- Quality score with breakdown
- Multiple download formats
- Edit/Regenerate options
- Save to user dashboard
- Share link generation

---

## 🎨 Component Breakdown

### **TradeCard Component**
```tsx
<TradeCard
  icon="⚡"
  title="Electrician"
  certCount={3}
  skillCount={4}
  available={true}
  selected={false}
  onClick={() => setSelectedTrade('ELECTRICIAN')}
/>
```

### **ProgressSidebar Component**
```tsx
<ProgressSidebar
  currentStep={2}
  steps={[
    { id: 1, label: 'Select Trade', complete: true },
    { id: 2, label: 'Your Info', complete: false },
    { id: 3, label: 'Customize', complete: false },
    { id: 4, label: 'Generate', complete: false },
    { id: 5, label: 'Download', complete: false }
  ]}
  progress={40}
/>
```

### **ResumePreview Component**
```tsx
<ResumePreview
  content={resumeContent}
  zoom={100}
  highlightATS={true}
  onEdit={() => setEditMode(true)}
/>
```

---

## 📱 Responsive Design

### **Desktop (1024px+)**
- Two-column layout (sidebar + main)
- Full-width preview
- Side-by-side form fields

### **Tablet (768px - 1023px)**
- Collapsible sidebar (hamburger menu)
- Stacked preview/details
- Two-column form fields

### **Mobile (< 768px)**
- Single column
- Sticky header with step indicator
- Bottom action bar
- Swipeable preview
- Accordion sections

---

## 🎨 Design System

### **Colors (Hustle Theme)**
```css
--primary: #001a33;      /* Navy blue */
--accent: #ffd700;       /* Gold */
--danger: #8b0000;       /* Dark red */
--success: #00a86b;      /* Jade green */
--text: #f5f5f5;         /* Off-white */
--bg-dark: #0a0a0a;      /* Near black */
--bg-medium: #1a1a1a;    /* Dark grey */
```

### **Typography**
- Headers: Anton (bold, uppercase)
- Body: Merriweather (readable, professional)
- Monospace: Courier New (code/data)

### **Button Styles**
```css
.btn-hustle-primary {
  background: linear-gradient(135deg, #ffd700, #ffa500);
  color: #001a33;
  text-transform: uppercase;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.btn-hustle-secondary {
  border: 2px solid #ffd700;
  background: transparent;
  color: #ffd700;
}
```

---

## 🔧 Interactive States

### **Loading States**
- Skeleton loaders for trade cards
- Pulsing animation during AI generation
- Disabled form fields while processing

### **Error States**
- Inline validation errors (red text, shake animation)
- Toast notifications for API errors
- Retry button for failed generations

### **Success States**
- Confetti animation on completion
- Green checkmarks for completed steps
- Success toast with download CTA

---

## 📊 Data Flow

```
User Input → Form Validation → API Call → AI Processing → 
Response Parsing → Preview Render → Download Options
```

**State Management:**
```typescript
interface ResumeGeneratorState {
  currentStep: number;
  selectedTrade: TradeKey | null;
  userData: ResumeUserData;
  customPrompt: string;
  selectedCerts: string[];
  selectedSkills: string[];
  generatedResume: TradeResumeResponse | null;
  isLoading: boolean;
  error: string | null;
}
```

---

## 🚀 File Structure

```
frontend/src/app/generate-resume/
├── page.tsx                    # Main page component
├── components/
│   ├── TradeSelector.tsx       # Step 1: Trade cards grid
│   ├── UserInfoForm.tsx        # Step 2: Personal info
│   ├── CustomizeForm.tsx       # Step 3: Preferences
│   ├── GeneratingLoader.tsx    # Step 4: Loading animation
│   ├── ResumePreview.tsx       # Step 5: Preview & download
│   ├── ProgressSidebar.tsx     # Sidebar navigation
│   └── StepIndicator.tsx       # Mobile step indicator
├── hooks/
│   ├── useResumeGenerator.ts   # Main state management
│   ├── useFormValidation.ts    # Form validation logic
│   └── useDownload.ts          # PDF/DOCX download handlers
└── styles/
    └── resume-generator.css    # Component-specific styles
```

---

## 🎯 Key User Flows

### **Happy Path**
1. User lands on page
2. Selects trade (e.g., HVAC)
3. Fills in personal info
4. (Optional) Customizes content
5. Clicks "Generate"
6. AI processes (3-5s)
7. Preview appears
8. Downloads PDF
9. Saves to dashboard

### **Edit & Regenerate**
1. User views generated resume
2. Clicks "Edit Content"
3. Modifies custom prompt
4. Clicks "Regenerate"
5. New version created
6. Side-by-side comparison
7. Selects preferred version

### **Error Recovery**
1. API call fails
2. Error toast appears
3. User clicks "Retry"
4. Request retried with exponential backoff
5. Success or persistent error message

---

## 📋 Accessibility (WCAG 2.1 AA)

✅ Keyboard navigation (Tab, Enter, Esc)  
✅ Screen reader labels (ARIA attributes)  
✅ Color contrast ratio > 4.5:1  
✅ Focus indicators on all interactive elements  
✅ Skip to content link  
✅ Form error announcements  
✅ Loading state announcements  

---

## 🧪 Testing Checklist

- [ ] All trade cards clickable
- [ ] Form validation works (email, phone, required fields)
- [ ] API integration functional
- [ ] Preview renders correctly
- [ ] PDF download works
- [ ] DOCX download works
- [ ] Responsive on mobile/tablet/desktop
- [ ] Loading states display properly
- [ ] Error handling graceful
- [ ] Progress saves to localStorage
- [ ] Back button preserves data

---

**This wireframe provides the complete blueprint for building the Trade Resume Generator UI! 🎨**

Ready to implement? I can generate the React/Next.js components next!
