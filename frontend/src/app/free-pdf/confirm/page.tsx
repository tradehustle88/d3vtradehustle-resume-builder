'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

export default function FreePdfConfirmPage() {

  useEffect(() => {
    // Track confirmation page visit
    trackCustomEvent('free_pdf_confirm_view', {});
  }, []);

  const handleUpsellClick = () => {
    trackCustomEvent('upsell_click', { from: 'free-pdf-confirm' });
  };

  const handleSocialShare = (platform: string) => {
    trackCustomEvent('social_share', { platform, from: 'free-pdf-confirm' });

    const shareText = "Just got a free resume kit for trade professionals! 🔧";
    const shareUrl = window.location.origin;

    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center">
          {/* Success Message */}
          <div className="mb-12">
            <div className="text-8xl mb-6">✅</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              You're All Set!
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Your free resume kit has been sent to your email and should be downloading now.
            </p>
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 inline-block">
              <p className="text-green-300">
                📧 Check your inbox (and spam folder) for your resume kit!
              </p>
            </div>
          </div>

          {/* Download Backup */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Download Not Started?
            </h2>
            <p className="text-gray-300 mb-6">
              If your download didn't start automatically, click below:
            </p>
            <a
              href="/resume-kit.pdf"
              className="inline-block py-3 px-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              📥 Download Resume Kit
            </a>
          </div>

          {/* Premium Upsell */}
          <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 mb-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Take It to the Next Level?
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Skip the manual work and let AI create your perfect resume in 5 minutes.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">🤖</div>
                  <h3 className="font-semibold text-white mb-1">AI-Powered Content</h3>
                  <p className="text-sm text-gray-400">Professional descriptions written for you</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <h3 className="font-semibold text-white mb-1">5-Minute Setup</h3>
                  <p className="text-sm text-gray-400">Complete resume ready instantly</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="font-semibold text-white mb-1">ATS-Optimized</h3>
                  <p className="text-sm text-gray-400">Designed to beat applicant tracking systems</p>
                </div>
              </div>

              <div className="bg-red-600/20 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-white mb-2">$23</div>
                <div className="text-sm text-gray-400 line-through">Regular: $47</div>
                <div className="text-yellow-400 font-semibold">Save 51% - Limited Time</div>
              </div>

              <Link
                href="/resume-builder"
                onClick={handleUpsellClick}
                className="inline-block py-4 px-8 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                🚀 Upgrade to AI Resume Builder
              </Link>

              <p className="text-sm text-gray-400 mt-4">
                30-day money-back guarantee • Used by 500+ trade professionals
              </p>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Spread the Word!
            </h3>
            <p className="text-gray-300 mb-4">
              Help other trade professionals by sharing this free resource:
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleSocialShare('twitter')}
                className="py-2 px-4 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors"
              >
                🐦 Twitter
              </button>
              <button
                onClick={() => handleSocialShare('facebook')}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                📘 Facebook
              </button>
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="py-2 px-4 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                💼 LinkedIn
              </button>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">What's Next?</h3>
            <div className="text-left max-w-2xl mx-auto space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">1.</span>
                <p className="text-gray-300">Check your email for the download link and bonus materials</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">2.</span>
                <p className="text-gray-300">Choose the template that matches your trade and experience level</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">3.</span>
                <p className="text-gray-300">Follow the step-by-step editing guide to customize your resume</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">4.</span>
                <p className="text-gray-300">Start applying and watch your interview rate improve!</p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Questions? We're here to help!
            </p>
            <div className="space-x-6">
              <a
                href="mailto:support@tradehustleresume.com"
                className="text-yellow-400 hover:text-yellow-300 underline"
              >
                📧 Get Support
              </a>
              <Link
                href="/"
                className="text-gray-400 hover:text-white"
              >
                🏠 Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
