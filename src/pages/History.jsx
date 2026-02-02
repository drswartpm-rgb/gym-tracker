import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/common/Header.jsx'
import WorkoutList from '../components/history/WorkoutList.jsx'
import { getWorkouts, deleteWorkout } from '../services/workoutService.js'

export default function History() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts(user.uid)
        setWorkouts(data)
      } catch (err) {
        setError('Failed to load workouts')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [user])

  const handleDelete = async (workoutId) => {
    try {
      await deleteWorkout(user.uid, workoutId)
      setWorkouts(workouts.filter(w => w.id !== workoutId))
    } catch (err) {
      setError('Failed to delete workout')
      console.error(err)
    }
  }

  // Calculate stats
  const totalWorkouts = workouts.length
  const thisWeek = workouts.filter(w => {
    const diff = (new Date() - new Date(w.date)) / (1000 * 60 * 60 * 24)
    return diff < 7
  }).length

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="History" showBack />

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6">
        {/* Stats Row */}
        {!loading && workouts.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in">
            <div className="glass-card p-4">
              <p className="text-slate-500 text-sm">This Week</p>
              <p className="text-2xl font-bold text-cyan-400">{thisWeek}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-slate-500 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 glass-card border-red-500/30 bg-red-500/10 animate-fade-in">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        <WorkoutList
          workouts={workouts}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>
    </div>
  )
}
