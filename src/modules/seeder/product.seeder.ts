import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Seeder } from "nestjs-seeder"
import { Repository } from "typeorm"
import { faker } from "@faker-js/faker"
import { Product, ProductStatusEnum } from "../products/entities/product.entity"
import { Store } from "../stores/entities/store.entity"

@Injectable()
export class ProductSeeder implements Seeder {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>
  ) {}

  async seed(): Promise<any> {
    const stores = await this.storeRepository.find({
      relations: ["business", "business.user"]
    })

    if (stores.length === 0) {
      console.warn("No stores found. Please seed stores first.")
      return
    }

    const storesWithoutNullUser = stores.filter((store) => store.business.user !== null)

    // Define product categories
    const productCategories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Beauty"]

    // Generate 1–5 products per store
    const products = storesWithoutNullUser.flatMap((store) => {
      const numProducts = faker.number.int({ min: 1, max: 5 })
      return Array.from({ length: numProducts }, () => ({
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(productCategories),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
        discountPrice: faker.datatype.boolean() ? parseFloat(faker.commerce.price({ min: 5, max: 800, dec: 2 })) : null,
        stockCount: faker.number.int({ min: 0, max: 100 }),
        images: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.image.url({ width: 300, height: 300 })),
        status: faker.helpers.arrayElement(Object.values(ProductStatusEnum)),
        storeId: store.id,
        userId: store.business.user.id, // User from store's business
        store, // ManyToOne relationship
        user: store.business.user, // ManyToOne relationship
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }))
    })

    // // Create and save product entities
    const productEntities = this.productRepository.create(products)
    await this.productRepository.save(productEntities)
  }

  async drop(): Promise<any> {
    await this.productRepository.delete({})
  }
}
