# HVAC Resume Builder - Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RESUME BUILDER PAGE                              │
│                      /app/resume-builder/page.tsx                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MULTI-STEP FORM                                  │
│                  (Main Controller Component)                             │
│                                                                           │
│  Features:                                                                │
│  • Form state management (react-hook-form)                               │
│  • Validation (Zod resolver)                                             │
│  • Auto-save (debounced 1.5s)                                            │
│  • Step navigation (8 steps)                                             │
│  • Export handlers (PDF/DOCX)                                            │
└─────────────────────────────────────────────────────────────────────────┘
                     │                              │
        ┌────────────┴─────────┐         ┌─────────┴──────────┐
        ▼                      ▼         ▼                    ▼
┌──────────────┐      ┌──────────────────────┐      ┌──────────────┐
│   SIDEBAR    │      │   STEP COMPONENTS    │      │ MOBILE BAR   │
│  (Desktop)   │      │                      │      │  (Mobile)    │
└──────────────┘      └──────────────────────┘      └──────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐   ┌─────────────┐
    │   STEP 1    │    │   STEP 2    │   │   STEP 3    │
    │   Header    │    │   Summary   │   │    Certs    │
    │             │    │             │    │             │
    │  • Name     │    │  • Summary  │   │  • Cert 1   │
    │  • Email    │    │  • AI Gen   │   │  • Cert 2   │
    │  • Phone    │    │             │    │  • ...max 6 │
    │  • Location │    │             │    │             │
    └─────────────┘    └─────────────┘   └─────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐   ┌─────────────┐
    │   STEP 4    │    │   STEP 5    │   │   STEP 6    │
    │   Skills    │    │ Experience  │   │  Education  │
    │             │    │             │    │             │
    │  • Chip UI  │    │  • Job 1    │   │  • School 1 │
    │  • Max 8    │    │  • Job 2    │   │  • School 2 │
    │  • Categories│   │  • AI Achievs│  │  • GPA opt  │
    └─────────────┘    └─────────────┘   └─────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
    ┌─────────────┐                      ┌─────────────┐
    │   STEP 7    │                      │   STEP 8    │
    │ References  │                      │   Review    │
    │             │                      │             │
    │  • Optional │                      │  • Progress │
    │  • Quick    │                      │  • Summary  │
    │    Fill     │                      │  • Export   │
    └─────────────┘                      └─────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER INTERACTIONS                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌──────────┐    ┌──────────┐    ┌──────────┐
            │   Type   │    │  Click   │    │   Blur   │
            │  in form │    │   AI     │    │  field   │
            └──────────┘    │  button  │    └──────────┘
                    │       └──────────┘            │
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
            ┌──────────────────────────────────────────┐
            │      REACT-HOOK-FORM (State Manager)     │
            │                                          │
            │  • Tracks all field values               │
            │  • Triggers validation on blur           │
            │  • Provides setValue/watch methods       │
            └──────────────────────────────────────────┘
                    │               │               │
        ┌───────────┼───────────────┼───────────────┼───────────┐
        ▼           ▼               ▼               ▼           ▼
┌──────────┐ ┌──────────┐   ┌──────────┐   ┌──────────┐ ┌──────────┐
│   ZOD    │ │  AUTO-   │   │    AI    │   │  REVIEW  │ │  EXPORT  │
│VALIDATOR │ │   SAVE   │   │  CALLS   │   │  SECTION │ │  HANDLER │
│          │ │          │   │          │   │          │ │          │
│ • Schema │ │ • Debounce│  │ • Gemini │   │ • Calcul-│ │ • PDF    │
│ • Errors │ │ • Firestore│ │ • Prompts│   │   ate %  │ │ • DOCX   │
└──────────┘ └──────────┘   └──────────┘   └──────────┘ └──────────┘
                    │               │
                    ▼               ▼
            ┌──────────┐    ┌──────────┐
            │ FIRESTORE│    │ GEMINI   │
            │  resumes/│    │   API    │
            │  {userId}│    │          │
            └──────────┘    └──────────┘
