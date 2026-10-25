import { Router } from 'express'
import articleRouter from './articleRoute'
import { notFound } from '../middleware/error/notFoundController'
import { globalErrorHandler } from '../middleware/error/errorController'
import foodRoute from './foodRoute'
const app = Router()

app.use('/api/v1', foodRoute)
app.use('/api/v1', articleRouter)
app.use('*', notFound)
app.use(globalErrorHandler)
export default app
