export interface ISettingResponse {
  emailNewsUpdates: boolean
  alternativeEmail: string
  id: string
  emailPurchase: boolean
  emailProductCreation: boolean
  emailPayout: boolean
  accountEmail: string
  revenueSettings: RevenueSettings
  promotionSettings: PromotionSettings
  play2winSettings: Play2winSettings
}

type RevenueSettings = {
  id: string
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

type PromotionSettings = {
  id: string
  defaultDurationDays: number
  maxPromotionsPerDay: number
  bannerPromotion: boolean
  featuredSectionPromotion: boolean
  autoApprovePromotions: boolean
  notifyVendorOnApproval: boolean
  notifyOnNewRequest: boolean
}

type Play2winSettings = {
  id: string
  playFrequency: string
  redemptionWindowDays: number
  couponRedemptionFrequency: string
  drawCycleResetTime: string
  loginRequiredToPlay: boolean
  notifyAdminOnCouponExhaustion: boolean
  showWinnersNotification: boolean
}
