import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { Order } from "./order.entity"
import { Product } from "@/modules/products/entities/product.entity"
import { ORDER_DELIVERY_STATUS, OrderDeliveryStatus } from "../interfaces/delivery-status"

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  order: Order

  @Column({ nullable: true })
  orderId: string

  @Column({ type: "enum", default: "uninitiated", enum: ORDER_DELIVERY_STATUS })
  deliveryStatus: OrderDeliveryStatus

  @Column("")
  productId: string

  @Column()
  storeId: string

  @ManyToOne(() => Product, { eager: true })
  product: Product

  @Column("int")
  quantity: number

  @Column("float")
  unitPrice: number // snapshot of product.price or product.discountPrice at time of order

  @Column({ type: "text", nullable: true })
  deliveryNo: string

  @Column({ type: "timestamp", nullable: true })
  expectedAt: Date
}
