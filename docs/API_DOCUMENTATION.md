# 📡 Trade Hustle Resume Builder - API Documentation

**Version:** 1.0  
**Base URL:** `https://us-central1-tradehustleresumebuilder.cloudfunctions.net/api`  
**Authentication:** Firebase ID Tokens  
**Documentation Date:** October 13, 2025

---

## 🔐 Authentication

All protected endpoints require a valid Firebase ID Token in the Authorization header:

```http
Authorization: Bearer <firebase_id_token>
```

### Getting an ID Token

#### Frontend (JavaScript/TypeScript)
```javascript
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const idToken = await user.getIdToken();
    // Use idToken in API requests
  }
});
```

#### cURL Example
```bash
# First, authenticate and get ID token
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "userpassword",
    "returnSecureToken": true
  }'

# Extract idToken from response, then use in API calls:
curl -X POST "https://us-central1-tradehustleresumebuilder.cloudfunctions.net/api/geminiText" \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Generate a resume summary for an electrician"}'
```

---

## 💳 Payment Endpoints

### Create Checkout Session

Create a Stripe checkout session for payment processing.

**Endpoint:** `POST /createCheckout`  
**Authentication:** Not required  
**Rate Limit:** 30 requests per minute

#### Request Body

```json
{
  "priceId": "price_1SHfAyLr4v4blpwbcvDqbej8",
  "successUrl": "https://tradehustleresumebuilder.web.app/success",
  "cancelUrl": "https://tradehustleresumebuilder.web.app/pricing",
  "userId": "optional_firebase_user_id"
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `priceId` | string | Yes | Stripe Price ID for the product |
| `successUrl` | string | Yes | URL to redirect after successful payment |
| `cancelUrl` | string | Yes | URL to redirect if payment is cancelled |
| `userId` | string | No | Firebase User ID for tracking |

#### Response

**Success (200):**
```json
{
  "success": true,
  "url": "https://checkout.stripe.com/pay/cs_...",
  "sessionId": "cs_test_..."
}
```

**Error (400/500):**
```json
{
  "success": false,
  "error": "Invalid price ID"
}
```

#### Example Usage

```javascript
// Frontend implementation
const createCheckout = async (priceId, userId) => {
  try {
    const response = await fetch('/api/createCheckout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/pricing`
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Redirect to Stripe Checkout
      window.location.href = result.url;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Checkout creation failed:', error);
  }
};
```

### Stripe Webhook Handler

**Endpoint:** `POST /stripeWebhook`  
**Authentication:** Stripe webhook signature verification  
**Content-Type:** `application/json`

This endpoint is called by Stripe when payment events occur. It verifies the webhook signature and processes payment updates.

#### Webhook Events Handled

- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment confirmed
- `invoice.payment_failed` - Payment failed

#### Response

```json
{
  "received": true
}
```

---

## 🤖 AI Generation Endpoints

### Text Generation with Gemini

Generate resume content using Google's Gemini AI model.

**Endpoint:** `POST /geminiText`  
**Authentication:** Required (Firebase ID Token)  
**Rate Limit:** 30 requests per minute

#### Request Body

```json
{
  "prompt": "Generate a professional summary for an electrician with 5 years of experience",
  "context": {
    "trade": "Electrical",
    "experienceLevel": "Mid-level",
    "targetRole": "Senior Electrician"
  }
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text prompt for content generation (max 1000 chars) |
| `context` | object | No | Additional context for better generation |
| `context.trade` | string | No | Trade or profession |
| `context.experienceLevel` | string | No | Experience level (Entry, Mid-level, Senior) |
| `context.targetRole` | string | No | Desired job title |

#### Response

**Success (200):**
```json
{
  "success": true,
  "content": {
    "summary": "Experienced electrician with 5+ years in residential and commercial settings...",
    "skills": ["Electrical installations", "Circuit troubleshooting", "Code compliance"],
    "experience": [
      {
        "title": "Journeyman Electrician",
        "company": "ABC Electrical Services",
        "duration": "3 years",
        "responsibilities": [
          "Installed and maintained electrical systems",
          "Ensured compliance with electrical codes"
        ]
      }
    ]
  },
  "model": "gemini-2.0-flash-lite-001",
  "tokensUsed": 1247
}
```

**Error Responses:**

```json
// Missing API key (503)
{
  "success": false,
  "error": "AI service temporarily unavailable - please try again later"
}

// Invalid prompt (400)
{
  "success": false,
  "error": "Prompt too long - maximum 1000 characters allowed"
}

// Unauthorized (401)
{
  "success": false,
  "error": "Valid authentication token required"
}
```

#### Example Usage

```javascript
// Generate resume content
const generateResumeContent = async (prompt, context = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');
  
  const idToken = await user.getIdToken();
  
  const response = await fetch('/api/geminiText', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, context })
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  return result.content;
};

// Usage example
try {
  const content = await generateResumeContent(
    "Create a work experience entry for a plumber",
    {
      trade: "Plumbing",
      experienceLevel: "Senior",
      targetRole: "Master Plumber"
    }
  );
  
  console.log('Generated content:', content);
} catch (error) {
  console.error('Generation failed:', error);
}
```

### Image Analysis with Gemini Vision

Analyze images and extract relevant information for resume building.

**Endpoint:** `POST /geminiImage`  
**Authentication:** Required (Firebase ID Token)  
**Rate Limit:** 30 requests per minute

#### Request Body

```json
{
  "prompt": "Extract certifications and skills from this trade license image",
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "mimeType": "image/jpeg"
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Description of what to extract from image |
| `imageData` | string | Yes | Base64-encoded image data with data URL prefix |
| `mimeType` | string | Yes | Image MIME type (image/jpeg, image/png, image/webp) |

#### Supported Image Formats

- JPEG (`image/jpeg`)
- PNG (`image/png`)
- WebP (`image/webp`)
- HEIC (`image/heic`) - iOS photos
- PDF (`application/pdf`) - Single page

#### Response

**Success (200):**
```json
{
  "success": true,
  "analysis": {
    "extractedText": "Licensed Electrician - State of California\nLicense #E123456\nExpires: 12/31/2025",
    "certifications": [
      {
        "name": "California Electrical License",
        "number": "E123456",
        "expirationDate": "2025-12-31",
        "issuingBody": "State of California"
      }
    ],
    "skills": [
      "Licensed Electrical Work",
      "Residential Wiring",
      "Commercial Installation"
    ]
  },
  "model": "gemini-2.5-flash-image-001",
  "confidence": 0.94
}
```

**Error Responses:**

```json
// Invalid image format (400)
{
  "success": false,
  "error": "Unsupported image format - use JPEG, PNG, or WebP"
}

// Image too large (400)  
{
  "success": false,
  "error": "Image size exceeds 20MB limit"
}

// Processing failed (500)
{
  "success": false,
  "error": "Image analysis failed - please try a clearer image"
}
```

#### Example Usage

```javascript
// Analyze certificate image
const analyzeCertificate = async (file) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');
  
  // Convert file to base64
  const base64 = await fileToBase64(file);
  const idToken = await user.getIdToken();
  
  const response = await fetch('/api/geminiImage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: "Extract all certifications, licenses, and skills from this document",
      imageData: base64,
      mimeType: file.type
    })
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  return result.analysis;
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Usage
document.getElementById('certificate-upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const analysis = await analyzeCertificate(file);
    console.log('Extracted certifications:', analysis.certifications);
    console.log('Identified skills:', analysis.skills);
  } catch (error) {
    console.error('Analysis failed:', error);
  }
});
```

---

## 🛡️ Security & Error Handling

### Rate Limiting

All endpoints are rate-limited to prevent abuse:

- **Limit:** 30 requests per minute per IP address
- **Headers:** Response includes rate limit information:
  ```
  X-RateLimit-Limit: 30
  X-RateLimit-Remaining: 25
  X-RateLimit-Reset: 1697123400
  ```

### Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "errorCode": "SPECIFIC_ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common HTTP Status Codes

| Status | Description | Common Causes |
|--------|-------------|---------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid parameters, malformed JSON |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side processing error |
| 503 | Service Unavailable | External service (AI/Stripe) unavailable |

### Security Headers

All responses include security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 📊 Monitoring & Analytics

### Request Logging

All API requests are logged for monitoring and debugging:

```json
{
  "timestamp": "2025-10-13T10:30:00.000Z",
  "method": "POST",
  "endpoint": "/geminiText",
  "userId": "firebase_user_id_or_null",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "responseTime": 1247,
  "statusCode": 200,
  "error": null
}
```

### Performance Metrics

Key performance indicators tracked:

- **Response Times:**
  - createCheckout: <500ms (95th percentile)
  - geminiText: <3000ms (95th percentile)
  - geminiImage: <5000ms (95th percentile)
  - stripeWebhook: <200ms (95th percentile)

- **Success Rates:**
  - Payment processing: >99.5%
  - AI text generation: >95%
  - AI image analysis: >90%

### Health Check

**Endpoint:** `GET /health`  
**Authentication:** Not required

Returns API health status and dependency checks:

```json
{
  "status": "healthy",
  "timestamp": "2025-10-13T10:30:00.000Z",
  "version": "1.0.0",
  "dependencies": {
    "stripe": "operational",
    "gemini": "operational", 
    "firestore": "operational"
  },
  "uptime": 259200
}
```

---

## 🔧 SDK & Libraries

### JavaScript/TypeScript SDK

```javascript
// Trade Hustle Resume Builder API Client
class ResumeBuilderAPI {
  constructor(baseUrl, getAuthToken) {
    this.baseUrl = baseUrl;
    this.getAuthToken = getAuthToken;
  }
  
