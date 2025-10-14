'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc,
  getDoc 
} from 'firebase/firestore';
import { db, auth, onAuthStateChanged, User } from '@/lib/firebase';
import { trackEvent } from '@/lib/analytics';

interface CareerPathNode {
  level: number;
  title: string;
  avgSalary: string;
  requiredSkills: string[];
  certifications: string[];
  yearsExperience: string;
}

interface SkillGap {
  skill: string;
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  priority: 'high' | 'medium' | 'low';
}

interface CourseRecommendation {
  title: string;
  provider: string;
  duration: string;
  cost: string;
  skills: string[];
  url?: string;
}

// Career Path Visualization for different trades
const careerPaths: Record<string, CareerPathNode[]> = {
  electrician: [
    {
      level: 1,
      title: 'Apprentice Electrician',
      avgSalary: '$35,000 - $45,000',
      requiredSkills: ['Basic wiring', 'Safety protocols', 'Tool usage'],
      certifications: ['OSHA 10', 'First Aid'],
      yearsExperience: '0-2 years',
    },
    {
      level: 2,
      title: 'Journeyman Electrician',
      avgSalary: '$50,000 - $70,000',
      requiredSkills: ['Advanced wiring', 'Code compliance', 'Troubleshooting', 'Blueprint reading'],
      certifications: ['Journeyman License', 'OSHA 30'],
      yearsExperience: '3-5 years',
    },
    {
      level: 3,
      title: 'Master Electrician',
      avgSalary: '$70,000 - $95,000',
      requiredSkills: ['System design', 'Project management', 'Team leadership', 'Complex installations'],
      certifications: ['Master License', 'Low Voltage License'],
      yearsExperience: '6-10 years',
    },
    {
      level: 4,
      title: 'Electrical Contractor',
      avgSalary: '$90,000 - $150,000+',
      requiredSkills: ['Business management', 'Estimating', 'Client relations', 'Contract negotiation'],
      certifications: ['Contractor License', 'Business License'],
      yearsExperience: '10+ years',
    },
  ],
  plumber: [
    {
      level: 1,
      title: 'Apprentice Plumber',
      avgSalary: '$32,000 - $42,000',
      requiredSkills: ['Pipe fitting', 'Basic tools', 'Safety', 'System basics'],
      certifications: ['OSHA 10', 'First Aid'],
      yearsExperience: '0-2 years',
    },
    {
      level: 2,
      title: 'Journeyman Plumber',
      avgSalary: '$48,000 - $68,000',
      requiredSkills: ['Drainage systems', 'Gas lines', 'Water heaters', 'Code knowledge'],
      certifications: ['Journeyman License', 'Backflow Prevention'],
      yearsExperience: '3-5 years',
    },
    {
      level: 3,
      title: 'Master Plumber',
      avgSalary: '$68,000 - $92,000',
      requiredSkills: ['Complex systems', 'Project planning', 'Supervision', 'Estimating'],
      certifications: ['Master License', 'Medical Gas Installer'],
      yearsExperience: '6-10 years',
    },
    {
      level: 4,
      title: 'Plumbing Contractor',
      avgSalary: '$85,000 - $140,000+',
      requiredSkills: ['Business operations', 'Bidding', 'Team management', 'Growth strategy'],
      certifications: ['Contractor License', 'Business License'],
      yearsExperience: '10+ years',
    },
  ],
  hvac: [
    {
      level: 1,
      title: 'HVAC Helper',
      avgSalary: '$30,000 - $40,000',
      requiredSkills: ['Basic tools', 'Safety', 'Equipment handling', 'Assist installations'],
      certifications: ['OSHA 10', 'EPA 608 Universal'],
      yearsExperience: '0-1 years',
    },
    {
      level: 2,
      title: 'HVAC Technician',
      avgSalary: '$45,000 - $65,000',
      requiredSkills: ['System diagnostics', 'Refrigerant handling', 'Repairs', 'Maintenance'],
      certifications: ['EPA 608', 'NATE Certification'],
      yearsExperience: '2-5 years',
    },
    {
      level: 3,
      title: 'Senior HVAC Technician',
      avgSalary: '$65,000 - $85,000',
      requiredSkills: ['Complex systems', 'Team lead', 'Customer service', 'Energy efficiency'],
      certifications: ['NATE Master', 'R-410A Certification'],
      yearsExperience: '6-10 years',
    },
    {
      level: 4,
      title: 'HVAC Contractor/Owner',
      avgSalary: '$80,000 - $130,000+',
      requiredSkills: ['Business management', 'Sales', 'Operations', 'Strategic planning'],
      certifications: ['Contractor License', 'Business License'],
      yearsExperience: '10+ years',
    },
  ],
};

