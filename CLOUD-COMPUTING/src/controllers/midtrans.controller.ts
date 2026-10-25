import { Response, NextFunction } from 'express'
import { midtransService } from '../services/midtrans.service'
import { AuthenticatedMidtransRequest } from '../types/AuthenticatedRequest.type'
import { phoneSchema } from '../validations/auth.validation'
import { formatJoiError } from '../utils/joiValidation'

export const midtransController = {
  async createTransaction(req: AuthenticatedMidtransRequest, res: Response, next: NextFunction) {
    try {
      const { psychiatristId, phoneNumber } = req.body
      const user = req.user
      if (phoneNumber) {
        const { error } = phoneSchema.validate({ phoneNumber })
        if (error) {
          const validationError = formatJoiError(error)
          return res.status(400).json(validationError)
        }
      }
      if (!psychiatristId) {
        return res.status(400).json({ message: 'Missing required fields' })
      }
      const transactionResult = await midtransService.processTransaction(
        { uid: user.uid, email: user.email },
        psychiatristId,
        phoneNumber
      )

      res.status(200).json(transactionResult)
    } catch (error) {
      next(error)
    }
  }
}
