import { NextFunction, Request, Response } from 'express'
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
} from '../services/foodService'
import { validateFood } from '../validations/foodValidation'
import { IFood } from '../types/foodTypes'
import { handleFirestoreError } from '../utils/errorHandler'
import { AppError } from '../utils/AppError'
import { validateImageLink } from '../validations/articleValidation'

export const createFoodController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const food: IFood = req.body

    // Validate required fields
    if (!food.name) {
      return next(AppError('Name is required', 400))
    }
    if (!food.imageUrl) {
      return next(AppError('Image URL is required', 400))
    }
    if (!food.category) {
      return next(AppError('Category is required', 400))
    }
    const validateImage = validateImageLink(food.imageUrl)
    if (validateImage) {
      return next(AppError(validateImage, 400))
    }
    const validationError = validateFood(food)
    if (validationError) {
      return next(AppError(validationError, 400))
    }

    const newFood = await createFood(food)
    res.status(201).json({
      message: 'Food created successfully',
      data: newFood
    })
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}

export const getAllFoodsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const foods = await getAllFoods()
    res.status(200).json({
      message: 'Foods retrieved successfully',
      data: foods
    })
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}

export const getFoodByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const foodId = req.params.id
    const food = await getFoodById(foodId)

    if (food) {
      res.status(200).json({
        message: 'Food retrieved successfully',
        data: food
      })
    } else {
      res.status(404).json({ error: 'Food not found' })
    }
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}

export const updateFoodController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const foodId = req.params.id
    const updateData: Partial<IFood> = req.body

    if (Object.keys(updateData).length > 0) {
      const validationError = validateFood(updateData, true)
      if (validationError) {
        return next(AppError(validationError, 400))
      }
    }

    const updated = await updateFood(foodId, updateData)
    if (!updated) {
      return next(AppError('Food not found', 404))
    }

    res.status(200).json({
      message: 'Food updated successfully',
      data: updated
    })
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}

export const deleteFoodController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const foodId = req.params.id
    const deleted = await deleteFood(foodId)

    if (!deleted) {
      return next(AppError('Food not found', 404))
    }

    res.status(200).json({
      status: 'success',
      message: 'Food deleted successfully'
    })
  } catch (error) {
    console.error(error)
    next(handleFirestoreError(error))
  }
}
