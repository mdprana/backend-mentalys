import { Response, NextFunction } from 'express'
import { ProfileRequestBody, ProfileRequestRegisterBody } from '../types/profile.type'
import { profileService } from '../services/profile.service'
import {
  profileValidationSchema,
  profileUpdateValidationSchema
} from '../validations/profile.validation'
import { formatJoiError } from '../utils/joiValidation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../config/firebase.config'
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.type'

export const createProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { error } = profileValidationSchema.validate(req.body)
    if (error) {
      const validationError = formatJoiError(error)
      return res.status(400).json(validationError)
    }

    const uid = req.user.uid
    const profileData: ProfileRequestRegisterBody = req.body

    const usernameQuery = query(
      collection(db, 'profiles'),
      where('username', '==', profileData.username)
    )
    const usernameSnapshot = await getDocs(usernameQuery)

    if (!usernameSnapshot.empty) {
      return res.status(400).json({
        status: 'fail',
        message: 'Username already exists'
      })
    }

    const createdProfile = await profileService.createProfile(uid, profileData)

    return res.status(201).json({
      status: 'success',
      data: createdProfile
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: 'fail',
        message: 'No data provided'
      })
    }
    const { error } = profileUpdateValidationSchema.validate(req.body)
    if (error) {
      const validationError = formatJoiError(error)
      return res.status(400).json(validationError)
    }
    const uid = req.user.uid
    const profileData: Partial<ProfileRequestBody> = req.body
    if (profileData.username) {
      const usernameQuery = query(
        collection(db, 'profiles'),
        where('username', '==', profileData.username)
      )
      const usernameSnapshot = await getDocs(usernameQuery)

      if (!usernameSnapshot.empty) {
        const existingProfile = usernameSnapshot.docs[0].data()
        if (existingProfile.uid !== uid) {
          return res.status(400).json({
            status: 'fail',
            message: 'Username already exists'
          })
        }
      }
    }
    const updatedProfile = await profileService.updateProfile(uid, profileData, req.file)

    return res.status(200).json({
      status: 'success',
      data: updatedProfile
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Profile not found') {
      return res.status(404).json({
        status: 'fail',
        message: 'Profile not found'
      })
    }
    next(error)
  }
}

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const uid = req.user.uid
    const profile = await profileService.getProfile(uid)

    if (!profile) {
      return res.status(404).json({
        status: 'fail',
        message: 'Profile not found'
      })
    }

    return res.status(200).json({
      status: 'success',
      data: profile
    })
  } catch (error) {
    next(error)
  }
}
