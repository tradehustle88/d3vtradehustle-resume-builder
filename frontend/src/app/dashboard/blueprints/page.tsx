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

interface CareerBlueprint {
  id: string;
  title: string;
  trade: string;
  description: string;
  features: string[];
  price: number;
  stripePriceId?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  level: 'apprentice' | 'journeyman' | 'master' | 'contractor';
}

interface PurchasedBlueprint {
  id: string;
  userId: string;
  blueprintId: string;
  purchaseDate: Date;
  stripePaymentId?: string;
  downloadCount: number;
}

// Available Blueprints (Mock Data - would come from Firestore)
const availableBlueprintsData: CareerBlueprint[] = [
  {
    id: 'elec-journeyman',
    title: 'Journeyman Electrician Career Blueprint',
    trade: 'Electrician',
    description: 'Complete roadmap from apprentice to journeyman with job-ready templates, study guides, and interview prep.',
    features: [
      '30-page career roadmap PDF',
      'NEC code study guide',
      'Interview question bank (100+ questions)',
      'License exam prep checklist',
      'Salary negotiation scripts',
      'Resume & cover letter templates',
      '3 months of career coaching emails',
    ],
    price: 29,
    level: 'journeyman',
    thumbnailUrl: '/blueprints/electrician-journeyman.jpg',
  },
  {
    id: 'elec-master',
    title: 'Master Electrician Business Blueprint',
    trade: 'Electrician',
    description: 'Launch your own electrical contracting business with legal templates, marketing guides, and financial planning.',
    features: [
      '50-page business startup guide',
      'Contractor license prep materials',
      'Business plan template',
      'Marketing & branding toolkit',
      'Client contract templates',
      'Estimating & bidding calculator',
      'Insurance & bonding checklist',
      '6 months of business coaching',
    ],
    price: 49,
    level: 'master',
    thumbnailUrl: '/blueprints/electrician-master.jpg',
  },
  {
    id: 'plumber-journeyman',
    title: 'Journeyman Plumber Career Blueprint',
    trade: 'Plumber',
    description: 'Master plumbing codes, advance your skills, and command higher pay with this comprehensive guide.',
    features: [
      '30-page career advancement guide',
      'Plumbing code study materials',
      'Gas line certification prep',
      'Interview prep for union jobs',
      'Tool & equipment guide',
      'Resume templates for plumbers',
      '3 months of career support',
    ],
    price: 29,
    level: 'journeyman',
    thumbnailUrl: '/blueprints/plumber-journeyman.jpg',
  },
  {
    id: 'hvac-master',
    title: 'HVAC Master Technician Blueprint',
    trade: 'HVAC',
    description: 'Become a sought-after HVAC expert with advanced certifications, business skills, and client management.',
    features: [
      '40-page mastery guide',
      'EPA certification study materials',
      'NATE master exam prep',
      'Commercial HVAC specialization',
      'Service agreement templates',
      'Pricing & estimating tools',
      '6 months of expert mentorship',
    ],
    price: 39,
    level: 'master',
    thumbnailUrl: '/blueprints/hvac-master.jpg',
  },
  {
    id: 'universal-contractor',
    title: 'Trade Contractor Business Bundle',
    trade: 'All Trades',
    description: 'Everything you need to start and scale a profitable trade contracting business (any trade).',
    features: [
      '100-page contractor\'s handbook',
      'Business formation checklist',
      'Marketing playbook (digital + local)',
      'Financial planning spreadsheets',
      'Employee hiring & training guides',
      'Legal contract templates (10+)',
      'CRM & project management setup',
      'Scaling strategies (1-10 crews)',
      '12 months of business coaching',
    ],
    price: 99,
    level: 'contractor',
    thumbnailUrl: '/blueprints/universal-contractor.jpg',
  },
];

