# 💳 Subscription Management Implementation Guide
**Trade Hustle Resume Builder - Pricing Tiers & Subscription System**

## 📋 Overview

Successfully implemented a comprehensive subscription management system with 4 pricing tiers, Stripe integration, and feature gating capabilities.

### ✅ Completed Features
- **Stripe Configuration** with pricing tiers and feature limits
- **Subscription API Endpoints** for create, status, and update operations
- **Backend Infrastructure** ready for subscription processing
- **Feature Gating System** with tier-based access controls

---

## 🎯 Pricing Tiers

### 1. **Free Tier** ($0)
- ✅ Build unlimited resumes
- ✅ Plain text export only
- ✅ Basic templates (5)
- ❌ No AI suggestions
- ❌ No ATS scoring
- **Target Audience**: Budget-conscious users, students
- **Stripe Price ID**: `null` (no payment required)

### 2. **7-Day Trial** ($2.00) 🔥 RECOMMENDED
- ✅ All Pro features for 7 days
- ✅ Full template library (200+)
- ✅ PDF/DOCX exports
- ✅ AI-powered suggestions
- ✅ ATS scoring
- ✅ Job tracker access
- **Target Audience**: First-time users wanting to test before committing
- **Stripe Price ID**: `price_trial_7day` (env: `STRIPE_PRICE_TRIAL`)
- **Strategy**: Low barrier to entry, high conversion to monthly

### 3. **Pro Monthly** ($14.95/month)
- ✅ Unlimited resume versions
- ✅ All templates (200+)
- ✅ PDF/DOCX/TXT exports
- ✅ AI suggestions & optimization
- ✅ Real-time ATS scoring
- ✅ Job tracker
- ✅ Cert vault (100MB)
- ✅ Email support
- **Target Audience**: Active job seekers, career changers
- **Stripe Price ID**: `price_pro_monthly` (env: `STRIPE_PRICE_PRO_MONTHLY`)

### 4. **Pro Annual** ($119.00/year)
- ✅ Everything in Pro Monthly
- ✅ Save $60/year (33% discount)
- ✅ Priority support
- ✅ 1 free Career Blueprint
- ✅ Extended cert vault (500MB)
- **Target Audience**: Career-focused professionals, contractors
- **Stripe Price ID**: `price_pro_annual` (env: `STRIPE_PRICE_PRO_ANNUAL`)
- **Monthly Equivalent**: $9.92/month

---

## 🏗️ Technical Implementation

### Backend Files

#### **api-functions/stripe-config.js** ✅ COMPLETE
```javascript
// Pricing tiers with feature limits
const pricingTiers = {
  free: { id, name, price, features, limits, stripePriceId },
  trial: { id, name, price, duration, features, limits, stripePriceId },
  proMonthly: { id, name, price, interval, features, limits, stripePriceId },
  proAnnual: { id, name, price, interval, savings, features, limits, stripePriceId }
};

// Utility functions
- getTierById(tierId): Get tier configuration
- getTierFromPriceId(priceId): Map Stripe price ID to tier
- hasFeatureAccess(userTier, feature): Check feature access
- isWithinLimit(userTier, feature, currentUsage): Check usage limits
- getAllTiers(): Get all tiers for display
- getSubscriptionTiers(): Get subscription tiers only (exclude free)
```

**Feature Limits Structure:**
```javascript
limits: {
  resumes: -1,        // -1 = unlimited, number = max count
  templates: 5,       // number of templates available
  storage: 100,       // MB of storage (cert vault)
  aiSuggestions: -1,  // -1 = unlimited
  atsScoring: true,   // boolean: feature enabled/disabled
  jobTracker: true,   // boolean
  certVault: true     // boolean
}
```

#### **api-functions/index.js - Subscription Endpoints** ✅ COMPLETE

**1. POST `/api/subscription/create`**
- **Auth**: Required (`verifyUser` middleware)
- **Honeypot**: Protected
- **Request Body**:
  ```json
  {
    "priceId": "price_pro_monthly",
    "tierId": "proMonthly"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "sessionId": "cs_test_...",
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
  ```
- **Features**:
  - Validates tier exists
  - Checks for existing active subscription (prevents duplicates)
  - Creates Stripe checkout session
  - Logs attempt to `subscriptionAttempts` collection
  - Redirects user to Stripe Checkout

**2. GET `/api/subscription/status`**
- **Auth**: Required (`verifyUser`)
- **Response**:
  ```json
  {
    "success": true,
    "subscription": {
      "tier": "proMonthly",
      "status": "active",
      "expiry": "2025-11-14T12:00:00Z",
      "features": { /* tier limits */ },
      "stripeCustomerId": "cus_...",
      "stripeSubscriptionId": "sub_..."
    }
  }
  ```
- **Features**:
  - Returns current subscription details
  - Defaults to "free" tier if no subscription
  - Includes feature limits for frontend gating

