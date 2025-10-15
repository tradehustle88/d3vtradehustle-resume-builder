'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

export default function FreePdfThankYouPage() {

    useEffect(() => {
        // Track conversion
        trackCustomEvent('free_pdf_download', {});

        // Auto-download after a short delay
        const timer = setTimeout(() => {
            // Trigger PDF download
            window.location.href = '/resume-kit.pdf';
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleUpsellClick = () => {
        trackCustomEvent('upsell_click', { from: 'free-pdf-thankyou' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                <div className="text-center">
                    {/* Success Message */}
                    <div className="mb-12">
                        <div className="text-8xl mb-6">🎉</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Check Your Email!
                        </h1>
                        <p className="text-xl text-gray-300 mb-4">
                            Your free resume kit is on its way to your inbox.
                        </p>
                        <p className="text-gray-400">
                            Your download should start automatically. If it doesn't,
                            <a href="/resume-kit.pdf" className="text-yellow-400 hover:text-yellow-300 underline ml-1">
                                click here
                            </a>.
                        </p>
                    </div>

                    {/* Upsell Section */}
                    <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 mb-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Want Something Even Better?
                            </h2>
                            <p className="text-xl text-gray-300 mb-6">
                                Skip the manual work and let AI create your perfect resume in minutes.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">🤖</div>
                                    <h3 className="font-semibold text-white mb-1">AI-Powered</h3>
                                    <p className="text-sm text-gray-400">Smart content generation</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl mb-2">🎯</div>
                                    <h3 className="font-semibold text-white mb-1">ATS-Optimized</h3>
                                    <p className="text-sm text-gray-400">Beats applicant tracking systems</p>
                                </div>
                            </div>

                            <Link
                                href="/resume-builder"
                                onClick={handleUpsellClick}
                                className="inline-block py-4 px-8 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                🚀 Try AI Resume Builder
                            </Link>

                            <p className="text-sm text-gray-400 mt-4">
                                Special offer: 50% off for the next 24 hours
                            </p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-4">What's Next?</h3>
                        <div className="text-left max-w-2xl mx-auto space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="text-yellow-400 font-bold">1.</span>
                                <p className="text-gray-300">Download and review the templates in your email</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-yellow-400 font-bold">2.</span>
                                <p className="text-gray-300">Choose the template that best fits your trade</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-yellow-400 font-bold">3.</span>
                                <p className="text-gray-300">Follow the editing guide to customize your resume</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-yellow-400 font-bold">4.</span>
                                <p className="text-gray-300">Start applying and land that next job!</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Link href="/" className="text-gray-400 hover:text-white">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
