'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

const templates = [
    {
        id: 'modern',
        name: 'Modern Professional',
        description: 'Clean, contemporary design perfect for most trades',
        preview: '📄',
        features: ['ATS-Optimized', 'Clean Layout', 'Skills Highlight'],
        popular: true
    },
    {
        id: 'classic',
        name: 'Classic Traditional',
        description: 'Traditional format preferred by established companies',
        preview: '📋',
        features: ['Traditional Format', 'Conservative Style', 'Experience Focus']
    },
    {
        id: 'bold',
        name: 'Bold Impact',
        description: 'Eye-catching design that stands out from the crowd',
        preview: '⚡',
        features: ['Visual Impact', 'Color Accents', 'Project Showcase']
    },
    {
        id: 'technical',
        name: 'Technical Focus',
        description: 'Emphasizes certifications, skills, and technical expertise',
        preview: '🔧',
        features: ['Skills Matrix', 'Certification Focus', 'Technical Layout']
    }
];

export default function TemplateSelectionPage() {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [selectedTrade, setSelectedTrade] = useState('');

    useEffect(() => {
        // Get selected trade from previous step
        const trade = localStorage.getItem('selectedTrade');
        if (trade) {
            setSelectedTrade(trade);
        }
    }, []);

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId);
        trackCustomEvent('template_selected', { template: templateId, trade: selectedTrade });
    };

    const handleContinue = () => {
        if (selectedTemplate) {
            trackCustomEvent('template_continue', { template: selectedTemplate, trade: selectedTrade });
            // Store selection for next step
            localStorage.setItem('selectedTemplate', selectedTemplate);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Back link */}
                <div className="mb-8">
                    <Link href="/resume-builder/trade" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2">
                        ← Back to Trade Selection
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Choose Your Template
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Select a professional template that fits your style and the type of companies you're targeting.
                    </p>
                    {selectedTrade && (
                        <p className="text-yellow-400 mt-2">
                            Optimized for: {selectedTrade.charAt(0).toUpperCase() + selectedTrade.slice(1)} professionals
                        </p>
                    )}
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
                            <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                            <span className="text-white ml-2">Template</span>
                        </div>
                        <div className="w-12 h-1 bg-gray-600"></div>
                        <div className="flex items-center">
                            <div className="bg-gray-600 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-sm">3</div>
                            <span className="text-gray-400 ml-2">Edit</span>
                        </div>
                        <div className="w-12 h-1 bg-gray-600"></div>
                        <div className="flex items-center">
                            <div className="bg-gray-600 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-sm">4</div>
                            <span className="text-gray-400 ml-2">Download</span>
                        </div>
                    </div>
                </div>

                {/* Template selection grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${selectedTemplate === template.id
                                    ? 'border-red-500 bg-red-600/20 shadow-lg'
                                    : 'border-white/20 bg-white/10 hover:border-white/40'
                                }`}
                        >
                            {/* Popular badge */}
                            {template.popular && (
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                                    POPULAR
                                </div>
                            )}

                            {/* Template preview */}
                            <div className="text-6xl mb-4 text-center">{template.preview}</div>

                            <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                            <p className="text-sm text-gray-400 mb-4">{template.description}</p>

                            {/* Features */}
                            <div className="space-y-1 mb-4">
                                {template.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-xs text-gray-300">
                                        <span className="text-green-400 mr-2">✓</span>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {selectedTemplate === template.id && (
                                <div className="mt-3 flex items-center text-red-400">
                                    <span className="text-sm font-semibold">✓ Selected</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Preview note */}
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <span className="text-blue-400 text-xl">💡</span>
                        <div>
                            <h3 className="text-blue-300 font-semibold mb-1">Template Preview</h3>
                            <p className="text-blue-200 text-sm">
                                Don't worry about the exact look - you'll be able to see a full preview and make adjustments in the next step.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Continue button */}
                <div className="text-center">
                    {selectedTemplate ? (
                        <Link
                            href="/resume-builder/editor"
                            onClick={handleContinue}
                            className="inline-block py-4 px-8 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Continue to Editor →
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="inline-block py-4 px-8 bg-gray-600 text-gray-400 font-bold rounded-lg cursor-not-allowed"
                        >
                            Select a Template to Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}