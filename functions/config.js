import Stripe from 'stripe';
import { defineSecret } from 'firebase-functions/params';

// Define secret parameters (will be set via Firebase CLI or Console)
const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

// Initialize Stripe (only when the secret is available)
export const getStripe = () => {
  return new Stripe(stripeSecretKey.value(), {
    apiVersion: '2023-10-16', // Use latest Stripe API version
  });
};

// Export the secrets for function configuration
export { stripeSecretKey, stripeWebhookSecret };