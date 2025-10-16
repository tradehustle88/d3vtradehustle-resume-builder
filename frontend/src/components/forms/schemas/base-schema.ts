import { z } from 'zod';

/**
 * Base Resume Schema
 * Shared foundation for all trade-specific resume forms
 */
export const baseResumeSchema = z.object({
  // Header Section
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  location: z.string().min(2, "Location required").max(100),
  tradeTitle: z.string().min(1, "Trade title required"),
  
  // Summary Section
  summary: z.string().max(500, "Summary must be under 500 characters"),
  
  // Certifications Section (max 6 key certs)
  certifications: z.array(z.object({
    name: z.string().min(1, "Certification name required"),
    issuer: z.string().optional(),
    year: z.number().int().min(1950).max(2100).optional(),
  })).max(6, "Maximum 6 certifications"),
  
  // Skills Section (max 8 key skills)
  skills: z.array(z.object({
    name: z.string().min(1, "Skill name required"),
    category: z.enum(['technical', 'safety', 'soft']).optional(),
  })).max(8, "Maximum 8 skills"),
  
  // Experience Section
  experience: z.array(z.object({
    company: z.string().min(1, "Company name required"),
    role: z.string().min(1, "Role required"),
    startDate: z.string().min(1, "Start date required"), // Store as ISO string
    endDate: z.string().optional(), // Empty string = "Present"
    location: z.string().optional(),
    achievements: z.array(z.string().min(5, "Achievement too short").max(200)).max(5, "Maximum 5 achievements per role"),
  })),
  
  // Education Section
  education: z.array(z.object({
    school: z.string().min(1, "School name required"),
    degree: z.string().optional(),
    field: z.string().optional(),
    year: z.number().int().min(1950).max(2100).optional(),
    gpa: z.string().optional(),
  })),
  
  // References Section
  references: z.string().max(300, "References section too long"),
});

/**
 * Base form data type (inferred from schema)
 */
export type BaseResumeFormData = z.infer<typeof baseResumeSchema>;

/**
 * Default empty form state
 */
export const defaultBaseFormValues: Partial<BaseResumeFormData> = {
  name: '',
  email: '',
  phone: '',
  location: '',
  tradeTitle: '',
  summary: '',
  certifications: [],
  skills: [],
  experience: [],
  education: [],
  references: 'Available upon request',
};
