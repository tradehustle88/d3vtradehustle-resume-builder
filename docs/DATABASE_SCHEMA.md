# Firestore Database Schema

**Trade Hustle Resume Builder - Complete Database Structure**  
**Last Updated:** October 14, 2025

---

## 📊 Collections Overview

| Collection | Purpose | Security |
|------------|---------|----------|
| `users` | User profiles & subscription data | User read/write own |
| `resumes` | Resume documents & versions | User read/write own |
| `jobs` | Job application tracking | User read/write own |
| `certifications` | License & cert storage | User read/write own |
| `blueprints` | Career advancement paths | Public read, Admin write |
| `referrals` | Referral tracking | User read own, System write |
| `subscriptions` | Stripe subscription data | User read own, System write |
| `templates` | Resume templates | Public read, Admin write |

---

## 🔷 Collection: `users`

**Path:** `/users/{userId}`

### Schema

```typescript
interface User {
  // Identity
  uid: string;                    // Firebase Auth UID
  email: string;                  // User email
  displayName: string;            // Display name
  photoURL?: string;              // Profile photo URL
  
  // Trade Information
  tradeType: 
    | 'electrician' 
    | 'plumber' 
    | 'hvac' 
    | 'carpenter' 
    | 'mason' 
    | 'welder' 
    | 'mechanic' 
    | 'contractor' 
    | 'custom';
  customTrade?: string;           // If tradeType is 'custom'
  
  // Subscription
  subscriptionTier: 
    | 'free'                      // Free tier (limited features)
    | 'trial'                     // $2 trial (7 days)
    | 'pro-monthly'               // $14.95/month
    | 'pro-annual';               // $119/year
  subscriptionStatus: 
    | 'active'                    // Currently subscribed
    | 'canceled'                  // Canceled but still active until end
    | 'expired'                   // Subscription expired
    | 'trialing';                 // In trial period
  subscriptionStartDate?: Timestamp;
  subscriptionEndDate?: Timestamp;
  stripeCustomerId?: string;      // Stripe customer ID
  stripeSubscriptionId?: string;  // Stripe subscription ID
  
  // Preferences
  preferences: {
    templateId: string;           // Default template ID
    notifications: boolean;       // Enable notifications
    emailFrequency: 
      | 'daily' 
      | 'weekly' 
      | 'none';
    theme?: 'light' | 'dark';
    language?: string;            // 'en', 'es', etc.
  };
  
  // Referral Program
  referralCode: string;           // Unique referral code
  referredBy?: string;            // UID of referring user
  totalReferrals: number;         // Count of successful referrals
  referralEarnings: number;       // Total earnings ($5 per referral)
  referralsPending: number;       // Pending conversions
  
  // Usage Tracking
  resumesCreated: number;         // Count of resumes created
  jobsTracked: number;            // Count of jobs tracked
  certsStored: number;            // Count of certifications
  aiSuggestionsUsed: number;      // Count of AI suggestions used
  
  // Timestamps
  createdAt: Timestamp;
  lastLogin: Timestamp;
  updatedAt: Timestamp;
}
```

### Indexes Required

```javascript
users
  - uid (automatic)
  - email (automatic)
  - referralCode (ascending)
  - subscriptionTier, subscriptionStatus (composite)
```

### Security Rules

```javascript
match /users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow create: if request.auth != null && request.auth.uid == userId;
  allow update: if request.auth != null && request.auth.uid == userId
    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny([
      'stripeCustomerId', 
      'stripeSubscriptionId',
      'referralEarnings',
      'subscriptionStatus'
    ])); // Prevent users from modifying payment fields
  allow delete: if false; // Prevent deletion, use soft delete
}
```

---

## 📄 Collection: `resumes`

**Path:** `/resumes/{resumeId}`

### Schema

