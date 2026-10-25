import Joi from 'joi'

export const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  username: Joi.string().pattern(/^\S+$/).required().trim().min(5).max(30),
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required(),
  birth_date: Joi.date().max('now').optional(),
  location: Joi.string().optional().trim(),
  gender: Joi.string().valid('MALE', 'FEMALE').optional()
})

export const phoneSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Format nomor telepon harus dimulai dengan + dan diikuti kode negara',
      'any.required': 'Nomor telepon harus diisi'
    })
})
