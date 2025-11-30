import * as joi from "joi"
import { UserRoleEnum } from "@/modules/users/entity/user.entity"

export class AuthDto {
  firstName: string
  lastName: string
  email: string
  role: UserRoleEnum
  password: string
  confirmPassword: string
}

export class VerifyCodeDto {
  code: string
}

export class ResendOtpDto {
  email: string
}

export class LoginDto {
  email: string
  password: string
  fcmToken?: string
}
export class LogoutDto {
  fcmToken?: string
}
export class LoginAuthDto {
  email: string
  id: string
}

export const registerSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi
    .string()
    .email()
    .lowercase()
    .trim()
    .custom((value: string) => {
      return value.toLowerCase()
    }, "Convert email to lowercase")
    .required(),
  role: joi.string().valid("customer", "vendor", "admin").required(),
  password: joi.string().required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Passwords do not match"
  })
})

export const verifyCodeSchema = joi.object({
  code: joi.string().required()
})

export const resendOtpSchema = joi.object({
  email: joi.string().email().required()
})

export const loginSchema = joi.object({
  email: joi
    .string()
    .email()
    .trim()
    .custom((value: string) => {
      return value.toLowerCase()
    }, "lowercase email")
    .required(),
  password: joi.string().required(),
  fcmToken: joi.string().optional()
})

export const logoutSchema = joi.object({
  fcmToken: joi.string().optional()
})
