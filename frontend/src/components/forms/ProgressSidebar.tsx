"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressSidebarProps {
  currentStep: number;
  steps: {
    id: number;
    label: string;
    isComplete: boolean;
  }[];
  onStepClick?: (stepId: number) => void;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  return (
    <aside className="bg-gradient-to-b from-hustle-navy to-hustle-navy-dark p-6 min-h-screen hidden md:block">
      <div className="sticky top-6">
        <h2 className="text-hustle-gold font-anton text-2xl mb-8 tracking-wide">
          YOUR RESUME
        </h2>
        
        <nav aria-label="Resume building progress">
          <ol className="space-y-4">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              const isClickable = onStepClick && (isPast || step.isComplete);

              return (
                <li key={step.id}>
                  <motion.button
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                    className={`
                      flex items-start gap-3 w-full text-left p-3 rounded-lg transition-all
                      ${isActive ? 'bg-hustle-gold/10 border-l-4 border-hustle-gold' : ''}
                      ${isPast ? 'opacity-70 hover:opacity-100' : ''}
                      ${isClickable ? 'cursor-pointer hover:bg-hustle-gold/5' : 'cursor-default'}
                    `}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Step Indicator */}
                    <div className="flex-shrink-0 mt-0.5">
                      {step.isComplete ? (
                        <CheckCircle2 className="w-6 h-6 text-hustle-gold" />
                      ) : isActive ? (
                        <motion.div
                          className="w-6 h-6 rounded-full border-2 border-hustle-gold bg-hustle-gold/20"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-500" />
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="flex-1">
                      <div className="text-xs text-hustle-gold/60 font-merriweather mb-1">
                        Step {step.id}
                      </div>
                      <div className={`
                        font-merriweather text-sm
                        ${isActive ? 'text-hustle-gold font-bold' : 'text-white'}
                        ${isPast && !isActive ? 'text-gray-400' : ''}
                      `}>
                        {step.label}
                      </div>
                    </div>
                  </motion.button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Progress Bar */}
        <div className="mt-8 pt-6 border-t border-hustle-gold/20">
          <div className="text-xs text-hustle-gold/60 font-merriweather mb-2">
            Overall Progress
          </div>
          <div className="w-full bg-hustle-navy-dark rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-hustle-gold to-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="text-xs text-white/80 font-merriweather mt-2 text-right">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </div>
        </div>
      </div>
    </aside>
  );
};

/**
 * Mobile Progress Bar (sticky footer)
 */
export const MobileProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-hustle-navy border-t-2 border-hustle-gold/20 p-4 z-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-hustle-gold/60 font-merriweather">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-white/80 font-merriweather">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-hustle-navy-dark rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-hustle-gold to-yellow-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
