# 🚀 Manual Deployment Guide

Since GitHub Actions may not be enabled or configured yet, here's how to deploy manually:

## Quick Deploy (Recommended)

```bash
# 1. Install dependencies
cd api-functions
npm install
cd ..

# 2. Deploy functions
firebase deploy --only functions --project tradehustleresumebuilder
```

---

## Enable GitHub Actions

If the Actions tab shows 404, you need to enable GitHub Actions:

### Steps:
1. Go to: https://github.com/tradehustle88/d3vtradehustle-resume-builder/settings
2. Click **Actions** → **General** (left sidebar)
3. Under "Actions permissions":
   - Select **"Allow all actions and reusable workflows"**
4. Click **Save**

### Then Add Firebase Token Secret:
1. Generate Firebase CI token:
   ```bash
   firebase login:ci
   ```
   Copy the token that's displayed

2. Go to: https://github.com/tradehustle88/d3vtradehustle-resume-builder/settings/secrets/actions
3. Click **"New repository secret"**
4. Name: `FIREBASE_TOKEN`
5. Value: Paste the token from step 1
6. Click **"Add secret"**

### Trigger First Workflow:
```bash
# Make a small change to trigger workflow
echo "# Deployment test" >> README.md
git add README.md
git commit -m "Test GitHub Actions deployment"
git push origin main
```

Then check: https://github.com/tradehustle88/d3vtradehustle-resume-builder/actions

---

## Manual Deployment Commands

### Deploy Everything:
```bash
firebase deploy --project tradehustleresumebuilder
```

### Deploy Only Functions:
```bash
firebase deploy --only functions --project tradehustleresumebuilder
```

### Deploy Only Hosting:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting --project tradehustleresumebuilder
```

### Deploy Specific Function:
```bash
firebase deploy --only functions:app --project tradehustleresumebuilder
```

---

## Verify Deployment

After deploying, test your endpoints:

```bash
# Test main endpoint
curl https://app-fbs5jy4frq-uc.a.run.app/

# Test health check
curl https://app-fbs5jy4frq-uc.a.run.app/api/health

# Test subscription status (requires auth token)
curl https://app-fbs5jy4frq-uc.a.run.app/api/subscription/status \
  -H "Authorization: Bearer YOUR_FIREBASE_AUTH_TOKEN"
```

---

## Troubleshooting

### Error: "Firebase project not found"
```bash
# Check current project
firebase use

# Set project explicitly
firebase use tradehustleresumebuilder

# Or add project if not exists
firebase use --add
```

### Error: "Not authorized"
```bash
# Login again
firebase login

# Or use service account
firebase use --project tradehustleresumebuilder
```

### Error: "Functions deploy failed"
```bash
# Check Node.js version (must be 20)
node --version

# Reinstall dependencies
cd api-functions
rm -rf node_modules package-lock.json
npm install
cd ..

# Try again
firebase deploy --only functions
```

---

## Quick Status Check

```bash
# Check Firebase login status
firebase login:list

# Check current project
firebase projects:list

# Check functions status
firebase functions:list

# View function logs
firebase functions:log
```

---

## Deployment Checklist

Before deploying:
- [ ] Dependencies installed: `cd api-functions && npm install`
- [ ] No errors: `cd api-functions && npm run lint`
- [ ] Logged into Firebase: `firebase login`
- [ ] Correct project: `firebase use tradehustleresumebuilder`
- [ ] Environment variables set in Firebase Console

After deploying:
- [ ] Functions deployed successfully (check terminal output)
- [ ] Test endpoints with curl
- [ ] Check Firebase Console → Functions tab
- [ ] Verify logs: `firebase functions:log`

---

**For immediate deployment, just run:**
```bash
firebase deploy --only functions --project tradehustleresumebuilder
```
