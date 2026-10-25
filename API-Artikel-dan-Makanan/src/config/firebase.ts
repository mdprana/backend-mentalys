import admin from 'firebase-admin'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

let firestoreInstance: FirebaseFirestore.Firestore | null = null
let isInitialized = false

const initializeFirestore = async (): Promise<void> => {
  if (isInitialized) return // Jika sudah diinisialisasi, keluar

  const client = new SecretManagerServiceClient()
  const [accessResponse] = await client.accessSecretVersion({
    name: `process.env.FIREBASE_SERVICE_ACCOUNT_KEY`
  })

  const serviceAccount = JSON.parse(accessResponse.payload?.data?.toString() || '{}')

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })

  firestoreInstance = admin.firestore()
  isInitialized = true
}

export const getFirestoreInstance = async (): Promise<FirebaseFirestore.Firestore> => {
  if (!isInitialized) {
    await initializeFirestore() // Pastikan inisialisasi selesai
  }

  if (!firestoreInstance) {
    throw new Error('Firestore is not initialized yet. Please wait for initialization.')
  }

  return firestoreInstance
}
