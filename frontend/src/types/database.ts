/**
 * Firestore Database Type Definitions
 * Trade Hustle Resume Builder
 * 
 * Last Updated: October 14, 2025
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// USER TYPES
// ============================================

export type TradeType = 
  | 'electrician' 
  | 'plumber' 
  | 'hvac' 
  | 'carpenter' 
  | 'mason' 
  | 'welder' 
  | 'mechanic' 
  | 'contractor' 
  | 'custom';

export type SubscriptionTier = 
  | 'free' 
  | 'trial' 
  | 'pro-monthly' 
  | 'pro-annual';

export type SubscriptionStatus = 
  | 'active' 
  | 'canceled' 
  | 'expired' 
  | 'trialing';

export interface User {
  // Identity
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  
  // Trade Information
  tradeType: TradeType;
  customTrade?: string;
  
  // Subscription
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate?: Timestamp;
  subscriptionEndDate?: Timestamp;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  
  // Preferences
  preferences: {
    templateId: string;
    notifications: boolean;
    emailFrequency: 'daily' | 'weekly' | 'none';
    theme?: 'light' | 'dark';
    language?: string;
  };
  
  // Referral Program
  referralCode: string;
  referredBy?: string;
  totalReferrals: number;
  referralEarnings: number;
  referralsPending: number;
  
  // Usage Tracking
  resumesCreated: number;
  jobsTracked: number;
  certsStored: number;
  aiSuggestionsUsed: number;
  
  // Timestamps
  createdAt: Timestamp;
  lastLogin: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// RESUME TYPES
// ============================================

export interface Resume {
  // Identity
  id: string;
  userId: string;
  templateId: string;
  tradeType: string;
  title: string;
  
  // Profile
  profile: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    photoURL?: string;
    linkedIn?: string;
    portfolio?: string;
  };
  
  // Experience
  experience: WorkExperience[];
  
  // Skills
  skills: {
    technical: TechnicalSkill[];
    tools: Tool[];
    licenses: License[];
    certifications: Certification[];
  };
  
  // Education
  education: Education[];
  
  // References
  references: Reference[];
  
  // Optional Sections
  projects?: Project[];
  awards?: Award[];
  
  // AI & Optimization
  atsScore: number;
  atsAnalysis?: {
    strengths: string[];
    improvements: string[];
    keywords: string[];
    missingKeywords: string[];
  };
  aiOptimized: boolean;
  targetJob?: string;
  
  // Metadata
  versions: number;
  lastModified: Timestamp;
  createdAt: Timestamp;
  
  // Sharing
  shareLink?: string;
  shareEnabled: boolean;
  downloads: number;
  views: number;
  
  // Status
  status: 'draft' | 'complete' | 'archived';
  isPrimary: boolean;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
  intelligenceSuggestions?: string[];
  atsOptimized: boolean;
}

export interface TechnicalSkill {
  skill: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  yearsExperience?: number;
}

export interface Tool {
  name: string;
  category?: string;
}

export interface License {
  name: string;
  number: string;
  issueDate: string;
  expirationDate?: string;
  issuingAuthority: string;
  state?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
  certId?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Project {
  name: string;
  description: string;
  role: string;
  startDate: string;
  endDate?: string;
  skills: string[];
}

export interface Award {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

// ============================================
// JOB TRACKER TYPES
// ============================================

export type JobStatus = 
  | 'saved' 
  | 'applied' 
  | 'screening' 
  | 'interview' 
  | 'offer' 
  | 'rejected' 
  | 'accepted' 
  | 'withdrawn';

export type JobType = 
  | 'full-time' 
  | 'part-time' 
  | 'contract' 
  | 'temporary';

export interface JobApplication {
  id: string;
  userId: string;
  resumeId?: string;
  
  // Job Details
  company: string;
  position: string;
  location: string;
  jobType?: JobType;
  salary?: string;
  jobUrl?: string;
  jobDescription?: string;
  
  // Status
  status: JobStatus;
  savedDate?: Timestamp;
  appliedDate?: Timestamp;
  lastStatusUpdate: Timestamp;
  
  // Interviews
  interviews: Interview[];
  
  // Contacts
  contacts: Contact[];
  
  // Notes
  notes: string;
  followUpDate?: Timestamp;
  reminderSent: boolean;
  reminderDate?: Timestamp;
  
  // Documents
  documents: JobDocument[];
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archived: boolean;
}

export interface Interview {
  id: string;
  date: Timestamp;
  type: 'phone' | 'video' | 'in-person' | 'technical';
  duration?: number;
  interviewer?: string;
  notes: string;
  outcome?: 'passed' | 'rejected' | 'pending';
  followUpRequired: boolean;
}

export interface Contact {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  notes?: string;
}

export interface JobDocument {
  type: 'resume' | 'cover_letter' | 'portfolio' | 'other';
  url: string;
  name: string;
}

// ============================================
// CERTIFICATION VAULT TYPES
// ============================================

export type CertificationType = 
  | 'license' 
  | 'certification' 
  | 'diploma' 
  | 'training' 
  | 'other';

export type CertificationStatus = 
  | 'active' 
  | 'expired' 
  | 'expiring_soon' 
  | 'archived';

export interface CertificationVault {
  id: string;
  userId: string;
  
  // Details
  name: string;
  type: CertificationType;
  category?: string;
  number: string;
  issueDate: Timestamp;
  expirationDate?: Timestamp;
  issuingAuthority: string;
  
  // File
  fileURL: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  thumbnailURL?: string;
  
  // Sharing
  shareLink?: string;
  shareEnabled: boolean;
  accessCount: number;
  
  // Alerts
  expirationAlertEnabled: boolean;
  expirationAlertDays: number;
  expirationAlertSent: boolean;
  lastAlertDate?: Timestamp;
  
  // Status
  status: CertificationStatus;
  verified: boolean;
  
  // Metadata
  tags: string[];
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// CAREER BLUEPRINT TYPES
// ============================================

export type BlueprintDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface CareerBlueprint {
  id: string;
  tradeType: string;
  
  // Info
  title: string;
  subtitle?: string;
  description: string;
  overview: string;
  estimatedYears: number;
  difficulty: BlueprintDifficulty;
  
  // Steps
  steps: BlueprintStep[];
  
  // Pricing
  price: number;
  stripeProductId: string;
  stripePriceId: string;
  
  // Stats
  purchasedCount: number;
  purchasedBy: string[];
  rating?: number;
  reviews: number;
  
  // Metadata
  featured: boolean;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface BlueprintStep {
  phase: string;
  phaseNumber: number;
  yearsRequired: number;
  certifications: BlueprintCertification[];
  skills: BlueprintSkill[];
  education?: BlueprintEducation[];
  salaryRange: string;
  responsibilities: string[];
  typical_tasks: string[];
  resources: BlueprintResource[];
}

export interface BlueprintCertification {
  name: string;
  required: boolean;
  cost?: string;
  timeToComplete?: string;
}

export interface BlueprintSkill {
  skill: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export interface BlueprintEducation {
  type: string;
  description: string;
  required: boolean;
}

export interface BlueprintResource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'book';
}

// ============================================
// REFERRAL TYPES
// ============================================

export type ReferralStatus = 
  | 'pending' 
  | 'signed_up' 
  | 'converted' 
  | 'expired';

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId?: string;
  referralCode: string;
  
  // Details
  email?: string;
  source?: string;
  
  // Status
  status: ReferralStatus;
  clickDate?: Timestamp;
  signupDate?: Timestamp;
  conversionDate?: Timestamp;
  
  // Commission
  commission: number;
  commissionPaid: boolean;
  paidOutDate?: Timestamp;
  paymentMethod?: string;
  
  // Metadata
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export type StripeSubscriptionStatus = 
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid';

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  
  // Details
  tier: 'trial' | 'pro-monthly' | 'pro-annual';
  status: StripeSubscriptionStatus;
  
  // Pricing
  amount: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  
  // Dates
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  trialStart?: Timestamp;
  trialEnd?: Timestamp;
  canceledAt?: Timestamp;
  cancelAtPeriodEnd: boolean;
  endedAt?: Timestamp;
  
  // Payment
  latestInvoiceId?: string;
  defaultPaymentMethod?: string;
  
  // Features
  features: SubscriptionFeatures;
  
  // Metadata
  metadata: Record<string, string>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SubscriptionFeatures {
  resumesAllowed: number;
  jobsAllowed: number;
  certsAllowed: number;
  aiSuggestionsPerMonth: number;
  atsScanning: boolean;
  prioritySupport: boolean;
  customTemplates: boolean;
}

// ============================================
// TEMPLATE TYPES
// ============================================

export type TemplateCategory = 
  | 'modern' 
  | 'classic' 
  | 'creative' 
  | 'trade-specific';

export type TemplateTier = 'free' | 'pro';

export interface Template {
  id: string;
  name: string;
  description: string;
  
  // Details
  category: TemplateCategory;
  tradeTypes: string[];
  difficulty: 'easy' | 'medium' | 'advanced';
  
  // Design
  previewURL: string;
  thumbnailURL: string;
  cssStyles: string;
  layout: string;
  
  // Pricing
  tier: TemplateTier;
  featured: boolean;
  premium: boolean;
  
  // Stats
  usageCount: number;
  rating: number;
  
  // Metadata
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

// ============================================
// HELPER TYPES
// ============================================

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export type DocumentData<T> = T & {
  id: string;
};

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errorId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
