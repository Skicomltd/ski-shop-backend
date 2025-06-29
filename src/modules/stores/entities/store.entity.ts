import { ProductCategoriesEnum } from "@/modules/common/types"
import { Product } from "@/modules/products/entities/product.entity"
import Business from "@/modules/users/entity/business.entity"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from "typeorm"

// TODO: ENDPOINT TO RETURN AN ARRAY OF STORE CATEGORIES ENUM

export enum vendonEnumType {
  "PREMIUM" = "premium",
  "SKISHOP" = "skishop",
  "BASIC" = "basic"
}
@Entity()
export class Store {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  logo: string

  @Column({ type: "enum", enum: ProductCategoriesEnum })
  // If category becomes managed by the backend, this should be changed to store the category ID instead or take account for the changes.
  // Currently, we store the category name as provided by the frontend.
  category: ProductCategoriesEnum

  @OneToOne(() => Business, (business) => business.store)
  @JoinColumn()
  business: Business

  @OneToMany(() => Product, (product) => product.store)
  product: Product[]

  @Column({ type: "enum", enum: vendonEnumType, default: vendonEnumType.BASIC })
  type: vendonEnumType

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
