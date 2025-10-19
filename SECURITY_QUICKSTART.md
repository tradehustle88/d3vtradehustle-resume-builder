# 🔒 Security Quick Reference

## Immediate Actions Required

### 1. Rotate Firebase Keys NOW
```
https://console.firebase.google.com/project/tradehustleresumebuilder/settings/general/
```

**Exposed Key:** `AIzaSyD-***REDACTED***`  
**Status:** ⚠️ Compromised - Found in 130 locations in git history

### 2. Clean Git History
```powershell
.\scripts\clean-git-history.ps1 -DryRun  # Test first
.\scripts\clean-git-history.ps1          # Actually clean
git push origin --force --all            # ⚠️ Destructive!
```

### 3. Enable GitHub Secret Scanning
Settings → Code security → Enable "Secret scanning" + "Push protection"

## What's Protected Now

✅ `.env` files blocked by .gitignore  
✅ Pre-commit hook scans for API keys  
✅ 130 exposed keys sanitized in docs  
✅ Service account files blocked  
✅ Firebase/Stripe/AWS keys detected  

## Quick Commands

```powershell
# Scan for secrets
npm run check-secrets

# Sanitize keys in files
.\scripts\sanitize-keys.ps1

# Clean git history
.\scripts\clean-git-history.ps1

# Security audit
npm run security-audit
```

## Pre-commit Hook

Automatically blocks commits with:
- Firebase API keys (`AIza...`)
- Stripe keys (`sk_live_*`, `sk_test_*`)
- AWS keys (`AKIA...`)
- `.env` files
- Service account credentials

## Files Created

- `SECURITY_INCIDENT_RESPONSE.md` - Complete guide
- `SECURITY_SETUP_COMPLETE.md` - Setup summary
- `.gitignore` - Enhanced protection
- `.husky/pre-commit` - Git hook
- `scripts/check-secrets.js` - Scanner
- `scripts/sanitize-keys.ps1` - Key cleaner
- `scripts/clean-git-history.ps1` - History cleaner

## Test the Setup

```powershell
# Test pre-commit hook
echo 'const key = "AIza123456789012345678901234567890abc"' > test.js
git add test.js
git commit -m "test"
# Should be BLOCKED ✅

# Clean up
Remove-Item test.js
```

## Next Steps Checklist

- [ ] Rotate Firebase Web API Key
- [ ] Generate new Service Account
- [ ] Update `.env.local` with new keys
- [ ] Revoke old keys in Firebase Console
- [ ] Clean git history
- [ ] Force push to remote
- [ ] Enable GitHub Secret Scanning
- [ ] Notify team to re-clone repo

## Need Help?

📖 Full guide: `SECURITY_INCIDENT_RESPONSE.md`  
🔧 Setup details: `SECURITY_SETUP_COMPLETE.md`

---

**Status:** 🔒 Repository secured. Manual key rotation required.
