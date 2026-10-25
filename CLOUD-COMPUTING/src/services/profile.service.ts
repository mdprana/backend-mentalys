import { db } from '../config/firebase.config'
import { storage } from '../config/firebase.config'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ProfileRequestBody, ProfileRequestRegisterBody } from '../types/profile.type'

export const profileService = {
  async createProfile(uid: string, profileData: ProfileRequestRegisterBody) {
    const profileRef = doc(db, 'profiles', uid)
    const timestamp = new Date().toISOString()
    const data = {
      ...profileData,
      uid,
      created_at: timestamp
    }

    await setDoc(profileRef, data)
    return data
  },

  async updateProfile(
    uid: string,
    profileData: Partial<ProfileRequestBody>,
    imageFile?: Express.Multer.File
  ) {
    const profileRef = doc(db, 'profiles', uid)
    const profileSnap = await getDoc(profileRef)

    if (!profileSnap.exists()) {
      throw new Error('Profile not found')
    }

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
    const firstName = profileData.firstName || profileSnap.data().firstName
    const lastName = profileData.lastName || profileSnap.data().lastName
    const full_name = `${firstName} ${lastName}`
    const data = {
      ...profileSnap.data(),
      ...profileData,
      ...(profile_pic && { profile_pic }),
      full_name,
      updated_at: timestamp
    }

    await setDoc(profileRef, data)
    return data
  },
  async getProfile(uid: string) {
    const profileRef = doc(db, 'profiles', uid)
    const profileSnap = await getDoc(profileRef)

    if (!profileSnap.exists()) {
      return null
    }

    return profileSnap.data()
  }
}
