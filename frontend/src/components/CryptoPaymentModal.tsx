// CryptoPaymentModal Component
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";

export interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierId: string;
  amount: number;
  tierName: string;
  onPaymentInitiated?: (paymentData: any) => void;
}

interface SupportedCrypto {
  name: string;
  symbol: string;
  icon: string;
  providers: string[];
}

interface PaymentData {
  provider: string;
  chargeCode?: string;
  hostedUrl?: string;
  addresses?: Record<string, string>;
  invoiceUrl?: string;
  payAddress?: string;
  payAmount?: number;
  payCurrency?: string;
}

export default function CryptoPaymentModal({
  isOpen,
  onClose,
  tierId,
  amount,
  tierName,
  onPaymentInitiated,
}: CryptoPaymentModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<string>("btc");
  const [selectedProvider, setSelectedProvider] = useState<string>("coinbase");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [supportedCryptos, setSupportedCryptos] = useState<Record<string, SupportedCrypto>>({});

  // Fetch supported cryptocurrencies
  useEffect(() => {
    const fetchSupportedCryptos = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
          "https://app-fbs5jy4frq-uc.a.run.app";
        const response = await fetch(`${baseUrl}/api/crypto/supported-currencies`);
        const data = await response.json();

        if (data.success) {
          setSupportedCryptos(data.currencies);
        }
      } catch (err) {
        console.error("Failed to fetch supported currencies:", err);
      }
    };

    if (isOpen) {
      fetchSupportedCryptos();
    }
  }, [isOpen]);

  // Generate QR code when payment address is available
  useEffect(() => {
    const generateQRCode = async () => {
      if (!paymentData) return;

      let address = "";

      if (paymentData.payAddress) {
        // NOWPayments address
        address = paymentData.payAddress;
      } else if (paymentData.addresses && selectedCrypto in paymentData.addresses) {
        // Coinbase Commerce address
        address = paymentData.addresses[selectedCrypto];
      }

      if (address) {
        try {
          const qrUrl = await QRCode.toDataURL(address, {
            width: 256,
            margin: 2,
            color: {
              dark: "#001a33",
              light: "#ffffff",
            },
          });
          setQrCodeUrl(qrUrl);
        } catch (err) {
          console.error("QR code generation failed:", err);
        }
      }
    };

    generateQRCode();
  }, [paymentData, selectedCrypto]);

  const handleCreatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get Firebase Auth token
      const {auth} = await import("@/lib/firebase");
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Please sign in to continue");
      }

      const idToken = await currentUser.getIdToken();
      const baseUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
        "https://app-fbs5jy4frq-uc.a.run.app";

      const response = await fetch(`${baseUrl}/api/crypto/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          tierId,
          provider: selectedProvider,
          currency: selectedCrypto,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create payment");
      }

      setPaymentData(data);

      // Notify parent component
      if (onPaymentInitiated) {
        onPaymentInitiated(data);
      }

      // Track analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "crypto_payment_initiated", {
          tier: tierId,
          amount,
          currency: selectedCrypto,
          provider: selectedProvider,
        });
      }
    } catch (err) {
      console.error("Payment creation error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      alert("Address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#001a33] to-[#003366] rounded-xl max-w-2xl w-full p-8 border-2 border-[#ffd700]/30 shadow-[0_0_50px_rgba(255,215,0,0.3)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#ffd700]">₿ Pay with Crypto</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80">Product:</span>
            <span className="text-white font-bold">{tierName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/80">Amount:</span>
            <span className="text-[#ffd700] text-2xl font-bold">${amount.toFixed(2)}</span>
          </div>
        </div>

        {!paymentData ? (
          <>
            {/* Provider Selection */}
            <div className="mb-6">
              <label className="text-white/80 text-sm block mb-2">Payment Provider</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedProvider("coinbase")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProvider === "coinbase"
                      ? "border-[#ffd700] bg-[#ffd700]/20"
                      : "border-white/20 bg-white/10"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏦</div>
                    <div className="text-white font-medium">Coinbase</div>
                    <div className="text-xs text-white/60">Commerce</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedProvider("nowpayments")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProvider === "nowpayments"
                      ? "border-[#ffd700] bg-[#ffd700]/20"
                      : "border-white/20 bg-white/10"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-white font-medium">NOWPayments</div>
                    <div className="text-xs text-white/60">Fast & Secure</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Cryptocurrency Selection */}
            <div className="mb-6">
              <label className="text-white/80 text-sm block mb-2">Select Cryptocurrency</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(supportedCryptos)
                  .filter(([_, crypto]) => crypto.providers.includes(selectedProvider))
                  .map(([key, crypto]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCrypto(key)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedCrypto === key
                          ? "border-[#ffd700] bg-[#ffd700]/20"
                          : "border-white/20 bg-white/10"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">{crypto.icon}</div>
                        <div className="text-white text-sm font-medium">{crypto.symbol}</div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Create Payment Button */}
            <button
              onClick={handleCreatePayment}
              disabled={loading}
              className="w-full py-4 px-6 bg-[#ffd700] hover:bg-[#ffed4e] text-[#001a33] font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#001a33]"></div>
                  Creating Payment...
                </>
              ) : (
                <>
                  🚀 Continue to Payment
                </>
              )}
            </button>

            {/* Benefits */}
            <div className="mt-6 space-y-2">
              <p className="text-white/80 text-sm">✓ Lower fees (1-2% vs 2.9%)</p>
              <p className="text-white/80 text-sm">✓ Instant settlement</p>
              <p className="text-white/80 text-sm">✓ No chargebacks</p>
              <p className="text-white/80 text-sm">✓ Global payment support</p>
            </div>
          </>
        ) : (
          <>
            {/* Payment Details */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Complete Your Payment</h3>

              {/* Hosted URL (if available) */}
              {(paymentData.hostedUrl || paymentData.invoiceUrl) && (
                <div className="mb-6">
                  <a
                    href={paymentData.hostedUrl || paymentData.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 px-6 bg-[#ffd700] hover:bg-[#ffed4e] text-[#001a33] font-bold rounded-lg text-center transition-all"
                  >
                    🔗 Open Payment Page
                  </a>
                </div>
              )}

              {/* QR Code */}
              {qrCodeUrl && (
                <div className="bg-white p-4 rounded-lg mb-4 text-center">
                  <Image
                    src={qrCodeUrl}
                    alt="Payment QR Code"
                    width={256}
                    height={256}
                    className="mx-auto"
                  />
                  <p className="text-gray-600 text-sm mt-2">Scan to pay</p>
                </div>
              )}

              {/* Payment Address */}
              {paymentData.payAddress && (
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-white/80 text-sm mb-2">Send Payment To:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/30 text-[#ffd700] p-3 rounded text-sm break-all">
                      {paymentData.payAddress}
                    </code>
                    <button
                      onClick={() => handleCopyAddress(paymentData.payAddress!)}
                      className="bg-[#ffd700] hover:bg-[#ffed4e] text-[#001a33] px-4 py-2 rounded font-bold transition-all"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Amount */}
              {paymentData.payAmount && paymentData.payCurrency && (
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-white/80 text-sm mb-2">Amount to Send:</p>
                  <p className="text-[#ffd700] text-2xl font-bold">
                    {paymentData.payAmount} {paymentData.payCurrency}
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  ⏱️ Your access will be activated automatically once the payment is confirmed on the blockchain.
                  This usually takes 10-30 minutes depending on network congestion.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
