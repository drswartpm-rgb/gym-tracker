import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import LoginForm from '../components/auth/LoginForm.jsx'

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [googleError, setGoogleError] = useState('')

  const handleGoogleSignIn = async () => {
    setGoogleError('')
    const result = await signInWithGoogle()
    if (result.error) {
      setGoogleError(result.error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
          >
            <source src="/videos/armcurl.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
          {/* Logo/Brand */}
          <div className="mb-12 text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <svg className="w-10 h-10 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-9 4 18 3-9h4" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
              Gym<span className="text-cyan-400">Tracker</span>
            </h1>
            <p className="text-slate-400 text-lg">Track your progress. Crush your goals.</p>
          </div>

          {/* Auth Section */}
          <div className="w-full max-w-sm space-y-4">
            {!showEmailForm ? (
              <>
                {/* Google Sign-In */}
                <button
                  onClick={handleGoogleSignIn}
                  className="animate-fade-in animate-fade-in-delay-1 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600/50 transition-all duration-200 group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">Continue with Google</span>
                </button>

                {googleError && (
                  <p className="text-red-400 text-sm text-center">{googleError}</p>
                )}

                {/* Divider */}
                <div className="animate-fade-in animate-fade-in-delay-2 flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-700/50"></div>
                  <span className="text-slate-500 text-sm">or continue with email</span>
                  <div className="flex-1 h-px bg-slate-700/50"></div>
                </div>

                {/* Email Sign-In Button */}
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="animate-fade-in animate-fade-in-delay-2 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600/50 transition-all duration-200 group"
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">Sign in with Email</span>
                </button>
              </>
            ) : (
              <>
                <div className="animate-fade-in">
                  <LoginForm />
                </div>
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="w-full text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Back to other options
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="mt-12 text-sm text-slate-600 animate-fade-in animate-fade-in-delay-3">
            Your data syncs across all your devices
          </p>
        </div>
      </div>
    )
  }

  // Logged in view
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="GymTracker" showBack={false} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-10 animate-fade-in">
          <p className="text-slate-400 text-lg">
            Welcome back, <span className="text-cyan-400 font-medium">{user.displayName?.split(' ')[0] || 'Athlete'}</span>
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <Link to="/log" className="block animate-fade-in animate-fade-in-delay-1">
            <Button className="w-full" size="lg">
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Log Workout
              </span>
            </Button>
          </Link>

          <Link to="/history" className="block animate-fade-in animate-fade-in-delay-2">
            <Button variant="secondary" className="w-full" size="lg">
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View History
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
