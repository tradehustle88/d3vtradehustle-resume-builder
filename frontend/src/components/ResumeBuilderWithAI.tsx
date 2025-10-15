'use client';

import { useState } from 'react';
import SimpleAIAssistant, { CompactAIAssistant } from '@/components/SimpleAIAssistant';

/**
 * Example Resume Builder Page with AI Integration
 * Shows how to integrate AI assistance into your existing resume forms
 */
export default function ResumeBuilderWithAI() {
  const [resumeData, setResumeData] = useState({
    summary: '',
    experience: '',
    skills: '',
    certifications: ''
  });

  const handleAIResult = (section: keyof typeof resumeData) => (text: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: text
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a33] to-[#002a43] p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#ffd700] font-anton mb-2">
            AI-POWERED RESUME BUILDER
          </h1>
          <p className="text-white text-lg">
            Build your professional resume with intelligent AI assistance
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column: Resume Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-[#001a33] mb-6">Resume Content</h2>
              
              {/* Professional Summary Section */}
              <div className="mb-6">
                <label className="block text-[#001a33] font-semibold mb-2">
                  Professional Summary
                </label>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({...prev, summary: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:border-transparent"
                  rows={4}
                  placeholder="Your professional summary will appear here..."
                />
                
                {/* Compact AI Assistant for this section */}
                <div className="mt-2">
                  <CompactAIAssistant 
                    onResult={handleAIResult('summary')}
                    placeholder="e.g., Master electrician with 10 years experience..."
                  />
                </div>
              </div>

              {/* Experience Section */}
              <div className="mb-6">
                <label className="block text-[#001a33] font-semibold mb-2">
                  Work Experience
                </label>
                <textarea
                  value={resumeData.experience}
                  onChange={(e) => setResumeData(prev => ({...prev, experience: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:border-transparent"
                  rows={6}
                  placeholder="Your work experience will appear here..."
                />
                
                <div className="mt-2">
                  <CompactAIAssistant 
                    onResult={handleAIResult('experience')}
                    placeholder="Describe your work history and achievements..."
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-6">
                <label className="block text-[#001a33] font-semibold mb-2">
                  Skills & Competencies
                </label>
                <textarea
                  value={resumeData.skills}
                  onChange={(e) => setResumeData(prev => ({...prev, skills: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:border-transparent"
                  rows={4}
                  placeholder="Your skills will appear here..."
                />
                
                <div className="mt-2">
                  <CompactAIAssistant 
                    onResult={handleAIResult('skills')}
                    placeholder="List your technical skills and tools..."
                  />
                </div>
              </div>

              {/* Certifications Section */}
              <div className="mb-6">
                <label className="block text-[#001a33] font-semibold mb-2">
                  Certifications & Training
                </label>
                <textarea
                  value={resumeData.certifications}
                  onChange={(e) => setResumeData(prev => ({...prev, certifications: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:border-transparent"
                  rows={4}
                  placeholder="Your certifications will appear here..."
                />
                
                <div className="mt-2">
                  <CompactAIAssistant 
                    onResult={handleAIResult('certifications')}
                    placeholder="List your licenses and certifications..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-[#8b0000] hover:bg-[#a61010] text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                  📄 PREVIEW RESUME
                </button>
                <button className="flex-1 bg-[#001a33] hover:bg-[#002a43] text-[#ffd700] border-2 border-[#ffd700] py-3 px-6 rounded-lg font-semibold transition-colors">
                  💾 SAVE DRAFT
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Assistant */}
          <div className="space-y-6">
            <SimpleAIAssistant />
            
            {/* Additional Tips */}
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-[#001a33] mb-4">💡 AI Assistant Tips</h3>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <strong>For Professional Summary:</strong> Mention your trade, years of experience, key certifications, and specializations.
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <strong>For Work Experience:</strong> Include company names, job titles, dates, and specific achievements with numbers when possible.
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <strong>For Skills:</strong> List technical skills, tools, equipment, software, and safety certifications relevant to your trade.
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <strong>For Certifications:</strong> Include license numbers, issuing organizations, and expiration dates where applicable.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
