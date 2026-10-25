import express, { type Application, type Request, type Response } from 'express'
import appMiddleware from '../middleware'
import { swaggerMiddleware } from './swagger'

const web: Application = express()
web.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Mentalys REST API running!'
  })
})
swaggerMiddleware(web)
web.use(appMiddleware)

export default web
