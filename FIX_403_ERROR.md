# 🔓 Fixing 403 Forbidden Error on Firebase Functions

## Problem
Firebase Functions v2 (Cloud Run) returns 403 Forbidden because it requires authentication by default.

## Solution

You need to **allow unauthenticated access** to your Cloud Run service. Here are 3 methods:

---

## Method 1: Firebase Console (Easiest)

1. Go to: https://console.firebase.google.com/project/tradehustleresumebuilder/functions
2. Click on the **`app`** function
3. Click **"Permissions"** tab
4. Click **"Add Principal"**
5. In "New principals": Enter `allUsers`
6. In "Role": Select **"Cloud Run Invoker"**
7. Click **"Save"**

---

## Method 2: Google Cloud Console

1. Go to: https://console.cloud.google.com/run?project=tradehustleresumebuilder
2. Click on service **`app`**
3. Click **"Security"** tab
4. Click **"Add Principal"**
5. Principal: `allUsers`
6. Role: **"Cloud Run Invoker"**
7. Click **"Save"**

---

## Method 3: gcloud CLI Command

```bash
# Allow unauthenticated access
gcloud run services add-iam-policy-binding app \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker \
  --project=tradehustleresumebuilder
```

---

## Method 4: Update firebase.json (Recommended for New Deployments)

Update your `firebase.json` to include `invoker` setting:

```json
{
  "functions": {
    "source": "api-functions",
    "runtime": "nodejs20",
    "invoker": ["public"]
  }
}
```

Then redeploy:
```bash
firebase deploy --only functions:app
```

---

## Verify Fix

After applying one of the methods above, test:

```bash
# Should return: "🚀 Trade Hustle Resume Builder backend is live!"
curl https://app-fbs5jy4frq-uc.a.run.app/

# Should return health status
curl https://app-fbs5jy4frq-uc.a.run.app/api/health
```

---

## Security Note

⚠️ **This makes your API publicly accessible**. You should still have:
- ✅ Rate limiting (already implemented with express-rate-limit)
- ✅ Honeypot protection (already implemented)
- ✅ Firebase Auth tokens for protected endpoints (already implemented with verifyUser middleware)

Your protected endpoints still require auth tokens:
- `/api/subscription/create` ← Requires Bearer token
- `/api/subscription/status` ← Requires Bearer token
- `/api/unlockResume` ← Requires Bearer token
- `/api/editResume` ← Requires Bearer token

Public endpoints:
- `/` ← Status check
- `/api/health` ← Health check
- `/api/signup` ← Public signup (honeypot protected)

---

## Alternative: Keep Auth Required

If you want to keep authentication required and call from frontend only:

1. Frontend gets Firebase Auth ID token
2. Pass token in request headers:
   ```javascript
   const token = await currentUser.getIdToken();
   fetch('https://app-fbs5jy4frq-uc.a.run.app/api/endpoint', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   });
   ```

But this means health checks and status endpoints won't work without auth.

---

## Recommended Action

**Use Method 1 or Method 4** to allow public access, keeping your protected endpoints secure with Firebase Auth tokens.
