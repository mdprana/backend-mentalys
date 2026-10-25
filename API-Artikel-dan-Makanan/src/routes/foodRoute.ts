import { Router, Request, Response, NextFunction } from 'express'
import {
  createFoodController,
  getAllFoodsController,
  getFoodByIdController,
  updateFoodController,
  deleteFoodController
} from '../controllers/foodController'
const foodRoute = Router()

foodRoute.post('/food', (req: Request, res: Response, next: NextFunction) => {
  createFoodController(req, res, next)
})

foodRoute.get('/food', (req: Request, res: Response, next: NextFunction) => {
  getAllFoodsController(req, res, next)
})

foodRoute.get('/food/:id', (req: Request, res: Response, next: NextFunction) => {
  getFoodByIdController(req, res, next)
})

foodRoute.put('/food/:id', (req: Request, res: Response, next: NextFunction) => {
  updateFoodController(req, res, next)
})

foodRoute.delete('/food/:id', (req: Request, res: Response, next: NextFunction) => {
  deleteFoodController(req, res, next)
})

export default foodRoute
