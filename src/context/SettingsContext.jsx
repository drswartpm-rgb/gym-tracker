import { createContext, useContext, useEffect, useReducer } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../services/firebase.js'
import { useAuth } from './AuthContext.jsx'

const SettingsContext = createContext()

const initialState = {
  units: 'lbs',
  customExercises: [],
  exerciseOrder: {},
  loading: true
}

function settingsReducer(state, action) {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, ...action.payload, loading: false }
    case 'SET_UNITS':
      return { ...state, units: action.payload }
    case 'ADD_CUSTOM_EXERCISE':
      return {
        ...state,
        customExercises: [...state.customExercises, action.payload]
      }
    case 'DELETE_CUSTOM_EXERCISE':
      return {
        ...state,
        customExercises: state.customExercises.filter(e => e.id !== action.payload)
      }
    case 'SET_EXERCISE_ORDER':
      return {
        ...state,
        exerciseOrder: {
          ...state.exerciseOrder,
          [action.payload.group]: action.payload.orderedIds
        }
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'RESET' })
      return
    }

    const loadSettings = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const settingsRef = doc(db, 'users', user.uid, 'settings', 'preferences')
        const snapshot = await getDoc(settingsRef)

        if (snapshot.exists()) {
          dispatch({ type: 'SET_SETTINGS', payload: snapshot.data() })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadSettings()
  }, [user])

  const saveSettings = async (newSettings) => {
    if (!user) return

    const settings = {
      units: newSettings.units ?? state.units,
      customExercises: newSettings.customExercises ?? state.customExercises,
      exerciseOrder: newSettings.exerciseOrder ?? state.exerciseOrder
    }

    try {
      const settingsRef = doc(db, 'users', user.uid, 'settings', 'preferences')
      await setDoc(settingsRef, settings, { merge: true })
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const setUnits = (units) => {
    dispatch({ type: 'SET_UNITS', payload: units })
    saveSettings({ units })
  }

  const addCustomExercise = (exercise) => {
    const newExercise = {
      ...exercise,
      id: `custom-${Date.now()}`
    }
    dispatch({ type: 'ADD_CUSTOM_EXERCISE', payload: newExercise })
    saveSettings({
      customExercises: [...state.customExercises, newExercise]
    })
    return newExercise
  }

  const deleteCustomExercise = (exerciseId) => {
    dispatch({ type: 'DELETE_CUSTOM_EXERCISE', payload: exerciseId })
    saveSettings({
      customExercises: state.customExercises.filter(e => e.id !== exerciseId)
    })
  }

  const setExerciseOrder = (group, orderedIds) => {
    dispatch({ type: 'SET_EXERCISE_ORDER', payload: { group, orderedIds } })
    const newExerciseOrder = { ...state.exerciseOrder, [group]: orderedIds }
    saveSettings({ exerciseOrder: newExerciseOrder })
  }

  const value = {
    ...state,
    setUnits,
    addCustomExercise,
    deleteCustomExercise,
    setExerciseOrder
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
