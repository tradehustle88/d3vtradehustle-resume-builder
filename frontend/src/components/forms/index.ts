/**
 * HVAC Resume Builder - Forms Index
 * Export all form components and utilities
 */

export { default as HVACResumeBuilder } from './HVACResumeBuilder';
export { default as MultiStepForm } from './MultiStepForm';

// Trade-specific forms and factory
export {
  TradeFormFactory,
  HVACForm,
  ElectricianForm,
  PlumberForm,
  CDLForm,
  MaintenanceForm,
  CustomTradeForm,
  tradeForms,
  useTradeConfig,
  getTradeConfig,
  getAllTrades,
  isValidTradeId,
  TRADE_CONFIGS,
} from './TradeFormFactory';

export type {
  TradeFormProps,
  TradeFormKey,
  TradeConfig,
} from './TradeFormFactory';

// Export all schemas
export * from './schemas';
export { HeaderSection } from './HeaderSection';
export { SummarySection } from './SummarySection';
export { CertificationsSection } from './CertificationsSection';
export { SkillsSection } from './SkillsSection';
export { ExperienceSection } from './ExperienceSection';
export { EducationSection } from './EducationSection';
export { ReferencesSection } from './ReferencesSection';
export { ReviewSection } from './ReviewSection';
export { ResumePreview } from './ResumePreview';
export { ProgressSidebar, MobileProgressBar } from './ProgressSidebar';

export type { ResumeFormData } from './schema';
export { resumeSchema, defaultFormValues, HVAC_CERTIFICATIONS, HVAC_SKILLS } from './schema';
export { AI_PROMPTS, FIELD_TOOLTIPS, ERROR_MESSAGES } from './ai-prompts';
