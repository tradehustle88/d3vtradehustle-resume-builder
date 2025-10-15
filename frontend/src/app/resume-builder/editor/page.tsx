'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';
import { editResume } from '@/lib/api';
import { auth } from '@/lib/firebase';

// --- PATCH 1: helpers & guards ---
type FieldKind = 'summary' | 'experience';

function getExperienceOrThrow(resumeData: ResumeData, index: number) {
  const arr = resumeData.experience ?? [];
  const exp = Number.isInteger(index) ? arr[index] : undefined;
  if (!exp) {
    throw new Error('Invalid experience index provided.');
  }
  return exp;
}

function buildSummaryPrompt(opts: {
  selectedTrade?: string;
  personalInfo: { name?: string; location?: string };
  skills: string[];
  certifications: string[];
  experienceContext: string;
}) {
  const { selectedTrade, personalInfo, skills, certifications, experienceContext } = opts;
  const skillsStr = skills.length ? skills.join(', ') : 'Not specified';
  const certsStr = certifications.length ? certifications.join(', ') : 'Not specified';

  return `You are an expert resume writer. Write a 2-3 sentence professional summary for a ${selectedTrade || 'skilled trades'} professional. Highlight safety, technical skills, customer satisfaction, and measurable achievements when possible. Use the following context to inform the summary:
Name: ${personalInfo.name || 'Not provided'}
Location: ${personalInfo.location || 'Not provided'}
Skills: ${skillsStr}
Certifications: ${certsStr}
Experience: ${experienceContext || 'Experience details not provided'}
Return only the summary text without headings.`;
}

function buildExperiencePrompt(opts: {
  selectedTrade?: string;
  title?: string;
  company?: string;
  description?: string;
}) {
  const role = opts.title || opts.selectedTrade || 'Skilled Trades Professional';
  const company = opts.company || 'the company';
  const context = opts.description || 'No previous description provided.';
  return `You are a resume optimization assistant. Create 3-4 impactful resume bullet points for the role ${role} at ${company}. Focus on safety, technical expertise, customer satisfaction, and quantifiable achievements. Each bullet should begin with "•" and highlight tools, certifications, or technologies relevant to skilled trades. Incorporate measurable results, efficiency gains, or leadership examples based on this context: ${context}`;
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  certifications: string[];
}

