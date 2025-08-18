import * as joi from "joi"
import { Setting } from "../entities/setting.entity"

export class CreateGeneralSettingsDto {
  general: CreateSettingDto
  revenue: CreateRevenueSettingDto
  promotion: CreatePromotionSettingDto
  play2win: CreatePlay2winSettingDto
}

export class CreateSettingDto {
  emailPurchase: boolean
  emailNewsUpdates: boolean
  emailProductCreation: boolean
  emailPayout: boolean
  accountEmail: string
  alternativeEmail?: string
}

export class CreateRevenueSettingDto {
  settingId: string
  setting: Setting
  minPayoutAmount: number
  maxPayoutAmount: number
  maxWithdrawalsPerDay: number
  fulfillmentFeePercentage: number
  gasFee: number
  monthlySubscriptionFee: number
  yearlySubscriptionFee: number
  gracePeriodAfterExpiry: number
  autoExpiryNotification: boolean
  notifyUserOnApproval: boolean
  notifyOnSubscriptionExpiry: boolean
  notifyOnCommissionDeduction: boolean
}

export class CreatePromotionSettingDto {
  settingId: string
  setting: Setting
  defaultDurationDays: number
  maxPromotionsPerDay: number
  bannerPromotion: boolean
  featuredSectionPromotion: boolean
  autoApprovePromotions: boolean
  notifyVendorOnApproval: boolean
  notifyOnNewRequest: boolean
}

export class CreatePlay2winSettingDto {
  settingId: string
  setting: Setting
  playFrequency: string
  redemptionWindowDays: number
  couponRedemptionFrequency: string
  drawCycleResetTime: string
  loginRequiredToPlay: boolean
  notifyAdminOnCouponExhaustion: boolean
  showWinnersNotification: boolean
}

export const createSettingSchema = joi.object({
  general: joi.object({
    emailPurchase: joi.boolean().default(true).optional(),
    emailNewsUpdates: joi.boolean().default(true).optional(),
    emailProductCreation: joi.boolean().default(true).optional(),
    emailPayout: joi.boolean().default(true).optional(),
    accountEmail: joi.string().default("info@skishop.com").optional(),
    alternativeEmail: joi.string().optional()
  }),
  revenue: joi.object({
    minPayoutAmount: joi.number().default(10000).optional(),
    maxPayoutAmount: joi.number().default(100000).optional(),
    maxWithdrawalsPerDay: joi.number().default(1).optional(),
    fulfillmentFeePercentage: joi.number().default(10).optional(),
    gasFee: joi.number().default(1000).optional(),
    monthlySubscriptionFee: joi.number().default(10000).optional(),
    yearlySubscriptionFee: joi.number().default(100000).optional(),
    gracePeriodAfterExpiry: joi.number().default(7).optional(),
    autoExpiryNotification: joi.boolean().default(true).optional(),
    notifyUserOnApproval: joi.boolean().default(true).optional(),
    notifyOnSubscriptionExpiry: joi.boolean().default(true).optional(),
    notifyOnCommissionDeduction: joi.boolean().default(true).optional()
  }),
  promotion: joi.object({
    defaultDurationDays: joi.number().default(7).optional(),
    maxPromotionsPerDay: joi.number().default(3).optional(),
    bannerPromotion: joi.boolean().default(true).optional(),
    featuredSectionPromotion: joi.boolean().default(true).optional(),
    autoApprovePromotions: joi.boolean().default(true).optional(),
    notifyVendorOnApproval: joi.boolean().default(true).optional(),
    notifyOnNewRequest: joi.boolean().default(true).optional()
  }),
  play2win: joi.object({
    playFrequency: joi.string().optional(),
    redemptionWindowDays: joi.number().default(7).optional(),
    couponRedemptionFrequency: joi.string().optional(),
    drawCycleResetTime: joi.string().optional(),
    loginRequiredToPlay: joi.boolean().default(true).optional(),
    notifyAdminOnCouponExhaustion: joi.boolean().default(true).optional(),
    showWinnersNotification: joi.boolean().default(true).optional()
  })
})
