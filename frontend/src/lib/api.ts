// src/lib/api.ts
// Trade Hustle Resume Builder - API Client Helpers

// Firebase Cloud Functions URL - can be overridden for local development
// Using the /app function which hosts all API routes under /api
const BASE_URL = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL ||
  "https://app-fbs5jy4frq-uc.a.run.app";

// Generic fetch helper
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error (${res.status}): ${errorText}`);
  }

  return res.json();
}

// --------- API Endpoints ---------

// Health check (optional for debugging)
export async function healthCheck() {
  return request<{ status: string }>("/app/api/status");
}

// reCAPTCHA verification (server-side flow)
export async function verifyRecaptcha(token: string) {
  return request<{ success: boolean; score?: number }>(
    "/app/api/verify-recaptcha",
    {
      method: "POST",
      body: JSON.stringify({ token }),
    }
  );
}

// Signup (email capture)
export async function signup(email: string, token: string) {
  return request<{ success: boolean; message?: string }>("/signup", {
    method: "POST",
    body: JSON.stringify({ email, token }),
  });
}

// Unlock resume (after auth + captcha)
export async function unlockResume(email: string, token: string) {
  return request<{ success: boolean; downloadUrl?: string }>("/unlockResume", {
    method: "POST",
    body: JSON.stringify({ email, token }),
  });
}

// Edit resume content with Vertex AI support - requires authentication
export async function editResume(
  idToken: string, 
  prompt: string, 
  resumeContent?: string,
  useVertexAI: boolean = true
) {
  return request<{ 
    success: boolean; 
    result: string; 
    message: string;
    metadata?: {
      model: string;
      provider: string;
      tokens: number;
    }
  }>("/api/editResume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`,
    },
    body: JSON.stringify({ 
      prompt, 
      resumeContent,
      useVertexAI // Enable Vertex AI by default (more secure, scalable)
    }),
  });
}

// Generate trade-specific resume with AI - requires authentication
export async function generateTradeResume(
  idToken: string,
  tradeKey: string,
  userData?: {
    name?: string;
    yearsExperience?: number;
    location?: string;
    currentCompany?: string;
    currentJobDates?: string;
    phone?: string;
    email?: string;
  },
  customPrompt?: string,
  useVertexAI: boolean = true
) {
  return request<{
    success: boolean;
    tradeKey: string;
    tradeTitle: string;
    placeholders: Record<string, string>;
    tradeData: {
      certifications: string[];
      skills: string[];
    };
    validation: {
      valid: boolean;
      warnings: string[];
      wordCount: number;
      hasUnfilledPlaceholders: boolean;
    };
    metadata: {
      model: string;
      provider: string;
      promptMetadata: {
        tradeKey: string;
        tradeTitle: string;
        certificationsCount: number;
        skillsCount: number;
      };
    };
  }>("/api/generateTradeResume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      tradeKey,
      userData,
      customPrompt,
      useVertexAI,
    }),
  });
}

// Save Gemini AI output (for scoring or edits)
export async function saveGeminiOutput(message: string) {
  return request<{ success: boolean; storedId?: string }>(
    "/saveGeminiOutput",
    {
      method: "POST",
      body: JSON.stringify({ data: { message } }),
    }
  );
}

// Local API helpers (for Next.js API routes)
const LOCAL_API_BASE = "/api";

async function localRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${LOCAL_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Local API error (${res.status}): ${errorText}`);
  }

  return res.json();
}

// Local Next.js API routes
export async function localSignup(email: string, token: string) {
  return localRequest<{ success: boolean; message?: string }>("/signup", {
    method: "POST",
    body: JSON.stringify({ email, token }),
  });
}

export async function localUnlockResume(idToken: string, additionalData: Record<string, any> = {}) {
  return request<{ success: boolean; message?: string }>("/api/unlock-resume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`,
    },
    body: JSON.stringify(additionalData),
  });
}

export async function localVerifyRecaptcha(token: string) {
  return localRequest<{ success: boolean; score?: number }>("/verify-recaptcha", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
