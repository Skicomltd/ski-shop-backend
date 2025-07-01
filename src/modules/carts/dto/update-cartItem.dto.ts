import { PartialType } from "@nestjs/mapped-types"
import { CreateCartItemsDto } from "./create-cartItems.dto"

export class UpdateCartItemsDto extends PartialType(CreateCartItemsDto) {}
