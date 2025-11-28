import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"
import { CreateContactUsDto } from "./dto/create-contactUs.dto"
import { ContactUs } from "./entities/contactUs.entity"
import { UpdateContactUsDto } from "./dto/update-contactUs.dto"

@Injectable()
export class ContactUsService implements IService<ContactUs> {
  constructor(@InjectRepository(ContactUs) private readonly contactUsRepository: Repository<ContactUs>) {}

  async create(data: CreateContactUsDto, manager?: EntityManager): Promise<ContactUs> {
    const repo = manager ? manager.getRepository(ContactUs) : this.contactUsRepository
    const create = repo.create(data)
    return await repo.save(create)
  }

  async find(): Promise<[ContactUs[], number]> {
    return await this.contactUsRepository.findAndCount()
  }

  async findById(id: string): Promise<ContactUs> {
    return await this.contactUsRepository.findOne({ where: { id } })
  }

  async findOne(filter: FindOptionsWhere<ContactUs>): Promise<ContactUs> {
    return await this.contactUsRepository.findOne({ where: filter })
  }

  async exists(filter: FindOptionsWhere<ContactUs>): Promise<boolean> {
    return await this.contactUsRepository.exists({ where: filter })
  }

  async update(entity: ContactUs, data: UpdateContactUsDto, manager?: EntityManager): Promise<ContactUs> {
    const repo = manager ? manager.getRepository(ContactUs) : this.contactUsRepository
    const update = repo.merge(entity, data)
    return await repo.save(update)
  }

  async remove(filter: FindOptionsWhere<ContactUs>): Promise<number> {
    const result = await this.contactUsRepository.delete(filter)
    return result.affected || 0
  }
}
