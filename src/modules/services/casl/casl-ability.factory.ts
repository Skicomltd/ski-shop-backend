import { User, UserRoleEnum } from "@/modules/users/entity/user.entity"
import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability"
import { Injectable } from "@nestjs/common"
import { Action } from "./actions/action"
import { Product } from "@/modules/products/entities/product.entity"
import { Store } from "@/modules/stores/entities/store.entity"
import Business from "@/modules/users/entity/business.entity"
import { Bank } from "@/modules/banks/entities/bank.entity"
import { ProductStatusEnum } from "@/modules/common/types"

type Subjects = InferSubjects<typeof User | typeof Product | typeof Business | typeof Store | typeof Bank> | "all"

export type AppAbility = MongoAbility<[Action, Subjects]>
type Can = AbilityBuilder<MongoAbility>["can"]
type Cannot = AbilityBuilder<MongoAbility>["cannot"]

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

    if (user.role === UserRoleEnum.Admin) {
      can(Action.Manage, "all")
    } else {
      this.defineRoleForProduct(can, cannot, user)
      this.defineRoleForBusiness(can, cannot, user)
      this.defineRoleForStore(can, cannot, user)
      this.defineRoleForBank(can, cannot, user)
      this.defineRoleForUserProfile(can, cannot, user)
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
    }) as AppAbility
  }

  private defineRoleForProduct(can: Can, cannot: Cannot, user: User) {
    if (user.role === UserRoleEnum.Vendor) {
      can(Action.Read, Product)
      can(Action.Create, Product)
      can(Action.Update, Product, { user: { id: user.id } })
      can(Action.Delete, Product, { user: { id: user.id } })
    } else {
      can(Action.Read, Product)
    }
    cannot(Action.Delete, Product, { status: ProductStatusEnum.published }).because("You are not allowed to delete published products")
  }

  private defineRoleForBusiness(can: Can, cannot: Cannot, user: User) {
    if (user.role === UserRoleEnum.Vendor) {
      can(Action.Read, Business)
      can(Action.Create, Business)
      can(Action.Update, Business, { user: { id: user.id } })
      can(Action.Delete, Business, { user: { id: user.id } })
    } else {
      cannot(Action.Read, Business)
    }
  }

  private defineRoleForStore(can: Can, cannot: Cannot, user: User) {
    if (user.role === UserRoleEnum.Vendor) {
      can(Action.Read, Store)
      can(Action.Create, Store)
      can(Action.Update, Store)
      can(Action.Delete, Store)
    } else {
      can(Action.Read, Store)
    }
  }

  private defineRoleForBank(can: Can, cannot: Cannot, user: User) {
    if (user.role === UserRoleEnum.Vendor) {
      can(Action.Read, Bank)
      can(Action.Create, Bank)
      can(Action.Update, Bank, { user: { id: user.id } })
      can(Action.Delete, Bank, { user: { id: user.id } })
    } else {
      cannot(Action.Read, Bank)
    }
  }

  private defineRoleForUserProfile(can: Can, cannot: Cannot, user: User) {
    if (user.role === UserRoleEnum.Vendor) {
      can(Action.Read, User, { id: user.id })
      can(Action.Update, User, { id: user.id })
      can(Action.Delete, User, { id: user.id })
    }

    cannot(Action.Delete, User)
  }

  CheckIfUserIsVerifiedHasBusinessAndStore(user: User): AppAbility {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

    if (user.role === UserRoleEnum.Vendor) {
      this.defineRoleForUserVerified(can, cannot, user)
      this.defineRoleForUserHasBusiness(can, cannot, user)
      this.defineRoleForUserHasStore(can, cannot, user)
    } else {
      cannot(Action.Create, User)
      cannot(Action.Read, User)
      cannot(Action.Update, User)
      cannot(Action.Delete, User)
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
    }) as AppAbility
  }

  private defineRoleForUserVerified(can: Can, cannot: Cannot, user: User) {
    if (user.isEmailVerified) {
      can(Action.Create, User, { id: user.id })
      can(Action.Read, User, { id: user.id })
      can(Action.Update, User, { id: user.id })
      can(Action.Delete, User, { id: user.id })
    } else {
      cannot(Action.Create, User)
      cannot(Action.Read, User)
      cannot(Action.Update, User)
      cannot(Action.Delete, User)
    }
  }

  private defineRoleForUserHasBusiness(can: Can, cannot: Cannot, user: User) {
    if (user.business) {
      can(Action.Create, User, { id: user.id })
      can(Action.Read, User, { id: user.id })
      can(Action.Update, User, { id: user.id })
      can(Action.Delete, User, { id: user.id })
    } else {
      cannot(Action.Create, User)
      cannot(Action.Read, User)
      cannot(Action.Update, User)
      cannot(Action.Delete, User)
    }
  }
  private defineRoleForUserHasStore(can: Can, cannot: Cannot, user: User) {
    if (user.business.store) {
      can(Action.Create, User, { id: user.id })
      can(Action.Read, User, { id: user.id })
      can(Action.Update, User, { id: user.id })
      can(Action.Delete, User, { id: user.id })
    } else {
      cannot(Action.Create, User)
      cannot(Action.Read, User)
      cannot(Action.Update, User)
      cannot(Action.Delete, User)
    }
  }
}
