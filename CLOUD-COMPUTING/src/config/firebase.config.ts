import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import * as admin from 'firebase-admin'
import * as firebase from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import 'dotenv/config'
import { getFirestore } from '@firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}
const bucketImage = process.env.FIREBASE_BUCKET_IMAGE

// Secret Manager Client
const secretClient = new SecretManagerServiceClient()

// Load Service Account Key from Secret Manager
async function getServiceAccountKey() {
  const [version] = await secretClient.accessSecretVersion({
    name: `projects/${process.env.PROJECT_ID}/secrets/${process.env.SECRET_ID}/versions/${process.env.SECRET_VERSION}`
  })

  const payload = version.payload?.data?.toString()
  if (!payload) {
    throw new Error('Failed to load service account key from Secret Manager')
  }
  return JSON.parse(payload)
}

// Initialize Firebase Admin
;(async () => {
  const serviceAccount = await getServiceAccountKey()
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  })

  console.log('Firebase Admin Initialized')
})()

// Initialize Firebase Client
const app = firebase.initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app, bucketImage)

// Export Firebase Auth & Admin SDK
export { admin, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword }
