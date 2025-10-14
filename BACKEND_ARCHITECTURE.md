# Backend Systems Architecture - Trade Hustle Resume Builder

## 🏗️ Overview

Complete backend infrastructure built on Firebase + Google Cloud Platform with Stripe payment processing and Vertex AI integration.

---

## 🔐 I1: Authentication Layer

### Provider: Firebase Authentication

#### Supported Methods
1. **Google OAuth 2.0**
2. **Apple Sign-In**
3. **Email/Password**
4. **Magic Link (Passwordless)**

#### Security Features
- ✅ 2FA/MFA support
- ✅ Session management (JWT tokens)
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting
- ✅ Token refresh mechanism

### Implementation

**File**: `api-functions/middleware/auth.js`

```javascript
const admin = require('firebase-admin');

// Verify Firebase ID Token
async function verifyUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'user'
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

// Role-based access control
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }
    next();
  };
}

module.exports = { verifyUser, requireRole };
```

---

## 💾 I2: Database Layer

### Provider: Firestore

#### Collection Structure

```typescript
// Firestore Schema

interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  trade?: string
  subscriptionTier: 'free' | 'trial' | 'pro-monthly' | 'pro-annual'
  subscriptionStatus: 'active' | 'canceled' | 'expired'
  subscriptionExpiry?: Date
  stripeCustomerId?: string
  createdAt: Date
  lastLogin: Date
  preferences: {
    emailNotifications: boolean
    smsAlerts: boolean
  }
}

interface Resume {
  id: string
  userId: string
  name: string
  trade: string
  templateId: string
  data: {
    personalInfo: PersonalInfo
    workExperience: WorkExperience[]
    skills: string[]
    certifications: Certification[]
    education: Education[]
  }
  atsScore: number
  version: number
  createdAt: Date
  updatedAt: Date
  downloads: number
}

interface JobApplication {
  id: string
  userId: string
  company: string
  position: string
  status: 'applied' | 'interview' | 'offer' | 'rejected'
  appliedDate: Date
  interviewDate?: Date
  salary?: number
  notes: string
  resumeId: string
  createdAt: Date
  updatedAt: Date
}

interface CertificationDocument {
  id: string
  userId: string
  name: string
  issuer: string
  issueDate: Date
  expiryDate: Date
  fileUrl: string
  fileType: string
  fileSize: number
  verified: boolean
  createdAt: Date
}

interface CareerBlueprint {
  id: string
  trade: string
  title: string
  description: string
  content: string
  milestones: Milestone[]
  salaryRanges: SalaryRange[]
  requiredCerts: string[]
  locked: boolean
  price?: number
}

interface Referral {
  id: string
  referrerId: string
  referredUserId?: string
  referralCode: string
  status: 'pending' | 'converted' | 'paid'
  commissionRate: number
  commissionAmount: number
  createdAt: Date
  convertedAt?: Date
  paidAt?: Date
}
```

#### Indexes

```javascript
// Firestore Indexes Configuration

const indexes = [
  // Users
  { collection: 'users', fields: ['subscriptionTier', 'createdAt'] },
  { collection: 'users', fields: ['subscriptionStatus', 'subscriptionExpiry'] },
  
  // Resumes
  { collection: 'resumes', fields: ['userId', 'updatedAt'] },
  { collection: 'resumes', fields: ['trade', 'atsScore'] },
  { collection: 'resumes', fields: ['userId', 'createdAt'] },
  
  // Jobs
  { collection: 'jobs', fields: ['userId', 'status', 'appliedDate'] },
  { collection: 'jobs', fields: ['userId', 'interviewDate'] },
  
  // Certifications
  { collection: 'certifications', fields: ['userId', 'expiryDate'] },
  { collection: 'certifications', fields: ['userId', 'createdAt'] },
  
  // Referrals
  { collection: 'referrals', fields: ['referrerId', 'status'] },
  { collection: 'referrals', fields: ['referralCode'] }
];
```

---

## 💳 I3: Payment Gateway

### Provider: Stripe

#### Product Configuration

