'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  addDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db, auth, onAuthStateChanged, User } from '@/lib/firebase';
import { trackEvent } from '@/lib/analytics';

interface Resume {
  id: string;
  userId: string;
  title: string;
  trade: string;
  template: string;
  atsScore?: number;
  lastEdited: Timestamp;
  createdAt: Timestamp;
  data: {
    profile?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    experience?: any[];
    skills?: any[];
    certifications?: any[];
  };
}

// Resume Card Component
function ResumeCard({ 
  resume, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onShare 
}: { 
  resume: Resume;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onShare: () => void;
}) {
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Never';
    return timestamp.toDate().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getATSScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-yellow-400 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold text-yellow-400 mb-1 group-hover:text-yellow-300">
            {resume.title}
          </h3>
          <p className="text-gray-400 text-sm">
            {resume.trade} • {resume.template}
          </p>
        </div>
        {resume.atsScore && (
          <div className={`text-right ${getATSScoreColor(resume.atsScore)}`}>
            <div className="text-2xl font-bold">{resume.atsScore}</div>
            <div className="text-xs text-gray-400">ATS Score</div>
          </div>
        )}
      </div>

      {/* Preview Info */}
      <div className="mb-4 text-sm text-gray-300">
        <p className="mb-1">
          <span className="text-gray-400">Name:</span> {resume.data?.profile?.name || 'Not set'}
        </p>
        <p className="mb-1">
          <span className="text-gray-400">Experience:</span> {resume.data?.experience?.length || 0} jobs
        </p>
        <p>
          <span className="text-gray-400">Last edited:</span> {formatDate(resume.lastEdited)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2 px-4 rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDuplicate}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
          title="Duplicate Resume"
        >
          📋
        </button>
        <button
          onClick={onShare}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
          title="Share Resume"
        >
          🔗
        </button>
        <button
          onClick={onDelete}
          className="bg-red-900 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition-colors"
          title="Delete Resume"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// Create New Resume Button
function CreateNewResumeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-800/30 border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-yellow-400 hover:bg-gray-800/50 transition-all duration-300 w-full group"
    >
      <div className="text-center">
        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">➕</div>
        <h3 className="font-heading text-xl font-bold text-yellow-400 mb-2">
          Create New Resume
        </h3>
        <p className="text-gray-400">
          Start building your next career move
        </p>
      </div>
    </button>
  );
}

// Main Page Component
export default function MyResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const router = useRouter();

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        router.push('/auth/signin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Resumes listener
  useEffect(() => {
    if (!currentUser) return;

    const resumesQuery = query(
      collection(db, 'resumes'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      resumesQuery,
      (snapshot) => {
        const resumesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Resume[];
        
        setResumes(resumesData.sort((a, b) => 
          b.lastEdited.toMillis() - a.lastEdited.toMillis()
        ));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching resumes:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleEdit = (resumeId: string) => {
    trackEvent('resume_edit_clicked', { resumeId });
    router.push(`/builder/${resumeId}`);
  };

  const handleDuplicate = async (resumeId: string) => {
    if (!currentUser) return;

    try {
      const original = resumes.find(r => r.id === resumeId);
      if (!original) return;

      const duplicate = {
        ...original,
        userId: currentUser.uid,
        title: `${original.title} (Copy)`,
        createdAt: serverTimestamp(),
        lastEdited: serverTimestamp(),
      };

      // Remove the id field
      const { id, ...duplicateData } = duplicate;

      const docRef = await addDoc(collection(db, 'resumes'), duplicateData);
      
      trackEvent('resume_duplicated', { 
        originalId: resumeId, 
        newId: docRef.id 
      });

      alert('✅ Resume duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating resume:', error);
      alert('❌ Failed to duplicate resume. Please try again.');
    }
  };

  const handleDelete = async (resumeId: string) => {
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${resume.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'resumes', resumeId));
      trackEvent('resume_deleted', { resumeId });
      alert('✅ Resume deleted successfully!');
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('❌ Failed to delete resume. Please try again.');
    }
  };

  const handleShare = (resumeId: string) => {
    const shareUrl = `${window.location.origin}/resume/${resumeId}`;
    navigator.clipboard.writeText(shareUrl);
    setShareLink(shareUrl);
    trackEvent('resume_share_link_generated', { resumeId });
    
    setTimeout(() => setShareLink(null), 3000);
  };

  const handleCreateNew = () => {
    trackEvent('create_new_resume_clicked', {});
    router.push('/trade-selection');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚙️</div>
          <p className="text-xl text-gray-300">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-5xl font-bold text-yellow-400 mb-2 brick-shadow">
            MY RESUMES
          </h1>
          <p className="text-xl text-gray-300">
            {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'} Ready to Deploy
          </p>
        </div>

        {/* Share Link Toast */}
        {shareLink && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50">
            ✅ Share link copied to clipboard!
          </div>
        )}

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onEdit={() => handleEdit(resume.id)}
              onDuplicate={() => handleDuplicate(resume.id)}
              onDelete={() => handleDelete(resume.id)}
              onShare={() => handleShare(resume.id)}
            />
          ))}
          
          {/* Create New Resume Card */}
          <CreateNewResumeButton onClick={handleCreateNew} />
        </div>

        {/* Empty State */}
        {resumes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📄</div>
            <h2 className="font-heading text-3xl font-bold text-yellow-400 mb-4">
              No Resumes Yet
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Time to build your first trade-ready resume!
            </p>
            <button
              onClick={handleCreateNew}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Create Your First Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
