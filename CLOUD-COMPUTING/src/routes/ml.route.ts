import { Router, Request, Response, NextFunction } from 'express'
import { authenticateUser } from '../middleware/auth.middleware'
import {
  getAllMLRequestHistory,
  getMLRequestHistory,
  handleAudioPrediction,
  handleHandwritingPrediction,
  handleQuizPrediction
} from '../controllers/ml.controller'
import { uploadAudio, uploadImage } from '../utils/uploadML'
import handleAxiosError from '../middleware/axiosErrorHandler'
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.type'

const mlRouter: Router = Router()

mlRouter.post(
  '/quiz',
  (req: Request, res: Response, next: NextFunction) => {
    authenticateUser(req, res, next)
  },
  async (req: Request, res: Response, next: NextFunction) => {
    handleQuizPrediction(req as AuthenticatedRequest, res, next)
  }
)

mlRouter.post(
  '/audio',
  (req: Request, res: Response, next: NextFunction) => {
    authenticateUser(req, res, next)
  },
  uploadAudio.single('audio'),
  async (req: Request, res: Response, next: NextFunction) => {
    handleAudioPrediction(req as AuthenticatedRequest, res, next)
  }
)

mlRouter.post(
  '/handwriting',
  (req: Request, res: Response, next: NextFunction) => {
    authenticateUser(req, res, next)
  },
  uploadImage.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    handleHandwritingPrediction(req as AuthenticatedRequest, res, next)
  }
)

mlRouter.get(
  '/history',
  (req: Request, res: Response, next: NextFunction) => {
    authenticateUser(req, res, next)
  },
  async (req: Request, res: Response, next: NextFunction) => {
    getMLRequestHistory(req as AuthenticatedRequest, res, next)
  }
)

mlRouter.get(
  '/all-history',
  (req: Request, res: Response, next: NextFunction) => {
    authenticateUser(req, res, next)
  },
  async (req: Request, res: Response, next: NextFunction) => {
    getAllMLRequestHistory(req as AuthenticatedRequest, res, next)
  }
)

mlRouter.use(handleAxiosError)

export default mlRouter
