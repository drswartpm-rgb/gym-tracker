import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext.jsx'

export default function WorkoutCard({ workout, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { units } = useSettings()

  const formatDate = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
  const exerciseCount = workout.exercises.length

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(workout.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div className="glass-card overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left group"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg font-bold text-white">{formatDate(workout.date)}</div>
            <div className="text-sm text-slate-500 mt-1">
              {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''} · {totalSets} set{totalSets !== 1 ? 's' : ''}
            </div>
          </div>
          <div className={`w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center transition-all duration-200 ${isExpanded ? 'bg-cyan-500/20' : 'group-hover:bg-slate-700'}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-all duration-200 ${isExpanded ? 'text-cyan-400 rotate-180' : 'text-slate-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {workout.exercises.map((ex, i) => (
            <span
              key={i}
              className="text-xs bg-slate-800/70 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700/50"
            >
              {ex.exerciseName}
            </span>
          ))}
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-slate-700/50 px-5 pb-5">
          {workout.exercises.map((exercise, i) => (
            <div key={i} className="mt-5">
              <h4 className="font-semibold text-cyan-400 mb-3">{exercise.exerciseName}</h4>
              <div className="space-y-2">
                {exercise.sets.map((set, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-md bg-slate-800/70 flex items-center justify-center text-slate-500 text-xs font-medium">{j + 1}</span>
                    <span className="text-slate-300">
                      <span className="font-semibold text-white">{set.reps}</span> reps
                    </span>
                    <span className="text-slate-600">×</span>
                    <span className="text-slate-300">
                      <span className="font-semibold text-white">{set.weight}</span> {units}
                    </span>
                  </div>
                ))}
              </div>
              {exercise.notes && (
                <p className="text-sm text-slate-500 mt-3 italic pl-9">
                  "{exercise.notes}"
                </p>
              )}
            </div>
          ))}

          <button
            onClick={handleDelete}
            className={`mt-6 flex items-center gap-2 text-sm transition-all duration-200 ${confirmDelete ? 'text-red-400 font-medium' : 'text-slate-600 hover:text-red-400'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {confirmDelete ? 'Tap again to delete' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
