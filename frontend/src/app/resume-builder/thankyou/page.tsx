'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

export default function ThankYouPage() {
  const [email, setEmail] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    // Get purchase info
    const purchaseEmail = localStorage.getItem('purchaseEmail') || '';
    const paymentSuccess = localStorage.getItem('paymentSuccess');

    if (!paymentSuccess) {
      // Redirect to checkout if no valid purchase
      window.location.href = '/resume-builder/checkout';
      return;
    }

    setEmail(purchaseEmail);

    // Track successful purchase
    trackCustomEvent('resume_purchased', { email: purchaseEmail });

    // Auto-start download after a short delay
    const downloadTimer = setTimeout(() => {
      startDownload();
    }, 2000);

    return () => clearTimeout(downloadTimer);
  }, []);

  const startDownload = async () => {
    setDownloading(true);

    try {
      // Track download start
      trackCustomEvent('resume_download_started', { email });

      // TODO: Generate and download the actual resume
      // const resumeData = localStorage.getItem('resumeData');
      // const selectedTemplate = localStorage.getItem('selectedTemplate');
      // const downloadUrl = await generateResumeDownload(resumeData, selectedTemplate);

      // Mock download generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Trigger download (replace with actual download URL)
      const link = document.createElement('a');
      link.href = '/resume-kit.pdf'; // Replace with generated resume URL
      link.download = 'My_Professional_Resume.pdf';
      link.click();

      setDownloading(false);
      setDownloadComplete(true);

      // Track successful download
      trackCustomEvent('resume_download_completed', { email });

    } catch (error) {
      console.error('Download error:', error);
      setDownloading(false);
    }
  };

  const handleManualDownload = () => {
    trackCustomEvent('manual_download_click', { email });
    startDownload();
  };

  const handleUpsellClick = (product: string) => {
    trackCustomEvent('upsell_click', {
      from: 'resume-thankyou',
      product,
      email
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center">
          {/* Success Message */}
          <div className="mb-12">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Thank You for Your Purchase!
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Your professional resume is ready for download.
            </p>
            {email && (
              <p className="text-gray-400">
                A receipt has been sent to <span className="text-yellow-400">{email}</span>
              </p>
            )}
          </div>

          {/* Download Status */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            {downloading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Generating Your Resume...
                </h3>
                <p className="text-gray-300">
                  Please wait while we create your personalized, ATS-optimized resume.
                </p>
              </div>
            )}

            {downloadComplete && (
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Download Complete!
                </h3>
                <p className="text-gray-300 mb-6">
                  Your resume has been downloaded. Check your Downloads folder.
                </p>
                <button
                  onClick={handleManualDownload}
                  className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300"
                >
                  📥 Download Again
                </button>
              </div>
            )}

            {!downloading && !downloadComplete && (
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Download
                </h3>
                <p className="text-gray-300 mb-6">
                  Your resume should download automatically. If it doesn't, click below.
                </p>
                <button
                  onClick={handleManualDownload}
                  className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  📥 Download My Resume
                </button>
              </div>
            )}
          </div>

          {/* Upsell Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">

            {/* Cover Letter Upsell */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
              <div className="text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Need a Cover Letter?
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Complete your job application with a matching, professional cover letter.
                </p>
                <div className="text-2xl font-bold text-purple-300 mb-2">$12</div>
                <button
                  onClick={() => handleUpsellClick('cover-letter')}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all duration-300"
                >
                  Add Cover Letter
                </button>
              </div>
            </div>

            {/* Interview Prep Upsell */}
            <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Interview Prep Guide
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  50+ common trade interview questions with expert answers.
                </p>
                <div className="text-2xl font-bold text-green-300 mb-2">$18</div>
                <button
                  onClick={() => handleUpsellClick('interview-prep')}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all duration-300"
                >
                  Get Interview Guide
                </button>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">What's Next?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">👀</div>
                <h4 className="font-semibold text-white mb-1">Review Your Resume</h4>
                <p className="text-gray-400 text-sm">Double-check all information and make any final edits</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h4 className="font-semibold text-white mb-1">Start Applying</h4>
                <p className="text-gray-400 text-sm">Upload to job boards and start getting interviews</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <h4 className="font-semibold text-white mb-1">Track Results</h4>
                <p className="text-gray-400 text-sm">Monitor your application response rates</p>
              </div>
            </div>
          </div>

          {/* Satisfaction Guarantee */}
          <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <span className="text-yellow-400 text-2xl">🛡️</span>
              <div>
                <h4 className="text-yellow-300 font-semibold">30-Day Money-Back Guarantee</h4>
                <p className="text-yellow-200 text-sm">
                  Not satisfied? Email us for a full refund within 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Need help or have questions? We're here for you.
            </p>
            <div className="space-x-6">
              <a
                href="mailto:support@tradehustleresume.com"
                className="text-yellow-400 hover:text-yellow-300 underline"
              >
                📧 Email Support
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
