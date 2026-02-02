import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/common/Header.jsx'
import WorkoutForm from '../components/workout/WorkoutForm.jsx'
import { saveWorkout } from '../services/workoutService.js'

export default function LogWorkout() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSave = async (workoutData) => {
    if (!user) {
      setError('You must be signed in to save workouts')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await saveWorkout(user.uid, workoutData)
      navigate('/history')
    } catch (err) {
      setError('Failed to save workout. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Log Workout" showBack />

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6">
        {error && (
          <div className="mb-6 p-4 glass-card border-red-500/30 bg-red-500/10 animate-fade-in">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        <WorkoutForm onSave={handleSave} saving={saving} />
      </main>
    </div>
  )
}
