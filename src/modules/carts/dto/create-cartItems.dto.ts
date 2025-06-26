import { Product } from "@/modules/products/entities/product.entity"
import { Cart } from "../entities/cart.entity"

export class CreateCartItemsDto {
  product: Product
  quantity: number
  cart: Cart
}
