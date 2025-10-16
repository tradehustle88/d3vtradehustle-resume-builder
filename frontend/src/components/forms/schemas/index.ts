/**
 * Trade-Specific Schema Exports
 * Centralized export for all resume schemas
 */

// Base schema
export {
  baseResumeSchema,
  defaultBaseFormValues,
  type BaseResumeFormData,
} from './base-schema';

// HVAC
export {
  hvacSchema,
  hvacDefaultValues,
  HVAC_CERTIFICATIONS,
  HVAC_SKILLS,
  type HVACFormData,
} from './hvac-schema';

// Electrician
export {
  electricianSchema,
  electricianDefaultValues,
  ELECTRICIAN_CERTIFICATIONS,
  ELECTRICIAN_SKILLS,
  type ElectricianFormData,
} from './electrician-schema';

// Plumber
export {
  plumberSchema,
  plumberDefaultValues,
  PLUMBER_CERTIFICATIONS,
  PLUMBER_SKILLS,
  type PlumberFormData,
} from './plumber-schema';

// CDL
export {
  cdlSchema,
  cdlDefaultValues,
  CDL_CERTIFICATIONS,
  CDL_SKILLS,
  type CDLFormData,
} from './cdl-schema';

// Maintenance
export {
  maintenanceSchema,
  maintenanceDefaultValues,
  MAINTENANCE_CERTIFICATIONS,
  MAINTENANCE_SKILLS,
  type MaintenanceFormData,
} from './maintenance-schema';

// Custom
export {
  customSchema,
  customDefaultValues,
  CUSTOM_CERTIFICATIONS,
  CUSTOM_SKILLS,
  type CustomFormData,
} from './custom-schema';
