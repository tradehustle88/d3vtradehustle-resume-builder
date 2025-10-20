'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import EditableWrapper from '@/components/EditableWrapper';
import SortableItem from '@/components/dnd/SortableItem';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Map real components - dynamically imported for performance
const componentMap: Record<string, any> = {
  CompleteHeroSystem: dynamic(() => import('@/components/CompleteHeroSystem')),
  ResumeVerifierSection: dynamic(() => import('@/components/ResumeVerifierSection')),
  ProofSection: dynamic(() => import('@/components/sections/ProofSection')),
  VisualSection: dynamic(() => import('@/components/sections/VisualSection')),
  CtaSection: dynamic(() => import('@/components/sections/CtaSection')),
};

interface Section {
  id: string;
  component: string;
  headline?: string;
  description?: string;
  visible: boolean;
  order?: number;
  [key: string]: any;
}

export default function StudioPreview() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const layoutRef = doc(db, 'layouts', 'homepage');
  const [sections, setSections] = useState<Section[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/studio');
    }
  }, [user, authLoading, router]);

  // Listen to Firestore layout changes
  useEffect(() => {
    const unsub = onSnapshot(layoutRef, (snap) => {
      const data = snap.data();
      if (data && Array.isArray(data.sections)) {
        setSections(data.sections);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex);
    
    setSections(reordered);
    await updateDoc(layoutRef, { sections: reordered });
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        Loading Studio Preview...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 relative">
      {/* Fixed Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Trade Hustle Studio Preview</h1>
          <p className="text-sm text-gray-500">
            {isEditing ? 'Live editing mode - click any text to edit' : 'Preview mode - see your homepage live'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/studio')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ← Back to Studio
          </button>
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

      {/* Live Preview with Drag & Drop */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((sec, index) => {
            if (!sec.visible) return null;
            
            const Component = componentMap[sec.component];
            if (!Component) {
              return (
                <div key={sec.id} className="p-8 text-center bg-red-50 text-red-600">
                  Component "{sec.component}" not found
                </div>
              );
            }

            return (
              <SortableItem key={sec.id} id={sec.id}>
                <EditableWrapper
                  id={sec.id}
                  index={index}
                  section={sec}
                  isEditing={isEditing}
                  refDoc={layoutRef}
                >
                  <Component editable={isEditing} {...sec} />
                </EditableWrapper>
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>

      {/* Floating hint when in edit mode */}
      {isEditing && (
        <div className="fixed bottom-6 right-6 bg-hustleYellow text-black px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <p className="text-sm font-medium">🎨 Edit Mode Active</p>
          <p className="text-xs mt-1">
            Drag sections by the ⋮⋮ handle, click text to edit inline
          </p>
        </div>
      )}
    </main>
  );
}
