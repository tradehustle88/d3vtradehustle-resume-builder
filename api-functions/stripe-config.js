/**
 * Stripe Configuration - Pricing Tiers & Product Definitions
 * Trade Hustle Resume Builder
 */

const pricingTiers = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    interval: null,
    features: [
      "Build unlimited resumes",
      "Plain text export only",
      "Basic templates (5)",
      "No AI suggestions",
      "No ATS scoring",
    ],
    limits: {
      resumes: -1, // unlimited
      templates: 5,
      storage: 0, // 0MB
      aiSuggestions: 0,
      atsScoring: false,
      jobTracker: false,
      certVault: false,
    },
    stripePriceId: null,
  },

  trial: {
    id: "trial",
    name: "7-Day Trial",
    price: 2.00,
    interval: null,
    duration: "7 days",
    trialDays: 7,
    features: [
      "All Pro features for 7 days",
      "Full template library (200+)",
      "PDF/DOCX exports",
      "AI-powered suggestions",
      "ATS scoring",
      "Job tracker access",
    ],
    limits: {
      resumes: -1,
      templates: -1,
      storage: 100, // 100MB
      aiSuggestions: -1,
      atsScoring: true,
      jobTracker: true,
      certVault: true,
    },
    stripePriceId: process.env.STRIPE_PRICE_TRIAL || "price_trial_7day",
  },

  proMonthly: {
    id: "proMonthly",
    name: "Pro Monthly",
    price: 14.95,
    interval: "month",
    features: [
      "Unlimited resume versions",
      "All templates (200+)",
      "PDF/DOCX/TXT exports",
      "AI suggestions & optimization",
      "Real-time ATS scoring",
      "Job tracker",
      "Cert vault (100MB)",
      "Email support",
    ],
    limits: {
      resumes: -1,
      templates: -1,
      storage: 100,
      aiSuggestions: -1,
      atsScoring: true,
      jobTracker: true,
      certVault: true,
    },
    stripePriceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly",
  },

  proAnnual: {
    id: "proAnnual",
    name: "Pro Annual",
    price: 119.00,
    interval: "year",
    savings: "33%",
    monthlyEquivalent: 9.92,
    features: [
      "Everything in Pro Monthly",
      "Save $60/year",
      "Priority support",
      "1 free Career Blueprint",
      "Extended cert vault (500MB)",
    ],
    limits: {
      resumes: -1,
      templates: -1,
      storage: 500,
      aiSuggestions: -1,
      atsScoring: true,
      jobTracker: true,
      certVault: true,
      freeBlueprint: true,
    },
    stripePriceId: process.env.STRIPE_PRICE_PRO_ANNUAL || "price_pro_annual",
  },
};

/**
 * Get tier configuration by ID
 */
function getTierById(tierId) {
  return pricingTiers[tierId] || pricingTiers.free;
}

/**
 * Get tier ID from Stripe price ID
 */
function getTierFromPriceId(priceId) {
  for (const [tierId, config] of Object.entries(pricingTiers)) {
    if (config.stripePriceId === priceId) {
      return tierId;
    }
  }
  return "free";
}

/**
 * Check if user has access to a feature
 */
function hasFeatureAccess(userTier, feature) {
  const tier = getTierById(userTier);
  return tier.limits[feature] === true || tier.limits[feature] === -1;
}

/**
 * Check if user is within usage limits
 */
function isWithinLimit(userTier, feature, currentUsage) {
  const tier = getTierById(userTier);
  const limit = tier.limits[feature];

  // -1 means unlimited
  if (limit === -1) return true;

  // Check if current usage is below limit
  return currentUsage < limit;
}

/**
 * Get all pricing tiers for display
 */
function getAllTiers() {
  return Object.values(pricingTiers);
}

/**
 * Get subscription tiers only (exclude free)
 */
function getSubscriptionTiers() {
  return Object.values(pricingTiers).filter((tier) => tier.stripePriceId);
}

module.exports = {
  pricingTiers,
  getTierById,
  getTierFromPriceId,
  hasFeatureAccess,
  isWithinLimit,
  getAllTiers,
  getSubscriptionTiers,
};
