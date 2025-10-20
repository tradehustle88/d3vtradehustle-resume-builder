import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SectionId } from '../components/sections/section-registry';

export interface Section {
  id: SectionId;
  visible: boolean;
}

export interface PageLayout {
  sections: Section[];
  updatedAt: Date;
}

const homepageLayoutDocRef = doc(db, 'layouts', 'homepage');

/**
 * Fetches the homepage layout from Firestore.
 * @returns A promise that resolves to the PageLayout object or null if it doesn't exist.
 */
export async function getHomepageLayout(): Promise<PageLayout | null> {
  try {
    const docSnap = await getDoc(homepageLayoutDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        sections: data.sections,
        updatedAt: data.updatedAt.toDate(),
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}

/**
 * Updates the homepage layout in Firestore.
 * @param sections - The new array of sections to save.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateHomepageLayout(sections: Section[]): Promise<void> {
  try {
    await setDoc(homepageLayoutDocRef, { 
      sections,
      updatedAt: new Date(),
    }, { merge: true });
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

/**
 * Listens for real-time updates to the homepage layout.
 * @param callback - A function to call with the new layout data.
 * @returns An unsubscribe function.
 */
export function onHomepageLayoutChange(callback: (layout: PageLayout | null) => void) {
  const unsubscribe = onSnapshot(homepageLayoutDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        sections: data.sections,
        updatedAt: data.updatedAt.toDate(),
      });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error in onSnapshot:", error);
  });

  return unsubscribe;
}
