# 🎯 Stripe Webhook Quick Reference

## 📍 **Production Webhook URL**

```
https://us-central1-tradehustleresumebuilder.cloudfunctions.net/stripeWebhook
```

---

## ⚡ **Quick Setup (5 Minutes)**

### 1. Go to Stripe Dashboard
👉 [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)

### 2. Click **+ Add endpoint**

### 3. Paste URL
```
https://us-central1-tradehustleresumebuilder.cloudfunctions.net/stripeWebhook
```

### 4. Select Events
Copy-paste this list:
```
checkout.session.completed
checkout.session.expired
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.paid
invoice.payment_failed
invoice.payment_action_required
payment_intent.succeeded
payment_intent.payment_failed
```

### 5. Click **Add endpoint** → Copy the signing secret

### 6. Set Secret in Firebase
```powershell
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
# Paste your secret (starts with whsec_...)
```

### 7. Deploy
```powershell
firebase deploy --only functions
```

---

## ✅ **Done!**

Test with Stripe test card: `4242 4242 4242 4242`

---

## 🔍 **View Logs**

```powershell
firebase functions:log --only stripeWebhook
```

Or visit:
👉 [Firebase Console Logs](https://console.firebase.google.com/project/tradehustleresumebuilder/functions/logs)

---

## 📚 **Full Guide**

See `STRIPE_WEBHOOK_SETUP.md` for detailed documentation.
