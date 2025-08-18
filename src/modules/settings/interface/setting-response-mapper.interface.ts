import { Setting } from "../entities/setting.entity"
import { ISettingResponse } from "./settings-response.interface"

export abstract class SettingResponseMapper implements IInterceptor {
  transform(data: Setting): ISettingResponse {
    return {
      id: data.id,
      accountEmail: data.accountEmail,
      alternativeEmail: data.alternativeEmail,
      emailNewsUpdates: data.emailNewsUpdates,
      emailPayout: data.emailPayout,
      emailProductCreation: data.emailProductCreation,
      emailPurchase: data.emailPurchase,
      play2winSettings: {
        id: data.play2winSetting.id,
        couponRedemptionFrequency: data.play2winSetting.couponRedemptionFrequency,
        drawCycleResetTime: data.play2winSetting.drawCycleResetTime,
        loginRequiredToPlay: data.play2winSetting.loginRequiredToPlay,
        notifyAdminOnCouponExhaustion: data.play2winSetting.notifyAdminOnCouponExhaustion,
        playFrequency: data.play2winSetting.playFrequency,
        redemptionWindowDays: data.play2winSetting.redemptionWindowDays,
        showWinnersNotification: data.play2winSetting.showWinnersNotification
      },
      promotionSettings: {
        id: data.promotionSetting.id,
        autoApprovePromotions: data.promotionSetting.autoApprovePromotions,
        bannerPromotion: data.promotionSetting.bannerPromotion,
        defaultDurationDays: data.promotionSetting.defaultDurationDays,
        featuredSectionPromotion: data.promotionSetting.featuredSectionPromotion,
        maxPromotionsPerDay: data.promotionSetting.maxPromotionsPerDay,
        notifyOnNewRequest: data.promotionSetting.notifyOnNewRequest,
        notifyVendorOnApproval: data.promotionSetting.notifyVendorOnApproval
      },
      revenueSettings: {
        id: data.revenueSetting.id,
        autoExpiryNotification: data.revenueSetting.autoExpiryNotification,
        fulfillmentFeePercentage: data.revenueSetting.fulfillmentFeePercentage,
        gasFee: data.revenueSetting.gasFee,
        gracePeriodAfterExpiry: data.revenueSetting.gracePeriodAfterExpiry,
        maxPayoutAmount: data.revenueSetting.maxPayoutAmount,
        maxWithdrawalsPerDay: data.revenueSetting.maxWithdrawalsPerDay,
        minPayoutAmount: data.revenueSetting.minPayoutAmount,
        monthlySubscriptionFee: data.revenueSetting.monthlySubscriptionFee,
        notifyOnCommissionDeduction: data.revenueSetting.notifyOnCommissionDeduction,
        notifyOnSubscriptionExpiry: data.revenueSetting.notifyOnSubscriptionExpiry,
        notifyUserOnApproval: data.revenueSetting.notifyUserOnApproval,
        yearlySubscriptionFee: data.revenueSetting.yearlySubscriptionFee
      }
    }
  }
}
