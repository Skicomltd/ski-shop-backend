import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { Bank } from "@/modules/banks/entities/bank.entity"
import { WITHDRAWAL_STATUS } from "../enums/withdrawal-status.enum"
import { WithdrawalStatus } from "../interfaces/withdraw-status.interface"
import { Earning } from "./earning.entity"

@Entity()
export class Withdrawal {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("numeric")
  amount: number

  @Column()
  bankId: string

  @Column({ type: "enum", enum: WITHDRAWAL_STATUS, default: "pending" })
  status: WithdrawalStatus

  @ManyToOne(() => Bank, { eager: true })
  bank: Bank

  @Column({ nullable: true })
  earningId: string

  @ManyToOne(() => Earning, (earning) => earning.withdrawals)
  earning: Earning

  @CreateDateColumn()
  createdAt: Date
}
