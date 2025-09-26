# Vercel Deployment Guide - COMPLETE SETUP

## 🔐 Lock Environment Variables

### 1. Required Environment Variables Checklist

#### Firebase Configuration (Client-side - exposed to browser)
- `NEXT_PUBLIC_FIREBASE_API_KEY` = your_firebase_api_key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = your_project.firebaseapp.com  
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = your_project_id
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = your_project.appspot.com
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = your_sender_id
- `NEXT_PUBLIC_FIREBASE_APP_ID` = your_app_id
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` = G-XXXXXXXXXX

#### Firebase Admin SDK (Server-side - secure)
- `FIREBASE_SERVICE_ACCOUNT_KEY` = base64_encoded_service_account_json
- `FIREBASE_STORAGE_BUCKET` = your_project.appspot.com

#### reCAPTCHA v3
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = your_recaptcha_site_key
- `RECAPTCHA_SECRET_KEY` = your_recaptcha_secret_key

#### Google Cloud Platform (for Vertex AI)
- `GCP_PROJECT_ID` = your_project_id
- `GCP_LOCATION` = us-central1

### 2. Base64 Encode Firebase Service Account

**CRITICAL**: For production, your Firebase service account JSON must be base64-encoded:

```bash
# From your serviceAccount.json file:
cat keys/serviceAccount.json | base64 -w0

# Copy the output and paste into FIREBASE_SERVICE_ACCOUNT_KEY
```

## 🚀 Vercel Project Configuration

### 3. Set Root Directory
- Go to Vercel → Project Settings → Root Directory
- Set to: `frontend/`

### 4. Build & Output Settings
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x or 20.x

### 5. Updated next.config.js (already fixed)
The project now includes optimized Vercel settings:
```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
  },
};
```

## 🔧 Fixed Firebase Admin Initialization

Your `src/lib/firebaseAdmin.ts` now handles both formats:
- **Development**: Plain JSON string in FIREBASE_SERVICE_ACCOUNT_KEY
- **Production**: Base64-encoded JSON string
- **Fallback**: Mock Firestore when credentials missing (prevents build crashes)

## ⚠️ Critical Deployment Steps

### 6. Local Build Verification
Before deploying, ALWAYS test locally:

```bash
cd frontend
npm install
npm run build  # Must pass without errors
```

### 7. Environment Variable Validation
Ensure your `.env.local` has all required variables from `.env.template`:

```bash
# Copy template and fill in values:
cp .env.template .env.local
# Edit .env.local with your actual values
```

### 8. Deploy Fresh
After configuration:

```bash
vercel --prod
# OR push to main branch for auto-deployment
```

## 🧪 Post-Deployment Testing

### Complete Flow Test:
1. Visit your deployed site
2. Go to `/unlock` page  
3. Sign in with Google or Email/Password
4. Click "Unlock Resume Kit Now"
5. Verify PDF download works
6. Check Vercel Functions logs for any errors

### API Endpoint Test:
```bash
curl -X GET https://your-domain.vercel.app/api/vertex-test
# Should return: {"status":"ok","message":"Vertex AI test endpoint"}
```

## 🔍 Troubleshooting Guide

### Build Fails on Vercel but Works Locally
- ✅ Verify root directory is set to `frontend/`
- ✅ Check all environment variables are present
- ✅ Ensure FIREBASE_SERVICE_ACCOUNT_KEY is base64-encoded
- ✅ Verify Node.js version compatibility

### Firebase Admin Errors
- ✅ Check service account JSON is valid
- ✅ Verify base64 encoding is correct
- ✅ Ensure Firebase project has correct permissions

### reCAPTCHA Verification Fails
- ✅ Add your Vercel domain to reCAPTCHA site settings
- ✅ Verify both site key and secret key are correct
- ✅ Check CORS settings in reCAPTCHA console

### Missing GCP Environment Variables
- ✅ Add GCP_PROJECT_ID and GCP_LOCATION
- ✅ Ensure they match your Firebase project settings

## 📋 Final Deployment Checklist

- [ ] Root directory set to `frontend/`
- [ ] All 15+ environment variables configured
- [ ] FIREBASE_SERVICE_ACCOUNT_KEY base64-encoded
- [ ] reCAPTCHA domain settings include your Vercel URL
- [ ] Local build passes: `npm run build`
- [ ] Post-deployment flow testing completed
- [ ] Vercel Functions logs checked for errors