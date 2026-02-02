import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase.js'

export async function saveWorkout(userId, workoutData) {
  const workoutsRef = collection(db, 'users', userId, 'workouts')

  const workout = {
    date: new Date(workoutData.date).toISOString(),
    exercises: workoutData.exercises,
    createdAt: serverTimestamp()
  }

  const docRef = await addDoc(workoutsRef, workout)
  return {
    id: docRef.id,
    userId,
    date: new Date(workoutData.date),
    exercises: workoutData.exercises,
    createdAt: new Date()
  }
}

export async function getWorkouts(userId) {
  const workoutsRef = collection(db, 'users', userId, 'workouts')
  const snapshot = await getDocs(workoutsRef)

  const workouts = snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      userId,
      date: new Date(data.date),
      exercises: data.exercises,
      createdAt: data.createdAt?.toDate() || new Date()
    }
  })

  workouts.sort((a, b) => b.date - a.date)
  return workouts
}

export async function deleteWorkout(userId, workoutId) {
  const workoutRef = doc(db, 'users', userId, 'workouts', workoutId)
  await deleteDoc(workoutRef)
}

export async function getLastWorkoutByMuscleGroup(userId) {
  const workouts = await getWorkouts(userId)
  const lastWorkouts = {}

  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const group = exercise.muscleGroup
      if (group) {
        if (!lastWorkouts[group] || workout.date > lastWorkouts[group]) {
          lastWorkouts[group] = workout.date
        }
      }
    })
  })

  return lastWorkouts
}
