# Environment Variables Setup Guide

This guide covers all the environment variables needed to run the complete authentication flow with Firebase, reCAPTCHA, and Firestore.

## Required Environment Variables

Create or update your `.env.local` file with the following variables:

### Firebase Client Configuration (Public)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebase Admin SDK (Server-side)
```bash
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}
```

### reCAPTCHA v3
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google Sign-In provider
   - Enable Email/Password provider
   - Add authorized domains:
     - `localhost`
     - `127.0.0.1`
     - `*.vercel.app`
     - `nexxgennhustle.com`
     - `resume.nexxgennhustle.com`

4. Enable Firestore:
   - Go to Firestore Database
   - Create database in production mode
   - Apply the security rules from `firestore.rules`

5. Get Firebase Config:
   - Go to Project Settings > General
   - Copy the config object values to environment variables

6. Generate Service Account:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Copy the entire JSON as a single line to `FIREBASE_SERVICE_ACCOUNT_KEY`

### 2. reCAPTCHA v3 Setup

1. Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin/)
2. Register a new site:
   - Choose reCAPTCHA v3
   - Add domains:
     - `localhost`
     - `127.0.0.1`
     - `*.vercel.app`
     - `nexxgennhustle.com`
     - `resume.nexxgennhustle.com`
3. Copy Site Key → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
4. Copy Secret Key → `RECAPTCHA_SECRET_KEY`

### 3. Firestore Security Rules

Apply these rules in Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /unlocks/{docId} {
      allow read: if request.auth != null;
      allow write: if false; // Only Admin SDK can write
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. Vercel Deployment

Add all environment variables to your Vercel project:

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add each variable from your `.env.local`
3. Make sure `FIREBASE_SERVICE_ACCOUNT_KEY` is added as a single line JSON string

## Testing

### Local Testing
```bash
npm run dev
```
Visit `http://localhost:3000/unlock` and test the complete flow.

### Production Testing (cURL)
```bash
curl -X POST https://your-domain.vercel.app/api/unlock-resume \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "resume": "Test resume request",
    "idToken": "YOUR_FIREBASE_ID_TOKEN",
    "recaptchaToken": "YOUR_RECAPTCHA_TOKEN"
  }'
```

## Flow Verification

1. **Authentication**: User signs in with Google or Email/Password
2. **reCAPTCHA**: System generates v3 token automatically
3. **API Call**: Frontend sends authenticated request to `/api/unlock-resume`
4. **Verification**: API verifies both reCAPTCHA and Firebase Auth tokens
5. **Firestore**: Document saved to `/unlocks` collection
6. **Download**: User gets access to PDF file

## Troubleshooting

### Common Issues

1. **Firebase Auth Domain Error**
   - Add your domain to Firebase Auth authorized domains

2. **reCAPTCHA Domain Error**
   - Add your domain to reCAPTCHA site domains

3. **Firestore Permission Error**
   - Ensure security rules block client writes
   - Verify Admin SDK has proper credentials

4. **Missing Environment Variables**
   - Check all required variables are set
   - Verify JSON format for service account key

### Debug Mode

Set `NODE_ENV=development` to see detailed error logs and use mock Firestore when Firebase credentials are missing.

## Production Checklist

- [ ] Firebase project configured with Auth providers
- [ ] Firestore security rules deployed
- [ ] reCAPTCHA v3 keys configured for production domains
- [ ] All environment variables set in Vercel
- [ ] Firebase service account key properly formatted
- [ ] Authorized domains added to both Firebase and reCAPTCHA
- [ ] Test complete signup → unlock flow