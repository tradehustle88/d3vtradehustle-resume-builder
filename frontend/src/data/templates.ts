import { ResumeData, hvacResume, electricianResume, plumberResume } from './resumeData';

// Template data for trade-specific resumes
export interface Template {
  id: string;
  trade: string;
  title: string;
  thumbnail: string;
  features: string[];
  description: string;
  previewImage?: string;
  resumeData?: ResumeData; // Resume data for the template
}

export const templates: Template[] = [
  {
    id: "hvac-pro",
    trade: "HVAC",
    title: "HVAC Pro",
    thumbnail: "/assets/templates/hvac-thumb.png",
    description: "Professional HVAC template highlighting EPA certifications, commercial installations, and energy efficiency projects. Perfect for senior technicians and HVAC engineers.",
    features: [
      "ATS-Optimized for HVAC keywords",
      "EPA 608 & OSHA certification callouts",
      "Project showcase section",
      "Editable in Word, PDF, Google Docs"
    ],
    previewImage: "/assets/templates/hvac-preview.png",
    resumeData: hvacResume
  },
  {
    id: "electrician-elite",
    trade: "Electrical",
    title: "Electrician Elite",
    thumbnail: "/assets/templates/electrician-thumb.png",
    description: "Master electrician template emphasizing license numbers, code compliance, and industrial experience. Ideal for journeyman and master electricians.",
    features: [
      "License & certification highlights",
      "NEC code compliance focus",
      "Safety record emphasis",
      "ATS keyword-ready"
    ],
    previewImage: "/assets/templates/electrician-preview.png",
    resumeData: electricianResume
  },
  {
    id: "plumber-master",
    trade: "Plumbing",
    title: "Plumber Master",
    thumbnail: "/assets/templates/plumber-thumb.png",
    description: "Plumbing professional template showcasing license credentials, pipe fitting expertise, and commercial project experience.",
    features: [
      "Master license prominent display",
      "Commercial & residential sections",
      "Code compliance tracking",
      "Instant download ready"
    ],
    previewImage: "/assets/templates/plumber-preview.png",
    resumeData: plumberResume
  },
  {
    id: "welder-certified",
    trade: "Welding",
    title: "Welder Certified",
    thumbnail: "/assets/templates/welder-thumb.png",
    description: "Certified welder template highlighting AWS certifications, welding processes, and structural project work.",
    features: [
      "AWS certification showcase",
      "Process expertise (MIG/TIG/Stick)",
      "Blueprint reading skills",
      "Safety certifications"
    ],
    previewImage: "/assets/templates/welder-preview.png"
  },
  {
    id: "carpenter-craftsman",
    trade: "Carpentry",
    title: "Carpenter Craftsman",
    thumbnail: "/assets/templates/carpenter-thumb.png",
    description: "Master carpenter template emphasizing finish work, framing expertise, and custom woodworking projects.",
    features: [
      "Custom project portfolio",
      "Blueprint & CAD skills",
      "Tool proficiency list",
      "ATS-optimized layout"
    ],
    previewImage: "/assets/templates/carpenter-preview.png"
  },
  {
    id: "mechanic-specialist",
    trade: "Automotive",
    title: "Mechanic Specialist",
    thumbnail: "/assets/templates/mechanic-thumb.png",
    description: "ASE-certified mechanic template featuring diagnostic skills, manufacturer certifications, and repair specialties.",
    features: [
      "ASE certification badges",
      "Diagnostic expertise",
      "Manufacturer training",
      "Shop management skills"
    ],
    previewImage: "/assets/templates/mechanic-preview.png"
  }
];

// Placeholder function to generate mock thumbnails if needed
export const getPlaceholderThumbnail = (trade: string) => {
  return `/assets/templates/${trade.toLowerCase()}-thumb.png`;
};
