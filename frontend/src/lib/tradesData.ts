// src/lib/tradesData.ts
// Trade Hustle Resume Builder - Type-safe Trade Data Access

/**
 * Trade placeholder structure matching backend resumeEngine.js
 */
export interface TradePlaceholders {
  SUMMARY_SENTENCE_1: string;
  SUMMARY_SENTENCE_2: string;
  SKILL_1: string;
  SKILL_2: string;
  SKILL_3: string;
  SKILL_4: string;
  SKILL_5: string;
  SKILL_6: string;
  CERT_1: string;
  CERT_2: string;
  CERT_3: string;
  EXPERIENCE_TITLE_1: string;
  EXPERIENCE_COMPANY_1: string;
  EXPERIENCE_DATES_1: string;
  EXPERIENCE_BULLET_1: string;
  EXPERIENCE_BULLET_2: string;
  EXPERIENCE_BULLET_3: string;
}

/**
 * Trade data structure
 */
export interface TradeData {
  TRADE_TITLE: string;
  CERTIFICATIONS: string[];
  SKILLS: string[];
  PLACEHOLDERS: TradePlaceholders;
}

/**
 * Available trade keys
 */
export type TradeKey = 'HVAC' | 'ELECTRICIAN' | 'PLUMBER';

/**
 * User data for resume generation
 */
export interface ResumeUserData {
  name?: string;
  yearsExperience?: number;
  location?: string;
  currentCompany?: string;
  currentJobDates?: string;
  phone?: string;
  email?: string;
}

/**
 * API response for trade resume generation
 */
export interface TradeResumeResponse {
  success: boolean;
  tradeKey: string;
  tradeTitle: string;
  placeholders: TradePlaceholders;
  tradeData: {
    certifications: string[];
    skills: string[];
  };
  validation: {
    valid: boolean;
    warnings: string[];
    wordCount: number;
    hasUnfilledPlaceholders: boolean;
  };
  metadata: {
    model: string;
    provider: string;
    promptMetadata: {
      tradeKey: string;
      tradeTitle: string;
      certificationsCount: number;
      skillsCount: number;
    };
  };
}

/**
 * Static trade data (mirrors trades_data.json)
 * In production, this could be fetched from an API or imported directly
 */
export const TRADES_DATA: Record<TradeKey, Omit<TradeData, 'PLACEHOLDERS'>> = {
  HVAC: {
    TRADE_TITLE: 'HVAC Technician',
    CERTIFICATIONS: ['EPA 608 Universal', 'OSHA 10', 'State HVAC License'],
    SKILLS: [
      'System Diagnostics',
      'Preventive Maintenance',
      'Electrical Troubleshooting',
      'Ductwork Installation',
      'Pressure Testing',
      'Customer Service',
    ],
  },
  ELECTRICIAN: {
    TRADE_TITLE: 'Electrician',
    CERTIFICATIONS: ['Journeyman License', 'OSHA 10', 'NFPA 70E Training'],
    SKILLS: [
      'Wiring & Panel Installation',
      'Circuit Troubleshooting',
      'Conduit Bending',
      'Blueprint Reading',
    ],
  },
  PLUMBER: {
    TRADE_TITLE: 'Plumber',
    CERTIFICATIONS: ['Journeyman License', 'Backflow Prevention'],
    SKILLS: ['Pipe Fitting', 'Leak Detection', 'Water Heater Installation'],
  },
};

/**
 * Get all available trade keys
 */
export function getAvailableTrades(): TradeKey[] {
  return Object.keys(TRADES_DATA) as TradeKey[];
}

/**
 * Get trade data by key
 */
export function getTradeData(tradeKey: TradeKey): Omit<TradeData, 'PLACEHOLDERS'> | null {
  return TRADES_DATA[tradeKey] || null;
}

/**
 * Validate trade key
 */
export function isValidTradeKey(key: string): key is TradeKey {
  return Object.keys(TRADES_DATA).includes(key);
}

/**
 * Get trade title from key
 */
export function getTradeTitle(tradeKey: TradeKey): string {
  return TRADES_DATA[tradeKey]?.TRADE_TITLE || '';
}

/**
 * Format certifications for display
 */
export function formatCertifications(tradeKey: TradeKey): string {
  const trade = TRADES_DATA[tradeKey];
  if (!trade) return '';
  return trade.CERTIFICATIONS.join(' • ');
}

/**
 * Format skills for display
 */
export function formatSkills(tradeKey: TradeKey): string {
  const trade = TRADES_DATA[tradeKey];
  if (!trade) return '';
  return trade.SKILLS.join(' • ');
}
