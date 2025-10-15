'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';

export default function ResumeBuilderConfirmPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const purchaseEmail = localStorage.getItem('purchaseEmail');
    if (purchaseEmail) setEmail(purchaseEmail);
    
    trackCustomEvent('resume_confirm_view', {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center">
          <div className="text-6xl mb-6">✅</div>
          
          <h1 className="text-4xl font-bold text-white mb-6">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-gray-300 mb-4">
            Your professional resume has been created successfully.
          </p>
          
          {email && (
            <p className="text-gray-400 mb-8">
              Confirmation and files sent to: <span className="text-white font-semibold">{email}</span>
            </p>
          )}

          <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-300 mb-3">
              📦 Your Order Includes:
            </h3>
            <div className="text-left space-y-2 text-sm text-green-200">
              <div>• AI-generated professional resume</div>
              <div>• PDF and Word document formats</div>
              <div>• ATS-optimized content</div>
              <div>• Trade-specific customization</div>
              <div>• 30-day money-back guarantee</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              What happens next?
            </h3>
            <div className="text-sm text-gray-300 space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">1.</span>
                <div>
                  <strong>Download Your Resume</strong>
                  <br />Check your email for download links (PDF & Word formats)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">2.</span>
                <div>
                  <strong>Review & Customize</strong>
                  <br />Make any final tweaks to match your specific experience
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">3.</span>
                <div>
                  <strong>Start Applying</strong>
                  <br />Begin submitting to your target positions with confidence
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-8">
            <p className="text-blue-200 text-sm">
              <strong>💡 Pro Tip:</strong> Apply to jobs within 24 hours for the best results. 
              Hiring managers appreciate quick responses!
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all duration-300"
            >
              Back to Home
            </Link>
            
            <a 
              href="mailto:support@tradehustle.com"
              className="text-gray-400 hover:text-white text-sm"
            >
              Need help? Contact Support →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
