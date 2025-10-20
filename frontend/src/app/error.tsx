'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001a33] to-[#003366]">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#001a33] mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-6">
            We encountered an error while loading this page.
          </p>
          <button
            onClick={reset}
            className="btn-hustle w-full"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
