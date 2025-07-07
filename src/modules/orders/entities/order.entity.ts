import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { OrderItem } from "./order-item.entity"
import { ORDER_STATUS, OrderStatus } from "../interfaces/order-status"
import { User } from "@/modules/users/entity/user.entity"

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "enum", default: "unpaid", enum: ORDER_STATUS })
  status: OrderStatus

  @Column({ type: "enum", default: "unpaid", enum: ORDER_STATUS })
  paymentStatus: OrderStatus

  @Column()
  buyerId: string

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  @JoinColumn()
  buyer: User

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[]

  @CreateDateColumn()
  createdAt: Date
}
