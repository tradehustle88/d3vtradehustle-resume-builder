# 🔐 API Key Audit - 6 Keys Found

**Status:** You have 6 API keys in your GCP project  
**Action Required:** Identify and delete old/unused keys

---

## ⚠️ Important: Key Safety Rules

**Keys to KEEP:**
- ✅ `AIzaSyCFCN9xFfBd0WBmvTWhk-IaOempQv6-_fM` ← Your current active key

**Keys to DELETE:**
- 🔴 `AIzaSyD-nOOjvBgp5lls0qRG_VAWFt95-XoBbPk` ← Old exposed key
- 🔴 Any other keys that are NOT your current key

---

## 📋 Step-by-Step Audit Process

### Step 1: Identify Your Current Key

**Your current active key (from .env.local):**
```
AIzaSyCFCN9xFfBd0WBmvTWhk-IaOempQv6-_fM
```

**First 10 characters:** `AIzaSyCFCN`

### Step 2: Look for the Old Exposed Key

**Old exposed key (from documentation):**
```
AIzaSyD-nOOjvBgp5lls0qRG_VAWFt95-XoBbPk
```

**First 10 characters:** `AIzaSyD-nO`

### Step 3: Check Each of the 6 Keys

In GCP Console, for **each of the 6 keys**, check:

1. **First 10-15 characters** of the key
2. **Created date** (older keys are likely unused)
3. **Last used date** (never used = safe to delete)
4. **Name** (might give clues about purpose)

---

## 🎯 Decision Matrix

For each key, click on it and note:

| Key # | First 10 Chars | Created Date | Last Used | Keep/Delete | Reason |
|-------|----------------|--------------|-----------|-------------|--------|
| 1     | AIzaSyCFCN     | Recent       | Recently  | ✅ KEEP     | Current active key |
| 2     | AIzaSyD-nO     | Older        | ?         | 🔴 DELETE   | Old exposed key |
| 3     | AIzaSy????     | ?            | ?         | ❓ CHECK    | Unknown |
| 4     | AIzaSy????     | ?            | ?         | ❓ CHECK    | Unknown |
| 5     | AIzaSy????     | ?            | ?         | ❓ CHECK    | Unknown |
| 6     | AIzaSy????     | ?            | ?         | ❓ CHECK    | Unknown |

---

## 🔍 How to Check Each Key

**In GCP Console:**

1. Click on the first key in the list
2. In the details panel, note:
   - Full key string (or at least first 15 characters)
   - Creation date
   - Last used date
   - Restrictions (if any)

3. Compare with your current key:
   ```powershell
   # Your current key starts with:
   # AIzaSyCFCN9xFfBd0WBmvTWhk-IaOempQv6-_fM
   ```

4. If it matches → KEEP ✅
5. If it starts with `AIzaSyD-nO` → DELETE 🔴
6. If it's something else → Check last used date:
   - Never used → Safe to DELETE
   - Used long ago → Probably safe to DELETE
   - Used recently → Investigate before deleting

---

## 🚨 Safe Deletion Strategy

### Priority 1: Delete Old Exposed Key (HIGH)

**Look for:** `AIzaSyD-nO...`

**Action:**
1. Click the key
2. Verify it's NOT your current key
3. Click "DELETE KEY"
4. Confirm deletion

### Priority 2: Delete Never-Used Keys (MEDIUM)

**Look for:** Keys with "Last used: Never" or very old dates

**Why safe:** If they've never been used, nothing depends on them

**Action:**
1. Check "Last used" date
2. If "Never" or >6 months ago → Safe to delete
3. Delete them one by one

### Priority 3: Keep Current Key (CRITICAL)

**Must keep:** `AIzaSyCFCN9xFfBd0WBmvTWhk-IaOempQv6-_fM`

**Verify it's working:**
```powershell
cd frontend
npm run dev
# Visit http://localhost:3000
# If app works, key is good! ✅
```

---

## 📝 Interactive Audit Checklist

**Go through each key and fill this out:**

```
KEY 1:
- First 15 chars: _________________
- Created: _________________
- Last used: _________________
- Decision: KEEP / DELETE
- Reason: _________________

KEY 2:
- First 15 chars: _________________
- Created: _________________
- Last used: _________________
- Decision: KEEP / DELETE
- Reason: _________________

KEY 3:
- First 15 chars: _________________
- Created: _________________
- Last used: _________________
- Decision: KEEP / DELETE
- Reason: _________________

KEY 4:
- First 15 chars: _________________
- Created: _________________
- Last used: _________________
- Decision: KEEP / DELETE
- Reason: _________________

KEY 5:
- First 15 chars: _________________
- Created: _________________
- Last used: _________________
- Decision: KEEP / DELETE
- Reason: _________________

KEY 6:
- First 15 chars: _________________
- Created: _________________
- Last used: _________________
- Decision: KEEP / DELETE
- Reason: _________________
```

