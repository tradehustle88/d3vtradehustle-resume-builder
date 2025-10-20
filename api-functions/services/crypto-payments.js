// Crypto Payment Service - Coinbase Commerce & NOWPayments Integration
const admin = require("firebase-admin");
const axios = require("axios");

const db = admin.firestore();

/**
 * Get crypto payment provider API keys
 * @return {Object} API keys for crypto providers
 */
function getCryptoKeys() {
  return {
    coinbaseCommerceKey: process.env.COINBASE_COMMERCE_API_KEY || null,
    nowpaymentsKey: process.env.NOWPAYMENTS_API_KEY || null,
  };
}

/**
 * Supported cryptocurrencies configuration
 */
const supportedCryptos = {
  btc: {
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    providers: ["coinbase", "nowpayments"],
  },
  eth: {
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    providers: ["coinbase", "nowpayments"],
  },
  usdc: {
    name: "USD Coin",
    symbol: "USDC",
    icon: "💵",
    providers: ["coinbase", "nowpayments"],
  },
  usdt: {
    name: "Tether",
    symbol: "USDT",
    icon: "₮",
    providers: ["nowpayments"],
  },
  ltc: {
    name: "Litecoin",
    symbol: "LTC",
    icon: "Ł",
    providers: ["coinbase", "nowpayments"],
  },
  bch: {
    name: "Bitcoin Cash",
    symbol: "BCH",
    icon: "Ƀ",
    providers: ["nowpayments"],
  },
  doge: {
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "Ð",
    providers: ["coinbase", "nowpayments"],
  },
};

/**
 * Create Coinbase Commerce payment charge
 * @param {Object} params - Payment parameters
 * @param {string} params.userId - Firebase user ID
 * @param {string} params.email - User email
 * @param {number} params.amount - Amount in USD
 * @param {string} params.productName - Product name
 * @param {string} params.tierId - Pricing tier ID
 * @param {Object} params.metadata - Additional metadata
 * @return {Promise<Object>} Payment charge object
 */
