import { UserRoleEnum } from "../entity/user.entity"

export interface IUserResponse {
  id: string
  firstName: string
  lastName: string
  role: UserRoleEnum
  email: string
  phoneNumber: string
  isEmailVerified: boolean
  createdAt: Date
}
