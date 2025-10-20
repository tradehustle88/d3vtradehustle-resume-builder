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

// Sample Welder resume data
export const welderResume: ResumeData = {
  id: "welder-certified",
  trade: "Welding",
  fullName: "James Thompson",
  title: "Certified Welder - AWS & ASME",
  summary: "AWS-certified welder with 9+ years experience in structural steel, pipeline, and fabrication welding. Expert in MIG, TIG, and Stick welding processes. Proven track record on large industrial projects with zero weld failures.",
  contact: {
    email: "james.thompson@email.com",
    phone: "(555) 456-7890",
    location: "Tulsa, OK",
  },
  coreSkills: [
    "AWS D1.1 Structural Welding",
    "MIG, TIG, Stick Welding",
    "Blueprint & Symbol Reading",
    "Pipe & Pressure Vessel Welding",
    "Weld Inspection & QC",
    "Metal Fabrication",
    "Plasma & Oxy-Fuel Cutting",
    "Rigging & Crane Signals",
  ],
  certifications: [
    "AWS D1.1 Certified Welder",
    "ASME Section IX Certified",
    "6G Pipe Welding Certified",
    "OSHA 30-Hour Construction",
    "Confined Space Entry Certified",
  ],
  experience: [
    {
      position: "Structural Welder",
      company: "Industrial Steel Fabricators",
      location: "Tulsa, OK",
      dates: "2018 - Present",
      responsibilities: [
        "Perform structural welding on commercial construction projects up to $5M",
        "Read and interpret welding blueprints and specifications",
        "Maintain 100% weld inspection pass rate over 6+ years",
        "Train and mentor 5 junior welders on techniques and safety",
      ],
    },
    {
      position: "Pipe Welder",
      company: "Pipeline Services Inc.",
      location: "Tulsa, OK",
      dates: "2015 - 2018",
      responsibilities: [
        "Welded 6-inch to 36-inch carbon steel pipelines",
        "Performed field repairs on existing pipeline systems",
        "Completed 500+ successful weld inspections",
      ],
    },
  ],
  education: [
    {
      degree: "Welding Technology Certificate",
      school: "Tulsa Welding School",
      year: "2015",
    },
  ],
};

// Sample Carpenter resume data
export const carpenterResume: ResumeData = {
  id: "carpenter-craftsman",
  trade: "Carpentry",
  fullName: "David Martinez",
  title: "Master Carpenter & Finish Specialist",
  summary: "Master Carpenter with 11+ years experience in residential and commercial construction. Specialized in custom finish work, cabinet installation, and trim carpentry. Expert in blueprint reading, framing, and project estimation.",
  contact: {
    email: "david.martinez@email.com",
    phone: "(555) 567-8901",
    location: "Denver, CO",
  },
  coreSkills: [
    "Finish Carpentry & Trim Work",
    "Custom Cabinet Installation",
    "Framing & Rough Carpentry",
    "Blueprint Reading & Layout",
    "Door & Window Installation",
    "Deck & Patio Construction",
    "Power Tool Operation",
    "Project Estimation",
  ],
  certifications: [
    "NCCER Carpentry Certification",
    "OSHA 30-Hour Construction",
    "Forklift Operator Certified",
    "First Aid & CPR Certified",
  ],
  experience: [
    {
      position: "Lead Carpenter",
      company: "Premier Custom Homes",
      location: "Denver, CO",
      dates: "2017 - Present",
      responsibilities: [
        "Lead carpentry crews on $2M+ custom home projects",
        "Install custom cabinetry, crown molding, and finish trim",
        "Read and interpret architectural blueprints and shop drawings",
        "Achieved 98% client satisfaction rating on 50+ projects",
      ],
    },
    {
      position: "Framing Carpenter",
      company: "Rocky Mountain Builders",
      location: "Denver, CO",
      dates: "2013 - 2017",
      responsibilities: [
        "Framed residential structures including walls, floors, and roofs",
        "Installed windows, doors, and exterior trim",
        "Maintained strict adherence to building codes",
      ],
    },
  ],
  education: [
    {
      degree: "Carpentry Apprenticeship Program",
      school: "Denver Trade School",
      year: "2013",
    },
  ],
};

// Sample Mechanic resume data
export const mechanicResume: ResumeData = {
  id: "mechanic-specialist",
  trade: "Automotive",
  fullName: "Robert Chen",
  title: "ASE Master Automotive Technician",
  summary: "ASE Master Certified automotive technician with 10+ years diagnosing and repairing domestic and import vehicles. Expert in engine diagnostics, electrical systems, and transmission repair. Factory-trained on Ford, Toyota, and Honda platforms.",
  contact: {
    email: "robert.chen@email.com",
    phone: "(555) 678-9012",
    location: "Detroit, MI",
  },
  coreSkills: [
    "Engine Diagnostics & Repair",
    "Transmission Service & Rebuild",
    "Electrical System Diagnostics",
    "Brake & Suspension Systems",
    "HVAC System Repair",
    "OBD-II Scan Tool Operation",
    "Hybrid & Electric Vehicle Service",
    "Customer Service & Estimates",
  ],
  certifications: [
    "ASE Master Automobile Technician",
    "ASE L1 Advanced Engine Performance",
    "Ford Factory Certified Technician",
    "Toyota T-TEN Graduate",
    "Hybrid Vehicle Safety Certified",
  ],
  experience: [
    {
      position: "Master Technician",
      company: "Metro Auto Service Center",
      location: "Detroit, MI",
      dates: "2018 - Present",
      responsibilities: [
        "Diagnose and repair 20+ vehicles per week across all makes/models",
        "Lead technician for complex electrical and engine diagnostics",
        "Mentor 4 junior technicians on diagnostic procedures",
        "Maintain 95% first-time-fix rate on repairs",
      ],
    },
    {
      position: "Automotive Technician",
      company: "Ford Dealership of Detroit",
      location: "Detroit, MI",
      dates: "2014 - 2018",
      responsibilities: [
        "Performed factory-scheduled maintenance and warranty repairs",
        "Specialized in Ford EcoBoost engine diagnostics",
        "Completed 500+ successful diagnostic repairs",
      ],
    },
  ],
  education: [
    {
      degree: "Automotive Technology Degree",
      school: "UTI - Universal Technical Institute",
      year: "2014",
    },
  ],
};

// Export all resume data
export const resumeDataByTrade = {
  hvac: hvacResume,
  electrical: electricianResume,
  plumbing: plumberResume,
  welding: welderResume,
  carpentry: carpenterResume,
  automotive: mechanicResume,
};

// Default export for backward compatibility
export default hvacResume;
