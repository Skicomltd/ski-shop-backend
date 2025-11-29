import { AuthGuard } from "@nestjs/passport"
import { Injectable, ExecutionContext } from "@nestjs/common"

import { User } from "@/modules/users/entity/user.entity"

@Injectable()
export class OptionalJwtGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest<T extends User>(err: any, user: T) {
    // If no token or invalid token, return null
    if (err || !user) {
      return null
    }

    return user
  }
}
