"use client";

import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Save } from 'lucide-react';
import { resumeSchema, defaultFormValues, ResumeFormData } from './schema';
import { ProgressSidebar, MobileProgressBar } from './ProgressSidebar';
import { HeaderSection } from './HeaderSection';
import { SummarySection } from './SummarySection';
import { CertificationsSection } from './CertificationsSection';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { ReferencesSection } from './ReferencesSection';
import { ReviewSection } from './ReviewSection';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveResumeProgress, loadResumeProgress } from '@/lib/resume-storage';

const STEPS = [
  { id: 1, label: 'Contact Info', component: HeaderSection },
  { id: 2, label: 'Summary', component: SummarySection },
  { id: 3, label: 'Certifications', component: CertificationsSection },
  { id: 4, label: 'Skills', component: SkillsSection },
  { id: 5, label: 'Experience', component: ExperienceSection },
  { id: 6, label: 'Education', component: EducationSection },
  { id: 7, label: 'References', component: ReferencesSection },
  { id: 8, label: 'Review & Export', component: ReviewSection },
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

  const CurrentStepComponent = STEPS[currentStep - 1].component;

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
              <AnimatePresence>
                {isSaving && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 flex items-center gap-2 text-hustle-gold text-sm font-merriweather"
                  >
                    <Save className="w-4 h-4 animate-pulse" />
                    Saving progress...
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentStepComponent />
                </motion.div>
              </AnimatePresence>

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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <p className="text-red-500 font-merriweather text-sm">
                    Please fix the errors above before continuing
                  </p>
                </motion.div>
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
