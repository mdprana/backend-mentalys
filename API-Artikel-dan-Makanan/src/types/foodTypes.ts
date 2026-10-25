export interface IFood {
  id?: string
  name: string
  description: string
  category: string
  imageUrl: string
  evidenceNote?: string
  references?: FoodReference[]
  reviewedBy?: FoodReviewer
}

export interface FoodReference {
  title: string
  source: string
  url: string
  year?: number
  doi?: string
}

export interface FoodReviewer {
  name: string
  role: string
  organization?: string
  reviewedAt: string
}
