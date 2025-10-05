'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trackResumeDownload } from "@/lib/analytics";

export default function DashboardPage() {
    const [resumeContent, setResumeContent] = useState('');
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiResult, setAiResult] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { user, loading, signOut, getIdToken } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    const handleAiEdit = async () => {
        if (!aiPrompt.trim()) {
            alert('Please enter a prompt for AI editing');
            return;
        }

        try {
            setIsProcessing(true);
            const idToken = await getIdToken();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/editResume`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    prompt: `${aiPrompt}\n\nCurrent resume content: ${resumeContent}`,
                    company: '' // honeypot
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.success) {
                setAiResult(data.result);
            } else {
                throw new Error(data.error || 'AI editing failed');
            }
        } catch (error) {
            console.error('AI edit error:', error);
            alert(`AI editing failed: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const handleDownload = (filename: string) => {
        const link = document.createElement('a');
        link.href = `/${filename}`;
        link.download = filename;
        link.click();
        trackResumeDownload();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to auth page
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
            {/* Header */}
            <div className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="hero-title text-2xl font-bold text-yellow-400">
                            Trade Hustle Dashboard
                        </h1>
                        <p className="text-gray-300 text-sm">
                            Welcome back, {user.displayName || user.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                            Home
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Resume Downloads */}
                <div className="brick-block p-6">
                    <h2 className="text-2xl font-bold text-yellow-300 mb-6">
                        📦 Your Resume Kit
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                            <h3 className="font-bold text-white mb-2">Complete Resume Kit</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                All templates, samples, and guides in one package
                            </p>
                            <button
                                onClick={() => handleDownload('resume-kit.pdf')}
                                className="btn-hustle w-full text-sm"
                            >
                                Download PDF Kit
                            </button>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                            <h3 className="font-bold text-white mb-2">Resume Templates</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Word templates ready for customization
                            </p>
                            <Link
                                href="/resume/1_Resume_Templates"
                                className="btn-hustle w-full text-sm inline-block text-center"
                            >
                                Browse Templates
                            </Link>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                            <h3 className="font-bold text-white mb-2">Sample Resumes</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Real examples from successful professionals
                            </p>
                            <Link
                                href="/resume/2_Sample_Resume"
                                className="btn-hustle w-full text-sm inline-block text-center"
                            >
                                View Samples
                            </Link>
                        </div>
                    </div>
                </div>

                {/* AI Resume Editor */}
                <div className="brick-block p-6">
                    <h2 className="text-2xl font-bold text-yellow-300 mb-6">
                        🤖 AI Resume Editor
                    </h2>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="resume-content" className="block text-white font-medium mb-2">
                                Your Resume Content
                            </label>
                            <textarea
                                id="resume-content"
                                value={resumeContent}
                                onChange={(e) => setResumeContent(e.target.value)}
                                placeholder="Paste your resume content here..."
                                className="w-full h-40 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="ai-prompt" className="block text-white font-medium mb-2">
                                AI Editing Instructions
                            </label>
                            <textarea
                                id="ai-prompt"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="e.g., 'Make this sound more professional' or 'Add more action verbs'"
                                className="w-full h-32 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none mb-4"
                            />
                            <button
                                onClick={handleAiEdit}
                                disabled={isProcessing}
                                className="btn-hustle w-full"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    '✨ Improve with AI'
                                )}
                            </button>
                        </div>
                    </div>

                    {aiResult && (
                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-green-400 mb-3">AI Enhanced Version:</h3>
                            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                                <pre className="text-gray-200 whitespace-pre-wrap font-mono text-sm">
                                    {aiResult}
                                </pre>
                            </div>
                            <button
                                onClick={() => setResumeContent(aiResult)}
                                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Use This Version
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="brick-block p-6">
                    <h2 className="text-2xl font-bold text-yellow-300 mb-6">
                        🚀 Quick Actions
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/unlock"
                            className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">🔓</div>
                            <h3 className="font-bold text-white">Unlock Resume</h3>
                            <p className="text-gray-300 text-sm">Get your complete kit</p>
                        </Link>
                        <a
                            href="mailto:support@tradehustle.com"
                            className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">📧</div>
                            <h3 className="font-bold text-white">Get Support</h3>
                            <p className="text-gray-300 text-sm">Contact our team</p>
                        </a>
                        <Link
                            href="/career-tips"
                            className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">💡</div>
                            <h3 className="font-bold text-white">Career Tips</h3>
                            <p className="text-gray-300 text-sm">Expert advice</p>
                        </Link>
                        <a
                            href="https://tradehustle.com/blog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">📖</div>
                            <h3 className="font-bold text-white">Blog</h3>
                            <p className="text-gray-300 text-sm">Latest insights</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}