if (
  !process.env.QUIZ_MODEL_API_URL ||
  !process.env.AUDIO_MODEL_API_URL ||
  !process.env.HANDWRITING_MODEL_API_URL
) {
  throw new Error('QUIZ_MODEL_API_URL and AUDIO_MODEL_API_URL must be set')
}
export const MLConfig = {
  QUIZ_MODEL_API_URL: process.env.QUIZ_MODEL_API_URL,
  AUDIO_MODEL_API_URL: process.env.AUDIO_MODEL_API_URL,
  HANDWRITING_MODEL_API_URL: process.env.HANDWRITING_MODEL_API_URL
}
