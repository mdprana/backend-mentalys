import { IFood } from '../types/foodTypes'

export const validateFood = (food: Partial<IFood>, isUpdate: boolean = false): string | null => {
  if (food.name !== undefined) {
    if (food.name.length < 2) {
      return 'Name must be at least 2 characters long'
    }
    if (food.name.length > 100) {
      return 'Name must not exceed 100 characters'
    }
  } else if (!isUpdate) {
    return 'Name is required'
  }

  if (food.description !== undefined) {
    if (food.description.length < 10) {
      return 'Description must be at least 10 characters long'
    }
    if (food.description.length > 1000) {
      return 'Description must not exceed 1000 characters'
    }
  } else if (!isUpdate) {
    return 'Description is required'
  }

  if (food.category !== undefined) {
    const validCategories = ['fruits', 'vegetables', 'proteins', 'grains', 'dairy']
    if (!validCategories.includes(food.category.toLowerCase())) {
      return 'Invalid category. Must be one of: ' + validCategories.join(', ')
    }
  } else if (!isUpdate) {
    return 'Category is required'
  }

  if (food.imageUrl !== undefined) {
    try {
      new URL(food.imageUrl)
    } catch {
      return 'Invalid image URL format'
    }
  } else if (!isUpdate) {
    return 'Image URL is required'
  }

  return null
}
