"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSubscribe = async (tierId: string, priceId: string) => {
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoading(tierId);
    try {
      const token = await user.getIdToken();
      const url = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || "https://app-fbs5jy4frq-uc.a.run.app";
      const res = await fetch(`${url}/api/subscription/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ priceId, tierId }),
      });
      const data = await res.json();
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Failed");
        setLoading("");
      }
    } catch (error) {
      alert("An error occurred");
      setLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#003366] to-[#001a33] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-[#ffd700] text-center mb-4">PRICING</h1>
        <p className="text-xl text-white/80 text-center mb-12">Start with $2 trial, upgrade when ready</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border-2 border-white/10 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-[#ffd700] mb-2">Free</h3>
            <div className="text-4xl font-bold text-white mb-4">$0</div>
            <ul className="space-y-2 mb-6">
              <li className="text-white/80">✓ Unlimited resumes</li>
              <li className="text-white/80">✓ Text export</li>
              <li className="text-white/40">✗ No AI</li>
            </ul>
            <button disabled className="w-full py-3 bg-white/10 text-white rounded-lg opacity-50">Free Forever</button>
          </div>

          <div className="bg-white/5 border-2 border-[#ffd700] rounded-xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
            <div className="bg-[#ffd700] text-[#001a33] px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">BEST VALUE</div>
            <h3 className="text-2xl font-bold text-[#ffd700] mb-2">7-Day Trial</h3>
            <div className="text-4xl font-bold text-white mb-4">$2</div>
            <ul className="space-y-2 mb-6">
              <li className="text-white/80">✓ All Pro features</li>
              <li className="text-white/80">✓ 200+ templates</li>
              <li className="text-white/80">✓ AI & ATS scoring</li>
            </ul>
            <button
              onClick={() => handleSubscribe("trial", process.env.NEXT_PUBLIC_STRIPE_PRICE_TRIAL || "price_trial_7day")}
              disabled={loading === "trial"}
              className="w-full py-3 bg-[#ffd700] text-[#001a33] rounded-lg font-bold hover:bg-[#ffed4e]"
            >
              {loading === "trial" ? "Processing..." : "Start Trial"}
            </button>
          </div>

          <div className="bg-white/5 border-2 border-white/10 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-[#ffd700] mb-2">Pro Monthly</h3>
            <div className="text-4xl font-bold text-white mb-4">$14.95<span className="text-lg text-white/60">/mo</span></div>
            <ul className="space-y-2 mb-6">
              <li className="text-white/80">✓ All templates</li>
              <li className="text-white/80">✓ AI suggestions</li>
              <li className="text-white/80">✓ Job tracker</li>
            </ul>
            <button
              onClick={() => handleSubscribe("proMonthly", process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly")}
              disabled={loading === "proMonthly"}
              className="w-full py-3 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              {loading === "proMonthly" ? "Processing..." : "Subscribe"}
            </button>
          </div>

          <div className="bg-white/5 border-2 border-white/10 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-[#ffd700] mb-2">Pro Annual</h3>
            <div className="text-4xl font-bold text-white mb-4">$119<span className="text-lg text-white/60">/yr</span></div>
            <p className="text-emerald-400 text-sm mb-4">Save $60/year</p>
            <ul className="space-y-2 mb-6">
              <li className="text-white/80">✓ Everything in Pro</li>
              <li className="text-white/80">✓ Priority support</li>
              <li className="text-white/80">✓ Free blueprint</li>
            </ul>
            <button
              onClick={() => handleSubscribe("proAnnual", process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL || "price_pro_annual")}
              disabled={loading === "proAnnual"}
              className="w-full py-3 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              {loading === "proAnnual" ? "Processing..." : "Subscribe"}
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="text-[#ffd700] hover:text-white underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
