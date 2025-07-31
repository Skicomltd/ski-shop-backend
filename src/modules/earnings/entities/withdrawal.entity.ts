import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { Bank } from "@/modules/banks/entities/bank.entity"
import { WITHDRAWAL_STATUS } from "../enums/withdrawal-status.enum"
import { WithdrawalStatus } from "../interfaces/withdraw-status.interface"
import { Earning } from "./earning.entity"

@Entity()
export class Withdrawal {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("float")
  amount: number

  @Column()
  bankId: string

  @Column()
  earningId: string

  @Column({ type: "enum", enum: WITHDRAWAL_STATUS, default: "pending" })
  status: WithdrawalStatus

  @ManyToOne(() => Bank, { eager: true })
  bank: Bank

  @ManyToOne(() => Earning, (earning) => earning.withdrawals)
  @JoinColumn()
  earning: Earning

  @CreateDateColumn()
  createdAt: Date
}
