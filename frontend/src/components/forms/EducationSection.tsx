"use client";

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { ResumeFormData } from './schema';

export const EducationSection: React.FC = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const handleAddEducation = () => {
    append({
      school: '',
      degree: '',
      field: '',
      year: undefined,
      gpa: '',
    });
  };

  return (
    <div
className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-anton text-hustle-gold mb-2">
          EDUCATION & TRAINING
        </h2>
        <p className="text-white/70 font-merriweather">
          Include formal education, trade schools, apprenticeships, or relevant training programs.
        </p>
      </div>

      {fields.map((field, index) => (
          <div
            key={field.id}
className="bg-hustle-navy-dark border-2 border-hustle-gold/20 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-hustle-gold font-merriweather">
                <GraduationCap className="w-5 h-5" />
                <span>Education {index + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-400 transition-colors"
                aria-label={`Remove education ${index + 1}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* School Name */}
              <div>
                <label htmlFor={`education.${index}.school`} className="block text-white/70 font-merriweather text-sm mb-1">
                  School / Institution <span className="text-red-500">*</span>
                </label>
                <input
                  id={`education.${index}.school`}
                  type="text"
                  {...register(`education.${index}.school`)}
                  className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                  placeholder="Phoenix Technical College"
                />
                {errors.education?.[index]?.school && (
                  <p className="text-red-500 text-sm mt-1 font-merriweather">
                    {errors.education[index]?.school?.message}
                  </p>
                )}
              </div>

              {/* Degree & Field */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`education.${index}.degree`} className="block text-white/70 font-merriweather text-sm mb-1">
                    Degree / Certificate
                  </label>
                  <input
                    id={`education.${index}.degree`}
                    type="text"
                    {...register(`education.${index}.degree`)}
                    className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                    placeholder="Certificate, Associate's, etc."
                  />
                </div>

                <div>
                  <label htmlFor={`education.${index}.field`} className="block text-white/70 font-merriweather text-sm mb-1">
                    Field of Study
                  </label>
                  <input
                    id={`education.${index}.field`}
                    type="text"
                    {...register(`education.${index}.field`)}
                    className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                    placeholder="HVAC/R Technology"
                  />
                </div>
              </div>

              {/* Year & GPA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`education.${index}.year`} className="block text-white/70 font-merriweather text-sm mb-1">
                    Graduation Year
                  </label>
                  <input
                    id={`education.${index}.year`}
                    type="number"
                    {...register(`education.${index}.year`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                    placeholder="2024"
                    min="1950"
                    max="2100"
                  />
                </div>

                <div>
                  <label htmlFor={`education.${index}.gpa`} className="block text-white/70 font-merriweather text-sm mb-1">
                    GPA (optional)
                  </label>
                  <input
                    id={`education.${index}.gpa`}
                    type="text"
                    {...register(`education.${index}.gpa`)}
                    className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                    placeholder="3.8 / 4.0"
                  />
                  <p className="text-white/50 text-xs mt-1 font-merriweather">
                    Only include if 3.0 or higher
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Add Education Button */}
      <button
        type="button"
        onClick={handleAddEducation}
        className="btn-hustle-secondary w-full flex items-center justify-center gap-2"
>
        <Plus className="w-5 h-5" />
        Add Education
      </button>

      {fields.length === 0 && (
        <p className="text-white/50 text-sm font-merriweather text-center">
          No formal education? No problem. Skip this section or add relevant training programs.
        </p>
      )}
    </div>
  );
};