// Mock course recommendations (in production, this would come from API)
const mockCourses: CourseRecommendation[] = [
  {
    title: 'Advanced Electrical Code (NEC 2023)',
    provider: 'Mike Holt Enterprises',
    duration: '40 hours',
    cost: '$299',
    skills: ['Code compliance', 'Advanced wiring', 'Inspection prep'],
  },
  {
    title: 'Project Management for Trades',
    provider: 'Trade Skills Academy',
    duration: '24 hours',
    cost: '$199',
    skills: ['Project management', 'Team leadership', 'Scheduling'],
  },
  {
    title: 'Blueprint Reading & Estimating',
    provider: 'Contractor Training',
    duration: '16 hours',
    cost: '$149',
    skills: ['Blueprint reading', 'Estimating', 'Takeoffs'],
  },
  {
    title: 'Small Business Management for Contractors',
    provider: 'SCORE',
    duration: '12 hours',
    cost: 'Free',
    skills: ['Business management', 'Financial planning', 'Marketing'],
  },
];

// Career Path Node Component
function CareerPathCard({ node, current }: { node: CareerPathNode; current: boolean }) {
  return (
    <div className={`
      bg-gray-800/50 border-2 rounded-lg p-6 relative
      ${current 
        ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' 
        : 'border-gray-700 hover:border-gray-600'
      }
      transition-all duration-300
    `}>
      {/* Level Badge */}
      <div className="absolute -top-3 -left-3 bg-yellow-400 text-gray-900 font-bold rounded-full w-10 h-10 flex items-center justify-center">
        {node.level}
      </div>

      {current && (
        <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          YOU ARE HERE
        </div>
      )}

      {/* Content */}
      <h3 className="font-heading text-xl font-bold text-yellow-400 mb-2 mt-2">
        {node.title}
      </h3>
      <p className="text-green-400 font-bold mb-4">{node.avgSalary}/year</p>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-gray-400 mb-1">📚 Required Skills:</p>
          <div className="flex flex-wrap gap-1">
            {node.requiredSkills.map((skill, i) => (
              <span key={i} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-400 mb-1">🏆 Certifications:</p>
          <div className="flex flex-wrap gap-1">
            {node.certifications.map((cert, i) => (
              <span key={i} className="bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded text-xs">
                {cert}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-400">⏱️ Experience: <span className="text-white">{node.yearsExperience}</span></p>
        </div>
      </div>
    </div>
  );
}

// Skill Gap Component
function SkillGapAnalysis({ gaps }: { gaps: SkillGap[] }) {
  const priorityColors = {
    high: 'bg-red-600',
    medium: 'bg-yellow-600',
    low: 'bg-blue-600',
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h2 className="font-heading text-2xl font-bold text-yellow-400 mb-6">
        🎯 Skill Gap Analysis
      </h2>

      <div className="space-y-4">
        {gaps.map((gap, i) => (
          <div key={i} className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white">{gap.skill}</h3>
              <span className={`${priorityColors[gap.priority]} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                {gap.priority} Priority
              </span>
            </div>

            <div className="space-y-2">
              {/* Current Level */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Current Level</span>
                  <span className="text-blue-400 font-bold">{gap.currentLevel}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${gap.currentLevel}%` }}
                  />
                </div>
              </div>

              {/* Target Level */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Target Level</span>
                  <span className="text-green-400 font-bold">{gap.targetLevel}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-500"
                    style={{ width: `${gap.targetLevel}%` }}
                  />
                </div>
              </div>

              {/* Gap */}
              <div className="text-center pt-2">
                <span className="text-yellow-400 font-bold">
                  {gap.targetLevel - gap.currentLevel}% Gap to Close
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Course Recommendations Component
function CourseRecommendations({ courses }: { courses: CourseRecommendation[] }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h2 className="font-heading text-2xl font-bold text-yellow-400 mb-6">
        📖 Recommended Courses
      </h2>

      <div className="space-y-4">
        {courses.map((course, i) => (
          <div key={i} className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-white flex-1">{course.title}</h3>
              <span className="text-green-400 font-bold ml-4">{course.cost}</span>
            </div>

            <p className="text-gray-400 text-sm mb-3">
              {course.provider} • {course.duration}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {course.skills.map((skill, j) => (
                <span key={j} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
            </div>

            <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2 rounded transition-colors">
              View Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Page Component
export default function CareerBlueprintsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTrade, setUserTrade] = useState<string>('electrician');
  const [currentLevel, setCurrentLevel] = useState<number>(2);
  const router = useRouter();

  // Mock skill gaps (in production, calculate from resume data)
  const mockSkillGaps: SkillGap[] = [
    {
      skill: 'Project Management',
      currentLevel: 40,
      targetLevel: 85,
      priority: 'high',
    },
    {
      skill: 'Advanced Code Compliance',
      currentLevel: 60,
      targetLevel: 90,
      priority: 'high',
    },
    {
      skill: 'Blueprint Reading',
      currentLevel: 70,
      targetLevel: 95,
      priority: 'medium',
    },
    {
      skill: 'Business Management',
      currentLevel: 30,
      targetLevel: 75,
      priority: 'medium',
    },
  ];

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        router.push('/auth/signin');
      } else {
        // In production, fetch user's trade and level from Firestore
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const pathNodes = careerPaths[userTrade] || careerPaths.electrician;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚀</div>
          <p className="text-xl text-gray-300">Loading your career blueprint...</p>
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
            CAREER BLUEPRINTS
          </h1>
          <p className="text-xl text-gray-300">
            Your Roadmap to Trade Excellence
          </p>
        </div>

        {/* Trade Selector */}
        <div className="mb-8">
          <label className="block text-gray-300 mb-2 font-bold">Select Your Trade:</label>
          <select
            value={userTrade}
            onChange={(e) => {
              setUserTrade(e.target.value);
              trackEvent('career_path_trade_changed', { trade: e.target.value });
            }}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-bold text-lg hover:border-yellow-400 transition-colors"
          >
            <option value="electrician">⚡ Electrician</option>
            <option value="plumber">🔧 Plumber</option>
            <option value="hvac">❄️ HVAC Technician</option>
          </select>
        </div>

        {/* Career Path Visualization */}
        <div className="mb-12">
          <h2 className="font-heading text-3xl font-bold text-yellow-400 mb-6">
            🗺️ Your Career Path
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pathNodes.map((node) => (
              <div key={node.level} className="relative">
                <CareerPathCard 
                  node={node} 
                  current={node.level === currentLevel}
                />
                {node.level < pathNodes.length && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-3xl text-yellow-400 z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis & Course Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkillGapAnalysis gaps={mockSkillGaps} />
          <CourseRecommendations courses={mockCourses} />
        </div>

        {/* Progress Stats */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-600 rounded-lg p-8">
          <h2 className="font-heading text-3xl font-bold text-yellow-400 mb-6 text-center">
            📊 Your Progress
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                {currentLevel}/{pathNodes.length}
              </div>
              <p className="text-gray-300">Career Levels Completed</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">
                {Math.round(mockSkillGaps.reduce((sum, gap) => sum + gap.currentLevel, 0) / mockSkillGaps.length)}%
              </div>
              <p className="text-gray-300">Average Skill Mastery</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                {mockSkillGaps.filter(g => g.priority === 'high').length}
              </div>
              <p className="text-gray-300">High Priority Skills</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-xl text-gray-300 mb-6">
            Ready to level up your career?
          </p>
          <button
            onClick={() => router.push('/dashboard/certifications')}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Add Certifications to Progress
          </button>
        </div>
      </div>
    </div>
  );
}