---

## 🎯 Quick Reference: What to Look For

### ✅ KEEP this key:
```
Starts with: AIzaSyCFCN9xFfBd0WBmvTWhk-IaOempQv6-_fM
This is your CURRENT ACTIVE key from .env.local
```

### 🔴 DELETE this key:
```
Starts with: AIzaSyD-nOOjvBgp5lls0qRG_VAWFt95-XoBbPk
This is the OLD EXPOSED key
```

### ❓ INVESTIGATE these keys:
```
Any key that doesn't match the above two
- Check creation date (old = likely unused)
- Check last used date (never = safe to delete)
- Check if it's used in any other projects
```

---

## 🛡️ Safety Tips

**Before deleting ANY key:**

1. ✅ Verify it's NOT your current key
2. ✅ Check if app still works after deletion
3. ✅ Keep at least ONE key (your current one)
4. ✅ Test your app after deleting each key

**After each deletion:**
```powershell
# Test that app still works
cd frontend
npm run dev
# Visit http://localhost:3000
```

---

## 🎬 Recommended Deletion Order

### Round 1: Delete Old Exposed Key
1. Find `AIzaSyD-nO...`
2. Delete it
3. Test app still works

### Round 2: Delete Never-Used Keys
1. Find keys with "Last used: Never"
2. Delete them one by one
3. Test app after each deletion

### Round 3: Delete Old Unused Keys
1. Find keys with old "Last used" dates (>1 month)
2. If you don't recognize them, delete
3. Test app after each deletion

### Final: Keep Only Current Key
**Goal:** End with only 1 key remaining: `AIzaSyCFCN...`

---

## 🔧 Troubleshooting

### "What if I delete the wrong key?"

**Don't panic!** You can create a new key:

1. In GCP Console, click "CREATE CREDENTIALS"
2. Select "API key"
3. Copy the new key
4. Update `frontend/.env.local`:
   ```powershell
   .\scripts\update-env.ps1
   ```
5. Paste new key when prompted
6. Test app

### "How do I know which key my app is using?"

**Check your .env.local file:**
```powershell
cat frontend\.env.local | Select-String "API_KEY"
```

**The key shown here is your ACTIVE key** - don't delete this one!

### "App stopped working after deletion!"

**Quick fix:**
1. Check your .env.local key is still valid in GCP
2. Restart dev server:
   ```powershell
   cd frontend
   npm run dev
   ```
3. Clear browser cache (Ctrl+Shift+Delete)
4. If still broken, create new key (see above)

---

## 📊 Expected Outcome

**Before cleanup:**
```
GCP Console: 6 API keys
```

**After cleanup:**
```
GCP Console: 1 API key (your current one)
```

**Benefits:**
- ✅ Reduced security risk
- ✅ Easier to manage
- ✅ Clear which key is in use
- ✅ No confusion about old keys

---

## 🎯 Action Plan

**Right now (15 minutes):**

1. **Open GCP Console** (already open)
   ```powershell
   npm run open:gcp-creds
   ```

2. **For each of 6 keys, note:**
   - First 15 characters
   - Last used date
   - Creation date

3. **Find and DELETE the old exposed key:**
   - Look for: `AIzaSyD-nO...`
   - Click it
   - Click "DELETE KEY"
   - Confirm

4. **DELETE never-used keys:**
   - Look for: "Last used: Never"
   - Delete each one
   - Test app after each deletion

5. **Keep your current key:**
   - Make sure `AIzaSyCFCN...` is still there
   - This should be the only key remaining

6. **Test your app:**
   ```powershell
   cd frontend
   npm run dev
   ```

---

## ✅ Completion Checklist

- [ ] Identified all 6 keys in GCP Console
- [ ] Found the old exposed key (`AIzaSyD-nO...`)
- [ ] Deleted the old exposed key
- [ ] Deleted never-used keys
- [ ] Deleted old unused keys  
- [ ] Kept current active key (`AIzaSyCFCN...`)
- [ ] Tested app still works
- [ ] Final count: 1 key remaining

**When complete, you should have ONLY 1 key left!** ✅

---

## 📞 Need Help?

**Tell me:**
- First 15 characters of each of the 6 keys
- Creation dates
- Last used dates

I can help you decide which to keep and which to delete!

---

**Last Updated:** October 19, 2025  
**Status:** 6 keys found - Need to audit and clean up  
**Target:** 1 key remaining (current active key)
