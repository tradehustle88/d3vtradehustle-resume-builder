'use client';

import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

export default function HomePage() {
    const handleFunnelClick = (funnelType: string) => {
        trackCustomEvent('funnel_entry', { type: funnelType });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 bg-[url('/assets/brickwall-background.webp')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        {/* Logo/Title */}
                        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-6">
                            TRADE HUSTLE
                        </h1>

                        {/* Subtitle */}
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            Resume Builder
                        </h2>

                        {/* Description */}
                        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                            Built for the trades. Backed by hustle. Get the tools you need to land your next job.
                        </p>

                        {/* Two Funnel Buttons */}
                        <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-4xl mx-auto">

                            {/* Funnel 1: Free PDF */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 w-full md:w-1/2">
                                <div className="text-center">
                                    <div className="text-5xl mb-4">📄</div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Free Resume Kit</h3>
                                    <p className="text-gray-300 mb-6">
                                        Get professional resume templates, samples, and guides designed specifically for skilled trades.
                                    </p>
                                    <Link
                                        href="/free-pdf"
                                        onClick={() => handleFunnelClick('free-pdf')}
                                        className="btn-hustle inline-block w-full py-4 px-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        Get Free Kit →
                                    </Link>
                                    <p className="text-sm text-gray-400 mt-2">No credit card required</p>
                                </div>
                            </div>

                            {/* Funnel 2: Resume Builder */}
                            <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 w-full md:w-1/2 relative">
                                {/* Popular badge */}
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                    POPULAR
                                </div>

                                <div className="text-center">
                                    <div className="text-5xl mb-4">🚀</div>
                                    <h3 className="text-2xl font-bold text-white mb-4">AI Resume Builder</h3>
                                    <p className="text-gray-300 mb-6">
                                        Create ATS-optimized resumes with AI assistance. Tailored for your specific trade and experience.
                                    </p>
                                    <Link
                                        href="/resume-builder"
                                        onClick={() => handleFunnelClick('resume-builder')}
                                        className="btn-hustle inline-block w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        Build My Resume →
                                    </Link>
                                    <p className="text-sm text-gray-400 mt-2">AI-powered • ATS-optimized</p>
                                </div>
                            </div>

                        </div>

                        {/* Trust indicators */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl mb-2">⚡</div>
                                <p className="text-sm text-gray-400">5-Minute Setup</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🎯</div>
                                <p className="text-sm text-gray-400">ATS Optimized</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🔧</div>
                                <p className="text-sm text-gray-400">Trade-Focused</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">💪</div>
                                <p className="text-sm text-gray-400">Hustle Ready</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}