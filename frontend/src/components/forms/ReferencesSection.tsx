"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Users, Info } from 'lucide-react';
import { ResumeFormData } from './schema';
import { FIELD_TOOLTIPS } from './ai-prompts';

export const ReferencesSection: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<ResumeFormData>();

  const references = watch('references');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-anton text-hustle-gold mb-2">
          REFERENCES
        </h2>
        <p className="text-white/70 font-merriweather">
          Optional. You can list contacts here or simply write "Available upon request."
        </p>
      </div>

      <div>
        <div className="flex items-start justify-between mb-2">
          <label htmlFor="references" className="flex items-center gap-2 text-hustle-gold font-merriweather">
            <Users className="w-4 h-4" />
            References
            <button
              type="button"
              className="group relative"
              aria-label="References tooltip"
            >
              <Info className="w-4 h-4 text-hustle-gold/60 hover:text-hustle-gold" />
              <span className="absolute left-6 top-0 w-64 bg-hustle-navy-dark border border-hustle-gold/30 rounded p-2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {FIELD_TOOLTIPS.references}
              </span>
            </button>
          </label>
        </div>

        <textarea
          id="references"
          {...register('references')}
          className="w-full px-4 py-3 bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all resize-none"
          rows={6}
          placeholder={`Available upon request

Or list 2-3 professional references:

John Smith, Senior HVAC Technician
Cool Air HVAC | (555) 123-4567
john.smith@coolairhvac.com`}
          aria-label="References"
          maxLength={300}
        />

        <div className="flex justify-between items-center mt-1">
          <div>
            {errors.references && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-sm font-merriweather"
              >
                {errors.references.message}
              </motion.p>
            )}
          </div>
          <span className="text-white/50 text-sm font-merriweather">
            {references?.length || 0} / 300
          </span>
        </div>
      </div>

      {/* Quick Fill Buttons */}
      <div className="bg-hustle-navy-dark border border-hustle-gold/20 rounded-lg p-4">
        <p className="text-white/70 font-merriweather text-sm mb-3">
          Quick Options:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const { setValue } = useFormContext<ResumeFormData>();
              setValue('references', 'Available upon request', { shouldValidate: true });
            }}
            className="px-3 py-2 bg-hustle-gold/10 border border-hustle-gold/30 rounded text-hustle-gold text-sm font-merriweather hover:bg-hustle-gold/20 transition-colors"
          >
            "Available upon request"
          </button>
          <button
            type="button"
            onClick={() => {
              const { setValue } = useFormContext<ResumeFormData>();
              setValue('references', 'Professional references available upon request', { shouldValidate: true });
            }}
            className="px-3 py-2 bg-hustle-gold/10 border border-hustle-gold/30 rounded text-hustle-gold text-sm font-merriweather hover:bg-hustle-gold/20 transition-colors"
          >
            "Professional references available upon request"
          </button>
        </div>
      </div>
    </motion.div>
  );
};
