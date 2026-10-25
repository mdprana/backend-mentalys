import { Request, Response, NextFunction } from 'express'
import { AuthError, AuthErrorCodes } from 'firebase/auth'
import { AppError } from '../utils/AppError'

const firebaseErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (!(err instanceof Error)) {
    return next(AppError('Terjadi kesalahan internal server', 500))
  }

  const authError = err as AuthError

  if (authError.code) {
    switch (authError.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
      case 'auth/email-already-in-use':
        return next(AppError('Email sudah terdaftar', 409))

      case AuthErrorCodes.INVALID_EMAIL:
      case 'auth/invalid-email':
        return next(AppError('Format email tidak valid', 400))

      case AuthErrorCodes.WEAK_PASSWORD:
      case 'auth/weak-password':
        return next(AppError('Password terlalu lemah', 400))

      case AuthErrorCodes.USER_DELETED:
      case 'auth/user-not-found':
        return next(AppError('Email atau password salah', 401))

      case AuthErrorCodes.INVALID_PASSWORD:
      case 'auth/wrong-password':
        return next(AppError('Email atau password salah', 401))

      case AuthErrorCodes.INVALID_IDP_RESPONSE:
      case 'auth/invalid-credential':
        return next(AppError('Kredensial tidak valid', 401))

      // Additional Cases
      case AuthErrorCodes.UNVERIFIED_EMAIL:
      case 'auth/email-not-verified':
        return next(AppError('Email belum diverifikasi. Silakan verifikasi email Anda.', 403))

      case 'auth/reset-password-exceeded':
        return next(
          AppError('Permintaan pemulihan kata sandi telah melebihi batas. Coba lagi nanti.', 429)
        )

      case 'auth/expired-action-code':
        return next(
          AppError('Kode pemulihan telah kedaluwarsa. Silakan kirim permintaan baru.', 400)
        )

      case 'auth/invalid-action-code':
        return next(
          AppError('Kode pemulihan tidak valid. Pastikan kode yang Anda masukkan benar.', 400)
        )

      default:
        return next(
          AppError(`Kesalahan autentikasi: ${authError.message || 'Terjadi kesalahan'}`, 500)
        )
    }
  }

  return next(AppError('Terjadi kesalahan internal server', 500))
}

export default firebaseErrorHandler
