'use client';

import { TradeFormFactory } from '@/components/forms';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveResumeProgress } from '@/lib/resume-storage';
import { BaseResumeFormData } from '@/components/forms/schemas';
import { useRouter } from 'next/navigation';

/**
 * Client Component for Trade Resume Builder
 * Handles auth, loading states, and form rendering
 */
export default function TradeResumeBuilderClient({ trade }: { trade: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSave = async (data: Partial<BaseResumeFormData>) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      await saveResumeProgress(user.uid, data);
      console.log('Resume saved successfully!', data);
    } catch (error) {
      console.error('Failed to save resume:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-hustle-navy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-hustle-gold mx-auto mb-4"></div>
          <p className="text-white font-merriweather">Loading your resume builder...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-hustle-navy flex items-center justify-center p-4">
        <div className="bg-hustle-navy-dark border-2 border-hustle-gold rounded-lg p-8 max-w-md text-center">
          <h2 className="text-3xl font-anton text-hustle-gold mb-4">
            SIGN IN REQUIRED
          </h2>
          <p className="text-white/70 font-merriweather mb-6">
            You need to be signed in to use the resume builder.
          </p>
          <button
            onClick={() => router.push('/signin')}
            className="btn-hustle w-full"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Render trade-specific form
  return (
    <div className="min-h-screen bg-hustle-navy">
      <TradeFormFactory
        trade={trade}
        userId={user.uid}
        onSave={handleSave}
      />
    </div>
  );
}
