'use client';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="font-heading text-4xl font-bold text-yellow-400 mb-4">
                    WELCOME TO THE GRIND
                </h1>
                <p className="font-body text-lg text-white mb-6">
                    Built for the Trade. Backed by Hustle.
                </p>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h2 className="font-heading text-2xl text-yellow-400 mb-3">Dashboard</h2>
                    <p className="font-body text-gray-300">Dashboard functionality coming soon...</p>
                </div>
            </div>
        </div>
    );
}
