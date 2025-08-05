import { ProductCategoriesEnum, ProductStatusEnum } from "@/modules/common/types"
import { Store } from "@/modules/stores/entities/store.entity"
import { User } from "@/modules/users/entity/user.entity"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm"
import { SavedProduct } from "./saved-product.entity"
import { Review } from "@/modules/reviews/entities/review.entity"
import { Ad } from "@/modules/ads/entities/ad.entity"

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({ type: "enum", enum: ProductCategoriesEnum })
  category: ProductCategoriesEnum

  @Column()
  description: string

  @Column({ type: "float" })
  price: number

  @Column({ type: "float", nullable: true })
  discountPrice: number

  @Column({ type: "int" })
  stockCount: number

  @Column("text", { array: true })
  images: string[]

  @Column({ type: "enum", enum: ProductStatusEnum, default: ProductStatusEnum.draft })
  status: ProductStatusEnum

  @Column()
  storeId: string

  @Column()
  userId: string

  @ManyToOne(() => Store, (store) => store.products, { eager: true })
  store: Store

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User

  @OneToMany(() => SavedProduct, (saved) => saved.product)
  savedBy: SavedProduct[]

  @OneToMany(() => Review, (review) => review.product, { eager: true, cascade: true, onDelete: "CASCADE" })
  reviews: Review[]

  @OneToMany(() => Ad, (ad) => ad.product)
  ads: Ad[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
