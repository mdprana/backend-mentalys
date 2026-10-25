import { NextFunction, Request, Response } from 'express'
import {
  deleteArticle,
  getArticleById,
  getArticles,
  getArticlesByMentalState,
  saveArticle
} from '../services/articleService'
import {
  validateContent,
  validateImageLink,
  validateMentalState
} from '../validations/articleValidation'
import { Article, MentalState } from '../types/articleTypes'
import { handleFirestoreError } from '../utils/errorHandler'
import { AppError } from '../utils/AppError'

export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article: Article = req.body
    const mentalState = article.metadata.mental_state
    const imageLink = article.metadata.image_link
    if (imageLink === undefined) {
      return next(AppError('Image link is required', 400))
    }
    const imageLinkError = validateImageLink(imageLink)
    if (imageLinkError) {
      return next(AppError(imageLinkError, 400))
    }
    if (mentalState === undefined) {
      return next(AppError('Mental state is required', 400))
    }
    const mentalStateError = validateMentalState(mentalState)
    if (mentalStateError) {
      return res.status(400).json({ error: mentalStateError })
    }

    for (const content of article.content) {
      const validationError = validateContent(content)
      if (validationError) {
        return next(AppError(validationError, 400))
      }
    }

    const articleId = await saveArticle(article)
    res.status(201).json({ id: articleId, message: 'Article created successfully' })
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}

export const getArticlesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await getArticles()
    res.status(200).json({
      message: 'Articles retrieved successfully',
      data: articles
    })
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}

export const getArticleByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = req.params.id
    const article = await getArticleById(articleId)
    if (article) {
      res.status(200).json({ message: 'Article retrieved successfully', data: article })
    } else {
      res.status(404).json({ error: 'Article not found' })
    }
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}

export const deleteArticleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = req.params.id
    await deleteArticle(articleId)
    res.status(200).json({
      status: 'success',
      message: 'Article deleted successfully'
    })
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}

export const getArticlesByMentalStateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mentalState = req.params.mental_state as MentalState // Ambil mental state dari parameter URL
    const articles = await getArticlesByMentalState(mentalState)
    res.status(200).json({
      message: 'Articles retrieved successfully',
      data: articles
    })
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}