export default function EditorPage() {
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: ''
    },
    summary: '',
    experience: [{ title: '', company: '', duration: '', description: '' }],
    skills: [],
    certifications: []
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState('personal'); // personal, experience, skills, preview

  useEffect(() => {
    const trade = localStorage.getItem('selectedTrade') || '';
    const template = localStorage.getItem('selectedTemplate') || '';
    setSelectedTrade(trade);
    setSelectedTemplate(template);
  }, []);

  // Helper function to get ID token
  const getIdToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  // Helper to format experience for prompt context
  const formatExperienceForPrompt = (): string => {
    return resumeData.experience
      .map(exp => `${exp.title} at ${exp.company}: ${exp.description}`)
      .filter(Boolean)
      .join('\n') || 'No experience provided yet.';
  };

  // --- PATCH 2: handleAIAssist refactor ---
  const handleAIAssist = async (field: FieldKind, experienceIndex?: number) => {
    setAiLoading(true);
    setAiError(null);
    setAiSuccess(null);

    const analyticsPayload: Record<string, string | number | undefined> = {
      field,
      trade: selectedTrade,
      experienceIndex,
    };
    trackCustomEvent('ai_assist_used', analyticsPayload); // single call

    try {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Please sign in to use AI assistance.');
      }

      let prompt = '';
      let resumeContent: string | undefined;

      if (field === 'summary') {
        const personalInfo = resumeData.personalInfo ?? {};
        const experienceContext = formatExperienceForPrompt();
        prompt = buildSummaryPrompt({
          selectedTrade,
          personalInfo,
          skills: resumeData.skills ?? [],
          certifications: resumeData.certifications ?? [],
          experienceContext,
        });
        resumeContent = resumeData.summary;

      } else if (field === 'experience') {
        if (typeof experienceIndex !== 'number') {
          throw new Error('Experience index required for AI assistance.');
        }
        const exp = getExperienceOrThrow(resumeData, experienceIndex);
        prompt = buildExperiencePrompt({
          selectedTrade,
          title: exp.title,
          company: exp.company,
          description: exp.description,
        });
        resumeContent = exp.description;
      }

      const response = await editResume(idToken, prompt, resumeContent);
      if (!response.success) {
        throw new Error(response.message || 'AI request failed.');
      }

      const aiText = (response.result || '').trim();

      if (field === 'summary') {
        setResumeData(prev => ({ ...prev, summary: aiText }));
      } else if (field === 'experience' && typeof experienceIndex === 'number') {
        setResumeData(prev => ({
          ...prev,
          experience: (prev.experience ?? []).map((exp, idx) =>
            idx === experienceIndex ? { ...exp, description: aiText } : exp
          ),
        }));
      }

      setAiSuccess('AI suggestion applied successfully.');
      setTimeout(() => setAiSuccess(null), 5000); // auto-hide

      trackCustomEvent('ai_assist_success', analyticsPayload);

    } catch (error) {
      console.error('AI assist error:', error);
      const message = error instanceof Error ? error.message : 'AI assistance failed. Please try again.';
      setAiError(message);
      setTimeout(() => setAiError(null), 5000); // auto-hide
      trackCustomEvent('ai_assist_failed', { ...analyticsPayload, message });

    } finally {
      setAiLoading(false);
    }
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleContinue = () => {
    trackCustomEvent('editor_complete', { trade: selectedTrade, template: selectedTemplate });
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Back link */}
        <div className="mb-8">
          <Link href="/resume-builder/template" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2">
            ← Back to Templates
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Build Your Resume
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Fill in your information and let AI help you create compelling content that gets results.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">✓</div>
              <span className="text-green-400 ml-2">Trade</span>
            </div>
            <div className="w-12 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">✓</div>
              <span className="text-green-400 ml-2">Template</span>
            </div>
            <div className="w-12 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-white ml-2">Edit</span>
            </div>
            <div className="w-12 h-1 bg-gray-600"></div>
            <div className="flex items-center">
              <div className="bg-gray-600 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-sm">4</div>
              <span className="text-gray-400 ml-2">Download</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Step Navigation */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Resume Sections</h3>

              <div className="space-y-2">
                {[
                  { id: 'personal', label: 'Personal Info', icon: '👤' },
                  { id: 'summary', label: 'Professional Summary', icon: '📝' },
                  { id: 'experience', label: 'Work Experience', icon: '💼' },
                  { id: 'skills', label: 'Skills & Certifications', icon: '🔧' },
                  { id: 'preview', label: 'Preview & Finish', icon: '👀' }
                ].map(step => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${currentStep === step.id
                        ? 'bg-red-600/30 border border-red-500/50 text-white'
                        : 'hover:bg-white/10 text-gray-300'
                      }`}
                  >
                    <span className="text-xl">{step.icon}</span>
                    <span className="font-medium">{step.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                🤖 AI Assistant
              </h3>
              <p className="text-purple-200 text-sm mb-4">
                Click "AI Assist" buttons to get professional content suggestions for your {selectedTrade} resume.
              </p>
              {aiLoading && (
                <div className="flex items-center gap-2 text-purple-300">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-300"></div>
                  <span className="text-sm">AI is writing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Form Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">

              {/* Personal Info Step */}
              {currentStep === 'personal' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, name: e.target.value }
                        }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value }
                        }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setCurrentStep('summary')}
                      className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg"
                    >
                      Continue to Summary →
                    </button>
                  </div>
                </div>
              )}

              {/* Professional Summary Step */}
              {currentStep === 'summary' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Professional Summary</h2>
                    <button
                      onClick={() => handleAIAssist('summary')}
                      disabled={aiLoading}
                      className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg disabled:opacity-50 flex items-center gap-2"
                    >
                      {aiLoading ? '🔄' : '🤖'} AI Assist
                    </button>
                  </div>

                  {/* PATCH 3: Success/Error messages */}
                  {!aiLoading && aiSuccess && (
                    <div className="text-sm text-green-200 bg-green-500/10 border border-green-400/40 rounded-lg px-3 py-2 mb-4">
                      {aiSuccess}
                    </div>
                  )}
                  {!aiLoading && aiError && (
                    <div className="text-sm text-red-200 bg-red-500/10 border border-red-400/40 rounded-lg px-3 py-2 mb-4">
                      {aiError}
                    </div>
                  )}

                  <textarea
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Write a brief summary of your professional background, skills, and career goals..."
                    className="w-full h-32 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400 resize-none"
                  />

                  <div className="mt-4 text-sm text-gray-400">
                    Tip: A good summary is 2-3 sentences highlighting your experience, key skills, and value proposition.
                  </div>

                  <div className="mt-8 text-center space-x-4">
                    <button
                      onClick={() => setCurrentStep('personal')}
                      className="py-3 px-6 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentStep('experience')}
                      className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg"
                    >
                      Continue to Experience →
                    </button>
                  </div>
                </div>
              )}

              {/* Experience Step */}
              {currentStep === 'experience' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Work Experience</h2>

                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                            placeholder="HVAC Technician"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                            placeholder="ABC Heating & Cooling"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                          placeholder="Jan 2020 - Present"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-300">Job Description</label>
                          <button
                            onClick={() => handleAIAssist('experience', index)}
                            disabled={aiLoading}
                            className="py-1 px-3 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-md disabled:opacity-50 flex items-center gap-1"
                          >
                            {aiLoading ? '🔄' : '🤖'} AI
                          </button>
                        </div>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include specific numbers and results when possible"
                          className="w-full h-24 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400 resize-none"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addExperience}
                    className="w-full py-3 px-4 border-2 border-dashed border-gray-500 hover:border-gray-400 text-gray-400 hover:text-gray-300 rounded-lg transition-colors"
                  >
                    + Add Another Position
                  </button>

                  <div className="mt-8 text-center space-x-4">
                    <button
                      onClick={() => setCurrentStep('summary')}
                      className="py-3 px-6 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentStep('skills')}
                      className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg"
                    >
                      Continue to Skills →
                    </button>
                  </div>
                </div>
              )}

              {/* Skills Step */}
              {currentStep === 'skills' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Skills & Certifications</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Technical Skills</label>
                      <input
                        type="text"
                        placeholder="HVAC Systems, Electrical Troubleshooting, Blueprint Reading (separate with commas)"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Certifications</label>
                      <input
                        type="text"
                        placeholder="EPA 608, OSHA 10, Journeyman License (separate with commas)"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                      />
                    </div>
                  </div>

                  <div className="mt-8 text-center space-x-4">
                    <button
                      onClick={() => setCurrentStep('experience')}
                      className="py-3 px-6 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentStep('preview')}
                      className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg"
                    >
                      Preview Resume →
                    </button>
                  </div>
                </div>
              )}

              {/* Preview Step */}
              {currentStep === 'preview' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Preview Your Resume</h2>

                  <div className="bg-white rounded-lg p-8 text-black mb-6">
                    <div className="text-center mb-6">
                      <h1 className="text-3xl font-bold">{resumeData.personalInfo.name || 'Your Name'}</h1>
                      <div className="text-gray-600">
                        {resumeData.personalInfo.email} | {resumeData.personalInfo.phone} | {resumeData.personalInfo.location}
                      </div>
                    </div>

                    {resumeData.summary && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Professional Summary</h2>
                        <p className="text-gray-700">{resumeData.summary}</p>
                      </div>
                    )}

                    <div className="mb-6">
                      <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Work Experience</h2>
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold">{exp.title || 'Job Title'}</h3>
                              <div className="text-gray-600">{exp.company || 'Company Name'}</div>
                            </div>
                            <div className="text-gray-600 text-sm">{exp.duration || 'Duration'}</div>
                          </div>
                          <div className="mt-2 text-gray-700 whitespace-pre-line">{exp.description || 'Job description will appear here'}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center space-x-4">
                    <button
                      onClick={() => setCurrentStep('skills')}
                      className="py-3 px-6 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg"
                    >
                      ← Back to Edit
                    </button>
                    <Link
                      href="/resume-builder/checkout"
                      onClick={handleContinue}
                      className="inline-block py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg"
                    >
                      Continue to Checkout →
                    </Link>
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
