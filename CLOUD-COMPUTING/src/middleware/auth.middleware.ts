import { Request, Response, NextFunction } from 'express'
import { admin } from '../config/firebase.config'

interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' })
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: 'Unauthorized - Invalid token' })
  }
}
