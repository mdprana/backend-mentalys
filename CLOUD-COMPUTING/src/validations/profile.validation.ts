import Joi from 'joi'

export const profileValidationSchema = Joi.object({
  username: Joi.string().pattern(/^\S+$/).required().trim().min(5).max(30).messages({
    'any.required': 'Username is required',
    'string.min': 'Username must be at least 5 characters long',
    'string.max': 'Username must be at most 30 characters long',
    'string.base': 'Username must be a string',
    'string.empty': 'Username cannot be empty',
    'string.pattern.base': 'Username must be a single word without spaces'
  }),
  profile_pic: Joi.string().optional().allow(null),
  firstName: Joi.string().required().min(3).max(25).trim().messages({
    'any.required': 'First name is required',
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name must be at most 50 characters long',
    'string.base': 'First name must be a string',
    'string.empty': 'First name cannot be empty'
  }),
  lastName: Joi.string().required().min(3).max(25).trim().messages({
    'any.required': 'Last name is required',
    'string.min': 'Last name must be at least 3 characters long',
    'string.max': 'Last name must be at most 50 characters long',
    'string.base': 'Last name must be a string',
    'string.empty': 'Last name cannot be empty'
  }),
  full_name: Joi.string().required().min(3).max(60).trim().messages({
    'string.min': 'Full name must be at least 3 characters long',
    'string.max': 'Full name must be at most 50 characters long',
    'any.required': 'Full name is required',
    'string.base': 'Full name must be a string',
    'string.empty': 'Full name cannot be empty'
  }),
  birth_date: Joi.date().max('now').optional().messages({
    'date.max': 'Birth date is not valid',
    'any.required': 'Birth date is required'
  }),
  location: Joi.string().optional().trim(),
  gender: Joi.string().valid('MALE', 'FEMALE').optional().messages({
    'any.required': 'Gender is required',
    'string.base': 'Gender must be a string',
    'any.only': 'Gender must be either MALE or FEMALE'
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Format nomor telepon harus dimulai dengan + dan diikuti kode negara',
      'any.required': 'Nomor telepon harus diisi'
    })
})

export const profileUpdateValidationSchema = profileValidationSchema.fork(
  [
    'username',
    'firstName',
    'lastName',
    'birth_date',
    'location',
    'gender',
    'full_name',
    'phoneNumber',
    'profile_pic'
  ],
  (schema) => schema.optional()
)
