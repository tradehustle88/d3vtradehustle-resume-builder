# 🚀 Trade Resume Engine - Quick Start

**Generate ATS-optimized, trade-specific resumes in 3 steps**

---

## 📋 What You Get

✅ **40+ Trades Supported** - HVAC, Electrician, Plumber, and more  
✅ **AI-Powered Content** - Gemini 2.5 generates professional resume text  
✅ **ATS-Optimized** - One-page, keyword-rich, properly formatted  
✅ **Zero Code Changes** - Add new trades by editing JSON only  

---

## 🎯 The 3-Layer System

```
Template (layout) + Trade Data (JSON) + AI (Gemini) = Complete Resume
```

**Template** = Base structure with `[PLACEHOLDERS]`  
**Trade Data** = `trades_data.json` (certifications, skills, titles)  
**AI** = Fills placeholders with compelling content  

---

## ⚡ Quick Start (Frontend)

### Step 1: Import the API

```typescript
import { generateTradeResume } from '@/lib/api';
import { getAuth } from 'firebase/auth';
```

### Step 2: Call the API

```typescript
const user = getAuth().currentUser;
const idToken = await user.getIdToken();

const result = await generateTradeResume(
  idToken,
  'HVAC',  // Trade key
  {
    name: 'John Doe',
    yearsExperience: 5,
    location: 'Chicago, IL'
  }
);
```

### Step 3: Use the Result

```typescript
console.log(result.placeholders);
// {
//   SUMMARY_SENTENCE_1: "Certified HVAC technician...",
//   SKILL_1: "System Diagnostics & Troubleshooting",
//   CERT_1: "EPA 608 Universal Certification",
//   ...
// }

// Validation info
console.log(result.validation.wordCount); // 450
console.log(result.validation.valid); // true
```

---

## 🔧 Quick Start (Backend Testing)

### Test the Resume Engine Directly

```bash
cd api-functions
node -e "
const {getTradeData, getAvailableTrades} = require('./resumeEngine');
console.log('Available trades:', getAvailableTrades());
console.log('HVAC data:', getTradeData('HVAC'));
"
```

### Test the API Endpoint

```bash
# Set your Firebase ID token
export ID_TOKEN="your-firebase-id-token"

# Generate HVAC resume
curl -X POST "https://app-fbs5jy4frq-uc.a.run.app/api/generateTradeResume" \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tradeKey": "HVAC",
    "userData": {
      "name": "Test User",
      "yearsExperience": 3
    }
  }'
```

---

## 📊 Available Trades (Current)

| Trade Key    | Title              | Certifications Count |
|--------------|--------------------|----------------------|
| HVAC         | HVAC Technician    | 3                    |
| ELECTRICIAN  | Electrician        | 3                    |
| PLUMBER      | Plumber            | 2                    |

**Add more trades by editing `trades_data.json`** - no code changes needed!

---

## 🎨 Customization Examples

### Basic Generation
```typescript
generateTradeResume(idToken, 'HVAC', { name: 'John' })
```

### With Experience Details
```typescript
generateTradeResume(idToken, 'ELECTRICIAN', {
  name: 'Jane Smith',
  yearsExperience: 7,
  location: 'New York, NY',
  currentCompany: 'ABC Electric Co.',
  currentJobDates: '2018 - Present'
})
```

### With Custom Instructions
```typescript
generateTradeResume(
  idToken,
  'PLUMBER',
  { name: 'Mike Johnson', yearsExperience: 10 },
  'Focus on commercial plumbing and large-scale projects'
)
```

---

## 🔍 Understanding the Response

```typescript
{
  success: true,
  tradeKey: "HVAC",
  tradeTitle: "HVAC Technician",
  
  // AI-generated placeholder content
  placeholders: {
    SUMMARY_SENTENCE_1: "...",
    SUMMARY_SENTENCE_2: "...",
    SKILL_1: "...",
    SKILL_2: "...",
    // ... 17 total placeholders
  },
  
  // Trade-specific data from JSON
  tradeData: {
    certifications: ["EPA 608 Universal", "OSHA 10", "..."],
    skills: ["System Diagnostics", "..."]
  },
  
  // Quality validation
  validation: {
    valid: true,
    warnings: [],
    wordCount: 450,
    hasUnfilledPlaceholders: false
  },
  
  // AI metadata
  metadata: {
    model: "gemini-2.5-flash-preview-09-2025",
    provider: "vertex-ai",
    promptMetadata: { ... }
  }
}
```

