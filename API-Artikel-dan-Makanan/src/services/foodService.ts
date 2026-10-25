import { getFirestoreInstance } from '../config/firebase'
import { IFood } from '../types/foodTypes'

export const getAllFoods = async (): Promise<IFood[]> => {
  const db = await getFirestoreInstance()
  const snapshot = await db.collection('foods').get()
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data()
      }) as IFood
  )
}

export const getFoodById = async (id: string): Promise<IFood | null> => {
  const db = await getFirestoreInstance()
  const doc = await db.collection('foods').doc(id).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() } as IFood
}

export const createFood = async (food: IFood): Promise<IFood> => {
  const db = await getFirestoreInstance()
  const docRef = await db.collection('foods').add(food)
  const newDoc = await docRef.get()
  return { id: newDoc.id, ...newDoc.data() } as IFood
}

export const updateFood = async (id: string, food: Partial<IFood>): Promise<IFood | null> => {
  const db = await getFirestoreInstance()
  const docRef = db.collection('foods').doc(id)
  const doc = await docRef.get()

  if (!doc.exists) return null

  await docRef.update(food)
  const updated = await docRef.get()
  return { id: updated.id, ...updated.data() } as IFood
}

export const deleteFood = async (id: string): Promise<boolean> => {
  const db = await getFirestoreInstance()
  const doc = await db.collection('foods').doc(id).get()
  if (!doc.exists) return false

  await db.collection('foods').doc(id).delete()
  return true
}
