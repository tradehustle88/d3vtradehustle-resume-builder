# 🚀 Vertex AI Integration Guide

## Overview

Your Trade Hustle Resume Builder now supports **Vertex AI** as the primary AI provider with automatic fallback to Gemini API. This provides:

- ✅ **Better Security**: No API keys in frontend
- ✅ **Enhanced Scalability**: Vertex AI handles concurrency & caching
- ✅ **Observability**: View latency & token metrics in Google Cloud Console
- ✅ **Automatic Fallback**: Gracefully degrades to Gemini API if Vertex AI fails

---

## 🔧 What Changed

### 1. Backend API (`api-functions/index.js`)

#### **Enhanced `/api/editResume` Endpoint**

```javascript
// NEW: Dual provider support with automatic fallback
app.post("/api/editResume", honeypotCheck, verifyUser, async (req, res) => {
  const { useVertexAI = true } = req.body; // Default to Vertex AI
  
  // Try Vertex AI first
  if (useVertexAI && vertexAI) {
    try {
      const model = vertexAI.getGenerativeModel({
        model: "gemini-1.5-pro",
      });
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }]
      });
      
      // Extract response
      const text = result.response.candidates[0].content.parts[0].text;
      
    } catch (vertexError) {
      // Automatic fallback to Gemini API
      console.warn("⚠️ Vertex AI failed, using Gemini API fallback");
      // ... Gemini API code
    }
  }
});
```

#### **Key Features**

- 🔐 **Firebase Auth Integration**: Uses `verifyUser` middleware
- 🎯 **Smart Fallback**: Vertex AI → Gemini API → Error
- 📊 **Metadata Tracking**: Returns model used, provider, and token count
- 💾 **Firestore Logging**: Saves all requests to `resumeEdits` collection

---

### 2. Frontend API Client (`frontend/src/lib/api.ts`)

#### **Updated `editResume()` Function**

```typescript
export async function editResume(
  idToken: string,           // Firebase Auth token
  prompt: string,            // User's AI request
  resumeContent?: string,    // Optional current resume
  useVertexAI: boolean = true // Default to Vertex AI
) {
  return request<{ 
    success: boolean; 
    result: string; 
    message: string;
    metadata?: {
      model: string;      // e.g., "gemini-1.5-pro"
      provider: string;   // "vertex-ai" or "gemini-api"
      tokens: number;     // Approximate token count
    }
  }>("/api/editResume", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${idToken}`, // Required
    },
    body: JSON.stringify({ 
      prompt, 
      resumeContent,
      useVertexAI 
    }),
  });
}
```

---

## 🎯 Integration Path for Your Resume Editor

### Current Implementation (Existing Code)

You likely have code in your component like this:

```typescript
// In HustleEngine.tsx or similar component
const handleAIAssist = async (field: string, experienceIndex?: number) => {
  const user = auth.currentUser;
  if (!user) {
    setAiError('Please sign in to use AI features');
    return;
  }
  
  const idToken = await user.getIdToken();
  
  // Build your prompt
  const prompt = `Improve this ${field}...`;
  const content = getCurrentContent(field);
  
  // ✅ This now uses Vertex AI automatically!
  const response = await editResume(idToken, prompt, content);
  
  if (response.success) {
    console.log('Provider used:', response.metadata?.provider);
    console.log('Model:', response.metadata?.model);
    applyAISuggestion(field, response.result);
  }
};
```

### ✨ What Happens Now

1. **Frontend calls** `editResume()` with Firebase Auth token
2. **Backend verifies** the token using `verifyUser` middleware
3. **Vertex AI processes** the request (Gemini 1.5 Pro)
4. **If Vertex AI fails**, automatically fallback to Gemini API
5. **Response includes** metadata about which provider was used
6. **Firestore logs** the request for analytics

---

## 🔒 Environment Variables

### Required for Vertex AI

```bash
# Backend (.env in api-functions/)
PROJECT_ID=your-gcp-project-id          # Required for Vertex AI
REGION=us-central1                      # Optional (default: us-central1)
GOOGLE_API_KEY=your-gemini-api-key      # Fallback only
```

### Required for Frontend

```bash
# Frontend (.env.local)
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://your-cloud-run-url
```

---

## 📊 Monitoring & Observability

### Google Cloud Console

**View Vertex AI Metrics:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Vertex AI** → **Generative AI Studio**
3. Click on **Model Garden** → **gemini-1.5-pro**
4. View:
   - Request latency
   - Token usage
   - Error rates
   - Cost breakdown

**View Logs:**
```bash
# Cloud Logging filter
resource.type="cloud_run_revision"
textPayload:"Using Vertex AI"
```

### Firestore Analytics

All requests are logged to the `resumeEdits` collection:

```javascript
{
  userId: "abc123",
  email: "user@example.com",
  prompt: "Improve my summary...",
  result: "Enhanced professional summary...",
  createdAt: Timestamp,
  model: "gemini-1.5-pro",
  provider: "vertex-ai",
  contentLength: 1234
}
```

Query examples:
```javascript
// Get user's edit history
db.collection('resumeEdits')
  .where('userId', '==', userId)
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get()

// Count Vertex AI vs Gemini API usage
db.collection('resumeEdits')
  .where('provider', '==', 'vertex-ai')
  .count()
  .get()
