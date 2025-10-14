# 🚀 Complete Deployment Guide - Trade Hustle Resume Builder

## Overview
This guide walks through deploying the complete backend infrastructure including:
- ✅ Stripe payment integration
- ✅ Firestore CRUD operations
- ✅ AI-powered resume enhancement (Gemini)
- ✅ Firebase Cloud Storage
- ✅ Authentication & authorization

---

## Prerequisites

### 1. Firebase Project Setup
```bash
firebase login
firebase use --add
```

### 2. Enable Firebase Services
- **Authentication**: Email/Password, Google OAuth
- **Firestore Database**: Production mode
- **Cloud Storage**: Default bucket
- **Cloud Functions**: Billing enabled (Blaze plan)

### 3. Enable Google Cloud APIs
- Vertex AI API
- Cloud Storage API
- Identity Platform API

---

## Step 1: Install Dependencies

```powershell
# Navigate to api-functions
cd api-functions

# Install all dependencies including Stripe
npm install

# Expected packages:
# - stripe@^17.5.0 (NEW)
# - @google-cloud/vertexai@^1.10.0
# - firebase-functions@^6.5.0
# - express@^5.1.0
# - firebase-admin@^12.7.0
```

---

## Step 2: Fix Linting Errors

```powershell
# Auto-fix CRLF line endings (Windows → Unix)
npm run lint -- --fix

# Verify no errors remain
npm run lint
```

**Expected Output**: 
```
✔ 0 problems (0 errors, 0 warnings)
```

---

## Step 3: Configure Environment Variables

Create `api-functions/.env`:

```env
# Firebase Admin (auto-configured in Cloud Functions)
# FIREBASE_CONFIG is provided automatically

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Stripe Price IDs (create in Stripe Dashboard)
STRIPE_PRICE_TRIAL=price_YOUR_TRIAL_PRICE_ID
STRIPE_PRICE_PRO_MONTHLY=price_1SHfAyLr4v4blpwbcvDqbej8
STRIPE_PRICE_PRO_ANNUAL=price_YOUR_ANNUAL_PRICE_ID
STRIPE_PRICE_BLUEPRINT=price_YOUR_BLUEPRINT_PRICE_ID

# Google AI Configuration
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
GOOGLE_CLOUD_PROJECT=your-project-id

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## Step 4: Create Stripe Products

### In Stripe Dashboard (https://dashboard.stripe.com):

1. **Trial Product** - $2.00 one-time
   - Price ID: Copy and set as `STRIPE_PRICE_TRIAL`

2. **Pro Monthly** - $14.95/month recurring
   - Price ID: Copy and set as `STRIPE_PRICE_PRO_MONTHLY`

3. **Pro Annual** - $119.00/year recurring
   - Price ID: Copy and set as `STRIPE_PRICE_PRO_ANNUAL`

4. **Career Blueprint** - $29.00 one-time
   - Price ID: Copy and set as `STRIPE_PRICE_BLUEPRINT`

### Set Up Webhook Endpoint

1. Go to: **Developers → Webhooks**
2. Add endpoint: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/stripeWebhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret → Set as `STRIPE_WEBHOOK_SECRET`

---

## Step 5: Deploy Functions

### Deploy All Functions:
```powershell
firebase deploy --only functions
```

### Or Deploy Individually:
```powershell
# Stripe functions
firebase deploy --only functions:createCheckout
firebase deploy --only functions:stripeWebhook
firebase deploy --only functions:getSubscription
firebase deploy --only functions:cancelSubscription
firebase deploy --only functions:createPortalSession

# Legacy functions (already deployed)
firebase deploy --only functions:signup
firebase deploy --only functions:unlockResume
firebase deploy --only functions:editResume
firebase deploy --only functions:geminiAgent

# Main Express app
firebase deploy --only functions:app
```

---

## Step 6: Set Production Environment Variables

```powershell
# Set Stripe secret key
firebase functions:config:set stripe.secret_key="sk_live_..."

# Set Stripe webhook secret
firebase functions:config:set stripe.webhook_secret="whsec_..."

# Set Stripe price IDs
firebase functions:config:set stripe.price_trial="price_..."
firebase functions:config:set stripe.price_pro_monthly="price_..."
firebase functions:config:set stripe.price_pro_annual="price_..."
firebase functions:config:set stripe.price_blueprint="price_..."

# Set Google API key
firebase functions:config:set google.api_key="YOUR_GEMINI_API_KEY"

# View all config
firebase functions:config:get
```

---

## Step 7: Update Frontend API URLs

In `frontend/.env.local`:

```env
# Firebase Functions URL (update with your region + project ID)
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net

# Or use the general domain
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://YOUR_PROJECT_ID-YOUR_REGION.web.app

# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
```

---

## Step 8: Test API Endpoints

### Test Authentication:
```powershell
# Get ID token from Firebase Auth
$idToken = "YOUR_USER_ID_TOKEN"

# Test get user resumes
curl -X GET "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/app/api/resumes" `
  -H "Authorization: Bearer $idToken"
```

### Test Stripe Checkout:
```powershell
curl -X POST "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/createCheckout" `
  -H "Authorization: Bearer $idToken" `
  -H "Content-Type: application/json" `
  -d '{
    "priceId": "price_1SHfAyLr4v4blpwbcvDqbej8",
    "successUrl": "https://yourdomain.com/success",
    "cancelUrl": "https://yourdomain.com/cancel"
  }'
```

### Test AI Suggestions:
```powershell
curl -X POST "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/app/api/ai/suggestions" `
  -H "Authorization: Bearer $idToken" `
  -H "Content-Type: application/json" `
  -d '{
    "resumeContent": "Electrician with 5 years experience...",
    "trade": "electrician"
  }'
```

