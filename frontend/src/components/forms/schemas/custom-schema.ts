import { z } from 'zod';
import { baseResumeSchema, defaultBaseFormValues, BaseResumeFormData } from './base-schema';

/**
 * Custom Trade Resume Schema (Fallback)
 */
export const customSchema = baseResumeSchema;

export type CustomFormData = BaseResumeFormData;

/**
 * Custom Trade Default Values
 */
export const customDefaultValues: Partial<CustomFormData> = {
  ...defaultBaseFormValues,
  tradeTitle: 'Skilled Tradesperson',
};

/**
 * Generic Certifications
 */
export const CUSTOM_CERTIFICATIONS = [
  'State License',
  'OSHA 10',
  'OSHA 30',
  'First Aid/CPR',
  'Industry Certification',
];

/**
 * Generic Skills
 */
export const CUSTOM_SKILLS = {
  technical: [
    'Industry-Specific Skill 1',
    'Industry-Specific Skill 2',
    'Industry-Specific Skill 3',
    'Blueprint Reading',
    'Equipment Operation',
  ],
  safety: [
    'OSHA Compliance',
    'PPE Usage',
    'Hazard Recognition',
    'Safety Protocols',
  ],
  soft: [
    'Problem Solving',
    'Customer Service',
    'Time Management',
    'Team Collaboration',
  ],
};
