import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum PromotionTypeEnum {
  "BANNER" = "banner",
  "SEARCH" = "search",
  "FEATURED" = "featured"
}

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({ type: "enum", enum: PromotionTypeEnum, default: PromotionTypeEnum.FEATURED })
  type: PromotionTypeEnum

  @Column()
  duration: number // in days

  @Column({ type: "float" })
  amount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
