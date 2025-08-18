import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { CommisionEnum } from "../enum/commision-enum"
import { Order } from "@/modules/orders/entities/order.entity"
import { Store } from "@/modules/stores/entities/store.entity"

@Entity()
export class Commision {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "float" })
  commisionFee: number

  @Column()
  orderId: string

  @Column()
  storeId: string

  @Column({ type: "float" })
  commisionValue: number

  @Column({ type: "enum", enum: CommisionEnum, default: CommisionEnum.UNPAID })
  commisionStatus: CommisionEnum

  @ManyToOne(() => Order, (order) => order.commisions)
  order: Order

  @ManyToOne(() => Store, (store) => store.commisions)
  store: Store

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
