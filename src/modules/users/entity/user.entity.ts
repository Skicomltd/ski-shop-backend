import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import * as bcrypt from "bcryptjs"
import Business from "./business.entity"
import { Bank } from "@/modules/banks/entities/bank.entity"
import { Product } from "@/modules/products/entities/product.entity"
import { Factory } from "nestjs-seeder"
import { Faker } from "@faker-js/faker"

export enum UserRoleEnum {
  "Customer" = "customer",
  "Vendor" = "vendor",
  "Admin" = "admin"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Factory((faker: Faker) => faker.person.firstName())
  @Column()
  firstName: string

  @Factory((faker: Faker) => faker.person.lastName())
  @Column()
  lastName: string

  @Factory(() => "password1234")
  @Column()
  password: string

  @Factory(() => {
    const roles = Object.values(UserRoleEnum)
    return roles[Math.random() * roles.length]
  })
  @Column({ type: "enum", enum: UserRoleEnum, default: UserRoleEnum.Customer })
  role: UserRoleEnum

  @Factory((faker: Faker) => faker.internet.email())
  @Column()
  email: string

  @Factory((faker: Faker) => faker.datatype.boolean())
  @Column({ default: false })
  isEmailVerified: boolean

  @Factory((faker: Faker) => faker.date.past())
  @CreateDateColumn()
  createdAt: Date

  @Factory((faker: Faker) => faker.date.recent())
  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => Business, (business) => business.user)
  business: Business

  @OneToMany(() => Bank, (bank) => bank.user)
  bank: Bank[]

  @OneToMany(() => Product, (product) => product.user)
  product: Product[]

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt()
      this.password = await bcrypt.hash(this.password, salt)
    }
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password)
  }

  getFullName() {
    return this.firstName + " " + this.lastName
  }
}
