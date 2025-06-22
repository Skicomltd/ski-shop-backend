import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Seeder, DataFactory } from "nestjs-seeder"
import { User } from "../users/entity/user.entity"
import { Repository } from "typeorm"

@Injectable()
export class userSeeder implements Seeder {
  @InjectRepository(User) private userRepository: Repository<User>
  async seed(): Promise<any> {
    const userSeed = DataFactory.createForClass(User).generate(10)
    const users = this.userRepository.create({ ...userSeed })
    await this.userRepository.save(users)
  }
  async drop(): Promise<any> {
    throw new Error("Method not implemented.")
  }
}
