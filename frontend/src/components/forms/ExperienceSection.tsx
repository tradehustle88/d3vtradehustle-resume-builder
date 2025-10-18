"use client";

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Briefcase, Plus, Trash2, Sparkles, Calendar } from 'lucide-react';
import { ResumeFormData } from './schema';
import { AI_PROMPTS } from './ai-prompts';

export const ExperienceSection: React.FC = () => {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control,
    name: 'experience',
  });

  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);

  const handleAddExperience = () => {
    append({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      location: '',
      achievements: [],
    });
  };

  const handleAddAchievement = (experienceIndex: number) => {
    const currentAchievements = watch(`experience.${experienceIndex}.achievements`) || [];
    if (currentAchievements.length < 5) {
      setValue(`experience.${experienceIndex}.achievements`, [...currentAchievements, '']);
    }
  };

  const handleRemoveAchievement = (experienceIndex: number, achievementIndex: number) => {
    const currentAchievements = watch(`experience.${experienceIndex}.achievements`) || [];
    setValue(
      `experience.${experienceIndex}.achievements`,
      currentAchievements.filter((_, i) => i !== achievementIndex)
    );
  };

  const handleGenerateAchievements = async (experienceIndex: number) => {
    setGeneratingIndex(experienceIndex);
    try {
      const exp = watch(`experience.${experienceIndex}`);
      const prompt = AI_PROMPTS.achievement({
        role: exp.role || 'HVAC Technician',
        company: exp.company || 'the company',
        startDate: exp.startDate || '',
        endDate: exp.endDate,
      });

      const response = await fetch('/api/editResume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          resumeContent: '',
        }),
      });

      const data = await response.json();
      if (data.success && data.message) {
        try {
          const achievements = JSON.parse(data.message);
          if (Array.isArray(achievements)) {
            setValue(`experience.${experienceIndex}.achievements`, achievements);
          }
        } catch {
          // If not JSON, split by newlines
          const achievements = data.message.split('\n').filter((line: string) => line.trim());
          setValue(`experience.${experienceIndex}.achievements`, achievements);
        }
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setGeneratingIndex(null);
    }
  };

  return (
    <div
className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-anton text-hustle-gold mb-2">
          WORK EXPERIENCE
        </h2>
        <p className="text-white/70 font-merriweather">
          Tell your professional story. Focus on achievements, not just duties.
        </p>
      </div>

      {fields.map((field, index) => {
          const achievements = watch(`experience.${index}.achievements`) || [];
          const isGenerating = generatingIndex === index;

          return (
            <div
              key={field.id}
className="bg-hustle-navy-dark border-2 border-hustle-gold/20 rounded-lg p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-hustle-gold font-merriweather">
                  <Briefcase className="w-5 h-5" />
                  <span>Position {index + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                  aria-label={`Remove position ${index + 1}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Company & Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`experience.${index}.company`} className="block text-white/70 font-merriweather text-sm mb-1">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`experience.${index}.company`}
                      type="text"
                      {...register(`experience.${index}.company`)}
                      className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                      placeholder="Cool Air HVAC"
                    />
                    {errors.experience?.[index]?.company && (
                      <p className="text-red-500 text-sm mt-1 font-merriweather">
                        {errors.experience[index]?.company?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`experience.${index}.role`} className="block text-white/70 font-merriweather text-sm mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`experience.${index}.role`}
                      type="text"
                      {...register(`experience.${index}.role`)}
                      className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                      placeholder="HVAC Technician"
                    />
                    {errors.experience?.[index]?.role && (
                      <p className="text-red-500 text-sm mt-1 font-merriweather">
                        {errors.experience[index]?.role?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dates & Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`experience.${index}.startDate`} className="flex items-center gap-1 text-white/70 font-merriweather text-sm mb-1">
                      <Calendar className="w-3 h-3" />
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`experience.${index}.startDate`}
                      type="month"
                      {...register(`experience.${index}.startDate`)}
                      className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                    />
                    {errors.experience?.[index]?.startDate && (
                      <p className="text-red-500 text-sm mt-1 font-merriweather">
                        {errors.experience[index]?.startDate?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`experience.${index}.endDate`} className="flex items-center gap-1 text-white/70 font-merriweather text-sm mb-1">
                      <Calendar className="w-3 h-3" />
                      End Date
                    </label>
                    <input
                      id={`experience.${index}.endDate`}
                      type="month"
                      {...register(`experience.${index}.endDate`)}
                      className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                      placeholder="Leave blank if current"
                    />
                    <p className="text-white/50 text-xs mt-1 font-merriweather">
                      Leave blank for "Present"
                    </p>
                  </div>

                  <div>
                    <label htmlFor={`experience.${index}.location`} className="block text-white/70 font-merriweather text-sm mb-1">
                      Location
                    </label>
                    <input
                      id={`experience.${index}.location`}
                      type="text"
                      {...register(`experience.${index}.location`)}
                      className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                      placeholder="Phoenix, AZ"
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/70 font-merriweather text-sm">
                      Key Achievements (max 5)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleGenerateAchievements(index)}
                      disabled={isGenerating}
                      className="btn-hustle-secondary text-xs px-2 py-1 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'AI Generate'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {achievements.map((_, achIndex) => (
                      <div key={achIndex} className="flex gap-2">
                        <input
                          {...register(`experience.${index}.achievements.${achIndex}`)}
                          className="flex-1 px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather text-sm focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                          placeholder="• Reduced service call times by 30% through preventive maintenance"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAchievement(index, achIndex)}
                          className="text-red-500 hover:text-red-400"
                          aria-label={`Remove achievement ${achIndex + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {achievements.length < 5 && (
                      <button
                        type="button"
                        onClick={() => handleAddAchievement(index)}
                        className="text-hustle-gold hover:text-yellow-500 font-merriweather text-sm flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Achievement
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {/* Add Experience Button */}
      <button
        type="button"
        onClick={handleAddExperience}
        className="btn-hustle-secondary w-full flex items-center justify-center gap-2"
>
        <Plus className="w-5 h-5" />
        Add Work Experience
      </button>
    </div>
  );
};
