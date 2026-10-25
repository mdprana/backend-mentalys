import { admin, firebaseAdminReady } from '../config/firebase.config'
import { storage } from '../config/firebase.config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ProfileRequestBody, ProfileRequestRegisterBody } from '../types/profile.type'

export const profileService = {
  async createProfile(uid: string, profileData: ProfileRequestRegisterBody) {
    await firebaseAdminReady
    const timestamp = new Date().toISOString()
    const data = {
      ...profileData,
      uid,
      created_at: timestamp
    }

    await admin.firestore().collection('profiles').doc(uid).set(data)
    return data
  },

  async updateProfile(
    uid: string,
    profileData: Partial<ProfileRequestBody>,
    imageFile?: Express.Multer.File
  ) {
    await firebaseAdminReady
    const profileRef = admin.firestore().collection('profiles').doc(uid)
    const profileSnap = await profileRef.get()
    const existingData = profileSnap.exists ? profileSnap.data() || {} : {}

    let profile_pic = profileData.profile_pic

    if (imageFile) {
      const storageRef = ref(
        storage,
        `profile_images/${uid}/${Date.now()}_${imageFile.originalname}`
      )
      const snapshot = await uploadBytes(storageRef, imageFile.buffer)
      profile_pic = await getDownloadURL(snapshot.ref)
    }

    const timestamp = new Date().toISOString()
    const nameParts = profileData.full_name?.trim().split(/\s+/) || []
    const firstName = profileData.firstName || existingData.firstName || nameParts[0] || 'Mentalys'
    const lastName = profileData.lastName || existingData.lastName || nameParts.slice(1).join(' ') || 'User'
    const full_name = profileData.full_name || `${firstName} ${lastName}`
    const data = {
      ...existingData,
      ...profileData,
      ...(profile_pic && { profile_pic }),
      uid,
      firstName,
      lastName,
      full_name,
      created_at: existingData.created_at || timestamp,
      updated_at: timestamp
    }

    await profileRef.set(data)
    return data
  },
  async getProfile(uid: string) {
    await firebaseAdminReady
    const profileSnap = await admin.firestore().collection('profiles').doc(uid).get()

    if (!profileSnap.exists) {
      return null
    }

    return profileSnap.data()
  }
}
