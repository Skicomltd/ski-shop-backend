import { UnAuthorizedException } from "@/exceptions/unAuthorized.exception"
import { User } from "@/modules/users/entity/user.entity"
import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"
import { Observable } from "rxjs"
import { clientTypeSchema } from "../dto/client-type.dto"
@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super()
  }
  canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const isPublic = this.reflector.getAllAndOverride("isPublic", [context.getHandler(), context.getClass()])
    const isShortTime = this.reflector.getAllAndOverride("isShortTime", [context.getHandler(), context.getClass()])
    // Allow client if it is a public or a short time token request
    if (isPublic || isShortTime) return true

    // Retrieve and validate the client type.
    // Client type = Vendor mobile app, customer mobile app, or monolith web.
    const validationResult = clientTypeSchema.safeParse(request.headers["x-client-type"])

    // Unauthenticated if authenticated request is made without a client type header.
    if (!validationResult.success) return false

    // Attach the client type to the request to be accessible accross the application.
    request.client = validationResult.data
    return super.canActivate(context)
  }

  handleRequest<T extends User>(err: any, user: T, info: any) {
    if (err || !user) {
      throw err || new UnAuthorizedException(info?.message || "Unauthorized")
    }
    return user
  }
}