---

## 🚀 Adding a New Trade

### 1. Edit `trades_data.json`

```json
{
  "CARPENTER": {
    "TRADE_TITLE": "Carpenter",
    "CERTIFICATIONS": ["Journeyman License", "OSHA 10"],
    "SKILLS": [
      "Framing & Rough Carpentry",
      "Finish Carpentry",
      "Blueprint Reading"
    ],
    "PLACEHOLDERS": {
      "SUMMARY_SENTENCE_1": "Skilled carpenter with expertise in...",
      "SKILL_1": "Framing & Structural Work",
      "CERT_1": "Journeyman Carpenter License",
      "EXPERIENCE_BULLET_1": "Framed 50+ residential units..."
      // ... fill remaining placeholders
    }
  }
}
```

### 2. Update TypeScript Types (Optional)

In `frontend/src/lib/tradesData.ts`:

```typescript
export type TradeKey = 'HVAC' | 'ELECTRICIAN' | 'PLUMBER' | 'CARPENTER';
```

### 3. Done! ✅

The system automatically supports the new trade:
- API endpoint recognizes it
- AI generates appropriate content
- Validation works
- Firestore saves it

---

## 🧪 Testing Your Changes

### 1. Validate JSON
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('./trades_data.json')))"
```

### 2. Test Trade Data Loading
```bash
cd api-functions
node -e "
const {getTradeData} = require('./resumeEngine');
const data = getTradeData('CARPENTER');
console.log('Trade:', data.TRADE_TITLE);
console.log('Certs:', data.CERTIFICATIONS.length);
console.log('Skills:', data.SKILLS.length);
"
```

### 3. Test Frontend Component
```typescript
// In your React component
<button onClick={async () => {
  const result = await generateTradeResume(
    await getAuth().currentUser.getIdToken(),
    'CARPENTER',
    { name: 'Test User' }
  );
  console.log('Result:', result);
}}>
  Test Carpenter Resume
</button>
```

---

## 📖 Files You Need to Know

| File | Purpose |
|------|---------|
| `trades_data.json` | Master trade data library |
| `api-functions/resumeEngine.js` | Core generation logic |
| `api-functions/index.js` | `/api/generateTradeResume` endpoint |
| `frontend/src/lib/api.ts` | Frontend API client |
| `frontend/src/lib/tradesData.ts` | TypeScript types & utilities |
| `TRADE_RESUME_ENGINE.md` | Complete documentation |
| `example-usage.js` | Usage examples |

---

## ⚠️ Common Issues

### "Invalid trade key"
✅ Check spelling: `'HVAC'` not `'hvac'`  
✅ Verify trade exists in `trades_data.json`

### "Authentication required"
✅ Pass Firebase ID token: `await user.getIdToken()`  
✅ Include in Authorization header: `Bearer ${idToken}`

### "AI service unavailable"
✅ Set `GOOGLE_API_KEY` environment variable  
✅ Check Firebase Functions logs for Vertex AI errors

### Validation warnings
✅ Check word count (target: 400-500)  
✅ Review unfilled placeholders  
✅ Adjust custom prompt if content too long

---

## 🎯 Next Steps

1. **Generate your first resume** - Use the Quick Start code above
2. **Add more trades** - Edit `trades_data.json` and deploy
3. **Customize prompts** - Modify `resumeEngine.js` → `generateResumePrompt()`
4. **Build UI** - Create a trade selection page with the React examples
5. **Export to PDF/DOCX** - Integrate with document generation library

---

## 📚 Full Documentation

For complete architecture details, see [TRADE_RESUME_ENGINE.md](./TRADE_RESUME_ENGINE.md)

---

**Questions?**
- Review `example-usage.js` for more code samples
- Check existing trades in `trades_data.json`
- Test with `./test-endpoints.sh`

Built with 💪 for tradespeople everywhere.
