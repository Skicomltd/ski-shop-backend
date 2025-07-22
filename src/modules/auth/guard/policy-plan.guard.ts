import { AppAbility, CaslAbilityFactory } from "@/modules/services/casl/casl-ability.factory"
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { PolicyHandler } from "../interface/policies-interface"

@Injectable()
export class PolicyPlanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>("policies", context.getHandler()) || []

    const { user } = context.switchToHttp().getRequest()

    const ability = this.caslAbilityFactory.createAbilityForPlan(user)

    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability))
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === "function") {
      return handler(ability)
    }
    return handler.handle(ability)
  }
}