```typescript
interface Resume {
  // Identity
  id: string;                     // Document ID
  userId: string;                 // Owner user ID
  templateId: string;             // Template used
  tradeType: string;              // Trade type
  title: string;                  // Resume title/name
  
  // Step 1: Profile Information
  profile: {
    fullName: string;
    email: string;
    phone: string;
    location: string;             // "City, State"
    summary: string;              // Professional summary
    photoURL?: string;            // Optional profile photo
    linkedIn?: string;
    portfolio?: string;
  };
  
  // Step 2: Work Experience
  experience: Array<{
    id: string;                   // Unique ID for this experience
    jobTitle: string;
    companyName: string;
    location: string;
    startDate: string;            // ISO date string
    endDate?: string;             // ISO date string or null if current
    current: boolean;             // Currently working here
    responsibilities: string[];   // List of responsibilities
    achievements: string[];       // Quantified achievements
    intelligenceSuggestions?: string[]; // AI-generated suggestions
    atsOptimized: boolean;        // Whether optimized by AI
  }>;
  
  // Step 3: Skills & Certifications
  skills: {
    // Technical/Trade Skills
    technical: Array<{
      skill: string;              // Skill name
      proficiency: 1 | 2 | 3 | 4 | 5; // 1=Beginner, 5=Expert
      yearsExperience?: number;
    }>;
    
    // Tools & Equipment
    tools: Array<{
      name: string;
      category?: string;          // e.g., "Power Tools", "Software"
    }>;
    
    // Licenses
    licenses: Array<{
      name: string;               // License name
      number: string;             // License number
      issueDate: string;          // ISO date
      expirationDate?: string;    // ISO date
      issuingAuthority: string;   // e.g., "State Board"
      state?: string;
    }>;
    
    // Certifications
    certifications: Array<{
      name: string;
      issuer: string;
      dateObtained: string;
      expirationDate?: string;
      certId?: string;
    }>;
  };
  
  // Step 4: Education
  education: Array<{
    id: string;
    institution: string;
    degree: string;               // e.g., "Associate's", "Certificate"
    field: string;                // Field of study
    location?: string;
    graduationDate: string;       // ISO date or "Expected YYYY"
    gpa?: string;
    honors?: string[];
  }>;
  
  // References
  references: Array<{
    id: string;
    name: string;
    title: string;
    company: string;
    phone: string;
    email: string;
    relationship: string;         // e.g., "Former Supervisor"
  }>;
  
  // Additional Sections (Optional)
  projects?: Array<{
    name: string;
    description: string;
    role: string;
    startDate: string;
    endDate?: string;
    skills: string[];
  }>;
  
  awards?: Array<{
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
  
  // AI & Optimization
  atsScore: number;               // 0-100 ATS compatibility score
  atsAnalysis?: {
    strengths: string[];
    improvements: string[];
    keywords: string[];
    missingKeywords: string[];
  };
  aiOptimized: boolean;           // Has been AI-optimized
  targetJob?: string;             // Target job description for optimization
  
  // Metadata
  versions: number;               // Version number
  lastModified: Timestamp;
  createdAt: Timestamp;
  
  // Sharing & Export
  shareLink?: string;             // Public share link
  shareEnabled: boolean;
  downloads: number;              // Download count
  views: number;                  // View count
  
  // Status
  status: 'draft' | 'complete' | 'archived';
  isPrimary: boolean;             // Is this the primary resume?
}
```

### Indexes Required

```javascript
resumes
  - userId, createdAt (composite, descending)
  - userId, isPrimary (composite)
  - userId, status (composite)
  - shareLink (ascending)
```

### Security Rules

```javascript
match /resumes/{resumeId} {
  allow read: if request.auth != null && (
    resource.data.userId == request.auth.uid ||
    (resource.data.shareEnabled == true && request.shareLink != null)
  );
  allow create: if request.auth != null && 
    request.resource.data.userId == request.auth.uid;
  allow update: if request.auth != null && 
    resource.data.userId == request.auth.uid;
  allow delete: if request.auth != null && 
    resource.data.userId == request.auth.uid;
}
```

---

## 💼 Collection: `jobs`

**Path:** `/jobs/{jobId}`

### Schema (Job Application Tracker)

