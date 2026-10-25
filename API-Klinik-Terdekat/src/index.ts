import express, { Request, Response } from 'express'
import cors from 'cors'
import placesRoutes from './routes/places.routes'
import { config } from './config'
import { notFound } from './middleware/error/notFoundHandler'
import { globalErrorHandler } from './middleware/error/errorHandler'

const app = express()

// Middleware
app.use(
  cors({
    origin: config.allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
app.use(express.json())

// Routes
app.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})
app.use('/api/places', placesRoutes)

// Error handling middleware
app.use('*', notFound)
app.use(globalErrorHandler)

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`)
})
