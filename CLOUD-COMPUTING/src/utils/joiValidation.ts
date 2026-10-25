import Joi from 'joi'

export const formatJoiError = (error: Joi.ValidationError) => {
  const errorDetails = error.details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message
  }))

  return {
    status: 'fail',
    message: 'Validation Error',
    errors: errorDetails
  }
}
