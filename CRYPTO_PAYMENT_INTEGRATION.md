# 🪙 Crypto Payment Integration Guide

## Trade Hustle Resume Builder - Complete Cryptocurrency Payment System

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Supported Cryptocurrencies](#supported-cryptocurrencies)
3. [Payment Providers](#payment-providers)
4. [Architecture](#architecture)
5. [Setup & Configuration](#setup--configuration)
6. [Frontend Integration](#frontend-integration)
7. [Backend API](#backend-api)
8. [Webhooks & Verification](#webhooks--verification)
9. [Testing](#testing)
10. [Security Best Practices](#security-best-practices)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### Why Crypto Payments?

✅ **Lower Fees**: 1-2% vs Stripe's 2.9% + $0.30  
✅ **Instant Settlement**: No 2-7 day delays  
✅ **Global Reach**: No country restrictions  
✅ **Privacy-Focused**: Appeals to Web3 audience  
✅ **No Chargebacks**: Irreversible payments  
✅ **24/7 Processing**: No banking hours

### Benefits Over Traditional Payments

| Feature | Crypto | Credit Card | PayPal |
|---------|--------|-------------|--------|
| **Fees** | 1-2% | 2.9% + $0.30 | 3.5% + $0.49 |
| **Settlement** | Instant | 2-7 days | 2-5 days |
| **Chargebacks** | None | Yes | Yes |
| **International** | ✅ Global | ❌ Limited | ❌ Limited |
| **Privacy** | High | Low | Medium |

---

## 💰 Supported Cryptocurrencies

### Primary Currencies

| Symbol | Name | Providers | Network Speed |
|--------|------|-----------|---------------|
| **BTC** | Bitcoin | Coinbase, NOWPayments | ~10-30 min |
| **ETH** | Ethereum | Coinbase, NOWPayments | ~2-5 min |
| **USDC** | USD Coin | Coinbase, NOWPayments | ~2-5 min |
| **USDT** | Tether | NOWPayments | ~2-5 min |
| **LTC** | Litecoin | Coinbase, NOWPayments | ~5-15 min |
| **BCH** | Bitcoin Cash | NOWPayments | ~10-30 min |
| **DOGE** | Dogecoin | Coinbase, NOWPayments | ~2-10 min |

### Stablecoins (Recommended)

For price stability, we recommend **USDC** or **USDT** to avoid volatility during payment processing.

---

## 🏦 Payment Providers

### Coinbase Commerce

**Features:**
- ✅ Multi-currency support (BTC, ETH, USDC, LTC, DOGE)
- ✅ Hosted payment pages
- ✅ Built-in QR codes
- ✅ Automatic conversion to USD
- ✅ 1% transaction fee

**Best For:** Users who want a simple, all-in-one solution

### NOWPayments

**Features:**
- ✅ 200+ cryptocurrencies
- ✅ Specific currency selection
- ✅ Lower fees (0.5-1%)
- ✅ Direct wallet deposits
- ✅ Instant Payment Notifications (IPN)

**Best For:** Users who want maximum cryptocurrency variety

---

## 🏗️ Architecture

### Payment Flow

```
┌─────────────┐
│   User      │
│ (Frontend)  │
└──────┬──────┘
       │
       │ 1. Select Crypto Payment
       ▼
┌─────────────────┐
│ CryptoPayment   │
│     Modal       │
└──────┬──────────┘
       │
       │ 2. Choose Provider & Currency
       ▼
┌─────────────────┐
│  Firebase       │
│  Functions API  │
└──────┬──────────┘
       │
       │ 3. Create Payment Charge
       ▼
┌─────────────────────────┐
│ Payment Provider API    │
│ (Coinbase/NOWPayments)  │
└──────┬──────────────────┘
       │
       │ 4. Return Payment Address
       ▼
┌─────────────────┐
│   User Pays     │
│  (Wallet/QR)    │
└──────┬──────────┘
       │
       │ 5. Blockchain Confirmation
       ▼
┌─────────────────┐
│   Webhook       │
│   Handler       │
└──────┬──────────┘
       │
       │ 6. Grant Access
       ▼
┌─────────────────┐
│   Firestore     │
│  (User Access)  │
└─────────────────┘
```

---

## ⚙️ Setup & Configuration

### 1. Environment Variables

#### Backend (Firebase Functions)

```bash
# Coinbase Commerce
COINBASE_COMMERCE_API_KEY=your_coinbase_api_key
COINBASE_COMMERCE_WEBHOOK_SECRET=your_webhook_secret

# NOWPayments
NOWPAYMENTS_API_KEY=your_nowpayments_api_key

# App URLs
NEXT_PUBLIC_APP_URL=https://tradehustleresume.web.app
FIREBASE_FUNCTIONS_URL=https://app-fbs5jy4frq-uc.a.run.app
```

#### Frontend (Next.js)

```bash
# In .env.local
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://app-fbs5jy4frq-uc.a.run.app
```

### 2. Coinbase Commerce Setup

1. **Create Account**: Go to [commerce.coinbase.com](https://commerce.coinbase.com)
2. **Get API Key**:
   - Navigate to Settings → API Keys
   - Create new API key
   - Copy key to `COINBASE_COMMERCE_API_KEY`
3. **Configure Webhook**:
   - Settings → Webhook subscriptions
   - Add webhook URL: `https://your-app.com/api/crypto/webhook/coinbase`
   - Copy webhook secret to `COINBASE_COMMERCE_WEBHOOK_SECRET`
   - Subscribe to: `charge:confirmed`, `charge:failed`, `charge:resolved`

### 3. NOWPayments Setup

1. **Create Account**: Go to [nowpayments.io](https://nowpayments.io)
2. **Get API Key**:
   - Dashboard → API Keys
   - Copy key to `NOWPAYMENTS_API_KEY`
3. **Configure IPN**:
   - Settings → IPN
   - IPN Callback URL: `https://your-app.com/api/crypto/webhook/nowpayments`

### 4. Deploy Functions

```bash
cd api-functions
npm install axios
firebase deploy --only functions
```

---

## 🎨 Frontend Integration

### Component Usage

```tsx
import CryptoPaymentModal from '@/components/CryptoPaymentModal';
import { trackCryptoPaymentInitiated } from '@/lib/analytics';

function CheckoutPage() {
  const [showCryptoModal, setShowCryptoModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowCryptoModal(true)}>
        ₿ Pay with Crypto
      </button>

      <CryptoPaymentModal
        isOpen={showCryptoModal}
        onClose={() => setShowCryptoModal(false)}
        tierId="pro-monthly"
        amount={14.95}
        tierName="Pro Monthly Subscription"
        onPaymentInitiated={(data) => {
          trackCryptoPaymentInitiated(
            'pro-monthly',
            14.95,
            data.currency || 'btc',
            data.provider
          );
        }}
      />
    </>
  );
}
```

### API Client Functions

```typescript
import { createCryptoPayment, getCryptoPaymentStatus } from '@/lib/api';

// Create payment
const payment = await createCryptoPayment(
  idToken,
  'pro-monthly',
  'coinbase',
  'btc'
);

// Check payment status
const status = await getCryptoPaymentStatus(idToken, payment.chargeCode);
```

---

## 🔌 Backend API

### Endpoints

#### 1. Create Crypto Payment

**POST** `/api/crypto/create-payment`

**Headers:**
```json
{
  "Authorization": "Bearer <firebase-id-token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "tierId": "pro-monthly",
  "provider": "coinbase",
  "currency": "btc"
}
```

**Response (Coinbase):**
```json
{
  "success": true,
  "provider": "coinbase_commerce",
  "chargeCode": "ABC123XYZ",
  "hostedUrl": "https://commerce.coinbase.com/charges/ABC123XYZ",
  "addresses": {
    "bitcoin": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "ethereum": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "litecoin": "ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  },
  "expiresAt": "2025-10-18T12:00:00Z"
}
```

**Response (NOWPayments):**
```json
{
  "success": true,
  "provider": "nowpayments",
  "invoiceId": 123456,
  "invoiceUrl": "https://nowpayments.io/payment/123456",
  "payAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "payAmount": 0.00032,
  "payCurrency": "BTC"
}
```

#### 2. Get Payment Status

**GET** `/api/crypto/payment-status/:paymentId`

**Response:**
```json
{
  "success": true,
  "status": "completed",
  "provider": "coinbase_commerce",
  "amount": 14.95,
  "currency": "USD",
  "createdAt": "2025-10-18T10:00:00Z",
  "confirmedAt": "2025-10-18T10:15:00Z"
}
```

#### 3. Supported Currencies

**GET** `/api/crypto/supported-currencies`

**Response:**
```json
{
  "success": true,
  "currencies": {
    "btc": {
      "name": "Bitcoin",
      "symbol": "BTC",
      "icon": "₿",
      "providers": ["coinbase", "nowpayments"]
    },
    ...
  }
}
```

---

## 🪝 Webhooks & Verification

### Coinbase Commerce Webhook

**Endpoint:** `POST /api/crypto/webhook/coinbase`

**Events Handled:**
- `charge:confirmed` - Payment confirmed (1+ confirmations)
- `charge:resolved` - Payment fully completed
- `charge:failed` - Payment failed/expired

**Implementation:**
```javascript
app.post("/api/crypto/webhook/coinbase", async (req, res) => {
  const signature = req.headers["x-cc-webhook-signature"];
  
  // Verify signature
  if (!verifyCoinbaseWebhook(signature, req.body)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(req.body);
  await processCoinbaseWebhook(event);

  res.json({ received: true });
});
```

### NOWPayments IPN

**Endpoint:** `POST /api/crypto/webhook/nowpayments`

**Events Handled:**
- `waiting` - Awaiting payment
- `confirming` - Payment received, confirming
- `confirmed` - Payment confirmed
- `finished` - Payment fully completed
- `failed` - Payment failed/expired

---

## 🧪 Testing

### Test with Coinbase Commerce

1. **Sandbox Mode**:
   - Use Coinbase Commerce test API keys
   - Test payments without real crypto

2. **Test Flow**:
   ```bash
   # Create test payment
   curl -X POST https://your-app.com/api/crypto/create-payment \
     -H "Authorization: Bearer $ID_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "tierId": "trial",
       "provider": "coinbase",
       "currency": "btc"
     }'
   ```

3. **Simulate Webhook**:
   ```bash
   curl -X POST https://your-app.com/api/crypto/webhook/coinbase \
     -H "X-CC-Webhook-Signature: test_signature" \
     -d '{
       "event": {
         "type": "charge:confirmed",
         "data": {
           "code": "TEST123",
           "timeline": []
         }
       }
     }'
   ```

### Test with NOWPayments

1. **Sandbox API**:
   - Use `https://api-sandbox.nowpayments.io`
   - Test with testnet cryptocurrencies

2. **Manual Test**:
   - Create small test payment ($0.50)
   - Use testnet wallet
   - Verify webhook reception

---

## 🔒 Security Best Practices

### 1. Webhook Verification

Always verify webhook signatures:

```javascript
// Coinbase Commerce
const isValid = verifyCoinbaseWebhook(signature, rawBody);

// NOWPayments
const expectedSignature = hmac('sha512', ipnSecret, payload);
const isValid = expectedSignature === receivedSignature;
```

### 2. Rate Limiting

Protect endpoints with rate limiting:

```javascript
const limiter = rateLimit({
  windowMs: 60000,
  max: 10, // 10 requests per minute for payment creation
});

app.post("/api/crypto/create-payment", limiter, verifyUser, ...);
```

### 3. Amount Validation

Always validate payment amounts match your pricing:

```javascript
const tier = getTierById(tierId);
if (paymentAmount !== tier.price) {
  throw new Error("Amount mismatch");
}
```

### 4. Idempotency

Prevent duplicate payments:

```javascript
// Check for existing pending payment
const existing = await db.collection("crypto_payments")
  .where("userId", "==", userId)
  .where("status", "==", "pending")
  .get();

if (!existing.empty) {
  return res.json({ error: "Payment already pending" });
}
```

---

## 🐛 Troubleshooting

### Issue: Payment not confirming

**Solutions:**
1. Check blockchain explorer for transaction
2. Verify webhook URL is publicly accessible
3. Check Firebase Functions logs for errors
4. Ensure webhook secret is correct

### Issue: QR code not displaying

**Solutions:**
1. Verify `qrcode` package is installed
2. Check payment address is being returned
3. Inspect browser console for errors

### Issue: "Provider API key not configured"

**Solutions:**
1. Set environment variables in Firebase:
   ```bash
   firebase functions:config:set \
     coinbase.api_key="your_key" \
     nowpayments.api_key="your_key"
   ```
2. Redeploy functions
3. Verify keys in Firebase Console

### Issue: Webhook not triggering

**Solutions:**
1. Test webhook with provider's test tool
2. Check HTTPS is enabled (required for webhooks)
3. Verify webhook URL in provider dashboard
4. Check Firebase Functions logs

---

## 📊 Analytics

### Tracked Events

```typescript
// Payment initiated
trackCryptoPaymentInitiated('pro-monthly', 14.95, 'btc', 'coinbase');

// Payment completed
trackCryptoPaymentCompleted('pro-monthly', 14.95, 'btc', 'coinbase', 'ABC123');

// Payment failed
trackCryptoPaymentFailed('pro-monthly', 14.95, 'btc', 'coinbase', 'Expired');

// Currency selected
trackCryptoCurrencySelected('eth', 'nowpayments');
```

### Google Analytics Dashboard

View crypto payments in GA4:
1. Events → crypto_payment_initiated
2. Monetization → Purchase revenue
3. Custom reports → Payment methods

---

## 🚀 Production Deployment

### Pre-Launch Checklist

- [ ] Environment variables configured
- [ ] Webhook URLs updated to production
- [ ] Webhook signatures verified
- [ ] Test payment flow end-to-end
- [ ] Analytics events tracking
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] Amount validation in place
- [ ] Firestore security rules updated
- [ ] User access granting tested

### Deployment Commands

```bash
# Deploy backend
cd api-functions
firebase deploy --only functions

# Deploy frontend
cd frontend
npm run build
firebase deploy --only hosting
```

---

## 📞 Support

### Provider Support

- **Coinbase Commerce**: [commerce.coinbase.com/docs](https://commerce.coinbase.com/docs)
- **NOWPayments**: [nowpayments.io/doc](https://nowpayments.io/doc)

### Project Issues

For bugs or feature requests, open an issue on GitHub.

---

## 📄 License

This crypto payment integration is part of the Trade Hustle Resume Builder project.

---

**Last Updated:** October 18, 2025  
**Version:** 1.0.0  
**Maintainer:** Trade Hustle Team
