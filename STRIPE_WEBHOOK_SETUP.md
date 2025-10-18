# 🎯 Stripe Webhook Setup Guide - Trade Hustle Resume Builder

## 🚀 Quick Start

Your Stripe webhook is **already implemented** and ready to receive events! This guide will help you configure it in your Stripe Dashboard.

---

## 📍 Your Webhook URLs

### **Production (Firebase Functions)**
```
https://us-central1-tradehustleresumebuilder.cloudfunctions.net/stripeWebhook
```

### **Alternative: Main API Endpoint**
```
https://app-fbs5jy4frq-uc.a.run.app/api/webhook/stripe
```

### **Local Development (with ngrok or similar)**
```
https://your-ngrok-url.ngrok.io/api/webhook/stripe
```

---

## 🔧 Step-by-Step Setup

### **Step 1: Access Stripe Dashboard**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **Webhooks**
3. Click **+ Add endpoint** button

---

### **Step 2: Configure Webhook Endpoint**

**Endpoint URL:**
```
https://us-central1-tradehustleresumebuilder.cloudfunctions.net/stripeWebhook
```

**Description:** (Optional)
```
Trade Hustle Resume Builder - Payment Events
```

**Events to listen to:**

Select the following events (these are the ones your backend handles):

#### ✅ **Subscription Events**
- `customer.subscription.created` - New subscription started
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription canceled

#### ✅ **Checkout Events**
- `checkout.session.completed` - Payment successful
- `checkout.session.expired` - Checkout expired

#### ✅ **Payment Events**
- `payment_intent.succeeded` - One-time payment succeeded
- `payment_intent.payment_failed` - Payment failed

#### ✅ **Invoice Events** (for recurring billing)
- `invoice.paid` - Invoice paid successfully
- `invoice.payment_failed` - Invoice payment failed
- `invoice.payment_action_required` - Action needed

---

### **Step 3: Save and Get Webhook Secret**

1. Click **Add endpoint**
2. Stripe will show you a **Signing secret** (starts with `whsec_...`)
3. **Copy this secret** - you'll need it in Step 4

Example:
```
whsec_1234567890abcdefghijklmnopqrstuvwxyz1234567890
```

---

### **Step 4: Add Secret to Firebase**

#### **Option A: Using Firebase CLI (Recommended)**

```powershell
# Set the webhook secret
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET

# When prompted, paste your webhook secret (whsec_...)
# Press Enter
```

#### **Option B: Using Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `tradehustleresumebuilder`
3. Navigate to **Secret Manager**
4. Click **Create Secret**
5. Name: `STRIPE_WEBHOOK_SECRET`
6. Value: Paste your webhook secret
7. Click **Create**

---

### **Step 5: Verify Configuration**

```powershell
# Check that the secret is set
firebase functions:secrets:access STRIPE_WEBHOOK_SECRET

# Redeploy functions to use the new secret
firebase deploy --only functions
```

---

## 🧪 Testing Your Webhook

### **Method 1: Stripe CLI (Best for Local Dev)**

```powershell
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local dev
stripe listen --forward-to http://localhost:5001/tradehustleresumebuilder/us-central1/api/webhook/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

### **Method 2: Stripe Dashboard**

1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Click **Send test webhook**
4. Select event type (e.g., `checkout.session.completed`)
5. Click **Send test webhook**

### **Method 3: Real Purchase Test**

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date (e.g., `12/30`)
3. Any 3-digit CVC (e.g., `123`)
4. Complete a checkout on your site
5. Check Firebase Functions logs for webhook receipt

---

## 📊 Monitoring Webhooks

### **View Webhook Logs in Stripe**

1. Go to **Developers** → **Webhooks**
2. Click on your endpoint
3. View **Recent deliveries** tab
4. Check status codes:
   - ✅ `200` = Success
   - ❌ `401` = Auth failed (check secret)
   - ❌ `500` = Server error (check logs)

### **View Firebase Functions Logs**

```powershell
# View real-time logs
firebase functions:log --only stripeWebhook

# Or view in console
# https://console.firebase.google.com/project/tradehustleresumebuilder/functions/logs
```

---

## 🔒 Security Features (Already Implemented)

Your webhook handler includes these security measures:

✅ **Signature Verification** - Uses `stripe.webhooks.constructEvent()`
✅ **Idempotency** - Prevents duplicate processing
✅ **Raw Body Parsing** - Required for signature validation
✅ **Error Handling** - Graceful failure with logging
✅ **Timeout Protection** - Returns 200 immediately, processes async

---

## 🎯 Events Your Backend Handles

```javascript
// api-functions/services/stripe.js

