'use client';

import Link from 'next/link';

export default function TemplatesPage() {
  const templates = [
    { id: 1, name: 'Modern Professional', trade: 'All Trades', preview: 'Modern clean design with bold headers' },
    { id: 2, name: 'Electrician Pro', trade: 'Electrician', preview: 'Optimized for electrical certifications' },
    { id: 3, name: 'HVAC Specialist', trade: 'HVAC', preview: 'EPA 608 certification highlighted' },
    { id: 4, name: 'Plumbing Expert', trade: 'Plumber', preview: 'License numbers prominently displayed' },
    { id: 5, name: 'Welder Industrial', trade: 'Welder', preview: 'Welding certifications front and center' },
    { id: 6, name: 'Carpenter Classic', trade: 'Carpenter', preview: 'Project portfolio emphasis' },
    { id: 7, name: 'Mechanic Tech', trade: 'Mechanic', preview: 'ASE certifications highlighted' },
    { id: 8, name: 'Construction Manager', trade: 'Contractor', preview: 'Leadership and project management' },
  ];

  return (
    <div className="bg-[#0A0A0A] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#FFD700] transition-colors mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-5xl font-black text-white mb-4">
            Choose Your <span className="text-[#FFD700]" style={{textShadow: '0 0 30px rgba(255, 215, 0, 0.6)'}}>Template</span>
          </h1>
          <p className="text-xl text-gray-400">
            All templates are ATS-optimized and tested with 200+ recruiters
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href="/builder"
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#FFD700]/50 transition-all"
            >
              {/* Preview Box */}
              <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              {/* Template Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{template.name}</h3>
                  <span className="px-2 py-1 bg-[#3B82F6]/20 text-[#3B82F6] text-xs rounded-full">
                    {template.trade}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">{template.preview}</p>
                
                <div className="flex items-center text-[#FFD700] text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Use Template
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-white/5 border border-white/10 rounded-2xl p-12">
          <h2 className="text-3xl font-black text-white mb-4">
            Not sure which template? <span className="text-[#DC2626]">Start building.</span>
          </h2>
          <p className="text-gray-400 mb-6">You can always change templates later</p>
          <Link 
            href="/builder"
            className="inline-block px-8 py-4 bg-[#DC2626] text-white font-bold rounded-lg hover:bg-[#B91C1C] transition-all transform hover:scale-105"
            style={{boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)'}}
          >
            Start with Blank Template
          </Link>
        </div>
      </div>
    </div>
  );
}
