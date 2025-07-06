import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm"
import { Product } from "@/modules/products/entities/product.entity"
import { User } from "@/modules/users/entity/user.entity"

@Entity()
export class SavedProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User, (user) => user.savedProducts, { onDelete: "CASCADE" })
  user: User

  @ManyToOne(() => Product, (product) => product.savedBy, { onDelete: "CASCADE" })
  product: Product

  @CreateDateColumn()
  createdAt: Date
}
