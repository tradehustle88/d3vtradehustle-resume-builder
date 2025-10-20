import { z } from 'zod';
import { baseResumeSchema, defaultBaseFormValues, BaseResumeFormData } from './base-schema';

/**
 * Maintenance Technician-Specific Resume Schema
 */
export const maintenanceSchema = baseResumeSchema;

export type MaintenanceFormData = BaseResumeFormData;

/**
 * Maintenance Default Values
 */
export const maintenanceDefaultValues: Partial<MaintenanceFormData> = {
  ...defaultBaseFormValues,
  tradeTitle: 'Maintenance Technician',
};

/**
 * Maintenance Certifications
 */
export const MAINTENANCE_CERTIFICATIONS = [
  'HVAC EPA 608',
  'Electrical License (Limited)',
  'Boiler License',
  'OSHA 10',
  'Forklift Certification',
  'Welding Certification',
  'CMRT (Certified Maintenance & Reliability Technician)',
  'Building Automation Certification',
];

/**
 * Maintenance Skills
 */
export const MAINTENANCE_SKILLS = {
  technical: [
    'Preventive Maintenance',
    'Equipment Repair',
    'HVAC Systems',
    'Electrical Systems',
    'Plumbing Systems',
    'Building Automation',
    'Welding & Fabrication',
    'Blueprint Reading',
  ],
  safety: [
    'Lockout/Tagout',
    'Confined Space',
    'Fall Protection',
    'Chemical Safety',
    'OSHA Compliance',
    'Emergency Response',
  ],
  soft: [
    'Multi-tasking',
    'Priority Management',
    'Team Coordination',
    'Problem Solving',
    'Documentation',
  ],
};
