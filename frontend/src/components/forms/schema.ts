import { z } from 'zod';

/**
 * HVAC Resume Builder - Comprehensive Form Schema
 * Validation rules for all resume sections
 */

export const resumeSchema = z.object({
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

export type ResumeFormData = z.infer<typeof resumeSchema>;

/**
 * Default empty form state
 */
export const defaultFormValues: Partial<ResumeFormData> = {
  name: '',
  email: '',
  phone: '',
  location: '',
  tradeTitle: 'HVAC Technician',
  summary: '',
  certifications: [],
  skills: [],
  experience: [],
  education: [],
  references: 'Available upon request',
};

/**
 * Common certification options for HVAC professionals
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
 * Common skill categories for HVAC professionals
 */
export const HVAC_SKILLS = {
  technical: [
    'HVAC Installation',
    'System Diagnostics',
    'Preventive Maintenance',
    'Refrigeration Systems',
    'Ductwork Installation',
    'Electrical Troubleshooting',
    'Blueprint Reading',
    'Load Calculations',
  ],
  safety: [
    'OSHA Compliance',
    'Hazmat Handling',
    'Confined Space Entry',
    'Lockout/Tagout',
    'Fall Protection',
  ],
  soft: [
    'Customer Service',
    'Team Leadership',
    'Problem Solving',
    'Time Management',
    'Communication',
  ],
};
