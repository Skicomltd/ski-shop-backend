import { Store } from "@/modules/stores/entities/store.entity"
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Withdrawal } from "./withdrawal.entity"

@Entity()
export class Earning {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "numeric", default: 0 })
  total: number

  @Column({ type: "numeric", default: 0 })
  available: number

  @Column({ type: "numeric", default: 0 })
  pending: number

  @Column({ type: "numeric", default: 0 })
  withdrawn: number

  @Column()
  storeId: string

  @OneToOne(() => Store, (store) => store.earning, { eager: true })
  store: Store

  @OneToMany(() => Withdrawal, (wi) => wi.earning, { eager: true })
  withdrawals: Withdrawal[]

  //   @AfterUpdate()
  //   updateCounters() {
  //    //  this.counter = 0
  //   }
}
