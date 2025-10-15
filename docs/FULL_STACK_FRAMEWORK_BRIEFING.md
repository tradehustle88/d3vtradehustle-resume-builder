# 🏗️ Trade Hustle Resume Builder - Full Stack Framework Briefing

**Document Version:** 1.0  
**Date:** October 13, 2025  
**Architecture Type:** Serverless Full Stack  
**Primary Stack:** Next.js + Firebase + Stripe + AI  
**Repository:** [d3vtradehustle-resume-builder](https://github.com/tradehustle88/d3vtradehustle-resume-builder)

---

## 🎯 Framework Architecture Overview

### **Architectural Philosophy**

The Trade Hustle Resume Builder follows a **Serverless-First, JAMstack Architecture** with **AI-Native Design Patterns**. This approach ensures:

- **Scalability**: Auto-scaling serverless functions handle traffic spikes
- **Performance**: Static frontend with dynamic API integration
- **Cost Efficiency**: Pay-per-use serverless model
- **Developer Experience**: Modern tooling and hot-reload development
- **AI Integration**: Native support for machine learning workflows

### **Technology Stack Visualization**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐  │
│  │   Next.js   │ │ TypeScript  │ │ Tailwind    │ │ React 18 │  │
│  │    14.2.5   │ │    5.9.2    │ │   CSS 3.4   │ │  Hooks   │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                         ┌──────▼──────┐
                         │   HTTPS/2   │
                         │   Firebase  │
                         │   Hosting   │
                         └──────┬──────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐  │
│  │  Firebase   │ │  Express.js │ │  Firestore  │ │ Firebase │  │
│  │ Functions   │ │ Middleware  │ │   NoSQL     │ │   Auth   │  │
│  │   Gen 2     │ │   Stack     │ │  Database   │ │ Service  │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                         ┌──────▼──────┐
                         │ External    │
                         │ Services    │
                         │ Integration │
                         └──────┬──────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                   SERVICES LAYER                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐  │
│  │   Stripe    │ │ Vertex AI   │ │   Google    │ │ Firebase │  │
│  │  Payments   │ │   Gemini    │ │ Analytics   │ │ Storage  │  │
│  │    API      │ │    2.5      │ │     4.0     │ │ Service  │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Frontend Framework Deep Dive

### **Next.js 14 App Router Architecture**

#### **Framework Selection Rationale**
```yaml
Why Next.js 14:
  App Router: ✅ File-based routing with layouts
  Server Components: ✅ Performance optimization
  Static Export: ✅ JAMstack compatibility
  Image Optimization: ✅ Automatic WebP conversion
  TypeScript: ✅ Built-in type checking
  Bundle Optimization: ✅ Automatic code splitting
  SEO Features: ✅ Built-in meta tag management
```

#### **Directory Structure Pattern**
```
frontend/src/app/
├── layout.tsx                 # Root layout (shared across all routes)
├── page.tsx                   # Homepage (/)
├── loading.tsx                # Global loading UI
├── error.tsx                  # Global error boundary
├── not-found.tsx              # 404 page
├── globals.css                # Global styles
│
├── pricing/
│   ├── page.tsx               # Pricing page (/pricing)
│   └── loading.tsx            # Pricing-specific loader
│
├── success/
│   ├── page.tsx               # Payment success (/success)
│   └── layout.tsx             # Success page layout
│
└── resume-builder/
    ├── page.tsx               # Resume builder (/resume-builder)
    ├── layout.tsx             # Builder-specific layout
    └── [id]/
        └── page.tsx           # Dynamic resume editing (/resume-builder/[id])
```

#### **Component Architecture Pattern**
```typescript
// Component Hierarchy Structure
App Layout (layout.tsx)
├── Navigation Component
├── Page Content
│   ├── Landing Page
│   │   ├── Hero Section
│   │   │   ├── Paint Splatter Effects
│   │   │   ├── Typography (Anton/Merriweather)
│   │   │   └── CTA Buttons
│   │   ├── Features Section
│   │   └── AI Assistant Demo
│   └── Footer
│       ├── Social Media Bar
│       ├── Legal Links
│       └── Brand Information
└── Analytics Provider (Google Analytics 4)

// Component Props Pattern
interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
}
```

### **State Management Strategy**

#### **React 18 Hooks Pattern**
```typescript
// Global State: React Context + useReducer
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

const AppStateContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);

// Local State: useState + useEffect
const useResumeBuilder = () => {
  const [resumeData, setResumeData] = useState<ResumeData>();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateContent = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/geminiText', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const result = await response.json();
      setResumeData(prev => ({ ...prev, ...result.content }));
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  return { resumeData, isGenerating, generateContent };
};
```

#### **Data Fetching Patterns**
```typescript
// Server Components (App Router)
// Automatic caching and revalidation
async function HomePage() {
  const stats = await fetch('https://api.example.com/stats', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  return <StatsDisplay data={await stats.json()} />;
}

// Client Components with SWR pattern
'use client';
import useSWR from 'swr';

function UserResumes() {
  const { data, error, mutate } = useSWR(
    '/api/user/resumes',
    fetcher,
    { refreshInterval: 30000 }
  );
  
  if (error) return <ErrorBoundary error={error} />;
  if (!data) return <LoadingSkeleton />;
  
  return <ResumesList resumes={data} onUpdate={mutate} />;
}
```

### **Styling Framework Integration**

#### **Tailwind CSS Configuration**
```javascript
// tailwind.config.js - Trade Hustle Theme
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hustle-red': '#E50914',
        'hustle-gold': '#ffd700', 
        'hustle-dark-red': '#8B0000',
        'hustle-blue': '#1673FF',
      },
      fontFamily: {
        'anton': ['Anton', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'paint-float': 'paintFloat 6s ease-in-out infinite',
        'paint-pulse': 'paintPulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        paintFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        paintPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

#### **CSS-in-JS Integration**
```typescript
// Custom CSS classes for complex animations
// paint-splatters.css
.paint-splatter {
  position: absolute;
  pointer-events: none;
  z-index: -1;
  opacity: 0.8;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.btn-hustle {
  @apply bg-gradient-to-r from-hustle-red to-hustle-dark-red;
  @apply hover:from-red-600 hover:to-red-800;
  @apply text-white font-bold py-4 px-12 rounded-lg;
  @apply transition-all duration-300 shadow-2xl;
  @apply transform hover:scale-105;
  @apply hover:shadow-[0_0_30px_rgba(229,9,20,0.6)];
}
```

---

## ⚡ Backend Framework Architecture

### **Firebase Functions Gen2 Framework**

#### **Serverless Architecture Benefits**
```yaml
Advantages:
  Auto Scaling: ✅ 0 to 1000+ concurrent executions
  Cost Efficiency: ✅ Pay only for actual usage
  Global Distribution: ✅ Multi-region deployment
  Zero DevOps: ✅ No server management required
  Built-in Security: ✅ Google Cloud IAM integration
  Automatic HTTPS: ✅ SSL certificates managed
  
Performance Characteristics:
  Cold Start: ~2 seconds (Gen2 improvement)
  Warm Execution: <100ms response time
  Memory Options: 128MB to 8GB
  Timeout: Up to 60 minutes
  Concurrency: Up to 1000 per function
```

#### **Express.js Integration Pattern**
```javascript
// api-functions/index.js - Main entry point
const express = require('express');
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

// Secret management
const stripeSecretKey = defineSecret('stripeSecretKey');
const stripeWebhookSecret = defineSecret('stripeWebhookSecret');

const app = express();

// Middleware Stack
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')({ origin: true }));

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { success: false, error: 'Too many requests' }
}));

