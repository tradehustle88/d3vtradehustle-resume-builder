'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Resume {
  id: string
  name: string
  trade: string
  template: string
  lastEdited: string
  downloads: number
  atsScore: number
}

interface JobApplication {
  id: string
  company: string
  position: string
  status: 'applied' | 'interview' | 'offer' | 'rejected'
  appliedDate: string
  interviewDate?: string
  notes: string
}

interface Certificate {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  file: string
  expired: boolean
}

interface CareerBlueprint {
  id: string
  title: string
  description: string
  locked: boolean
}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'resumes' | 'jobs' | 'certs' | 'blueprints' | 'referrals'>('resumes')
  
  // Mock data
  const [resumes] = useState<Resume[]>([
    {
      id: '1',
      name: 'Electrician Resume - Master',
      trade: 'Electrician',
      template: 'Modern Pro',
      lastEdited: '2025-10-10',
      downloads: 12,
      atsScore: 94
    }
  ])

  const [jobs, setJobs] = useState<JobApplication[]>([
    {
      id: '1',
      company: 'ABC Electric Co.',
      position: 'Master Electrician',
      status: 'interview',
      appliedDate: '2025-10-01',
      interviewDate: '2025-10-15',
      notes: 'Follow up after interview'
    }
  ])

  const [certificates] = useState<Certificate[]>([
    {
      id: '1',
      name: 'Master Electrician License',
      issuer: 'State Board',
      issueDate: '2020-01-15',
      expiryDate: '2025-01-15',
      file: 'license.pdf',
      expired: false
    }
  ])

  const [referralStats] = useState({
    totalReferrals: 3,
    activeReferrals: 2,
    totalEarned: 45.00,
    pendingPayout: 15.00,
    referralLink: 'https://tradehustle.com/ref/USER123'
  })

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-2">
            Your <span className="text-[#E50914]">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-300">
            Manage your resumes, track applications, and grow your career
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 bg-gray-800 p-2 rounded-xl">
          {[
            { id: 'resumes', icon: '📄', label: 'My Resumes' },
            { id: 'jobs', icon: '💼', label: 'Job Tracker' },
            { id: 'certs', icon: '🏆', label: 'Cert Vault' },
            { id: 'blueprints', icon: '🗺️', label: 'Career Blueprints' },
            { id: 'referrals', icon: '💰', label: 'Refer & Earn' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
                ${activeTab === tab.id
                  ? 'bg-[#E50914] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* H1: MY RESUMES */}
        {activeTab === 'resumes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">My Resumes</h2>
              <button
                onClick={() => router.push('/builder')}
                className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-6 py-3 rounded-lg transition-all"
              >
                + Create New Resume
              </button>
            </div>

            {resumes.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-2xl font-bold text-white mb-2">No resumes yet</h3>
                <p className="text-gray-400 mb-6">Create your first resume to get started</p>
                <button
                  onClick={() => router.push('/builder')}
                  className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-8 py-4 rounded-lg transition-all"
                >
                  Create Your First Resume
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                  <div key={resume.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-[#FFD700] transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{resume.name}</h3>
                        <p className="text-gray-400 text-sm">{resume.trade} • {resume.template}</p>
                      </div>
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        ATS {resume.atsScore}%
                      </div>
                    </div>

                    <div className="text-gray-400 text-sm mb-4">
                      <div>Last edited: {resume.lastEdited}</div>
                      <div>Downloads: {resume.downloads}</div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-[#8B0000] hover:bg-red-800 text-white font-bold py-2 rounded-lg text-sm transition-all">
                        Edit
                      </button>
                      <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg text-sm transition-all">
                        Download
                      </button>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 text-gray-400 hover:text-white text-sm">
                        Duplicate
                      </button>
                      <button className="flex-1 text-gray-400 hover:text-white text-sm">
                        Share
                      </button>
                      <button className="flex-1 text-red-400 hover:text-red-300 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* H2: JOB TRACKER */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Job Tracker</h2>
              <button className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-6 py-3 rounded-lg transition-all">
                + Add Application
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Applied', count: 8, color: 'blue' },
                { label: 'Interviews', count: 3, color: 'yellow' },
                { label: 'Offers', count: 1, color: 'green' },
                { label: 'Rejected', count: 2, color: 'red' }
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                  <div className={`text-4xl font-bold text-${stat.color}-500 mb-2`}>{stat.count}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">{job.position}</h3>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                    <span className={`
                      px-4 py-2 rounded-full font-bold text-sm
                      ${job.status === 'applied' && 'bg-blue-900/50 text-blue-300'}
                      ${job.status === 'interview' && 'bg-yellow-900/50 text-yellow-300'}
                      ${job.status === 'offer' && 'bg-green-900/50 text-green-300'}
                      ${job.status === 'rejected' && 'bg-red-900/50 text-red-300'}
                    `}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
                    <div>Applied: {job.appliedDate}</div>
                    {job.interviewDate && <div>Interview: {job.interviewDate}</div>}
                  </div>

                  {job.notes && (
                    <div className="bg-gray-900 rounded-lg p-3 text-gray-300 text-sm mb-4">
                      📝 {job.notes}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="bg-[#8B0000] hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">
                      Update Status
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">
                      Add Note
                    </button>
                    <button className="text-gray-400 hover:text-white font-bold py-2 px-4 text-sm">
                      Set Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* H3: CERT VAULT */}
        {activeTab === 'certs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Certification Vault</h2>
              <button className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-6 py-3 rounded-lg transition-all">
                + Upload Certificate
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">{cert.name}</h3>
                      <p className="text-gray-400 text-sm">{cert.issuer}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cert.expired ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'
                    }`}>
                      {cert.expired ? 'EXPIRED' : 'ACTIVE'}
                    </div>
                  </div>

                  <div className="text-sm text-gray-400 mb-4">
                    <div>Issued: {cert.issueDate}</div>
                    <div>Expires: {cert.expiryDate}</div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#8B0000] hover:bg-red-800 text-white font-bold py-2 rounded-lg text-sm transition-all">
                      View File
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg text-sm transition-all">
                      Share Link
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Expiration Alerts */}
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span>⚠️</span> Upcoming Expirations
              </h3>
              <p className="text-gray-300">No certifications expiring in the next 90 days</p>
            </div>
          </div>
        )}

        {/* H4: CAREER BLUEPRINTS */}
        {activeTab === 'blueprints' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Career Blueprints</h2>
            <p className="text-gray-400">Trade-specific advancement paths and salary insights</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Apprentice to Journeyman', description: '2-4 year path with key milestones', locked: false },
                { title: 'Master Electrician Track', description: 'Requirements and timeline', locked: false },
                { title: 'Business Owner Blueprint', description: 'Start your own electrical business', locked: true },
                { title: 'Salary Benchmarks 2025', description: 'Regional pay rates and trends', locked: true },
                { title: 'Certification Roadmap', description: 'Recommended certs by career stage', locked: false },
                { title: 'Union vs Non-Union Guide', description: 'Compare career paths', locked: true }
              ].map((blueprint, idx) => (
                <div key={idx} className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${blueprint.locked && 'opacity-60'}`}>
                  {blueprint.locked && (
                    <div className="text-4xl mb-3">🔒</div>
                  )}
                  <h3 className="text-white font-bold text-lg mb-2">{blueprint.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{blueprint.description}</p>
                  <button className={`w-full font-bold py-3 rounded-lg transition-all ${
                    blueprint.locked
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[#8B0000] hover:bg-red-800 text-white'
                  }`}>
                    {blueprint.locked ? 'Upgrade to Unlock' : 'View Blueprint'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* H5: REFER & EARN */}
        {activeTab === 'referrals' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Refer & Earn Program</h2>
            <p className="text-gray-400">Earn 30% commission on every paid referral</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">${referralStats.totalEarned.toFixed(2)}</div>
                <div className="text-green-100">Total Earned</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">{referralStats.activeReferrals}</div>
                <div className="text-blue-100">Active Referrals</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">${referralStats.pendingPayout.toFixed(2)}</div>
                <div className="text-yellow-100">Pending Payout</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">{referralStats.totalReferrals}</div>
                <div className="text-purple-100">Total Referrals</div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-bold text-xl mb-4">Your Referral Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralStats.referralLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(referralStats.referralLink)}
                  className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-6 py-3 rounded-lg transition-all"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Commission Tiers */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-bold text-xl mb-4">Commission Tiers</h3>
              <div className="space-y-3">
                {[
                  { referrals: '1-5', commission: '30%', bonus: '-' },
                  { referrals: '6-20', commission: '35%', bonus: '$50 bonus' },
                  { referrals: '21-50', commission: '40%', bonus: '$150 bonus' },
                  { referrals: '51+', commission: '45%', bonus: '$500 bonus' }
                ].map((tier, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
                    <div className="text-white font-bold">{tier.referrals} Referrals</div>
                    <div className="text-[#FFD700] font-bold">{tier.commission}</div>
                    <div className="text-green-400 text-sm">{tier.bonus}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">How It Works</h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-[#FFD700] font-bold">1.</span>
                  <span>Share your unique referral link with friends and colleagues</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FFD700] font-bold">2.</span>
                  <span>They sign up and purchase a paid plan</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FFD700] font-bold">3.</span>
                  <span>You earn 30% commission on their subscription</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FFD700] font-bold">4.</span>
                  <span>Get paid monthly via PayPal or direct deposit</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
