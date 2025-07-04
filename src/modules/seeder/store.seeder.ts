import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Seeder } from "nestjs-seeder"
import { Repository } from "typeorm"
import { faker } from "@faker-js/faker"
import { Store, vendonEnumType } from "../stores/entities/store.entity"
import { CreateStoreDto } from "../stores/dto/create-store.dto"
import Business from "../business/entities/business.entity"

@Injectable()
export class StoreSeeder implements Seeder {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>
  ) {}

  async seed(): Promise<any> {
    // Fetch all businesses without an associated store
    const businesses = await this.businessRepository.find({
      relations: ["store"]
    })

    if (businesses.length === 0) {
      // eslint-disable-next-line no-console
      console.warn("No businesses without a store found. Please seed businesses first.")
      return
    }

    const businessWIthoutStore = businesses.filter((business) => !business.store)

    // Generate store data for each business
    const stores: CreateStoreDto[] = businessWIthoutStore.map((business) => ({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      logo: faker.image.url({ width: 200, height: 200 }),
      business,
      type: faker.helpers.enumValue(vendonEnumType),
      createdAt: faker.date.past(),
      updateAt: faker.date.recent()
    }))

    // Create and save store entities
    const storeEntities = this.storeRepository.create(stores)
    await this.storeRepository.save(storeEntities)
  }

  async drop(): Promise<any> {
    await this.storeRepository.clear()
  }
}
