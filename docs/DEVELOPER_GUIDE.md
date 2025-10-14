# 🚀 Trade Hustle Resume Builder - Developer Guide

**Getting Started with Development**  
**Version:** 1.0  
**Updated:** October 13, 2025  
**Difficulty:** Intermediate to Advanced

---

## 🎯 Quick Start Guide

### Prerequisites Checklist

Before you begin development, ensure you have:

```bash
# Required Software
✅ Node.js 20+ (LTS recommended)
✅ npm 10+ or yarn 3+
✅ Git 2.34+
✅ Firebase CLI 12+
✅ VS Code (recommended) with extensions:
   - Firebase for VS Code
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier
```

### Environment Setup

#### 1. Clone and Initialize Project

```bash
# Clone the repository
git clone https://github.com/tradehustle88/d3vtradehustle-resume-builder.git
cd d3vtradehustle-resume-builder

# Install dependencies for both frontend and backend
cd frontend && npm install
cd ../api-functions && npm install
cd ..

# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login
```

#### 2. Configure Environment Variables

Create environment files with required configuration:

**Frontend (.env.local):**
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tradehustleresumebuilder.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tradehustleresumebuilder
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tradehustleresumebuilder.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Configuration
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=http://localhost:5001/tradehustleresumebuilder/us-central1/api

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Backend Environment (Firebase Secrets):**
```bash
# Set Firebase secrets for production
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase functions:secrets:set GOOGLE_API_KEY

# For local development, create api-functions/.env
cd api-functions
echo "STRIPE_SECRET_KEY=sk_test_..." > .env
echo "STRIPE_WEBHOOK_SECRET=whsec_..." >> .env
echo "GOOGLE_API_KEY=your_google_api_key" >> .env
```

#### 3. Start Development Environment

```bash
# Terminal 1: Start Firebase Emulators
firebase emulators:start

# Terminal 2: Start Frontend Development Server
cd frontend
npm run dev

# Your app will be available at:
# Frontend: http://localhost:3000
# Firebase Emulator UI: http://localhost:4000
# Functions: http://localhost:5001
```

---

## 🏗️ Project Architecture Deep Dive

### Directory Structure Overview

```
d3vtradehustle-resume-builder/
├── 📁 frontend/                    # Next.js 14 Frontend Application
│   ├── src/
│   │   ├── app/                   # App Router pages and layouts
│   │   │   ├── layout.tsx         # Root layout with providers
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── pricing/           # Pricing page
│   │   │   ├── success/           # Payment success page
│   │   │   └── globals.css        # Global styles
│   │   ├── components/            # Reusable React components
│   │   │   ├── ui/                # Base UI components
│   │   │   ├── layout/            # Layout components
│   │   │   ├── forms/             # Form components
│   │   │   └── sections/          # Page sections
│   │   ├── lib/                   # Utilities and configurations
│   │   │   ├── firebase.ts        # Firebase client config
│   │   │   ├── api.ts             # API client utilities
│   │   │   └── utils.ts           # Helper functions
│   │   └── hooks/                 # Custom React hooks
│   ├── public/                    # Static assets
│   │   ├── assets/                # Images, icons, fonts
│   │   └── resume-kit.pdf         # Downloadable resume template
│   ├── package.json               # Frontend dependencies
│   ├── next.config.js             # Next.js configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── tsconfig.json              # TypeScript configuration
│
├── 📁 api-functions/               # Firebase Functions Backend
│   ├── index.js                   # Main functions entry point
│   ├── package.json               # Backend dependencies
│   └── README.md                  # API documentation
│
├── 📁 docs/                       # Comprehensive Documentation
│   ├── PROJECT_DESIGN_REQUIREMENTS.md
│   ├── PRODUCT_DEVELOPMENT_PLAN.md
│   ├── CODEBASE_BRIEFING.md
│   ├── FULL_STACK_FRAMEWORK_BRIEFING.md
│   ├── API_DOCUMENTATION.md
│   └── DEVELOPER_GUIDE.md         # This file
│
├── firebase.json                  # Firebase project configuration
├── firestore.rules               # Firestore security rules
├── package.json                   # Root project configuration
└── README.md                      # Project overview
```

### Component Architecture Patterns

#### 1. Component Organization Strategy

