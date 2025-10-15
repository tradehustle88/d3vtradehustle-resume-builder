'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

export default function FreePdfPage() {
    const [email, setEmail] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Honeypot check
        if (honeypot) {
            setError('Invalid request');
            return;
        }

        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Track conversion
            trackCustomEvent('free_pdf_signup', { email });

            // TODO: Call API to save email and send PDF
            // For now, redirect to thank you page
            window.location.href = '/free-pdf/thankyou';

        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Back link */}
                <div className="mb-8">
                    <Link href="/" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2">
                        ← Back to Home
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Value Proposition */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Get Your Free <span className="text-yellow-400">Resume Kit</span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-8">
                            Everything you need to create a professional resume that gets you hired in the trades.
                        </p>

                        {/* What's included */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">📄</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Professional Templates</h3>
                                    <p className="text-gray-400">5 ATS-optimized resume templates for different trades</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="text-2xl">💼</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Real Examples</h3>
                                    <p className="text-gray-400">Sample resumes from successful trade professionals</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✍️</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Cover Letters</h3>
                                    <p className="text-gray-400">Templates and examples that get responses</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="text-2xl">📚</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Step-by-Step Guide</h3>
                                    <p className="text-gray-400">Complete instructions for customization</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <p className="text-yellow-300 text-sm">
                                <strong>🔥 Limited Time:</strong> Normally $47, get it free today!
                            </p>
                        </div>
                    </div>

                    {/* Right: Email Capture Form */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Download Your Free Kit
                            </h2>
                            <p className="text-gray-300">
                                Enter your email to get instant access
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Honeypot field */}
                            <input
                                type="text"
                                name="company"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                                style={{ display: 'none' }}
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                            />

                            <div>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>📥 Get My Free Resume Kit</>
                                )}
                            </button>

                            {error && (
                                <div className="text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="text-xs text-gray-400 text-center">
                                We respect your privacy. Unsubscribe at any time.
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
