import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Seeder } from "nestjs-seeder"
import { User, UserRoleEnum } from "../users/entity/user.entity"
import { Repository } from "typeorm"
import { faker } from "@faker-js/faker"

@Injectable()
export class UserSeeder implements Seeder {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async seed(): Promise<any> {
    const users = Array.from({ length: 10 }, () => ({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: "password1234",
      role: faker.helpers.arrayElement(Object.values(UserRoleEnum)),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      isEmailVerified: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }))

    const userEntities = this.userRepository.create(users)
    await this.userRepository.save(userEntities)
  }

  async drop(): Promise<any> {
    await this.userRepository.delete({})
  }
}