```typescript
interface JobApplication {
  // Identity
  id: string;
  userId: string;
  resumeId?: string;              // Resume used for this application
  
  // Job Details
  company: string;
  position: string;
  location: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'temporary';
  salary?: string;                // e.g., "$50k-$70k"
  jobUrl?: string;                // Link to job posting
  jobDescription?: string;
  
  // Application Status
  status: 
    | 'saved'                     // Saved for later
    | 'applied'                   // Application submitted
    | 'screening'                 // Under review
    | 'interview'                 // Interview scheduled/completed
    | 'offer'                     // Offer received
    | 'rejected'                  // Application rejected
    | 'accepted'                  // Offer accepted
    | 'withdrawn';                // Application withdrawn
  
  // Timeline
  savedDate?: Timestamp;
  appliedDate?: Timestamp;
  lastStatusUpdate: Timestamp;
  
  // Interviews
  interviews: Array<{
    id: string;
    date: Timestamp;
    type: 'phone' | 'video' | 'in-person' | 'technical';
    duration?: number;            // Minutes
    interviewer?: string;
    notes: string;
    outcome?: 'passed' | 'rejected' | 'pending';
    followUpRequired: boolean;
  }>;
  
  // Contacts
  contacts: Array<{
    name: string;
    title: string;
    email?: string;
    phone?: string;
    linkedIn?: string;
    notes?: string;
  }>;
  
  // Notes & Follow-up
  notes: string;
  followUpDate?: Timestamp;
  reminderSent: boolean;
  reminderDate?: Timestamp;
  
  // Documents
  documents: Array<{
    type: 'resume' | 'cover_letter' | 'portfolio' | 'other';
    url: string;
    name: string;
  }>;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archived: boolean;
}
```

### Indexes Required

```javascript
jobs
  - userId, status (composite)
  - userId, appliedDate (composite, descending)
  - userId, followUpDate (composite, ascending)
  - userId, reminderSent, reminderDate (composite)
```

### Security Rules

```javascript
match /jobs/{jobId} {
  allow read: if request.auth != null && 
    resource.data.userId == request.auth.uid;
  allow create: if request.auth != null && 
    request.resource.data.userId == request.auth.uid;
  allow update: if request.auth != null && 
    resource.data.userId == request.auth.uid;
  allow delete: if request.auth != null && 
    resource.data.userId == request.auth.uid;
}
```

---

## 🎓 Collection: `certifications`

**Path:** `/certifications/{certId}`

### Schema (Certification Vault)

```typescript
interface Certification {
  // Identity
  id: string;
  userId: string;
  
  // Certification Details
  name: string;
  type: 
    | 'license'                   // Professional license
    | 'certification'             // Industry certification
    | 'diploma'                   // Educational diploma
    | 'training'                  // Training completion
    | 'other';
  category?: string;              // e.g., "Safety", "Technical"
  
  number: string;                 // Certification/License number
  issueDate: Timestamp;
  expirationDate?: Timestamp;     // null if no expiration
  issuingAuthority: string;       // e.g., "NCCER", "State Board"
  
  // File Storage
  fileURL: string;                // Cloud Storage URL
  fileName: string;
  fileType: string;               // MIME type
  fileSize: number;               // Bytes
  thumbnailURL?: string;          // Preview thumbnail
  
  // Sharing
  shareLink?: string;             // Public share link
  shareEnabled: boolean;
  accessCount: number;            // Times accessed via share link
  
  // Alerts
  expirationAlertEnabled: boolean;
  expirationAlertDays: number;    // Days before expiration to alert
  expirationAlertSent: boolean;
  lastAlertDate?: Timestamp;
  
  // Status
  status: 'active' | 'expired' | 'expiring_soon' | 'archived';
  verified: boolean;              // Manually verified by user
  
  // Metadata
  tags: string[];                 // User-defined tags
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Indexes Required

```javascript
certifications
  - userId, status (composite)
  - userId, expirationDate (composite, ascending)
  - userId, type (composite)
  - userId, expirationAlertSent, expirationDate (composite)
```

### Security Rules

```javascript
match /certifications/{certId} {
  allow read: if request.auth != null && (
    resource.data.userId == request.auth.uid ||
    (resource.data.shareEnabled == true && request.shareLink != null)
  );
  allow create: if request.auth != null && 
    request.resource.data.userId == request.auth.uid;
  allow update: if request.auth != null && 
    resource.data.userId == request.auth.uid;
  allow delete: if request.auth != null && 
    resource.data.userId == request.auth.uid;
}
```

---

## 🗺️ Collection: `blueprints`

**Path:** `/blueprints/{blueprintId}`

### Schema (Career Advancement Paths)

```typescript
interface CareerBlueprint {
  // Identity
  id: string;
  tradeType: string;              // Associated trade
  
