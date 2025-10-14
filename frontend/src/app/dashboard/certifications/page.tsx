'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage, auth, onAuthStateChanged, User } from '@/lib/firebase';
import { trackEvent } from '@/lib/analytics';

interface Certification {
  id: string;
  userId: string;
  name: string;
  issuer: string;
  issueDate: Timestamp;
  expirationDate?: Timestamp;
  certificateNumber?: string;
  fileUrl?: string;
  fileName?: string;
  trade?: string;
  verified: boolean;
}

// Expiration Alert Component
function ExpirationAlerts({ certs }: { certs: Certification[] }) {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const expiringSoon = certs.filter(cert => {
    if (!cert.expirationDate) return false;
    const expDate = cert.expirationDate.toDate();
    return expDate > now && expDate <= thirtyDaysFromNow;
  });

  const expired = certs.filter(cert => {
    if (!cert.expirationDate) return false;
    return cert.expirationDate.toDate() < now;
  });

  if (expiringSoon.length === 0 && expired.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      {/* Expired */}
      {expired.length > 0 && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-6">
          <h2 className="font-heading text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
            ⚠️ Expired Certifications ({expired.length})
          </h2>
          <div className="space-y-2">
            {expired.map(cert => (
              <div key={cert.id} className="bg-gray-800/50 rounded p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{cert.name}</p>
                  <p className="text-sm text-gray-400">{cert.issuer}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-bold">
                    Expired {cert.expirationDate?.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expiring Soon */}
      {expiringSoon.length > 0 && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6">
          <h2 className="font-heading text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            ⏰ Expiring Soon ({expiringSoon.length})
          </h2>
          <div className="space-y-2">
            {expiringSoon.map(cert => (
              <div key={cert.id} className="bg-gray-800/50 rounded p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{cert.name}</p>
                  <p className="text-sm text-gray-400">{cert.issuer}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold">
                    Expires {cert.expirationDate?.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Cert Card Component
function CertCard({ 
  cert, 
  onShare, 
  onDelete,
  onDownload 
}: { 
  cert: Certification;
  onShare: () => void;
  onDelete: () => void;
  onDownload: () => void;
}) {
  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getExpirationStatus = () => {
    if (!cert.expirationDate) return { color: 'text-gray-400', text: 'No expiration' };
    
    const expDate = cert.expirationDate.toDate();
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expDate < now) {
      return { color: 'text-red-400', text: 'Expired' };
    } else if (expDate <= thirtyDaysFromNow) {
      return { color: 'text-yellow-400', text: 'Expiring Soon' };
    } else {
      return { color: 'text-green-400', text: 'Active' };
    }
  };

  const status = getExpirationStatus();

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-yellow-400 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold text-yellow-400 mb-1 group-hover:text-yellow-300">
            {cert.name}
          </h3>
          <p className="text-gray-400 text-sm">{cert.issuer}</p>
          {cert.trade && (
            <p className="text-gray-500 text-xs mt-1">🔧 {cert.trade}</p>
          )}
        </div>
        <div className={`text-right ${status.color}`}>
          <div className="text-lg font-bold">{status.text}</div>
          {cert.verified && (
            <div className="text-xs text-green-400 flex items-center gap-1 justify-end">
              ✓ Verified
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mb-4 text-sm space-y-1">
        <p className="text-gray-300">
          <span className="text-gray-400">Issued:</span> {formatDate(cert.issueDate)}
        </p>
        {cert.expirationDate && (
          <p className="text-gray-300">
            <span className="text-gray-400">Expires:</span> {formatDate(cert.expirationDate)}
          </p>
        )}
        {cert.certificateNumber && (
          <p className="text-gray-300">
            <span className="text-gray-400">Cert #:</span> {cert.certificateNumber}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {cert.fileUrl && (
          <button
            onClick={onDownload}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2 px-4 rounded transition-colors"
          >
            📄 View
          </button>
        )}
        <button
          onClick={onShare}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
          title="Share Certificate"
        >
          🔗
        </button>
        <button
          onClick={onDelete}
          className="bg-red-900 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition-colors"
          title="Delete Certificate"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// Upload Modal Component
function UploadCertModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Certification>, file?: File) => void;
}) {
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    certificateNumber: '',
    trade: '',
    verified: false,
  });
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        ...formData,
        issueDate: issueDate ? Timestamp.fromDate(new Date(issueDate)) : undefined,
        expirationDate: expirationDate ? Timestamp.fromDate(new Date(expirationDate)) : undefined,
      },
      file || undefined
    );
    
    // Reset form
    setFormData({
      name: '',
      issuer: '',
      certificateNumber: '',
      trade: '',
      verified: false,
    });
    setIssueDate('');
    setExpirationDate('');
    setFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-yellow-400">
              Add Certification
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Certification Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                placeholder="OSHA 10-Hour Construction"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Issuing Organization *</label>
              <input
                type="text"
                required
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                placeholder="OSHA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Issue Date *</label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Expiration Date</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Certificate Number</label>
                <input
                  type="text"
                  value={formData.certificateNumber}
                  onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                  placeholder="ABC-123456"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Trade</label>
                <input
                  type="text"
                  value={formData.trade}
                  onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                  placeholder="Electrician"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Upload Certificate (PDF, JPG, PNG)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
              />
              {file && (
                <p className="text-sm text-green-400 mt-2">
                  ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded transition-colors"
              >
                Add Certification
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function CertVaultPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
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

  // Certifications listener
  useEffect(() => {
    if (!currentUser) return;

    const certsQuery = query(
      collection(db, 'certifications'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      certsQuery,
      (snapshot) => {
        const certsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Certification[];
        
        setCerts(certsData.sort((a, b) => {
          if (!a.expirationDate) return 1;
          if (!b.expirationDate) return -1;
          return a.expirationDate.toMillis() - b.expirationDate.toMillis();
        }));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching certifications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleUpload = async (data: Partial<Certification>, file?: File) => {
    if (!currentUser) return;

    setUploading(true);

    try {
      let fileUrl = '';
      let fileName = '';

      // Upload file to Firebase Storage if provided
      if (file) {
        const storageRef = ref(storage, `certifications/${currentUser.uid}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
        fileName = file.name;
      }

      // Add to Firestore
      await addDoc(collection(db, 'certifications'), {
        ...data,
        userId: currentUser.uid,
        fileUrl,
        fileName,
        createdAt: serverTimestamp(),
      });

      trackEvent('certification_added', { 
        name: data.name, 
        issuer: data.issuer 
      });

      setShowUploadModal(false);
      alert('✅ Certification added successfully!');
    } catch (error) {
      console.error('Error uploading certification:', error);
      alert('❌ Failed to add certification. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (certId: string) => {
    const cert = certs.find(c => c.id === certId);
    if (!cert) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${cert.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Delete file from storage if exists
      if (cert.fileUrl) {
        try {
          const fileRef = ref(storage, cert.fileUrl);
          await deleteObject(fileRef);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'certifications', certId));
      
      trackEvent('certification_deleted', { certId });
      alert('✅ Certification deleted successfully!');
    } catch (error) {
      console.error('Error deleting certification:', error);
      alert('❌ Failed to delete certification. Please try again.');
    }
  };

  const handleShare = (certId: string) => {
    const shareUrl = `${window.location.origin}/cert/${certId}`;
    navigator.clipboard.writeText(shareUrl);
    setShareLink(shareUrl);
    trackEvent('certification_share_link_generated', { certId });
    
    setTimeout(() => setShareLink(null), 3000);
  };

  const handleDownload = (cert: Certification) => {
    if (cert.fileUrl) {
      window.open(cert.fileUrl, '_blank');
      trackEvent('certification_downloaded', { certId: cert.id });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <p className="text-xl text-gray-300">Loading your certifications...</p>
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
            CERT VAULT
          </h1>
          <p className="text-xl text-gray-300">
            {certs.length} {certs.length === 1 ? 'Certification' : 'Certifications'} Secured
          </p>
        </div>

        {/* Share Link Toast */}
        {shareLink && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50">
            ✅ Share link copied to clipboard!
          </div>
        )}

        {/* Expiration Alerts */}
        <ExpirationAlerts certs={certs} />

        {/* Upload Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowUploadModal(true)}
            disabled={uploading}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? '⏳ Uploading...' : '📤 Add Certification'}
          </button>
        </div>

        {/* Certs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <CertCard
              key={cert.id}
              cert={cert}
              onShare={() => handleShare(cert.id)}
              onDelete={() => handleDelete(cert.id)}
              onDownload={() => handleDownload(cert)}
            />
          ))}
        </div>

        {/* Empty State */}
        {certs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="font-heading text-3xl font-bold text-yellow-400 mb-4">
              No Certifications Yet
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start building your professional credential library!
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Add Your First Certification
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadCertModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUpload}
      />
    </div>
  );
}