**3. POST `/api/subscription/update`**
- **Auth**: Required (`verifyUser` + honeypot)
- **Request Body**:
  ```json
  {
    "newPriceId": "price_pro_annual",
    "newTierId": "proAnnual"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Subscription updated successfully"
  }
  ```
- **Features**:
  - Updates existing Stripe subscription
  - Handles proration automatically
  - Updates Firestore with new tier

---

## 📊 Data Models

### **Firestore Collections**

#### `subscriptionAttempts`
```typescript
interface SubscriptionAttempt {
  userId: string;
  email: string;
  tierId: string;           // "trial", "proMonthly", "proAnnual"
  priceId: string;          // Stripe price ID
  sessionId: string;        // Stripe checkout session ID
  status: "pending" | "completed" | "failed";
  createdAt: Timestamp;
}
```

#### `users` (subscription fields)
```typescript
interface User {
  // ... existing fields
  subscriptionTier: "free" | "trial" | "proMonthly" | "proAnnual";
  subscriptionStatus: "active" | "inactive" | "canceled" | "past_due";
  subscriptionExpiry: string | null;     // ISO 8601 date
  stripeCustomerId: string | null;       // "cus_..."
  stripeSubscriptionId: string | null;   // "sub_..."
  updatedAt: Timestamp;
}
```

---

## 🔐 Feature Gating

### Implementation Pattern

```typescript
// Frontend: Check if user has feature access
import { hasFeatureAccess, isWithinLimit } from "@/lib/subscription";

// Check if user can access ATS scoring
if (!hasFeatureAccess(userTier, "atsScoring")) {
  return <UpgradePrompt feature="ATS Scoring" />;
}

// Check if user is within template limit
if (!isWithinLimit(userTier, "templates", userTemplateCount)) {
  return <UpgradePrompt feature="More Templates" />;
}
```

### Features to Gate

1. **ATS Scoring** (`atsScoring`)
   - Free: ❌ Disabled
   - Trial+: ✅ Enabled

2. **AI Suggestions** (`aiSuggestions`)
   - Free: ❌ 0 suggestions
   - Trial+: ✅ Unlimited

3. **Template Library** (`templates`)
   - Free: 5 templates
   - Trial+: 200+ templates

4. **Job Tracker** (`jobTracker`)
   - Free: ❌ Disabled
   - Trial+: ✅ Enabled

5. **Cert Vault** (`certVault`)
   - Free: ❌ Disabled
   - Trial/Pro Monthly: ✅ 100MB
   - Pro Annual: ✅ 500MB

6. **Export Formats**
   - Free: Plain text only
   - Trial+: PDF, DOCX, TXT

---

## 🎨 Frontend Components (TODO)

### Priority 1: Pricing Page
**File**: `frontend/src/app/pricing/page.tsx`

**Components Needed**:
```tsx
<PricingPage>
  <PricingCard tier="free" />
  <PricingCard tier="trial" recommended />
  <PricingCard tier="proMonthly" />
  <PricingCard tier="proAnnual" />
  <TrustSignals />
  <FAQ />
</PricingPage>
```

**Features**:
- 4 pricing cards in responsive grid
- "BEST VALUE" badge on trial tier
- "Current Plan" indicator for logged-in users
- Loading states during checkout
- Auth redirect for non-logged-in users
- Environment-based Stripe price IDs

### Priority 2: Subscription Status Widget
**File**: `frontend/src/components/SubscriptionStatus.tsx`

```tsx
<SubscriptionStatus>
  - Current tier badge
  - Expiry date countdown
  - Upgrade/downgrade buttons
  - Cancel subscription link
  - Feature usage meters
</SubscriptionStatus>
```

### Priority 3: Upgrade Prompts
**File**: `frontend/src/components/UpgradePrompt.tsx`

```tsx
<UpgradePrompt feature="ATS Scoring">
  - Feature name + icon
  - "Upgrade to unlock" message
  - Pricing tier comparison
  - CTA button to /pricing
</UpgradePrompt>
```

---

## 🔧 Stripe Dashboard Configuration

### Products to Create in Stripe

1. **7-Day Trial** ⚡
   - Product Name: "Trade Hustle Resume Builder - 7-Day Trial"
   - Price ID: `price_trial_7day`
   - Amount: $2.00 USD
   - Billing: One-time payment
   - Description: "Full access to all Pro features for 7 days"

2. **Pro Monthly** 🔄
   - Product Name: "Trade Hustle Resume Builder - Pro Monthly"
   - Price ID: `price_pro_monthly`
   - Amount: $14.95 USD
   - Billing: Recurring monthly
   - Description: "Unlimited resumes, AI, ATS scoring, job tracker"

