import { Response, NextFunction } from 'express'
import {
  quizInputSchema,
  audioInputSchema,
  handwritingInputSchema,
  historyMetadataSchema,
  isValidISODate
} from '../validations/ml.validation'
import { mlService } from '../services/ml.service'
import { formatJoiError } from '../utils/joiValidation'
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.type'
import { MLHistoryMetadataInput, MLHistoryQuery, MLRequestType } from '../types/ml.type'

export const handleQuizPrediction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = quizInputSchema.validate(req.body)
    if (error) {
      const validationError = formatJoiError(error)
      return res.status(400).json(validationError)
    }
    const inputData = req.body
    const uid = req.user.uid
    const prediction = await mlService.sendQuizPrediction(uid, inputData)
    res.setHeader('Deprecation', 'true')
    res.setHeader('Link', '</api/ml/history>; rel="successor-version"')
    return res.status(200).json({
      status: 'success',
      message:
        'Legacy server-side quiz prediction endpoint. Mentalys Android should run screening locally and store metadata with /ml/history.',
      prediction
    })
  } catch (error) {
    next(error)
  }
}

export const handleAudioPrediction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No audio file uploaded. Please send an audio file with key "audio"'
      })
    }
    const audioFile = req.file as Express.Multer.File
    const { error } = audioInputSchema.validate({
      audio: {
        originalname: audioFile.originalname,
        mimetype: audioFile.mimetype,
        size: audioFile.size
      }
    })
    if (error) {
      const validationError = formatJoiError(error)
      return res.status(400).json(validationError)
    }
    const uid = req.user.uid
    const prediction = await mlService.sendAudioPrediction(uid, audioFile)
    res.setHeader('Deprecation', 'true')
    res.setHeader('Link', '</api/ml/history>; rel="successor-version"')
    return res.status(200).json({
      status: 'success',
      message:
        'Legacy server-side audio prediction endpoint. Mentalys Android should run voice inference locally and store metadata with /ml/history.',
      prediction
    })
  } catch (error) {
    next(error)
  }
}

export const handleHandwritingPrediction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file uploaded. Please send an image file with key "file"' // Updated error message
      })
    }
    const imageFile = req.file as Express.Multer.File
    const { error } = handwritingInputSchema.validate({
      file: {
        originalname: imageFile.originalname,
        mimetype: imageFile.mimetype,
        size: imageFile.size
      }
    })
    if (error) {
      const validationError = formatJoiError(error)
      return res.status(400).json(validationError)
    }
    const uid = req.user.uid
    const prediction = await mlService.sendHandwritingPrediction(uid, imageFile)
    res.setHeader('Deprecation', 'true')
    res.setHeader('Link', '</api/ml/history>; rel="successor-version"')
    return res.status(200).json({
      status: 'success',
      message:
        'Legacy handwriting endpoint. User-facing handwriting analysis has been replaced by local face analysis and /ml/history metadata storage.',
      prediction
    })
  } catch (error) {
    next(error)
  }
}

export const saveMLRequestHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = historyMetadataSchema.validate(req.body)
    if (error) {
      const validationError = formatJoiError(error)
      return res.status(400).json(validationError)
    }

    const uid = req.user.uid
    const history = await mlService.saveHistoryMetadata(uid, req.body as MLHistoryMetadataInput)
    return res.status(201).json({
      status: 'success',
      data: history
    })
  } catch (error) {
    next(error)
  }
}

export const getMLRequestHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.user.uid
    const { type, page, limit, startDate, endDate, sortBy, sortOrder } = req.query

    const supportedHistoryTypes: MLRequestType[] = Object.values(MLRequestType).filter(
      (requestType) => requestType !== MLRequestType.HANDWRITING
    )

    if (!supportedHistoryTypes.includes(type as MLRequestType)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ML request type'
      })
    }

    const queryOptions: MLHistoryQuery = {
      type: type as MLRequestType,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
      sortBy: sortBy as 'timestamp' | 'prediction',
      sortOrder: sortOrder as 'asc' | 'desc'
    }

    const history = await mlService.getMLRequestHistory(uid, queryOptions)
    return res.status(200).json({
      status: 'success',
      ...history
    })
  } catch (error) {
    next(error)
  }
}

export const getAllMLRequestHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.user.uid
    const { page, limit, startDate, endDate, sortBy, sortOrder } = req.query
    if (startDate && !isValidISODate(startDate.toString())) {
      return res.status(400).json({
        status: 'fail',
        message:
          'Invalid start date format. Please use ISO 8601 format (e.g., 2024-01-15 or 2024-01-15T10:30:00Z)'
      })
    }

    if (endDate && !isValidISODate(endDate.toString())) {
      return res.status(400).json({
        status: 'fail',
        message:
          'Invalid end date format. Please use ISO 8601 format (e.g., 2024-01-15 or 2024-01-15T10:30:00Z)'
      })
    }

    if (startDate && endDate) {
      const start = new Date(String(startDate))
      const end = new Date(String(endDate))

      if (start > end) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid date range. Start date must be before end date'
        })
      }
    }
    const queryOptions: Omit<MLHistoryQuery, 'type'> = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
      sortBy: sortBy as 'timestamp' | 'prediction',
      sortOrder: sortOrder as 'asc' | 'desc'
    }

    const history = await mlService.getAllMLRequestHistory(uid, queryOptions)
    return res.status(200).json({
      status: 'success',
      ...history
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAllMLRequestHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.user.uid
    const result = await mlService.deleteAllMLRequestHistory(uid)
    return res.status(200).json({
      status: 'success',
      message: 'ML request history deleted successfully',
      ...result
    })
  } catch (error) {
    next(error)
  }
}
