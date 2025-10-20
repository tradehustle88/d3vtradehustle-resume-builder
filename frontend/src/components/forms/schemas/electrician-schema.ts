import { z } from 'zod';
import { baseResumeSchema, defaultBaseFormValues, BaseResumeFormData } from './base-schema';

/**
 * Electrician-Specific Resume Schema
 */
export const electricianSchema = baseResumeSchema;

export type ElectricianFormData = BaseResumeFormData;

/**
 * Electrician Default Values
 */
export const electricianDefaultValues: Partial<ElectricianFormData> = {
  ...defaultBaseFormValues,
  tradeTitle: 'Journeyman Electrician',
};

/**
 * Electrician Certifications
 */
export const ELECTRICIAN_CERTIFICATIONS = [
  'State Electrical License',
  'Journeyman License',
  'Master Electrician License',
  'OSHA 10',
  'OSHA 30',
  'NEC Certification',
  'Arc Flash Training',
  'Low Voltage License',
  'Fire Alarm Certification',
];

/**
 * Electrician Skills
 */
export const ELECTRICIAN_SKILLS = {
  technical: [
    'Electrical Wiring',
    'Circuit Design',
    'Panel Installation',
    'Conduit Bending',
    'Blueprint Reading',
    'Voltage Testing',
    'Motor Controls',
    'NEC Compliance',
  ],
  safety: [
    'Lockout/Tagout',
    'Arc Flash Safety',
    'Fall Protection',
    'Confined Space',
    'Electrical PPE',
    'Hazard Recognition',
  ],
  soft: [
    'Project Management',
    'Customer Communication',
    'Problem Solving',
    'Attention to Detail',
    'Team Leadership',
  ],
};
