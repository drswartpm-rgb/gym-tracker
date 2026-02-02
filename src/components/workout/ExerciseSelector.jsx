import { useState, useMemo, useEffect } from 'react'
import { getExercisesByMuscleGroup, muscleGroups } from '../../services/exerciseService.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getLastWorkoutByMuscleGroup } from '../../services/workoutService.js'

export default function ExerciseSelector({ onSelect, selectedExercises = [] }) {
  const [activeGroup, setActiveGroup] = useState(null)
  const [lastWorkouts, setLastWorkouts] = useState({})
  const { customExercises } = useSettings()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      getLastWorkoutByMuscleGroup(user.uid).then(setLastWorkouts)
    }
  }, [user])

  const groupedExercises = useMemo(() => {
    return getExercisesByMuscleGroup(customExercises)
  }, [customExercises])

  const handleSelect = (exercise) => {
    if (!selectedExercises.find(e => e.exerciseId === exercise.id)) {
      onSelect(exercise)
    }
  }

  const isSelected = (exerciseId) => {
    return selectedExercises.some(e => e.exerciseId === exerciseId)
  }

  const getDaysAgo = (group) => {
    const lastDate = lastWorkouts[group]
    if (!lastDate) return null

    const now = new Date()
    const diff = Math.floor((now - new Date(lastDate)) / (1000 * 60 * 60 * 24))

    if (diff === 0) return 'Today'
    if (diff === 1) return '1 day ago'
    return `${diff} days ago`
  }

  const exercises = activeGroup ? groupedExercises[activeGroup] || [] : []

  // Body part selector grid view
  if (!activeGroup) {
    return (
      <div className="bg-slate-800 rounded-xl p-5">
        <h2 className="text-white font-bold text-lg mb-4">Select Body Part</h2>
        <div className="grid grid-cols-2 gap-3">
          {muscleGroups.map(group => {
            const daysAgo = getDaysAgo(group)
            return (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className="py-4 px-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-colors text-center"
              >
                <div className="text-white font-medium">{group}</div>
                {daysAgo && (
                  <div className="text-slate-400 text-sm mt-1">{daysAgo}</div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Exercise list view
  return (
    <div className="bg-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setActiveGroup(null)}
          className="text-slate-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-white font-bold text-lg">{activeGroup}</h2>
      </div>

      <div className="bg-slate-700 rounded-lg max-h-64 overflow-y-auto">
        {exercises.map(exercise => (
          <button
            key={exercise.id}
            type="button"
            onClick={() => handleSelect(exercise)}
            disabled={isSelected(exercise.id)}
            className={`w-full px-4 py-3 text-left hover:bg-slate-600 border-b border-slate-600 last:border-b-0 transition-colors ${
              isSelected(exercise.id) ? 'opacity-50 cursor-not-allowed bg-slate-600' : ''
            }`}
          >
            <span className="text-white">{exercise.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