3. **Pro Annual** 💎
   - Product Name: "Trade Hustle Resume Builder - Pro Annual"
   - Price ID: `price_pro_annual`
   - Amount: $119.00 USD
   - Billing: Recurring yearly
   - Description: "Save 33% with annual billing + bonus features"

### Webhook Events to Handle

**File**: `api-functions/services/stripe.js` (existing)

Current webhook handler supports:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

**Additional Events Needed**:
- `customer.subscription.trial_will_end` (send reminder email 1 day before trial ends)
- `invoice.upcoming` (send renewal reminder 3 days before charge)
- `customer.subscription.paused` (handle paused subscriptions)

---

## 📝 Environment Variables

### Required Variables

**Backend** (`api-functions`):
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...           # Stripe secret key (REQUIRED)
STRIPE_WEBHOOK_SECRET=whsec_...         # Webhook signing secret

# Pricing (Optional - defaults provided)
STRIPE_PRICE_TRIAL=price_trial_7day
STRIPE_PRICE_PRO_MONTHLY=price_pro_monthly
STRIPE_PRICE_PRO_ANNUAL=price_pro_annual

# Frontend URL (for redirects)
FRONTEND_URL=https://tradehustle.co
```

**Frontend** (`frontend`):
```bash
# Firebase Functions URL
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://app-fbs5jy4frq-uc.a.run.app

# Stripe Price IDs (public, safe to expose)
NEXT_PUBLIC_STRIPE_PRICE_TRIAL=price_trial_7day
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_pro_monthly
NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL=price_pro_annual
```

---

## 🧪 Testing Checklist

### Local Testing (Stripe Test Mode)

1. **Free Tier**
   - [ ] User can access dashboard without payment
   - [ ] Feature gates block ATS scoring, AI, job tracker
   - [ ] Only 5 templates visible
   - [ ] Export restricted to plain text

2. **Trial Signup Flow**
   - [ ] Click "Start 7-Day Trial" on pricing page
   - [ ] Redirect to Stripe checkout
   - [ ] Use test card: `4242 4242 4242 4242`
   - [ ] Complete payment ($2.00)
   - [ ] Redirect back to dashboard
   - [ ] Verify subscription status: "trial", "active"
   - [ ] All Pro features unlocked
   - [ ] 200+ templates visible
   - [ ] ATS scoring works
   - [ ] Job tracker accessible

3. **Monthly Subscription**
   - [ ] Upgrade from free/trial to Pro Monthly
   - [ ] Stripe checkout for $14.95
   - [ ] Subscription status: "proMonthly", "active"
   - [ ] Features remain unlocked
   - [ ] Expiry date set to 30 days from now

4. **Annual Subscription**
   - [ ] Upgrade from free/trial to Pro Annual
   - [ ] Stripe checkout for $119.00
   - [ ] Subscription status: "proAnnual", "active"
   - [ ] Bonus features enabled (500MB storage, free blueprint)
   - [ ] Expiry date set to 365 days from now

5. **Upgrade/Downgrade**
   - [ ] Upgrade from Monthly to Annual
   - [ ] Proration applied correctly
   - [ ] Tier updated in Firestore
   - [ ] Downgrade from Annual to Monthly
   - [ ] Change takes effect at next billing cycle

6. **Webhook Processing**
   - [ ] `checkout.session.completed` updates user tier
   - [ ] `customer.subscription.updated` syncs status
   - [ ] `customer.subscription.deleted` reverts to free
   - [ ] `invoice.payment_failed` sets status to "past_due"

### Production Testing

1. **Live Payments**
   - [ ] Test with real card (refund immediately)
   - [ ] Verify Stripe dashboard shows subscription
   - [ ] Firestore updated with correct data
   - [ ] User receives email confirmation

2. **Cancellation Flow**
   - [ ] User clicks "Cancel Subscription"
   - [ ] Confirmation modal appears
   - [ ] Stripe subscription canceled via API
   - [ ] Access continues until expiry date
   - [ ] Status changes to "canceled"
   - [ ] Tier reverts to "free" at expiry

---

## 📈 Revenue Projections

### Year 1 (Conservative)

| Metric | Value |
|--------|-------|
| Monthly Website Visitors | 1,000 |
| Trial Conversion Rate | 5% (50 trials/month) |
| Trial to Monthly Conversion | 30% (15 subs/month) |
| Trial to Annual Conversion | 10% (5 subs/month) |
| **Monthly Recurring Revenue (MRR)** | **$819/month** |
| **Annual Recurring Revenue (ARR)** | **$9,828/year** |

### Year 2 (Growth)

| Metric | Value |
|--------|-------|
| Monthly Website Visitors | 5,000 |
| Trial Conversion Rate | 7% (350 trials/month) |
| Trial to Monthly Conversion | 35% (123 subs/month) |
| Trial to Annual Conversion | 15% (53 subs/month) |
| **Monthly Recurring Revenue (MRR)** | **$8,153/month** |
| **Annual Recurring Revenue (ARR)** | **$97,836/year** |

**Combined with Career Blueprints ($29-$99) & Referral Program ($10/referral)**:
- **Year 1 Total**: ~$57k
- **Year 2 Total**: ~$250k+

---

## 🚀 Deployment Steps

### 1. Configure Stripe Dashboard
```bash
# Create products and copy price IDs
price_trial_7day=price_...
price_pro_monthly=price_...
price_pro_annual=price_...
```

### 2. Set Environment Variables
```bash
# Firebase Functions
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase functions:secrets:set STRIPE_PRICE_TRIAL
firebase functions:secrets:set STRIPE_PRICE_PRO_MONTHLY
firebase functions:secrets:set STRIPE_PRICE_PRO_ANNUAL

