"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { ResumeFormData } from './schema';

interface ResumePreviewProps {
  data: Partial<ResumeFormData>;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
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
  } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white text-gray-900 rounded-lg shadow-2xl p-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="border-b-4 border-hustle-gold pb-6 mb-6">
        <h1 className="text-4xl font-anton text-hustle-navy mb-2">
          {name || 'YOUR NAME'}
        </h1>
        <h2 className="text-xl font-merriweather text-hustle-gold mb-3">
          {tradeTitle || 'HVAC Technician'}
        </h2>
        <div className="flex flex-wrap gap-4 text-sm font-merriweather text-gray-600">
          {email && <span>{email}</span>}
          {phone && <span>•</span>}
          {phone && <span>{phone}</span>}
          {location && <span>•</span>}
          {location && <span>{location}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h3 className="text-lg font-anton text-hustle-navy mb-2 border-b-2 border-hustle-gold/30 pb-1">
            PROFESSIONAL SUMMARY
          </h3>
          <p className="font-merriweather text-gray-700 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-anton text-hustle-navy mb-2 border-b-2 border-hustle-gold/30 pb-1">
            CERTIFICATIONS
          </h3>
          <ul className="grid grid-cols-2 gap-2">
            {certifications.map((cert, index) => (
              <li key={index} className="font-merriweather text-gray-700 flex items-start">
                <span className="text-hustle-gold mr-2">•</span>
                <span>
                  {cert.name}
                  {cert.issuer && ` - ${cert.issuer}`}
                  {cert.year && ` (${cert.year})`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-anton text-hustle-navy mb-2 border-b-2 border-hustle-gold/30 pb-1">
            CORE SKILLS
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-hustle-gold/20 rounded-full text-sm font-merriweather text-hustle-navy"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-anton text-hustle-navy mb-3 border-b-2 border-hustle-gold/30 pb-1">
            WORK EXPERIENCE
          </h3>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-merriweather font-bold text-hustle-navy">
                      {exp.role}
                    </h4>
                    <p className="font-merriweather text-gray-600">
                      {exp.company}
                      {exp.location && ` - ${exp.location}`}
                    </p>
                  </div>
                  <p className="font-merriweather text-gray-500 text-sm">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                </div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li
                        key={achIndex}
                        className="font-merriweather text-gray-700 text-sm flex items-start"
                      >
                        <span className="text-hustle-gold mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-anton text-hustle-navy mb-2 border-b-2 border-hustle-gold/30 pb-1">
            EDUCATION
          </h3>
          <div className="space-y-2">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-merriweather font-bold text-hustle-navy">
                      {edu.school}
                    </h4>
                    <p className="font-merriweather text-gray-600 text-sm">
                      {edu.degree}
                      {edu.field && ` - ${edu.field}`}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  {edu.year && (
                    <p className="font-merriweather text-gray-500 text-sm">
                      {edu.year}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {references && (
        <div className="mb-6">
          <h3 className="text-lg font-anton text-hustle-navy mb-2 border-b-2 border-hustle-gold/30 pb-1">
            REFERENCES
          </h3>
          <p className="font-merriweather text-gray-700 whitespace-pre-line">
            {references}
          </p>
        </div>
      )}
    </motion.div>
  );
};
