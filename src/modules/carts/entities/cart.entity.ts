import { User } from "@/modules/users/entity/user.entity"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm"
import { CartItems } from "./cartItmes.entity"

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  total: number

  @ManyToOne(() => User, (user) => user.cart)
  user: User

  @OneToMany(() => CartItems, (cartItems) => cartItems.cart, { cascade: true, onDelete: "CASCADE" })
  cartItems: CartItems[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
