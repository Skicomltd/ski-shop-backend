import { PartialType } from "@nestjs/mapped-types"
import { CreateOrderDto } from "./create-order.dto"
import * as joi from "joi"

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export const updateOrderSchema = joi.object({
  status: joi.string().valid("unpaid", "paid", "pending", "delivered").optional(),
  paymentStatus: joi.string().valid("paid", "unpaid").optional(),
  buyerId: joi.string().optional(),
  items: joi
    .array()
    .items(
      joi.object({
        quantity: joi.number().min(1).optional(),
        unitPrice: joi.number().min(0).optional(),
        productId: joi.string().optional(),
        storeId: joi.string().optional()
      })
    )
    .optional()
})