```typescript
// Component Structure Pattern
components/
├── ui/                           # Base/Primitive Components
│   ├── Button.tsx               # Reusable button component
│   ├── Input.tsx                # Form input component
│   ├── Modal.tsx                # Modal wrapper
│   └── LoadingSpinner.tsx       # Loading indicators
├── layout/                      # Layout-specific Components
│   ├── Header.tsx               # Site navigation
│   ├── Footer.tsx               # Site footer
│   └── Sidebar.tsx              # Sidebar navigation
├── forms/                       # Form-related Components
│   ├── ContactForm.tsx          # Contact form
│   ├── ResumeForm.tsx           # Resume input form
│   └── PaymentForm.tsx          # Payment processing form
└── sections/                    # Page Section Components
    ├── Hero.tsx                 # Homepage hero section
    ├── Features.tsx             # Features showcase
    ├── Pricing.tsx              # Pricing table
    └── Testimonials.tsx         # Customer testimonials

// Example Component Structure
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = ({ variant = 'primary', size = 'md', loading, icon, children, className, ...props }: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-hustle-red hover:bg-hustle-dark-red text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border border-hustle-red text-hustle-red hover:bg-hustle-red hover:text-white',
    ghost: 'hover:bg-gray-100 text-gray-900'
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-8',
    xl: 'h-12 px-12 text-lg'
  };
  
  return (
    <button 
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

#### 2. State Management Pattern

```typescript
// Global State with React Context
// lib/contexts/AppContext.tsx
interface AppState {
  user: User | null;
  subscription: Subscription | null;
  resumeData: ResumeData | null;
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_SUBSCRIPTION'; payload: Subscription }
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.payload };
    case 'SET_RESUME_DATA':
      return { ...state, resumeData: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Custom Hooks for State Management
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const useAuth = () => {
  const { state, dispatch } = useAppState();
  
  const signIn = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: 'SET_USER', payload: userCredential.user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);
  
  return { user: state.user, signIn, loading: state.loading, error: state.error };
};
```

---

## 🛠️ Development Workflows

### Frontend Development

#### 1. Creating New Components

```bash
# Use the component generator (create if doesn't exist)
# scripts/generate-component.js
node scripts/generate-component.js ComponentName

# Or manually create component structure:
mkdir -p src/components/ui/ComponentName
touch src/components/ui/ComponentName/index.tsx
touch src/components/ui/ComponentName/ComponentName.tsx
touch src/components/ui/ComponentName/ComponentName.test.tsx
touch src/components/ui/ComponentName/ComponentName.stories.tsx
```

**Component Template:**
```typescript
// src/components/ui/ComponentName/ComponentName.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
  children?: React.ReactNode;
}

const ComponentName = ({ className, children, ...props }: ComponentNameProps) => {
  return (
    <div className={cn('base-styles', className)} {...props}>
      {children}
    </div>
  );
};

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

#### 2. Adding New Pages

```typescript
// Create new page in app router
// src/app/new-page/page.tsx
import { Metadata } from 'next';
import NewPageContent from '@/components/sections/NewPageContent';

export const metadata: Metadata = {
  title: 'New Page | Trade Hustle Resume Builder',
  description: 'Description of the new page',
};

export default function NewPage() {
  return <NewPageContent />;
}

// Create the page content component
// src/components/sections/NewPageContent.tsx
'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

const NewPageContent = () => {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView('new_page');
  }, [trackPageView]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">New Page</h1>
      {/* Page content */}
    </div>
  );
};

export default NewPageContent;
```

#### 3. Styling Guidelines

```scss
// Use Tailwind utility classes with custom CSS variables
// src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Trade Hustle Brand Colors */
    --color-hustle-red: #E50914;
    --color-hustle-gold: #ffd700;
    --color-hustle-dark-red: #8B0000;
    --color-hustle-blue: #1673FF;
    --color-brick-texture: url('/assets/brick-bg-v3.webp');
  }
  
  body {
    @apply font-merriweather bg-gray-50;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-anton text-hustle-red;
  }
}

@layer components {
  .btn-hustle {
    @apply bg-gradient-to-r from-hustle-red to-hustle-dark-red;
    @apply hover:from-red-600 hover:to-red-800;
    @apply text-white font-bold py-4 px-12 rounded-lg;
    @apply transition-all duration-300 shadow-2xl;
    @apply transform hover:scale-105;
    @apply hover:shadow-[0_0_30px_rgba(229,9,20,0.6)];
  }
  
  .hero-title {
    @apply text-6xl md:text-8xl font-anton font-black;
    @apply bg-gradient-to-r from-hustle-red via-hustle-gold to-hustle-dark-red;
    @apply bg-clip-text text-transparent;
    @apply drop-shadow-2xl;
  }
  
  .brick-block {
    @apply relative overflow-hidden;
    background-image: var(--color-brick-texture);
    background-size: cover;
    background-position: center;
  }
}

@layer utilities {
  .paint-splatter {
    @apply absolute pointer-events-none z-[-1] opacity-80;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
}
```

