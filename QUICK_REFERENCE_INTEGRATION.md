# Trade Generation & Frontend Integration - Quick Reference

## 🚀 Quick Start

### Test the Frontend (Local Development)
```bash
cd frontend
npm run dev
# Visit http://localhost:3000/generate-resume
```

### Generate New Trades (Automated)
```powershell
# Generate all 10 new trades (CDL, Welder, Carpenter, etc.)
.\generate-trades.ps1 -All

# Generate single trade
.\generate-trades.ps1 -Trade CDL_DRIVER

# Verbose output
.\generate-trades.ps1 -All -Verbose
```

### Test API Endpoint (cURL)
```bash
curl -X POST "https://app-fbs5jy4frq-uc.a.run.app/api/generateTradeResume" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tradeKey":"HVAC","userData":{"name":"John Doe","yearsExperience":5}}'
```

## 📁 Files Created

### Frontend Components
```
frontend/src/
├── app/generate-resume/page.tsx         # Main resume generator page (5-step wizard)
├── components/
│   ├── TradeCard.tsx                    # Trade selection cards
│   ├── ProgressSidebar.tsx              # Step navigation sidebar
│   └── ResumePreviewNew.tsx             # Resume preview component
└── lib/
    ├── tradesData.ts                    # Updated with UserData, TradePlaceholderMap
    └── api.ts                           # Updated imports
```

### Automation Scripts
```
generate-trades.ps1                      # AI-powered trade batch generation
test-vertex-ai.ps1                       # Vertex AI connectivity testing
```

### Documentation
```
FRONTEND_INTEGRATION_COMPLETE.md         # Complete integration guide
RESUME_GENERATOR_WIREFRAME.md            # UI/UX specifications
TRADE_RESUME_ENGINE.md                   # Backend architecture
```

## 🔧 What's Working

✅ Resume generation page with 5 steps
✅ Trade selection UI (HVAC, Electrician, Plumber)
✅ Form data collection (name, email, years experience, etc.)
✅ API client integration with Firebase Auth
✅ Loading states and error handling
✅ Resume preview component
✅ Trade batch generation script (Vertex AI powered)
✅ Type-safe TypeScript interfaces
✅ Vertex AI verification tests passing

## 🚧 Next Steps

### 1. Deploy Frontend
```bash
cd frontend
npm run build
npm run export
firebase deploy --only hosting
```

### 2. Generate All Trades
```powershell
.\generate-trades.ps1 -All
git add trades_data.json api-functions/trades_data.json
git commit -m "feat: Add 10 new trade types via AI generation"
firebase deploy --only functions
```

### 3. Test End-to-End
1. Visit https://YOUR_DOMAIN/generate-resume
2. Sign in with Firebase Auth
3. Select trade → Fill form → Generate
4. Verify AI-generated content appears
5. Test download button (needs PDF implementation)

### 4. Add PDF Export
```bash
cd frontend
npm install jspdf
# Implement in ResumePreviewNew.tsx
```

## 📊 Trade Data Structure

Each trade in `trades_data.json`:
```json
{
  "TRADE_KEY": {
    "TRADE_TITLE": "Professional Title",
    "CERTIFICATIONS": ["Cert 1", "Cert 2", "Cert 3"],
    "SKILLS": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
    "PLACEHOLDERS": {
      "SUMMARY_SENTENCE_1": "...",
      "SUMMARY_SENTENCE_2": "...",
      "SKILL_1": "...",
      ... (17 total placeholders)
    }
  }
}
```

## 🎯 Available Trades

### Current (3)
- ❄️ HVAC - HVAC Technician
- ⚡ ELECTRICIAN - Electrician
- 🔧 PLUMBER - Plumber

### Ready to Generate (10)
- 🚚 CDL_DRIVER - Commercial CDL Driver
- 🔥 WELDER - Certified Welder
- 🪚 CARPENTER - Carpenter
- 🔩 AUTO_MECHANIC - Automotive Technician
- 🎨 PAINTER - Professional Painter
- 🧱 MASON - Mason / Bricklayer
- 🏠 ROOFER - Roofing Contractor
- 🌳 LANDSCAPER - Landscape Technician
- ☀️ SOLAR_INSTALLER - Solar Panel Installer
- 🔧 PIPE_FITTER - Pipe Fitter

## 🔑 API Key Points

- **Endpoint**: `/api/generateTradeResume`
- **Auth**: Firebase ID Token (Bearer)
- **Rate Limit**: 30 requests/minute
- **AI Model**: Vertex AI Gemini 2.0 Flash
- **Response Time**: 3-5 seconds
- **Word Count Target**: 400-500 words (ATS optimal)

## 💡 Usage Examples

### JavaScript (Frontend)
```javascript
const response = await generateTradeResume(
  idToken,
  'HVAC',
  {
    name: 'John Doe',
    email: 'john@example.com',
    yearsExperience: 5,
    location: 'Chicago, IL'
  },
  'Focus on commercial HVAC',
  true
);
```

### PowerShell (Testing)
```powershell
$token = gcloud auth application-default print-access-token
$headers = @{
  "Authorization" = "Bearer $token"
  "Content-Type" = "application/json"
}
$body = @{
  tradeKey = "HVAC"
  userData = @{name = "John Doe"; yearsExperience = 5}
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://app-fbs5jy4frq-uc.a.run.app/api/generateTradeResume" `
  -Method Post -Headers $headers -Body $body
```

## 📞 Support

**Documentation**: See `FRONTEND_INTEGRATION_COMPLETE.md`
**Testing**: Run `.\test-vertex-ai.ps1`
**Trade Generation**: Run `.\generate-trades.ps1 -All`

---

**Last Updated**: October 16, 2025
