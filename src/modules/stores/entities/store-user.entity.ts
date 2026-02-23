import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm"

import { Store } from "./store.entity"
import { User } from "@/modules/users/entity/user.entity"

export enum StoreRole {
  MANAGER = "manager",
  STAFF = "staff"
}

@Entity()
@Unique(["user", "store"])
export class StoreUser {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  userId: string

  @ManyToOne(() => User, (user) => user.storeUsers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @Column("uuid")
  storeId: string

  @ManyToOne(() => Store, (store) => store.storeUsers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "storeId" })
  store: Store

  @Column({
    type: "enum",
    enum: StoreRole,
    default: StoreRole.STAFF
  })
  role: StoreRole

  @CreateDateColumn()
  createdAt: Date
}
