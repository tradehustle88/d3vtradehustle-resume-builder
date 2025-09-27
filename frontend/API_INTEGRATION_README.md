# 🔗 Frontend → Backend API Integration

This document explains how to use the centralized API client for clean communication between your Next.js frontend and Firebase Functions backend.

## 📂 File Structure

```
src/lib/api.ts                 # Centralized API client
src/components/SignupForm.tsx        # Example signup form
src/components/ApiTestingDashboard.tsx # Comprehensive API testing
src/app/api-demo/page.tsx           # Demo page showcasing API integration
```

## 🚀 Quick Start

### 1. Import API Functions

```typescript
import { 
  // Firebase Cloud Functions
  signup, 
  unlockResume, 
  verifyRecaptcha,
  editResume,
  saveGeminiOutput,
  
  // Local Next.js API Routes
  localSignup,
  localUnlockResume, 
  localVerifyRecaptcha 
} from "@/lib/api";
```

### 2. Use in Components

```typescript
"use client";

import { useState } from "react";
import { localSignup, localVerifyRecaptcha } from "@/lib/api";

export default function MyComponent() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSignup = async () => {
    try {
      // Get reCAPTCHA token (implement this helper)
      const token = await getRecaptchaToken();
      
      // Use centralized API client
      const result = await localSignup(email, token);
      
      if (result.success) {
        setStatus("✅ Success! Check your email.");
      }
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <button onClick={handleSignup}>Sign Up</button>
      <p>{status}</p>
    </div>
  );
}
```

## 🎯 Available Endpoints

### Firebase Cloud Functions
- `healthCheck()` - Server health status
- `verifyRecaptcha(token)` - Server-side reCAPTCHA verification  
- `signup(email, token)` - User signup with email capture
- `unlockResume(email, token)` - Unlock resume download
- `editResume(resumeId, content)` - Edit resume content
- `saveGeminiOutput(message)` - Save AI-generated content

### Local Next.js API Routes
- `localVerifyRecaptcha(token)` - Local reCAPTCHA verification
- `localSignup(email, token)` - Local signup handling
- `localUnlockResume(email, token)` - Local resume unlock

## 🔧 Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-tradehustleresumebuilder.cloudfunctions.net
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### For Local Development

```bash
# Use Firebase emulator
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=http://localhost:5001/tradehustleresumebuilder/us-central1
```

## 📝 reCAPTCHA Helper

```typescript
const getRecaptchaToken = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error("reCAPTCHA not loaded"));
      return;
    }

    window.grecaptcha.ready(() => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        reject(new Error("reCAPTCHA site key not configured"));
        return;
      }

      window.grecaptcha
        .execute(siteKey, { action: "your_action" })
        .then(resolve)
        .catch(reject);
    });
  });
};
```

## ✅ Benefits

1. **Centralized**: All API calls in one place
2. **Type Safety**: TypeScript interfaces for all responses
3. **Error Handling**: Consistent error handling across all endpoints
4. **Environment Flexibility**: Easy switching between local/production
5. **Clean Components**: Components focus on UI, not API details

## 🧪 Testing

Visit `/api-demo` to test all endpoints in a comprehensive dashboard.

## 🔄 Migration from Direct Fetch

### Before (Direct fetch)
```typescript
const response = await fetch("/api/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, token }),
});
const data = await response.json();
```

### After (Centralized API)
```typescript
const data = await localSignup(email, token);
```

## 🛠 Extending the API Client

To add new endpoints, simply add functions to `src/lib/api.ts`:

```typescript
export async function newEndpoint(params: any) {
  return request<ResponseType>("/new-endpoint", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
```