```

---

## 🧪 Testing

### Test Vertex AI Integration

```javascript
// Test with Vertex AI enabled (default)
const response = await editResume(
  idToken,
  "Generate a professional summary for an electrician",
  "Current summary here...",
  true // useVertexAI = true
);

console.log(response.metadata); 
// Expected: { provider: "vertex-ai", model: "gemini-1.5-pro" }
```

### Test Fallback to Gemini API

```javascript
// Force Gemini API (bypass Vertex AI)
const response = await editResume(
  idToken,
  "Generate a professional summary for an electrician",
  "Current summary here...",
  false // useVertexAI = false
);

console.log(response.metadata); 
// Expected: { provider: "gemini-api", model: "gemini-2.5-flash-preview-09-2025" }
```

### Test Error Handling

```bash
# Test without auth token (should get 401)
curl -X POST "$BASE_URL/api/editResume" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test"}'

# Expected: 401 Unauthorized
```

---

## 🚨 Error Handling & Fallback Logic

### Fallback Chain

```
1. Vertex AI (gemini-1.5-pro)
   ↓ (if fails)
2. Gemini API (gemini-2.5-flash-preview)
   ↓ (if fails)
3. Error 503: AI service unavailable
```

### Error Messages

| Scenario | Response |
|----------|----------|
| No auth token | `401: Authentication required - please sign in` |
| Invalid token | `401: Invalid or expired authentication token` |
| No prompt | `400: Missing prompt for resume editing` |
| All AI fails | `503: AI service not available` |
| Rate limit | `429: Too many requests` |

---

## 💡 Best Practices

### 1. Always Use Vertex AI in Production

```typescript
// ✅ GOOD - Use Vertex AI by default
await editResume(idToken, prompt, content); // useVertexAI defaults to true

// ❌ AVOID - Only use Gemini API fallback for testing
await editResume(idToken, prompt, content, false);
```

### 2. Handle Errors Gracefully

```typescript
try {
  const response = await editResume(idToken, prompt, content);
  
  if (response.success) {
    // Log which provider was used
    console.log(`✅ AI assisted via ${response.metadata?.provider}`);
    applyAISuggestion(response.result);
  }
} catch (error: any) {
  console.error('AI assist failed:', error.message);
  
  // Show user-friendly message
  if (error.message.includes('401')) {
    setError('Please sign in to use AI features');
  } else if (error.message.includes('503')) {
    setError('AI service temporarily unavailable');
  } else {
    setError('Failed to get AI suggestions');
  }
}
```

### 3. Track Provider Usage

```typescript
// Track analytics
if (response.metadata) {
  trackEvent('ai_assist_completed', {
    provider: response.metadata.provider,
    model: response.metadata.model,
    tokens: response.metadata.tokens,
    field: field,
  });
}
```

### 4. Cache Responses (Optional)

```typescript
// Cache AI responses to reduce costs
const cacheKey = `ai_${field}_${hash(content)}`;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const response = await editResume(idToken, prompt, content);
localStorage.setItem(cacheKey, JSON.stringify(response), { ttl: 3600 });
```

---

## 📦 Package Dependencies

### Backend (`api-functions/package.json`)

```json
{
  "dependencies": {
    "@google-cloud/vertexai": "^1.7.0",
    "@google/generative-ai": "^0.21.0",
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^6.1.1"
  }
}
```

### Frontend (`frontend/package.json`)

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "firebase": "^11.0.2"
  }
}
```

---

## 🔄 Migration Checklist

### ✅ Completed
- [x] Enhanced `/api/editResume` with Vertex AI support
- [x] Added automatic fallback to Gemini API
- [x] Updated frontend `editResume()` function
- [x] Added metadata tracking (provider, model, tokens)
- [x] Firestore logging for all requests

### 🔜 Next Steps
1. **Deploy to production**:
   ```bash
   firebase deploy --only functions:api
   ```

2. **Set environment variables**:
   ```bash
   firebase functions:config:set \
     project.id="your-gcp-project-id" \
     region="us-central1"
   ```

3. **Update frontend** to use new API:
   ```bash
   cd frontend && npm run build
   firebase deploy --only hosting
   ```

4. **Monitor usage** in Google Cloud Console

5. **Test complete flow**:
   - Sign in → Open wizard → Click AI assist → Verify response

---

## 🐛 Troubleshooting

### Issue: "Vertex AI initialization failed"

**Solution**: Ensure `PROJECT_ID` environment variable is set:
```bash
firebase functions:config:set project.id="your-project-id"
```

### Issue: "Both Vertex AI and Gemini API unavailable"

**Solution**: Set at least one of these:
- `PROJECT_ID` (for Vertex AI)
- `GOOGLE_API_KEY` (for Gemini API fallback)

### Issue: "401 Unauthorized"

**Solution**: Ensure Firebase Auth token is passed:
```typescript
const idToken = await auth.currentUser?.getIdToken();
if (!idToken) {
  throw new Error('User not authenticated');
}
```

### Issue: Rate limits exceeded

**Solution**: The API has built-in rate limiting (30 req/min). Implement retry logic:
```typescript
async function editResumeWithRetry(idToken, prompt, content, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await editResume(idToken, prompt, content);
    } catch (error: any) {
      if (error.message.includes('429') && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
}
```

---

## 📚 Additional Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Guide](https://ai.google.dev/docs)
- [Firebase Functions v2](https://firebase.google.com/docs/functions/beta)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)

---

**Last Updated**: October 14, 2025  
**Status**: ✅ Production Ready  
**Integration**: Complete
