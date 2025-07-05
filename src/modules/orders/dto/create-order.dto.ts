export class CreateOrderDto {
  buyerId: string
  items: Array<{
    quantity: number
    unitPrice: number
    productId: string
  }>
}
