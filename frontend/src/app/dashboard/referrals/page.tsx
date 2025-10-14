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

interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  referredUserId?: string;
  status: 'pending' | 'signed_up' | 'converted' | 'expired';
  createdAt: Date;
  convertedAt?: Date;
  commission: number;
  paid: boolean;
}

interface ReferralStats {
  totalReferrals: number;
  pending: number;
  signedUp: number;
  converted: number;
  totalEarnings: number;
  availableForPayout: number;
  paidOut: number;
}

// Referral Code Display Component
function ReferralCodeDisplay({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://tradehustle.co/ref/${code}`);
    setCopied(true);
    trackEvent('referral_code_copied', { code });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-8 text-center mb-8">
      <h2 className="font-heading text-3xl font-bold text-white mb-4">
        Your Referral Link
      </h2>
      <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-4">
        <p className="text-white font-mono text-lg break-all">
          https://tradehustle.co/ref/{code}
        </p>
      </div>
      <button
        onClick={handleCopy}
        className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors"
      >
        {copied ? '✅ Copied!' : '📋 Copy Link'}
      </button>
    </div>
  );
}

// Share Buttons Component
function ShareButtons({ code }: { code: string }) {
  const referralUrl = `https://tradehustle.co/ref/${code}`;
  const shareText = '🔨 Check out Trade Hustle Resume Builder! Build a pro resume in minutes and land your next trade job. Use my referral link:';

  const handleShare = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Check out Trade Hustle Resume Builder')}&body=${encodeURIComponent(shareText + ' ' + referralUrl)}`;
        break;
      case 'sms':
        url = `sms:?body=${encodeURIComponent(shareText + ' ' + referralUrl)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      trackEvent('referral_shared', { platform, code });
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
      <h3 className="font-heading text-2xl font-bold text-yellow-400 mb-4">
        📢 Share Your Link
      </h3>
      <p className="text-gray-300 mb-4">
        Share with your trade buddies on social media or via text
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => handleShare('twitter')}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors"
        >
          🐦 Twitter
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
        >
          📘 Facebook
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors"
        >
          💼 LinkedIn
        </button>
        <button
          onClick={() => handleShare('email')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
        >
          📧 Email
        </button>
        <button
          onClick={() => handleShare('sms')}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors"
        >
          💬 Text
        </button>
      </div>
    </div>
  );
}

// Earnings Summary Component
function EarningsSummary({ stats }: { stats: ReferralStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-blue-400 mb-2">
          {stats.totalReferrals}
        </div>
        <div className="text-sm text-gray-300">Total Referrals</div>
      </div>
      <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-yellow-400 mb-2">
          {stats.signedUp}
        </div>
        <div className="text-sm text-gray-300">Signed Up</div>
      </div>
      <div className="bg-green-900/30 border border-green-600 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-green-400 mb-2">
          {stats.converted}
        </div>
        <div className="text-sm text-gray-300">Converted (Paid)</div>
      </div>
      <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-purple-400 mb-2">
          ${stats.totalEarnings.toFixed(2)}
        </div>
        <div className="text-sm text-gray-300">Total Earned</div>
      </div>
    </div>
  );
}

// Referral List Component
function ReferralList({ referrals }: { referrals: Referral[] }) {
  const statusColors = {
    pending: 'text-gray-400',
    signed_up: 'text-blue-400',
    converted: 'text-green-400',
    expired: 'text-red-400',
  };

  const statusLabels = {
    pending: '⏳ Pending',
    signed_up: '✍️ Signed Up',
    converted: '✅ Converted',
    expired: '❌ Expired',
  };

  if (referrals.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="font-heading text-2xl font-bold text-yellow-400 mb-2">
          No Referrals Yet
        </h3>
        <p className="text-gray-300">
          Start sharing your referral link to earn commissions!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="font-heading text-2xl font-bold text-yellow-400 mb-4">
        📊 Your Referrals
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-bold">Date</th>
              <th className="text-left py-3 px-4 text-gray-400 font-bold">Email</th>
              <th className="text-left py-3 px-4 text-gray-400 font-bold">Status</th>
              <th className="text-right py-3 px-4 text-gray-400 font-bold">Commission</th>
              <th className="text-right py-3 px-4 text-gray-400 font-bold">Paid</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral) => (
              <tr key={referral.id} className="border-b border-gray-800 hover:bg-gray-700/30">
                <td className="py-3 px-4 text-gray-300 text-sm">
                  {new Date(referral.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm">
                  {referral.referredEmail}
                </td>
                <td className={`py-3 px-4 text-sm font-bold ${statusColors[referral.status]}`}>
                  {statusLabels[referral.status]}
                </td>
                <td className="py-3 px-4 text-right text-gray-300 font-bold">
                  ${referral.commission.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  {referral.paid ? (
                    <span className="text-green-400 font-bold">✓</span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Payout Button Component
function PayoutButton({ 
  earnings, 
  minPayout = 50,
  onRequest 
}: { 
  earnings: number;
  minPayout?: number;
  onRequest: () => void;
}) {
  const canPayout = earnings >= minPayout;

  return (
    <div className="bg-green-900/20 border border-green-600 rounded-lg p-6 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-2xl font-bold text-green-400 mb-2">
            💰 Available for Payout
          </h3>
          <p className="text-3xl font-bold text-white mb-1">
            ${earnings.toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm">
            {canPayout 
              ? 'Ready to withdraw!' 
              : `Minimum payout: $${minPayout.toFixed(2)}`
            }
          </p>
        </div>
        <button
          onClick={onRequest}
          disabled={!canPayout}
          className={`
            ${canPayout 
              ? 'bg-green-600 hover:bg-green-500' 
              : 'bg-gray-600 cursor-not-allowed'
            }
            text-white font-bold py-3 px-8 rounded-lg transition-colors
            disabled:opacity-50
          `}
        >
          Request Payout
        </button>
      </div>
      <p className="text-gray-400 text-xs mt-4">
        Payouts are processed via PayPal or direct deposit within 5-7 business days.
      </p>
    </div>
  );
}

// Main Page Component
export default function ReferralProgramPage() {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    pending: 0,
    signedUp: 0,
    converted: 0,
    totalEarnings: 0,
    availableForPayout: 0,
    paidOut: 0,
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Generate/Load referral code
  useEffect(() => {
    if (!currentUser) return;

    const loadReferralCode = async () => {
      try {
        // Check if user already has a referral code
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists() && userDoc.data().referralCode) {
          setReferralCode(userDoc.data().referralCode);
        } else {
          // Generate new referral code via API
          const token = await currentUser.getIdToken();
          const functionsUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
            'https://app-fbs5jy4frq-uc.a.run.app';

          const response = await fetch(`${functionsUrl}/api/referrals/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();
          
          if (data.success && data.referralCode) {
            setReferralCode(data.referralCode);
          }
        }
      } catch (error) {
        console.error('Error loading referral code:', error);
      }
    };

    loadReferralCode();
  }, [currentUser]);

  // Load referrals
  useEffect(() => {
    if (!currentUser) return;

    const referralsQuery = query(
      collection(db, 'referrals'),
      where('referrerId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      referralsQuery,
      (snapshot) => {
        const referralsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          convertedAt: doc.data().convertedAt?.toDate(),
        })) as Referral[];

        setReferrals(referralsData);

        // Calculate stats
        const newStats: ReferralStats = {
          totalReferrals: referralsData.length,
          pending: referralsData.filter(r => r.status === 'pending').length,
          signedUp: referralsData.filter(r => r.status === 'signed_up').length,
          converted: referralsData.filter(r => r.status === 'converted').length,
          totalEarnings: referralsData.reduce((sum, r) => sum + r.commission, 0),
          availableForPayout: referralsData
            .filter(r => r.status === 'converted' && !r.paid)
            .reduce((sum, r) => sum + r.commission, 0),
          paidOut: referralsData
            .filter(r => r.paid)
            .reduce((sum, r) => sum + r.commission, 0),
        };

        setStats(newStats);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching referrals:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handlePayoutRequest = async () => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();
      const functionsUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
        'https://app-fbs5jy4frq-uc.a.run.app';

      const response = await fetch(`${functionsUrl}/api/referrals/payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: stats.availableForPayout,
        }),
      });

      const data = await response.json();

      if (data.success) {
        trackEvent('referral_payout_requested', { 
          amount: stats.availableForPayout 
        });
        alert('✅ Payout request submitted! We\'ll process it within 5-7 business days.');
      } else {
        throw new Error(data.error || 'Failed to request payout');
      }
    } catch (error) {
      console.error('Error requesting payout:', error);
      alert('❌ Failed to request payout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💰</div>
          <p className="text-xl text-gray-300">Loading referral program...</p>
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
            REFER & EARN
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            Earn $10 for Every Paid Referral
          </p>
          <p className="text-lg text-gray-400">
            Help your trade buddies level up their careers and get paid!
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 mb-8">
          <h2 className="font-heading text-3xl font-bold text-yellow-400 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl">
                1️⃣
              </div>
              <h3 className="font-bold text-xl text-white mb-2">Share Your Link</h3>
              <p className="text-gray-300">
                Copy your unique referral link and share it with friends, family, or on social media.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl">
                2️⃣
              </div>
              <h3 className="font-bold text-xl text-white mb-2">They Sign Up & Pay</h3>
              <p className="text-gray-300">
                When someone uses your link to sign up and makes a purchase, you earn a commission.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl">
                3️⃣
              </div>
              <h3 className="font-bold text-xl text-white mb-2">Get Paid</h3>
              <p className="text-gray-300">
                Once you hit $50, request a payout via PayPal or direct deposit.
              </p>
            </div>
          </div>
        </div>

        {/* Referral Code Display */}
        <ReferralCodeDisplay code={referralCode} />

        {/* Share Buttons */}
        <ShareButtons code={referralCode} />

        {/* Earnings Summary */}
        <EarningsSummary stats={stats} />

        {/* Referral List */}
        <ReferralList referrals={referrals} />

        {/* Payout Button */}
        <PayoutButton 
          earnings={stats.availableForPayout} 
          onRequest={handlePayoutRequest}
        />

        {/* Terms */}
        <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h3 className="font-bold text-lg text-gray-300 mb-3">Program Terms:</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Earn $10 commission for each referred user who makes a paid purchase</li>
            <li>• Minimum payout threshold: $50</li>
            <li>• Referrals expire after 90 days if not converted</li>
            <li>• Payouts processed within 5-7 business days</li>
            <li>• Cannot refer yourself or use multiple accounts</li>
            <li>• Commission is non-transferable and non-refundable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
