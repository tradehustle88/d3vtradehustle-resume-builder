"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, User, Award, Zap, Briefcase, GraduationCap } from 'lucide-react';
import { ResumeFormData } from './schema';

export const ReviewSection: React.FC = () => {
  const { watch } = useFormContext<ResumeFormData>();
  
  const formData = watch();
  const {
    name,
    email,
    phone,
    location,
    tradeTitle,
    summary,
    certifications = [],
    skills = [],
    experience = [],
    education = [],
    references,
  } = formData;

  // Calculate completion
  const sections = [
    { name: 'Header', complete: !!(name && email && phone && location) },
    { name: 'Summary', complete: !!summary },
    { name: 'Certifications', complete: certifications.length > 0 },
    { name: 'Skills', complete: skills.length > 0 },
    { name: 'Experience', complete: experience.length > 0 },
    { name: 'Education', complete: education.length > 0 },
  ];

  const completedSections = sections.filter(s => s.complete).length;
  const completionPercent = Math.round((completedSections / sections.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-anton text-hustle-gold mb-2">
          REVIEW YOUR RESUME
        </h2>
        <p className="text-white/70 font-merriweather">
          Almost there! Review your information and download your professional resume.
        </p>
      </div>

      {/* Completion Status */}
      <div className="bg-gradient-to-r from-hustle-navy-dark to-hustle-navy border-2 border-hustle-gold/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-anton text-hustle-gold mb-1">
              {completionPercent}% Complete
            </h3>
            <p className="text-white/70 font-merriweather text-sm">
              {completedSections} of {sections.length} sections filled
            </p>
          </div>
          {completionPercent === 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-12 h-12 text-hustle-gold" />
            </motion.div>
          )}
        </div>

        <div className="w-full bg-hustle-navy rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-hustle-gold to-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Section Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 ${
              section.complete
                ? 'bg-hustle-gold/10 border-hustle-gold/50'
                : 'bg-hustle-navy-dark border-hustle-gold/20'
            }`}
          >
            <div className="flex items-center gap-3">
              {section.complete ? (
                <CheckCircle2 className="w-5 h-5 text-hustle-gold" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-hustle-gold/30" />
              )}
              <span className={`font-merriweather ${
                section.complete ? 'text-hustle-gold' : 'text-white/50'
              }`}>
                {section.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resume Summary */}
      <div className="bg-hustle-navy-dark border-2 border-hustle-gold/20 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-anton text-hustle-gold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resume Summary
        </h3>

        {/* Header Info */}
        <div className="flex items-start gap-3 pb-3 border-b border-hustle-gold/10">
          <User className="w-5 h-5 text-hustle-gold mt-1" />
          <div>
            <p className="text-white font-merriweather font-bold">{name || 'Your Name'}</p>
            <p className="text-white/70 font-merriweather text-sm">{tradeTitle || 'HVAC Technician'}</p>
            <p className="text-white/50 font-merriweather text-sm">
              {email} • {phone} • {location}
            </p>
          </div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="flex items-start gap-3 pb-3 border-b border-hustle-gold/10">
            <Award className="w-5 h-5 text-hustle-gold mt-1" />
            <div>
              <p className="text-hustle-gold font-merriweather text-sm font-bold mb-1">
                {certifications.length} Certification{certifications.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {certifications.slice(0, 3).map((cert, i) => (
                  <span key={i} className="text-white/70 font-merriweather text-xs bg-hustle-gold/10 px-2 py-1 rounded">
                    {cert.name}
                  </span>
                ))}
                {certifications.length > 3 && (
                  <span className="text-white/50 font-merriweather text-xs">
                    +{certifications.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex items-start gap-3 pb-3 border-b border-hustle-gold/10">
            <Zap className="w-5 h-5 text-hustle-gold mt-1" />
            <div>
              <p className="text-hustle-gold font-merriweather text-sm font-bold mb-1">
                {skills.length} Core Skill{skills.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 4).map((skill, i) => (
                  <span key={i} className="text-white/70 font-merriweather text-xs bg-hustle-gold/10 px-2 py-1 rounded">
                    {skill.name}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="text-white/50 font-merriweather text-xs">
                    +{skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="flex items-start gap-3 pb-3 border-b border-hustle-gold/10">
            <Briefcase className="w-5 h-5 text-hustle-gold mt-1" />
            <div>
              <p className="text-hustle-gold font-merriweather text-sm font-bold mb-1">
                {experience.length} Position{experience.length !== 1 ? 's' : ''}
              </p>
              {experience.slice(0, 2).map((exp, i) => (
                <p key={i} className="text-white/70 font-merriweather text-sm">
                  {exp.role} at {exp.company}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-hustle-gold mt-1" />
            <div>
              <p className="text-hustle-gold font-merriweather text-sm font-bold mb-1">
                {education.length} Education Record{education.length !== 1 ? 's' : ''}
              </p>
              {education.slice(0, 2).map((edu, i) => (
                <p key={i} className="text-white/70 font-merriweather text-sm">
                  {edu.school} {edu.year ? `(${edu.year})` : ''}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      {completionPercent === 100 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-hustle-gold/20 to-yellow-500/20 border-2 border-hustle-gold rounded-lg p-6 text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-hustle-gold mx-auto mb-4" />
          <h3 className="text-2xl font-anton text-hustle-gold mb-2">
            RESUME READY!
          </h3>
          <p className="text-white/80 font-merriweather mb-4">
            Your professional HVAC resume is complete. Download it now and start applying!
          </p>
        </motion.div>
      ) : (
        <div className="bg-hustle-navy-dark border border-hustle-gold/20 rounded-lg p-4">
          <p className="text-white/70 font-merriweather text-sm text-center">
            Complete all sections to unlock download options
          </p>
        </div>
      )}
    </motion.div>
  );
};
