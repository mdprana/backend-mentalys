import { Router, Request, Response, NextFunction } from 'express'
import { authenticateUser } from '../middleware/auth.middleware'
import { midtransController } from '../controllers/midtrans.controller'
import { AuthenticatedMidtransRequest } from '../types/AuthenticatedRequest.type'
import handleAxiosError from '../middleware/axiosErrorHandler'

const midtransRouter: Router = Router()

midtransRouter.post(
  '/charge',
  (req: Request, res: Response, next: NextFunction) => {
    authenticateUser(req, res, next)
  },
  (req: Request, res: Response, next: NextFunction) => {
    midtransController.createTransaction(req as AuthenticatedMidtransRequest, res, next)
  }
)
midtransRouter.use(handleAxiosError)

export default midtransRouter
