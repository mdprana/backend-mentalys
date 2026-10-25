import { Request, Response, NextFunction } from 'express'
import { AxiosError } from 'axios'
import { AppError } from '../utils/AppError'

const handleAxiosError = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (!(err instanceof Error)) {
    return next(AppError('Terjadi kesalahan internal server', 500))
  }

  const axiosError = err as AxiosError

  if (axiosError.isAxiosError && axiosError.response) {
    const statusCode = axiosError.response.status
    const message = (axiosError.response.data as { message: string }).message
    switch (statusCode) {
      case 400:
        return next(AppError(`Bad Request: ${message}`, 400))

      case 401:
        return next(AppError(`Unauthorized: ${message}`, 401))

      case 403:
        return next(AppError(`Forbidden: ${message}`, 403))

      case 404:
        return next(AppError(`Not Found: ${message}`, 404))

      case 429:
        return next(AppError(`Too Many Requests: ${message}`, 429))

      case 500:
        return next(AppError(`Server Error: ${message}`, 500))

      default:
        return next(AppError(`Unexpected Error: ${message}`, statusCode))
    }
  }

  return next(AppError('Terjadi kesalahan internal server', 500))
}

export default handleAxiosError
