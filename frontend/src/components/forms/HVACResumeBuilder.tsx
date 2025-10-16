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

interface HVACResumeBuilderProps {
  userId?: string;
  onSave?: (data: Partial<ResumeFormData>) => Promise<void>;
  initialData?: Partial<ResumeFormData>;
}

export default function HVACResumeBuilder({ 
  userId, 
  onSave,
  initialData 
}: HVACResumeBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData || defaultFormValues,
    mode: 'onBlur',
  });

  const { handleSubmit, watch, formState: { errors }, trigger } = methods;

  // Auto-save with debounce (if userId and onSave provided)
  useEffect(() => {
    if (!userId || !onSave) return;

    const subscription = watch((data) => {
      const timer = setTimeout(async () => {
        setIsSaving(true);
        try {
          await onSave(data as ResumeFormData);
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }, 1500);

      return () => clearTimeout(timer);
    });

    return () => subscription.unsubscribe();
  }, [watch, userId, onSave]);

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  const nextStep = async () => {
    // Validate current step fields before proceeding
    const isValid = await trigger();
    
    if (isValid && currentStep < STEPS.length) {
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
    // Only allow navigation to completed or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  const onSubmit = async (data: ResumeFormData) => {
    console.log('Final resume data:', data);
    // Handle final submission / export
    if (onSave) {
      await onSave(data);
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
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-anton text-hustle-gold mb-2 tracking-wide">
                  TRADE HUSTLE RESUME BUILDER
                </h1>
                <p className="text-white/70 font-merriweather">
                  Build your professional HVAC resume in minutes
                </p>
              </div>

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
              <div className="bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg p-6 md:p-8 mb-6">
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
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4">
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
