# 🌐 Trade Hustle Resume Builder - Live URLs

## Production URLs

### Frontend (Firebase Hosting)
**Main Site**: https://tradehustleresumebuilder.web.app
**Resume Generator**: https://tradehustleresumebuilder.web.app/generate-resume
**Unlock Page**: https://tradehustleresumebuilder.web.app/unlock

### Backend (Cloud Functions)
**API Base URL**: https://app-fbs5jy4frq-uc.a.run.app/api
**Health Check**: https://app-fbs5jy4frq-uc.a.run.app/api/status
**Generate Trade Resume**: https://app-fbs5jy4frq-uc.a.run.app/api/generateTradeResume

### Preview Channel
**Preview URL**: https://tradehustleresumebuilder--preview-resume-dq42wp4l.web.app
**Expires**: October 21, 2025

---

## Quick Access Commands

### Open Resume Generator
```powershell
Start-Process "https://tradehustleresumebuilder.web.app/generate-resume"
```

### Test API Health
```powershell
Invoke-RestMethod -Uri "https://app-fbs5jy4frq-uc.a.run.app/api/status"
```

### Test Resume Generation (requires auth token)
```powershell
# Get token from Firebase Auth (in browser console after login):
# const token = await firebase.auth().currentUser.getIdToken();

$token = "YOUR_FIREBASE_ID_TOKEN"
$body = @{
  tradeKey = "HVAC"
  userData = @{
    name = "John Doe"
    email = "john@example.com"
    yearsExperience = 5
  }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://app-fbs5jy4frq-uc.a.run.app/api/generateTradeResume" `
  -Method Post `
  -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} `
  -Body $body
```

---

## Deployment Status

### Last Deployment
- **Frontend**: October 16, 2025 at 16:08:38
- **Backend**: Active (Firebase Functions v2)
- **Branch**: feature/hustle-ui
- **Commit**: 62f667a

### Current Features Live
✅ Landing page
✅ Authentication (Email/Password + Google)
✅ Unlock resume flow
⏳ Resume generator UI (needs deployment)
⏳ AI generation endpoint (backend ready, frontend pending)

---

## Deploy Latest Changes

### Deploy Frontend (Resume Generator)
```bash
cd frontend
npm run build
npm run export
cd ..
firebase deploy --only hosting
```

### Or Use Automated Script
```powershell
.\deploy-all.ps1 -Frontend
```

### Deploy Everything
```powershell
.\deploy-all.ps1 -All
```

---

## Troubleshooting

### "This site can't be reached" Error
**Problem**: Using placeholder domain like "YOUR_DOMAIN"
**Solution**: Use actual domain `tradehustleresumebuilder.web.app`

### 404 Not Found on /generate-resume
**Problem**: Frontend not deployed yet
**Solution**: Run `firebase deploy --only hosting`

### API 403 Forbidden
**Problem**: Missing Firebase ID token
**Solution**: 
1. Login at https://tradehustleresumebuilder.web.app/unlock
2. Open browser console
3. Run: `const token = await firebase.auth().currentUser.getIdToken(); console.log(token);`
4. Use token in API calls

### API 429 Rate Limit
**Problem**: Too many requests
**Solution**: Wait 60 seconds, then retry

---

## Firebase Console Links

### Project Dashboard
https://console.firebase.google.com/project/tradehustleresumebuilder

### Hosting
https://console.firebase.google.com/project/tradehustleresumebuilder/hosting

### Functions
https://console.firebase.google.com/project/tradehustleresumebuilder/functions

### Firestore
https://console.firebase.google.com/project/tradehustleresumebuilder/firestore

### Authentication
https://console.firebase.google.com/project/tradehustleresumebuilder/authentication

---

## Testing Checklist

### Frontend
- [ ] Visit https://tradehustleresumebuilder.web.app
- [ ] Click "Unlock Resume" → Test email/password login
- [ ] Click "Unlock Resume" → Test Google sign-in
- [ ] Navigate to /generate-resume (after deployment)
- [ ] Select HVAC trade
- [ ] Fill in form fields
- [ ] Click "Generate Resume"
- [ ] Verify AI-generated content appears
- [ ] Test download button

### Backend
- [ ] Test health endpoint: curl https://app-fbs5jy4frq-uc.a.run.app/api/status
- [ ] Test with Postman/curl (with auth token)
- [ ] Check Firebase Functions logs: `firebase functions:log --only app`
- [ ] Monitor Firestore for new documents

---

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tradehustleresumebuilder.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tradehustleresumebuilder
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tradehustleresumebuilder.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://app-fbs5jy4frq-uc.a.run.app/api
```

### Backend (Functions)
Set via Firebase Console or `firebase functions:config:set`
- GOOGLE_API_KEY (for Gemini API fallback)
- Service account credentials (auto-configured)

---

**Last Updated**: October 16, 2025
**Project ID**: tradehustleresumebuilder
**Status**: Backend deployed ✅ | Frontend needs update ⏳
