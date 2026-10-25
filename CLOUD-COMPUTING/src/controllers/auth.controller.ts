import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { AuthRequestBody } from '../types/authRequest.type'
import { authService } from '../services/auth.service'
import { registrationSchema } from '../validations/auth.validation'
import { formatJoiError } from '../utils/joiValidation'
import { admin, firebaseAdminReady } from '../config/firebase.config'
import { profileService } from '../services/profile.service'
import { ProfileRequestBody } from '../types/profile.type'

export const registerUser = async (
  req: Request<AuthRequestBody>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email, password, username, firstName, lastName, phoneNumber } = req.body
  const { error } = registrationSchema.validate(req.body)
  const fullName = `${firstName} ${lastName}`

  if (error) {
    const validationError = formatJoiError(error)
    return res.status(400).json(validationError)
  }

  let createdUid: string | undefined

  try {
    const userData = await authService.registerWithEmail(email, password)
    createdUid = userData.uid
    const userProfile: ProfileRequestBody = {
      username: username!,
      firstName: firstName!,
      lastName: lastName!,
      full_name: fullName!,
      phoneNumber: phoneNumber!,
      ...(req.body.location && { location: req.body.location }),
      ...(req.body.birth_date && { birth_date: req.body.birth_date }),
      ...(req.body.gender && { gender: req.body.gender })
    }
    if (userProfile.username) {
      const uid = userData.uid
      await firebaseAdminReady
      const usernameSnapshot = await admin
        .firestore()
        .collection('profiles')
        .where('username', '==', userProfile.username)
        .get()

      if (!usernameSnapshot.empty) {
        const existingProfile = usernameSnapshot.docs[0].data()

        if (existingProfile.uid !== uid) {
          try {
            await authService.deleteUserByUid(uid)
          } catch (deleteError) {
            console.error('Failed to delete user after username conflict:', deleteError)
          }

          return res.status(400).json({
            status: 'fail',
            message: 'Username already exists'
          })
        }
      }
    }

    await profileService.createProfile(userData.uid, userProfile)
    return res.status(201).json({
      status: 'success',
      message: 'Email verifikasi telah dikirim. Silakan periksa email Anda.'
    })
  } catch (error: unknown) {
    if (createdUid) {
      try {
        await authService.deleteUserByUid(createdUid)
      } catch (deleteError) {
        console.error('Failed to delete user after profile creation failure:', deleteError)
      }
    }

    next(error)
  }
}

export const loginUser = async (
  req: Request<AuthRequestBody>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(AppError('Email dan password harus diisi', 400))
  }

  try {
    const userData = await authService.loginWithEmail(email, password)
    if (!userData.emailVerified) {
      return res.status(403).json({
        status: 'fail',
        message: 'Email Anda belum terverifikasi. Silakan periksa email Anda.'
      })
    }

    const userDataNoToken = {
      uid: userData.uid,
      email: userData.email
    }
    return res.status(200).json({
      status: 'success',
      profile: await profileService.getProfile(userData.uid),
      data: userDataNoToken,
      idToken: userData.idToken
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (
  req: Request<{ email: string }>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email } = req.body

  if (!email) {
    return next(AppError('Email harus diisi', 400))
  }

  try {
    await firebaseAdminReady
    const querySnapshot = await admin
      .firestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get()

    if (querySnapshot.empty) {
      return res.status(404).json({
        status: 'fail',
        message: 'Email tidak terdaftar'
      })
    }
    await authService.sendPasswordReset(email)
    return res.status(200).json({
      status: 'success',
      message: 'Email pemulihan kata sandi telah dikirim.'
    })
  } catch (error) {
    next(error)
  }
}

export const signOutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    await authService.signOutUser()
    return res.status(200).json({
      status: 'success',
      message: 'Anda telah berhasil keluar.'
    })
  } catch (error) {
    next(error)
  }
}
