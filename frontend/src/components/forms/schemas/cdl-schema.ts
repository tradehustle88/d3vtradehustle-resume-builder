import { z } from 'zod';
import { baseResumeSchema, defaultBaseFormValues, BaseResumeFormData } from './base-schema';

/**
 * CDL Driver-Specific Resume Schema
 */
export const cdlSchema = baseResumeSchema;

export type CDLFormData = BaseResumeFormData;

/**
 * CDL Default Values
 */
export const cdlDefaultValues: Partial<CDLFormData> = {
  ...defaultBaseFormValues,
  tradeTitle: 'Professional CDL Driver',
};

/**
 * CDL Certifications
 */
export const CDL_CERTIFICATIONS = [
  'CDL Class A',
  'CDL Class B',
  'Hazmat Endorsement',
  'Tanker Endorsement',
  'Doubles/Triples Endorsement',
  'TWIC Card',
  'DOT Medical Card',
  'Forklift Certification',
];

/**
 * CDL Skills
 */
export const CDL_SKILLS = {
  technical: [
    'Long Haul Driving',
    'Local Delivery',
    'Vehicle Inspection',
    'Route Planning',
    'Load Securement',
    'GPS Navigation',
    'Electronic Logging',
    'Defensive Driving',
  ],
  safety: [
    'DOT Regulations',
    'Hours of Service',
    'Accident Prevention',
    'Vehicle Maintenance',
    'Hazmat Safety',
    'Weather Driving',
  ],
  soft: [
    'Time Management',
    'Customer Service',
    'Communication',
    'Attention to Detail',
    'Self-Motivation',
  ],
};
