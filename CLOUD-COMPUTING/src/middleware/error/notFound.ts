import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../utils/AppError'

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(AppError(`BOOM! 💥💥 Can't find ${req.originalUrl} on this server!`, 404))
}
