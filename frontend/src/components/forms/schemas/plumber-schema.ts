import { z } from 'zod';
import { baseResumeSchema, defaultBaseFormValues, BaseResumeFormData } from './base-schema';

/**
 * Plumber-Specific Resume Schema
 */
export const plumberSchema = baseResumeSchema;

export type PlumberFormData = BaseResumeFormData;

/**
 * Plumber Default Values
 */
export const plumberDefaultValues: Partial<PlumberFormData> = {
  ...defaultBaseFormValues,
  tradeTitle: 'Licensed Plumber',
};

/**
 * Plumber Certifications
 */
export const PLUMBER_CERTIFICATIONS = [
  'State Plumbing License',
  'Journeyman Plumber',
  'Master Plumber',
  'Gas Line Certification',
  'Backflow Prevention Certification',
  'OSHA 10',
  'Medical Gas Installer',
  'Green Plumber Certification',
];

/**
 * Plumber Skills
 */
export const PLUMBER_SKILLS = {
  technical: [
    'Pipe Installation',
    'Drain Cleaning',
    'Water Heater Installation',
    'Fixture Installation',
    'Leak Detection',
    'Gas Line Work',
    'Backflow Testing',
    'Blueprint Reading',
  ],
  safety: [
    'Confined Space',
    'Trenching Safety',
    'Gas Safety',
    'PPE Usage',
    'OSHA Compliance',
    'Hazmat Awareness',
  ],
  soft: [
    'Emergency Response',
    'Customer Service',
    'Problem Diagnosis',
    'Time Management',
    'Technical Communication',
  ],
};
