'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

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
  const [currentStep, setCurrentStep] = useState('personal'); // personal, experience, skills, preview

  useEffect(() => {
    const trade = localStorage.getItem('selectedTrade') || '';
    const template = localStorage.getItem('selectedTemplate') || '';
    setSelectedTrade(trade);
    setSelectedTemplate(template);
  }, []);

  const handleAIAssist = async (field: string, context: string) => {
    setAiLoading(true);
    trackCustomEvent('ai_assist_used', { field, trade: selectedTrade });

    try {
      // TODO: Call your Firebase Function for AI generation
      // const response = await editResume(context, field);

      // Mock AI response for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      let aiContent = '';
      if (field === 'summary') {
        aiContent = `Experienced ${selectedTrade} professional with 5+ years in residential and commercial projects. Skilled in troubleshooting, installation, and maintenance with strong attention to safety protocols and customer service.`;
      } else if (field === 'description') {
        aiContent = `• Installed and maintained HVAC systems for residential and commercial clients\n• Diagnosed and repaired heating and cooling equipment, reducing downtime by 30%\n• Collaborated with team members to complete projects on time and within budget\n• Maintained detailed service records and communicated findings to customers`;
      }

      if (field === 'summary') {
        setResumeData(prev => ({ ...prev, summary: aiContent }));
      }

    } catch (error) {
      console.error('AI assist error:', error);
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
                      onClick={() => handleAIAssist('summary', `${selectedTrade} professional`)}
                      disabled={aiLoading}
                      className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg disabled:opacity-50 flex items-center gap-2"
                    >
                      {aiLoading ? '🔄' : '🤖'} AI Assist
                    </button>
                  </div>

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
                            onClick={() => handleAIAssist('description', `${exp.title} at ${exp.company}`)}
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