### Backend Development

#### 1. Adding New API Endpoints

```javascript
// api-functions/index.js - Add new endpoint
const express = require('express');
const { onRequest } = require('firebase-functions/v2/https');

const app = express();

// Middleware stack (existing)
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter);
app.use(honeypotCheck);

// Add new protected endpoint
app.post('/newEndpoint', verifyUser, async (req, res) => {
  try {
    const { parameter1, parameter2 } = req.body;
    const userId = req.user.uid;
    
    // Input validation
    if (!parameter1 || typeof parameter1 !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'parameter1 is required and must be a string'
      });
    }
    
    // Business logic
    const result = await processNewEndpointLogic(parameter1, parameter2, userId);
    
    // Log successful operation
    console.log(`New endpoint called by user ${userId}`, {
      parameter1: parameter1.substring(0, 50), // First 50 chars only
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('New endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Processing failed - please try again'
    });
  }
});

// Business logic function
const processNewEndpointLogic = async (param1, param2, userId) => {
  // Validate user permissions
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .get();
    
  if (!userDoc.exists) {
    throw new Error('User not found');
  }
  
  const userData = userDoc.data();
  if (!userData.subscription?.active) {
    throw new Error('Active subscription required');
  }
  
  // Process the request
  const processingResult = {
    processedParam1: param1.toUpperCase(),
    processedParam2: param2 || 'default_value',
    userId: userId,
    timestamp: new Date().toISOString()
  };
  
  // Save result to database
  await admin.firestore()
    .collection('processing_results')
    .add(processingResult);
    
  return processingResult;
};

// Export the function
exports.api = onRequest({
  secrets: ['stripeSecretKey', 'stripeWebhookSecret', 'googleApiKey'],
  memory: '1GiB',
  timeoutSeconds: 60,
  maxInstances: 100
}, app);
```

#### 2. Database Operations Pattern

```javascript
// Database utilities - lib/database.js
const admin = require('firebase-admin');
const db = admin.firestore();

class DatabaseService {
  // User operations
  static async createUser(uid, userData) {
    const userRef = db.collection('users').doc(uid);
    await userRef.set({
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return userRef;
  }
  
  static async getUserProfile(uid) {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) {
      throw new Error('User not found');
    }
    return { id: doc.id, ...doc.data() };
  }
  
  static async updateUserProfile(uid, updates) {
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  
  // Resume operations
  static async createResume(userId, resumeData) {
    const resumeRef = db.collection('resumes').doc();
    await resumeRef.set({
      ...resumeData,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return resumeRef.id;
  }
  
  static async getUserResumes(userId, limit = 10) {
    const snapshot = await db.collection('resumes')
      .where('userId', '==', userId)
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .get();
      
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
  
  // Batch operations for performance
  static async batchUpdateResumes(updates) {
    const batch = db.batch();
    
    updates.forEach(({ id, data }) => {
      const ref = db.collection('resumes').doc(id);
      batch.update(ref, {
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
  }
  
  // Analytics operations
  static async logEvent(eventType, userId, data) {
    await db.collection('analytics').add({
      eventType,
      userId,
      data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: data.ip || null,
      userAgent: data.userAgent || null
    });
  }
}

module.exports = DatabaseService;
```

---

## 🧪 Testing Strategy

### Frontend Testing

#### 1. Unit Testing with Jest and React Testing Library

```typescript
// src/components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-hustle-red');
  });
  
  it('applies custom variant class', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-hustle-red');
  });
  
  it('shows loading spinner when loading prop is true', () => {
    render(<Button loading>Loading Button</Button>);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// Test configuration - jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### 2. Integration Testing

```typescript
// src/__tests__/integration/ResumeGeneration.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppStateProvider } from '@/lib/contexts/AppContext';
import ResumeBuilder from '@/components/sections/ResumeBuilder';

// Mock Firebase Auth
jest.mock('firebase/auth');
jest.mock('@/lib/firebase');

const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  getIdToken: jest.fn().mockResolvedValue('mock-token')
};

const MockedResumeBuilder = () => (
  <AppStateProvider>
    <ResumeBuilder />
  </AppStateProvider>
);

