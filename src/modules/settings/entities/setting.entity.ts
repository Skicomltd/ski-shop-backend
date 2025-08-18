import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Column } from "typeorm"
import { RevenueSetting } from "./revenueSetting.entity"
import { PromotionSetting } from "./promotionSetting.entity"
import { Play2winSetting } from "./play2winSetting.entity"

@Entity()
export class Setting {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ default: true })
  emailPurchase: boolean

  @Column({ default: false })
  emailNewsUpdates: boolean

  @Column({ default: true })
  emailProductCreation: boolean

  @Column({ default: true })
  emailPayout: boolean

  @Column({ default: "info@skishop.com" })
  accountEmail: string

  @Column({ nullable: true })
  alternativeEmail: string

  @OneToOne(() => RevenueSetting, (revenueSetting) => revenueSetting.setting, { eager: true, cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  revenueSetting: RevenueSetting

  @OneToOne(() => PromotionSetting, (promotionSetting) => promotionSetting.setting, { eager: true, cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  promotionSetting: PromotionSetting

  @OneToOne(() => Play2winSetting, (play2winSetting) => play2winSetting.setting, { eager: true, cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  play2winSetting: Play2winSetting

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