  // Blueprint Info
  title: string;                  // e.g., "Electrician Apprentice to Master"
  subtitle?: string;
  description: string;
  overview: string;               // Detailed overview
  
  estimatedYears: number;         // Total years for path
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Career Path Steps
  steps: Array<{
    phase: string;                // e.g., "Apprentice", "Journeyman"
    phaseNumber: number;
    yearsRequired: number;
    
    // Requirements
    certifications: Array<{
      name: string;
      required: boolean;
      cost?: string;
      timeToComplete?: string;
    }>;
    
    skills: Array<{
      skill: string;
      level: 'basic' | 'intermediate' | 'advanced' | 'expert';
    }>;
    
    education?: Array<{
      type: string;
      description: string;
      required: boolean;
    }>;
    
    // Expectations
    salaryRange: string;          // e.g., "$40k-$60k"
    responsibilities: string[];
    typical_tasks: string[];
    
    // Resources
    resources: Array<{
      title: string;
      url: string;
      type: 'article' | 'video' | 'course' | 'book';
    }>;
  }>;
  
  // Pricing & Access
  price: number;                  // $29
  stripeProductId: string;
  stripePriceId: string;
  
  // Statistics
  purchasedCount: number;
  purchasedBy: string[];          // Array of user IDs
  rating?: number;                // Average rating 1-5
  reviews: number;                // Review count
  
  // Metadata
  featured: boolean;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;              // Admin user ID
}
```

### Indexes Required

```javascript
blueprints
  - tradeType, published (composite)
  - published, featured (composite)
  - purchasedBy (array-contains)
```

### Security Rules

```javascript
match /blueprints/{blueprintId} {
  allow read: if resource.data.published == true ||
    (request.auth != null && resource.data.purchasedBy.hasAny([request.auth.uid]));
  allow create, update, delete: if request.auth != null && 
    request.auth.token.admin == true;
}
```

---

## 🎁 Collection: `referrals`

**Path:** `/referrals/{referralId}`

### Schema

```typescript
interface Referral {
  // Identity
  id: string;
  referrerId: string;             // User who sent referral
  referredUserId?: string;        // User who signed up (null if pending)
  referralCode: string;           // Unique referral code
  
  // Referral Details
  email?: string;                 // Email of referred person (if shared)
  source?: string;                // Where referral was shared
  
  // Status Tracking
  status: 
    | 'pending'                   // Link clicked, no signup yet
    | 'signed_up'                 // User signed up
    | 'converted'                 // User became paying customer
    | 'expired';                  // Referral link expired
  
  clickDate?: Timestamp;          // When link was clicked
  signupDate?: Timestamp;         // When user signed up
  conversionDate?: Timestamp;     // When user converted to paid
  
  // Commission
  commission: number;             // $5 per conversion
  commissionPaid: boolean;
  paidOutDate?: Timestamp;
  paymentMethod?: string;         // How commission was paid
  
  // Metadata
  createdAt: Timestamp;
  expiresAt: Timestamp;           // 30 days from creation
}
```

### Indexes Required

```javascript
referrals
  - referrerId, status (composite)
  - referralCode (ascending)
  - referredUserId (ascending)
  - commissionPaid, conversionDate (composite)
```

### Security Rules

```javascript
match /referrals/{referralId} {
  allow read: if request.auth != null && 
    resource.data.referrerId == request.auth.uid;
  allow create: if request.auth != null && 
    request.resource.data.referrerId == request.auth.uid;
  allow update: if false; // Only system can update
  allow delete: if false;
}
```

---

## 💳 Collection: `subscriptions`

**Path:** `/subscriptions/{subscriptionId}`

### Schema (Stripe Subscription Data)

```typescript
interface Subscription {
  // Identity
  id: string;                     // Firestore doc ID
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  
  // Subscription Details
  tier: 'trial' | 'pro-monthly' | 'pro-annual';
  status: 
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid';
  
  // Pricing
  amount: number;                 // In cents
  currency: string;               // 'usd'
  interval: 'day' | 'week' | 'month' | 'year';
  
  // Dates
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  trialStart?: Timestamp;
  trialEnd?: Timestamp;
  canceledAt?: Timestamp;
  cancelAtPeriodEnd: boolean;
  endedAt?: Timestamp;
  
