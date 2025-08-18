import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common"
import { IUserQuery } from "../users/interfaces/users-query.interface"
import { UserService } from "../users/user.service"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { SubscriptionService } from "../subscription/subscription.service"
import { ProductsService } from "../products/products.service"
import { ProductStatusEnum } from "../common/types"
import { OrdersService } from "../orders/orders.service"
import { PayoutsService } from "../payouts/payouts.service"
import { WithdrawalsService } from "../withdrawals/withdrawals.service"
import { PdfInterface } from "../services/utils/pdf/interface/pdf.interface"
import { PdfService } from "../services/utils/pdf/pdf.service"
import { Response } from "express"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { BuyerProfile } from "./interface/buyer-profile"
import { UserRoleEnum } from "../users/entity/user.entity"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { PolicyProfilesGuard } from "./guard/policy-profiles.guard"
import { Action } from "../services/casl/actions/action"

@Controller("profiles")
export class ProfilesController {
  constructor(
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
    private readonly productService: ProductsService,
    private readonly orderService: OrdersService,
    private readonly payoutsService: PayoutsService,
    private readonly withdrawalsService: WithdrawalsService,
    private readonly pdfService: PdfService
  ) {}

  @UseGuards(PolicyProfilesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, "PROFILE"))
  @Get("/downloads/vendor")
  async downloadVendorProfilePdf(@Query() query: IUserQuery, @Res() res: Response) {
    const userId = query.userId
    if (!userId) {
      throw new BadReqException("User ID is required")
    }

    const user = await this.userService.findById(userId)
    if (!user) {
      throw new NotFoundException("Vendor not found")
    }

    if (user.role !== UserRoleEnum.Vendor) throw new BadReqException("User is not a vendor")

    const latestSubscription = await this.subscriptionService.findLatestByUserId(user.id)
    const productCounts = user.business?.store?.id
      ? await this.productService.getProductCounts(user.business.store.id, ProductStatusEnum.published)
      : { totalProduct: 0, totalPublishedOrDraftProduct: 0 }

    const orders = user.business?.store?.id
      ? await this.orderService.getStoreRevenueMetrics(user.business.store.id)
      : { totalOrder: 0, totalSales: 0, averageOrderValue: 0 }

    const payouts = user.business?.store?.id ? await this.payoutsService.findOne({ storeId: user.business.store.id }) : null

    const withdrawalStats = payouts?.id
      ? await this.withdrawalsService.getWithdrawalStats(payouts.id)
      : { lastPayout: null, pendingWithdrawalCount: 0 }

    const refinedOrders = user.business?.store?.id ? await this.orderService.getStoreOrders(user.business.store.id) : []

    const pdfData: PdfInterface = {
      profile: {
        storeName: user.business?.store?.name || "N/A",
        email: user.email || "N/A",
        phoneNumber: user.phoneNumber || "N/A",
        kycStatus: user.business?.kycStatus || "unverified",
        subscriptionStatus: latestSubscription?.status || "inactive",
        dateJoined: user.createdAt,
        orders: orders.totalOrder || 0
      },
      business: {
        businessName: user.business?.name || "N/A",
        CacRegNo: user.business?.businessRegNumber || "N/A",
        kycType: user.business?.kycVerificationType || "N/A",
        kycIdentificationNumber: user.business?.identificationNumber || "N/A"
      },
      subscription: {
        status: latestSubscription?.status || "inactive",
        planType: latestSubscription?.planType || "N/A",
        paymentStatus: latestSubscription?.isPaid ? "paid" : "unpaid",
        startDate: latestSubscription?.startDate || null,
        endDate: latestSubscription?.endDate || null
      },
      product: {
        totalProduct: productCounts.totalProduct || 0,
        totalPublishedProduct: productCounts.totalPublishedOrDraftProduct || 0,
        totalOrders: orders.totalOrder || 0,
        totalSales: orders.totalSales || 0,
        averageNumberOfOrder: orders.averageOrderValue || 0
      },
      payout: {
        walletBalance: payouts?.available || 0,
        totalWithdrawal: payouts?.withdrawals?.length || 0,
        pendingWithdrawal: withdrawalStats.pendingWithdrawalCount || 0,
        lastPayout: withdrawalStats.lastPayout || null
      },
      orders: refinedOrders.map((order) => ({
        id: order.id || "N/A",
        status: order.status || "N/A",
        buyerName: order.buyerName || "N/A",
        totalAmount: order.totalAmount || 0,
        dateOrdered: order.dateOrdered || null
      }))
    }

    const pdfBuffer = await this.pdfService.generateVendorPdf(pdfData)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename=vendor_profile_${user.id}.pdf`)
    res.send(pdfBuffer)
  }

  @UseGuards(PolicyProfilesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, "PROFILE"))
  @Get("downloads/buyer")
  async downloadBuyerProfile(@Query() query: IUserQuery, @Res() res: Response) {
    const userId = query.userId

    if (!userId) throw new BadReqException("User ID is required")

    const user = await this.userService.findById(userId)

    if (!user) throw new NotFoundException("User not found")

    if (user.role !== UserRoleEnum.Customer) throw new BadReqException("User is not a customer")

    const [orders, count] = await this.orderService.find({ buyerId: user.id })

    const refinedOrders = orders.flatMap((order) => {
      return order.items.map((item) => ({
        id: order.id,
        vendorName: item.product.store.name,
        dateOrdered: order.paidAt,
        totalAmount: order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
        status: order.deliveryStatus
      }))
    })

    const profile: BuyerProfile = {
      profile: {
        fullName: user.getFullName(),
        email: user.email,
        dateJoined: user.createdAt,
        phoneNumber: user.phoneNumber,
        status: user.status,
        totalOrders: count
      },
      orders: refinedOrders
    }
    const pdfBuffer = await this.pdfService.generateBuyerPdf(profile)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename=vendor_profile_${user.id}.pdf`)
    res.send(pdfBuffer)
  }
}