  async createCheckout(priceId, userId, successUrl, cancelUrl) {
    const response = await fetch(`${this.baseUrl}/createCheckout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId, successUrl, cancelUrl })
    });
    
    return this.handleResponse(response);
  }
  
  async generateText(prompt, context = {}) {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/geminiText`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, context })
    });
    
    return this.handleResponse(response);
  }
  
  async analyzeImage(prompt, imageData, mimeType) {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/geminiImage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, imageData, mimeType })
    });
    
    return this.handleResponse(response);
  }
  
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(data.error, response.status, data);
    }
    
    return data;
  }
}

class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

// Usage
const api = new ResumeBuilderAPI(
  'https://us-central1-tradehustleresumebuilder.cloudfunctions.net/api',
  () => firebase.auth().currentUser?.getIdToken()
);
```

### Python SDK Example

```python
import requests
import json
from typing import Optional, Dict, Any

class ResumeBuilderAPI:
    def __init__(self, base_url: str, get_auth_token_func):
        self.base_url = base_url
        self.get_auth_token = get_auth_token_func
    
    def create_checkout(self, price_id: str, success_url: str, 
                       cancel_url: str, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Create a Stripe checkout session."""
        payload = {
            'priceId': price_id,
            'successUrl': success_url,
            'cancelUrl': cancel_url,
            'userId': user_id
        }
        
        response = requests.post(
            f'{self.base_url}/createCheckout',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        return self._handle_response(response)
    
    def generate_text(self, prompt: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """Generate resume content using AI."""
        token = self.get_auth_token()
        payload = {'prompt': prompt, 'context': context or {}}
        
        response = requests.post(
            f'{self.base_url}/geminiText',
            json=payload,
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
        )
        
        return self._handle_response(response)
    
    def _handle_response(self, response: requests.Response) -> Dict[str, Any]:
        """Handle API response and errors."""
        data = response.json()
        
        if not response.ok:
            raise APIError(data.get('error', 'Unknown error'), response.status_code, data)
        
        return data

class APIError(Exception):
    def __init__(self, message: str, status_code: int, details: Dict[str, Any]):
        super().__init__(message)
        self.status_code = status_code
        self.details = details
```

---

## 📝 Changelog

### Version 1.0.0 (2025-10-13)

**Added:**
- Initial API release
- Payment processing with Stripe
- AI content generation with Gemini 2.0/2.5
- Image analysis capabilities
- Rate limiting and security headers
- Comprehensive error handling
- Health check endpoint

**Security:**
- Firebase Authentication integration
- Request rate limiting (30/min)
- Input validation and sanitization
- Stripe webhook signature verification
- HTTPS-only communication

**Performance:**
- Response time optimizations
- Memory-efficient function configurations
- Automatic scaling with Firebase Functions Gen2
- Intelligent caching strategies

---

*This API documentation provides complete guidance for integrating with the Trade Hustle Resume Builder platform. For additional support, please refer to the codebase or contact the development team.*
