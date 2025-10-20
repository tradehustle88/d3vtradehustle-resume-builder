'use client';

import { useState, useEffect } from 'react';
import { onHomepageLayoutChange, updateHomepageLayout, Section } from '../lib/firestore';
import { sectionRegistry } from './sections/section-registry';
import SortableList from './dnd/SortableList';
import SortableItem from './dnd/SortableItem';
import EditableSection from './EditableSection';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

// A simple debounce function to prevent too many writes to Firestore
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export default function StudioBuilder() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isEditing, setIsEditing] = useState(false);

  // Debounced update function
  const debouncedUpdate = debounce(async (newSections: Section[]) => {
    try {
      setSaveStatus('saving');
      await updateHomepageLayout(newSections);
      setSaveStatus('saved');
    } catch (e) {
      console.error("Failed to save layout:", e);
      setError('Failed to save layout.');
      setSaveStatus('error');
    }
  }, 500);

  useEffect(() => {
    const unsubscribe = onHomepageLayoutChange((layout) => {
      if (layout && Array.isArray(layout.sections)) {
        // Ensure all sections from the registry are present, even if new ones were added
        const allSectionIds = Object.keys(sectionRegistry);
        const layoutSectionIds = new Set(layout.sections.map(s => s.id));
        const newSections = allSectionIds.map(id => {
            const existing = layout.sections.find(s => s.id === id);
            if (existing) return existing;
            return { id: id as keyof typeof sectionRegistry, visible: true };
        });
        
        // Filter out any sections that are no longer in the registry
        const filteredSections = newSections.filter(s => allSectionIds.includes(s.id));

        setSections(filteredSections);
      } else {
        // If no layout exists in Firestore, create one from the registry
        const defaultLayout = Object.keys(sectionRegistry).map(id => ({
          id: id as keyof typeof sectionRegistry,
          visible: true,
        }));
        setSections(defaultLayout);
        updateHomepageLayout(defaultLayout); // Initialize in Firestore
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleReorder = (reorderedSections: Section[]) => {
    setSections(reorderedSections);
    debouncedUpdate(reorderedSections);
  };

  const handleVisibilityChange = (id: string, visible: boolean) => {
    const newSections = sections.map(section =>
      section.id === id ? { ...section, visible } : section
    );
    setSections(newSections);
    debouncedUpdate(newSections);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50">Loading Studio...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-red-50 text-red-700">{error}</div>;
  }

  const getSaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saved':
        return <span className="text-sm text-green-600">All changes saved</span>;
      case 'saving':
        return <span className="text-sm text-yellow-600 animate-pulse">Saving...</span>;
      case 'error':
        return <span className="text-sm text-red-600">Save failed</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Trade Hustle Studio</h1>
            <p className="text-sm text-gray-500">
              {isEditing ? 'Click any text to edit inline' : 'Drag and drop to reorder your homepage sections'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {getSaveStatusIndicator()}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded font-bold transition-colors ${
                isEditing 
                  ? 'bg-hustleYellow text-black hover:bg-yellow-500' 
                  : 'bg-gray-700 text-white hover:bg-gray-800'
              }`}
            >
              {isEditing ? '✓ Exit Edit Mode' : '✏️ Edit Mode'}
            </button>
            <button
              onClick={() => signOut(auth)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SortableList
          items={sections}
          onReorder={handleReorder}
          getId={(item) => item.id}
        >
          {(section, index) => (
            <SortableItem key={section.id} id={section.id}>
              <EditableSection 
                section={section} 
                index={index || 0} 
                isEditing={isEditing}
                onVisibilityChange={handleVisibilityChange}
              />
            </SortableItem>
          )}
        </SortableList>
      </main>
    </div>
  );
}