describe('Resume Generation Integration', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({
      success: true,
      content: {
        summary: 'Generated summary',
        skills: ['Skill 1', 'Skill 2']
      }
    }));
  });
  
  it('generates resume content when form is submitted', async () => {
    const user = userEvent.setup();
    render(<MockedResumeBuilder />);
    
    // Fill in the form
    const tradeInput = screen.getByLabelText(/trade or profession/i);
    await user.type(tradeInput, 'Electrician');
    
    const experienceInput = screen.getByLabelText(/years of experience/i);
    await user.type(experienceInput, '5');
    
    const promptTextarea = screen.getByLabelText(/describe your experience/i);
    await user.type(promptTextarea, 'I have experience in residential wiring');
    
    // Submit the form
    const generateButton = screen.getByRole('button', { name: /generate resume/i });
    await user.click(generateButton);
    
    // Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/geminiText', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: expect.stringContaining('residential wiring'),
          context: {
            trade: 'Electrician',
            experienceLevel: 'Mid-level'
          }
        })
      });
    });
    
    // Verify content is displayed
    await waitFor(() => {
      expect(screen.getByText('Generated summary')).toBeInTheDocument();
      expect(screen.getByText('Skill 1')).toBeInTheDocument();
    });
  });
});
```

### Backend Testing

#### 1. API Endpoint Testing

```javascript
// api-functions/test/api.test.js
const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  auth: () => ({
    verifyIdToken: jest.fn()
  }),
  firestore: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn()
      })),
      add: jest.fn(),
      where: jest.fn(() => ({
        get: jest.fn()
      }))
    }))
  })
}));

// Import your app after mocking
const app = require('../index');

