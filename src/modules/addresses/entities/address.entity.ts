import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "@/modules/users/entity/user.entity"

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  address: string

  @Column()
  city: string

  @Column()
  state: string

  @Column()
  phoneNumber: string

  @Column()
  userId: string

  @Column({ type: "boolean", default: false })
  default: boolean

  @ManyToOne(() => User, (user) => user.addressBook)
  user: User
}