---

## Step 9: Set Up Firestore Indexes

### Required Indexes:

1. **Resumes Collection**:
   - Fields: `userId` (Ascending), `updatedAt` (Descending)

2. **Jobs Collection**:
   - Fields: `userId` (Ascending), `appliedDate` (Descending)
   - Fields: `userId` (Ascending), `status` (Ascending), `appliedDate` (Descending)

3. **Certifications Collection**:
   - Fields: `userId` (Ascending), `issueDate` (Descending)

4. **Blueprints Collection**:
   - Fields: `userId` (Ascending), `updatedAt` (Descending)

5. **Referrals Collection**:
   - Fields: `userId` (Ascending), `createdAt` (Descending)
   - Fields: `referralCode` (Ascending)

### Create Indexes:
```bash
# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

Or create via Firebase Console → Firestore → Indexes

---

## Step 10: Configure CORS

Update `firebase.json` hosting section:

```json
{
  "hosting": {
    "public": "frontend/out",
    "headers": [
      {
        "source": "/api/**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          },
          {
            "key": "Access-Control-Allow-Methods",
            "value": "GET,POST,PUT,DELETE,OPTIONS"
          },
          {
            "key": "Access-Control-Allow-Headers",
            "value": "Authorization,Content-Type"
          }
        ]
      }
    ]
  }
}
```

---

## Step 11: Monitor Deployment

### Check Function Logs:
```powershell
# Tail all logs
firebase functions:log

# Filter by function
firebase functions:log --only createCheckout

# View in Cloud Console
https://console.cloud.google.com/functions/list
```

### Check for Errors:
```powershell
# View error logs
firebase functions:log --only-errors

# Check specific time range
firebase functions:log --since 1h
```

---

## Step 12: Test Complete User Flow

1. **Sign Up** → `POST /api/signup`
2. **Authenticate** → Get Firebase ID token
3. **Create Resume** → `POST /api/resumes`
4. **Get AI Suggestions** → `POST /api/ai/suggestions`
5. **Calculate ATS Score** → `POST /api/ai/ats-score`
6. **Create Checkout** → `POST /api/create-checkout`
7. **Complete Payment** → Stripe redirect
8. **Webhook Received** → `POST /api/webhook/stripe`
9. **Check Subscription** → `GET /api/subscription`

---

## Troubleshooting

### Issue: "STRIPE_SECRET_KEY not defined"
**Fix**: Ensure environment variables are set:
```powershell
firebase functions:config:set stripe.secret_key="sk_live_..."
firebase deploy --only functions
```

### Issue: "Vertex AI permission denied"
**Fix**: Enable Vertex AI API in Cloud Console:
```
https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
```

### Issue: "CORS preflight failed"
**Fix**: Add CORS middleware to Express app (already included in index.js)

### Issue: "Function timeout"
**Fix**: Increase timeout in firebase.json:
```json
{
  "functions": [
    {
      "source": "api-functions",
      "runtime": "nodejs20",
      "timeout": "60s"
    }
  ]
}
```

---

## Production Checklist

- [ ] All linting errors fixed (`npm run lint`)
- [ ] Environment variables configured
- [ ] Stripe products created and price IDs set
- [ ] Stripe webhook endpoint configured
- [ ] Firestore indexes created
- [ ] Functions deployed successfully
- [ ] Test all API endpoints with real auth tokens
- [ ] Monitor function logs for errors
- [ ] Test complete user flow end-to-end
- [ ] Set up error monitoring (Sentry, Cloud Logging)

---

## API Endpoints Summary

### Authentication:
- `POST /api/signup` - Email signup with honeypot

### Resumes:
- `POST /api/resumes` - Create/update resume
- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/:id` - Get single resume
- `DELETE /api/resumes/:id` - Delete resume

### Jobs:
- `POST /api/jobs` - Create job entry
- `GET /api/jobs` - Get user's jobs
- `PUT /api/jobs/:id` - Update job status
- `DELETE /api/jobs/:id` - Delete job

### AI Enhancement:
- `POST /api/ai/suggestions` - Resume suggestions
- `POST /api/ai/ats-score` - Calculate ATS score
- `POST /api/ai/enhance` - Enhance achievement
- `POST /api/ai/match-job` - Match job description

### Payments (Stripe):
- `POST /api/create-checkout` - Create checkout session
- `POST /api/webhook/stripe` - Stripe webhook handler
- `GET /api/subscription` - Get subscription details
- `POST /api/cancel-subscription` - Cancel subscription
- `POST /api/create-portal-session` - Customer portal

### Legacy:
- `POST /unlock-resume` - Unlock resume PDF
- `POST /edit-resume` - Gemini resume editing
- `POST /api/geminiAgent` - General AI agent

---

## Cost Estimates

### Firebase Functions:
- **Free tier**: 2M invocations/month, 400K GB-sec
- **Paid**: $0.40 per million invocations

### Vertex AI (Gemini):
- **Gemini 2.0 Flash**: ~$0.01 per 1K characters
- **Expected**: $5-20/month for moderate usage

### Stripe:
- **Transaction fees**: 2.9% + $0.30 per successful charge
- **Monthly fee**: $0 (no subscription cost)

### Firestore:
- **Reads**: $0.06 per 100K documents
- **Writes**: $0.18 per 100K documents
- **Storage**: $0.18 per GB/month

**Total Estimated Cost**: $20-50/month for 100-500 active users

---

*Generated for Trade Hustle Resume Builder v1.0*
*Last Updated: $(Get-Date)*
