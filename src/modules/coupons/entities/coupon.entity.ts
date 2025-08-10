import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { CouponEnumType } from "../enum/coupon-enum"

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column({ type: "int" })
  code: number

  @Column({ type: "int" })
  quantity: number

  @Column({ type: "enum", enum: CouponEnumType, default: CouponEnumType.AMOUNT })
  couponType: CouponEnumType

  @Column({ type: "int" })
  value: number

  @Column({ type: "timestamp" })
  startDate: Date

  @Column({ type: "timestamp" })
  endDate: Date

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date
}
