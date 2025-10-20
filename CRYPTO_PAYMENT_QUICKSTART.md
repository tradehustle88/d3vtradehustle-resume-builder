# 🚀 Crypto Payment Quick Start Guide

## Trade Hustle Resume Builder - Get Started in 5 Minutes

---

## ✅ What's Been Built

Your crypto payment system is now **100% ready** with:

✅ **Backend Services** - `api-functions/services/crypto-payments.js`  
✅ **API Endpoints** - 6 new crypto payment routes  
✅ **UI Components** - `CryptoPaymentModal.tsx` with QR codes  
✅ **Checkout Integration** - Crypto option added to checkout page  
✅ **Webhook Handlers** - Coinbase & NOWPayments webhooks ready  
✅ **Analytics Tracking** - 5 new Google Analytics events  
✅ **Documentation** - Complete integration guide  

---

## 🎯 What You Can Do Now

### Supported Cryptocurrencies
- ₿ Bitcoin (BTC)
- Ξ Ethereum (ETH)
- 💵 USDC (Stablecoin)
- ₮ USDT (Stablecoin)
- Ł Litecoin (LTC)
- Ƀ Bitcoin Cash (BCH)
- Ð Dogecoin (DOGE)

### Payment Providers
1. **Coinbase Commerce** - Easiest setup, multi-currency
2. **NOWPayments** - 200+ cryptocurrencies, lower fees

---

## ⚡ Quick Setup (5 Steps)

### Step 1: Install Dependencies

Already done! ✅
```bash
cd frontend
npm install qrcode @types/qrcode  # Already installed
```

### Step 2: Configure Environment Variables

Add to `api-functions/.env` (already in `.env.example`):

```bash
# Choose ONE or BOTH providers:

# Option A: Coinbase Commerce (Recommended for beginners)
COINBASE_COMMERCE_API_KEY=your_coinbase_api_key_here
COINBASE_COMMERCE_WEBHOOK_SECRET=your_webhook_secret_here

# Option B: NOWPayments (More crypto options)
NOWPAYMENTS_API_KEY=your_nowpayments_api_key_here

# Required URLs
NEXT_PUBLIC_APP_URL=https://tradehustleresume.web.app
FIREBASE_FUNCTIONS_URL=https://app-fbs5jy4frq-uc.a.run.app
```

### Step 3: Get API Keys

