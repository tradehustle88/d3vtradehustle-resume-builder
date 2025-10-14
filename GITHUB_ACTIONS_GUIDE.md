# 🚀 GitHub Actions Workflow - Complete Guide

## Workflow Features

### ✅ **Automatic Deployment**
- Triggers on every push to `main` branch
- Automatically installs dependencies and deploys functions

### ✅ **Manual Deployment**
- Added `workflow_dispatch` trigger
- Can manually trigger from GitHub UI
- Go to: **Actions** → **Deploy to Firebase** → **Run workflow**

### ✅ **Force Deployment**
- Uses `--force` flag to allow function deletion
- Automatically cleans up old/unused functions
- No manual intervention needed

---

## How to Use

### Automatic Deployment (Default)
```bash
# Just push to main branch
git add .
git commit -m "Your changes"
git push origin main

# GitHub Actions automatically:
# 1. Checks out code
# 2. Sets up Node.js 20
# 3. Installs Firebase Tools
# 4. Installs function dependencies
# 5. Deploys with --force flag
```

### Manual Deployment (GitHub UI)
1. Go to: https://github.com/tradehustle88/d3vtradehustle-resume-builder/actions
2. Click **"Deploy to Firebase"** workflow (left sidebar)
3. Click **"Run workflow"** button (right side)
4. Select branch: `main`
5. Click green **"Run workflow"** button
6. Watch the deployment progress in real-time

---

## Workflow Steps

### 1. **Checkout Code**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
Clones your repository

### 2. **Setup Node.js**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    cache-dependency-path: 'api-functions/package-lock.json'
```
Installs Node.js 20 and caches npm dependencies

### 3. **Install Firebase Tools**
```yaml
- name: Install Firebase Tools
  run: npm install -g firebase-tools
```
Installs latest firebase-tools globally

### 4. **Install Function Dependencies**
```yaml
- name: Install Functions Dependencies
  run: |
    cd api-functions
    npm ci
```
Installs exact dependency versions from package-lock.json

### 5. **Deploy to Firebase**
```yaml
- name: Deploy to Firebase
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
  run: firebase deploy --only functions --force --token "$FIREBASE_TOKEN" --project tradehustleresumebuilder
```
Deploys functions with force flag (allows deletion)

---

## Command Flags Explained

### `--only functions`
- Deploys only Cloud Functions
- Skips hosting, firestore rules, storage rules, etc.

### `--force`
- **Allows function deletion** without confirmation
- Automatically removes functions not in current codebase
- Prevents "dangling" functions from old deploys

### `--token "$FIREBASE_TOKEN"`
- Uses CI token for authentication
- Token stored in GitHub repository secrets

### `--project tradehustleresumebuilder`
- Explicitly sets Firebase project
- Prevents accidental deployment to wrong project

---

## Required Secrets

### `FIREBASE_TOKEN`
Must be set in GitHub repository secrets.

**To generate token:**
```bash
firebase login:ci
```

**To add to GitHub:**
1. Go to: https://github.com/tradehustle88/d3vtradehustle-resume-builder/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `FIREBASE_TOKEN`
4. Value: Paste the token from `firebase login:ci`
5. Click **"Add secret"**

---

## Monitoring Deployments

### View Workflow Runs
- URL: https://github.com/tradehustle88/d3vtradehustle-resume-builder/actions
- See all deployment history
- Check logs for each step
- View errors and warnings

### Deployment Status Badge
Add to your README.md:
```markdown
![Deploy Status](https://github.com/tradehustle88/d3vtradehustle-resume-builder/actions/workflows/deploy.yml/badge.svg)
```

---

## Troubleshooting

### ❌ Error: "FIREBASE_TOKEN not found"
**Solution:** Add token to GitHub secrets (see "Required Secrets" above)

### ❌ Error: "Cannot delete function"
**Solution:** Already fixed! `--force` flag handles this automatically

### ❌ Error: "npm ci failed"
**Solution:** 
```bash
# Regenerate package-lock.json locally
cd api-functions
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### ❌ Error: "Permission denied"
**Solution:** Check IAM permissions in Firebase Console
- Ensure service account has "Firebase Admin" role
- Check Cloud Run invoker permissions

### ❌ Workflow not triggering
**Solution:** 
1. Check if GitHub Actions is enabled
2. Go to: Settings → Actions → General
3. Select "Allow all actions and reusable workflows"
4. Save

---

## Performance Optimization

### Current Setup:
- ✅ **npm caching** - Speeds up dependency installation
- ✅ **npm ci** - Uses exact versions (faster than npm install)
- ✅ **Minimal steps** - Streamlined for speed

### Deployment Time:
- **First run**: ~3-5 minutes (no cache)
- **Subsequent runs**: ~2-3 minutes (with cache)

---

## Advanced Usage

### Deploy Specific Function
Modify workflow to deploy single function:
```yaml
run: firebase deploy --only functions:app --force --token "$FIREBASE_TOKEN"
```

### Deploy with Environment Variables
```yaml
- name: Deploy to Firebase
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
    STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
  run: |
    firebase functions:config:set stripe.key="$STRIPE_SECRET_KEY"
    firebase deploy --only functions --force --token "$FIREBASE_TOKEN"
```

### Deploy to Multiple Environments
```yaml
- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: firebase deploy --only functions --force --token "$FIREBASE_TOKEN" --project tradehustleresumebuilder

- name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  run: firebase deploy --only functions --force --token "$FIREBASE_TOKEN" --project tradehustle-staging
```

---

## Local Testing Before Deployment

Always test locally first:

```bash
# 1. Install dependencies
cd api-functions
npm install

# 2. Run emulators
cd ..
firebase emulators:start --only functions

# 3. Test endpoints
curl http://localhost:5001/tradehustleresumebuilder/us-central1/app/

# 4. When ready, push to trigger deployment
git push origin main
```

---

## Workflow File Location

**Path:** `.github/workflows/deploy.yml`

**Current Configuration:**
```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main
  workflow_dispatch:  # ← Allows manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    if: github.repository == 'tradehustle88/d3vtradehustle-resume-builder'

    steps:
      - Checkout code
      - Setup Node.js 20 (with npm caching)
      - Install Firebase Tools
      - Install function dependencies (npm ci)
      - Deploy with --force flag
```

---

## Security Best Practices

✅ **FIREBASE_TOKEN in secrets** - Never commit tokens to code
✅ **Repository check** - Prevents fork deployments
✅ **Force flag** - Safely removes old functions
✅ **Explicit project** - Prevents wrong project deploys

---

## Quick Reference

| Action | Command |
|--------|---------|
| **Auto Deploy** | Push to `main` branch |
| **Manual Deploy** | Actions tab → Run workflow |
| **View Logs** | Actions tab → Select run |
| **Cancel Deploy** | Actions tab → Cancel workflow |
| **Redeploy** | Actions tab → Re-run jobs |

---

## Success Indicators

After successful deployment, you should see:

```
✓ functions: Finished running predeploy script.
✓ functions(app): Successful update operation.
✓ Deploy complete!

Project Console: https://console.firebase.google.com/project/tradehustleresumebuilder/overview
```

Test endpoint:
```bash
curl https://app-fbs5jy4frq-uc.a.run.app/
# Response: 🚀 Trade Hustle Resume Builder backend is live!
```

---

**Workflow Status**: ✅ ACTIVE & READY
**Last Updated**: October 14, 2025
**Next Push**: Will auto-deploy to production
