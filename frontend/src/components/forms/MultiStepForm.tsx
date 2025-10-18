"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Download, Save } from 'lucide-react';
import { resumeSchema, defaultFormValues, ResumeFormData } from './schema';
import { ProgressSidebar, MobileProgressBar } from './ProgressSidebar';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveResumeProgress, loadResumeProgress } from '@/lib/resume-storage';

// Lazy load form sections for better performance (ssr: false for code splitting)
const HeaderSection = dynamic(() => import('./HeaderSection').then(mod => ({ default: mod.HeaderSection })), {
  ssr: false,
  loading: () => <div className="text-center text-hustle-gold animate-pulse py-8">Loading section...</div>
});
const SummarySection = dynamic(() => import('./SummarySection').then(mod => ({ default: mod.SummarySection })), {
  ssr: false,
  loading: () => <div className="text-center text-hustle-gold animate-pulse py-8">Loading section...</div>
});
const CertificationsSection = dynamic(() => import('./CertificationsSection').then(mod => ({ default: mod.CertificationsSection })), {
  ssr: false,
  loading: () => <div className="text-center text-hustle-gold animate-pulse py-8">Loading section...</div>
});
const SkillsSection = dynamic(() => import('./SkillsSection').then(mod => ({ default: mod.SkillsSection })), {
  ssr: false,
  loading: () => <div className="text-center text-hustle-gold animate-pulse py-8">Loading section...</div>
});
const ExperienceSection = dynamic(() => import('./ExperienceSection').then(mod => ({ default: mod.ExperienceSection })), {
  ssr: false,
  loading: () => <div className="text-center text-hustle-gold animate-pulse py-8">Loading section...</div>
});
const EducationSection = dynamic(() => import('./EducationSection').then(mod => ({ default: mod.EducationSection })), {
  ssr: false,
  loading: () => <div className="text-center text-hustle-gold animate-pulse py-8">Loading section...</div>
});
const ReferencesSection = dynamic(() => import('./ReferencesSection').then(mod => ({ default: mod.ReferencesSection })), {
  ssr: false,
  loading: () => <div className="text-center text-hustle-gold animate-pulse py-8">Loading section...</div>
});
const ReviewSection = dynamic(() => import('./ReviewSection').then(mod => ({ default: mod.ReviewSection })), {
  ssr: false,
  loading: () => <div className="text-center text-hustle-gold animate-pulse py-8">Loading section...</div>
});

const STEPS = [
  { id: 1, label: 'Contact Info' },
  { id: 2, label: 'Summary' },
  { id: 3, label: 'Certifications' },
  { id: 4, label: 'Skills' },
  { id: 5, label: 'Experience' },
  { id: 6, label: 'Education' },
  { id: 7, label: 'References' },
  { id: 8, label: 'Review & Export' },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const methods = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultFormValues,
    mode: 'onBlur',
  });

  const { handleSubmit, watch, formState: { errors } } = methods;

  // Load saved progress on mount
  useEffect(() => {
    if (user) {
      loadResumeProgress(user.uid).then((savedData: Partial<ResumeFormData> | null) => {
        if (savedData) {
          methods.reset(savedData as ResumeFormData);
        }
      });
    }
  }, [user, methods]);

  // Auto-save with debounce
  useEffect(() => {
    if (!user) return;

    const subscription = watch((data) => {
      const timer = setTimeout(async () => {
        setIsSaving(true);
        try {
          await saveResumeProgress(user.uid, data as ResumeFormData);
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }, 1500);

      return () => clearTimeout(timer);
    });

    return () => subscription.unsubscribe();
  }, [watch, user]);

  // Render the current step component dynamically
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <HeaderSection />;
      case 2: return <SummarySection />;
      case 3: return <CertificationsSection />;
      case 4: return <SkillsSection />;
      case 5: return <ExperienceSection />;
      case 6: return <EducationSection />;
      case 7: return <ReferencesSection />;
      case 8: return <ReviewSection />;
      default: return <HeaderSection />;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: ResumeFormData) => {
    console.log('Final resume data:', data);
    // Handle final submission / export
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    const data = watch();
    try {
      const response = await fetch('/api/exportResume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          resumeData: data,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.name || 'resume'}-hvac-resume.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Calculate step completion
  const stepsWithCompletion = STEPS.map(step => ({
    ...step,
    isComplete: step.id < currentStep,
  }));

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <ProgressSidebar
            currentStep={currentStep}
            steps={stepsWithCompletion}
            onStepClick={goToStep}
          />

          {/* Main Content */}
          <main className="flex-1 bg-hustle-navy min-h-screen p-6 md:p-12 pb-24 md:pb-12">
            <div className="max-w-3xl mx-auto">
              {/* Auto-save Indicator */}
              {isSaving && (
                  <div
className="mb-4 flex items-center gap-2 text-hustle-gold text-sm font-merriweather"
                  >
                    <Save className="w-4 h-4 animate-pulse" />
                    Saving progress...
                  </div>
                )}

              {/* Step Content */}
              <div
                  key={currentStep}
>
                  {renderCurrentStep()}
                </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-hustle-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>

                <div className="flex-1 text-center">
                  <span className="text-white/50 font-merriweather text-sm">
                    Step {currentStep} of {STEPS.length}
                  </span>
                </div>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-hustle flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleExport('pdf')}
                      className="btn-hustle flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport('docx')}
                      className="btn-hustle-secondary flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Word
                    </button>
                  </div>
                )}
              </div>

              {/* Error Summary */}
              {Object.keys(errors).length > 0 && (
                <div
className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <p className="text-red-500 font-merriweather text-sm">
                    Please fix the errors above before continuing
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Mobile Progress Bar */}
        <MobileProgressBar currentStep={currentStep} totalSteps={STEPS.length} />
      </form>
    </FormProvider>
  );
}
