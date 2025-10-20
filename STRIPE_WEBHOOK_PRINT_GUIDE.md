# 📄 Stripe Webhook Setup - Print Guide

---

## 🎯 WEBHOOK URL (Copy & Paste)

```
https://us-central1-tradehustleresumebuilder.cloudfunctions.net/stripeWebhook
```

---

## ✅ SETUP CHECKLIST

### Step 1: Stripe Dashboard
- [ ] Go to https://dashboard.stripe.com/webhooks
- [ ] Click **+ Add endpoint**
- [ ] Paste webhook URL above
- [ ] Select events (see list below)
- [ ] Click **Add endpoint**
- [ ] Copy signing secret (starts with `whsec_...`)

### Step 2: Firebase Configuration
- [ ] Run: `firebase functions:secrets:set STRIPE_WEBHOOK_SECRET`
- [ ] Paste signing secret when prompted
- [ ] Press Enter

### Step 3: Deploy
- [ ] Run: `firebase deploy --only functions`
- [ ] Wait for deployment to complete
- [ ] Verify no errors

### Step 4: Test
- [ ] Make test purchase with card: `4242 4242 4242 4242`
- [ ] Check Stripe webhook delivery logs
- [ ] Check Firebase function logs
- [ ] Verify user got Pro access in Firestore

---

## 📋 EVENTS TO SELECT IN STRIPE

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

**Copy-paste tip:** Select "Select all checkout events" and "Select all subscription events" in Stripe Dashboard

---

## 🧪 TEST CARD DETAILS

| Field | Value |
|-------|-------|
| Card Number | 4242 4242 4242 4242 |
| Expiry Date | 12/30 (any future date) |
| CVC | 123 (any 3 digits) |
| ZIP Code | 12345 (any 5 digits) |

---

## 📊 VERIFICATION STEPS

### Check Stripe Delivery
1. Go to: Developers → Webhooks
2. Click your endpoint
3. View "Recent deliveries" tab
4. Look for: ✅ 200 OK status

### Check Firebase Logs
```powershell
firebase functions:log --only stripeWebhook
```

Or visit:  
https://console.firebase.google.com/project/tradehustleresumebuilder/functions/logs

### Check Firestore
1. Go to: Firebase Console → Firestore
2. Navigate to: `subscriptions/{userId}`
3. Verify fields:
   - `subscriptionStatus: "active"`
   - `subscriptionTier: "pro_monthly"` or `"pro_annual"`
   - `subscriptionExpiry: [date 30 days from now]`

---

## 🚨 TROUBLESHOOTING

### Webhook Returns 401
**Problem:** `STRIPE_WEBHOOK_SECRET` not set  
**Solution:**
```powershell
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase deploy --only functions
```

### Webhook Returns 400
**Problem:** Invalid signature  
**Solution:**
- Verify webhook URL is exact (no typos)
- Check signing secret is correct in Firebase
- Ensure no query parameters in URL

### Events Not Processing
**Problem:** Function error  
**Solution:**
```powershell
firebase functions:log
# Check for errors in logs
```

### Local Testing
**Problem:** Can't test locally  
**Solution:**
```powershell
# Install Stripe CLI
stripe listen --forward-to http://localhost:5001/tradehustleresumebuilder/us-central1/api/webhook/stripe

# In another terminal
stripe trigger checkout.session.completed
```

---

## 📞 SUPPORT RESOURCES

| Resource | URL |
|----------|-----|
| Stripe Webhooks Docs | https://stripe.com/docs/webhooks |
| Stripe Dashboard | https://dashboard.stripe.com/webhooks |
| Firebase Console | https://console.firebase.google.com/project/tradehustleresumebuilder |
| Firebase Functions Logs | https://console.firebase.google.com/project/tradehustleresumebuilder/functions/logs |

---

## 📁 DOCUMENTATION FILES

1. **STRIPE_WEBHOOK_QUICKSTART.md** - Fast 5-minute guide
2. **STRIPE_WEBHOOK_SETUP.md** - Detailed documentation
3. **STRIPE_WEBHOOK_VISUAL_FLOW.md** - Visual flow diagrams
4. **STRIPE_WEBHOOK_COMPLETE.md** - Complete summary
5. **stripe-webhook-setup.html** - Interactive browser guide

---

## ✅ COMPLETION CHECKLIST

- [ ] Webhook added in Stripe Dashboard
- [ ] Signing secret saved in Firebase
- [ ] Functions deployed successfully
- [ ] Test purchase completed
- [ ] Webhook delivered (200 OK in Stripe)
- [ ] User granted Pro access
- [ ] Firestore subscription record created
- [ ] Email confirmation sent (if configured)

---

## 🎉 SUCCESS CRITERIA

You'll know it's working when:

1. ✅ User completes checkout with test card
2. ✅ Stripe sends webhook within 5 seconds
3. ✅ Webhook shows 200 OK in Stripe Dashboard
4. ✅ Firebase logs show "Webhook processed"
5. ✅ Firestore has subscription record with `status: "active"`
6. ✅ User can access Pro features immediately

**Total time from payment to access: ~5-10 seconds** ⚡

---

## 🚀 PRODUCTION DEPLOYMENT

### Before Going Live

1. [ ] Test with Stripe test mode
2. [ ] Verify all 10 events work correctly
3. [ ] Test subscription cancellation flow
4. [ ] Test failed payment handling
5. [ ] Set up monitoring alerts
6. [ ] Document runbook for team

### After Going Live

1. [ ] Monitor webhook delivery success rate (aim for >99%)
2. [ ] Check Firebase logs daily for first week
3. [ ] Verify no duplicate payments
4. [ ] Confirm email notifications send
5. [ ] Track user complaints (should be near zero)

---

**Built with hustle 💪 by Trade Hustle Resume Builder**

*Last Updated: October 18, 2025*

---

**Print this guide and keep it handy during setup!** 📄
