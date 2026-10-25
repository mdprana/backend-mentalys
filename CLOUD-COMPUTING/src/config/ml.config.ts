import { AppError } from '../utils/AppError'

export const MLConfig = {
  QUIZ_MODEL_API_URL: process.env.QUIZ_MODEL_API_URL,
  AUDIO_MODEL_API_URL: process.env.AUDIO_MODEL_API_URL,
  HANDWRITING_MODEL_API_URL: process.env.HANDWRITING_MODEL_API_URL
}

export const getModelApiUrl = (url: string | undefined, featureName: string): string => {
  if (!url) {
    throw AppError(
      `${featureName} model API URL is not configured. Mentalys now keeps screening inference on-device; use /ml/history to store result metadata.`,
      503
    )
  }

  return url
}
