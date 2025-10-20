'use client';

import { useAuth } from '@/context/AuthContext';
import StudioBuilder from '@/components/StudioBuilder';
import LoginForm from '@/components/LoginForm';

export default function StudioPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading Studio...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <StudioBuilder />;
}
