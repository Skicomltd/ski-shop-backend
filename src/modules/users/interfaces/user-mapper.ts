import { User } from "../entity/user.entity"
import { IUserResponse } from "./user-response"

export abstract class UserResponseMapper implements IInterceptor {
  transform(data: User): IUserResponse {
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      email: data.email,
      isEmailVerified: data.isEmailVerified,
      createdAt: data.createdAt,
      phoneNumber: data.phoneNumber,
      business: {
        id: data.business?.id,
        name: data.business?.name
      },
      bank: data.bank?.map((bank) => ({
        id: bank.id,
        accountName: bank.accountName,
        accountNumber: bank.accountNumber,
        bankName: bank.bankName
      })),
      cart: data.carts?.map((cart) => ({
        id: cart.id,
        quantity: cart.quantity
      })),
      order: data.orders?.map((order) => ({
        id: order.id,
        deliveryStatus: order.deliveryStatus,
        status: order.status
      })),
      reviews: data.reviews?.map((review) => ({
        id: review.id,
        comment: review.comment,
        productId: review.productId
      })),
      product: data.product?.map((product) => ({
        id: product.id,
        category: product.category,
        images: product.images,
        name: product.name,
        price: product.price
      })),
      savedProduct: data.savedProducts?.map((saveProduct) => ({
        id: saveProduct.id,
        productId: saveProduct.productId
      })),
      subscriptions: data.subscriptions?.map((subscription) => ({
        id: subscription.id,
        status: subscription.status,
        planType: subscription.planType,
        startDate: subscription.startDate,
        endDate: subscription.endDate
      }))
    }
  }
}
