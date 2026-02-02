import { useState, useEffect, useMemo } from 'react'
import { muscleGroups, getExercisesByMuscleGroup } from '../../services/exerciseService.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getLastWorkoutByMuscleGroup } from '../../services/workoutService.js'
import Button from '../common/Button.jsx'

// Body part icons
const bodyPartIcons = {
  Chest: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  Back: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Legs: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75" />
    </svg>
  ),
  Shoulders: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  ),
  Arms: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Core: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25" />
    </svg>
  ),
}

export default function WorkoutForm({ onSave, saving = false }) {
  const [step, setStep] = useState('bodyPart')
  const [selectedBodyPart, setSelectedBodyPart] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [numSets, setNumSets] = useState(null)
  const [setsData, setSetsData] = useState([])
  const [lastWorkouts, setLastWorkouts] = useState({})
  const { units, customExercises } = useSettings()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      getLastWorkoutByMuscleGroup(user.uid).then(setLastWorkouts)
    }
  }, [user])

  const groupedExercises = useMemo(() => {
    return getExercisesByMuscleGroup(customExercises)
  }, [customExercises])

  const getDaysAgo = (group) => {
    const lastDate = lastWorkouts[group]
    if (!lastDate) return null

    const now = new Date()
    const diff = Math.floor((now - new Date(lastDate)) / (1000 * 60 * 60 * 24))

    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    return `${diff}d ago`
  }

  const handleSelectBodyPart = (bodyPart) => {
    setSelectedBodyPart(bodyPart)
    setStep('exercise')
  }

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise)
    setStep('sets')
  }

  const handleSelectSets = (num) => {
    setNumSets(num)
    setSetsData(Array(num).fill(null).map(() => ({ reps: '', weight: '' })))
    setStep('input')
  }

  const handleUpdateSet = (index, field, value) => {
    setSetsData(setsData.map((set, i) =>
      i === index ? { ...set, [field]: value } : set
    ))
  }

  const handleBack = () => {
    if (step === 'exercise') {
      setStep('bodyPart')
      setSelectedBodyPart(null)
    } else if (step === 'sets') {
      setStep('exercise')
      setSelectedExercise(null)
    } else if (step === 'input') {
      setStep('sets')
      setNumSets(null)
      setSetsData([])
    }
  }

  const handleSubmit = () => {
    const validSets = setsData
      .map(s => ({
        reps: parseInt(s.reps) || 0,
        weight: parseFloat(s.weight) || 0
      }))
      .filter(s => s.reps > 0 || s.weight > 0)

    if (validSets.length === 0) return

    onSave({
      date: new Date().toISOString().split('T')[0],
      exercises: [{
        muscleGroup: selectedBodyPart,
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
        sets: validSets
      }]
    })
  }

  const isValid = setsData.some(s =>
    (parseInt(s.reps) || 0) > 0 || (parseFloat(s.weight) || 0) > 0
  )

  const BackButton = () => (
    <button
      type="button"
      onClick={handleBack}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  )

  // Step 1: Select Body Part
  if (step === 'bodyPart') {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Select Body Part</h2>
        <div className="grid grid-cols-2 gap-3">
          {muscleGroups.map((group, index) => {
            const daysAgo = getDaysAgo(group)
            return (
              <button
                key={group}
                type="button"
                onClick={() => handleSelectBodyPart(group)}
                className={`animate-fade-in animate-fade-in-delay-${index + 1} group relative py-5 px-4 rounded-2xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/70 hover:border-cyan-500/30 transition-all duration-200 text-left overflow-hidden`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all duration-300" />

                <div className="relative">
                  <div className="text-slate-400 group-hover:text-cyan-400 transition-colors mb-2">
                    {bodyPartIcons[group]}
                  </div>
                  <div className="text-white font-semibold text-lg">{group}</div>
                  {daysAgo && (
                    <div className="text-slate-500 text-sm mt-1">{daysAgo}</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Step 2: Select Exercise
  if (step === 'exercise') {
    const exercises = groupedExercises[selectedBodyPart] || []
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div>
            <p className="text-slate-500 text-sm">Body Part</p>
            <h2 className="text-xl font-bold text-white tracking-tight">{selectedBodyPart}</h2>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/50 overflow-hidden max-h-80 overflow-y-auto">
          {exercises.map((exercise, index) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => handleSelectExercise(exercise)}
              className={`animate-fade-in animate-fade-in-delay-${Math.min(index + 1, 6)} w-full px-5 py-4 text-left hover:bg-slate-800/70 border-b border-slate-700/30 last:border-b-0 transition-all duration-200 group`}
            >
              <span className="text-slate-200 group-hover:text-cyan-400 font-medium transition-colors">{exercise.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Step 3: Select Number of Sets
  if (step === 'sets') {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div>
            <p className="text-slate-500 text-sm">{selectedBodyPart}</p>
            <h2 className="text-xl font-bold text-white tracking-tight">{selectedExercise.name}</h2>
          </div>
        </div>

        <p className="text-slate-400 mb-5 font-medium">How many sets?</p>

        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((num, index) => (
            <button
              key={num}
              type="button"
              onClick={() => handleSelectSets(num)}
              className={`animate-fade-in animate-fade-in-delay-${index + 1} py-5 rounded-2xl border border-slate-700/50 bg-slate-800/30 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200 text-white font-bold text-xl hover:text-cyan-400 hover:scale-105 active:scale-95`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Step 4: Input Reps and Weight
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div>
            <p className="text-slate-500 text-sm">{selectedBodyPart}</p>
            <h2 className="text-xl font-bold text-white tracking-tight">{selectedExercise.name}</h2>
          </div>
        </div>

        <div className="space-y-4">
          {setsData.map((set, index) => (
            <div
              key={index}
              className={`animate-fade-in animate-fade-in-delay-${index + 1} flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30`}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 font-bold">{index + 1}</span>
              </div>

              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-slate-500 text-xs uppercase tracking-wider mb-1 block">Reps</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={set.reps}
                    onChange={(e) => handleUpdateSet(index, 'reps', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 text-center text-lg font-semibold focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all"
                    inputMode="numeric"
                  />
                </div>

                <span className="text-slate-600 text-2xl font-light mt-5">×</span>

                <div className="flex-1">
                  <label className="text-slate-500 text-xs uppercase tracking-wider mb-1 block">{units}</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={set.weight}
                    onChange={(e) => handleUpdateSet(index, 'weight', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 text-center text-lg font-semibold focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all"
                    inputMode="decimal"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid || saving}
        className="w-full"
        size="lg"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Save Workout
          </span>
        )}
      </Button>
    </div>
  )
}
