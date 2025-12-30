import { UnAuthorizedException } from "@/exceptions/unAuthorized.exception"
import { User } from "@/modules/users/entity/user.entity"
import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"
import { Observable } from "rxjs"
import { clientTypeSchema } from "../dto/client-type.dto"
import { IS_WEBHOOK } from "../decorators/webhook.decorator"
import { IS_SHORT_TIME } from "../decorators/short-time.decorator"
import { IS_PUBLIC_KEY } from "../decorators/public.decorator"
import { ConfigService } from "@nestjs/config"
@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService
  ) {
    super()
  }
  canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
    const isShortTime = this.reflector.getAllAndOverride(IS_SHORT_TIME, [context.getHandler(), context.getClass()])
    const isWebhook = this.reflector.getAllAndOverride(IS_WEBHOOK, [context.getHandler(), context.getClass()])

    // Retrieve and validate the client type.
    // Client type = Vendor mobile app, customer mobile app, or monolith web.
    const validationResult = clientTypeSchema.safeParse(request.headers["x-client-type"])

    // Unauthenticated if authenticated request is made without a client type header and request is not a webhook request.
    if (!validationResult.success && !isWebhook) return false

    // if request is from mobile, update client url to https://skicomltd.com
    if (validationResult.data !== "web" && !isWebhook) {
      this.configService.set("payment.providers.paystack.callbackUrl", "https://skicomltd.com")
    }

    // Attach the client type to the request to be accessible accross the application.
    request.client = validationResult.data

    // Allow client if it is a public or a short time token request
    if (isPublic || isShortTime) return true

    return super.canActivate(context)
  }

  handleRequest<T extends User>(err: any, user: T, info: any) {
    if (err || !user) {
      throw err || new UnAuthorizedException(info?.message || "Unauthorized")
    }
    return user
  }
}
