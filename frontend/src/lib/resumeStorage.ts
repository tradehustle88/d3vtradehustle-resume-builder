/**
 * Firestore Resume Storage Service
 * Store AI-generated resume content with user context
 */

import { collection, addDoc, query, where, orderBy, limit, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

// Note: You'll need to import your configured Firestore instance
// import { db } from '@/lib/firebase';

/**
 * Resume data structure for Firestore
 */
export interface ResumeData {
  id?: string;
  userId: string;
  userEmail: string;
  trade: string;
  section: 'summary' | 'experience' | 'skills' | 'certifications' | 'custom';
  prompt: string;
  output: string;
  yearsExperience?: number;
  specializations?: string[];
  isRefined?: boolean;
  refinementHistory?: RefinementRecord[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  tags?: string[];
  isFavorite?: boolean;
}

/**
 * Refinement history record
 */
export interface RefinementRecord {
  originalPrompt: string;
  refinedPrompt: string;
  output: string;
  refinedAt: Timestamp;
  refinementType: 'shorten' | 'expand' | 'ats-optimize' | 'rewrite' | 'custom';
}

/**
 * Resume storage service class
 */
export class ResumeStorageService {
  private db: any; // Will be injected or imported based on your Firebase setup
  
  constructor(firestoreDb: any) {
    this.db = firestoreDb;
  }

  /**
   * Save AI-generated resume content
   */
  async saveResumeContent({
    userId,
    userEmail,
    trade,
    section,
    prompt,
    output,
    yearsExperience,
    specializations,
    tags
  }: Omit<ResumeData, 'createdAt' | 'id'>): Promise<string> {
    try {
      const resumeData: Omit<ResumeData, 'id'> = {
        userId,
        userEmail,
        trade,
        section,
        prompt,
        output,
        yearsExperience,
        specializations,
        tags: tags || [trade, section],
        createdAt: Timestamp.now(),
        isRefined: false,
        isFavorite: false
      };

      const docRef = await addDoc(collection(this.db, 'resumes'), resumeData);
      
      console.log('✅ Resume content saved:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error saving resume content:', error);
      throw error;
    }
  }

  /**
   * Get user's resume history
   */
  async getUserResumes(userId: string, limitCount: number = 50): Promise<ResumeData[]> {
    try {
      const q = query(
        collection(this.db, 'resumes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const resumes: ResumeData[] = [];
      
      querySnapshot.forEach((doc) => {
        resumes.push({
          id: doc.id,
          ...doc.data()
        } as ResumeData);
      });

      return resumes;
    } catch (error) {
      console.error('❌ Error fetching user resumes:', error);
      throw error;
    }
  }

  /**
   * Get resumes by trade
   */
  async getResumesByTrade(userId: string, trade: string): Promise<ResumeData[]> {
    try {
      const q = query(
        collection(this.db, 'resumes'),
        where('userId', '==', userId),
        where('trade', '==', trade),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const resumes: ResumeData[] = [];
      
      querySnapshot.forEach((doc) => {
        resumes.push({
          id: doc.id,
          ...doc.data()
        } as ResumeData);
      });

      return resumes;
    } catch (error) {
      console.error('❌ Error fetching resumes by trade:', error);
      throw error;
    }
  }

  /**
   * Save resume refinement
   */
  async saveRefinement(
    resumeId: string,
    refinementData: Omit<RefinementRecord, 'refinedAt'>
  ): Promise<void> {
    try {
      const resumeRef = doc(this.db, 'resumes', resumeId);
      
      const refinementRecord: RefinementRecord = {
        ...refinementData,
        refinedAt: Timestamp.now()
      };

      // Update the document with refinement data
      await updateDoc(resumeRef, {
        isRefined: true,
        updatedAt: Timestamp.now(),
        refinementHistory: [...(refinementData as any).refinementHistory || [], refinementRecord]
      });

      console.log('✅ Refinement saved for resume:', resumeId);
    } catch (error) {
      console.error('❌ Error saving refinement:', error);
      throw error;
    }
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(resumeId: string, isFavorite: boolean): Promise<void> {
    try {
      const resumeRef = doc(this.db, 'resumes', resumeId);
      await updateDoc(resumeRef, {
        isFavorite,
        updatedAt: Timestamp.now()
      });

      console.log('✅ Favorite status updated:', resumeId);
    } catch (error) {
      console.error('❌ Error updating favorite status:', error);
      throw error;
    }
  }

  /**
   * Delete resume
   */
  async deleteResume(resumeId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, 'resumes', resumeId));
      console.log('✅ Resume deleted:', resumeId);
    } catch (error) {
      console.error('❌ Error deleting resume:', error);
      throw error;
    }
  }

  /**
   * Get resume analytics for user
   */
  async getResumeAnalytics(userId: string): Promise<{
    totalResumes: number;
    favoriteResumes: number;
    tradeBreakdown: Record<string, number>;
    sectionBreakdown: Record<string, number>;
    recentActivity: ResumeData[];
  }> {
    try {
      const resumes = await this.getUserResumes(userId, 1000); // Get all for analytics
      
      const analytics = {
        totalResumes: resumes.length,
        favoriteResumes: resumes.filter(r => r.isFavorite).length,
        tradeBreakdown: {} as Record<string, number>,
        sectionBreakdown: {} as Record<string, number>,
        recentActivity: resumes.slice(0, 10) // Last 10 activities
      };

      // Calculate breakdowns
      resumes.forEach(resume => {
        analytics.tradeBreakdown[resume.trade] = (analytics.tradeBreakdown[resume.trade] || 0) + 1;
        analytics.sectionBreakdown[resume.section] = (analytics.sectionBreakdown[resume.section] || 0) + 1;
      });

      return analytics;
    } catch (error) {
      console.error('❌ Error getting analytics:', error);
      throw error;
    }
  }
}

/**
 * Hook for using resume storage with authentication
 */
export function useResumeStorage() {
  // This would integrate with your Firebase Auth and Firestore setup
  // For now, returning null - you'll need to implement based on your Firebase config
  
  const saveResume = async (resumeData: Omit<ResumeData, 'createdAt' | 'id' | 'userId' | 'userEmail'>) => {
    // TODO: Get current user from Firebase Auth
    // const user = getCurrentUser();
    // const storage = new ResumeStorageService(db);
    // return storage.saveResumeContent({ ...resumeData, userId: user.uid, userEmail: user.email });
    
    console.log('📝 Would save resume data:', resumeData);
    return Promise.resolve('mock-id');
  };

  const getUserResumes = async () => {
    // TODO: Implement with actual Firebase Auth user
    console.log('📋 Would fetch user resumes');
    return Promise.resolve([]);
  };

  return {
    saveResume,
    getUserResumes,
    // Add other methods as needed
  };
}

/**
 * Utility functions for resume data
 */
export const resumeUtils = {
  /**
   * Format resume for export
   */
  formatForExport(resume: ResumeData): string {
    return `# ${resume.section.toUpperCase()}\n\n${resume.output}\n\n---\nGenerated with Trade Hustle Resume Builder\nTrade: ${resume.trade}\nPrompt: ${resume.prompt}`;
  },

  /**
   * Generate tags from content
   */
  generateTags(resume: Omit<ResumeData, 'tags'>): string[] {
    const baseTags = [resume.trade, resume.section];
    
    if (resume.yearsExperience) {
      if (resume.yearsExperience <= 2) baseTags.push('entry-level');
      else if (resume.yearsExperience <= 5) baseTags.push('mid-level');
      else baseTags.push('senior-level');
    }
    
    if (resume.isRefined) baseTags.push('refined');
    if (resume.isFavorite) baseTags.push('favorite');
    
    return baseTags;
  },

  /**
   * Search resumes by content
   */
  searchResumes(resumes: ResumeData[], searchTerm: string): ResumeData[] {
    const term = searchTerm.toLowerCase();
    return resumes.filter(resume => 
      resume.output.toLowerCase().includes(term) ||
      resume.prompt.toLowerCase().includes(term) ||
      resume.trade.toLowerCase().includes(term) ||
      resume.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }
};

/**
 * Example usage in a component:
 * 
 * const { saveResume } = useResumeStorage();
 * 
 * await saveResume({
 *   trade: 'electrician',
 *   section: 'summary',
 *   prompt: 'Write a professional summary...',
 *   output: 'Professional electrician with...',
 *   yearsExperience: 5
 * });
 */
