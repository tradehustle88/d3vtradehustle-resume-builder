// Base resume data structure that can be customized per trade
export interface ResumeData {
  id: string;
  trade: string;
  fullName: string;
  title: string;
  summary: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
  };
  coreSkills: string[];
  certifications: string[];
  experience: Array<{
    position: string;
    company: string;
    location: string;
    dates: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
}

// Sample HVAC resume data
export const hvacResume: ResumeData = {
  id: "hvac-pro",
  trade: "HVAC",
  fullName: "John Smith",
  title: "Certified HVAC Technician",
  summary: "EPA-certified HVAC technician with 8+ years installing, maintaining, and repairing commercial and residential climate control systems. Expertise in troubleshooting complex HVAC issues, ensuring energy efficiency, and maintaining code compliance.",
  contact: {
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    location: "Houston, TX",
  },
  coreSkills: [
    "EPA 608 Universal Certification",
    "Commercial & Residential HVAC",
    "System Diagnostics & Repair",
    "Energy Efficiency Optimization",
    "Blueprint Reading",
    "HVAC Load Calculations",
    "Preventive Maintenance",
    "Code Compliance (UMC, IMC)",
  ],
  certifications: [
    "EPA 608 Universal Certification",
    "OSHA 30-Hour Construction",
    "NATE Certified (Installation & Service)",
    "Texas Contractor License #12345",
  ],
  experience: [
    {
      position: "Senior HVAC Technician",
      company: "Climate Control Solutions",
      location: "Houston, TX",
      dates: "2019 - Present",
      responsibilities: [
        "Install and maintain 50+ commercial HVAC systems annually",
        "Reduced energy costs by 25% through system optimization",
        "Lead team of 4 junior technicians on large-scale projects",
        "Ensure all installations meet local code requirements",
      ],
    },
    {
      position: "HVAC Technician",
      company: "ABC Mechanical Services",
      location: "Houston, TX",
      dates: "2016 - 2019",
      responsibilities: [
        "Diagnosed and repaired residential HVAC systems",
        "Performed preventive maintenance on 200+ units annually",
        "Achieved 98% customer satisfaction rating",
      ],
    },
  ],
  education: [
    {
      degree: "HVAC Technical Certification",
      school: "Houston Technical Institute",
      year: "2016",
    },
  ],
};

// Sample Electrician resume data
export const electricianResume: ResumeData = {
  id: "electrician-elite",
  trade: "Electrical",
  fullName: "Mike Johnson",
  title: "Licensed Master Electrician",
  summary: "Master Electrician with 10+ years experience in commercial and residential electrical installations. Specialized in industrial controls, PLC programming, and NEC code compliance. Licensed in Texas and Louisiana with proven safety record.",
  contact: {
    email: "mike.johnson@email.com",
    phone: "(555) 234-5678",
    location: "Dallas, TX",
  },
  coreSkills: [
    "NEC Code Compliance",
    "Industrial Electrical Systems",
    "PLC Programming",
    "Blueprint & Schematic Reading",
    "Conduit Bending & Installation",
    "Motor Controls",
    "Safety Protocols & OSHA",
    "Commercial Wiring",
  ],
  certifications: [
    "Texas Master Electrician License #ME-54321",
    "OSHA 30-Hour Construction Safety",
    "Arc Flash Certified",
    "First Aid & CPR Certified",
  ],
  experience: [
    {
      position: "Master Electrician",
      company: "Tri-State Electric",
      location: "Dallas, TX",
      dates: "2018 - Present",
      responsibilities: [
        "Lead electrical installations on $2M+ commercial projects",
        "Supervise crew of 8 journeymen and apprentices",
        "Ensure all work meets NEC and local code requirements",
        "Zero safety incidents over 5+ years",
      ],
    },
  ],
  education: [
    {
      degree: "Journeyman Electrician Program",
      school: "Dallas Electrical Academy",
      year: "2013",
    },
  ],
};

// Sample Plumber resume data
export const plumberResume: ResumeData = {
  id: "plumber-master",
  trade: "Plumbing",
  fullName: "Carlos Rodriguez",
  title: "Licensed Master Plumber",
  summary: "Master Plumber with 12+ years installing and repairing commercial and residential plumbing systems. Expert in pipe fitting, water heater installation, and drain cleaning. Licensed in multiple states with excellent safety record.",
  contact: {
    email: "carlos.rodriguez@email.com",
    phone: "(555) 345-6789",
    location: "Phoenix, AZ",
  },
  coreSkills: [
    "Commercial & Residential Plumbing",
    "Pipe Fitting & Installation",
    "Water Heater Systems",
    "Drain Cleaning & Repair",
    "Blueprint Reading",
    "Code Compliance (UPC, IPC)",
    "Gas Line Installation",
    "Backflow Prevention",
  ],
  certifications: [
    "Arizona Master Plumber License #MP-98765",
    "Backflow Prevention Certified",
    "OSHA 30-Hour Construction",
    "Medical Gas Installer Certified",
  ],
  experience: [
    {
      position: "Master Plumber",
      company: "Desert Plumbing Services",
      location: "Phoenix, AZ",
      dates: "2015 - Present",
      responsibilities: [
        "Complete plumbing installations on 100+ residential units",
        "Lead commercial plumbing projects up to $500K",
        "Train and mentor 6 apprentice plumbers",
        "Maintain 100% code compliance rate",
      ],
    },
  ],
  education: [
    {
      degree: "Plumbing Apprenticeship Program",
      school: "Arizona Plumbing Academy",
      year: "2010",
    },
  ],
};

// Export all resume data
export const resumeDataByTrade = {
  hvac: hvacResume,
  electrical: electricianResume,
  plumbing: plumberResume,
};

// Default export for backward compatibility
export default hvacResume;
