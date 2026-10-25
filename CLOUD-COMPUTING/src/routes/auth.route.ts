import { NextFunction, Request, Response, Router } from 'express'
import { loginUser, registerUser, resetPassword, signOutUser } from '../controllers/auth.controller'
import firebaseErrorHandler from '../middleware/firebaseErrorHandler'
import { AuthRequestBody } from '../types/authRequest.type'

const authRouter: Router = Router()

authRouter.post('/register', (req: Request<AuthRequestBody>, res: Response, next: NextFunction) => {
  registerUser(req, res, next)
})
authRouter.post('/login', (req: Request<AuthRequestBody>, res: Response, next: NextFunction) => {
  loginUser(req, res, next)
})
authRouter.post(
  '/reset-password',
  (req: Request<{ email: string }>, res: Response, next: NextFunction) => {
    resetPassword(req, res, next)
  }
)
authRouter.post('/signout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    signOutUser(req, res, next)
  } catch (error) {
    next(error)
  }
})

authRouter.use(firebaseErrorHandler)

export default authRouter
