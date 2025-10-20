'use client';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Section } from '@/lib/firestore';
import { sectionRegistry } from './sections/section-registry';

interface EditableSectionProps {
  section: Section;
  index: number;
  isEditing: boolean;
  onVisibilityChange: (id: string, visible: boolean) => void;
}

export default function EditableSection({ section, index, isEditing, onVisibilityChange }: EditableSectionProps) {
  const layoutRef = doc(db, 'layouts', 'homepage');
  
  const handleTitleBlur = async (e: React.FocusEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent || '';
    try {
      await updateDoc(layoutRef, {
        [`sections.${index}.title`]: newTitle,
      });
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleDescriptionBlur = async (e: React.FocusEvent<HTMLParagraphElement>) => {
    const newDescription = e.currentTarget.textContent || '';
    try {
      await updateDoc(layoutRef, {
        [`sections.${index}.description`]: newDescription,
      });
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const sectionInfo = sectionRegistry[section.id];
  const displayTitle = section.title || sectionInfo?.name || section.id;
  const displayDescription = section.description || sectionInfo?.description || 'Custom section';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-gray-400 cursor-grab">⋮⋮</div>
        <div className="flex-1">
          <h3
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={handleTitleBlur}
            className={`font-medium text-gray-900 ${
              isEditing 
                ? 'outline outline-2 outline-hustleYellow rounded px-2 py-1 hover:bg-yellow-50 focus:bg-yellow-50 transition-colors cursor-text' 
                : ''
            }`}
          >
            {displayTitle}
          </h3>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={handleDescriptionBlur}
            className={`text-sm text-gray-500 mt-1 ${
              isEditing 
                ? 'outline outline-2 outline-hustleBlue rounded px-2 py-1 hover:bg-blue-50 focus:bg-blue-50 transition-colors cursor-text' 
                : ''
            }`}
          >
            {displayDescription}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${section.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {section.visible ? 'Visible' : 'Hidden'}
        </span>
        <label htmlFor={`vis-${section.id}`} className="flex items-center cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              id={`vis-${section.id}`} 
              className="sr-only" 
              checked={section.visible}
              onChange={(e) => onVisibilityChange(section.id, e.target.checked)}
            />
            <div className={`block w-14 h-8 rounded-full ${section.visible ? 'bg-hustleRed' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${section.visible ? 'transform translate-x-6' : ''}`}></div>
          </div>
        </label>
      </div>
    </div>
  );
}
