import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ResumeFormData } from '@/components/forms/schema';

/**
 * Save resume progress to Firestore
 */
export async function saveResumeProgress(
  userId: string,
  resumeData: Partial<ResumeFormData>
): Promise<void> {
  try {
    const resumeRef = doc(db, 'resumes', userId);
    await setDoc(
      resumeRef,
      {
        ...resumeData,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving resume progress:', error);
    throw error;
  }
}

/**
 * Load resume progress from Firestore
 */
export async function loadResumeProgress(
  userId: string
): Promise<Partial<ResumeFormData> | null> {
  try {
    const resumeRef = doc(db, 'resumes', userId);
    const resumeSnap = await getDoc(resumeRef);

    if (resumeSnap.exists()) {
      const data = resumeSnap.data();
      // Remove Firestore metadata
      const { lastUpdated, ...resumeData } = data;
      return resumeData as Partial<ResumeFormData>;
    }

    return null;
  } catch (error) {
    console.error('Error loading resume progress:', error);
    return null;
  }
}

/**
 * Export resume to PDF or DOCX format
 * This is a client-side helper that calls the backend API
 */
export async function exportResume(
  resumeData: ResumeFormData,
  format: 'pdf' | 'docx'
): Promise<Blob> {
  const response = await fetch('/api/exportResume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      format,
      resumeData,
    }),
  });

  if (!response.ok) {
    throw new Error('Export failed');
  }

  return await response.blob();
}
