// functions/index.js
import { onRequest } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { textModel, imageModel } from "./gemini.js";
import { getStripe, stripeSecretKey } from "./config.js";

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
      origin: ['https://nexxgennhustle.com', 'http://localhost:3000'], // Add your domains
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
            price: 'price_123', // Replace with your actual Stripe Price ID
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