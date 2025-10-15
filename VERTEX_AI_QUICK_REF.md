# 🎯 Vertex AI Quick Reference

## 🚀 One-Liner Usage

```typescript
const response = await editResume(idToken, "Improve my resume", content);
```

---

## 📦 API Signature

```typescript
editResume(
  idToken: string,           // Firebase Auth token (required)
  prompt: string,            // Your AI request (required)
  resumeContent?: string,    // Current resume content (optional)
  useVertexAI?: boolean      // true = Vertex AI, false = Gemini API (default: true)
): Promise<{
  success: boolean;
  result: string;
  message: string;
  metadata?: {
    model: string;      // "gemini-1.5-pro" or "gemini-2.5-flash-preview"
    provider: string;   // "vertex-ai" or "gemini-api"
    tokens: number;     // Approximate token count
  }
}>
```

---

## 🔄 Provider Logic

```
User Request
    ↓
[useVertexAI = true?]
    ↓ YES          ↓ NO
Vertex AI    Gemini API
    ↓ (fail)
Gemini API (fallback)
    ↓ (fail)
Error 503
```

---

## ✅ Complete Example

```typescript
// In your component (e.g., HustleEngine.tsx)
import { editResume } from '@/lib/api';
import { auth } from '@/lib/firebase';

const handleAIAssist = async (field: string) => {
  try {
    // 1. Get auth token
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    
    const idToken = await user.getIdToken();
    
    // 2. Build prompt
    const prompt = `Improve this ${field} for a ${tradeType} professional`;
    const content = getCurrentContent(field);
    
    // 3. Call API (defaults to Vertex AI)
    const response = await editResume(idToken, prompt, content);
    
    // 4. Handle response
    if (response.success) {
      console.log(`✅ Used ${response.metadata?.provider}`);
      applyAISuggestion(response.result);
    }
    
  } catch (error: any) {
    if (error.message.includes('401')) {
      setError('Please sign in');
    } else {
      setError('AI service unavailable');
    }
  }
};
```

---

## 🎨 UI Integration

### Loading State

```typescript
const [aiLoading, setAiLoading] = useState(false);

const handleAI = async () => {
  setAiLoading(true);
  try {
    const response = await editResume(idToken, prompt, content);
    // ... handle response
  } finally {
    setAiLoading(false);
  }
};

// In JSX
<button disabled={aiLoading}>
  {aiLoading ? 'AI Processing...' : '✨ AI Assist'}
</button>
```

### Success/Error Messages

```typescript
const [aiMessage, setAiMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

// Success
setAiMessage({ type: 'success', text: 'AI suggestions applied!' });
setTimeout(() => setAiMessage(null), 5000);

// Error
setAiMessage({ type: 'error', text: error.message });
setTimeout(() => setAiMessage(null), 5000);

// In JSX
{aiMessage && (
  <div className={aiMessage.type === 'success' ? 'bg-green-100' : 'bg-red-100'}>
    {aiMessage.text}
  </div>
)}
```

---

## 🧪 Testing Scenarios

### Test 1: Vertex AI (Default)
```typescript
const response = await editResume(
  idToken,
  "Test prompt",
  "Test content"
  // useVertexAI defaults to true
);
// Expected: metadata.provider = "vertex-ai"
```

### Test 2: Force Gemini API
```typescript
const response = await editResume(
  idToken,
  "Test prompt",
  "Test content",
  false // Force Gemini API
);
// Expected: metadata.provider = "gemini-api"
```

### Test 3: Without Auth
```typescript
try {
  await editResume("", "Test", "Content");
} catch (error) {
  // Expected: 401 error
}
```

---

## 🔧 Environment Setup

### Backend (api-functions/)
```bash
# Required for Vertex AI
export PROJECT_ID=your-gcp-project-id
export REGION=us-central1

# Required for Gemini API fallback
export GOOGLE_API_KEY=your-api-key
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://your-cloud-run-url
```

### Firebase Secrets
```bash
firebase functions:secrets:set PROJECT_ID
firebase functions:secrets:set REGION
```

---

## 📊 Response Examples

### Success (Vertex AI)
```json
{
  "success": true,
  "result": "Enhanced professional summary with 10 years...",
  "message": "Resume editing completed for John Doe",
  "metadata": {
    "model": "gemini-1.5-pro",
    "provider": "vertex-ai",
    "tokens": 256
  }
}
```

### Success (Gemini API Fallback)
```json
{
  "success": true,
  "result": "Enhanced professional summary...",
  "message": "Resume editing completed for John Doe",
  "metadata": {
    "model": "gemini-2.5-flash-preview-09-2025",
    "provider": "gemini-api",
    "tokens": 256
  }
}
```

### Error (No Auth)
```json
{
  "success": false,
  "message": "Authentication required - please sign in"
}
```

### Error (No Prompt)
```json
{
  "success": false,
  "message": "Missing prompt for resume editing"
}
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | User not authenticated - check `auth.currentUser` |
| 503 Service Unavailable | Both Vertex AI and Gemini API failed - check env vars |
| 400 Bad Request | Missing `prompt` parameter |
| 429 Too Many Requests | Rate limit (30/min) exceeded - implement retry logic |

---

## 💡 Pro Tips

1. **Always use Vertex AI in production** (more secure, scalable)
2. **Track which provider is used** for analytics
3. **Implement retry logic** for rate limits
4. **Cache responses** to reduce costs
5. **Show loading states** for better UX

---

## 📚 Related Files

- **Backend API**: `api-functions/index.js`
- **Frontend Client**: `frontend/src/lib/api.ts`
- **Full Guide**: `VERTEX_AI_INTEGRATION.md`
- **Code Improvements**: `HUSTLEENGINE_IMPROVEMENTS.md`

---

## 🚀 Deploy Commands

```bash
# Deploy backend
firebase deploy --only functions:api

# Deploy frontend
cd frontend && npm run build
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

---

**Quick Start**: Just call `editResume(idToken, prompt, content)` and you're done! 🎉
