"use client";

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, Trash2, Tag } from 'lucide-react';
import { ResumeFormData, HVAC_SKILLS } from './schema';

type SkillCategory = 'technical' | 'safety' | 'soft';

export const SkillsSection: React.FC = () => {
  const {
    control,
    register,
    formState: { errors },
    watch,
  } = useFormContext<ResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('technical');
  const skills = watch('skills') || [];

  const handleAddSkill = (name: string = '', category?: SkillCategory) => {
    if (fields.length < 8) {
      append({ name, category });
    }
  };

  const handleSuggestionClick = (skillName: string, category: SkillCategory) => {
    if (!skills.some(s => s.name === skillName)) {
      handleAddSkill(skillName, category);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-anton text-hustle-gold mb-2">
          CORE SKILLS
        </h2>
        <p className="text-white/70 font-merriweather">
          Showcase your technical, safety, and soft skills. Max 8 skills.
        </p>
      </div>

      {/* Skills as Chips */}
      {fields.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-hustle-navy-dark border-2 border-hustle-gold/20 rounded-lg min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative"
              >
                <input
                  {...register(`skills.${index}.name`)}
                  className="px-4 py-2 pr-8 bg-hustle-gold/20 border-2 border-hustle-gold rounded-full text-white font-merriweather text-sm focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                  placeholder="Skill name"
                  aria-label={`Skill ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove skill ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {/* Hidden category field */}
                <input type="hidden" {...register(`skills.${index}.category`)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {fields.length === 0 && (
        <div className="p-8 bg-hustle-navy-dark border-2 border-dashed border-hustle-gold/30 rounded-lg text-center">
          <Zap className="w-12 h-12 text-hustle-gold/50 mx-auto mb-3" />
          <p className="text-white/50 font-merriweather">
            No skills added yet. Click below to add your first skill.
          </p>
        </div>
      )}

      {/* Add Skill Button */}
      {fields.length < 8 && (
        <motion.button
          type="button"
          onClick={() => handleAddSkill()}
          className="btn-hustle-secondary w-full flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </motion.button>
      )}

      {/* Skill Suggestions */}
      {fields.length < 8 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-hustle-gold hover:text-yellow-500 font-merriweather text-sm flex items-center gap-2 transition-colors"
          >
            <Tag className="w-4 h-4" />
            {showSuggestions ? 'Hide' : 'Show'} Skill Suggestions
          </button>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-hustle-navy-dark border border-hustle-gold/30 rounded-lg p-4"
              >
                {/* Category Tabs */}
                <div className="flex gap-2 mb-4">
                  {(['technical', 'safety', 'soft'] as SkillCategory[]).map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-merriweather text-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-hustle-gold text-hustle-navy'
                          : 'bg-hustle-navy border border-hustle-gold/30 text-hustle-gold hover:bg-hustle-gold/10'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Skills for Selected Category */}
                <div className="flex flex-wrap gap-2">
                  {HVAC_SKILLS[selectedCategory].map(skillName => (
                    <button
                      key={skillName}
                      type="button"
                      onClick={() => handleSuggestionClick(skillName, selectedCategory)}
                      disabled={skills.some(s => s.name === skillName)}
                      className="px-3 py-1.5 bg-hustle-gold/10 border border-hustle-gold/30 rounded-full text-hustle-gold text-sm font-merriweather hover:bg-hustle-gold/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {skillName}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {fields.length >= 8 && (
        <p className="text-yellow-500 text-sm font-merriweather">
          Maximum of 8 skills reached. Focus on your strongest competencies.
        </p>
      )}

      {errors.skills && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-red-500 text-sm font-merriweather"
        >
          {errors.skills.message}
        </motion.p>
      )}
    </motion.div>
  );
};
