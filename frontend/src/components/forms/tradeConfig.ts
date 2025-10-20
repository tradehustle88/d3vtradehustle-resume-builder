/**
 * Trade Configuration
 * Define trade-specific certifications, skills, and form customizations
 */

export interface TradeConfig {
  id: string;
  name: string;
  icon: string;
  certifications: string[];
  skills: {
    technical: string[];
    safety: string[];
    soft: string[];
  };
  defaultTitle: string;
  suggestedAchievements: string[];
}

export const TRADE_CONFIGS: Record<string, TradeConfig> = {
  hvac: {
    id: 'hvac',
    name: 'HVAC Technician',
    icon: '❄️',
    defaultTitle: 'HVAC Technician',
    certifications: [
      'EPA 608 Universal',
      'EPA 608 Type I',
      'EPA 608 Type II',
      'NATE Certification',
      'OSHA 10',
      'OSHA 30',
      'R-410A Certification',
      'Welding Certification',
      'Building Performance Institute (BPI)',
    ],
    skills: {
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
    },
    suggestedAchievements: [
      'Reduced service call times by 30% through efficient diagnostics',
      'Maintained 98% customer satisfaction rating',
      'Completed 500+ installations without safety incidents',
      'Increased first-time fix rate to 95%',
    ],
  },

  electrician: {
    id: 'electrician',
    name: 'Electrician',
    icon: '⚡',
    defaultTitle: 'Journeyman Electrician',
    certifications: [
      'State Electrical License',
      'Journeyman License',
      'Master Electrician License',
      'OSHA 10',
      'OSHA 30',
      'NEC Certification',
      'Arc Flash Training',
      'Low Voltage License',
      'Fire Alarm Certification',
    ],
    skills: {
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
    },
    suggestedAchievements: [
      'Completed 200+ residential installations ahead of schedule',
      'Zero electrical code violations over 5 years',
      'Reduced material waste by 15% through accurate estimating',
      'Trained 10 apprentices to journeyman level',
    ],
  },

  plumber: {
    id: 'plumber',
    name: 'Plumber',
    icon: '🔧',
    defaultTitle: 'Licensed Plumber',
    certifications: [
      'State Plumbing License',
      'Journeyman Plumber',
      'Master Plumber',
      'Gas Line Certification',
      'Backflow Prevention Certification',
      'OSHA 10',
      'Medical Gas Installer',
      'Green Plumber Certification',
    ],
    skills: {
      technical: [
        'Pipe Installation',
        'Drain Cleaning',
        'Water Heater Installation',
        'Fixture Installation',
        'Leak Detection',
        'Gas Line Work',
        'Backflow Testing',
        'Blueprint Reading',
      ],
      safety: [
        'Confined Space',
        'Trenching Safety',
        'Gas Safety',
        'PPE Usage',
        'OSHA Compliance',
        'Hazmat Awareness',
      ],
      soft: [
        'Emergency Response',
        'Customer Service',
        'Problem Diagnosis',
        'Time Management',
        'Technical Communication',
      ],
    },
    suggestedAchievements: [
      'Resolved 95% of service calls on first visit',
      'Maintained 99% on-time arrival rate for emergency calls',
      'Completed $2M+ in commercial plumbing projects',
      'Reduced callback rate to below 2%',
    ],
  },

  cdl: {
    id: 'cdl',
    name: 'CDL Driver',
    icon: '🚚',
    defaultTitle: 'Professional CDL Driver',
    certifications: [
      'CDL Class A',
      'CDL Class B',
      'Hazmat Endorsement',
      'Tanker Endorsement',
      'Doubles/Triples Endorsement',
      'TWIC Card',
      'DOT Medical Card',
      'Forklift Certification',
    ],
    skills: {
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
    },
    suggestedAchievements: [
      'Drove 500,000+ miles without accidents',
      'Maintained 100% on-time delivery record',
      'Completed 50+ cross-country hauls per year',
      'Zero DOT violations over 5-year career',
    ],
  },

  maintenance: {
    id: 'maintenance',
    name: 'Maintenance Technician',
    icon: '🔧',
    defaultTitle: 'Maintenance Technician',
    certifications: [
      'HVAC EPA 608',
      'Electrical License (Limited)',
      'Boiler License',
      'OSHA 10',
      'Forklift Certification',
      'Welding Certification',
      'CMRT (Certified Maintenance & Reliability Technician)',
      'Building Automation Certification',
    ],
    skills: {
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
    },
    suggestedAchievements: [
      'Reduced equipment downtime by 40% through PM program',
      'Managed maintenance for 500,000 sq ft facility',
      'Completed 1,000+ work orders annually with 98% satisfaction',
      'Implemented cost-saving initiatives saving $50K annually',
    ],
  },

  custom: {
    id: 'custom',
    name: 'Custom Trade',
    icon: '🛠️',
    defaultTitle: 'Skilled Tradesperson',
    certifications: [
      'State License',
      'OSHA 10',
      'OSHA 30',
      'First Aid/CPR',
      'Industry Certification',
    ],
    skills: {
      technical: [
        'Industry-Specific Skill 1',
        'Industry-Specific Skill 2',
        'Industry-Specific Skill 3',
        'Blueprint Reading',
        'Equipment Operation',
      ],
      safety: [
        'OSHA Compliance',
        'PPE Usage',
        'Hazard Recognition',
        'Safety Protocols',
      ],
      soft: [
        'Problem Solving',
        'Customer Service',
        'Time Management',
        'Team Collaboration',
      ],
    },
    suggestedAchievements: [
      'Completed projects ahead of schedule',
      'Maintained high safety standards',
      'Improved efficiency in key areas',
      'Delivered excellent customer satisfaction',
    ],
  },
};

/**
 * Get configuration for a specific trade
 */
export function getTradeConfig(tradeId: string): TradeConfig {
  return TRADE_CONFIGS[tradeId] || TRADE_CONFIGS.custom;
}

/**
 * Get all available trades
 */
export function getAllTrades(): TradeConfig[] {
  return Object.values(TRADE_CONFIGS);
}

/**
 * Type guard for valid trade IDs
 */
export function isValidTradeId(tradeId: string): tradeId is keyof typeof TRADE_CONFIGS {
  return tradeId in TRADE_CONFIGS;
}