```javascript
// Stripe Products & Prices

const stripeProducts = {
  trial: {
    id: 'prod_trial',
    name: '7-Day Trial',
    price: 200, // $2.00 in cents
    currency: 'usd',
    type: 'one_time',
    priceId: 'price_trial_001'
  },
  
  proMonthly: {
    id: 'prod_pro_monthly',
    name: 'Pro Monthly',
    price: 1495, // $14.95 in cents
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    priceId: 'price_1SHfAyLr4v4blpwbcvDqbej8'
  },
  
  proAnnual: {
    id: 'prod_pro_annual',
    name: 'Pro Annual',
    price: 11900, // $119.00 in cents
    currency: 'usd',
    type: 'recurring',
    interval: 'year',
    priceId: 'price_annual_001',
    savings: 6040 // $60.40 savings
  },
  
  blueprint: {
    id: 'prod_blueprint',
    name: 'Career Blueprint',
    price: 2900, // $29.00 in cents
    currency: 'usd',
    type: 'one_time',
    priceId: 'price_blueprint_001'
  }
};
```

#### Stripe Webhook Handler

**File**: `api-functions/routes/stripe.js`

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

// Create Checkout Session
app.post('/api/createCheckout', verifyUser, async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    const userId = req.user.uid;

    // Get or create Stripe customer
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    let stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { firebaseUID: userId }
      });
      stripeCustomerId = customer.id;
      
      await admin.firestore().collection('users').doc(userId).update({
        stripeCustomerId
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      mode: priceId.includes('recurring') ? 'subscription' : 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        firebaseUID: userId,
        priceId
      }
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stripe Webhook Handler
app.post('/api/webhook/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = admin.firestore();

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.firebaseUID;
      
      await db.collection('users').doc(userId).update({
        subscriptionStatus: 'active',
        subscriptionTier: mapPriceToTier(session.metadata.priceId),
        subscriptionExpiry: calculateExpiry(session.metadata.priceId)
      });
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object;
      const customerId = subscription.customer;
      
      // Find user by Stripe customer ID
      const userQuery = await db.collection('users')
        .where('stripeCustomerId', '==', customerId)
        .get();
      
      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({
          subscriptionStatus: subscription.status,
          subscriptionExpiry: new Date(subscription.current_period_end * 1000)
        });
      }
      break;

    case 'customer.subscription.deleted':
      const canceledSub = event.data.object;
      const canceledCustomerId = canceledSub.customer;
      
      const canceledUserQuery = await db.collection('users')
        .where('stripeCustomerId', '==', canceledCustomerId)
        .get();
      
      if (!canceledUserQuery.empty) {
        await canceledUserQuery.docs[0].ref.update({
          subscriptionStatus: 'canceled',
          subscriptionTier: 'free'
        });
      }
      break;
  }

  res.json({ received: true });
});

function mapPriceToTier(priceId) {
  if (priceId.includes('trial')) return 'trial';
  if (priceId.includes('annual')) return 'pro-annual';
  if (priceId.includes('monthly')) return 'pro-monthly';
  return 'free';
}

function calculateExpiry(priceId) {
  const now = new Date();
  if (priceId.includes('trial')) {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  } else if (priceId.includes('annual')) {
    return new Date(now.setFullYear(now.getFullYear() + 1)); // 1 year
  } else if (priceId.includes('monthly')) {
    return new Date(now.setMonth(now.getMonth() + 1)); // 1 month
  }
  return null;
}

module.exports = app;
```

---

## 🤖 I4: Enhanced Intelligence Engine

### Provider: Vertex AI (Gemini)

#### Models Configuration

```javascript
const { VertexAI } = require('@google-cloud/vertexai');

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: 'us-central1'
});

const models = {
  // Fast, lightweight for suggestions
  text: vertexAI.preview.getGenerativeModel({
    model: 'gemini-2.0-flash-lite-001',
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
      topP: 0.8
    }
  }),
  
  // Powerful for analysis
  analysis: vertexAI.preview.getGenerativeModel({
    model: 'gemini-1.5-pro-001',
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.5,
      topP: 0.9
    }
  })
};
```

#### AI Capabilities

**File**: `api-functions/services/ai.js`

```javascript
// Resume Content Suggestions
async function generateResumeSuggestions(trade, field, currentValue) {
  const prompt = `
As a professional resume writer specializing in ${trade} trade positions, 
improve the following ${field}:

Current: ${currentValue}

Provide 3 professional alternatives that:
1. Use strong action verbs
2. Include quantifiable achievements
3. Are ATS-optimized
4. Are trade-specific

Format as JSON array of strings.
`;

  const result = await models.text.generateContent(prompt);
  const response = result.response.text();
  
  try {
    return JSON.parse(response);
  } catch {
    return [response];
  }
}