// Blueprint Card Component
function BlueprintCard({ 
  blueprint, 
  owned,
  onPurchase,
  onDownload 
}: { 
  blueprint: CareerBlueprint;
  owned?: boolean;
  onPurchase?: () => void;
  onDownload?: () => void;
}) {
  const levelColors = {
    apprentice: 'border-blue-500',
    journeyman: 'border-yellow-500',
    master: 'border-purple-500',
    contractor: 'border-green-500',
  };

  const levelBadgeColors = {
    apprentice: 'bg-blue-600',
    journeyman: 'bg-yellow-600',
    master: 'bg-purple-600',
    contractor: 'bg-green-600',
  };

  return (
    <div className={`bg-gray-800/50 border-2 ${owned ? 'border-green-500' : levelColors[blueprint.level]} rounded-lg p-6 hover:scale-105 transition-all duration-300 relative`}>
      {/* Owned Badge */}
      {owned && (
        <div className="absolute -top-3 -right-3 bg-green-500 text-white font-bold px-4 py-1 rounded-full shadow-lg">
          ✓ OWNED
        </div>
      )}

      {/* Level Badge */}
      <div className={`${levelBadgeColors[blueprint.level]} text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3 uppercase`}>
        {blueprint.level}
      </div>

      {/* Trade Badge */}
      <div className="text-gray-400 text-sm mb-2">{blueprint.trade}</div>

      {/* Thumbnail */}
      <div className="bg-gray-700 rounded-lg mb-4 h-48 flex items-center justify-center overflow-hidden">
        {blueprint.thumbnailUrl ? (
          <img src={blueprint.thumbnailUrl} alt={blueprint.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl">📘</div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-heading text-xl font-bold text-yellow-400 mb-3">
        {blueprint.title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4">
        {blueprint.description}
      </p>

      {/* Features */}
      <div className="mb-4">
        <p className="text-gray-400 text-xs font-bold mb-2 uppercase">What's Included:</p>
        <ul className="space-y-1">
          {blueprint.features.slice(0, 5).map((feature, i) => (
            <li key={i} className="text-gray-300 text-xs flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>{feature}</span>
            </li>
          ))}
          {blueprint.features.length > 5 && (
            <li className="text-gray-400 text-xs">
              + {blueprint.features.length - 5} more...
            </li>
          )}
        </ul>
      </div>

      {/* Action Button */}
      {owned ? (
        <button
          onClick={onDownload}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors"
        >
          📥 Download Now
        </button>
      ) : (
        <div className="space-y-2">
          <div className="text-center mb-2">
            <span className="text-3xl font-bold text-yellow-400">${blueprint.price}</span>
            <span className="text-gray-400 text-sm"> one-time</span>
          </div>
          <button
            onClick={onPurchase}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg transition-colors"
          >
            🔒 Purchase Blueprint
          </button>
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function CareerBlueprintsPage() {
  const [availableBlueprints, setAvailableBlueprints] = useState<CareerBlueprint[]>(availableBlueprintsData);
  const [purchasedBlueprints, setPurchasedBlueprints] = useState<CareerBlueprint[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
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

  // Load purchased blueprints
  useEffect(() => {
    if (!currentUser) return;

    const purchasesQuery = query(
      collection(db, 'blueprintPurchases'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      purchasesQuery,
      async (snapshot) => {
        const purchasedIds = snapshot.docs.map(doc => doc.data().blueprintId);
        
        // Filter available blueprints to get purchased ones
        const purchased = availableBlueprintsData.filter(bp => 
          purchasedIds.includes(bp.id)
        );
        
        setPurchasedBlueprints(purchased);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching purchases:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handlePurchase = async (blueprintId: string) => {
    if (!currentUser) {
      alert('Please sign in to purchase blueprints');
      return;
    }

    setPurchasing(blueprintId);
    
    try {
      const blueprint = availableBlueprints.find(bp => bp.id === blueprintId);
      if (!blueprint) return;

      // Get Firebase Auth token
      const token = await currentUser.getIdToken();

      // Create Stripe checkout session
      const functionsUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
        'https://app-fbs5jy4frq-uc.a.run.app';

      const response = await fetch(`${functionsUrl}/api/blueprints/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          blueprintId,
          price: blueprint.price,
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        trackEvent('blueprint_purchase_initiated', { 
          blueprintId, 
          price: blueprint.price 
        });
        
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error purchasing blueprint:', error);
      alert('❌ Failed to start purchase. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleDownload = (blueprint: CareerBlueprint) => {
    if (blueprint.downloadUrl) {
      window.open(blueprint.downloadUrl, '_blank');
      trackEvent('blueprint_downloaded', { blueprintId: blueprint.id });
    } else {
      alert('Download link will be provided after purchase verification.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📘</div>
          <p className="text-xl text-gray-300">Loading blueprints...</p>
        </div>
      </div>
    );
  }

  const unpurchasedBlueprints = availableBlueprints.filter(
    bp => !purchasedBlueprints.find(p => p.id === bp.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-heading text-6xl font-bold text-yellow-400 mb-4 brick-shadow">
            CAREER BLUEPRINTS
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            Accelerate Your Trade Career with Expert Roadmaps
          </p>
          <p className="text-lg text-gray-400">
            One-time purchase. Lifetime access. 30-day money-back guarantee.
          </p>
        </div>

        {/* Purchased Blueprints */}
        {purchasedBlueprints.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-3xl font-bold text-green-400">
                📚 Your Blueprints ({purchasedBlueprints.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedBlueprints.map((blueprint) => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  owned
                  onDownload={() => handleDownload(blueprint)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Available Blueprints */}
        {unpurchasedBlueprints.length > 0 && (
          <section>
            <div className="mb-8 text-center">
              <h2 className="font-heading text-4xl font-bold text-yellow-400 mb-3">
                🚀 Advance Your Career
              </h2>
              <p className="text-xl text-gray-300">
                Choose the blueprint that matches your career goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unpurchasedBlueprints.map((blueprint) => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  onPurchase={() => handlePurchase(blueprint.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State - All Purchased */}
        {purchasedBlueprints.length > 0 && unpurchasedBlueprints.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="font-heading text-3xl font-bold text-yellow-400 mb-4">
              You Own All Blueprints!
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              You've unlocked the complete career advancement library. Now go build!
            </p>
          </div>
        )}

        {/* Features & Benefits */}
        <div className="mt-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600 rounded-lg p-8">
          <h2 className="font-heading text-3xl font-bold text-yellow-400 mb-6 text-center">
            Why Career Blueprints?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">⚡</div>
              <h3 className="font-bold text-xl text-white mb-2">Fast-Track Your Progress</h3>
              <p className="text-gray-300">
                Save years of trial and error with proven roadmaps from experienced tradespeople.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">💰</div>
              <h3 className="font-bold text-xl text-white mb-2">Increase Your Income</h3>
              <p className="text-gray-300">
                Learn negotiation tactics, business skills, and career moves that command higher pay.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🎯</div>
              <h3 className="font-bold text-xl text-white mb-2">Clear Action Steps</h3>
              <p className="text-gray-300">
                No fluff. Just actionable checklists, templates, and strategies you can use today.
              </p>
            </div>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mt-8 bg-green-900/20 border border-green-600 rounded-lg p-6 text-center">
          <h3 className="font-bold text-xl text-green-400 mb-2">
            💚 30-Day Money-Back Guarantee
          </h3>
          <p className="text-gray-300">
            Not satisfied? Get a full refund within 30 days. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
