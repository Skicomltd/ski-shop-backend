import { AuthUserBusiness, IAuthResponse } from "../interface/auth-response"

export abstract class AuthResponseMapper implements IInterceptor {
  transform(data: AuthUserBusiness): IAuthResponse {
    return {
      user: {
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        profileImage: data.user.profileImage,
        email: data.user.email,
        emailVerified: data.user.isEmailVerified,
        phoneNumberVerified: data.user.isPhoneNumberVerified,
        fullName: data.user.getFullName(),
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt
      },
      tokens: {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken
      },
      lastActiveStoreId: data.user.lastActiveStoreId
    }
  }
}
