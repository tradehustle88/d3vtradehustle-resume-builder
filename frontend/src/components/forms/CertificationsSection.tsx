"use client";

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Award, Plus, Trash2, Sparkles } from 'lucide-react';
import { ResumeFormData, HVAC_CERTIFICATIONS } from './schema';

export const CertificationsSection: React.FC = () => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const certifications = watch('certifications') || [];

  const handleAddCertification = (name: string = '') => {
    if (fields.length < 6) {
      append({ name, issuer: '', year: undefined });
    }
  };

  const handleSuggestionClick = (certName: string) => {
    // Don't add if already exists
    if (!certifications.some(c => c.name === certName)) {
      handleAddCertification(certName);
    }
  };

  return (
    <div
className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-anton text-hustle-gold mb-2">
          CERTIFICATIONS & LICENSES
        </h2>
        <p className="text-white/70 font-merriweather">
          Show off your credentials. Add up to 6 key certifications.
        </p>
      </div>

      {/* Existing Certifications */}
      {fields.map((field, index) => (
          <div
            key={field.id}
className="bg-hustle-navy-dark border-2 border-hustle-gold/20 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-hustle-gold font-merriweather">
                <Award className="w-5 h-5" />
                <span>Certification {index + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-400 transition-colors"
                aria-label={`Remove certification ${index + 1}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Certification Name */}
              <div>
                <label htmlFor={`certifications.${index}.name`} className="block text-white/70 font-merriweather text-sm mb-1">
                  Certification Name <span className="text-red-500">*</span>
                </label>
                <input
                  id={`certifications.${index}.name`}
                  type="text"
                  {...register(`certifications.${index}.name`)}
                  className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                  placeholder="EPA 608 Universal"
                  list={`cert-suggestions-${index}`}
                />
                <datalist id={`cert-suggestions-${index}`}>
                  {HVAC_CERTIFICATIONS.map(cert => (
                    <option key={cert} value={cert} />
                  ))}
                </datalist>
                {errors.certifications?.[index]?.name && (
                  <p className="text-red-500 text-sm mt-1 font-merriweather">
                    {errors.certifications[index]?.name?.message}
                  </p>
                )}
              </div>

              {/* Issuer and Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`certifications.${index}.issuer`} className="block text-white/70 font-merriweather text-sm mb-1">
                    Issuer (optional)
                  </label>
                  <input
                    id={`certifications.${index}.issuer`}
                    type="text"
                    {...register(`certifications.${index}.issuer`)}
                    className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                    placeholder="EPA"
                  />
                </div>
                <div>
                  <label htmlFor={`certifications.${index}.year`} className="block text-white/70 font-merriweather text-sm mb-1">
                    Year (optional)
                  </label>
                  <input
                    id={`certifications.${index}.year`}
                    type="number"
                    {...register(`certifications.${index}.year`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 bg-hustle-navy border-2 border-hustle-gold/30 rounded text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
                    placeholder="2024"
                    min="1950"
                    max="2100"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Add Certification Button */}
      {fields.length < 6 && (
        <button
          type="button"
          onClick={() => handleAddCertification()}
          className="btn-hustle-secondary w-full flex items-center justify-center gap-2"
>
          <Plus className="w-5 h-5" />
          Add Certification
        </button>
      )}

      {/* Suggestions */}
      {fields.length < 6 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-hustle-gold hover:text-yellow-500 font-merriweather text-sm flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {showSuggestions ? 'Hide' : 'Show'} Common HVAC Certifications
          </button>

          {showSuggestions && (
              <div
className="mt-3 flex flex-wrap gap-2"
              >
                {HVAC_CERTIFICATIONS.map(cert => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => handleSuggestionClick(cert)}
                    disabled={certifications.some(c => c.name === cert)}
                    className="px-3 py-1.5 bg-hustle-gold/10 border border-hustle-gold/30 rounded-full text-hustle-gold text-sm font-merriweather hover:bg-hustle-gold/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cert}
                  </button>
                ))}
              </div>
            )}
        </div>
      )}

      {fields.length >= 6 && (
        <p className="text-yellow-500 text-sm font-merriweather">
          Maximum of 6 certifications reached. Focus on your most relevant credentials.
        </p>
      )}
    </div>
  );
};
