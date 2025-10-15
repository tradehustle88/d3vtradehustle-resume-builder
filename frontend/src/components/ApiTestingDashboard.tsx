"use client";

import { useState } from "react";
import { 
  // Firebase Cloud Functions
  healthCheck, 
  verifyRecaptcha, 
  signup, 
  unlockResume, 
  editResume, 
  saveGeminiOutput,
  // Local Next.js API routes
  localSignup, 
  localUnlockResume, 
  localVerifyRecaptcha 
} from "@/lib/api";

export default function ApiTestingDashboard() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState("test@example.com");
  const [resumeId, setResumeId] = useState("resume123");
  const [content, setContent] = useState("Updated resume content");

  const executeTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error: any) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { success: false, error: error.message } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

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
          .execute(siteKey, { action: "test" })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const tests = [
    {
      category: "Firebase Cloud Functions",
      tests: [
        {
          name: "healthCheck",
          label: "Health Check",
          fn: () => healthCheck()
        },
        {
          name: "cloudVerifyRecaptcha",
          label: "Verify reCAPTCHA (Cloud)",
          fn: async () => {
            const token = await getRecaptchaToken();
            return verifyRecaptcha(token);
          }
        },
        {
          name: "cloudSignup",
          label: "Signup (Cloud)",
          fn: async () => {
            const token = await getRecaptchaToken();
            return signup(email, token);
          }
        },
        {
          name: "cloudUnlockResume",
          label: "Unlock Resume (Cloud)",
          fn: async () => {
            const token = await getRecaptchaToken();
            return unlockResume(email, token);
          }
        },
        {
          name: "editResume",
          label: "Edit Resume",
          fn: () => editResume(resumeId, content)
        },
        {
          name: "saveGeminiOutput",
          label: "Save Gemini Output",
          fn: () => saveGeminiOutput("Test AI output message")
        }
      ]
    },
    {
      category: "Local Next.js API Routes",
      tests: [
        {
          name: "localVerifyRecaptcha",
          label: "Verify reCAPTCHA (Local)",
          fn: async () => {
            const token = await getRecaptchaToken();
            return localVerifyRecaptcha(token);
          }
        },
        {
          name: "localSignup",
          label: "Signup (Local)",
          fn: async () => {
            const token = await getRecaptchaToken();
            return localSignup(email, token);
          }
        },
        {
          name: "localUnlockResume",
          label: "Unlock Resume (Local)",
          fn: async () => {
            const token = await getRecaptchaToken();
            return localUnlockResume(email, { recaptchaToken: token });
          }
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          API Testing Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Test all your API endpoints from one centralized location.
        </p>

        {/* Test Inputs */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Test Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume ID
              </label>
              <input
                type="text"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Test Categories */}
      {tests.map((category) => (
        <div key={category.category} className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {category.category}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.tests.map((test) => (
              <div key={test.name} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{test.label}</h3>
                  <button
                    onClick={() => executeTest(test.name, test.fn)}
                    disabled={loading[test.name]}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading[test.name] ? "Testing..." : "Test"}
                  </button>
                </div>

                {results[test.name] && (
                  <div className={`p-3 rounded text-sm ${
                    results[test.name].success 
                      ? "bg-green-50 text-green-800" 
                      : "bg-red-50 text-red-800"
                  }`}>
                    {results[test.name].success ? (
                      <div>
                        <div className="font-medium mb-1">✅ Success</div>
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(results[test.name].data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium mb-1">❌ Error</div>
                        <div className="text-xs">{results[test.name].error}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Clear Results */}
      <div className="text-center">
        <button
          onClick={() => {
            setResults({});
            setLoading({});
          }}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Clear All Results
        </button>
      </div>
    </div>
  );
}
