export interface IReviewResponse {
  id: string
  reviewId: string
  productId: string
  comment: string
  rating: number
  product: {
    id: string
    images: string[]
    description: string
    name: string
  }
  createdAt: Date
  reviewer: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}
