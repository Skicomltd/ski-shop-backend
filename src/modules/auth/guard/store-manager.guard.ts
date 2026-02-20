import { ForbiddenException } from "@/exceptions/forbidden.exception"
import { StoreRole } from "@/modules/stores/entities/store-user.entity"
import { StoreUserService } from "@/modules/stores/store-user.service"
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Request } from "express"

@Injectable()
export class StoreManagerGuard implements CanActivate {
  constructor(private readonly storeUserService: StoreUserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const storeId = request.params?.storeId
    const userId = request.user?.id

    if (!storeId) {
      throw new ForbiddenException("Invalid store")
    }

    if (!userId) {
      throw new ForbiddenException("Unauthorized")
    }

    const isStoreManager = await this.storeUserService.exists({
      user: { id: userId },
      store: { id: storeId },
      role: StoreRole.MANAGER
    })

    if (!isStoreManager) {
      throw new ForbiddenException("Only store managers can invite users")
    }

    return true
  }
}
