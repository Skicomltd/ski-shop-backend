import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Plan {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  planCode: string

  @Column()
  interval: string

  @Column()
  name: string

  @Column({ type: "int" })
  amount: number

  @Column({ type: "int", nullable: true })
  savingPercentage: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
