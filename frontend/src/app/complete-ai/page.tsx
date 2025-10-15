'use client';

import { useState } from 'react';
import SimpleAIAssistant from '@/components/SimpleAIAssistant';
import TradeAIAssistant from '@/components/TradeAIAssistant';
import ResumeRefiner from '@/components/ResumeRefiner';

/**
 * Complete AI-Powered Resume Builder Integration Example
 * Shows all features working together
 */
export default function CompleteAIResumeBuilder() {
  const [activeTab, setActiveTab] = useState<'simple' | 'trade-specific' | 'refine'>('simple');
  const [resumeContent, setResumeContent] = useState({
    summary: '',
    experience: '',
    skills: '',
    certifications: ''
  });
  const [selectedSection, setSelectedSection] = useState<keyof typeof resumeContent>('summary');

  const tabs = [
    { id: 'simple', label: 'AI Assistant', icon: '🤖' },
    { id: 'trade-specific', label: 'Trade Expert', icon: '🎯' },
    { id: 'refine', label: 'Refine Content', icon: '✨' }
  ] as const;

  const sections = [
    { key: 'summary', label: 'Professional Summary', icon: '📝' },
    { key: 'experience', label: 'Work Experience', icon: '💼' },
    { key: 'skills', label: 'Skills & Competencies', icon: '⚡' },
    { key: 'certifications', label: 'Certifications', icon: '🏆' }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#002a43] to-[#001a33] p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#ffd700] font-anton mb-2">
            🚀 AI-POWERED RESUME BUILDER
          </h1>
          <p className="text-xl text-white mb-4">
            Complete Integration - All Features Working Together
          </p>
          <div className="inline-flex bg-[#001a33] rounded-lg p-1 border border-[#ffd700]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#8b0000] text-white'
                    : 'text-[#ffd700] hover:bg-[#ffd700] hover:text-[#001a33]'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: AI Tools */}
          <div className="lg:col-span-2">
            
            {/* Simple AI Assistant */}
            {activeTab === 'simple' && (
              <div>
                <h2 className="text-2xl font-bold text-[#ffd700] mb-4">
                  🤖 Simple AI Assistant
                </h2>
                <SimpleAIAssistant />
              </div>
            )}

            {/* Trade-Specific Assistant */}
            {activeTab === 'trade-specific' && (
              <div>
                <h2 className="text-2xl font-bold text-[#ffd700] mb-4">
                  🎯 Trade-Specific AI Expert
                </h2>
                <TradeAIAssistant />
              </div>
            )}

            {/* Content Refiner */}
            {activeTab === 'refine' && (
              <div>
                <h2 className="text-2xl font-bold text-[#ffd700] mb-4">
                  ✨ AI Content Refiner
                </h2>
                <div className="bg-white rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-[#001a33] mb-4">
                    Select content to refine:
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {sections.map((section) => (
                      <button
                        key={section.key}
                        onClick={() => setSelectedSection(section.key)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedSection === section.key
                            ? 'bg-[#001a33] text-[#ffd700] border-2 border-[#ffd700]'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-2">{section.icon}</span>
                        {section.label}
                      </button>
                    ))}
                  </div>
                  
                  <textarea
                    value={resumeContent[selectedSection]}
                    onChange={(e) => setResumeContent(prev => ({
                      ...prev,
                      [selectedSection]: e.target.value
                    }))}
                    placeholder={`Enter your ${sections.find(s => s.key === selectedSection)?.label.toLowerCase()} content to refine...`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:border-transparent"
                    rows={6}
                  />
                </div>
                
                <ResumeRefiner
                  originalContent={resumeContent[selectedSection]}
                  onRefined={(refined) => setResumeContent(prev => ({
                    ...prev,
                    [selectedSection]: refined
                  }))}
                />
              </div>
            )}
          </div>

          {/* Right Column: Resume Preview */}
          <div className="space-y-6">
            
            {/* Resume Preview */}
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-[#001a33] mb-6">📄 Resume Preview</h3>
              
              {sections.map((section) => (
                <div key={section.key} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-[#001a33] flex items-center">
                      <span className="mr-2">{section.icon}</span>
                      {section.label}
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedSection(section.key);
                        setActiveTab('refine');
                      }}
                      className="text-xs bg-[#ffd700] text-[#001a33] px-2 py-1 rounded hover:bg-yellow-300 transition-colors"
                    >
                      ✨ Refine
                    </button>
                  </div>
                  
                  <div className="min-h-[80px] p-3 bg-gray-50 rounded border-l-4 border-[#8b0000]">
                    {resumeContent[section.key] ? (
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {resumeContent[section.key]}
                      </pre>
                    ) : (
                      <p className="text-gray-400 italic text-sm">
                        No content yet. Use the AI assistant to generate professional content.
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Export Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <button className="flex-1 bg-[#8b0000] hover:bg-[#a61010] text-white py-2 px-4 rounded font-semibold transition-colors">
                    📄 Export PDF
                  </button>
                  <button className="flex-1 bg-[#001a33] hover:bg-[#002a43] text-[#ffd700] border border-[#ffd700] py-2 px-4 rounded font-semibold transition-colors">
                    💾 Save Draft
                  </button>
                </div>
              </div>
            </div>

            {/* AI Features Summary */}
            <div className="bg-[#001a33] rounded-xl p-6 border border-[#ffd700] text-white">
              <h3 className="text-lg font-bold text-[#ffd700] mb-4">
                🚀 Available AI Features
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="text-[#ffd700] mr-2">🤖</span>
                  <div>
                    <strong>Simple Assistant:</strong> General AI help for any resume content
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-[#ffd700] mr-2">🎯</span>
                  <div>
                    <strong>Trade Expert:</strong> Specialized prompts for {Object.keys(require('@/lib/tradePrompts').tradePrompts).length}+ trades
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-[#ffd700] mr-2">✨</span>
                  <div>
                    <strong>Content Refiner:</strong> Optimize for ATS, shorten, expand, or rewrite
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-[#ffd700] mr-2">💾</span>
                  <div>
                    <strong>Auto-Save:</strong> All AI generations stored to Firestore
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-[#ffd700] mr-2">🔄</span>
                  <div>
                    <strong>Quick Actions:</strong> Copy, clear, and refinement buttons
                  </div>
                </div>
              </div>
            </div>

            {/* Integration Stats */}
            <div className="bg-gray-800 rounded-xl p-4 text-white">
              <h4 className="text-[#ffd700] font-semibold mb-3">📊 Integration Status</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>✅ Backend API</span>
                  <span className="text-green-400">Deployed</span>
                </div>
                <div className="flex justify-between">
                  <span>✅ Frontend Components</span>
                  <span className="text-green-400">Ready</span>
                </div>
                <div className="flex justify-between">
                  <span>✅ Trade Prompts</span>
                  <span className="text-green-400">10+ Trades</span>
                </div>
                <div className="flex justify-between">
                  <span>✅ Firestore Storage</span>
                  <span className="text-yellow-400">Ready (Auth req.)</span>
                </div>
                <div className="flex justify-between">
                  <span>✅ Content Refinement</span>
                  <span className="text-green-400">4 Types</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
