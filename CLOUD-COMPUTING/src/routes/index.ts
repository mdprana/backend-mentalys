import { Request, Router, Response, NextFunction } from 'express'
import authRouter from './auth.route'
import { notFound } from '../middleware/error/notFound'
import { globalErrorHandler } from '../middleware/error/error'
import { authenticateUser } from '../middleware/auth.middleware'
import psychiatristRouter from './psychiatrist.route'
import profileRouter from './profile.route'
import mlRouter from './ml.route'
import midtransRouter from './midtrans.route'

const app: Router = Router()

app.get(
  '/autentikasi',
  (req: Request, res: Response, next: NextFunction) => {
    authenticateUser(req, res, next)
  },
  (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Mentalys REST API Anda terautentikasi!'
    })
  }
)
// login, daftar, dan reset password
app.use('/api/auth', authRouter)
// create profile dan update profile
app.use('/api/user', profileRouter)
// API untuk ML
app.use('/api/ml', mlRouter)
// API untuk Psikiater
app.use('/api/psychiatrists', psychiatristRouter)
// API untuk Midtrans
app.use('/api/midtrans', midtransRouter)
app.use('*', notFound)
app.use(globalErrorHandler)
export default app
