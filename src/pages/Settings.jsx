import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'
import { muscleGroups, getExercisesByMuscleGroup } from '../services/exerciseService.js'
import { DndContext, closestCenter, PointerSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableExerciseItem({ exercise }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exercise.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <li ref={setNodeRef} style={style} className="py-3 px-4 flex items-center gap-3 border-b border-slate-700/30 last:border-b-0">
      <button {...attributes} {...listeners} className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing touch-none">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
        </svg>
      </button>
      <span className="font-medium text-white">{exercise.name}</span>
      {exercise.id.startsWith('custom-') && (
        <span className="text-xs text-cyan-500/70 ml-auto">custom</span>
      )}
    </li>
  )
}

export default function Settings() {
  const { user, updateDisplayName } = useAuth()
  const { units, setUnits, customExercises, addCustomExercise, deleteCustomExercise, exerciseOrder, setExerciseOrder, loading } = useSettings()

  const [showAddModal, setShowAddModal] = useState(false)
  const [newExercise, setNewExercise] = useState({ name: '', muscleGroup: 'Chest' })
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [savingName, setSavingName] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(muscleGroups[0])

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const groupedExercises = useMemo(() => {
    return getExercisesByMuscleGroup(customExercises, exerciseOrder)
  }, [customExercises, exerciseOrder])

  const selectedExercises = groupedExercises[selectedGroup] || []

  const handleOrderDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = selectedExercises.findIndex(e => e.id === active.id)
      const newIndex = selectedExercises.findIndex(e => e.id === over.id)
      const reordered = arrayMove(selectedExercises, oldIndex, newIndex)
      setExerciseOrder(selectedGroup, reordered.map(e => e.id))
    }
  }

  const handleSaveName = async () => {
    if (!displayName.trim()) return
    setSavingName(true)
    try {
      await updateDisplayName(displayName.trim())
    } catch (err) {
      console.error('Failed to update display name:', err)
    } finally {
      setSavingName(false)
    }
  }

  const handleUnitChange = async (newUnits) => {
    try {
      await setUnits(newUnits)
    } catch (err) {
      console.error('Failed to save units:', err)
    }
  }

  const handleAddExercise = async (e) => {
    e.preventDefault()
    if (!newExercise.name.trim()) return

    setSaving(true)
    try {
      await addCustomExercise({
        name: newExercise.name.trim(),
        muscleGroup: newExercise.muscleGroup
      })
      setNewExercise({ name: '', muscleGroup: 'Chest' })
      setShowAddModal(false)
    } catch (err) {
      console.error('Failed to add exercise:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await deleteCustomExercise(exerciseId)
    } catch (err) {
      console.error('Failed to delete exercise:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Settings" showBack showSettings={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Settings" showBack showSettings={false} />

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-6">
        {/* Display Name */}
        <section className="glass-card p-5 animate-fade-in">
          <h2 className="font-bold text-lg mb-4 text-white">Display Name</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
            <Button
              onClick={handleSaveName}
              disabled={!displayName.trim() || displayName.trim() === (user?.displayName || '') || savingName}
            >
              {savingName ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </section>

        {/* Unit Preference */}
        <section className="glass-card p-5 animate-fade-in">
          <h2 className="font-bold text-lg mb-4 text-white">Weight Unit</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleUnitChange('lbs')}
              className={`py-4 px-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                units === 'lbs'
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                  : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              Pounds (lbs)
            </button>
            <button
              onClick={() => handleUnitChange('kg')}
              className={`py-4 px-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                units === 'kg'
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                  : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              Kilograms (kg)
            </button>
          </div>
        </section>

        {/* Custom Exercises */}
        <section className="glass-card p-5 animate-fade-in animate-fade-in-delay-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-white">Custom Exercises</h2>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              + Add
            </Button>
          </div>

          {customExercises.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No custom exercises yet. Add your own exercises to track them in your workouts.
            </p>
          ) : (
            <ul className="divide-y divide-slate-700/50">
              {customExercises.map(exercise => (
                <li key={exercise.id} className="py-4 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-white">{exercise.name}</span>
                    <span className="text-sm text-slate-500 ml-2">({exercise.muscleGroup})</span>
                  </div>
                  <button
                    onClick={() => handleDeleteExercise(exercise.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Exercise Order */}
        <section className="glass-card p-5 animate-fade-in animate-fade-in-delay-2">
          <h2 className="font-bold text-lg mb-4 text-white">Exercise Order</h2>
          <p className="text-slate-500 text-sm mb-4">Drag to reorder exercises within each muscle group.</p>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full px-4 py-3 mb-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all"
          >
            {muscleGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>

          {selectedExercises.length === 0 ? (
            <p className="text-slate-500 text-sm">No exercises for this muscle group.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOrderDragEnd}>
              <SortableContext items={selectedExercises.map(e => e.id)} strategy={verticalListSortingStrategy}>
                <ul className="rounded-xl border border-slate-700/50 overflow-hidden">
                  {selectedExercises.map(exercise => (
                    <SortableExerciseItem key={exercise.id} exercise={exercise} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </section>
      </main>

      {/* Add Exercise Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Custom Exercise"
      >
        <form onSubmit={handleAddExercise} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Exercise Name
            </label>
            <input
              type="text"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              placeholder="e.g., Cable Fly"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Muscle Group
            </label>
            <select
              value={newExercise.muscleGroup}
              onChange={(e) => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all"
            >
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newExercise.name.trim() || saving}
              className="flex-1"
            >
              {saving ? 'Adding...' : 'Add Exercise'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