#### For Coinbase Commerce:
1. Go to [commerce.coinbase.com](https://commerce.coinbase.com)
2. Create account → Settings → API Keys
3. Create new API key
4. Copy key to `COINBASE_COMMERCE_API_KEY`

#### For NOWPayments:
1. Go to [nowpayments.io](https://nowpayments.io)
2. Sign up → Dashboard → API Keys
3. Copy key to `NOWPAYMENTS_API_KEY`

### Step 4: Deploy Functions

```bash
cd api-functions
npm install axios  # If not already installed
firebase deploy --only functions
```

### Step 5: Test It!

1. Run dev server: `npm run dev` (in `frontend/`)
2. Go to `/resume-builder/checkout`
3. Click the new **₿ Crypto** payment button
4. Select cryptocurrency and test!

---

## 🔥 How It Works (User Flow)

```
1. User clicks "₿ Pay with Crypto" on checkout page
2. CryptoPaymentModal opens with currency selector
3. User selects provider (Coinbase/NOWPayments) and crypto (BTC/ETH/etc)
4. Backend creates payment charge with chosen provider
5. User sees QR code + payment address
6. User sends crypto from wallet
7. Webhook confirms payment on blockchain
8. Access granted automatically!
```

---

## 📁 Files Created/Modified

### New Files
- `api-functions/services/crypto-payments.js` - Payment provider integration
- `frontend/src/components/CryptoPaymentModal.tsx` - UI modal component
- `CRYPTO_PAYMENT_INTEGRATION.md` - Complete documentation
- `CRYPTO_PAYMENT_QUICKSTART.md` - This file

### Modified Files
- `api-functions/index.js` - Added 6 crypto endpoints
- `api-functions/.env.example` - Added crypto variables
- `frontend/src/lib/api.ts` - Added crypto API functions
- `frontend/src/lib/analytics.ts` - Added crypto event tracking
- `frontend/src/app/resume-builder/checkout/page.tsx` - Added crypto button + modal
- `frontend/package.json` - Added `qrcode` dependency

---

## 🔌 API Endpoints Available

### 1. Create Payment
**POST** `/api/crypto/create-payment`
```json
{
  "tierId": "pro-monthly",
  "provider": "coinbase",
  "currency": "btc"
}
```

### 2. Check Payment Status
**GET** `/api/crypto/payment-status/:paymentId`

### 3. Supported Currencies
**GET** `/api/crypto/supported-currencies`

### 4. Webhooks (Auto-configured)
- **POST** `/api/crypto/webhook/coinbase`
- **POST** `/api/crypto/webhook/nowpayments`

---

## 🎨 UI Components

### CryptoPaymentModal Props
```tsx
<CryptoPaymentModal
  isOpen={boolean}
  onClose={() => void}
  tierId="pro-monthly"        // Pricing tier ID
  amount={14.95}              // USD amount
  tierName="Pro Subscription" // Display name
  onPaymentInitiated={(data) => {
    // Called when payment is created
    console.log(data);
  }}
/>
```

### Example Usage
```tsx
const [showCrypto, setShowCrypto] = useState(false);

<button onClick={() => setShowCrypto(true)}>
  ₿ Pay with Crypto
</button>

<CryptoPaymentModal
  isOpen={showCrypto}
  onClose={() => setShowCrypto(false)}
  tierId="trial"
  amount={2.00}
  tierName="7-Day Trial"
/>
```

---

## 📊 Analytics Events

Automatically tracked in Google Analytics:

1. **crypto_payment_initiated** - User starts crypto payment
2. **crypto_payment_completed** - Payment confirmed on blockchain
3. **crypto_payment_failed** - Payment failed/expired
4. **crypto_payment_modal_viewed** - User opens modal
5. **crypto_currency_selected** - User picks a currency

View in GA4: **Events → crypto_payment_***

---

## 🧪 Testing

### Test Payment Flow (Sandbox)

1. Use Coinbase Commerce test keys
2. Create small test payment ($0.50)
3. Use testnet wallet (BTC testnet, ETH Goerli, etc.)
4. Check webhook logs in Firebase Console

### Test Webhook Manually

```bash
# Simulate Coinbase webhook
curl -X POST https://your-app.com/api/crypto/webhook/coinbase \
  -H "X-CC-Webhook-Signature: test_sig" \
  -H "Content-Type: application/json" \
  -d '{
    "event": {
      "type": "charge:confirmed",
      "data": {
        "code": "TEST123"
      }
    }
  }'
```

---

## 🔒 Security Features

✅ **Webhook Signature Verification** - All webhooks validated  
✅ **Firebase Auth Required** - User must be signed in  
✅ **Rate Limiting** - 30 requests/min per IP  
✅ **Honeypot Protection** - Bot detection  
✅ **Amount Validation** - Price tampering prevention  
✅ **HTTPS Only** - Secure connections enforced  

---

## 💰 Fee Comparison

| Method | Our Fee | Provider Fee | Total |
|--------|---------|--------------|-------|
| **Crypto (Coinbase)** | 0% | 1% | **1%** |
| **Crypto (NOWPayments)** | 0% | 0.5% | **0.5%** |
| **Credit Card (Stripe)** | 0% | 2.9% + $0.30 | **~3.2%** |
| **PayPal** | 0% | 3.5% + $0.49 | **~4%** |

**Example:** On a $14.95 sale:
- Crypto (NOWPayments): $0.07 fee → **$14.88 profit** 💰
- Credit Card: $0.73 fee → **$14.22 profit**
- **You save $0.66 per sale!** (4.6% more revenue)

---

## 🚨 Troubleshooting

### "Provider API key not configured"
➡️ Set environment variables and redeploy functions

### QR code not showing
➡️ Check `qrcode` package installed: `npm list qrcode`

### Webhook not working
➡️ Ensure webhook URL is HTTPS and publicly accessible

### Payment stuck "pending"
➡️ Check blockchain explorer for transaction status

---

## 📚 Full Documentation

For complete details, see **CRYPTO_PAYMENT_INTEGRATION.md**

---

## 🎉 You're Ready!

Your Trade Hustle Resume Builder now accepts cryptocurrency payments!

### Next Steps:
1. ✅ Get API keys from Coinbase or NOWPayments
2. ✅ Add keys to environment variables
3. ✅ Deploy functions: `firebase deploy --only functions`
4. ✅ Test payment flow
5. ✅ Start accepting crypto! 🚀

---

## 💬 Need Help?

- 📖 Full docs: `CRYPTO_PAYMENT_INTEGRATION.md`
- 🐛 Issues: Open GitHub issue
- 💡 Features: Submit pull request

---

**Built with ❤️ for Trade Hustle Resume Builder**  
**Last Updated:** October 18, 2025
