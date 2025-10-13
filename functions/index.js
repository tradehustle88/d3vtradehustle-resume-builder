// functions/index.js
import { onRequest } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { textModel, imageModel } from "./gemini.js";
import { getStripe, stripeSecretKey, stripeWebhookSecret } from "./config.js";

// Initialize Firebase Admin
initializeApp();

/* --- Text: fast resume summaries, keywords, advice --- */
export const geminiText = onRequest(async (req, res) => {
  try {
    const prompt = req.query.prompt || "Summarize Trade Hustle's mission.";
    const result = await textModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ success: true, text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --- Image: generate or edit Trade Hustle visuals --- */
export const geminiImage = onRequest(async (req, res) => {
  try {
    const prompt =
      req.query.prompt ||
      "Create a gritty Trade Hustle-style banner with blue and red paint splatters.";
    const result = await imageModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const imageData = result?.response?.candidates?.[0]?.content?.parts?.[0];
    res.json({ success: true, image: imageData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --- Stripe: secure checkout for Trade Hustle services --- */
export const createCheckout = onRequest(
  {
    secrets: [stripeSecretKey], // Declare secret dependency
    cors: {
      origin: true, // Allow all origins for now, restrict later
      methods: ['POST'],
    },
  },
  async (req, res) => {
    try {
      // Only allow POST requests
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      // Verify Firebase Auth token (optional but recommended)
      let userId = 'guest';
      try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await getAuth().verifyIdToken(token);
          userId = decodedToken.uid;
        }
      } catch (authError) {
        // Continue as guest if auth fails (optional authentication)
        console.log('Auth verification failed, continuing as guest:', authError.message);
      }

      const stripe = getStripe();

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price: 'price_1SHfAyLr4v4blpwbcvDqbej8', // Trade Hustle Resume Builder Price
            quantity: 1,
          },
        ],
        success_url: 'https://nexxgennhustle.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://nexxgennhustle.com/cancel',
        client_reference_id: userId, // Link to Firebase user
        metadata: {
          userId: userId,
          service: 'trade_hustle_resume',
        },
      });

      res.json({ 
        success: true,
        id: session.id, 
        url: session.url 
      });
    } catch (error) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to create checkout session',
        message: error.message 
      });
    }
  }
);

/* --- Stripe Webhook: handle payment confirmations --- */
export const stripeWebhook = onRequest(
  {
    secrets: [stripeSecretKey, stripeWebhookSecret],
  },
  async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    
    // Get the webhook secret from Firebase secrets
    const endpointSecret = stripeWebhookSecret.value();

    let event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          console.log('✅ Payment successful:', session.id);

          // Save purchase to Firestore
          const db = getFirestore();
          await db.collection('purchases').add({
            sessionId: session.id,
            customerId: session.customer,
            customerEmail: session.customer_details?.email,
            userId: session.metadata?.userId || session.client_reference_id,
            amountTotal: session.amount_total,
            currency: session.currency,
            paymentStatus: session.payment_status,
            status: 'completed',
            createdAt: new Date(),
          });

          console.log('📝 Purchase recorded in Firestore');
          break;

        case 'checkout.session.expired':
          console.log('⏰ Checkout session expired:', event.data.object.id);
          break;

        case 'payment_intent.succeeded':
          console.log('💰 Payment succeeded:', event.data.object.id);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);