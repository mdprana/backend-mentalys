import { admin, auth, firebaseAdminReady } from '../config/firebase.config'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from 'firebase/auth'

export const authService = {
  async registerWithEmail(email: string, password: string) {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const uid = userCredential.user.uid

    try {
      await sendEmailVerification(userCredential.user)
    } catch (error) {
      await admin.auth().deleteUser(uid)
      throw error
    }

    await firebaseAdminReady
    await admin.firestore().collection('users').doc(uid).set({
      uid_firebase: uid,
      email
    })
    return {
      uid,
      email: userCredential.user.email
    }
  },

  async loginWithEmail(email: string, password: string) {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await userCredential.user.getIdToken()
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      emailVerified: userCredential.user.emailVerified,
      idToken
    }
  },
  async sendPasswordReset(email: string) {
    await sendPasswordResetEmail(auth, email)
  },
  async deleteUser() {
    const user = auth.currentUser
    if (user) {
      await user.delete()
    }
  },
  async deleteUserByUid(uid: string) {
    await firebaseAdminReady
    await admin.auth().deleteUser(uid)
  },
  async signOutUser() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw new Error('Failed to sign out')
    }
  }
}
