import Joi from 'joi'

export const quizInputSchema = Joi.object({
  age: Joi.string().required(),
  feeling_nervous: Joi.boolean().required(),
  panic: Joi.boolean().required(),
  breathing_rapidly: Joi.boolean().required(),
  sweating: Joi.boolean().required(),
  trouble_in_concentration: Joi.boolean().required(),
  having_trouble_in_sleeping: Joi.boolean().required(),
  having_trouble_with_work: Joi.boolean().required(),
  hopelessness: Joi.boolean().required(),
  anger: Joi.boolean().required(),
  over_react: Joi.boolean().required(),
  change_in_eating: Joi.boolean().required(),
  suicidal_thought: Joi.boolean().required(),
  feeling_tired: Joi.boolean().required(),
  close_friend: Joi.boolean().required(),
  social_media_addiction: Joi.boolean().required(),
  weight_gain: Joi.boolean().required(),
  introvert: Joi.boolean().required(),
  popping_up_stressful_memory: Joi.boolean().required(),
  having_nightmares: Joi.boolean().required(),
  avoids_people_or_activities: Joi.boolean().required(),
  feeling_negative: Joi.boolean().required(),
  trouble_concentrating: Joi.boolean().required(),
  blaming_yourself: Joi.boolean().required(),
  hallucinations: Joi.boolean().required(),
  repetitive_behaviour: Joi.boolean().required(),
  seasonally: Joi.boolean().required(),
  increased_energy: Joi.boolean().required()
})

export const audioInputSchema = Joi.object({
  audio: Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string().valid('audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3').required(),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required() // Maksimal 5MB
  }).required()
})

export const handwritingInputSchema = Joi.object({
  file: Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png').required(),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required()
  }).required()
})

export function isValidISODate(dateString: string): boolean {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/
  if (!iso8601Regex.test(dateString)) {
    return false
  }
  try {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
}
