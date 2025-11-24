import { Request } from "express"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"

import { AuthService } from "../auth.service"
import { User, UserRoleEnum } from "@/modules/users/entity/user.entity"
import { Strategy } from "passport-google-oauth2"
import { UserService } from "@/modules/users/user.service"
import { CreateUserDto } from "@/modules/users/dto/create-user-dto"
import { clientTypeSchema } from "../dto/client-type.dto"

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private authService: AuthService,
    public configService: ConfigService,
    public usersService: UserService
  ) {
    super({
      clientID: configService.get("auth.google.clientId"),
      clientSecret: configService.get("auth.google.clientSecret"),
      callbackURL: configService.get("auth.google.callbackUrl"),
      scope: ["profile", "email"],
      passReqToCallback: true
    })
  }

  async validate(req: Request, _accessToken: string, _refreshToken: string, profile: any): Promise<User> {
    const clientValidation = clientTypeSchema.safeParse(req.headers["x-client-type"])
    if (!clientValidation.success) return null // No client header

    let user = await this.authService.validateEmail(profile.email)

    if (!user) {
      // No way to tell the role being created on the web (its a monolith) so return null
      if (clientValidation.data === "web") return null

      const dto: CreateUserDto = {
        email: profile.email,
        firstName: "",
        lastName: "",
        password: "",
        role: clientValidation.data === "customer-mobile" ? UserRoleEnum.Customer : UserRoleEnum.Vendor,
        isEmailVerified: true
      }

      user = await this.usersService.create(dto)
    } else if (user && !user.isEmailVerified) {
      // mark existing user email as verified
      user = await this.usersService.update(user, { isEmailVerified: true })
    }

    // Prevent a user other than a vendor login from the vendor mobile app.
    if (clientValidation.data === "vendor-mobile" && user.role !== UserRoleEnum.Vendor) {
      return null
    }

    // Prevent a user other than a customer login from the customer mobile app.
    if (clientValidation.data === "customer-mobile" && user.role !== UserRoleEnum.Customer) {
      return null
    }

    req.user = user

    return user
  }
}