async function createCoinbaseCommerceCharge({
  userId,
  email,
  amount,
  productName,
  tierId,
  metadata = {},
}) {
  const {coinbaseCommerceKey} = getCryptoKeys();

  if (!coinbaseCommerceKey) {
    throw new Error("Coinbase Commerce API key not configured");
  }

  try {
    const response = await axios.post(
        "https://api.commerce.coinbase.com/charges",
        {
          name: productName,
          description: `Trade Hustle Resume Builder - ${productName}`,
          pricing_type: "fixed_price",
          local_price: {
            amount: amount.toFixed(2),
            currency: "USD",
          },
          metadata: {
            userId,
            email,
            tierId,
            firebaseUID: userId,
            ...metadata,
          },
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tradehustleresume.web.app"}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tradehustleresume.web.app"}/payment/cancel`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CC-Api-Key": coinbaseCommerceKey,
            "X-CC-Version": "2018-03-22",
          },
        },
    );

    const charge = response.data.data;

    // Store payment record in Firestore
    await db.collection("crypto_payments").doc(charge.code).set({
      userId,
      email,
      provider: "coinbase_commerce",
      chargeId: charge.id,
      chargeCode: charge.code,
      amount,
      currency: "USD",
      tierId,
      productName,
      status: "pending",
      hostedUrl: charge.hosted_url,
      addresses: charge.addresses,
      pricing: charge.pricing,
      createdAt: new Date(),
      expiresAt: new Date(charge.expires_at),
      metadata,
    });

    console.log(`✅ Coinbase Commerce charge created: ${charge.code} for ${email}`);

    return {
      success: true,
      provider: "coinbase_commerce",
      chargeId: charge.id,
      chargeCode: charge.code,
      hostedUrl: charge.hosted_url,
      addresses: charge.addresses,
      pricing: charge.pricing,
      expiresAt: charge.expires_at,
    };
  } catch (error) {
    const errorData = error.response && error.response.data ? error.response.data : error.message;
    console.error("❌ Coinbase Commerce charge creation failed:", errorData);
    throw new Error(`Failed to create Coinbase Commerce charge: ${error.message}`);
  }
}

/**
 * Create NOWPayments invoice
 * @param {Object} params - Payment parameters
 * @param {string} params.userId - Firebase user ID
 * @param {string} params.email - User email
 * @param {number} params.amount - Amount in USD
 * @param {string} params.productName - Product name
 * @param {string} params.tierId - Pricing tier ID
 * @param {string} params.currency - Cryptocurrency (btc, eth, usdc, etc.)
 * @param {Object} params.metadata - Additional metadata
 * @return {Promise<Object>} Payment invoice object
 */
async function createNOWPaymentsInvoice({
  userId,
  email,
  amount,
  productName,
  tierId,
  currency = "btc",
  metadata = {},
}) {
  const {nowpaymentsKey} = getCryptoKeys();

  if (!nowpaymentsKey) {
    throw new Error("NOWPayments API key not configured");
  }

  try {
    const response = await axios.post(
        "https://api.nowpayments.io/v1/invoice",
        {
          price_amount: amount,
          price_currency: "usd",
          pay_currency: currency.toLowerCase(),
          order_id: `${userId}_${Date.now()}`,
          order_description: `${productName} - Trade Hustle Resume Builder`,
          ipn_callback_url: `${process.env.FIREBASE_FUNCTIONS_URL || "https://app-fbs5jy4frq-uc.a.run.app"}/api/crypto/webhook/nowpayments`,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tradehustleresume.web.app"}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tradehustleresume.web.app"}/payment/cancel`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": nowpaymentsKey,
          },
        },
    );

    const invoice = response.data;

    // Store payment record in Firestore
    await db.collection("crypto_payments").doc(invoice.id.toString()).set({
      userId,
      email,
      provider: "nowpayments",
      invoiceId: invoice.id,
      orderId: invoice.order_id,
      amount,
      currency: "USD",
      payCurrency: currency.toUpperCase(),
      tierId,
      productName,
      status: "waiting",
      invoiceUrl: invoice.invoice_url,
      payAddress: invoice.pay_address,
      payAmount: invoice.pay_amount,
      createdAt: new Date(),
      metadata,
    });

    console.log(`✅ NOWPayments invoice created: ${invoice.id} for ${email}`);

    return {
      success: true,
      provider: "nowpayments",
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoice_url,
      payAddress: invoice.pay_address,
      payAmount: invoice.pay_amount,
      payCurrency: currency.toUpperCase(),
      expirationEstimateDate: invoice.expiration_estimate_date,
    };
  } catch (error) {
    const errorData = error.response && error.response.data ? error.response.data : error.message;
    console.error("❌ NOWPayments invoice creation failed:", errorData);
    throw new Error(`Failed to create NOWPayments invoice: ${error.message}`);
  }
}

/**
 * Verify Coinbase Commerce webhook signature
 * @param {string} signature - Webhook signature from header
 * @param {string} payload - Raw request body
 * @return {boolean} True if signature is valid
 */
function verifyCoinbaseWebhook(signature, payload) {
  const crypto = require("crypto");
  const {coinbaseCommerceKey} = getCryptoKeys();

  if (!coinbaseCommerceKey) {
    return false;
  }

  const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn("⚠️ COINBASE_COMMERCE_WEBHOOK_SECRET not set");
    return false;
  }

  const computedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

  return computedSignature === signature;
}

/**
 * Process Coinbase Commerce webhook event
 * @param {Object} event - Webhook event object
 * @return {Promise<void>}
 */
