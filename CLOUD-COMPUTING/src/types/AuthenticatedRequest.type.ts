import { Request } from 'express'
export interface AuthenticatedRequest extends Request {
  user: {
    uid: string
  }
}

export interface AuthenticatedMidtransRequest extends Request {
  user: {
    uid: string
    email: string
  }
}
