import { User, UserRoleEnum } from "@/modules/users/entity/user.entity"
import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability"
import { Injectable } from "@nestjs/common"
import { Action } from "./actions/action"
import { Product, ProductStatusEnum } from "@/modules/products/entities/product.entity"

type Subjects = InferSubjects<typeof User | typeof Product> | "all"

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility)
    console.log("Creating ability for user:", user)

    if (user.role === UserRoleEnum.Admin) {
      can(Action.Manage, "all")
    }

    if (user.role === UserRoleEnum.Vendor) {
      can(Action.Read, Product)
      can(Action.Create, Product)
      can(Action.Update, Product, { user: { id: user.id } })
      can(Action.Delete, Product, { user: { id: user.id } })
    } else {
      cannot(Action.Read, Product)
    }
    if (user.role !== UserRoleEnum.Admin) {
      cannot(Action.Delete, Product, { status: ProductStatusEnum.published }).because("You are not allowed to delete products")
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
    }) as AppAbility
  }
}
