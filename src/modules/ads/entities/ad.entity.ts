import { PromotionTypeEnum } from "@/modules/promotions/entities/promotion.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { AD_STATUS } from "../enums/ad-status.enum"
import { AdStatus } from "../interfaces/ad-status.interface"
import { User } from "@/modules/users/entity/user.entity"
import { Product } from "@/modules/products/entities/product.entity"

@Entity()
export class Ad {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  duration: number

  @Column()
  vendorId: string

  @Column()
  productId: string

  @Column("int", { default: 0 })
  clicks: number

  @Column("int", { default: 0 })
  impressions: number

  @Column("float", { default: 0 })
  conversionRate: number

  @Column({ type: "enum", enum: PromotionTypeEnum })
  type: PromotionTypeEnum

  @Column({ type: "timestamp" })
  startDate: Date

  @Column({ type: "timestamp" })
  endDate: Date

  @Column({ type: "enum", enum: AD_STATUS, default: "inactive" })
  status: AdStatus

  @ManyToOne(() => User, (user) => user.ads)
  vendor: User

  @ManyToOne(() => Product, (product) => product.ads)
  product: Product

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
