import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { signInWithEmail, signUpWithEmail, resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (isForgotPassword) {
      const result = await resetPassword(email)
      if (result.error) {
        setError(result.error)
      } else {
        setMessage('Password reset email sent. Check your inbox.')
        setIsForgotPassword(false)
      }
      setLoading(false)
      return
    }

    if (isSignUp) {
      const result = await signUpWithEmail(email, password, displayName)
      if (result.error) {
        setError(result.error)
      }
    } else {
      const result = await signInWithEmail(email, password)
      if (result.error) {
        setError(result.error)
      }
    }
    setLoading(false)
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setIsForgotPassword(false)
    setError('')
    setMessage('')
  }

  if (isForgotPassword) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        {message && (
          <p className="text-green-400 text-sm">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          onClick={() => setIsForgotPassword(false)}
          className="w-full text-sm text-slate-400 hover:text-white transition-colors"
        >
          Back to Sign In
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
            placeholder="Your name"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
          placeholder={isSignUp ? 'At least 6 characters' : 'Your password'}
          required
          minLength={6}
        />
      </div>

      {!isSignUp && (
        <button
          type="button"
          onClick={() => setIsForgotPassword(true)}
          className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          Forgot password?
        </button>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      {message && (
        <p className="text-green-400 text-sm">{message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-slate-400">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={toggleMode}
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </form>
  )
}