  // Payment
  latestInvoiceId?: string;
  defaultPaymentMethod?: string;
  
  // Features
  features: {
    resumesAllowed: number;       // -1 for unlimited
    jobsAllowed: number;
    certsAllowed: number;
    aiSuggestionsPerMonth: number;
    atsScanning: boolean;
    prioritySupport: boolean;
    customTemplates: boolean;
  };
  
  // Metadata
  metadata: Record<string, string>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Indexes Required

```javascript
subscriptions
  - userId (ascending)
  - stripeCustomerId (ascending)
  - stripeSubscriptionId (ascending)
  - userId, status (composite)
```

### Security Rules

```javascript
match /subscriptions/{subscriptionId} {
  allow read: if request.auth != null && 
    resource.data.userId == request.auth.uid;
  allow write: if false; // Only system/Stripe webhooks can write
}
```

---

## 📐 Collection: `templates`

**Path:** `/templates/{templateId}`

### Schema (Resume Templates)

```typescript
interface Template {
  // Identity
  id: string;
  name: string;
  description: string;
  
  // Template Details
  category: 'modern' | 'classic' | 'creative' | 'trade-specific';
  tradeTypes: string[];           // Compatible trades
  difficulty: 'easy' | 'medium' | 'advanced';
  
  // Design
  previewURL: string;             // Preview image
  thumbnailURL: string;
  cssStyles: string;              // Custom CSS for template
  layout: string;                 // Layout structure
  
  // Pricing
  tier: 'free' | 'pro';           // Who can access
  featured: boolean;
  premium: boolean;
  
  // Usage
  usageCount: number;
  rating: number;
  
  // Metadata
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

### Security Rules

```javascript
match /templates/{templateId} {
  allow read: if resource.data.published == true;
  allow write: if request.auth != null && 
    request.auth.token.admin == true;
}
```

---

## 🔐 Complete Security Rules

Save this as `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }
    
    function hasSubscription(tier) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.subscriptionTier in tier;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) && 
        !request.resource.data.diff(resource.data).affectedKeys().hasAny([
          'stripeCustomerId',
          'stripeSubscriptionId',
          'referralEarnings',
          'subscriptionStatus'
        ]);
      allow delete: if false;
    }
    
    // Resumes collection
    match /resumes/{resumeId} {
      allow read: if isOwner(resource.data.userId) || 
        (resource.data.shareEnabled && request.shareLink != null);
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
    
    // Jobs collection
    match /jobs/{jobId} {
      allow read, create, update, delete: if isOwner(resource.data.userId);
    }
    
    // Certifications collection
    match /certifications/{certId} {
      allow read: if isOwner(resource.data.userId) || 
        (resource.data.shareEnabled && request.shareLink != null);
      allow create, update, delete: if isOwner(resource.data.userId);
    }
    
    // Blueprints collection
    match /blueprints/{blueprintId} {
      allow read: if resource.data.published || 
        (isAuthenticated() && resource.data.purchasedBy.hasAny([request.auth.uid]));
      allow write: if isAdmin();
    }
    
    // Referrals collection
    match /referrals/{referralId} {
      allow read: if isOwner(resource.data.referrerId);
      allow create: if isAuthenticated() && 
        request.resource.data.referrerId == request.auth.uid;
      allow update, delete: if false;
    }
    
    // Subscriptions collection
    match /subscriptions/{subscriptionId} {
      allow read: if isOwner(resource.data.userId);
      allow write: if false;
    }
    
    // Templates collection
    match /templates/{templateId} {
      allow read: if resource.data.published;
      allow write: if isAdmin();
    }
  }
}
```

---

## 📊 Database Statistics & Limits

### Firestore Quotas (Free Tier)
- **Reads:** 50,000/day
- **Writes:** 20,000/day
- **Deletes:** 20,000/day
- **Storage:** 1 GB

### Recommended Limits Per User
- **Free Tier:** 3 resumes, 10 jobs, 5 certs
- **Trial:** 5 resumes, 20 jobs, 10 certs
- **Pro:** Unlimited

---

## 🔄 Migration Scripts

Check `api-functions/services/firestore.js` for CRUD operations that implement this schema.

---

**Last Updated:** October 14, 2025  
**Schema Version:** 1.0.0
