'use client';

import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

export default function ResumeBuilderPage() {

    const handleGetStartedClick = () => {
        trackCustomEvent('resume_builder_start', {});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Back link */}
                <div className="mb-8">
                    <Link href="/" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2">
                        ← Back to Home
                    </Link>
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        AI Resume Builder
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Create a professional, ATS-optimized resume tailored to your specific trade in just 5 minutes.
                    </p>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 inline-block">
                        <p className="text-yellow-300">
                            <strong>🚀 Special Launch Offer:</strong> $47 → $23 (Save 51%)
                        </p>
                    </div>
                </div>

                {/* How it Works */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔧</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">1. Choose Your Trade</h3>
                            <p className="text-gray-400 text-sm">Select from 15+ specialized trade categories</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎨</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">2. Pick Template</h3>
                            <p className="text-gray-400 text-sm">Professional designs that beat ATS systems</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">3. AI Magic</h3>
                            <p className="text-gray-400 text-sm">AI writes compelling content for your experience</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📥</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">4. Download</h3>
                            <p className="text-gray-400 text-sm">Get your polished resume in PDF format</p>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-8">What You Get</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-400 text-sm">✓</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">AI-Powered Content Generation</h3>
                                    <p className="text-gray-400">Let AI write compelling bullet points and descriptions based on your experience</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-400 text-sm">✓</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">ATS-Optimized Templates</h3>
                                    <p className="text-gray-400">Beat applicant tracking systems that filter out 75% of resumes</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-400 text-sm">✓</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Trade-Specific Expertise</h3>
                                    <p className="text-gray-400">Templates and content tailored for HVAC, electrical, plumbing, and more</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-400 text-sm">✓</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Multiple Format Options</h3>
                                    <p className="text-gray-400">Download as PDF, Word doc, or get a shareable link</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-400 text-sm">✓</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Instant Results</h3>
                                    <p className="text-gray-400">Complete professional resume ready in 5 minutes or less</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                            <p className="text-gray-300 mb-6">Join hundreds of trade professionals who've already landed better jobs</p>

                            <div className="bg-red-600/20 rounded-lg p-4 mb-6">
                                <div className="text-3xl font-bold text-white mb-2">$23</div>
                                <div className="text-sm text-gray-400 line-through">Regular: $47</div>
                                <div className="text-yellow-400 font-semibold">Save 51% Today</div>
                            </div>

                            <Link
                                href="/resume-builder/trade"
                                onClick={handleGetStartedClick}
                                className="block w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 mb-4"
                            >
                                🚀 Start Building My Resume
                            </Link>

                            <p className="text-xs text-gray-400">
                                30-day money-back guarantee
                            </p>
                        </div>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="bg-white/5 rounded-xl p-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-6">Trusted by Trade Professionals</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400 mb-1">500+</div>
                            <p className="text-sm text-gray-400">Resumes Created</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400 mb-1">87%</div>
                            <p className="text-sm text-gray-400">Get More Interviews</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400 mb-1">4.9/5</div>
                            <p className="text-sm text-gray-400">Average Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
