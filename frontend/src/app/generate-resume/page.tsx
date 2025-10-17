"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { generateTradeResume } from "@/lib/api";
import { getAvailableTrades, getTradeDisplayInfo } from "@/lib/tradesData";
import TradeCard from "@/components/TradeCard";
import ProgressSidebar from "@/components/ProgressSidebar";
import ResumePreviewNew from "@/components/ResumePreviewNew";
import type { UserData, TradePlaceholderMap } from "@/lib/tradesData";

type FormStep = 1 | 2 | 3 | 4 | 5;

interface FormData extends UserData {
  tradeKey: string;
  customPrompt?: string;
}

export default function GenerateResumePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<FormData>({
    tradeKey: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    yearsExperience: 0,
    certifications: [],
    customPrompt: "",
  });
  const [generatedPlaceholders, setGeneratedPlaceholders] =
    useState<TradePlaceholderMap | null>(null);
  const [resumeId, setResumeId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [idToken, setIdToken] = useState<string>("");

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdToken();
        setIdToken(token);
      } else {
        router.push("/unlock");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const availableTrades = getAvailableTrades();

  const handleTradeSelect = (tradeKey: string) => {
    setFormData({ ...formData, tradeKey });
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as FormStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as FormStep);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const response = await generateTradeResume(
        idToken,
        formData.tradeKey,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          yearsExperience: formData.yearsExperience,
          certifications: formData.certifications,
        },
        formData.customPrompt,
        true // useVertexAI
      );

      if (response.success && response.placeholders) {
        setGeneratedPlaceholders(response.placeholders as unknown as TradePlaceholderMap);
        setResumeId(response.tradeKey); // Use tradeKey as temp ID
        setCurrentStep(5);
      } else {
        setError("Failed to generate resume - please try again");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    // TODO: Implement PDF/DOCX download
    console.log("Download resume:", resumeId);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hustle-navy">
        <div className="text-hustle-gold text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hustle-navy text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="hero-title text-5xl md:text-6xl mb-4">
            Generate Your Resume
          </h1>
          <p className="text-hustle-gold text-xl">
            AI-Powered, Trade-Specific, ATS-Optimized
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProgressSidebar currentStep={currentStep} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 brick-block">
              {/* Step 1: Trade Selection */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-hustle-gold">
                    Select Your Trade
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableTrades.map((tradeKey) => {
                      const info = getTradeDisplayInfo(tradeKey);
                      return (
                        <TradeCard
                          key={tradeKey}
                          tradeKey={tradeKey}
                          title={info.displayName}
                          icon={info.icon}
                          certCount={info.certCount}
                          selected={formData.tradeKey === tradeKey}
                          onSelect={() => handleTradeSelect(tradeKey)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-hustle-gold">
                    Your Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-hustle-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-hustle-gold"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-hustle-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-hustle-gold"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-hustle-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-hustle-gold"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-hustle-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-hustle-gold"
                        placeholder="Chicago, IL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Years of Experience *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={formData.yearsExperience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            yearsExperience: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-hustle-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-hustle-gold"
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={handleBack} className="btn-hustle-outline">
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="btn-hustle flex-1"
                      disabled={!formData.name || !formData.email}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Certifications */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-hustle-gold">
                    Certifications
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Add any certifications relevant to your trade (optional)
                  </p>
                  <div>
                    <textarea
                      value={formData.certifications?.join("\n") || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certifications: e.target.value
                            .split("\n")
                            .filter((c) => c.trim()),
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-hustle-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-hustle-gold h-32"
                      placeholder="EPA 608 Certification&#10;OSHA 30&#10;State License #12345"
                    />
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={handleBack} className="btn-hustle-outline">
                      Back
                    </button>
                    <button onClick={handleNext} className="btn-hustle flex-1">
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Customize & Generate */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-hustle-gold">
                    Customize Your Resume
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Add any specific requirements or focus areas (optional)
                  </p>
                  <div>
                    <textarea
                      value={formData.customPrompt || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customPrompt: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-hustle-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-hustle-gold h-32"
                      placeholder="Example: Focus on commercial HVAC experience and leadership skills"
                    />
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button onClick={handleBack} className="btn-hustle-outline">
                      Back
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="btn-hustle flex-1"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Generating with AI...
                        </span>
                      ) : (
                        "Generate Resume"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Preview & Download */}
              {currentStep === 5 && generatedPlaceholders && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-hustle-gold">
                    Your Resume is Ready!
                  </h2>
                  <ResumePreviewNew
                    placeholders={generatedPlaceholders}
                    userData={formData}
                    tradeKey={formData.tradeKey}
                  />
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="btn-hustle-outline"
                    >
                      Generate Another
                    </button>
                    <button onClick={handleDownload} className="btn-hustle flex-1">
                      Download Resume
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
