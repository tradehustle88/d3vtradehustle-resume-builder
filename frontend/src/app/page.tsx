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
                        {/* Logo */}
                        <div className="mb-8">
                            <img 
                                src="/resumeBuilderlogo.png?v=2" 
                                alt="Trade Hustle Resume Builder Logo" 
                                className="mx-auto w-32 h-32 md:w-48 md:h-48 object-contain"
                            />
                        </div>

                        {/* Logo/Title */}
                        <h1 className="font-heading text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-6">
                            TRADE HUSTLE
                        </h1>

                        {/* Subtitle */}
                        <h2 className="font-heading text-2xl md:text-4xl font-bold text-white mb-4">
                            Resume Builder
                        </h2>

                        {/* Description */}
                        <p className="font-body text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                            Built for the trades. Backed by hustle. Get the tools you need to land your next job.
                        </p>

                        {/* Two Funnel Cards */}
                        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">

                            {/* Card 1: Unlock the Hustle - Silver */}
                            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-8 border-2 border-gray-400/50 hover:border-gray-300/80 transition-all duration-300 w-full md:w-1/2 shadow-xl hover:shadow-gray-400/20 flex flex-col">
                                <div className="text-center flex-1 flex flex-col">
                                    <div className="text-5xl mb-4">🔓</div>
                                    <h3 className="font-heading text-2xl font-bold text-white mb-4">Unlock the Hustle</h3>
                                    <p className="font-body text-gray-300 mb-6 flex-1">
                                        Get your free Trade Hustle PDF and start your blueprint.
                                    </p>
                                    <div>
                                        <Link
                                        href="/free-pdf"
                                        onClick={() => handleFunnelClick('unlock-hustle')}
                                        className="btn-hustle inline-block w-full py-4 px-6 bg-gray-400 hover:bg-gray-300 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        Unlock Now →
                                    </Link>
                                    <p className="text-sm text-gray-400 mt-2">Free download • No signup required</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Craft Your Hustle - Gold */}
                            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-md rounded-2xl p-8 border-2 border-yellow-500/60 hover:border-yellow-400/80 transition-all duration-300 w-full md:w-1/2 shadow-xl hover:shadow-yellow-500/30 flex flex-col">
                                <div className="text-center flex-1 flex flex-col">
                                    <div className="text-5xl mb-4">🏗️</div>
                                    <h3 className="font-heading text-2xl font-bold text-white mb-4">Craft Your Hustle</h3>
                                    <p className="font-body text-gray-300 mb-6 flex-1">
                                        Build your resume with Enhanced Intelligence and get hired faster.
                                    </p>
                                    <div>
                                        <Link
                                        href="/resume-builder"
                                        onClick={() => handleFunnelClick('craft-hustle')}
                                        className="btn-hustle inline-block w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        Launch Builder →
                                    </Link>
                                    <p className="text-sm text-gray-400 mt-2">AI-powered • ATS-optimized</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Trust indicators */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl mb-2">⚡</div>
                                <p className="font-body text-sm text-gray-400">5-Minute Setup</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🎯</div>
                                <p className="font-body text-sm text-gray-400">ATS Optimized</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🔧</div>
                                <p className="font-body text-sm text-gray-400">Trade-Focused</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">💪</div>
                                <p className="font-body text-sm text-gray-400">Hustle Ready</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}