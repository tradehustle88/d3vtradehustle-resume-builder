'use client'

import { useState, useEffect } from 'react';
import TopNavBar from './TopNavBar'
import { sectionRegistry } from './sections/section-registry';
import { onHomepageLayoutChange, PageLayout, updateHomepageLayout } from '@/lib/firestore';

const defaultLayout: PageLayout = {
  sections: [
    { id: 'hero', visible: true },
    { id: 'verifier', visible: true },
    { id: 'proof', visible: true },
    { id: 'visual', visible: true },
    { id: 'cta', visible: true },
  ],
  updatedAt: new Date(),
};

export default function LandingPage() {
  const [layout, setLayout] = useState<PageLayout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onHomepageLayoutChange((newLayout) => {
      if (newLayout) {
        setLayout(newLayout);
      } else {
        // No layout found, initialize with default
        updateHomepageLayout(defaultLayout.sections);
        setLayout(defaultLayout);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutralBg text-neutralText">
        <TopNavBar />
        <div className="text-center py-20">Loading Page Layout...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutralBg text-neutralText">
      <TopNavBar />
      
      {layout?.sections.map(sectionConfig => {
        if (!sectionConfig.visible) {
          return null;
        }
        const SectionComponent = sectionRegistry[sectionConfig.id]?.component;
        return SectionComponent ? <SectionComponent key={sectionConfig.id} /> : null;
      })}
    </main>
  )
}
