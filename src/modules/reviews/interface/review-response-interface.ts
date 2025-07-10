export interface IReviewResponse {
  id: string
  reviewId: string
  productId: string
  product: {
    images: string[]
    description: string
    name: string
  }
  createdAt: Date
  user: {
    firstName: string
    lastName: string
    email: string
  }
}
