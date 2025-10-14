# 🚨 Deployment Issues & Solutions

## Current Status

**❌ Deployment Failed** - Multiple issues detected

### Issues Found:

1. **Secret/Environment Variable Conflict**
   - Error: "Secret environment variable overlaps non secret environment variable: STRIPE_SECRET_KEY"
   - Cause: You have both a Firebase secret AND an environment variable with the same name
   
2. **Container Health Check Failures**
   - All functions failed to start within timeout
   - Common cause: Code errors preventing Express app from listening on PORT 8080

3. **Environment Variable Approach**
   - `.env` files don't work well with Firebase Functions v2
   - Firebase config is deprecated (shutting down March 2026)

## 🎯 Solution: Use Firebase Secrets (Recommended)

Firebase Functions v2 uses Secret Manager instead of functions.config(). Here's the modern approach:

### Step 1: Remove Old Configuration

```powershell
# Remove the old Firebase config (deprecated)
firebase functions:config:unset stripe

# Delete the .env file (not used in production)
Remove-Item api-functions\.env
```

### Step 2: Set Up Firebase Secrets

```powershell
# Create secrets in Secret Manager
firebase functions:secrets:set STRIPE_SECRET_KEY
# When prompted, paste: sk_test_51SHW3qLr4v4blpwbWpaQ87KEHPJjt50QLAxnJSQjbcrCpjiGMViwToduT4Ey45Huu8yK5oVbHLo9ynWm9Ewd1i1j00xMQFLp86

firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
# When prompted, paste: whsec_VyOjYxkcsUXRhI1hrD2pHudzoSR9Pluq
```

### Step 3: Update Function Declarations

Update `api-functions/index.js` to use secrets:

```javascript
// At the top, add secret declarations
const {defineSecret} = require("firebase-functions/params");

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

// Update exports to include secrets
exports.createCheckout = onRequest(
  {secrets: [stripeSecretKey]},
  (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({error: "Method not allowed"});
    }
    const mockReq = {...req, url: "/api/create-checkout", path: "/api/create-checkout"};
    return app(mockReq, res);
  }
);

exports.stripeWebhook = onRequest(
  {secrets: [stripeSecretKey, stripeWebhookSecret]},
  (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({error: "Method not allowed"});
    }
    const mockReq = {...req, url: "/api/webhook/stripe", path: "/api/webhook/stripe"};
    return app(mockReq, res);
  }
);
```

### Step 4: Update Service Files

Update `api-functions/services/stripe.js`:

```javascript
// Remove Firebase functions config
// const functions = require("firebase-functions");
// const config = functions.config();

// Just use process.env (Secret Manager injects them automatically)
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeKey);
```

## 🔄 Alternative: Simpler .env Approach for Testing

If you just want to test locally without deployment:

### Option A: Local Testing Only

1. Keep the `.env` file for local development
2. Don't deploy - just test with emulators
3. Set environment variables manually in production

### Option B: Environment Variables (Not Secrets)

Instead of secrets, use regular environment variables:

```powershell
# Remove .env file
Remove-Item api-functions\.env

# Deploy without secrets
firebase deploy --only functions
```

Then set env vars in Cloud Console after deployment:
1. Go to: https://console.cloud.google.com/functions/list
2. Click each function → Edit → Runtime → Add variable
3. Add: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET

## 📋 Recommended Next Steps

### For Production (Most Secure):
1. Use Firebase Secrets (Secret Manager) as shown above
2. Update function declarations to include `secrets` parameter
3. Deploy

### For Quick Testing:
1. Remove `.env` file entirely
2. Comment out Stripe-related environment variables
3. Deploy the `app` function only (it includes all routes)
4. Set environment variables in Cloud Console UI

### The Fastest Fix:
Just deploy the main `app` function and skip individual exports:

```powershell
# Temporarily disable individual exports by commenting them out
# Keep only:
# exports.app = onRequest(app);

firebase deploy --only functions:app
```

Then access all routes via:
```
https://us-central1-tradehustleresumebuilder.cloudfunctions.net/app/api/create-checkout
https://us-central1-tradehustleresumebuilder.cloudfunctions.net/app/api/webhook/stripe
etc.
```

## 🎯 My Recommendation

**Deploy just the `app` function for now:**

1. Comment out all individual function exports in index.js (signup, createCheckout, etc.)
2. Keep only: `exports.app = onRequest(app);`
3. Deploy: `firebase deploy --only functions:app`
4. Set Stripe keys in Cloud Console UI for the `app` function
5. Test all routes through the single `app` endpoint

This avoids the complexity of secrets/individual functions and gets you running quickly!

---

*Would you like me to help implement any of these solutions?*
