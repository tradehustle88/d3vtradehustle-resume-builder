/**
 * Trade-Specific AI Prompts for Resume Builder
 * Optimized prompts for different skilled trades professions
 */

export interface TradePrompt {
  id: string;
  name: string;
  icon: string;
  summary: string;
  experience: string;
  skills: string;
  certifications: string;
}

export const tradePrompts: Record<string, TradePrompt> = {
  electrician: {
    id: 'electrician',
    name: 'Electrician',
    icon: '⚡',
    summary: 'Write a professional summary for a journeyman electrician with [X] years of experience in residential and commercial electrical installations, maintenance, and code compliance.',
    experience: 'Create work experience bullet points for an electrician focusing on electrical installations, troubleshooting, safety protocols, and project completion.',
    skills: 'List technical skills for an electrician including electrical systems, tools, safety equipment, blueprint reading, and relevant software.',
    certifications: 'List relevant certifications and licenses for an electrician including state licenses, OSHA certifications, and specialized training.'
  },
  
  plumber: {
    id: 'plumber',
    name: 'Plumber',
    icon: '🔧',
    summary: 'Write a professional summary for a master plumber with [X] years of experience in residential and commercial plumbing systems, pipe installation, and emergency repairs.',
    experience: 'Create work experience bullet points for a plumber highlighting pipe installation, repair work, fixture installation, and customer service excellence.',
    skills: 'List technical skills for a plumber including pipe systems, tools, equipment, blueprint reading, and relevant certifications.',
    certifications: 'List relevant plumbing licenses, certifications, and training including state licenses, backflow prevention, and specialized equipment certifications.'
  },

  hvac: {
    id: 'hvac',
    name: 'HVAC Technician',
    icon: '🌡️',
    summary: 'Write a professional summary for an HVAC technician with [X] years of experience in heating, ventilation, air conditioning installation, maintenance, and energy efficiency optimization.',
    experience: 'Create work experience bullet points for an HVAC technician focusing on system installation, preventive maintenance, troubleshooting, and customer satisfaction.',
    skills: 'List technical skills for an HVAC technician including HVAC systems, diagnostic tools, refrigeration, electrical components, and energy efficiency.',
    certifications: 'List relevant HVAC certifications including EPA certification, NATE certification, manufacturer training, and state licenses.'
  },

  welder: {
    id: 'welder',
    name: 'Welder',
    icon: '🔥',
    summary: 'Write a professional summary for a certified welder with [X] years of experience in structural welding, fabrication, and various welding processes (MIG, TIG, Stick).',
    experience: 'Create work experience bullet points for a welder highlighting welding techniques, fabrication work, quality control, and safety compliance.',
    skills: 'List technical skills for a welder including welding processes, metals knowledge, blueprint reading, fabrication tools, and quality inspection.',
    certifications: 'List relevant welding certifications including AWS certifications, structural welding certifications, and specialized process certifications.'
  },

  carpenter: {
    id: 'carpenter',
    name: 'Carpenter',
    icon: '🔨',
    summary: 'Write a professional summary for an experienced carpenter with [X] years in residential and commercial construction, framing, finish work, and project management.',
    experience: 'Create work experience bullet points for a carpenter focusing on construction projects, framing, finish carpentry, and craftsmanship quality.',
    skills: 'List technical skills for a carpenter including construction techniques, tools, materials, blueprint reading, and measurement precision.',
    certifications: 'List relevant carpentry certifications including OSHA safety training, specialized tool certifications, and construction licenses.'
  },

  mechanic: {
    id: 'mechanic',
    name: 'Automotive Mechanic',
    icon: '🚗',
    summary: 'Write a professional summary for an automotive mechanic with [X] years of experience in vehicle diagnostics, repair, maintenance, and customer service.',
    experience: 'Create work experience bullet points for an automotive mechanic highlighting diagnostic skills, repair expertise, preventive maintenance, and problem-solving abilities.',
    skills: 'List technical skills for an automotive mechanic including diagnostic equipment, automotive systems, tools, computer systems, and manufacturer certifications.',
    certifications: 'List relevant automotive certifications including ASE certifications, manufacturer training, emissions certifications, and safety training.'
  },

  construction: {
    id: 'construction',
    name: 'Construction Worker',
    icon: '👷',
    summary: 'Write a professional summary for a construction worker with [X] years of experience in residential and commercial construction, heavy equipment operation, and safety compliance.',
    experience: 'Create work experience bullet points for a construction worker focusing on construction projects, equipment operation, safety protocols, and teamwork.',
    skills: 'List technical skills for a construction worker including construction techniques, heavy equipment, safety procedures, tools, and project coordination.',
    certifications: 'List relevant construction certifications including OSHA safety training, heavy equipment licenses, and specialized construction certifications.'
  },

  foreman: {
    id: 'foreman',
    name: 'Construction Foreman',
    icon: '👨‍💼',
    summary: 'Write a professional summary for a construction foreman with [X] years of experience leading crews, managing projects, ensuring safety compliance, and coordinating with contractors.',
    experience: 'Create work experience bullet points for a construction foreman highlighting team leadership, project management, safety oversight, and quality control.',
    skills: 'List leadership and technical skills for a construction foreman including team management, project planning, safety protocols, communication, and construction expertise.',
    certifications: 'List relevant foreman certifications including OSHA supervisor training, project management certifications, and leadership development programs.'
  },

  roofer: {
    id: 'roofer',
    name: 'Roofer',
    icon: '🏠',
    summary: 'Write a professional summary for a roofer with [X] years of experience in residential and commercial roofing installation, repair, and weatherproofing systems.',
    experience: 'Create work experience bullet points for a roofer focusing on roofing installation, repair work, safety practices, and weather protection systems.',
    skills: 'List technical skills for a roofer including roofing materials, installation techniques, safety equipment, tools, and weatherproofing methods.',
    certifications: 'List relevant roofing certifications including manufacturer certifications, safety training, and specialized roofing system certifications.'
  },

  painter: {
    id: 'painter',
    name: 'Painter',
    icon: '🎨',
    summary: 'Write a professional summary for a professional painter with [X] years of experience in residential and commercial painting, surface preparation, and finish application.',
    experience: 'Create work experience bullet points for a painter highlighting painting techniques, surface preparation, quality finishes, and customer satisfaction.',
    skills: 'List technical skills for a painter including painting techniques, surface preparation, tools, color matching, and finish application methods.',
    certifications: 'List relevant painting certifications including lead-safe certifications, specialized coating certifications, and safety training.'
  }
};

