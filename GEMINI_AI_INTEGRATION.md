# Gemini AI Integration - Trade Hustle Resume Builder

## 🎉 Successfully Deployed!

Your Firebase Functions now include a powerful Gemini AI agent that supports both Google AI API and Vertex AI. Here's everything you need to know:

## 🚀 What Was Added

### New API Endpoint: `/api/geminiAgent`
- **Purpose**: Flexible AI content generation with dual provider support
- **Authentication**: Required (Firebase Auth token)
- **Rate Limiting**: 30 requests per minute per IP
- **Honeypot Protection**: Automatically rejects bot requests

### New Dependencies
- `@google-cloud/vertexai`: ^1.10.0 (Vertex AI integration)
- `@google/generative-ai`: ^0.24.1 (Direct Gemini API)

### Frontend Integration
- **AIService Class**: `frontend/src/lib/aiService.ts`
- **React Component**: `frontend/src/components/AIResumeAssistant.tsx`
- **React Hooks**: `useAI()` for easy integration

## 🔧 Configuration

### Environment Variables Required
```bash
# For Gemini API (existing)
GOOGLE_API_KEY=your_google_ai_api_key

# For Vertex AI (new)
PROJECT_ID=your_firebase_project_id
REGION=us-central1  # optional, defaults to us-central1
```

### Function URLs
- **Main App**: https://app-fbs5jy4frq-uc.a.run.app
- **Gemini Agent**: https://us-central1-tradehustleresumebuilder.cloudfunctions.net/geminiAgent

## 📋 API Usage

### Request Format
```json
POST /api/geminiAgent
Authorization: Bearer <firebase-auth-token>
Content-Type: application/json

{
  "prompt": "Write a professional summary for a software engineer",
  "useVertexAI": false,
  "model": "gemini-1.5-flash"
}
```

### Response Format
```json
{
  "success": true,
  "output": "Generated AI content here...",
  "provider": "Gemini API",
  "model": "gemini-1.5-flash",
  "message": "AI generation completed for user@example.com"
}
```

### Supported Models
- `gemini-1.5-flash` (fast, cost-effective)
- `gemini-1.5-pro` (more advanced reasoning)
- `gemini-2.0-flash-exp` (experimental features)

## 🎯 Frontend Integration Examples

### Basic Usage with React Hooks
```typescript
import { useAI } from '@/lib/aiService';

function MyComponent() {
  const { generateContent, isLoading, error } = useAI();
  
  const handleGenerate = async () => {
    const result = await generateContent({
      prompt: "Help me write a resume summary"
    });
    console.log(result);
  };
  
  return (
    <button onClick={handleGenerate} disabled={isLoading}>
      {isLoading ? 'Generating...' : 'Generate with AI'}
    </button>
  );
}
```

### Direct Service Usage
```typescript
import { aiService } from '@/lib/aiService';

// Resume-specific generation
const resumeContent = await aiService.generateResumeContent(
  'Create a summary for a trade professional with 10 years experience'
);

// Job-specific tailoring
const tailored = await aiService.tailorResumeForJob(
  jobDescription, 
  currentResume
);

// Improve specific section
const improved = await aiService.improveResumeSection(
  'experience', 
  currentExperienceSection
);
```

### Ready-to-Use Component
```tsx
import AIResumeAssistant from '@/components/AIResumeAssistant';

function ResumePage() {
  return (
    <div>
      <h1>Resume Builder</h1>
      <AIResumeAssistant />
    </div>
  );
}
```

## 🔍 Provider Comparison

| Feature | Gemini API | Vertex AI |
|---------|------------|-----------|
| Setup | API Key only | Project ID + Region |
| Cost | Pay-per-use | Enterprise pricing |
| Features | Standard | Enhanced enterprise features |
| Fallback | None | Auto-fallback to Gemini API |
| Best For | General use | Production/enterprise |

## 🛡️ Security Features

✅ **Authentication Required**: All requests need Firebase Auth token  
✅ **Rate Limiting**: 30 requests/minute per IP  
✅ **Honeypot Protection**: Automatic bot detection  
✅ **Input Validation**: Prompt validation and sanitization  
✅ **User Context**: All interactions logged with user info  
✅ **Error Handling**: Graceful degradation when services unavailable  

## 📊 Monitoring & Logging

### What Gets Logged
- User interactions with AI service
- Provider used (Gemini API vs Vertex AI)
- Model used and response times
- Errors and fallback scenarios

### Firestore Collections
- `resumeEdits`: Resume-specific AI interactions
- `aiInteractions`: General AI service usage

## 🧪 Testing

### Health Check
```bash
curl https://app-fbs5jy4frq-uc.a.run.app/api/status
```

### Function Test Scripts
- `test-gemini-agent.ps1`: PowerShell test script
- `test-gemini-agent.sh`: Bash test script

### Expected Behavior
- ✅ Authenticated requests with valid prompts succeed
- ❌ Unauthenticated requests return 401
- ❌ Missing prompts return 400
- 🔄 Vertex AI falls back to Gemini API on failure

## 🚀 Next Steps

1. **Configure Environment**: Ensure `GOOGLE_API_KEY` is set in Firebase Functions
2. **Test Integration**: Use the provided test scripts to verify functionality
3. **Frontend Integration**: Import and use the AI components in your resume pages
4. **Monitor Usage**: Check Firebase Console for function logs and Firestore for interaction logs

## 🆘 Troubleshooting

### Common Issues

**"AI service not available"**
- Check `GOOGLE_API_KEY` in Firebase Functions config
- Verify API key has Gemini API access enabled

**"Authentication required"**
- Ensure Firebase Auth token is included in requests
- Check token hasn't expired

**"Rate limit exceeded"**
- Wait 1 minute before retrying
- Consider implementing user-side rate limiting

**Vertex AI not working**
- Verify `PROJECT_ID` environment variable
- Check Google Cloud project has Vertex AI API enabled
- Ensure service account has proper permissions

### Support
- Check Firebase Console logs for detailed error messages
- Monitor Firestore collections for interaction history
- Use health endpoint to verify service configuration

---

🎉 **Congratulations!** Your resume builder now has intelligent AI assistance powered by Google's most advanced language models. Users can get personalized resume help with industry-leading AI technology!