// Security middleware
app.use((req, res, next) => {
  // Honeypot protection
  if (req.body.company) {
    return res.status(400).json({ success: false, error: 'Invalid request' });
  }
  next();
});

// Authentication middleware
const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) throw new Error('No token');
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};

// Route definitions
app.post('/createCheckout', createCheckoutHandler);
app.post('/stripeWebhook', stripeWebhookHandler);
app.post('/geminiText', verifyUser, geminiTextHandler);
app.post('/geminiImage', verifyUser, geminiImageHandler);

// Export as single Cloud Function
exports.api = onRequest({
  secrets: [stripeSecretKey, stripeWebhookSecret],
  memory: '1GiB',
  timeoutSeconds: 60,
  maxInstances: 100
}, app);
```

### **Database Framework (Firestore)**

#### **NoSQL Schema Design Patterns**
```typescript
// Collection Structure Design
interface DatabaseSchema {
  // User Management
  users: {
    [uid: string]: UserDocument;
  };
  
  // Resume Storage
  resumes: {
    [resumeId: string]: ResumeDocument;
  };
  
  // Analytics & Tracking
  analytics: {
    [eventId: string]: AnalyticsEvent;
  };
  
  // Payment Records
  payments: {
    [paymentId: string]: PaymentRecord;
  };
}

