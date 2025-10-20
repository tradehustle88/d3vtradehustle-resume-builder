"use client";

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Sparkles, Info } from 'lucide-react';
import { ResumeFormData } from './schema';
import { AI_PROMPTS, FIELD_TOOLTIPS } from './ai-prompts';

export const SummarySection: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ResumeFormData>();

  const [isGenerating, setIsGenerating] = useState(false);
  const summary = watch('summary');
  const name = watch('name');
  const tradeTitle = watch('tradeTitle');
  const certifications = watch('certifications') || [];

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = AI_PROMPTS.summary({
        name: name || 'the candidate',
        tradeTitle: tradeTitle || 'HVAC Technician',
        certifications: certifications.map(c => c.name),
      });

      const response = await fetch('/api/editResume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          resumeContent: summary,
        }),
      });

      const data = await response.json();
      if (data.success && data.message) {
        setValue('summary', data.message, { shouldValidate: true });
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-anton text-hustle-gold mb-2">
          PROFESSIONAL SUMMARY
        </h2>
        <p className="text-white/70 font-merriweather">
          A powerful snapshot of your experience and expertise. Keep it punchy.
        </p>
      </div>

      <div>
        <div className="flex items-start justify-between mb-2">
          <label htmlFor="summary" className="flex items-center gap-2 text-hustle-gold font-merriweather">
            Summary
            <button
              type="button"
              className="group relative"
              aria-label="Summary tooltip"
            >
              <Info className="w-4 h-4 text-hustle-gold/60 hover:text-hustle-gold" />
              <span className="absolute left-6 top-0 w-64 bg-hustle-navy-dark border border-hustle-gold/30 rounded p-2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {FIELD_TOOLTIPS.summary}
              </span>
            </button>
          </label>

          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={isGenerating || !name}
            className="btn-hustle-secondary text-sm px-3 py-1.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Generate summary with AI"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'AI Generate'}
          </button>
        </div>

        <textarea
          id="summary"
          {...register('summary')}
          className="w-full px-4 py-3 bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all resize-none"
          rows={5}
          placeholder="Experienced HVAC technician with 8+ years of hands-on expertise in residential and commercial systems. Certified in EPA 608 and NATE, with a proven track record of reducing energy costs by 25% through preventive maintenance programs..."
          aria-label="Professional Summary"
          maxLength={500}
        />

        <div className="flex justify-between items-center mt-1">
          <div>
            {errors.summary && (
              <p
className="text-red-500 text-sm font-merriweather"
              >
                {errors.summary.message}
              </p>
            )}
          </div>
          <span className="text-white/50 text-sm font-merriweather">
            {summary?.length || 0} / 500
          </span>
        </div>
      </div>
    </div>
  );
};
