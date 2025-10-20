import { z } from 'zod';
import { baseResumeSchema, defaultBaseFormValues, BaseResumeFormData } from './base-schema';

/**
 * HVAC-Specific Resume Schema
 * Extends base schema with HVAC defaults
 */
export const hvacSchema = baseResumeSchema;

export type HVACFormData = BaseResumeFormData;

/**
 * HVAC Default Values
 */
export const hvacDefaultValues: Partial<HVACFormData> = {
  ...defaultBaseFormValues,
  tradeTitle: 'HVAC Technician',
};

/**
 * HVAC Certifications
 */
export const HVAC_CERTIFICATIONS = [
  'EPA 608 Universal',
  'EPA 608 Type I',
  'EPA 608 Type II',
  'NATE Certification',
  'OSHA 10',
  'OSHA 30',
  'R-410A Certification',
  'Welding Certification',
  'Electrical License',
  'Journeyman License',
  'Master HVAC License',
  'Building Performance Institute (BPI)',
];

/**
 * HVAC Skills
 */
export const HVAC_SKILLS = {
  technical: [
    'HVAC Installation',
    'System Diagnostics',
    'Preventive Maintenance',
    'Refrigeration Systems',
    'Ductwork Design',
    'Air Quality Testing',
    'Energy Efficiency Optimization',
    'Blueprint Reading',
  ],
  safety: [
    'EPA Compliance',
    'Electrical Safety',
    'Fall Protection',
    'PPE Usage',
    'Hazmat Handling',
    'OSHA Regulations',
  ],
  soft: [
    'Customer Service',
    'Problem Solving',
    'Time Management',
    'Team Collaboration',
    'Technical Documentation',
  ],
};
