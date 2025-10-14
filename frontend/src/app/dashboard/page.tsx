'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, User } from '@/lib/firebase';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

const dashboardCards: DashboardCard[] = [
  {
    title: 'My Resumes',
    description: 'Create, edit, and manage your professional resumes',
    icon: '📄',
    href: '/dashboard/resumes',
    color: 'from-blue-600 to-blue-800',
  },
  {
    title: 'Job Tracker',
    description: 'Track applications with Kanban board & calendar',
    icon: '📊',
    href: '/dashboard/jobs',
    color: 'from-purple-600 to-purple-800',
  },
  {
    title: 'Cert Vault',
    description: 'Store certifications with expiration alerts',
    icon: '🏆',
    href: '/dashboard/certifications',
    color: 'from-yellow-600 to-yellow-800',
  },
  {
    title: 'Career Path',
    description: 'AI-powered career roadmap & skill gap analysis',
    icon: '🚀',
    href: '/dashboard/career',
    color: 'from-green-600 to-green-800',
  },
  {
    title: 'Career Blueprints',
    description: 'Premium guides to fast-track your career ($29-$99)',
    icon: '📘',
    href: '/dashboard/blueprints',
    color: 'from-orange-600 to-red-800',
  },
  {
    title: 'Refer & Earn',
    description: 'Earn $10 per referral + help your trade buddies',
    icon: '💰',
    href: '/dashboard/referrals',
    color: 'from-emerald-600 to-teal-800',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        router.push('/auth/signin');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚙️</div>
          <p className="text-xl text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-heading text-6xl font-bold text-yellow-400 mb-4 brick-shadow">
            WELCOME TO THE GRIND
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            Built for the Trade. Backed by Hustle.
          </p>
          {currentUser?.email && (
            <p className="text-lg text-gray-400">
              {currentUser.email}
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">📄</div>
            <div className="text-3xl font-bold text-blue-400 mb-1">0</div>
            <div className="text-sm text-gray-300">Resumes</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-purple-400 mb-1">0</div>
            <div className="text-sm text-gray-300">Applications</div>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">0</div>
            <div className="text-sm text-gray-300">Certifications</div>
          </div>
          <div className="bg-green-900/30 border border-green-600 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-green-400 mb-1">0</div>
            <div className="text-sm text-gray-300">Skills Tracked</div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dashboardCards.map((card) => (
            <button
              key={card.href}
              onClick={() => router.push(card.href)}
              className={`
                bg-gradient-to-br ${card.color}
                border border-gray-700 rounded-lg p-8
                hover:scale-105 transition-all duration-300
                text-left group relative overflow-hidden
              `}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
                }} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h2 className="font-heading text-3xl font-bold text-white mb-3">
                  {card.title}
                </h2>
                <p className="text-lg text-gray-200">
                  {card.description}
                </p>
                <div className="mt-4 text-yellow-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Open <span>→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="font-heading text-3xl font-bold text-yellow-400 mb-6">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/trade-selection')}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 px-6 rounded-lg transition-colors text-left"
            >
              <div className="text-3xl mb-2">✏️</div>
              <div className="text-lg">Create New Resume</div>
            </button>
            <button
              onClick={() => router.push('/dashboard/jobs')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-left"
            >
              <div className="text-3xl mb-2">➕</div>
              <div className="text-lg">Add Job Application</div>
            </button>
            <button
              onClick={() => router.push('/dashboard/certifications')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-left"
            >
              <div className="text-3xl mb-2">📤</div>
              <div className="text-lg">Upload Certification</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
