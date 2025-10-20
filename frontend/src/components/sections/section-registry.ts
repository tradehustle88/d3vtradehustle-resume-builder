import dynamic from 'next/dynamic';
import CompleteHeroSystem from '../CompleteHeroSystem';

// Lazy load sections for better performance
const ResumeVerifierSection = dynamic(() => import('../ResumeVerifierSection'));
const ProofSection = dynamic(() => import('./ProofSection'));
const VisualSection = dynamic(() => import('./VisualSection'));
const CtaSection = dynamic(() => import('./CtaSection'));

// The section registry maps simple string identifiers to the actual React components.
// This allows us to dynamically render sections based on data from Firestore.
export const sectionRegistry = {
  hero: {
    name: 'Hero Section',
    component: CompleteHeroSystem,
    description: 'The main hero section with the primary call to action.',
  },
  verifier: {
    name: 'ATS Verifier',
    component: ResumeVerifierSection,
    description: 'The section for ATS resume verification.',
  },
  proof: {
    name: 'Proof Section',
    component: ProofSection,
    description: 'Displays social proof and key statistics.',
  },
  visual: {
    name: 'Visual Previews',
    component: VisualSection,
    description: 'Showcases visual features of the resume builder.',
  },
  cta: {
    name: 'Call to Action',
    component: CtaSection,
    description: 'The final call to action section.',
  },
};

export type SectionId = keyof typeof sectionRegistry;
