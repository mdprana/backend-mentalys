import 'dotenv/config'

export const config = {
  port: process.env.PORT || 3000,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  defaultRadius: 5000,
  defaultKeywords:
    'psikolog OR psikiater OR kesehatan mental OR mental health OR klinik kesehatan mental',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
}
