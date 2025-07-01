export interface ICartResponse {
  id: string
  product: IdName & { price: number; discountPrice: number }
  quantity: number
  subTotal: number
  createdAt: string
}