// ATS Score Calculation
async function calculateATSScore(resumeData, trade) {
  const prompt = `
Analyze this ${trade} resume for ATS (Applicant Tracking System) compatibility.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Provide analysis in JSON format:
{
  "score": 0-100,
  "keywords": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  },
  "formatting": {
    "passed": true/false,
    "issues": ["issue1", "issue2"]
  },
  "suggestions": ["suggestion1", "suggestion2"]
}
`;

  const result = await models.analysis.generateContent(prompt);
  const response = result.response.text();
  
  try {
    return JSON.parse(response);
  } catch {
    return {
      score: 70,
      keywords: { found: [], missing: [] },
      formatting: { passed: true, issues: [] },
      suggestions: ['Unable to analyze at this time']
    };
  }
}

// Achievement Enhancement
async function enhanceAchievement(achievement, trade) {
  const prompt = `
Enhance this ${trade} work achievement to be more impactful:

Original: ${achievement}

Make it:
1. More specific with metrics
2. Action-oriented
3. Results-focused
4. Industry-appropriate

Return only the enhanced version.
`;

  const result = await models.text.generateContent(prompt);
  return result.response.text().trim();
}

// Job Description Matching
async function matchJobDescription(resumeData, jobDescription) {
  const prompt = `
Compare this resume with the job description and provide match score.

Resume Skills: ${resumeData.skills.join(', ')}
Resume Experience: ${resumeData.workExperience.map(e => e.jobTitle).join(', ')}

Job Description:
${jobDescription}

Return JSON:
{
  "matchScore": 0-100,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "recommendations": ["rec1", "rec2"]
}
`;

  const result = await models.analysis.generateContent(prompt);
  const response = result.response.text();
  
  try {
    return JSON.parse(response);
  } catch {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      recommendations: []
    };
  }
}