/**
 * Get prompt for specific trade and section
 */
export function getTradePrompt(tradeId: string, section: keyof Omit<TradePrompt, 'id' | 'name' | 'icon'>): string {
  const trade = tradePrompts[tradeId];
  if (!trade) {
    return `Write professional ${section} content for a skilled trades worker.`;
  }
  return trade[section];
}

/**
 * Replace placeholder values in prompt
 */
export function customizePrompt(prompt: string, yearsExperience?: number, specializations?: string[]): string {
  let customized = prompt;
  
  if (yearsExperience) {
    customized = customized.replace('[X]', yearsExperience.toString());
  }
  
  if (specializations && specializations.length > 0) {
    customized += ` Specializations include: ${specializations.join(', ')}.`;
  }
  
  return customized;
}

/**
 * Get all available trades
 */
export function getAvailableTrades(): TradePrompt[] {
  return Object.values(tradePrompts);
}

/**
 * Enhanced AI generation with trade-specific context
 */
export function generateTradeSpecificPrompt(
  tradeId: string, 
  section: string, 
  yearsExperience?: number, 
  specializations?: string[],
  additionalContext?: string
): string {
  const basePrompt = getTradePrompt(tradeId, section as keyof Omit<TradePrompt, 'id' | 'name' | 'icon'>);
  let customized = customizePrompt(basePrompt, yearsExperience, specializations);
  
  if (additionalContext) {
    customized += ` Additional context: ${additionalContext}`;
  }
  
  customized += ' Focus on professional language, quantifiable achievements, and industry-standard terminology.';
  
  return customized;
}