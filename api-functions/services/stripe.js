// Stripe Payment Service
const admin = require("firebase-admin");

/**
 * Get Stripe key from multiple sources with fallback
 * @return {string|null} Stripe secret key or null if not found
 */
function getStripeKey() {
  // Pull from injected secret/environment variable
  if (process.env.STRIPE_SECRET_KEY) {
    return process.env.STRIPE_SECRET_KEY;
  }

  console.warn("⚠️ STRIPE_SECRET_KEY not configured - Stripe features will be disabled");
  console.warn("   Set via: firebase functions:secrets:set STRIPE_SECRET_KEY");
  console.warn("   Or provide STRIPE_SECRET_KEY in your local environment");

  return null;
}

// Initialize Stripe with fallback logic
const stripeKey = getStripeKey();
let stripe = null;

if (stripeKey) {
  stripe = require("stripe")(stripeKey);
  console.log("✅ Stripe initialized successfully");
} else {
  console.warn("ℹ️ Stripe client not initialised - secret key missing");
}

const db = admin.firestore();

/**
 * Stripe Products & Prices Configuration
 */
const stripeProducts = {
  "trial": {
    priceId: process.env.STRIPE_PRICE_TRIAL || "price_trial_001",
    amount: 200, // $2.00
    type: "one_time",
    name: "7-Day Trial",
  },
  "pro-monthly": {
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_1SHfAyLr4v4blpwbcvDqbej8",
    amount: 1495, // $14.95
    type: "recurring",
    interval: "month",
    name: "Pro Monthly",
  },
  "pro-annual": {
    priceId: process.env.STRIPE_PRICE_PRO_ANNUAL || "price_annual_001",
    amount: 11900, // $119.00
    type: "recurring",
    interval: "year",
    name: "Pro Annual",
  },
  "blueprint": {
    priceId: process.env.STRIPE_PRICE_BLUEPRINT || "price_blueprint_001",
    amount: 2900, // $29.00
    type: "one_time",
    name: "Career Blueprint",
  },
};

/**
 * Create Stripe checkout session
 */
async function createCheckoutSession(userId, email, priceId, successUrl, cancelUrl, metadata = {}) {
  try {
    // Get or create Stripe customer
    const userDoc = await db.collection("users").doc(userId).get();
    let stripeCustomerId = userDoc.exists ? userDoc.data().stripeCustomerId : null;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: {firebaseUID: userId},
      });
      stripeCustomerId = customer.id;

      await db.collection("users").doc(userId).set({
        stripeCustomerId,
        email,
      }, {merge: true});
    }

    // Determine mode based on price type
    const productKey = Object.keys(stripeProducts).find(
        (key) => stripeProducts[key].priceId === priceId,
    );
    const product = stripeProducts[productKey] || stripeProducts["pro-monthly"];
    const mode = product.type === "recurring" ? "subscription" : "payment";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        firebaseUID: userId,
        priceId,
        tier: productKey,
        ...metadata,
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error("Create Checkout Error:", error);
    throw new Error("Failed to create checkout session");
  }
}

/**
 * Handle Stripe webhook events
 */
async function handleWebhookEvent(event) {
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutComplete(event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSuccess(event.data.object);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return {received: true};
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    throw error;
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutComplete(session) {
  const userId = session.metadata.firebaseUID;
  const tier = session.metadata.tier || "free";

  await db.collection("users").doc(userId).update({
    subscriptionStatus: "active",
    subscriptionTier: tier,
    subscriptionExpiry: calculateExpiry(tier),
    lastPaymentDate: new Date().toISOString(),
  });

  // Log transaction
  await db.collection("transactions").add({
    userId,
    sessionId: session.id,
    amount: session.amount_total,
    currency: session.currency,
    status: "completed",
    tier,
    createdAt: new Date().toISOString(),
  });
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;

  // Find user by Stripe customer ID
  const userQuery = await db.collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

  if (userQuery.empty) {
    console.error("User not found for customer:", customerId);
    return;
  }

  const userDoc = userQuery.docs[0];
  const tier = mapSubscriptionToTier(subscription);

  await userDoc.ref.update({
    subscriptionStatus: subscription.status,
    subscriptionTier: tier,
    subscriptionExpiry: new Date(subscription.current_period_end * 1000).toISOString(),
    stripeSubscriptionId: subscription.id,
  });
}

/**
 * Handle subscription canceled
 */
async function handleSubscriptionCanceled(subscription) {
  const customerId = subscription.customer;

  const userQuery = await db.collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

  if (!userQuery.empty) {
    await userQuery.docs[0].ref.update({
      subscriptionStatus: "canceled",
      subscriptionTier: "free",
      subscriptionExpiry: null,
      canceledAt: new Date().toISOString(),
    });
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(invoice) {
  const customerId = invoice.customer;

  const userQuery = await db.collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

  if (!userQuery.empty) {
    await userQuery.docs[0].ref.update({
      lastPaymentDate: new Date().toISOString(),
      lastPaymentAmount: invoice.amount_paid,
      subscriptionStatus: "active",
    });
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;

  const userQuery = await db.collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

  if (!userQuery.empty) {
    await userQuery.docs[0].ref.update({
      subscriptionStatus: "past_due",
      lastPaymentAttempt: new Date().toISOString(),
    });
  }
}

/**
 * Cancel subscription
 */
async function cancelSubscription(userId) {
  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const subscriptionId = userData.stripeSubscriptionId;

    if (!subscriptionId) {
      throw new Error("No active subscription found");
    }

    // Cancel at period end (don't immediately revoke access)
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    await userDoc.ref.update({
      subscriptionStatus: "canceling",
      canceledAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Subscription will cancel at period end",
    };
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    throw error;
  }
}

/**
 * Get subscription details
 */
async function getSubscriptionDetails(userId) {
  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const subscriptionId = userData.stripeSubscriptionId;

    if (!subscriptionId) {
      return {
        tier: "free",
        status: "none",
        expiry: null,
      };
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return {
      tier: userData.subscriptionTier,
      status: subscription.status,
      expiry: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      price: subscription.items.data[0].price.unit_amount / 100,
      currency: subscription.currency,
    };
  } catch (error) {
    console.error("Get Subscription Error:", error);
    throw error;
  }
}

/**
 * Create customer portal session
 */
async function createPortalSession(userId, returnUrl) {
  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const stripeCustomerId = userDoc.data().stripeCustomerId;

    if (!stripeCustomerId) {
      throw new Error("No Stripe customer found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    return {
      success: true,
      url: session.url,
    };
  } catch (error) {
    console.error("Create Portal Session Error:", error);
    throw error;
  }
}

/**
 * Helper: Map price ID to tier
 */
function mapPriceToTier(priceId) {
  for (const [tier, product] of Object.entries(stripeProducts)) {
    if (product.priceId === priceId) {
      return tier;
    }
  }
  return "free";
}

/**
 * Helper: Map subscription to tier
 */
function mapSubscriptionToTier(subscription) {
  const priceId = subscription.items.data[0].price.id;
  return mapPriceToTier(priceId);
}

/**
 * Helper: Calculate subscription expiry
 */
function calculateExpiry(tier) {
  const now = new Date();

  switch (tier) {
    case "trial":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case "pro-monthly":
      return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    case "pro-annual":
      return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
    default:
      return null;
  }
}

module.exports = {
  createCheckoutSession,
  handleWebhookEvent,
  cancelSubscription,
  getSubscriptionDetails,
  createPortalSession,
  stripeProducts,
};
