import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm"
import * as bcrypt from "bcryptjs"
import Business from "./business.entity"
import { Bank } from "@/modules/banks/entities/bank.entity"
import { Product } from "@/modules/products/entities/product.entity"
import { Cart } from "@/modules/carts/entities/cart.entity"

export enum UserRoleEnum {
  "Customer" = "customer",
  "Vendor" = "vendor",
  "Admin" = "admin"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  password: string

  @Column({ type: "enum", enum: UserRoleEnum, default: UserRoleEnum.Customer })
  role: UserRoleEnum

  @Column()
  email: string

  @Column({ type: "text", default: "" })
  phone: string

  @Column({ default: false })
  isEmailVerified: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => Business, (business) => business.user, { eager: true })
  business: Business

  @OneToMany(() => Bank, (bank) => bank.user)
  bank: Bank[]

  @OneToMany(() => Product, (product) => product.user)
  product: Product[]

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[]

  private _previousPassword?: string

  @AfterLoad()
  loadPassword() {
    this._previousPassword = this.password
  }

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (!this.password || this.password === this._previousPassword) return

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password)
  }

  getFullName() {
    return this.firstName + " " + this.lastName
  }
}
