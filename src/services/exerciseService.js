import { defaultExercises, muscleGroups } from '../data/defaultExercises.js'

export function getAllExercises(customExercises = []) {
  return [...defaultExercises, ...customExercises]
}

export function getExercisesByMuscleGroup(customExercises = [], exerciseOrder = {}) {
  const allExercises = getAllExercises(customExercises)
  const grouped = {}

  muscleGroups.forEach(group => {
    grouped[group] = allExercises.filter(e => e.muscleGroup === group)
  })

  // Add any custom muscle groups
  allExercises.forEach(exercise => {
    if (!muscleGroups.includes(exercise.muscleGroup)) {
      if (!grouped[exercise.muscleGroup]) {
        grouped[exercise.muscleGroup] = []
      }
      if (!grouped[exercise.muscleGroup].find(e => e.id === exercise.id)) {
        grouped[exercise.muscleGroup].push(exercise)
      }
    }
  })

  // Apply custom ordering per group
  for (const group of Object.keys(grouped)) {
    const order = exerciseOrder[group]
    if (order && order.length > 0) {
      const orderMap = new Map(order.map((id, i) => [id, i]))
      grouped[group].sort((a, b) => {
        const aIdx = orderMap.has(a.id) ? orderMap.get(a.id) : Infinity
        const bIdx = orderMap.has(b.id) ? orderMap.get(b.id) : Infinity
        return aIdx - bIdx
      })
    }
  }

  return grouped
}

export function searchExercises(query, customExercises = []) {
  const allExercises = getAllExercises(customExercises)
  const lowerQuery = query.toLowerCase()

  return allExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(lowerQuery) ||
    exercise.muscleGroup.toLowerCase().includes(lowerQuery)
  )
}

export { muscleGroups }
