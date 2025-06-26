import { Product } from "@/modules/products/entities/product.entity"
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Cart } from "./cart.entity"

export class CartItems {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  quantity: number

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart

  @ManyToOne(() => Product, (product) => product.cartItems)
  product: Product
}
