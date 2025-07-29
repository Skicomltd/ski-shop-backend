import { Product } from "@/modules/products/entities/product.entity"
import { PromotionTypeEnum } from "@/modules/promotions/entities/promotion.entity"
import { User } from "@/modules/users/entity/user.entity"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"

export enum PromotionAdEnum {
  "ACTIVE" = "active",
  "INACTIVE" = "inactive",
  "EXPIRED" = "expired"
}

@Entity()
export class Ads {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  duration: number

  @Column()
  vendorId: string

  @Column()
  productId: string

  @Column({ type: "enum", enum: PromotionTypeEnum })
  type: PromotionTypeEnum

  @Column({ type: "timestamp" })
  startDate: Date

  @Column({ type: "timestamp" })
  endDate: Date

  @Column({ type: "enum", enum: PromotionAdEnum, default: PromotionAdEnum.INACTIVE })
  status: PromotionAdEnum

  @ManyToOne(() => User, (user) => user.promotionAds)
  vendor: User

  @ManyToOne(() => Product, (product) => product)
  product: Product

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
