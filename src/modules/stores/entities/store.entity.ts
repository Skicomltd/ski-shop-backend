import Business from "@/modules/business/entities/business.entity"
import { Earning } from "@/modules/earnings/entities/earning.entity"
import { Product } from "@/modules/products/entities/product.entity"
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

  @Column({ type: "boolean", default: false })
  isStarSeller: boolean

  @OneToOne(() => Business, (business) => business.store)
  @JoinColumn()
  business: Business

  @OneToOne(() => Earning, (earning) => earning.store)
  @JoinColumn()
  earning: Earning

  @OneToMany(() => Product, (product) => product.store)
  product: Product[]

  @Column({ type: "enum", enum: vendonEnumType, default: vendonEnumType.BASIC })
  type: vendonEnumType

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