describe('API Endpoints', () => {
  describe('POST /geminiText', () => {
    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/geminiText')
        .send({ prompt: 'Test prompt' });
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
    
    it('should generate content with valid auth', async () => {
      // Mock successful token verification
      admin.auth().verifyIdToken.mockResolvedValue({
        uid: 'test-user',
        email: 'test@example.com'
      });
      
      const response = await request(app)
        .post('/geminiText')
        .set('Authorization', 'Bearer valid-token')
        .send({ 
          prompt: 'Generate resume summary',
          context: { trade: 'Plumber' }
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.content).toBeDefined();
    });
    
    it('should handle API errors gracefully', async () => {
      admin.auth().verifyIdToken.mockResolvedValue({
        uid: 'test-user',
        email: 'test@example.com'
      });
      
      // Mock API failure
      process.env.GOOGLE_API_KEY = '';
      
      const response = await request(app)
        .post('/geminiText')
        .set('Authorization', 'Bearer valid-token')
        .send({ prompt: 'Test prompt' });
        
      expect(response.status).toBe(503);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('temporarily unavailable');
    });
  });
  
  describe('POST /createCheckout', () => {
    it('should create checkout session with valid data', async () => {
      const response = await request(app)
        .post('/createCheckout')
        .send({
          priceId: 'price_test_123',
          successUrl: 'http://localhost:3000/success',
          cancelUrl: 'http://localhost:3000/cancel'
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.url).toContain('checkout.stripe.com');
    });
    
    it('should reject invalid price ID', async () => {
      const response = await request(app)
        .post('/createCheckout')
        .send({
          priceId: 'invalid-price',
          successUrl: 'http://localhost:3000/success',
          cancelUrl: 'http://localhost:3000/cancel'
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

#### 2. End-to-End Testing Script

```bash
#!/bin/bash
# test-e2e.sh - End-to-end testing script

set -e

echo "🚀 Starting End-to-End Testing Pipeline"

# Start Firebase Emulators
echo "📦 Starting Firebase Emulators..."
firebase emulators:start --only auth,functions,firestore --detach

# Wait for emulators to be ready
sleep 5

# Test API Health
echo "🏥 Testing API Health..."
curl -f http://localhost:5001/tradehustleresumebuilder/us-central1/api/health || exit 1

# Test Authentication Flow
echo "🔐 Testing Authentication Flow..."
USER_TOKEN=$(node scripts/test-auth.js) || exit 1

# Test Payment Flow
echo "💳 Testing Payment Flow..."
curl -X POST http://localhost:5001/tradehustleresumebuilder/us-central1/api/createCheckout \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_test_123",
    "successUrl": "http://localhost:3000/success",
    "cancelUrl": "http://localhost:3000/cancel"
  }' || exit 1

# Test AI Generation
echo "🤖 Testing AI Generation..."
curl -X POST http://localhost:5001/tradehustleresumebuilder/us-central1/api/geminiText \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a resume summary for a carpenter",
    "context": {"trade": "Carpentry"}
  }' || exit 1

# Clean up
echo "🧹 Cleaning up..."
firebase emulators:stop

echo "✅ All E2E tests passed!"
```

---

## 🚀 Deployment Guide

### Local Development Deployment

```bash
# 1. Build Frontend for Production
cd frontend
npm run build
npm run export

# 2. Test Functions Locally
cd ../api-functions
npm test

# 3. Deploy Functions Only
firebase deploy --only functions

# 4. Deploy Hosting Only  
firebase deploy --only hosting

# 5. Full Deployment
firebase deploy

# 6. Verify Deployment
curl https://tradehustleresumebuilder.web.app/api/health
```

### Production Deployment Pipeline

```yaml
# .github/workflows/deploy-production.yml
name: Production Deployment

on:
  push:
    branches: [main]
    
env:
  FIREBASE_PROJECT_ID: tradehustleresumebuilder

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install Dependencies
        run: |
          cd frontend && npm ci
          cd ../api-functions && npm ci
          
      - name: Run Tests
        run: |
          cd frontend && npm test -- --coverage --watchAll=false
          cd ../api-functions && npm test
          
      - name: Build Frontend
        run: |
          cd frontend
          npm run build
          npm run export
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: ${{ env.FIREBASE_PROJECT_ID }}
          channelId: live
          
      - name: Run Smoke Tests
        run: |
          sleep 30 # Wait for deployment
          curl -f https://tradehustleresumebuilder.web.app/api/health
```

---

## 🐛 Debugging Guide

### Common Issues and Solutions

#### 1. Frontend Issues

```typescript
// Debug Firebase Connection Issues
// Add to lib/firebase.ts for debugging

const debugFirebase = () => {
  console.log('Firebase Config:', {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
  
  // Test Firebase connection
  auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? 'logged in' : 'logged out');
  });
};

// Call in development
if (process.env.NODE_ENV === 'development') {
  debugFirebase();
}
```

#### 2. Backend Debugging

```javascript
// Enhanced logging for Firebase Functions
const debugRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
    headers: {
      authorization: req.headers.authorization ? 'Bearer [REDACTED]' : 'none',
      contentType: req.headers['content-type']
    },
    bodySize: JSON.stringify(req.body).length,
    ip: req.ip,
    userAgent: req.headers['user-agent']?.substring(0, 50)
  });
  
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`Response: ${res.statusCode}`, {
      size: data?.length || 0,
      success: JSON.parse(data || '{}').success
    });
    originalSend.call(this, data);
  };
  
  next();
};

// Add to Express app in development
if (process.env.NODE_ENV !== 'production') {
  app.use(debugRequest);
}
```

#### 3. Performance Debugging

```bash
# Frontend Performance Analysis
cd frontend
npm run build
npm run analyze  # If bundle analyzer is configured

# Backend Performance Monitoring
# View function logs
firebase functions:log

# Monitor function performance
firebase functions:log --only api

# Local performance testing
cd api-functions
npm install -g clinic
clinic doctor -- node index.js
```

### Debugging Checklist

```markdown
## Frontend Issues Checklist
- [ ] Check environment variables in .env.local
- [ ] Verify Firebase configuration
- [ ] Check browser console for errors
- [ ] Test with Firebase Emulator
- [ ] Verify API endpoints are reachable
- [ ] Check network tab for failed requests
- [ ] Test authentication flow manually

## Backend Issues Checklist  
- [ ] Check Firebase Functions logs
- [ ] Verify Firebase secrets are set
- [ ] Test endpoints with curl/Postman
- [ ] Check Firestore security rules
- [ ] Verify external API keys (Stripe, Google)
- [ ] Test with Firebase Emulator
- [ ] Check function memory and timeout settings

## Database Issues Checklist
- [ ] Check Firestore security rules
- [ ] Verify composite indexes exist
- [ ] Test queries in Firebase console
- [ ] Check document structure matches schema
- [ ] Verify user permissions
- [ ] Test with sample data
- [ ] Check query performance
```

---

## 📚 Additional Resources

### Learning Materials

```markdown
## Essential Documentation
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Firebase Functions v2](https://firebase.google.com/docs/functions/functions-2-0)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Google AI Vertex API](https://cloud.google.com/vertex-ai/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Development Tools
- [VS Code](https://code.visualstudio.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Postman](https://www.postman.com/) - API testing
- [Git](https://git-scm.com/doc) - Version control
```

### Code Quality Tools

```json
// Package.json scripts for quality assurance
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next export",
    "start": "next start",
    "lint": "next lint --fix",
    "lint:check": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "analyze": "cross-env ANALYZE=true npm run build"
  }
}
```

---

*This Developer Guide provides comprehensive instructions for setting up, developing, testing, and deploying the Trade Hustle Resume Builder. For additional support, refer to the extensive documentation suite or examine the well-commented codebase.*