'use client';

import { forwardRef, ReactNode } from 'react';
import { updateDoc, DocumentReference } from 'firebase/firestore';

interface EditableWrapperProps {
  id: string;
  index: number;
  section: any;
  isEditing: boolean;
  refDoc: DocumentReference;
  children: ReactNode;
}

export default forwardRef<HTMLDivElement, EditableWrapperProps>(function EditableWrapper(
  { id, index, section, isEditing, refDoc, children },
  ref
) {
  async function handleBlur(e: React.FocusEvent<HTMLElement>, field: string) {
    const newValue = e.currentTarget.textContent || '';
    try {
      await updateDoc(refDoc, { [`sections.${index}.${field}`]: newValue });
    } catch (error) {
      console.error('Error updating field:', error);
    }
  }

  return (
    <div
      ref={ref}
      className={`relative transition-all ${
        isEditing ? 'outline outline-2 outline-hustleYellow p-4 my-4 bg-yellow-50/10' : 'my-0'
      }`}
    >
      {/* Component label in edit mode */}
      {isEditing && (
        <div className="absolute -top-3 left-3 bg-hustleYellow text-black text-xs px-2 py-1 rounded font-bold z-10 shadow-sm">
          {section.component || section.id}
        </div>
      )}

      {/* Drag handle in edit mode */}
      {isEditing && (
        <div className="absolute top-2 right-2 text-gray-400 cursor-grab text-2xl z-10">
          ⋮⋮
        </div>
      )}

      {/* Editable headline if exists */}
      {isEditing && section.headline && (
        <h2
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur(e, 'headline')}
          className="text-3xl font-bold text-gray-900 mb-3 outline-none focus:bg-yellow-50 focus:outline-2 focus:outline-hustleYellow rounded px-2 py-1 transition-all"
        >
          {section.headline}
        </h2>
      )}

      {/* Editable description if exists */}
      {isEditing && section.description && (
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur(e, 'description')}
          className="text-gray-600 mb-4 outline-none focus:bg-blue-50 focus:outline-2 focus:outline-hustleBlue rounded px-2 py-1 transition-all"
        >
          {section.description}
        </p>
      )}

      {/* Render child component */}
      <div className={isEditing ? 'pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  );
});
