import Stripe from 'stripe';
import { defineSecret } from 'firebase-functions/params';

// Define secrets
export const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
export const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

// Initialize Stripe
export const getStripe = () => {
  return new Stripe(stripeSecretKey.value(), {
    apiVersion: '2023-10-16',
  });
};