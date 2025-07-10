import { Review } from "../entities/review.entity"
import { IReviewResponse } from "./review-response-interface"

export abstract class ReviewResponseMapper implements IInterceptor {
  transform(data: Review): IReviewResponse {
    return {
      id: data.id,
      reviewId: data.reviewerId,
      productId: data.productId,
      product: {
        name: data.product.name,
        description: data.product.description,
        images: data.product.images
      },
      user: {
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email
      },
      createdAt: data.createdAt
    }
  }
}
