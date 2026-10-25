import { Router, Request, Response, NextFunction } from 'express'
import {
  createArticle,
  deleteArticleController,
  getArticleByIdController,
  getArticlesByMentalStateController,
  getArticlesController
} from '../controllers/articleController'

const articleRoute = Router()

articleRoute.post('/article', (req: Request, res: Response, next: NextFunction) => {
  createArticle(req, res, next)
})

articleRoute.get('/article', (req: Request, res: Response, next: NextFunction) => {
  getArticlesController(req, res, next)
})

articleRoute.get('/article/:id', (req: Request, res: Response, next: NextFunction) => {
  // Get article by id
  getArticleByIdController(req, res, next)
})

articleRoute.delete('/article/:id', (req: Request, res: Response, next: NextFunction) => {
  // Delete article by id
  deleteArticleController(req, res, next)
})

articleRoute.get(
  '/article/mental_state/:mental_state',
  (req: Request, res: Response, next: NextFunction) => {
    getArticlesByMentalStateController(req, res, next)
  }
)

export default articleRoute
