# 🔒 Security Incident Response - Firebase Key Rotation

**Status:** 🚨 URGENT - Keys exposed in git history  
**Date:** October 18, 2025  
**Severity:** HIGH

## Immediate Actions Required

### 1. Rotate Firebase Keys (Do This NOW)

#### Step 1: Access Firebase Console
```bash
# Open Firebase Console
https://console.firebase.google.com/project/tradehustleresumebuilder/settings/general/
```

#### Step 2: Rotate Web API Key
1. Go to **Project Settings** → **General**
2. Under **Your apps**, find your Web App
3. Click the **gear icon** → **Settings**
4. Scroll to **Web API Key**
5. Click **Regenerate Web API Key**
6. ⚠️ Save the new key securely

#### Step 3: Create New Service Account
1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Rename it to `serviceAccountKey.json`
5. Store it securely (NEVER commit to git)

#### Step 4: Revoke Old Keys
1. In Firebase Console, go to **IAM & Admin**
2. Find the old service account
3. Click **Delete** or **Disable**
4. Confirm you have the new keys working first

#### Step 5: Update Application Credentials

**Frontend (.env.local):**
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_new_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tradehustleresumebuilder.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tradehustleresumebuilder
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tradehustleresumebuilder.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Functions URL
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-tradehustleresumebuilder.cloudfunctions.net

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
```

**Backend (api-functions/.env):**
```env
# Firebase Admin SDK (base64 encoded service account)
FIREBASE_SERVICE_ACCOUNT_BASE64=base64_encoded_service_account_json

# Or individual fields
FIREBASE_PROJECT_ID=tradehustleresumebuilder
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tradehustleresumebuilder.iam.gserviceaccount.com

# Gemini AI
GOOGLE_API_KEY=your_gemini_api_key

# Optional
RECAPTCHA_SECRET=your_recaptcha_secret
```

### 2. Clean Git History

#### Option A: Using git-filter-repo (Recommended)

```powershell
# Install git-filter-repo
pip install git-filter-repo

# Backup your repo first
cd ..
git clone d3vtradehustle-resume-builder d3vtradehustle-resume-builder-backup

# Return to repo
cd d3vtradehustle-resume-builder

# Create patterns file
@"
.env.local
frontend/.env.local
frontend_backup/.env.local
api-functions/.env
serviceAccountKey.json
"@ | Out-File -FilePath .git-filter-patterns.txt -Encoding utf8

# Run filter
git filter-repo --invert-paths --paths-from-file .git-filter-patterns.txt

# Force push (WARNING: Destructive operation)
git push origin --force --all
git push origin --force --tags
```

#### Option B: Using BFG Repo-Cleaner

```powershell
# Download BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# Run BFG
java -jar bfg.jar --delete-files ".env.local"
java -jar bfg.jar --delete-files "serviceAccountKey.json"

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

#### Option C: Manual Approach (Less thorough)

```powershell
# Remove from all branches
git filter-branch --force --index-filter `
  "git rm -rf --cached --ignore-unmatch .env.local frontend/.env.local api-functions/.env" `
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

### 3. GitHub Repository Settings

#### Invalidate Exposed Secrets
1. Go to your GitHub repo
2. **Settings** → **Secrets and variables** → **Actions**
3. Delete any old secrets
4. Add new secrets with rotated keys

#### Enable Secret Scanning
1. **Settings** → **Code security and analysis**
2. Enable **Secret scanning**
3. Enable **Push protection**

### 4. Verify Security

```powershell
# Run security audit
npm run security-audit

# Check for secrets in current files
npm run check-secrets

# Test commit hook
git add .
git commit -m "test: verify pre-commit hook"
# Should block if secrets detected

# Install dependencies
npm install

# Setup husky hooks
npm run prepare
```

## Files Protected

### .gitignore Updated
- ✅ `.env` and all variants
- ✅ `serviceAccountKey.json`
- ✅ Firebase credentials
- ✅ API keys and secrets
- ✅ Build artifacts

### Pre-commit Hooks Installed
- ✅ Secret scanner (`scripts/check-secrets.js`)
- ✅ Blocks commits with API keys
- ✅ Prevents .env file commits
- ✅ Scans for Firebase keys, Stripe keys, AWS keys

## Exposed Keys Found

Your API key `YOUR_FIREBASE_API_KEY` was found in:

1. Documentation files (*.md)
2. Lighthouse reports (*.html, *.json)
3. Build artifacts

**These need to be cleaned from git history!**

## Post-Rotation Checklist

- [ ] Firebase Web API Key rotated
- [ ] Service Account key regenerated
- [ ] Old service account disabled/deleted
- [ ] `.env.local` files updated with new keys
- [ ] Git history cleaned
- [ ] Force pushed to remote
- [ ] Team members notified
- [ ] Pre-commit hooks tested
- [ ] Application tested with new keys
- [ ] Monitoring enabled for unauthorized access

## Security Best Practices

### Do's ✅
- Always use `.env.local` for secrets (never `.env`)
- Use Firebase App Check for production
- Restrict API keys by domain/IP
- Enable Firebase Security Rules
- Use environment-specific keys
- Rotate keys regularly (every 90 days)
- Monitor Firebase usage for anomalies

### Don'ts ❌
- Never commit `.env` files
- Never hardcode API keys
- Never share keys via chat/email
- Never use production keys in development
- Never commit service account files
- Never expose keys in frontend code
- Never log sensitive credentials

## Firebase Security Configuration

### Restrict API Keys
```bash
# In Firebase Console → Project Settings → Web API Key
- Add authorized domains
- Enable only required APIs
- Set HTTP referrer restrictions
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Require authentication
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // User-specific data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Rate limiting
    match /unlocks/{document} {
      allow create: if request.auth != null 
        && request.time > resource.data.lastUnlock + duration.value(1, 'h');
    }
  }
}
```

## Monitoring

### Set up Firebase Monitoring
1. Enable **Firebase Performance Monitoring**
2. Set up **Firebase Cloud Messaging** alerts
3. Monitor **Authentication** logs
4. Track **Firestore** usage

### GitHub Security Alerts
1. Enable **Dependabot alerts**
2. Enable **Code scanning**
3. Enable **Secret scanning**
4. Review **Security advisories**

## Emergency Contacts

If you detect unauthorized access:

1. **Immediately disable** the compromised service account
2. **Rotate all keys** (API, service accounts, database)
3. **Review audit logs** in Firebase Console
4. **Check for data breaches** in Firestore
5. **Notify users** if personal data was accessed

## Questions?

See also:
- [Firebase Security Checklist](https://firebase.google.com/docs/projects/security-checklist)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Git Secrets Management](https://git-secret.io/)

---

**Remember:** Security is not a one-time task. Review this document quarterly and update practices as needed.