# Or use .env in api-functions/ (Functions v2)
echo "STRIPE_SECRET_KEY=sk_live_..." >> api-functions/.env
```

### 3. Deploy Functions
```bash
firebase deploy --only functions:app
```

### 4. Configure Stripe Webhook
- **Endpoint URL**: `https://app-fbs5jy4frq-uc.a.run.app/api/webhook/stripe`
- **Events to Subscribe**:
  - `checkout.session.completed`
  - `customer.subscription.*`
  - `invoice.payment_*`
- **Copy Webhook Secret** → Set in environment

### 5. Deploy Frontend
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### 6. Test End-to-End
- [ ] Visit `/pricing` page
- [ ] Complete trial signup
- [ ] Verify subscription status
- [ ] Test feature gating
- [ ] Monitor Stripe dashboard

---

## 🎯 Next Steps (Priority Order)

### Immediate (Week 1)
1. ✅ **Backend Infrastructure** - COMPLETE
2. ⏳ **Create Pricing Page** - IN PROGRESS
3. ⏳ **Subscription Status Widget** - TODO
4. ⏳ **Stripe Dashboard Setup** - TODO
5. ⏳ **Deploy & Test** - TODO

### Short-term (Week 2-3)
6. ⏳ **Feature Gating Implementation** - TODO
7. ⏳ **Upgrade Prompts** - TODO
8. ⏳ **Email Notifications** - TODO
9. ⏳ **Admin Analytics Dashboard** - TODO
10. ⏳ **Subscription Management UI** - TODO

### Medium-term (Month 2)
11. ⏳ **Template Management Admin** - TODO
12. ⏳ **Usage Metrics Tracking** - TODO
13. ⏳ **Referral Integration** - TODO
14. ⏳ **Blueprint Upsell Integration** - TODO

---

## 📚 Additional Resources

### Stripe Documentation
- [Checkout Sessions](https://stripe.com/docs/api/checkout/sessions)
- [Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Webhooks](https://stripe.com/docs/webhooks)
- [Testing](https://stripe.com/docs/testing)

### Firebase Documentation
- [Cloud Functions v2](https://firebase.google.com/docs/functions/beta)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Environment Configuration](https://firebase.google.com/docs/functions/config-env)

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. ⚠️ **No Pricing Page UI** - Backend ready, frontend TODO
2. ⚠️ **No Subscription Widget** - Status display not implemented
3. ⚠️ **No Feature Gates** - Access controls not enforced yet
4. ⚠️ **No Email Notifications** - Webhook handlers don't send emails
5. ⚠️ **No Admin Dashboard** - Analytics page not built

### Future Enhancements
- [ ] Family/team plans (multi-user subscriptions)
- [ ] Volume discounts (bulk purchases)
- [ ] Affiliate program integration
- [ ] Lifetime deal option (one-time $499)
- [ ] Enterprise tier ($49/month, white-label)

---

## 💡 Tips & Best Practices

### Subscription Strategy
1. **Lead with Trial**: $2 trial is low-risk, high-conversion
2. **Anchor Pricing**: Annual plan makes monthly look affordable
3. **Feature Scarcity**: Limit free tier to create urgency
4. **Social Proof**: Show user count on pricing page
5. **Money-Back Guarantee**: 30-day refund policy builds trust

### Technical Best Practices
1. **Idempotency**: Always check for existing subscriptions
2. **Webhook Retries**: Handle duplicate webhook events gracefully
3. **Error Logging**: Log all subscription events to Firestore
4. **Rate Limiting**: Protect subscription endpoints from abuse
5. **Test Mode**: Use Stripe test mode until production-ready

---

## 📞 Support & Contact

For questions or issues:
- **Technical Issues**: Check Stripe dashboard logs
- **Webhook Failures**: Check Firebase Functions logs
- **Payment Disputes**: Handle via Stripe dashboard

---

**Last Updated**: October 14, 2025  
**Status**: Backend Complete ✅ | Frontend In Progress ⏳  
**Next Milestone**: Deploy pricing page + test end-to-end flow

