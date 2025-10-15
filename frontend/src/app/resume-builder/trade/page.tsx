'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

const trades = [
    { id: 'hvac', name: 'HVAC Technician', icon: '🌡️', description: 'Heating, ventilation & air conditioning' },
    { id: 'electrical', name: 'Electrician', icon: '⚡', description: 'Residential & commercial electrical work' },
    { id: 'plumbing', name: 'Plumber', icon: '🔧', description: 'Residential & commercial plumbing' },
    { id: 'carpenter', name: 'Carpenter', icon: '🪚', description: 'Framing, finishing & custom work' },
    { id: 'mechanic', name: 'Mechanic', icon: '🔩', description: 'Auto, diesel & heavy equipment' },
    { id: 'welder', name: 'Welder', icon: '🔥', description: 'MIG, TIG, stick & specialized welding' },
    { id: 'mason', name: 'Mason', icon: '🧱', description: 'Brick, stone & concrete work' },
    { id: 'painter', name: 'Painter', icon: '🎨', description: 'Interior, exterior & specialty finishes' },
    { id: 'roofer', name: 'Roofer', icon: '🏠', description: 'Installation, repair & maintenance' },
    { id: 'flooring', name: 'Flooring Installer', icon: '📐', description: 'Hardwood, tile, carpet & vinyl' },
    { id: 'landscaper', name: 'Landscaper', icon: '🌿', description: 'Design, installation & maintenance' },
    { id: 'construction', name: 'General Construction', icon: '🏗️', description: 'Multi-trade construction work' },
];

export default function TradeSelectionPage() {
    const [selectedTrade, setSelectedTrade] = useState('');

    const handleTradeSelect = (tradeId: string) => {
        setSelectedTrade(tradeId);
        trackCustomEvent('trade_selected', { trade: tradeId });
    };

    const handleContinue = () => {
        if (selectedTrade) {
            trackCustomEvent('trade_continue', { trade: selectedTrade });
            // Store selection in localStorage for next step
            localStorage.setItem('selectedTrade', selectedTrade);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Back link */}
                <div className="mb-8">
                    <Link href="/resume-builder" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2">
                        ← Back to Resume Builder
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        What's Your Trade?
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Select your primary trade so we can customize your resume with relevant skills and experience.
                    </p>
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                            <span className="text-white ml-2">Trade</span>
                        </div>
                        <div className="w-12 h-1 bg-gray-600"></div>
                        <div className="flex items-center">
                            <div className="bg-gray-600 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-sm">2</div>
                            <span className="text-gray-400 ml-2">Template</span>
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

                {/* Trade selection grid */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                    {trades.map((trade) => (
                        <button
                            key={trade.id}
                            onClick={() => handleTradeSelect(trade.id)}
                            className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${selectedTrade === trade.id
                                    ? 'border-red-500 bg-red-600/20 shadow-lg'
                                    : 'border-white/20 bg-white/10 hover:border-white/40'
                                }`}
                        >
                            <div className="text-4xl mb-3">{trade.icon}</div>
                            <h3 className="text-lg font-semibold text-white mb-2">{trade.name}</h3>
                            <p className="text-sm text-gray-400">{trade.description}</p>

                            {selectedTrade === trade.id && (
                                <div className="mt-3 flex items-center text-red-400">
                                    <span className="text-sm">✓ Selected</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Continue button */}
                <div className="text-center">
                    {selectedTrade ? (
                        <Link
                            href="/resume-builder/template"
                            onClick={handleContinue}
                            className="inline-block py-4 px-8 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Continue to Templates →
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="inline-block py-4 px-8 bg-gray-600 text-gray-400 font-bold rounded-lg cursor-not-allowed"
                        >
                            Select a Trade to Continue
                        </button>
                    )}
                </div>

                {/* Help text */}
                <div className="text-center mt-8">
                    <p className="text-gray-400 text-sm">
                        Don't see your trade? Select "General Construction" and we'll help you customize it.
                    </p>
                </div>
            </div>
        </div>
    );
}