// Firestore Security Rules Pattern
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Resumes are private to the owner
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Analytics are write-only for authenticated users
    match /analytics/{eventId} {
      allow create: if request.auth != null;
      allow read: if false; // Admin SDK only
    }
  }
}
```

#### **Query Optimization Patterns**
```javascript
// Compound Indexes for Complex Queries
const getUserResumesByTrade = async (userId, trade, limit = 10) => {
  // Requires composite index: userId, trade, updatedAt
  return await db.collection('resumes')
    .where('userId', '==', userId)
    .where('trade', '==', trade)
    .orderBy('updatedAt', 'desc')
    .limit(limit)
    .get();
};

// Pagination with Cursor-based Approach
const getResumesPaginated = async (userId, lastDoc = null, limit = 10) => {
  let query = db.collection('resumes')
    .where('userId', '==', userId)
    .orderBy('updatedAt', 'desc')
    .limit(limit);
    
  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }
  
  const snapshot = await query.get();
  const docs = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return {
    resumes: docs,
    lastDoc: docs.length > 0 ? snapshot.docs[docs.length - 1] : null,
    hasMore: docs.length === limit
  };
};

// Batch Operations for Performance
const createResumeWithAnalytics = async (resumeData, userId) => {
  const batch = db.batch();
  
  // Create resume document
  const resumeRef = db.collection('resumes').doc();
  batch.set(resumeRef, {
    ...resumeData,
    userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Create analytics event
  const analyticsRef = db.collection('analytics').doc();
  batch.set(analyticsRef, {
    eventType: 'resume_created',
    userId,
    resumeId: resumeRef.id,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  
  await batch.commit();
  return resumeRef.id;
};
```

---

## 🤖 AI Integration Framework

### **Vertex AI / Gemini Integration**

#### **AI Model Architecture**
```typescript
// AI Service Configuration
interface AIModels {
  textGeneration: {
    model: 'gemini-2.0-flash-lite-001';
    capabilities: ['text-generation', 'conversation', 'code-generation'];
    maxTokens: 8192;
    temperature: 0.7;
    topP: 0.8;
    topK: 40;
  };
  
  imageAnalysis: {
    model: 'gemini-2.5-flash-image-001';
    capabilities: ['image-understanding', 'text-extraction', 'visual-qa'];
    supportedFormats: ['JPEG', 'PNG', 'WebP', 'HEIC', 'PDF'];
    maxFileSize: '20MB';
  };
}

// AI Service Implementation
class AIService {
  constructor() {
    this.client = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: 'us-central1'
    });
  }
  
  async generateResumeContent(prompt, context = {}) {
    const model = this.client.getGenerativeModel({
      model: 'gemini-2.0-flash-lite-001',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH', 
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });
    
    const enhancedPrompt = this.buildResumePrompt(prompt, context);
    const result = await model.generateContent(enhancedPrompt);
    
    return this.parseResumeResponse(result.response);
  }
  
  buildResumePrompt(userInput, context) {
    return `
      You are a professional resume writer specializing in skilled trades and technical positions.
      
      Context:
      - Trade/Industry: ${context.trade || 'General'}
      - Experience Level: ${context.experienceLevel || 'Mid-level'}
      - Target Role: ${context.targetRole || 'Not specified'}
      
      User Request: ${userInput}
      
      Generate professional resume content that is:
      1. ATS-optimized with relevant keywords
      2. Industry-specific and technically accurate
      3. Action-oriented with quantifiable achievements
      4. Formatted for skilled trades professionals
      
      Output format: JSON with structured sections for experience, skills, and summary.
    `;
  }
}
```

#### **AI Response Processing Pipeline**
```javascript
// AI Response Handler with Error Recovery
const processAIResponse = async (prompt, context, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await aiService.generateResumeContent(prompt, context);
      
      // Validate response structure
      if (!isValidResumeResponse(response)) {
        throw new Error('Invalid response structure');
      }
      
      // Sanitize content
      const sanitizedResponse = sanitizeAIContent(response);
      
      // Log successful generation
      await logAIUsage({
        prompt: prompt.substring(0, 100), // First 100 chars only
        responseLength: JSON.stringify(sanitizedResponse).length,
        model: 'gemini-2.0-flash-lite-001',
        timestamp: new Date().toISOString(),
        success: true
      });
      
      return sanitizedResponse;
      
    } catch (error) {
      console.error(`AI generation attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        // Fallback to template-based content
        return generateFallbackContent(context);
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
};

// Content Sanitization
const sanitizeAIContent = (content) => {
  // Remove potentially harmful content
  const cleaned = content
    .replace(/\b(password|secret|key|token)\b/gi, '[REDACTED]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN-REDACTED]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL-REDACTED]');
  
  // Validate JSON structure
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch (error) {
    throw new Error('Invalid JSON response from AI');
  }
};
```

### **AI Performance Optimization**

#### **Caching Strategy**
```javascript
// Intelligent AI Response Caching
const aiCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const getCachedOrGenerate = async (prompt, context) => {
  const cacheKey = generateCacheKey(prompt, context);
  const cached = aiCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.content;
  }
  
  const content = await processAIResponse(prompt, context);
  
  aiCache.set(cacheKey, {
    content,
    timestamp: Date.now()
  });
  
  return content;
};

const generateCacheKey = (prompt, context) => {
  const normalizedPrompt = prompt.toLowerCase().trim();
  const contextString = JSON.stringify(context);
  return crypto
    .createHash('sha256')
    .update(normalizedPrompt + contextString)
    .digest('hex');
};
```

---

## 💳 Payment Framework Integration

### **Stripe Integration Architecture**

#### **Secure Payment Flow Design**
```javascript
// Stripe Configuration with Security Best Practices
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  maxNetworkRetries: 3,
  timeout: 20000,
  telemetry: false, // Disable for privacy
});

// Checkout Session Creation with Security
const createSecureCheckout = async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, userId } = req.body;
    
    // Validate inputs
    if (!isValidPriceId(priceId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid price ID' 
      });
    }
    
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || 'anonymous',
        product: 'resume_builder_access',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      },
      // Enhanced security options
      payment_intent_data: {
        setup_future_usage: 'off_session', // For potential future charges
      },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Limit to supported regions
      },
      custom_fields: [
        {
          key: 'trade_profession',
          label: { type: 'custom', custom: 'Trade/Profession' },
          type: 'text',
          optional: true,
        }
      ]
    });
    
    // Log checkout creation (no sensitive data)
    await logCheckoutEvent({
      sessionId: session.id,
      userId: userId || 'anonymous',
      amount: session.amount_total,
      currency: session.currency,
      timestamp: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      url: session.url,
      sessionId: session.id 
    });
    
  } catch (error) {
    console.error('Checkout creation failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Payment processing unavailable' 
    });
  }
};
```

#### **Webhook Security Implementation**
```javascript
// Stripe Webhook Handler with Signature Verification
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handlePaymentSuccess(event.data.object);
      break;
      
    case 'payment_intent.succeeded':
      await handlePaymentConfirmed(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
};

const handlePaymentSuccess = async (session) => {
  const { metadata, customer_email, amount_total } = session;
  
  try {
    // Update user subscription status
    if (metadata.userId && metadata.userId !== 'anonymous') {
      await db.collection('users').doc(metadata.userId).update({
        'subscription.active': true,
        'subscription.purchaseDate': admin.firestore.FieldValue.serverTimestamp(),
        'subscription.stripeSessionId': session.id,
        'subscription.amount': amount_total
      });
    }
    
    // Create payment record
    await db.collection('payments').add({
      sessionId: session.id,
      userId: metadata.userId || null,
      email: customer_email,
      amount: amount_total,
      currency: session.currency,
      status: 'completed',
      metadata: metadata,
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Send confirmation email (if email available)
    if (customer_email) {
      await sendPaymentConfirmationEmail(customer_email, {
        amount: amount_total,
        sessionId: session.id
      });
    }
    
  } catch (error) {
    console.error('Payment success handling failed:', error);
    // Note: Don't throw here, as Stripe expects 200 response
  }
};
```

---

## 📊 Analytics & Monitoring Framework

### **Google Analytics 4 Integration**

#### **Event Tracking Architecture**
```typescript
// Analytics Service Implementation
class AnalyticsService {
  private gtag: Function;
  
  constructor() {
    // Initialize Google Analytics 4
    if (typeof window !== 'undefined') {
      this.gtag = (window as any).gtag;
    }
  }
  
  // Custom Event Tracking
  trackEvent(eventName: string, parameters: Record<string, any>) {
    if (this.gtag) {
      this.gtag('event', eventName, {
        event_category: 'engagement',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        ...parameters
      });
    }
    
    // Also log to Firestore for detailed analysis
    this.logToFirestore(eventName, parameters);
  }
  
  // Business-specific events
  trackResumeGeneration(trade: string, aiUsed: boolean) {
    this.trackEvent('resume_generated', {
      event_category: 'resume',
      trade: trade,
      ai_assisted: aiUsed,
      timestamp: new Date().toISOString()
    });
  }
  
  trackPaymentFlow(step: string, sessionId?: string) {
    this.trackEvent('payment_flow', {
      event_category: 'ecommerce',
      payment_step: step,
      session_id: sessionId || 'unknown'
    });
  }
  
  trackAIUsage(feature: string, promptLength: number) {
    this.trackEvent('ai_feature_used', {
      event_category: 'ai_interaction',
      ai_feature: feature,
      prompt_length: promptLength,
      user_type: 'paid' // or 'free' based on subscription
    });
  }
  
  private async logToFirestore(eventName: string, parameters: any) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          parameters,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.error('Analytics logging failed:', error);
    }
  }
}

// Usage in Components
const useAnalytics = () => {
  const analytics = useMemo(() => new AnalyticsService(), []);
  
  const trackUserAction = useCallback((action: string, data?: any) => {
    analytics.trackEvent(action, data);
  }, [analytics]);
  
  return { trackUserAction, analytics };
};
```

### **Performance Monitoring Integration**

#### **Firebase Performance Setup**
```typescript
// Performance Monitoring Configuration
import { getPerformance, trace } from 'firebase/performance';

const perf = getPerformance();

// Custom Performance Traces
export const performanceTracker = {
  // Track critical user journeys
  async trackResumeGeneration(callback: () => Promise<void>) {
    const customTrace = trace(perf, 'resume_generation_flow');
    customTrace.start();
    
    try {
      await callback();
      customTrace.putAttribute('success', 'true');
    } catch (error) {
      customTrace.putAttribute('success', 'false');
      customTrace.putAttribute('error', error.message);
      throw error;
    } finally {
      customTrace.stop();
    }
  },
  
  // Track API response times
  async trackAPICall(endpoint: string, callback: () => Promise<any>) {
    const apiTrace = trace(perf, `api_call_${endpoint}`);
    apiTrace.start();
    
    const startTime = Date.now();
    try {
      const result = await callback();
      const duration = Date.now() - startTime;
      
      apiTrace.putAttribute('response_time', duration.toString());
      apiTrace.putAttribute('status', 'success');
      
      return result;
    } catch (error) {
      apiTrace.putAttribute('status', 'error');
      apiTrace.putAttribute('error_type', error.constructor.name);
      throw error;
    } finally {
      apiTrace.stop();
    }
  },
  
  // Track page load performance
  trackPageLoad(pageName: string) {
    const pageTrace = trace(perf, `page_load_${pageName}`);
    pageTrace.start();
    
    // Stop trace when page is interactive
    window.addEventListener('load', () => {
      pageTrace.putAttribute('page', pageName);
      pageTrace.stop();
    });
  }
};
```

---

## 🔒 Security Framework Implementation

### **Multi-Layer Security Architecture**

#### **Authentication Security Stack**
```typescript
// Firebase Auth Security Configuration
const authConfig = {
  // Email/Password Security
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    maxLength: 128
  },
  
  // Session Management
  sessionTimeout: 3600000, // 1 hour
  refreshTokenRotation: true,
  
  // Multi-Factor Authentication (Future)
  mfaEnabled: false, // To be implemented in Phase 2
  
  // OAuth Security
  googleAuth: {
    prompt: 'select_account',
    hostedDomain: null, // Allow all domains
    scopes: ['email', 'profile']
  }
};

// Token Validation Middleware
const validateAuthToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken, true); // Check revocation
    
    // Additional security checks
    if (!decodedToken.email_verified) {
      return res.status(401).json({ error: 'Email not verified' });
    }
    
    if (decodedToken.iss !== `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`) {
      return res.status(401).json({ error: 'Invalid token issuer' });
    }
    
    req.user = decodedToken;
    next();
    
  } catch (error) {
    console.error('Token validation failed:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

#### **Data Protection Framework**
```javascript
// Input Sanitization and Validation
const { body, validationResult } = require('express-validator');

const validateResumeInput = [
  body('trade').isLength({ min: 2, max: 50 }).trim().escape(),
  body('experience').isInt({ min: 0, max: 50 }),
  body('skills').isArray({ max: 20 }),
  body('skills.*').isLength({ max: 100 }).trim().escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// XSS Protection
const xss = require('xss');

const sanitizeUserContent = (content) => {
  const options = {
    whiteList: {
      p: [],
      br: [],
      strong: [],
      em: [],
      ul: [],
      ol: [],
      li: []
    }
  };
  
  return xss(content, options);
};

// Rate Limiting with Redis (Future Enhancement)
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    store: new RedisStore({
      // Redis configuration for distributed rate limiting
      client: redisClient,
      prefix: 'rl:',
    }),
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
  });
};
```

### **Privacy Compliance Framework**

#### **GDPR/CCPA Implementation**
```typescript
// Privacy Management Service
class PrivacyService {
  // Data Export (GDPR Article 15)
  async exportUserData(userId: string): Promise<UserDataExport> {
    const [user, resumes, analytics] = await Promise.all([
      this.getUserProfile(userId),
      this.getUserResumes(userId),
      this.getUserAnalytics(userId)
    ]);
    
    return {
      profile: user,
      resumes: resumes.map(this.sanitizeResumeForExport),
      analytics: analytics.map(this.sanitizeAnalyticsForExport),
      exportDate: new Date().toISOString(),
      format: 'JSON',
      version: '1.0'
    };
  }
  
  // Data Deletion (GDPR Article 17)
  async deleteUserData(userId: string): Promise<DeletionReport> {
    const batch = db.batch();
    
    // Delete user profile
    const userRef = db.collection('users').doc(userId);
    batch.delete(userRef);
    
    // Delete user resumes
    const resumesSnapshot = await db.collection('resumes')
      .where('userId', '==', userId)
      .get();
    resumesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    
    // Anonymize analytics (retain for business intelligence)
    const analyticsSnapshot = await db.collection('analytics')
      .where('userId', '==', userId)
      .get();
    analyticsSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        userId: null,
        anonymized: true,
        deletionDate: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    
    return {
      userId,
      deletedCollections: ['users', 'resumes'],
      anonymizedCollections: ['analytics'],
      deletionDate: new Date().toISOString(),
      status: 'completed'
    };
  }
  
  // Consent Management
  async updateConsent(userId: string, consents: ConsentPreferences): Promise<void> {
    await db.collection('users').doc(userId).update({
      'privacy.consents': consents,
      'privacy.consentDate': admin.firestore.FieldValue.serverTimestamp(),
      'privacy.consentVersion': '1.0'
    });
  }
}
```

---

## 🚀 Deployment & DevOps Framework

### **CI/CD Pipeline Architecture**

#### **GitHub Actions Workflow**
```yaml
# .github/workflows/production-deploy.yml
name: Production Deployment Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  FIREBASE_PROJECT_ID: 'tradehustleresumebuilder'

jobs:
  # Quality Gates
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: |
            frontend/package-lock.json
            api-functions/package-lock.json
      
      - name: Install Frontend Dependencies
        run: |
          cd frontend
          npm ci
      
      - name: TypeScript Type Check
        run: |
          cd frontend
          npm run type-check
      
      - name: ESLint Code Quality
        run: |
          cd frontend
          npm run lint
      
      - name: Unit Tests
        run: |
          cd frontend
          npm test -- --coverage --watchAll=false
      
      - name: Build Frontend
        run: |
          cd frontend
          npm run build
          npm run export
      
      - name: Install Backend Dependencies
        run: |
          cd api-functions
          npm ci
      
      - name: Backend Security Audit
        run: |
          cd api-functions
          npm audit --audit-level=high
  
  # Security Scanning
  security-scan:
    runs-on: ubuntu-latest
    needs: quality-checks
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
  
  # Deploy to Firebase
  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: [quality-checks, security-scan]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Build Application
        run: |
          cd frontend && npm ci && npm run build && npm run export
          cd ../api-functions && npm ci
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: ${{ env.FIREBASE_PROJECT_ID }}
          channelId: live
  
  # Post-deployment testing
  smoke-tests:
    runs-on: ubuntu-latest
    needs: deploy-production
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Testing Dependencies
        run: npm install -g @playwright/test
      
      - name: Run Smoke Tests
        run: |
          npx playwright test tests/smoke/
        env:
          BASE_URL: https://tradehustleresumebuilder.web.app
```

### **Infrastructure as Code**

#### **Firebase Configuration**
```json
// firebase.json - Infrastructure Configuration
{
  "hosting": {
    "public": "frontend/out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          },
          {
            "key": "X-Content-Type-Options", 
            "value": "nosniff"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      }
    ]
  },
  "functions": [
    {
      "source": "api-functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ]
    }
  ],
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  }
}
```

---

## 📈 Performance Optimization Framework

### **Frontend Performance Strategy**

#### **Bundle Optimization**
```javascript
// next.config.js - Advanced Configuration
const nextConfig = {
  // Performance optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Bundle analysis and optimization
  webpack: (config, { dev, isServer, webpack }) => {
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
        }
      }
    };
    
    // Tree shaking for unused code
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;
    
    // Analyze bundle in development
    if (dev && !isServer) {
      config.plugins.push(
        new webpack.BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: false,
          analyzerPort: 8888
        })
      );
    }
    
    return config;
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    turbotrace: {
      logLevel: 'error'
    }
  }
};
```

#### **Resource Loading Optimization**
```typescript
// Critical Resource Preloading
const ResourceOptimizer = {
  preloadCriticalAssets() {
    // Preload critical fonts
    const fontPreloads = [
      '/fonts/anton-regular.woff2',
      '/fonts/merriweather-regular.woff2'
    ];
    
    fontPreloads.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font;
      document.head.appendChild(link);
    });
    
    // Preload critical images
    const criticalImages = [
      '/assets/resumeBuilderLogo-v3.png',
      '/assets/brick-bg-v3.webp'
    ];
    
    criticalImages.forEach(image => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = image;
      document.head.appendChild(link);
    });
  },
  
  // Lazy load non-critical resources
  lazyLoadSecondaryAssets() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Load paint splatter assets when browser is idle
        import('@/components/PaintSplatter');
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        import('@/components/PaintSplatter');
      }, 2000);
    }
  }
};
```

### **Backend Performance Optimization**

#### **Function Optimization**
```javascript
// Firebase Functions Performance Optimization
const optimizedFunctionConfig = {
  // Memory allocation based on function complexity
  textGeneration: {
    memory: '1GiB',        // AI processing requires more memory
    timeoutSeconds: 60,    // Allow time for AI generation
    maxInstances: 50,      // Limit concurrent AI calls
    concurrency: 1         // One AI request per instance
  },
  
  paymentProcessing: {
    memory: '512MiB',      // Standard memory for API calls
    timeoutSeconds: 30,    // Quick payment processing
    maxInstances: 100,     // Handle payment spikes
    concurrency: 10        // Multiple payments per instance
  },
  
  webhookHandling: {
    memory: '256MiB',      // Minimal memory for webhooks
    timeoutSeconds: 10,    // Fast webhook responses
    maxInstances: 200,     // High concurrency for webhooks
    concurrency: 20        // Many webhooks per instance
  }
};

// Connection pooling and caching
const performanceOptimizations = {
  // HTTP client with keep-alive
  httpClient: new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 30000,
    maxSockets: 50,
    timeout: 20000
  }),
  
  // In-memory cache for frequently accessed data
  cache: new NodeCache({
    stdTTL: 300,          // 5 minutes default TTL
    checkperiod: 60,      // Check for expired keys every minute
    useClones: false,     // Don't clone objects for better performance
    maxKeys: 1000         // Limit cache size
  }),
  
  // Database query optimization
  optimizeFirestoreQueries: {
    // Use pagination instead of large queries
    maxPageSize: 50,
    
    // Create composite indexes for complex queries
    requiredIndexes: [
      'users: uid, subscription.active',
      'resumes: userId, updatedAt',
      'analytics: eventType, timestamp'
    ],
    
    // Use select() for partial document retrieval
    selectFields: ['id', 'title', 'updatedAt'] // Only fetch needed fields
  }
};
```

---

*This Full Stack Framework Briefing provides comprehensive technical guidance for understanding, maintaining, and scaling the Trade Hustle Resume Builder platform across all architectural layers.*