async function processCoinbaseWebhook(event) {
  const {type, data} = event;
  const chargeCode = data.code;

  console.log(`📩 Coinbase webhook received: ${type} for charge ${chargeCode}`);

  // Update payment record in Firestore
  const paymentRef = db.collection("crypto_payments").doc(chargeCode);
  const paymentDoc = await paymentRef.get();

  if (!paymentDoc.exists) {
    console.warn(`⚠️ Payment record not found for charge: ${chargeCode}`);
    return;
  }

  const paymentData = paymentDoc.data();

  switch (type) {
    case "charge:confirmed":
    case "charge:resolved":
      // Payment successful
      await paymentRef.update({
        status: "completed",
        confirmedAt: new Date(),
        timeline: data.timeline,
        payments: data.payments,
      });

      // Grant user access
      await grantUserAccess(paymentData.userId, paymentData.tierId, {
        paymentProvider: "coinbase_commerce",
        chargeCode,
        amount: paymentData.amount,
      });

      console.log(`✅ Payment confirmed for user ${paymentData.email}`);
      break;

    case "charge:failed":
    case "charge:delayed":
      await paymentRef.update({
        status: type.split(":")[1],
        updatedAt: new Date(),
      });
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${type}`);
  }
}

/**
 * Process NOWPayments webhook event
 * @param {Object} payload - Webhook payload
 * @return {Promise<void>}
 */
async function processNOWPaymentsWebhook(payload) {
  const {payment_id, payment_status, order_id, invoice_id} = payload;

  console.log(`📩 NOWPayments webhook: ${payment_status} for invoice ${invoice_id}`);

  const paymentRef = db.collection("crypto_payments").doc(invoice_id.toString());
  const paymentDoc = await paymentRef.get();

  if (!paymentDoc.exists) {
    console.warn(`⚠️ Payment record not found for invoice: ${invoice_id}`);
    return;
  }

  const paymentData = paymentDoc.data();

  await paymentRef.update({
    status: payment_status,
    paymentId: payment_id,
    updatedAt: new Date(),
    webhookPayload: payload,
  });

  if (payment_status === "finished") {
    // Grant user access
    await grantUserAccess(paymentData.userId, paymentData.tierId, {
      paymentProvider: "nowpayments",
      invoiceId: invoice_id,
      paymentId: payment_id,
      amount: paymentData.amount,
    });

    console.log(`✅ Payment finished for user ${paymentData.email}`);
  }
}

/**
 * Grant user access after successful payment
 * @param {string} userId - Firebase user ID
 * @param {string} tierId - Pricing tier ID
 * @param {Object} paymentDetails - Payment details
 * @return {Promise<void>}
 */
async function grantUserAccess(userId, tierId, paymentDetails) {
  const userRef = db.collection("users").doc(userId);

  // Determine subscription details based on tier
  const subscriptionData = {
    tier: tierId,
    status: "active",
    paymentMethod: "crypto",
    paymentProvider: paymentDetails.paymentProvider,
    activatedAt: new Date(),
  };

  // Set expiration based on tier
  if (tierId === "trial") {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    subscriptionData.expiresAt = expiresAt;
  } else if (tierId === "proMonthly" || tierId === "pro-monthly") {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    subscriptionData.expiresAt = expiresAt;
  } else if (tierId === "proAnnual" || tierId === "pro-annual") {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    subscriptionData.expiresAt = expiresAt;
  }

  // Update user document
  await userRef.set(
      {
        subscription: subscriptionData,
        lastPayment: {
          ...paymentDetails,
          timestamp: new Date(),
        },
      },
      {merge: true},
  );

  console.log(`🎉 Access granted to user ${userId} for tier ${tierId}`);
}

/**
 * Get payment status
 * @param {string} paymentId - Payment ID (charge code or invoice ID)
 * @return {Promise<Object>} Payment status object
 */
async function getPaymentStatus(paymentId) {
  const paymentDoc = await db.collection("crypto_payments").doc(paymentId).get();

  if (!paymentDoc.exists) {
    throw new Error("Payment not found");
  }

  const data = paymentDoc.data();

  return {
    success: true,
    status: data.status,
    provider: data.provider,
    amount: data.amount,
    currency: data.currency,
    createdAt: data.createdAt,
    ...(data.confirmedAt && {confirmedAt: data.confirmedAt}),
  };
}

module.exports = {
  supportedCryptos,
  createCoinbaseCommerceCharge,
  createNOWPaymentsInvoice,
  verifyCoinbaseWebhook,
  processCoinbaseWebhook,
  processNOWPaymentsWebhook,
  getPaymentStatus,
  grantUserAccess,
};
