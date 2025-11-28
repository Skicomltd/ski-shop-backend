import { Controller } from "@nestjs/common"
import { CommisionsService } from "./commisions.service"
import { EventRegistry } from "@/events/events.registry"
import { OnEvent } from "@nestjs/event-emitter"
import { SettingsService } from "../settings/settings.service"
import { Order } from "../orders/entities/order.entity"
import { OrderItem } from "../orders/entities/order-item.entity"

@Controller("commisions")
export class CommisionsController {
  constructor(
    private readonly commisionsService: CommisionsService,
    private readonly settingsService: SettingsService
  ) {}

  @OnEvent(EventRegistry.ORDER_PLACED_PAID)
  async handleUpdateSkicomCommissionRecord(order: Order) {
    const setting = await this.settingsService.findOneSetting()
    for (const item of order.items) {
      const product = item.product
      const storeId = product.user.business.store.id
      const commission = await this.commisionsService.calculateOrderItemCommission(item)
      await this.commisionsService.create({
        amount: commission,
        value: setting.revenueSetting.fulfillmentFeePercentage,
        storeId,
        orderItemId: item.id
      })
    }
  }

  @OnEvent(EventRegistry.ORDER_PAID_AFTER_DELIVERY)
  async handleUpdateSkicomComissionOnItem(_order: Order, item: OrderItem) {
    const setting = await this.settingsService.findOneSetting()
    const product = item.product
    const storeId = product.user.business.store.id
    const commission = await this.commisionsService.calculateOrderItemCommission(item)
    await this.commisionsService.create({
      amount: commission,
      value: setting.revenueSetting.fulfillmentFeePercentage,
      storeId,
      orderItemId: item.id
    })
  }
}
