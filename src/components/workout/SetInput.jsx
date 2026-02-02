import { useSettings } from '../../context/SettingsContext.jsx'

export default function SetInput({ set, index, onChange, onRemove }) {
  const { units } = useSettings()

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-slate-400 w-8 text-center">{index + 1}</span>
      <input
        type="number"
        placeholder="Reps"
        value={set.reps || ''}
        onChange={(e) => onChange({ ...set, reps: parseInt(e.target.value) || 0 })}
        className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-center text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        min="0"
      />
      <span className="text-slate-400">x</span>
      <input
        type="number"
        placeholder="Weight"
        value={set.weight || ''}
        onChange={(e) => onChange({ ...set, weight: parseFloat(e.target.value) || 0 })}
        className="w-24 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-center text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        min="0"
        step="0.5"
      />
      <span className="text-slate-400 w-8">{units}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-red-400 hover:text-red-300 ml-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
