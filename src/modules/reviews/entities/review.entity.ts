import { Product } from "@/modules/products/entities/product.entity"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"

@Entity()
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  reviewerId: string

  @Column()
  productId: string

  @Column({ type: "text" })
  text: string

  @Column({ type: "int", default: 0 })
  rating: number

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "productId" })
  product: Product

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date
}
