'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackCustomEvent } from '@/lib/analytics';
import CryptoPaymentModal from '@/components/CryptoPaymentModal';

export default function CheckoutPage() {
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    zip: ''
  });

  useEffect(() => {
    const trade = localStorage.getItem('selectedTrade') || '';
    const template = localStorage.getItem('selectedTemplate') || '';
    setSelectedTrade(trade);
    setSelectedTemplate(template);

    // Pre-fill email from resume data if available
    const resumeData = localStorage.getItem('resumeData');
    if (resumeData) {
      const parsed = JSON.parse(resumeData);
      if (parsed.personalInfo?.email) {
        setFormData(prev => ({ ...prev, email: parsed.personalInfo.email }));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      trackCustomEvent('checkout_started', {
        trade: selectedTrade,
        template: selectedTemplate,
        paymentMethod
      });

      // Handle crypto payment separately
      if (paymentMethod === 'crypto') {
        setShowCryptoModal(true);
        setLoading(false);
        return;
      }

      // TODO: Process payment via your payment provider (Stripe, etc.)
      // const paymentResult = await processPayment(formData, 23.00);

      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate success
      trackCustomEvent('purchase_completed', {
        trade: selectedTrade,
        template: selectedTemplate,
        amount: 23.00
      });

      // Store payment success for thank you page
      localStorage.setItem('paymentSuccess', 'true');
      localStorage.setItem('purchaseEmail', formData.email);

      window.location.href = '/resume-builder/thankyou';

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      trackCustomEvent('payment_failed', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Back link */}
        <div className="mb-8">
          <Link href="/resume-builder/editor" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2">
            ← Back to Editor
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Secure Checkout
          </h1>
          <p className="text-xl text-gray-300">
            Complete your purchase to download your professional resume
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">✓</div>
              <span className="text-green-400 ml-2">Trade</span>
            </div>
            <div className="w-12 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">✓</div>
              <span className="text-green-400 ml-2">Template</span>
            </div>
            <div className="w-12 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">✓</div>
              <span className="text-green-400 ml-2">Edit</span>
            </div>
            <div className="w-12 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
              <span className="text-white ml-2">Checkout</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">AI Resume Builder</span>
                  <span className="text-white">$47.00</span>
                </div>

                <div className="flex justify-between items-center text-green-400">
                  <span>Launch Discount (51% OFF)</span>
                  <span>-$24.00</span>
                </div>

                <hr className="border-gray-600" />

                <div className="flex justify-between items-center text-xl font-bold text-white">
                  <span>Total</span>
                  <span>$23.00</span>
                </div>
              </div>

              <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <h3 className="text-green-300 font-semibold mb-2">What You Get:</h3>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>✓ AI-generated resume content</li>
                  <li>✓ ATS-optimized template</li>
                  <li>✓ PDF & Word downloads</li>
                  <li>✓ Trade-specific formatting</li>
                  <li>✓ 30-day money-back guarantee</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
                  <span>🔒</span>
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="text-gray-400 text-xs">
                  Your payment information is secure and encrypted
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">

              {error && (
                <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-red-300">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                          ? 'border-red-500 bg-red-600/20'
                          : 'border-white/20 bg-white/10'
                        }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">💳</div>
                        <div className="text-white font-medium">Credit Card</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'paypal'
                          ? 'border-red-500 bg-red-600/20'
                          : 'border-white/20 bg-white/10'
                        }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">🅿️</div>
                        <div className="text-white font-medium">PayPal</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'crypto'
                          ? 'border-red-500 bg-red-600/20'
                          : 'border-white/20 bg-white/10'
                        }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">₿</div>
                        <div className="text-white font-medium">Crypto</div>
                        <div className="text-xs text-green-400">Lower Fees</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'card' && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Card Information</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            required
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                          <input
                            type="text"
                            name="cvc"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            required
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          required
                          placeholder="12345"
                          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal */}
                {paymentMethod === 'paypal' && (
                  <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">🅿️</div>
                    <h3 className="text-lg font-bold text-white mb-2">Pay with PayPal</h3>
                    <p className="text-gray-300 text-sm">
                      You'll be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        🔒 Complete Purchase - $23.00
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-4">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                    30-day money-back guarantee.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Crypto Payment Modal */}
      <CryptoPaymentModal
        isOpen={showCryptoModal}
        onClose={() => setShowCryptoModal(false)}
        tierId="blueprint"
        amount={23.00}
        tierName="AI Resume Builder"
        onPaymentInitiated={(paymentData) => {
          console.log('Crypto payment initiated:', paymentData);
          trackCustomEvent('crypto_payment_started', {
            trade: selectedTrade,
            template: selectedTemplate,
            provider: paymentData.provider,
          });
        }}
      />
    </div>
  );
}
