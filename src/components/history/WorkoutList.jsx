import WorkoutCard from './WorkoutCard.jsx'

export default function WorkoutList({ workouts, onDelete, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="spinner"></div>
        <p className="text-slate-500 mt-4">Loading workouts...</p>
      </div>
    )
  }

  if (workouts.length === 0) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">No workouts yet</h3>
        <p className="text-slate-500">Log your first workout to see it here!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout, index) => (
        <div key={workout.id} className={`animate-fade-in animate-fade-in-delay-${Math.min(index + 1, 6)}`}>
          <WorkoutCard
            workout={workout}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  )
}