```

---

## Step Component Breakdown

### Step 1: Header Section
```
┌─────────────────────────────────────┐
│  CONTACT INFORMATION                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Name] *                    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ [Email] *                   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ [Phone] *                   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ [Location] *                │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ [Trade Title]               │   │
│  └─────────────────────────────┘   │
│                                     │
│           [Next →]                  │
└─────────────────────────────────────┘
```

### Step 2: Summary Section
```
┌─────────────────────────────────────┐
│  PROFESSIONAL SUMMARY               │
│                              [AI ✨] │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  (Textarea - 500 chars)     │   │
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                         123 / 500   │
│                                     │
│  [← Back]              [Next →]    │
└─────────────────────────────────────┘
```

### Step 4: Skills Section (Chip UI)
```
┌─────────────────────────────────────┐
│  CORE SKILLS                        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [HVAC Install ×]           │   │
│  │  [Diagnostics ×]            │   │
│  │  [EPA 608 ×] [OSHA 10 ×]   │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│           [+ Add Skill]             │
│                                     │
│  📋 Show Skill Suggestions          │
│  ┌─────────────────────────────┐   │
│  │ [Technical] [Safety] [Soft] │   │
│  │                             │   │
│  │ [Installation] [Repair]     │   │
│  │ [Maintenance] [Electrical]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [← Back]              [Next →]    │
└─────────────────────────────────────┘
```

### Step 5: Experience Section
```
┌─────────────────────────────────────┐
│  WORK EXPERIENCE                    │
│                                     │
│  ┌─ Position 1 ──────────────[×]┐  │
│  │ [Company] *    [Role] *       │  │
│  │ [Start Date] * [End Date]     │  │
│  │                               │  │
│  │ Achievements:          [AI ✨] │  │
│  │ • [Achievement 1]        [×]  │  │
│  │ • [Achievement 2]        [×]  │  │
│  │        [+ Add Achievement]    │  │
│  └───────────────────────────────┘  │
│                                     │
│        [+ Add Work Experience]      │
│                                     │
│  [← Back]              [Next →]    │
└─────────────────────────────────────┘
```

### Step 8: Review Section
```
┌─────────────────────────────────────┐
│  REVIEW YOUR RESUME                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ████████████░░░░ 75%       │   │
│  │  6 of 8 sections complete   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ✓ Header        ✓ Summary          │
│  ✓ Certifications ✓ Skills          │
│  ✓ Experience    ✓ Education        │
│  ○ References    ○ ...              │
│                                     │
│  ┌─ Resume Summary ──────────┐     │
│  │ John Smith                 │     │
│  │ HVAC Technician            │     │
│  │ 3 Certs, 6 Skills          │     │
│  │ 2 Positions                │     │
│  └────────────────────────────┘     │
│                                     │
│  [← Back]  [PDF ⬇] [DOCX ⬇]        │
└─────────────────────────────────────┘
```

---

## AI Integration Flow

```
User Clicks "AI Generate" Button
         │
         ▼
┌────────────────────────┐
│  Build Context Object  │
│  (name, certs, role)   │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│   Select AI Prompt     │
│  (summary/achievement) │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│   POST /api/editResume │
│   {                    │
│     prompt: "...",     │
│     resumeContent: ""  │
│   }                    │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│   Gemini API Call      │
│   (Backend)            │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│   Response Received    │
│   { success, message } │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│  setValue() to update  │
│  form field            │
└────────────────────────┘
         │
         ▼
    User sees result
    in text field
```

---

## Auto-Save Flow

```
User types in form field
         │
         ▼
┌────────────────────────┐
│  watch() detects       │
│  value change          │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│  Start 1.5s timer      │
│  (debounce)            │
└────────────────────────┘
         │
         ▼
     User stops typing?
         │
    ┌────┴────┐
    │  Yes    │  No → cancel timer
    └─────────┘
         │
         ▼
┌────────────────────────┐
│  Show "Saving..."      │
│  indicator             │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│  saveResumeProgress()  │
│  Firestore write       │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│  Hide "Saving..."      │
│  Data persisted ✓      │
└────────────────────────┘
```

---

## Export Flow

```
User clicks [PDF ⬇] button
         │
         ▼
┌────────────────────────┐
│  Get current form data │
│  watch()               │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│ POST /api/exportResume │
│ {                      │
│   format: "pdf",       │
│   resumeData: {...}    │
│ }                      │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│  Backend generates     │
│  PDF file              │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│  Response: Blob        │
│  (binary PDF data)     │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│  Create download link  │
│  trigger download      │
└────────────────────────┘
         │
         ▼
    User receives file:
    "john-smith-hvac-resume.pdf"
```

---

## Validation Flow

```
User leaves a field (blur event)
         │
         ▼
┌────────────────────────┐
│  Zod schema runs       │
│  validation rules      │
└────────────────────────┘
         │
    ┌────┴────┐
    │ Valid?  │
    ├─────────┤
    │  Yes    │  No
    └─────────┘
         │         │
         ▼         ▼
    No error   ┌──────────────────┐
    message    │ Show error       │
               │ "Email invalid"  │
               └──────────────────┘
                       │
                       ▼
               Field border turns red
               Error text appears below
```

---

**These diagrams show the complete component hierarchy and data flow for the HVAC Resume Builder system.**