module.exports = {
  generateResumeSuggestions,
  calculateATSScore,
  enhanceAchievement,
  matchJobDescription
};
```

#### API Endpoints

**File**: `api-functions/routes/ai.js`

```javascript
// AI Suggestions Endpoint
app.post('/api/getSuggestions', verifyUser, rateLimiter, async (req, res) => {
  try {
    const { trade, field, value } = req.body;
    
    if (!trade || !field || !value) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const suggestions = await generateResumeSuggestions(trade, field, value);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ATS Analysis Endpoint
app.post('/api/analyzeATS', verifyUser, rateLimiter, async (req, res) => {
  try {
    const { resumeData, trade } = req.body;
    
    if (!resumeData || !trade) {
      return res.status(400).json({
        success: false,
        error: 'Missing resume data or trade'
      });
    }

    const analysis = await calculateATSScore(resumeData, trade);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Enhancement Endpoint
app.post('/api/enhanceAchievement', verifyUser, rateLimiter, async (req, res) => {
  try {
    const { achievement, trade } = req.body;
    
    const enhanced = await enhanceAchievement(achievement, trade);
    
    res.json({
      success: true,
      enhanced
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = app;
```

---

## 📦 I5: Cloud Storage

### Provider: Firebase Storage

#### Bucket Structure

```javascript
const bucketStructure = {
  // Resume Templates
  templates: {
    path: 'templates/{trade}/{templateId}',
    fileTypes: ['.json', '.html', '.css'],
    access: 'public-read',
    caching: '7 days'
  },
  
  // User Certifications
  certifications: {
    path: 'users/{userId}/certifications/{certId}',
    fileTypes: ['.pdf', '.jpg', '.png'],
    maxSize: '5MB',
    access: 'private',
    metadata: {
      userId: true,
      certName: true,
      uploadDate: true
    }
  },
  
  // Generated Exports
  exports: {
    path: 'users/{userId}/exports/{resumeId}',
    fileTypes: ['.pdf', '.docx', '.txt'],
    ttl: '7 days', // Auto-delete after 7 days
    access: 'private'
  }
};
```

#### Storage Operations

**File**: `api-functions/services/storage.js`

```javascript
const admin = require('firebase-admin');
const bucket = admin.storage().bucket();

// Upload Certification
async function uploadCertification(userId, file, metadata) {
  const fileName = `users/${userId}/certifications/${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
      metadata: {
        userId,
        uploadDate: new Date().toISOString(),
        ...metadata
      }
    }
  });

  // Generate signed URL (7 days)
  const [url] = await fileUpload.getSignedUrl({
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000
  });

  return {
    fileUrl: url,
    fileName: fileName,
    fileSize: file.size,
    fileType: file.mimetype
  };
}

// Generate Resume Export
async function saveResumeExport(userId, resumeId, pdfBuffer) {
  const fileName = `users/${userId}/exports/${resumeId}_${Date.now()}.pdf`;
  const fileUpload = bucket.file(fileName);

  await fileUpload.save(pdfBuffer, {
    metadata: {
      contentType: 'application/pdf',
      metadata: {
        userId,
        resumeId,
        generatedAt: new Date().toISOString()
      }
    }
  });

  // Set TTL (auto-delete after 7 days)
  await fileUpload.setMetadata({
    customTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  const [url] = await fileUpload.getSignedUrl({
    action: 'read',
    expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });

  return url;
}

// Get Template
async function getTemplate(trade, templateId) {
  const fileName = `templates/${trade}/${templateId}.json`;
  const file = bucket.file(fileName);

  const [exists] = await file.exists();
  if (!exists) {
    throw new Error('Template not found');
  }

  const [contents] = await file.download();
  return JSON.parse(contents.toString());
}

// Delete Certification
async function deleteCertification(userId, fileName) {
  const file = bucket.file(fileName);
  
  // Verify ownership
  const [metadata] = await file.getMetadata();
  if (metadata.metadata.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await file.delete();
  return true;
}

module.exports = {
  uploadCertification,
  saveResumeExport,
  getTemplate,
  deleteCertification
};
```

#### Storage Limits

```javascript
const storageLimits = {
  free: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxTotalStorage: 50 * 1024 * 1024, // 50MB
    maxCertifications: 5
  },
  
  trial: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxTotalStorage: 100 * 1024 * 1024, // 100MB
    maxCertifications: 10
  },
  
  pro: {
    maxFileSize: 25 * 1024 * 1024, // 25MB
    maxTotalStorage: 500 * 1024 * 1024, // 500MB
    maxCertifications: 50
  }
};

// Middleware to check storage limits
async function checkStorageLimit(req, res, next) {
  const userId = req.user.uid;
  const tier = req.user.subscriptionTier || 'free';
  
  // Get current storage usage
  const [files] = await bucket.getFiles({
    prefix: `users/${userId}/`
  });
  
  const totalSize = files.reduce((sum, file) => sum + parseInt(file.metadata.size), 0);
  const limit = storageLimits[tier].maxTotalStorage;
  
  if (totalSize + req.file.size > limit) {
    return res.status(413).json({
      success: false,
      error: 'Storage limit exceeded',
      current: totalSize,
      limit: limit
    });
  }
  
  next();
}

module.exports = { checkStorageLimit };
```

---

## 🔄 Complete Backend Flow

```
User Request
    ↓
API Gateway (Express + Firebase Functions)
    ↓
Authentication Middleware (verifyUser)
    ↓
Rate Limiter
    ↓
Business Logic
    ├─ Firestore (Data persistence)
    ├─ Vertex AI (AI operations)
    ├─ Storage (File operations)
    └─ Stripe (Payment operations)
    ↓
Response to Client
```

---

## 📊 Monitoring & Analytics

```javascript
// Cloud Monitoring
const monitoring = {
  metrics: [
    'API response time',
    'Error rate',
    'Active users',
    'Storage usage',
    'AI API calls',
    'Stripe transactions'
  ],
  
  alerts: [
    { metric: 'error_rate', threshold: '> 5%', action: 'email' },
    { metric: 'response_time', threshold: '> 3s', action: 'slack' },
    { metric: 'storage_usage', threshold: '> 80%', action: 'email' }
  ]
};
```

---

**Status**: ✅ Backend Architecture Complete
**Version**: 1.0.0
**Last Updated**: October 13, 2025
