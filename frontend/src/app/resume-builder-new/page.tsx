/**
 * Resume Builder Page - Hustle Theme
 * Integrates the multi-step HVAC resume builder with Hustle branding
 */

"use client";

import HVACResumeBuilder from '@/components/forms/HVACResumeBuilder';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveResumeProgress, loadResumeProgress } from '@/lib/resume-storage';
import { ResumeFormData } from '@/components/forms/schema';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ResumeBuilderPage() {
  const { user, loading } = useAuth();
  const [initialData, setInitialData] = useState<Partial<ResumeFormData> | undefined>();
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load saved progress when user is available
  useEffect(() => {
    async function loadData() {
      if (user) {
        const savedData = await loadResumeProgress(user.uid);
        if (savedData) {
          setInitialData(savedData);
        }
        setDataLoaded(true);
      }
    }
    
    if (!loading) {
      loadData();
    }
  }, [user, loading]);

  const handleSave = async (data: Partial<ResumeFormData>) => {
    if (user) {
      await saveResumeProgress(user.uid, data);
    }
  };

  // Show loading state while checking auth
  if (loading || !dataLoaded) {
    return (
      <div className="min-h-screen bg-hustle-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-hustle-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-hustle-gold font-merriweather">Loading your resume...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show sign-in prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-hustle-navy flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-anton text-hustle-gold mb-4">
            SIGN IN REQUIRED
          </h2>
          <p className="text-white/70 font-merriweather mb-6">
            Please sign in to save your progress and build your resume.
          </p>
          <div className="space-y-3">
            <Link href="/unlock" className="btn-hustle w-full block">
              Sign In / Sign Up
            </Link>
            <Link href="/" className="btn-hustle-secondary w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hustle-navy">
      {/* Back to Dashboard Link */}
      <div className="bg-hustle-navy-dark border-b border-hustle-gold/20 p-4">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/dashboard" 
            className="text-hustle-gold hover:text-yellow-500 font-merriweather flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Resume Builder */}
      <HVACResumeBuilder 
        userId={user.uid}
        onSave={handleSave}
        initialData={initialData}
      />
    </div>
  );
}
