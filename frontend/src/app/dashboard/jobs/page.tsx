'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db, auth, onAuthStateChanged, User } from '@/lib/firebase';
import { trackEvent } from '@/lib/analytics';

type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

interface JobApplication {
  id: string;
  userId: string;
  company: string;
  position: string;
  trade: string;
  status: ApplicationStatus;
  appliedDate: Timestamp;
  interviewDate?: Timestamp;
  notes?: string;
  jobUrl?: string;
  salary?: string;
  location?: string;
}

// Status color mapping
const statusColors = {
  applied: 'bg-blue-600',
  interview: 'bg-yellow-600',
  offer: 'bg-green-600',
  rejected: 'bg-red-600',
};

const statusLabels = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

// Application Card Component
function ApplicationCard({ 
  application, 
  onStatusChange, 
  onEdit, 
  onDelete 
}: { 
  application: JobApplication;
  onStatusChange: (newStatus: ApplicationStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return 'Not set';
    return timestamp.toDate().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-yellow-400 transition-all cursor-move group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-heading text-lg font-bold text-yellow-400 mb-1">
            {application.position}
          </h3>
          <p className="text-gray-300 text-sm font-semibold">
            {application.company}
          </p>
          <p className="text-gray-400 text-xs">
            {application.trade} {application.location && `• ${application.location}`}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mb-3 text-xs text-gray-400 space-y-1">
        <p>📅 Applied: {formatDate(application.appliedDate)}</p>
        {application.interviewDate && (
          <p>📞 Interview: {formatDate(application.interviewDate)}</p>
        )}
        {application.salary && (
          <p>💰 Salary: {application.salary}</p>
        )}
      </div>

      {/* Status Dropdown */}
      <select
        value={application.status}
        onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}
        className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm hover:border-yellow-400 transition-colors"
      >
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
      </select>

      {/* Notes */}
      {application.notes && (
        <p className="mt-3 text-xs text-gray-400 border-t border-gray-700 pt-2">
          📝 {application.notes}
        </p>
      )}

      {/* Job URL */}
      {application.jobUrl && (
        <a
          href={application.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs text-blue-400 hover:text-blue-300 block"
        >
          🔗 View Job Posting →
        </a>
      )}
    </div>
  );
}

// Kanban Column Component
function KanbanColumn({ 
  status, 
  applications, 
  onStatusChange, 
  onEdit, 
  onDelete 
}: {
  status: ApplicationStatus;
  applications: JobApplication[];
  onStatusChange: (appId: string, newStatus: ApplicationStatus) => void;
  onEdit: (appId: string) => void;
  onDelete: (appId: string) => void;
}) {
  return (
    <div className="flex-1 min-w-[280px]">
      {/* Column Header */}
      <div className={`${statusColors[status]} text-white font-bold py-3 px-4 rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <span className="text-lg">{statusLabels[status]}</span>
          <span className="bg-white/20 px-2 py-1 rounded text-sm">
            {applications.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="bg-gray-900/30 border-x border-b border-gray-700 rounded-b-lg p-3 min-h-[400px]">
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onStatusChange={(newStatus) => onStatusChange(app.id, newStatus)}
              onEdit={() => onEdit(app.id)}
              onDelete={() => onDelete(app.id)}
            />
          ))}
          {applications.length === 0 && (
            <p className="text-gray-500 text-center py-8 text-sm">
              No applications yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Upcoming Interviews Component
function UpcomingInterviews({ applications }: { applications: JobApplication[] }) {
  const upcomingInterviews = applications
    .filter(app => app.interviewDate && app.status === 'interview')
    .sort((a, b) => {
      if (!a.interviewDate || !b.interviewDate) return 0;
      return a.interviewDate.toMillis() - b.interviewDate.toMillis();
    })
    .slice(0, 5);

  if (upcomingInterviews.length === 0) return null;

  return (
    <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6 mb-8">
      <h2 className="font-heading text-2xl font-bold text-yellow-400 mb-4">
        📞 Upcoming Interviews
      </h2>
      <div className="space-y-3">
        {upcomingInterviews.map((app) => (
          <div key={app.id} className="bg-gray-800/50 rounded p-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">{app.position}</p>
              <p className="text-sm text-gray-400">{app.company}</p>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-bold">
                {app.interviewDate?.toDate().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add Application Modal
function AddApplicationModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<JobApplication>) => void;
}) {
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    company: '',
    position: '',
    trade: '',
    status: 'applied',
    location: '',
    salary: '',
    jobUrl: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      company: '',
      position: '',
      trade: '',
      status: 'applied',
      location: '',
      salary: '',
      jobUrl: '',
      notes: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-yellow-400">
              Add Job Application
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Company *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                  placeholder="ABC Construction"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Position *</label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                  placeholder="Electrician"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Trade *</label>
                <input
                  type="text"
                  required
                  value={formData.trade}
                  onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                  placeholder="Electrician"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Salary</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                  placeholder="$50,000 - $60,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Job URL</label>
              <input
                type="url"
                value={formData.jobUrl}
                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                placeholder="https://example.com/job"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded transition-colors"
              >
                Add Application
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
export default function JobTrackerPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');
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

  // Applications listener
  useEffect(() => {
    if (!currentUser) return;

    const appsQuery = query(
      collection(db, 'jobApplications'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      appsQuery,
      (snapshot) => {
        const appsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JobApplication[];
        
        setApplications(appsData.sort((a, b) => 
          b.appliedDate.toMillis() - a.appliedDate.toMillis()
        ));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddApplication = async (data: Partial<JobApplication>) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'jobApplications'), {
        ...data,
        userId: currentUser.uid,
        appliedDate: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      trackEvent('job_application_added', { 
        company: data.company, 
        position: data.position 
      });

      setShowAddModal(false);
      alert('✅ Application added successfully!');
    } catch (error) {
      console.error('Error adding application:', error);
      alert('❌ Failed to add application. Please try again.');
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      await updateDoc(doc(db, 'jobApplications', appId), {
        status: newStatus,
      });

      trackEvent('job_application_status_changed', { 
        appId, 
        newStatus 
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Failed to update status. Please try again.');
    }
  };

  const handleDelete = async (appId: string) => {
    const confirmed = confirm('Are you sure you want to delete this application?');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'jobApplications', appId));
      trackEvent('job_application_deleted', { appId });
      alert('✅ Application deleted successfully!');
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('❌ Failed to delete application. Please try again.');
    }
  };

  const handleEdit = (appId: string) => {
    // TODO: Implement edit modal
    alert('Edit functionality coming soon!');
  };

  const getFilteredApplications = (status: ApplicationStatus) => {
    return applications.filter(app => app.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <p className="text-xl text-gray-300">Loading your applications...</p>
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
            JOB TRACKER
          </h1>
          <p className="text-xl text-gray-300">
            {applications.length} Active {applications.length === 1 ? 'Application' : 'Applications'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {getFilteredApplications('applied').length}
            </div>
            <div className="text-sm text-gray-300">Applied</div>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {getFilteredApplications('interview').length}
            </div>
            <div className="text-sm text-gray-300">Interviews</div>
          </div>
          <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400">
              {getFilteredApplications('offer').length}
            </div>
            <div className="text-sm text-gray-300">Offers</div>
          </div>
          <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-400">
              {getFilteredApplications('rejected').length}
            </div>
            <div className="text-sm text-gray-300">Rejected</div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <UpcomingInterviews applications={applications} />

        {/* Add Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            ➕ Add Application
          </button>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn
            status="applied"
            applications={getFilteredApplications('applied')}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <KanbanColumn
            status="interview"
            applications={getFilteredApplications('interview')}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <KanbanColumn
            status="offer"
            applications={getFilteredApplications('offer')}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <KanbanColumn
            status="rejected"
            applications={getFilteredApplications('rejected')}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Empty State */}
        {applications.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📋</div>
            <h2 className="font-heading text-3xl font-bold text-yellow-400 mb-4">
              No Applications Yet
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start tracking your job search progress!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Add Your First Application
            </button>
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddApplication}
      />
    </div>
  );
}
