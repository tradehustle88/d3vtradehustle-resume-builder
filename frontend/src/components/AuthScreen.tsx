'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthScreenProps {
  mode?: 'signin' | 'signup'
  redirectTo?: string
}

export default function AuthScreen({ mode = 'signin', redirectTo = '/dashboard' }: AuthScreenProps) {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'magic'>(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Firebase Auth implementation would go here
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: authMode === 'signup' ? name : undefined,
          action: authMode
        })
      })

      const data = await response.json()

      if (data.success) {
        router.push(redirectTo)
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      // Firebase Google Auth implementation
      console.log('Google Sign-In initiated')
      // In production: signInWithPopup(auth, googleProvider)
      router.push(redirectTo)
    } catch (err) {
      setError('Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      // Firebase Apple Auth implementation
      console.log('Apple Sign-In initiated')
      router.push(redirectTo)
    } catch (err) {
      setError('Apple sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/sendMagicLink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setMagicLinkSent(true)
      } else {
        setError(data.error || 'Failed to send magic link')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4 flex items-center">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            {authMode === 'signup' ? 'Sign Up' : authMode === 'magic' ? 'Magic Link' : 'Sign In'}
          </h2>
          <p className="text-xl text-gray-300">
            {authMode === 'signup'
              ? 'Create your account to save progress'
              : authMode === 'magic'
              ? 'Get a magic link sent to your email'
              : 'Welcome back to Trade Hustle'
            }
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          {/* Social Sign-In Buttons */}
          {authMode !== 'magic' && (
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleAppleSignIn}
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 border border-gray-700 disabled:opacity-50"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>
            </div>
          )}

          {/* Divider */}
          {authMode !== 'magic' && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">Or continue with email</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Magic Link Success */}
          {magicLinkSent && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm">
              ✓ Magic link sent! Check your email.
            </div>
          )}

          {/* Email/Password Form */}
          {authMode !== 'magic' ? (
            <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-white font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    placeholder="John Smith"
                  />
                </div>
              )}

              <div>
                <label className="block text-white font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="••••••••"
                />
                {authMode === 'signup' && (
                  <p className="text-gray-400 text-xs mt-1">Minimum 8 characters</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B0000] hover:bg-red-800 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          ) : (
            // Magic Link Form
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="john@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading || magicLinkSent}
                className="w-full bg-[#8B0000] hover:bg-red-800 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : magicLinkSent ? 'Link Sent!' : 'Send Magic Link'}
              </button>
            </form>
          )}

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center text-gray-400 text-sm space-y-2">
            {authMode === 'signin' && (
              <>
                <div>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-[#FFD700] hover:text-yellow-500 font-bold"
                  >
                    Sign up
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setAuthMode('magic')}
                    className="text-[#FFD700] hover:text-yellow-500 font-bold"
                  >
                    Use magic link instead
                  </button>
                </div>
              </>
            )}

            {authMode === 'signup' && (
              <div>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('signin')}
                  className="text-[#FFD700] hover:text-yellow-500 font-bold"
                >
                  Sign in
                </button>
              </div>
            )}

            {authMode === 'magic' && (
              <div>
                <button
                  onClick={() => setAuthMode('signin')}
                  className="text-[#FFD700] hover:text-yellow-500 font-bold"
                >
                  ← Back to sign in
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>🔒 Your data is encrypted and secure</p>
          <p className="mt-2">By continuing, you agree to our Terms & Privacy Policy</p>
        </div>
      </div>
    </section>
  )
}