switch (event.type) {
  case "checkout.session.completed":
    // ✅ Grant subscription access
    // ✅ Send confirmation email
    // ✅ Update Firestore subscription record
    break;

  case "customer.subscription.created":
    // ✅ Log subscription start
    // ✅ Set subscription status to "active"
    break;

  case "customer.subscription.updated":
    // ✅ Handle plan changes
    // ✅ Update billing cycle
    break;

  case "customer.subscription.deleted":
    // ✅ Revoke access
    // ✅ Send cancellation email
    break;

  case "invoice.paid":
    // ✅ Extend subscription period
    // ✅ Send receipt
    break;

  case "invoice.payment_failed":
    // ✅ Send payment failure email
    // ✅ Mark subscription as past_due
    break;

  case "payment_intent.succeeded":
    // ✅ Handle one-time payments
    break;
}
```

---

## 🐛 Troubleshooting

### **Problem: Webhook Returns 401 Unauthorized**

**Solution:**
```powershell
# Check if secret is set
firebase functions:secrets:access STRIPE_WEBHOOK_SECRET

# If not set, add it
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET

# Redeploy
firebase deploy --only functions
```

### **Problem: Webhook Returns 400 Bad Request**

**Cause:** Invalid signature or body parsing issue

**Solution:**
- Ensure webhook URL is exactly: `/api/webhook/stripe`
- Don't add query parameters or trailing slashes
- Stripe sends raw body - your endpoint uses `express.raw()`

### **Problem: Events Not Processing**

**Check:**
1. View Firebase logs: `firebase functions:log`
2. Check Firestore for subscription records
3. Verify user ID in webhook metadata

### **Problem: Local Testing Not Working**

**Solution:**
```powershell
# Use Stripe CLI to forward webhooks
stripe listen --forward-to http://localhost:5001/tradehustleresumebuilder/us-central1/api/webhook/stripe

# Use the webhook secret provided by Stripe CLI (starts with whsec_)
# Add to your local .env file temporarily
```

---

## 📋 Webhook Event Flow

```
┌─────────────────────────────────────────────────────┐
│  User completes checkout on your site               │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Stripe processes payment                           │
│  ✅ Card charged                                    │
│  ✅ Subscription created                            │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Stripe sends webhook to your endpoint              │
│  POST https://...stripeWebhook                      │
│  Headers:                                           │
│    stripe-signature: t=123,v1=abc...                │
│  Body:                                              │
│    { type: "checkout.session.completed", ... }      │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Your Firebase Function receives webhook            │
│  1. Verify signature with STRIPE_WEBHOOK_SECRET     │
│  2. Parse event type                                │
│  3. Extract user ID from metadata                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  stripeService.handleWebhookEvent(event)            │
│  1. Update Firestore subscription                   │
│  2. Set status = "active"                           │
│  3. Set tier (trial, pro_monthly, pro_annual)       │
│  4. Set expiresAt (30 days from now)                │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Return 200 OK to Stripe                            │
│  { received: true }                                 │
└─────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  User now has Pro access! 🎉                        │
│  ✅ Can generate unlimited resumes                  │
│  ✅ Access to 200+ templates                        │
│  ✅ ATS optimization enabled                        │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Webhook Retry Logic

Stripe automatically retries failed webhooks:

- **Initial failure:** Retry immediately
- **2nd failure:** Wait 1 hour
- **3rd failure:** Wait 6 hours
- **4th+ failures:** Wait 24 hours between attempts
- **Gives up after:** 3 days (72 hours)

**Best Practice:** Return `200` quickly, process async

```javascript
// Your webhook already does this!
app.post("/api/webhook/stripe", async (req, res) => {
  // Verify signature first
  const event = stripe.webhooks.constructEvent(req.body, sig, secret);
  
  // Return 200 immediately
  res.status(200).json({ received: true });
  
  // Process event asynchronously
  await stripeService.handleWebhookEvent(event);
});
```

---

## 📞 Need Help?

### **Stripe Support**
- [Webhook Documentation](https://stripe.com/docs/webhooks)
- [Test Your Webhook](https://dashboard.stripe.com/test/webhooks)
- [Stripe CLI Guide](https://stripe.com/docs/stripe-cli)

### **Firebase Functions**
- [View Logs](https://console.firebase.google.com/project/tradehustleresumebuilder/functions/logs)
- [Secret Manager](https://console.cloud.google.com/security/secret-manager?project=tradehustleresumebuilder)

### **Debug Checklist**
```
✅ Webhook URL is correct
✅ STRIPE_WEBHOOK_SECRET is set in Firebase
✅ Functions are deployed (latest version)
✅ Webhook secret matches Stripe Dashboard
✅ Events are enabled in Stripe Dashboard
✅ Firebase Functions logs show no errors
✅ Firestore rules allow webhook writes
```

---

## 🎉 You're All Set!

Once you complete Steps 1-5, your Stripe webhook will:

1. ✅ Automatically activate subscriptions
2. ✅ Handle recurring billing
3. ✅ Process cancellations
4. ✅ Send email confirmations
5. ✅ Update user access in real-time

**Test it:** Make a purchase with card `4242 4242 4242 4242` and watch the magic happen! ✨

---

**Built with hustle 💪 by Trade Hustle Resume Builder**
